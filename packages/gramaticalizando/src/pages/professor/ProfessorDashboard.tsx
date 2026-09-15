import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, PenTool, BookOpen, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total de Alunos', value: '48', icon: <Users size={20} color="#c084fc" />, change: '+12% este mês' },
    { label: 'Redações Aguardando', value: '5', icon: <PenTool size={20} color="#f59e0b" />, change: '3 prioritárias' },
    { label: 'Aulas Ativas', value: '41', icon: <BookOpen size={20} color="#10b981" />, change: '7 módulos completos' },
    { label: 'Taxa de Conclusão', value: '78%', icon: <TrendingUp size={20} color="#3b82f6" />, change: 'Média da turma' }
  ];

  const redacoesPendentes = [
    { id: '1', aluno: 'Ana Beatriz Souza', tema: 'Os desafios da IA e a autoria no Brasil', data: 'Hoje, 14:20', prioridade: 'Alta' },
    { id: '2', aluno: 'Carlos Eduardo Lima', tema: 'A valorização da norma culta e o preconceito linguístico', data: 'Ontem, 19:45', prioridade: 'Média' },
    { id: '3', aluno: 'Mariana Santos', tema: 'Os desafios da IA e a autoria no Brasil', data: '14/09, 10:15', prioridade: 'Média' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {stats.map((s, idx) => (
          <Card key={idx} padding="md">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {s.label}
              </span>
              <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-2)' }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {s.value}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {s.change}
            </span>
          </Card>
        ))}
      </div>

      {/* Fila de Redações Pendentes */}
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Fila de Redações para Correção
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Textos submetidos pelos alunos aguardando atribuição de nota e parecer
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/professor/redacoes')}
            icon={<ArrowRight size={14} />}
          >
            Ver Todas
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {redacoesPendentes.map((r) => (
            <div
              key={r.id}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {r.aluno}
                  </span>
                  <Badge variant={r.prioridade === 'Alta' ? 'warning' : 'neutral'} size="sm">
                    {r.prioridade}
                  </Badge>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {r.tema}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Submetida em: {r.data}
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/professor/redacoes')}
              >
                Corrigir Redação
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
