import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
	CommandReceiptSchema,
	DependencySnapshotSchema,
	ErrorReceiptSchema,
	ItemSnapshotSchema,
	LegacyCommandReceiptV1Schema,
	LegacyErrorReceiptV1Schema,
	ProjectSnapshotSchema,
	VersionedCommandReceiptSchema,
	VersionedErrorReceiptSchema,
} from "../dist/tsc/receipts/schemas.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaDirectory = path.join(repositoryRoot, "schemas");
await mkdir(schemaDirectory, { recursive: true });

const schemas = [
	["command-receipt.schema.json", CommandReceiptSchema, false],
	["error-receipt.schema.json", ErrorReceiptSchema, false],
	["command-receipt-v1.schema.json", LegacyCommandReceiptV1Schema, true],
	["error-receipt-v1.schema.json", LegacyErrorReceiptV1Schema, true],
	["versioned-command-receipt.schema.json", VersionedCommandReceiptSchema, true],
	["versioned-error-receipt.schema.json", VersionedErrorReceiptSchema, true],
	["dependency-snapshot.schema.json", DependencySnapshotSchema, false],
	["item-snapshot.schema.json", ItemSnapshotSchema, false],
	["project-snapshot.schema.json", ProjectSnapshotSchema, false],
];

for (const [filename, schema, inputMode] of schemas) {
	const jsonSchema = z.toJSONSchema(
		schema,
		inputMode ? { target: "draft-2020-12", io: "input" } : { target: "draft-2020-12" },
	);
	await writeFile(
		path.join(schemaDirectory, filename),
		`${JSON.stringify(jsonSchema, null, "\t")}\n`,
	);
}
