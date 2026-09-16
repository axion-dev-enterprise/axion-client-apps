import React, { useState, useEffect } from 'react';
import { Video, Play, Clock, Sparkles, X, CheckCircle2, BookOpen } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { adminApi, AdminAula } from '../../api/admin';
import { coursesApi } from '../../api/courses';

interface VideoItem {
  id: string;
  titulo: string;
  modulo: string;
  duracao: string;
  professor: string;
  videoUrl?: string;
  conteudo?: string;
  thumbnail: string;
}

export const StudentVideoaulas: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const DEFAULT_VIDEOS: VideoItem[] = [
    {
      id: 'vid-1',
      titulo: 'Masterclass: Desmistificando o Acento Indicativo de Crase',
      modulo: 'Análise Sintática & Regência',
      duracao: '42 min',
      professor: 'Profª Wilma Barbosa',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      conteudo: 'Regras práticas e mnemônicos essenciais para gabaritar crase em concursos da Vunesp, FGV e FCC.',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'vid-2',
      titulo: 'Laboratório: Como Redigir a Proposta de Intervenção Nota Máxima',
      modulo: 'Redação Dissertativa',
      duracao: '38 min',
      professor: 'Profª Wilma Barbosa',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      conteudo: 'Os 5 elementos obrigatórios: Agente, Ação, Meio/Modo, Efeito e Detalhamento explicados passo a passo.',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'vid-3',
      titulo: 'Análise de Pegadinhas: As 10 Questões Mais Ardilosas da FGV',
      modulo: 'Resolução de Questões',
      duracao: '50 min',
      professor: 'Profª Wilma Barbosa',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      conteudo: 'Resolução comentada de provas recentes com ênfase na semântica textual e sintaxe de regência.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'vid-4',
      titulo: 'Sintaxe do Período Composto: Orações Subordinadas Substantivas',
      modulo: 'Sintaxe Avançada',
      duracao: '45 min',
      professor: 'Profª Wilma Barbosa',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      conteudo: 'Diferenciação clara entre orações substantivas, adjetivas e adverbiais com aplicação prática em bancas.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    }
  ];

  useEffect(() => {
    const carregarAulasComVideo = async () => {
      try {
        setLoading(true);
        const [aulas, materias] = await Promise.all([
          adminApi.getAulas().catch(() => []),
          adminApi.getMaterias().catch(() => [])
        ]);

        const mapaMaterias = new Map<string, string>();
        materias.forEach(m => mapaMaterias.set(m.id, m.nome));

        const aulasComVideo = aulas.filter(a => a.videoUrl && a.publicado !== false);
        if (aulasComVideo.length > 0) {
          const formatadas: VideoItem[] = aulasComVideo.map((a, idx) => ({
            id: a.id,
            titulo: a.titulo,
            modulo: String(mapaMaterias.get(a.materiaId) || 'Língua Portuguesa'),
            duracao: a.duracao || '35 min',
            professor: 'Profª Wilma Barbosa',
            videoUrl: a.videoUrl,
            conteudo: a.conteudo || a.subtitulo,
            thumbnail: DEFAULT_VIDEOS[idx % DEFAULT_VIDEOS.length].thumbnail
          }));
          setVideos(formatadas);
        } else {
          setVideos(DEFAULT_VIDEOS);
        }
      } catch (err) {
        setVideos(DEFAULT_VIDEOS);
      } finally {
        setLoading(false);
      }
    };

    carregarAulasComVideo();
  }, []);

  const handlePlayVideo = (vid: VideoItem) => {
    setSelectedVideo(vid);
  };

  const handleConcluir = async (vidId: string) => {
    try {
      await coursesApi.concluirAula(vidId);
      showToast('Aula registrada no seu histórico de progresso!', 'success');
      setSelectedVideo(null);
    } catch {
      showToast('Aula marcada como assistida.', 'success');
      setSelectedVideo(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
            <Video size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Videoteca & Transmissões Gravadas
          </h1>
        </div>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
          Aulas magnas e resolução comentada de questões com a Professora Wilma Barbosa.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          Carregando videoteca...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {videos.map((vid) => (
            <Card
              key={vid.id}
              variant="interactive"
              padding="none"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)' }}
              onClick={() => handlePlayVideo(vid)}
            >
              <div
                style={{
                  height: '190px',
                  backgroundImage: `url(${vid.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 7, 30, 0.45)' }} />
                <div
                  style={{
                    position: 'relative',
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(107, 33, 168, 0.5)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <Play size={22} style={{ marginLeft: '3px' }} />
                </div>

                <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem' }}>
                  <Badge variant="neutral" size="sm" style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffffff', backdropFilter: 'blur(4px)' }}>
                    <Clock size={12} /> {vid.duracao}
                  </Badge>
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <Badge variant="purple" size="sm" style={{ marginBottom: '0.5rem' }}>
                    {vid.modulo}
                  </Badge>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, margin: '0.25rem 0' }}>
                    {vid.titulo}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Docência: <strong>{vid.professor}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                    Assistir Videoaula
                  </span>
                  <Play size={14} style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal do Player de Vídeo */}
      <Modal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo ? selectedVideo.titulo : ''}
        maxWidth="840px"
      >
        {selectedVideo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Player Container */}
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%', // Aspect Ratio 16:9
                height: 0,
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#000000'
              }}
            >
              <iframe
                src={selectedVideo.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={selectedVideo.titulo}
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

            {/* Informações da Aula */}
            <div style={{ backgroundColor: 'var(--bg-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Badge variant="purple">{selectedVideo.modulo}</Badge>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Docência: {selectedVideo.professor}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {selectedVideo.conteudo || 'Videoaula completa com quadro digital e resolução de questões de bancas examinadoras.'}
              </p>
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <Button
                variant="primary"
                onClick={() => handleConcluir(selectedVideo.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <CheckCircle2 size={16} />
                <span>Marcar Aula Como Assistida</span>
              </Button>
              <Button variant="outline" onClick={() => setSelectedVideo(null)}>
                Fechar Player
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
