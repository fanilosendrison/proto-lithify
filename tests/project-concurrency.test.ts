import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProjectItemOperations } from "../src/project-items/project-item-operations.ts";
import { CommandReceiptSchema, type ItemSnapshot } from "../src/receipts/schemas.ts";
import {
	absent,
	Barrier,
	fieldRequest,
	ScriptedGateway,
	SharedFieldGateway,
	SharedFieldState,
	snapshot,
} from "./project-concurrency-fixture.ts";

describe("Project item concurrency proof boundaries", () => {
	it("C01 preserves A's observation after B performs a later overwrite", async () => {
		const state = new SharedFieldState();
		const a = new SharedFieldGateway(state);
		const b = new SharedFieldGateway(state);
		const receiptA = await new ProjectItemOperations(a).setSingleSelect(fieldRequest);
		const receiptB = await new ProjectItemOperations(b).setSingleSelect({
			...fieldRequest,
			optionName: "In Progress",
		});
		assert.equal(receiptA.outcome, "applied");
		assert.equal(receiptA.after?.fields.Status, "Ready");
		assert.equal(receiptB.outcome, "applied");
		assert.equal(state.status, "In Progress");
		assert.deepEqual(state.edits, ["Ready", "In Progress"]);
		assert.doesNotMatch(receiptA.postcondition.description, /permanent|exclusive/i);
	});
	it("C02 rejects A when B overwrites shared state before A verifies", async () => {
		const state = new SharedFieldState();
		const a = new SharedFieldGateway(state);
		const b = new SharedFieldGateway(state);
		a.afterEdit = async () => {
			await new ProjectItemOperations(b).setSingleSelect({
				...fieldRequest,
				optionName: "In Progress",
			});
		};
		await assert.rejects(
			new ProjectItemOperations(a).setSingleSelect(fieldRequest),
			/field mutation postcondition failed/i,
		);
		assert.equal(state.status, "In Progress");
		assert.deepEqual(state.edits, ["Ready", "In Progress"]);
		assert.equal(a.editTargets.length, 1);
	});
	it("C03 permits two barrier-synchronized same-value writes", async () => {
		const state = new SharedFieldState();
		const barrier = new Barrier(2);
		const a = new SharedFieldGateway(state);
		const b = new SharedFieldGateway(state);
		a.initialReadBarrier = barrier;
		b.initialReadBarrier = barrier;
		const [receiptA, receiptB] = await Promise.all([
			new ProjectItemOperations(a).setSingleSelect(fieldRequest),
			new ProjectItemOperations(b).setSingleSelect(fieldRequest),
		]);
		assert.equal(receiptA.outcome, "applied");
		assert.equal(receiptB.outcome, "applied");
		assert.deepEqual(state.edits, ["Ready", "Ready"]);
		assert.equal(state.status, "Ready");
		for (const receipt of [receiptA, receiptB]) {
			assert.doesNotMatch(receipt.postcondition.description, /caused|exclusive/i);
		}
	});

	for (const [name, changed, pattern] of [
		["C04 item replacement", { itemId: "PVTI_Y" }, /item identity/i],
		["C05 Project replacement", { projectId: "PVT_B" }, /project identity/i],
		["C06 Issue replacement", { issueId: "I_B" }, /issue identity/i],
	] as const) {
		it(`rejects ${name} even when the requested value matches`, async () => {
			const gateway = new ScriptedGateway([
				snapshot("Backlog"),
				snapshot("Ready", changed),
			]);
			await assert.rejects(
				new ProjectItemOperations(gateway).setSingleSelect(fieldRequest),
				pattern,
			);
			assert.equal(gateway.editCalls, 1);
		});
	}

	it("C07 rejects misrouted field noops before field resolution or mutation", async () => {
		const mismatches = [
			{ projectOwner: "other" },
			{ projectNumber: 4 },
			{ repository: "example/other" },
			{ issueNumber: 43 },
		];
		for (const mismatch of mismatches) {
			const gateway = new ScriptedGateway([snapshot("Ready", mismatch)]);
			await assert.rejects(
				new ProjectItemOperations(gateway).setSingleSelect(fieldRequest),
				/request target/i,
			);
			assert.equal(gateway.resolveCalls, 0);
			assert.equal(gateway.editCalls, 0);
		}
	});

	it("C07 validates snapshot schema before accepting a noop", async () => {
		const invalid = snapshot("Ready");
		const gateway = new ScriptedGateway([{ ...invalid, itemId: "" } as ItemSnapshot]);
		await assert.rejects(
			new ProjectItemOperations(gateway).setSingleSelect(fieldRequest),
		);
		assert.equal(gateway.resolveCalls, 0);
		assert.equal(gateway.editCalls, 0);
	});

	it("C07 rejects a misrouted item.add noop before mutation", async () => {
		const gateway = new ScriptedGateway([
			snapshot("Ready", { repository: "example/other" }),
		]);
		await assert.rejects(
			new ProjectItemOperations(gateway).addItem(fieldRequest),
			/request target/i,
		);
		assert.equal(gateway.addCalls, 0);
	});

	it("C08 accepts unrelated field changes for the same exact target", async () => {
		const gateway = new ScriptedGateway([
			snapshot("Backlog", { priority: "P1" }),
			snapshot("Ready", { priority: "P2" }),
		]);
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(
			fieldRequest,
		);
		assert.equal(receipt.outcome, "applied");
		assert.equal(receipt.after?.fields.Priority, "P2");
		assert.equal(gateway.lastEdit?.projectId, "PVT_A");
		assert.equal(gateway.lastEdit?.itemId, "PVTI_X");
	});

	it("C08 ignores hostile runtime target properties from field resolution", async () => {
		const state = new SharedFieldState();
		const gateway = new SharedFieldGateway(state);
		gateway.resolverAddsHostileTargets = true;
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(
			fieldRequest,
		);
		assert.equal(receipt.outcome, "applied");
		assert.deepEqual(gateway.editTargets, [
			{
				projectId: "PVT_A",
				itemId: "PVTI_X",
				fieldId: "FIELD_STATUS",
				optionId: "Ready",
			},
		]);
	});

	it("C09 uses one validated observation for an exact noop", async () => {
		const gateway = new ScriptedGateway([snapshot("Ready")]);
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(
			fieldRequest,
		);
		assert.equal(receipt.outcome, "noop");
		assert.equal(gateway.inspectCalls, 1);
		assert.equal(gateway.editCalls, 0);
		assert.strictEqual(receipt.before, receipt.after);
	});

	it("C10 supports concurrent adds through independently verified observations", async () => {
		let members = 0;
		const initialReadBarrier = new Barrier(2);
		const makeGateway = () => {
			const gateway = new ScriptedGateway([absent(), snapshot("Ready")]);
			gateway.onInspect = async (call) => {
				if (call === 1) await initialReadBarrier.arrive();
			};
			gateway.onAdd = () => {
				members = 1;
			};
			return gateway;
		};
		const first = makeGateway();
		const second = makeGateway();
		const [a, b] = await Promise.all([
			new ProjectItemOperations(first).addItem(fieldRequest),
			new ProjectItemOperations(second).addItem(fieldRequest),
		]);
		assert.equal(a.outcome, "applied");
		assert.equal(b.outcome, "applied");
		assert.equal(members, 1);
		assert.equal(first.addCalls + second.addCalls, 2);
	});

	it("C11 rejects wrong membership after one submitted add", async () => {
		const gateway = new ScriptedGateway([
			absent(),
			snapshot("Ready", { projectNumber: 4 }),
		]);
		await assert.rejects(
			new ProjectItemOperations(gateway).addItem(fieldRequest),
			/target identity inspection failed/i,
		);
		assert.equal(gateway.addCalls, 1);
		assert.equal(gateway.inspectCalls, 2);
	});

	it("C15 reports unverifiable fresh reads without retry or rollback claims", async () => {
		for (const operation of ["field", "item"] as const) {
			const gateway = new ScriptedGateway([
				operation === "field" ? snapshot("Backlog") : absent(),
				new Error("fresh read unavailable"),
			]);
			const promise =
				operation === "field"
					? new ProjectItemOperations(gateway).setSingleSelect(fieldRequest)
					: new ProjectItemOperations(gateway).addItem(fieldRequest);
			await assert.rejects(promise, /submitted.*do not retry automatically/i);
			assert.equal(operation === "field" ? gateway.editCalls : gateway.addCalls, 1);
			assert.equal(gateway.inspectCalls, 2);
		}
	});

	it("C16 preserves the receipt shape under producer schema version 2", async () => {
		const gateway = new ScriptedGateway([snapshot("Ready")]);
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(
			fieldRequest,
		);
		assert.equal(CommandReceiptSchema.parse(receipt).schemaVersion, 2);
		assert.deepEqual(Object.keys(receipt).sort(), [
			"after",
			"before",
			"command",
			"outcome",
			"postcondition",
			"request",
			"schemaVersion",
			"target",
		]);
	});
});
