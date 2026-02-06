import { LLMProvider } from "./types";
import { OpenAIProvider } from "./openai";
import { GroqProvider } from "./groq";

export function getLLMProvider(): LLMProvider | null {
	const providerType = process.env.LLM_PROVIDER?.toLowerCase() || "openai";
	console.log(`[getLLMProvider] Requested provider: ${providerType}`);

	if (providerType === "groq") {
		const key = process.env.GROQ_API_KEY;
		if (!key) {
			console.error("[getLLMProvider] Error: LLM_PROVIDER is 'groq' but GROQ_API_KEY is missing.");
			throw new Error("❌ Configuration Error: LLM_PROVIDER is 'groq' but GROQ_API_KEY is missing. Aborting.");
		}
		return new GroqProvider(key);
	}

	// Default to OpenAI
	if (providerType === "openai") {
		const key = process.env.OPENAI_API_KEY;
		if (!key) {
			console.warn("[getLLMProvider] OpenAI key missing. Returning null (Mock fallback will engage).");
			return null;
		}
		return new OpenAIProvider(key);
	}

	return null;
}
