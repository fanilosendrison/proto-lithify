import type { ObservedProjectFieldValue } from "../project-items/types.ts";

type JsonRecord = Readonly<Record<string, unknown>>;

// Preserve the legacy public string projection separately from semantic evidence.
export function observeProjectFieldValue(raw: JsonRecord): ObservedProjectFieldValue {
	const projected = raw.name ?? raw.text ?? raw.number ?? raw.date ?? raw.title ?? null;
	const value = projected === null ? null : String(projected);
	const variants = {
		ProjectV2ItemFieldSingleSelectValue: ["single-select", "name", "string"],
		ProjectV2ItemFieldTextValue: ["text", "text", "string"],
		ProjectV2ItemFieldNumberValue: ["number", "number", "number"],
		ProjectV2ItemFieldDateValue: ["date", "date", "string"],
		ProjectV2ItemFieldIterationValue: ["iteration", "title", "string"],
	} as const;
	const typename = raw.__typename;
	if (typeof typename !== "string" || !Object.hasOwn(variants, typename)) {
		return { type: "unproven", value };
	}
	const [type, property, primitive] = variants[typename as keyof typeof variants];
	const content = raw[property];
	const field = raw.field;
	const expectedFieldType =
		type === "single-select"
			? "ProjectV2SingleSelectField"
			: type === "iteration"
				? "ProjectV2IterationField"
				: "ProjectV2Field";
	const fieldTypeMatches =
		typeof field === "object" &&
		field !== null &&
		!Array.isArray(field) &&
		(field as JsonRecord).__typename === expectedFieldType;
	const contradictory = ["name", "text", "number", "date", "title"].some(
		(key) => key !== property && Object.hasOwn(raw, key),
	);
	if (
		!fieldTypeMatches ||
		contradictory ||
		typeof content !== primitive ||
		(typeof content === "number" && !Number.isFinite(content)) ||
		(type === "single-select" && content === "")
	) {
		return { type: "unproven", value };
	}
	return { type, value };
}
