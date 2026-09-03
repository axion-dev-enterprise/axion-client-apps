import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { AppError, problem } from "@/lib/errors";
import { buddySchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const userId = currentUserId(request);
    const { matchId } = buddySchema.parse(await request.json());
    const db = await database();
    const rows = await db("SELECT * FROM matches WHERE id = $1 AND status = 'confirmed' AND (requester_id = $2 OR candidate_id = $2)", [matchId, userId]);
    const match = rows[0];
    if (!match) throw new AppError("MATCH_NOT_AVAILABLE", "Conclua uma sessão confirmada antes de adicionar um buddy.", 409);
    const session = await db("SELECT completed_at FROM sessions WHERE match_id = $1", [matchId]);
    if (!session[0]?.completed_at) throw new AppError("SESSION_NOT_COMPLETED", "Conclua a sessão antes de adicionar seu buddy.", 409);
    const partnerId = match.requester_id === userId ? match.candidate_id : match.requester_id;
    await db("INSERT INTO buddies (user_id, buddy_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userId, partnerId]);
    await recordEvent(userId, "buddy_added", { matchId }, request.headers.get("X-Trace-ID") ?? crypto.randomUUID());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return problem(error);
  }
}
