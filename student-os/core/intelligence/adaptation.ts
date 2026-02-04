import { PatternInsights } from "./patterns";
import { IntelligenceTrace } from "./trace";

export interface WeightModifiers {
	urgencyMultiplier: number;
	importanceMultiplier: number;
	complexityPenalty: number;
}

export interface AdaptationResult {
	modifiers: WeightModifiers;
	trace: IntelligenceTrace;
}

export const DEFAULT_MODIFIERS: WeightModifiers = {
	urgencyMultiplier: 1.0,
	importanceMultiplier: 1.0,
	complexityPenalty: 1.0,
};

export function adaptWeights(patterns: PatternInsights, inputStats: { total: number, missed: number }): AdaptationResult {
	const modifiers = { ...DEFAULT_MODIFIERS };
	let primaryDriver: IntelligenceTrace["finalDecisionFactors"]["primaryDriver"] = "Standard";
	let explanationCode = "NORMAL_OPERATION";

	// Rule 1: Lagging Courses
	if (patterns.laggingCourses.length > 0) {
		modifiers.urgencyMultiplier += 0.2 * patterns.laggingCourses.length;
		primaryDriver = "Recovery";
		explanationCode = "LAGGING_COURSES_DETECTED";
	}

	// Rule 2: Struggling Task Types
	if (patterns.strugglingTaskTypes.includes("Exam") || patterns.strugglingTaskTypes.includes("Project")) {
		modifiers.importanceMultiplier += 0.5;
		if (primaryDriver === "Standard") primaryDriver = "Importance";
		explanationCode = "CRITICAL_TASK_TYPE_FOCUS";
	}

	// Rule 3: General overwhelmed state (many courses lagging)
	// Reduce complexity penalty? No, maybe increase it to favor smaller tasks?
	// Let's just keep it simple: Increase urgency.

	// Generate Trace
	const trace: IntelligenceTrace = {
		inputSummary: {
			totalTasks: inputStats.total,
			missedTasks: inputStats.missed,
		},
		patternsDetected: patterns,
		weightAdjustments: modifiers,
		finalDecisionFactors: {
			primaryDriver,
			explanationCode,
		}
	};

	return { modifiers, trace };
}
