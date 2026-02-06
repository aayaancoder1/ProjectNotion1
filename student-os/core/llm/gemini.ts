import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider } from "./types";

export class GeminiProvider implements LLMProvider {
	private genAI: GoogleGenerativeAI;

	constructor(apiKey: string) {
		this.genAI = new GoogleGenerativeAI(apiKey);
	}

	async generateJSON(prompt: string): Promise<string> {
		// Access the model. explicit formatting instruction is reinforced.
		const model = this.genAI.getGenerativeModel({
			model: "gemini-pro",
			generationConfig: {
				maxOutputTokens: 2048,
				temperature: 0,
				// Gemini 1.5 Pro supports responseMimeType: "application/json", 
				// but let's stick to gemini-pro (1.0) or 1.5-flash which might be safer defaults. 
				// For gemini-pro, we rely on prompt engineering.
				// We appended stricter instructions.
			}
		});

		// Gemini doesn't have "system" roles in the same way as OpenAI in the basic API, 
		// but putting it in the prompt works well.
		// We add a specific instruction for JSON.
		const strictPrompt = `${prompt}\n\nCRITICAL INSTRUCTION: Output MUST be valid JSON only. Do not wrap in markdown code blocks.`;

		const result = await model.generateContent(strictPrompt);
		const response = await result.response;
		let text = response.text();

		// Clean up markdown if present (Gemini loves ```json ... ```)
		text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
		return text;
	}
}
