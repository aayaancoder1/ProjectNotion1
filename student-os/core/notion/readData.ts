import { getNotionClient } from "./client";
import { findExistingDatabases } from "./findExistingDatabases";
import { Course, Task, CourseType, TaskStatus } from "../../types/compiler-ir";

// Helper to map Notion page properties to our strict IR types
// This is fragile and simulation-based for now, assuming strict schema adherence.

export async function fetchFromNotion(): Promise<{ courses: Course[], tasks: Task[] }> {
	try {
		const notion = getNotionClient();
		const dbs = await findExistingDatabases();

		if (!dbs.coursesDbId || !dbs.tasksDbId) {
			console.warn("Databases not found. Returning empty lists.");
			return { courses: [], tasks: [] };
		}

		// Fetch Courses
		// @ts-ignore
		const coursesQuery = await notion.databases.query({ database_id: dbs.coursesDbId });
		const courses: Course[] = coursesQuery.results.map((page: any) => {
			const props = page.properties;
			return {
				id: page.id, // Use Notion Page ID as ID
				name: props.Name.title[0]?.plain_text || "Untitled",
				credits: props.Credits?.number || 0,
				status: props.Status?.select?.name || "Active",
				totalRisk: 0, // Not stored in Notion yet
				type: (props.Type?.select?.name as any) || "CORE"
			};
		});

		// Fetch Tasks
		// @ts-ignore
		const tasksQuery = await notion.databases.query({ database_id: dbs.tasksDbId });
		const tasks: Task[] = tasksQuery.results.map((page: any) => {
			const props = page.properties;
			return {
				id: page.id,
				name: props.Name.title[0]?.plain_text || "Untitled",
				courseId: props.Course?.relation[0]?.id || "", // Links to Notion Page ID of course
				type: (props.Type?.select?.name as any) || "Assignment",
				priority: (props.Priority?.select?.name as any) || "Medium",
				dueDate: props["Due Date"]?.date?.start || new Date().toISOString(),
				status: (props.Status?.status?.name as any) || "TODO",
				riskScore: 0,
				dueWeek: 0 // Not stored in Notion explicitly, derived from date usually
			};
		});

		return { courses, tasks };
	} catch (e) {
		console.error("Failed to fetch from Notion:", e);
		return { courses: [], tasks: [] };
	}
}
