import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { ErrorReceiptSchema } from "../src/receipts/schemas.ts";

const root = path.resolve(import.meta.dirname, "..");
const token = "github_pat_SYNTHETIC0123456789abcdef";
const bearer = "syntheticBearer0123456789abcdef";
const credentialUrl = "https://fixture-user:fixture-password@github.example/path";
let fixtureDirectory: string;
let callLog: string;

before(async () => {
	fixtureDirectory = await mkdtemp(path.join(tmpdir(), "proto-lithify-denial-"));
	callLog = path.join(fixtureDirectory, "calls.jsonl");
	await writeFile(callLog, "");
	const executable = path.join(fixtureDirectory, "gh");
	await writeFile(
		executable,
		`#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
fs.appendFileSync(process.env.FIXTURE_CALL_LOG, JSON.stringify(args) + "\\n");
const issue = { id: 1001, number: 41,
 url: "https://api.github.com/repos/example/repository/issues/41",
 repository_url: "https://api.github.com/repos/example/repository",
 html_url: "https://github.com/example/repository/issues/41" };
const diagnostic = process.env.FIXTURE_STATUS + " denied; ${token}; Authorization: Bearer ${bearer}; ${credentialUrl}";
function fail() { process.stderr.write(diagnostic + "\\n"); process.exitCode = 1; }
if (process.env.FIXTURE_SCENARIO === "rest-read") {
 if (args[1] === "repos/example/repository/issues/41") process.stdout.write(JSON.stringify(issue));
 else fail();
} else if (process.env.FIXTURE_SCENARIO === "graphql") {
 if (args[0] === "project" && args[1] === "view") process.stdout.write(JSON.stringify({id:"PVT_project",number:3,title:"Engineering",url:"https://github.com/users/example/projects/3"}));
 else fail();
} else if (process.env.FIXTURE_SCENARIO === "post") {
 if (args[1] === "repos/example/repository/issues/41") process.stdout.write(JSON.stringify(issue));
 else if (args[1]?.includes("dependencies/blocked_by") && !args.includes("POST")) process.stdout.write("[]");
 else if (args.includes("POST")) fail();
 else { process.stderr.write("unexpected invocation\\n"); process.exitCode = 91; }
} else { process.stderr.write("unknown scenario\\n"); process.exitCode = 92; }
`,
	);
	await chmod(executable, 0o755);
});

after(async () => {
	await rm(fixtureDirectory, { recursive: true, force: true });
});

async function resetLog(): Promise<void> {
	await writeFile(callLog, "");
}

async function calls(): Promise<readonly string[][]> {
	const content = await readFile(callLog, "utf8");
	return content
		.trim()
		.split("\n")
		.filter(Boolean)
		.map((line) => JSON.parse(line));
}

function run(args: readonly string[], scenario: string, status = "HTTP 403") {
	return spawnSync(
		process.execPath,
		[path.join(root, "src/entrypoints/cli.ts"), ...args],
		{
			cwd: root,
			encoding: "utf8",
			shell: false,
			env: {
				...process.env,
				PATH: `${fixtureDirectory}:${process.env.PATH ?? ""}`,
				FIXTURE_CALL_LOG: callLog,
				FIXTURE_SCENARIO: scenario,
				FIXTURE_STATUS: status,
			},
		},
	);
}

function assertDenied(result: ReturnType<typeof run>): void {
	assert.notEqual(result.status, 0);
	assert.equal(result.stdout, "");
	const lines = result.stderr.trim().split("\n");
	assert.equal(lines.length, 1);
	const receipt = ErrorReceiptSchema.parse(JSON.parse(lines[0] ?? ""));
	assert.equal(receipt.schemaVersion, 2);
	assert.equal(receipt.error.code, "GH_COMMAND_FAILED");
	for (const secret of [token, bearer, credentialUrl, "fixture-password"]) {
		assert.equal(result.stderr.includes(secret), false);
	}
}

const dependencyArgs = [
	"dependency",
	"add-blocker",
	"--repo",
	"example/repository",
	"--issue",
	"42",
	"--blocker",
	"41",
] as const;

describe("CLI access denial", () => {
	it("R1.A emits one redacted v2 error for REST 401 and 403 without retry", async () => {
		for (const status of ["HTTP 401", "HTTP 403"]) {
			await resetLog();
			assertDenied(run(dependencyArgs, "rest-read", status));
			const observed = await calls();
			assert.equal(observed.length, 2);
			assert.equal(observed[0]?.[1], "repos/example/repository/issues/41");
			assert.match(observed[1]?.[1] ?? "", /dependencies\/blocked_by\?per_page=100$/);
			assert.equal(
				observed.some((args) => args.includes("POST")),
				false,
			);
		}
	});

	it("R1.B denies concurrent GraphQL catalog reads without inspected success", async () => {
		await resetLog();
		const result = run(
			["project", "inspect", "--project-owner", "example", "--project-number", "3"],
			"graphql",
		);
		assertDenied(result);
		const observed = await calls();
		assert.equal(observed[0]?.slice(0, 2).join(" "), "project view");
		assert.ok(
			observed.slice(1).every((args) => args[0] === "api" && args[1] === "graphql"),
		);
		assert.equal(result.stderr.includes("postcondition"), false);
	});

	it("R1.C attempts one pinned POST and makes no rollback, retry, or fallback claim", async () => {
		await resetLog();
		const result = run(dependencyArgs, "post");
		assertDenied(result);
		const observed = await calls();
		assert.equal(observed.filter((args) => args.includes("POST")).length, 1);
		assert.equal(observed.length, 3);
		for (const args of observed) {
			assert.equal(args.filter((value) => value === "--header").length, 1);
			assert.equal(args.at(-1), "X-GitHub-Api-Version: 2022-11-28");
		}
		assert.doesNotMatch(
			result.stderr,
			/rollback|nonapplication|not applied|2026-03-10/i,
		);
	});
});
