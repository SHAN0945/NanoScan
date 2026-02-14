import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    creds: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    project: process.env.GOOGLE_CLOUD_PROJECT,
  });
}
