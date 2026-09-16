import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Video,
  FileText,
  Upload,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Filter
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  vestibularApi,
  VideoaulaVestibular,
  TemaVestibular,
  RedacaoVestibular
} from '../../api/vestibular';
import { useToast } from '../../context/ToastContext';

export const StudentVestibular: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'videoaulas' | 'redacoes'>('videoaulas');
  const [vestibularFilter, setVestibularFilter] = useState<string>('todos');

  const [videoaulas, setVideoaulas] = useState<VideoaulaVestibular[]>([]);
  const [temas, setTemas] = useState<TemaVestibular[]>([]);
  const [myEssays, setMyEssays] = useState<RedacaoVestibular[]>([]);
  const [loading, setLoading] = useState(true);

  // Video Player Modal
  const [playingVideo, setPlayingVideo] = useState<VideoaulaVestibular | null>(null);

  // Redação Form State
  const [selectedTema, setSelectedTema] = useState<TemaVestibular | null>(null);
  const [submissionMode, setSubmissionMode] = useState<'texto' | 'pdf'>('texto');
  const [essayText, setEssayText] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileUrl, setPdfFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visualizar Redação Corrigida
  const [viewingEssay, setViewingEssay] = useState<RedacaoVestibular | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const conteudo = await vestibularApi.getConteudo();
      setVideoaulas(conteudo.videoaulas);
      setTemas(conteudo.temas);
      if (conteudo.temas.length > 0 && !selectedTema) {
        setSelectedTema(conteudo.temas[0]);
      }

      const essays = await vestibularApi.getMyEssays();
      setMyEssays(essays);
    } catch {
      showToast('Falha ao carregar conteúdos de vestibular.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Por favor, selecione exclusivamente arquivos no formato PDF.', 'warning');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('O arquivo PDF deve ter no máximo 10MB.', 'warning');
      return;
    }

    setPdfFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPdfFileUrl(reader.result as string);
      showToast(`PDF "${file.name}" anexado com sucesso!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitEssay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTema) {
      showToast('Selecione uma proposta temática para a redação.', 'warning');
      return;
    }

    if (submissionMode === 'texto') {
      const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
      if (wordCount < 120) {
        showToast('A redação deve conter no mínimo 120 palavras para submissão.', 'warning');
        return;
      }
    } else {
      if (!pdfFileName) {
        showToast('Faça o upload do arquivo PDF da sua redação manuscrita.', 'warning');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const nova = await vestibularApi.submitEssay({
        temaId: selectedTema.id,
        vestibular: selectedTema.vestibular,
        texto: submissionMode === 'texto' ? essayText : '',
        arquivoNome: submissionMode === 'pdf' ? pdfFileName : '',
        arquivoUrl: submissionMode === 'pdf' ? pdfFileUrl : ''
      });

      setMyEssays((prev) => [nova, ...prev]);
      setEssayText('');
      setPdfFileName('');
      setPdfFileUrl('');
      showToast('Redação submetida com sucesso à Profª Wilma! Notificação enviada à docência.', 'success');
    } catch {
      showToast('Erro ao submeter redação. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVideos = videoaulas.filter((v) => {
    if (vestibularFilter === 'todos') return true;
    return v.vestibular.toLowerCase() === vestibularFilter.toLowerCase();
  });

  const filteredTemas = temas.filter((t) => {
    if (vestibularFilter === 'todos') return true;
    return t.vestibular.toLowerCase() === vestibularFilter.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner de Vestibular */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)',
          borderRadius: '16px',
          padding: '2.5rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.3)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#93c5fd',
              marginBottom: '1rem',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <GraduationCap size={16} />
            Módulo Estratégico de Vestibulares
          </div>
          <h1 style={{ fontSize: '2.125rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Vestibular & Redação Nota 1000
          </h1>
          <p style={{ fontSize: '1.0625rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            Preparação de alto nível para ENEM, UERJ, FUVEST, UNICAMP e bancas estaduais. Assista às videoaulas temáticas exclusivas da Profª Wilma e envie suas redações para correção com espelho analítico de notas.
          </p>
        </div>
      </div>

      {/* Seletor de Abas Principais e Filtro de Vestibular */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant={activeTab === 'videoaulas' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('videoaulas')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Video size={18} />
            Videoaulas de Vestibular ({filteredVideos.length})
          </Button>
          <Button
            variant={activeTab === 'redacoes' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('redacoes')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FileText size={18} />
            Redações & Correções ({myEssays.length})
          </Button>
        </div>

        {/* Filtro por Banca / Vestibular */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={15} /> Filtrar:
          </span>
          {['todos', 'ENEM', 'UERJ', 'FUVEST'].map((vest) => (
            <button
              key={vest}
              onClick={() => setVestibularFilter(vest)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: vestibularFilter === vest ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                backgroundColor: vestibularFilter === vest ? 'var(--primary)' : '#ffffff',
                color: vestibularFilter === vest ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {vest === 'todos' ? 'Todos os Exames' : vest}
            </button>
          ))}
        </div>
      </div>

      {/* ABA 1: VIDEOAULAS DE VESTIBULAR */}
      {activeTab === 'videoaulas' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              Carregando videoaulas de vestibular...
            </div>
          ) : filteredVideos.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3rem' }}>
              <Video size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Nenhuma aula encontrada para este exame
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Selecione outro vestibular ou veja todas as aulas disponíveis.
              </p>
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredVideos.map((vid) => (
                <Card
                  key={vid.id}
                  variant="interactive"
                  padding="none"
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  {/* Thumbnail / Header do Card */}
                  <div
                    style={{
                      height: '160px',
                      backgroundColor: '#1e293b',
                      backgroundImage: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => setPlayingVideo(vid)}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      <Play size={24} style={{ marginLeft: '3px' }} />
                    </div>
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <Badge variant="warning">{vid.vestibular}</Badge>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Clock size={12} />
                      {vid.duracao}
                    </div>
                  </div>

                  {/* Conteúdo Textual */}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {vid.titulo}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                      {vid.descricao}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {vid.professor || 'Profª Wilma'}
                      </span>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setPlayingVideo(vid)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Play size={14} /> Assistir Aula
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: REDAÇÕES & TEMAS DE VESTIBULAR */}
      {activeTab === 'redacoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            {/* Coluna 1: Seleção de Tema e Formulário de Submissão */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Award size={20} color="var(--primary)" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Enviar Redação para Correção
                  </h2>
                </div>

                {/* Seleção do Tema */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    1. Escolha a Proposta Temática:
                  </label>
                  <select
                    value={selectedTema?.id || ''}
                    onChange={(e) => {
                      const found = temas.find((t) => t.id === e.target.value);
                      if (found) setSelectedTema(found);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: '#f8fafc',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  >
                    {filteredTemas.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.vestibular}] {t.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Box de Instruções do Tema Selecionado */}
                {selectedTema && (
                  <div
                    style={{
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <Badge variant="info">{selectedTema.vestibular} - Edição {selectedTema.ano || '2026'}</Badge>
                      {selectedTema.dataLimite && (
                        <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>
                          Prazo: {selectedTema.dataLimite}
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {selectedTema.titulo}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: '#1e293b', lineHeight: 1.5, margin: 0 }}>
                      {selectedTema.instrucoes}
                    </p>
                  </div>
                )}

                {/* Modalidade de Envio: Texto ou PDF */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    2. Modalidade de Submissão:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setSubmissionMode('texto')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: '8px',
                        border: submissionMode === 'texto' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: submissionMode === 'texto' ? '#f0fdf4' : '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: submissionMode === 'texto' ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <FileText size={16} /> Digitar no Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionMode('pdf')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: '8px',
                        border: submissionMode === 'pdf' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: submissionMode === 'pdf' ? '#eff6ff' : '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: submissionMode === 'pdf' ? '#1e40af' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Upload size={16} /> Enviar PDF Escaneado
                    </button>
                  </div>
                </div>

                {/* Formulário Conforme o Modo */}
                <form onSubmit={handleSubmitEssay}>
                  {submissionMode === 'texto' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>Redija seu texto dissertativo formal:</span>
                        <span>
                          {essayText.trim() ? essayText.trim().split(/\s+/).length : 0} palavras | {essayText.length} caracteres
                        </span>
                      </div>
                      <textarea
                        value={essayText}
                        onChange={(e) => setEssayText(e.target.value)}
                        placeholder="Insira aqui o corpo completo da sua redação dissertativa-argumentativa (Introdução, Desenvolvimento I e II, Conclusão com Proposta de Intervenção)..."
                        rows={14}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          outline: 'none',
                          marginBottom: '1rem',
                          backgroundColor: '#fafafa'
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        border: '2px dashed var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <Upload size={36} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Anexe a folha de redação manuscrita em PDF
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Digitalize sua folha padrão de vestibular de forma legível (máximo 10MB).
                      </p>
                      <input
                        type="file"
                        accept="application/pdf"
                        id="pdf-upload-input"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="pdf-upload-input">
                        <Button variant="outline" type="button" onClick={() => document.getElementById('pdf-upload-input')?.click()}>
                          <Upload size={16} style={{ marginRight: '0.35rem' }} /> Selecionar Arquivo PDF
                        </Button>
                      </label>
                      {pdfFileName && (
                        <div
                          style={{
                            marginTop: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#dcfce7',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            color: '#166534',
                            fontSize: '0.8125rem',
                            fontWeight: 600
                          }}
                        >
                          <CheckCircle2 size={16} /> {pdfFileName}
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}
                  >
                    <GraduationCap size={18} />
                    {isSubmitting ? 'Enviando para a Profª Wilma...' : 'Submeter Redação para Correção'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Coluna 2: Minhas Redações de Vestibular & Espelho de Correção */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Minhas Redações Enviadas ({myEssays.length})
                </h2>
              </div>

              {myEssays.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <FileText size={36} color="var(--text-secondary)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Nenhuma redação de vestibular enviada ainda
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Envie seu primeiro texto ou PDF no formulário ao lado para receber a correção personalizada da Profª Wilma.
                  </p>
                </Card>
              ) : (
                myEssays.map((essay) => (
                  <Card key={essay.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <Badge variant={essay.vestibular === 'ENEM' ? 'info' : 'warning'}>
                            {essay.vestibular}
                          </Badge>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Enviado em {new Date(essay.enviadoEm).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {essay.temaTitulo}
                        </h4>
                      </div>

                      {/* Badge de Status */}
                      <div>
                        {essay.status === 'corrigida' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.25rem 0.6rem',
                              backgroundColor: '#dcfce7',
                              color: '#15803d',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <CheckCircle2 size={13} /> Corrigida
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.25rem 0.6rem',
                              backgroundColor: '#fef3c7',
                              color: '#b45309',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <Clock size={13} /> Em Análise Docente
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Espelho de Nota se corrigida */}
                    {essay.status === 'corrigida' && (
                      <div
                        style={{
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Nota Final Atribuída:</div>
                          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#15803d' }}>
                            {essay.notaFinal ?? '960'} <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>/ 1000</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setViewingEssay(essay)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Sparkles size={14} /> Ver Feedback & Espelho
                        </Button>
                      </div>
                    )}

                    {essay.status !== 'corrigida' && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} />
                        Prazo estimado de devolução com parecer detalhado: até 48h úteis.
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PLAYER DE VIDEOAULA */}
      {playingVideo && (
        <Modal
          isOpen={true}
          onClose={() => setPlayingVideo(null)}
          title={playingVideo.titulo}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                backgroundColor: '#000000',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <iframe
                src={
                  playingVideo.url.includes('youtube.com') || playingVideo.url.includes('youtu.be')
                    ? playingVideo.url.replace('watch?v=', 'embed/')
                    : playingVideo.url
                }
                title={playingVideo.titulo}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Badge variant="info">{playingVideo.vestibular}</Badge>
                <Badge variant="neutral">{playingVideo.duracao}</Badge>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Docência: {playingVideo.professor || 'Profª Wilma'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {playingVideo.descricao}
            </p>
          </div>
        </Modal>
      )}

      {/* MODAL: ESPELHO DE NOTA & FEEDBACK PEDAGÓGICO */}
      {viewingEssay && (
        <Modal
          isOpen={true}
          onClose={() => setViewingEssay(null)}
          title="Espelho de Correção & Parecer Docente"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Badge variant="info">{viewingEssay.vestibular}</Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Corrigido por Profª Wilma
                </span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {viewingEssay.temaTitulo}
              </h3>
            </div>

            {/* Placar de Notas */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '1.25rem',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#166534', textTransform: 'uppercase' }}>
                Pontuação Final Obtida
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#15803d', lineHeight: 1 }}>
                {viewingEssay.notaFinal ?? '960'}
                <span style={{ fontSize: '1rem', color: '#166534', fontWeight: 600 }}> / 1000</span>
              </div>
            </div>

            {/* Matriz por Competências (se houver critérios cadastrados) */}
            {viewingEssay.criterios && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Detalhamento por Critérios / Competências:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                  {Object.entries(viewingEssay.criterios).map(([key, val]) => (
                    <div key={key} style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.5rem' }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {key.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback da Professora */}
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '1rem'
              }}
            >
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={16} /> Parecer Pedagógico da Profª Wilma:
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
                {viewingEssay.feedbackProfessora || 'Parabéns pela dedicação! Seu texto atendeu aos critérios essenciais da banca com excelente maturidade argumentativa.'}
              </p>
            </div>

            {/* Botão de Fechar */}
            <Button variant="primary" onClick={() => setViewingEssay(null)}>
              Fechar Espelho
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
