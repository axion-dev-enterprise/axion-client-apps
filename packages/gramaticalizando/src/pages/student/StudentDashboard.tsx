import React from 'react';
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
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CANONICAL_MODULES } from '../../data/canonical-modules';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalAulas = CANONICAL_MODULES.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasConcluidas = 12; // Exemplo de progresso inicial
  const porcentagem = Math.round((aulasConcluidas / totalAulas) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner de Boas-Vindas */}
      <Card
        variant="elevated"
        padding="lg"
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(18, 18, 23, 1) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Badge variant="purple" size="sm">
              PLANO {user?.plano ? user.plano.toUpperCase() : 'PRO'}
            </Badge>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Ano Letivo 2026
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
            Olá, {user?.nome?.split(' ')[0] || 'Aluno'}! Pronto para dominar o Português?
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Seu próximo módulo sugerido é <strong>Ortografia e Acentuação</strong>. Continue de onde parou para manter sua meta diária de estudos.
          </p>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight size={16} />}
            onClick={() => navigate('/portugues')}
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
            <TrendingUp size={18} color="var(--accent-hover)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>{porcentagem}%</span>
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
            <PenTool size={18} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>2</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>de 4 disponíveis este mês</span>
          </div>
          <Badge variant="success" size="sm">Última nota: 920/1000</Badge>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Simulados Realizados
            </span>
            <FileCheck2 size={18} color="#3b82f6" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>3</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>provas concluídas</span>
          </div>
          <Badge variant="info" size="sm">Aproveitamento médio: 85%</Badge>
        </Card>
      </div>

      {/* Módulos de Estudo com Acesso Direto */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
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
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.375rem' }}>
                {mod.titulo}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.875rem' }}>
                {mod.descricao}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-text)', fontSize: '0.8125rem', fontWeight: 600 }}>
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
