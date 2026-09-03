import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { AppError, problem } from "@/lib/errors";
import { sessionSchema } from "@/lib/validators";

export async function POST(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  try {
    const userId = currentUserId(request);
    const { sessionId } = await context.params;
    const { action } = sessionSchema.parse(await request.json());
    const db = await database();
    const rows = await db(`SELECT s.*, m.requester_id, m.candidate_id, m.status AS match_status
      FROM sessions s JOIN matches m ON m.id = s.match_id
      WHERE s.id = $1 AND (m.requester_id = $2 OR m.candidate_id = $2)`, [sessionId, userId]);
    const session = rows[0];
    if (!session) throw new AppError("SESSION_NOT_FOUND", "Esta sessão não está disponível.", 404);
    if (session.match_status !== "confirmed") throw new AppError("MATCH_NOT_CONFIRMED", "O buddy precisa aceitar antes de iniciar a sessão.", 409);
    if (action === "start") {
      await db("UPDATE sessions SET started_at = COALESCE(started_at, NOW()) WHERE id = $1", [sessionId]);
      await recordEvent(userId, "session_started", { sessionId }, request.headers.get("X-Trace-ID") ?? crypto.randomUUID());
    } else {
      if (!session.started_at) throw new AppError("SESSION_NOT_STARTED", "Inicie a chamada antes de concluir a sessão.", 409);
      await db("UPDATE sessions SET completed_at = COALESCE(completed_at, NOW()) WHERE id = $1", [sessionId]);
      await recordEvent(userId, "session_completed", { sessionId }, request.headers.get("X-Trace-ID") ?? crypto.randomUUID());
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return problem(error);
  }
}
