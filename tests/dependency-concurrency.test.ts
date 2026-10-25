import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { GhExecutor } from "../src/github/types.ts";
import { IssueDependencyOperations } from "../src/issue-relations/issue-dependency-operations.ts";

const repository = "example/repository";
const blocker = {
	id: 1001,
	number: 41,
	url: "https://api.github.com/repos/example/repository/issues/41",
	repository_url: "https://api.github.com/repos/example/repository",
	html_url: "https://github.com/example/repository/issues/41",
};
const request = { repository, issueNumber: 42, blockerNumber: 41 };

class Barrier {
	readonly #participants: number;
	#arrived = 0;
	#release: (() => void) | undefined;
	readonly #promise: Promise<void>;

	constructor(participants: number) {
		this.#participants = participants;
		this.#promise = new Promise((resolve) => {
			this.#release = resolve;
		});
	}

	async arrive(): Promise<void> {
		this.#arrived += 1;
		if (this.#arrived === this.#participants) this.#release?.();
		await this.#promise;
	}
}

class DependencyProvider {
	relationExists = false;
	postCalls = 0;
	listCalls = 0;
	initialBarrier: Barrier | undefined;
	removeBeforePostcondition = false;
	failPostconditionRead = false;

	readonly execute: GhExecutor = async (args) => {
		if (args[1] === `repos/${repository}/issues/41`) {
			return { stdout: JSON.stringify(blocker), stderr: "" };
		}
		if (args.includes("POST")) {
			this.postCalls += 1;
			this.relationExists = true;
			return { stdout: "", stderr: "" };
		}
		if (args[1]?.includes("dependencies/blocked_by")) {
			this.listCalls += 1;
			if (this.listCalls <= 2 && this.initialBarrier !== undefined) {
				await this.initialBarrier.arrive();
			}
			if (this.postCalls > 0 && this.failPostconditionRead) {
				throw new Error("fresh dependency observation unavailable");
			}
			if (this.postCalls > 0 && this.removeBeforePostcondition) {
				this.relationExists = false;
			}
			return {
				stdout: JSON.stringify(this.relationExists ? [blocker] : []),
				stderr: "",
			};
		}
		assert.fail(`unexpected gh call: ${args.join(" ")}`);
	};
}

describe("Dependency concurrency proof boundaries", () => {
	it("C12 permits concurrent exact additions without exclusive causality", async () => {
		const provider = new DependencyProvider();
		provider.initialBarrier = new Barrier(2);
		const first = new IssueDependencyOperations(provider.execute);
		const second = new IssueDependencyOperations(provider.execute);

		const [a, b] = await Promise.all([
			first.addBlocker(request),
			second.addBlocker(request),
		]);

		assert.equal(a.outcome, "applied");
		assert.equal(b.outcome, "applied");
		assert.equal(provider.postCalls, 2);
		for (const receipt of [a, b]) {
			assert.deepEqual(receipt.after?.blockedByIssues, [
				{ id: 1001, repository, number: 41 },
			]);
			assert.doesNotMatch(receipt.postcondition.description, /exclusive|caused/i);
		}
	});

	it("C13 rejects removal before postcondition inspection without a second POST", async () => {
		const provider = new DependencyProvider();
		provider.removeBeforePostcondition = true;
		const operation = new IssueDependencyOperations(provider.execute);

		await assert.rejects(operation.addBlocker(request), /postcondition failed/i);

		assert.equal(provider.postCalls, 1);
		assert.equal(provider.relationExists, false);
	});

	it("C14 preserves a truthful receipt after a later removal", async () => {
		const provider = new DependencyProvider();
		const operation = new IssueDependencyOperations(provider.execute);

		const receipt = await operation.addBlocker(request);
		provider.relationExists = false;

		assert.equal(receipt.outcome, "applied");
		assert.equal(receipt.after?.blockedByIssues[0]?.id, 1001);
		assert.equal(provider.relationExists, false);
		assert.doesNotMatch(receipt.postcondition.description, /permanent/i);
	});

	it("C15 rejects a failed post-mutation read without retrying the POST", async () => {
		const provider = new DependencyProvider();
		provider.failPostconditionRead = true;
		const operation = new IssueDependencyOperations(provider.execute);

		await assert.rejects(
			operation.addBlocker(request),
			/submitted.*do not retry automatically/i,
		);

		assert.equal(provider.postCalls, 1);
		assert.equal(provider.relationExists, true);
	});
});
