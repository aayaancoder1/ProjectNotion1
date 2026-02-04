import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { ExecutorResult } from "./types";
import { validateWorkspace } from "../notion/validateWorkspace";
import { findExistingDatabases } from "../notion/findExistingDatabases";
import { createCoursesDatabase, createTasksDatabase } from "../notion/createDatabase";
import { createCoursePages } from "../notion/createCoursePages";
import { createTaskPages } from "../notion/createTaskPages";
import { getRuntimeMode } from "../runtime/mode";

export async function executePlan(plan: CompiledSemesterPlan): Promise<ExecutorResult> {
	const result: ExecutorResult = {
		createdDatabases: [],
		createdPages: [],
		createdViews: []
	};

	const mode = getRuntimeMode();

	// 1. Read-Only Validation Probe
	if (mode !== "dry-run") {
		try {
			const workspaceInfo = await validateWorkspace();
			result.notionWorkspace = workspaceInfo;
		} catch (error) {
			// Allow soft fail in read-only?
			// strict mode usually throws if token missing, validated in validateEnv
		}
	}

	// 2. Database Creation (Controlled Write Mode)
	if (mode === "write-enabled") {
		const parentPageId = process.env.NOTION_PARENT_PAGE_ID!; // Validated by validateEnv

		const existing = await findExistingDatabases();
		let coursesId = existing.coursesDbId;
		let tasksId = existing.tasksDbId;

		if (!coursesId) {
			coursesId = await createCoursesDatabase(parentPageId);
			result.createdDatabases.push(`Created: Student OS — Courses (${coursesId})`);
		} else {
			result.createdDatabases.push(`Found Existing: Student OS — Courses (${coursesId})`);
		}

		if (!tasksId && coursesId) {
			tasksId = await createTasksDatabase(parentPageId, coursesId);
			result.createdDatabases.push(`Created: Student OS — Tasks (${tasksId})`);
		} else if (tasksId) {
			result.createdDatabases.push(`Found Existing: Student OS — Tasks (${tasksId})`);
		}

		// 3. Page Population (Write-Once)
		if (coursesId && tasksId) {
			try {
				const courseMap = await createCoursePages(coursesId, plan.courses);
				Object.values(courseMap).forEach((id: string) => result.createdPages.push(`Course Page Created: ${id}`));

				const taskIds = await createTaskPages(tasksId, plan.tasks, courseMap);
				taskIds.forEach((id: string) => result.createdPages.push(`Task Page Created: ${id}`));
			} catch (e: any) {
				result.createdPages.push(`Creation Aborted: ${e.message}`);
				throw e;
			}
		}
	} else {
		// Read-Only or Dry-Run Simulation
		const prefix = mode === "read-only" ? "[Read-Only]" : "[Dry Run]";
		result.createdDatabases.push(`${prefix} Would create: Student OS — Courses`);
		result.createdDatabases.push(`${prefix} Would create: Student OS — Tasks`);

		plan.courses.forEach(course => {
			result.createdPages.push(`${prefix} Course Page: ${course.name}`);
		});

		plan.tasks.forEach(task => {
			result.createdPages.push(`${prefix} Task Page: ${task.name}`);
		});
	}

	// Simulate View Creation (from dashboards and standard views)
	plan.dashboards.forEach(dashboard => {
		result.createdViews.push(`Dashboard View: ${dashboard.name}`);
	});

	// Implicit standard views we know we'll want
	result.createdViews.push("View: Active Courses");
	result.createdViews.push("View: Tasks Due This Week");

	return result;
}
