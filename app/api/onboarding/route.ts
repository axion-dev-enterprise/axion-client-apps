import { NextRequest, NextResponse } from "next/server";
import { createSession, sessionCookie } from "@/lib/auth";
import { database, recordEvent } from "@/lib/db";
import { problem } from "@/lib/errors";
import { onboardingSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const input = onboardingSchema.parse(await request.json());
    const db = await database();
    const userId = crypto.randomUUID();
    await db(
      "INSERT INTO profiles (id, display_name, email, study_goal, adult_confirmed) VALUES ($1, $2, $3, $4, TRUE)",
      [userId, input.displayName, input.email.toLowerCase(), input.studyGoal]
    );
    const traceId = request.headers.get("X-Trace-ID") ?? crypto.randomUUID();
    await recordEvent(userId, "onboarding_completed", { studyGoal: input.studyGoal }, traceId);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookie.name, createSession(userId), sessionCookie.options);
    return response;
  } catch (error) {
    return problem(error);
  }
}
