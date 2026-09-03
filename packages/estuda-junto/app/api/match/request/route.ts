import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { problem } from "@/lib/errors";
import { compatibilityScore } from "@/lib/matching";
import { requestSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const userId = currentUserId(request);
    const input = requestSchema.parse(await request.json());
    const db = await database();
    const requestId = crypto.randomUUID();
    await db("UPDATE study_requests SET status = 'cancelled' WHERE user_id = $1 AND status = 'open'", [userId]);
    await db(
      "INSERT INTO study_requests (id, user_id, subject, topic, study_format, camera, availability) VALUES ($1, $2, $3, $4, $5, $6, $7::text[])",
      [requestId, userId, input.subject, input.topic, input.format, input.camera, input.availability]
    );
    const candidates = await db(`SELECT r.id, r.user_id, r.subject, r.topic, r.study_format, r.camera, r.availability
      FROM study_requests r
      WHERE r.status = 'open' AND r.user_id <> $1 AND LOWER(r.subject) = LOWER($2)
      AND r.availability && $3::text[]
      AND NOT EXISTS (SELECT 1 FROM blocks b WHERE (b.blocker_id = $1 AND b.blocked_id = r.user_id) OR (b.blocker_id = r.user_id AND b.blocked_id = $1))
      ORDER BY r.created_at ASC LIMIT 20`, [userId, input.subject, input.availability]);

    const scored = candidates.map((candidate) => ({
      candidate,
      score: compatibilityScore(input, {
        id: candidate.user_id as string,
        subject: candidate.subject as string,
        topic: candidate.topic as string,
        format: candidate.study_format as "silent" | "questions" | "discussion" | "review",
        camera: candidate.camera as "on" | "optional" | "off",
        availability: candidate.availability as string[]
      })
    })).sort((a, b) => b.score - a.score)[0];

    const traceId = request.headers.get("X-Trace-ID") ?? crypto.randomUUID();
    if (!scored || scored.score < 70) {
      await recordEvent(userId, "matching_queue_joined", { subject: input.subject }, traceId);
      return NextResponse.json({ status: "queued" });
    }

    const matchId = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    await db(
      "INSERT INTO matches (id, requester_id, candidate_id, requester_request_id, candidate_request_id, score) VALUES ($1, $2, $3, $4, $5, $6)",
      [matchId, userId, scored.candidate.user_id, requestId, scored.candidate.id, scored.score]
    );
    await db("UPDATE study_requests SET status = 'matched' WHERE id = ANY($1::uuid[])", [[requestId, scored.candidate.id]]);
    await db("INSERT INTO sessions (id, match_id, room_slug) VALUES ($1, $2, $3)", [sessionId, matchId, `estuda-junto-${matchId}`]);
    await recordEvent(userId, "match_proposed", { subject: input.subject, score: scored.score }, traceId);
    return NextResponse.json({ status: "proposed", matchId, score: scored.score });
  } catch (error) {
    return problem(error);
  }
}
