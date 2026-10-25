import assert from "node:assert/strict";
import type { GhExecutor } from "../src/github/types.ts";

export const project = {
	id: "PVT_project",
	number: 3,
	title: "Engineering",
	url: "https://github.com/users/example/projects/3",
};

export const request = {
	projectOwner: "example",
	projectNumber: 3,
	repository: "example/repository",
	issueNumber: 42,
};

export class ArchiveExecutor {
	readonly calls: string[][] = [];
	readonly #responses: unknown[];

	constructor(responses: readonly unknown[]) {
		this.#responses = [...responses];
	}

	readonly execute: GhExecutor = async (args) => {
		this.calls.push([...args]);
		const response = this.#responses.shift();
		assert.notEqual(response, undefined, "unexpected gh call");
		return { stdout: JSON.stringify(response), stderr: "" };
	};

	assertDrained(): void {
		assert.equal(this.#responses.length, 0);
	}
}

export function issuePage(
	nodes: readonly unknown[],
	hasNextPage = false,
	endCursor: string | null = null,
	issueId: unknown = "I_target",
): unknown {
	return {
		data: {
			repository: {
				issue: {
					id: issueId,
					projectItems: { nodes, pageInfo: { hasNextPage, endCursor } },
				},
			},
		},
	};
}

export function issueItem(id = "PVTI_item", isArchived: unknown = false): unknown {
	return { id, isArchived, project: { ...project } };
}

export function projectPage(
	nodes: readonly unknown[],
	hasNextPage = false,
	endCursor: string | null = null,
): unknown {
	return {
		data: {
			node: { items: { nodes, pageInfo: { hasNextPage, endCursor } } },
		},
	};
}

export function projectItem(
	id = "PVTI_item",
	isArchived: unknown = false,
	issueId: unknown = "I_target",
): unknown {
	return { id, isArchived, content: { id: issueId } };
}

export function fieldsPage(
	id: unknown = "PVTI_item",
	isArchived: unknown = false,
	nodes: readonly unknown[] = [],
	hasNextPage = false,
	endCursor: string | null = null,
): unknown {
	return {
		data: {
			node: {
				id,
				isArchived,
				fieldValues: { nodes, pageInfo: { hasNextPage, endCursor } },
			},
		},
	};
}

export function validResponses(isArchived: boolean): readonly unknown[] {
	return [
		project,
		issuePage([issueItem("PVTI_item", isArchived)]),
		projectPage([projectItem("PVTI_item", isArchived)]),
		fieldsPage("PVTI_item", isArchived),
	];
}

export function graphqlQuery(call: readonly string[]): string {
	return call.find((argument) => argument.startsWith("query=")) ?? "";
}

export function cursorArgument(call: readonly string[]): string | undefined {
	return call.find((argument) => argument.startsWith("cursor="));
}
