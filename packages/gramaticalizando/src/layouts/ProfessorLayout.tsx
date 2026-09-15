import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ProfessorSidebar } from '../components/layout/ProfessorSidebar';
import { ProfessorHeader } from '../components/layout/ProfessorHeader';
import { useAuth } from '../context/AuthContext';

export const ProfessorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setDemoUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.perfil !== 'professor') {
      setDemoUser('professor');
    }
  }, [user, setDemoUser]);

  const getPageTitle = () => {
    if (location.pathname.includes('/alunos')) return 'Alunos Matriculados';
    if (location.pathname.includes('/redacoes')) return 'Correção de Redações';
    if (location.pathname.includes('/aulas')) return 'Gerenciamento de Aulas';
    if (location.pathname.includes('/exercicios')) return 'Banco de Questões';
    if (location.pathname.includes('/simulados')) return 'Simulados & Avaliações';
    return 'Painel de Controle do Professor';
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
