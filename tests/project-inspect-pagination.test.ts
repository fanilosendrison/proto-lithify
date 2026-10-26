import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProjectV2Client } from "../src/github/project-v2-client.ts";
import type { GhExecutor } from "../src/github/types.ts";
import { ProjectSnapshotSchema } from "../src/receipts/schemas.ts";

const project = {
	id: "PVT_project",
	number: 3,
	title: "Engineering",
	url: "https://github.com/users/example/projects/3",
};
const field = (id: string) => ({
	__typename: "ProjectV2Field",
	id,
	name: `Field ${id}`,
	dataType: "TEXT",
});
const view = (name: string) => ({ name, layout: "TABLE_LAYOUT", filter: "" });

function page(
	connection: "fields" | "views",
	nodes: readonly unknown[],
	hasNextPage: boolean,
	endCursor?: unknown,
) {
	const pageInfo: Record<string, unknown> = { hasNextPage };
	if (endCursor !== undefined) pageInfo.endCursor = endCursor;
	return { data: { node: { [connection]: { nodes, pageInfo } } } };
}

function queryKind(args: readonly string[]): "fields" | "views" {
	const query = args.find((value) => value.startsWith("query=")) ?? "";
	if (query.includes("fields(first:100")) return "fields";
	if (query.includes("views(first:100")) return "views";
	assert.fail(`unexpected query: ${query}`);
}

function cursor(args: readonly string[]): string | null {
	return args.find((value) => value.startsWith("cursor="))?.slice(7) ?? null;
}

type CatalogResponder = (
	kind: "fields" | "views",
	call: number,
	cursor: string | null,
) => unknown;

class CatalogExecutor {
	readonly calls: string[][] = [];
	readonly #respond: CatalogResponder;
	readonly #counts = { fields: 0, views: 0 };

	constructor(respond: CatalogResponder) {
		this.#respond = respond;
	}

	readonly execute: GhExecutor = async (args) => {
		this.calls.push([...args]);
		if (args[0] === "project") return { stdout: JSON.stringify(project), stderr: "" };
		const kind = queryKind(args);
		this.#counts[kind] += 1;
		if (this.#counts[kind] > 4) throw new Error(`${kind} pagination exceeded bound`);
		return {
			stdout: JSON.stringify(this.#respond(kind, this.#counts[kind], cursor(args))),
			stderr: "",
		};
	};
}

function catalogCalls(executor: CatalogExecutor, kind: "fields" | "views"): string[][] {
	return executor.calls.filter((call) => call[0] === "api" && queryKind(call) === kind);
}

function validTerminal(kind: "fields" | "views"): unknown {
	return page(
		kind,
		kind === "fields" ? [field("stable")] : [view("Stable")],
		false,
		null,
	);
}

describe("Project catalog pagination", () => {
	it("R2.A traverses every fields and views page including final-page entries", async () => {
		const executor = new CatalogExecutor((kind, call, observedCursor) => {
			if (call === 1) {
				assert.equal(observedCursor, null);
				return page(
					kind,
					kind === "fields" ? [field("first")] : [view("First")],
					true,
					"cursor-2",
				);
			}
			assert.equal(observedCursor, "cursor-2");
			return page(
				kind,
				kind === "fields" ? [field("final")] : [view("Final")],
				false,
				null,
			);
		});
		const snapshot = await new ProjectV2Client(executor.execute).inspectProject(
			"example",
			3,
		);
		assert.deepEqual(
			snapshot.fields.map(({ id }) => id),
			["first", "final"],
		);
		assert.deepEqual(
			snapshot.views.map(({ name }) => name),
			["First", "Final"],
		);
		assert.deepEqual(ProjectSnapshotSchema.parse(snapshot), snapshot);
		for (const kind of ["fields", "views"] as const) {
			assert.equal(catalogCalls(executor, kind).length, 2);
			assert.equal(cursor(catalogCalls(executor, kind)[1] ?? []), "cursor-2");
		}
	});

	it("R2.B rejects nonadvancing, repeated, and cyclic field/view cursors", async () => {
		for (const faulty of ["fields", "views"] as const) {
			for (const sequence of [
				["cursor-a", "cursor-a"],
				["cursor-a", "cursor-b", "cursor-b"],
				["cursor-a", "cursor-b", "cursor-a"],
			]) {
				const executor = new CatalogExecutor((kind, call) => {
					if (kind !== faulty) return validTerminal(kind);
					const next = sequence[call - 1];
					if (next === undefined)
						throw new Error("pagination exceeded deterministic bound");
					return page(kind, [], true, next);
				});
				await assert.rejects(
					new ProjectV2Client(executor.execute).inspectProject("example", 3),
					/cursor did not advance/,
				);
				assert.ok(catalogCalls(executor, faulty).length <= sequence.length);
			}
		}
	});

	it("R2.C rejects null, empty, and missing next cursors for both connections", async () => {
		for (const faulty of ["fields", "views"] as const) {
			for (const invalid of [null, "", undefined]) {
				const executor = new CatalogExecutor((kind) =>
					kind === faulty ? page(kind, [], true, invalid) : validTerminal(kind),
				);
				await assert.rejects(
					new ProjectV2Client(executor.execute).inspectProject("example", 3),
				);
				assert.equal(catalogCalls(executor, faulty).length, 1);
			}
		}
	});
});
