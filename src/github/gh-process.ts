import { type ChildProcessByStdio, spawn } from "node:child_process";
import type { Readable } from "node:stream";
import type { GhResult, GhRunOptions } from "./types.ts";

const DEFAULT_TIMEOUT_MILLISECONDS = 30_000;
const DEFAULT_MAXIMUM_OUTPUT_BYTES = 4 * 1024 * 1024;
const DEFAULT_TERMINATION_GRACE_MILLISECONDS = 1_000;
const DEFAULT_KILL_CONFIRMATION_MILLISECONDS = 1_000;
const DEFAULT_STREAM_CLOSURE_MILLISECONDS = 1_000;
const MAXIMUM_DIAGNOSTIC_CHARACTERS = 4_096;

type ProcessState =
	| "STARTING"
	| "RUNNING"
	| "CANCELLING"
	| "ESCALATING"
	| "DIRECT_CHILD_EXITED"
	| "CLOSED"
	| "SPAWN_FAILED"
	| "TERMINATION_UNCONFIRMED"
	| "STREAM_CLOSURE_UNCONFIRMED"
	| "SETTLED";

type CancellationCode = "GH_TIMEOUT" | "GH_OUTPUT_LIMIT";

type GhChildProcess = ChildProcessByStdio<null, Readable, Readable>;

type GhProcessSpawnerForTest = (
	command: string,
	args: string[],
	options: {
		readonly env: NodeJS.ProcessEnv;
		readonly shell: false;
		readonly stdio: readonly ["ignore", "pipe", "pipe"];
	},
) => GhChildProcess;

export class GhExecutionError extends Error {
	readonly code: string;
	readonly exitCode: number | null;

	constructor(code: string, message: string, exitCode: number | null = null) {
		super(message);
		this.name = "GhExecutionError";
		this.code = code;
		this.exitCode = exitCode;
	}
}

export function sanitizeDiagnostic(value: string): string {
	return value
		.replace(/Authorization\s*:\s*[^\r\n]+/gi, "Authorization: [REDACTED]")
		.replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
		.replace(/\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{16,}\b/g, "[REDACTED]")
		.replace(/(https?:\/\/)[^/@\s]+:[^/@\s]+@/gi, "$1[REDACTED]@");
}

export async function runGh(
	args: readonly string[],
	options: GhRunOptions = {},
): Promise<GhResult> {
	return await runGhWithSpawner(args, options);
}

/** Narrow process boundary for deterministic cancellation tests only. */
export async function runGhWithProcessSpawnerForTest(
	args: readonly string[],
	options: GhRunOptions,
	processSpawner: GhProcessSpawnerForTest,
): Promise<GhResult> {
	return await runGhWithSpawner(args, options, processSpawner);
}

