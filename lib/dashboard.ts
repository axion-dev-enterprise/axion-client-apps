import { database } from "@/lib/db";

type Row = Record<string, unknown>;

function mapMatch(row: Row) {
  const sessionId = row.session_id as string | null;
  return {
    id: row.id as string,
    status: row.status as string,
    score: Number(row.score),
    createdAt: row.created_at as string,
    partner: row.partner_name as string,
    partnerId: (row.partner_id as string) ?? "",
    subject: row.subject as string,
    topic: row.topic as string,
    format: row.study_format as string,
    camera: row.camera as string,
    session: sessionId ? {
      id: sessionId,
      roomUrl: `https://meet.jit.si/${row.room_slug as string}`,
      startedAt: row.started_at as string | null,
      completedAt: row.completed_at as string | null,
      hasFeedback: Boolean(row.has_feedback)
    } : null
  };
}

export async function dashboardFor(userId: string) {
  const db = await database();
  const [profiles, requests, matches, buddies, eventRows] = await Promise.all([
    db("SELECT id, display_name, study_goal, created_at FROM profiles WHERE id = $1", [userId]),
    db("SELECT id, subject, topic, study_format, camera, availability, status, created_at FROM study_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]),
    db(`SELECT m.id, m.status, m.score, m.created_at,
        CASE WHEN m.requester_id = $1 THEN candidate.display_name ELSE requester.display_name END AS partner_name,
        CASE WHEN m.requester_id = $1 THEN m.candidate_id ELSE m.requester_id END AS partner_id,
        CASE WHEN m.requester_id = $1 THEN candidate_request.subject ELSE requester_request.subject END AS subject,
        CASE WHEN m.requester_id = $1 THEN candidate_request.topic ELSE requester_request.topic END AS topic,
        CASE WHEN m.requester_id = $1 THEN candidate_request.study_format ELSE requester_request.study_format END AS study_format,
        CASE WHEN m.requester_id = $1 THEN candidate_request.camera ELSE requester_request.camera END AS camera,
        s.id AS session_id, s.room_slug, s.started_at, s.completed_at,
        (CASE WHEN f.id IS NOT NULL THEN TRUE ELSE FALSE END) AS has_feedback
      FROM matches m
      JOIN profiles requester ON requester.id = m.requester_id
      JOIN profiles candidate ON candidate.id = m.candidate_id
      JOIN study_requests requester_request ON requester_request.id = m.requester_request_id
      JOIN study_requests candidate_request ON candidate_request.id = m.candidate_request_id
      LEFT JOIN sessions s ON s.match_id = m.id
      LEFT JOIN session_feedback f ON f.session_id = s.id AND f.user_id = $1
      WHERE m.requester_id = $1 OR m.candidate_id = $1
      ORDER BY m.created_at DESC`, [userId]),
    db(`SELECT p.id, p.display_name, p.study_goal, b.created_at
      FROM buddies b JOIN profiles p ON p.id = b.buddy_id WHERE b.user_id = $1 ORDER BY b.created_at DESC`, [userId]),
    db(`SELECT
      COUNT(*) FILTER (WHERE event_name = 'onboarding_completed')::int AS signups,
      (SELECT COUNT(*)::int FROM matches WHERE requester_id = $1 OR candidate_id = $1) AS matches,
      (SELECT COUNT(*)::int FROM sessions s JOIN matches m ON m.id = s.match_id WHERE (m.requester_id = $1 OR m.candidate_id = $1) AND s.started_at IS NOT NULL) AS calls_started,
      (SELECT COUNT(*)::int FROM sessions s JOIN matches m ON m.id = s.match_id WHERE (m.requester_id = $1 OR m.candidate_id = $1) AND s.completed_at IS NOT NULL) AS sessions_completed,
      (SELECT COUNT(*)::int FROM buddies WHERE user_id = $1) AS buddy_count,
      (SELECT COALESCE(ROUND(AVG(rating)::numeric, 1)::float, 0) FROM session_feedback WHERE user_id = $1) AS avg_rating,
      (SELECT COUNT(*)::int FROM session_feedback WHERE user_id = $1 AND repeat_intent = TRUE) AS repeat_intent_count,
      (SELECT COUNT(*)::int FROM session_feedback WHERE user_id = $1) AS feedback_count`, [userId])
  ]);

  return {
    profile: profiles[0] ?? null,
    request: requests[0] ?? null,
    matches: matches.map(mapMatch),
    buddies,
    metrics: eventRows[0] ?? { signups: 0, matches: 0, calls_started: 0, sessions_completed: 0, buddy_count: 0, avg_rating: 0, repeat_intent_count: 0, feedback_count: 0 }
  };
}

export async function userInMatch(userId: string, matchId: string) {
  const db = await database();
  const rows = await db("SELECT * FROM matches WHERE id = $1 AND (requester_id = $2 OR candidate_id = $2)", [matchId, userId]);
  return rows[0] ?? null;
}
