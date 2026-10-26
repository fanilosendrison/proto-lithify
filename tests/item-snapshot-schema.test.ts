import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { z } from "zod";
import {
	ItemSnapshotSchema,
	LegacyCommandReceiptV1Schema,
} from "../src/receipts/schemas.ts";

const historicalSnapshot = {
	project: { id: "PVT_project", number: 3, owner: "example", title: "Engineering" },
	issue: { id: "I_issue", number: 42, repository: "example/repository" },
	itemId: "PVTI_item",
	fields: { Status: "Ready" },
};

describe("ItemSnapshot archived-state schema", () => {
	it("T22 requires a noncoerced boolean at runtime", () => {
		for (const invalid of [undefined, null, "false", 0, 1]) {
			const candidate =
				invalid === undefined
					? historicalSnapshot
					: { ...historicalSnapshot, isArchived: invalid };
			assert.equal(ItemSnapshotSchema.safeParse(candidate).success, false);
		}
		assert.equal(
			ItemSnapshotSchema.parse({ ...historicalSnapshot, isArchived: true }).isArchived,
			true,
		);
	});

	it("T22 keeps the generic v1 envelope compatible with historical payloads", () => {
		const receipt = LegacyCommandReceiptV1Schema.parse({
			schemaVersion: 1,
			command: "item.inspect",
			outcome: "inspected",
			target: {},
			request: {},
			before: null,
			after: historicalSnapshot,
			postcondition: { verified: true, description: "historical observation" },
		});
		assert.equal(receipt.schemaVersion, 1);
		assert.equal(ItemSnapshotSchema.safeParse(receipt.after).success, false);
	});

	it("T22 keeps the generated JSON Schema byte-for-byte fresh", async () => {
		const schemaPath = path.resolve(
			import.meta.dirname,
			"../schemas/item-snapshot.schema.json",
		);
		const actual = await readFile(schemaPath, "utf8");
		const rendered = `${JSON.stringify(
			z.toJSONSchema(ItemSnapshotSchema, { target: "draft-2020-12" }),
			null,
			"\t",
		)}\n`;
		const format = spawnSync(
			path.resolve(import.meta.dirname, "../node_modules/.bin/biome"),
			["format", "--stdin-file-path", schemaPath],
			{ input: rendered, encoding: "utf8", shell: false },
		);
		assert.equal(format.status, 0, format.stderr);
		assert.equal(actual, format.stdout);
		const parsed = JSON.parse(actual);
		assert.ok(parsed.required.includes("isArchived"));
		assert.equal(parsed.properties.isArchived.type, "boolean");
	});
});
