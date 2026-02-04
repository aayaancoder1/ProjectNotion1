import { Course, Task } from "../../types/compiler-ir";

export interface ParsedData {
	courses: Course[];
	tasks: Task[];
}

export function parseInput(): ParsedData {
	// Hardcoded mock data
	const courses: Course[] = [
		{
			id: "course-1",
			name: "Introduction to Computer Science",
			credits: 3,
			status: "Active",
			totalRisk: 0,
		},
	];

	const tasks: Task[] = [
		{
			id: "task-1",
			name: "Logic Gate Simulation",
			courseId: "course-1",
			type: "Assignment",
			priority: "High",
			dueDate: "2024-12-01T23:59:00Z",
			status: "Not Started",
			riskScore: 0,
		},
	];

	return { courses, tasks };
}
