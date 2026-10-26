import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCli } from "../src/entrypoints/cli.ts";
import { ProjectV2Client } from "../src/github/project-v2-client.ts";
import { GITHUB_REST_API_VERSION, githubRestArgs } from "../src/github/rest-api.ts";
import type { GhExecutor, GhResult } from "../src/github/types.ts";
import { IssueDependencyOperations } from "../src/issue-relations/issue-dependency-operations.ts";
import {
	fieldsPage,
	issueItem,
	issuePage,
	request as itemRequest,
	project,
	projectItem,
	projectPage,
} from "./project-archive-fixture.ts";

const HEADER_FLAG = "--header";
const HEADER_VALUE = "X-GitHub-Api-Version: 2022-11-28";
const repository = "example/repository";
const dependencyRequest = { repository, issueNumber: 42, blockerNumber: 41 };
const blocker = {
	id: 1001,
	number: 41,
	url: "https://api.github.com/repos/example/repository/issues/41",
	repository_url: "https://api.github.com/repos/example/repository",
	html_url: "https://github.com/example/repository/issues/41",
};
const getIssueArgs = [
	"api",
	"repos/example/repository/issues/41",
	HEADER_FLAG,
	HEADER_VALUE,
];
const getDependenciesArgs = [
	"api",
	"repos/example/repository/issues/42/dependencies/blocked_by?per_page=100",
	HEADER_FLAG,
	HEADER_VALUE,
];
const postDependencyArgs = [
	"api",
	"--method",
	"POST",
	"repos/example/repository/issues/42/dependencies/blocked_by",
	"-F",
	"issue_id=1001",
	HEADER_FLAG,
	HEADER_VALUE,
];

class QueueExecutor {
	readonly calls: string[][] = [];
	readonly #steps: readonly (unknown | Error)[];
	#index = 0;

	constructor(steps: readonly (unknown | Error)[]) {
		this.#steps = steps;
	}

	readonly execute: GhExecutor = async (args) => {
		this.calls.push([...args]);
		const step = this.#steps[this.#index];
		this.#index += 1;
		assert.notEqual(step, undefined, "unexpected gh call");
		if (step instanceof Error) throw step;
		return {
			stdout: typeof step === "string" ? step : JSON.stringify(step),
			stderr: "",
		};
	};
}

function assertExactVersionHeader(args: readonly string[]): void {
	const indexes = args.flatMap((argument, index) =>
		argument === HEADER_FLAG ? [index] : [],
	);
	assert.deepEqual(indexes, [args.length - 2]);
	assert.equal(args.at(-1), HEADER_VALUE);
	assert.equal(args.filter((argument) => argument === HEADER_VALUE).length, 1);
}

function assertNoRestVersionHeader(args: readonly string[]): void {
	assert.equal(args.includes(HEADER_FLAG), false);
	assert.equal(
		args.some((argument) => argument.includes("X-GitHub-Api-Version")),
		false,
	);
}

function postCount(calls: readonly (readonly string[])[]): number {
	return calls.filter((call) => call.includes("POST")).length;
}

async function captureCli(
	args: readonly string[],
	execute: GhExecutor,
): Promise<{
	readonly status: number;
	readonly stdout: string;
	readonly stderr: string;
}> {
	const stdoutWrite = process.stdout.write;
	const stderrWrite = process.stderr.write;
	let stdout = "";
	let stderr = "";
	process.stdout.write = ((chunk: string | Uint8Array) => {
		stdout += String(chunk);
		return true;
	}) as typeof process.stdout.write;
	process.stderr.write = ((chunk: string | Uint8Array) => {
		stderr += String(chunk);
		return true;
	}) as typeof process.stderr.write;
	try {
		return { status: await runCli(args, execute), stdout, stderr };
	} finally {
		process.stdout.write = stdoutWrite;
		process.stderr.write = stderrWrite;
	}
}

const dependencyCliArgs = [
	"dependency",
	"add-blocker",
	"--repo",
	repository,
	"--issue",
	"42",
	"--blocker",
	"41",
] as const;

