import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Plus,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { adminApi, AdminSimulado } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

export const ProfessorSimulados: React.FC = () => {
  const [simulados, setSimulados] = useState<AdminSimulado[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Simulado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSimulado, setEditingSimulado] = useState<AdminSimulado | null>(null);

  const [formTitulo, setFormTitulo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formBanca, setFormBanca] = useState('Vunesp');
  const [formTempo, setFormTempo] = useState(60);
  const [formPublicado, setFormPublicado] = useState(true);
  const [formQuestoes, setFormQuestoes] = useState<Array<{
    id: string;
    enunciado: string;
    alternativas: Array<{ id: string; texto: string }>;
    respostaCorreta: string;
    explicacao: string;
  }>>([]);

  // Modal Confirmação Exclusão
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; titulo: string } | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await adminApi.getSimulados();
      setSimulados(list);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar simulados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingSimulado(null);
    setFormTitulo('');
    setFormDescricao('Simulado preparatório com questões comentadas.');
    setFormBanca('Vunesp');
    setFormTempo(60);
    setFormPublicado(true);
    setFormQuestoes([
      {
        id: 'q-1',
        enunciado: 'Assinale a oração em que a concordância verbal está rigorosamente correta:',
        alternativas: [
          { id: 'a', texto: 'Houve muitos aprovados no certame deste ano.' },
          { id: 'b', texto: 'Houveram muitos aprovados no certame deste ano.' },
          { id: 'c', texto: 'Fazem dois anos que iniciei os estudos para o concurso.' },
          { id: 'd', texto: 'Aluga-se salas comerciais no edifício central.' }
        ],
        respostaCorreta: 'a',
        explicacao: 'O verbo HAVER no sentido de existir é impessoal e deve ficar na 3ª pessoa do singular (houve).'
      }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sim: AdminSimulado) => {
    setEditingSimulado(sim);
    setFormTitulo(sim.titulo);
    setFormDescricao(sim.descricao || '');
    setFormBanca(sim.banca || 'Vunesp');
    setFormTempo(sim.tempoMinutos || 60);
    setFormPublicado(sim.publicado !== false);
    setFormQuestoes(Array.isArray(sim.questoes) && sim.questoes.length > 0 ? sim.questoes : [
      {
        id: 'q-1',
        enunciado: '',
        alternativas: [
          { id: 'a', texto: '' },
          { id: 'b', texto: '' },
          { id: 'c', texto: '' },
          { id: 'd', texto: '' }
        ],
        respostaCorreta: 'a',
        explicacao: ''
      }
    ]);
    setIsModalOpen(true);
  };

  const handleAddQuestao = () => {
    setFormQuestoes(prev => [
      ...prev,
      {
        id: `q-${prev.length + 1}`,
        enunciado: '',
        alternativas: [
          { id: 'a', texto: '' },
          { id: 'b', texto: '' },
          { id: 'c', texto: '' },
          { id: 'd', texto: '' }
        ],
        respostaCorreta: 'a',
        explicacao: ''
      }
    ]);
  };

  const handleRemoveQuestao = (index: number) => {
    if (formQuestoes.length <= 1) {
      showToast('O simulado precisa ter ao menos uma questão.', 'warning');
      return;
    }
    setFormQuestoes(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestao = (index: number, field: string, value: any) => {
    setFormQuestoes(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleUpdateAlternativa = (qIndex: number, altId: string, texto: string) => {
    setFormQuestoes(prev => {
      const copy = [...prev];
      copy[qIndex].alternativas = copy[qIndex].alternativas.map(alt =>
        alt.id === altId ? { ...alt, texto } : alt
      );
      return copy;
    });
  };

  const handleSaveSimulado = async () => {
    if (!formTitulo.trim()) {
      showToast('Digite um título para o simulado.', 'warning');
      return;
    }

    const vazias = formQuestoes.some(q => !q.enunciado.trim() || q.alternativas.some(a => !a.texto.trim()));
    if (vazias) {
      showToast('Preencha os enunciados e todas as opções de alternativas das questões.', 'warning');
      return;
    }

    try {
      const payload = {
        titulo: formTitulo,
        descricao: formDescricao,
        banca: formBanca,
        tempoMinutos: formTempo,
        publicado: formPublicado,
        questoes: formQuestoes
      };

      if (editingSimulado) {
        await adminApi.atualizarSimulado(editingSimulado.id, payload);
        showToast('Simulado atualizado com sucesso!', 'success');
      } else {
        await adminApi.criarSimulado(payload);
        showToast('Novo simulado cadastrado e publicado com sucesso!', 'success');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar simulado.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.excluirSimulado(deleteTarget.id);
      showToast(`Simulado "${deleteTarget.titulo}" excluído com sucesso!`, 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir simulado.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Simulados & Provas Avaliativas
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Crie avaliações com tempo cronometrado, gabarito e bancas oficiais
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
          Novo Simulado
        </Button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Carregando simulados cadastrados...
        </div>
      ) : simulados.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileCheck size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhum simulado cadastrado
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Comece criando o primeiro simulado geral ou temático para os alunos testarem seus conhecimentos.
          </p>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
            Criar Primeiro Simulado
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {simulados.map((sim) => (
            <Card key={sim.id} padding="lg">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Badge variant="purple" size="sm">{sim.banca || 'Geral'}</Badge>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} /> {sim.tempoMinutos || 60} minutos
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    • {Array.isArray(sim.questoes) ? sim.questoes.length : 0} Questões
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {sim.publicado === false && (
                    <Badge variant="warning" size="sm">Rascunho</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 size={14} />}
                    onClick={() => handleOpenEdit(sim)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={14} />}
                    style={{ color: 'var(--danger)' }}
                    onClick={() => setDeleteTarget({ id: sim.id, titulo: sim.titulo })}
                  >
                    Excluir
                  </Button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                {sim.titulo}
              </h3>

              {sim.descricao && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {sim.descricao}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar Simulado */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSimulado ? 'Editar Simulado' : 'Novo Simulado'}
        maxWidth="800px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveSimulado}>Salvar Simulado</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Título do Simulado *"
            placeholder="Ex: Simulado Geral Vunesp — Nível Médio"
            value={formTitulo}
            onChange={(e) => setFormTitulo(e.target.value)}
          />

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Descrição e Orientações aos Estudantes
            </label>
            <textarea
              rows={2}
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
              placeholder="Ex: Prova contendo 20 questões de gramática e interpretação..."
              value={formDescricao}
              onChange={(e) => setFormDescricao(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Input
              label="Banca de Referência"
              placeholder="Ex: FGV, Vunesp, Cebraspe"
              value={formBanca}
              onChange={(e) => setFormBanca(e.target.value)}
            />
            <Input
              label="Tempo Limite (minutos)"
              type="number"
              min={10}
              value={formTempo}
              onChange={(e) => setFormTempo(parseInt(e.target.value) || 60)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={formPublicado}
                  onChange={(e) => setFormPublicado(e.target.checked)}
                  style={{ accentColor: 'var(--accent)', width: '1rem', height: '1rem' }}
                />
                Simulado Ativo / Publicado
              </label>
            </div>
          </div>

          {/* Questões do Simulado */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Questões da Prova ({formQuestoes.length})
              </h4>
              <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={handleAddQuestao}>
                Adicionar Questão
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {formQuestoes.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.875rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem' }}>
                      Questão #{qIdx + 1}
                    </span>
                    {formQuestoes.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        style={{ color: 'var(--danger)' }}
                        onClick={() => handleRemoveQuestao(qIdx)}
                      >
                        Remover Questão
                      </Button>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      Enunciado da Questão
                    </label>
                    <textarea
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Comando da questão..."
                      value={q.enunciado}
                      onChange={(e) => handleUpdateQuestao(qIdx, 'enunciado', e.target.value)}
                    />
                  </div>

                  {/* Alternativas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Alternativas (Selecione o botão de opção correspondente à correta)
                    </span>
                    {q.alternativas.map((alt) => (
                      <div key={alt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="radio"
                          name={`correta-sim-${qIdx}`}
                          checked={q.respostaCorreta === alt.id}
                          onChange={() => handleUpdateQuestao(qIdx, 'respostaCorreta', alt.id)}
                          style={{ width: '1rem', height: '1rem', accentColor: 'var(--success)', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 700, textTransform: 'uppercase', width: '1.25rem', color: 'var(--text-primary)' }}>{alt.id})</span>
                        <input
                          type="text"
                          style={{
                            flex: 1,
                            padding: '0.375rem 0.625rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#ffffff',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            outline: 'none'
                          }}
                          placeholder={`Texto da opção (${alt.id})`}
                          value={alt.texto}
                          onChange={(e) => handleUpdateAlternativa(qIdx, alt.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      Comentário / Resolução da Professora
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '0.375rem 0.625rem',
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        outline: 'none'
                      }}
                      placeholder="Explicação do gabarito para o aluno ver após finalizar a prova..."
                      value={q.explicacao}
                      onChange={(e) => handleUpdateQuestao(qIdx, 'explicacao', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Exclusão */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir Simulado"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              variant="primary"
              style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              onClick={handleConfirmDelete}
            >
              Sim, Excluir Simulado
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={32} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Tem certeza que deseja excluir este simulado?
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <strong>{deleteTarget?.titulo}</strong> será permanentemente removido da plataforma.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
