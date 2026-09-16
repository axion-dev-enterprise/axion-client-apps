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
          height: '4.5rem'
        }}
      >
        {/* Logo Oficial Gramaticalizando */}
        <Link
          to="/"
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
              width: '38px',
              height: '38px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
          <span
            style={{
              fontSize: '1.3125rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              color: '#0f172a'
            }}
          >
            Gramaticalizando<span style={{ color: 'var(--accent)' }}>.</span>
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
            href="#diagnostico"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#6b21a8',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#7e22ce')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b21a8')}
          >
            Diagnóstico
          </a>
          <a
            href="#modulos"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#475569',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Módulos
          </a>
          <a
            href="#metodologia"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#475569'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Metodologia
          </a>
          <a
            href="#depoimentos"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#475569',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Resultados
          </a>
          <a
            href="#planos"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#475569'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Planos
          </a>
          <a
            href="#faq"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#475569'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
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
              Meu Painel ({user?.nome?.split(' ')[0] || 'Aluno'})
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
            color: '#0f172a',
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
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <a
            href="#diagnostico"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: '#6b21a8', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Diagnóstico Grátis
          </a>
          <a
            href="#modulos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: '#0f172a', padding: '0.5rem 0' }}
          >
            Módulos
          </a>
          <a
            href="#metodologia"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: '#0f172a', padding: '0.5rem 0' }}
          >
            Metodologia
          </a>
          <a
            href="#depoimentos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: '#0f172a', padding: '0.5rem 0' }}
          >
            Resultados
          </a>
          <a
            href="#planos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: '#0f172a', padding: '0.5rem 0' }}
          >
            Planos
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: '#0f172a', padding: '0.5rem 0' }}
          >
            Dúvidas Frequentes
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
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