describe("GitHub REST API version pin", () => {
	it("T01/T08/T17 has one immutable authority and a nonmutating exact helper", () => {
		const input = ["endpoint", "--method", "GET"] as const;
		const before = [...input];
		process.env.GITHUB_REST_API_VERSION = "2099-01-01";
		try {
			assert.equal(GITHUB_REST_API_VERSION, "2022-11-28");
			assert.deepEqual(githubRestArgs(input), [
				"api",
				...input,
				HEADER_FLAG,
				HEADER_VALUE,
			]);
			assert.deepEqual(input, before);
			assert.notEqual(githubRestArgs(input), input);
		} finally {
			delete process.env.GITHUB_REST_API_VERSION;
		}
	});

	it("T02/T04/T05/T06 performs only exact versioned reads for noop", async () => {
		const executor = new QueueExecutor([blocker, [blocker]]);
		const receipt = await new IssueDependencyOperations(executor.execute).addBlocker(
			dependencyRequest,
		);
		assert.equal(receipt.outcome, "noop");
		assert.equal(receipt.postcondition.verified, true);
		assert.deepEqual(executor.calls, [getIssueArgs, getDependenciesArgs]);
		assert.equal(executor.calls[0]?.[1], "repos/example/repository/issues/41");
		assert.equal(postCount(executor.calls), 0);
		for (const call of executor.calls) assertExactVersionHeader(call);
	});

	it("T03/T04/T07 preserves exact POST payload and versioned post-read", async () => {
		const executor = new QueueExecutor([blocker, [], "", [blocker]]);
		const receipt = await new IssueDependencyOperations(executor.execute).addBlocker(
			dependencyRequest,
		);
		assert.equal(receipt.outcome, "applied");
		assert.deepEqual(executor.calls, [
			getIssueArgs,
			getDependenciesArgs,
			postDependencyArgs,
			getDependenciesArgs,
		]);
		assert.equal(postCount(executor.calls), 1);
		for (const call of executor.calls) assertExactVersionHeader(call);
	});

	it("T08 detects a missing, wrong, or duplicate header pair", () => {
		assert.throws(() => assertExactVersionHeader(["api", "endpoint"]));
		assert.throws(() =>
			assertExactVersionHeader([
				"api",
				"endpoint",
				HEADER_FLAG,
				"X-GitHub-Api-Version: 2026-03-10",
			]),
		);
		assert.throws(() =>
			assertExactVersionHeader([
				"api",
				"endpoint",
				HEADER_FLAG,
				HEADER_VALUE,
				HEADER_FLAG,
				HEADER_VALUE,
			]),
		);
	});

	it("T09 leaves paginated GraphQL calls unversioned", async () => {
		const executor = new QueueExecutor([
			project,
			issuePage([], true, "issue-next"),
			issuePage([issueItem()]),
			projectPage([projectItem()]),
			fieldsPage("PVTI_item", false, [], true, "field-next"),
			fieldsPage(),
		]);
		const snapshot = await new ProjectV2Client(executor.execute).inspectItem(
			itemRequest,
		);
		assert.equal(snapshot.itemId, "PVTI_item");
		const graphqlCalls = executor.calls.filter(
			(call) => call[0] === "api" && call[1] === "graphql",
		);
		assert.equal(graphqlCalls.length, 5);
		assert.ok(graphqlCalls.some((call) => call.includes("cursor=issue-next")));
		assert.ok(graphqlCalls.some((call) => call.includes("cursor=field-next")));
		for (const call of graphqlCalls) assertNoRestVersionHeader(call);
	});

	it("T10 leaves gh project commands byte-for-byte unchanged", async () => {
		const executor = new QueueExecutor([project, {}, {}]);
		const client = new ProjectV2Client(executor.execute);
		await client.getProject("example", 3);
		await client.addItem(itemRequest);
		await client.editSingleSelect({
			projectId: "PVT_project",
			itemId: "PVTI_item",
			fieldId: "FIELD",
			optionId: "OPTION",
		});
		assert.deepEqual(executor.calls, [
			["project", "view", "3", "--owner", "example", "--format", "json"],
			[
				"project",
				"item-add",
				"3",
				"--owner",
				"example",
				"--url",
				"https://github.com/example/repository/issues/42",
				"--format",
				"json",
			],
			[
				"project",
				"item-edit",
				"--id",
				"PVTI_item",
				"--project-id",
				"PVT_project",
				"--field-id",
				"FIELD",
				"--single-select-option-id",
				"OPTION",
			],
		]);
		for (const call of executor.calls) assertNoRestVersionHeader(call);
	});

	it("T11/T12 propagates GET and HTTP 410 failures without fallback", async () => {
		for (const failure of [new Error("GET denied"), new Error("HTTP 410 Gone")]) {
			const executor = new QueueExecutor([failure]);
			await assert.rejects(
				new IssueDependencyOperations(executor.execute).addBlocker(dependencyRequest),
				failure,
			);
			assert.deepEqual(executor.calls, [getIssueArgs]);
			assert.doesNotMatch(executor.calls.flat().join(" "), /2026-03-10/);
		}
	});

	it("T13 propagates POST failure with one submission and no rollback claim", async () => {
		const executor = new QueueExecutor([blocker, [], new Error("POST uncertain")]);
		await assert.rejects(
			new IssueDependencyOperations(executor.execute).addBlocker(dependencyRequest),
			(error: unknown) =>
				error instanceof Error &&
				/POST uncertain/.test(error.message) &&
				!/rollback|not applied/i.test(error.message),
		);
		assert.deepEqual(executor.calls, [
			getIssueArgs,
			getDependenciesArgs,
			postDependencyArgs,
		]);
		assert.equal(postCount(executor.calls), 1);
	});

	it("T14 fails a post-POST read closed without a second POST", async () => {
		const executor = new QueueExecutor([
			blocker,
			[],
			"",
			new Error("fresh read failed"),
		]);
		await assert.rejects(
			new IssueDependencyOperations(executor.execute).addBlocker(dependencyRequest),
			/submitted.*do not retry automatically/i,
		);
		assert.deepEqual(executor.calls, [
			getIssueArgs,
			getDependenciesArgs,
			postDependencyArgs,
			getDependenciesArgs,
		]);
		assert.equal(postCount(executor.calls), 1);
	});

	it("T15/T16 preserves canonical identity and v2 success/error receipts", async () => {
		const successExecutor = new QueueExecutor([blocker, [blocker]]);
		const success = await captureCli(dependencyCliArgs, successExecutor.execute);
		assert.equal(success.status, 0);
		const successReceipt = JSON.parse(success.stdout);
		assert.equal(successReceipt.schemaVersion, 2);
		assert.equal(successReceipt.command, "dependency.add-blocker");
		assert.equal(successReceipt.outcome, "noop");
		assert.deepEqual(successReceipt.after.blockedByIssues, [
			{ id: 1001, repository, number: 41 },
		]);

		const failedCalls: string[][] = [];
		const fail: GhExecutor = async (args): Promise<GhResult> => {
			failedCalls.push([...args]);
			throw new Error("HTTP 410 Gone");
		};
		const failure = await captureCli(dependencyCliArgs, fail);
		assert.equal(failure.status, 1);
		assert.equal(failure.stdout, "");
		assert.equal(JSON.parse(failure.stderr).schemaVersion, 2);
		assert.deepEqual(failedCalls, [getIssueArgs]);
	});
});
