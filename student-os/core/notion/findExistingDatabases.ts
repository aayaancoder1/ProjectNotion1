import { getNotionClient } from "./client";

export interface ExistingDatabases {
	coursesDbId?: string;
	tasksDbId?: string;
}

export async function findExistingDatabases(): Promise<ExistingDatabases> {
	const notion = getNotionClient();

	// Search for the specific database names
	// Note: This is a loose search. In production, exact match logic is safer.
	const response = await notion.search({
		query: "Student OS —",
		filter: {
			value: "database",
			property: "object",
		} as any,
	});

	const result: ExistingDatabases = {};

	for (const obj of response.results) {
		// Explicitly cast to any to check properties safely or use strict guards if imported
		const db = obj as any;

		if (db.object === "database" && "title" in db) {
			// Extract title plain text
			const title = db.title.map((t: any) => t.plain_text).join("");

			if (title === "Student OS — Courses") {
				result.coursesDbId = db.id;
			} else if (title === "Student OS — Tasks") {
				result.tasksDbId = db.id;
			}
		}
	}

	return result;
}
