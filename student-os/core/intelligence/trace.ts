import { PatternInsights } from "./patterns";
import { WeightModifiers } from "./adaptation";

export interface IntelligenceTrace {
	inputSummary: {
		totalTasks: number;
		missedTasks: number;
	};
	patternsDetected: PatternInsights;
	weightAdjustments: WeightModifiers;
	finalDecisionFactors: {
		primaryDriver: "Urgency" | "Importance" | "Recovery" | "Standard";
		explanationCode: string; // e.g., "LAGGING_RECOVERY_MODE"
	};
}
