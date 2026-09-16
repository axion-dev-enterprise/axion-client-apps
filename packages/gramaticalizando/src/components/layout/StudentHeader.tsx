import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Home,
  FileCheck2,
  PenTool,
  Calendar,
  FolderDown,
  Video,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Shield,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, setDemoUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const tabs = [
    { path: '/home', label: 'Início', icon: <Home size={16} /> },
    { path: '/vestibular', label: 'Vestibular', icon: <GraduationCap size={16} /> },
    { path: '/portugues', label: 'Português', icon: <BookOpen size={16} /> },
    { path: '/simulados', label: 'Simulados', icon: <FileCheck2 size={16} /> },
    { path: '/aluno/diagnostico', label: 'Diagnóstico', icon: <Sparkles size={16} /> },
    { path: '/redacao', label: 'Redação', icon: <PenTool size={16} /> },
    { path: '/cronograma', label: 'Cronograma', icon: <Calendar size={16} /> },
    { path: '/materiais', label: 'Materiais', icon: <FolderDown size={16} /> },
    { path: '/videoaulas', label: 'Videoaulas', icon: <Video size={16} /> }
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="container">
        {/* Linha Superior: Logo + Ações do Usuário */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Brand */}
          <Link
            to="/home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none'
            }}
          >
            <img
              src="/assets/img/logo.png"
              alt="Gramaticalizando"
              style={{
                height: '2.25rem',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}
            >
              Gramaticalizando
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                padding: '0.15rem 0.5rem',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--accent-border)'
              }}
            >
              Portal do Aluno
            </span>
          </Link>

          {/* User Profile dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.375rem 0.625rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: profileDropdownOpen ? 'var(--bg-surface-2)' : 'transparent',
                transition: 'background-color var(--transition-fast)',
                cursor: 'pointer',
                border: '1px solid transparent'
              }}
            >
              <div
                style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8125rem'
                }}
              >
                {getInitials(user?.nome)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.nome || 'Aluno'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Plano {user?.plano ? user.plano.toUpperCase() : 'PRO'}
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {profileDropdownOpen && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 0.5rem)',
                  width: '220px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.nome}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/professor');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Shield size={16} color="var(--accent)" />
                  <span>Painel do Professor</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut size={16} />
                  <span>Encerrar Sessão</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Linha Inferior: Abas de Estudo (Tabs) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem'
          }}
        >
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path !== '/home' && location.pathname.startsWith(tab.path));

            return (
              <Link
                key={tab.path}
                to={tab.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
