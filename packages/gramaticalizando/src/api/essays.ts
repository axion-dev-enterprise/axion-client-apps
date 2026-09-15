import { request } from './client';
import { Redacao, TemaRedacao } from '../types/essay';

export const essaysApi = {
  async getTopics(): Promise<TemaRedacao[]> {
    try {
      const temas = await request<TemaRedacao[]>('/api/aluno/redacoes/temas');
      if (Array.isArray(temas) && temas.length > 0) return temas;
    } catch {}

    return [
      {
        id: 'tema-1',
        titulo: 'Os desafios da inteligência artificial e a preservação da autoria no Brasil',
        categoria: 'Tecnologia & Sociedade',
        descricao: 'A partir da leitura dos textos motivadores e com base nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo sobre o impacto das ferramentas de IA generativa.',
        textosMotivadores: [
          'Texto I: O avanço rápido de modelos de linguagem redefiniu a produção textual e acadêmica.',
          'Texto II: Dados do CETIC.br indicam que mais de 60% dos estudantes já utilizaram IA para auxílio em tarefas escolares.'
        ],
        prazo: '30/11/2026'
      },
      {
        id: 'tema-2',
        titulo: 'A importância da valorização da norma culta e o combate ao preconceito linguístico',
        categoria: 'Linguagem & Educação',
        descricao: 'Discuta como a garantia do acesso pleno à variante padrão da língua portuguesa convive com o respeito à diversidade e às variedades regionais.',
        textosMotivadores: [
          'Texto I: Marcos Bagno pontua que o preconceito linguístico perpetua desigualdades sociais veladas.',
          'Texto II: A proficiência textual é um dos principais determinantes de empregabilidade e ascensão cidadã.'
        ],
        prazo: '15/12/2026'
      }
    ];
  },

  async getMyEssays(): Promise<Redacao[]> {
    try {
      const list = await request<Redacao[]>('/api/aluno/redacoes');
      if (Array.isArray(list)) return list;
    } catch {}
    return [];
  },

  async submitEssay(data: { temaId: string; temaTitulo: string; texto: string }): Promise<Redacao> {
    return request<Redacao>('/api/aluno/redacoes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
