import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authApi } from '../api/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
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
        if ((res.autenticado || res.sucesso) && res.usuario) {
          const usr: User = {
            ...res.usuario,
            perfil: res.usuario.perfil || (res.usuario.tipo === 'admin' ? 'professor' : 'aluno')
          };
          setUser(usr);
          localStorage.setItem('gramaticalizando_user', JSON.stringify(usr));
        } else {
          // Checar se há usuário em localStorage de fallback
          const saved = localStorage.getItem('gramaticalizando_user');
          if (saved) {
            const parsed = JSON.parse(saved);
            const usr: User = {
              ...parsed,
              perfil: parsed.perfil || (parsed.tipo === 'admin' ? 'professor' : 'aluno')
            };
            setUser(usr);
          }
        }
      } catch {
        const saved = localStorage.getItem('gramaticalizando_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const usr: User = {
              ...parsed,
              perfil: parsed.perfil || (parsed.tipo === 'admin' ? 'professor' : 'aluno')
            };
            setUser(usr);
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
        const usr: User = {
          ...res.usuario,
          perfil: res.usuario.perfil || (res.usuario.tipo === 'admin' ? 'professor' : 'aluno')
        };
        setUser(usr);
        localStorage.setItem('gramaticalizando_user', JSON.stringify(usr));
        showToast(`Bem-vindo de volta, ${usr.nome}!`, 'success');
        return usr;
      }
      throw new Error('Falha ao autenticar.');
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
        const usr: User = {
          ...res.usuario,
          perfil: res.usuario.perfil || (res.usuario.tipo === 'admin' ? 'professor' : 'aluno')
        };
        setUser(usr);
        localStorage.setItem('gramaticalizando_user', JSON.stringify(usr));
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

  const refreshUser = async (): Promise<User | null> => {
    try {
      const res = await authApi.me();
      if ((res.autenticado || res.sucesso) && res.usuario) {
        const usr: User = {
          ...res.usuario,
          perfil: res.usuario.perfil || (res.usuario.tipo === 'admin' ? 'professor' : 'aluno')
        };
        setUser(usr);
        localStorage.setItem('gramaticalizando_user', JSON.stringify(usr));
        return usr;
      }
    } catch (err) {
      console.warn('Erro ao atualizar dados do usuário:', err);
    }
    return user;
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
        refreshUser
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
