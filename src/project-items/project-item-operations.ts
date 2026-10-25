import { githubIssueUrl, splitGitHubRepository } from "../github/issue-identity.ts";
import { ProjectItemNotFoundError } from "../github/project-v2-client.ts";
import {
	type CommandReceipt,
	commandReceipt,
	type ItemSnapshot,
	ItemSnapshotSchema,
} from "../receipts/schemas.ts";
import type {
	GithubProjectGateway,
	ItemInspectionRequest,
	SingleSelectRequest,
} from "./types.ts";

export class ProjectItemOperations {
	private readonly gateway: GithubProjectGateway;

	constructor(gateway: GithubProjectGateway) {
		this.gateway = gateway;
	}

	async setSingleSelect(
		request: SingleSelectRequest,
	): Promise<CommandReceipt<ItemSnapshot, ItemSnapshot>> {
		const before = validateRequestedTarget(
			request,
			await this.gateway.inspectItem(request),
		);
		if (before.fields[request.fieldName] === request.optionName) {
			return commandReceipt({
				command: "field.set",
				outcome: "noop",
				target: targetOf(request),
				request: {
					fieldName: request.fieldName,
					optionName: request.optionName,
				},
				before,
				after: before,
				postcondition: {
					verified: true,
					description: "The exact inspected target already has the requested option",
				},
			});
		}

		const { fieldId, optionId } = await this.gateway.resolveSingleSelect(
			before.project.id,
			request.fieldName,
			request.optionName,
		);
		await this.gateway.editSingleSelect({
			projectId: before.project.id,
			itemId: before.itemId,
			fieldId,
			optionId,
		});
		const after = await inspectAfterSubmittedMutation(
			"Field mutation",
			request,
			this.gateway,
		);
		assertSameTarget(before, after);
		if (after.fields[request.fieldName] !== request.optionName) {
			throw new Error(
				`Field mutation postcondition failed after submission: ${JSON.stringify(request.fieldName)} is not ${JSON.stringify(request.optionName)}; do not retry automatically`,
			);
		}

		return commandReceipt({
			command: "field.set",
			outcome: "applied",
			target: targetOf(request),
			request: { fieldName: request.fieldName, optionName: request.optionName },
			before,
			after,
			postcondition: {
				verified: true,
				description:
					"A fresh read observed the requested option on the same exact target identity",
			},
		});
	}

	async addItem(
		request: ItemInspectionRequest,
	): Promise<CommandReceipt<ItemSnapshot | null, ItemSnapshot>> {
		const issueUrl = githubIssueUrl(request.repository, request.issueNumber);
		let before: ItemSnapshot | null = null;
		try {
			before = validateRequestedTarget(
				request,
				await this.gateway.inspectItem(request),
			);
		} catch (error) {
			if (!(error instanceof ProjectItemNotFoundError)) throw error;
		}
		if (before !== null) {
			return commandReceipt({
				command: "item.add",
				outcome: "noop",
				target: targetOf(request),
				request: { issueUrl },
				before,
				after: before,
				postcondition: {
					verified: true,
					description:
						"The exact Issue already has one validated membership in the requested Project",
				},
			});
		}

		await this.gateway.addItem(request);
		const after = await inspectAfterSubmittedMutation(
			"Project item addition",
			request,
			this.gateway,
		);
		return commandReceipt({
			command: "item.add",
			outcome: "applied",
			target: targetOf(request),
			request: { issueUrl },
			before: null,
			after,
			postcondition: {
				verified: true,
				description:
					"A fresh read observed the exact Issue membership in the requested Project",
			},
		});
	}
}

async function inspectAfterSubmittedMutation(
	operation: string,
	request: ItemInspectionRequest,
	gateway: GithubProjectGateway,
): Promise<ItemSnapshot> {
	try {
		return validateRequestedTarget(request, await gateway.inspectItem(request));
	} catch (error) {
		throw new Error(
			`${operation} was submitted, but fresh target identity inspection failed; do not retry automatically`,
			{ cause: error },
		);
	}
}

function validateRequestedTarget(
	request: ItemInspectionRequest,
	value: unknown,
): ItemSnapshot {
	const snapshot = ItemSnapshotSchema.parse(value);
	if (canonicalOwner(snapshot.project.owner) !== canonicalOwner(request.projectOwner)) {
		throw new Error("Project item request target mismatch: Project owner differs");
	}
	if (snapshot.project.number !== request.projectNumber) {
		throw new Error("Project item request target mismatch: Project number differs");
	}
	if (
		canonicalRepository(snapshot.issue.repository) !==
		canonicalRepository(request.repository)
	) {
		throw new Error("Project item request target mismatch: Issue repository differs");
	}
	if (snapshot.issue.number !== request.issueNumber) {
		throw new Error("Project item request target mismatch: Issue number differs");
	}
	return snapshot;
}

function assertSameTarget(before: ItemSnapshot, after: ItemSnapshot): void {
	if (
		after.project.id !== before.project.id ||
		after.project.number !== before.project.number ||
		canonicalOwner(after.project.owner) !== canonicalOwner(before.project.owner)
	) {
		throw new Error(
			"Field mutation Project identity postcondition failed after submission; do not retry automatically",
		);
	}
	if (
		after.issue.id !== before.issue.id ||
		after.issue.number !== before.issue.number ||
		canonicalRepository(after.issue.repository) !==
			canonicalRepository(before.issue.repository)
	) {
		throw new Error(
			"Field mutation Issue identity postcondition failed after submission; do not retry automatically",
		);
	}
	if (after.itemId !== before.itemId) {
		throw new Error(
			"Field mutation Project item identity postcondition failed after submission; do not retry automatically",
		);
	}
}

function canonicalOwner(owner: string): string {
	const [validatedOwner] = splitGitHubRepository(`${owner}/identity`);
	return validatedOwner.toLowerCase();
}

function canonicalRepository(repository: string): string {
	const [owner, name] = splitGitHubRepository(repository);
	return `${owner.toLowerCase()}/${name.toLowerCase()}`;
}

function targetOf(
	request: ItemInspectionRequest,
): Readonly<Record<string, string | number>> {
	return {
		projectOwner: request.projectOwner,
		projectNumber: request.projectNumber,
		repository: request.repository,
		issueNumber: request.issueNumber,
	};
}
