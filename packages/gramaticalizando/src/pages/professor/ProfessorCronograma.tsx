import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { cronogramaApi, Cronograma, MetaCronograma } from '../../api/cronograma';
import { useToast } from '../../context/ToastContext';

export const ProfessorCronograma: React.FC = () => {
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCronograma, setEditingCronograma] = useState<Cronograma | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cronograma | null>(null);

  // Form State
  const [formTitulo, setFormTitulo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formPlano, setFormPlano] = useState('todos');
  const [formPublicado, setFormPublicado] = useState(true);
  const [formDias, setFormDias] = useState<MetaCronograma[]>([]);

  // Novo Item / Meta Form
  const [novoDiaNome, setNovoDiaNome] = useState('');
  const [novoDiaModulo, setNovoDiaModulo] = useState('');
  const [novoDiaAula, setNovoDiaAula] = useState('');
  const [novoDiaDuracao, setNovoDiaDuracao] = useState('45 min');
  const [novoDiaTipo, setNovoDiaTipo] = useState<'teoria' | 'exercicio' | 'redacao' | 'simulado'>('teoria');

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await cronogramaApi.listarAdmin();
      setCronogramas(list);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar cronogramas de estudo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingCronograma(null);
    setFormTitulo('');
    setFormDescricao('Plano de estudos estratégico focado em gramática, interpretação e redação para concursos e vestibulares.');
    setFormPlano('todos');
    setFormPublicado(true);
    setFormDias([
      {
        id: 'dia-1',
        dia: 'Segunda-feira',
        modulo: 'Morfologia & Classes Gramaticais',
        aula: 'Substantivos e Adjetivos em Concursos',
        duracao: '45 min',
        tipo: 'teoria'
      },
      {
        id: 'dia-2',
        dia: 'Terça-feira',
        modulo: 'Interpretação e Compreensão',
        aula: 'Gêneros Textuais e Figuras de Linguagem',
        duracao: '50 min',
        tipo: 'teoria'
      },
      {
        id: 'dia-3',
        dia: 'Quarta-feira',
        modulo: 'Banco de Questões',
        aula: 'Resolução de 15 Questões Vunesp & FGV',
        duracao: '40 min',
        tipo: 'exercicio'
      },
      {
        id: 'dia-4',
        dia: 'Quinta-feira',
        modulo: 'Laboratório de Redação',
        aula: 'Produção Textual Dissertativa com Modelo Nota 1000',
        duracao: '60 min',
        tipo: 'redacao'
      },
      {
        id: 'dia-5',
        dia: 'Sexta-feira',
        modulo: 'Simulados & Revisão',
        aula: 'Simulado de Fixação Semanal',
        duracao: '45 min',
        tipo: 'simulado'
      }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Cronograma) => {
    setEditingCronograma(c);
    setFormTitulo(c.titulo);
    setFormDescricao(c.descricao || '');
    setFormPlano(c.plano || 'todos');
    setFormPublicado(c.publicado !== false);
    setFormDias(Array.isArray(c.dias) ? [...c.dias] : []);
    setIsModalOpen(true);
  };

  const handleAddMeta = () => {
    if (!novoDiaNome.trim() || !novoDiaAula.trim()) {
      showToast('Preencha o dia (ex: Segunda-feira) e o nome da aula.', 'warning');
      return;
    }
    const novaMeta: MetaCronograma = {
      id: `meta-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dia: novoDiaNome.trim(),
      modulo: novoDiaModulo.trim() || 'Língua Portuguesa',
      aula: novoDiaAula.trim(),
      duracao: novoDiaDuracao.trim() || '45 min',
      tipo: novoDiaTipo
    };
    setFormDias([...formDias, novaMeta]);
    setNovoDiaNome('');
    setNovoDiaModulo('');
    setNovoDiaAula('');
    setNovoDiaDuracao('45 min');
    setNovoDiaTipo('teoria');
  };

  const handleRemoveMeta = (id: string) => {
    setFormDias(formDias.filter(d => d.id !== id));
  };

  const handleSaveCronograma = async () => {
    if (!formTitulo.trim()) {
      showToast('Digite um título para o cronograma.', 'warning');
      return;
    }
    if (formDias.length === 0) {
      showToast('Adicione pelo menos uma meta ou dia de estudo ao cronograma.', 'warning');
      return;
    }

    try {
      const payload: Partial<Cronograma> = {
        titulo: formTitulo.trim(),
        descricao: formDescricao.trim(),
        plano: formPlano,
        publicado: formPublicado,
        dias: formDias
      };

      if (editingCronograma) {
        await cronogramaApi.atualizarAdmin(editingCronograma.id, payload);
        showToast('Cronograma atualizado com sucesso!', 'success');
      } else {
        await cronogramaApi.criarAdmin(payload);
        showToast('Novo cronograma criado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar cronograma.', 'error');
    }
  };

  const handleDeleteCronograma = async () => {
    if (!deleteTarget) return;
    try {
      await cronogramaApi.excluirAdmin(deleteTarget.id);
      showToast('Cronograma excluído com sucesso.', 'info');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir cronograma.', 'error');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
              <Calendar size={24} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Cronogramas de Estudo
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', margin: 0 }}>
            Planeje e organize as jornadas de estudo semanais dos seus alunos por nível e vestibular.
          </p>
        </div>

        <Button onClick={handleOpenNew} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          <span>Novo Cronograma</span>
        </Button>
      </div>

      {/* Grid de Cronogramas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px', border: '3px solid var(--accent-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Carregando cronogramas...
        </div>
      ) : cronogramas.length === 0 ? (
        <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', border: '1px dashed var(--border-subtle)' }}>
          <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhum cronograma cadastrado
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            Crie roteiros semanais organizados para orientar seus alunos passo a passo no aprendizado da Língua Portuguesa.
          </p>
          <Button onClick={handleOpenNew} variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            <span>Criar Primeiro Cronograma</span>
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {cronogramas.map((c) => (
            <Card
              key={c.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <Badge variant={c.publicado ? 'success' : 'warning'}>
                    {c.publicado ? 'Publicado' : 'Rascunho'}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Plano: {c.plano || 'Geral'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {c.titulo}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {c.descricao || 'Sem descrição cadastrada.'}
                </p>

                {/* Resumo de Metas */}
                <div style={{ backgroundColor: 'var(--bg-surface-2)', padding: '0.875rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Metas Semanais ({c.dias?.length || 0})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Seg a Sex
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {(c.dias || []).slice(0, 3).map((dia, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Clock size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <strong style={{ color: 'var(--text-primary)' }}>{dia.dia}:</strong>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dia.aula}</span>
                      </div>
                    ))}
                    {(c.dias?.length || 0) > 3 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.25rem' }}>
                        + {(c.dias?.length || 0) - 3} metas adicionais
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <Button
                  onClick={() => handleOpenEdit(c)}
                  variant="outline"
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Edit2 size={14} />
                  <span>Editar</span>
                </Button>
                <Button
                  onClick={() => setDeleteTarget(c)}
                  variant="ghost"
                  size="sm"
                  style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Trash2 size={14} />
                  <span>Excluir</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar Cronograma */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCronograma ? 'Editar Cronograma de Estudo' : 'Criar Novo Cronograma'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
              Título do Cronograma *
            </label>
            <Input
              value={formTitulo}
              onChange={(e) => setFormTitulo(e.target.value)}
              placeholder="Ex: Roteiro Intensivo de Português - Vunesp & FGV"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
              Descrição e Orientações
            </label>
            <textarea
              value={formDescricao}
              onChange={(e) => setFormDescricao(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--bg-surface-1)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Descreva as metas e o público-alvo deste cronograma..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
                Plano / Nível
              </label>
              <select
                value={formPlano}
                onChange={(e) => setFormPlano(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--bg-surface-1)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="todos">Todos os Planos</option>
                <option value="iniciante">Plano Básico / Iniciante</option>
                <option value="medio">Plano Médio / Intermediário</option>
                <option value="pro">Plano Pro / Concursos VIP</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
                Status de Publicação
              </label>
              <div style={{ display: 'flex', alignItems: 'center', height: '42px', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="chk-publicado"
                  checked={formPublicado}
                  onChange={(e) => setFormPublicado(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <label htmlFor="chk-publicado" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Visível aos alunos
                </label>
              </div>
            </div>
          </div>

          {/* Seção de Metas Cadastradas */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} style={{ color: 'var(--accent)' }} />
              Metas do Cronograma ({formDias.length})
            </h4>

            {formDias.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                Nenhuma meta adicionada ainda. Use o formulário abaixo para incluir metas diárias.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {formDias.map((item, index) => (
                  <div
                    key={item.id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-surface-2)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>
                          {item.dia}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.aula}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem' }}>
                        <span>Módulo: {item.modulo}</span>
                        <span>•</span>
                        <span>Duração: {item.duracao}</span>
                        <span>•</span>
                        <span style={{ textTransform: 'capitalize' }}>Tipo: {item.tipo || 'teoria'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMeta(item.id)}
                      style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Remover meta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar Nova Meta */}
            <div style={{ backgroundColor: 'var(--bg-surface-1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-subtle)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                Adicionar Nova Meta Diária:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Input
                  placeholder="Dia (ex: Segunda-feira)"
                  value={novoDiaNome}
                  onChange={(e) => setNovoDiaNome(e.target.value)}
                />
                <Input
                  placeholder="Nome da Aula / Tarefa"
                  value={novoDiaAula}
                  onChange={(e) => setNovoDiaAula(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <Input
                  placeholder="Módulo (ex: Sintaxe e Concordância)"
                  value={novoDiaModulo}
                  onChange={(e) => setNovoDiaModulo(e.target.value)}
                />
                <Input
                  placeholder="Duração (45 min)"
                  value={novoDiaDuracao}
                  onChange={(e) => setNovoDiaDuracao(e.target.value)}
                />
                <select
                  value={novoDiaTipo}
                  onChange={(e: any) => setNovoDiaTipo(e.target.value)}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    backgroundColor: 'var(--bg-surface-1)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="teoria">Teoria</option>
                  <option value="exercicio">Exercício</option>
                  <option value="redacao">Redação</option>
                  <option value="simulado">Simulado</option>
                </select>
                <Button type="button" onClick={handleAddMeta} variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Plus size={14} />
                  <span>Adicionar</span>
                </Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveCronograma} variant="primary">
              {editingCronograma ? 'Salvar Alterações' : 'Criar Cronograma'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Exclusão */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar Exclusão"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)', marginBottom: '1rem' }}>
            <AlertCircle size={24} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              Excluir este cronograma de estudos?
            </h4>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Você está prestes a remover o cronograma <strong>"{deleteTarget?.titulo}"</strong>. Os alunos deixarão de visualizar as metas associadas a ele. Esta ação não poderá ser desfeita.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button onClick={() => setDeleteTarget(null)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleDeleteCronograma} variant="outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              Sim, Excluir Cronograma
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
