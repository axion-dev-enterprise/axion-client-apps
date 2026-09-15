import { request } from './client';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ sucesso: boolean; usuario: User }> {
    return request('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async register(credentials: RegisterCredentials): Promise<{ sucesso: boolean; usuario: User }> {
    return request('/api/registro', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async me(): Promise<{ autenticado: boolean; usuario?: User }> {
    return request('/api/me');
  },

  async logout(): Promise<{ sucesso: boolean }> {
    return request('/api/logout', {
      method: 'POST'
    });
  },

  async adminLogin(usuario: string, senha: string): Promise<{ sucesso: boolean; admin: any }> {
    return request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, senha })
    });
  }
};
