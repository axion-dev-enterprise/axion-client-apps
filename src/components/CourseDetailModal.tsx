"use client";

import { Course, Lesson } from "@/lib/db";

type CourseDetailModalProps = {
  course: Course;
  onStartLesson: (lesson?: Lesson) => void;
  onClose: () => void;
};

export function CourseDetailModal({ course, onStartLesson, onClose }: CourseDetailModalProps) {
  const lessons = course.lessons || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840, padding: 0, overflow: "hidden" }}>
        {/* Header Hero Image Banner */}
        <div style={{ position: "relative", width: "100%", height: 240, overflow: "hidden", background: "#0a0b10" }}>
          <img src={course.thumbnail || "/isabela-portrait.jpg"} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #090a0f 0%, rgba(9,10,15,0.4) 60%, rgba(0,0,0,0) 100%)" }} />

          <button
            className="btn-outline"
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", padding: "6px 14px" }}
          >
            ✕ Fechar
          </button>

          <div style={{ position: "absolute", bottom: 20, left: 24, right: 24 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span className="badge-gold">{course.category || "VIP"}</span>
              <span className="badge-purple">{course.level || "Intermediário"}</span>
            </div>
            <h1 className="serif" style={{ fontSize: 28, color: "#fff", margin: 0, lineHeight: 1.2 }}>
              {course.title}
            </h1>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
          {/* Left Column: Description & Syllabus */}
          <div>
            <h3 className="serif" style={{ fontSize: 18, margin: "0 0 8px" }}>Visão Geral do Programa</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
              {course.description || "Treinamento intensivo de inglês projetado para maximizar sua autoridade em reuniões, negociações e situações de alta exigência internacional."}
            </p>

            <h3 className="serif" style={{ fontSize: 18, margin: "0 0 14px" }}>
              Grade Curricular ({lessons.length} {lessons.length === 1 ? "aula" : "aulas"})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lessons.length > 0 ? (
                lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    onClick={() => onStartLesson(lesson)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 14 }}>{idx + 1}.</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{lesson.title}</div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{lesson.description || "Clique para assistir esta aula em vídeo."}</div>
                      </div>
                    </div>
                    <span className="btn-gold" style={{ padding: "6px 12px", fontSize: 12 }}>▶️ Assistir</span>
                  </div>
                ))
              ) : (
                <div style={{ color: "var(--text-dim)", fontSize: 14, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                  Nenhuma aula cadastrada ainda neste curso.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Instructor & CTA Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass-panel" style={{ padding: 20, textAlign: "center" }}>
              <img src="/isabela-portrait.jpg" alt="Isabela" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", margin: "0 auto 10px", border: "2px solid var(--gold)" }} />
              <div style={{ fontWeight: 700, fontSize: 15 }}>Isabela</div>
              <div style={{ fontSize: 12, color: "var(--gold)", margin: "2px 0 8px" }}>Founder & Head Instructor</div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                Especialista em Business English e preparação ICAO com mais de 8 anos de experiência treinando C-Levels e pilotos.
              </p>
            </div>

            <button
              className="btn-gold btn-pulse-gold"
              style={{ width: "100%", padding: 14 }}
              onClick={() => onStartLesson(lessons[0])}
            >
              🚀 Iniciar Curso Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
