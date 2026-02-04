import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { parseInput } from "./parse";
import { validateIR } from "./validate";
import { compileSemesterPlan } from "./compile";

export function runCompiler(): CompiledSemesterPlan {
	const parsed = parseInput();
	const validated = validateIR(parsed);
	return compileSemesterPlan(validated);
}
