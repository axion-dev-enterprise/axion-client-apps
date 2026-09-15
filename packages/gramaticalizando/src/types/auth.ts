export type UserRole = 'aluno' | 'professor' | 'admin';

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: UserRole;
  plano?: 'iniciante' | 'medio' | 'pro';
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
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
