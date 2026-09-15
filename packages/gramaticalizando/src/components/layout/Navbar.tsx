import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, ArrowRight, User } from 'lucide-react';
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
        backgroundColor: 'rgba(9, 9, 11, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'border-color var(--transition-fast)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem'
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <BookOpen size={20} color="#ffffff" />
          </div>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}
          >
            Gramaticalizando<span style={{ color: 'var(--accent-hover)' }}>.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="desktop-nav"
        >
          <a
            href="#modulos"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Módulos
          </a>
          <a
            href="#metodologia"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Metodologia
          </a>
          <a
            href="#planos"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Planos
          </a>
          <a
            href="#faq"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Dúvidas
          </a>
        </nav>

        {/* CTA Actions */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1rem'
          }}
          className="desktop-actions"
        >
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              icon={<User size={16} />}
              onClick={() => navigate(user?.perfil === 'professor' ? '/professor' : '/home')}
            >
              Meu Painel ({user?.nome.split(' ')[0]})
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Entrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={16} />}
                onClick={() => navigate('/registro')}
              >
                Começar Agora
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            padding: '8px',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-sm)'
          }}
          className="mobile-toggle"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-1)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <a
            href="#modulos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: 'var(--text-primary)', padding: '0.5rem 0' }}
          >
            Módulos
          </a>
          <a
            href="#metodologia"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: 'var(--text-primary)', padding: '0.5rem 0' }}
          >
            Metodologia
          </a>
          <a
            href="#planos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: 'var(--text-primary)', padding: '0.5rem 0' }}
          >
            Planos
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: 'var(--text-primary)', padding: '0.5rem 0' }}
          >
            Dúvidas Frequentes
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            {isAuthenticated ? (
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(user?.perfil === 'professor' ? '/professor' : '/home');
                }}
              >
                Acessar Meu Painel
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Entrar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/registro');
                  }}
                >
                  Começar Agora
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
