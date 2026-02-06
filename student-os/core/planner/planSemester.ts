import { ParsedData } from "../compiler/parse";
import { buildPlanPrompt } from "./plannerPrompt";
import { validatePlannerOutput } from "./validatePlannerOutput";
import { PlannerJSONParseError } from "./errors";
import { PlannerContext } from "./plannerContext";
import { getLLMProvider } from "../llm/client";

export { buildPlanPrompt };


export async function planSemester(input: string, context?: PlannerContext): Promise<ParsedData> {
	// 1. Build the prompt
	const prompt = buildPlanPrompt(input, context);
	let rawJsonString = "";
	const provider = getLLMProvider();

	// 2. Real Intelligence (with Retry)
	if (provider) {
		let attempts = 0;
		const maxAttempts = 2;

		while (attempts < maxAttempts) {
			try {
				// console.log(`Attempting LLM call (Attempt ${attempts + 1})...`);
				rawJsonString = await provider.generateJSON(prompt);
				// Attempt parse immediately to catch bad JSON early so we can retry
				JSON.parse(rawJsonString);
				break; // Success
			} catch (e: any) {
				attempts++;
				console.warn(`LLM Attempt ${attempts} failed: ${e.message}`);
				if (attempts >= maxAttempts) {
					rawJsonString = ""; // Fail
					// If strict failure is desired, we could throw here. 
					// But instructions say "Default to mock planner if ... output fails validation."
				}
			}
		}
	}

	// 3. Fallback or Mock Logic
	if (!rawJsonString) {
		// console.warn("⚠️  LLM unavailable or failed. Using Mock Planner.");
		rawJsonString = JSON.stringify({
			version: "v1",
			courses: [
				{
					id: "planner-course-1",
					name: "Artificial Intelligence (Mock)",
					credits: 4,
					status: "Active",
					totalRisk: 0,
					type: "CORE",
				},
				{
					id: "planner-course-2",
					name: "Ethics in Tech (Mock)",
					credits: 3,
					status: "Active",
					totalRisk: 0,
					type: "ELECTIVE",
				},
			],
			tasks: [
				{
					id: "planner-task-1",
					name: "Neural Networks Project",
					courseId: "planner-course-1",
					type: "Assignment",
					priority: "High",
					dueDate: "2024-03-01T23:59:00Z",
					status: "TODO",
					riskScore: 0,
					dueWeek: 5,
				},
			],
		});
	}

	// 4. Parse JSON
	let rawData: any;
	try {
		rawData = JSON.parse(rawJsonString);
	} catch (error) {
		// Should be caught by retry logic above if from LLM, but this catches mock json errors too
		throw new PlannerJSONParseError("Planner Error: Failed to parse LLM JSON output.");
	}

	// 5. Validate strictly
	return validatePlannerOutput(rawData);
}
