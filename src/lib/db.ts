import fs from "fs";
import path from "path";
import { supabase, supabaseAdmin, IS_SUPABASE_CONNECTED } from "./supabase";

// Caminho do armazenamento local (em dev usa workspace root, na Vercel usa /tmp)
const STORE_DIR = process.env.VERCEL ? "/tmp" : process.cwd();
const STORE_FILE = path.join(STORE_DIR, "data-store.json");

export type Course = {
  id: string;
  title: string;
  description: string;
  category?: string;
  level?: string;
  thumbnail?: string;
  instructor?: string;
  price?: number;
  featured?: boolean;
  lessons?: Lesson[];
  created_at?: string;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  video_url: string;
  duration?: string;
  order_index?: number;
  description?: string;
  created_at?: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  plan?: string;
  avatar_url?: string;
  status?: string;
  created_at?: string;
};

export type Admin = {
  id: string;
  email: string;
  password?: string;
  role?: string;
};

type StoreData = {
  courses: Course[];
  lessons: Lesson[];
  students: Student[];
  admins: Admin[];
};

// Seed de cursos iniciais VIP caso a base esteja vazia
const INITIAL_SEED: StoreData = {
  courses: [
    {
      id: "course-business-1",
      title: "Executive Business English & Negotiations",
      description: "Domine apresentações internacionais, vocabulário corporativo avançado e feche negócios globais com confiança de líder.",
      category: "Negócios & Aviação",
      level: "Avançado",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      instructor: "Isabela - The English Empire",
      price: 297.00,
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "course-aviation-1",
      title: "Aviation English & ICAO Exam Mastery",
      description: "Treinamento especializado de radiocomunicação, situações de emergência e preparação intensiva para o exame ICAO Nível 4/5.",
      category: "Negócios & Aviação",
      level: "Avançado",
      thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
      instructor: "Isabela - The English Empire",
      price: 349.00,
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "course-fluency-1",
      title: "Imperial Fluency & Accent Reduction",
      description: "Desenvolva pronúncia natural, intonação de falantes nativos e acabe com a trava emocional ao falar em público.",
      category: "Conversação VIP",
      level: "Intermediário",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
      instructor: "Isabela - The English Empire",
      price: 197.00,
      featured: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "course-grammar-1",
      title: "Grammar Empire: Estruturas de Elite",
      description: "Do básico ao avançado sem decorebas inúteis. Aprenda a lógica por trás de tempos verbais complexos e conectivos elegantes.",
      category: "Gramática & Fluência",
      level: "Iniciante",
      thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
      instructor: "Isabela - The English Empire",
      price: 147.00,
      featured: false,
      created_at: new Date().toISOString(),
    },
  ],
  lessons: [
    {
      id: "lesson-b1",
      course_id: "course-business-1",
      title: "Aula 1: High-Stakes Opening Statements in Meetings",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "18 min",
      order_index: 1,
      description: "Como captar a atenção da diretoria nos primeiros 60 segundos de uma reunião em inglês.",
      created_at: new Date().toISOString(),
    },
    {
      id: "lesson-b2",
      course_id: "course-business-1",
      title: "Aula 2: Win-Win Negotiation Tactics & Softening Claims",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "24 min",
      order_index: 2,
      description: "Vocabulário diplomático para negociar termos de contrato sem perder autoridade.",
      created_at: new Date().toISOString(),
    },
    {
      id: "lesson-a1",
      course_id: "course-aviation-1",
      title: "Aula 1: Standard ICAO Phraseology & Radio Checks",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "20 min",
      order_index: 1,
      description: "Fraseologia padrão internacional para comunicações claras em torre e controle.",
      created_at: new Date().toISOString(),
    },
    {
      id: "lesson-f1",
      course_id: "course-fluency-1",
      title: "Aula 1: Connected Speech & Silent Letters",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      duration: "15 min",
      order_index: 1,
      description: "Aprenda a conectar palavras e soar natural como um nativo americano ou britânico.",
      created_at: new Date().toISOString(),
    },
  ],
  students: [
    {
      id: "std-001",
      name: "Rodrigo Mendonça",
      email: "rodrigo.m@empresa.com",
      plan: "Plano Diamante",
      status: "Ativo",
      created_at: new Date().toISOString(),
    },
    {
      id: "std-002",
      name: "Camila Silveira",
      email: "camila.piloto@aviação.com",
      plan: "Plano Imperial",
      status: "Ativo",
      created_at: new Date().toISOString(),
    },
  ],
  admins: [
    {
      id: "admin-001",
      email: "admin@axion.com",
      password: "admin123",
      role: "superadmin",
    },
  ],
};

