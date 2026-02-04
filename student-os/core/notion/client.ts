import { Client } from "@notionhq/client";

export function getNotionClient(): Client {
	const token = process.env.NOTION_OAUTH_TOKEN;

	if (!token) {
		throw new Error("Missing NOTION_OAUTH_TOKEN environment variable.");
	}

	return new Client({
		auth: token,
	});
}
