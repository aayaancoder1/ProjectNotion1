import { NextRequest, NextResponse } from "next/server";
import { planSemester } from "../../../core/planner";

export async function POST(req: NextRequest) {
	console.log("--- Planner API: Request Received ---");

	try {
		const body = await req.json();
		const { input } = body;

		// Validation
		if (!input || typeof input !== "string" || input.trim().length === 0) {
			console.warn("[Planner API] Invalid input received.");
			return NextResponse.json(
				{ success: false, error: "Missing or invalid 'input' string." },
				{ status: 400 }
			);
		}

		console.log(`[Planner API] Processing input length: ${input.length} chars...`);

		// Execution
		const plan = await planSemester(input);

		console.log("[Planner API] Plan generation successful.");
		return NextResponse.json({ success: true, data: plan });

	} catch (error: any) {
		console.error("[Planner API] Internal Error:", error);
		return NextResponse.json(
			{ success: false, error: error.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
