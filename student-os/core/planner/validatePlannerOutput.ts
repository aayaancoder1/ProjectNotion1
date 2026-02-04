import { ParsedData } from "../compiler/parse";
import { CourseType, TaskStatus, COMPILER_IR_VERSION } from "../../types/compiler-ir";
import { PlannerSchemaViolationError, PlannerVersionMismatchError } from "./errors";

export function validatePlannerOutput(data: any): ParsedData {
	if (typeof data !== "object" || data === null) {
		throw new PlannerSchemaViolationError("Planner Output Error: Output must be an object.");
	}

	// Check version first
	if (data.version !== COMPILER_IR_VERSION) {
		throw new PlannerVersionMismatchError(`Planner Output Error: Version mismatch. Expected ${COMPILER_IR_VERSION}, got ${data.version}`);
	}

	// Check for extra keys at top level
	const allowedKeys = ["courses", "tasks", "version"];
	const actualKeys = Object.keys(data);
	const extraKeys = actualKeys.filter(k => !allowedKeys.includes(k));
	if (extraKeys.length > 0) {
		throw new PlannerSchemaViolationError(`Planner Output Error: Unknown fields detected: ${extraKeys.join(", ")}`);
	}

	if (!Array.isArray(data.courses) || !Array.isArray(data.tasks)) {
		throw new PlannerSchemaViolationError("Planner Output Error: courses and tasks must be arrays.");
	}

	// Validate Courses
	data.courses.forEach((course: any, index: number) => {
		const requiredCourseKeys = ["id", "name", "credits", "status", "totalRisk", "type"];
		const courseKeys = Object.keys(course);
		const extraCourseKeys = courseKeys.filter(k => !requiredCourseKeys.includes(k));

		if (extraCourseKeys.length > 0) {
			throw new PlannerSchemaViolationError(`Planner Output Error: Course[${index}] has unknown fields: ${extraCourseKeys.join(", ")}`);
		}

		if (!Object.values(CourseType).includes(course.type)) {
			throw new PlannerSchemaViolationError(`Planner Output Error: Course[${index}] has invalid type: ${course.type}`);
		}

		requiredCourseKeys.forEach(key => {
			if (!(key in course)) {
				throw new PlannerSchemaViolationError(`Planner Output Error: Course[${index}] missing required field: ${key}`);
			}
		});
	});

	// Validate Tasks
	data.tasks.forEach((task: any, index: number) => {
		const requiredTaskKeys = ["id", "name", "courseId", "type", "priority", "dueDate", "status", "riskScore", "dueWeek"];
		const taskKeys = Object.keys(task);
		const extraTaskKeys = taskKeys.filter(k => !requiredTaskKeys.includes(k));

		if (extraTaskKeys.length > 0) {
			throw new PlannerSchemaViolationError(`Planner Output Error: Task[${index}] has unknown fields: ${extraTaskKeys.join(", ")}`);
		}

		if (!Object.values(TaskStatus).includes(task.status)) {
			throw new PlannerSchemaViolationError(`Planner Output Error: Task[${index}] has invalid status: ${task.status}`);
		}

		requiredTaskKeys.forEach(key => {
			if (!(key in task)) {
				throw new PlannerSchemaViolationError(`Planner Output Error: Task[${index}] missing required field: ${key}`);
			}
		});
	});

	return {
		courses: data.courses,
		tasks: data.tasks
	};
}
