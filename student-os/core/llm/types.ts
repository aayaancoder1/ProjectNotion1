export interface LLMProvider {
	name: string; // "openai" | "gemini" | "mock"
	/**
	 * Generates a JSON string response from the LLM based on the given prompt.
	 * content must be valid JSON.
	 */
	generateJSON(prompt: string): Promise<string>;
}
