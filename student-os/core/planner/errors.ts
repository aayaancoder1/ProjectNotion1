export class PlannerJSONParseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PlannerJSONParseError";
	}
}

export class PlannerSchemaViolationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PlannerSchemaViolationError";
	}
}

export class PlannerVersionMismatchError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PlannerVersionMismatchError";
	}
}
