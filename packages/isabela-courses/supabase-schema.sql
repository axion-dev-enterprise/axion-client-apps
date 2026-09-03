-- =========================================================
-- SCHEMA COMPLETO SUPABASE — ISABELA COURSES (THE ENGLISH EMPIRE)
-- Cole este script no SQL Editor do seu Painel Supabase
-- =========================================================

-- 1. TABELA DE CURSOS
create table if not exists public.courses (
  id text primary key,
  title text not null,
  description text,
  category text default 'Geral',
  level text default 'Intermediário',
  thumbnail text,
  instructor text default 'Isabela - The English Empire',
  price numeric default 0.00,
  featured boolean default false,
  created_at timestamptz default now()
);

-- 2. TABELA DE AULAS (LESSONS)
create table if not exists public.lessons (
  id text primary key,
  course_id text references public.courses(id) on delete cascade,
  title text not null,
  video_url text not null,
  duration text default '15 min',
  order_index integer default 1,
  description text,
  created_at timestamptz default now()
);

-- 3. TABELA DE ALUNOS (STUDENTS)
create table if not exists public.students (
  id text primary key,
  name text not null,
  email text unique not null,
  plan text default 'Plano Ouro',
  avatar_url text,
  status text default 'Ativo',
  created_at timestamptz default now()
);

-- 4. TABELA DE ADMINISTRADORES
create table if not exists public.admins (
  id text primary key,
  email text unique not null,
  password text not null,
  role text default 'admin',
  created_at timestamptz default now()
);

-- 5. TABELA DE PROGRESSO DO ALUNO
create table if not exists public.progress (
  id text primary key,
  student_id text references public.students(id) on delete cascade,
  lesson_id text references public.lessons(id) on delete cascade,
  completed boolean default true,
  updated_at timestamptz default now(),
  unique(student_id, lesson_id)
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) & POLÍTICAS
-- =========================================================
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.students enable row level security;
alter table public.admins enable row level security;
alter table public.progress enable row level security;

-- Políticas de leitura pública (Cursos e Aulas abertos para visualização no App)
drop policy if exists "public read courses" on public.courses;
create policy "public read courses" on public.courses for select using (true);

drop policy if exists "public read lessons" on public.lessons;
create policy "public read lessons" on public.lessons for select using (true);

drop policy if exists "public read students" on public.students;
create policy "public read students" on public.students for select using (true);

drop policy if exists "public read progress" on public.progress;
create policy "public read progress" on public.progress for select using (true);

-- Permissões de escrita total para Service Role (API Routes usam SUPABASE_SERVICE_ROLE_KEY)
drop policy if exists "service write courses" on public.courses;
create policy "service write courses" on public.courses for all using (true);

drop policy if exists "service write lessons" on public.lessons;
create policy "service write lessons" on public.lessons for all using (true);

drop policy if exists "service write students" on public.students;
create policy "service write students" on public.students for all using (true);

drop policy if exists "service write progress" on public.progress;
create policy "service write progress" on public.progress for all using (true);

-- =========================================================
-- STORAGE BUCKETS (UPLOAD DE VÍDEOS E THUMBNAILS)
-- =========================================================
-- Executar no Supabase Storage ou via SQL:
insert into storage.buckets (id, name, public) 
values ('course-media', 'course-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

-- Políticas de Storage Público para leitura de mídia
create policy "Public Access Course Media" on storage.objects 
  for select using (bucket_id = 'course-media');

create policy "Public Access Thumbnails" on storage.objects 
  for select using (bucket_id = 'thumbnails');

create policy "Public Insert Course Media" on storage.objects 
  for insert with check (bucket_id = 'course-media');

create policy "Public Insert Thumbnails" on storage.objects 
  for insert with check (bucket_id = 'thumbnails');

-- =========================================================
-- SEED DE ADMIN DEDICADO
-- =========================================================
insert into public.admins (id, email, password, role) 
values ('admin-001', 'admin@axion.com', 'admin123', 'superadmin')
on conflict (id) do update set password = excluded.password;
