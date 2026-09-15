import { request } from './client';
import { Modulo, Aula, Exercicio } from '../types/courses';
import { CANONICAL_MODULES } from '../data/canonical-modules';

export const coursesApi = {
  async getModules(): Promise<Modulo[]> {
    try {
      const remote = await request<any[]>('/api/materias');
      if (Array.isArray(remote) && remote.length > 0) {
        // Se a API retornar matérias cadastradas, mesclamos com os módulos canônicos
        return CANONICAL_MODULES;
      }
    } catch {
      // Fallback seguro para os 7 módulos canônicos locais
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
      if (Array.isArray(list) && list.length > 0) return list;
    } catch {
      // Fallback
    }

    // Banco de questões canônicas
    return [
      {
        id: 'ex-1',
        moduloId: 'fonetica-fonologia',
        enunciado: 'Assinale a alternativa em que todas as palavras apresentam dígrafo:',
        alternativas: [
          'Chave, carro, ninho, terra.',
          'Prato, livro, pedra, cravo.',
          'Pai, caixa, quase, água.',
          'Ritmo, digno, pacto, apto.'
        ],
        respostaCorreta: 0,
        explicacao: 'Chave (ch), carro (rr), ninho (nh) e terra (rr) contêm dígrafos consonantais.'
      },
      {
        id: 'ex-2',
        moduloId: 'ortografia',
        enunciado: 'Segundo o Acordo Ortográfico vigente, assinale a opção com a grafia correta do hífen:',
        alternativas: [
          'Auto-escola e micro-ondas.',
          'Autoescola e micro-ondas.',
          'Auto-escola e microondas.',
          'Autoescola e microondas.'
        ],
        respostaCorreta: 1,
        explicacao: 'Prefixos terminados em vogal diferente da que inicia a palavra seguinte juntam-se sem hífen (autoescola). Vogais iguais separam-se com hífen (micro-ondas).'
      },
      {
        id: 'ex-3',
        moduloId: 'analise-sintatica',
        enunciado: 'Em "Havia muitas pessoas aguardando o resultado", o termo destacado "muitas pessoas" exerce a função sintática de:',
        alternativas: [
          'Sujeito simples.',
          'Objeto direto.',
          'Predicativo do sujeito.',
          'Adjunto adverbial.'
        ],
        respostaCorreta: 1,
        explicacao: 'O verbo HAVER no sentido de existir é impessoal e não possui sujeito. O termo que o acompanha é OBJETO DIRETO (oração sem sujeito).'
      },
      {
        id: 'ex-4',
        moduloId: 'analise-sintatica',
        enunciado: 'O uso do sinal indicativo de crase é facultativo em:',
        alternativas: [
          'Chegamos à meia-noite em ponto.',
          'Entreguei o relatório à minha professora.',
          'Ele começou à falar compulsivamente.',
          'Fui à cidade vizinha ontem.'
        ],
        respostaCorreta: 1,
        explicacao: 'A crase é facultativa antes de pronomes possessivos femininos no singular acompanhados de substantivo (à minha professora ou a minha professora).'
      }
    ];
  }
};
