import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { recordEvent } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = (() => { try { return currentUserId(request); } catch { return null; } })();
    await recordEvent(userId, String(body.eventName ?? "unknown").slice(0, 80), body.metadata ?? {}, String(body.traceId ?? crypto.randomUUID()).slice(0, 100));
  } catch {
    // Telemetry must not break the study flow.
  }
  return NextResponse.json({ ok: true });
}
