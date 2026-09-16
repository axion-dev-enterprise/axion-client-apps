import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Video,
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Award,
  Sparkles,
  ExternalLink,
  Download,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { FileUploadZone } from '../../components/ui/FileUploadZone';
import {
  vestibularApi,
  VideoaulaVestibular,
  TemaVestibular,
  RedacaoVestibular
} from '../../api/vestibular';
import { useToast } from '../../context/ToastContext';

export const ProfessorVestibular: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'videoaulas' | 'temas' | 'redacoes'>('redacoes');

  const [videoaulas, setVideoaulas] = useState<VideoaulaVestibular[]>([]);
  const [temas, setTemas] = useState<TemaVestibular[]>([]);
  const [redacoes, setRedacoes] = useState<RedacaoVestibular[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais de Videoaula
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoaulaVestibular | null>(null);
  const [videoForm, setVideoForm] = useState({
    titulo: '',
    vestibular: 'ENEM',
    url: '',
    duracao: '45 min',
    descricao: '',
    professor: 'Profª Wilma'
  });

  // Modais de Tema
  const [temaModalOpen, setTemaModalOpen] = useState(false);
  const [editingTema, setEditingTema] = useState<TemaVestibular | null>(null);
  const [temaForm, setTemaForm] = useState({
    titulo: '',
    vestibular: 'ENEM',
    ano: '2026',
    instrucoes: '',
    textosMotivadores: '',
    dataLimite: ''
  });

  // Modal de Correção de Redação
  const [correctingRedacao, setCorrectingRedacao] = useState<RedacaoVestibular | null>(null);
  const [notaFinal, setNotaFinal] = useState('960');
  const [c1, setC1] = useState('180');
  const [c2, setC2] = useState('200');
  const [c3, setC3] = useState('180');
  const [c4, setC4] = useState('200');
  const [c5, setC5] = useState('200');
  const [feedback, setFeedback] = useState('');
  const [savingCorrection, setSavingCorrection] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await vestibularApi.getAdminData();
      setVideoaulas(res.videoaulas);
      setTemas(res.temas);
      setRedacoes(res.redacoes);
    } catch {
      showToast('Falha ao carregar dados de vestibular.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers de Videoaula ---
  const handleOpenNewVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      titulo: '',
      vestibular: 'ENEM',
      url: '',
      duracao: '45 min',
      descricao: '',
      professor: 'Profª Wilma'
    });
    setVideoModalOpen(true);
  };

  const handleEditVideo = (vid: VideoaulaVestibular) => {
    setEditingVideo(vid);
    setVideoForm({
      titulo: vid.titulo,
      vestibular: vid.vestibular,
      url: vid.url,
      duracao: vid.duracao,
      descricao: vid.descricao,
      professor: vid.professor || 'Profª Wilma'
    });
    setVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.titulo || !videoForm.url) {
      showToast('Preencha título e link da videoaula.', 'warning');
      return;
    }

    try {
      if (editingVideo) {
        await vestibularApi.updateVideoaula(editingVideo.id, videoForm);
        showToast('Videoaula de vestibular atualizada com sucesso!', 'success');
      } else {
        await vestibularApi.createVideoaula(videoForm);
        showToast('Nova videoaula adicionada com sucesso!', 'success');
      }
      setVideoModalOpen(false);
      loadData();
    } catch {
      showToast('Erro ao salvar videoaula.', 'error');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta videoaula?')) return;
    try {
      await vestibularApi.deleteVideoaula(id);
      showToast('Videoaula removida com sucesso.', 'info');
      loadData();
    } catch {
      showToast('Erro ao excluir videoaula.', 'error');
    }
  };

  // --- Handlers de Temas ---
  const handleOpenNewTema = () => {
    setEditingTema(null);
    setTemaForm({
      titulo: '',
      vestibular: 'ENEM',
      ano: '2026',
      instrucoes: '',
      textosMotivadores: '',
      dataLimite: ''
    });
    setTemaModalOpen(true);
  };

  const handleEditTema = (t: TemaVestibular) => {
    setEditingTema(t);
    setTemaForm({
      titulo: t.titulo,
      vestibular: t.vestibular,
      ano: t.ano || '2026',
      instrucoes: t.instrucoes,
      textosMotivadores: t.textosMotivadores || '',
      dataLimite: t.dataLimite || ''
    });
    setTemaModalOpen(true);
  };

  const handleSaveTema = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temaForm.titulo) {
      showToast('Preencha o título da proposta temática.', 'warning');
      return;
    }

    try {
      if (editingTema) {
        await vestibularApi.updateTema(editingTema.id, temaForm);
        showToast('Tema de vestibular atualizado com sucesso!', 'success');
      } else {
        await vestibularApi.createTema(temaForm);
        showToast('Novo tema cadastrado com sucesso!', 'success');
      }
      setTemaModalOpen(false);
      loadData();
    } catch {
      showToast('Erro ao salvar tema.', 'error');
    }
  };

  const handleDeleteTema = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta proposta temática?')) return;
    try {
      await vestibularApi.deleteTema(id);
      showToast('Tema removido com sucesso.', 'info');
      loadData();
    } catch {
      showToast('Erro ao remover tema.', 'error');
    }
  };

  // --- Handler de Correção de Redação ---
  const handleOpenCorrectModal = (red: RedacaoVestibular) => {
    setCorrectingRedacao(red);
    setNotaFinal(red.notaFinal !== null && red.notaFinal !== undefined ? String(red.notaFinal) : '920');
    setC1(red.criterios?.c1 ? String(red.criterios.c1) : '180');
    setC2(red.criterios?.c2 ? String(red.criterios.c2) : '180');
    setC3(red.criterios?.c3 ? String(red.criterios.c3) : '180');
    setC4(red.criterios?.c4 ? String(red.criterios.c4) : '200');
    setC5(red.criterios?.c5 ? String(red.criterios.c5) : '180');
    setFeedback(red.feedbackProfessora || '');
  };

  const handleSaveCorrection = async () => {
    if (!correctingRedacao) return;

    setSavingCorrection(true);
    try {
      const somaComp = Number(c1) + Number(c2) + Number(c3) + Number(c4) + Number(c5);
      const notaCalculada = Number(notaFinal) || somaComp;

      await vestibularApi.corrigirRedacao(correctingRedacao.id, {
        notaFinal: notaCalculada,
        criterios: {
          c1: Number(c1),
          c2: Number(c2),
          c3: Number(c3),
          c4: Number(c4),
          c5: Number(c5)
        },
        feedbackProfessora: feedback
      });

      showToast('Redação de vestibular corrigida com sucesso! Aluno notificado.', 'success');
      setCorrectingRedacao(null);
      loadData();
    } catch {
      showToast('Erro ao salvar correção.', 'error');
    } finally {
      setSavingCorrection(false);
    }
  };

  const pendentesCount = redacoes.filter((r) => r.status === 'pendente').length;
  const corrigidasCount = redacoes.filter((r) => r.status === 'corrigida').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1e40af',
                backgroundColor: '#dbeafe',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px'
              }}
            >
              <GraduationCap size={14} /> Módulo Docente de Vestibular
            </span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Gestão de Vestibular & Correções
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Controle de videoaulas temáticas, banco de temas ENEM/UERJ/FUVEST e espelho analítico de correções.
          </p>
        </div>

        {/* Ações Rápidas Conforme Aba Ativa */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'videoaulas' && (
            <Button variant="primary" onClick={handleOpenNewVideo} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Nova Videoaula
            </Button>
          )}
          {activeTab === 'temas' && (
            <Button variant="primary" onClick={handleOpenNewTema} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Novo Tema de Redação
            </Button>
          )}
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Redações Pendentes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>{pendentesCount}</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#15803d' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Redações Corrigidas</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{corrigidasCount}</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#faf5ff', color: '#7e22ce' }}>
            <Video size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Videoaulas Ativas</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7e22ce' }}>{videoaulas.length}</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#b45309' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Temas Publicados</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>{temas.length}</div>
          </div>
        </Card>
      </div>

      {/* Navegação de Abas do Professor */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <Button
          variant={activeTab === 'redacoes' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('redacoes')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FileText size={18} />
          Fila de Redações ({redacoes.length})
        </Button>
        <Button
          variant={activeTab === 'videoaulas' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('videoaulas')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Video size={18} />
          Videoaulas ({videoaulas.length})
        </Button>
        <Button
          variant={activeTab === 'temas' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('temas')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Award size={18} />
          Temas & Propostas ({temas.length})
        </Button>
      </div>

      {/* ABA 1: FILA DE REDAÇÕES DE VESTIBULAR */}
      {activeTab === 'redacoes' && (
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
              Redações de Alunos para Correção
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Total: {redacoes.length} submissões
            </span>
          </div>

          {redacoes.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Nenhuma redação de vestibular enviada ainda.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Aluno</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Banca / Tema</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Envio</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Formato</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Nota</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {redacoes.map((red) => (
                    <tr key={red.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {red.alunoNome || 'Aluno'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {red.alunoEmail || 'aluno@gramaticalizando.com.br'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', maxWidth: '300px' }}>
                        <Badge variant="info" style={{ marginBottom: '0.25rem' }}>{red.vestibular}</Badge>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {red.temaTitulo}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {new Date(red.enviadoEm).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {red.arquivoNome ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>
                            <FileText size={14} /> PDF
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                            Texto Digitado
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {red.status === 'corrigida' ? (
                          <Badge variant="success">Corrigida</Badge>
                        ) : (
                          <Badge variant="warning">Pendente</Badge>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {red.notaFinal !== null && red.notaFinal !== undefined ? (
                          <span style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>
                            {red.notaFinal} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/ 1000</span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <Button
                          size="sm"
                          variant={red.status === 'corrigida' ? 'outline' : 'primary'}
                          onClick={() => handleOpenCorrectModal(red)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Edit2 size={14} /> {red.status === 'corrigida' ? 'Editar Correção' : 'Avaliar e Corrigir'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ABA 2: VIDEOAULAS DE VESTIBULAR */}
      {activeTab === 'videoaulas' && (
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
              Videoaulas Exclusivas de Vestibular
            </h3>
            <Button size="sm" variant="primary" onClick={handleOpenNewVideo} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={15} /> Adicionar Videoaula
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Banca</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Título</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Duração</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Link</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {videoaulas.map((vid) => (
                  <tr key={vid.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge variant="info">{vid.vestibular}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{vid.titulo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {vid.descricao}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {vid.duracao}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem' }}>
                      <a href={vid.url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                        Assistir <ExternalLink size={12} />
                      </a>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Button size="sm" variant="outline" onClick={() => handleEditVideo(vid)}>
                          <Edit2 size={14} />
                        </Button>
                        <Button size="sm" variant="outline" style={{ color: "#ef4444" }} onClick={() => handleDeleteVideo(vid.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ABA 3: TEMAS DE REDAÇÃO */}
      {activeTab === 'temas' && (
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
              Banco de Temas & Propostas de Redação
            </h3>
            <Button size="sm" variant="primary" onClick={handleOpenNewTema} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={15} /> Cadastrar Tema
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Exame</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Título da Proposta</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Prazo</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {temas.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge variant="warning">{t.vestibular} {t.ano}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.titulo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '420px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.instrucoes}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {t.dataLimite || 'Sem prazo'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Button size="sm" variant="outline" onClick={() => handleEditTema(t)}>
                          <Edit2 size={14} />
                        </Button>
                        <Button size="sm" variant="outline" style={{ color: "#ef4444" }} onClick={() => handleDeleteTema(t.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL: CORREÇÃO DE REDAÇÃO DE VESTIBULAR */}
      {correctingRedacao && (
        <Modal
          isOpen={true}
          onClose={() => setCorrectingRedacao(null)}
          title="Avaliação & Correção Docente de Vestibular"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Cabeçalho da Redação */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <Badge variant="info" style={{ marginRight: '0.5rem' }}>{correctingRedacao.vestibular}</Badge>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {correctingRedacao.alunoNome} ({correctingRedacao.alunoEmail})
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Enviado em {new Date(correctingRedacao.enviadoEm).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {correctingRedacao.temaTitulo}
              </h4>
            </div>

            {/* Texto ou PDF do Aluno */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Conteúdo Submetido pelo Aluno:
              </h4>
              {correctingRedacao.texto ? (
                <div
                  style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {correctingRedacao.texto}
                </div>
              ) : correctingRedacao.arquivoUrl ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', textAlign: 'center' }}>
                  <FileText size={32} color="#1d4ed8" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem' }}>
                    {correctingRedacao.arquivoNome || 'Redacao_Vestibular.pdf'}
                  </div>
                  <a
                    href={correctingRedacao.arquivoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button size="sm" variant="primary" type="button">
                      <ExternalLink size={14} style={{ marginRight: '0.35rem' }} /> Abrir PDF da Redação
                    </Button>
                  </a>
                </div>
              ) : (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Nenhum texto nem anexo enviado.
                </div>
              )}
            </div>

            {/* Matriz de Competências (ENEM 5 Competências de 0 a 200) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Matriz Analítica de Competências (0 a 200 cada):
                </h4>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#15803d' }}>
                  Soma: {Number(c1) + Number(c2) + Number(c3) + Number(c4) + Number(c5)} / 1000
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>C1 - Gramática</label>
                  <select
                    value={c1}
                    onChange={(e) => setC1(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontWeight: 700 }}
                  >
                    {[200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>C2 - Tema/Gênero</label>
                  <select
                    value={c2}
                    onChange={(e) => setC2(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontWeight: 700 }}
                  >
                    {[200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>C3 - Argumentação</label>
                  <select
                    value={c3}
                    onChange={(e) => setC3(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontWeight: 700 }}
                  >
                    {[200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>C4 - Coesão</label>
                  <select
                    value={c4}
                    onChange={(e) => setC4(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontWeight: 700 }}
                  >
                    {[200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>C5 - Intervenção</label>
                  <select
                    value={c5}
                    onChange={(e) => setC5(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontWeight: 700 }}
                  >
                    {[200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Parecer Pedagógico da Profª Wilma */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Parecer Pedagógico e Orientações da Profª Wilma:
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Insira os pontos fortes do texto do aluno, desvios gramaticais pontuais, orientações sobre tese e repertório legítimo..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: '#fafafa'
                }}
              />
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" onClick={() => setCorrectingRedacao(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveCorrection} disabled={savingCorrection}>
                <CheckCircle2 size={16} style={{ marginRight: '0.35rem' }} />
                {savingCorrection ? 'Salvando...' : 'Salvar Correção e Liberar Espelho'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: CRIAR / EDITAR VIDEOAULA */}
      {videoModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setVideoModalOpen(false)}
          title={editingVideo ? 'Editar Videoaula de Vestibular' : 'Cadastrar Nova Videoaula'}
        >
          <form onSubmit={handleSaveVideo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Título da Aula:</label>
              <Input
                value={videoForm.titulo}
                onChange={(e) => setVideoForm({ ...videoForm, titulo: e.target.value })}
                placeholder="Ex: Redação ENEM: Competência 5 Passo a Passo"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Exame Alvo:</label>
                <select
                  value={videoForm.vestibular}
                  onChange={(e) => setVideoForm({ ...videoForm, vestibular: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                >
                  <option value="ENEM">ENEM</option>
                  <option value="UERJ">UERJ</option>
                  <option value="FUVEST">FUVEST</option>
                  <option value="Geral">Vestibulares Gerais</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Duração:</label>
                <Input
                  value={videoForm.duracao}
                  onChange={(e) => setVideoForm({ ...videoForm, duracao: e.target.value })}
                  placeholder="Ex: 45 min"
                />
              </div>
            </div>
            <FileUploadZone
              label="Videoaula (Upload MP4 / WebM ou Link)"
              tipo="video"
              valueUrl={videoForm.url}
              onChange={(url) => setVideoForm({ ...videoForm, url })}
              helperText="Upload direto do vídeo ou informe link externo"
            />
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Descrição da Aula:</label>
              <textarea
                value={videoForm.descricao}
                onChange={(e) => setVideoForm({ ...videoForm, descricao: e.target.value })}
                placeholder="Conteúdo programático abordado nesta masterclass..."
                rows={3}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setVideoModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" type="submit">Salvar Videoaula</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: CRIAR / EDITAR TEMA */}
      {temaModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setTemaModalOpen(false)}
          title={editingTema ? 'Editar Tema de Vestibular' : 'Novo Tema de Redação'}
        >
          <form onSubmit={handleSaveTema} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tema / Frase Temática Oficial:</label>
              <Input
                value={temaForm.titulo}
                onChange={(e) => setTemaForm({ ...temaForm, titulo: e.target.value })}
                placeholder="Ex: Os desafios da mobilidade sustentável no Brasil"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Banca:</label>
                <select
                  value={temaForm.vestibular}
                  onChange={(e) => setTemaForm({ ...temaForm, vestibular: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                >
                  <option value="ENEM">ENEM</option>
                  <option value="UERJ">UERJ</option>
                  <option value="FUVEST">FUVEST</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Ano:</label>
                <Input
                  value={temaForm.ano}
                  onChange={(e) => setTemaForm({ ...temaForm, ano: e.target.value })}
                  placeholder="2026"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Data Limite:</label>
                <Input
                  type="date"
                  value={temaForm.dataLimite}
                  onChange={(e) => setTemaForm({ ...temaForm, dataLimite: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Instruções da Proposta:</label>
              <textarea
                value={temaForm.instrucoes}
                onChange={(e) => setTemaForm({ ...temaForm, instrucoes: e.target.value })}
                placeholder="Orientações e direcionamento de gênero textual..."
                rows={3}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.25rem' }}>Textos Motivadores / Apoio:</label>
              <textarea
                value={temaForm.textosMotivadores}
                onChange={(e) => setTemaForm({ ...temaForm, textosMotivadores: e.target.value })}
                placeholder="Texto I: ... | Texto II: ..."
                rows={3}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setTemaModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" type="submit">Salvar Proposta</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
