"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "pt" | "en" | "es";

const DICT: Record<Lang, Record<string, string>> = {
  pt: {
    heroTag: "PLATAFORMA EXCLUSIVA DE FLUÊNCIA",
    heroTitle: "Inglês de Elite para Quem Conquista o Mundo.",
    heroSubtitle: "Cursos de alta performance para executivos, profissionais da aviação e alunos VIP. Treinamento prático com mentoria e suporte completo.",
    exploreCourses: "Explorar Cursos",
    vipPlans: "Planos VIP",
    studentArea: "Painel do Aluno",
    adminPanel: "Painel Admin",
    allCategories: "Todas as Categorias",
    watchLesson: "Assistir Aula",
    startCourse: "Iniciar Curso",
    noLessons: "Nenhuma aula gravada ainda neste curso.",
    lessons: "Aulas",
  },
  en: {
    heroTag: "EXCLUSIVE FLUENCY PLATFORM",
    heroTitle: "Elite English for Those Who Conquer the World.",
    heroSubtitle: "High-performance courses for executives, aviation professionals, and VIP students. Practical training with mentorship and full support.",
    exploreCourses: "Explore Courses",
    vipPlans: "VIP Plans",
    studentArea: "Student Area",
    adminPanel: "Admin Panel",
    allCategories: "All Categories",
    watchLesson: "Watch Lesson",
    startCourse: "Start Course",
    noLessons: "No recorded lessons in this course yet.",
    lessons: "Lessons",
  },
  es: {
    heroTag: "PLATAFORMA EXCLUSIVA DE FLUIDEZ",
    heroTitle: "Inglés de Elite para Quienes Conquistan el Mundo.",
    heroSubtitle: "Cursos de alto rendimiento para ejecutivos, profesionales de la aviación y estudiantes VIP. Entrenamiento práctico con mentoría y soporte completo.",
    exploreCourses: "Explorar Cursos",
    vipPlans: "Planes VIP",
    studentArea: "Área de Estudiantes",
    adminPanel: "Panel Admin",
    allCategories: "Todas las Categorías",
    watchLesson: "Ver Clase",
    startCourse: "Iniciar Curso",
    noLessons: "No hay clases grabadas en este curso todavía.",
    lessons: "Lecciones",
  },
};

const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}>({
  lang: "pt",
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  const t = (k: string) => DICT[lang]?.[k] ?? k;
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
