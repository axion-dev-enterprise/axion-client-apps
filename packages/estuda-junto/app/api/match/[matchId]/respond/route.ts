import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { userInMatch } from "@/lib/dashboard";
import { AppError, problem } from "@/lib/errors";
import { responseSchema } from "@/lib/validators";

export async function POST(request: NextRequest, context: { params: Promise<{ matchId: string }> }) {
  try {
    const userId = currentUserId(request);
    const { matchId } = await context.params;
    const { response } = responseSchema.parse(await request.json());
    const match = await userInMatch(userId, matchId);
    if (!match) throw new AppError("MATCH_NOT_FOUND", "Este match não está disponível.", 404);
    if (match.status !== "pending_candidate" || match.candidate_id !== userId) {
      throw new AppError("INVALID_MATCH_STATE", "Esta proposta não pode mais ser respondida.", 409);
    }
    const db = await database();
    const status = response === "accept" ? "confirmed" : "declined";
    await db("UPDATE matches SET status = $1 WHERE id = $2", [status, matchId]);
    if (response === "decline") {
      await db("UPDATE study_requests SET status = 'open' WHERE id = $1", [match.candidate_request_id]);
    }
    await recordEvent(userId, response === "accept" ? "match_accepted" : "match_declined", { matchId }, request.headers.get("X-Trace-ID") ?? crypto.randomUUID());
    return NextResponse.json({ status });
  } catch (error) {
    return problem(error);
  }
}
