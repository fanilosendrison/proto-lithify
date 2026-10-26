import { z } from "zod";
import {
	DependencySnapshotSchema,
	ItemSnapshotSchema,
	ProjectSnapshotSchema,
	RECEIPT_GITHUB_REPOSITORY_IDENTITY_PATTERN,
} from "./snapshot-schemas.ts";

export const LEGACY_SCHEMA_VERSION = 1 as const;
export const SUCCESS_RECEIPT_SCHEMA_VERSION = 2 as const;

const PositiveSafeIntegerSchema = z
	.number()
	.int()
	.positive()
	.max(Number.MAX_SAFE_INTEGER);
const RepositorySchema = z.string().regex(RECEIPT_GITHUB_REPOSITORY_IDENTITY_PATTERN);
const repositoryPatternSource = RECEIPT_GITHUB_REPOSITORY_IDENTITY_PATTERN.source.slice(
	1,
	-1,
);
const CanonicalIssueUrlSchema = z
	.string()
	.regex(
		new RegExp(`^https://github\\.com/${repositoryPatternSource}/issues/[1-9]\\d*$`),
	);
const EmptySchema = z.strictObject({});
const PostconditionSchema = z.strictObject({
	verified: z.literal(true),
	description: z.string().min(1),
});
const ProjectTargetSchema = z.strictObject({
	projectOwner: z.string().min(1),
	projectNumber: PositiveSafeIntegerSchema,
});
const ItemTargetSchema = z.strictObject({
	projectOwner: z.string().min(1),
	projectNumber: PositiveSafeIntegerSchema,
	repository: RepositorySchema,
	issueNumber: PositiveSafeIntegerSchema,
});
const DependencyTargetSchema = z.strictObject({
	repository: RepositorySchema,
	issueNumber: PositiveSafeIntegerSchema,
});
const ItemAddRequestSchema = z.strictObject({ issueUrl: CanonicalIssueUrlSchema });
const FieldSetRequestSchema = z.strictObject({
	fieldName: z.string().min(1),
	optionName: z.string().min(1),
});
const DependencyRequestSchema = z.strictObject({
	blockerNumber: PositiveSafeIntegerSchema,
});
const DoctorSnapshotSchema = z.strictObject({
	ghVersion: z.string().min(1),
	authenticated: z.literal(true),
});
const currentFields = {
	schemaVersion: z.literal(SUCCESS_RECEIPT_SCHEMA_VERSION),
	postcondition: PostconditionSchema,
} as const;

const DoctorReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("doctor"),
	outcome: z.literal("inspected"),
	target: EmptySchema,
	request: EmptySchema,
	before: z.null(),
	after: DoctorSnapshotSchema,
});
const ProjectInspectReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("project.inspect"),
	outcome: z.literal("inspected"),
	target: ProjectTargetSchema,
	request: EmptySchema,
	before: z.null(),
	after: ProjectSnapshotSchema,
});
const ItemInspectReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("item.inspect"),
	outcome: z.literal("inspected"),
	target: ItemTargetSchema,
	request: EmptySchema,
	before: z.null(),
	after: ItemSnapshotSchema,
});
const ItemAddNoopReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("item.add"),
	outcome: z.literal("noop"),
	target: ItemTargetSchema,
	request: ItemAddRequestSchema,
	before: ItemSnapshotSchema,
	after: ItemSnapshotSchema,
});
const ItemAddAppliedReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("item.add"),
	outcome: z.literal("applied"),
	target: ItemTargetSchema,
	request: ItemAddRequestSchema,
	before: z.null(),
	after: ItemSnapshotSchema,
});
const FieldSetNoopReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("field.set"),
	outcome: z.literal("noop"),
	target: ItemTargetSchema,
	request: FieldSetRequestSchema,
	before: ItemSnapshotSchema,
	after: ItemSnapshotSchema,
});
const FieldSetAppliedReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("field.set"),
	outcome: z.literal("applied"),
	target: ItemTargetSchema,
	request: FieldSetRequestSchema,
	before: ItemSnapshotSchema,
	after: ItemSnapshotSchema,
});
const DependencyNoopReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("dependency.add-blocker"),
	outcome: z.literal("noop"),
	target: DependencyTargetSchema,
	request: DependencyRequestSchema,
	before: DependencySnapshotSchema,
	after: DependencySnapshotSchema,
});
const DependencyAppliedReceiptSchema = z.strictObject({
	...currentFields,
	command: z.literal("dependency.add-blocker"),
	outcome: z.literal("applied"),
	target: DependencyTargetSchema,
	request: DependencyRequestSchema,
	before: DependencySnapshotSchema,
	after: DependencySnapshotSchema,
});

export const LegacyCommandReceiptV1Schema = z.object({
	schemaVersion: z.literal(LEGACY_SCHEMA_VERSION),
	command: z.string().min(1),
	outcome: z.enum(["inspected", "applied", "noop"]),
	target: z.record(z.string(), z.union([z.string(), z.number()])),
	request: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
	before: z.unknown().nullable().optional(),
	after: z.unknown().nullable().optional(),
	postcondition: z.object({
		verified: z.boolean(),
		description: z.string().min(1),
	}),
});

export const CommandReceiptSchema = z.union([
	DoctorReceiptSchema,
	ProjectInspectReceiptSchema,
	ItemInspectReceiptSchema,
	ItemAddNoopReceiptSchema,
	ItemAddAppliedReceiptSchema,
	FieldSetNoopReceiptSchema,
	FieldSetAppliedReceiptSchema,
	DependencyNoopReceiptSchema,
	DependencyAppliedReceiptSchema,
]);

export const VersionedCommandReceiptSchema = z.union([
	LegacyCommandReceiptV1Schema,
	CommandReceiptSchema,
]);

export type ReceiptOutcome = "inspected" | "applied" | "noop";

export interface CommandReceipt<TBefore, TAfter> {
	readonly schemaVersion: 2;
	readonly command: string;
	readonly outcome: ReceiptOutcome;
	readonly target: Readonly<Record<string, string | number>>;
	readonly request: Readonly<Record<string, string | number | boolean>>;
	readonly before: TBefore | null;
	readonly after: TAfter | null;
	readonly postcondition: {
		readonly verified: true;
		readonly description: string;
	};
}

export function commandReceipt<TBefore, TAfter>(
	value: Omit<CommandReceipt<TBefore, TAfter>, "schemaVersion">,
): CommandReceipt<TBefore, TAfter> {
	return { schemaVersion: SUCCESS_RECEIPT_SCHEMA_VERSION, ...value };
}
