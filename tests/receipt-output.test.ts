import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCli } from "../src/entrypoints/cli.ts";
import type { GhExecutor } from "../src/github/types.ts";
import { ProjectItemOperations } from "../src/project-items/project-item-operations.ts";
import type {
	GithubProjectGateway,
	ItemInspectionRequest,
} from "../src/project-items/types.ts";
import type { ItemSnapshot } from "../src/receipts/schemas.ts";

const project = {
	id: "PVT_project",
	number: 3,
	title: "Engineering",
	url: "https://github.com/users/example/projects/3",
};
const blocker = {
	id: 1001,
	number: 41,
	url: "https://api.github.com/repos/example/repository/issues/41",
	repository_url: "https://api.github.com/repos/example/repository",
	html_url: "https://github.com/example/repository/issues/41",
};

function graphqlPage(kind: "issue" | "items" | "fields" | "views" | "values") {
	const pageInfo = { hasNextPage: false, endCursor: null };
	if (kind === "issue") {
		return {
			data: {
				repository: {
					issue: {
						id: "I_issue",
						projectItems: {
							nodes: [{ id: "PVTI_item", isArchived: false, project }],
							pageInfo,
						},
					},
				},
			},
		};
	}
	if (kind === "items") {
		return {
			data: {
				node: {
					items: {
						nodes: [{ id: "PVTI_item", isArchived: false, content: { id: "I_issue" } }],
						pageInfo,
					},
				},
			},
		};
	}
	if (kind === "fields") return { data: { node: { fields: { nodes: [], pageInfo } } } };
	if (kind === "views") return { data: { node: { views: { nodes: [], pageInfo } } } };
	return {
		data: {
			node: {
				id: "PVTI_item",
				isArchived: false,
				fieldValues: {
					nodes: [
						{
							__typename: "ProjectV2ItemFieldSingleSelectValue",
							name: "Ready",
							field: { name: "Status" },
						},
					],
					pageInfo,
				},
			},
		},
	};
}

class InvalidReceiptGateway implements GithubProjectGateway {
	inspectCalls = 0;
	editCalls = 0;

	async inspectItem(_request: ItemInspectionRequest): Promise<ItemSnapshot> {
		this.inspectCalls += 1;
		return {
			project: { id: "PVT_project", number: 3, owner: "example", title: "Engineering" },
			issue: { id: "I_issue", number: 42, repository: "example/repository" },
			itemId: "PVTI_item",
			isArchived: false,
			fields: { "": this.inspectCalls === 1 ? "before" : "" },
		};
	}

	async resolveSingleSelect() {
		return { fieldId: "FIELD", optionId: "OPTION" };
	}

	async editSingleSelect(): Promise<void> {
		this.editCalls += 1;
	}

	async addItem(): Promise<void> {
		assert.fail("invalid receipt fixture must not add an item");
	}
}

class ReadOnlyFixtureExecutor {
	mutationCalls = 0;
	readonly execute: GhExecutor = async (args) => {
		if (args[0] === "--version") return { stdout: "gh version fixture\n", stderr: "" };
		if (args[0] === "auth") return { stdout: "", stderr: "" };
		if (args[0] === "project" && args[1] === "view") {
			return { stdout: JSON.stringify(project), stderr: "" };
		}
		if (args[0] === "project" && ["item-add", "item-edit"].includes(args[1] ?? "")) {
			this.mutationCalls += 1;
			return { stdout: "{}", stderr: "" };
		}
		if (args[0] === "api" && args[1] === "graphql") {
			const query = args.find((argument) => argument.startsWith("query=")) ?? "";
			const value = query.includes("projectItems(first:100")
				? graphqlPage("issue")
				: query.includes("items(first:100")
					? graphqlPage("items")
					: query.includes("fieldValues(first:100")
						? graphqlPage("values")
						: query.includes("fields(first:100")
							? graphqlPage("fields")
							: graphqlPage("views");
			return { stdout: JSON.stringify(value), stderr: "" };
		}
		if (args[0] === "api" && args[1]?.includes("dependencies/blocked_by")) {
			return { stdout: JSON.stringify([blocker]), stderr: "" };
		}
		if (args[0] === "api" && args[1] === "repos/example/repository/issues/41") {
			return { stdout: JSON.stringify(blocker), stderr: "" };
		}
		throw new Error(`Unexpected fixture invocation: ${args.join(" ")}`);
	};
}

