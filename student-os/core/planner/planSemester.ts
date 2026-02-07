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
	let provider = null;

	try {
		provider = getLLMProvider();
	} catch (e: any) {
		// If hard error from factory (missing keys), re-throw
		throw e;
	}

	console.log(`[Planner] Active Provider: ${provider ? provider.name : "Mock (Default)"}`);


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

		if (!rawJsonString) {
			console.error(`[Planner] Provider ${provider.name} failed all attempts. Fallback to Mock.`);
		}
	}

	// 3. Fallback or Mock Logic
	if (!rawJsonString) {
		// Echo the user input as a simple plan
		rawJsonString = JSON.stringify({
			version: "v1",
			courses: (context as any)?.courses?.map((c: any, i: number) => ({
				id: `course-${i + 1}`,
				name: c.name,
				credits: c.credits,
				status: "Active",
				totalRisk: 0,
				type: c.type || "CORE",
			})) || [],
			tasks: (context as any)?.courses?.flatMap((c: any, i: number) => [
				{
					id: `task-${i + 1}`,
					name: `Do ${c.name} work`,
					courseId: `course-${i + 1}`,
					type: "Assignment",
					priority: "High",
					dueDate: new Date().toISOString(),
					status: "TODO",
					riskScore: 0,
					dueWeek: i + 1,
				},
			]) || [],
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
