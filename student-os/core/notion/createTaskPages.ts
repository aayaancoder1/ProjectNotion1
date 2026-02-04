import { getNotionClient } from "./client";
import { Task } from "../../types/compiler-ir";

export async function createTaskPages(
	tasksDbId: string,
	tasks: Task[],
	coursePageMap: Record<string, string>
): Promise<string[]> {
	const notion = getNotionClient();
	const createdPageIds: string[] = [];

	// Check if database is empty first (Safety Rule: Write-once)
	// @ts-ignore
	const existing = await notion.databases.query({
		database_id: tasksDbId,
		page_size: 1,
	});

	if (existing.results.length > 0) {
		throw new Error(
			"Safety Error: Tasks database is not empty. Aborting creation to prevent duplicates."
		);
	}

	for (const task of tasks) {
		const notionCourseId = coursePageMap[task.courseId];
		if (!notionCourseId) {
			throw new Error(
				`Integrity Error: Task '${task.name}' references unknown courseId '${task.courseId}'`
			);
		}

		const response = await notion.pages.create({
			parent: { database_id: tasksDbId },
			properties: {
				Name: {
					title: [
						{
							text: {
								content: task.name,
							},
						},
					],
				},
				Status: {
					status: {
						name: task.status,
					},
				},
				Priority: {
					select: {
						name: task.priority,
					},
				},
				"Due Date": {
					date: {
						start: task.dueDate,
					},
				},
				Type: {
					select: {
						name: task.type,
					},
				},
				Course: {
					relation: [
						{
							id: notionCourseId,
						},
					],
				},
			},
		});

		createdPageIds.push(response.id);
	}

	return createdPageIds;
}