async function capture(action: () => Promise<number>): Promise<{
	readonly status: number;
	readonly stdout: string;
	readonly stderr: string;
}> {
	const stdoutWrite = process.stdout.write;
	const stderrWrite = process.stderr.write;
	let stdout = "";
	let stderr = "";
	process.stdout.write = ((chunk: string | Uint8Array) => {
		stdout += String(chunk);
		return true;
	}) as typeof process.stdout.write;
	process.stderr.write = ((chunk: string | Uint8Array) => {
		stderr += String(chunk);
		return true;
	}) as typeof process.stderr.write;
	try {
		return { status: await action(), stdout, stderr };
	} finally {
		process.stdout.write = stdoutWrite;
		process.stderr.write = stderrWrite;
	}
}

const commands = [
	["doctor"],
	["project", "inspect", "--project-owner", "example", "--project-number", "3"],
	[
		"item",
		"inspect",
		"--project-owner",
		"example",
		"--project-number",
		"3",
		"--repo",
		"example/repository",
		"--issue",
		"42",
	],
	[
		"item",
		"add",
		"--project-owner",
		"example",
		"--project-number",
		"3",
		"--repo",
		"example/repository",
		"--issue",
		"42",
	],
	[
		"field",
		"set",
		"--project-owner",
		"example",
		"--project-number",
		"3",
		"--repo",
		"example/repository",
		"--issue",
		"42",
		"--field-name",
		"Status",
		"--option-name",
		"Ready",
	],
	[
		"dependency",
		"add-blocker",
		"--repo",
		"example/repository",
		"--issue",
		"42",
		"--blocker",
		"41",
	],
] as const;

describe("final receipt output boundary", () => {
	it("T30 emits one strict v2 success line for all six commands", async () => {
		for (const args of commands) {
			const fixture = new ReadOnlyFixtureExecutor();
			const result = await capture(async () => await runCli(args, fixture.execute));
			assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
			assert.equal(result.stderr, "");
			assert.equal(result.stdout.trim().split("\n").length, 1);
			const receipt = JSON.parse(result.stdout);
			assert.equal(receipt.schemaVersion, 2);
			assert.equal(receipt.postcondition.verified, true);
			assert.equal(fixture.mutationCalls, 0);
		}
	});

	it("T26 emits zero success lines and one sanitized v2 error for invalid doctor output", async () => {
		let calls = 0;
		const execute: GhExecutor = async () => {
			calls += 1;
			return { stdout: calls === 1 ? "   " : "", stderr: "" };
		};
		const result = await capture(async () => await runCli(["doctor"], execute));
		assert.equal(result.status, 1);
		assert.equal(result.stdout, "");
		assert.equal(result.stderr.trim().split("\n").length, 1);
		const error = JSON.parse(result.stderr);
		assert.equal(error.schemaVersion, 2);
		assert.equal(error.error.code, "RECEIPT_VALIDATION_FAILED");
		assert.doesNotMatch(error.error.message, /Zod|invalid_type|ghVersion/);
		assert.ok(error.error.message.length <= 512);
	});

	it("T27 does not retry or claim rollback after post-submission validation failure", async () => {
		const module = await import("../src/receipts/receipt-output.ts");
		const gateway = new InvalidReceiptGateway();
		const invalidCandidate = await new ProjectItemOperations(gateway).setSingleSelect({
			projectOwner: "example",
			projectNumber: 3,
			repository: "example/repository",
			issueNumber: 42,
			fieldName: "",
			optionName: "",
		});
		assert.equal(invalidCandidate.outcome, "applied");
		assert.throws(
			() => module.validateProducedSuccessReceipt(invalidCandidate),
			(error: unknown) =>
				error instanceof module.ReceiptOutputValidationError &&
				error.code === "RECEIPT_VALIDATION_FAILED" &&
				!/rollback|not applied|retry/i.test(error.message),
		);
		assert.equal(gateway.editCalls, 1);
		assert.equal(gateway.inspectCalls, 2);
	});

	it("preserves usage exit 2 while emitting a strict v2 error", async () => {
		const result = await capture(async () => await runCli(["unknown"]));
		assert.equal(result.status, 2);
		assert.equal(result.stdout, "");
		assert.equal(JSON.parse(result.stderr).schemaVersion, 2);
		assert.equal(JSON.parse(result.stderr).error.code, "UNKNOWN_COMMAND");
	});
});
