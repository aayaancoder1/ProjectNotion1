import { NextResponse } from 'next/server';
import { getLLMProvider } from '../../../core/llm/client';

export const dynamic = 'force-dynamic'; // No caching

export async function GET() {
	try {
		console.log("--- API Test: LLM Provider Check ---");
		const provider = getLLMProvider();

		if (!provider) {
			return NextResponse.json({ provider: "Mock (Fallback)", response: "No active provider configured." });
		}

		const response = await provider.generateJSON('Respond with exactly: { "status": "OK" }');

		return NextResponse.json({
			provider: provider.name,
			response: response
		});
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
