import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CommandReceiptSchema } from "../src/receipts/schemas.ts";

const project = { id: "PVT", number: 3, owner: "example", title: "Engineering" };
const item = {
	project,
	issue: { id: "I", number: 42, repository: "example/repository" },
	itemId: "PVTI",
	isArchived: false,
	fields: { Status: "Ready" },
};
const dependency = {
	blockedBy: [41],
	blockedByIssues: [{ id: 1001, repository: "example/repository", number: 41 }],
};
const target = {
	projectOwner: "example",
	projectNumber: 3,
	repository: "example/repository",
	issueNumber: 42,
};
const postcondition = { verified: true, description: "verified" };

function receipt(
	command = "item.inspect",
	outcome = "inspected",
): Record<string, unknown> {
	return {
		schemaVersion: 2,
		command,
		outcome,
		target,
		request: {},
		before: null,
		after: item,
		postcondition,
	};
}

function rejects(candidate: unknown): void {
	assert.equal(CommandReceiptSchema.safeParse(candidate).success, false);
}

describe("strict v2 receipt rejection", () => {
	it("T05 rejects unknown commands", () => {
		rejects(receipt("unknown.command"));
	});

	it("T06 rejects unauthorized command/outcome combinations", () => {
		for (const candidate of [
			receipt("field.set", "inspected"),
			receipt("doctor", "applied"),
		]) {
			rejects(candidate);
		}
	});

	it("T07-T08 rejects malformed doctor snapshots", () => {
		const base = {
			...receipt("doctor"),
			target: {},
			request: {},
			after: { ghVersion: "gh version fixture", authenticated: true },
		};
		for (const after of [
			{ ghVersion: "gh version fixture" },
			{ ghVersion: "gh version fixture", authenticated: false },
			{ ghVersion: "gh version fixture", authenticated: "true" },
			{ ghVersion: 42, authenticated: true },
			{ ghVersion: "", authenticated: true },
		])
			rejects({ ...base, after });
	});

	it("T09 rejects an ItemSnapshot as project.inspect output", () => {
		rejects({
			...receipt("project.inspect"),
			target: { projectOwner: "example", projectNumber: 3 },
			after: item,
		});
	});

	it("T10 rejects item.inspect without a valid archive boolean", () => {
		for (const isArchived of [undefined, null, "false", 0]) {
			const after: Record<string, unknown> = { ...item };
			if (isArchived === undefined) delete after.isArchived;
			else after.isArchived = isArchived;
			rejects({ ...receipt(), after });
		}
		rejects({ ...receipt(), before: item });
	});

	it("T11-T12 rejects malformed dependency snapshots", () => {
		const base = {
			...receipt("dependency.add-blocker", "noop"),
			target: { repository: "example/repository", issueNumber: 42 },
			request: { blockerNumber: 41 },
			before: dependency,
			after: dependency,
		};
		rejects({ ...base, after: { blockedBy: [41] } });
		for (const blocker of [
			{ id: 0, repository: "example/repository", number: 41 },
			{ id: 1001, repository: "invalid", number: 41 },
			{ id: 1001, repository: "example/repository", number: 0 },
		]) {
			rejects({ ...base, after: { blockedBy: [41], blockedByIssues: [blocker] } });
		}
	});

	it("T13-T15 enforces exact before/after nullability", () => {
		const add = {
			...receipt("item.add", "applied"),
			request: { issueUrl: "https://github.com/example/repository/issues/42" },
		};
		rejects({ ...add, before: item });
		rejects({ ...add, outcome: "noop", before: null });
		const field = {
			...receipt("field.set", "applied"),
			request: { fieldName: "Status", optionName: "Ready" },
			before: item,
		};
		for (const value of [null, {}, { ...item, itemId: "" }]) {
			rejects({ ...field, before: value });
			rejects({ ...field, after: value });
		}
	});

	it("T16 requires verified=true for every success branch", () => {
		const validShapes = [
			{
				...receipt("doctor"),
				target: {},
				after: { ghVersion: "gh", authenticated: true },
			},
			{
				...receipt("project.inspect"),
				target: { projectOwner: "example", projectNumber: 3 },
				after: { project, fields: [], views: [] },
			},
			receipt(),
			{
				...receipt("item.add", "noop"),
				request: { issueUrl: "https://github.com/example/repository/issues/42" },
				before: item,
			},
			{
				...receipt("item.add", "applied"),
				request: { issueUrl: "https://github.com/example/repository/issues/42" },
			},
			{
				...receipt("field.set", "noop"),
				request: { fieldName: "Status", optionName: "Ready" },
				before: item,
			},
			{
				...receipt("field.set", "applied"),
				request: { fieldName: "Status", optionName: "Ready" },
				before: item,
			},
			{
				...receipt("dependency.add-blocker", "noop"),
				target: { repository: "example/repository", issueNumber: 42 },
				request: { blockerNumber: 41 },
				before: dependency,
				after: dependency,
			},
			{
				...receipt("dependency.add-blocker", "applied"),
				target: { repository: "example/repository", issueNumber: 42 },
				request: { blockerNumber: 41 },
				before: dependency,
				after: dependency,
			},
		];
		for (const candidate of validShapes) {
			rejects({ ...candidate, postcondition: { verified: false, description: "no" } });
		}
	});

	it("T17 rejects missing, extra, and line-terminated target/request values", () => {
		const base = receipt();
		for (const candidate of [
			{ ...base, target: { ...target, extra: "x" } },
			{
				...base,
				target: { projectOwner: "example", projectNumber: 3, issueNumber: 42 },
			},
			{ ...base, request: { extra: "x" } },
			{ ...base, target: { ...target, repository: "example/repository\n" } },
			{
				...receipt("item.add", "applied"),
				request: { issueUrl: "https://github.com/example/repository/issues/42\n" },
			},
			{ ...base, postcondition: { ...postcondition, extra: true } },
		])
			rejects(candidate);
	});

	it("T18 rejects invalid and unsafe numeric identities", () => {
		for (const value of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
			rejects({ ...receipt(), target: { ...target, issueNumber: value } });
			rejects({ ...receipt(), target: { ...target, projectNumber: value } });
		}
	});

	it("T19 rejects unknown properties without silent stripping", () => {
		for (const candidate of [
			{ ...receipt(), extra: true },
			{ ...receipt(), after: { ...item, extra: true } },
			{ ...receipt(), after: { ...item, project: { ...project, extra: true } } },
			{ ...receipt(), after: { ...item, issue: { ...item.issue, extra: true } } },
		])
			rejects(candidate);
	});
});
