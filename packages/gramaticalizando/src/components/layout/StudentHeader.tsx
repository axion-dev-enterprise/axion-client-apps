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
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, setDemoUser } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const tabs = [
    { path: '/home', label: 'Início', icon: <Home size={16} /> },
    { path: '/portugues', label: 'Português', icon: <BookOpen size={16} /> },
    { path: '/simulados', label: 'Simulados', icon: <FileCheck2 size={16} /> },
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
        backgroundColor: 'rgba(18, 18, 23, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)'
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Brand */}
          <Link
            to="/home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <BookOpen size={16} color="#ffffff" />
            </div>
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
                backgroundColor: 'rgba(147, 51, 234, 0.15)',
                color: '#c084fc',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(168, 85, 247, 0.3)'
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
                backgroundColor: profileDropdownOpen ? 'var(--bg-surface-hover)' : 'transparent',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-hover)',
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
                  backgroundColor: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-muted)',
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
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>{user?.nome}</p>
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
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Shield size={16} color="#c084fc" />
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
                    textAlign: 'left'
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
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span style={{ color: isActive ? 'var(--accent-hover)' : 'inherit' }}>
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
