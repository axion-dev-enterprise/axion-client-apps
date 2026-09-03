"use client";

import { useEffect, useRef, useState } from "react";
import { LangSelector } from "@/components/LangSelector";
import { CoursePlayer } from "@/components/CoursePlayer";
import { CourseDetailModal } from "@/components/CourseDetailModal";
import { CertificateModal } from "@/components/CertificateModal";
import { PlacementQuizModal } from "@/components/PlacementQuizModal";
import { StudentDashboardDrawer } from "@/components/StudentDashboardDrawer";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { CountupNumber } from "@/components/CountupNumber";
import { ProgressRing } from "@/components/ProgressRing";
import { GamificationBar } from "@/components/GamificationBar";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { BadgeUnlockModal } from "@/components/BadgeUnlockModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CourseModuleAccordion } from "@/components/CourseModuleAccordion";
import { useLang } from "@/components/LangContext";

/* ========================= MOCK DATA ========================= */

const COURSES = [
  {
    id: "c1",
    title: "Business English Mastery",
    description: "Domine negociações, apresentações e e-mails executivos no mais alto nível corporativo.",
    category: "Negócios & Aviação",
    level: "Avançado",
    instructor: "Isabela",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    progress: 68,
    xpReward: 1200,
    totalHours: "12h",
    lessons: [{ id: "l1", title: "Aula 1 — Reuniões de Conselho", moduleId: "m1", description: "" }],
    modules: [
      {
        id: "m1", title: "Módulo 1 — C-Suite Communication", icon: "💼", xpReward: 300,
        lessons: [
          { id: "l1", title: "Board Meetings & Executive Briefings", duration: "45min", type: "video" as const, completed: true },
          { id: "l2", title: "Negotiation Tactics & BATNA", duration: "1h", type: "video" as const, completed: true },
          { id: "l3", title: "Assertive Communication Quiz", duration: "20min", type: "quiz" as const, completed: false },
        ],
      },
      {
        id: "m2", title: "Módulo 2 — Email & Writing", icon: "✉️", xpReward: 250,
        lessons: [
          { id: "l4", title: "Corporate Email Masterclass", duration: "50min", type: "video" as const, completed: true },
          { id: "l5", title: "Executive Report Writing", duration: "1h15min", type: "video" as const, completed: false },
          { id: "l6", title: "Writing Exercise", duration: "30min", type: "exercise" as const, completed: false },
        ],
      },
    ],
  },
  {
    id: "c2",
    title: "ICAO Aviation English",
    description: "Phraseology padrão ICAO nível 4/5 para pilotos, controladores e profissionais da aviação.",
    category: "Negócios & Aviação",
    level: "Especialista",
    instructor: "Isabela",
    thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
    progress: 40,
    xpReward: 1800,
    totalHours: "18h",
    lessons: [{ id: "la1", title: "ATC Radiotelephony", moduleId: "ma1", description: "" }],
    modules: [
      {
        id: "ma1", title: "Módulo 1 — ATC Communication", icon: "✈️", xpReward: 400,
        lessons: [
          { id: "la1", title: "Standard ATC Phraseology", duration: "55min", type: "video" as const, completed: true },
          { id: "la2", title: "Emergency Procedures — Mayday & Pan-Pan", duration: "1h", type: "video" as const, completed: true },
          { id: "la3", title: "Radiotelephony Simulation", duration: "45min", type: "exercise" as const, completed: false },
        ],
      },
      {
        id: "ma2", title: "Módulo 2 — ICAO Level 4/5 Test Prep", icon: "📋", xpReward: 500,
        lessons: [
          { id: "la4", title: "Mock ICAO Oral Exam", duration: "1h30min", type: "quiz" as const, completed: false },
          { id: "la5", title: "Pronunciation & Intonation", duration: "1h", type: "video" as const, completed: false },
        ],
      },
    ],
  },
  {
    id: "c3",
    title: "Conversação VIP Global",
    description: "Fluência natural para contextos sociais de alto padrão — eventos internacionais, networking e viagens.",
    category: "Conversação VIP",
    level: "Intermediário",
    instructor: "Isabela",
    thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
    progress: 85,
    xpReward: 900,
    totalHours: "8h",
    lessons: [{ id: "lb1", title: "Small Talk Masterclass", moduleId: "mb1", description: "" }],
    modules: [
      {
        id: "mb1", title: "Módulo 1 — Social & Networking", icon: "🤝", xpReward: 200,
        lessons: [
          { id: "lb1", title: "Small Talk & Icebreakers", duration: "40min", type: "video" as const, completed: true },
          { id: "lb2", title: "Networking Events Vocabulary", duration: "35min", type: "video" as const, completed: true },
          { id: "lb3", title: "Role-play: International Dinner", duration: "30min", type: "exercise" as const, completed: true },
        ],
      },
      {
        id: "mb2", title: "Módulo 2 — Travel & Luxury", icon: "🌍", xpReward: 180,
        lessons: [
          { id: "lb4", title: "Airport & Hotel Conversations", duration: "30min", type: "video" as const, completed: true },
          { id: "lb5", title: "Restaurant & Fine Dining", duration: "25min", type: "video" as const, completed: false },
        ],
      },
    ],
  },
  {
    id: "c4",
    title: "Gramática & Fluência Acelerada",
    description: "Sistema proprietário para eliminar erros gramaticais e destravar a fluência em 90 dias.",
    category: "Gramática & Fluência",
    level: "Iniciante",
    instructor: "Isabela",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
    progress: 20,
    xpReward: 750,
    totalHours: "10h",
    lessons: [{ id: "lc1", title: "Tempos Verbais Definitivos", moduleId: "mc1", description: "" }],
    modules: [
      {
        id: "mc1", title: "Módulo 1 — Verb Tenses Mastery", icon: "📚", xpReward: 200,
        lessons: [
          { id: "lc1", title: "Present Perfect vs. Simple Past", duration: "50min", type: "video" as const, completed: true },
          { id: "lc2", title: "Conditionals 1st, 2nd & 3rd", duration: "55min", type: "video" as const, completed: false },
          { id: "lc3", title: "Grammar Challenge", duration: "25min", type: "quiz" as const, completed: false },
        ],
      },
    ],
  },
  {
    id: "c5",
    title: "Shadowing & Accent Tuning",
    description: "Técnica de shadowing fonético para soar como nativo americano ou britânico em 60 dias.",
    category: "Conversação VIP",
    level: "Intermediário",
    instructor: "Isabela",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop",
    progress: 55,
    xpReward: 1000,
    totalHours: "9h",
    lessons: [{ id: "ld1", title: "Técnica de Shadowing", moduleId: "md1", description: "" }],
    modules: [
      {
        id: "md1", title: "Módulo 1 — Phonetics & Rhythm", icon: "🎙️", xpReward: 280,
        lessons: [
          { id: "ld1", title: "American vs. British Sounds", duration: "45min", type: "video" as const, completed: true },
          { id: "ld2", title: "Shadowing Ted Talks — CEOs & Leaders", duration: "1h", type: "exercise" as const, completed: true },
          { id: "ld3", title: "Intonation Patterns Quiz", duration: "20min", type: "quiz" as const, completed: false },
        ],
      },
    ],
  },
  {
    id: "c6",
    title: "English for Tech Leaders",
    description: "Vocabulário técnico e liderança para CTOs, engenheiros sênior e product managers em empresas globais.",
    category: "Negócios & Aviação",
    level: "Avançado",
    instructor: "Isabela",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    progress: 10,
    xpReward: 1500,
    totalHours: "14h",
    lessons: [{ id: "le1", title: "Tech Standup & Sprint Reviews", moduleId: "me1", description: "" }],
    modules: [
      {
        id: "me1", title: "Módulo 1 — Agile & Engineering", icon: "⚙️", xpReward: 350,
        lessons: [
          { id: "le1", title: "Sprint Reviews & Retrospectives", duration: "50min", type: "video" as const, completed: true },
          { id: "le2", title: "System Design Communication", duration: "1h10min", type: "video" as const, completed: false },
        ],
      },
    ],
  },
];

