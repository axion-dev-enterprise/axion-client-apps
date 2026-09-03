"use client";
import { useState } from "react";
import { Lesson, Course } from "@/lib/db";
import { useLang } from "./LangContext";

type CoursePlayerProps = {
  course: Course;
  initialLesson?: Lesson;
  onClose: () => void;
};

const PRACTICE_PHRASES = [
  "We are fully committed to reaching a mutually beneficial agreement.",
  "Could you please elaborate on the key deliverables for Q3?",
  "Standard phraseology check: Roger, descending to Flight Level 240.",
  "Let me reframe our strategic posture regarding the overseas expansion.",
];

export function CoursePlayer({ course, initialLesson, onClose }: CoursePlayerProps) {
  const { t } = useLang();
  const lessons = course.lessons || [];
  const [currentLesson, setCurrentLesson] = useState<Lesson>(initialLesson || lessons[0] || {
    id: "demo",
    course_id: course.id,
    title: "Aula de Introdução",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "15 min",
  });

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "shadowing">("overview");
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter((item) => item !== id));
    } else {
      setCompletedIds([...completedIds, id]);
    }
  };

  const isCompleted = completedIds.includes(currentLesson.id);

  const handleToggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setTimeout(() => {
        setRecording(false);
        setRecordedAudio("demo_audio_recorded");
      }, 3000);
    } else {
      setRecording(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ maxWidth: 1100, padding: 0, overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-gold" style={{ marginRight: 10 }}>{course.category || "VIP Course"}</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{course.title}</span>
          </div>
          <button className="btn-outline" onClick={onClose} style={{ padding: "6px 14px" }}>
            ✕ Fechar Player
          </button>
        </div>

        {/* Player Layout (Grid Video + Playlist) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", minHeight: 540 }}>
          {/* Main Video Viewport */}
          <div style={{ padding: 24, background: "#050608", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
              <video
                key={currentLesson.video_url}
                controls
                autoPlay
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }}
              >
                <source src={currentLesson.video_url} type="video/mp4" />
                Seu navegador não suporta a execução deste vídeo.
              </video>
            </div>

            {/* Lesson Info Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>{currentLesson.title}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
                  Instrutor: <strong style={{ color: "var(--gold)" }}>{course.instructor || "Isabela"}</strong> · Duração: {currentLesson.duration || "15 min"}
                </p>
              </div>
              <button
                className={isCompleted ? "badge-green" : "btn-gold"}
                onClick={() => toggleComplete(currentLesson.id)}
                style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13 }}
              >
                {isCompleted ? "✓ Concluída" : "Marcar como Concluída"}
              </button>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: "1px solid var(--border)", display: "flex", gap: 16, marginTop: 8 }}>
              <button
                onClick={() => setActiveTab("overview")}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === "overview" ? "2px solid var(--gold)" : "2px solid transparent",
                  color: activeTab === "overview" ? "var(--gold)" : "var(--text-muted)",
                  padding: "8px 4px",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Visão Geral da Aula
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === "notes" ? "2px solid var(--gold)" : "2px solid transparent",
                  color: activeTab === "notes" ? "var(--gold)" : "var(--text-muted)",
                  padding: "8px 4px",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Material de Apoio
              </button>
              <button
                onClick={() => setActiveTab("shadowing")}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === "shadowing" ? "2px solid var(--gold)" : "2px solid transparent",
                  color: activeTab === "shadowing" ? "var(--gold)" : "var(--text-muted)",
                  padding: "8px 4px",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                🎙️ Shadowing & Pronúncia
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
              {activeTab === "overview" && (
                <p>{currentLesson.description || course.description || "Nenhuma descrição específica cadastrada para esta aula."}</p>
              )}

              {activeTab === "notes" && (
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 8, border: "1px solid var(--border)" }}>
                  <h4 style={{ color: "var(--text-main)", marginTop: 0 }}>📌 Resumo Imperial</h4>
                  <ul style={{ paddingLeft: 20 }}>
                    <li>Pratique a repetição em voz alta (Shadowing technique).</li>
                    <li>Anote as expressões destacadas pelo instrutor.</li>
                    <li>Faça os exercícios práticos ao final do módulo.</li>
                  </ul>
                </div>
              )}

              {activeTab === "shadowing" && (
                <div style={{ background: "rgba(245, 192, 66, 0.05)", border: "1px solid var(--border-gold)", padding: 16, borderRadius: 10 }}>
                  <h4 style={{ color: "var(--gold)", marginTop: 0, marginBottom: 8 }}>🎙️ Laboratório de Pronúncia de Elite</h4>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                    Leia as frases abaixo em voz alta e grave sua voz para comparar com a entonação nativa:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {PRACTICE_PHRASES.map((phrase, idx) => (
                      <div key={idx} style={{ padding: 10, background: "rgba(0,0,0,0.4)", borderRadius: 6, fontSize: 13, border: "1px solid var(--border)", color: "#fff" }}>
                        🗣️ "{phrase}"
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }}>
                    <button className={recording ? "btn-danger" : "btn-gold"} onClick={handleToggleRecording} style={{ fontSize: 13, padding: "8px 16px" }}>
                      {recording ? "🔴 Gravando (3s)..." : "🎙️ Gravar Minha Pronúncia"}
                    </button>
                    {recordedAudio && (
                      <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 600 }}>
                        ✓ Áudio gravado com sucesso! Fluência estimada: 94%.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div style={{ borderLeft: "1px solid var(--border)", background: "rgba(10, 11, 16, 0.6)", padding: 20, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Conteúdo do Curso</h3>
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
                {completedIds.length} de {lessons.length} aulas concluídas
              </span>
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${lessons.length > 0 ? (completedIds.length / lessons.length) * 100 : 0}%`,
                    height: "100%",
                    background: "var(--gold)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {lessons.length > 0 ? (
                lessons.map((l, index) => {
                  const active = currentLesson.id === l.id;
                  const done = completedIds.includes(l.id);
                  return (
                    <div
                      key={l.id}
                      onClick={() => setCurrentLesson(l)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: active ? "rgba(245, 192, 66, 0.12)" : "rgba(255,255,255,0.02)",
                        border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                        cursor: "pointer",
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: done ? "var(--gold)" : "rgba(255,255,255,0.1)",
                          color: done ? "#000" : "var(--text-dim)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {done ? "✓" : index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "var(--gold)" : "var(--text-main)" }}>
                          {l.title}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                          ⏱️ {l.duration || "15 min"}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "var(--text-dim)", fontSize: 13, textAlign: "center", padding: 20 }}>
                  Nenhuma aula disponível para este curso ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
