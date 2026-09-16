export interface CriteriosNota {
  gramatica: number; // 0-200
  coesao: number; // 0-200
  coerencia: number; // 0-200
  argumentacao: number; // 0-200
  propostaIntervencao: number; // 0-200
}

export interface Redacao {
  id: string;
  alunoId: string;
  alunoNome: string;
  temaId: string;
  temaTitulo: string;
  texto: string;
  status: 'pendente' | 'em_correcao' | 'corrigida';
  notaFinal?: number; // 0-1000
  criterios?: CriteriosNota;
  competencias?: CriteriosNota;
  comentariosProfessor?: string;
  enviadaEm: string;
  corrigidaEm?: string;
}

export interface TemaRedacao {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  textosMotivadores: string[];
  prazo: string;
}
