import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { z } from "zod";
import type { GhExecutor } from "../src/github/types.ts";
import { IssueDependencyOperations } from "../src/issue-relations/issue-dependency-operations.ts";
import {
	CommandReceiptSchema,
	DependencySnapshotSchema,
} from "../src/receipts/schemas.ts";

class QueuedExecutor {
	readonly calls: string[][] = [];
	readonly #responses: string[];

	constructor(responses: readonly unknown[]) {
		this.#responses = responses.map((response) =>
			typeof response === "string" ? response : JSON.stringify(response),
		);
	}

	readonly execute: GhExecutor = async (args) => {
		this.calls.push([...args]);
		const stdout = this.#responses.shift();
		assert.notStrictEqual(stdout, undefined, "unexpected gh call");
		return { stdout: stdout ?? "", stderr: "" };
	};
}

const request = {
	repository: "example/repository",
	issueNumber: 42,
	blockerNumber: 41,
};

function issue(
	repository: string,
	number: number,
	id: number,
	overrides: Readonly<Record<string, unknown>> = {},
): Readonly<Record<string, unknown>> {
	return {
		id,
		number,
		url: `https://api.github.com/repos/${repository}/issues/${number}`,
		repository_url: `https://api.github.com/repos/${repository}`,
		html_url: `https://github.com/${repository}/issues/${number}`,
		...overrides,
	};
}

function setup(responses: readonly unknown[]) {
	const executor = new QueuedExecutor(responses);
	return {
		executor,
		operations: new IssueDependencyOperations(executor.execute),
	};
}

async function inspect(
	operations: IssueDependencyOperations,
	repository = request.repository,
	issueNumber = request.issueNumber,
) {
	return await (
		operations as unknown as {
			inspect(
				repository: string,
				issueNumber: number,
			): Promise<{
				readonly blockedBy: readonly number[];
				readonly blockedByIssues: readonly {
					readonly id: number;
					readonly repository: string;
					readonly number: number;
				}[];
			}>;
		}
	).inspect(repository, issueNumber);
}

function postCount(executor: QueuedExecutor): number {
	return executor.calls.filter((call) => call.includes("POST")).length;
}

