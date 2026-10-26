export const GITHUB_REST_API_VERSION = "2022-11-28" as const;

const GITHUB_REST_API_VERSION_HEADER =
	"X-GitHub-Api-Version: " + GITHUB_REST_API_VERSION;

export function githubRestArgs(args: readonly string[]): string[] {
	return ["api", ...args, "--header", GITHUB_REST_API_VERSION_HEADER];
}
