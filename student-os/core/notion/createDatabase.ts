import { getNotionClient } from "./client";
import { getCoursesDatabaseSchema, getTasksDatabaseSchema } from "./schema";

export async function createCoursesDatabase(parentPageId: string): Promise<string> {
	const notion = getNotionClient();
	const schema = getCoursesDatabaseSchema(parentPageId);

	// @ts-ignore - The Notion SDK types might be slightly finicky with strictly typed schema objects, but the shape matches CreateDatabaseParameters
	const response = await notion.databases.create(schema);
	return response.id;
}

export async function createTasksDatabase(parentPageId: string, coursesDbId: string): Promise<string> {
	const notion = getNotionClient();
	const schema = getTasksDatabaseSchema(parentPageId, coursesDbId);

	// @ts-ignore
	const response = await notion.databases.create(schema);
	return response.id;
}
