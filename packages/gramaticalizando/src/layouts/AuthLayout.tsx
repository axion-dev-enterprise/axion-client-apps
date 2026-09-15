import React from 'react';
import { Outlet, Link } from 'react-router-dom';

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
        backgroundColor: '#f8fafc'
      }}
    >
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}
        >
          <img
            src="/assets/img/logo.png"
            alt="Gramaticalizando"
            style={{
              width: '44px',
              height: '44px',
              objectFit: 'contain',
              borderRadius: '10px'
            }}
          />
          <span
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              color: '#0f172a'
            }}
          >
            Gramaticalizando<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </Link>
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Outlet />
      </div>

      <div style={{ marginTop: '2.5rem', fontSize: '0.8125rem', color: '#64748b', textAlign: 'center' }}>
        <p>© 2026 Gramaticalizando • Todos os direitos reservados.</p>
      </div>
    </div>
  );
};
