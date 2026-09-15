import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        backgroundColor: 'var(--bg-canvas)'
      }}
    >
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <BookOpen size={22} color="#ffffff" />
          </div>
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}
          >
            Gramaticalizando<span style={{ color: 'var(--accent-hover)' }}>.</span>
          </span>
        </Link>
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Outlet />
      </div>

      <div style={{ marginTop: '2.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        <p>© 2026 Gramaticalizando • Todos os direitos reservados.</p>
      </div>
    </div>
  );
};
