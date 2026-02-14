import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Body = {
  defectId: string;
  label: string;
  confidence: number;
};

type RepairAdvice = {
  repairable: boolean;
  worthRepairing: boolean;
  estimatedCostINR: number;
  estimatedTimeHours: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
  notes: string[];
};

function extractJsonRobust(text: string) {
  // 1) Remove code fences if any
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  // 2) Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // 3) Fallback: extract first JSON object from the text
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Gemini response did not contain JSON.");
    }
    const sliced = cleaned.slice(start, end + 1);
    return JSON.parse(sliced);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body?.defectId || !body?.label || typeof body.confidence !== "number") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try flash first (cheap + fast). If your account doesn't allow it, switch to "gemini-1.5-pro".
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



    const prompt = `
Return ONLY valid JSON. No extra text.

You are a PCB repair/rework advisor.
Given the defect info, output JSON in EXACT shape:

{
  "repairable": true/false,
  "worthRepairing": true/false,
  "estimatedCostINR": 0,
  "estimatedTimeHours": 0,
  "riskLevel": "low" | "medium" | "high",
  "recommendation": "string",
  "notes": ["string"]
}

Use INR estimates suitable for a student lab demo.

Input:
${JSON.stringify(body)}
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const advice = extractJsonRobust(text) as RepairAdvice;

    // Basic validation (prevents UI crashes)
    if (
      typeof advice.repairable !== "boolean" ||
      typeof advice.worthRepairing !== "boolean" ||
      typeof advice.estimatedCostINR !== "number" ||
      typeof advice.estimatedTimeHours !== "number" ||
      !["low", "medium", "high"].includes(advice.riskLevel) ||
      typeof advice.recommendation !== "string" ||
      !Array.isArray(advice.notes)
    ) {
      return NextResponse.json(
        {
          error: "Gemini returned unexpected JSON shape",
          detail: text,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(advice);
  } catch (e: any) {
    // IMPORTANT: pass the real error to frontend
    const detail =
      e?.message ||
      e?.response?.data?.error?.message ||
      e?.toString?.() ||
      "Unknown error";

    return NextResponse.json(
      { error: "Gemini call failed", detail },
      { status: 500 }
    );
  }
}
