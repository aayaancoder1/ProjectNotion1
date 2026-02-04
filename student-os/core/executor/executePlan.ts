import { CompiledSemesterPlan } from "../../types/compiler-ir";
import { ExecutorResult } from "./types";
import { validateWorkspace } from "../notion/validateWorkspace";
import { findExistingDatabases } from "../notion/findExistingDatabases";
import { createCoursesDatabase, createTasksDatabase } from "../notion/createDatabase";

export async function executePlan(plan: CompiledSemesterPlan): Promise<ExecutorResult> {
	const result: ExecutorResult = {
		createdDatabases: [],
		createdPages: [],
		createdViews: []
	};

	// 1. Read-Only Validation Probe
	try {
		const workspaceInfo = await validateWorkspace();
		result.notionWorkspace = workspaceInfo;
	} catch (error) {
		// If validation fails, we proceed (execution might just check mock logic if writes disabled)
		// But if writes are enabled, downstream calls would fail anyway.
	}

	// 2. Database Creation (Controlled Write Mode)
	if (process.env.ENABLE_NOTION_WRITES === "true") {
		const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
		if (!parentPageId) {
			throw new Error("ENABLE_NOTION_WRITES is true, but NOTION_PARENT_PAGE_ID is missing.");
		}

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
	} else {
		// Write Mode OFF - Simulation Only
		result.createdDatabases.push("[Dry Run] Would create: Student OS — Courses");
		result.createdDatabases.push("[Dry Run] Would create: Student OS — Tasks");
	}

	// Simulate Page Creation from Courses (Still Dry Run only for Pages)
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
