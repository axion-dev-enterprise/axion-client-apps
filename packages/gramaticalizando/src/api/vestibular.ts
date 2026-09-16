import { request } from './client';

export interface VideoaulaVestibular {
  id: string;
  titulo: string;
  vestibular: 'ENEM' | 'UERJ' | 'FUVEST' | 'Geral' | string;
  duracao: string;
  url: string;
  descricao: string;
  professor?: string;
  criadoEm?: string;
}

export interface TemaVestibular {
  id: string;
  titulo: string;
  vestibular: 'ENEM' | 'UERJ' | 'FUVEST' | 'Geral' | string;
  ano?: string;
  instrucoes: string;
  textosMotivadores?: string;
  dataLimite?: string;
}

export interface RedacaoVestibular {
  id: string;
  alunoId?: string;
  alunoNome?: string;
  alunoEmail?: string;
  temaId: string;
  temaTitulo: string;
  vestibular: string;
  arquivoNome?: string;
  arquivoUrl?: string;
  texto?: string;
  status: 'pendente' | 'em_correcao' | 'corrigida';
  notaFinal?: number | null;
  criterios?: {
    c1?: number;
    c2?: number;
    c3?: number;
    c4?: number;
    c5?: number;
    [key: string]: number | undefined;
  } | null;
  feedbackProfessora?: string;
  enviadoEm: string;
  corrigidoEm?: string | null;
}

export interface VestibularConteudoResponse {
  sucesso: boolean;
  videoaulas: VideoaulaVestibular[];
  temas: TemaVestibular[];
}

export interface VestibularAdminResponse {
  sucesso: boolean;
  videoaulas: VideoaulaVestibular[];
  temas: TemaVestibular[];
  redacoes: RedacaoVestibular[];
}

export const vestibularApi = {
  async getConteudo(): Promise<{ videoaulas: VideoaulaVestibular[]; temas: TemaVestibular[] }> {
    try {
      const res = await request<VestibularConteudoResponse>('/api/vestibular/conteudo');
      if (res && res.sucesso && Array.isArray(res.videoaulas)) {
        return { videoaulas: res.videoaulas, temas: res.temas || [] };
      }
    } catch (err) {
      console.warn('Erro ao carregar conteúdos de vestibular:', err);
    }

    return { videoaulas: [], temas: [] };
  },

  async getMyEssays(): Promise<RedacaoVestibular[]> {
    try {
      const res = await request<{ sucesso: boolean; redacoes: RedacaoVestibular[] }>('/api/aluno/vestibular/redacoes');
      if (res && res.sucesso && Array.isArray(res.redacoes)) {
        return res.redacoes;
      }
    } catch (err) {
      console.warn('Erro ao carregar redações do aluno:', err);
    }

    return [];
  },

  async submitEssay(payload: {
    temaId: string;
    vestibular: string;
    texto?: string;
    arquivoNome?: string;
    arquivoUrl?: string;
  }): Promise<RedacaoVestibular> {
    const res = await request<{ sucesso: boolean; redacao: RedacaoVestibular }>('/api/aluno/vestibular/redacoes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.redacao) {
      return res.redacao;
    }
    throw new Error('Falha ao enviar redação para o servidor.');
  },

  // Admin APIs
  async getAdminData(): Promise<VestibularAdminResponse> {
    try {
      const res = await request<VestibularAdminResponse>('/api/admin/vestibular');
      if (res && res.sucesso) {
        return res;
      }
    } catch (err) {
      console.warn('Erro ao carregar dados administrativos de vestibular:', err);
    }

    return {
      sucesso: true,
      videoaulas: [],
      temas: [],
      redacoes: []
    };
  },

  async createVideoaula(data: Partial<VideoaulaVestibular>): Promise<void> {
    await request('/api/admin/vestibular/videoaulas', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateVideoaula(id: string, data: Partial<VideoaulaVestibular>): Promise<void> {
    await request(`/api/admin/vestibular/videoaulas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteVideoaula(id: string): Promise<void> {
    await request(`/api/admin/vestibular/videoaulas/${id}`, {
      method: 'DELETE'
    });
  },

  async createTema(data: Partial<TemaVestibular>): Promise<void> {
    await request('/api/admin/vestibular/temas', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateTema(id: string, data: Partial<TemaVestibular>): Promise<void> {
    await request(`/api/admin/vestibular/temas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteTema(id: string): Promise<void> {
    await request(`/api/admin/vestibular/temas/${id}`, {
      method: 'DELETE'
    });
  },

  async corrigirRedacao(
    id: string,
    payload: {
      notaFinal: number;
      criterios?: Record<string, number>;
      feedbackProfessora: string;
    }
  ): Promise<void> {
    await request(`/api/admin/vestibular/redacoes/${id}/corrigir`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }
};
