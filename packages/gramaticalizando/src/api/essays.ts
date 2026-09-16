import { request } from './client';
import { Redacao, TemaRedacao } from '../types/essay';

export interface RedacaoAlunoPayload {
  tema: string;
  texto: string;
  arquivoUrl?: string;
}

export const essaysApi = {
  async getTopics(): Promise<TemaRedacao[]> {
    try {
      const res = await request<{ sucesso: boolean; temas: any[] }>('/api/aluno/redacoes/temas');
      if (res && Array.isArray(res.temas)) {
        return res.temas.map((t) => ({
          id: t.id,
          titulo: t.titulo,
          descricao: t.instrucoes || t.descricao || 'Redija um texto dissertativo-argumentativo com base na temática.',
          categoria: t.foco || t.categoria || 'Geral',
          textosMotivadores: t.textosMotivadores || [t.instrucoes || 'Considere a norma culta e a argumentação fundamentada.'],
          prazo: t.prazo || 'Fluxo contínuo'
        }));
      }
    } catch (err) {
      console.warn('Erro ao carregar temas de redação:', err);
    }

    return [];
  },

  async getMyEssays(): Promise<Redacao[]> {
    try {
      const res = await request<{ sucesso: boolean; redacoes: any[] }>('/api/aluno/redacoes');
      if (res && Array.isArray(res.redacoes)) {
        return res.redacoes.map((r) => ({
          id: r.id,
          alunoId: r.usuarioId || '',
          alunoNome: r.alunoNome || 'Aluno',
          temaId: r.id,
          temaTitulo: r.tema,
          texto: r.texto || '',
          arquivoUrl: r.arquivoUrl || undefined,
          status: r.status,
          notaFinal: r.notaGeral || undefined,
          competencias: r.competencias ? {
            gramatica: r.competencias.c1 ?? 0,
            coesao: r.competencias.c2 ?? 0,
            coerencia: r.competencias.c3 ?? 0,
            argumentacao: r.competencias.c4 ?? 0,
            propostaIntervencao: r.competencias.c5 ?? 0
          } : undefined,
          comentariosProfessor: r.feedbackProfessora || undefined,
          enviadaEm: r.criadoEm ? new Date(r.criadoEm).toLocaleDateString('pt-BR') : 'Data não informada',
          corrigidaEm: r.corrigidoEm ? new Date(r.corrigidoEm).toLocaleDateString('pt-BR') : undefined
        }));
      }
    } catch (err) {
      console.warn('Erro ao carregar redações do aluno:', err);
    }
    return [];
  },

  async submitEssay(data: { temaTitulo: string; texto: string; arquivoUrl?: string }): Promise<{ sucesso: boolean; mensagem?: string; redacao?: any }> {
    return request<{ sucesso: boolean; mensagem?: string; redacao?: any }>('/api/aluno/redacoes', {
      method: 'POST',
      body: JSON.stringify({
        tema: data.temaTitulo,
        texto: data.texto,
        arquivoUrl: data.arquivoUrl
      })
    });
  }
};
