import { CompiledSemesterPlan, DashboardView } from "../../types/compiler-ir";
import { ParsedData } from "./parse";

export function compileSemesterPlan(data: ParsedData): CompiledSemesterPlan {
	const dashboards: DashboardView[] = [
		{
			name: "Student Dashboard",
			description: "Overview of current tasks and courses",
		},
	];

	return {
		courses: data.courses,
		tasks: data.tasks,
		dashboards: dashboards,
	};
}
