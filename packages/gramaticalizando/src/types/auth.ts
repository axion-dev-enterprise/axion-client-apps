export type UserRole = 'aluno' | 'professor' | 'admin';
export type PlanoTipo = 'iniciante' | 'medio' | 'pro';
export type StatusPlano = 'pendente' | 'ativo' | 'recusado' | 'gratuito';

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: UserRole;
  tipo?: string;
  plano?: PlanoTipo;
  statusPlano?: StatusPlano;
  codigoReferencia?: string;
  dataSolicitacaoPlano?: string;
  dataAprovacaoPlano?: string;
  avatar?: string;
  criadoEm?: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  plano?: PlanoTipo;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
