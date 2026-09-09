const LS_USERS = 'app_users_v1';
const LS_SESSION = 'usuarioLogado_v1';

export const getUsers = () => {
  try {
    const raw = localStorage.getItem(LS_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
};

export const findUserByEmail = (email) => {
  if (!email) return null;
  const users = getUsers();
  return users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase()) || null;
};

export const createUser = (user) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
};

export const saveSession = (user) => {
  localStorage.setItem(LS_SESSION, JSON.stringify(user));
};

const LS_ESSAYS = 'app_redacoes_v1';

export const getEssays = () => {
  try {
    const raw = localStorage.getItem(LS_ESSAYS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveEssays = (essays) => {
  localStorage.setItem(LS_ESSAYS, JSON.stringify(essays));
};

export const createEssay = (essay) => {
  const essays = getEssays();
  essays.push(essay);
  saveEssays(essays);
  return essay;
};

export const updateEssay = (id, changes) => {
  const essays = getEssays();
  const nextEssays = essays.map((essay) => (essay.id === id ? { ...essay, ...changes } : essay));
  saveEssays(nextEssays);
  return nextEssays;
};

const LS_VIDEOLESSONS = 'app_videoaulas_v1';

export const getVideoLessons = () => {
  try {
    const raw = localStorage.getItem(LS_VIDEOLESSONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveVideoLessons = (lessons) => {
  localStorage.setItem(LS_VIDEOLESSONS, JSON.stringify(lessons));
};

export const createVideoLesson = (lesson) => {
  const lessons = getVideoLessons();
  lessons.unshift(lesson);
  saveVideoLessons(lessons);
  return lesson;
};

export const deleteVideoLesson = (id) => {
  const lessons = getVideoLessons().filter((lesson) => lesson.id !== id);
  saveVideoLessons(lessons);
  return lessons;
};

const LS_SIMULADOS = 'app_simulados_v1';

export const getSimulations = () => {
  try {
    const raw = localStorage.getItem(LS_SIMULADOS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveSimulations = (simulations) => {
  localStorage.setItem(LS_SIMULADOS, JSON.stringify(simulations));
};

export const createSimulation = (simulation) => {
  const simulations = getSimulations();
  simulations.unshift(simulation);
  saveSimulations(simulations);
  return simulation;
};

export const deleteSimulation = (id) => {
  const simulations = getSimulations().filter((simulation) => simulation.id !== id);
  saveSimulations(simulations);
  return simulations;
};

const LS_CONTENTS = 'app_contents_v1';

export const getContents = () => {
  try {
    const raw = localStorage.getItem(LS_CONTENTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveContents = (contents) => {
  localStorage.setItem(LS_CONTENTS, JSON.stringify(contents));
};

export const createContent = (content) => {
  const contents = getContents();
  contents.unshift(content);
  saveContents(contents);
  return content;
};

export const updateContent = (id, changes) => {
  const contents = getContents();
  const next = contents.map((c) => (c.id === id ? { ...c, ...changes } : c));
  saveContents(next);
  return next;
};

export const deleteContent = (id) => {
  const contents = getContents().filter((c) => c.id !== id);
  saveContents(contents);
  return contents;
};

export const getSession = () => {
  try {
    const raw = localStorage.getItem(LS_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(LS_SESSION);
};

const LS_SCHEDULE = 'app_cronograma_v1';

export const getSchedule = () => {
  try {
    const raw = localStorage.getItem(LS_SCHEDULE);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // Padrão inicial de estudos
  const defaultSchedule = [
    { id: 'sch-1', dia: 'Segunda-feira', tema: 'Morfologia: Classes de Palavras & Substantivos', tipo: 'Gramática', duracao: '50 min', concluido: false },
    { id: 'sch-2', dia: 'Terça-feira', tema: 'Estrutura da Redação ENEM: Introdução e Tese', tipo: 'Redação', duracao: '60 min', concluido: true },
    { id: 'sch-3', dia: 'Quarta-feira', tema: 'Sintaxe: Período Composto por Subordinação', tipo: 'Gramática', duracao: '45 min', concluido: false },
    { id: 'sch-4', dia: 'Quinta-feira', tema: 'Produção Guiada: Proposta de Intervenção (D5)', tipo: 'Redação', duracao: '60 min', concluido: false },
    { id: 'sch-5', dia: 'Sexta-feira', tema: 'Pontuação: Uso da Vírgula e Crase sem Erros', tipo: 'Gramática', duracao: '40 min', concluido: false },
    { id: 'sch-6', dia: 'Sábado', tema: 'Simulado Prático: 20 Questões Comentadas', tipo: 'Simulado', duracao: '90 min', concluido: false }
  ];
  localStorage.setItem(LS_SCHEDULE, JSON.stringify(defaultSchedule));
  return defaultSchedule;
};

export const saveSchedule = (items) => {
  localStorage.setItem(LS_SCHEDULE, JSON.stringify(items));
};

export const toggleScheduleItem = (id) => {
  const items = getSchedule();
  const next = items.map(item => item.id === id ? { ...item, concluido: !item.concluido } : item);
  saveSchedule(next);
  return next;
};

export const createScheduleItem = (item) => {
  const items = getSchedule();
  items.push(item);
  saveSchedule(items);
  return item;
};

export const deleteScheduleItem = (id) => {
  const items = getSchedule().filter(item => item.id !== id);
  saveSchedule(items);
  return items;
};

const LS_MATERIALS = 'app_materiais_v1';

export const getMaterials = () => {
  try {
    const raw = localStorage.getItem(LS_MATERIALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const defaultMaterials = [
    {
      id: 'mat-1',
      titulo: 'Manual Definitivo da Crase (Regras & Casos Proibidos)',
      categoria: 'Gramática',
      descricao: 'Guia prático e mnemônicos para nunca mais errar o uso do acento grave.',
      formato: 'PDF',
      tamanho: '2.4 MB',
      data: '08/09/2026',
      link: '#'
    },
    {
      id: 'mat-2',
      titulo: 'Coletânea de Repertórios Socioculturais Coringas',
      categoria: 'Redação',
      descricao: 'Alusões históricas, filósofos e dados estatísticos aplicáveis aos 5 eixos temáticos do ENEM.',
      formato: 'PDF',
      tamanho: '4.1 MB',
      data: '07/09/2026',
      link: '#'
    },
    {
      id: 'mat-3',
      titulo: 'Folha de Redação Oficial Padrão ENEM com Grade de Competências',
      categoria: 'Redação',
      descricao: 'Espelho padrão para impressão e treino manuscrito das 30 linhas.',
      formato: 'PDF',
      tamanho: '850 KB',
      data: '05/09/2026',
      link: '#'
    },
    {
      id: 'mat-4',
      titulo: 'Mapas Mentais: Concordância Nominal e Verbal',
      categoria: 'Gramática',
      descricao: 'Resumo visual esquematizado dos casos especiais que mais caem em concursos.',
      formato: 'PDF',
      tamanho: '3.2 MB',
      data: '02/09/2026',
      link: '#'
    }
  ];
  localStorage.setItem(LS_MATERIALS, JSON.stringify(defaultMaterials));
  return defaultMaterials;
};

export const saveMaterials = (materials) => {
  localStorage.setItem(LS_MATERIALS, JSON.stringify(materials));
};

export const createMaterial = (material) => {
  const materials = getMaterials();
  materials.unshift(material);
  saveMaterials(materials);
  return material;
};

export const deleteMaterial = (id) => {
  const materials = getMaterials().filter(m => m.id !== id);
  saveMaterials(materials);
  return materials;
};

