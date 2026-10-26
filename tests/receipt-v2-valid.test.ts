import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CommandReceiptSchema } from "../src/receipts/schemas.ts";

const project = {
	id: "PVT_project",
	number: 3,
	owner: "example",
	title: "Engineering",
	url: "https://github.com/users/example/projects/3",
};
const item = {
	project,
	issue: { id: "I_issue", number: 42, repository: "example/repository" },
	itemId: "PVTI_item",
	isArchived: false,
	fields: { Status: "Ready", Custom: null },
};
const dependency = {
	blockedBy: [41],
	blockedByIssues: [{ id: 1001, repository: "example/repository", number: 41 }],
};
const postcondition = { verified: true, description: "Verified fixture" };
const itemTarget = {
	projectOwner: "example",
	projectNumber: 3,
	repository: "example/repository",
	issueNumber: 42,
};

export const validV2Receipts = [
	{
		schemaVersion: 2,
		command: "doctor",
		outcome: "inspected",
		target: {},
		request: {},
		before: null,
		after: { ghVersion: "gh version 2.37.0", authenticated: true },
		postcondition,
	},
	{
		schemaVersion: 2,
		command: "project.inspect",
		outcome: "inspected",
		target: { projectOwner: "example", projectNumber: 3 },
		request: {},
		before: null,
		after: { project, fields: [], views: [] },
		postcondition,
	},
	{
		schemaVersion: 2,
		command: "item.inspect",
		outcome: "inspected",
		target: itemTarget,
		request: {},
		before: null,
		after: item,
		postcondition,
	},
	{
		schemaVersion: 2,
		command: "item.add",
		outcome: "noop",
		target: itemTarget,
		request: { issueUrl: "https://github.com/example/repository/issues/42" },
		before: item,
		after: item,
		postcondition,
	},
	{
		schemaVersion: 2,
		command: "item.add",
		outcome: "applied",
		target: itemTarget,
		request: { issueUrl: "https://github.com/example/repository/issues/42" },
		before: null,
		after: item,
		postcondition,
	},
	...(["noop", "applied"] as const).map((outcome) => ({
		schemaVersion: 2,
		command: "field.set",
		outcome,
		target: itemTarget,
		request: { fieldName: "Status", optionName: "Ready" },
		before: item,
		after: item,
		postcondition,
	})),
	...(["noop", "applied"] as const).map((outcome) => ({
		schemaVersion: 2,
		command: "dependency.add-blocker",
		outcome,
		target: { repository: "example/repository", issueNumber: 42 },
		request: { blockerNumber: 41 },
		before: dependency,
		after: dependency,
		postcondition,
	})),
] as const;

describe("strict v2 success receipts", () => {
	it("T01 accepts exactly the nine authorized command/outcome variants", () => {
		assert.equal(validV2Receipts.length, 9);
		for (const receipt of validV2Receipts) {
			assert.deepEqual(CommandReceiptSchema.parse(receipt), receipt);
		}
		assert.deepEqual(
			validV2Receipts.map(({ command, outcome }) => `${command}:${outcome}`).sort(),
			[
				"dependency.add-blocker:applied",
				"dependency.add-blocker:noop",
				"doctor:inspected",
				"field.set:applied",
				"field.set:noop",
				"item.add:applied",
				"item.add:noop",
				"item.inspect:inspected",
				"project.inspect:inspected",
			],
		);
	});

	it("T03 preserves each command-specific target and request shape", () => {
		const expected = [
			[[], []],
			[["projectNumber", "projectOwner"], []],
			[["issueNumber", "projectNumber", "projectOwner", "repository"], []],
			[["issueNumber", "projectNumber", "projectOwner", "repository"], ["issueUrl"]],
			[["issueNumber", "projectNumber", "projectOwner", "repository"], ["issueUrl"]],
			[
				["issueNumber", "projectNumber", "projectOwner", "repository"],
				["fieldName", "optionName"],
			],
			[
				["issueNumber", "projectNumber", "projectOwner", "repository"],
				["fieldName", "optionName"],
			],
			[["issueNumber", "repository"], ["blockerNumber"]],
			[["issueNumber", "repository"], ["blockerNumber"]],
		] as const;
		for (const [index, receipt] of validV2Receipts.entries()) {
			assert.deepEqual(Object.keys(receipt.target).sort(), expected[index]?.[0]);
			assert.deepEqual(Object.keys(receipt.request).sort(), expected[index]?.[1]);
		}
	});

	it("T20 keeps ItemSnapshot fields intentionally open", () => {
		const receipt = structuredClone(validV2Receipts[2]);
		const fields = receipt.after.fields as Record<string, string | null>;
		fields["Arbitrary field"] = "Arbitrary value";
		assert.equal(CommandReceiptSchema.safeParse(receipt).success, true);
	});
});
