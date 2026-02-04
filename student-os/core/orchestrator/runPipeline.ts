import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { planSemester } from "../planner";
import { runCompiler } from "../compiler";
import { executePlan, ExecutorResult } from "../executor";

export interface PipelineResult {
	plan: CompiledSemesterPlan;
	execution: ExecutorResult;
}

export async function runPipeline(userInput: string): Promise<PipelineResult> {
	// Planner layer (Includes internal prompts, parsing, and strict guard validation)
	const plannedData = planSemester(userInput);

	// Compiler layer (Standard compilation)
	const compiledPlan = runCompiler(plannedData);

	// Executor layer (Dry-run simulation + Notion probe)
	const executionResult = await executePlan(compiledPlan);

	return {
		plan: compiledPlan,
		execution: executionResult,
	};
}
