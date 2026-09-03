"use client";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "exercise";
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
  xpReward: number;
}

interface Props {
  modules: Module[];
  onPlayLesson?: (lessonId: string) => void;
}

const TYPE_ICON = { video: "▶️", quiz: "🧠", exercise: "✏️" };

export function CourseModuleAccordion({ modules, onPlayLesson }: Props) {
  const [openModule, setOpenModule] = useState<string | null>(modules[0]?.id ?? null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {modules.map((mod) => {
        const isOpen = openModule === mod.id;
        const completedCount = mod.lessons.filter((l) => l.completed).length;
        const pct = mod.lessons.length > 0 ? Math.round((completedCount / mod.lessons.length) * 100) : 0;

        return (
          <div key={mod.id} className="module-accordion">
            <div
              className="module-header"
              onClick={() => setOpenModule(isOpen ? null : mod.id)}
            >
              <div className="module-icon">{mod.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-main)", marginBottom: 2 }}>
                  {mod.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {mod.lessons.length} aulas · {completedCount}/{mod.lessons.length} concluídas
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="badge-green" style={{ fontSize: 10 }}>+{mod.xpReward} XP</div>
                {pct > 0 && (
                  <div style={{
                    background: `conic-gradient(var(--gold) ${pct}%, rgba(255,255,255,0.07) 0%)`,
                    width: 28, height: 28, borderRadius: "50%",
                    display: "grid", placeItems: "center",
                    fontSize: 10, fontWeight: 700, color: "var(--gold)",
                  }}>
                    {pct}
                  </div>
                )}
                <span style={{
                  color: "var(--gold)",
                  fontSize: 18,
                  transition: "transform 0.3s ease",
                  display: "inline-block",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}>⌄</span>
              </div>
            </div>

            {isOpen && (
              <div className="module-lessons">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="lesson-row"
                    onClick={() => onPlayLesson?.(lesson.id)}
                  >
                    <div
                      className="lesson-status-dot"
                      style={{ background: lesson.completed ? "var(--green)" : "rgba(255,255,255,0.15)" }}
                    />
                    <span style={{ fontSize: 15 }}>{TYPE_ICON[lesson.type]}</span>
                    <span style={{
                      flex: 1,
                      color: lesson.completed ? "var(--text-muted)" : "var(--text-main)",
                      textDecoration: lesson.completed ? "line-through" : "none",
                      fontSize: 13.5,
                    }}>
                      {lesson.title}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-dim)", flexShrink: 0 }}>{lesson.duration}</span>
                    {lesson.completed && (
                      <span style={{ color: "var(--green)", fontSize: 14 }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
