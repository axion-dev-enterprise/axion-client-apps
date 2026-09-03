import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { AppError, problem } from "@/lib/errors";
import { safetySchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const userId = currentUserId(request);
    const { matchId, reason, block } = safetySchema.parse(await request.json());
    const db = await database();
    const rows = await db("SELECT * FROM matches WHERE id = $1 AND (requester_id = $2 OR candidate_id = $2)", [matchId, userId]);
    const match = rows[0];
    if (!match) throw new AppError("MATCH_NOT_FOUND", "Este match não está disponível.", 404);
    const partnerId = match.requester_id === userId ? match.candidate_id : match.requester_id;
    await db("INSERT INTO reports (id, reporter_id, reported_id, match_id, reason) VALUES ($1, $2, $3, $4, $5)", [crypto.randomUUID(), userId, partnerId, matchId, reason]);
    if (block) await db("INSERT INTO blocks (blocker_id, blocked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userId, partnerId]);
    await db("UPDATE matches SET status = 'cancelled' WHERE id = $1", [matchId]);
    await recordEvent(userId, "safety_report_submitted", { matchId, reason, block }, request.headers.get("X-Trace-ID") ?? crypto.randomUUID());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return problem(error);
  }
}
