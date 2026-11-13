import type { ItemObservation } from "../src/project-items/types.ts";
import type { ItemSnapshot } from "../src/receipts/schemas.ts";

// These operation-level fixtures explicitly model single-select fields.
// Provider discrimination itself is tested with raw responses in field-type-proof.
export function singleSelectObservation(snapshot: ItemSnapshot): ItemObservation {
	return {
		snapshot,
		fieldValues: Object.fromEntries(
			Object.entries(snapshot.fields).map(([name, value]) => [
				name,
				{ type: "single-select" as const, value },
			]),
		),
	};
}
