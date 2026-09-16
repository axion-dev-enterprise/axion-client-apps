import React, { useState, useRef } from 'react';
import { Upload, FileText, Video, CheckCircle2, X, RefreshCw, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { uploadArquivo, UploadResult } from '../../api/upload';
import { Button } from './Button';

interface FileUploadZoneProps {
  label: string;
  tipo: 'pdf' | 'video';
  accept?: string;
  valueUrl: string;
  onChange: (url: string, metadata?: { filename: string; tamanho: string; paginas?: number }) => void;
  helperText?: string;
  allowExternalUrl?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  tipo,
  accept = tipo === 'pdf' ? '.pdf,application/pdf' : '.mp4,.webm,.mov,video/*',
  valueUrl,
  onChange,
  helperText,
  allowExternalUrl = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (tipo === 'pdf' && !file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Por favor, selecione um arquivo no formato PDF.');
      return;
    }

    if (tipo === 'video' && !/\.(mp4|webm|mov|mkv|m4v)$/i.test(file.name) && !file.type.startsWith('video/')) {
      setUploadError('Por favor, selecione um arquivo de vídeo válido (MP4, WebM ou MOV).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res: UploadResult = await uploadArquivo(file, tipo, (pct) => {
        setUploadProgress(pct);
      });

      onChange(res.url, {
        filename: res.filename,
        tamanho: res.tamanho
      });
    } catch (err: any) {
      setUploadError(err.message || 'Falha ao enviar o arquivo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUploadedLocally = valueUrl.startsWith('/uploads/');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {label}
        </label>
        {allowExternalUrl && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              color: 'var(--accent)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600
            }}
          >
            <LinkIcon size={12} />
            {showUrlInput ? 'Usar upload direto' : 'Inserir link externo'}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {showUrlInput ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <input
            type="text"
            value={valueUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder={tipo === 'pdf' ? 'https://.../arquivo.pdf' : 'https://youtube.com/watch?v=...'}
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
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Insira o link direto do documento ou vídeo hospedado na nuvem.
          </span>
        </div>
      ) : valueUrl ? (
        /* Arquivo já carregado ou vinculado */
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: tipo === 'pdf' ? '#fee2e2' : '#f3e8ff',
                color: tipo === 'pdf' ? '#b91c1c' : '#6b21a8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {tipo === 'pdf' ? <FileText size={18} /> : <Video size={18} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {valueUrl.split('/').pop() || 'Arquivo Selecionado'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#166534' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                  <CheckCircle2 size={12} />
                  {isUploadedLocally ? 'Upload Real Armazenado' : 'Link Vinculado'}
                </span>
                <a
                  href={valueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
                >
                  <ExternalLink size={11} /> Abrir
                </a>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            >
              <RefreshCw size={12} style={{ marginRight: '0.25rem' }} /> Substituir
            </Button>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
              title="Remover arquivo"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : isUploading ? (
        /* Estado de Upload em Andamento */
        <div
          style={{
            padding: '1.5rem',
            border: '2px dashed var(--accent)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#faf5ff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>
            <RefreshCw size={18} className="animate-spin" />
            <span>Enviando {tipo === 'pdf' ? 'PDF' : 'Vídeo'} para o servidor... {uploadProgress}%</span>
          </div>

          <div style={{ width: '100%', height: '8px', backgroundColor: '#e9d5ff', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: 'var(--accent)',
                transition: 'width 0.2s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b21a8' }}>
            Não feche a janela enquanto o arquivo está sendo gravado.
          </span>
        </div>
      ) : (
        /* Dropzone Vazio */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: dragOver ? '2px dashed var(--accent)' : '2px dashed #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem 1rem',
            textAlign: 'center',
            backgroundColor: dragOver ? '#faf5ff' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: dragOver ? '#f3e8ff' : '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: 'var(--accent)'
            }}
          >
            <Upload size={20} />
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Clique para selecionar ou arraste o {tipo === 'pdf' ? 'PDF' : 'vídeo'} aqui
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            {helperText || (tipo === 'pdf' ? 'Arquivos .PDF com até 50MB' : 'Vídeos .MP4, .WebM ou .MOV')}
          </p>
        </div>
      )}

      {uploadError && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--danger)', marginTop: '0.25rem' }}>
          {uploadError}
        </span>
      )}
    </div>
  );
};
