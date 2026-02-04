import { compileSemesterPlan } from "../compile";
import { validateIR } from "../validate";
import { GOLDEN_INPUT } from "./golden-input";
import { GOLDEN_OUTPUT } from "./golden-output";

export function runGoldenTest() {
	// 1. Validate Input (simulate full pipeline flow)
	const validated = validateIR(GOLDEN_INPUT);

	// 2. Compile
	const result = compileSemesterPlan(validated);

	// 3. Deep Compare
	const resultJson = JSON.stringify(result);
	const goldenJson = JSON.stringify(GOLDEN_OUTPUT);

	if (resultJson !== goldenJson) {
		throw new Error(`GOLDEN MISMATCH!\nExpected: ${goldenJson}\nActual:   ${resultJson}`);
	}
}

// Auto-run if executed directly (mock logic for simple TS execution)
// In a real setup, this would be a test runner.
// For now, we export execution logic.
