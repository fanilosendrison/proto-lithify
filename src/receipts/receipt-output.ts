import { CommandReceiptSchema } from "./command-receipt-schemas.ts";

export class ReceiptOutputValidationError extends Error {
	readonly code = "RECEIPT_VALIDATION_FAILED";

	constructor() {
		super(
			"Produced success receipt failed strict validation; a submitted remote mutation may have an undetermined effect",
		);
		this.name = "ReceiptOutputValidationError";
	}
}

export function validateProducedSuccessReceipt(value: unknown) {
	const result = CommandReceiptSchema.safeParse(value);
	if (!result.success) throw new ReceiptOutputValidationError();
	return result.data;
}
