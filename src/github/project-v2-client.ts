import { z } from "zod";
import type {
	GithubProjectGateway,
	ItemInspectionRequest,
} from "../project-items/types.ts";
import {
	type ItemSnapshot,
	ItemSnapshotSchema,
	type ProjectIdentity,
	type ProjectSnapshot,
	ProjectSnapshotSchema,
} from "../receipts/schemas.ts";
import { githubIssueUrl, splitGitHubRepository } from "./issue-identity.ts";
import {
	observeProjectCatalog,
	observeResolvableProjectFields,
} from "./project-catalog-observation.ts";
import {
	assertProjectFieldObservation,
	assertProjectGraphqlResponseHasNoErrors,
	nextProjectObservationCursor,
	type ProjectMembershipObservation,
	parseProjectMembershipObservation,
	resolveProjectItemMembership,
} from "./project-item-membership.ts";
import type { GhExecutor } from "./types.ts";

export { ProjectItemNotFoundError } from "./project-item-membership.ts";

const PageInfoSchema = z.object({
	hasNextPage: z.boolean(),
	endCursor: z.string().nullable(),
});

const ProjectViewSchema = z.object({
	id: z.string().min(1),
	number: z.number().int().positive(),
	title: z.string().min(1),
	url: z.string().url(),
});

const ISSUE_PROJECT_ITEMS_QUERY = `query($owner:String!,$repository:String!,$number:Int!,$cursor:String){repository(owner:$owner,name:$repository){issue(number:$number){id projectItems(first:100,after:$cursor,includeArchived:true){nodes{id isArchived project{id number title url}} pageInfo{hasNextPage endCursor}}}}}`;
const PROJECT_COLLECTION_ITEMS_QUERY = `query($projectId:ID!,$cursor:String){node(id:$projectId){... on ProjectV2{items(first:100,after:$cursor,archivedStates:[ARCHIVED,NOT_ARCHIVED]){nodes{id isArchived content{... on Issue{id}}} pageInfo{hasNextPage endCursor}}}}}`;
const ITEM_FIELDS_QUERY = `query($itemId:ID!,$cursor:String){node(id:$itemId){... on ProjectV2Item{id isArchived fieldValues(first:100,after:$cursor){nodes{__typename ... on ProjectV2ItemFieldSingleSelectValue{name field{... on ProjectV2FieldCommon{name}}} ... on ProjectV2ItemFieldTextValue{text field{... on ProjectV2FieldCommon{name}}} ... on ProjectV2ItemFieldNumberValue{number field{... on ProjectV2FieldCommon{name}}} ... on ProjectV2ItemFieldDateValue{date field{... on ProjectV2FieldCommon{name}}} ... on ProjectV2ItemFieldIterationValue{title field{... on ProjectV2FieldCommon{name}}}} pageInfo{hasNextPage endCursor}}}}}`;

interface ConnectionPage<T> {
	readonly nodes: readonly T[];
	readonly pageInfo: z.infer<typeof PageInfoSchema>;
}

type JsonRecord = Readonly<Record<string, unknown>>;

function asRecord(value: unknown, description: string): JsonRecord {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		throw new Error(`${description} must be an object`);
	}
	return value as JsonRecord;
}

function asString(value: unknown, description: string): string {
	if (typeof value !== "string" || value.length === 0) {
		throw new Error(`${description} must be a non-empty string`);
	}
	return value;
}

function connection(value: unknown, description: string): ConnectionPage<JsonRecord> {
	const record = asRecord(value, description);
	const nodes = z.array(z.record(z.string(), z.unknown())).parse(record.nodes);
	const pageInfo = PageInfoSchema.parse(record.pageInfo);
	if (pageInfo.hasNextPage && pageInfo.endCursor === null) {
		throw new Error(`${description} has another page but no cursor`);
	}
	return { nodes, pageInfo };
}

export class ProjectV2Client implements GithubProjectGateway {
	private readonly execute: GhExecutor;

