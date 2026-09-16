export interface Aula {
  id: string;
  moduloId: string;
  titulo: string;
  subtitulo?: string;
  conteudo?: string;
  duracao?: string;
  ordem: number;
  completa?: boolean;
  videoUrl?: string;
  materialPdfUrl?: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  icone?: string;
  aulas: Aula[];
}

export interface Exercicio {
  id: string;
  aulaId?: string;
  moduloId?: string;
  enunciado: string;
  alternativas: string[];
  respostaCorreta: number; // índice 0-3
  explicacao: string;
}

export interface Simulado {
  id: string;
  titulo: string;
  descricao: string;
  totalQuestoes: number;
  tempoMinutos: number;
  questoes: Exercicio[];
}

export interface CronogramaItem {
  id: string;
  diaSemana: string;
  modulo: string;
  aula: string;
  duracao: string;
  status: 'concluido' | 'pendente' | 'em_andamento';
}

export interface MaterialApoio {
  id: string;
  titulo: string;
  categoria: string;
  tipo: 'PDF' | 'Resumo' | 'Mapa Mental' | 'Tabela';
  tamanho: string;
  downloadUrl: string;
}
