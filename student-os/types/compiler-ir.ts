/**
 * COMPILER IR — FROZEN (PHASE 1 COMPLETE)
 * Any changes require explicit versioning.
 */

export const COMPILER_IR_VERSION = "v1";

export enum TaskStatus {
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	DONE = "DONE",
}

export enum CourseType {
	CORE = "CORE",
	ELECTIVE = "ELECTIVE",
	LAB = "LAB",
}

export interface Course {
	id: string;
	name: string;
	credits: number;
	status: string;
	totalRisk: number;
	type: CourseType;
}

export interface Task {
	id: string;
	name: string;
	courseId: string;
	type: "Lecture" | "Assignment" | "Exam" | "Revision";
	priority: "Low" | "Medium" | "High";
	dueDate: string;
	status: TaskStatus;
	riskScore: number;
	dueWeek: number;
}

export interface DashboardView {
	name: string;
	description: string;
}

export interface CompiledSemesterPlan {
	courses: Course[];
	tasks: Task[];
	dashboards: DashboardView[];
	totalCredits: number;
	pendingTasks: number;
}
