"use client";
import { useEffect, useState } from "react";
import { Course, Lesson, Student } from "@/lib/db";
import { CertificateModal } from "@/components/CertificateModal";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  );
  const [email, setEmail] = useState("admin@axion.com");
  const [password, setPassword] = useState("admin123");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<"overview" | "courses" | "lessons" | "students" | "supabase">("overview");

  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [previewCertStudent, setPreviewCertStudent] = useState<Student | null>(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "Negócios & Aviação",
    level: "Intermediário",
    thumbnail: "",
    instructor: "Isabela - The English Empire",
    price: "297",
  });

  const [lessonForm, setLessonForm] = useState({
    course_id: "",
    title: "",
    video_url: "",
    duration: "15 min",
    order_index: "1",
    description: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    plan: "Plano Ouro",
  });

  const [uploading, setUploading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [cRes, sRes, stRes] = await Promise.all([
        fetch("/api/courses").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
        fetch("/api/stats").then((r) => r.json()),
      ]);

      if (Array.isArray(cRes)) setCourses(cRes);
      if (Array.isArray(sRes)) setStudents(sRes);
      if (stRes) setStats(stRes);
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (!r.ok) {
      setLoginErr(d.error || "Falha na autenticação");
      return;
    }
    localStorage.setItem("admin_token", d.token);
    setToken(d.token);
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setToken(null);
  }

  async function handleFileUpload(file: File, bucket: "thumbnails" | "course-media", callback: (url: string) => void) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);

    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (d.url) {
        callback(d.url);
        setMsg(`✓ Upload concluído com sucesso!`);
      } else {
        alert("Erro no upload: " + (d.error || "Desconhecido"));
      }
    } catch (err: any) {
      alert("Erro na requisição de upload: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseForm),
    });
    if (r.ok) {
      setCourseForm({
        title: "",
        description: "",
        category: "Negócios & Aviação",
        level: "Intermediário",
        thumbnail: "",
        instructor: "Isabela - The English Empire",
        price: "297",
      });
      setMsg("✓ Curso criado com sucesso!");
      loadData();
    }
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm("Tem certeza que deseja excluir este curso e todas as suas aulas?")) return;
    await fetch("/api/courses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadData();
  }

  async function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!lessonForm.course_id) {
      alert("Por favor selecione um curso para esta aula.");
      return;
    }
    setMsg("");
    const r = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonForm),
    });
    if (r.ok) {
      setLessonForm({ course_id: lessonForm.course_id, title: "", video_url: "", duration: "15 min", order_index: "1", description: "" });
      setMsg("✓ Aula adicionada com sucesso!");
      loadData();
    }
  }

  async function handleDeleteLesson(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return;
    await fetch("/api/lessons", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadData();
  }

  async function handleCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentForm),
    });
    if (r.ok) {
      setStudentForm({ name: "", email: "", plan: "Plano Ouro" });
      setMsg("✓ Aluno cadastrado com sucesso!");
      loadData();
    }
  }

  if (!token) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: 400, padding: 36 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div className="brand-icon" style={{ margin: "0 auto 12px" }}>E</div>
            <h2 className="serif" style={{ fontSize: 24, margin: 0 }}>Painel Instrutor v2.0</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>The English Empire — Isabela Courses</p>
          </div>

          {loginErr && (
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
              {loginErr}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>E-mail de Acesso</label>
              <input className="inp" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Senha</label>
              <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn-gold btn-pulse-gold" type="submit" style={{ marginTop: 8 }}>
              Entrar no Painel v2.0
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center", color: "var(--text-dim)", fontSize: 12, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            Modo Padrão: <strong style={{ color: "var(--gold)" }}>admin@axion.com</strong> / <strong>admin123</strong>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh" }}>
      <header className="app-header">
        <div className="brand-title">
          <div className="brand-icon">E</div>
          <div>
            <div className="serif" style={{ fontSize: 18, color: "var(--gold)" }}>Painel de Gestão VIP v2.0</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>ISABELA COURSES ADMIN</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/" className="btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
            🌐 Ver Site Público
          </a>
          <button className="btn-danger" onClick={handleLogout} style={{ fontSize: 13 }}>
            Sair
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 24px" }}>
        {msg && (
          <div style={{ padding: "12px 20px", borderRadius: 10, background: "rgba(245, 192, 66, 0.12)", border: "1px solid var(--border-gold)", color: "var(--gold)", marginBottom: 24, fontSize: 14 }}>
            {msg}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {[
            { id: "overview", label: "📊 Visão Geral" },
            { id: "courses", label: "📚 Cursos & Upload" },
            { id: "lessons", label: "🎥 Aulas & Vídeos" },
            { id: "students", label: "👥 Gestão de Alunos" },
            { id: "supabase", label: `⚡ Supabase ${stats.isSupabaseConnected ? "(ONLINE)" : "(MODO LOCAL)"}` },
          ].map((tItem) => (
            <button
              key={tItem.id}
              onClick={() => { setTab(tItem.id as any); setMsg(""); }}
              className={tab === tItem.id ? "btn-gold" : "btn-outline"}
              style={{ padding: "10px 20px", fontSize: 14 }}
            >
              {tItem.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>TOTAL DE CURSOS</div>
                <div className="serif gold-text" style={{ fontSize: 36, fontWeight: 800, marginTop: 4 }}>{stats.totalCourses || 0}</div>
              </div>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>TOTAL DE AULAS GRAVADAS</div>
                <div className="serif gold-text" style={{ fontSize: 36, fontWeight: 800, marginTop: 4 }}>{stats.totalLessons || 0}</div>
              </div>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>ALUNOS MATRICULADOS</div>
                <div className="serif gold-text" style={{ fontSize: 36, fontWeight: 800, marginTop: 4 }}>{stats.totalStudents || 0}</div>
              </div>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>BANCO DE DADOS</div>
                <div style={{ marginTop: 8 }}>
                  {stats.isSupabaseConnected ? (
                    <span className="badge-green">Supabase Conectado</span>
                  ) : (
                    <span className="badge-gold">JSON Storage (Local Fallback)</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <h3 className="serif" style={{ fontSize: 18, marginTop: 0 }}>Cursos Ativos</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                  {courses.slice(0, 4).map((c) => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{c.category} · {c.lessons?.length || 0} aulas</div>
                      </div>
                      <span className="badge-gold" style={{ fontSize: 11 }}>{c.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 24 }}>
                <h3 className="serif" style={{ fontSize: 18, marginTop: 0 }}>Alunos Recentes</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                  {students.slice(0, 5).map((s) => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{s.email}</div>
                      </div>
                      <button className="btn-gold" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => setPreviewCertStudent(s)}>
                        👑 Emitir Certificado
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES */}
        {tab === "courses" && (
          <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 32 }}>
            <div className="glass-panel" style={{ padding: 24, height: "fit-content" }}>
              <h3 className="serif" style={{ fontSize: 20, marginTop: 0 }}>Adicionar Novo Curso</h3>
              <form onSubmit={handleCreateCourse} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Título do Curso</label>
                  <input className="inp" placeholder="ex: Executive Business English" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Categoria</label>
                  <select className="inp" value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}>
                    <option value="Negócios & Aviação">Negócios & Aviação</option>
                    <option value="Conversação VIP">Conversação VIP</option>
                    <option value="Gramática & Fluência">Gramática & Fluência</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Nível de Fluência</label>
                  <select className="inp" value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Descrição Curta</label>
                  <textarea className="inp" rows={3} placeholder="Descrição dos objetivos do curso..." value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Thumbnail (URL ou Upload)</label>
                  <input className="inp" placeholder="https://..." value={courseForm.thumbnail} onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "thumbnails", (url) => setCourseForm({ ...courseForm, thumbnail: url }));
                      }
                    }}
                    style={{ marginTop: 6, fontSize: 12, color: "var(--text-muted)" }}
                  />
                </div>
                <button type="submit" className="btn-gold" disabled={uploading}>
                  {uploading ? "Enviando Imagem..." : "Salvar Curso"}
                </button>
              </form>
            </div>

            <div className="glass-panel" style={{ padding: 24 }}>
              <h3 className="serif" style={{ fontSize: 20, marginTop: 0 }}>Cursos Cadastrados ({courses.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
                {courses.map((c) => (
                  <div key={c.id} style={{ display: "flex", gap: 16, alignItems: "center", padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <img src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"} alt={c.title} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{c.title}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{c.category} · {c.level} · {c.lessons?.length || 0} aulas</div>
                    </div>
                    <button className="btn-danger" onClick={() => handleDeleteCourse(c.id)}>Excluir</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LESSONS */}
        {tab === "lessons" && (
          <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 32 }}>
            <div className="glass-panel" style={{ padding: 24, height: "fit-content" }}>
              <h3 className="serif" style={{ fontSize: 20, marginTop: 0 }}>Adicionar Aula ao Curso</h3>
              <form onSubmit={handleCreateLesson} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Selecione o Curso</label>
                  <select className="inp" value={lessonForm.course_id} onChange={(e) => setLessonForm({ ...lessonForm, course_id: e.target.value })} required>
                    <option value="">-- Escolha um curso --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Título da Aula</label>
                  <input className="inp" placeholder="ex: Aula 1: Opening Statements" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>URL do Vídeo (.mp4 / YouTube / Vimeo / Storage)</label>
                  <input className="inp" placeholder="https://..." value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} required />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "course-media", (url) => setLessonForm({ ...lessonForm, video_url: url }));
                      }
                    }}
                    style={{ marginTop: 6, fontSize: 12, color: "var(--text-muted)" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Duração</label>
                    <input className="inp" placeholder="18 min" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} />
                  </div>
                  <div style={{ width: 100 }}>
                    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Ordem</label>
                    <input className="inp" type="number" value={lessonForm.order_index} onChange={(e) => setLessonForm({ ...lessonForm, order_index: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Descrição / Conteúdo da Aula</label>
                  <textarea className="inp" rows={2} placeholder="Principais tópicos abordados..." value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} />
                </div>
                <button type="submit" className="btn-gold" disabled={uploading}>
                  {uploading ? "Enviando Vídeo..." : "Salvar Aula"}
                </button>
              </form>
            </div>

            <div className="glass-panel" style={{ padding: 24 }}>
              <h3 className="serif" style={{ fontSize: 20, marginTop: 0 }}>Grade de Aulas por Curso</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 20 }}>
                {courses.map((c) => (
                  <div key={c.id} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--gold)", marginBottom: 12 }}>
                      {c.title} ({c.lessons?.length || 0} aulas)
                    </div>
                    {c.lessons && c.lessons.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {c.lessons.map((l) => (
                          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(0,0,0,0.3)", borderRadius: 8, fontSize: 14 }}>
                            <div>
                              <strong>{l.title}</strong>
                              <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 10 }}>⏱️ {l.duration}</span>
                            </div>
                            <button className="btn-danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => handleDeleteLesson(l.id)}>Excluir</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: "var(--text-dim)" }}>Nenhuma aula neste curso ainda.</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {tab === "students" && (
          <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 32 }}>
            <div className="glass-panel" style={{ padding: 24, height: "fit-content" }}>
              <h3 className="serif" style={{ fontSize: 20, marginTop: 0 }}>Cadastrar Novo Aluno</h3>
              <form onSubmit={handleCreateStudent} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Nome Completo</label>
                  <input className="inp" placeholder="Nome do aluno" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>E-mail</label>
                  <input className="inp" type="email" placeholder="aluno@email.com" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Plano VIP</label>
                  <select className="inp" value={studentForm.plan} onChange={(e) => setStudentForm({ ...studentForm, plan: e.target.value })}>
                    <option value="Plano Ouro">Plano Ouro (50h)</option>
                    <option value="Plano Diamante">Plano Diamante (70h)</option>
                    <option value="Plano Imperial">Plano Imperial (100h)</option>
                  </select>
                </div>
                <button type="submit" className="btn-gold">Cadastrar Aluno</button>
              </form>
            </div>

            <div className="glass-panel" style={{ padding: 24 }}>
              <h3 className="serif" style={{ fontSize: 20, marginTop: 0 }}>Alunos Registrados ({students.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {students.map((s) => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.email}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="badge-purple">{s.plan || "Plano Ouro"}</span>
                      <button className="btn-gold" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setPreviewCertStudent(s)}>
                        👑 Certificado
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUPABASE STATUS */}
        {tab === "supabase" && (
          <div className="glass-panel" style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
            <h2 className="serif" style={{ fontSize: 24, marginTop: 0 }}>🔌 Status da Conexão Supabase</h2>

            <div style={{ padding: 20, borderRadius: 12, background: stats.isSupabaseConnected ? "rgba(34, 197, 94, 0.12)" : "rgba(245, 192, 66, 0.12)", border: stats.isSupabaseConnected ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid var(--border-gold)", margin: "20px 0" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: stats.isSupabaseConnected ? "#4ade80" : "var(--gold)" }}>
                {stats.isSupabaseConnected ? "✓ Supabase ONLINE & Integrado!" : "⚠️ Modo Local Ativo (Data-Store JSON)"}
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, margin: 0 }}>
                {stats.isSupabaseConnected
                  ? "As requisições de leitura, escrita e upload estão conectadas ao banco Supabase e Storage buckets em nuvem."
                  : "O aplicativo está rodando com banco de dados local autogerado. Assim que você enviar as credenciais Supabase, adicione-as ao arquivo `.env` para sincronização instantânea."}
              </p>
            </div>

            <h3 className="serif" style={{ fontSize: 18 }}>Instruções de Conexão Supabase:</h3>
            <ol style={{ paddingLeft: 20, color: "var(--text-muted)", lineHeight: 1.8, fontSize: 14 }}>
              <li>Abra o arquivo <code style={{ color: "var(--gold)" }}>.env.local</code> na raiz do projeto <code style={{ color: "var(--gold)" }}>isabela-courses</code>.</li>
              <li>Preencha as variáveis de ambiente:
                <pre style={{ background: "#050608", padding: 12, borderRadius: 8, color: "#fff", margin: "8px 0" }}>
{`NEXT_PUBLIC_SUPABASE_URL=https://sua-instancia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui`}
                </pre>
              </li>
              <li>Rode o script SQL disponível em <code style={{ color: "var(--gold)" }}>supabase-schema.sql</code> no SQL Editor do seu projeto Supabase.</li>
            </ol>
          </div>
        )}
      </div>

      {/* PREVIEW CERTIFICATE MODAL */}
      {previewCertStudent && (
        <CertificateModal
          studentName={previewCertStudent.name}
          courseTitle={courses[0]?.title || "Executive Business English"}
          onClose={() => setPreviewCertStudent(null)}
        />
      )}
    </main>
  );
}
