export interface Course {
	id: string;
	name: string;
	credits: number;
	status: string;
	totalRisk: number;
}

export interface Task {
	id: string;
	name: string;
	courseId: string;
	type: "Lecture" | "Assignment" | "Exam" | "Revision";
	priority: "Low" | "Medium" | "High";
	dueDate: string;
	status: string;
	riskScore: number;
}

export interface DashboardView {
	name: string;
	description: string;
}

export interface CompiledSemesterPlan {
	courses: Course[];
	tasks: Task[];
	dashboards: DashboardView[];
}
