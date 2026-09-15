import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Clock,
  Edit2,
  Trash2,
  Layers,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { adminApi, AdminMateria, AdminAula } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

export const ProfessorAulas: React.FC = () => {
  const [materias, setMaterias] = useState<AdminMateria[]>([]);
  const [aulas, setAulas] = useState<AdminAula[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Módulo
  const [isModuloModalOpen, setIsModuloModalOpen] = useState(false);
  const [editingModulo, setEditingModulo] = useState<AdminMateria | null>(null);
  const [moduloForm, setModuloForm] = useState({ nome: '', descricao: '', ordem: 1 });

  // Modal Aula
  const [isAulaModalOpen, setIsAulaModalOpen] = useState(false);
  const [editingAula, setEditingAula] = useState<AdminAula | null>(null);
  const [aulaForm, setAulaForm] = useState({
    materiaId: '',
    titulo: '',
    subtitulo: '',
    duracao: '25 min',
    ordem: 1,
    videoUrl: '',
    materialPdfUrl: '',
    conteudo: '',
    publicado: true
  });

  // Modal Confirmação de Exclusão
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'materia' | 'aula'; id: string; name: string } | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [mats, lsns] = await Promise.all([
        adminApi.getMaterias(),
        adminApi.getAulas()
      ]);
      setMaterias(mats);
      setAulas(lsns);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados dos módulos e aulas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers Módulo
  const handleOpenNewModulo = () => {
    setEditingModulo(null);
    setModuloForm({ nome: '', descricao: '', ordem: materias.length + 1 });
    setIsModuloModalOpen(true);
  };

  const handleOpenEditModulo = (mod: AdminMateria) => {
    setEditingModulo(mod);
    setModuloForm({ nome: mod.nome, descricao: mod.descricao || '', ordem: mod.ordem || 1 });
    setIsModuloModalOpen(true);
  };

  const handleSaveModulo = async () => {
    if (!moduloForm.nome.trim()) {
      showToast('Digite um nome para o módulo.', 'warning');
      return;
    }
    try {
      if (editingModulo) {
        await adminApi.atualizarMateria(editingModulo.id, moduloForm);
        showToast('Módulo atualizado com sucesso!', 'success');
      } else {
        await adminApi.criarMateria(moduloForm);
        showToast('Novo módulo criado com sucesso!', 'success');
      }
      setIsModuloModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar módulo.', 'error');
    }
  };

  // Handlers Aula
  const handleOpenNewAula = (targetMateriaId?: string) => {
    setEditingAula(null);
    const mId = targetMateriaId || (materias[0]?.id || '');
    const currentAulasInMod = aulas.filter(a => a.materiaId === mId);
    setAulaForm({
      materiaId: mId,
      titulo: '',
      subtitulo: '',
      duracao: '25 min',
      ordem: currentAulasInMod.length + 1,
      videoUrl: '',
      materialPdfUrl: '',
      conteudo: '',
      publicado: true
    });
    setIsAulaModalOpen(true);
  };

  const handleOpenEditAula = (aula: AdminAula) => {
    setEditingAula(aula);
    setAulaForm({
      materiaId: aula.materiaId,
      titulo: aula.titulo,
      subtitulo: aula.subtitulo || '',
      duracao: aula.duracao || '25 min',
      ordem: aula.ordem || 1,
      videoUrl: aula.videoUrl || '',
      materialPdfUrl: aula.materialPdfUrl || '',
      conteudo: aula.conteudo || '',
      publicado: aula.publicado !== false
    });
    setIsAulaModalOpen(true);
  };

  const handleSaveAula = async () => {
    if (!aulaForm.titulo.trim()) {
      showToast('Digite um título para a aula.', 'warning');
      return;
    }
    if (!aulaForm.materiaId) {
      showToast('Selecione o módulo da aula.', 'warning');
      return;
    }
    try {
      if (editingAula) {
        await adminApi.atualizarAula(editingAula.id, aulaForm);
        showToast('Aula atualizada com sucesso!', 'success');
      } else {
        await adminApi.criarAula(aulaForm);
        showToast('Nova aula cadastrada com sucesso!', 'success');
      }
      setIsAulaModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar aula.', 'error');
    }
  };

  // Exclusão
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'materia') {
        await adminApi.excluirMateria(deleteTarget.id);
        showToast(`Módulo "${deleteTarget.name}" excluído com sucesso!`, 'success');
      } else {
        await adminApi.excluirAula(deleteTarget.id);
        showToast(`Aula "${deleteTarget.name}" excluída com sucesso!`, 'success');
      }
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir item.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Gerenciamento de Módulos & Aulas
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Crie, edite e organize a estrutura programática completa da plataforma
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="secondary" icon={<Layers size={16} />} onClick={handleOpenNewModulo}>
            Novo Módulo
          </Button>
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => handleOpenNewAula()}>
            Nova Aula
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Carregando módulos e aulas...
        </div>
      ) : materias.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookOpen size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhum módulo cadastrado ainda
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Comece criando o primeiro módulo programático para adicionar suas aulas.
          </p>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNewModulo}>
            Criar Primeiro Módulo
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {materias.map((mod, modIdx) => {
            const modAulas = aulas.filter(a => a.materiaId === mod.id);
            return (
              <Card key={mod.id} padding="lg">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-text)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      MÓDULO {mod.ordem ? `0${mod.ordem}` : `0${modIdx + 1}`}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.125rem' }}>
                      {mod.nome}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge variant="purple" size="sm">
                      {modAulas.length} Aulas
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 size={14} />}
                      onClick={() => handleOpenEditModulo(mod)}
                      aria-label="Editar módulo"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      style={{ color: 'var(--danger)' }}
                      onClick={() => setDeleteTarget({ type: 'materia', id: mod.id, name: mod.nome })}
                      aria-label="Excluir módulo"
                    >
                      Excluir
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Plus size={14} />}
                      onClick={() => handleOpenNewAula(mod.id)}
                    >
                      Adicionar Aula
                    </Button>
                  </div>
                </div>

                {mod.descricao && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    {mod.descricao}
                  </p>
                )}

                {/* Grid de Aulas */}
                {modAulas.length === 0 ? (
                  <div
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-2)',
                      border: '1px dashed var(--border-subtle)',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem'
                    }}
                  >
                    Nenhuma aula adicionada neste módulo ainda.{' '}
                    <button
                      onClick={() => handleOpenNewAula(mod.id)}
                      style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Adicione a primeira aula agora.
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.875rem' }}>
                    {modAulas.map((aula) => (
                      <div
                        key={aula.id}
                        style={{
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          transition: 'border-color var(--transition-fast)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              Aula #{aula.ordem || 1}
                            </span>
                            {aula.publicado === false && (
                              <Badge variant="warning" size="sm">Rascunho</Badge>
                            )}
                          </div>
                          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                            {aula.titulo}
                          </h4>
                          {aula.subtitulo && (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {aula.subtitulo}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.625rem', marginTop: '0.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={12} /> {aula.duracao || '25 min'}
                            </span>
                            {aula.videoUrl && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)' }}>
                                <Video size={12} /> Vídeo
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Edit2 size={13} />}
                              onClick={() => handleOpenEditAula(aula)}
                              aria-label="Editar aula"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash2 size={13} />}
                              style={{ color: 'var(--danger)' }}
                              onClick={() => setDeleteTarget({ type: 'aula', id: aula.id, name: aula.titulo })}
                              aria-label="Excluir aula"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Módulo */}
      <Modal
        isOpen={isModuloModalOpen}
        onClose={() => setIsModuloModalOpen(false)}
        title={editingModulo ? 'Editar Módulo' : 'Novo Módulo Programático'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModuloModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveModulo}>Salvar Módulo</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Nome do Módulo *"
            placeholder="Ex: Concordância Verbal e Nominal"
            value={moduloForm.nome}
            onChange={(e) => setModuloForm({ ...moduloForm, nome: e.target.value })}
          />
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Descrição Pedagógica
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
                outline: 'none'
              }}
              placeholder="Descreva o que o aluno aprenderá neste módulo..."
              value={moduloForm.descricao}
              onChange={(e) => setModuloForm({ ...moduloForm, descricao: e.target.value })}
            />
          </div>
          <Input
            label="Ordem de Exibição"
            type="number"
            min={1}
            value={moduloForm.ordem}
            onChange={(e) => setModuloForm({ ...moduloForm, ordem: parseInt(e.target.value) || 1 })}
          />
        </div>
      </Modal>

      {/* Modal Aula */}
      <Modal
        isOpen={isAulaModalOpen}
        onClose={() => setIsAulaModalOpen(false)}
        title={editingAula ? 'Editar Aula' : 'Nova Aula'}
        maxWidth="680px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAulaModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveAula}>Salvar Aula</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Módulo de Destino *
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
              value={aulaForm.materiaId}
              onChange={(e) => setAulaForm({ ...aulaForm, materiaId: e.target.value })}
            >
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <Input
              label="Título da Aula *"
              placeholder="Ex: Regras Práticas do Hífen"
              value={aulaForm.titulo}
              onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
            />
            <Input
              label="Duração Estimada"
              placeholder="Ex: 30 min"
              value={aulaForm.duracao}
              onChange={(e) => setAulaForm({ ...aulaForm, duracao: e.target.value })}
            />
          </div>

          <Input
            label="Subtítulo / Foco Principal"
            placeholder="Ex: Quando usar e quando nunca usar o hífen segundo o Acordo"
            value={aulaForm.subtitulo}
            onChange={(e) => setAulaForm({ ...aulaForm, subtitulo: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="URL do Vídeo (YouTube / Vimeo / MP4)"
              placeholder="https://youtube.com/watch?v=..."
              value={aulaForm.videoUrl}
              onChange={(e) => setAulaForm({ ...aulaForm, videoUrl: e.target.value })}
            />
            <Input
              label="URL do Material de Apoio (PDF)"
              placeholder="https://.../apostila.pdf"
              value={aulaForm.materialPdfUrl}
              onChange={(e) => setAulaForm({ ...aulaForm, materialPdfUrl: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Conteúdo Teórico / Resumo da Aula (HTML / Texto Completo)
            </label>
            <textarea
              rows={6}
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
              placeholder="Insira o texto teórico explicativo, exemplos, macetes e tabelas..."
              value={aulaForm.conteudo}
              onChange={(e) => setAulaForm({ ...aulaForm, conteudo: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="publicado-check"
              checked={aulaForm.publicado}
              onChange={(e) => setAulaForm({ ...aulaForm, publicado: e.target.checked })}
              style={{ accentColor: 'var(--accent)', width: '1rem', height: '1rem' }}
            />
            <label htmlFor="publicado-check" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
              Publicar imediatamente para os alunos
            </label>
          </div>
        </div>
      </Modal>

      {/* Modal Confirmação de Exclusão */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              variant="primary"
              style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              onClick={handleConfirmDelete}
            >
              Sim, Excluir Definitivamente
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={32} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Tem certeza que deseja excluir este {deleteTarget?.type === 'materia' ? 'módulo' : 'aula'}?
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <strong>{deleteTarget?.name}</strong> será permanentemente removido da plataforma.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
