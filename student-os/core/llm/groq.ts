import OpenAI from "openai";
import { LLMProvider } from "./types";

export class GroqProvider implements LLMProvider {
	name = "groq";
	private client: OpenAI;

	constructor(apiKey: string) {
		console.log("[GroqProvider] Initializing Groq (OpenAI-compatible) client...");
		this.client = new OpenAI({
			apiKey: apiKey,
			baseURL: "https://api.groq.com/openai/v1",
		});
	}

	async generateJSON(prompt: string): Promise<string> {
		const modelName = "llama-3.1-8b-instant";
		console.log(`[GroqProvider] Using model: ${modelName}`);

		// Enforce JSON strictly via prompt
		const strictPrompt = `${prompt}\n\nCRITICAL INSTRUCTION: Output MUST be valid JSON only. Do not wrap in markdown code blocks. No explanations.`;

		try {
			const response = await this.client.chat.completions.create({
				messages: [{ role: "system", content: strictPrompt }],
				model: modelName,
				temperature: 0,
				// Groq supports JSON mode if enforced via prompt, 
				// strictly speaking "response_format": { "type": "json_object" } is supported by Llama 3 on Groq often,
				// but text-only + prompt is safer for compatibility unless we are sure.
				// Guide says "Do NOT add unsupported config fields". Standard OpenAI has response_format.
				// I will use response_format: { type: "json_object" } as it is standard OpenAI SDK and Groq supports it for Llama3 models.
				response_format: { type: "json_object" },
			});

			const content = response.choices[0]?.message?.content || "";
			if (!content) throw new Error("Empty response from Groq");

			console.log("[GroqProvider] Response received.");
			return content;
		} catch (e: any) {
			console.error("[GroqProvider] Error generating content:", e);
			throw e;
		}
	}
}
