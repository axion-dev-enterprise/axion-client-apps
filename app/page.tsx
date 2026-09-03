"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BadgeCheck, BarChart3, Bell, BookOpen, CalendarDays, Check,
  Clock3, Flag, Handshake, Heart, LockKeyhole, MessageSquare, Send,
  ShieldCheck, Sparkles, Star, ThumbsUp, UserRoundPlus, Users, Video, X
} from "lucide-react";
import { api } from "@/lib/api";
import { initBrowserTelemetry, track } from "@/lib/browser-telemetry";

type Match = {
  id: string;
  status: "pending_candidate" | "confirmed" | "declined" | "cancelled";
  score: number;
  createdAt: string;
  partner: string;
  partnerId: string;
  subject: string;
  topic: string;
  format: string;
  camera: string;
  session: null | {
    id: string;
    roomUrl: string;
    startedAt: string | null;
    completedAt: string | null;
    hasFeedback?: boolean;
  };
};

type Buddy = {
  id: string;
  display_name: string;
  study_goal: string;
  created_at: string;
};

type Dashboard = {
  profile: null | { id: string; display_name: string; study_goal: string; created_at: string };
  request: null | { subject: string; topic: string; study_format: string; camera: string; availability: string[]; status: string };
  matches: Match[];
  buddies: Buddy[];
  metrics: {
    signups: number;
    matches: number;
    calls_started: number;
    sessions_completed: number;
    buddy_count: number;
    avg_rating?: number;
    repeat_intent_count?: number;
    feedback_count?: number;
  };
};

type Message = { id: string; body: string; created_at: string; author_id: string; author_name: string };
type Tab = "match" | "sessions" | "buddies" | "metrics";

const slots = [
  ["seg-07", "Seg · 07h"], ["seg-19", "Seg · 19h"], ["ter-19", "Ter · 19h"],
  ["qua-19", "Qua · 19h"], ["qui-19", "Qui · 19h"], ["sex-19", "Sex · 19h"],
  ["sab-12", "Sáb · 12h"], ["dom-16", "Dom · 16h"]
] as const;

const formatLabel: Record<string, string> = {
  silent: "Foco em silêncio",
  questions: "Questões juntos",
  discussion: "Discussão guiada",
  review: "Revisão"
};

function shortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value));
}

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("match");
  const [toast, setToast] = useState<string | null>(null);
  const [reportingMatch, setReportingMatch] = useState<Match | null>(null);
  const [feedbackSession, setFeedbackSession] = useState<{ id: string; partnerName: string; matchId: string } | null>(null);
  const [invitingBuddy, setInvitingBuddy] = useState<Buddy | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<Dashboard>("/api/dashboard");
      setDashboard(data);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("cadastro")) {
        setToast(error instanceof Error ? error.message : "Não foi possível carregar seus dados.");
      }
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initBrowserTelemetry();
    void load();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 15000);
    return () => window.clearInterval(interval);
  }, [load]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4200);
  };

  if (loading) {
    return (
      <main className="shell">
        <div className="loading-shell">
          <span className="mark"><BookOpen aria-hidden="true" /></span>
          <span>Preparando seu espaço de estudo</span>
        </div>
      </main>
    );
  }

  if (!dashboard?.profile) {
    return <Onboarding onDone={() => { void load(); notify("Cadastro concluído. Vamos encontrar seu buddy."); }} onError={notify} />;
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <div className="brand"><span className="mark"><BookOpen aria-hidden="true" /></span><span>estuda junto</span></div>
        <p className="sidebar-caption">Seu espaço para estudar com presença, ritmo e parceria.</p>
        <nav>
          <NavItem active={tab === "match"} onClick={() => setTab("match")} icon={<Sparkles aria-hidden="true" />}>Encontrar buddy</NavItem>
          <NavItem active={tab === "sessions"} onClick={() => setTab("sessions")} icon={<Video aria-hidden="true" />}>Sessões</NavItem>
          <NavItem active={tab === "buddies"} onClick={() => setTab("buddies")} icon={<Heart aria-hidden="true" />}>Meus buddies</NavItem>
          <NavItem active={tab === "metrics"} onClick={() => setTab("metrics")} icon={<BarChart3 aria-hidden="true" />}>Minha jornada</NavItem>
        </nav>
        <div className="safety-note"><ShieldCheck aria-hidden="true" /><span>Comunicação protegida. Você controla cada match.</span></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">BEM-VINDO DE VOLTA</p><h1>Olá, {dashboard.profile.display_name.split(" ")[0]}.</h1></div>
          <button className="icon-button" type="button" aria-label="Ver regras de segurança" onClick={() => setTab("metrics")}><Bell aria-hidden="true" /></button>
        </header>

        {tab === "match" && (
          <MatchTab
            dashboard={dashboard}
            refresh={load}
            notify={notify}
            onReport={setReportingMatch}
            onOpenFeedback={(id, partnerName, matchId) => setFeedbackSession({ id, partnerName, matchId })}
          />
        )}
        {tab === "sessions" && (
          <SessionsTab
            matches={dashboard.matches}
            refresh={load}
            notify={notify}
            onReport={setReportingMatch}
            onOpenFeedback={(id, partnerName, matchId) => setFeedbackSession({ id, partnerName, matchId })}
          />
        )}
        {tab === "buddies" && (
          <BuddiesTab
            dashboard={dashboard}
            onInvite={(buddy) => setInvitingBuddy(buddy)}
          />
        )}
        {tab === "metrics" && <MetricsTab dashboard={dashboard} />}
      </section>

      {reportingMatch && (
        <SafetyModal
          match={reportingMatch}
          onClose={() => setReportingMatch(null)}
          onDone={() => { setReportingMatch(null); void load(); notify("Recebemos seu relato. O match foi encerrado."); }}
          onError={notify}
        />
      )}

      {feedbackSession && (
        <FeedbackModal
          sessionId={feedbackSession.id}
          partnerName={feedbackSession.partnerName}
          onClose={() => setFeedbackSession(null)}
          onDone={() => { setFeedbackSession(null); void load(); notify("Avaliação enviada. Obrigado por ajudar a melhorar os matches!"); }}
          onError={notify}
        />
      )}

      {invitingBuddy && (
        <DirectInviteModal
          buddy={invitingBuddy}
          defaultSubject={dashboard.request?.subject ?? ""}
          defaultTopic={dashboard.request?.topic ?? ""}
          onClose={() => setInvitingBuddy(null)}
          onDone={() => {
            setInvitingBuddy(null);
            setTab("match");
            void load();
            notify(`Convite enviado para ${invitingBuddy.display_name}.`);
          }}
          onError={notify}
        />
      )}

      {toast && <div id="toast-container" className="toast" role="status"><BadgeCheck aria-hidden="true" />{toast}</div>}
    </main>
  );
}

function NavItem({ active, icon, children, onClick }: { active: boolean; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{children}</span></button>;
}

function Onboarding({ onDone, onError }: { onDone: () => void; onError: (message: string) => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      await api("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({
          displayName: data.get("displayName"),
          email: data.get("email"),
          studyGoal: data.get("studyGoal"),
          adultConfirmed: data.get("adultConfirmed") === "on",
          conductAccepted: data.get("conductAccepted") === "on"
        })
      });
      track({ eventName: "onboarding_form_completed" });
      onDone();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível concluir seu cadastro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-copy">
        <div className="brand"><span className="mark"><BookOpen aria-hidden="true" /></span><span>estuda junto</span></div>
        <div className="hero-copy">
          <p className="eyebrow">ESTUDO COM PRESENÇA</p>
          <h1>Você não precisa<br />estudar sozinho.</h1>
          <p>Encontre alguém com objetivo e ritmo compatíveis. Combine uma sessão e avance com foco.</p>
        </div>
        <div className="promise-list">
          <span><Check aria-hidden="true" />Match por matéria e horário</span>
          <span><Check aria-hidden="true" />Sessão em vídeo, no seu ritmo</span>
          <span><Check aria-hidden="true" />Controle e segurança em cada etapa</span>
        </div>
      </section>
      <section className="onboarding-card-wrap">
        <form className="onboarding-card" onSubmit={submit}>
          <div><p className="eyebrow">PRIMEIRO ACESSO</p><h2>Vamos montar seu perfil.</h2><p>Usamos só o necessário para sugerir um parceiro de estudo.</p></div>
          <label>Como podemos te chamar?<input name="displayName" required minLength={2} maxLength={40} placeholder="Seu primeiro nome" /></label>
          <label>Seu melhor e-mail<input name="email" required type="email" placeholder="voce@email.com" /></label>
          <label>O que você está preparando?<input name="studyGoal" required minLength={3} maxLength={120} placeholder="Ex.: ENEM 2027, vestibular, faculdade" /></label>
          <label className="check-row"><input name="adultConfirmed" required type="checkbox" /><span>Confirmo que tenho 18 anos ou mais.</span></label>
          <label className="check-row"><input name="conductAccepted" required type="checkbox" /><span>Li e aceito estudar com respeito, sem compartilhar contatos ou links externos.</span></label>
          <button className="primary-button" disabled={submitting} type="submit">{submitting ? "Criando seu espaço" : "Criar meu espaço"}<ArrowRight aria-hidden="true" /></button>
          <p className="privacy"><LockKeyhole aria-hidden="true" />Dados mínimos, comunicação interna e denúncia sempre disponível.</p>
        </form>
      </section>
    </main>
  );
}

