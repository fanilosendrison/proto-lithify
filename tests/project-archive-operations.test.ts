import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCli } from "../src/entrypoints/cli.ts";
import { ProjectItemNotFoundError } from "../src/github/project-v2-client.ts";
import { ProjectItemOperations } from "../src/project-items/project-item-operations.ts";
import type {
	GithubProjectGateway,
	ItemInspectionRequest,
} from "../src/project-items/types.ts";
import type { ItemSnapshot } from "../src/receipts/schemas.ts";
import { ArchiveExecutor, request, validResponses } from "./project-archive-fixture.ts";

const fieldRequest = { ...request, fieldName: "Status", optionName: "Ready" };

function snapshot(status: string, isArchived: boolean): ItemSnapshot {
	return {
		project: { id: "PVT_project", number: 3, owner: "example", title: "Engineering" },
		issue: { id: "I_target", number: 42, repository: "example/repository" },
		itemId: "PVTI_item",
		isArchived,
		fields: { Status: status },
	};
}

class ArchiveGateway implements GithubProjectGateway {
	readonly observations: Array<ItemSnapshot | Error>;
	inspectCalls = 0;
	resolveCalls = 0;
	editCalls = 0;
	addCalls = 0;

	constructor(observations: Array<ItemSnapshot | Error>) {
		this.observations = observations;
	}

	async inspectItem(_request: ItemInspectionRequest): Promise<ItemSnapshot> {
		this.inspectCalls += 1;
		const result = this.observations.shift();
		assert.notEqual(result, undefined, "unexpected inspection");
		if (result instanceof Error) throw result;
		return result as ItemSnapshot;
	}

	async resolveSingleSelect() {
		this.resolveCalls += 1;
		return { fieldId: "FIELD_STATUS", optionId: "OPTION_READY" };
	}

	async editSingleSelect(): Promise<void> {
		this.editCalls += 1;
	}

	async addItem(): Promise<void> {
		this.addCalls += 1;
	}
}

async function captureStdout(action: () => Promise<number>): Promise<{
	readonly status: number;
	readonly output: string;
}> {
	const original = process.stdout.write;
	let output = "";
	process.stdout.write = ((chunk: string | Uint8Array) => {
		output += String(chunk);
		return true;
	}) as typeof process.stdout.write;
	try {
		return { status: await action(), output };
	} finally {
		process.stdout.write = original;
	}
}

describe("archive-aware Project item operations", () => {
	it("T03 item.inspect emits exact archived state and identity", async () => {
		const executor = new ArchiveExecutor(validResponses(true));
		const result = await captureStdout(
			async () =>
				await runCli(
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
					executor.execute,
				),
		);
		assert.equal(result.status, 0);
		const receipt = JSON.parse(result.output);
		assert.equal(receipt.after.itemId, "PVTI_item");
		assert.equal(receipt.after.isArchived, true);
	});

	it("T04 archived membership makes item.add a zero-write noop", async () => {
		const gateway = new ArchiveGateway([snapshot("Backlog", true)]);
		const receipt = await new ProjectItemOperations(gateway).addItem(request);
		assert.equal(receipt.outcome, "noop");
		assert.equal(receipt.after?.isArchived, true);
		assert.equal(gateway.addCalls, 0);
		assert.equal(gateway.inspectCalls, 1);
	});

	it("T05 archived equal field makes field.set a one-read noop", async () => {
		const gateway = new ArchiveGateway([snapshot("Ready", true)]);
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(
			fieldRequest,
		);
		assert.equal(receipt.outcome, "noop");
		assert.equal(receipt.after?.isArchived, true);
		assert.deepEqual(
			[gateway.inspectCalls, gateway.resolveCalls, gateway.editCalls],
			[1, 0, 0],
		);
	});

	it("T06 archived differing field rejects before resolution and mutation", async () => {
		const gateway = new ArchiveGateway([snapshot("Backlog", true)]);
		await assert.rejects(
			new ProjectItemOperations(gateway).setSingleSelect(fieldRequest),
			/archived Project item/,
		);
		assert.deepEqual([gateway.resolveCalls, gateway.editCalls], [0, 0]);
	});

	it("T17 rejects concurrent archiving after one submitted field mutation", async () => {
		const gateway = new ArchiveGateway([
			snapshot("Backlog", false),
			snapshot("Ready", true),
		]);
		await assert.rejects(
			new ProjectItemOperations(gateway).setSingleSelect(fieldRequest),
			/archive-state postcondition failed after submission.*do not retry/i,
		);
		assert.equal(gateway.editCalls, 1);
		assert.equal(gateway.inspectCalls, 2);
	});

	it("T18 preserves normal active applied behavior", async () => {
		const gateway = new ArchiveGateway([
			snapshot("Backlog", false),
			snapshot("Ready", false),
		]);
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(
			fieldRequest,
		);
		assert.equal(receipt.outcome, "applied");
		assert.equal(receipt.after?.isArchived, false);
		assert.equal(gateway.editCalls, 1);
	});

	it("T19 permits archived membership observed after one add", async () => {
		const gateway = new ArchiveGateway([
			new ProjectItemNotFoundError("absent"),
			snapshot("Backlog", true),
		]);
		const receipt = await new ProjectItemOperations(gateway).addItem(request);
		assert.equal(receipt.outcome, "applied");
		assert.equal(receipt.after?.isArchived, true);
		assert.equal(gateway.addCalls, 1);
	});

	it("T20 never verifies or retries an add after an inconclusive read", async () => {
		for (const after of [
			new ProjectItemNotFoundError("missing"),
			new Error("contradictory archive evidence"),
		]) {
			const gateway = new ArchiveGateway([
				new ProjectItemNotFoundError("absent"),
				after,
			]);
			await assert.rejects(
				new ProjectItemOperations(gateway).addItem(request),
				/submitted.*do not retry automatically/i,
			);
			assert.equal(gateway.addCalls, 1);
			assert.equal(gateway.inspectCalls, 2);
		}
	});
});
