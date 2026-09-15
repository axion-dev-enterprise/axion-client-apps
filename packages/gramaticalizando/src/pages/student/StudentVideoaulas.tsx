import React from 'react';
import { Video, Play, Clock, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const StudentVideoaulas: React.FC = () => {
  const { showToast } = useToast();

  const videos = [
    {
      id: 'vid-1',
      titulo: 'Masterclass: Desmistificando a Crase em 40 Minutos',
      modulo: 'Análise Sintática',
      duracao: '42 min',
      professor: 'Prof. Marcos Silva',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'vid-2',
      titulo: 'Como Redigir a Proposta de Intervenção Nota 200',
      modulo: 'Redação Dissertativa',
      duracao: '36 min',
      professor: 'Prof. Marcos Silva',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'vid-3',
      titulo: 'As 10 Pegadinhas Mais Frequentes da Banca FGV em Português',
      modulo: 'Resolução de Provas',
      duracao: '50 min',
      professor: 'Prof. Marcos Silva',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60'
    }
  ];

  const handlePlayVideo = (titulo: string) => {
    showToast(`Carregando transmissão: "${titulo}"`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
          Videoteca & Transmissões Gravadas
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Aulas magnas em alta resolução gravadas em estúdio profissional
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {videos.map((vid) => (
          <Card
            key={vid.id}
            variant="interactive"
            padding="none"
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onClick={() => handlePlayVideo(vid.titulo)}
          >
            <div
              style={{
                height: '180px',
                backgroundImage: `url(${vid.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.45)' }} />
              <div
                style={{
                  position: 'relative',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <Play size={20} style={{ marginLeft: '3px' }} />
              </div>

              <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem' }}>
                <Badge variant="neutral" size="sm" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                  <Clock size={12} /> {vid.duracao}
                </Badge>
              </div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <Badge variant="purple" size="sm" style={{ marginBottom: '0.5rem' }}>
                  {vid.modulo}
                </Badge>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                  {vid.titulo}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span>{vid.professor}</span>
                <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>Assistir Aula →</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
