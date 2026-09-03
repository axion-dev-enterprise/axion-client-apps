import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { AppError, problem } from "@/lib/errors";
import { feedbackSchema } from "@/lib/validators";

export async function POST(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  try {
    const userId = currentUserId(request);
    const { sessionId } = await context.params;
    const input = feedbackSchema.parse(await request.json());
    const db = await database();

    // Verify session existence and user participation
    const rows = await db(`SELECT s.*, m.requester_id, m.candidate_id, m.status AS match_status
      FROM sessions s JOIN matches m ON m.id = s.match_id
      WHERE s.id = $1 AND (m.requester_id = $2 OR m.candidate_id = $2)`, [sessionId, userId]);
    const session = rows[0];
    if (!session) throw new AppError("SESSION_NOT_FOUND", "Esta sessão não está disponível.", 404);
    if (!session.completed_at) throw new AppError("SESSION_NOT_COMPLETED", "Conclua a sessão antes de enviar a avaliação.", 409);

    const feedbackId = crypto.randomUUID();
    await db(
      `INSERT INTO session_feedback (id, session_id, user_id, rating, productivity_score, comfort_score, repeat_intent, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (session_id, user_id) DO UPDATE SET
         rating = EXCLUDED.rating,
         productivity_score = EXCLUDED.productivity_score,
         comfort_score = EXCLUDED.comfort_score,
         repeat_intent = EXCLUDED.repeat_intent,
         notes = EXCLUDED.notes`,
      [feedbackId, sessionId, userId, input.rating, input.productivityScore, input.comfortScore, input.repeatIntent, input.notes]
    );

    await recordEvent(
      userId,
      "session_feedback_submitted",
      {
        sessionId,
        rating: input.rating,
        productivityScore: input.productivityScore,
        comfortScore: input.comfortScore,
        repeatIntent: input.repeatIntent
      },
      request.headers.get("X-Trace-ID") ?? crypto.randomUUID()
    );

    return NextResponse.json({ ok: true, feedbackId });
  } catch (error) {
    return problem(error);
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  try {
    const userId = currentUserId(request);
    const { sessionId } = await context.params;
    const db = await database();
    const rows = await db("SELECT * FROM session_feedback WHERE session_id = $1 AND user_id = $2", [sessionId, userId]);
    return NextResponse.json({ feedback: rows[0] ?? null });
  } catch (error) {
    return problem(error);
  }
}
