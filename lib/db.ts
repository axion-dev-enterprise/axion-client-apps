import { neon } from "@neondatabase/serverless";

type SqlQueryFunction = (query: string, params?: unknown[]) => Promise<Record<string, unknown>[]>;

let schemaPromise: Promise<void> | undefined;

// In-memory persistent tables for environments without DATABASE_URL
interface MemoryStore {
  profiles: Array<{ id: string; display_name: string; email: string; study_goal: string; adult_confirmed: boolean; created_at: string }>;
  study_requests: Array<{ id: string; user_id: string; subject: string; topic: string; study_format: string; camera: string; availability: string[]; status: string; created_at: string }>;
  matches: Array<{ id: string; requester_id: string; candidate_id: string; requester_request_id: string; candidate_request_id: string; score: number; status: string; created_at: string }>;
  sessions: Array<{ id: string; match_id: string; room_slug: string; started_at: string | null; completed_at: string | null; created_at: string }>;
  buddies: Array<{ user_id: string; buddy_id: string; created_at: string }>;
  blocks: Array<{ blocker_id: string; blocked_id: string; created_at: string }>;
  reports: Array<{ id: string; reporter_id: string; reported_id: string; match_id: string | null; reason: string; created_at: string }>;
  messages: Array<{ id: string; match_id: string; author_id: string; body: string; created_at: string }>;
  session_feedback: Array<{ id: string; session_id: string; user_id: string; rating: number; productivity_score: number; comfort_score: number; repeat_intent: boolean; notes: string; created_at: string }>;
  telemetry_events: Array<{ id: string; user_id: string | null; event_name: string; metadata: Record<string, unknown>; trace_id: string; created_at: string }>;
}

const memoryStore: MemoryStore = {
  profiles: [],
  study_requests: [],
  matches: [],
  sessions: [],
  buddies: [],
  blocks: [],
  reports: [],
  messages: [],
  session_feedback: [],
  telemetry_events: []
};

