import { LLMProvider } from "./types";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";

export function getLLMProvider(): LLMProvider | null {
	const providerType = process.env.LLM_PROVIDER?.toLowerCase() || "openai";

	if (providerType === "gemini") {
		const key = process.env.GEMINI_API_KEY;
		if (!key) return null;
		return new GeminiProvider(key);
	}

	// Default to OpenAI
	if (providerType === "openai") {
		const key = process.env.OPENAI_API_KEY;
		if (!key) return null;
		return new OpenAIProvider(key);
	}

	return null;
}
