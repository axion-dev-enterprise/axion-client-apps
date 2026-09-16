import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { StudentHeader } from '../components/layout/StudentHeader';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lock, ArrowLeft, MessageCircle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const StudentLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleVerificarLiberacao = async () => {
    setVerificando(true);
    try {
      const updated = await refreshUser();
      if (updated?.statusPlano === 'ativo') {
        showToast('Parabéns! Sua matrícula foi aprovada com sucesso. Conteúdo liberado!', 'success');
      } else {
        showToast('Sua matrícula ainda está aguardando liberação da Professora Wilma.', 'info');
      }
    } catch {
      showToast('Erro ao checar status. Tente novamente.', 'error');
    } finally {
      setVerificando(false);
    }
  };

  const isPlanoPendente = user?.perfil === 'aluno' && user?.statusPlano !== 'ativo';
  const isRotaBloqueada = isPlanoPendente && location.pathname !== '/home' && location.pathname !== '/perfil';

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-canvas)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Carregando ambiente de estudos...</span>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Olá, Professora Wilma! Sou o aluno ${user?.nome || ''}, fiz meu cadastro no Plano ${(user?.plano || 'iniciante').toUpperCase()} e meu código de referência é ${user?.codigoReferencia || ''}. Poderia aprovar minha matrícula na plataforma? Muito obrigado!`
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      <StudentHeader />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {isRotaBloqueada ? (
            <Card
              variant="elevated"
              style={{
                maxWidth: '680px',
                margin: '3rem auto',
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  border: '4px solid #fef9c3'
                }}
              >
                <Lock size={36} />
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  border: '1px solid #fde68a'
                }}
              >
                <Clock size={14} /> MATRÍCULA EM ANÁLISE
              </span>

              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                Conteúdo Exclusivo para Planos Aprovados
              </h2>

              <p style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 2rem' }}>
                As aulas, simulados, apostilas em PDF e redações deste módulo estão reservados para alunos com matrícula ativa confirmada pela <strong>Professora Wilma Barbosa</strong>.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Plano Solicitado
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Plano {(user?.plano || 'iniciante').toUpperCase()}
                  </div>
                </div>

                {user?.codigoReferencia && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      Código de Matrícula
                    </span>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>
                      {user.codigoReferencia}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={`https://wa.me/5521972954456?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="primary"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1.5rem',
                      backgroundColor: '#16a34a',
                      borderColor: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      fontWeight: 700,
                      fontSize: '0.95rem'
                    }}
                  >
                    <MessageCircle size={18} />
                    Avisar Professora no WhatsApp
                  </Button>
                </a>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button
                    variant="outline"
                    onClick={handleVerificarLiberacao}
                    disabled={verificando}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <RefreshCw size={16} className={verificando ? 'animate-spin' : ''} />
                    {verificando ? 'Checando...' : 'Verificar Liberação Agora'}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => navigate('/home')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <ArrowLeft size={16} />
                    Voltar para o Início
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
