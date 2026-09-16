import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PenTool,
  BookOpen,
  HelpCircle,
  FileCheck,
  Sparkles,
  Download,
  ArrowLeft,
  LogOut,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface ProfessorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessorSidebar: React.FC<ProfessorSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/professor', label: 'Visão Geral', icon: <LayoutDashboard size={18} />, exact: true },
    { path: '/professor/alunos', label: 'Alunos Matriculados', icon: <Users size={18} /> },
    { path: '/professor/vestibular', label: 'Vestibular', icon: <GraduationCap size={18} /> },
    { path: '/professor/aulas', label: 'Módulos & Aulas', icon: <BookOpen size={18} /> },
    { path: '/professor/exercicios', label: 'Banco de Questões', icon: <HelpCircle size={18} /> },
    { path: '/professor/simulados', label: 'Simulados & Provas', icon: <FileCheck size={18} /> },
    { path: '/professor/diagnostico', label: 'Diagnóstico & Nivelamento', icon: <Sparkles size={18} /> },
    { path: '/professor/redacoes', label: 'Correção de Redações', icon: <PenTool size={18} /> },
    { path: '/professor/materiais', label: 'Materiais de Apoio', icon: <Download size={18} /> }
  ];

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
          className="professor-backdrop"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-subtle)',
          boxShadow: '1px 0 3px 0 rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform var(--transition-normal)'
        }}
        className={`professor-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <img
              src="/assets/img/logo.png"
              alt="Gramaticalizando"
              style={{
                height: '2rem',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Docência
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Painel do Professor
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            className="mobile-close"
            aria-label="Fechar Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: '1.25rem 0.875rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            overflowY: 'auto'
          }}
        >
          {menuItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <button
            onClick={() => handleNav('/home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Portal do Aluno</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              color: 'var(--danger)',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 992px) {
          .professor-sidebar {
            transform: translateX(-100%);
          }
          .professor-sidebar.open {
            transform: translateX(0);
          }
        }
        @media (min-width: 993px) {
          .mobile-close { display: none !important; }
          .professor-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
};
