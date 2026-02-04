import { getRuntimeMode } from "../runtime/mode";

export function validateEnv() {
	const mode = getRuntimeMode();

	// Common checks
	if (mode !== "dry-run" && !process.env.NOTION_OAUTH_TOKEN) {
		throw new Error("Configuration Error: NOTION_OAUTH_TOKEN is required for read-only or write operations.");
	}

	// Write mode checks
	if (mode === "write-enabled") {
		if (!process.env.NOTION_PARENT_PAGE_ID) {
			throw new Error("Configuration Error: NOTION_PARENT_PAGE_ID is required for write-enabled mode.");
		}
	}

	// Safety Feedback
	if (process.env.ENABLE_NOTION_WRITES === "true" && mode !== "write-enabled") {
		console.warn("Safety Check: ENABLE_NOTION_WRITES is true, but environment is not 'production' or 'staging'. Downgrading to READ-ONLY mode.");
	}
}
