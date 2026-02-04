import { COMPILER_IR_VERSION } from "../../types/compiler-ir";

export const PLANNER_VERSION = "v1";

if (PLANNER_VERSION !== COMPILER_IR_VERSION) {
	throw new Error(`CRITICAL: PLANNER_VERSION (${PLANNER_VERSION}) does not match COMPILER_IR_VERSION (${COMPILER_IR_VERSION})`);
}
