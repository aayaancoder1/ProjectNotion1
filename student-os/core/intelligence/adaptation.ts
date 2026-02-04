import { PatternInsights } from "./patterns";

export interface WeightModifiers {
	urgencyMultiplier: number;
	importanceMultiplier: number;
	complexityPenalty: number;
}

export const DEFAULT_MODIFIERS: WeightModifiers = {
	urgencyMultiplier: 1.0,
	importanceMultiplier: 1.0,
	complexityPenalty: 1.0,
};

export function adaptWeights(patterns: PatternInsights): WeightModifiers {
	const modifiers = { ...DEFAULT_MODIFIERS };

	// Rule 1: If multiple courses are lagging, current pacing is failing. 
	// Increase urgency to force earlier starts.
	if (patterns.laggingCourses.length > 0) {
		modifiers.urgencyMultiplier += 0.2 * patterns.laggingCourses.length;
	}

	// Rule 2: If failing specific challenging task types (e.g. Exams), 
	// increase importance to prioritize them higher.
	if (patterns.strugglingTaskTypes.includes("Exam") || patterns.strugglingTaskTypes.includes("Project")) {
		modifiers.importanceMultiplier += 0.5;
	}

	// Rule 3: General overwhelmed state (many courses lagging)
	// Reduce complexity penalty? No, maybe increase it to favor smaller tasks?
	// Let's just keep it simple: Increase urgency.

	return modifiers;
}
