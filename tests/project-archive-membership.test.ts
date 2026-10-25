import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProjectV2Client } from "../src/github/project-v2-client.ts";
import {
	ArchiveExecutor,
	fieldsPage,
	issueItem,
	issuePage,
	project,
	projectItem,
	projectPage,
	request,
	validResponses,
} from "./project-archive-fixture.ts";

async function inspect(responses: readonly unknown[]) {
	const executor = new ArchiveExecutor(responses);
	const result = await new ProjectV2Client(executor.execute).inspectItem(request);
	executor.assertDrained();
	return result;
}

async function rejects(responses: readonly unknown[], pattern: RegExp) {
	const executor = new ArchiveExecutor(responses);
	await assert.rejects(
		new ProjectV2Client(executor.execute).inspectItem(request),
		pattern,
	);
}

describe("archive-complete Project membership", () => {
	for (const archived of [false, true]) {
		it(`T0${archived ? 2 : 1} returns explicit isArchived=${archived}`, async () => {
			const snapshot = await inspect(validResponses(archived));
			assert.equal(snapshot.itemId, "PVTI_item");
			assert.equal(snapshot.isArchived, archived);
		});
	}

	it("T07 rejects one-sided active or archived membership", async () => {
		for (const archived of [false, true]) {
			await rejects(
				[project, issuePage([issueItem("PVTI_item", archived)]), projectPage([])],
				/Issue-side found 1; Project-side found 0/,
			);
			await rejects(
				[project, issuePage([]), projectPage([projectItem("PVTI_item", archived)])],
				/Issue-side found 0; Project-side found 1/,
			);
		}
	});

	it("T08 rejects different IDs across projections", async () => {
		await rejects(
			[
				project,
				issuePage([issueItem("PVTI_issue", true)]),
				projectPage([projectItem("PVTI_project", true)]),
			],
			/item ids differ/,
		);
	});

	it("T09 rejects contradictory archive booleans", async () => {
		await rejects(
			[
				project,
				issuePage([issueItem("PVTI_item", true)]),
				projectPage([projectItem("PVTI_item", false)]),
			],
			/archive states differ/,
		);
	});

	it("T10 rejects absent, null, string, or numeric archive evidence", async () => {
		for (const invalid of [undefined, null, "false", 0]) {
			const issueNode =
				invalid === undefined
					? { id: "PVTI_item", project: { ...project } }
					: issueItem("PVTI_item", invalid);
			const projectNode =
				invalid === undefined
					? { id: "PVTI_item", content: { id: "I_target" } }
					: projectItem("PVTI_item", invalid);
			await rejects(
				[project, issuePage([issueNode]), projectPage([projectItem()])],
				/must be a boolean/,
			);
			await rejects(
				[project, issuePage([issueItem()]), projectPage([projectNode])],
				/must be a boolean/,
			);
		}
	});

	it("T11 rejects duplicate matching memberships across pages", async () => {
		await rejects(
			[
				project,
				issuePage([issueItem()], true, "I2"),
				issuePage([issueItem()]),
				projectPage([projectItem()]),
			],
			/Issue-side found 2/,
		);
		await rejects(
			[
				project,
				issuePage([issueItem()]),
				projectPage([projectItem()], true, "P2"),
				projectPage([projectItem()]),
			],
			/Project-side found 2/,
		);
	});

	it("T12 rejects Issue identity drift across pages", async () => {
		await rejects(
			[
				project,
				issuePage([], true, "I2", "I_target"),
				issuePage([issueItem()], false, null, "I_other"),
			],
			/Issue id changed/,
		);
	});

	it("T13 rejects a field page bound to another item", async () => {
		await rejects(
			[
				project,
				issuePage([issueItem()]),
				projectPage([projectItem()]),
				fieldsPage("PVTI_other", false),
			],
			/item id changed/,
		);
	});

	it("T14 rejects field archive evidence that disagrees with membership", async () => {
		await rejects(
			[
				project,
				issuePage([issueItem("PVTI_item", true)]),
				projectPage([projectItem("PVTI_item", true)]),
				fieldsPage("PVTI_item", false),
			],
			/archive state changed/,
		);
	});

	it("T15 rejects archive drift between field pages", async () => {
		await rejects(
			[
				project,
				issuePage([issueItem()]),
				projectPage([projectItem()]),
				fieldsPage("PVTI_item", false, [], true, "F2"),
				fieldsPage("PVTI_item", true),
			],
			/archive state changed/,
		);
	});

	it("fails closed on nonempty GraphQL errors with partial data", async () => {
		const partial = issuePage([issueItem()]) as { errors?: unknown };
		partial.errors = [{ message: "partial" }];
		await rejects([project, partial], /contains errors/);
	});

	it("fails closed on malformed GraphQL error envelopes with partial data", async () => {
		for (const malformed of [null, { message: "partial" }, "partial", 1]) {
			const partial = issuePage([issueItem()]) as { errors?: unknown };
			partial.errors = malformed;
			await rejects([project, partial], /errors member is malformed/);
		}
	});

	it("accepts an explicit empty GraphQL errors array", async () => {
		const complete = issuePage([issueItem()]) as { errors?: unknown };
		complete.errors = [];
		const snapshot = await inspect([
			project,
			complete,
			projectPage([projectItem()]),
			fieldsPage(),
		]);
		assert.equal(snapshot.isArchived, false);
	});

	it("rejects missing, repeated, and nonadvancing cursors", async () => {
		await rejects([project, issuePage([], true, null)], /another page but no cursor/);
		await rejects(
			[project, issuePage([], true, "same"), issuePage([], true, "same")],
			/cursor did not advance/,
		);
	});
});
