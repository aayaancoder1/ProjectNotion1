import OpenAI from "openai";

export function getLLMClient(): OpenAI {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("Missing OPENAI_API_KEY environment variable.");
	}
	return new OpenAI({ apiKey });
}
