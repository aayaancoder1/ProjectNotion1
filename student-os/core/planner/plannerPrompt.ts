import { COMPILER_IR_VERSION } from "../../types/compiler-ir";
import { PLANNER_VERSION } from "./plannerVersion";
import { PlannerContext } from "./plannerContext";

export const PLANNER_SYS_PROMPT = `
You remain a strict JSON generation machine.
Target Compiler Version: ${COMPILER_IR_VERSION}
Planner Version: ${PLANNER_VERSION}

Input: Natural language description of a semester.
Output: A valid JSON object matching the exact Compiler IR schema.

Rules:
1. Output PURE data only. No markdown, no explanations.
2. Follow strict TypeScript types. Enums are case-sensitive.
3. CourseType must be: CORE, ELECTIVE, or LAB.
4. TaskStatus must be: TODO, IN_PROGRESS, or DONE.
5. All fields are required. No optional fields.
6. Do NOT add ANY extra fields not defined in the schema.
7. If versions do not match, output MUST still conform to IR ${COMPILER_IR_VERSION}. No commentary, no warnings, no text.

Schema definition:
interface ParsedData {
  version: "v1"; (MUST match target compiler version)
  courses: {
    id: string; (unique)
    name: string;
    credits: number;
    status: string; (e.g. "Active")
    totalRisk: number; (default 0)
    type: "CORE" | "ELECTIVE" | "LAB";
  }[];
  tasks: {
    id: string;
    name: string;
    courseId: string; (must match a course id)
    type: "Lecture" | "Assignment" | "Exam" | "Revision";
    priority: "Low" | "Medium" | "High";
    dueDate: string; (ISO 8601)
    status: "TODO" | "IN_PROGRESS" | "DONE";
    riskScore: number; (default 0)
    dueWeek: number; (1-16)
  }[];
}
`;

export function buildPlanPrompt(input: string, context?: PlannerContext): string {
  let prompt = `${PLANNER_SYS_PROMPT}\n\nUser Input: "${input}"`;

  if (context) {
    prompt += `\n\nSYSTEM CONTEXT — FOR AWARENESS ONLY:\n` +
      `Intelligence Trace: ${JSON.stringify(context.trace, null, 2)}\n` +
      `Weight Modifiers: ${JSON.stringify(context.modifiers, null, 2)}`;
  }

  return prompt;
}
