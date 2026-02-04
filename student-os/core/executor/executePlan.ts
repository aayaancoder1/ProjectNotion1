import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { ExecutorResult } from "./types";

export function executePlan(plan: CompiledSemesterPlan): ExecutorResult {
	const result: ExecutorResult = {
		createdDatabases: [],
		createdPages: [],
		createdViews: []
	};

	// Simulate Database Creation
	result.createdDatabases.push("Courses");
	result.createdDatabases.push("Tasks");

	// Simulate Page Creation from Courses
	plan.courses.forEach(course => {
		result.createdPages.push(`Course Page: ${course.name}`);
	});

	// Simulate View Creation (from dashboards and standard views)
	plan.dashboards.forEach(dashboard => {
		result.createdViews.push(`Dashboard View: ${dashboard.name}`);
	});

	// Implicit standard views we know we'll want
	result.createdViews.push("View: Active Courses");
	result.createdViews.push("View: Tasks Due This Week");

	return result;
}
