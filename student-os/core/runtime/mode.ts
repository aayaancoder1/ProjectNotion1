export type RuntimeMode = "dry-run" | "read-only" | "write-enabled";

export function getRuntimeMode(): RuntimeMode {
	const nodeEnv = process.env.NODE_ENV;
	const enableNotionWrites = process.env.ENABLE_NOTION_WRITES === "true";
	const notionToken = process.env.NOTION_OAUTH_TOKEN;

	// 1. Dry Run: Fallback if no specific config
	if (!notionToken) {
		return "dry-run";
	}

	// 2. Read-Only: Default if token exists but writes not explicitly enabled
	if (!enableNotionWrites) {
		return "read-only";
	}

	// 3. Write-Enabled: Strict Hard Lock
	// Must have token + flag + safe environment (production/staging needed? prompt says: NODE_ENV must be "production" OR "staging" to allow writes)
	// Actually, usually in dev we want to test writes, but the Safety Rule 2 says:
	// "NODE_ENV must be 'production' OR 'staging' to allow writes"
	// This is very strict. It means I cannot write in dev.
	// I will honor this strict rule.

	if (['production', 'staging'].includes(nodeEnv || '')) {
		return "write-enabled";
	}

	// If flagged for writes but in 'development' or 'test', we downgrade to read-only or throw?
	// Use Case: Dev wanting to test writes? strict rule says "safeguard".
	// Let's degrade to 'read-only' and log (if we could log here, but pure function).
	// The caller can check the mode.
	return "read-only";
}
