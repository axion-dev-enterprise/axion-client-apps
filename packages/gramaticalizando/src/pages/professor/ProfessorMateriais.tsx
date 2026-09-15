import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { adminApi, AdminMaterialApoio, AdminMateria } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

export const ProfessorMateriais: React.FC = () => {
  const [materiais, setMateriais] = useState<AdminMaterialApoio[]>([]);
  const [materias, setMaterias] = useState<AdminMateria[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Material
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<AdminMaterialApoio | null>(null);

  const [formTitulo, setFormTitulo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formModuloId, setFormModuloId] = useState('');
  const [formTipo, setFormTipo] = useState('pdf');
  const [formArquivoUrl, setFormArquivoUrl] = useState('');
  const [formTamanho, setFormTamanho] = useState('2.5 MB');
  const [formPaginas, setFormPaginas] = useState(20);

  // Modal Exclusão
  const [deleteTarget, setDeleteTarget] = useState<AdminMaterialApoio | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [matList, mods] = await Promise.all([
        adminApi.getMateriais(),
        adminApi.getMaterias()
      ]);
      setMateriais(matList);
      setMaterias(mods);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar materiais de apoio.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingMaterial(null);
    setFormTitulo('');
    setFormDescricao('Apostila complementar em formato digital com mapas mentais e questões comentadas.');
    setFormModuloId(materias[0]?.id || 'geral');
    setFormTipo('pdf');
    setFormArquivoUrl('https://gramaticalizando.com.br/docs/apostila-modulo.pdf');
    setFormTamanho('3.2 MB');
    setFormPaginas(25);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: AdminMaterialApoio) => {
    setEditingMaterial(m);
    setFormTitulo(m.titulo);
    setFormDescricao(m.descricao || '');
    setFormModuloId(m.moduloId || (materias[0]?.id || 'geral'));
    setFormTipo(m.tipo || 'pdf');
    setFormArquivoUrl(m.arquivoUrl || '');
    setFormTamanho(m.tamanho || '2.5 MB');
    setFormPaginas(m.paginas || 20);
    setIsModalOpen(true);
  };

  const handleSaveMaterial = async () => {
    if (!formTitulo.trim()) {
      showToast('Digite um título para o material.', 'warning');
      return;
    }

    const currentMod = materias.find(mod => mod.id === formModuloId);
    const nomeModulo = currentMod ? currentMod.nome : 'Geral';

    try {
      const payload = {
        titulo: formTitulo,
        descricao: formDescricao,
        moduloId: formModuloId,
        nomeModulo,
        tipo: formTipo,
        arquivoUrl: formArquivoUrl,
        tamanho: formTamanho,
        paginas: formPaginas
      };

      if (editingMaterial) {
        await adminApi.atualizarMaterial(editingMaterial.id, payload);
        showToast('Material atualizado com sucesso!', 'success');
      } else {
        await adminApi.criarMaterial(payload);
        showToast('Novo material de apoio cadastrado!', 'success');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar material.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.excluirMaterial(deleteTarget.id);
      showToast(`Material "${deleteTarget.titulo}" excluído com sucesso!`, 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir material.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Materiais de Apoio & Apostilas
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Gerencie PDFs, resumos e cadernos de exercícios disponibilizados para download aos alunos
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
          Novo Material de Apoio
        </Button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Carregando acervo de materiais...
        </div>
      ) : materiais.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookOpen size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhum material cadastrado
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Adicione apostilas em PDF e mapas mentais para complementar o estudo dos alunos.
          </p>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenNew}>
            Cadastrar Material
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {materiais.map((item) => (
            <Card key={item.id} padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Badge variant="purple" size="sm">
                  {item.nomeModulo || 'Geral'}
                </Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 size={13} />}
                    onClick={() => handleOpenEdit(item)}
                    aria-label="Editar"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={13} />}
                    style={{ color: 'var(--danger)' }}
                    onClick={() => setDeleteTarget(item)}
                    aria-label="Excluir"
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem', lineHeight: 1.3 }}>
                {item.titulo}
              </h3>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', minHeight: '38px' }}>
                {item.descricao}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{item.tamanho || '2.5 MB'} • {item.paginas || 10} páginas</span>
                <a
                  href={item.arquivoUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <Download size={13} /> Acessar Link
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar Material */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMaterial ? 'Editar Material de Apoio' : 'Novo Material de Apoio'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveMaterial}>Salvar Material</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Título do Material *"
            placeholder="Ex: Manual de Sintaxe e Regência"
            value={formTitulo}
            onChange={(e) => setFormTitulo(e.target.value)}
          />

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Módulo Vinculado
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
              value={formModuloId}
              onChange={(e) => setFormModuloId(e.target.value)}
            >
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Descrição do Conteúdo
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
              placeholder="Descreva o que o material aborda e como utilizá-lo nos estudos..."
              value={formDescricao}
              onChange={(e) => setFormDescricao(e.target.value)}
            />
          </div>

          <Input
            label="URL do Arquivo / PDF *"
            placeholder="https://gramaticalizando.com.br/docs/..."
            value={formArquivoUrl}
            onChange={(e) => setFormArquivoUrl(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Input
              label="Tamanho"
              placeholder="Ex: 3.4 MB"
              value={formTamanho}
              onChange={(e) => setFormTamanho(e.target.value)}
            />
            <Input
              label="Páginas"
              type="number"
              min={1}
              value={formPaginas}
              onChange={(e) => setFormPaginas(parseInt(e.target.value) || 1)}
            />
            <Input
              label="Tipo"
              placeholder="PDF, Resumo"
              value={formTipo}
              onChange={(e) => setFormTipo(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Exclusão */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir Material de Apoio"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              variant="primary"
              style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              onClick={handleConfirmDelete}
            >
              Sim, Excluir Material
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={32} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Tem certeza que deseja excluir este material de apoio?
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              "{deleteTarget?.titulo}"
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
