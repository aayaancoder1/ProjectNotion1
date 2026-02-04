import { Course, Task, CourseType, TaskStatus } from "../../types/compiler-ir";

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
			type: CourseType.CORE,
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
			status: TaskStatus.TODO,
			riskScore: 0,
			dueWeek: 1,
		},
	];

	return { courses, tasks };
}
