import assert from "node:assert/strict";
import type { ChildProcessByStdio } from "node:child_process";
import { EventEmitter } from "node:events";
import type { Readable } from "node:stream";
import { PassThrough } from "node:stream";
import { describe, it } from "node:test";
import {
	GhExecutionError,
	type runGh,
	runGhWithProcessSpawnerForTest,
} from "../src/github/gh-process.ts";

class FakeChild extends EventEmitter {
	readonly stdout = new PassThrough();
	readonly stderr = new PassThrough();
	readonly signals: NodeJS.Signals[] = [];
	unrefCalls = 0;
	killBehavior: (signal: NodeJS.Signals) => boolean = () => true;

	kill(signal: NodeJS.Signals): boolean {
		this.signals.push(signal);
		return this.killBehavior(signal);
	}

	unref(): this {
		this.unrefCalls += 1;
		return this;
	}

	asChildProcess(): ChildProcessByStdio<null, Readable, Readable> {
		return this as unknown as ChildProcessByStdio<null, Readable, Readable>;
	}
}

function injectedRun(child: FakeChild, options: Parameters<typeof runGh>[1] = {}) {
	const promise = runGhWithProcessSpawnerForTest([], options, () =>
		child.asChildProcess(),
	);
	queueMicrotask(() => child.emit("spawn"));
	return promise;
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

function closeAfterSignal(child: FakeChild): void {
	queueMicrotask(() => {
		child.emit("exit", 0, null);
		child.emit("close", 0, null);
	});
}

describe("runGh injected process-control races", () => {
	it("keeps a timeout first despite later overflow and duplicate late events", async () => {
		const child = new FakeChild();
		child.killBehavior = () => {
			child.stdout.write(Buffer.alloc(100));
			closeAfterSignal(child);
			return true;
		};
		const error = await executionError(
			injectedRun(child, {
				timeoutMilliseconds: 0,
				maximumOutputBytes: 1,
				terminationGraceMilliseconds: 20,
				killConfirmationMilliseconds: 20,
			}),
		);
		child.emit("exit", 0, null);
		child.emit("close", 0, null);
		child.emit("error", new Error("late error"));
		await new Promise((resolve) => setTimeout(resolve, 50));
		assert.equal(error.code, "GH_TIMEOUT");
		assert.deepEqual(child.signals, ["SIGTERM"]);
		assert.equal(child.unrefCalls, 0);
	});

	it("keeps aggregate output overflow first despite a pending timeout", async () => {
		const child = new FakeChild();
		child.killBehavior = () => {
			closeAfterSignal(child);
			return true;
		};
		const promise = injectedRun(child, {
			timeoutMilliseconds: 30,
			maximumOutputBytes: 5,
			terminationGraceMilliseconds: 20,
		});
		queueMicrotask(() => {
			child.stdout.write("123");
			child.stderr.write("abc");
		});
		const error = await executionError(promise);
		await new Promise((resolve) => setTimeout(resolve, 50));
		assert.equal(error.code, "GH_OUTPUT_LIMIT");
		assert.deepEqual(child.signals, ["SIGTERM"]);
		assert.equal(child.unrefCalls, 0);
	});

	it("confirms graceful SIGTERM only after exit and close", async () => {
		const child = new FakeChild();
		let settlements = 0;
		let settlementsBeforeExit = -1;
		let settlementsBeforeClose = -1;
		const events: string[] = [];
		child.killBehavior = (signal) => {
			events.push(signal);
			queueMicrotask(() => {
				settlementsBeforeExit = settlements;
				events.push("exit");
				child.emit("exit", 0, null);
				queueMicrotask(() => {
					settlementsBeforeClose = settlements;
					events.push("close");
					child.emit("close", 0, null);
				});
			});
			return true;
		};
		const observed = injectedRun(child, {
			timeoutMilliseconds: 0,
			terminationGraceMilliseconds: 0,
		}).then(
			(result) => {
				settlements += 1;
				return result;
			},
			(error: unknown) => {
				settlements += 1;
				throw error;
			},
		);
		const error = await executionError(observed);
		await new Promise((resolve) => setImmediate(resolve));
		assert.equal(error.code, "GH_TIMEOUT");
		assert.deepEqual(events, ["SIGTERM", "exit", "close"]);
		assert.deepEqual(child.signals, ["SIGTERM"]);
		assert.equal(settlementsBeforeExit, 0);
		assert.equal(settlementsBeforeClose, 0);
		assert.equal(settlements, 1);
		assert.equal(child.unrefCalls, 0);
	});

	it("confirms SIGKILL escalation only after injected exit and close", async () => {
		const child = new FakeChild();
		let settlements = 0;
		let settlementsBeforeExit = -1;
		let settlementsBeforeClose = -1;
		const events: string[] = [];
		child.killBehavior = (signal) => {
			events.push(signal);
			if (signal === "SIGKILL") {
				queueMicrotask(() => {
					settlementsBeforeExit = settlements;
					events.push("exit");
					child.emit("exit", null, "SIGKILL");
					queueMicrotask(() => {
						settlementsBeforeClose = settlements;
						events.push("close");
						child.emit("close", null, "SIGKILL");
					});
				});
			}
			return true;
		};
		const observed = injectedRun(child, {
			timeoutMilliseconds: 0,
			terminationGraceMilliseconds: 0,
			killConfirmationMilliseconds: 20,
		}).then(
			(result) => {
				settlements += 1;
				return result;
			},
			(error: unknown) => {
				settlements += 1;
				throw error;
			},
		);
		const error = await executionError(observed);
		await new Promise((resolve) => setImmediate(resolve));
		assert.equal(error.code, "GH_TIMEOUT");
		assert.deepEqual(events, ["SIGTERM", "SIGKILL", "exit", "close"]);
		assert.deepEqual(child.signals, ["SIGTERM", "SIGKILL"]);
		assert.equal(settlementsBeforeExit, 0);
		assert.equal(settlementsBeforeClose, 0);
		assert.equal(settlements, 1);
		assert.equal(child.unrefCalls, 0);
	});

	it("bounds signal failures and unreferences only an unconfirmed child", async () => {
		const child = new FakeChild();
		const secret = "ghp_abcdefghijklmnopqrstuvwxyz123456";
		let settlements = 0;
		child.killBehavior = () => {
			throw new Error(`signal denied ${secret} ${"x".repeat(10_000)}`);
		};
		const observed = injectedRun(child, {
			timeoutMilliseconds: 0,
			terminationGraceMilliseconds: 5,
			killConfirmationMilliseconds: 5,
		}).then(
			(result) => {
				settlements += 1;
				return result;
			},
			(error: unknown) => {
				settlements += 1;
				throw error;
			},
		);
		const error = await executionError(observed);
		assert.equal(error.code, "GH_TERMINATION_UNCONFIRMED");
		assert.match(error.message, /may still be running/);
		assert.doesNotMatch(error.message, /ghp_/);
		assert.ok(error.message.length <= 4_096);
		assert.deepEqual(child.signals, ["SIGTERM", "SIGKILL"]);
		assert.equal(child.unrefCalls, 1);
		assert.equal(child.stdout.destroyed, true);
		assert.equal(child.stderr.destroyed, true);
		assert.equal(settlements, 1);
		child.emit("exit", null, "SIGKILL");
		child.emit("close", null, "SIGKILL");
		child.emit("error", new Error("late harmless error"));
		await new Promise((resolve) => setImmediate(resolve));
		assert.equal(settlements, 1);
	});

	it("does not signal or unref after exit when stream closure is unconfirmed", async () => {
		const child = new FakeChild();
		child.killBehavior = () => {
			queueMicrotask(() => child.emit("exit", 0, null));
			return true;
		};
		const error = await executionError(
			injectedRun(child, {
				timeoutMilliseconds: 0,
				terminationGraceMilliseconds: 50,
				streamClosureMilliseconds: 5,
			}),
		);
		assert.equal(error.code, "GH_STREAM_CLOSURE_UNCONFIRMED");
		assert.deepEqual(child.signals, ["SIGTERM"]);
		assert.equal(child.unrefCalls, 0);
		assert.equal(child.stdout.destroyed, true);
		child.emit("close", 0, null);
	});
});
