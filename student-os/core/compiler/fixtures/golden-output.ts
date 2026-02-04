import { CompiledSemesterPlan, DashboardView } from "../../../types/compiler-ir";
import { GOLDEN_INPUT } from "./golden-input";

const dashboards: DashboardView[] = [
	{
		name: "Student Dashboard",
		description: "Overview of current tasks and courses",
	},
];

export const GOLDEN_OUTPUT: CompiledSemesterPlan = {
	courses: GOLDEN_INPUT.courses,
	tasks: GOLDEN_INPUT.tasks,
	dashboards: dashboards,
	totalCredits: 11,
	pendingTasks: 2,
};
