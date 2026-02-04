import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { planSemester } from "../planner";
import { runCompiler } from "../compiler";

export function runPipeline(userInput: string): CompiledSemesterPlan {
	const plannedData = planSemester(userInput);
	return runCompiler(plannedData);
}
