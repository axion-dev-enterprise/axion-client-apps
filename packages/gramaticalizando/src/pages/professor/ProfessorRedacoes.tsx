import React, { useState, useEffect } from 'react';
import {
  PenTool,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  Send,
  Sliders
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { adminApi, AdminTemaRedacao } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

interface RedacaoSubmissao {
  id: string;
  usuarioId?: string;
  alunoNome?: string;
  alunoEmail?: string;
  tema: string;
  texto: string;
  arquivoUrl?: string;
  status: 'pendente' | 'em_correcao' | 'corrigida';
  notaGeral?: number;
  competencias?: {
    c1?: number;
    c2?: number;
    c3?: number;
    c4?: number;
    c5?: number;
  };
  feedbackProfessora?: string;
  criadoEm?: string;
}

export const ProfessorRedacoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submissoes' | 'temas'>('submissoes');
  const [redacoes, setRedacoes] = useState<RedacaoSubmissao[]>([]);
  const [temas, setTemas] = useState<AdminTemaRedacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtro de submissões
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Modal Correção
  const [selectedRedacao, setSelectedRedacao] = useState<RedacaoSubmissao | null>(null);
  const [notaC1, setNotaC1] = useState('180');
  const [notaC2, setNotaC2] = useState('180');
  const [notaC3, setNotaC3] = useState('180');
  const [notaC4, setNotaC4] = useState('180');
  const [notaC5, setNotaC5] = useState('180');
  const [feedback, setFeedback] = useState('');

  // Modal Tema
  const [isTemaModalOpen, setIsTemaModalOpen] = useState(false);
  const [editingTema, setEditingTema] = useState<AdminTemaRedacao | null>(null);
  const [temaForm, setTemaForm] = useState({
    titulo: '',
    foco: 'Concursos / ENEM',
    instrucoes: '',
    prazo: ''
  });

  // Modal Exclusão Tema
  const [deleteTemaTarget, setDeleteTemaTarget] = useState<AdminTemaRedacao | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [reds, tms] = await Promise.all([
        adminApi.getRedacoes(),
        adminApi.getTemasRedacao()
      ]);
      setRedacoes(reds);
      setTemas(tms);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar redações e temas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers Correção
  const handleOpenCorrecao = (r: RedacaoSubmissao) => {
    setSelectedRedacao(r);
    const comps = r.competencias || {};
    setNotaC1(String(comps.c1 || 180));
    setNotaC2(String(comps.c2 || 180));
    setNotaC3(String(comps.c3 || 180));
    setNotaC4(String(comps.c4 || 180));
    setNotaC5(String(comps.c5 || 180));
    setFeedback(r.feedbackProfessora || 'Excelente estrutura e argumentação sólida.');
  };

  const handleSalvarCorrecao = async () => {
    if (!selectedRedacao) return;

    const c1 = parseInt(notaC1) || 0;
    const c2 = parseInt(notaC2) || 0;
    const c3 = parseInt(notaC3) || 0;
    const c4 = parseInt(notaC4) || 0;
    const c5 = parseInt(notaC5) || 0;
    const total = c1 + c2 + c3 + c4 + c5;

    if (!feedback.trim()) {
      showToast('Digite um parecer formativo para o aluno.', 'warning');
      return;
    }

    try {
      await adminApi.corrigirRedacao(selectedRedacao.id, {
        notaGeral: total,
        feedbackProfessora: feedback,
        competencias: { c1, c2, c3, c4, c5 }
      });

      showToast(`Redação de ${selectedRedacao.alunoNome || 'aluno'} corrigida com nota ${total}/1000!`, 'success');
      setSelectedRedacao(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao registrar correção.', 'error');
    }
  };

  // Handlers Tema
  const handleOpenNewTema = () => {
    setEditingTema(null);
    setTemaForm({
      titulo: '',
      foco: 'Concursos / ENEM',
      instrucoes: 'A partir da leitura dos textos motivadores e com base nos conhecimentos construídos, redija texto dissertativo-argumentativo...',
      prazo: ''
    });
    setIsTemaModalOpen(true);
  };

  const handleOpenEditTema = (t: AdminTemaRedacao) => {
    setEditingTema(t);
    setTemaForm({
      titulo: t.titulo,
      foco: t.foco || 'Geral',
      instrucoes: t.instrucoes || '',
      prazo: t.prazo || ''
    });
    setIsTemaModalOpen(true);
  };

  const handleSaveTema = async () => {
    if (!temaForm.titulo.trim()) {
      showToast('Digite o título do tema.', 'warning');
      return;
    }

    try {
      if (editingTema) {
        await adminApi.atualizarTemaRedacao(editingTema.id, temaForm);
        showToast('Tema de redação atualizado com sucesso!', 'success');
      } else {
        await adminApi.criarTemaRedacao(temaForm);
        showToast('Novo tema de redação cadastrado com sucesso!', 'success');
      }
      setIsTemaModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar tema.', 'error');
    }
  };

  const handleConfirmDeleteTema = async () => {
    if (!deleteTemaTarget) return;
    try {
      await adminApi.excluirTemaRedacao(deleteTemaTarget.id);
      showToast('Tema de redação excluído com sucesso!', 'success');
      setDeleteTemaTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir tema.', 'error');
    }
  };

  const filteredRedacoes = redacoes.filter(r => {
    if (statusFilter === 'todos') return true;
    return r.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Correção de Redações & Temas
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Avalie textos de estudantes e gerencie propostas temáticas dissertativas
          </p>
        </div>

        {activeTab === 'temas' && (
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNewTema}>
            Novo Tema de Redação
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('submissoes')}
          style={{
            padding: '0.75rem 0.25rem',
            fontSize: '0.9375rem',
            fontWeight: activeTab === 'submissoes' ? 700 : 500,
            color: activeTab === 'submissoes' ? 'var(--accent)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'submissoes' ? '2px solid var(--accent)' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <PenTool size={16} />
          <span>Redações dos Alunos</span>
          <Badge variant={activeTab === 'submissoes' ? 'purple' : 'neutral'} size="sm">
            {redacoes.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('temas')}
          style={{
            padding: '0.75rem 0.25rem',
            fontSize: '0.9375rem',
            fontWeight: activeTab === 'temas' ? 700 : 500,
            color: activeTab === 'temas' ? 'var(--accent)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'temas' ? '2px solid var(--accent)' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileText size={16} />
          <span>Temas Propostos</span>
          <Badge variant={activeTab === 'temas' ? 'purple' : 'neutral'} size="sm">
            {temas.length}
          </Badge>
        </button>
      </div>

      {/* Aba 1: Submissões dos Alunos */}
      {activeTab === 'submissoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['todos', 'pendente', 'corrigida'].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(st)}
              >
                {st === 'todos' ? 'Todas' : st === 'pendente' ? 'Pendentes' : 'Corrigidas'}
              </Button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Carregando redações dos estudantes...
            </div>
          ) : filteredRedacoes.length === 0 ? (
            <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <PenTool size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Nenhuma redação encontrada
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Nenhum texto de aluno encontrado para o filtro selecionado.
              </p>
            </Card>
          ) : (
            filteredRedacoes.map((item) => (
              <Card key={item.id} padding="lg">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Aluno(a): <strong style={{ color: 'var(--text-primary)' }}>{item.alunoNome || 'Estudante'}</strong>
                      {item.alunoEmail && ` (${item.alunoEmail})`}
                    </span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                      {item.tema}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant={item.status === 'corrigida' ? 'success' : 'warning'} size="sm">
                      {item.status === 'corrigida' ? `Nota: ${item.notaGeral}/1000` : 'Pendente'}
                    </Badge>
                    <Button
                      variant={item.status === 'corrigida' ? 'secondary' : 'primary'}
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => handleOpenCorrecao(item)}
                    >
                      {item.status === 'corrigida' ? 'Revisar Parecer' : 'Avaliar Redação'}
                    </Button>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxHeight: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.texto}
                </p>

                {item.feedbackProfessora && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem', color: 'var(--accent-text)' }}>
                    <strong>Parecer:</strong> {item.feedbackProfessora}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Aba 2: Temas de Redação */}
      {activeTab === 'temas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Carregando temas de redação...
            </div>
          ) : temas.length === 0 ? (
            <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <FileText size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Nenhum tema cadastrado
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Crie propostas dissertativas com textos motivadores para orientar os alunos.
              </p>
              <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNewTema}>
                Cadastrar Tema
              </Button>
            </Card>
          ) : (
            temas.map((tema) => (
              <Card key={tema.id} padding="lg">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Badge variant="purple" size="sm">
                    {tema.foco || 'Concursos & ENEM'}
                  </Badge>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 size={14} />}
                      onClick={() => handleOpenEditTema(tema)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      style={{ color: 'var(--danger)' }}
                      onClick={() => setDeleteTemaTarget(tema)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {tema.titulo}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {tema.instrucoes}
                </p>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal Correção de Redação */}
      <Modal
        isOpen={!!selectedRedacao}
        onClose={() => setSelectedRedacao(null)}
        title={`Avaliação de Redação — ${selectedRedacao?.alunoNome || 'Estudante'}`}
        maxWidth="800px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedRedacao(null)}>Cancelar</Button>
            <Button variant="primary" icon={<Send size={14} />} onClick={handleSalvarCorrecao}>
              Registrar Correção & Nota
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TEMA PROPOSTO</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedRedacao?.tema}
            </h4>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TEXTO ENVIADO PELO ALUNO</span>
            <div
              style={{
                marginTop: '0.375rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
                maxHeight: '260px',
                overflowY: 'auto'
              }}
            >
              {selectedRedacao?.texto}
            </div>
          </div>

          {/* Competências */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Notas por Competência (0 a 200 pontos cada)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              <Input label="C1: Norma Culta" type="number" min={0} max={200} value={notaC1} onChange={(e) => setNotaC1(e.target.value)} />
              <Input label="C2: Tema e Repertório" type="number" min={0} max={200} value={notaC2} onChange={(e) => setNotaC2(e.target.value)} />
              <Input label="C3: Argumentação" type="number" min={0} max={200} value={notaC3} onChange={(e) => setNotaC3(e.target.value)} />
              <Input label="C4: Coesão Linguística" type="number" min={0} max={200} value={notaC4} onChange={(e) => setNotaC4(e.target.value)} />
              <Input label="C5: Intervenção/Concl." type="number" min={0} max={200} value={notaC5} onChange={(e) => setNotaC5(e.target.value)} />
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.5rem', fontWeight: 700, color: 'var(--accent)', fontSize: '1rem' }}>
              Nota Total Calculada: {(parseInt(notaC1) || 0) + (parseInt(notaC2) || 0) + (parseInt(notaC3) || 0) + (parseInt(notaC4) || 0) + (parseInt(notaC5) || 0)} / 1000
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Parecer Pedagógico da Profª Wilma *
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
              placeholder="Indique pontos fortes, desvios gramaticais e orientações para o próximo texto..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Criar / Editar Tema */}
      <Modal
        isOpen={isTemaModalOpen}
        onClose={() => setIsTemaModalOpen(false)}
        title={editingTema ? 'Editar Tema de Redação' : 'Novo Tema de Redação'}
        maxWidth="680px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsTemaModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveTema}>Salvar Tema</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Título da Proposta *"
            placeholder="Ex: O papel da inteligência artificial na educação pública"
            value={temaForm.titulo}
            onChange={(e) => setTemaForm({ ...temaForm, titulo: e.target.value })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Público / Foco"
              placeholder="Ex: ENEM, Vunesp, PM-SP"
              value={temaForm.foco}
              onChange={(e) => setTemaForm({ ...temaForm, foco: e.target.value })}
            />
            <Input
              label="Prazo de Envio (Opcional)"
              placeholder="Ex: 30/09/2026"
              value={temaForm.prazo}
              onChange={(e) => setTemaForm({ ...temaForm, prazo: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Textos Motivadores e Instruções
            </label>
            <textarea
              rows={5}
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
              placeholder="Insira dados estatísticos, citações motivadoras e comando da prova..."
              value={temaForm.instrucoes}
              onChange={(e) => setTemaForm({ ...temaForm, instrucoes: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Exclusão Tema */}
      <Modal
        isOpen={!!deleteTemaTarget}
        onClose={() => setDeleteTemaTarget(null)}
        title="Excluir Tema de Redação"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTemaTarget(null)}>Cancelar</Button>
            <Button
              variant="primary"
              style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              onClick={handleConfirmDeleteTema}
            >
              Sim, Excluir Tema
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={32} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Tem certeza que deseja excluir esta proposta temática?
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              "{deleteTemaTarget?.titulo}"
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