	constructor(execute: GhExecutor) {
		this.execute = execute;
	}

	async getProject(owner: string, number: number): Promise<ProjectIdentity> {
		const output = await this.execute([
			"project",
			"view",
			String(number),
			"--owner",
			owner,
			"--format",
			"json",
		]);
		const parsed = ProjectViewSchema.parse(JSON.parse(output.stdout));
		return { ...parsed, owner };
	}

	async inspectProject(owner: string, number: number): Promise<ProjectSnapshot> {
		const project = await this.getProject(owner, number);
		const catalog = await observeProjectCatalog(
			project.id,
			async (query, variables) => await this.graphql(query, variables),
		);
		return ProjectSnapshotSchema.parse({ project, ...catalog });
	}

	async inspectItem(request: ItemInspectionRequest): Promise<ItemSnapshot> {
		const project = await this.getProject(request.projectOwner, request.projectNumber);
		const [repositoryOwner, repositoryName] = splitGitHubRepository(request.repository);
		let cursor: string | null = null;
		let issueId: string | null = null;
		const issueMatches: ProjectMembershipObservation[] = [];
		const issueCursors = new Set<string>();

		do {
			const response = await this.graphql(ISSUE_PROJECT_ITEMS_QUERY, {
				owner: repositoryOwner,
				repository: repositoryName,
				number: request.issueNumber,
				cursor,
			});
			const repository = asRecord(
				asRecord(response.data, "GraphQL data").repository,
				"GraphQL repository",
			);
			const issueValue = repository.issue;
			if (issueValue === null) {
				throw new Error(
					`Issue ${request.repository}#${request.issueNumber} was not found`,
				);
			}
			const issue = asRecord(issueValue, "GraphQL Issue");
			const pageIssueId = asString(issue.id, "Issue id");
			if (issueId !== null && issueId !== pageIssueId) {
				throw new Error("Issue id changed during Project item pagination");
			}
			issueId = pageIssueId;
			const page = connection(issue.projectItems, "Issue Project items");
			for (const node of page.nodes) {
				const nodeProject = asRecord(node.project, "Project item Project");
				const nodeProjectId = asString(nodeProject.id, "Project item Project id");
				if (nodeProjectId === project.id) {
					issueMatches.push(
						parseProjectMembershipObservation(
							node.id,
							node.isArchived,
							"Issue-side Project item",
						),
					);
				}
			}
			cursor = nextProjectObservationCursor(
				page,
				cursor,
				issueCursors,
				"Issue Project items",
			);
		} while (cursor !== null);

		const exactIssueId = asString(issueId, "Issue id");
		const projectMatches = await this.findProjectItems(project.id, exactIssueId);
		const membership = resolveProjectItemMembership(
			request,
			issueMatches,
			projectMatches,
		);
		const fields = await this.readItemFields(membership);
		return ItemSnapshotSchema.parse({
			project,
			issue: {
				id: issueId,
				number: request.issueNumber,
				repository: request.repository,
			},
			itemId: membership.id,
			isArchived: membership.isArchived,
			fields,
		});
	}

	async resolveSingleSelect(
		projectId: string,
		fieldName: string,
		optionName: string,
	): Promise<{ readonly fieldId: string; readonly optionId: string }> {
		const fields = await observeResolvableProjectFields(
			projectId,
			async (query, variables) => await this.graphql(query, variables),
		);
		const matches = fields.filter(
			(field) => field.name === fieldName && field.options !== undefined,
		);
		if (matches.length !== 1) {
			throw new Error(
				`Expected exactly one field named ${JSON.stringify(fieldName)}; found ${matches.length}`,
			);
		}
		const options =
			matches[0]?.options?.filter((option) => option.name === optionName) ?? [];
		if (options.length !== 1) {
			throw new Error(
				`Expected exactly one option named ${JSON.stringify(optionName)} in field ${JSON.stringify(fieldName)}; found ${options.length}`,
			);
		}
		return {
			fieldId: asString(matches[0]?.id, "field id"),
			optionId: asString(options[0]?.id, "option id"),
		};
	}

