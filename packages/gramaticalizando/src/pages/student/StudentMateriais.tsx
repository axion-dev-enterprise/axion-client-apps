import React, { useState, useEffect } from 'react';
import {
  FolderDown,
  FileText,
  Download,
  BookOpen,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { request } from '../../api/client';

interface MaterialApoioItem {
  id: string;
  titulo: string;
  categoria: string;
  tamanho: string;
  formato: string;
  arquivoUrl: string;
  descricao: string;
  paginas?: number;
}

export const StudentMateriais: React.FC = () => {
  const { showToast } = useToast();
  const [materiais, setMateriais] = useState<MaterialApoioItem[]>([]);

  // Estado do Leitor de PDF
  const [leitorAberto, setLeitorAberto] = useState(false);
  const [materialSelecionado, setMaterialSelecionado] = useState<MaterialApoioItem | null>(null);
  const [telaCheia, setTelaCheia] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await request<{ sucesso: boolean; materiais: any[] }>('/api/materiais-apoio');
        if (res.sucesso && Array.isArray(res.materiais)) {
          setMateriais(res.materiais.map(m => ({
            id: m.id,
            titulo: m.titulo,
            categoria: m.nomeModulo || m.categoria || 'Geral',
            tamanho: m.tamanho || '2.5 MB',
            formato: (m.tipo || 'PDF').toUpperCase(),
            arquivoUrl: `/api/materiais-apoio/${m.id}/download`,
            descricao: m.descricao,
            paginas: m.paginas || 20
          })));
        } else {
          setMateriais([]);
        }
      } catch {
        setMateriais([]);
      }
    };
    load();
  }, []);

  // Tecla ESC fecha o leitor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && leitorAberto) {
        fecharLeitor();
      }
    };
    if (leitorAberto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [leitorAberto]);

  const abrirLeitor = (item: MaterialApoioItem) => {
    setMaterialSelecionado(item);
    setLeitorAberto(true);
  };

  const fecharLeitor = () => {
    setLeitorAberto(false);
    setMaterialSelecionado(null);
    setTelaCheia(false);
  };

  const dispararDownloadNativo = (item: MaterialApoioItem) => {
    showToast(`Baixando "${item.titulo}" via download nativo...`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Cabeçalho */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Materiais de Apoio & Downloads
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Apostilas digitais, resumos esquematizados e mapas mentais para revisão rápida
        </p>
      </div>

      {/* Grid de Materiais */}
      {materiais.length === 0 ? (
        <Card style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <FolderDown size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhum material de apoio disponível no momento
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
            A Professora Wilma disponibilizará as apostilas, resumos e cadernos de estudo em PDF em breve.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {materiais.map((mat) => {
            const downloadUrl = `/api/materiais-apoio/${mat.id}/download`;
            const visualizarUrl = `/api/materiais-apoio/${mat.id}/pdf`;

            return (
              <Card
                key={mat.id}
                variant="interactive"
                padding="lg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <Badge variant="purple" size="sm">
                      {mat.categoria}
                    </Badge>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {mat.tamanho}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {mat.titulo}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.55 }}>
                    {mat.descricao}
                  </p>
                </div>

                {/* Botões de Ação: Leitor Integrado + Download Nativo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <Button
                    variant="primary"
                    size="md"
                    icon={<BookOpen size={16} />}
                    onClick={() => abrirLeitor(mat)}
                    style={{
                      width: '100%',
                      backgroundColor: '#7c3aed',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                      fontWeight: 600
                    }}
                  >
                    Visualizar no Leitor
                  </Button>

                  {/* Link de Download Nativo do Navegador */}
                  <a
                    href={downloadUrl}
                    download={`${mat.titulo}.pdf`}
                    onClick={() => dispararDownloadNativo(mat)}
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <Button
                      variant="outline"
                      size="md"
                      icon={<Download size={16} />}
                      style={{
                        width: '100%',
                        borderColor: '#cbd5e1',
                        color: '#334155',
                        fontWeight: 600,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      Baixar Material em PDF
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PDF READER INTEGRADO COM TELA CHEIA                */}
      {/* ========================================================= */}
      {leitorAberto && materialSelecionado && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(9, 9, 11, 0.85)',
            backdropFilter: 'blur(14px)',
            padding: telaCheia ? '0' : '1.25rem',
            transition: 'all 0.2s ease'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) fecharLeitor();
          }}
        >
          <div
            style={{
              width: telaCheia ? '100vw' : '94vw',
              maxWidth: telaCheia ? '100vw' : '1240px',
              height: telaCheia ? '100vh' : '90vh',
              backgroundColor: '#121217',
              border: telaCheia ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: telaCheia ? '0' : '16px',
              boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUpFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Topbar do Leitor */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                backgroundColor: '#18181f',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '1rem',
                flexShrink: 0
              }}
            >
              {/* Título & Metadados */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a78bfa',
                    flexShrink: 0
                  }}
                >
                  <FileText size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {materialSelecionado.titulo}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                      {materialSelecionado.categoria}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#52525b' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                      {materialSelecionado.paginas || 24} páginas
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#52525b' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                      {materialSelecionado.tamanho}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação do Reader */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {/* Download Nativo Direto */}
                <a
                  href={`/api/materiais-apoio/${materialSelecionado.id}/download`}
                  download={`${materialSelecionado.titulo}.pdf`}
                  onClick={() => dispararDownloadNativo(materialSelecionado)}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download size={15} />}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.8125rem'
                    }}
                  >
                    Baixar PDF
                  </Button>
                </a>

                {/* Abrir em Nova Aba */}
                <a
                  href={`/api/materiais-apoio/${materialSelecionado.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ExternalLink size={15} />}
                    style={{ color: '#a1a1aa', fontSize: '0.8125rem' }}
                    title="Abrir em Nova Aba do Navegador"
                  >
                    Nova Aba
                  </Button>
                </a>

                {/* Alternar Tela Cheia */}
                <button
                  type="button"
                  onClick={() => setTelaCheia(!telaCheia)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#a1a1aa',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={telaCheia ? 'Sair da Tela Cheia' : 'Tela Cheia'}
                >
                  {telaCheia ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                {/* Fechar */}
                <button
                  type="button"
                  onClick={fecharLeitor}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e4e4e7',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Fechar Leitor (ESC)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Container do Iframe PDF */}
            <div style={{ flex: 1, position: 'relative', backgroundColor: '#26262b' }}>
              <iframe
                src={`/api/materiais-apoio/${materialSelecionado.id}/pdf#toolbar=1&navpanes=0`}
                title={materialSelecionado.titulo}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
