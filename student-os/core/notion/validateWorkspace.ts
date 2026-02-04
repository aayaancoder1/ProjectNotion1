import { getNotionClient } from "./client";

export async function validateWorkspace(): Promise<{
	user: string;
	workspaceName?: string;
}> {
	const notion = getNotionClient();
	const user = await notion.users.me({});

	// Notion API doesn't strictly return workspace name on users.me, 
	// but usually gives the bot/user name.
	// We return what we can to validate connectivity.
	return {
		user: user.name || "Unknown User",
		workspaceName: user.type === 'bot' ? (user as any).bot?.owner?.workspace ? "Workspace Connected" : undefined : undefined
	};
}
