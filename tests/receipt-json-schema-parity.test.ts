import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormatsModule, { type FormatsPlugin } from "ajv-formats";
import { z } from "zod";
import * as ReceiptExports from "../src/receipts/schemas.ts";

const root = path.resolve(import.meta.dirname, "..");
const receiptExports = ReceiptExports as unknown as Record<string, unknown>;
const addFormats = addFormatsModule as unknown as FormatsPlugin;

function runtimeSchema(name: string): z.ZodType {
	const value = receiptExports[name];
	assert.ok(value !== null && typeof value === "object" && "safeParse" in value, name);
	return value as z.ZodType;
}

async function jsonSchema(filename: string): Promise<Record<string, unknown>> {
	return JSON.parse(await readFile(path.join(root, "schemas", filename), "utf8"));
}

const v1Success = {
	schemaVersion: 1,
	command: "historic",
	outcome: "inspected",
	target: {},
	request: {},
	before: null,
	after: { historical: true },
	postcondition: { verified: false, description: "historic" },
};
const v1WithoutBefore: Record<string, unknown> = { ...v1Success };
delete v1WithoutBefore.before;
const v1WithoutAfter: Record<string, unknown> = { ...v1Success };
delete v1WithoutAfter.after;
const postcondition = { verified: true, description: "verified" };
const v2Success = {
	schemaVersion: 2,
	command: "doctor",
	outcome: "inspected",
	target: {},
	request: {},
	before: null,
	after: { ghVersion: "gh version fixture", authenticated: true },
	postcondition,
};
const project = {
	id: "PVT",
	number: 3,
	owner: "example",
	title: "Engineering",
	url: "https://github.com/users/example/projects/3",
};
const item = {
	project,
	issue: { id: "I", number: 42, repository: "example/repository" },
	itemId: "PVTI",
	isArchived: true,
	fields: { Status: "Ready" },
};
const dependency = {
	blockedBy: [41],
	blockedByIssues: [{ id: 1001, repository: "example/repository", number: 41 }],
};
const itemTarget = {
	projectOwner: "example",
	projectNumber: 3,
	repository: "example/repository",
	issueNumber: 42,
};
const otherValidV2 = [
	{
		...v2Success,
		command: "project.inspect",
		target: { projectOwner: "example", projectNumber: 3 },
		after: { project, fields: [], views: [] },
	},
	{ ...v2Success, command: "item.inspect", target: itemTarget, after: item },
	{
		...v2Success,
		command: "item.add",
		outcome: "noop",
		target: itemTarget,
		request: { issueUrl: "https://github.com/example/repository/issues/42" },
		before: item,
		after: item,
	},
	{
		...v2Success,
		command: "item.add",
		outcome: "applied",
		target: itemTarget,
		request: { issueUrl: "https://github.com/example/repository/issues/42" },
		after: item,
	},
	{
		...v2Success,
		command: "field.set",
		outcome: "noop",
		target: itemTarget,
		request: { fieldName: "Status", optionName: "Ready" },
		before: item,
		after: item,
	},
	{
		...v2Success,
		command: "field.set",
		outcome: "applied",
		target: itemTarget,
		request: { fieldName: "Status", optionName: "Ready" },
		before: item,
		after: item,
	},
	{
		...v2Success,
		command: "dependency.add-blocker",
		outcome: "noop",
		target: { repository: "example/repository", issueNumber: 42 },
		request: { blockerNumber: 41 },
		before: dependency,
		after: dependency,
	},
	{
		...v2Success,
		command: "dependency.add-blocker",
		outcome: "applied",
		target: { repository: "example/repository", issueNumber: 42 },
		request: { blockerNumber: 41 },
		before: dependency,
		after: dependency,
	},
];
const successCorpus = [
	v1Success,
	{ ...v1Success, historicalExtra: true },
	v1WithoutBefore,
	v1WithoutAfter,
	v2Success,
	...otherValidV2,
	{ ...v2Success, command: "unknown" },
	{ ...v2Success, outcome: "applied" },
	{ ...v2Success, schemaVersion: 1 },
	{ ...v1Success, schemaVersion: 2 },
	{ ...v2Success, extra: true },
	{ ...v2Success, after: null },
	{ ...v2Success, target: { extra: "x" } },
	{ ...v2Success, after: { ...v2Success.after, authenticated: false } },
	{ ...otherValidV2[1], after: { ...item, isArchived: undefined } },
	{
		...otherValidV2[2],
		request: { issueUrl: "http://github.com/example/repository/issues/42" },
	},
	{
		...otherValidV2[0],
		after: {
			project: { ...project, url: "https://github.com/orgs/example/projects/3" },
			fields: [],
			views: [],
		},
	},
	{
		...otherValidV2[0],
		after: {
			project: { ...project, url: "https://%2F.example/" },
			fields: [],
			views: [],
		},
	},
	{
		...otherValidV2[1],
		target: { ...itemTarget, repository: "example/repository\n" },
	},
	{
		...otherValidV2[2],
		request: { issueUrl: "https://github.com/example/repository/issues/42\n" },
	},
	...[
		"abc",
		"https:///",
		"https://github.com/x\n",
		"https://github.com/users/example/a b",
		"https://github.com/users/é/projects/3",
		"https://github.com/users\\example/projects/3",
		"https://github.com/users/example/projects/%zz",
	].map((url) => ({
		...otherValidV2[0],
		after: { project: { ...project, url }, fields: [], views: [] },
	})),
];
const v1Error = { schemaVersion: 1, error: { code: "OLD", message: "historic" } };
const v2Error = { schemaVersion: 2, error: { code: "NEW", message: "current" } };
const errorCorpus = [
	v1Error,
	{ ...v1Error, historicalExtra: true },
	v2Error,
	{ ...v1Error, schemaVersion: 2 },
	{ ...v2Error, schemaVersion: 1 },
	{ ...v2Error, extra: true },
	{ schemaVersion: 2, error: { code: "", message: "bad" } },
	{ schemaVersion: 2, error: { code: "BAD", message: "bad", extra: true } },
];

