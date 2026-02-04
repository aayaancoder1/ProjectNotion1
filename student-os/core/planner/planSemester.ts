import { ParsedData } from "../compiler/parse";
import { buildPlanPrompt } from "./plannerPrompt";
import { validatePlannerOutput } from "./validatePlannerOutput";
import { PlannerJSONParseError } from "./errors";

export { buildPlanPrompt };



export function planSemester(input: string): ParsedData {
	// 1. Build the prompt (mocking the LLM input construction)
	const prompt = buildPlanPrompt(input);

	// 2. Simulate LLM Response (Mock Logic)
	// In a real implementation, this comes from an API call using 'prompt'.
	// This JSON string mimics the raw text choice from an LLM.
	const mockLlmResponse = JSON.stringify({
		version: "v1",
		courses: [
			{
				id: "planner-course-1",
				name: "Artificial Intelligence",
				credits: 4,
				status: "Active",
				totalRisk: 0,
				type: "CORE",
			},
			{
				id: "planner-course-2",
				name: "Ethics in Tech",
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
			{
				id: "planner-task-2",
				name: "Ethics Essay",
				courseId: "planner-course-2",
				type: "Assignment",
				priority: "Medium",
				dueDate: "2024-03-05T23:59:00Z",
				status: "TODO",
				riskScore: 0,
				dueWeek: 6,
			},
		],
	});

	// 3. Parse JSON (Simulate deserialization)
	let rawData: any;
	try {
		rawData = JSON.parse(mockLlmResponse);
	} catch (error) {
		throw new PlannerJSONParseError("Planner Error: Failed to parse LLM JSON output.");
	}

	// 4. Validate strictly
	return validatePlannerOutput(rawData);
}
