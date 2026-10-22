import type { ItemInspectionRequest } from "../project-items/types.ts";

export class ProjectItemNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ProjectItemNotFoundError";
	}
}

export function resolveProjectItemMembership(
	request: ItemInspectionRequest,
	issueItemIds: readonly string[],
	projectItemIds: readonly string[],
): string {
	if (issueItemIds.length === 0 && projectItemIds.length === 0) {
		throw new ProjectItemNotFoundError(
			`Issue ${request.repository}#${request.issueNumber} is not in Project ${request.projectOwner}/${request.projectNumber}`,
		);
	}
	if (issueItemIds.length !== 1 || projectItemIds.length !== 1) {
		throw new Error(
			`Inconsistent Project item membership for ${request.repository}#${request.issueNumber} in ${request.projectOwner}/${request.projectNumber}: Issue-side found ${issueItemIds.length}; Project-side found ${projectItemIds.length}`,
		);
	}
	const issueItemId = issueItemIds[0];
	const projectItemId = projectItemIds[0];
	if (issueItemId === undefined || projectItemId === undefined) {
		throw new Error("Project item identity resolution failed");
	}
	if (issueItemId !== projectItemId) {
		throw new Error(
			`Inconsistent Project item membership for ${request.repository}#${request.issueNumber} in ${request.projectOwner}/${request.projectNumber}: Issue-side and Project-side item ids differ`,
		);
	}
	return issueItemId;
}
