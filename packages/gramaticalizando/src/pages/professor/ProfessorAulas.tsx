import React from 'react';
import { BookOpen, Plus, Clock, Edit2, Layers } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CANONICAL_MODULES } from '../../data/canonical-modules';

export const ProfessorAulas: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Módulos & Aulas Cadastradas
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Estrutura programática dos 7 módulos oficiais de Língua Portuguesa
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {CANONICAL_MODULES.map((mod) => (
          <Card key={mod.id} padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-text)', fontWeight: 600 }}>
                  MÓDULO 0{mod.ordem}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {mod.titulo}
                </h3>
              </div>
              <Badge variant="purple" size="sm">
                {mod.aulas.length} Aulas
              </Badge>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {mod.descricao}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {mod.aulas.map((aula) => (
                <div
                  key={aula.id}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aula #{aula.ordem}</span>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{aula.titulo}</h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>{aula.duracao || '25 min'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