function createMemorySql(): SqlQueryFunction {
  return async (query: string, params: unknown[] = []): Promise<Record<string, unknown>[]> => {
    const q = query.trim();

    // DDL commands
    if (/^CREATE\s+TABLE/i.test(q) || /^CREATE\s+INDEX/i.test(q)) {
      return [];
    }

    // INSERT INTO profiles
    if (/^INSERT INTO profiles/i.test(q)) {
      const [id, display_name, email, study_goal] = params as [string, string, string, string];
      const row = { id, display_name, email, study_goal, adult_confirmed: true, created_at: new Date().toISOString() };
      memoryStore.profiles = memoryStore.profiles.filter(p => p.id !== id);
      memoryStore.profiles.push(row);
      return [row];
    }

    // INSERT INTO study_requests
    if (/^INSERT INTO study_requests/i.test(q)) {
      const [id, user_id, subject, topic, study_format, camera, availability] = params as [string, string, string, string, string, string, string[]];
      const row = { id, user_id, subject, topic, study_format, camera, availability: Array.isArray(availability) ? availability : [], status: "open", created_at: new Date().toISOString() };
      memoryStore.study_requests.push(row);
      return [row];
    }

    // UPDATE study_requests SET status = 'cancelled'
    if (/UPDATE study_requests SET status = 'cancelled'/i.test(q)) {
      const userId = params[0] as string;
      memoryStore.study_requests.forEach(r => {
        if (r.user_id === userId && r.status === "open") r.status = "cancelled";
      });
      return [];
    }

    // UPDATE study_requests SET status = 'matched'
    if (/UPDATE study_requests SET status = 'matched'/i.test(q)) {
      const ids = (params[0] as string[]) || [];
      memoryStore.study_requests.forEach(r => {
        if (ids.includes(r.id)) r.status = "matched";
      });
      return [];
    }

    // UPDATE study_requests SET status = 'open'
    if (/UPDATE study_requests SET status = 'open'/i.test(q)) {
      const id = params[0] as string;
      memoryStore.study_requests.forEach(r => {
        if (r.id === id) r.status = "open";
      });
      return [];
    }

    // SELECT candidates from study_requests
    if (/SELECT r\.id, r\.user_id, r\.subject/i.test(q)) {
      const [userId, subject, avail] = params as [string, string, string[]];
      const availList = Array.isArray(avail) ? avail : [];
      const blockedUsers = new Set(
        memoryStore.blocks
          .filter(b => b.blocker_id === userId || b.blocked_id === userId)
          .map(b => b.blocker_id === userId ? b.blocked_id : b.blocker_id)
      );

      const rows = memoryStore.study_requests.filter(r =>
        r.status === "open" &&
        r.user_id !== userId &&
        r.subject.toLowerCase() === subject.toLowerCase() &&
        !blockedUsers.has(r.user_id) &&
        r.availability.some(slot => availList.includes(slot))
      );
      return rows as unknown as Record<string, unknown>[];
    }

    // INSERT INTO matches
    if (/^INSERT INTO matches/i.test(q)) {
      const [id, requester_id, candidate_id, requester_request_id, candidate_request_id, score] = params as [string, string, string, string, string, number];
      const row = { id, requester_id, candidate_id, requester_request_id, candidate_request_id, score: Number(score), status: "pending_candidate", created_at: new Date().toISOString() };
      memoryStore.matches.push(row);
      return [row];
    }

    // UPDATE matches SET status = ...
    if (/UPDATE matches SET status = \$1 WHERE id = \$2/i.test(q)) {
      const [status, id] = params as [string, string];
      memoryStore.matches.forEach(m => {
        if (m.id === id) m.status = status;
      });
      return [];
    }

    // UPDATE matches SET status = 'cancelled'
    if (/UPDATE matches SET status = 'cancelled' WHERE id = \$1/i.test(q)) {
      const id = params[0] as string;
      memoryStore.matches.forEach(m => {
        if (m.id === id) m.status = "cancelled";
      });
      return [];
    }

    // INSERT INTO sessions
    if (/^INSERT INTO sessions/i.test(q)) {
      const [id, match_id, room_slug] = params as [string, string, string];
      const row = { id, match_id, room_slug, started_at: null, completed_at: null, created_at: new Date().toISOString() };
      memoryStore.sessions.push(row);
      return [row];
    }

    // UPDATE sessions SET started_at = ...
    if (/UPDATE sessions SET started_at/i.test(q)) {
      const id = params[0] as string;
      memoryStore.sessions.forEach(s => {
        if (s.id === id) s.started_at ??= new Date().toISOString();
      });
      return [];
    }

    // UPDATE sessions SET completed_at = ...
    if (/UPDATE sessions SET completed_at/i.test(q)) {
      const id = params[0] as string;
      memoryStore.sessions.forEach(s => {
        if (s.id === id) s.completed_at ??= new Date().toISOString();
      });
      return [];
    }

    // INSERT INTO buddies
    if (/^INSERT INTO buddies/i.test(q)) {
      const [user_id, buddy_id] = params as [string, string];
      if (!memoryStore.buddies.some(b => b.user_id === user_id && b.buddy_id === buddy_id)) {
        memoryStore.buddies.push({ user_id, buddy_id, created_at: new Date().toISOString() });
      }
      return [];
    }

    // INSERT INTO blocks
    if (/^INSERT INTO blocks/i.test(q)) {
      const [blocker_id, blocked_id] = params as [string, string];
      if (!memoryStore.blocks.some(b => b.blocker_id === blocker_id && b.blocked_id === blocked_id)) {
        memoryStore.blocks.push({ blocker_id, blocked_id, created_at: new Date().toISOString() });
      }
      return [];
    }

    // INSERT INTO reports
    if (/^INSERT INTO reports/i.test(q)) {
      const [id, reporter_id, reported_id, match_id, reason] = params as [string, string, string, string | null, string];
      memoryStore.reports.push({ id, reporter_id, reported_id, match_id, reason, created_at: new Date().toISOString() });
      return [];
    }

    // INSERT INTO messages
    if (/^INSERT INTO messages/i.test(q)) {
      const [id, match_id, author_id, body] = params as [string, string, string, string];
      const row = { id, match_id, author_id, body, created_at: new Date().toISOString() };
      memoryStore.messages.push(row);
      return [row];
    }

    // INSERT INTO session_feedback
    if (/^INSERT INTO session_feedback/i.test(q)) {
      const [id, session_id, user_id, rating, productivity_score, comfort_score, repeat_intent, notes] = params as [string, string, string, number, number, number, boolean, string];
      const row = {
        id,
        session_id,
        user_id,
        rating: Number(rating),
        productivity_score: Number(productivity_score),
        comfort_score: Number(comfort_score),
        repeat_intent: Boolean(repeat_intent),
        notes: String(notes ?? ""),
        created_at: new Date().toISOString()
      };
      memoryStore.session_feedback = memoryStore.session_feedback.filter(f => !(f.session_id === session_id && f.user_id === user_id));
      memoryStore.session_feedback.push(row);
      return [row];
    }

    // INSERT INTO telemetry_events
    if (/^INSERT INTO telemetry_events/i.test(q)) {
      const [id, user_id, event_name, metadataStr, trace_id] = params as [string, string | null, string, string, string];
      let meta: Record<string, unknown> = {};
      try { meta = JSON.parse(metadataStr); } catch { /* ignore */ }
      memoryStore.telemetry_events.push({ id, user_id, event_name, metadata: meta, trace_id, created_at: new Date().toISOString() });
      return [];
    }

    // SELECT profiles by ID
    if (/SELECT id, display_name, study_goal, created_at FROM profiles WHERE id = \$1/i.test(q)) {
      const id = params[0] as string;
      const user = memoryStore.profiles.find(p => p.id === id);
      return user ? [user] : [];
    }

    // SELECT study_requests by user_id
    if (/SELECT id, subject, topic, study_format, camera, availability, status, created_at FROM study_requests WHERE user_id = \$1/i.test(q)) {
      const userId = params[0] as string;
      const list = memoryStore.study_requests
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return list.slice(0, 1) as unknown as Record<string, unknown>[];
    }

    // SELECT matches dashboard query
    if (/FROM matches m/i.test(q) && /WHERE m\.requester_id = \$1 OR m\.candidate_id = \$1/i.test(q)) {
      const userId = params[0] as string;
      const userMatches = memoryStore.matches
        .filter(m => m.requester_id === userId || m.candidate_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return userMatches.map(m => {
        const isRequester = m.requester_id === userId;
        const requester = memoryStore.profiles.find(p => p.id === m.requester_id);
        const candidate = memoryStore.profiles.find(p => p.id === m.candidate_id);
        const reqReq = memoryStore.study_requests.find(r => r.id === m.requester_request_id);
        const candReq = memoryStore.study_requests.find(r => r.id === m.candidate_request_id);
        const session = memoryStore.sessions.find(s => s.match_id === m.id);
        const fb = session ? memoryStore.session_feedback.find(f => f.session_id === session.id && f.user_id === userId) : null;

        return {
          id: m.id,
          status: m.status,
          score: m.score,
          created_at: m.created_at,
          partner_name: isRequester ? (candidate?.display_name ?? "Parceiro") : (requester?.display_name ?? "Parceiro"),
          partner_id: isRequester ? m.candidate_id : m.requester_id,
          subject: isRequester ? (candReq?.subject ?? reqReq?.subject ?? "") : (reqReq?.subject ?? candReq?.subject ?? ""),
          topic: isRequester ? (candReq?.topic ?? reqReq?.topic ?? "") : (reqReq?.topic ?? candReq?.topic ?? ""),
          study_format: isRequester ? (candReq?.study_format ?? reqReq?.study_format ?? "questions") : (reqReq?.study_format ?? candReq?.study_format ?? "questions"),
          camera: isRequester ? (candReq?.camera ?? reqReq?.camera ?? "optional") : (reqReq?.camera ?? candReq?.camera ?? "optional"),
          session_id: session?.id ?? null,
          room_slug: session?.room_slug ?? null,
          started_at: session?.started_at ?? null,
          completed_at: session?.completed_at ?? null,
          has_feedback: Boolean(fb)
        };
      });
    }

    // SELECT user in match
    if (/SELECT \* FROM matches WHERE id = \$1 AND \(requester_id = \$2 OR candidate_id = \$2\)/i.test(q)) {
      const [matchId, userId] = params as [string, string];
      const match = memoryStore.matches.find(m => m.id === matchId && (m.requester_id === userId || m.candidate_id === userId));
      return match ? [match as unknown as Record<string, unknown>] : [];
    }

    // SELECT user in match for buddies check
    if (/SELECT \* FROM matches WHERE id = \$1 AND status = 'confirmed' AND \(requester_id = \$2 OR candidate_id = \$2\)/i.test(q)) {
      const [matchId, userId] = params as [string, string];
      const match = memoryStore.matches.find(m => m.id === matchId && m.status === "confirmed" && (m.requester_id === userId || m.candidate_id === userId));
      return match ? [match as unknown as Record<string, unknown>] : [];
    }

    // SELECT completed session for match
    if (/SELECT completed_at FROM sessions WHERE match_id = \$1/i.test(q)) {
      const matchId = params[0] as string;
      const s = memoryStore.sessions.find(item => item.match_id === matchId);
      return s ? [{ completed_at: s.completed_at }] : [];
    }

    // SELECT sessions with match info
    if (/FROM sessions s JOIN matches m ON m\.id = s\.match_id/i.test(q) && /WHERE s\.id = \$1/i.test(q)) {
      const [sessionId, userId] = params as [string, string];
      const s = memoryStore.sessions.find(item => item.id === sessionId);
      if (!s) return [];
      const m = memoryStore.matches.find(item => item.id === s.match_id && (item.requester_id === userId || item.candidate_id === userId));
      if (!m) return [];
      return [{
        ...s,
        requester_id: m.requester_id,
        candidate_id: m.candidate_id,
        match_status: m.status
      }];
    }

    // SELECT session feedback
    if (/SELECT \* FROM session_feedback WHERE session_id = \$1 AND user_id = \$2/i.test(q)) {
      const [sessionId, userId] = params as [string, string];
      const fb = memoryStore.session_feedback.find(f => f.session_id === sessionId && f.user_id === userId);
      return fb ? [fb as unknown as Record<string, unknown>] : [];
    }

    // SELECT buddies
    if (/FROM buddies b JOIN profiles p ON p\.id = b\.buddy_id WHERE b\.user_id = \$1/i.test(q)) {
      const userId = params[0] as string;
      const userBuddies = memoryStore.buddies.filter(b => b.user_id === userId);
      return userBuddies.map(b => {
        const profile = memoryStore.profiles.find(p => p.id === b.buddy_id);
        return {
          id: b.buddy_id,
          display_name: profile?.display_name ?? "Buddy",
          study_goal: profile?.study_goal ?? "",
          created_at: b.created_at
        };
      });
    }

    // SELECT messages
    if (/FROM messages msg JOIN profiles p ON p\.id = msg\.author_id WHERE msg\.match_id = \$1/i.test(q)) {
      const matchId = params[0] as string;
      const msgs = memoryStore.messages
        .filter(m => m.match_id === matchId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return msgs.map(m => {
        const author = memoryStore.profiles.find(p => p.id === m.author_id);
        return {
          id: m.id,
          body: m.body,
          created_at: m.created_at,
          author_id: m.author_id,
          author_name: author?.display_name ?? "Estudante"
        };
      });
    }

    // SELECT metrics aggregates
    if (/COUNT\(\*\) FILTER \(WHERE event_name = 'onboarding_completed'\)/i.test(q)) {
      const userId = params[0] as string;
      const signups = memoryStore.profiles.length;
      const matches = memoryStore.matches.filter(m => m.requester_id === userId || m.candidate_id === userId).length;
      const userMatchIds = new Set(memoryStore.matches.filter(m => m.requester_id === userId || m.candidate_id === userId).map(m => m.id));
      const calls_started = memoryStore.sessions.filter(s => userMatchIds.has(s.match_id) && s.started_at !== null).length;
      const sessions_completed = memoryStore.sessions.filter(s => userMatchIds.has(s.match_id) && s.completed_at !== null).length;
      const buddy_count = memoryStore.buddies.filter(b => b.user_id === userId).length;
      
      const userFeedbacks = memoryStore.session_feedback.filter(f => f.user_id === userId);
      const avg_rating = userFeedbacks.length ? (userFeedbacks.reduce((acc, f) => acc + f.rating, 0) / userFeedbacks.length) : 0;
      const repeat_intent_count = userFeedbacks.filter(f => f.repeat_intent).length;

      return [{
        signups,
        matches,
        calls_started,
        sessions_completed,
        buddy_count,
        avg_rating: Math.round(avg_rating * 10) / 10,
        repeat_intent_count,
        feedback_count: userFeedbacks.length
      }];
    }

    return [];
  };
}

let activeSql: SqlQueryFunction | undefined;

function getSql(): SqlQueryFunction {
  if (activeSql) return activeSql;
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && databaseUrl.trim().startsWith("postgres")) {
    const neonClient = neon(databaseUrl);
    activeSql = async (query: string, params: unknown[] = []) => {
      const exec = neonClient as unknown as (q: string, p?: unknown[]) => Promise<unknown[]>;
      const result = await (params.length > 0 ? exec(query, params) : exec(query));
      return result as Record<string, unknown>[];
    };
  } else {
    activeSql = createMemorySql();
  }
  return activeSql;
}

async function setupSchema() {
  const db = getSql();
  await db(`CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL,
    study_goal TEXT NOT NULL,
    adult_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await db(`CREATE TABLE IF NOT EXISTS study_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    study_format TEXT NOT NULL,
    camera TEXT NOT NULL,
    availability TEXT[] NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await db(`CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    requester_request_id UUID NOT NULL REFERENCES study_requests(id) ON DELETE CASCADE,
    candidate_request_id UUID NOT NULL REFERENCES study_requests(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_candidate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(requester_request_id),
    UNIQUE(candidate_request_id)
  )`);
  await db(`CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY,
    match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
    room_slug TEXT NOT NULL UNIQUE,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await db(`CREATE TABLE IF NOT EXISTS session_feedback (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    productivity_score INTEGER NOT NULL,
    comfort_score INTEGER NOT NULL,
    repeat_intent BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, user_id)
  )`);
  await db(`CREATE TABLE IF NOT EXISTS buddies (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    buddy_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, buddy_id),
    CHECK (user_id <> buddy_id)
  )`);
  await db(`CREATE TABLE IF NOT EXISTS blocks (
    blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id),
    CHECK (blocker_id <> blocked_id)
  )`);
  await db(`CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await db(`CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await db(`CREATE TABLE IF NOT EXISTS telemetry_events (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    trace_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await db("CREATE INDEX IF NOT EXISTS study_requests_open_idx ON study_requests (status, subject)");
  await db("CREATE INDEX IF NOT EXISTS matches_member_idx ON matches (requester_id, candidate_id, status)");
  await db("CREATE INDEX IF NOT EXISTS messages_match_idx ON messages (match_id, created_at)");
}

export async function database() {
  schemaPromise ??= setupSchema();
  try {
    await schemaPromise;
  } catch (error) {
    schemaPromise = undefined;
    throw error;
  }
  return getSql();
}

export async function recordEvent(userId: string | null, eventName: string, metadata: Record<string, unknown>, traceId: string) {
  const db = await database();
  await db(
    "INSERT INTO telemetry_events (id, user_id, event_name, metadata, trace_id) VALUES ($1, $2, $3, $4::jsonb, $5)",
    [crypto.randomUUID(), userId, eventName, JSON.stringify(metadata), traceId]
  );
}
