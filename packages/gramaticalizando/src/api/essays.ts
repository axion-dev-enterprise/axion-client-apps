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
      if (res && Array.isArray(res.temas) && res.temas.length > 0) {
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
      console.warn('Erro ao carregar temas do backend, usando temas canônicos:', err);
    }

    return [
      {
        id: 'tema-enem-01',
        titulo: 'Os desafios da mobilidade urbana sustentável no Brasil',
        categoria: 'ENEM / Vestibulares',
        descricao: 'A partir da leitura dos textos motivadores e com base nos conhecimentos construídos ao longo de sua formação, redija texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema, apresentando proposta de intervenção que respeite os direitos humanos.',
        textosMotivadores: [
          'Texto I: O tráfego nas grandes metrópoles brasileiras é um dos maiores emissores de poluentes e gera perdas bilionárias em produtividade.',
          'Texto II: Dados do IPEA mostram a urgência da integração entre transporte ferroviário, ciclofaixas e eletrificação de frotas.'
        ],
        prazo: 'Fluxo contínuo'
      },
      {
        id: 'tema-concurso-01',
        titulo: 'O papel do servidor público na garantia dos direitos fundamentais do cidadão',
        categoria: 'Concursos Públicos',
        descricao: 'Elabore um texto dissertativo-argumentativo abordando os princípios da legalidade, impessoalidade, moralidade, publicidade e eficiência (LIMPE), e como a atuação proba e célere do servidor público impacta diretamente a concretização dos direitos do cidadão.',
        textosMotivadores: [
          'Texto I: A Carta Magna de 1988 estabelece o serviço público como instrumento primário da cidadania.',
          'Texto II: A ética e a transparência são balizas inegociáveis para a administração pública moderna.'
        ],
        prazo: 'Fluxo contínuo'
      },
      {
        id: 'tema-enem-02',
        titulo: 'A inteligência artificial e os impactos no trabalho e na ética contemporânea',
        categoria: 'Atualidades & Tecnologia',
        descricao: 'Discuta como a automação algorítmica e a IA generativa desafiam a formação profissional, a regulação estatal e as relações interpessoais na sociedade atual.',
        textosMotivadores: [
          'Texto I: A rápida expansão de LLMs redefine a rotina produtiva e exige pensamento crítico apurado.'
        ],
        prazo: 'Fluxo contínuo'
      }
    ];
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
