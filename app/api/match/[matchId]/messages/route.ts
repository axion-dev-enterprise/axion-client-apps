import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { userInMatch } from "@/lib/dashboard";
import { AppError, problem } from "@/lib/errors";
import { messageSchema } from "@/lib/validators";

export async function GET(request: NextRequest, context: { params: Promise<{ matchId: string }> }) {
  try {
    const userId = currentUserId(request);
    const { matchId } = await context.params;
    const match = await userInMatch(userId, matchId);
    if (!match || match.status !== "confirmed") throw new AppError("CHAT_NOT_AVAILABLE", "O chat é liberado somente após o aceite do match.", 403);
    const db = await database();
    const messages = await db(`SELECT msg.id, msg.body, msg.created_at, msg.author_id, p.display_name AS author_name
      FROM messages msg JOIN profiles p ON p.id = msg.author_id WHERE msg.match_id = $1 ORDER BY msg.created_at ASC LIMIT 100`, [matchId]);
    return NextResponse.json({ messages, userId });
  } catch (error) {
    return problem(error);
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ matchId: string }> }) {
  try {
    const userId = currentUserId(request);
    const { matchId } = await context.params;
    const { body } = messageSchema.parse(await request.json());
    const match = await userInMatch(userId, matchId);
    if (!match || match.status !== "confirmed") throw new AppError("CHAT_NOT_AVAILABLE", "O chat é liberado somente após o aceite do match.", 403);
    const db = await database();
    await db("INSERT INTO messages (id, match_id, author_id, body) VALUES ($1, $2, $3, $4)", [crypto.randomUUID(), matchId, userId, body]);
    await recordEvent(userId, "message_sent", { matchId }, request.headers.get("X-Trace-ID") ?? crypto.randomUUID());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return problem(error);
  }
}