async function runGhWithSpawner(
	args: readonly string[],
	options: GhRunOptions,
	processSpawner?: GhProcessSpawnerForTest,
): Promise<GhResult> {
	const timeoutMilliseconds = duration(
		"timeoutMilliseconds",
		options.timeoutMilliseconds ?? DEFAULT_TIMEOUT_MILLISECONDS,
	);
	const maximumOutputBytes = duration(
		"maximumOutputBytes",
		options.maximumOutputBytes ?? DEFAULT_MAXIMUM_OUTPUT_BYTES,
	);
	const terminationGraceMilliseconds = duration(
		"terminationGraceMilliseconds",
		options.terminationGraceMilliseconds ?? DEFAULT_TERMINATION_GRACE_MILLISECONDS,
	);
	const killConfirmationMilliseconds = duration(
		"killConfirmationMilliseconds",
		options.killConfirmationMilliseconds ?? DEFAULT_KILL_CONFIRMATION_MILLISECONDS,
	);
	const streamClosureMilliseconds = duration(
		"streamClosureMilliseconds",
		options.streamClosureMilliseconds ?? DEFAULT_STREAM_CLOSURE_MILLISECONDS,
	);

	return await new Promise<GhResult>((resolve, reject) => {
		let state: ProcessState = "STARTING";
		let child: GhChildProcess;
		try {
			child = processSpawner
				? processSpawner("gh", [...args], {
						env: options.env ?? process.env,
						shell: false,
						stdio: ["ignore", "pipe", "pipe"],
					})
				: spawn("gh", [...args], {
						env: options.env ?? process.env,
						shell: false,
						stdio: ["ignore", "pipe", "pipe"],
					});
		} catch (cause) {
			state = "SPAWN_FAILED";
			reject(startFailure(cause));
			state = "SETTLED";
			return;
		}

		const stdoutChunks: Buffer[] = [];
		const stderrChunks: Buffer[] = [];
		let outputBytes = 0;
		let accumulatingOutput = true;
		let spawned = false;
		let directChildExited = false;
		let cancellationCode: CancellationCode | undefined;
		let signalFailure: string | undefined;
		let commandTimer: NodeJS.Timeout | undefined;
		let graceTimer: NodeJS.Timeout | undefined;
		let killConfirmationTimer: NodeJS.Timeout | undefined;
		let streamClosureTimer: NodeJS.Timeout | undefined;

		const clearOwnedTimers = (): void => {
			for (const timer of [
				commandTimer,
				graceTimer,
				killConfirmationTimer,
				streamClosureTimer,
			]) {
				if (timer) clearTimeout(timer);
			}
			commandTimer = undefined;
			graceTimer = undefined;
			killConfirmationTimer = undefined;
			streamClosureTimer = undefined;
		};

		const settle = (
			result: GhResult | GhExecutionError,
			cleanup: "none" | "destroy-streams" | "unconfirmed-child" = "none",
		): void => {
			if (state === "SETTLED") return;
			clearOwnedTimers();
			if (cleanup !== "none") {
				child.stdout.destroy();
				child.stderr.destroy();
			}
			if (cleanup === "unconfirmed-child") child.unref();
			state = "SETTLED";
			if (result instanceof GhExecutionError) reject(result);
			else resolve(result);
		};

		const cancellationError = (): GhExecutionError => {
			const diagnostic = Buffer.concat(stderrChunks).toString("utf8").trim();
			const suffix = diagnostic ? `: ${diagnostic}` : "";
			if (cancellationCode === "GH_OUTPUT_LIMIT") {
				return new GhExecutionError(
					cancellationCode,
					boundedDiagnostic(`gh output exceeded ${maximumOutputBytes} bytes${suffix}`),
				);
			}
			return new GhExecutionError(
				"GH_TIMEOUT",
				boundedDiagnostic(`gh exceeded the ${timeoutMilliseconds} ms timeout${suffix}`),
			);
		};

		const beginStreamClosureDeadline = (): void => {
			if (streamClosureTimer || state === "SETTLED") return;
			streamClosureTimer = setTimeout(() => {
				state = "STREAM_CLOSURE_UNCONFIRMED";
				settle(
					new GhExecutionError(
						"GH_STREAM_CLOSURE_UNCONFIRMED",
						"gh direct child exited, but normal stdout/stderr closure was not confirmed",
					),
					"destroy-streams",
				);
			}, streamClosureMilliseconds);
		};

		const requestSignal = (signal: "SIGTERM" | "SIGKILL"): void => {
			if (directChildExited || state === "SETTLED") return;
			try {
				if (!child.kill(signal)) signalFailure = `${signal} delivery was not accepted`;
			} catch (cause) {
				signalFailure = boundedDiagnostic(
					cause instanceof Error ? cause.message : String(cause),
				);
			}
		};

		const beginCancellation = (code: CancellationCode): void => {
			if (cancellationCode || state === "SETTLED") return;
			cancellationCode = code;
			accumulatingOutput = false;
			if (commandTimer) clearTimeout(commandTimer);
			commandTimer = undefined;
			state = "CANCELLING";
			if (directChildExited) {
				beginStreamClosureDeadline();
				return;
			}
			requestSignal("SIGTERM");
			graceTimer = setTimeout(() => {
				if (directChildExited || state === "SETTLED") return;
				state = "ESCALATING";
				requestSignal("SIGKILL");
				killConfirmationTimer = setTimeout(() => {
					if (directChildExited || state === "SETTLED") return;
					state = "TERMINATION_UNCONFIRMED";
					const detail = signalFailure
						? `; process-control failure: ${signalFailure}`
						: "";
					settle(
						new GhExecutionError(
							"GH_TERMINATION_UNCONFIRMED",
							boundedDiagnostic(
								`gh direct child termination was not confirmed; the local child may still be running${detail}`,
							),
						),
						"unconfirmed-child",
					);
				}, killConfirmationMilliseconds);
			}, terminationGraceMilliseconds);
		};

		const capture = (target: Buffer[], chunk: Buffer): void => {
			if (!accumulatingOutput) return;
			outputBytes += chunk.length;
			if (outputBytes > maximumOutputBytes) {
				beginCancellation("GH_OUTPUT_LIMIT");
				return;
			}
			target.push(chunk);
		};

		child.stdout.on("data", (chunk: Buffer) => capture(stdoutChunks, chunk));
		child.stderr.on("data", (chunk: Buffer) => capture(stderrChunks, chunk));
		child.on("spawn", () => {
			if (state === "SETTLED") return;
			spawned = true;
			state = "RUNNING";
			commandTimer = setTimeout(
				() => beginCancellation("GH_TIMEOUT"),
				timeoutMilliseconds,
			);
		});
		child.on("error", (cause: Error) => {
			if (state === "SETTLED") return;
			if (!spawned) {
				state = "SPAWN_FAILED";
				settle(startFailure(cause));
				return;
			}
			signalFailure ??= boundedDiagnostic(cause.message);
		});
		child.on("exit", () => {
			if (state === "SETTLED") return;
			directChildExited = true;
			if (graceTimer) clearTimeout(graceTimer);
			if (killConfirmationTimer) clearTimeout(killConfirmationTimer);
			graceTimer = undefined;
			killConfirmationTimer = undefined;
			state = "DIRECT_CHILD_EXITED";
			beginStreamClosureDeadline();
		});
		child.on("close", (code: number | null) => {
			if (state === "SETTLED") return;
			directChildExited = true;
			state = "CLOSED";
			if (cancellationCode) {
				settle(cancellationError());
				return;
			}
			const stdout = Buffer.concat(stdoutChunks).toString("utf8");
			const stderr = Buffer.concat(stderrChunks).toString("utf8");
			if (code !== 0) {
				settle(
					new GhExecutionError(
						"GH_COMMAND_FAILED",
						boundedDiagnostic(stderr.trim() || `gh exited with status ${code}`),
						code,
					),
				);
				return;
			}
			settle({ stdout, stderr: sanitizeDiagnostic(stderr) });
		});
	});
}

function duration(name: string, value: number): number {
	if (!Number.isFinite(value) || !Number.isSafeInteger(value) || value < 0) {
		throw new RangeError(`${name} must be a finite, non-negative safe integer`);
	}
	return value;
}

function boundedDiagnostic(value: string): string {
	return sanitizeDiagnostic(value).slice(0, MAXIMUM_DIAGNOSTIC_CHARACTERS);
}

function startFailure(cause: unknown): GhExecutionError {
	const message = cause instanceof Error ? cause.message : String(cause);
	return new GhExecutionError(
		"GH_START_FAILED",
		boundedDiagnostic(`Unable to start gh: ${message}`),
	);
}
