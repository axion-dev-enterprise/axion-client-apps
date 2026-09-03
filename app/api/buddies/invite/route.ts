import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { AppError, problem } from "@/lib/errors";
import { directInviteSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const userId = currentUserId(request);
    const input = directInviteSchema.parse(await request.json());
    const db = await database();

    // Verify buddy connection exists
    const buddyRows = await db("SELECT * FROM buddies WHERE user_id = $1 AND buddy_id = $2", [userId, input.buddyId]);
    if (buddyRows.length === 0) {
      throw new AppError("BUDDY_NOT_FOUND", "Este usuário não está na sua lista de buddies.", 404);
    }

    const requesterRequestId = crypto.randomUUID();
    const buddyRequestId = crypto.randomUUID();
    const matchId = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    const traceId = request.headers.get("X-Trace-ID") ?? crypto.randomUUID();

    // Cancel older open requests for user
    await db("UPDATE study_requests SET status = 'cancelled' WHERE user_id = $1 AND status = 'open'", [userId]);

    // Insert study requests for both
    await db(
      "INSERT INTO study_requests (id, user_id, subject, topic, study_format, camera, availability, status) VALUES ($1, $2, $3, $4, $5, $6, $7::text[], 'matched')",
      [requesterRequestId, userId, input.subject, input.topic, input.format, input.camera, [input.slot]]
    );

    await db(
      "INSERT INTO study_requests (id, user_id, subject, topic, study_format, camera, availability, status) VALUES ($1, $2, $3, $4, $5, $6, $7::text[], 'matched')",
      [buddyRequestId, input.buddyId, input.subject, input.topic, input.format, input.camera, [input.slot]]
    );

    // Create match with high compatibility (100%)
    await db(
      "INSERT INTO matches (id, requester_id, candidate_id, requester_request_id, candidate_request_id, score, status) VALUES ($1, $2, $3, $4, $5, 100, 'pending_candidate')",
      [matchId, userId, input.buddyId, requesterRequestId, buddyRequestId]
    );

    // Prepare study session
    await db(
      "INSERT INTO sessions (id, match_id, room_slug) VALUES ($1, $2, $3)",
      [sessionId, matchId, `estuda-junto-buddy-${matchId}`]
    );

    await recordEvent(userId, "direct_buddy_invite_sent", { buddyId: input.buddyId, subject: input.subject, slot: input.slot }, traceId);

    return NextResponse.json({ ok: true, matchId });
  } catch (error) {
    return problem(error);
  }
}
