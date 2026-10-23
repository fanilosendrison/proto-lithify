const GITHUB_OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const GITHUB_REPOSITORY_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

export function splitGitHubRepository(repository: string): readonly [string, string] {
	const segments = repository.split("/");
	if (segments.length !== 2) {
		throw new Error(
			`GitHub repository must use owner/name: ${JSON.stringify(repository)}`,
		);
	}
	const [owner, name] = segments;
	if (owner === undefined || !GITHUB_OWNER_PATTERN.test(owner)) {
		throw new Error(`Invalid GitHub repository owner: ${JSON.stringify(owner)}`);
	}
	if (name === undefined || !GITHUB_REPOSITORY_PATTERN.test(name)) {
		throw new Error(`Invalid GitHub repository name: ${JSON.stringify(name)}`);
	}
	return [owner, name];
}

export function githubIssueUrl(repository: string, issueNumber: number): string {
	const [owner, name] = splitGitHubRepository(repository);
	if (!Number.isSafeInteger(issueNumber) || issueNumber <= 0) {
		throw new Error(
			`GitHub Issue number must be a positive safe integer: ${issueNumber}`,
		);
	}
	return `https://github.com/${owner}/${name}/issues/${issueNumber}`;
}
