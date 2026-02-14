import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    // Call the REST ListModels endpoint directly
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "ListModels failed", detail: json },
        { status: res.status }
      );
    }

    // Return only useful fields
    const models = (json.models || []).map((m: any) => ({
      name: m.name,                 // e.g. "models/gemini-pro"
      displayName: m.displayName,
      supportedMethods: m.supportedGenerationMethods,
    }));

    return NextResponse.json({ models });
  } catch (e: any) {
    return NextResponse.json(
      { error: "ListModels error", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