describe("IssueDependencyOperations", () => {
	it("T01 returns noop only for the exact existing blocker identity", async () => {
		const blocker = issue("example/repository", 41, 1001);
		const { executor, operations } = setup([blocker, [blocker]]);

		const receipt = await operations.addBlocker(request);

		assert.equal(receipt.outcome, "noop");
		assert.equal(receipt.postcondition.verified, true);
		assert.equal(postCount(executor), 0);
		assert.deepEqual(receipt.before, {
			blockedBy: [41],
			blockedByIssues: [{ id: 1001, repository: "example/repository", number: 41 }],
		});
	});

	it("T02 does not confuse a foreign blocker with the requested local Issue", async () => {
		const local = issue("example/repository", 41, 1001);
		const foreign = issue("example/other", 41, 2001);
		const { executor, operations } = setup([local, [foreign], "", [foreign, local]]);

		const receipt = await operations.addBlocker(request);

		assert.equal(receipt.outcome, "applied");
		assert.equal(postCount(executor), 1);
		assert.ok(executor.calls[2]?.includes("issue_id=1001"));
		assert.deepEqual(receipt.after, {
			blockedBy: [41],
			blockedByIssues: [
				{ id: 2001, repository: "example/other", number: 41 },
				{ id: 1001, repository: "example/repository", number: 41 },
			],
		});
	});

	it("T03 preserves same-number blockers as distinct sorted identities", async () => {
		const { operations } = setup([
			[issue("zeta/repository", 41, 3001), issue("alpha/repository", 41, 2001)],
		]);

		assert.deepEqual(await inspect(operations), {
			blockedBy: [41],
			blockedByIssues: [
				{ id: 2001, repository: "alpha/repository", number: 41 },
				{ id: 3001, repository: "zeta/repository", number: 41 },
			],
		});
	});

	it("T04 rejects a wrong global ID after one mutation", async () => {
		const local = issue("example/repository", 41, 1001);
		const wrongId = issue("example/repository", 41, 1002);
		const { executor, operations } = setup([local, [], "", [wrongId]]);

		await assert.rejects(operations.addBlocker(request), /postcondition failed/i);
		assert.equal(postCount(executor), 1);
	});

	it("T05 rejects a foreign repository after one mutation", async () => {
		const local = issue("example/repository", 41, 1001);
		const foreign = issue("example/other", 41, 2001);
		const { executor, operations } = setup([local, [], "", [foreign]]);

		await assert.rejects(operations.addBlocker(request), /postcondition failed/i);
		assert.equal(postCount(executor), 1);
	});

	it("preserves submitted-mutation ambiguity when fresh inspection fails", async () => {
		const blocker = issue("example/repository", 41, 1001);
		const invalidAfterValues = [
			"{not-json",
			[issue("example/repository", 41, 1001, { url: "https://evil.example" })],
			Array.from({ length: 51 }, (_, index) =>
				issue(`example/repository-${index}`, index + 1, 2001 + index),
			),
		];
		for (const invalidAfter of invalidAfterValues) {
			const { executor, operations } = setup([blocker, [], "", invalidAfter]);
			await assert.rejects(
				operations.addBlocker(request),
				(error: unknown) =>
					error instanceof Error &&
					/submitted.*do not retry/i.test(error.message) &&
					error.cause instanceof Error,
			);
			assert.equal(postCount(executor), 1);
		}
	});

	it("T06 rejects contradictory REST URL identities", async () => {
		const contradictions = [
			issue("example/repository", 41, 1001, {
				url: "https://api.github.com/repos/example/other/issues/41",
			}),
			issue("example/repository", 41, 1001, {
				url: "https://api.github.com/repos/example/repository/issues/40",
			}),
			issue("example/repository", 41, 1001, {
				html_url: "https://github.com/example/other/issues/41",
			}),
		];
		for (const contradiction of contradictions) {
			const { operations } = setup([[contradiction]]);
			await assert.rejects(inspect(operations));
		}
	});

	it("T07 rejects invalid numeric identities", async () => {
		const invalidValues = [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1];
		for (const value of invalidValues) {
			for (const field of ["id", "number"] as const) {
				const invalid = issue("example/repository", 41, 1001, { [field]: value });
				const { operations } = setup([[invalid]]);
				await assert.rejects(inspect(operations));
			}
		}
	});

	it("T08 rejects duplicate and contradictory blocker entries", async () => {
		const duplicateId = [
			issue("example/repository", 41, 1001),
			issue("example/repository", 41, 1001),
		];
		const sameIdentityDifferentIds = [
			issue("example/repository", 41, 1001),
			issue("example/repository", 41, 1002),
		];
		const sameIdDifferentIdentities = [
			issue("example/repository", 41, 1001),
			issue("example/other", 42, 1001),
		];
		for (const entries of [
			duplicateId,
			sameIdentityDifferentIds,
			sameIdDifferentIdentities,
		]) {
			const { operations } = setup([entries]);
			await assert.rejects(inspect(operations));
		}
	});

	it("T09 returns both public fields for an empty collection", async () => {
		const { operations } = setup([[]]);
		assert.deepEqual(await inspect(operations), {
			blockedBy: [],
			blockedByIssues: [],
		});
	});

	it("T10 accepts exactly 50 complete identities with deterministic order", async () => {
		const entries = Array.from({ length: 50 }, (_, index) =>
			issue(`example/repository-${49 - index}`, 50 - index, 1050 - index),
		);
		const { operations } = setup([entries]);
		const snapshot = await inspect(operations);
		assert.equal(snapshot.blockedByIssues.length, 50);
		assert.equal(snapshot.blockedBy.length, 50);
		assert.deepEqual(
			snapshot.blockedBy,
			Array.from({ length: 50 }, (_, index) => index + 1),
		);
		assert.equal(snapshot.blockedByIssues[0]?.repository, "example/repository-0");
	});

	it("T11 rejects 51 blockers without speculative paging", async () => {
		const entries = Array.from({ length: 51 }, (_, index) =>
			issue(`example/repository-${index}`, index + 1, 1001 + index),
		);
		const { executor, operations } = setup([entries]);
		await assert.rejects(inspect(operations), /50/);
		assert.equal(executor.calls.length, 1);
	});

	it("T12 rejects malformed dependency API responses", async () => {
		const malformedResponses: readonly unknown[] = [
			{},
			"{not-json",
			[{ id: 1001, number: 41 }],
			[
				issue("example/repository", 41, 1001, {
					url: "https://evil.example/repos/example/repository/issues/41",
				}),
			],
			[
				issue("example/repository", 41, 1001, {
					url: "https://api.github.com/repos/example/repository/issues/42",
				}),
			],
		];
		for (const response of malformedResponses) {
			const { operations } = setup([response]);
			await assert.rejects(inspect(operations));
		}
	});

	it("T13 adds and then noops for a legitimate same-repository blocker", async () => {
		const blocker = issue("EXAMPLE/Repository", 41, 1001);
		const appliedSetup = setup([blocker, [], "", [blocker]]);
		const applied = await appliedSetup.operations.addBlocker({
			...request,
			repository: "Example/Repository",
		});
		assert.equal(applied.outcome, "applied");
		assert.deepEqual(applied.after?.blockedByIssues, [
			{ id: 1001, repository: "example/repository", number: 41 },
		]);

		const noopSetup = setup([blocker, [blocker]]);
		const noop = await noopSetup.operations.addBlocker({
			...request,
			repository: "Example/Repository",
		});
		assert.equal(noop.outcome, "noop");
		assert.equal(postCount(noopSetup.executor), 0);
	});

	it("rejects self-dependency and invalid request integers before GitHub access", async () => {
		for (const invalidRequest of [
			{ ...request, blockerNumber: 42 },
			{ ...request, issueNumber: 0 },
			{ ...request, blockerNumber: Number.MAX_SAFE_INTEGER + 1 },
		]) {
			const { executor, operations } = setup([]);
			await assert.rejects(operations.addBlocker(invalidRequest));
			assert.equal(executor.calls.length, 0);
		}
	});

	it("rejects a resolved blocker that contradicts the requested identity", async () => {
		for (const resolved of [
			issue("example/other", 41, 1001),
			issue("example/repository", 40, 1001),
			issue("example/repository", 41, 0),
		]) {
			const { executor, operations } = setup([resolved]);
			await assert.rejects(operations.addBlocker(request));
			assert.equal(executor.calls.length, 1);
			assert.equal(postCount(executor), 0);
		}
	});

	it("rejects credentials, query, fragments, and untrusted repository URLs", async () => {
		const invalid = [
			issue("example/repository", 41, 1001, {
				url: "https://user@api.github.com/repos/example/repository/issues/41",
			}),
			issue("example/repository", 41, 1001, {
				url: "https://api.github.com/repos/example/repository/issues/41?x=1",
			}),
			issue("example/repository", 41, 1001, {
				repository_url: "https://api.github.com/repos/example/repository#fragment",
			}),
			issue("example/repository", 41, 1001, {
				html_url: "https://evil.example/example/repository/issues/41",
			}),
		];
		for (const value of invalid) {
			const { operations } = setup([[value]]);
			await assert.rejects(inspect(operations));
		}
	});

	it("T14 validates the additive public snapshot and schemaVersion 1 receipt", () => {
		const snapshot = {
			blockedBy: [41],
			blockedByIssues: [{ id: 1001, repository: "example/repository", number: 41 }],
		};
		assert.deepEqual(DependencySnapshotSchema.parse(snapshot), snapshot);
		assert.throws(() => DependencySnapshotSchema.parse({ blockedBy: [41] }));
		assert.throws(() =>
			DependencySnapshotSchema.parse({
				...snapshot,
				blockedByIssues: [{ id: "1001", repository: "invalid", number: 41 }],
			}),
		);
		assert.throws(() =>
			DependencySnapshotSchema.parse({
				...snapshot,
				blockedByIssues: [
					{ ...snapshot.blockedByIssues[0], id: Number.MAX_SAFE_INTEGER + 1 },
				],
			}),
		);
		const receipt = CommandReceiptSchema.parse({
			schemaVersion: 1,
			command: "dependency.add-blocker",
			outcome: "noop",
			target: { repository: "example/repository", issueNumber: 42 },
			request: { blockerNumber: 41 },
			before: snapshot,
			after: snapshot,
			postcondition: { verified: true, description: "exact identity exists" },
		});
		assert.equal(receipt.schemaVersion, 1);
	});

	it("T15 keeps the generated dependency snapshot schema fresh", async () => {
		const expected = z.toJSONSchema(DependencySnapshotSchema, {
			target: "draft-2020-12",
		});
		const generated = JSON.parse(
			await readFile(
				path.resolve(
					import.meta.dirname,
					"..",
					"schemas",
					"dependency-snapshot.schema.json",
				),
				"utf8",
			),
		);
		assert.deepEqual(generated, expected);
	});
});