function MatchTab({
  dashboard,
  refresh,
  notify,
  onReport,
  onOpenFeedback
}: {
  dashboard: Dashboard;
  refresh: () => Promise<void>;
  notify: (message: string) => void;
  onReport: (match: Match) => void;
  onOpenFeedback: (sessionId: string, partnerName: string, matchId: string) => void;
}) {
  const [finding, setFinding] = useState(false);
  const [availability, setAvailability] = useState<string[]>(dashboard.request?.availability ?? ["seg-19", "qua-19"]);
  const active = dashboard.matches.find((match) => match.status === "pending_candidate" || match.status === "confirmed");

  async function find(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFinding(true);
    try {
      const result = await api<{ status: "queued" | "proposed"; score?: number }>("/api/match/request", {
        method: "POST",
        body: JSON.stringify({
          subject: form.get("subject"),
          topic: form.get("topic"),
          format: form.get("format"),
          camera: form.get("camera"),
          availability
        })
      });
      notify(result.status === "queued" ? "Seu pedido entrou na curadoria. Avisaremos quando houver compatibilidade." : `Encontramos uma proposta com ${result.score}% de compatibilidade.`);
      track({ eventName: result.status === "queued" ? "matching_request_queued" : "matching_proposal_created" });
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível buscar um buddy.");
    } finally {
      setFinding(false);
    }
  }

  return (
    <div className="tab-content">
      <section className="page-intro">
        <div>
          <p className="eyebrow">MATCHING COM INTENÇÃO</p>
          <h2>Encontre alguém para estudar hoje.</h2>
          <p>Começamos pela compatibilidade que importa: matéria, objetivo, horário e formato.</p>
        </div>
        <span className="status-pill"><ShieldCheck aria-hidden="true" />Você decide cada convite</span>
      </section>

      {active ? (
        <MatchCard
          match={active}
          refresh={refresh}
          notify={notify}
          onReport={onReport}
          onOpenFeedback={onOpenFeedback}
        />
      ) : (
        <section className="match-grid">
          <form className="panel matching-form" onSubmit={find}>
            <div className="panel-heading">
              <div><p className="eyebrow">SEU PRÓXIMO FOCO</p><h3>O que você quer estudar?</h3></div>
              <Sparkles aria-hidden="true" />
            </div>
            <div className="form-grid">
              <label>Matéria<input name="subject" required defaultValue={dashboard.request?.subject ?? ""} placeholder="Ex.: Matemática" /></label>
              <label>Tópico<input name="topic" required defaultValue={dashboard.request?.topic ?? ""} placeholder="Ex.: Funções" /></label>
            </div>
            <div className="form-grid">
              <label>Formato
                <select name="format" defaultValue={dashboard.request?.study_format ?? "questions"}>
                  <option value="silent">Foco em silêncio</option>
                  <option value="questions">Questões juntos</option>
                  <option value="discussion">Discussão guiada</option>
                  <option value="review">Revisão</option>
                </select>
              </label>
              <label>Câmera
                <select name="camera" defaultValue={dashboard.request?.camera ?? "optional"}>
                  <option value="optional">Opcional</option>
                  <option value="on">Ligada</option>
                  <option value="off">Desligada</option>
                </select>
              </label>
            </div>
            <fieldset>
              <legend>Quando você pode?</legend>
              <div className="slot-grid">
                {slots.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`slot ${availability.includes(value) ? "selected" : ""}`}
                    onClick={() => setAvailability((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])}
                  >
                    {availability.includes(value) && <Check aria-hidden="true" />}{label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="primary-button" type="submit" disabled={finding || availability.length === 0}>
              {finding ? "Procurando compatibilidade" : "Encontrar meu buddy"}
              <ArrowRight aria-hidden="true" />
            </button>
          </form>

          <aside className="principles-panel">
            <p className="eyebrow">COMO FUNCIONA</p>
            <h3>Uma sessão começa com clareza.</h3>
            <div className="step">
              <span>01</span>
              <div><strong>Você indica seu foco</strong><p>Matéria, tema e um horário que funciona para você.</p></div>
            </div>
            <div className="step">
              <span>02</span>
              <div><strong>A curadoria encontra compatibilidade</strong><p>O match considera o que é essencial antes de qualquer convite.</p></div>
            </div>
            <div className="step">
              <span>03</span>
              <div><strong>Os dois aceitam</strong><p>A sala só abre depois da confirmação de ambas as pessoas.</p></div>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
}

function MatchCard({
  match,
  refresh,
  notify,
  onReport,
  onOpenFeedback
}: {
  match: Match;
  refresh: () => Promise<void>;
  notify: (message: string) => void;
  onReport: (match: Match) => void;
  onOpenFeedback: (sessionId: string, partnerName: string, matchId: string) => void;
}) {
  const [working, setWorking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const confirmed = match.status === "confirmed";

  const loadMessages = useCallback(async () => {
    if (!confirmed) return;
    try {
      const data = await api<{ messages: Message[]; userId: string }>(`/api/match/${match.id}/messages`);
      setMessages(data.messages);
      setUserId(data.userId);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível abrir o chat.");
    }
  }, [confirmed, match.id, notify]);

  useEffect(() => { void loadMessages(); }, [loadMessages]);

  async function respond(response: "accept" | "decline") {
    setWorking(true);
    try {
      await api(`/api/match/${match.id}/respond`, { method: "POST", body: JSON.stringify({ response }) });
      notify(response === "accept" ? "Match confirmado. Sua sala protegida já está disponível." : "Proposta recusada. Seguiremos procurando uma combinação melhor.");
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível responder agora.");
    } finally {
      setWorking(false);
    }
  }

  async function session(action: "start" | "complete") {
    if (!match.session) return;
    setWorking(true);
    try {
      await api(`/api/session/${match.session.id}`, { method: "POST", body: JSON.stringify({ action }) });
      if (action === "start") window.open(match.session.roomUrl, "_blank", "noopener,noreferrer");
      if (action === "complete") {
        notify("Sessão concluída. Excelente trabalho.");
        onOpenFeedback(match.session.id, match.partner, match.id);
      } else {
        notify("Sessão iniciada. Boa concentração.");
      }
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível atualizar sua sessão.");
    } finally {
      setWorking(false);
    }
  }

  async function addBuddy() {
    setWorking(true);
    try {
      await api("/api/buddies", { method: "POST", body: JSON.stringify({ matchId: match.id }) });
      notify(`${match.partner} agora faz parte dos seus buddies.`);
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível adicionar o buddy.");
    } finally {
      setWorking(false);
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    try {
      await api(`/api/match/${match.id}/messages`, { method: "POST", body: JSON.stringify({ body: message }) });
      setMessage("");
      await loadMessages();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Mensagem não enviada.");
    }
  }

  return (
    <section className="match-active panel">
      <div className="match-banner">
        <div>
          <p className="eyebrow">{confirmed ? "MATCH CONFIRMADO" : "PROPOSTA PARA VOCÊ"}</p>
          <h3>{confirmed ? "Sua sessão pode acontecer agora." : "Há uma combinação esperando sua decisão."}</h3>
        </div>
        <span className={`status-pill ${confirmed ? "confirmed" : ""}`}>
          <span className="status-dot" />
          {confirmed ? "Confirmado" : "Aguardando você"}
        </span>
      </div>

      <div className="match-person">
        <div className="avatar">{match.partner.slice(0, 1).toUpperCase()}</div>
        <div>
          <h2>{match.partner}</h2>
          <p>{match.subject} · {match.topic}</p>
          <div className="match-tags">
            <span><Handshake aria-hidden="true" />{match.score}% de compatibilidade</span>
            <span><Clock3 aria-hidden="true" />{formatLabel[match.format] ?? match.format}</span>
          </div>
        </div>
        <button type="button" className="quiet-button" onClick={() => onReport(match)}>
          <Flag aria-hidden="true" />Denunciar ou bloquear
        </button>
      </div>

      {!confirmed ? (
        <div className="match-actions">
          <button className="secondary-button" type="button" disabled={working} onClick={() => void respond("decline")}>
            Agora não
          </button>
          <button className="primary-button" type="button" disabled={working} onClick={() => void respond("accept")}>
            Aceitar match<Check aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="session-actions">
            <div>
              <p className="eyebrow">SALA DE ESTUDO</p>
              <strong>{match.session?.completedAt ? "Sessão concluída" : match.session?.startedAt ? "Sessão em andamento" : "Pronta quando vocês estiverem"}</strong>
              <p>Use a sala integrada para estudar com vídeo. O contato continua protegido.</p>
            </div>
            <div className="action-row">
              {!match.session?.startedAt && (
                <button type="button" className="primary-button" disabled={working} onClick={() => void session("start")}>
                  <Video aria-hidden="true" />Iniciar sala
                </button>
              )}
              {match.session?.startedAt && !match.session?.completedAt && (
                <button type="button" className="secondary-button" disabled={working} onClick={() => void session("complete")}>
                  <Check aria-hidden="true" />Concluir sessão
                </button>
              )}
              {match.session?.completedAt && !match.session?.hasFeedback && (
                <button type="button" className="secondary-button" disabled={working} onClick={() => onOpenFeedback(match.session!.id, match.partner, match.id)}>
                  <Star aria-hidden="true" />Avaliar sessão
                </button>
              )}
              {match.session?.completedAt && (
                <button type="button" className="primary-button" disabled={working} onClick={() => void addBuddy()}>
                  <UserRoundPlus aria-hidden="true" />Adicionar buddy
                </button>
              )}
            </div>
          </div>

          <div className="chat">
            <div className="chat-heading">
              <MessageSquare aria-hidden="true" />
              <div>
                <strong>Chat da sessão</strong>
                <p>Sem links, telefones ou redes sociais.</p>
              </div>
            </div>
            <div className="message-list" aria-live="polite">
              {messages.length === 0 ? (
                <p className="empty-copy">Combine o foco da sessão por aqui.</p>
              ) : (
                messages.map((item) => (
                  <div key={item.id} className={`message ${item.author_id === userId ? "mine" : ""}`}>
                    <strong>{item.author_id === userId ? "Você" : item.author_name}</strong>
                    <p>{item.body}</p>
                  </div>
                ))
              )}
            </div>
            <form className="message-form" onSubmit={sendMessage}>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={400}
                aria-label="Mensagem para seu buddy"
                placeholder="Ex.: vamos começar por funções quadráticas?"
              />
              <button type="submit" aria-label="Enviar mensagem"><ArrowRight aria-hidden="true" /></button>
            </form>
          </div>
        </>
      )}
    </section>
  );
}

function SessionsTab({
  matches,
  refresh,
  notify,
  onReport,
  onOpenFeedback
}: {
  matches: Match[];
  refresh: () => Promise<void>;
  notify: (message: string) => void;
  onReport: (match: Match) => void;
  onOpenFeedback: (sessionId: string, partnerName: string, matchId: string) => void;
}) {
  const sessions = matches.filter((match) => match.status === "confirmed" && match.session);

  return (
    <div className="tab-content">
      <section className="page-intro">
        <div>
          <p className="eyebrow">SESSÕES COM INTENÇÃO</p>
          <h2>Seu ritmo ganha companhia.</h2>
          <p>Entre em uma sala quando ambos estiverem prontos e conclua quando o foco terminar.</p>
        </div>
      </section>

      {sessions.length === 0 ? (
        <EmptyState
          icon={<Video aria-hidden="true" />}
          title="Nenhuma sessão confirmada ainda"
          copy="Aceite um match para liberar uma sala de estudo protegida."
        />
      ) : (
        <div className="session-list">
          {sessions.map((match) => (
            <SessionRow
              key={match.id}
              match={match}
              refresh={refresh}
              notify={notify}
              onReport={onReport}
              onOpenFeedback={onOpenFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionRow({
  match,
  refresh,
  notify,
  onReport,
  onOpenFeedback
}: {
  match: Match;
  refresh: () => Promise<void>;
  notify: (message: string) => void;
  onReport: (match: Match) => void;
  onOpenFeedback: (sessionId: string, partnerName: string, matchId: string) => void;
}) {
  const [working, setWorking] = useState(false);
  const session = match.session!;

  async function update(action: "start" | "complete") {
    setWorking(true);
    try {
      await api(`/api/session/${session.id}`, { method: "POST", body: JSON.stringify({ action }) });
      if (action === "start") window.open(session.roomUrl, "_blank", "noopener,noreferrer");
      if (action === "complete") {
        notify("Sessão concluída.");
        onOpenFeedback(session.id, match.partner, match.id);
      } else {
        notify("Sala aberta. Boa sessão.");
      }
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível atualizar a sessão.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <article className="session-row panel">
      <div className="session-icon"><Video aria-hidden="true" /></div>
      <div className="session-row-copy">
        <p className="eyebrow">{session.completedAt ? "CONCLUÍDA" : session.startedAt ? "EM ANDAMENTO" : "PRONTA PARA COMEÇAR"}</p>
        <h3>{match.subject} com {match.partner}</h3>
        <p>{match.topic} · {formatLabel[match.format] ?? match.format}</p>
      </div>
      <div className="session-row-actions">
        {!session.startedAt && (
          <button className="primary-button" type="button" disabled={working} onClick={() => void update("start")}>
            <Video aria-hidden="true" />Abrir sala
          </button>
        )}
        {session.startedAt && !session.completedAt && (
          <button className="secondary-button" type="button" disabled={working} onClick={() => void update("complete")}>
            <Check aria-hidden="true" />Concluir
          </button>
        )}
        {session.completedAt && !session.hasFeedback && (
          <button className="secondary-button" type="button" onClick={() => onOpenFeedback(session.id, match.partner, match.id)}>
            <Star aria-hidden="true" />Avaliar
          </button>
        )}
        <button className="icon-button" type="button" aria-label="Denunciar ou bloquear este match" onClick={() => onReport(match)}>
          <Flag aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function BuddiesTab({
  dashboard,
  onInvite
}: {
  dashboard: Dashboard;
  onInvite: (buddy: Buddy) => void;
}) {
  return (
    <div className="tab-content">
      <section className="page-intro">
        <div>
          <p className="eyebrow">REDE DE ESTUDO</p>
          <h2>As pessoas com quem você evolui.</h2>
          <p>Um buddy é alguém com quem uma sessão já funcionou — não uma lista aleatória de contatos. Convide para estudar diretamente.</p>
        </div>
      </section>

      {dashboard.buddies.length === 0 ? (
        <EmptyState
          icon={<Heart aria-hidden="true" />}
          title="Sua rede começa na primeira boa sessão"
          copy="Depois de concluir uma sessão, você pode adicionar a pessoa como buddy para estudar de novo."
        />
      ) : (
        <div className="buddy-grid">
          {dashboard.buddies.map((buddy) => (
            <article key={buddy.id} className="buddy-card panel">
              <div className="avatar">{buddy.display_name.slice(0, 1).toUpperCase()}</div>
              <div className="buddy-info">
                <h3>{buddy.display_name}</h3>
                <p>{buddy.study_goal}</p>
                <span><CalendarDays aria-hidden="true" />Conectado em {shortDate(buddy.created_at)}</span>
              </div>
              <button
                type="button"
                className="primary-button buddy-invite-button"
                onClick={() => onInvite(buddy)}
              >
                <Send aria-hidden="true" />Convidar
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricsTab({ dashboard }: { dashboard: Dashboard }) {
  const avgRating = dashboard.metrics.avg_rating ?? 0;
  const feedbackCount = dashboard.metrics.feedback_count ?? 0;
  const repeatCount = dashboard.metrics.repeat_intent_count ?? 0;
  const repeatPct = feedbackCount > 0 ? Math.round((repeatCount / feedbackCount) * 100) : 0;

  const rows = [
    ["Matches", dashboard.metrics.matches, "Convites que chegaram à compatibilidade"],
    ["Chamadas iniciadas", dashboard.metrics.calls_started, "Sessões em que a sala foi aberta"],
    ["Sessões concluídas", dashboard.metrics.sessions_completed, "Foco concluído por você"],
    ["Buddies na rede", dashboard.metrics.buddy_count, "Parceiros recorrentes adicionados"],
    ["Satisfação média", feedbackCount > 0 ? `${avgRating} ★` : "—", `${feedbackCount} avaliações pós-sessão`],
    ["Intenção de repetição", feedbackCount > 0 ? `${repeatPct}%` : "—", "Querem estudar de novo juntos"]
  ];

  const completion = dashboard.metrics.calls_started
    ? Math.round((dashboard.metrics.sessions_completed / dashboard.metrics.calls_started) * 100)
    : 0;

  // Validation goal: 100 real sessions
  const goalSessions = 100;
  const validationProgress = Math.min(Math.round((dashboard.metrics.sessions_completed / goalSessions) * 100), 100);

  return (
    <div className="tab-content">
      <section className="page-intro">
        <div>
          <p className="eyebrow">SUA JORNADA</p>
          <h2>Estudo real, não tempo de tela.</h2>
          <p>Acompanhe o que realmente importa: presença, conclusão, satisfação e recorrência.</p>
        </div>
      </section>

      <section className="metric-grid">
        {rows.map(([label, value, copy]) => (
          <article key={String(label)} className="metric-card panel">
            <p>{label}</p>
            <strong>{value}</strong>
            <span>{copy}</span>
          </article>
        ))}
      </section>

      <section className="insight-panel panel">
        <div>
          <div className="metric-ring" style={{ "--progress": `${completion}%` } as React.CSSProperties}>
            <span>{completion}%</span>
          </div>
          <div>
            <p className="eyebrow">CONCLUSÃO DE SESSÕES</p>
            <h3>O progresso se mede pelo que você termina.</h3>
            <p>
              Quando suas chamadas viram sessões concluídas e avaliadas positivamente, confirmamos a hipótese central do produto:
              estudar com outra pessoa torna o estudo mais consistente e proveitoso.
            </p>
          </div>
        </div>

        <div className="validation-funnel-bar">
          <div className="funnel-header">
            <span>Meta da Fase 0: 100 sessões reais de validação</span>
            <strong>{dashboard.metrics.sessions_completed} / {goalSessions} concluídas ({validationProgress}%)</strong>
          </div>
          <div className="funnel-progress-track">
            <div className="funnel-progress-fill" style={{ width: `${Math.max(validationProgress, 4)}%` }} />
          </div>
        </div>

        <div className="safety-recap">
          <ShieldCheck aria-hidden="true" />
          <span>Você pode sair de uma sala, denunciar ou bloquear a qualquer momento. Não compartilhamos contatos externos entre participantes.</span>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <section className="empty-state panel">
      <span className="empty-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </section>
  );
}

function SafetyModal({
  match,
  onClose,
  onDone,
  onError
}: {
  match: Match;
  onClose: () => void;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const [reason, setReason] = useState("inappropriate");
  const [block, setBlock] = useState(true);
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    try {
      await api("/api/safety", {
        method: "POST",
        body: JSON.stringify({ matchId: match.id, reason, block })
      });
      track({ eventName: "safety_flow_completed", metadata: { reason, block } });
      onDone();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível enviar seu relato.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="safety-title">
        <button className="icon-button close-button" type="button" aria-label="Fechar" onClick={onClose}><X aria-hidden="true" /></button>
        <span className="modal-icon"><ShieldCheck aria-hidden="true" /></span>
        <p className="eyebrow">SEGURANÇA EM PRIMEIRO LUGAR</p>
        <h2 id="safety-title">Relatar {match.partner}</h2>
        <p>Vamos encerrar esta conexão e encaminhar seu relato para revisão. Você não precisa explicar nada ao outro usuário.</p>
        <form onSubmit={submit}>
          <label>O que aconteceu?
            <select value={reason} onChange={(event) => setReason(event.target.value)}>
              <option value="inappropriate">Comportamento inadequado</option>
              <option value="harassment">Assédio ou pressão</option>
              <option value="unsafe">Situação insegura</option>
              <option value="other">Outro motivo</option>
            </select>
          </label>
          <label className="check-row">
            <input type="checkbox" checked={block} onChange={(event) => setBlock(event.target.checked)} />
            <span>Também bloquear esta pessoa para não receber novos matches.</span>
          </label>
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Voltar</button>
            <button type="submit" className="danger-button" disabled={sending}>
              <Flag aria-hidden="true" />{sending ? "Enviando" : "Enviar relato"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function FeedbackModal({
  sessionId,
  partnerName,
  onClose,
  onDone,
  onError
}: {
  sessionId: string;
  partnerName: string;
  onClose: () => void;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [productivityScore, setProductivityScore] = useState(5);
  const [comfortScore, setComfortScore] = useState(5);
  const [repeatIntent, setRepeatIntent] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api(`/api/session/${sessionId}/feedback`, {
        method: "POST",
        body: JSON.stringify({
          rating,
          productivityScore,
          comfortScore,
          repeatIntent,
          notes
        })
      });
      track({ eventName: "post_session_feedback_submitted", metadata: { rating, repeatIntent } });
      onDone();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível enviar sua avaliação.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
        <button className="icon-button close-button" type="button" aria-label="Fechar" onClick={onClose}><X aria-hidden="true" /></button>
        <span className="modal-icon"><Star aria-hidden="true" /></span>
        <p className="eyebrow">PESQUISA PÓS-SESSÃO</p>
        <h2 id="feedback-title">Como foi estudar com {partnerName}?</h2>
        <p>Sua avaliação é sigilosa e ajuda a refinar a compatibilidade dos próximos matches.</p>

        <form onSubmit={submit}>
          <div>
            <label>Avaliação geral da sessão</label>
            <div className="star-rating-row" role="radiogroup" aria-label="Avaliação geral de 1 a 5 estrelas">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                  aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                >
                  <Star aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <div className="scale-group">
            <label>Produtividade percebida</label>
            <div className="scale-buttons">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  className={`scale-btn ${productivityScore === score ? "selected" : ""}`}
                  onClick={() => setProductivityScore(score)}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="scale-hints">
              <span>1 = Disperso</span>
              <span>3 = Produtivo</span>
              <span>5 = Foco total</span>
            </div>
          </div>

          <div className="scale-group">
            <label>Conforto e sintonia</label>
            <div className="scale-buttons">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  className={`scale-btn ${comfortScore === score ? "selected" : ""}`}
                  onClick={() => setComfortScore(score)}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="scale-hints">
              <span>1 = Desconfortável</span>
              <span>3 = Confortável</span>
              <span>5 = Excelente sintonia</span>
            </div>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={repeatIntent}
              onChange={(event) => setRepeatIntent(event.target.checked)}
            />
            <span>Gostaria de estudar novamente com {partnerName}?</span>
          </label>

          <label>
            Comentários ou observações (opcional)
            <input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="O que funcionou bem ou poderia melhorar?"
              maxLength={400}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Mais tarde</button>
            <button type="submit" className="primary-button" disabled={submitting}>
              <ThumbsUp aria-hidden="true" />{submitting ? "Enviando" : "Enviar avaliação"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DirectInviteModal({
  buddy,
  defaultSubject,
  defaultTopic,
  onClose,
  onDone,
  onError
}: {
  buddy: Buddy;
  defaultSubject: string;
  defaultTopic: string;
  onClose: () => void;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const [slot, setSlot] = useState<string>("seg-19");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      await api("/api/buddies/invite", {
        method: "POST",
        body: JSON.stringify({
          buddyId: buddy.id,
          subject: form.get("subject"),
          topic: form.get("topic"),
          format: form.get("format"),
          camera: form.get("camera"),
          slot
        })
      });
      track({ eventName: "direct_buddy_invite_sent", metadata: { buddyId: buddy.id } });
      onDone();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível convidar este buddy.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="invite-title">
        <button className="icon-button close-button" type="button" aria-label="Fechar" onClick={onClose}><X aria-hidden="true" /></button>
        <span className="modal-icon"><Send aria-hidden="true" /></span>
        <p className="eyebrow">SESSÃO DIRETA</p>
        <h2 id="invite-title">Estudar com {buddy.display_name}</h2>
        <p>Defina o tema e o horário para enviar o convite direto para seu buddy.</p>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label>Matéria<input name="subject" required defaultValue={defaultSubject || "Matemática"} placeholder="Ex.: Matemática" /></label>
            <label>Tópico<input name="topic" required defaultValue={defaultTopic || "Funções"} placeholder="Ex.: Funções" /></label>
          </div>
          <div className="form-grid">
            <label>Formato
              <select name="format" defaultValue="questions">
                <option value="silent">Foco em silêncio</option>
                <option value="questions">Questões juntos</option>
                <option value="discussion">Discussão guiada</option>
                <option value="review">Revisão</option>
              </select>
            </label>
            <label>Câmera
              <select name="camera" defaultValue="optional">
                <option value="optional">Opcional</option>
                <option value="on">Ligada</option>
                <option value="off">Desligada</option>
              </select>
            </label>
          </div>

          <fieldset>
            <legend>Horário proposto</legend>
            <div className="slot-grid">
              {slots.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`slot ${slot === value ? "selected" : ""}`}
                  onClick={() => setSlot(value)}
                >
                  {slot === value && <Check aria-hidden="true" />}{label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="primary-button" disabled={submitting}>
              <Send aria-hidden="true" />{submitting ? "Enviando convite" : "Enviar convite direto"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
