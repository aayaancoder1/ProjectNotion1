import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { parseInput, ParsedData } from "./parse";
import { validateIR } from "./validate";
import { compileSemesterPlan } from "./compile";

export function runCompiler(input?: ParsedData): CompiledSemesterPlan {
	const parsed = input || parseInput();
	const validated = validateIR(parsed);
	return compileSemesterPlan(validated);
}
