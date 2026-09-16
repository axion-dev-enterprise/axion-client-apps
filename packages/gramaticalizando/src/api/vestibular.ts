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

const LOCAL_STORAGE_KEY_VIDEOS = 'gramaticalizando_vestibular_videos';
const LOCAL_STORAGE_KEY_TEMAS = 'gramaticalizando_vestibular_temas';
const LOCAL_STORAGE_KEY_REDACOES = 'gramaticalizando_vestibular_redacoes';

const DEFAULT_VIDEOS: VideoaulaVestibular[] = [
  {
    id: 'vest-vid-01',
    titulo: 'Redação ENEM Nota 1000: Repertório Legitimado e Proposta de Intervenção',
    vestibular: 'ENEM',
    duracao: '45 min',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    descricao: 'Nesta aula magna exclusiva, a Profª Wilma desconstrói os 5 critérios da matriz de correção do ENEM, apresentando conectivos interparágrafos de alto impacto e modelos de tese infalíveis.',
    professor: 'Profª Wilma',
    criadoEm: '2026-09-10T14:00:00.000Z'
  },
  {
    id: 'vest-vid-02',
    titulo: 'Discursiva de Português e Literatura da UERJ: Desvendando a Banca',
    vestibular: 'UERJ',
    duracao: '52 min',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    descricao: 'Guia estratégico para a prova discursiva da UERJ. Como estruturar a argumentação dialética, interpretação textual profunda das obras indicadas e coesão textual refinada.',
    professor: 'Profª Wilma',
    criadoEm: '2026-09-11T16:30:00.000Z'
  },
  {
    id: 'vest-vid-03',
    titulo: 'FUVEST & UNICAMP: Sintaxe Expressiva, Ironia e Coesão Avançada',
    vestibular: 'FUVEST',
    duracao: '38 min',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    descricao: 'Análise das peculiaridades dos vestibulares paulistas. Como fugir do lugar-comum, utilizar figuras de sintaxe com propriedade e garantir nota máxima na expressão escrita.',
    professor: 'Profª Wilma',
    criadoEm: '2026-09-12T10:15:00.000Z'
  },
  {
    id: 'vest-vid-04',
    titulo: 'Funções da Linguagem e Variação Linguística Aplicada aos Vestibulares',
    vestibular: 'Geral',
    duracao: '40 min',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    descricao: 'Revisão focada nos temas mais recorrentes de Língua Portuguesa em todos os exames vestibulares do país com resolução comentada de questões clássicas.',
    professor: 'Profª Wilma',
    criadoEm: '2026-09-13T11:00:00.000Z'
  }
];

const DEFAULT_TEMAS: TemaVestibular[] = [
  {
    id: 'vest-tema-01',
    titulo: 'A democratização do acesso aos avanços da inteligência artificial e a inclusão digital no Brasil',
    vestibular: 'ENEM',
    ano: '2026',
    instrucoes: 'Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema, apresentando proposta de intervenção que respeite os direitos humanos.',
    textosMotivadores: 'Texto I: A revolução da inteligência artificial redefine postos de trabalho e métodos educacionais em todo o globo...\nTexto II: Dados do Cetic.br apontam disparidade severa no acesso a ferramentas tecnológicas entre classes socioeconômicas no Brasil.',
    dataLimite: '2026-11-30'
  },
  {
    id: 'vest-tema-02',
    titulo: 'A persistência da desigualdade de gênero no trabalho de cuidado não remunerado',
    vestibular: 'ENEM',
    ano: '2026',
    instrucoes: 'Redija texto dissertativo-argumentativo analisando como a sobrecarga do trabalho invisível afeta o desenvolvimento educacional e profissional das mulheres brasileiras.',
    textosMotivadores: 'Texto I: O trabalho reprodutivo e de cuidado sustenta as engrenagens econômicas da sociedade contemporânea...',
    dataLimite: '2026-10-31'
  },
  {
    id: 'vest-tema-03',
    titulo: 'O individualismo exacerbado e o colapso do sentimento comunitário na vida urbana',
    vestibular: 'UERJ',
    ano: '2026',
    instrucoes: 'Elabore uma dissertação argumentativa com posicionamento crítico e reflexivo sobre a perda da coletividade nas metrópoles contemporâneas, dialogando com os conceitos de cidadania e ética.',
    textosMotivadores: 'Texto I: Fragmento de obra literária da UERJ destacando o isolamento dos indivíduos em condomínios e telas digitais...',
    dataLimite: '2026-12-15'
  },
  {
    id: 'vest-tema-04',
    titulo: 'A ciência sob suspeita: as fronteiras entre o ceticismo legítimo e o negacionismo perigoso',
    vestibular: 'FUVEST',
    ano: '2026',
    instrucoes: 'Apresente uma reflexão densa e fundamentada acerca dos limites do questionamento científico e a disseminação de narrativas anticientíficas na esfera pública.',
    textosMotivadores: 'Texto I: A epistemologia moderna fundamenta-se na dúvida metódica, contudo o obscurantismo contemporâneo apropria-se dessa dúvida para desarticular consensos civilizatórios comprovados...',
    dataLimite: '2026-12-20'
  }
];

