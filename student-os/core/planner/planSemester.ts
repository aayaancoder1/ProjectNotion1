import { Course, Task, CourseType, TaskStatus } from "../../types/compiler-ir";
import { ParsedData } from "../compiler/parse";

export function planSemester(input: string): ParsedData {
	// Hardcoded mock data simulating LLM output
	// In the future, 'input' will be used to generate this.

	const courses: Course[] = [
		{
			id: "planner-course-1",
			name: "Artificial Intelligence",
			credits: 4,
			status: "Active",
			totalRisk: 0,
			type: CourseType.CORE,
		},
		{
			id: "planner-course-2",
			name: "Ethics in Tech",
			credits: 3,
			status: "Active",
			totalRisk: 0,
			type: CourseType.ELECTIVE,
		},
	];

	const tasks: Task[] = [
		{
			id: "planner-task-1",
			name: "Neural Networks Project",
			courseId: "planner-course-1",
			type: "Assignment",
			priority: "High",
			dueDate: "2024-03-01T23:59:00Z",
			status: TaskStatus.TODO,
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
			status: TaskStatus.TODO,
			riskScore: 0,
			dueWeek: 6,
		},
	];

	return { courses, tasks };
}
