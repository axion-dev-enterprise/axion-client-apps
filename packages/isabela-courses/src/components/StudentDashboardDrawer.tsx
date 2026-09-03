"use client";

import { Course } from "@/lib/db";

type StudentDashboardDrawerProps = {
  studentName: string;
  studentEmail: string;
  courses: Course[];
  onOpenCertificate: () => void;
  onOpenCourse: (course: Course) => void;
  onClose: () => void;
};

export function StudentDashboardDrawer({
  studentName,
  studentEmail,
  courses,
  onOpenCertificate,
  onOpenCourse,
  onClose,
}: StudentDashboardDrawerProps) {
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: "flex-end" }}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          height: "100vh",
          borderRadius: 0,
          borderLeft: "1px solid var(--border-gold)",
          padding: 32,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
          <div>
            <span className="badge-gold">👑 PAINEL DO ALUNO VIP</span>
            <h2 className="serif" style={{ fontSize: 22, margin: "6px 0 0", color: "#fff" }}>
              {studentName || "Executivo VIP"}
            </h2>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{studentEmail || "aluno@empresa.com"}</div>
          </div>
          <button className="btn-outline" onClick={onClose} style={{ padding: "6px 12px", fontSize: 12 }}>
            ✕ Fechar
          </button>
        </div>

        {/* Student Stats Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 10, border: "1px solid var(--border)", textAlign: "center" }}>
            <div className="gold-text serif" style={{ fontSize: 28, fontWeight: 800 }}>Plano Imperial</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Plano de Horas Ativo</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 10, border: "1px solid var(--border)", textAlign: "center" }}>
            <div className="gold-text serif" style={{ fontSize: 28, fontWeight: 800 }}>🔥 14 Dias</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Ofensiva de Estudos</div>
          </div>
        </div>

        {/* Certificate Section Action */}
        <div style={{ background: "rgba(245, 192, 66, 0.08)", border: "1px solid var(--border-gold)", padding: 20, borderRadius: 12 }}>
          <h3 className="serif gold-text" style={{ fontSize: 18, margin: "0 0 6px" }}>Certificado de Fluência Imperial</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.4 }}>
            Você já completou todos os requisitos práticos do programa! Gere e imprima seu certificado assinado.
          </p>
          <button className="btn-gold" style={{ width: "100%", fontSize: 13 }} onClick={onOpenCertificate}>
            🎓 Visualizar & Imprimir Certificado
          </button>
        </div>

        {/* Enrolled Courses Progress */}
        <div>
          <h3 className="serif" style={{ fontSize: 18, margin: "0 0 14px" }}>Seus Cursos Matriculados</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {courses.slice(0, 3).map((c, idx) => (
              <div
                key={c.id}
                style={{
                  padding: 16,
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => onOpenCourse(c)}
              >
                <img src={c.thumbnail} alt={c.title} style={{ width: 60, height: 48, borderRadius: 6, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                    Progresso: {idx === 0 ? "75%" : "30%"}
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: idx === 0 ? "75%" : "30%", height: "100%", background: "var(--gold)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