function ajvValidator(schema: Record<string, unknown>) {
	const ajv = new Ajv2020({ allErrors: true, strict: true });
	addFormats(ajv);
	return ajv.compile(schema);
}

describe("Zod and generated JSON Schema parity", () => {
	it("T02 and T28 agree for strict, legacy, and versioned success readers", async () => {
		const contracts = [
			["CommandReceiptSchema", "command-receipt.schema.json"],
			["LegacyCommandReceiptV1Schema", "command-receipt-v1.schema.json"],
			["VersionedCommandReceiptSchema", "versioned-command-receipt.schema.json"],
		] as const;
		let comparisons = 0;
		for (const [exportName, filename] of contracts) {
			const zodSchema = runtimeSchema(exportName);
			const validate = ajvValidator(await jsonSchema(filename));
			for (const fixture of successCorpus) {
				assert.equal(
					validate(fixture),
					zodSchema.safeParse(fixture).success,
					`${filename}: ${JSON.stringify(fixture)}`,
				);
				comparisons += 1;
			}
		}
		assert.equal(comparisons, 102);
	});

	it("T25 and T28 agree for strict, legacy, and versioned error readers", async () => {
		const contracts = [
			["ErrorReceiptSchema", "error-receipt.schema.json"],
			["LegacyErrorReceiptV1Schema", "error-receipt-v1.schema.json"],
			["VersionedErrorReceiptSchema", "versioned-error-receipt.schema.json"],
		] as const;
		let comparisons = 0;
		for (const [exportName, filename] of contracts) {
			const zodSchema = runtimeSchema(exportName);
			const validate = ajvValidator(await jsonSchema(filename));
			for (const fixture of errorCorpus) {
				assert.equal(
					validate(fixture),
					zodSchema.safeParse(fixture).success,
					`${filename}: ${JSON.stringify(fixture)}`,
				);
				comparisons += 1;
			}
		}
		assert.equal(comparisons, 24);
	});

	it("T29 keeps every generated schema byte-for-byte fresh", async () => {
		const contracts = [
			["command-receipt.schema.json", "CommandReceiptSchema", false],
			["error-receipt.schema.json", "ErrorReceiptSchema", false],
			["command-receipt-v1.schema.json", "LegacyCommandReceiptV1Schema", true],
			["error-receipt-v1.schema.json", "LegacyErrorReceiptV1Schema", true],
			["versioned-command-receipt.schema.json", "VersionedCommandReceiptSchema", true],
			["versioned-error-receipt.schema.json", "VersionedErrorReceiptSchema", true],
			["project-snapshot.schema.json", "ProjectSnapshotSchema", false],
			["item-snapshot.schema.json", "ItemSnapshotSchema", false],
			["dependency-snapshot.schema.json", "DependencySnapshotSchema", false],
		] as const;
		for (const [filename, exportName, inputMode] of contracts) {
			const options = inputMode
				? { target: "draft-2020-12" as const, io: "input" as const }
				: { target: "draft-2020-12" as const };
			const rendered = `${JSON.stringify(z.toJSONSchema(runtimeSchema(exportName), options), null, "\t")}\n`;
			const formatted = spawnSync(
				path.join(root, "node_modules/.bin/biome"),
				["format", "--stdin-file-path", path.join(root, "schemas", filename)],
				{ input: rendered, encoding: "utf8", shell: false },
			);
			assert.equal(formatted.status, 0, formatted.stderr);
			assert.equal(
				await readFile(path.join(root, "schemas", filename), "utf8"),
				formatted.stdout,
				filename,
			);
		}
	});
});
