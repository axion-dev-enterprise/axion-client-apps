import { request } from './client';

export interface AdminMateria {
  id: string;
  nome: string;
  descricao?: string;
  ordem?: number;
  icone?: string;
  totalAulas?: number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface AdminAula {
  id: string;
  materiaId: string;
  titulo: string;
  subtitulo?: string;
  conteudo?: string;
  duracao?: string;
  ordem?: number;
  videoUrl?: string | null;
  materialPdfUrl?: string | null;
  publicado?: boolean;
  nomeMateria?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface AdminQuestao {
  id?: string;
  tipo?: string;
  enunciado: string;
  banca?: string;
  ano?: string;
  alternativas: Array<{ id: string; texto: string }>;
  respostaCorreta: string;
  comentarioProfessora?: string;
}

export interface AdminExercicio {
  id: string;
  materiaId?: string | null;
  aulaId?: string | null;
  titulo: string;
  descricao?: string;
  publicado?: boolean;
  nomeMateria?: string;
  nomeAula?: string;
  totalQuestoes?: number;
  questoes?: AdminQuestao[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface AdminSimulado {
  id: string;
  titulo: string;
  descricao: string;
  banca: string;
  tempoMinutos: number;
  publicado: boolean;
  totalQuestoes?: number;
  questoes: Array<{
    id: string;
    enunciado: string;
    alternativas: Array<{ id: string; texto: string }>;
    respostaCorreta: string;
    explicacao: string;
  }>;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface AdminDiagnosticoQuestao {
  id: string;
  topico: string;
  nomeTopico: string;
  enunciado: string;
  alternativas: Array<{ id: string; texto: string }>;
  respostaCorreta: string;
  explicacao: string;
}

export interface AdminTemaRedacao {
  id: string;
  titulo: string;
  foco: string;
  instrucoes: string;
  prazo?: string | null;
  criadoEm?: string;
}

export interface AdminMaterialApoio {
  id: string;
  titulo: string;
  descricao: string;
  moduloId: string;
  nomeModulo?: string;
  tipo: string;
  arquivoUrl: string;
  tamanho?: string;
  paginas?: number;
  criadoEm?: string;
}

export interface AdminAluno {
  id: string;
  nome: string;
  email: string;
  plano?: 'iniciante' | 'medio' | 'pro';
  statusPlano?: 'pendente' | 'ativo' | 'recusado';
  codigoReferencia?: string;
  dataSolicitacaoPlano?: string;
  dataAprovacaoPlano?: string | null;
  criadoEm: string;
  aulasConcluidas: number;
  exerciciosConcluidos: number;
  taxaAcerto: number;
  ultimoAcesso?: string | null;
}

export const adminApi = {
  // Módulos / Matérias
  async getMaterias(): Promise<AdminMateria[]> {
    const res = await request<{ sucesso: boolean; materias: AdminMateria[] }>('/api/admin/materias');
    return res.materias || [];
  },
  async criarMateria(data: Partial<AdminMateria>): Promise<AdminMateria> {
    const res = await request<{ sucesso: boolean; materia: AdminMateria }>('/api/admin/materias', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.materia;
  },
  async atualizarMateria(id: string, data: Partial<AdminMateria>): Promise<AdminMateria> {
    const res = await request<{ sucesso: boolean; materia: AdminMateria }>(`/api/admin/materias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.materia;
  },
  async excluirMateria(id: string): Promise<void> {
    await request(`/api/admin/materias/${id}`, { method: 'DELETE' });
  },

  // Aulas
  async getAulas(): Promise<AdminAula[]> {
    const res = await request<{ sucesso: boolean; aulas: AdminAula[] }>('/api/admin/aulas');
    return res.aulas || [];
  },
  async criarAula(data: Partial<AdminAula>): Promise<AdminAula> {
    const res = await request<{ sucesso: boolean; aula: AdminAula }>('/api/admin/aulas', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.aula;
  },
  async atualizarAula(id: string, data: Partial<AdminAula>): Promise<AdminAula> {
    const res = await request<{ sucesso: boolean; aula: AdminAula }>(`/api/admin/aulas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.aula;
  },
  async excluirAula(id: string): Promise<void> {
    await request(`/api/admin/aulas/${id}`, { method: 'DELETE' });
  },

  // Banco de Questões / Exercícios
  async getExercicios(): Promise<AdminExercicio[]> {
    const res = await request<{ sucesso: boolean; exercicios: AdminExercicio[] }>('/api/admin/exercicios');
    return res.exercicios || [];
  },
  async getExercicioById(id: string): Promise<AdminExercicio> {
    const res = await request<{ sucesso: boolean; exercicio: AdminExercicio }>(`/api/admin/exercicios/${id}`);
    return res.exercicio;
  },
  async criarExercicio(data: any): Promise<AdminExercicio> {
    const res = await request<{ sucesso: boolean; exercicio: AdminExercicio }>('/api/admin/exercicios', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.exercicio;
  },
  async atualizarExercicio(id: string, data: any): Promise<AdminExercicio> {
    const res = await request<{ sucesso: boolean; exercicio: AdminExercicio }>(`/api/admin/exercicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.exercicio;
  },
  async excluirExercicio(id: string): Promise<void> {
    await request(`/api/admin/exercicios/${id}`, { method: 'DELETE' });
  },

  // Simulados & Provas
  async getSimulados(): Promise<AdminSimulado[]> {
    const res = await request<{ sucesso: boolean; simulados: AdminSimulado[] }>('/api/admin/simulados');
    return res.simulados || [];
  },
  async criarSimulado(data: Partial<AdminSimulado>): Promise<AdminSimulado> {
    const res = await request<{ sucesso: boolean; simulado: AdminSimulado }>('/api/admin/simulados', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.simulado;
  },
  async atualizarSimulado(id: string, data: Partial<AdminSimulado>): Promise<AdminSimulado> {
    const res = await request<{ sucesso: boolean; simulado: AdminSimulado }>(`/api/admin/simulados/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.simulado;
  },
  async excluirSimulado(id: string): Promise<void> {
    await request(`/api/admin/simulados/${id}`, { method: 'DELETE' });
  },

  // Diagnóstico & Nivelamento
  async getDiagnostico(): Promise<{ questoes: AdminDiagnosticoQuestao[]; topicosDisponiveis: any[]; criteriosNivel: any }> {
    const res = await request<{ sucesso: boolean; questoes: AdminDiagnosticoQuestao[]; topicosDisponiveis: any[]; criteriosNivel: any }>('/api/admin/diagnostico');
    return {
      questoes: res.questoes || [],
      topicosDisponiveis: res.topicosDisponiveis || [],
      criteriosNivel: res.criteriosNivel || {}
    };
  },
  async criarQuestaoDiagnostico(data: Partial<AdminDiagnosticoQuestao>): Promise<AdminDiagnosticoQuestao> {
    const res = await request<{ sucesso: boolean; questao: AdminDiagnosticoQuestao }>('/api/admin/diagnostico/questoes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.questao;
  },
  async atualizarQuestaoDiagnostico(id: string, data: Partial<AdminDiagnosticoQuestao>): Promise<AdminDiagnosticoQuestao> {
    const res = await request<{ sucesso: boolean; questao: AdminDiagnosticoQuestao }>(`/api/admin/diagnostico/questoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.questao;
  },
  async excluirQuestaoDiagnostico(id: string): Promise<void> {
    await request(`/api/admin/diagnostico/questoes/${id}`, { method: 'DELETE' });
  },

  // Redações (Correção e Temas)
  async getRedacoes(status?: string): Promise<any[]> {
    const url = status ? `/api/admin/redacoes?status=${encodeURIComponent(status)}` : '/api/admin/redacoes';
    const res = await request<{ sucesso: boolean; redacoes: any[] }>(url);
    return res.redacoes || [];
  },
  async corrigirRedacao(id: string, data: { notaGeral: number; feedbackProfessora: string; competencias?: any }): Promise<any> {
    const res = await request<{ sucesso: boolean; redacao: any }>(`/api/admin/redacoes/${id}/corrigir`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.redacao;
  },
  async getTemasRedacao(): Promise<AdminTemaRedacao[]> {
    const res = await request<{ sucesso: boolean; temas: AdminTemaRedacao[] }>('/api/admin/redacoes/temas');
    return res.temas || [];
  },
  async criarTemaRedacao(data: Partial<AdminTemaRedacao>): Promise<AdminTemaRedacao> {
    const res = await request<{ sucesso: boolean; tema: AdminTemaRedacao }>('/api/admin/redacoes/temas', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.tema;
  },
  async atualizarTemaRedacao(id: string, data: Partial<AdminTemaRedacao>): Promise<AdminTemaRedacao> {
    const res = await request<{ sucesso: boolean; tema: AdminTemaRedacao }>(`/api/admin/redacoes/temas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.tema;
  },
  async excluirTemaRedacao(id: string): Promise<void> {
    await request(`/api/admin/redacoes/temas/${id}`, { method: 'DELETE' });
  },

  // Materiais de Apoio
  async getMateriais(): Promise<AdminMaterialApoio[]> {
    const res = await request<{ sucesso: boolean; materiais: AdminMaterialApoio[] }>('/api/admin/materiais-apoio');
    return res.materiais || [];
  },
  async criarMaterial(data: Partial<AdminMaterialApoio>): Promise<AdminMaterialApoio> {
    const res = await request<{ sucesso: boolean; material: AdminMaterialApoio }>('/api/admin/materiais-apoio', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.material;
  },
  async atualizarMaterial(id: string, data: Partial<AdminMaterialApoio>): Promise<AdminMaterialApoio> {
    const res = await request<{ sucesso: boolean; material: AdminMaterialApoio }>(`/api/admin/materiais-apoio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.material;
  },
  async excluirMaterial(id: string): Promise<void> {
    await request(`/api/admin/materiais-apoio/${id}`, { method: 'DELETE' });
  },

  // Alunos & Aprovação de Planos
  async getAlunos(): Promise<AdminAluno[]> {
    const res = await request<{ sucesso: boolean; alunos: AdminAluno[] }>('/api/admin/alunos');
    return res.alunos || [];
  },
  async aprovarPlanoAluno(id: string, plano?: string): Promise<{ sucesso: boolean; aluno: any; mensagem: string }> {
    return request(`/api/admin/alunos/${id}/aprovar`, {
      method: 'POST',
      body: JSON.stringify({ plano })
    });
  },
  async atualizarStatusPlano(id: string, statusPlano: string, plano?: string): Promise<{ sucesso: boolean; aluno: any; mensagem: string }> {
    return request(`/api/admin/alunos/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ statusPlano, plano })
    });
  }
};
