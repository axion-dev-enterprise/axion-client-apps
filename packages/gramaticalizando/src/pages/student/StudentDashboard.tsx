import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileCheck2,
  PenTool,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Layers,
  GraduationCap,
  Lock,
  RefreshCw,
  FolderDown,
  Video,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CANONICAL_MODULES } from '../../data/canonical-modules';
import { coursesApi, DashboardAlunoResponse } from '../../api/courses';
import { essaysApi } from '../../api/essays';
import { cronogramaApi, Cronograma } from '../../api/cronograma';
import { Redacao } from '../../types/essay';

export const StudentDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [statusPlanoEfetivo, setStatusPlanoEfetivo] = useState(user?.statusPlano || 'pendente');

  // Dados Reais da API
  const [dashboardData, setDashboardData] = useState<DashboardAlunoResponse | null>(null);
  const [minhasRedacoes, setMinhasRedacoes] = useState<Redacao[]>([]);
  const [cronograma, setCronograma] = useState<Cronograma | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('gramaticalizando_registered_students');
      if (storedStr && user?.email) {
        const storedList = JSON.parse(storedStr);
        const aluno = storedList.find((a: any) => a.email.toLowerCase() === user.email.toLowerCase());
        if (aluno && aluno.statusPlano) {
          setStatusPlanoEfetivo(aluno.statusPlano);
          return;
        }
      }
    } catch {}
    if (user?.statusPlano) {
      setStatusPlanoEfetivo(user.statusPlano);
    }
  }, [user]);

  useEffect(() => {
    const carregarDashboardReal = async () => {
      try {
        setLoading(true);
        const [dash, reds, cron] = await Promise.all([
          coursesApi.getDashboardAluno().catch(() => null),
          essaysApi.getMyEssays().catch(() => []),
          cronogramaApi.getMeuCronograma().catch(() => null)
        ]);

        if (dash) setDashboardData(dash);
        setMinhasRedacoes(reds);
        if (cron) setCronograma(cron);
      } catch (err) {
        console.warn('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDashboardReal();
  }, []);

  // Cálculos Reais
  const totalAulasCanonica = CANONICAL_MODULES.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasConcluidasReal = dashboardData?.estatisticas?.aulasConcluidas ?? 0;
  const porcentagemCurso = totalAulasCanonica > 0
    ? Math.round((aulasConcluidasReal / totalAulasCanonica) * 100)
    : 0;

  const totalRedacoes = minhasRedacoes.length;
  const redacoesCorrigidas = minhasRedacoes.filter(r => r.status === 'corrigida');
  const ultimaNota = redacoesCorrigidas.length > 0 ? redacoesCorrigidas[0].notaFinal : null;

  const exerciciosFeitos = dashboardData?.estatisticas?.exerciciosFeitos ?? 0;
  const taxaAcerto = dashboardData?.estatisticas?.taxaAcerto ?? 0;

  const handleVerificarLiberacao = async () => {
    setVerificando(true);
    try {
      const updated = await refreshUser();
      const novoStatus = updated?.statusPlano || 'pendente';
      setStatusPlanoEfetivo(novoStatus);
      if (novoStatus === 'ativo') {
        showToast('Parabéns! Sua matrícula foi aprovada com sucesso. Conteúdo liberado!', 'success');
      } else {
        showToast('Sua matrícula ainda está aguardando liberação da Professora Wilma.', 'info');
      }
    } catch {
      showToast('Erro ao verificar status. Tente novamente.', 'error');
    } finally {
      setVerificando(false);
    }
  };

  if (statusPlanoEfetivo !== 'ativo') {
    const whatsappMsg = encodeURIComponent(
      `Olá, Professora Wilma! Sou o aluno ${user?.nome || ''}, fiz meu cadastro no Plano ${(user?.plano || 'iniciante').toUpperCase()} e meu código de referência é ${user?.codigoReferencia || ''}. Poderia aprovar minha matrícula na plataforma? Muito obrigado!`
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Card Principal de Matrícula em Análise */}
        <Card
          variant="elevated"
          padding="lg"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #fde68a',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.08), 0 8px 10px -6px rgba(217, 119, 6, 0.04)',
            overflow: 'hidden'
          }}
        >
          {/* Header Superior Dourado */}
          <div
            style={{
              padding: '1rem 1.5rem',
              margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
              backgroundColor: '#fffbeb',
              borderBottom: '1px solid #fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #fde68a'
                }}
              >
                <Clock size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Matrícula em Análise Docente
                </span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#78350f' }}>
                  Aguardando Liberação da Professora Wilma
                </div>
              </div>
            </div>

            {user?.codigoReferencia && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fcd34d',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>Ref:</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#78350f' }}>
                  {user.codigoReferencia}
                </strong>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(user.codigoReferencia || '');
                    setCopiado(true);
                    setTimeout(() => setCopiado(false), 2000);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  title="Copiar código"
                >
                  {copiado ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>

          {/* Corpo do Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                Olá, {user?.nome || 'Estudante'}! Seja muito bem-vindo(a).
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Sua solicitação de matrícula para o <strong>Plano {(user?.plano || 'iniciante').toUpperCase()}</strong> foi registrada no sistema. Por diretriz pedagógica e organização das turmas de Língua Portuguesa, as aulas e materiais são desbloqueados assim que a <strong>Professora Wilma Barbosa</strong> confirma a ativação no painel docente.
              </p>
            </div>

            {/* Ações de Comunicação e Refresh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
              <a
                href={`https://wa.me/5521972954456?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button
                  variant="primary"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#16a34a',
                    borderColor: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.925rem'
                  }}
                >
                  <MessageCircle size={18} />
                  Avisar Professora no WhatsApp
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={handleVerificarLiberacao}
                disabled={verificando}
                style={{
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}
              >
                <RefreshCw size={16} className={verificando ? 'animate-spin' : ''} />
                {verificando ? 'Verificando...' : 'Verificar Liberação Agora'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Vitrine de Conteúdos que serão Liberados */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
              Conteúdos do seu Plano Aguardando Liberação
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Assim que sua matrícula for aprovada, todo o ecossistema de estudos abaixo será desbloqueado automaticamente.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <Card
              padding="lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} />
                </div>
                <Badge variant="warning" size="sm">
                  <Lock size={12} style={{ marginRight: '0.25rem' }} /> Bloqueado
                </Badge>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Aulas de Língua Portuguesa
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Videoaulas completas e estruturadas com foco em concursos e vestibulares, abrangendo gramática, morfologia e sintaxe.
              </p>
            </Card>

            <Card
              padding="lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCheck2 size={20} />
                </div>
                <Badge variant="warning" size="sm">
                  <Lock size={12} style={{ marginRight: '0.25rem' }} /> Bloqueado
                </Badge>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Simulados e Exercícios
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Simulados cronometrados com gabarito pedagógico e banco de questões comentadas pela professora.
              </p>
            </Card>

            <Card
              padding="lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PenTool size={20} />
                </div>
                <Badge variant="warning" size="sm">
                  <Lock size={12} style={{ marginRight: '0.25rem' }} /> Bloqueado
                </Badge>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Laboratório de Redação
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Envio de redações nos temas oficiais de vestibulares e concursos com avaliação e nota individual.
              </p>
            </Card>

            <Card
              padding="lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderDown size={20} />
                </div>
                <Badge variant="warning" size="sm">
                  <Lock size={12} style={{ marginRight: '0.25rem' }} /> Bloqueado
                </Badge>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Apostilas & Materiais em PDF
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Material complementar em PDF preparado para download e visualização integrada pelo navegador.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Banner de Boas-Vindas */}
      <Card
        variant="elevated"
        padding="lg"
        style={{
          background: 'linear-gradient(135deg, #6b21a8 0%, #4c1d95 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-purple)'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '0.2rem 0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: 'var(--radius-full)'
              }}
            >
              PLANO {user?.plano ? user.plano.toUpperCase() : 'VIP CONCURSOS'}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Ano Letivo 2026 • Portal do Aluno
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Olá, {user?.nome?.split(' ')[0] || 'Aluno'}! Vamos aos estudos hoje?
          </h1>

          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Acesse as aulas de Língua Portuguesa, envie redações para correção pedagógica e acompanhe suas metas no cronograma semanal.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="md"
              icon={<ArrowRight size={16} />}
              onClick={() => navigate('/portugues')}
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--accent)',
                fontWeight: 700
              }}
            >
              Continuar Aulas
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/cronograma')}
              style={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#ffffff'
              }}
            >
              Ver Cronograma
            </Button>
          </div>
        </div>
      </Card>

      {/* Métricas e Progresso Geral em Tempo Real */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Progresso do Curso
            </span>
            <TrendingUp size={18} color="var(--accent)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {porcentagemCurso}%
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              ({aulasConcluidasReal} de {totalAulasCanonica} aulas)
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.max(porcentagemCurso, 2)}%`, height: '100%', backgroundColor: 'var(--accent)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Redações Enviadas
            </span>
            <PenTool size={18} color="#16a34a" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalRedacoes}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>textos submetidos</span>
          </div>
          {ultimaNota !== null ? (
            <Badge variant="success" size="sm">Última nota: {ultimaNota}/1000</Badge>
          ) : (
            <Badge variant="warning" size="sm">Aguardando 1ª avaliação</Badge>
          )}
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Taxa de Aproveitamento
            </span>
            <FileCheck2 size={18} color="#2563eb" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {taxaAcerto > 0 ? `${taxaAcerto}%` : 'Em treino'}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              exercícios resolvidos
            </span>
          </div>
          <Badge variant="purple" size="sm">
            {exerciciosFeitos > 0 ? `${exerciciosFeitos} questões respondidas` : 'Comece os simulados'}
          </Badge>
        </Card>
      </div>

      {/* Roteiro da Semana (Cronograma) */}
      {cronograma && cronograma.dias && cronograma.dias.length > 0 && (
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Metas da Semana: {cronograma.titulo}
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/cronograma')}>
              Ver Cronograma Completo →
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {cronograma.dias.slice(0, 5).map((dia) => (
              <div
                key={dia.id}
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: dia.concluido ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface-2)',
                  border: dia.concluido ? '1px solid var(--success)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {dia.dia}
                  </span>
                  {dia.concluido && <Badge variant="success" size="sm">Feito</Badge>}
                </div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.2rem 0 0' }}>
                  {dia.aula}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {dia.duracao} • {dia.tipo || 'teoria'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Módulos de Estudo com Acesso Direto */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Módulos de Língua Portuguesa
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
              Navegue pelos módulos estruturados e domine os conteúdos mais cobrados
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/portugues')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>Ver Todas as Aulas</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {CANONICAL_MODULES.slice(0, 4).map((mod) => (
            <Card
              key={mod.id}
              variant="interactive"
              padding="md"
              onClick={() => navigate('/portugues')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  MÓDULO 0{mod.ordem}
                </span>
                <Badge variant="purple" size="sm">
                  {mod.aulas.length} Aulas
                </Badge>
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                {mod.titulo}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.875rem' }}>
                {mod.descricao}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: 600 }}>
                <span>Acessar conteúdo</span>
                <ArrowRight size={14} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
