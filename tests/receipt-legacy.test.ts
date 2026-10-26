import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { z } from "zod";
import * as ReceiptExports from "../src/receipts/schemas.ts";

function schema(name: string): z.ZodType {
	const value = (ReceiptExports as unknown as Record<string, unknown>)[name];
	assert.ok(
		value !== null && typeof value === "object" && "safeParse" in value,
		`missing receipt schema export: ${name}`,
	);
	return value as z.ZodType;
}

const legacyItem = {
	project: { id: "PVT", number: 3, owner: "example", title: "Engineering" },
	issue: { id: "I", number: 42, repository: "example/repository" },
	itemId: "PVTI",
	fields: { Status: "Ready" },
};
const legacyDependency = { blockedBy: [41] };

function legacySuccess(after: unknown): Record<string, unknown> {
	return {
		schemaVersion: 1,
		command: "historical.command",
		outcome: "inspected",
		target: { historical: "target" },
		request: { accepted: true },
		before: null,
		after,
		postcondition: { verified: false, description: "Historical weak envelope" },
	};
}

const v2Doctor = {
	schemaVersion: 2,
	command: "doctor",
	outcome: "inspected",
	target: {},
	request: {},
	before: null,
	after: { ghVersion: "gh version fixture", authenticated: true },
	postcondition: { verified: true, description: "Authenticated" },
};

describe("versioned receipt compatibility", () => {
	it("T21-T22 reads historical weak v1 success envelopes without reinterpretation", () => {
		const legacy = schema("LegacyCommandReceiptV1Schema");
		const versioned = schema("VersionedCommandReceiptSchema");
		const withoutBefore = legacySuccess(legacyItem);
		delete withoutBefore.before;
		const withoutAfter = legacySuccess(legacyDependency);
		delete withoutAfter.after;
		for (const candidate of [
			legacySuccess(legacyItem),
			legacySuccess(legacyDependency),
			withoutBefore,
			withoutAfter,
		]) {
			assert.equal(legacy.safeParse(candidate).success, true);
			assert.equal(versioned.safeParse(candidate).success, true);
			const parsed = legacy.parse({ ...candidate, historicalExtra: "stripped by v1" });
			assert.equal((parsed as Record<string, unknown>).schemaVersion, 1);
		}
	});

	it("T23 rejects legacy receipts in the strict v2 producer", () => {
		const current = schema("CommandReceiptSchema");
		assert.equal(current.safeParse(legacySuccess(legacyItem)).success, false);
	});

	it("T24 separates v1-only, v2-only, and versioned readers", () => {
		const legacy = schema("LegacyCommandReceiptV1Schema");
		const current = schema("CommandReceiptSchema");
		const versioned = schema("VersionedCommandReceiptSchema");
		assert.equal(legacy.safeParse(v2Doctor).success, false);
		assert.equal(current.safeParse(v2Doctor).success, true);
		assert.equal(versioned.safeParse(v2Doctor).success, true);
	});

	it("T25 reads historical errors while the producer emits strict v2 errors", () => {
		const legacy = schema("LegacyErrorReceiptV1Schema");
		const current = schema("ErrorReceiptSchema");
		const versioned = schema("VersionedErrorReceiptSchema");
		const v1 = { schemaVersion: 1, error: { code: "OLD", message: "historical" } };
		const v2 = { schemaVersion: 2, error: { code: "NEW", message: "current" } };
		assert.equal(legacy.safeParse(v1).success, true);
		assert.equal(versioned.safeParse(v1).success, true);
		assert.equal(current.safeParse(v1).success, false);
		assert.equal(legacy.safeParse(v2).success, false);
		assert.equal(current.safeParse(v2).success, true);
		assert.equal(versioned.safeParse(v2).success, true);
	});

	it("the public commandReceipt producer creates version 2 only", () => {
		const factory = (ReceiptExports as unknown as Record<string, unknown>)
			.commandReceipt;
		assert.equal(typeof factory, "function");
		const receipt = (
			factory as (value: Record<string, unknown>) => Record<string, unknown>
		)({
			command: "doctor",
			outcome: "inspected",
			target: {},
			request: {},
			before: null,
			after: { ghVersion: "gh", authenticated: true },
			postcondition: { verified: true, description: "ok" },
		});
		assert.equal(receipt.schemaVersion, 2);
	});
});