export const vestibularApi = {
  async getConteudo(): Promise<{ videoaulas: VideoaulaVestibular[]; temas: TemaVestibular[] }> {
    try {
      const res = await request<VestibularConteudoResponse>('/api/vestibular/conteudo');
      if (res && res.sucesso && Array.isArray(res.videoaulas)) {
        localStorage.setItem(LOCAL_STORAGE_KEY_VIDEOS, JSON.stringify(res.videoaulas));
        localStorage.setItem(LOCAL_STORAGE_KEY_TEMAS, JSON.stringify(res.temas));
        return { videoaulas: res.videoaulas, temas: res.temas };
      }
    } catch {}

    const localVideos = localStorage.getItem(LOCAL_STORAGE_KEY_VIDEOS);
    const localTemas = localStorage.getItem(LOCAL_STORAGE_KEY_TEMAS);
    return {
      videoaulas: localVideos ? JSON.parse(localVideos) : DEFAULT_VIDEOS,
      temas: localTemas ? JSON.parse(localTemas) : DEFAULT_TEMAS
    };
  },

  async getMyEssays(): Promise<RedacaoVestibular[]> {
    try {
      const res = await request<{ sucesso: boolean; redacoes: RedacaoVestibular[] }>('/api/aluno/vestibular/redacoes');
      if (res && res.sucesso && Array.isArray(res.redacoes)) {
        return res.redacoes;
      }
    } catch {}

    const localRedacoes = localStorage.getItem(LOCAL_STORAGE_KEY_REDACOES);
    return localRedacoes ? JSON.parse(localRedacoes) : [];
  },

  async submitEssay(payload: {
    temaId: string;
    vestibular: string;
    texto?: string;
    arquivoNome?: string;
    arquivoUrl?: string;
  }): Promise<RedacaoVestibular> {
    try {
      const res = await request<{ sucesso: boolean; redacao: RedacaoVestibular }>('/api/aluno/vestibular/redacoes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.redacao) {
        const localRedacoes: RedacaoVestibular[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_REDACOES) || '[]');
        localStorage.setItem(LOCAL_STORAGE_KEY_REDACOES, JSON.stringify([res.redacao, ...localRedacoes]));
        return res.redacao;
      }
    } catch {}

    // Fallback offline-first
    const fallbackRedacao: RedacaoVestibular = {
      id: 'vest-red-' + Math.random().toString(36).substring(2, 9),
      alunoId: 'aluno-demo',
      alunoNome: 'Aluno Demo',
      alunoEmail: 'aluno@gramaticalizando.com.br',
      temaId: payload.temaId,
      temaTitulo: 'Redação de Vestibular',
      vestibular: payload.vestibular,
      arquivoNome: payload.arquivoNome,
      arquivoUrl: payload.arquivoUrl,
      texto: payload.texto,
      status: 'pendente',
      notaFinal: null,
      criterios: null,
      feedbackProfessora: '',
      enviadoEm: new Date().toISOString()
    };
    const localRedacoes: RedacaoVestibular[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_REDACOES) || '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_REDACOES, JSON.stringify([fallbackRedacao, ...localRedacoes]));
    return fallbackRedacao;
  },

  // Admin APIs
  async getAdminData(): Promise<VestibularAdminResponse> {
    try {
      const res = await request<VestibularAdminResponse>('/api/admin/vestibular');
      if (res && res.sucesso) {
        return res;
      }
    } catch {}

    const localVideos = localStorage.getItem(LOCAL_STORAGE_KEY_VIDEOS);
    const localTemas = localStorage.getItem(LOCAL_STORAGE_KEY_TEMAS);
    const localRedacoes = localStorage.getItem(LOCAL_STORAGE_KEY_REDACOES);
    return {
      sucesso: true,
      videoaulas: localVideos ? JSON.parse(localVideos) : DEFAULT_VIDEOS,
      temas: localTemas ? JSON.parse(localTemas) : DEFAULT_TEMAS,
      redacoes: localRedacoes ? JSON.parse(localRedacoes) : []
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
