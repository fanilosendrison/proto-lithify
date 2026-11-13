import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCli } from "../src/entrypoints/cli.ts";
import { ProjectV2Client } from "../src/github/project-v2-client.ts";
import { CommandReceiptSchema, ErrorReceiptSchema } from "../src/receipts/schemas.ts";
import {
	ArchiveExecutor,
	fieldsPage,
	issueItem,
	issuePage,
	project,
	projectItem,
	projectPage,
} from "./project-archive-fixture.ts";

const routing = [
	"--project-owner",
	"example",
	"--project-number",
	"3",
	"--repo",
	"example/repository",
	"--issue",
	"42",
];
function value(type: string, key: string, content: unknown): Record<string, unknown> {
	return {
		__typename: `ProjectV2ItemField${type}Value`,
		[key]: content,
		field: {
			__typename:
				type === "SingleSelect"
					? "ProjectV2SingleSelectField"
					: type === "Iteration"
						? "ProjectV2IterationField"
						: "ProjectV2Field",
			name: "Notes",
		},
	};
}
function observation(raw: unknown[], archived = false, id = "PVTI_item") {
	return [
		project,
		issuePage([issueItem(id, archived)]),
		projectPage([projectItem(id, archived)]),
		fieldsPage(id, archived, raw),
	];
}
const selected = (name: string) => value("SingleSelect", "name", name);
const resolution = {
	data: {
		node: {
			fields: {
				nodes: [
					{
						__typename: "ProjectV2SingleSelectField",
						id: "F_notes",
						name: "Notes",
						options: [{ id: "O_ready", name: "Ready" }],
					},
				],
				pageInfo: { hasNextPage: false, endCursor: null },
			},
		},
	},
};
async function invoke(responses: unknown[], option = "Ready") {
	const executor = new ArchiveExecutor(responses);
	const originalOut = process.stdout.write;
	const originalError = process.stderr.write;
	let stdout = "";
	let stderr = "";
	process.stdout.write = ((chunk: string | Uint8Array) => {
		stdout += String(chunk);
		return true;
	}) as typeof originalOut;
	process.stderr.write = ((chunk: string | Uint8Array) => {
		stderr += String(chunk);
		return true;
	}) as typeof originalError;
	let status: number;
	try {
		status = await runCli(
			["field", "set", ...routing, "--field-name", "Notes", "--option-name", option],
			executor.execute,
		);
	} finally {
		process.stdout.write = originalOut;
		process.stderr.write = originalError;
	}
	return { status, stdout, stderr, executor };
}
function refusal(result: Awaited<ReturnType<typeof invoke>>, mutations: number) {
	assert.equal(result.status, 1);
	assert.equal(result.stdout, "");
	assert.equal(
		ErrorReceiptSchema.parse(JSON.parse(result.stderr)).error.code,
		"OPERATION_FAILED",
	);
	assert.equal(
		result.executor.calls.filter((c) => c[0] === "project" && c[1] === "item-edit")
			.length,
		mutations,
	);
	result.executor.assertDrained();
}

