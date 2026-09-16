import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ProfessorSidebar } from '../components/layout/ProfessorSidebar';
import { ProfessorHeader } from '../components/layout/ProfessorHeader';
import { useAuth } from '../context/AuthContext';

export const ProfessorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        navigate('/login');
      } else if (user.perfil !== 'professor' && user.tipo !== 'admin') {
        navigate('/home');
      }
    }
  }, [user, isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-canvas)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Carregando painel docente...</span>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const getPageTitle = () => {
    if (location.pathname.includes('/alunos')) return 'Alunos Matriculados';
    if (location.pathname.includes('/aulas')) return 'Gerenciamento de Módulos & Aulas';
    if (location.pathname.includes('/exercicios')) return 'Banco de Questões & Exercícios';
    if (location.pathname.includes('/simulados')) return 'Simulados & Provas Avaliativas';
    if (location.pathname.includes('/diagnostico')) return 'Diagnóstico Inicial & Nivelamento';
    if (location.pathname.includes('/redacoes')) return 'Correção de Redações & Temas';
    if (location.pathname.includes('/materiais')) return 'Materiais de Apoio & Apostilas';
    return 'Painel de Controle da Professora';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-canvas)' }}>
      <ProfessorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}
        className="professor-content-wrapper"
      >
        <ProfessorHeader
          title={getPageTitle()}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 993px) {
          .professor-content-wrapper {
            margin-left: 260px;
          }
        }
      `}</style>
    </div>
  );
};
