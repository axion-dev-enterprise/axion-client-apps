"use client";

const LEADERS = [
  { name: "Comandante Eduardo Silva", role: "Aviação ICAO", xp: 12450, badge: "👑", avatar: "ES" },
  { name: "Juliana Vasconcelos", role: "VP Fintech", xp: 10820, badge: "🥈", avatar: "JV" },
  { name: "Marcelo Fonseca", role: "McKinsey Partner", xp: 9970, badge: "🥉", avatar: "MF" },
  { name: "Ana Claudia Torres", role: "CEO Startupland", xp: 8310, badge: "⭐", avatar: "AT" },
  { name: "Rafael Menezes", role: "Head Engineering", xp: 7880, badge: "⭐", avatar: "RM" },
  { name: "Beatriz Santos", role: "Business Analyst", xp: 6540, badge: "⭐", avatar: "BS" },
  { name: "Diego Almeida", role: "Senior Consultant", xp: 5990, badge: "⭐", avatar: "DA" },
  { name: "Você", role: "Progredindo...", xp: 2400, badge: "🌱", avatar: "EU" },
];

const RANK_CLASS = ["lb-rank-1", "lb-rank-2", "lb-rank-3"];

interface Props { onClose: () => void; }

export function LeaderboardModal({ onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560, padding: 0, overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{
          padding: "28px 28px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, rgba(245,200,66,0.06), rgba(159,122,234,0.04))",
        }}>
          <div>
            <div className="badge-gold" style={{ marginBottom: 8 }}>🏆 RANKING SEMANAL</div>
            <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>Top Alunos VIP</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>
              Baseado em XP conquistado esta semana
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ fontSize: 20 }}>✕</button>
        </div>

        {/* List */}
        <div style={{ padding: "16px 16px 24px" }}>
          {LEADERS.map((l, i) => {
            const isMe = l.name === "Você";
            return (
              <div
                key={i}
                className="lb-row"
                style={isMe ? {
                  background: "rgba(245,200,66,0.05)",
                  border: "1px solid rgba(245,200,66,0.2)",
                  borderRadius: "var(--radius-md)",
                  margin: "8px 0",
                } : {}}
              >
                <div className={`lb-rank ${RANK_CLASS[i] ?? "lb-rank-n"}`}>
                  {i < 3 ? ["🥇","🥈","🥉"][i] : i + 1}
                </div>
                <div
                  style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: isMe
                      ? "linear-gradient(135deg, #f5c842, #c084fc)"
                      : `hsl(${(i * 47 + 200) % 360}, 50%, 40%)`,
                    display: "grid", placeItems: "center",
                    fontWeight: 800, fontSize: 13, color: "#fff", flexShrink: 0,
                  }}
                >
                  {l.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: isMe ? "var(--gold)" : "var(--text-main)" }}>
                    {l.name} {isMe && "🌟"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{l.role}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: isMe ? "var(--gold)" : "var(--text-main)" }}>
                    {l.xp.toLocaleString("pt-BR")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>XP</div>
                </div>
                <div style={{ fontSize: 18 }}>{l.badge}</div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 28px",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-dim)",
        }}>
          Ranking atualizado a cada 24h · Ganhe XP assistindo aulas e completando módulos
        </div>
      </div>
    </div>
  );
}
