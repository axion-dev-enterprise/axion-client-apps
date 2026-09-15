import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, setDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await login({ email, senha });
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.375rem' }}>
          Entrar na Plataforma
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Informe suas credenciais para continuar seus estudos
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="E-mail"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
          required
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          icon={<Lock size={16} />}
          required
        />

        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              fontSize: '0.8125rem'
            }}
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={<ArrowRight size={18} />}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Acessar Minha Conta
        </Button>
      </form>

      {/* Demo fast-access switch */}
      <div
        style={{
          marginTop: '1.75rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Acesso de Demonstração Rápido
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<GraduationCap size={14} />}
            onClick={() => {
              setDemoUser('aluno');
              navigate('/home');
            }}
          >
            Entrar como Aluno
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<ShieldCheck size={14} />}
            onClick={() => {
              setDemoUser('professor');
              navigate('/professor');
            }}
          >
            Entrar como Professor
          </Button>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Ainda não tem conta?{' '}
        <Link to="/registro" style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>
          Cadastre-se gratuitamente
        </Link>
      </div>
    </Card>
  );
};
