import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { planSemester } from "../planner";
import { runCompiler } from "../compiler";
import { executePlan, ExecutorResult } from "../executor";
import { adaptWeights, detectPatterns, IntelligenceTrace, reviewWeeklyExecution } from "../intelligence";
import { getRuntimeMode, RuntimeMode } from "../runtime/mode";
import { validateEnv } from "../env/validateEnv";

export interface PipelineResult {
	plan: CompiledSemesterPlan;
	execution: ExecutorResult;
	intelligence: IntelligenceTrace;
	runtime: {
		mode: RuntimeMode;
	};
}

export async function runPipeline(userInput: string): Promise<PipelineResult> {
	// 0. Safety & Env Check
	validateEnv();
	const mode = getRuntimeMode();

	// 1. Intelligence Layer (Analyze Context)
	// Since we don't have historical data persistence yet, we simulate a "fresh" start or
	// analyze the specific input if it contained history.
	// For Phase 4.5, we run the intelligence logic on the PLANNED semester to simulate
	// what it WOULD think if this was the state.
	// Wait, intelligence reviews *past* execution. 
	// "Comparing Planned weekly focus vs Actual task status".
	// As a fresh run, we have no "Actual".
	// So we pass empty tasks to simulate "Clean Slate".
	const executionReview = reviewWeeklyExecution([], 1);
	const patterns = detectPatterns([], []);
	const { trace, modifiers } = adaptWeights(patterns, { total: executionReview.totalScheduled, missed: executionReview.missed.length });

	// 2. Planner layer (Includes internal prompts, parsing, and strict guard validation)
	const plannedData = planSemester(userInput, { trace, modifiers });

	// 3. Compiler layer (Standard compilation)
	const compiledPlan = runCompiler(plannedData);

	// 4. Executor layer (Dry-run simulation + Notion probe)
	const executionResult = await executePlan(compiledPlan);

	return {
		plan: compiledPlan,
		execution: executionResult,
		intelligence: trace,
		runtime: {
			mode
		}
	};
}
