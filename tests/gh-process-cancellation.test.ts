import assert from "node:assert/strict";
import { type ChildProcessByStdio, spawn } from "node:child_process";
import { EventEmitter, once } from "node:events";
import { chmod, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Readable } from "node:stream";
import { afterEach, describe, it } from "node:test";
import {
	GhExecutionError,
	runGh,
	runGhWithProcessSpawnerForTest,
} from "../src/github/gh-process.ts";
import type { GhRunOptions } from "../src/github/types.ts";

const temporaryDirectories: string[] = [];

async function installFakeGh(source: string): Promise<string> {
	const directory = await mkdtemp(path.join(tmpdir(), "proto-lithify-cancel-"));
	temporaryDirectories.push(directory);
	const executable = path.join(directory, "gh");
	await writeFile(executable, `#!${process.execPath}\n${source}\n`);
	await chmod(executable, 0o755);
	return directory;
}

async function installShellFakeGh(source: string): Promise<string> {
	const directory = await mkdtemp(path.join(tmpdir(), "proto-lithify-cancel-"));
	temporaryDirectories.push(directory);
	const executable = path.join(directory, "gh");
	await writeFile(executable, `#!/bin/sh\n${source}\n`);
	await chmod(executable, 0o755);
	return directory;
}

type TaskOwnedChild = ChildProcessByStdio<null, Readable, Readable>;

class ReadinessGatedChild extends EventEmitter {
	readonly stdout: Readable;
	readonly stderr: Readable;
	readonly #child: TaskOwnedChild;

	constructor(child: TaskOwnedChild, readinessMarker: string) {
		super();
		this.#child = child;
		this.stdout = child.stdout;
		this.stderr = child.stderr;
		let observedOutput = "";
		const observeReadiness = (chunk: Buffer): void => {
			observedOutput += chunk.toString("utf8");
			if (!observedOutput.includes(readinessMarker)) return;
			child.stdout.off("data", observeReadiness);
			this.emit("spawn");
		};
		child.stdout.on("data", observeReadiness);
		child.on("error", (error) => this.emit("error", error));
		child.on("exit", (code, signal) => this.emit("exit", code, signal));
		child.on("close", (code, signal) => this.emit("close", code, signal));
	}

	kill(signal: NodeJS.Signals): boolean {
		return this.#child.kill(signal);
	}

	unref(): this {
		this.#child.unref();
		return this;
	}

	asChildProcess(): TaskOwnedChild {
		return this as unknown as TaskOwnedChild;
	}
}

function runGhWithTaskOwnedChild(
	args: readonly string[],
	options: GhRunOptions,
): { readonly child: TaskOwnedChild; readonly promise: ReturnType<typeof runGh> } {
	let child: TaskOwnedChild | undefined;
	const promise = runGhWithProcessSpawnerForTest(
		args,
		options,
		(command, commandArgs, spawnOptions) => {
			child = spawn(command, commandArgs, {
				env: spawnOptions.env,
				shell: false,
				stdio: ["ignore", "pipe", "pipe"],
			});
			return new ReadinessGatedChild(child, "fixture-ready\n").asChildProcess();
		},
	);
	if (!child) throw new Error("task-owned child was not spawned synchronously");
	return { child, promise };
}

async function stopTaskOwnedChild(child: TaskOwnedChild): Promise<void> {
	if (child.exitCode !== null || child.signalCode !== null) return;
	const exited = once(child, "exit");
	assert.equal(child.kill("SIGKILL"), true, "task-owned child rejected cleanup");
	await exited;
}

async function assertRealTimeoutOutcome(
	error: GhExecutionError,
	child: TaskOwnedChild,
	marker: string,
	confirmedMarker: string,
): Promise<string> {
	assert.doesNotMatch(error.message, /rollback|not applied|cancelled remotely/i);
	switch (error.code) {
		case "GH_TIMEOUT": {
			const contentAtReturn = await readFile(marker, "utf8");
			await new Promise((resolve) => setImmediate(resolve));
			assert.equal(await readFile(marker, "utf8"), contentAtReturn);
			assert.equal(contentAtReturn, confirmedMarker);
			assert.notEqual(child.exitCode ?? child.signalCode, null);
			break;
		}
		case "GH_TERMINATION_UNCONFIRMED":
			assert.match(error.message, /termination was not confirmed/);
			assert.match(error.message, /may still be running/);
			await stopTaskOwnedChild(child);
			break;
		case "GH_STREAM_CLOSURE_UNCONFIRMED":
			assert.match(error.message, /direct child exited/);
			assert.match(error.message, /closure was not confirmed/);
			assert.notEqual(child.exitCode ?? child.signalCode, null);
			break;
		default:
			assert.fail(`unexpected real-process classification: ${error.code}`);
	}
	return error.code;
}

function environment(
	directory: string,
	additions: NodeJS.ProcessEnv = {},
): NodeJS.ProcessEnv {
	return {
		...process.env,
		...additions,
		PATH: `${directory}:${process.env.PATH ?? ""}`,
	};
}

async function executionError(promise: Promise<unknown>): Promise<GhExecutionError> {
	try {
		await promise;
		assert.fail("expected gh execution to fail");
	} catch (error) {
		assert.ok(error instanceof GhExecutionError);
		return error;
	}
}

afterEach(async () => {
	await Promise.all(
		temporaryDirectories
			.splice(0)
			.map((directory) => rm(directory, { recursive: true, force: true })),
	);
});

