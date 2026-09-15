import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { StudentHeader } from '../components/layout/StudentHeader';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

export const StudentLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user, setDemoUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Se não autenticado, definir usuário de demonstração para facilitar navegação fluida ou redirecionar
      setDemoUser('aluno');
    }
  }, [isLoading, isAuthenticated, setDemoUser]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      <StudentHeader />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
