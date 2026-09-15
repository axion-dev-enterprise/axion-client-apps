import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Target,
  Sliders
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { adminApi, AdminDiagnosticoQuestao } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

export const ProfessorDiagnostico: React.FC = () => {
  const [questoes, setQuestoes] = useState<AdminDiagnosticoQuestao[]>([]);
  const [topicos, setTopicos] = useState<Array<{ chave: string; nome: string }>>([]);
  const [criterios, setCriterios] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Modal Questão Diagnóstico
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestao, setEditingQuestao] = useState<AdminDiagnosticoQuestao | null>(null);

  const [formTopico, setFormTopico] = useState('sintaxe');
  const [formEnunciado, setFormEnunciado] = useState('');
  const [formRespostaCorreta, setFormRespostaCorreta] = useState('a');
  const [formExplicacao, setFormExplicacao] = useState('');
  const [formAlternativas, setFormAlternativas] = useState<Array<{ id: string; texto: string }>>([
    { id: 'a', texto: '' },
    { id: 'b', texto: '' },
    { id: 'c', texto: '' },
    { id: 'd', texto: '' }
  ]);

  // Modal Exclusão
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; enunciado: string } | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDiagnostico();
      setQuestoes(data.questoes);
      setTopicos(data.topicosDisponiveis || []);
      setCriterios(data.criteriosNivel || {});
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar teste diagnóstico.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingQuestao(null);
    setFormTopico(topicos[0]?.chave || 'sintaxe');
    setFormEnunciado('');
    setFormRespostaCorreta('a');
    setFormExplicacao('');
    setFormAlternativas([
      { id: 'a', texto: '' },
      { id: 'b', texto: '' },
      { id: 'c', texto: '' },
      { id: 'd', texto: '' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: AdminDiagnosticoQuestao) => {
    setEditingQuestao(q);
    setFormTopico(q.topico || 'sintaxe');
    setFormEnunciado(q.enunciado);
    setFormRespostaCorreta(q.respostaCorreta || 'a');
    setFormExplicacao(q.explicacao || '');
    setFormAlternativas(Array.isArray(q.alternativas) && q.alternativas.length > 0 ? q.alternativas : [
      { id: 'a', texto: '' },
      { id: 'b', texto: '' },
      { id: 'c', texto: '' },
      { id: 'd', texto: '' }
    ]);
    setIsModalOpen(true);
  };

  const handleUpdateAlternativaTexto = (id: string, texto: string) => {
    setFormAlternativas(prev => prev.map(alt => alt.id === id ? { ...alt, texto } : alt));
  };

  const handleAddAlternativa = () => {
    if (formAlternativas.length >= 5) {
      showToast('Máximo de 5 alternativas (A-E).', 'info');
      return;
    }
    const letters = ['a', 'b', 'c', 'd', 'e'];
    const nextId = letters[formAlternativas.length] || `alt-${formAlternativas.length + 1}`;
    setFormAlternativas(prev => [...prev, { id: nextId, texto: '' }]);
  };

  const handleRemoveAlternativa = (id: string) => {
    if (formAlternativas.length <= 2) {
      showToast('O teste precisa ter ao menos 2 alternativas.', 'warning');
      return;
    }
    const filtered = formAlternativas.filter(a => a.id !== id);
    const corretaValida = filtered.some(a => a.id === formRespostaCorreta) ? formRespostaCorreta : filtered[0].id;
    setFormAlternativas(filtered);
    setFormRespostaCorreta(corretaValida);
  };

  const handleSaveQuestao = async () => {
    if (!formEnunciado.trim()) {
      showToast('Digite o enunciado da questão.', 'warning');
      return;
    }

    const vazias = formAlternativas.some(a => !a.texto.trim());
    if (vazias) {
      showToast('Preencha todas as alternativas da questão.', 'warning');
      return;
    }

    const currentTopicoObj = topicos.find(t => t.chave === formTopico);
    const nomeTopico = currentTopicoObj ? currentTopicoObj.nome : 'Análise Sintática';

    try {
      const payload = {
        topico: formTopico,
        nomeTopico,
        enunciado: formEnunciado,
        respostaCorreta: formRespostaCorreta,
        explicacao: formExplicacao,
        alternativas: formAlternativas
      };

      if (editingQuestao) {
        await adminApi.atualizarQuestaoDiagnostico(editingQuestao.id, payload);
        showToast('Questão do diagnóstico atualizada com sucesso!', 'success');
      } else {
        await adminApi.criarQuestaoDiagnostico(payload);
        showToast('Nova questão adicionada ao teste diagnóstico!', 'success');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar questão do diagnóstico.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.excluirQuestaoDiagnostico(deleteTarget.id);
      showToast('Questão excluída do diagnóstico com sucesso!', 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir questão.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Diagnóstico Inicial & Nivelamento
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Gerencie as questões do teste de nivelamento que definem a trilha personalizada de cada aluno
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
          Nova Questão Diagnóstica
        </Button>
      </div>

      {/* Regras de Nivelamento Card */}
      <Card padding="md" style={{ backgroundColor: 'var(--bg-surface-2)', border: '1px solid var(--accent-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Target size={18} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Critérios Oficiais de Nivelamento Automático
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8125rem' }}>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Nível Iniciante:</span> Menos de 50% de acertos
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--warning)', fontWeight: 700 }}>Nível Intermediário:</span> 50% a 79% de acertos
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>Nível Avançado:</span> 80% ou mais de acertos
          </div>
        </div>
      </Card>

      {/* Lista de Questões */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Carregando questões do teste diagnóstico...
        </div>
      ) : questoes.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Sparkles size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhuma questão cadastrada no diagnóstico
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Adicione questões estratégicas para avaliar o conhecimento prévio dos estudantes.
          </p>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
            Cadastrar Questão
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questoes.map((q, qIndex) => (
            <Card key={q.id} padding="lg">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    #{qIndex + 1}
                  </span>
                  <Badge variant="purple" size="sm">
                    {q.nomeTopico || q.topico}
                  </Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 size={14} />}
                    onClick={() => handleOpenEdit(q)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={14} />}
                    style={{ color: 'var(--danger)' }}
                    onClick={() => setDeleteTarget({ id: q.id, enunciado: q.enunciado })}
                  >
                    Excluir
                  </Button>
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {q.enunciado}
              </h3>

              {/* Alternativas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.75rem' }}>
                {q.alternativas.map((alt) => {
                  const isCorrect = alt.id.toLowerCase() === q.respostaCorreta.toLowerCase();
                  return (
                    <div
                      key={alt.id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isCorrect ? 'var(--success-bg)' : 'var(--bg-surface-2)',
                        border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                        fontSize: '0.875rem',
                        color: isCorrect ? 'var(--success)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <strong style={{ textTransform: 'uppercase' }}>({alt.id})</strong>
                      <span>{alt.texto}</span>
                      {isCorrect && (
                        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          <CheckCircle size={14} /> Resposta Correta
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explicacao && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5
                  }}
                >
                  <strong>Justificativa Pedagógica:</strong> {q.explicacao}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar Questão Diagnóstico */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestao ? 'Editar Questão do Diagnóstico' : 'Nova Questão do Diagnóstico'}
        maxWidth="720px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveQuestao}>Salvar Questão</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Tópico / Competência Avaliada *
            </label>
            <select
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                fontSize: '0.9375rem',
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                outline: 'none'
              }}
              value={formTopico}
              onChange={(e) => setFormTopico(e.target.value)}
            >
              {topicos.map(t => (
                <option key={t.chave} value={t.chave}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Enunciado da Questão *
            </label>
            <textarea
              rows={4}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                fontSize: '0.9375rem',
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              placeholder="Digite o enunciado de nivelamento..."
              value={formEnunciado}
              onChange={(e) => setFormEnunciado(e.target.value)}
            />
          </div>

          {/* Alternativas */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Alternativas (Marque o botão de opção correspondente ao Gabarito Oficial)
              </label>
              {formAlternativas.length < 5 && (
                <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={handleAddAlternativa}>
                  Adicionar Opção
                </Button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {formAlternativas.map((alt) => (
                <div key={alt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <input
                    type="radio"
                    name="correta-diag-radio"
                    checked={formRespostaCorreta.toLowerCase() === alt.id.toLowerCase()}
                    onChange={() => setFormRespostaCorreta(alt.id.toLowerCase())}
                    style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--success)', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 700, textTransform: 'uppercase', width: '1.5rem' }}>
                    {alt.id})
                  </span>
                  <input
                    type="text"
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.9375rem',
                      backgroundColor: 'var(--bg-surface-2)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none'
                    }}
                    placeholder={`Texto da alternativa (${alt.id})`}
                    value={alt.texto}
                    onChange={(e) => handleUpdateAlternativaTexto(alt.id, e.target.value)}
                  />
                  {formAlternativas.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      style={{ color: 'var(--danger)' }}
                      onClick={() => handleRemoveAlternativa(alt.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Justificativa Pedagógica
            </label>
            <textarea
              rows={3}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                fontSize: '0.9375rem',
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              placeholder="Explique o fundamento que embasa esta resposta..."
              value={formExplicacao}
              onChange={(e) => setFormExplicacao(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Exclusão */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir Questão do Diagnóstico"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              variant="primary"
              style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              onClick={handleConfirmDelete}
            >
              Sim, Excluir Questão
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={32} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Tem certeza que deseja excluir esta questão do teste diagnóstico?
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              "{deleteTarget?.enunciado}"
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
