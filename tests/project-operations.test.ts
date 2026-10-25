import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProjectItemNotFoundError } from "../src/github/project-v2-client.ts";
import { ProjectItemOperations } from "../src/project-items/project-item-operations.ts";
import type {
	GithubProjectGateway,
	ItemInspectionRequest,
} from "../src/project-items/types.ts";
import type { ItemSnapshot } from "../src/receipts/schemas.ts";

class MutableGateway implements GithubProjectGateway {
	currentOption = "Backlog";
	itemExists = true;
	applyEdit = true;
	applyAdd = true;
	inspectionError: Error | null = null;
	inspectCalls = 0;
	editCalls = 0;
	addCalls = 0;

	async inspectItem(_request: ItemInspectionRequest): Promise<ItemSnapshot> {
		this.inspectCalls += 1;
		if (this.inspectionError !== null) throw this.inspectionError;
		if (!this.itemExists) throw new ProjectItemNotFoundError("not present");
		return {
			project: {
				id: "PVT_project",
				number: 3,
				owner: "example",
				title: "Engineering",
			},
			issue: {
				id: "I_issue",
				number: 42,
				repository: "example/repository",
			},
			itemId: "PVTI_item",
			fields: { Status: this.currentOption },
		};
	}

	async resolveSingleSelect() {
		return { fieldId: "field-status", optionId: "option-ready" };
	}

	async editSingleSelect(): Promise<void> {
		this.editCalls += 1;
		if (this.applyEdit) this.currentOption = "Ready";
	}

	async addItem(): Promise<void> {
		this.addCalls += 1;
		if (this.applyAdd) this.itemExists = true;
	}
}

const request = {
	projectOwner: "example",
	projectNumber: 3,
	repository: "example/repository",
	issueNumber: 42,
	fieldName: "Status",
	optionName: "Ready",
};

describe("ProjectItemOperations", () => {
	it("returns noop when the requested value is already current", async () => {
		const gateway = new MutableGateway();
		gateway.currentOption = "Ready";
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(request);
		assert.strictEqual(receipt.outcome, "noop");
		assert.strictEqual(gateway.editCalls, 0);
		assert.strictEqual(receipt.postcondition.verified, true);
	});

	it("re-reads and verifies an applied field mutation", async () => {
		const gateway = new MutableGateway();
		const receipt = await new ProjectItemOperations(gateway).setSingleSelect(request);
		assert.strictEqual(receipt.outcome, "applied");
		assert.strictEqual(gateway.editCalls, 1);
		assert.strictEqual(receipt.after?.fields.Status, "Ready");
		assert.strictEqual(receipt.postcondition.verified, true);
	});

	it("fails when the fresh field read does not prove the mutation", async () => {
		const gateway = new MutableGateway();
		gateway.applyEdit = false;
		await assert.rejects(
			new ProjectItemOperations(gateway).setSingleSelect(request),
			/postcondition failed/,
		);
	});

	it("does not add an Issue already present in the Project", async () => {
		const gateway = new MutableGateway();
		const receipt = await new ProjectItemOperations(gateway).addItem(request);
		assert.strictEqual(receipt.outcome, "noop");
		assert.strictEqual(gateway.addCalls, 0);
		assert.strictEqual(receipt.postcondition.verified, true);
		assert.strictEqual(
			receipt.request.issueUrl,
			"https://github.com/example/repository/issues/42",
		);
	});

	it("adds an absent Issue and verifies its Project item", async () => {
		const gateway = new MutableGateway();
		gateway.itemExists = false;
		const receipt = await new ProjectItemOperations(gateway).addItem(request);
		assert.strictEqual(receipt.outcome, "applied");
		assert.strictEqual(gateway.addCalls, 1);
		assert.strictEqual(receipt.after?.itemId, "PVTI_item");
		assert.strictEqual(receipt.postcondition.verified, true);
		assert.strictEqual(
			receipt.request.issueUrl,
			"https://github.com/example/repository/issues/42",
		);
	});

	it("does not mutate when membership inspection is inconsistent", async () => {
		const gateway = new MutableGateway();
		gateway.inspectionError = new Error("inconsistent membership");
		await assert.rejects(
			new ProjectItemOperations(gateway).addItem(request),
			/inconsistent membership/,
		);
		assert.strictEqual(gateway.addCalls, 0);
	});

	it("fails when the fresh read does not confirm an accepted add", async () => {
		const gateway = new MutableGateway();
		gateway.itemExists = false;
		gateway.applyAdd = false;
		await assert.rejects(
			new ProjectItemOperations(gateway).addItem(request),
			(error: unknown) =>
				error instanceof Error &&
				/submitted.*do not retry automatically/i.test(error.message) &&
				error.cause instanceof ProjectItemNotFoundError,
		);
		assert.strictEqual(gateway.addCalls, 1);
		assert.strictEqual(gateway.inspectCalls, 2);
	});

	it("rejects an invalid direct identity before gateway access", async () => {
		const gateway = new MutableGateway();
		await assert.rejects(
			new ProjectItemOperations(gateway).addItem({
				...request,
				repository: "invalid/repository/identity",
			}),
			/GitHub repository must use owner\/name/,
		);
		assert.strictEqual(gateway.inspectCalls, 0);
		assert.strictEqual(gateway.addCalls, 0);
	});
});
