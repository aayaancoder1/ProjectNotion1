import { ParsedData } from "./parse";

export function validateIR(data: ParsedData): ParsedData {
	if (!Array.isArray(data.courses) || !Array.isArray(data.tasks)) {
		throw new Error("Invalid IR: courses and tasks must be arrays.");
	}
	return data;
}
