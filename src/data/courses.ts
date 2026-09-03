export type Lesson = { id: string; title: string; videoUrl: string };
export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: Lesson[];
};

// Dados mock — plugar Supabase depois (ver lib/supabase.ts)
export const COURSES: Course[] = [
  {
    id: "ingles-basico",
    title: "Inglês Básico para Iniciantes",
    description: "Do zero ao primeiro diálogo. Videoaulas curtas e práticas.",
    thumbnail: "https://placehold.co/600x340/1e3a5f/fff?text=Ingl%C3%AAs",
    lessons: [
      { id: "l1", title: "Aula 1 — Alfabeto e Saudações", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "l2", title: "Aula 2 — Apresentando-se", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
  {
    id: "espanhol-basico",
    title: "Español Esencial",
    description: "Primeros pasos en español con video-lecciones.",
    thumbnail: "https://placehold.co/600x340/2e7d32/fff?text=Espa%C3%B1ol",
    lessons: [
      { id: "l1", title: "Lección 1 — Saludos", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
];
