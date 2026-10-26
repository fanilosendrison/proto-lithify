import { z } from "zod";
import { splitGitHubRepository } from "../github/issue-identity.ts";
import { githubRestArgs } from "../github/rest-api.ts";
import type { GhExecutor } from "../github/types.ts";
import {
	type CommandReceipt,
	commandReceipt,
	type DependencyBlocker,
	DependencyBlockerSchema,
	type DependencySnapshot,
	DependencySnapshotSchema,
} from "../receipts/schemas.ts";

const GITHUB_API_ORIGIN = "https://api.github.com";
const GITHUB_WEB_ORIGIN = "https://github.com";
const MAX_GITHUB_DEPENDENCIES_PER_TYPE = 50;

const RestIssueSchema = z.object({
	id: DependencyBlockerSchema.shape.id,
	number: DependencyBlockerSchema.shape.number,
	url: z.string(),
	repository_url: z.string(),
	html_url: z.string().optional(),
});

export interface AddBlockerRequest {
	readonly repository: string;
	readonly issueNumber: number;
	readonly blockerNumber: number;
}

export class IssueDependencyOperations {
	private readonly execute: GhExecutor;

	constructor(execute: GhExecutor) {
		this.execute = execute;
	}

	async addBlocker(
		request: AddBlockerRequest,
	): Promise<CommandReceipt<DependencySnapshot, DependencySnapshot>> {
		const repository = canonicalRepository(request.repository);
		validatePositiveSafeInteger(request.issueNumber, "Issue number");
		validatePositiveSafeInteger(request.blockerNumber, "blocker number");
		if (request.issueNumber === request.blockerNumber) {
			throw new Error("An Issue cannot block itself");
		}

		const blocker = await this.getIssue(repository, request.blockerNumber);
		if (blocker.repository !== repository || blocker.number !== request.blockerNumber) {
			throw new Error("Resolved blocker identity does not match the request");
		}

		const before = await this.inspect(repository, request.issueNumber);
		if (before.blockedByIssues.some((candidate) => sameIdentity(candidate, blocker))) {
			return commandReceipt({
				command: "dependency.add-blocker",
				outcome: "noop",
				target: { repository, issueNumber: request.issueNumber },
				request: { blockerNumber: request.blockerNumber },
				before,
				after: before,
				postcondition: {
					verified: true,
					description: "The exact blocker relationship already exists",
				},
			});
		}

		await this.execute(
			githubRestArgs([
				"--method",
				"POST",
				`repos/${repository}/issues/${request.issueNumber}/dependencies/blocked_by`,
				"-F",
				`issue_id=${blocker.id}`,
			]),
		);
		let after: DependencySnapshot;
		try {
			after = await this.inspect(repository, request.issueNumber);
		} catch (error) {
			throw new Error(
				"Blocker mutation was submitted, but fresh identity inspection failed; do not retry automatically",
				{ cause: error },
			);
		}
		if (!after.blockedByIssues.some((candidate) => sameIdentity(candidate, blocker))) {
			throw new Error(
				"Blocker mutation was submitted, but the exact identity postcondition failed; do not retry automatically",
			);
		}
		return commandReceipt({
			command: "dependency.add-blocker",
			outcome: "applied",
			target: { repository, issueNumber: request.issueNumber },
			request: { blockerNumber: request.blockerNumber },
			before,
			after,
			postcondition: {
				verified: true,
				description: "A fresh read observed the exact blocker relationship",
			},
		});
	}

	async inspect(repository: string, issueNumber: number): Promise<DependencySnapshot> {
		const canonicalTarget = canonicalRepository(repository);
		validatePositiveSafeInteger(issueNumber, "Issue number");
		const result = await this.execute(
			githubRestArgs([
				`repos/${canonicalTarget}/issues/${issueNumber}/dependencies/blocked_by?per_page=100`,
			]),
		);
		const value: unknown = JSON.parse(result.stdout);
		if (!Array.isArray(value)) {
			throw new Error("GitHub blocked-by response must be an array");
		}
		// GitHub.com publishes a maximum of 50 dependencies per relationship type.
		// One requested page of 100 is complete only while that provider bound holds.
		if (value.length > MAX_GITHUB_DEPENDENCIES_PER_TYPE) {
			throw new Error(
				`GitHub blocked-by response exceeds the published ${MAX_GITHUB_DEPENDENCIES_PER_TYPE}-dependency bound`,
			);
		}

		const blockedByIssues = value.map(parseRestIssueIdentity);
		assertUniqueIdentities(blockedByIssues);
		blockedByIssues.sort(compareIdentities);
		const blockedBy = [...new Set(blockedByIssues.map((issue) => issue.number))].sort(
			(left, right) => left - right,
		);
		return DependencySnapshotSchema.parse({ blockedBy, blockedByIssues });
	}

	private async getIssue(
		repository: string,
		issueNumber: number,
	): Promise<DependencyBlocker> {
		const result = await this.execute(
			githubRestArgs([`repos/${repository}/issues/${issueNumber}`]),
		);
		return parseRestIssueIdentity(JSON.parse(result.stdout));
	}
}

