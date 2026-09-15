import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <span
        style={{
          fontSize: '5rem',
          fontWeight: 800,
          color: 'var(--accent)',
          lineHeight: 1,
          marginBottom: '1rem',
          textShadow: '0 0 32px rgba(147, 51, 234, 0.4)'
        }}
      >
        404
      </span>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
        Página Não Encontrada
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '2rem' }}>
        O endereço solicitado não existe ou foi remanejado para a nova estrutura canônica.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button variant="primary" icon={<Home size={16} />} onClick={() => navigate('/home')}>
          Ir Para Início
        </Button>
      </div>
    </div>
  );
};
