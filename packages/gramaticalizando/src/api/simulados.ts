import { request } from './client';

export interface SimuladoItemResumo {
  id: string;
  titulo: string;
  descricao: string;
  banca: string;
  tempoMinutos: number;
  totalQuestoes: number;
  criadoEm?: string;
}

export interface SimuladoQuestao {
  id: string;
  enunciado: string;
  alternativas: { id: string; texto: string }[];
}

export interface SimuladoCompleto {
  id: string;
  titulo: string;
  descricao: string;
  banca: string;
  tempoMinutos: number;
  questoes: SimuladoQuestao[];
}

export interface CorrecaoItem {
  id: string;
  respostaAluno: string;
  respostaCorreta: string;
  acertou: boolean;
  explicacao: string;
}

export interface ResultadoSimulado {
  total: number;
  corretas: number;
  erradas: number;
  porcentagem: number;
  correcao: CorrecaoItem[];
}

export const simuladosApi = {
  async listar(): Promise<SimuladoItemResumo[]> {
    try {
      const res = await request<{ sucesso: boolean; simulados: SimuladoItemResumo[] }>('/api/simulados');
      if (res.sucesso && Array.isArray(res.simulados)) {
        return res.simulados;
      }
    } catch (err) {
      console.warn('Erro ao buscar simulados na API:', err);
    }
    return [];
  },

  async obterPorId(id: string): Promise<SimuladoCompleto | null> {
    try {
      const res = await request<{ sucesso: boolean; simulado: SimuladoCompleto }>(`/api/simulados/${id}`);
      if (res.sucesso && res.simulado) {
        return res.simulado;
      }
    } catch (err) {
      console.warn('Erro ao obter simulado por ID:', err);
    }
    return null;
  },

  async finalizar(id: string, respostas: Record<string, string>): Promise<ResultadoSimulado | null> {
    const res = await request<{ sucesso: boolean; resultado: ResultadoSimulado }>(`/api/simulados/${id}/finalizar`, {
      method: 'POST',
      body: JSON.stringify({ respostas })
    });
    if (res.sucesso && res.resultado) {
      return res.resultado;
    }
    return null;
  }
};