function parseRestIssueIdentity(value: unknown): DependencyBlocker {
	const issue = RestIssueSchema.parse(value);
	const repository = parseRepositoryApiUrl(issue.repository_url);
	const issueIdentity = parseIssueUrl(issue.url, GITHUB_API_ORIGIN, "REST Issue URL");
	if (
		issueIdentity.repository !== repository ||
		issueIdentity.number !== issue.number
	) {
		throw new Error("REST Issue identity fields are contradictory");
	}
	if (issue.html_url !== undefined) {
		const htmlIdentity = parseIssueUrl(
			issue.html_url,
			GITHUB_WEB_ORIGIN,
			"HTML Issue URL",
		);
		if (
			htmlIdentity.repository !== repository ||
			htmlIdentity.number !== issue.number
		) {
			throw new Error("HTML Issue identity contradicts the REST identity");
		}
	}
	return DependencyBlockerSchema.parse({
		id: issue.id,
		repository,
		number: issue.number,
	});
}

function parseRepositoryApiUrl(value: string): string {
	const url = parseExactUrl(value, GITHUB_API_ORIGIN, "repository URL");
	const segments = url.pathname.split("/");
	if (
		segments.length !== 4 ||
		segments[0] !== "" ||
		segments[1] !== "repos" ||
		segments[2] === undefined ||
		segments[3] === undefined
	) {
		throw new Error("Repository URL must use /repos/{owner}/{repository}");
	}
	return canonicalRepository(`${segments[2]}/${segments[3]}`);
}

function parseIssueUrl(
	value: string,
	expectedOrigin: string,
	label: string,
): { readonly repository: string; readonly number: number } {
	const url = parseExactUrl(value, expectedOrigin, label);
	const segments = url.pathname.split("/");
	let owner: string | undefined;
	let name: string | undefined;
	let issueNumber: string | undefined;
	if (
		expectedOrigin === GITHUB_API_ORIGIN &&
		segments.length === 6 &&
		segments[0] === "" &&
		segments[1] === "repos" &&
		segments[4] === "issues"
	) {
		owner = segments[2];
		name = segments[3];
		issueNumber = segments[5];
	} else if (
		expectedOrigin === GITHUB_WEB_ORIGIN &&
		segments.length === 5 &&
		segments[0] === "" &&
		segments[3] === "issues"
	) {
		owner = segments[1];
		name = segments[2];
		issueNumber = segments[4];
	} else {
		throw new Error(`${label} has an invalid Issue path`);
	}
	if (owner === undefined || name === undefined || issueNumber === undefined) {
		throw new Error(`${label} has an incomplete Issue path`);
	}
	const repository = canonicalRepository(`${owner}/${name}`);
	if (!/^[1-9]\d*$/.test(issueNumber)) {
		throw new Error(`${label} has an invalid Issue number`);
	}
	const number = Number(issueNumber);
	validatePositiveSafeInteger(number, `${label} Issue number`);
	return { repository, number };
}

function parseExactUrl(value: string, expectedOrigin: string, label: string): URL {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`${label} must be an absolute HTTPS URL`);
	}
	if (
		url.origin !== expectedOrigin ||
		url.protocol !== "https:" ||
		url.username !== "" ||
		url.password !== "" ||
		url.search !== "" ||
		url.hash !== ""
	) {
		throw new Error(`${label} must use the exact trusted GitHub origin and path`);
	}
	return url;
}

function assertUniqueIdentities(issues: readonly DependencyBlocker[]): void {
	const identitiesById = new Map<number, string>();
	const idsByIdentity = new Map<string, number>();
	for (const issue of issues) {
		const identity = `${issue.repository}#${issue.number}`;
		const existingIdentity = identitiesById.get(issue.id);
		if (existingIdentity !== undefined) {
			throw new Error(
				existingIdentity === identity
					? `Duplicate GitHub Issue database ID: ${issue.id}`
					: `GitHub Issue database ID ${issue.id} claims conflicting identities`,
			);
		}
		const existingId = idsByIdentity.get(identity);
		if (existingId !== undefined) {
			throw new Error(
				`GitHub Issue identity ${identity} has conflicting database IDs ${existingId} and ${issue.id}`,
			);
		}
		identitiesById.set(issue.id, identity);
		idsByIdentity.set(identity, issue.id);
	}
}

function compareIdentities(left: DependencyBlocker, right: DependencyBlocker): number {
	if (left.repository < right.repository) return -1;
	if (left.repository > right.repository) return 1;
	if (left.number !== right.number) return left.number - right.number;
	return left.id - right.id;
}

function sameIdentity(left: DependencyBlocker, right: DependencyBlocker): boolean {
	return (
		left.id === right.id &&
		left.repository === right.repository &&
		left.number === right.number
	);
}

function canonicalRepository(repository: string): string {
	const [owner, name] = splitGitHubRepository(repository);
	return `${owner.toLowerCase()}/${name.toLowerCase()}`;
}

function validatePositiveSafeInteger(value: number, label: string): void {
	if (!Number.isSafeInteger(value) || value <= 0) {
		throw new Error(`${label} must be a positive safe integer: ${value}`);
	}
}
