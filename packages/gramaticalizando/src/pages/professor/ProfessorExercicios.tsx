import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { adminApi, AdminExercicio, AdminMateria } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

interface FormQuestao {
  id?: string;
  enunciado: string;
  banca: string;
  ano: string;
  alternativas: Array<{ id: string; texto: string }>;
  respostaCorreta: string;
  comentarioProfessora: string;
}

export const ProfessorExercicios: React.FC = () => {
  const [exercicios, setExercicios] = useState<AdminExercicio[]>([]);
  const [materias, setMaterias] = useState<AdminMateria[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMateria, setSelectedMateria] = useState<string>('todos');
  const [loading, setLoading] = useState(true);

  // Modal Questão / Exercício
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercicio, setEditingExercicio] = useState<AdminExercicio | null>(null);
  const [editingQuestaoIndex, setEditingQuestaoIndex] = useState<number | null>(null);

  const [formMateriaId, setFormMateriaId] = useState('');
  const [formTitulo, setFormTitulo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');

  const [formQuestao, setFormQuestao] = useState<FormQuestao>({
    enunciado: '',
    banca: 'FGV',
    ano: '2026',
    alternativas: [
      { id: 'a', texto: '' },
      { id: 'b', texto: '' },
      { id: 'c', texto: '' },
      { id: 'd', texto: '' }
    ],
    respostaCorreta: 'a',
    comentarioProfessora: ''
  });

  // Modal Confirmação de Exclusão
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; titulo: string } | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [exList, matList] = await Promise.all([
        adminApi.getExercicios(),
        adminApi.getMaterias()
      ]);
      setExercicios(exList);
      setMaterias(matList);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar banco de questões.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingExercicio(null);
    setEditingQuestaoIndex(null);
    setFormMateriaId(materias[0]?.id || '');
    setFormTitulo('Lista de Exercícios');
    setFormDescricao('Exercícios de fixação e bancas');
    setFormQuestao({
      enunciado: '',
      banca: 'FGV',
      ano: '2026',
      alternativas: [
        { id: 'a', texto: '' },
        { id: 'b', texto: '' },
        { id: 'c', texto: '' },
        { id: 'd', texto: '' }
      ],
      respostaCorreta: 'a',
      comentarioProfessora: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ex: AdminExercicio, qIndex: number = 0) => {
    setEditingExercicio(ex);
    setEditingQuestaoIndex(qIndex);
    setFormMateriaId(ex.materiaId || (materias[0]?.id || ''));
    setFormTitulo(ex.titulo || 'Exercício');
    setFormDescricao(ex.descricao || '');

    const q = ex.questoes && ex.questoes[qIndex]
      ? ex.questoes[qIndex]
      : {
          id: '',
          enunciado: '',
          banca: 'Vunesp',
          ano: '2026',
          alternativas: [
            { id: 'a', texto: '' },
            { id: 'b', texto: '' },
            { id: 'c', texto: '' },
            { id: 'd', texto: '' }
          ],
          respostaCorreta: 'a',
          comentarioProfessora: ''
        };

    setFormQuestao({
      id: q.id,
      enunciado: q.enunciado,
      banca: q.banca || 'FGV',
      ano: q.ano || '2026',
      alternativas: Array.isArray(q.alternativas) && q.alternativas.length > 0
        ? q.alternativas
        : [
            { id: 'a', texto: '' },
            { id: 'b', texto: '' },
            { id: 'c', texto: '' },
            { id: 'd', texto: '' }
          ],
      respostaCorreta: q.respostaCorreta || 'a',
      comentarioProfessora: q.comentarioProfessora || ''
    });

    setIsModalOpen(true);
  };

  const handleUpdateAlternativaTexto = (id: string, texto: string) => {
    setFormQuestao(prev => ({
      ...prev,
      alternativas: prev.alternativas.map(alt => alt.id === id ? { ...alt, texto } : alt)
    }));
  };

  const handleAddAlternativa = () => {
    if (formQuestao.alternativas.length >= 5) {
      showToast('Máximo de 5 alternativas (A-E).', 'info');
      return;
    }
    const nextLetters = ['a', 'b', 'c', 'd', 'e'];
    const nextId = nextLetters[formQuestao.alternativas.length] || `alt-${formQuestao.alternativas.length + 1}`;
    setFormQuestao(prev => ({
      ...prev,
      alternativas: [...prev.alternativas, { id: nextId, texto: '' }]
    }));
  };

  const handleRemoveAlternativa = (id: string) => {
    if (formQuestao.alternativas.length <= 2) {
      showToast('A questão precisa ter no mínimo 2 alternativas.', 'warning');
      return;
    }
    const filtered = formQuestao.alternativas.filter(a => a.id !== id);
    const corretaValida = filtered.some(a => a.id === formQuestao.respostaCorreta)
      ? formQuestao.respostaCorreta
      : filtered[0].id;

    setFormQuestao(prev => ({
      ...prev,
      alternativas: filtered,
      respostaCorreta: corretaValida
    }));
  };

  const handleSaveQuestao = async () => {
    if (!formQuestao.enunciado.trim()) {
      showToast('Digite o enunciado da questão.', 'warning');
      return;
    }

    const vazias = formQuestao.alternativas.some(a => !a.texto.trim());
    if (vazias) {
      showToast('Preencha o texto de todas as alternativas.', 'warning');
      return;
    }

    try {
      if (editingExercicio && editingQuestaoIndex !== null && editingExercicio.questoes) {
        // Atualizar questão dentro do exercício existente
        const novasQuestoes = [...editingExercicio.questoes];
        novasQuestoes[editingQuestaoIndex] = {
          ...formQuestao,
          tipo: 'multipla-escolha'
        };

        await adminApi.atualizarExercicio(editingExercicio.id, {
          titulo: formTitulo,
          descricao: formDescricao,
          materiaId: formMateriaId,
          publicado: true,
          questoes: novasQuestoes
        });

        showToast('Questão atualizada com sucesso!', 'success');
      } else {
        // Criar novo grupo/exercício com a questão
        await adminApi.criarExercicio({
          materiaId: formMateriaId || null,
          titulo: formTitulo || `Questão — ${formQuestao.banca}`,
          descricao: formDescricao || 'Exercício criado no painel do professor',
          publicado: true,
          questoes: [
            {
              ...formQuestao,
              tipo: 'multipla-escolha'
            }
          ]
        });

        showToast('Nova questão adicionada ao banco!', 'success');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar questão.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.excluirExercicio(deleteTarget.id);
      showToast(`Questão "${deleteTarget.titulo}" excluída com sucesso!`, 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir questão.', 'error');
    }
  };

  // Flattened questions for easy filtering and display
  const allQuestions = exercicios.flatMap(ex => {
    const questoes = ex.questoes || [];
    return questoes.map((q, idx) => ({
      exercicioId: ex.id,
      exercicioTitulo: ex.titulo,
      materiaId: ex.materiaId,
      nomeMateria: ex.nomeMateria,
      questaoIndex: idx,
      questao: q
    }));
  });

  const filteredQuestions = allQuestions.filter(item => {
    const matchesSearch =
      item.questao.enunciado.toLowerCase().includes(search.toLowerCase()) ||
      (item.questao.banca && item.questao.banca.toLowerCase().includes(search.toLowerCase())) ||
      (item.nomeMateria && item.nomeMateria.toLowerCase().includes(search.toLowerCase()));

    const matchesMateria = selectedMateria === 'todos' || item.materiaId === selectedMateria;

    return matchesSearch && matchesMateria;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Banco de Questões & Exercícios
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Gerencie e adicione questões oficiais com gabaritos comentados e bancas
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
          Nova Questão
        </Button>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <Input
            placeholder="Buscar questão por enunciado ou banca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <div style={{ minWidth: '220px' }}>
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
            value={selectedMateria}
            onChange={(e) => setSelectedMateria(e.target.value)}
          >
            <option value="todos">Todos os Módulos</option>
            {materias.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Question List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Carregando questões do banco...
        </div>
      ) : filteredQuestions.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <HelpCircle size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhuma questão encontrada
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {search || selectedMateria !== 'todos'
              ? 'Tente remover os filtros para visualizar outras questões.'
              : 'Comece adicionando a primeira questão oficial da plataforma.'}
          </p>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
            Cadastrar Questão
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuestions.map((item) => {
            const q = item.questao;
            const corretaAlt = q.alternativas.find(a => a.id === q.respostaCorreta);
            const parentEx = exercicios.find(e => e.id === item.exercicioId);

            return (
              <Card key={`${item.exercicioId}-${item.questaoIndex}`} padding="lg">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge variant="purple" size="sm">
                      {item.nomeMateria || 'Língua Portuguesa'}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {q.banca || 'Oficial'} {q.ano ? `• ${q.ano}` : ''}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 size={14} />}
                      onClick={() => parentEx && handleOpenEdit(parentEx, item.questaoIndex)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      style={{ color: 'var(--danger)' }}
                      onClick={() => setDeleteTarget({ id: item.exercicioId, titulo: q.enunciado })}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {q.enunciado}
                </h3>

                {/* Alternativas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
                  {q.alternativas.map((alt) => {
                    const isCorrect = alt.id === q.respostaCorreta;
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
                            <CheckCircle size={14} /> Gabarito Oficial
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Comentário pedagógico */}
                {q.comentarioProfessora && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--accent-light)',
                      border: '1px solid var(--accent-border)',
                      fontSize: '0.875rem',
                      color: 'var(--accent-text)',
                      lineHeight: 1.5
                    }}
                  >
                    <strong>Comentário da Profª Wilma:</strong> {q.comentarioProfessora}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Criar / Editar Questão */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExercicio ? 'Editar Questão' : 'Nova Questão para o Banco'}
        maxWidth="720px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveQuestao}>Salvar Questão</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                Módulo / Matéria *
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
                value={formMateriaId}
                onChange={(e) => setFormMateriaId(e.target.value)}
              >
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>

            <Input
              label="Banca Examinadora"
              placeholder="Ex: FGV, Vunesp"
              value={formQuestao.banca}
              onChange={(e) => setFormQuestao({ ...formQuestao, banca: e.target.value })}
            />

            <Input
              label="Ano"
              placeholder="2026"
              value={formQuestao.ano}
              onChange={(e) => setFormQuestao({ ...formQuestao, ano: e.target.value })}
            />
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
              placeholder="Digite o texto de apoio ou comando da questão..."
              value={formQuestao.enunciado}
              onChange={(e) => setFormQuestao({ ...formQuestao, enunciado: e.target.value })}
            />
          </div>

          {/* Alternativas */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Alternativas (Marque o botão de opção correspondente ao Gabarito Oficial)
              </label>
              {formQuestao.alternativas.length < 5 && (
                <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={handleAddAlternativa}>
                  Adicionar Opção
                </Button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {formQuestao.alternativas.map((alt) => (
                <div key={alt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <input
                    type="radio"
                    name="correta-radio"
                    checked={formQuestao.respostaCorreta === alt.id}
                    onChange={() => setFormQuestao({ ...formQuestao, respostaCorreta: alt.id })}
                    style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--success)', cursor: 'pointer' }}
                    title="Marcar como alternativa correta"
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', width: '1.5rem' }}>
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
                  {formQuestao.alternativas.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      style={{ color: 'var(--danger)' }}
                      onClick={() => handleRemoveAlternativa(alt.id)}
                      aria-label="Remover opção"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Comentário Pedagógico / Gabarito Justificado (Profª Wilma)
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
              placeholder="Explique a regra gramatical e por que essa alternativa é a única correta..."
              value={formQuestao.comentarioProfessora}
              onChange={(e) => setFormQuestao({ ...formQuestao, comentarioProfessora: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Confirmação de Exclusão */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir Questão"
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
              Tem certeza que deseja remover esta questão do banco?
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              "{deleteTarget?.titulo}"
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
