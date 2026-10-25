import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	ProjectItemNotFoundError,
	ProjectV2Client,
} from "../src/github/project-v2-client.ts";
import {
	ArchiveExecutor,
	cursorArgument,
	fieldsPage,
	graphqlQuery,
	issueItem,
	issuePage,
	project,
	projectItem,
	projectPage,
	request,
} from "./project-archive-fixture.ts";

function otherIssueItems(start: number, count: number): unknown[] {
	return Array.from({ length: count }, (_, index) => ({
		id: `PVTI_issue_other_${start + index}`,
		isArchived: (start + index) % 2 === 0,
		project: { id: `PVT_other_${start + index}` },
	}));
}

function otherProjectItems(start: number, count: number): unknown[] {
	return Array.from({ length: count }, (_, index) =>
		projectItem(
			`PVTI_project_other_${start + index}`,
			(start + index) % 2 === 0,
			`I_other_${start + index}`,
		),
	);
}

function archiveQueries(executor: ArchiveExecutor) {
	return executor.calls.filter((call) => call[0] === "api");
}

describe("archive-complete pagination and synthetic call counts", () => {
	it("T16 retains explicit archive filters and exact cursors on every page", async () => {
		const executor = new ArchiveExecutor([
			project,
			issuePage([], true, "issue-2"),
			issuePage([issueItem("PVTI_item", true)]),
			projectPage([], true, "project-2"),
			projectPage([projectItem("PVTI_item", true)]),
			fieldsPage("PVTI_item", true, [], true, "field-2"),
			fieldsPage("PVTI_item", true),
		]);
		const snapshot = await new ProjectV2Client(executor.execute).inspectItem(request);
		assert.equal(snapshot.isArchived, true);
		const queries = archiveQueries(executor);
		const issueQueries = queries.filter((call) =>
			graphqlQuery(call).includes("projectItems(first:100"),
		);
		const projectQueries = queries.filter((call) =>
			graphqlQuery(call).includes("items(first:100"),
		);
		assert.equal(issueQueries.length, 2);
		assert.equal(projectQueries.length, 2);
		assert.ok(
			issueQueries.every((call) => graphqlQuery(call).includes("includeArchived:true")),
		);
		assert.ok(
			projectQueries.every((call) =>
				graphqlQuery(call).includes("archivedStates:[ARCHIVED,NOT_ARCHIVED]"),
			),
		);
		assert.equal(cursorArgument(issueQueries[1] ?? []), "cursor=issue-2");
		assert.equal(cursorArgument(projectQueries[1] ?? []), "cursor=project-2");
		assert.equal(cursorArgument(queries.at(-1) ?? []), "cursor=field-2");
	});

	it("T23 traverses 201 mixed items and finds a final-page archived member", async () => {
		const executor = new ArchiveExecutor([
			project,
			issuePage(otherIssueItems(0, 100), true, "issue-100"),
			issuePage(otherIssueItems(100, 100), true, "issue-200"),
			issuePage([issueItem("PVTI_final", true)]),
			projectPage(otherProjectItems(0, 100), true, "project-100"),
			projectPage(otherProjectItems(100, 100), true, "project-200"),
			projectPage([projectItem("PVTI_final", true)]),
			fieldsPage("PVTI_final", true),
		]);
		const snapshot = await new ProjectV2Client(executor.execute).inspectItem(request);
		assert.equal(snapshot.itemId, "PVTI_final");
		assert.equal(snapshot.isArchived, true);
		assert.equal(executor.calls.length, 8);
	});

	it("records deterministic synthetic GraphQL call counts", async () => {
		const scenarios = [
			{
				name: "active-only",
				responses: [
					project,
					issuePage([issueItem()]),
					projectPage([projectItem()]),
					fieldsPage(),
				],
				expectedGraphql: 3,
			},
			{
				name: "mixed-active-archived",
				responses: [
					project,
					issuePage([otherIssueItems(0, 1)[0], issueItem("PVTI_item", true)]),
					projectPage([otherProjectItems(0, 1)[0], projectItem("PVTI_item", true)]),
					fieldsPage("PVTI_item", true),
				],
				expectedGraphql: 3,
			},
			{
				name: "multipage-final-item",
				responses: [
					project,
					issuePage([], true, "I2"),
					issuePage([issueItem()]),
					projectPage([], true, "P2"),
					projectPage([projectItem()]),
					fieldsPage("PVTI_item", false, [], true, "F2"),
					fieldsPage(),
				],
				expectedGraphql: 6,
			},
		] as const;
		for (const scenario of scenarios) {
			const executor = new ArchiveExecutor(scenario.responses);
			await new ProjectV2Client(executor.execute).inspectItem(request);
			assert.equal(
				archiveQueries(executor).length,
				scenario.expectedGraphql,
				scenario.name,
			);
		}
	});

	it("counts complete absent traversal without a false membership", async () => {
		const executor = new ArchiveExecutor([
			project,
			issuePage([], true, "I2"),
			issuePage([], true, "I3"),
			issuePage([]),
			projectPage([], true, "P2"),
			projectPage([], true, "P3"),
			projectPage([]),
		]);
		await assert.rejects(
			new ProjectV2Client(executor.execute).inspectItem(request),
			ProjectItemNotFoundError,
		);
		assert.equal(archiveQueries(executor).length, 6);
	});
});
