import { z } from "zod";
import type { ProjectSnapshot } from "../receipts/schemas.ts";
import { nextProjectObservationCursor } from "./project-item-membership.ts";

const PROJECT_FIELDS_QUERY = `query($projectId:ID!,$cursor:String){node(id:$projectId){... on ProjectV2{fields(first:100,after:$cursor){nodes{__typename ... on ProjectV2Field{id name dataType} ... on ProjectV2IterationField{id name} ... on ProjectV2SingleSelectField{id name options{id name}}} pageInfo{hasNextPage endCursor}}}}}`;
const PROJECT_VIEWS_QUERY = `query($projectId:ID!,$cursor:String){node(id:$projectId){... on ProjectV2{views(first:100,after:$cursor){nodes{name layout filter} pageInfo{hasNextPage endCursor}}}}}`;

const PageInfoSchema = z.object({
	hasNextPage: z.boolean(),
	endCursor: z.string().nullable(),
});

type JsonRecord = Readonly<Record<string, unknown>>;
type CatalogGraphql = (
	query: string,
	variables: Readonly<Record<string, string | number | null>>,
) => Promise<JsonRecord>;

interface ConnectionPage {
	readonly nodes: readonly JsonRecord[];
	readonly pageInfo: z.infer<typeof PageInfoSchema>;
}

export async function observeProjectCatalog(
	projectId: string,
	graphql: CatalogGraphql,
): Promise<Pick<ProjectSnapshot, "fields" | "views">> {
	const [fields, views] = await Promise.all([
		observeProjectFields(projectId, graphql),
		observeProjectViews(projectId, graphql),
	]);
	return { fields, views };
}

export async function observeProjectFields(
	projectId: string,
	graphql: CatalogGraphql,
): Promise<ProjectSnapshot["fields"]> {
	let cursor: string | null = null;
	const cursors = new Set<string>();
	const fieldIds = new Set<string>();
	const fields: ProjectSnapshot["fields"][number][] = [];
	do {
		const response = await graphql(PROJECT_FIELDS_QUERY, { projectId, cursor });
		const node = asRecord(asRecord(response.data, "GraphQL data").node, "Project");
		const page = connection(node.fields, "Project fields");
		for (const field of page.nodes) {
			const parsed = parseField(field);
			if (fieldIds.has(parsed.id)) {
				throw new Error(`Duplicate Project field id: ${parsed.id}`);
			}
			fieldIds.add(parsed.id);
			fields.push(parsed);
		}
		cursor = nextProjectObservationCursor(page, cursor, cursors, "Project fields");
	} while (cursor !== null);
	return fields;
}

async function observeProjectViews(
	projectId: string,
	graphql: CatalogGraphql,
): Promise<ProjectSnapshot["views"]> {
	let cursor: string | null = null;
	const cursors = new Set<string>();
	const views: ProjectSnapshot["views"][number][] = [];
	do {
		const response = await graphql(PROJECT_VIEWS_QUERY, { projectId, cursor });
		const node = asRecord(asRecord(response.data, "GraphQL data").node, "Project");
		const page = connection(node.views, "Project views");
		for (const view of page.nodes) {
			if (!Object.hasOwn(view, "filter")) {
				throw new Error("Project view filter property is missing");
			}
			if (view.filter !== null && typeof view.filter !== "string") {
				throw new Error("Project view filter must be a string or null");
			}
			views.push({
				name: asString(view.name, "Project view name"),
				layout: asString(view.layout, "Project view layout"),
				filter: view.filter ?? "",
			});
		}
		cursor = nextProjectObservationCursor(page, cursor, cursors, "Project views");
	} while (cursor !== null);
	return views;
}

function parseField(field: JsonRecord): ProjectSnapshot["fields"][number] {
	const typename = asString(field.__typename, "Project field type discriminator");
	if (
		typename !== "ProjectV2Field" &&
		typename !== "ProjectV2IterationField" &&
		typename !== "ProjectV2SingleSelectField"
	) {
		throw new Error(`Unrepresentable Project field type: ${typename}`);
	}
	const id = asString(field.id, "Project field id");
	const name = asString(field.name, "Project field name");
	if (typename === "ProjectV2Field") {
		return { id, name, type: asString(field.dataType, "Project field data type") };
	}
	if (typename === "ProjectV2IterationField") {
		return { id, name, type: typename };
	}
	if (!Array.isArray(field.options)) {
		throw new Error("Project single-select field options must be an array");
	}
	return {
		id,
		name,
		type: typename,
		options: field.options.map((option) => {
			const record = asRecord(option, "Project single-select option");
			return {
				id: asString(record.id, "Project single-select option id"),
				name: asString(record.name, "Project single-select option name"),
			};
		}),
	};
}

function connection(value: unknown, description: string): ConnectionPage {
	const record = asRecord(value, description);
	return {
		nodes: z.array(z.record(z.string(), z.unknown())).parse(record.nodes),
		pageInfo: PageInfoSchema.parse(record.pageInfo),
	};
}

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