describe("runGh cancellation with real child processes", () => {
	it("reports truthful graceful-timeout outcomes from a real child", async () => {
		const directory = await installFakeGh(`
			const fs = require("node:fs");
			const idle = setInterval(() => {}, 60_000);
			fs.appendFileSync(process.env.SENTINEL, "ready\\n");
			process.on("exit", () => fs.appendFileSync(process.env.SENTINEL, "exit\\n"));
			process.on("SIGTERM", () => {
				fs.appendFileSync(process.env.SENTINEL, "term\\n");
				clearInterval(idle);
				process.exit(0);
			});
			process.stdout.write("fixture-ready\\n");
		`);
		const sentinel = path.join(directory, "sentinel");
		const invocation = runGhWithTaskOwnedChild([], {
			env: environment(directory, { SENTINEL: sentinel }),
			timeoutMilliseconds: 1_000,
		});
		try {
			const error = await executionError(invocation.promise);
			const classification = await assertRealTimeoutOutcome(
				error,
				invocation.child,
				sentinel,
				"ready\nterm\nexit\n",
			);
			assert.equal(classification, "GH_TIMEOUT");
		} finally {
			await stopTaskOwnedChild(invocation.child);
		}
	});

	it("reports truthful SIGKILL-escalation outcomes from a real child", async () => {
		const directory = await installFakeGh(`
			const fs = require("node:fs");
			fs.writeFileSync(process.env.TERM_MARKER, "ready\\n");
			process.on("SIGTERM", () => {
				fs.appendFileSync(process.env.TERM_MARKER, "received\\n");
			});
			setInterval(() => {}, 60_000);
			process.stdout.write("fixture-ready\\n");
		`);
		const marker = path.join(directory, "term-marker");
		const invocation = runGhWithTaskOwnedChild([], {
			env: environment(directory, { TERM_MARKER: marker }),
			timeoutMilliseconds: 1_000,
		});
		try {
			const error = await executionError(invocation.promise);
			const classification = await assertRealTimeoutOutcome(
				error,
				invocation.child,
				marker,
				"ready\nreceived\n",
			);
			assert.equal(classification, "GH_TIMEOUT");
		} finally {
			await stopTaskOwnedChild(invocation.child);
		}
	});

	it("aggregates interleaved stdout and stderr for output cancellation", async () => {
		const directory = await installFakeGh(`
			process.on("SIGTERM", () => process.exit(0));
			process.stdout.write("123");
			process.stderr.write("abc");
			setInterval(() => process.stdout.write("x".repeat(1024)), 1);
		`);
		const error = await executionError(
			runGh([], {
				env: environment(directory),
				maximumOutputBytes: 4,
				terminationGraceMilliseconds: 100,
			}),
		);
		assert.equal(error.code, "GH_OUTPUT_LIMIT");
		assert.match(error.message, /4 bytes/);
		assert.ok(error.message.length <= 4_096);
	});

	it("classifies a genuine pre-spawn failure", async () => {
		const directory = await mkdtemp(path.join(tmpdir(), "proto-lithify-empty-path-"));
		temporaryDirectories.push(directory);
		const error = await executionError(runGh([], { env: { PATH: directory } }));
		assert.equal(error.code, "GH_START_FAILED");
		assert.doesNotMatch(error.message, /terminated|rollback/i);
	});

	it("bounds a real inherited-pipe wait after direct-child exit", async () => {
		const directory = await installFakeGh(`
			const { spawn } = require("node:child_process");
			spawn(process.execPath, ["-e", "setTimeout(() => {}, 1000)"], {
				stdio: ["ignore", process.stdout, process.stderr],
			});
			process.exit(0);
		`);
		const error = await executionError(
			runGh([], {
				env: environment(directory),
				streamClosureMilliseconds: 20,
			}),
		);
		assert.equal(error.code, "GH_STREAM_CLOSURE_UNCONFIRMED");
		assert.match(error.message, /direct child exited/);
	});

	it("redacts and bounds cancellation diagnostics", async () => {
		const directory = await installShellFakeGh(`
			printf "Authorization: Bearer ghp_abcdefghijklmnopqrstuvwxyz123456 secret\\n" >&2
			trap 'exit 0' TERM
			while :; do :; done
		`);
		const error = await executionError(
			runGh([], {
				env: environment(directory),
				timeoutMilliseconds: 1_000,
				terminationGraceMilliseconds: 100,
			}),
		);
		assert.equal(error.code, "GH_TIMEOUT");
		assert.doesNotMatch(error.message, /ghp_|Bearer ghp_/);
		assert.match(error.message, /\[REDACTED\]/);
		assert.ok(error.message.length <= 4_096);
	});

	it("does not retry or claim rollback after a synthetic remote effect", async () => {
		const directory = await installShellFakeGh(`
			printf "mutation\\n" >> "$MUTATIONS"
			trap 'exit 0' TERM
			while :; do :; done
		`);
		const mutations = path.join(directory, "mutations");
		const error = await executionError(
			runGh(["api", "mutation"], {
				env: environment(directory, { MUTATIONS: mutations }),
				timeoutMilliseconds: 1_000,
			}),
		);
		assert.equal(error.code, "GH_TIMEOUT");
		assert.equal(await readFile(mutations, "utf8"), "mutation\n");
		assert.doesNotMatch(error.message, /rollback|not applied|cancelled remotely/i);
		assert.ok((await stat(mutations)).isFile());
	});
});
