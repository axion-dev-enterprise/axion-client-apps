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

export const updateSimulation = (id, changes) => {
  const simulations = getSimulations();
  const next = simulations.map((simulation) => simulation.id === id ? { ...simulation, ...changes } : simulation);
  saveSimulations(next);
  return next;
};

export const deleteSimulation = (id) => {
  const simulations = getSimulations().filter((simulation) => simulation.id !== id);
  saveSimulations(simulations);
  return simulations;
};

const LS_SIMULATION_RESULTS = 'app_simulado_resultados_v1';

export const getSimulationResults = () => {
  try {
    const raw = localStorage.getItem(LS_SIMULATION_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const getSimulationResult = (simulationId, studentId) => {
  if (!simulationId || !studentId) return null;
  return getSimulationResults().find((result) => result.simulationId === simulationId && result.studentId === studentId) || null;
};

export const saveSimulationResult = (result) => {
  const results = getSimulationResults().filter((item) => !(item.simulationId === result.simulationId && item.studentId === result.studentId));
  const nextResult = { ...result, concluidoEm: result.concluidoEm || new Date().toISOString() };
  results.push(nextResult);
  localStorage.setItem(LS_SIMULATION_RESULTS, JSON.stringify(results));
  return nextResult;
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

export const getContentCompletionEntries = (contentId) => {
  if (!contentId) return [];

  const users = getUsers();
  const entries = users.reduce((accumulator, user) => {
    const completedItems = Array.isArray(user.estudos?.portuguesConcluidos) ? user.estudos.portuguesConcluidos : [];
    const match = completedItems.find((entry) => {
      const entryContentId = entry.contentId || entry.conteudoId || entry.id;
      return entryContentId === contentId;
    });

    if (!match) return accumulator;

    accumulator.push({
      userId: user.id,
      nome: user.nome || 'Aluno',
      email: user.email || '',
      tipo: user.tipo || 'aluno',
      titulo: match.titulo || 'Conteúdo de português',
      tema: match.tema || '',
      nivel: match.nivel || '',
      concluidoEm: match.concluidoEm || null
    });

    return accumulator;
  }, []);

  return entries.sort((left, right) => {
    const leftTime = left.concluidoEm ? new Date(left.concluidoEm).getTime() : 0;
    const rightTime = right.concluidoEm ? new Date(right.concluidoEm).getTime() : 0;
    return rightTime - leftTime;
  });
};

export const markPortugueseContentCompleted = (studentIdentifier, contentId, content = {}) => {
  if (!studentIdentifier || !contentId) return null;

  const users = getUsers();
  const index = users.findIndex((user) => user.id === studentIdentifier || user.email === studentIdentifier);
  if (index === -1) return null;

  const currentUser = users[index];
  const estudos = currentUser.estudos || {};
  const portuguesConcluidos = Array.isArray(estudos.portuguesConcluidos) ? estudos.portuguesConcluidos : [];
  const nextEntry = {
    id: contentId,
    contentId,
    conteudoId: contentId,
    titulo: String(content.titulo || content.title || '').trim() || 'Conteúdo de português',
    tema: String(content.tema || '').trim(),
    nivel: String(content.nivel || '').trim(),
    concluidoEm: new Date().toISOString()
  };

  const existingEntryIndex = portuguesConcluidos.findIndex((entry) => {
    const entryContentId = entry.contentId || entry.conteudoId || entry.id;
    return entryContentId === contentId;
  });

  const nextPortuguesConcluidos = [...portuguesConcluidos];

  if (existingEntryIndex >= 0) {
    nextPortuguesConcluidos[existingEntryIndex] = {
      ...nextPortuguesConcluidos[existingEntryIndex],
      ...nextEntry
    };
  } else {
    nextPortuguesConcluidos.unshift(nextEntry);
  }

  users[index] = {
    ...currentUser,
    estudos: {
      ...estudos,
      portuguesConcluidos: nextPortuguesConcluidos
    }
  };

  saveUsers(users);
  return users[index];
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

const LS_PLANS = 'app_plans_v1';

export const getPlans = () => {
  try {
    const raw = localStorage.getItem(LS_PLANS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const savePlans = (plans) => {
  localStorage.setItem(LS_PLANS, JSON.stringify(plans));
};

export const getPlanById = (planId) => {
  if (!planId) return null;
  return getPlans().find((plan) => plan.id === planId) || null;
};

export const getStudentPlan = (studentId) => {
  const users = getUsers();
  const student = users.find((user) => user.id === studentId || user.email === studentId);
  if (!student || !student.plan_id) return null;
  return getPlanById(student.plan_id);
};

export const getStudentPermissions = (studentId) => {
  const users = getUsers();
  const student = users.find((user) => user.id === studentId || user.email === studentId);
  if (!student || !student.plan_id) {
    return {};
  }

  const plan = getPlanById(student.plan_id);
  if (!plan || plan.status !== 'active') {
    return {};
  }

  const now = new Date();
  const startDate = student.plan_start_date ? new Date(`${student.plan_start_date}T00:00:00`) : null;
  const endDate = student.plan_end_date ? new Date(`${student.plan_end_date}T23:59:59`) : null;

  if (startDate && now < startDate) {
    return {};
  }

  if (endDate && now > endDate) {
    return {};
  }

  return {
    portugues: Boolean(plan.permissions?.portugues),
    redacao: Boolean(plan.permissions?.redacao),
    videoaulas: Boolean(plan.permissions?.videoaulas),
    simulados: Boolean(plan.permissions?.simulados),
    material: Boolean(plan.permissions?.material),
    cronograma: Boolean(plan.permissions?.cronograma)
  };
};

export const canAccess = (studentId, permission) => {
  if (!studentId || !permission) return true;
  const permissions = getStudentPermissions(studentId);
  return Boolean(permissions[permission]);
};

export const createPlan = (plan) => {
  const plans = getPlans();
  const normalizedPlan = {
    id: plan.id || `plan_${Date.now()}`,
    name: String(plan.name || '').trim(),
    description: String(plan.description || '').trim(),
    price: Number(plan.price || 0),
    status: plan.status === 'inactive' ? 'inactive' : 'active',
    permissions: {
      portugues: Boolean(plan.permissions?.portugues),
      redacao: Boolean(plan.permissions?.redacao),
      videoaulas: Boolean(plan.permissions?.videoaulas),
      simulados: Boolean(plan.permissions?.simulados),
      material: Boolean(plan.permissions?.material),
      cronograma: Boolean(plan.permissions?.cronograma)
    },
    created_at: plan.created_at || new Date().toISOString(),
    updated_at: plan.updated_at || new Date().toISOString()
  };

  plans.push(normalizedPlan);
  savePlans(plans);
  return normalizedPlan;
};

export const updatePlan = (planId, changes) => {
  const plans = getPlans();
  const index = plans.findIndex((plan) => plan.id === planId);
  if (index === -1) return null;

  const nextPlan = {
    ...plans[index],
    ...changes,
    permissions: {
      portugues: Boolean(changes.permissions?.portugues ?? plans[index].permissions?.portugues),
      redacao: Boolean(changes.permissions?.redacao ?? plans[index].permissions?.redacao),
      videoaulas: Boolean(changes.permissions?.videoaulas ?? plans[index].permissions?.videoaulas),
      simulados: Boolean(changes.permissions?.simulados ?? plans[index].permissions?.simulados),
      material: Boolean(changes.permissions?.material ?? plans[index].permissions?.material),
      cronograma: Boolean(changes.permissions?.cronograma ?? plans[index].permissions?.cronograma)
    },
    updated_at: new Date().toISOString()
  };

  plans[index] = nextPlan;
  savePlans(plans);
  return nextPlan;
};

export const deletePlan = (planId) => {
  const plans = getPlans().filter((plan) => plan.id !== planId);
  savePlans(plans);

  const users = getUsers();
  const nextUsers = users.map((user) => {
    if (user.plan_id === planId) {
      return { ...user, plan_id: null };
    }
    return user;
  });

  localStorage.setItem('app_users_v1', JSON.stringify(nextUsers));
  return plans;
};

export const assignPlanToStudent = (studentId, planId, dates = {}) => {
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === studentId || user.email === studentId);
  if (userIndex === -1) return null;

  users[userIndex] = {
    ...users[userIndex],
    plan_id: planId || null,
    plan_start_date: planId ? (dates.startDate || null) : null,
    plan_end_date: planId ? (dates.endDate || null) : null
  };

  localStorage.setItem('app_users_v1', JSON.stringify(users));
  return users[userIndex];
};

const LS_SCHEDULE = 'app_cronograma_v1';
const LS_SCHEDULES = 'app_cronogramas_v1';

const createDefaultStudyPlan = () => ({
  id: 'plan-default',
  nome: 'Plano de estudos',
  titulo: 'Plano de estudos',
  objetivo: 'Organize sua rotina de estudos.',
  inicio: '',
  fim: '',
  etapas: []
});

export const getStudyPlans = () => {
  try {
    const raw = localStorage.getItem(LS_SCHEDULES);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const saveStudyPlans = (plans) => {
  localStorage.setItem(LS_SCHEDULES, JSON.stringify(plans));
  return plans;
};

export const getStudyPlan = () => {
  try {
    const raw = localStorage.getItem(LS_SCHEDULE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return { ...createDefaultStudyPlan(), etapas: parsed.map((item) => ({
          id: item.id || `stage-${Date.now()}`,
          titulo: item.tema || 'Etapa de estudo',
          materia: item.tipo || 'Português',
          data: '',
          duracao: item.duracao || '',
          descricao: '',
          recursoTipo: '',
          recursoNome: '',
          recursoLink: '',
          concluido: Boolean(item.concluido)
        })) };
      }
      if (parsed && typeof parsed === 'object') return { ...createDefaultStudyPlan(), ...parsed, titulo: parsed.titulo || parsed.nome || 'Plano de estudos', etapas: Array.isArray(parsed.etapas) ? parsed.etapas : [] };
    }
  } catch (e) {}
  return createDefaultStudyPlan();
};

export const saveStudyPlan = (plan) => {
  localStorage.setItem(LS_SCHEDULE, JSON.stringify(plan));
  const plans = getStudyPlans().filter((item) => item.id !== plan.id);
  saveStudyPlans([...plans, plan]);
  return plan;
};

export const toggleStudyStage = (id) => {
  const plan = getStudyPlan();
  const next = { ...plan, etapas: plan.etapas.map((stage) => stage.id === id ? { ...stage, concluido: !stage.concluido } : stage) };
  return saveStudyPlan(next);
};

export const getSchedule = () => getStudyPlan().etapas;

export const saveSchedule = (items) => saveStudyPlan({ ...getStudyPlan(), etapas: items });

export const toggleScheduleItem = (id) => toggleStudyStage(id).etapas;

export const createScheduleItem = (item) => {
  const plan = getStudyPlan();
  return saveStudyPlan({ ...plan, etapas: [...plan.etapas, item] });
};

export const deleteScheduleItem = (id) => {
  const plan = getStudyPlan();
  return saveStudyPlan({ ...plan, etapas: plan.etapas.filter((item) => item.id !== id) });
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

