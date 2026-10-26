import { z } from "zod";
import { LEGACY_SCHEMA_VERSION } from "./command-receipt-schemas.ts";

export const ERROR_RECEIPT_SCHEMA_VERSION = 2 as const;

const ErrorPayloadSchema = z.strictObject({
	code: z.string().min(1),
	message: z.string().min(1),
});

export const LegacyErrorReceiptV1Schema = z.object({
	schemaVersion: z.literal(LEGACY_SCHEMA_VERSION),
	error: z.object({
		code: z.string().min(1),
		message: z.string().min(1),
	}),
});

export const ErrorReceiptSchema = z.strictObject({
	schemaVersion: z.literal(ERROR_RECEIPT_SCHEMA_VERSION),
	error: ErrorPayloadSchema,
});

export const VersionedErrorReceiptSchema = z.union([
	LegacyErrorReceiptV1Schema,
	ErrorReceiptSchema,
]);
