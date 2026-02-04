import { CompiledSemesterPlan, DashboardView, TaskStatus } from "../../types/compiler-ir";
import { ParsedData } from "./parse";

export function compileSemesterPlan(data: ParsedData): CompiledSemesterPlan {
	const dashboards: DashboardView[] = [
		{
			name: "Student Dashboard",
			description: "Overview of current tasks and courses",
		},
	];

	const totalCredits = data.courses.reduce((sum, course) => sum + course.credits, 0);
	const pendingTasks = data.tasks.filter((task) => task.status !== TaskStatus.DONE).length;

	return {
		courses: data.courses,
		tasks: data.tasks,
		dashboards: dashboards,
		totalCredits,
		pendingTasks,
	};
}
