import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProjectItemNotFoundError } from "../src/github/project-v2-client.ts";
import { ProjectItemOperations } from "../src/project-items/project-item-operations.ts";
import type {
	GithubProjectGateway,
	ItemInspectionRequest,
} from "../src/project-items/types.ts";
import { CommandReceiptSchema, type ItemSnapshot } from "../src/receipts/schemas.ts";

const fieldRequest = {
	projectOwner: "Example",
	projectNumber: 3,
	repository: "Example/Repository",
	issueNumber: 42,
	fieldName: "Status",
	optionName: "Ready",
};
function snapshot(
	status: string,
	overrides: {
		readonly projectId?: string;
		readonly projectOwner?: string;
		readonly projectNumber?: number;
		readonly issueId?: string;
		readonly repository?: string;
		readonly issueNumber?: number;
		readonly itemId?: string;
		readonly priority?: string;
	} = {},
): ItemSnapshot {
	return {
		project: {
			id: overrides.projectId ?? "PVT_A",
			number: overrides.projectNumber ?? 3,
			owner: overrides.projectOwner ?? "example",
			title: "Mutable Project title",
		},
		issue: {
			id: overrides.issueId ?? "I_A",
			number: overrides.issueNumber ?? 42,
			repository: overrides.repository ?? "example/repository",
		},
		itemId: overrides.itemId ?? "PVTI_X",
		isArchived: false,
		fields: { Status: status, Priority: overrides.priority ?? "P1" },
	};
}
class Barrier {
	readonly #participants: number;
	#arrived = 0;
	#release: (() => void) | undefined;
	readonly #promise: Promise<void>;

	constructor(participants: number) {
		this.#participants = participants;
		this.#promise = new Promise((resolve) => {
			this.#release = resolve;
		});
	}

	async arrive(): Promise<void> {
		this.#arrived += 1;
		if (this.#arrived === this.#participants) this.#release?.();
		await this.#promise;
	}
}
class ScriptedGateway implements GithubProjectGateway {
	readonly inspections: Array<ItemSnapshot | Error>;
	inspectCalls = 0;
	resolveCalls = 0;
	editCalls = 0;
	addCalls = 0;
	lastEdit:
		| {
				readonly projectId: string;
				readonly itemId: string;
				readonly fieldId: string;
				readonly optionId: string;
		  }
		| undefined;
	onInspect: ((call: number) => void | Promise<void>) | undefined;
	onEdit: (() => void | Promise<void>) | undefined;
	onAdd: (() => void | Promise<void>) | undefined;

	constructor(inspections: Array<ItemSnapshot | Error>) {
		this.inspections = inspections;
	}

	async inspectItem(_request: ItemInspectionRequest): Promise<ItemSnapshot> {
		this.inspectCalls += 1;
		await this.onInspect?.(this.inspectCalls);
		const result = this.inspections.shift();
		assert.notEqual(result, undefined, "unexpected inspection");
		if (result instanceof Error) throw result;
		return result as ItemSnapshot;
	}

	async resolveSingleSelect() {
		this.resolveCalls += 1;
		return { fieldId: "FIELD_STATUS", optionId: "OPTION_READY" };
	}

	async editSingleSelect(request: NonNullable<ScriptedGateway["lastEdit"]>) {
		this.editCalls += 1;
		this.lastEdit = request;
		await this.onEdit?.();
	}

	async addItem(): Promise<void> {
		this.addCalls += 1;
		await this.onAdd?.();
	}
}
function absent(): ProjectItemNotFoundError {
	return new ProjectItemNotFoundError("not present");
}
class SharedFieldState {
	status = "Backlog";
	readonly edits: string[] = [];
}
class SharedFieldGateway implements GithubProjectGateway {
	readonly state: SharedFieldState;
	initialReadBarrier: Barrier | undefined;
	afterEdit: (() => void | Promise<void>) | undefined;
	inspectCalls = 0;
	readonly editTargets: Array<{ readonly projectId: string; readonly itemId: string }> =
		[];
	resolverAddsHostileTargets = false;

	constructor(state: SharedFieldState) {
		this.state = state;
	}

	async inspectItem(): Promise<ItemSnapshot> {
		this.inspectCalls += 1;
		const observedStatus = this.state.status;
		if (this.inspectCalls === 1) await this.initialReadBarrier?.arrive();
		return snapshot(observedStatus);
	}

	async resolveSingleSelect(
		_projectId: string,
		_fieldName: string,
		optionName: string,
	) {
		return this.resolverAddsHostileTargets
			? {
					fieldId: "FIELD_STATUS",
					optionId: optionName,
					projectId: "PVT_HOSTILE",
					itemId: "PVTI_HOSTILE",
				}
			: { fieldId: "FIELD_STATUS", optionId: optionName };
	}

	async editSingleSelect(request: {
		readonly projectId: string;
		readonly itemId: string;
		readonly fieldId: string;
		readonly optionId: string;
	}): Promise<void> {
		this.editTargets.push(request);
		this.state.status = request.optionId;
		this.state.edits.push(request.optionId);
		await this.afterEdit?.();
	}

	async addItem(): Promise<void> {
		assert.fail("field fixture must not add an item");
	}
}
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

	it("C16 preserves schema version 1 and receipt shape", async () => {
		const gateway = new ScriptedGateway([snapshot("Ready")]);
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(
			fieldRequest,
		);
		assert.equal(CommandReceiptSchema.parse(receipt).schemaVersion, 1);
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
