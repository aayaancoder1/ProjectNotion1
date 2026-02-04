import { Course, Task, CourseType, TaskStatus } from "../../../types/compiler-ir";
import { ParsedData } from "../parse";

export const GOLDEN_INPUT: ParsedData = {
	courses: [
		{
			id: "course-1",
			name: "Computer Science I",
			credits: 4,
			status: "Active",
			totalRisk: 0,
			type: CourseType.CORE,
		},
		{
			id: "course-2",
			name: "Calculus I",
			credits: 4,
			status: "Active",
			totalRisk: 0,
			type: CourseType.CORE,
		},
		{
			id: "course-3",
			name: "History of Art",
			credits: 3,
			status: "Active",
			totalRisk: 0,
			type: CourseType.ELECTIVE,
		},
	],
	tasks: [
		{
			id: "task-1",
			name: "CS Lab 1",
			courseId: "course-1",
			type: "Assignment",
			priority: "High",
			dueDate: "2024-02-10T23:59:00Z",
			status: TaskStatus.DONE,
			riskScore: 0,
			dueWeek: 2,
		},
		{
			id: "task-2",
			name: "Calculus Quiz 1",
			courseId: "course-2",
			type: "Exam",
			priority: "High",
			dueDate: "2024-02-15T12:00:00Z",
			status: TaskStatus.TODO,
			riskScore: 0,
			dueWeek: 3,
		},
		{
			id: "task-3",
			name: "Art Essay",
			courseId: "course-3",
			type: "Assignment",
			priority: "Medium",
			dueDate: "2024-02-20T23:59:00Z",
			status: TaskStatus.IN_PROGRESS,
			riskScore: 0,
			dueWeek: 4,
		},
	],
};