describe("field.set provider type proof", () => {
	for (const archived of [false, true]) {
		for (const [name, raw, option] of [
			["text", value("Text", "text", "Ready"), "Ready"],
			["number", value("Number", "number", 42), "42"],
			["date", value("Date", "date", "2026-11-13"), "2026-11-13"],
			["iteration", value("Iteration", "title", "Ready"), "Ready"],
		] as const) {
			it(`rejects ${name} collision, archived=${archived}, without resolution or edit`, async () => {
				const result = await invoke(observation([raw], archived), option);
				refusal(result, 0);
				assert.equal(result.executor.calls.length, 4);
			});
		}
		it(`preserves genuine single-select noop, archived=${archived}`, async () => {
			const result = await invoke(observation([selected("Ready")], archived));
			assert.equal(result.status, 0);
			assert.equal(result.stderr, "");
			const receipt = CommandReceiptSchema.parse(JSON.parse(result.stdout));
			assert.equal(receipt.outcome, "noop");
			assert.deepEqual(receipt.before, receipt.after);
			assert.deepEqual(receipt.after, {
				project: { ...project, owner: "example" },
				issue: { id: "I_target", number: 42, repository: "example/repository" },
				itemId: "PVTI_item",
				isArchived: archived,
				fields: { Notes: "Ready" },
			});
			assert.equal(result.executor.calls.length, 4);
			result.executor.assertDrained();
		});
	}
	it("preserves T06 before resolution", async () => {
		const result = await invoke(observation([selected("Backlog")], true));
		refusal(result, 0);
		assert.equal(result.executor.calls.length, 4);
	});
	for (const [name, raw] of [
		["missing discriminator", { name: "Ready", field: { name: "Notes" } }],
		["unknown discriminator", value("Future", "name", "Ready")],
		["missing field discriminator", { ...selected("Ready"), field: { name: "Notes" } }],
		[
			"contradictory field type",
			{ ...selected("Ready"), field: { name: "Notes", __typename: "ProjectV2Field" } },
		],
		["contradictory payload", { ...selected("Ready"), text: "Ready" }],
		[
			"missing selected name",
			{ __typename: "ProjectV2ItemFieldSingleSelectValue", field: { name: "Notes" } },
		],
		["null selected name", selected(null as unknown as string)],
		["wrong primitive", selected(42 as unknown as string)],
	] as const) {
		it(`fails closed for ${name}`, async () => {
			refusal(await invoke(observation([raw])), 0);
		});
	}
	it("rejects duplicate named observations", async () => {
		refusal(
			await invoke(observation([selected("Ready"), value("Text", "text", "Ready")])),
			0,
		);
	});
	it("does not infer a noop from an absent archived value", async () => {
		refusal(await invoke(observation([], true)), 0);
	});
	for (const before of [[selected("Backlog")], []]) {
		it(`verifies an active edit from ${before.length ? "differing" : "absent"} value`, async () => {
			const result = await invoke([
				...observation(before),
				resolution,
				{},
				...observation([selected("Ready")]),
			]);
			assert.equal(result.status, 0);
			assert.equal(result.stderr, "");
			const receipt = CommandReceiptSchema.parse(JSON.parse(result.stdout));
			assert.equal(receipt.outcome, "applied");
			assert.equal(result.executor.calls.length, 10);
			const edit = result.executor.calls[5];
			assert.deepEqual(edit, [
				"project",
				"item-edit",
				"--id",
				"PVTI_item",
				"--project-id",
				"PVT_project",
				"--field-id",
				"F_notes",
				"--single-select-option-id",
				"O_ready",
			]);
			result.executor.assertDrained();
		});
	}
	for (const [name, after] of [
		["wrong type", observation([value("Text", "text", "Ready")])],
		["missing value", observation([])],
		["archived", observation([selected("Ready")], true)],
		["new identity", observation([selected("Ready")], false, "PVTI_replaced")],
	] as const) {
		it(`rejects ${name} after one submitted edit without retry`, async () => {
			const result = await invoke([
				...observation([selected("Backlog")]),
				resolution,
				{},
				...after,
			]);
			refusal(result, 1);
			assert.match(result.stderr, /do not retry automatically/i);
		});
	}
	it("keeps the public inspection projection faithful without leaking type evidence", async () => {
		const executor = new ArchiveExecutor(
			observation([
				value("Text", "text", "Ready"),
				{ ...value("Number", "number", 42), field: { name: "Count" } },
			]),
		);
		const snapshot = await new ProjectV2Client(executor.execute).inspectItem({
			projectOwner: "example",
			projectNumber: 3,
			repository: "example/repository",
			issueNumber: 42,
		});
		assert.deepEqual(snapshot.fields, { Notes: "Ready", Count: "42" });
		assert.deepEqual(Object.keys(snapshot).sort(), [
			"fields",
			"isArchived",
			"issue",
			"itemId",
			"project",
		]);
	});
});
