import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const READY_URL = "https://web.synaplan.com/api/health/ready";

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(READY_URL, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json(
        { state: "down" },
        { headers: { "cache-control": "no-store" } },
      );
    }
    const body = (await response.json()) as { status?: string };
    return NextResponse.json(
      { state: body.status === "ok" ? "up" : "down" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { state: "unknown" },
      { headers: { "cache-control": "no-store" } },
    );
  } finally {
    clearTimeout(timer);
  }
}
