import { request } from './client';
import { Modulo, Aula, Exercicio } from '../types/courses';
import { CANONICAL_MODULES } from '../data/canonical-modules';

export interface DashboardAlunoResponse {
  usuario: {
    id: string;
    nome: string;
    email: string;
    plano: string;
  };
  diagnostico?: any;
  cronogramaSemanal?: any;
  estatisticas: {
    aulasConcluidas: number;
    exerciciosFeitos: number;
    taxaAcerto: number;
    trilhasAtivas: number;
    sequencia: number;
  };
  cursos: Array<{
    id: string;
    nome: string;
    totalAulas: number;
    aulasConcluidas: number;
    progresso: number;
    aulas: Array<{
      id: string;
      titulo: string;
      conteudo?: string;
      concluida: boolean;
    }>;
  }>;
  atividades: Array<{
    id?: string;
    tipo: string;
    titulo: string;
    data?: string;
    criadoEm?: string;
  }>;
}

export const coursesApi = {
  async getModules(): Promise<Modulo[]> {
    try {
      const remote = await request<any[]>('/api/materias');
      if (Array.isArray(remote) && remote.length > 0) {
        return CANONICAL_MODULES;
      }
    } catch {
      // Fallback seguro para os módulos canônicos locais
    }
    return CANONICAL_MODULES;
  },

  async getLesson(moduloId: string, lessonId: string): Promise<Aula | undefined> {
    const mod = CANONICAL_MODULES.find(m => m.id === moduloId);
    return mod?.aulas.find(a => a.id === lessonId);
  },

  async getExercises(moduloId?: string): Promise<Exercicio[]> {
    try {
      const url = moduloId ? `/api/exercicios?materia=${encodeURIComponent(moduloId)}` : '/api/exercicios';
      const list = await request<Exercicio[]>(url);
      if (Array.isArray(list)) return list;
    } catch {}

    return [];
  },

  async concluirAula(aulaId: string): Promise<{ sucesso: boolean; mensagem?: string; concluida?: boolean; totalAulasConcluidas?: number }> {
    return request<{ sucesso: boolean; mensagem?: string; concluida?: boolean; totalAulasConcluidas?: number }>(`/api/aluno/aulas/${aulaId}/concluir`, {
      method: 'POST'
    });
  },

  async getDashboardAluno(): Promise<DashboardAlunoResponse | null> {
    try {
      const res = await request<{ sucesso: boolean; dashboard: DashboardAlunoResponse }>('/api/dashboard/aluno');
      if (res && res.sucesso && res.dashboard) {
        return res.dashboard;
      }
    } catch (err) {
      console.warn('Erro ao carregar dashboard do aluno:', err);
    }
    return null;
  }
};
