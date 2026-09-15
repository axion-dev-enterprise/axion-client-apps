import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { CANONICAL_MODULES } from '../../data/canonical-modules';
import { Aula } from '../../types/courses';
import { useToast } from '../../context/ToastContext';

export const StudentPortugues: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedModule, setExpandedModule] = useState<string | null>('fonetica-fonologia');
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    'divisao-silabica': true,
    'classificacao-fonemas': true
  });

  const { showToast } = useToast();

  const handleToggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleOpenAula = (aula: Aula) => {
    setSelectedAula(aula);
  };

  const handleToggleConcluida = (aulaId: string) => {
    const nextState = !completedLessons[aulaId];
    setCompletedLessons((prev) => ({ ...prev, [aulaId]: nextState }));
    if (nextState) {
      showToast('Aula marcada como concluída! Parabéns pelo progresso.', 'success');
    } else {
      showToast('Status da aula atualizado.', 'info');
    }
  };

  const filteredModules = CANONICAL_MODULES.map((mod) => {
    const matchesModule = mod.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchingAulas = mod.aulas.filter(
      (a) => a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.subtitulo && a.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (matchesModule || matchingAulas.length > 0) {
      return {
        ...mod,
        aulas: searchTerm ? matchingAulas : mod.aulas
      };
    }
    return null;
  }).filter(Boolean) as typeof CANONICAL_MODULES;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Cabeçalho com Busca */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
            Língua Portuguesa & Gramática
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            7 Módulos estruturados com 41 aulas teóricas e práticas completas
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '340px' }}>
          <Input
            placeholder="Buscar aula ou assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {/* Lista de Módulos e Aulas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredModules.map((mod) => {
          const isExpanded = expandedModule === mod.id || searchTerm.length > 0;
          const completedCount = mod.aulas.filter((a) => completedLessons[a.id]).length;
          const progress = Math.round((completedCount / mod.aulas.length) * 100);

          return (
            <Card
              key={mod.id}
              padding="none"
              style={{
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-1)'
              }}
            >
              {/* Header do Módulo */}
              <div
                onClick={() => handleToggleModule(mod.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? 'var(--bg-surface-2)' : 'transparent',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(147, 51, 234, 0.15)',
                      color: 'var(--accent-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <BookOpen size={20} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-text)', textTransform: 'uppercase' }}>
                        Módulo 0{mod.ordem}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {completedCount} de {mod.aulas.length} concluídas ({progress}%)
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mod.titulo}
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Badge variant={progress === 100 ? 'success' : 'purple'} size="sm">
                    {mod.aulas.length} Aulas
                  </Badge>
                  <button
                    style={{ color: 'var(--text-muted)', display: 'flex' }}
                    aria-label="Expandir módulo"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Lista de Aulas */}
              {isExpanded && (
                <div
                  style={{
                    padding: '0.75rem 1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.625rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {mod.descricao}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                    {mod.aulas.map((aula) => {
                      const isDone = !!completedLessons[aula.id];

                      return (
                        <div
                          key={aula.id}
                          onClick={() => handleOpenAula(aula)}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-surface-2)',
                            border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = 'var(--accent)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)';
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Aula #{aula.ordem}
                              </span>
                              {isDone ? (
                                <Badge variant="success" size="sm">
                                  <CheckCircle2 size={12} /> Concluída
                                </Badge>
                              ) : (
                                <Badge variant="neutral" size="sm">
                                  Pendente
                                </Badge>
                              )}
                            </div>

                            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                              {aula.titulo}
                            </h4>

                            {aula.subtitulo && (
                              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                {aula.subtitulo}
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Clock size={14} />
                              <span>{aula.duracao || '25 min'}</span>
                            </div>
                            <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>
                              Abrir Aula →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modal de Visualização da Aula */}
      <Modal
        isOpen={!!selectedAula}
        onClose={() => setSelectedAula(null)}
        title={selectedAula ? `${selectedAula.titulo}` : ''}
        maxWidth="680px"
        footer={
          selectedAula ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant={completedLessons[selectedAula.id] ? 'secondary' : 'primary'}
                icon={<CheckCircle2 size={16} />}
                onClick={() => handleToggleConcluida(selectedAula.id)}
              >
                {completedLessons[selectedAula.id] ? 'Desmarcar Conclusão' : 'Marcar Como Concluída'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedAula(null)}>
                Fechar
              </Button>
            </div>
          ) : undefined
        }
      >
        {selectedAula && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {selectedAula.subtitulo && (
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {selectedAula.subtitulo}
              </p>
            )}

            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontSize: '0.9375rem'
              }}
            >
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="var(--accent-hover)" />
                Resumo Teórico & Aplicação
              </h4>
              <p>{selectedAula.conteudo}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <Clock size={16} />
              <span>Duração estimada de estudo: {selectedAula.duracao || '25 min'}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
