import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProjectV2Client } from "../src/github/project-v2-client.ts";
import type { GhExecutor } from "../src/github/types.ts";

class QueuedExecutor {
	readonly calls: readonly string[][] = [];
	readonly #mutableCalls: string[][] = [];
	readonly #responses: string[];

	constructor(responses: readonly unknown[]) {
		this.calls = this.#mutableCalls;
		this.#responses = responses.map((response) => JSON.stringify(response));
	}

	readonly execute: GhExecutor = async (args) => {
		this.#mutableCalls.push([...args]);
		const response = this.#responses.shift();
		assert.notStrictEqual(response, undefined, "unexpected gh call");
		return { stdout: response ?? "", stderr: "" };
	};

	assertDrained(): void {
		assert.strictEqual(this.#responses.length, 0);
	}
}

const project = {
	id: "PVT_project",
	number: 3,
	title: "Engineering",
	url: "https://github.com/users/example/projects/3",
};

function issueProjectItemPage(
	nodes: readonly unknown[],
	hasNextPage: boolean,
	endCursor: string | null,
): unknown {
	return {
		data: {
			repository: {
				issue: {
					id: "I_target",
					projectItems: { nodes, pageInfo: { hasNextPage, endCursor } },
				},
			},
		},
	};
}

function projectCollectionPage(
	nodes: readonly unknown[],
	hasNextPage: boolean,
	endCursor: string | null,
): unknown {
	return {
		data: {
			node: {
				items: { nodes, pageInfo: { hasNextPage, endCursor } },
			},
		},
	};
}

describe("ProjectV2Client", () => {
	it("paginates and matches the Issue and Project membership projections", async () => {
		const executor = new QueuedExecutor([
			project,
			issueProjectItemPage([], true, "issue-cursor"),
			issueProjectItemPage([{ id: "PVTI_item", project: { ...project } }], false, null),
			projectCollectionPage(
				[{ id: "PVTI_other", content: { id: "I_other" } }],
				true,
				"project-cursor",
			),
			projectCollectionPage(
				[{ id: "PVTI_item", content: { id: "I_target" } }],
				false,
				null,
			),
			{
				data: {
					node: {
						fieldValues: {
							nodes: [{ __typename: "ProjectV2ItemFieldRepositoryValue" }],
							pageInfo: { hasNextPage: false, endCursor: null },
						},
					},
				},
			},
		]);
		const client = new ProjectV2Client(executor.execute);
		const snapshot = await client.inspectItem({
			projectOwner: "example",
			projectNumber: 3,
			repository: "example/repository",
			issueNumber: 42,
		});

		assert.strictEqual(snapshot.itemId, "PVTI_item");
		assert.strictEqual(executor.calls.length, 6);
		assert.ok(
			executor.calls[2]?.some((argument) => argument === "cursor=issue-cursor"),
		);
		assert.ok(
			executor.calls[4]?.some((argument) => argument === "cursor=project-cursor"),
		);
		executor.assertDrained();
	});

	it("rejects an Issue-side item missing from the Project collection", async () => {
		const executor = new QueuedExecutor([
			project,
			issueProjectItemPage(
				[{ id: "PVTI_orphan", project: { ...project } }],
				false,
				null,
			),
			projectCollectionPage([], false, null),
		]);
		const client = new ProjectV2Client(executor.execute);

		await assert.rejects(
			client.inspectItem({
				projectOwner: "example",
				projectNumber: 3,
				repository: "example/repository",
				issueNumber: 42,
			}),
			/Inconsistent Project item membership.*Issue-side found 1; Project-side found 0/,
		);
		executor.assertDrained();
	});

	it("rejects a Project-side item missing from the Issue projection", async () => {
		const executor = new QueuedExecutor([
			project,
			issueProjectItemPage([], false, null),
			projectCollectionPage(
				[{ id: "PVTI_orphan", content: { id: "I_target" } }],
				false,
				null,
			),
		]);
		const client = new ProjectV2Client(executor.execute);

		await assert.rejects(
			client.inspectItem({
				projectOwner: "example",
				projectNumber: 3,
				repository: "example/repository",
				issueNumber: 42,
			}),
			/Inconsistent Project item membership.*Issue-side found 0; Project-side found 1/,
		);
		executor.assertDrained();
	});

	it("rejects contradictory item identities across membership projections", async () => {
		const executor = new QueuedExecutor([
			project,
			issueProjectItemPage(
				[{ id: "PVTI_issue", project: { ...project } }],
				false,
				null,
			),
			projectCollectionPage(
				[{ id: "PVTI_project", content: { id: "I_target" } }],
				false,
				null,
			),
		]);
		const client = new ProjectV2Client(executor.execute);

		await assert.rejects(
			client.inspectItem({
				projectOwner: "example",
				projectNumber: 3,
				repository: "example/repository",
				issueNumber: 42,
			}),
			/Issue-side and Project-side item ids differ/,
		);
		executor.assertDrained();
	});

	it("rejects ambiguous exact field names", async () => {
		const executor = new QueuedExecutor([
			{
				data: {
					node: {
						fields: {
							nodes: [
								{ id: "field-1", name: "Status", options: [] },
								{ id: "field-2", name: "Status", options: [] },
							],
							pageInfo: { hasNextPage: false, endCursor: null },
						},
					},
				},
			},
		]);
		const client = new ProjectV2Client(executor.execute);
		await assert.rejects(
			client.resolveSingleSelect("PVT_project", "Status", "Ready"),
			/exactly one field named "Status"/,
		);
	});
});
