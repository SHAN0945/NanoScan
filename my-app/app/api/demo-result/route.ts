import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { DEMO_RESULTS } from "@/lib/demoData";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const result = DEMO_RESULTS[id];
  if (!result) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
