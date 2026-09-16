import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  HelpCircle,
  Download,
  Check,
  X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { CANONICAL_MODULES } from '../../data/canonical-modules';
import { Aula, Modulo, Exercicio } from '../../types/courses';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin';
import { coursesApi } from '../../api/courses';

interface LocalProgressData {
  completedLessons: Record<string, boolean>;
  respostasExercicios: Record<string, number>;
  revelarExplicacao: Record<string, boolean>;
}

export const StudentPortugues: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Modulo[]>(CANONICAL_MODULES);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedModule, setExpandedModule] = useState<string | null>('fonetica-fonologia');
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  // Exercícios da aula aberta
  const [aulaExercicios, setAulaExercicios] = useState<Exercicio[]>([]);
  const [respostasExercicios, setRespostasExercicios] = useState<Record<string, number>>({});
  const [revelarExplicacao, setRevelarExplicacao] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();

  const getStorageKey = () => `gramaticalizando_progresso_${user?.id || 'anon'}`;

  const loadLocalProgress = (): LocalProgressData => {
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return { completedLessons: {}, respostasExercicios: {}, revelarExplicacao: {} };
  };

  const saveLocalProgress = (updater: (prev: LocalProgressData) => LocalProgressData) => {
    try {
      const current = loadLocalProgress();
      const updated = updater(current);
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
    } catch {}
  };

  const loadData = async () => {
    // 1. Carrega imediatamente o progresso do LocalStorage para renderização instantânea (anti-flicker e F5 safe)
    const local = loadLocalProgress();
    if (Object.keys(local.completedLessons).length > 0) {
      setCompletedLessons(local.completedLessons);
    }
    if (Object.keys(local.respostasExercicios).length > 0) {
      setRespostasExercicios(local.respostasExercicios);
    }
    if (Object.keys(local.revelarExplicacao).length > 0) {
      setRevelarExplicacao(local.revelarExplicacao);
    }

    try {
      // 2. Carregar módulos do backend ou canônicos e dashboard
      const [mats, lsns, dash] = await Promise.all([
        adminApi.getMaterias().catch(() => []),
        adminApi.getAulas().catch(() => []),
        coursesApi.getDashboardAluno().catch(() => null)
      ]);

      if (mats && mats.length > 0 && lsns && lsns.length > 0) {
        const grouped: Modulo[] = mats.map(m => {
          const modAulas = lsns
            .filter(a => a.materiaId === m.id)
            .map(a => ({
              id: a.id,
              moduloId: m.id,
              titulo: a.titulo,
              subtitulo: a.subtitulo || undefined,
              conteudo: a.conteudo || '',
              duracao: a.duracao || '25 min',
              ordem: a.ordem || 1,
              videoUrl: a.videoUrl || undefined,
              materialPdfUrl: a.materialPdfUrl || undefined
            }));

          return {
            id: m.id,
            titulo: m.nome,
            descricao: m.descricao || '',
            ordem: m.ordem || 1,
            icone: m.icone || 'BookOpen',
            aulas: modAulas
          };
        });

        if (grouped.length > 0) {
          setModules(grouped);
        }
      }

      // 3. Unificar aulas concluídas reais do aluno (Backend + LocalStorage)
      const mapaConcluidas: Record<string, boolean> = { ...local.completedLessons };

      if (dash && Array.isArray(dash.cursos)) {
        dash.cursos.forEach(curso => {
          if (Array.isArray(curso.aulas)) {
            curso.aulas.forEach(a => {
              if (a.concluida) {
                mapaConcluidas[a.id] = true;
              }
            });
          }
        });
      }

      setCompletedLessons(mapaConcluidas);
      saveLocalProgress(prev => ({
        ...prev,
        completedLessons: mapaConcluidas
      }));
    } catch (err) {
      console.warn('Erro ao carregar conteúdo de Português:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleToggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleOpenAula = async (aula: Aula) => {
    setSelectedAula(aula);

    // Carrega respostas salvas localmente para que o aluno não perca os exercícios feitos
    const local = loadLocalProgress();
    setRespostasExercicios(local.respostasExercicios || {});
    setRevelarExplicacao(local.revelarExplicacao || {});

    try {
      const exs = await coursesApi.getExercises(aula.moduloId);
      setAulaExercicios(exs);
    } catch {
      setAulaExercicios([]);
    }
  };

  const handleToggleConcluida = async (aulaId: string) => {
    const isJaConcluida = !!completedLessons[aulaId];

    if (!isJaConcluida) {
      // 1. Atualização imediata no estado e no LocalStorage (zero latency, zero perda em F5)
      setCompletedLessons(prev => {
        const next = { ...prev, [aulaId]: true };
        saveLocalProgress(p => ({ ...p, completedLessons: next }));
        return next;
      });

      showToast('Aula concluída com sucesso! Seu progresso foi salvo.', 'success');

      // 2. Sincroniza em segundo plano com o banco de dados PostgreSQL
      try {
        await coursesApi.concluirAula(aulaId);
      } catch (err) {
        console.warn('Sincronização em segundo plano da aula:', err);
      }
    } else {
      setCompletedLessons(prev => {
        const next = { ...prev };
        delete next[aulaId];
        saveLocalProgress(p => ({ ...p, completedLessons: next }));
        return next;
      });
      showToast('Status da aula atualizado.', 'info');
    }
  };

  const handleResponderExercicio = (exId: string, alternativaIndex: number) => {
    setRespostasExercicios(prev => {
      const next = { ...prev, [exId]: alternativaIndex };
      saveLocalProgress(p => ({ ...p, respostasExercicios: next }));
      return next;
    });

    setRevelarExplicacao(prev => {
      const next = { ...prev, [exId]: true };
      saveLocalProgress(p => ({ ...p, revelarExplicacao: next }));
      return next;
    });
  };

  const filteredModules = modules.map((mod) => {
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

  const totalAulasGeral = modules.reduce((acc, m) => acc + m.aulas.length, 0);
  const totalConcluidasGeral = Object.values(completedLessons).filter(Boolean).length;
  const porcentagemGeral = totalAulasGeral > 0 ? Math.round((totalConcluidasGeral / totalAulasGeral) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
              <BookOpen size={24} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Língua Portuguesa para Concursos
            </h1>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
            Trilha de aprendizagem organizada da fonética à sintaxe do período composto com a Professora Wilma Barbosa.
          </p>
        </div>

        {/* Card de Progresso */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: '#ffffff',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Seu Progresso no Curso
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent)' }}>
              {totalConcluidasGeral} de {totalAulasGeral} aulas ({porcentagemGeral}%)
            </span>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}
          >
            {porcentagemGeral}%
          </div>
        </div>
      </div>

      {/* Barra de Busca */}
      <div style={{ maxWidth: '480px' }}>
        <Input
          placeholder="Buscar módulo, tópico ou aula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>

      {/* Lista de Módulos & Aulas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredModules.map((modulo, modIndex) => {
          const isExpanded = expandedModule === modulo.id;
          const concluidasModulo = modulo.aulas.filter((a) => completedLessons[a.id]).length;
          const totalAulasModulo = modulo.aulas.length;

          return (
            <Card
              key={modulo.id}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#ffffff',
                overflow: 'hidden'
              }}
            >
              {/* Header do Módulo */}
              <div
                onClick={() => handleToggleModule(modulo.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? 'var(--bg-surface-2)' : 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.875rem'
                    }}
                  >
                    {modIndex + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {modulo.titulo}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                      {modulo.descricao}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {concluidasModulo} / {totalAulasModulo} aulas
                  </span>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Grid de Aulas (quando expandido) */}
              {isExpanded && (
                <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {modulo.aulas.map((aula) => {
                      const isDone = !!completedLessons[aula.id];

                      return (
                        <div
                          key={aula.id}
                          onClick={() => handleOpenAula(aula)}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: isDone ? '1px solid var(--success)' : '1px solid var(--border-subtle)',
                            backgroundColor: isDone ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-surface-1)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Aula #{aula.ordem}
                              </span>
                              {isDone ? (
                                <Badge variant="success" size="sm">Concluída</Badge>
                              ) : (
                                <Badge variant="neutral" size="sm">Pendente</Badge>
                              )}
                            </div>

                            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                              {aula.titulo}
                            </h4>
                            {aula.subtitulo && (
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                                {aula.subtitulo}
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Clock size={13} />
                              <span>{aula.duracao || '25 min'}</span>
                            </div>
                            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                              Estudar Aula →
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

      {/* Modal Detalhado da Aula */}
      <Modal
        isOpen={!!selectedAula}
        onClose={() => setSelectedAula(null)}
        title={selectedAula ? selectedAula.titulo : ''}
        maxWidth="760px"
      >
        {selectedAula && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {selectedAula.subtitulo && (
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
                {selectedAula.subtitulo}
              </p>
            )}

            {/* Conteúdo Teórico da Aula */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                lineHeight: 1.7,
                fontSize: '0.925rem'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} />
                Resumo Conceitual & Aplicação em Prova
              </h4>
              <p style={{ margin: 0 }}>{selectedAula.conteudo}</p>
            </div>

            {/* Ações / Mídias */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {selectedAula.videoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedAula.videoUrl, '_blank')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Play size={14} />
                  <span>Assistir Videoaula</span>
                </Button>
              )}
              {selectedAula.materialPdfUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedAula.materialPdfUrl, '_blank')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={14} />
                  <span>Baixar Material (PDF)</span>
                </Button>
              )}
            </div>

            {/* Exercícios de Fixação da Aula */}
            {aulaExercicios.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={18} style={{ color: 'var(--accent)' }} />
                  Questões de Fixação deste Tópico
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {aulaExercicios.slice(0, 2).map((ex, idx) => {
                    const respostaDada = respostasExercicios[ex.id];
                    const revelado = revelarExplicacao[ex.id];

                    return (
                      <div
                        key={ex.id}
                        style={{
                          backgroundColor: 'var(--bg-surface-1)',
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', display: 'block', marginBottom: '0.35rem' }}>
                          Exercício #{idx + 1}
                        </span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                          {ex.enunciado}
                        </p>

                        {/* Alternativas */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                          {ex.alternativas.map((alt, aIdx) => {
                            const isSelected = respostaDada === aIdx;
                            const isCorreta = aIdx === ex.respostaCorreta;

                            let bg = 'var(--bg-surface-2)';
                            let border = '1px solid var(--border-subtle)';

                            if (revelado) {
                              if (isCorreta) {
                                bg = 'rgba(16, 185, 129, 0.1)';
                                border = '1px solid var(--success)';
                              } else if (isSelected && !isCorreta) {
                                bg = 'rgba(239, 68, 68, 0.1)';
                                border = '1px solid var(--danger)';
                              }
                            } else if (isSelected) {
                              bg = 'var(--accent-light)';
                              border = '1px solid var(--accent)';
                            }

                            return (
                              <button
                                key={aIdx}
                                onClick={() => handleResponderExercicio(ex.id, aIdx)}
                                style={{
                                  padding: '0.625rem 0.875rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: bg,
                                  border,
                                  textAlign: 'left',
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span>{alt}</span>
                                {revelado && isCorreta && <Check size={14} color="var(--success)" />}
                                {revelado && isSelected && !isCorreta && <X size={14} color="var(--danger)" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explicação */}
                        {revelado && (
                          <div style={{ backgroundColor: 'var(--bg-surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--accent)' }}>Explicação: </strong>
                            {ex.explicacao}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer do Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <Button
                variant={completedLessons[selectedAula.id] ? 'secondary' : 'primary'}
                onClick={() => handleToggleConcluida(selectedAula.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <CheckCircle2 size={16} />
                <span>{completedLessons[selectedAula.id] ? 'Desmarcar Conclusão' : 'Marcar Como Concluída'}</span>
              </Button>
              <Button variant="outline" onClick={() => setSelectedAula(null)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
