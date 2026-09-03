"use client";

interface Props {
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  onLeaderboard: () => void;
}

export function GamificationBar({ level, xp, xpMax, streak, onLeaderboard }: Props) {
  const pct = Math.min(100, Math.round((xp / xpMax) * 100));

  return (
    <div
      style={{
        background: "rgba(8, 9, 16, 0.95)",
        borderBottom: "1px solid rgba(245, 200, 66, 0.12)",
        padding: "6px 32px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 13,
        flexWrap: "wrap",
      }}
    >
      {/* Level Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="level-badge">{level}</div>
        <div>
          <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: 0.5 }}>NÍVEL</div>
          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--gold)" }}>
            {level < 5 ? "Aprendiz" : level < 10 ? "Praticante" : level < 20 ? "Fluente" : level < 35 ? "Expert" : "Imperial"}
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div style={{ flex: 1, minWidth: 120, maxWidth: 260 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, color: "var(--text-dim)" }}>
          <span>⚡ {xp.toLocaleString("pt-BR")} XP</span>
          <span>{xpMax.toLocaleString("pt-BR")} XP</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Streak */}
      <div className="streak-fire">
        🔥 {streak} dias
      </div>

      {/* Leaderboard button */}
      <button
        onClick={onLeaderboard}
        style={{
          background: "rgba(159, 122, 234, 0.1)",
          border: "1px solid rgba(159, 122, 234, 0.3)",
          color: "var(--purple-bright)",
          padding: "4px 12px",
          borderRadius: "var(--radius-full)",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(159, 122, 234, 0.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(159, 122, 234, 0.1)")}
      >
        🏆 Ranking
      </button>

      <div style={{ color: "var(--text-dim)", fontSize: 11, marginLeft: "auto" }}>
        Próximo nível: <span style={{ color: "var(--gold)" }}>{xpMax - xp} XP</span>
      </div>
    </div>
  );
}
