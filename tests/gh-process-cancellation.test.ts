import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { GhExecutionError, runGh } from "../src/github/gh-process.ts";

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
	it("reports a graceful timeout only after exit and close", async () => {
		const directory = await installShellFakeGh(`
			trap 'printf "exit\\n" >> "$SENTINEL"' EXIT
			trap 'printf "term\\n" >> "$SENTINEL"; exit 0' TERM
			printf "ready\\n" >> "$SENTINEL"
			while :; do :; done
		`);
		const sentinel = path.join(directory, "sentinel");
		const error = await executionError(
			runGh([], {
				env: environment(directory, { SENTINEL: sentinel }),
				timeoutMilliseconds: 1_000,
				terminationGraceMilliseconds: 200,
			}),
		);
		assert.equal(error.code, "GH_TIMEOUT");
		const contentAtReturn = await readFile(sentinel, "utf8");
		await new Promise((resolve) => setTimeout(resolve, 40));
		assert.equal(await readFile(sentinel, "utf8"), contentAtReturn);
		assert.match(contentAtReturn, /ready\nterm\nexit\n/);
	});

	it("escalates a non-terminating SIGTERM handler to SIGKILL", async () => {
		const directory = await installShellFakeGh(`
			trap 'printf received > "$TERM_MARKER"' TERM
			while :; do :; done
		`);
		const marker = path.join(directory, "term-marker");
		const error = await executionError(
			runGh([], {
				env: environment(directory, { TERM_MARKER: marker }),
				timeoutMilliseconds: 1_000,
				terminationGraceMilliseconds: 30,
				killConfirmationMilliseconds: 200,
			}),
		);
		assert.equal(error.code, "GH_TIMEOUT");
		assert.equal(await readFile(marker, "utf8"), "received");
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
