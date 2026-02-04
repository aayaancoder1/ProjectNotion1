import { ParsedData } from "../compiler/parse";
import { buildPlanPrompt } from "./plannerPrompt";
import { validatePlannerOutput } from "./validatePlannerOutput";
import { PlannerJSONParseError } from "./errors";
import { PlannerContext } from "./plannerContext";
import { getLLMClient } from "../llm/client";

export { buildPlanPrompt };


export async function planSemester(input: string, context?: PlannerContext): Promise<ParsedData> {
	// 1. Build the prompt
	const prompt = buildPlanPrompt(input, context);
	let rawJsonString = "";

	// 2. Determine Mode: Real Intelligence vs Mock
	if (process.env.OPENAI_API_KEY) {
		try {
			const openai = getLLMClient();
			const response = await openai.chat.completions.create({
				model: "gpt-4o", // Strongest model for reasoning
				messages: [{ role: "system", content: prompt }], // Prompt contains all instructions
				response_format: { type: "json_object" }, // Enforce JSON
				temperature: 0, // Deterministic
			});

			rawJsonString = response.choices[0].message.content || "{}";
		} catch (e: any) {
			// If LLM call fails, we throw to avoid silent fallback to mock in production
			throw new Error(`LLM Planning Failed: ${e.message}`);
		}
	} else {
		// FALLBACK: Mock Logic (Legacy)
		// console.warn("⚠️  OPENAI_API_KEY missing. Using Mock Planner.");
		// Reduced log noise for build
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

	// 3. Parse JSON
	let rawData: any;
	try {
		rawData = JSON.parse(rawJsonString);
	} catch (error) {
		throw new PlannerJSONParseError("Planner Error: Failed to parse LLM JSON output.");
	}

	// 4. Validate strictly
	return validatePlannerOutput(rawData);
}
