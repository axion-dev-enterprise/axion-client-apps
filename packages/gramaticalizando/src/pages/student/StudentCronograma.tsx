import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const StudentCronograma: React.FC = () => {
  const cronogramaSemanal = [
    { dia: 'Segunda-feira', modulo: 'Módulo 01: Fonética e Fonologia', aula: 'Divisão Silábica & Encontros Vocálicos', duracao: '45 min', status: 'concluido' },
    { dia: 'Terça-feira', modulo: 'Módulo 02: Ortografia', aula: 'Regras Gerais de Acentuação (Oxítonas, Paroxítonas)', duracao: '35 min', status: 'concluido' },
    { dia: 'Quarta-feira', modulo: 'Módulo 02: Ortografia', aula: 'Regras do Hífen & Casos Especiais', duracao: '40 min', status: 'em_andamento' },
    { dia: 'Quinta-feira', modulo: 'Módulo 03: Semântica', aula: 'Sinônimos, Antônimos e Polissemia', duracao: '30 min', status: 'pendente' },
    { dia: 'Sexta-feira', modulo: 'Redação Prática', aula: 'Estruturação do Parágrafo de Introdução', duracao: '50 min', status: 'pendente' },
    { dia: 'Sábado', modulo: 'Simulado Semanal', aula: 'Treinamento de 20 Questões Gabaritadas', duracao: '60 min', status: 'pendente' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Cronograma Semanal de Estudos
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Mantenha a regularidade com a distribuição diária de tópicos e metas guiadas
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cronogramaSemanal.map((item, index) => {
          const isDone = item.status === 'concluido';
          const isCurrent = item.status === 'em_andamento';

          return (
            <Card
              key={index}
              padding="md"
              style={{
                borderLeft: `4px solid ${isDone ? 'var(--success)' : isCurrent ? 'var(--accent)' : 'var(--border-subtle)'}`,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '220px' }}>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isDone ? 'var(--success-bg)' : isCurrent ? 'rgba(147, 51, 234, 0.15)' : 'var(--bg-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDone ? 'var(--success)' : isCurrent ? 'var(--accent-hover)' : 'var(--text-muted)'
                  }}
                >
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {item.dia}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.modulo}
                  </h4>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {item.aula}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <Clock size={12} />
                  <span>{item.duracao}</span>
                </div>
              </div>

              <div>
                <Badge
                  variant={isDone ? 'success' : isCurrent ? 'purple' : 'neutral'}
                  size="sm"
                >
                  {isDone ? 'Concluído' : isCurrent ? 'Meta de Hoje' : 'Pendente'}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
