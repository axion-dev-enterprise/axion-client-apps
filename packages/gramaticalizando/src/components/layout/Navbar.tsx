import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem',
          gap: '1rem'
        }}
      >
        {/* Logo Oficial Gramaticalizando */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            flexShrink: 0,
            minWidth: 'max-content'
          }}
        >
          <img
            src="/assets/img/logo.png"
            alt="Gramaticalizando"
            style={{
              width: '38px',
              height: '38px',
              objectFit: 'contain',
              borderRadius: '8px',
              flexShrink: 0
            }}
          />
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              color: '#0f172a',
              whiteSpace: 'nowrap'
            }}
          >
            Gramaticalizando<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </Link>

        {/* Desktop Nav (>= 1080px) */}
        <nav
          className="desktop-nav"
        >
          <a
            href="#diagnostico"
            className="nav-link nav-link-highlight"
          >
            Diagnóstico
          </a>
          <a
            href="#modulos"
            className="nav-link"
          >
            Módulos
          </a>
          <a
            href="#metodologia"
            className="nav-link"
          >
            Metodologia
          </a>
          <a
            href="#depoimentos"
            className="nav-link"
          >
            Resultados
          </a>
          <a
            href="#planos"
            className="nav-link"
          >
            Planos
          </a>
          <a
            href="#faq"
            className="nav-link"
          >
            Dúvidas
          </a>
        </nav>

        {/* Desktop CTA Actions (>= 1080px) */}
        <div
          className="desktop-actions"
        >
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              icon={<User size={16} />}
              onClick={() => navigate(user?.perfil === 'professor' ? '/professor' : '/home')}
              style={{ whiteSpace: 'nowrap' }}
            >
              Meu Painel ({user?.nome?.split(' ')[0] || 'Aluno'})
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                style={{ whiteSpace: 'nowrap' }}
              >
                Entrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={16} />}
                onClick={() => navigate('/registro')}
                style={{ whiteSpace: 'nowrap' }}
              >
                Começar Agora
              </Button>
            </>
          )}
        </div>

        {/* Tablet / Mobile Quick Action & Hamburger Toggle (< 1080px) */}
        <div className="mobile-header-controls">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              icon={<User size={15} />}
              onClick={() => navigate(user?.perfil === 'professor' ? '/professor' : '/home')}
              className="quick-action-btn"
            >
              Painel
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/login')}
              className="quick-action-btn"
            >
              Entrar
            </Button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <a
              href="#diagnostico"
              onClick={() => setMobileMenuOpen(false)}
              className="drawer-link drawer-link-highlight"
            >
              Diagnóstico Grátis
            </a>
            <a
              href="#modulos"
              onClick={() => setMobileMenuOpen(false)}
              className="drawer-link"
            >
              Módulos do Curso
            </a>
            <a
              href="#metodologia"
              onClick={() => setMobileMenuOpen(false)}
              className="drawer-link"
            >
              Metodologia de Ensino
            </a>
            <a
              href="#depoimentos"
              onClick={() => setMobileMenuOpen(false)}
              className="drawer-link"
            >
              Resultados & Aprovações
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="drawer-link"
            >
              Planos & Matrícula
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="drawer-link"
            >
              Dúvidas Frequentes
            </a>
          </div>

          <div className="drawer-footer">
            {isAuthenticated ? (
              <Button
                variant="primary"
                fullWidth
                icon={<User size={16} />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(user?.perfil === 'professor' ? '/professor' : '/home');
                }}
              >
                Acessar Meu Painel ({user?.nome?.split(' ')[0] || 'Aluno'})
              </Button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <Button
                  variant="primary"
                  fullWidth
                  icon={<ArrowRight size={16} />}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/registro');
                  }}
                >
                  Começar Agora
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Já tenho conta (Entrar)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* Base / Mobile / Tablet (< 1080px) */
        .desktop-nav {
          display: none;
        }
        .desktop-actions {
          display: none;
        }
        .mobile-header-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: #0f172a;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .mobile-toggle:hover {
          background: #f1f5f9;
          color: var(--accent);
          border-color: #cbd5e1;
        }
        .quick-action-btn {
          font-size: 0.8125rem !important;
          padding: 0.375rem 0.75rem !important;
          white-space: nowrap !important;
        }

        /* Desktop Mode (>= 1080px) */
        @media (min-width: 1080px) {
          .desktop-nav {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: clamp(0.75rem, 1.2vw, 1.75rem);
            margin: 0 1rem;
            flex: 1;
            max-width: 660px;
          }
          .desktop-actions {
            display: flex !important;
            align-items: center;
            gap: 0.75rem;
            flex-shrink: 0;
          }
          .mobile-header-controls {
            display: none !important;
          }
        }

        /* Links de Navegação Desktop */
        .nav-link {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #475569;
          white-space: nowrap;
          transition: color var(--transition-fast);
          padding: 0.25rem 0.25rem;
        }
        .nav-link:hover {
          color: var(--accent);
        }
        .nav-link-highlight {
          color: #6b21a8;
          font-weight: 600;
        }
        .nav-link-highlight:hover {
          color: #7e22ce;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 1.25rem 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08);
          animation: slideDownNav 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .drawer-link {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #1e293b;
          padding: 0.625rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        .drawer-link:hover {
          background-color: #f8fafc;
          color: var(--accent);
        }
        .drawer-link-highlight {
          color: #6b21a8;
          font-weight: 600;
          background-color: #faf5ff;
        }
        .drawer-footer {
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        @keyframes slideDownNav {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};
