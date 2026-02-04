import { IntelligenceTrace } from "../intelligence/trace";
import { WeightModifiers } from "../intelligence/adaptation";

export interface PlannerContext {
	trace: IntelligenceTrace;
	modifiers: WeightModifiers;
}
