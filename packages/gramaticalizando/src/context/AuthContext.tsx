import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authApi } from '../api/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setDemoUser: (role: 'aluno' | 'professor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Checar sessão ativa no backend
    const checkAuth = async () => {
      try {
        const res = await authApi.me();
        if (res.autenticado && res.usuario) {
          setUser(res.usuario);
        } else {
          // Checar se há usuário em localStorage de fallback
          const saved = localStorage.getItem('gramaticalizando_user');
          if (saved) {
            setUser(JSON.parse(saved));
          }
        }
      } catch {
        const saved = localStorage.getItem('gramaticalizando_user');
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {}
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.sucesso && res.usuario) {
        setUser(res.usuario);
        localStorage.setItem('gramaticalizando_user', JSON.stringify(res.usuario));
        showToast(`Bem-vindo de volta, ${res.usuario.nome}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao realizar login', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(credentials);
      if (res.sucesso && res.usuario) {
        setUser(res.usuario);
        localStorage.setItem('gramaticalizando_user', JSON.stringify(res.usuario));
        showToast('Conta criada com sucesso! Aproveite seus estudos.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar conta', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    localStorage.removeItem('gramaticalizando_user');
    showToast('Sessão encerrada com sucesso.', 'info');
  };

  const setDemoUser = (role: 'aluno' | 'professor') => {
    const demoUser: User = role === 'professor' ? {
      id: 'prof-demo',
      nome: 'Prof. Marcos Silva',
      email: 'professor@gramaticalizando.com.br',
      perfil: 'professor'
    } : {
      id: 'aluno-demo',
      nome: 'Lucas Oliveira',
      email: 'aluno@gramaticalizando.com.br',
      perfil: 'aluno',
      plano: 'pro'
    };
    setUser(demoUser);
    localStorage.setItem('gramaticalizando_user', JSON.stringify(demoUser));
    showToast(`Ambiente demonstrativo ativado como ${role === 'professor' ? 'Professor' : 'Aluno'}!`, 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
