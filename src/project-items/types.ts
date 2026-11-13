import type { ItemSnapshot } from "../receipts/schemas.ts";

export interface ItemInspectionRequest {
	readonly projectOwner: string;
	readonly projectNumber: number;
	readonly repository: string;
	readonly issueNumber: number;
}

export interface SingleSelectRequest extends ItemInspectionRequest {
	readonly fieldName: string;
	readonly optionName: string;
}

export interface ObservedProjectFieldValue {
	readonly type:
		| "single-select"
		| "text"
		| "number"
		| "date"
		| "iteration"
		| "unproven";
	readonly value: string | null;
}

export interface ItemObservation {
	readonly snapshot: ItemSnapshot;
	readonly fieldValues: Readonly<Record<string, ObservedProjectFieldValue>>;
}

export interface GithubProjectGateway {
	inspectItem(request: ItemInspectionRequest): Promise<ItemSnapshot>;
	inspectItemObservation(request: ItemInspectionRequest): Promise<ItemObservation>;
	resolveSingleSelect(
		projectId: string,
		fieldName: string,
		optionName: string,
	): Promise<{ readonly fieldId: string; readonly optionId: string }>;
	editSingleSelect(request: {
		readonly projectId: string;
		readonly itemId: string;
		readonly fieldId: string;
		readonly optionId: string;
	}): Promise<void>;
	addItem(request: ItemInspectionRequest): Promise<void>;
}