	async editSingleSelect(request: {
		readonly projectId: string;
		readonly itemId: string;
		readonly fieldId: string;
		readonly optionId: string;
	}): Promise<void> {
		await this.execute([
			"project",
			"item-edit",
			"--id",
			request.itemId,
			"--project-id",
			request.projectId,
			"--field-id",
			request.fieldId,
			"--single-select-option-id",
			request.optionId,
		]);
	}

	async addItem(request: ItemInspectionRequest): Promise<void> {
		const issueUrl = githubIssueUrl(request.repository, request.issueNumber);
		await this.execute([
			"project",
			"item-add",
			String(request.projectNumber),
			"--owner",
			request.projectOwner,
			"--url",
			issueUrl,
			"--format",
			"json",
		]);
	}

	private async findProjectItems(
		projectId: string,
		issueId: string,
	): Promise<readonly ProjectMembershipObservation[]> {
		let cursor: string | null = null;
		const matches: ProjectMembershipObservation[] = [];
		const cursors = new Set<string>();
		do {
			const response = await this.graphql(PROJECT_COLLECTION_ITEMS_QUERY, {
				projectId,
				cursor,
			});
			const node = asRecord(asRecord(response.data, "GraphQL data").node, "Project");
			const page = connection(node.items, "Project items");
			for (const item of page.nodes) {
				if (typeof item.content !== "object" || item.content === null) continue;
				const content = asRecord(item.content, "Project item content");
				if (content.id !== undefined && typeof content.id !== "string") {
					throw new Error("Project item Issue id must be a string");
				}
				if (content.id === issueId) {
					matches.push(
						parseProjectMembershipObservation(
							item.id,
							item.isArchived,
							"Project-side Project item",
						),
					);
				}
			}
			cursor = nextProjectObservationCursor(page, cursor, cursors, "Project items");
		} while (cursor !== null);
		return matches;
	}

	private async graphql(
		query: string,
		variables: Readonly<Record<string, string | number | null>>,
	): Promise<JsonRecord> {
		const args = ["api", "graphql", "-f", `query=${query}`];
		for (const [name, value] of Object.entries(variables)) {
			if (value === null) continue;
			args.push(typeof value === "number" ? "-F" : "-f", `${name}=${value}`);
		}
		const output = await this.execute(args);
		const response = asRecord(JSON.parse(output.stdout), "GraphQL response");
		assertProjectGraphqlResponseHasNoErrors(response);
		return response;
	}

	private async readItemFields(
		membership: ProjectMembershipObservation,
	): Promise<Record<string, string | null>> {
		let cursor: string | null = null;
		const fields: Record<string, string | null> = {};
		const cursors = new Set<string>();
		do {
			const response = await this.graphql(ITEM_FIELDS_QUERY, {
				itemId: membership.id,
				cursor,
			});
			const node = asRecord(
				asRecord(response.data, "GraphQL data").node,
				"Project item",
			);
			assertProjectFieldObservation(node.id, node.isArchived, membership);
			const page = connection(node.fieldValues, "Project item field values");
			for (const fieldValue of page.nodes) {
				if (
					typeof fieldValue.field !== "object" ||
					fieldValue.field === null ||
					Array.isArray(fieldValue.field)
				) {
					continue;
				}
				const field = fieldValue.field as JsonRecord;
				const name = asString(field.name, "Project item field name");
				if (Object.hasOwn(fields, name)) {
					throw new Error(
						`Duplicate Project item field value for ${JSON.stringify(name)}`,
					);
				}
				const value =
					fieldValue.name ??
					fieldValue.text ??
					fieldValue.number ??
					fieldValue.date ??
					fieldValue.title ??
					null;
				fields[name] = value === null ? null : String(value);
			}
			cursor = nextProjectObservationCursor(
				page,
				cursor,
				cursors,
				"Project item field values",
			);
		} while (cursor !== null);
		return fields;
	}
}
