import { ParsedData } from "./parse";

export function validateIR(data: ParsedData): ParsedData {
	if (!Array.isArray(data.courses) || !Array.isArray(data.tasks)) {
		throw new Error("Invalid IR: courses and tasks must be arrays.");
	}

	if (data.courses.length === 0) {
		throw new Error("Invalid IR: Courses array must not be empty.");
	}

	const courseIds = new Set<string>();

	for (const course of data.courses) {
		if (course.credits <= 0) {
			throw new Error(`Invalid IR: Course ${course.id} must have credits > 0.`);
		}
		courseIds.add(course.id);
	}

	for (const task of data.tasks) {
		if (!courseIds.has(task.courseId)) {
			throw new Error(`Invalid IR: Task ${task.id} references invalid courseId ${task.courseId}.`);
		}
		if (task.dueWeek < 1) {
			throw new Error(`Invalid IR: Task ${task.id} must have dueWeek >= 1.`);
		}
	}

	return data;
}
