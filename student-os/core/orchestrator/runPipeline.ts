import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { planSemester } from "../planner";
import { runCompiler } from "../compiler";

export function runPipeline(userInput: string): CompiledSemesterPlan {
	// Planner layer (Includes internal prompts, parsing, and strict guard validation)
	const plannedData = planSemester(userInput);

	// Compiler layer (Standard compilation)
	return runCompiler(plannedData);
}
