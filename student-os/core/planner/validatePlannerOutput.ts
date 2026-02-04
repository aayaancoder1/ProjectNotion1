import { ParsedData } from "../compiler/parse";
import { CourseType, TaskStatus } from "../../types/compiler-ir";

export function validatePlannerOutput(data: any): ParsedData {
	if (typeof data !== "object" || data === null) {
		throw new Error("Planner Output Error: Output must be an object.");
	}

	// Check for extra keys at top level
	const allowedKeys = ["courses", "tasks"];
	const actualKeys = Object.keys(data);
	const extraKeys = actualKeys.filter(k => !allowedKeys.includes(k));
	if (extraKeys.length > 0) {
		throw new Error(`Planner Output Error: Unknown fields detected: ${extraKeys.join(", ")}`);
	}

	if (!Array.isArray(data.courses) || !Array.isArray(data.tasks)) {
		throw new Error("Planner Output Error: courses and tasks must be arrays.");
	}

	// Validate Courses
	data.courses.forEach((course: any, index: number) => {
		const requiredCourseKeys = ["id", "name", "credits", "status", "totalRisk", "type"];
		const courseKeys = Object.keys(course);
		const extraCourseKeys = courseKeys.filter(k => !requiredCourseKeys.includes(k));

		if (extraCourseKeys.length > 0) {
			throw new Error(`Planner Output Error: Course[${index}] has unknown fields: ${extraCourseKeys.join(", ")}`);
		}

		if (!Object.values(CourseType).includes(course.type)) {
			throw new Error(`Planner Output Error: Course[${index}] has invalid type: ${course.type}`);
		}

		requiredCourseKeys.forEach(key => {
			if (!(key in course)) {
				throw new Error(`Planner Output Error: Course[${index}] missing required field: ${key}`);
			}
		});
	});

	// Validate Tasks
	data.tasks.forEach((task: any, index: number) => {
		const requiredTaskKeys = ["id", "name", "courseId", "type", "priority", "dueDate", "status", "riskScore", "dueWeek"];
		const taskKeys = Object.keys(task);
		const extraTaskKeys = taskKeys.filter(k => !requiredTaskKeys.includes(k));

		if (extraTaskKeys.length > 0) {
			throw new Error(`Planner Output Error: Task[${index}] has unknown fields: ${extraTaskKeys.join(", ")}`);
		}

		if (!Object.values(TaskStatus).includes(task.status)) {
			throw new Error(`Planner Output Error: Task[${index}] has invalid status: ${task.status}`);
		}

		requiredTaskKeys.forEach(key => {
			if (!(key in task)) {
				throw new Error(`Planner Output Error: Task[${index}] missing required field: ${key}`);
			}
		});
	});

	return data as ParsedData;
}
