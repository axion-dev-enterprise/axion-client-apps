import { request } from './client';

export interface MetaCronograma {
  id: string;
  dia: string;
  modulo: string;
  aula: string;
  duracao: string;
  tipo?: 'teoria' | 'exercicio' | 'redacao' | 'simulado';
  concluido?: boolean;
  concluidoEm?: string;
}

export interface Cronograma {
  id: string;
  titulo: string;
  descricao?: string;
  plano: string;
  dias: MetaCronograma[];
  publicado?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export const cronogramaApi = {
  // Aluno
  async getMeuCronograma(): Promise<Cronograma | null> {
    try {
      const res = await request<{ sucesso: boolean; cronograma: Cronograma }>('/api/aluno/cronograma');
      if (res.sucesso && res.cronograma) return res.cronograma;
    } catch (e) {
      console.warn('Erro ao carregar cronograma do aluno:', e);
    }
    return null;
  },

  async toggleMeta(diaId: string): Promise<{ sucesso: boolean; concluido: boolean; cronograma?: Cronograma }> {
    return request<{ sucesso: boolean; concluido: boolean; cronograma?: Cronograma }>('/api/aluno/cronograma/toggle', {
      method: 'POST',
      body: JSON.stringify({ diaId })
    });
  },

  // Admin
  async listarAdmin(): Promise<Cronograma[]> {
    const res = await request<{ sucesso: boolean; cronogramas: Cronograma[] }>('/api/admin/cronogramas');
    return res.cronogramas || [];
  },

  async criarAdmin(data: Partial<Cronograma>): Promise<Cronograma> {
    const res = await request<{ sucesso: boolean; cronograma: Cronograma }>('/api/admin/cronogramas', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.cronograma;
  },

  async atualizarAdmin(id: string, data: Partial<Cronograma>): Promise<Cronograma> {
    const res = await request<{ sucesso: boolean; cronograma: Cronograma }>(`/api/admin/cronogramas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.cronograma;
  },

  async excluirAdmin(id: string): Promise<boolean> {
    const res = await request<{ sucesso: boolean }>(`/api/admin/cronogramas/${id}`, {
      method: 'DELETE'
    });
    return res.sucesso;
  }
};
