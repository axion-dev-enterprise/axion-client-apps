import React, { useState } from 'react';
import { HelpCircle, CheckCircle, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export const ProfessorExercicios: React.FC = () => {
  const [search, setSearch] = useState('');

  const questoes = [
    {
      id: '1',
      modulo: 'Fonética e Fonologia',
      enunciado: 'Assinale a alternativa em que todas as palavras apresentam dígrafo consonantal.',
      resposta: 'Chave, ninho, terra, piscina.',
      banca: 'FGV 2025'
    },
    {
      id: '2',
      modulo: 'Ortografia e Acentuação',
      enunciado: 'Indique a opção em que todas as paroxítonas perderam o acento segundo o Acordo Ortográfico.',
      resposta: 'Ideia, assembleia, jiboia, heroico.',
      banca: 'Cebraspe 2026'
    },
    {
      id: '3',
      modulo: 'Análise Sintática',
      enunciado: 'Identifique a oração em que o termo sublinhado atua como Complemento Nominal.',
      resposta: 'Tinha certeza da vitória dos estudantes.',
      banca: 'Vunesp 2025'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Banco de Questões & Exercícios
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Itens avaliativos categorizados por módulo e banca examinadora
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Input
            placeholder="Buscar questão..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questoes.map((q) => (
          <Card key={q.id} padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Badge variant="purple" size="sm">{q.modulo}</Badge>
              <Badge variant="neutral" size="sm">{q.banca}</Badge>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {q.enunciado}
            </h3>
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} />
              <span>Gabarito: {q.resposta}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
