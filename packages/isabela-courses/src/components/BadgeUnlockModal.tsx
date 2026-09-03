"use client";
import { useEffect, useRef } from "react";

interface Props {
  badge: string;
  title: string;
  description: string;
  xpReward: number;
  onClose: () => void;
}

export function BadgeUnlockModal({ badge, title, description, xpReward, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = ["#f5c842", "#c084fc", "#22d3ee", "#4ade80", "#fb923c"];
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < 50; i++) {
      const p = document.createElement("div");
      p.className = "confetti-particle";
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: 0;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay: ${Math.random() * 1.2}s;
        animation-duration: ${Math.random() * 1.5 + 2}s;
        opacity: 0.9;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      `;
      container.appendChild(p);
      particles.push(p);
    }

    return () => { particles.forEach((p) => p.remove()); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="badge-unlock-overlay" onClick={onClose}>
      <div ref={containerRef} style={{ position: "relative" }}>
        <div className="badge-unlock-card" onClick={(e) => e.stopPropagation()}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "var(--radius-xl)",
            background: "radial-gradient(ellipse at 50% 0%, rgba(245,200,66,0.12), transparent 60%)",
            pointerEvents: "none",
          }} />

          <span className="badge-icon-glow">{badge}</span>

          <div className="badge-gold" style={{ marginBottom: 12 }}>🏆 CONQUISTA DESBLOQUEADA</div>

          <h2 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>{title}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
            {description}
          </p>

          <div style={{
            background: "rgba(74, 222, 128, 0.1)",
            border: "1px solid rgba(74, 222, 128, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "12px 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <span style={{ color: "var(--green)", fontWeight: 800, fontSize: 18 }}>+{xpReward} XP</span>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>conquistados!</span>
          </div>

          <button className="btn-gold" style={{ width: "100%" }} onClick={onClose}>
            👑 Continuar Aprendendo
          </button>

          <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-dim)" }}>
            Fecha automaticamente em 5 segundos
          </div>
        </div>
      </div>
    </div>
  );
}
