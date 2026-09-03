"use client";
import { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: { text: string; points: number }[];
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Como você se sente ao liderar uma reunião de negócios inteiramente em inglês?",
    options: [
      { text: "Travo completamente e preciso preparar cada frase com antecedência.", points: 1 },
      { text: "Consigo falar sobre minha área, mas hesito em debates e negociações rápidas.", points: 2 },
      { text: "Tenho boa fluência, mas sinto que falta sofisticação de vocabulário executivo.", points: 3 },
    ],
  },
  {
    question: "Qual das frases melhor expressa uma proposta diplomática em uma negociação de alto nível?",
    id: 2,
    options: [
      { text: "We want a lower price or we leave.", points: 1 },
      { text: "We would like to ask if you can lower the price for us.", points: 2 },
      { text: "We would be open to exploring alternative terms provided we align on key deliverables.", points: 3 },
    ],
  },
  {
    question: "Qual é o seu principal objetivo de aprendizado no momento?",
    id: 3,
    options: [
      { text: "Destravar a fala básica e perder o medo de errar em público.", points: 1 },
      { text: "Aprovação em exames específicos (ICAO / entrevistas corporativas / Mestrado).", points: 3 },
      { text: "Refinar pronúncia (Accent Reduction) e liderar reuniões C-Level internacionais.", points: 3 },
    ],
  },
];

export function PlacementQuizModal({ onClose, onSelectPlan }: { onClose: () => void; onSelectPlan: (plan: string) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (points: number) => {
    const nextScore = score + points;
    setScore(nextScore);
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
    }
  };

  const getResult = () => {
    if (score <= 4) {
      return {
        level: "Nível Intermediário Inicial",
        recPlan: "Plano Ouro",
        course: "Grammar Empire & Fluency Basics",
        desc: "Você possui a base inicial, mas precisa destravar a trava emocional e consolidar estruturas essenciais.",
      };
    } else if (score <= 7) {
      return {
        level: "Nível Intermediário Avançado / Business Ready",
        recPlan: "Plano Diamante",
        course: "Executive Business English & Negotiations",
        desc: "Sua fluência é funcional, mas você precisa de vocabulário de alta diplomacia e simulações executivas reais.",
      };
    }
    return {
      level: "Nível Avançado / C-Level / ICAO Aviation",
      recPlan: "Plano Imperial",
      course: "Aviation English & High-Stakes Oratory",
      desc: "Você já é fluente, mas busca refinamento de intonação, oratória de liderança e mentoria VIP 1-on-1.",
    };
  };

  const res = getResult();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580, padding: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span className="badge-gold">👑 Quiz de Nivelamento Imperial</span>
          <button className="btn-outline" onClick={onClose} style={{ padding: "4px 12px", fontSize: 12 }}>✕ Cancelar</button>
        </div>

        {!completed ? (
          <div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>
              Pergunta {currentIdx + 1} de {QUESTIONS.length}
            </div>

            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, marginBottom: 24 }}>
              <div style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%`, height: "100%", background: "var(--gold)", transition: "width 0.3s ease" }} />
            </div>

            <h2 className="serif" style={{ fontSize: 22, margin: "0 0 24px", lineHeight: 1.3 }}>
              {QUESTIONS[currentIdx].question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {QUESTIONS[currentIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  className="btn-outline"
                  onClick={() => handleAnswer(opt.points)}
                  style={{ textTransform: "none", textAlign: "left", padding: "14px 18px", fontSize: 14, lineHeight: 1.4, borderRadius: 10 }}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎯</div>
            <span className="badge-purple">{res.level}</span>
            <h2 className="serif gold-text" style={{ fontSize: 26, margin: "14px 0 8px" }}>
              Diagnóstico de Fluência Concluído
            </h2>

            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5, margin: "0 0 24px" }}>
              {res.desc}
            </p>

            <div style={{ background: "rgba(245, 192, 66, 0.08)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "left" }}>
              <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700 }}>RECOMENDAÇÃO IMPERIAL</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", marginTop: 4 }}>Plano Recomendado: {res.recPlan}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Curso Indicado: {res.course}</div>
            </div>

            <button
              className="btn-gold btn-pulse-gold"
              style={{ width: "100%" }}
              onClick={() => {
                onClose();
                onSelectPlan(res.recPlan);
              }}
            >
              Matricular-se no {res.recPlan}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
