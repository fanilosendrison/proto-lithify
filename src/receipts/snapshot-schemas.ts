import { z } from "zod";

export const RECEIPT_GITHUB_REPOSITORY_IDENTITY_PATTERN =
	/^(?![\s\S]*[\r\n\u2028\u2029])[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/[A-Za-z0-9._-]{1,100}$/;

const CanonicalGitHubProjectUrlPattern =
	/^(?![\s\S]*[\r\n\u2028\u2029])https:\/\/github\.com\/(?:users|orgs)\/[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/projects\/[1-9]\d*$/;
const ProjectUrlSchema = z.string().regex(CanonicalGitHubProjectUrlPattern);

export const ProjectIdentitySchema = z.strictObject({
	id: z.string().min(1),
	number: z.number().int().positive(),
	owner: z.string().min(1),
	title: z.string().min(1),
	url: ProjectUrlSchema.optional(),
});

export const IssueIdentitySchema = z.strictObject({
	id: z.string().min(1),
	number: z.number().int().positive(),
	repository: z.string().regex(RECEIPT_GITHUB_REPOSITORY_IDENTITY_PATTERN),
});

export const DependencyBlockerSchema = z.strictObject({
	id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	repository: z.string().regex(RECEIPT_GITHUB_REPOSITORY_IDENTITY_PATTERN),
	number: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
});

export const DependencySnapshotSchema = z.strictObject({
	blockedBy: z.array(z.number().int().positive().max(Number.MAX_SAFE_INTEGER)),
	blockedByIssues: z.array(DependencyBlockerSchema),
});

export const ItemSnapshotSchema = z.strictObject({
	project: ProjectIdentitySchema,
	issue: IssueIdentitySchema,
	itemId: z.string().min(1),
	isArchived: z.boolean(),
	fields: z.record(z.string(), z.string().nullable()),
});

const ProjectFieldSchema = z.strictObject({
	id: z.string().min(1),
	name: z.string().min(1),
	type: z.string().min(1),
	options: z.array(z.strictObject({ id: z.string(), name: z.string() })).optional(),
});

const ProjectViewSchema = z.strictObject({
	name: z.string().min(1),
	layout: z.string().min(1),
	filter: z.string(),
});

export const ProjectSnapshotSchema = z.strictObject({
	project: ProjectIdentitySchema,
	fields: z.array(ProjectFieldSchema),
	views: z.array(ProjectViewSchema),
});

export type ProjectIdentity = z.infer<typeof ProjectIdentitySchema>;
export type IssueIdentity = z.infer<typeof IssueIdentitySchema>;
export type DependencyBlocker = z.infer<typeof DependencyBlockerSchema>;
export type DependencySnapshot = z.infer<typeof DependencySnapshotSchema>;
export type ItemSnapshot = z.infer<typeof ItemSnapshotSchema>;
export type ProjectSnapshot = z.infer<typeof ProjectSnapshotSchema>;