const PLANS = [
  {
    id: "ouro",
    name: "Plano Ouro",
    hours: "50 horas",
    dur: "3 meses",
    price: "R$ 497",
    priceMonth: "R$ 497/mês",
    badge: "🥇",
    color: "#c4910f",
    popular: false,
    desc: "Ideal para dar um salto acelerado na fluência, destravar reuniões e apresentações do dia a dia.",
    perks: [
      "Aulas individuais flexíveis (45min a 2h)",
      "Acesso ilimitado à plataforma de cursos 4K HD",
      "Material didático executivo incluso",
      "Suporte via WhatsApp direto com Isabela",
      "Certificado Internacional de Conclusão",
    ],
  },
  {
    id: "diamante",
    name: "Plano Diamante",
    hours: "70 horas",
    dur: "6 meses",
    price: "R$ 697",
    priceMonth: "R$ 697/mês",
    badge: "💎",
    color: "#9f7aea",
    popular: true,
    desc: "Perfeito para imersão profunda e domínio de áreas altamente técnicas como Business, Aviação ICAO e Negociações.",
    perks: [
      "Tudo do Plano Ouro",
      "Simulações reais de exames ICAO / Entrevistas",
      "Correção personalizada de escrita & e-mails",
      "Certificado Internacional Premium",
      "Acesso a cursos exclusivos Diamante",
    ],
  },
  {
    id: "imperial",
    name: "Plano Imperial",
    hours: "100 horas",
    dur: "12 meses",
    price: "R$ 997",
    priceMonth: "R$ 997/mês",
    badge: "👑",
    color: "#22d3ee",
    popular: false,
    desc: "A jornada definitiva para transformar aprendizes em verdadeiros mestres da oratória e liderança global.",
    perks: [
      "Mentoria VIP continuada 1-on-1",
      "Prioridade máxima na agenda da instrutora",
      "Acesso vitalício a todos os novos cursos",
      "Passaporte de imersão presencial / evento anual",
      "Badge Imperial exclusivo na plataforma",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Comandante Eduardo Silva",
    role: "Piloto de Linha Aérea Internacional (LATAM)",
    avatar: "ES",
    avatarColor: "hsl(210,60%,40%)",
    stars: 5,
    badge: "✈️",
    text: "Passei na avaliação ICAO com nível 5 após o treinamento intensivo com a Isabela. A metodologia de radiotelefonia e emergência é cirúrgica e precisa!",
    xp: 12450,
  },
  {
    name: "Juliana Vasconcelos",
    role: "VP de Operações — Fintech Multinacional",
    avatar: "JV",
    avatarColor: "hsl(270,60%,45%)",
    stars: 5,
    badge: "💼",
    text: "Tinha pavor de liderar reuniões de conselho com diretores americanos. Em 3 meses com o Plano Diamante, conquistei minha promoção global!",
    xp: 10820,
  },
  {
    name: "Marcelo Fonseca",
    role: "Managing Director & Partner (McKinsey)",
    avatar: "MF",
    avatarColor: "hsl(150,55%,35%)",
    stars: 5,
    badge: "🏆",
    text: "O nível dos cursos e o acompanhamento 1-on-1 são impecáveis. Isabela entende exatamente a linguagem do mundo corporativo de alto nível.",
    xp: 9970,
  },
];

const FAQS = [
  {
    q: "Como funcionam os Planos de Horas VIP?",
    a: "Cada plano concede um pacote flexível de horas (50h, 70h ou 100h) que você agenda diretamente com a Isabela. As sessões podem durar 45min, 1h, 1h30 ou 2h, ajustando-se à sua rotina executiva.",
  },
  {
    q: "Como funciona a garantia de satisfação de 7 dias?",
    a: "Você tem 7 dias inteiros para explorar a plataforma e assistir às aulas. Caso sinta que a mentoria não atendeu às suas expectativas, reembolsamos 100% do seu investimento sem burocracia.",
  },
  {
    q: "Recebo certificado de conclusão reconhecido?",
    a: "Sim! Ao concluir os módulos de qualquer curso, você gera o Certificado Oficial de Fluência Imperial assinado pela Isabela diretamente na plataforma, com QR code de validação.",
  },
  {
    q: "Posso parcelar o pagamento?",
    a: "Sim! Via Stripe aceitamos cartões de crédito internacionais em até 12x. Via MercadoPago aceitamos PIX (à vista com 5% de desconto), boleto bancário e cartões nacionais em até 12x.",
  },
  {
    q: "Como é o sistema de XP e gamificação?",
    a: "Cada aula concluída, quiz respondido e exercício entregue concede XP. Você sobe de nível, desbloqueia badges exclusivos e compete no leaderboard semanal com outros alunos VIP.",
  },
];

const BADGES_DATA = [
  { badge: "🚀", title: "Primeiro Voo", description: "Você completou sua primeira aula da plataforma!", xpReward: 100 },
  { badge: "🎯", title: "Especialista ICAO", description: "Módulo completo de Aviação ICAO concluído com excelência.", xpReward: 500 },
  { badge: "💼", title: "C-Suite Ready", description: "Domínio comprovado do Business English corporativo.", xpReward: 400 },
];

/* ========================= INTERSECTION OBSERVER HOOK ========================= */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    el.querySelectorAll(".fade-in-up, .slide-in-left, .slide-in-right, .zoom-in").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ========================= MAIN PAGE ========================= */
export default function Home() {
  const { t } = useLang();
  const pageRef = useReveal();

  const [selectedCourse, setSelectedCourse] = useState<(typeof COURSES)[0] | null>(null);
  const [detailCourse, setDetailCourse] = useState<(typeof COURSES)[0] | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ id: string; title: string; description: string; moduleId: string } | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Modals
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [showStudentDrawer, setShowStudentDrawer] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<(typeof PLANS)[0] | null>(null);
  const [badgeModal, setBadgeModal] = useState<(typeof BADGES_DATA)[0] | null>(null);
  const [expandedCourseModules, setExpandedCourseModules] = useState<string | null>(null);

  const [studentName, setStudentName] = useState("Rodrigo Mendonça");
  const [studentEmail, setStudentEmail] = useState("rodrigo.m@empresa.com");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Gamification state
  const [userXp] = useState(2400);
  const [userLevel] = useState(7);
  const [userStreak] = useState(12);
  const xpMax = 3000;

  // Typing animation
  const PHRASES = [
    "Arma Estratégica.",
    "Vantagem Competitiva.",
    "Passaporte Global.",
    "Motor de Carreira.",
  ];
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const loop = setInterval(() => {
      const phrase = PHRASES[phraseIndex];
      if (!deleting) {
        setTypingText(phrase.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === phrase.length) { deleting = true; setTimeout(() => {}, 1800); }
      } else {
        setTypingText(phrase.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % PHRASES.length; }
      }
    }, deleting ? 60 : 90);
    return () => clearInterval(loop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = ["Todas", "Negócios & Aviação", "Conversação VIP", "Gramática & Fluência"];
  const filteredCourses = COURSES.filter((c) => {
    const matchesCat = selectedCategory === "Todas" || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openPlayer = (course: typeof COURSES[0], lesson?: typeof selectedLesson) => {
    setSelectedCourse(course);
    setSelectedLesson(lesson ?? course.lessons?.[0]);
  };

  return (
    <main style={{ minHeight: "100vh" }} ref={pageRef}>

      {/* ── GAMIFICATION BAR ── */}
      <GamificationBar
        level={userLevel}
        xp={userXp}
        xpMax={xpMax}
        streak={userStreak}
        onLeaderboard={() => setShowLeaderboard(true)}
      />

      {/* ── HEADER ── */}
      <header className={`app-header ${scrolled ? "scrolled" : ""}`}>
        <div className="brand-title">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 9H22L16 13.5L18 21L12 17L6 21L8 13.5L2 9H9L12 2Z" fill="#060710" />
            </svg>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 17, color: "var(--gold)", lineHeight: 1.1 }}>The English Empire</div>
            <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: 1 }}>IMPERIAL ACADEMY v3.0</div>
          </div>
        </div>

        <nav className="nav-group">
          <a href="#cursos" className="nav-link">Cursos</a>
          <a href="#metodologia" className="nav-link">Metodologia</a>
          <a href="#depoimentos" className="nav-link">Alunos</a>
          <a href="#planos" className="nav-link">Planos VIP</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <LangSelector />
          <button className="btn-outline" onClick={() => setShowStudentDrawer(true)} style={{ fontSize: 13, padding: "8px 16px" }}>
            👤 Minha Área
          </button>
          <a href="/admin" className="btn-gold" style={{ padding: "8px 16px", fontSize: 13 }}>
            ⚙️ Admin
          </a>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="hero-section">
        <ParticleCanvas />
        <div className="hero-content">
          <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(245, 200, 66, 0.08)", border: "1px solid var(--border-gold)", padding: "7px 20px", borderRadius: "var(--radius-full)", marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>⭐ 4.98/5 por +450 Executivos & Pilotos</span>
          </div>

          <h1 className="serif fade-in-up delay-100" style={{ fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.1, margin: "0 0 16px", fontWeight: 800 }}>
            Transforme Seu Inglês em uma{" "}
            <span className="gold-text" style={{ fontStyle: "italic" }}>
              {typingText}
              <span className="typing-cursor" />
            </span>
          </h1>

          <p className="fade-in-up delay-200" style={{ color: "var(--text-muted)", fontSize: "clamp(15px, 2vw, 19px)", maxWidth: 800, margin: "0 auto 40px", lineHeight: 1.65 }}>
            Metodologia imersiva de alta performance para Executivos C-Level, Pilotos de Aviação Comercial e Líderes Globais que não aceitam travar em momentos decisivos.
          </p>

          <div className="fade-in-up delay-300" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#cursos" className="btn-gold btn-pulse-gold" style={{ padding: "16px 36px", fontSize: 17 }}>
              🚀 Começar Agora — Grátis
            </a>
            <button className="btn-outline" onClick={() => setShowQuiz(true)} style={{ padding: "16px 30px", fontSize: 15 }}>
              🎯 Teste de Nível Gratuito
            </button>
          </div>

          {/* Instructor badge */}
          <div className="glass-gold float-element fade-in-up delay-400" style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 22px", marginTop: 44, border: "1px solid var(--border-gold)" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #f5c842, #9f7aea)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 18, color: "#060710" }}>
              I
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Isabela — Head Instructor</div>
              <div style={{ fontSize: 12, color: "var(--gold)" }}>Mentora VIP · Business & ICAO Aviation</div>
            </div>
            <div className="badge-green" style={{ marginLeft: 8 }}>🔴 Online</div>
          </div>

          {/* Metrics */}
          <div className="fade-in-up delay-500" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, maxWidth: 840, margin: "50px auto 0" }}>
            {[
              { end: 450, suffix: "+", label: "Executivos & Pilotos Formados", icon: "👑" },
              { end: 100, suffix: "%", label: "Taxa de Aprovação ICAO / Business", icon: "🎯" },
              { end: 6, suffix: " cursos", label: "Programas em Catálogo 4K HD", icon: "📚" },
              { end: 4.98, suffix: "/5", decimals: 2, label: "Avaliação Média dos Alunos", icon: "⭐" },
            ].map((m, i) => (
              <div key={i} className="glass-panel zoom-in" style={{ padding: "22px 20px", textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
                <div className="serif gold-text" style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
                  <CountupNumber end={m.end} suffix={m.suffix} decimals={m.decimals} />
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6, lineHeight: 1.4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ── */}
      <section id="metodologia" style={{ padding: "80px 24px", background: "rgba(10,11,20,0.5)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="badge-gold">POR QUE O IMPÉRIO É DIFERENTE?</span>
            <h2 className="serif" style={{ fontSize: "clamp(28px, 4vw, 38px)", margin: "12px 0 14px" }}>A Tríade da Fluência Inabalável</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
              Esqueça métodos tradicionais. Nossa mentoria foca em autoridade, precisão e eliminação total da trava emocional.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { icon: "🎯", title: "High-Stakes Business & Aviation", badge: "badge-gold", desc: "Simulações reais de negociações, reuniões com conselho multinacional e Phraseology ICAO para voos internacionais." },
              { icon: "🎙️", title: "Shadowing & Accent Tuning", badge: "badge-purple", desc: "Reprodução fonética de nativos para ajustar intonação, rhythm e soar elegante e confiante em qualquer auditório." },
              { icon: "👑", title: "Acompanhamento 1-on-1", badge: "badge-cyan", desc: "Feedback individualizado com correção de pronúncia, revisão de e-mails e suporte contínuo via WhatsApp." },
            ].map((item, i) => (
              <div key={i} className={`glass-panel fade-in-up delay-${(i + 1) * 100}`} style={{ padding: 32 }}>
                <div style={{ fontSize: 38, marginBottom: 16 }}>{item.icon}</div>
                <span className={item.badge} style={{ marginBottom: 10, display: "inline-block" }}>PILAR {i + 1}</span>
                <h3 className="serif" style={{ fontSize: 22, margin: "10px 0 12px" }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE CATALOG ── */}
      <section id="cursos" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="fade-in-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
          <div>
            <span className="badge-purple" style={{ marginBottom: 8, display: "inline-block" }}>CATÁLOGO v3.0</span>
            <h2 className="serif" style={{ fontSize: "clamp(26px, 4vw, 36px)", margin: 0 }}>Programas & Cursos Disponíveis</h2>
          </div>
          <input className="inp" placeholder="🔍 Pesquisar cursos..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        </div>

        {/* Category pills */}
        <div className="fade-in-up" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "btn-gold" : "btn-outline"}
              style={{ padding: "8px 20px", fontSize: 13, borderRadius: "var(--radius-full)" }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filteredCourses.map((c, idx) => (
            <div
              key={c.id}
              className={`glass-panel course-card fade-in-up delay-${Math.min(idx * 100, 500)}`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
                e.currentTarget.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
            >
              <div className="course-thumb-wrapper">
                <img src={c.thumbnail} alt={c.title} className="course-thumb" />
                <div className="course-overlay">
                  <span className="badge-gold">{c.category.split("&")[0].trim()}</span>
                  <span className="badge-purple">{c.level}</span>
                </div>
                <div className="course-xp-badge">+{c.xpReward} XP</div>
              </div>

              <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 className="serif" style={{ fontSize: 19, margin: "0 0 8px", lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13.5, flex: 1, margin: "0 0 16px", lineHeight: 1.55 }}>{c.description}</p>

                {/* Progress ring + info */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 14 }}>
                  <ProgressRing percent={c.progress} size={56} strokeWidth={4} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{c.progress}% concluído</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>⏱️ {c.totalHours} · 👩‍🏫 {c.instructor}</div>
                  </div>
                </div>

                {/* Modules accordion (expandable inline) */}
                {expandedCourseModules === c.id && (
                  <div style={{ marginBottom: 14 }}>
                    <CourseModuleAccordion
                      modules={c.modules}
                      onPlayLesson={(lessonId) => {
                        const lesson = c.lessons.find((l) => l.id === lessonId);
                        openPlayer(c, lesson);
                      }}
                    />
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <button className="btn-outline" style={{ padding: "9px 8px", fontSize: 12 }}
                    onClick={() => setExpandedCourseModules(expandedCourseModules === c.id ? null : c.id)}>
                    {expandedCourseModules === c.id ? "▲ Módulos" : "📋 Módulos"}
                  </button>
                  <button className="btn-outline" style={{ padding: "9px 8px", fontSize: 12 }}
                    onClick={() => setDetailCourse(c as never)}>
                    📝 Detalhes
                  </button>
                  <button className="btn-gold" style={{ padding: "9px 8px", fontSize: 12 }}
                    onClick={() => openPlayer(c, c.lessons?.[0])}>
                    ▶️ Assistir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="depoimentos" style={{ padding: "80px 24px", background: "rgba(10,11,20,0.5)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="badge-gold">PROVA SOCIAL DE ELITE</span>
            <h2 className="serif" style={{ fontSize: "clamp(26px, 4vw, 36px)", margin: "12px 0 12px" }}>O Que Dizem Nossos Alunos VIP</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 560, margin: "0 auto" }}>
              Depoimentos reais de executivos e comandantes que alcançaram a fluência definitiva.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`glass-panel fade-in-up delay-${i * 100}`} style={{ padding: 28, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {"★★★★★".split("").map((s, si) => (
                    <span key={si} style={{ color: "var(--gold)", fontSize: 18 }}>{s}</span>
                  ))}
                </div>
                <p style={{ color: "var(--text-main)", fontSize: 14, lineHeight: 1.65, fontStyle: "italic", flex: 1, margin: "0 0 20px" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.avatarColor, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, color: "#fff", flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{t.role}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)" }}>XP Total</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--gold)" }}>{t.xp.toLocaleString("pt-BR")}</div>
                  </div>
                  <span style={{ fontSize: 20 }}>{t.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS / PRICING ── */}
      <section id="planos" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="badge-gold">PLANOS DE HORAS VIP</span>
          <h2 className="serif" style={{ fontSize: "clamp(26px, 4vw, 38px)", margin: "12px 0 12px" }}>Investimento & Imersão</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: 560, margin: "0 auto" }}>
            Carga horária flexível adaptada à sua agenda de liderança com mentoria continuada.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {PLANS.map((p, i) => (
            <div
              key={p.id}
              className={`glass-panel fade-in-up delay-${i * 150}`}
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                border: p.popular ? `2px solid ${p.color}` : "1px solid var(--border)",
                boxShadow: p.popular ? `0 0 40px ${p.color}22` : undefined,
                position: "relative",
                transform: p.popular ? "scale(1.03)" : undefined,
              }}
            >
              {p.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${p.color}, #7c3aed)`,
                  color: "#fff", padding: "4px 20px", borderRadius: "var(--radius-full)",
                  fontSize: 11, fontWeight: 800, letterSpacing: 1, whiteSpace: "nowrap",
                  boxShadow: `0 4px 16px ${p.color}60`,
                }}>
                  ✨ MAIS RECOMENDADO
                </div>
              )}

              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, marginTop: p.popular ? 8 : 0 }}>
                <span style={{ fontSize: 32 }}>{p.badge}</span>
                <h3 className="serif" style={{ fontSize: 22, margin: 0 }}>{p.name}</h3>
              </div>

              <div style={{ marginBottom: 12 }}>
                <span className="serif" style={{ fontSize: 42, fontWeight: 900, color: p.color }}>{p.price}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 14 }}>/mês</span>
              </div>

              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>
                ⏱️ {p.hours} · Duração: {p.dur}
              </div>

              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20, lineHeight: 1.55 }}>{p.desc}</p>

              <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "16px 0", margin: "0 0 20px", flex: 1 }}>
                {p.perks.map((perk, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13.5, marginBottom: 10 }}>
                    <span style={{ color: p.color, fontSize: 15 }}>✓</span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <button
                className={p.popular ? "btn-gold btn-pulse-gold" : "btn-outline"}
                style={{
                  width: "100%", padding: "14px",
                  ...(p.popular ? {} : { borderColor: p.color + "60", color: p.color }),
                }}
                onClick={() => setCheckoutPlan(p)}
              >
                {p.badge} Matricular-se — {p.name}
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee banner */}
        <div className="glass-gold fade-in-up" style={{ marginTop: 48, padding: 28, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ fontSize: 48 }}>🛡️</div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 className="serif gold-text" style={{ fontSize: 22, margin: "0 0 6px" }}>Garantia Imperial de 7 Dias</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>
              Experimente a plataforma sem riscos. Se em 7 dias você sentir que o método não superou suas expectativas, devolvemos 100% do seu investimento, sem burocracia.
            </p>
          </div>
          <button className="btn-gold" onClick={() => setCheckoutPlan(PLANS[1])}>
            🚀 Começar Agora
          </button>
        </div>
      </section>

      {/* ── BADGES SHOWCASE ── */}
      <section style={{ padding: "70px 24px", background: "rgba(10,11,20,0.5)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="badge-purple">🏆 CONQUISTAS & BADGES</span>
            <h2 className="serif" style={{ fontSize: "clamp(24px, 4vw, 34px)", margin: "12px 0 10px" }}>Desbloqueie Conquistas Exclusivas</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Complete módulos, assistir aulas e fazer quizzes para ganhar XP e desbloquear badges VIP.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { badge: "🚀", title: "Primeiro Voo", xp: 100, desc: "Complete sua primeira aula", unlocked: true },
              { badge: "🎯", title: "Especialista ICAO", xp: 500, desc: "Conclua o curso de Aviação", unlocked: true },
              { badge: "💼", title: "C-Suite Ready", xp: 400, desc: "Domine Business English", unlocked: false },
              { badge: "🌍", title: "Global Citizen", xp: 300, desc: "Complete Conversação VIP", unlocked: false },
              { badge: "👑", title: "Imperial Master", xp: 1000, desc: "Platine todos os cursos", unlocked: false },
              { badge: "🔥", title: "30 Dias Streak", xp: 250, desc: "Estude 30 dias seguidos", unlocked: false },
            ].map((b, i) => (
              <div
                key={i}
                className={`glass-panel fade-in-up delay-${Math.min(i * 100, 400)}`}
                onClick={() => b.unlocked && setBadgeModal(BADGES_DATA.find(x => x.badge === b.badge) ?? null)}
                style={{
                  padding: "20px 16px", textAlign: "center",
                  opacity: b.unlocked ? 1 : 0.5,
                  cursor: b.unlocked ? "pointer" : "default",
                  border: b.unlocked ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                  filter: b.unlocked ? "none" : "grayscale(0.8)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: 42, marginBottom: 8, filter: b.unlocked ? "drop-shadow(0 0 12px rgba(245,200,66,0.6))" : "none" }}>
                  {b.badge}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8 }}>{b.desc}</div>
                <div className={b.unlocked ? "badge-gold" : "badge-purple"} style={{ fontSize: 10 }}>
                  {b.unlocked ? "✓ DESBLOQUEADO" : `+${b.xp} XP`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="badge-gold">DÚVIDAS FREQUENTES</span>
            <h2 className="serif" style={{ fontSize: "clamp(24px, 4vw, 34px)", margin: "12px 0 12px" }}>Perguntas Frequentes</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel fade-in-up"
                  style={{ padding: 20, cursor: "pointer", border: isOpen ? "1px solid var(--border-gold)" : "1px solid var(--border)", transition: "border-color 0.3s ease" }}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 15 }}>
                    <span>{faq.q}</span>
                    <span style={{ color: "var(--gold)", fontSize: 22, transition: "transform 0.3s ease", display: "inline-block", transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                  </div>
                  {isOpen && (
                    <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65, marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "rgba(6,7,13,0.95)", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div className="brand-icon" style={{ width: 36, height: 36, fontSize: 18 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 9H22L16 13.5L18 21L12 17L6 21L8 13.5L2 9H9L12 2Z" fill="#060710" />
                  </svg>
                </div>
                <span className="serif" style={{ color: "var(--gold)", fontWeight: 700 }}>The English Empire</span>
              </div>
              <p style={{ color: "var(--text-dim)", fontSize: 13, lineHeight: 1.6 }}>
                Transformando aprendizes em mestres do inglês desde 2022.
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text-muted)", fontSize: 12, letterSpacing: 1 }}>PLATAFORMA</div>
              {["Cursos HD", "Planos VIP", "Certificados", "Painel do Aluno"].map((l) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a href="#cursos" style={{ color: "var(--text-dim)", fontSize: 13, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}>
                    {l}
                  </a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text-muted)", fontSize: 12, letterSpacing: 1 }}>SUPORTE</div>
              {["WhatsApp VIP", "Política de Reembolso", "Termos de Uso", "Privacidade"].map((l) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <span style={{ color: "var(--text-dim)", fontSize: 13, cursor: "pointer" }}>{l}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text-muted)", fontSize: 12, letterSpacing: 1 }}>PAGAMENTOS</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["💳 Stripe", "🇧🇷 MercadoPago", "⚡ PIX", "📄 Boleto"].map((p) => (
                  <span key={p} className="badge-purple" style={{ fontSize: 11 }}>{p}</span>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="badge-green" style={{ display: "inline-flex" }}>🔒 SSL 256-bit Seguro</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "var(--text-dim)", fontSize: 12 }}>
              © 2026 <strong style={{ color: "var(--text-muted)" }}>The English Empire — Imperial Academy v3.0</strong>. Todos os direitos reservados.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="/admin" style={{ color: "var(--gold)", fontSize: 12 }}>Admin</a>
              <button onClick={() => setShowStudentDrawer(true)} style={{ color: "var(--text-dim)", fontSize: 12, cursor: "pointer" }}>Área do Aluno</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}

      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}

      {badgeModal && (
        <BadgeUnlockModal
          badge={badgeModal.badge}
          title={badgeModal.title}
          description={badgeModal.description}
          xpReward={badgeModal.xpReward}
          onClose={() => setBadgeModal(null)}
        />
      )}

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={() => { setShowStudentDrawer(true); }}
        />
      )}

      {showStudentLogin && (
        <div className="modal-backdrop" onClick={() => setShowStudentLogin(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, padding: 32 }}>
            <h2 className="serif" style={{ fontSize: 24, margin: "0 0 8px", textAlign: "center" }}>Área do Aluno VIP</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", margin: "0 0 24px" }}>
              Acesse sua conta ou emita seu Certificado de Fluência.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setShowStudentLogin(false); setShowCertificate(true); }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="inp" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Nome completo" required />
              <input className="inp" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="seu@email.com" required />
              <button type="submit" className="btn-gold">👑 Acessar & Emitir Certificado</button>
            </form>
          </div>
        </div>
      )}

      {showQuiz && (
        <PlacementQuizModal
          onClose={() => setShowQuiz(false)}
          onSelectPlan={() => { setShowQuiz(false); setCheckoutPlan(PLANS[1]); }}
        />
      )}

      {showStudentDrawer && (
        <StudentDashboardDrawer
          studentName={studentName}
          studentEmail={studentEmail}
          courses={COURSES as never}
          onOpenCertificate={() => { setShowStudentDrawer(false); setShowCertificate(true); }}
          onOpenCourse={(c) => { setShowStudentDrawer(false); openPlayer(c as never); }}
          onClose={() => setShowStudentDrawer(false)}
        />
      )}

      {detailCourse && (
        <CourseDetailModal
          course={detailCourse as never}
          onStartLesson={(l) => { const tc = detailCourse; setDetailCourse(null); openPlayer(tc as never, l as never); }}
          onClose={() => setDetailCourse(null)}
        />
      )}

      {selectedCourse && (
        <CoursePlayer
          course={selectedCourse as never}
          initialLesson={selectedLesson as never}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {showCertificate && (
        <CertificateModal
          studentName={studentName}
          courseTitle={COURSES[0]?.title || "Executive Business English"}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </main>
  );
}
