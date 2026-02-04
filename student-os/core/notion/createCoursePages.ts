import { getNotionClient } from "./client";
import { Course } from "../../types/compiler-ir";

export async function createCoursePages(
	coursesDbId: string,
	courses: Course[]
): Promise<Record<string, string>> {
	const notion = getNotionClient();
	const courseIdToNotionId: Record<string, string> = {};

	// Check if database is empty first (Safety Rule: Write-once)
	// @ts-ignore
	const existing = await notion.databases.query({
		database_id: coursesDbId,
		page_size: 1,
	});

	if (existing.results.length > 0) {
		throw new Error(
			"Safety Error: Courses database is not empty. Aborting creation to prevent duplicates."
		);
	}

	for (const course of courses) {
		const response = await notion.pages.create({
			parent: { database_id: coursesDbId },
			properties: {
				Name: {
					title: [
						{
							text: {
								content: course.name,
							},
						},
					],
				},
				Credits: {
					number: course.credits,
				},
				Status: {
					select: {
						name: course.status || "Active",
					},
				},
				Type: {
					select: {
						name: course.type,
					},
				},
			},
		});

		courseIdToNotionId[course.id] = response.id;
	}

	return courseIdToNotionId;
}