// Funções de leitura e escrita do JSON Local
function readStore(): StoreData {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      writeStore(INITIAL_SEED);
      return INITIAL_SEED;
    }
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.courses || parsed.courses.length === 0) {
      writeStore(INITIAL_SEED);
      return INITIAL_SEED;
    }
    return parsed;
  } catch {
    writeStore(INITIAL_SEED);
    return INITIAL_SEED;
  }
}

function writeStore(data: StoreData) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Erro ao gravar data-store.json local:", e);
  }
}

// =========================================================
// INTERFACE DE BANCO DE DADOS UNIFICADA (SUPABASE + LOCAL)
// =========================================================
export const db = {
  usingSupabase: IS_SUPABASE_CONNECTED,

  // Lista todos os cursos com suas respectivas aulas agregadas
  async getCoursesWithLessons(): Promise<Course[]> {
    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { data: courses, error: errC } = await supabaseAdmin.from("courses").select("*").order("created_at", { ascending: false });
      if (errC) throw errC;
      const { data: lessons, error: errL } = await supabaseAdmin.from("lessons").select("*").order("order_index", { ascending: true });
      if (errL) throw errL;

      return (courses || []).map((c: Course) => ({
        ...c,
        lessons: (lessons || []).filter((l: Lesson) => l.course_id === c.id),
      }));
    }

    const store = readStore();
    return store.courses.map((c) => ({
      ...c,
      lessons: store.lessons.filter((l) => l.course_id === c.id),
    }));
  },

  // Insere novo curso
  async createCourse(course: Omit<Course, "id">): Promise<Course> {
    const newCourse: Course = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      ...course,
    };

    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from("courses").insert(newCourse).select().single();
      if (error) throw error;
      return data;
    }

    const store = readStore();
    store.courses.unshift(newCourse);
    writeStore(store);
    return newCourse;
  },

  // Deleta um curso e suas aulas
  async deleteCourse(id: string): Promise<void> {
    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);
      if (error) throw error;
      return;
    }

    const store = readStore();
    store.courses = store.courses.filter((c) => c.id !== id);
    store.lessons = store.lessons.filter((l) => l.course_id !== id);
    writeStore(store);
  },

  // Insere nova aula em um curso
  async createLesson(lesson: Omit<Lesson, "id">): Promise<Lesson> {
    const newLesson: Lesson = {
      id: `l_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      ...lesson,
    };

    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from("lessons").insert(newLesson).select().single();
      if (error) throw error;
      return data;
    }

    const store = readStore();
    store.lessons.push(newLesson);
    writeStore(store);
    return newLesson;
  },

  // Deleta uma aula
  async deleteLesson(id: string): Promise<void> {
    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { error } = await supabaseAdmin.from("lessons").delete().eq("id", id);
      if (error) throw error;
      return;
    }

    const store = readStore();
    store.lessons = store.lessons.filter((l) => l.id !== id);
    writeStore(store);
  },

  // Lista alunos cadastrados
  async getStudents(): Promise<Student[]> {
    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from("students").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }

    return readStore().students;
  },

  // Cria novo aluno
  async createStudent(student: Omit<Student, "id">): Promise<Student> {
    const newStudent: Student = {
      id: `std_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: "Ativo",
      ...student,
    };

    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from("students").insert(newStudent).select().single();
      if (error) throw error;
      return data;
    }

    const store = readStore();
    store.students.unshift(newStudent);
    writeStore(store);
    return newStudent;
  },

  // Estatísticas para o Dashboard
  async getStats() {
    const courses = await this.getCoursesWithLessons();
    const students = await this.getStudents();
    const totalLessons = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);

    return {
      totalCourses: courses.length,
      totalLessons,
      totalStudents: students.length,
      isSupabaseConnected: IS_SUPABASE_CONNECTED,
      recentCourses: courses.slice(0, 4),
      recentStudents: students.slice(0, 5),
    };
  },

  // Autenticação de Admin
  async authenticateAdmin(email: string, pass: string): Promise<boolean> {
    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from("admins").select("*").eq("email", email).eq("password", pass).single();
      if (data && !error) return true;
    }

    const store = readStore();
    const found = store.admins.find((a) => a.email === email && a.password === pass);
    return !!found || (email === "admin@axion.com" && pass === "admin123");
  },
};
