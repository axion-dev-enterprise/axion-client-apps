import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({ nome, email, senha });
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Falha ao realizar cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.375rem' }}>
          Criar Nova Conta
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Cadastre-se para iniciar seus estudos de Língua Portuguesa
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Nome Completo"
          type="text"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          icon={<UserIcon size={16} />}
          required
        />

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
          placeholder="Mínimo de 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          icon={<Lock size={16} />}
          required
        />

        <Input
          label="Confirmar Senha"
          type="password"
          placeholder="Repita a senha"
          value={confirmSenha}
          onChange={(e) => setConfirmSenha(e.target.value)}
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
          Finalizar Cadastro
        </Button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Já possui cadastro?{' '}
        <Link to="/login" style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>
          Entrar na minha conta
        </Link>
      </div>
    </Card>
  );
};
