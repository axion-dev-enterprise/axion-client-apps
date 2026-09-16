import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CANONICAL_MODULES } from '../../data/canonical-modules';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState(false);

  const totalAulas = CANONICAL_MODULES.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasConcluidas = 12; // Exemplo de progresso inicial
  const porcentagem = Math.round((aulasConcluidas / totalAulas) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner de Aprovação Pendente se aplicável */}
      {user?.statusPlano === 'pendente' && (
        <Card
          variant="elevated"
          padding="md"
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '16px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
                    Matrícula Aguardando Liberação Docente
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#b45309', margin: 0 }}>
                    Sua solicitação de acesso para o <strong>Plano {user?.plano ? user.plano.toUpperCase() : 'MÉDIO'}</strong> está pendente de confirmação.
                  </p>
                </div>
              </div>

              {user?.codigoReferencia && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #fcd34d',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>Ref:</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.9375rem', color: '#78350f' }}>
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
                    {copiado ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #fef3c7', paddingTop: '0.75rem' }}>
              <a
                href={`https://wa.me/5521992013060?text=${encodeURIComponent(
                  `Olá, Professora Wilma! Estou cadastrado no Gramaticalizando. Meu Código de Referência é *${user?.codigoReferencia || ''}* para ativação do Plano *${user?.plano ? user.plano.toUpperCase() : 'MÉDIO'}* (Nome: ${user?.nome || ''}, Email: ${user?.email || ''}). Aguardo a liberação!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button variant="whatsapp" size="sm" icon={<MessageCircle size={16} />}>
                  Avisar Professora no WhatsApp
                </Button>
              </a>
              <span style={{ fontSize: '0.75rem', color: '#92400e' }}>
                Envie seu código de referência para que a professora aprove sua matrícula na dashboard.
              </span>
            </div>
          </div>
        </Card>
      )}

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
        <div style={{ maxWidth: '640px' }}>
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
              PLANO {user?.plano ? user.plano.toUpperCase() : 'PRO'}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Ano Letivo 2026
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
            Olá, {user?.nome?.split(' ')[0] || 'Aluno'}! Pronto para dominar o Português?
          </h1>

          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Seu próximo módulo sugerido é <strong>Ortografia e Acentuação</strong>. Continue de onde parou para manter sua meta diária de estudos.
          </p>

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
            Continuar Estudos
          </Button>
        </div>
      </Card>

      {/* Métricas e Progresso Geral */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Progresso do Curso
            </span>
            <TrendingUp size={18} color="var(--accent)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{porcentagem}%</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>({aulasConcluidas}/{totalAulas} aulas)</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${porcentagem}%`, height: '100%', backgroundColor: 'var(--accent)', borderRadius: 'var(--radius-full)' }} />
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
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>2</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>de 4 disponíveis este mês</span>
          </div>
          <Badge variant="success" size="sm">Última nota: 920/1000</Badge>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Simulados Realizados
            </span>
            <FileCheck2 size={18} color="#2563eb" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>3</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>provas concluídas</span>
          </div>
          <Badge variant="info" size="sm">Aproveitamento médio: 85%</Badge>
        </Card>
      </div>

      {/* Módulos de Estudo com Acesso Direto */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Módulos de Língua Portuguesa
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Navegue pelos 7 módulos canônicos e acesse aulas e exercícios
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/portugues')}
            icon={<ArrowRight size={14} />}
          >
            Ver Todas as Aulas
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
