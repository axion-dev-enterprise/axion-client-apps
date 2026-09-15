import React, { useState } from 'react';
import { Users, Search, Mail, Shield, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ProfessorAlunos: React.FC = () => {
  const [search, setSearch] = useState('');

  const alunos = [
    { id: '1', nome: 'Ana Beatriz Souza', email: 'ana.beatriz@email.com', plano: 'PRO', progresso: '85%', redacoes: 6, status: 'Ativo' },
    { id: '2', nome: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com', plano: 'MÉDIO', progresso: '60%', redacoes: 3, status: 'Ativo' },
    { id: '3', nome: 'Mariana Santos', email: 'mariana.santos@email.com', plano: 'PRO', progresso: '92%', redacoes: 8, status: 'Ativo' },
    { id: '4', nome: 'Lucas Oliveira', email: 'lucas.oliveira@email.com', plano: 'INICIANTE', progresso: '34%', redacoes: 1, status: 'Ativo' },
    { id: '5', nome: 'Fernanda Rocha', email: 'fernanda.rocha@email.com', plano: 'MÉDIO', progresso: '45%', redacoes: 2, status: 'Ativo' }
  ];

  const filtered = alunos.filter(
    (a) => a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Alunos Matriculados
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Gerenciamento e acompanhamento de desempenho individual dos estudantes
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <Card padding="none" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Aluno</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Plano</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Progresso</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Redações</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((aluno) => (
                <tr
                  key={aluno.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{aluno.nome}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{aluno.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <Badge variant={aluno.plano === 'PRO' ? 'purple' : 'neutral'} size="sm">
                      {aluno.plano}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {aluno.progresso}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {aluno.redacoes} entregues
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <Badge variant="success" size="sm">
                      <CheckCircle size={12} /> {aluno.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
