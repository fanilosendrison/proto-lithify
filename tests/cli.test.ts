import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { CliUsageError, parseArguments } from "../src/cli/arguments.ts";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
let temporaryDirectory: string;

before(async () => {
	temporaryDirectory = await mkdtemp(path.join(tmpdir(), "github-projects-cli-"));
	const ghPath = path.join(temporaryDirectory, "gh");
	await writeFile(
		ghPath,
		`#!/usr/bin/env node
const args = process.argv.slice(2);
if (args[0] === "--version") {
	process.stdout.write("gh version 2.32.1\\n");
} else if (args[0] === "auth" && args[1] === "status") {
	process.exitCode = 0;
} else if (process.env.GH_FIXTURE_SCENARIO === "orphaned-project-item") {
	if (args[0] === "project" && args[1] === "view") {
		process.stdout.write(JSON.stringify({
			id: "PVT_project",
			number: 3,
			title: "Engineering",
			url: "https://github.com/users/example/projects/3",
		}));
	} else if (args[0] === "api" && args[1] === "graphql") {
		const query = args.find((argument) => argument.startsWith("query=")) ?? "";
		if (query.includes("repository(owner:")) {
			process.stdout.write(JSON.stringify({ data: { repository: { issue: {
				id: "I_target",
				projectItems: {
					nodes: [{ id: "PVTI_orphan", project: {
						id: "PVT_project",
						number: 3,
						title: "Engineering",
						url: "https://github.com/users/example/projects/3",
					} }],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			} } } }));
		} else if (query.includes("items(first:100")) {
			process.stdout.write(JSON.stringify({ data: { node: { items: {
				nodes: [],
				pageInfo: { hasNextPage: false, endCursor: null },
			} } } }));
		} else {
			process.exitCode = 3;
		}
	} else {
		process.exitCode = 3;
	}
} else {
	process.exitCode = 3;
}
`,
	);
	await chmod(ghPath, 0o755);
});

after(async () => {
	await rm(temporaryDirectory, { recursive: true, force: true });
});

function runCli(
	args: readonly string[],
	environment: Readonly<Record<string, string>> = {},
) {
	return spawnSync(
		process.execPath,
		[path.join(repositoryRoot, "src/entrypoints/cli.ts"), ...args],
		{
			cwd: repositoryRoot,
			encoding: "utf8",
			env: {
				...process.env,
				...environment,
				PATH: `${temporaryDirectory}:${process.env.PATH ?? ""}`,
			},
			shell: false,
		},
	);
}

function itemAddArguments(
	repository = "example/repository",
	issueNumber = "42",
): readonly string[] {
	return [
		"item",
		"add",
		"--project-owner",
		"example",
		"--project-number",
		"3",
		"--repo",
		repository,
		"--issue",
		issueNumber,
	];
}

function assertUsageError(args: readonly string[], code: string): void {
	assert.throws(
		() => parseArguments(args),
		(error: unknown) => error instanceof CliUsageError && error.code === code,
	);
}

describe("CLI", () => {
	it("emits a versioned doctor receipt", () => {
		const result = runCli(["doctor"]);
		assert.strictEqual(result.status, 0, result.stderr);
		const receipt = JSON.parse(result.stdout);
		assert.strictEqual(receipt.schemaVersion, 1);
		assert.strictEqual(receipt.command, "doctor");
		assert.strictEqual(receipt.outcome, "inspected");
		assert.match(receipt.after.ghVersion, /^gh version 2\.32\.1/);
	});

	it("rejects semantic workflow commands", () => {
		const result = runCli(["start"]);
		assert.strictEqual(result.status, 2);
		assert.match(result.stderr, /UNKNOWN_COMMAND/);
		assert.strictEqual(result.stdout, "");
	});

	it("rejects duplicate flags before GitHub access", () => {
		const result = runCli([
			"project",
			"inspect",
			"--project-owner",
			"example",
			"--project-owner",
			"other",
			"--project-number",
			"3",
		]);
		assert.strictEqual(result.status, 2);
		assert.match(result.stderr, /DUPLICATE_FLAG/);
	});

	it("parses item add from one canonical Issue identity", () => {
		assert.deepStrictEqual(
			parseArguments(itemAddArguments("other/repo_name.with-dots", "42")),
			{
				name: "item.add",
				projectOwner: "example",
				projectNumber: 3,
				repository: "other/repo_name.with-dots",
				issueNumber: 42,
			},
		);
	});

	it("rejects the obsolete independent Issue URL before GitHub access", () => {
		const args = [
			...itemAddArguments(),
			"--issue-url",
			"https://github.com/other/repository/issues/99",
		];
		assertUsageError(args, "UNKNOWN_FLAG");

		const result = runCli(args);
		assert.strictEqual(result.status, 2);
		assert.strictEqual(result.stdout, "");
		assert.strictEqual(JSON.parse(result.stderr).error.code, "UNKNOWN_FLAG");
	});

	it("rejects malformed repositories before GitHub access", () => {
		for (const repository of [
			"owner/repo?query",
			"owner/repo#fragment",
			"owner/repo%20name",
			"owner/repo name",
			"owner/extra/repository",
			"-owner/repository",
			"owner-/repository",
		]) {
			assertUsageError(itemAddArguments(repository), "INVALID_REPOSITORY");
		}
	});

	it("rejects unsafe and syntactically invalid Issue numbers before GitHub access", () => {
		for (const issueNumber of ["9007199254740992", "0", "-1", "1.5", "issue"]) {
			assertUsageError(
				itemAddArguments("example/repository", issueNumber),
				"INVALID_INTEGER",
			);
		}
	});

	it("fails closed when only the Issue reports Project membership", () => {
		const result = runCli(
			[
				"item",
				"inspect",
				"--project-owner",
				"example",
				"--project-number",
				"3",
				"--repo",
				"example/repository",
				"--issue",
				"42",
			],
			{ GH_FIXTURE_SCENARIO: "orphaned-project-item" },
		);

		assert.strictEqual(result.status, 1);
		assert.strictEqual(result.stdout, "");
		const receipt = JSON.parse(result.stderr);
		assert.strictEqual(receipt.error.code, "OPERATION_FAILED");
		assert.match(
			receipt.error.message,
			/Inconsistent Project item membership.*Issue-side found 1; Project-side found 0/,
		);
	});
});
