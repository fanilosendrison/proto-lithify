import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCli } from "../src/entrypoints/cli.ts";
import { ProjectV2Client } from "../src/github/project-v2-client.ts";
import type { GhExecutor } from "../src/github/types.ts";
import { ErrorReceiptSchema } from "../src/receipts/schemas.ts";

const project = {
	id: "PVT_project",
	number: 3,
	title: "Engineering",
	url: "https://github.com/users/example/projects/3",
};
const validField = {
	__typename: "ProjectV2Field",
	id: "FIELD",
	name: "Title",
	dataType: "TEXT",
};
const validView = { name: "All", layout: "TABLE_LAYOUT", filter: "" };

function response(
	kind: "fields" | "views",
	nodes: readonly unknown[],
	hasNextPage = false,
	endCursor: unknown = null,
) {
	return {
		data: { node: { [kind]: { nodes, pageInfo: { hasNextPage, endCursor } } } },
	};
}

function kindOf(args: readonly string[]): "fields" | "views" {
	const query = args.find((value) => value.startsWith("query=")) ?? "";
	return query.includes("fields(first:100") ? "fields" : "views";
}

class CatalogExecutor {
	readonly calls: string[][] = [];
	readonly #fields: readonly unknown[];
	readonly #views: readonly unknown[];
	#fieldIndex = 0;
	#viewIndex = 0;

	constructor(
		fields: readonly unknown[],
		views: readonly unknown[] = [response("views", [validView])],
	) {
		this.#fields = fields;
		this.#views = views;
	}

	readonly execute: GhExecutor = async (args) => {
		this.calls.push([...args]);
		if (args[0] === "project") return { stdout: JSON.stringify(project), stderr: "" };
		const kind = kindOf(args);
		const value =
			kind === "fields"
				? this.#fields[this.#fieldIndex++]
				: this.#views[this.#viewIndex++];
		assert.notEqual(value, undefined, `unexpected ${kind} call`);
		return { stdout: JSON.stringify(value), stderr: "" };
	};
}

async function inspect(fields: readonly unknown[], views?: readonly unknown[]) {
	const executor = new CatalogExecutor(fields, views);
	return await new ProjectV2Client(executor.execute).inspectProject("example", 3);
}

async function capture(action: () => Promise<number>) {
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

describe("truthful Project catalog observation", () => {
	it("R4.A rejects every missing, empty, or non-string field identity", async () => {
		for (const malformed of [
			{ ...validField, id: undefined },
			{ ...validField, id: "" },
			{ ...validField, id: 7 },
			{ ...validField, name: undefined },
			{ ...validField, name: "" },
			{ ...validField, name: false },
		]) {
			await assert.rejects(inspect([response("fields", [malformed])]));
		}
	});

	it("R4.B rejects duplicate opaque field IDs on one page and across pages", async () => {
		await assert.rejects(
			inspect([response("fields", [validField, { ...validField, name: "Other" }])]),
			/duplicate.*field id/i,
		);
		await assert.rejects(
			inspect([
				response("fields", [validField], true, "next"),
				response("fields", [{ ...validField, name: "Other" }]),
			]),
			/duplicate.*field id/i,
		);
	});

	it("R4.C rejects multi-select and future unrepresentable field types", async () => {
		for (const node of [
			{ __typename: "ProjectV2MultiSelectField" },
			{ __typename: "ProjectV2FutureField" },
		]) {
			await assert.rejects(
				inspect([response("fields", [node])]),
				/unrepresentable.*field type/i,
			);
		}
	});

	it("R4.D rejects invalid discriminators and incomplete known fields/options", async () => {
		for (const node of [
			{ ...validField, __typename: undefined },
			{ ...validField, __typename: "" },
			{ ...validField, __typename: 4 },
			{ __typename: "ProjectV2Field", id: "F", name: "Incomplete" },
			{
				__typename: "ProjectV2SingleSelectField",
				id: "F",
				name: "Status",
				options: [{ id: "", name: "Ready" }],
			},
		]) {
			await assert.rejects(inspect([response("fields", [node])]));
		}
	});

	it("R4.D preserves all valid currently represented field configurations", async () => {
		const snapshot = await inspect([
			response("fields", [
				validField,
				{ __typename: "ProjectV2IterationField", id: "ITER", name: "Iteration" },
				{
					__typename: "ProjectV2SingleSelectField",
					id: "STATUS",
					name: "Status",
					options: [{ id: "READY", name: "Ready" }],
				},
			]),
		]);
		assert.deepEqual(snapshot.fields, [
			{ id: "FIELD", name: "Title", type: "TEXT" },
			{ id: "ITER", name: "Iteration", type: "ProjectV2IterationField" },
			{
				id: "STATUS",
				name: "Status",
				type: "ProjectV2SingleSelectField",
				options: [{ id: "READY", name: "Ready" }],
			},
		]);
	});

	it("R4.E accepts only present nullable-or-string view filters", async () => {
		const accepted = await inspect(
			[response("fields", [validField])],
			[
				response("views", [
					{ ...validView, name: "Null", filter: null },
					{ ...validView, name: "Empty", filter: "" },
					{ ...validView, name: "Exact", filter: "is:open" },
				]),
			],
		);
		assert.deepEqual(
			accepted.views.map(({ filter }) => filter),
			["", "", "is:open"],
		);
		for (const filter of [undefined, 1, true, {}, []]) {
			const malformed = { ...validView, filter } as Record<string, unknown>;
			if (filter === undefined) delete malformed.filter;
			await assert.rejects(
				inspect([response("fields", [validField])], [response("views", [malformed])]),
			);
		}
	});

	it("R4.F emits no Project success for malformed catalog data", async () => {
		const executor = new CatalogExecutor([
			response("fields", [{ __typename: "ProjectV2MultiSelectField" }]),
		]);
		const output = await capture(
			async () =>
				await runCli(
					["project", "inspect", "--project-owner", "example", "--project-number", "3"],
					executor.execute,
				),
		);
		assert.equal(output.status, 1);
		assert.equal(output.stdout, "");
		assert.equal(output.stderr.trim().split("\n").length, 1);
		const error = ErrorReceiptSchema.parse(JSON.parse(output.stderr));
		assert.equal(error.schemaVersion, 2);
		assert.equal(error.error.code, "OPERATION_FAILED");
		assert.doesNotMatch(output.stderr, /postcondition|verified/i);
	});
});
