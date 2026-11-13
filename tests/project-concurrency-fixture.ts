import assert from "node:assert/strict";
import { ProjectItemNotFoundError } from "../src/github/project-v2-client.ts";
import type {
	GithubProjectGateway,
	ItemInspectionRequest,
} from "../src/project-items/types.ts";
import type { ItemSnapshot } from "../src/receipts/schemas.ts";
import { singleSelectObservation } from "./single-select-observation-fixture.ts";

export const fieldRequest = {
	projectOwner: "Example",
	projectNumber: 3,
	repository: "Example/Repository",
	issueNumber: 42,
	fieldName: "Status",
	optionName: "Ready",
};
export function snapshot(
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
export class Barrier {
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
export class ScriptedGateway implements GithubProjectGateway {
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

	async inspectItemObservation(request: ItemInspectionRequest) {
		return singleSelectObservation(await this.inspectItem(request));
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
export function absent(): ProjectItemNotFoundError {
	return new ProjectItemNotFoundError("not present");
}
export class SharedFieldState {
	status = "Backlog";
	readonly edits: string[] = [];
}
export class SharedFieldGateway implements GithubProjectGateway {
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

	async inspectItemObservation() {
		return singleSelectObservation(await this.inspectItem());
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
