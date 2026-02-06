import OpenAI from "openai";
import { LLMProvider } from "./types";

export class OpenAIProvider implements LLMProvider {
	name = "openai";
	private client: OpenAI;

	constructor(apiKey: string) {
		this.client = new OpenAI({ apiKey });
	}

	async generateJSON(prompt: string): Promise<string> {
		const response = await this.client.chat.completions.create({
			model: "gpt-4o",
			messages: [{ role: "system", content: prompt }],
			response_format: { type: "json_object" },
			temperature: 0,
		});

		return response.choices[0].message.content || "{}";
	}
}
