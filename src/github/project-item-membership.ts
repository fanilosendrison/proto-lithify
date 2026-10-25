import type { ItemInspectionRequest } from "../project-items/types.ts";

export class ProjectItemNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ProjectItemNotFoundError";
	}
}

export interface ProjectMembershipObservation {
	readonly id: string;
	readonly isArchived: boolean;
}

export function assertProjectGraphqlResponseHasNoErrors(
	response: Readonly<Record<string, unknown>>,
): void {
	if (
		Object.hasOwn(response, "errors") &&
		(!Array.isArray(response.errors) || response.errors.length > 0)
	) {
		throw new Error("GraphQL response errors member is malformed or contains errors");
	}
}

export function assertProjectFieldObservation(
	observedId: unknown,
	observedArchiveState: unknown,
	expected: ProjectMembershipObservation,
): void {
	const observed = parseProjectMembershipObservation(
		observedId,
		observedArchiveState,
		"Project item",
	);
	if (observed.id !== expected.id) {
		throw new Error("Project item id changed during field pagination");
	}
	if (observed.isArchived !== expected.isArchived) {
		throw new Error("Project item archive state changed during field pagination");
	}
}

export function parseProjectMembershipObservation(
	id: unknown,
	isArchived: unknown,
	description: string,
): ProjectMembershipObservation {
	if (typeof id !== "string" || id.length === 0) {
		throw new Error(`${description} id must be a non-empty string`);
	}
	return { id, isArchived: parseProjectArchiveState(isArchived, description) };
}

export function parseProjectArchiveState(value: unknown, description: string): boolean {
	if (typeof value !== "boolean") throw new Error(`${description} must be a boolean`);
	return value;
}

export function nextProjectObservationCursor(
	page: {
		readonly pageInfo: {
			readonly hasNextPage: boolean;
			readonly endCursor: string | null;
		};
	},
	current: string | null,
	seen: Set<string>,
	description: string,
): string | null {
	if (!page.pageInfo.hasNextPage) return null;
	const next = page.pageInfo.endCursor;
	if (typeof next !== "string" || next.length === 0) {
		throw new Error(`${description} has another page but no cursor`);
	}
	if (next === current || seen.has(next)) {
		throw new Error(`${description} cursor did not advance`);
	}
	seen.add(next);
	return next;
}

export function resolveProjectItemMembership(
	request: ItemInspectionRequest,
	issueItems: readonly ProjectMembershipObservation[],
	projectItems: readonly ProjectMembershipObservation[],
): ProjectMembershipObservation {
	if (issueItems.length === 0 && projectItems.length === 0) {
		throw new ProjectItemNotFoundError(
			`Issue ${request.repository}#${request.issueNumber} is not in Project ${request.projectOwner}/${request.projectNumber}`,
		);
	}
	if (issueItems.length !== 1 || projectItems.length !== 1) {
		throw new Error(
			`Inconsistent Project item membership for ${request.repository}#${request.issueNumber} in ${request.projectOwner}/${request.projectNumber}: Issue-side found ${issueItems.length}; Project-side found ${projectItems.length}`,
		);
	}
	const issueItem = issueItems[0];
	const projectItem = projectItems[0];
	if (issueItem === undefined || projectItem === undefined) {
		throw new Error("Project item identity resolution failed");
	}
	if (issueItem.id !== projectItem.id) {
		throw new Error(
			`Inconsistent Project item membership for ${request.repository}#${request.issueNumber} in ${request.projectOwner}/${request.projectNumber}: Issue-side and Project-side item ids differ`,
		);
	}
	if (issueItem.isArchived !== projectItem.isArchived) {
		throw new Error(
			`Inconsistent Project item membership for ${request.repository}#${request.issueNumber} in ${request.projectOwner}/${request.projectNumber}: Issue-side and Project-side archive states differ`,
		);
	}
	return issueItem;
}
