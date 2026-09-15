import React, { useState } from 'react';
import { PenTool, CheckCircle, Clock, Eye, Send } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

interface Submissao {
  id: string;
  aluno: string;
  tema: string;
  texto: string;
  data: string;
  status: 'pendente' | 'corrigida';
  nota?: number;
}

export const ProfessorRedacoes: React.FC = () => {
  const [submissoes, setSubmissoes] = useState<Submissao[]>([
    {
      id: 'red-1',
      aluno: 'Ana Beatriz Souza',
      tema: 'Os desafios da inteligência artificial e a preservação da autoria no Brasil',
      texto: 'A revolução proporcionada pela inteligência artificial generativa remodelou as estruturas educacionais e profissionais contemporâneas. Sob a perspectiva da ética discursiva de Jürgen Habermas, a genuína comunicação pressupõe sujeitos autônomos capazes de fundamentar suas próprias pretensões de validade. Nesse cenário, o uso indiscriminado de ferramentas automatizadas para produção textual compromete não apenas a autoria individual, mas também o desenvolvimento crítico dos educandos.',
      data: '15/09/2026',
      status: 'pendente'
    },
    {
      id: 'red-2',
      aluno: 'Carlos Eduardo Lima',
      tema: 'A importância da valorização da norma culta e o combate ao preconceito linguístico',
      texto: 'No clássico "Preconceito Linguístico", Marcos Bagno denuncia como a imposição rígida da norma padrão pode funcionar como mecanismo velado de exclusão social. Embora o domínio da norma culta seja indispensável para a mobilidade profissional e a democratização de oportunidades, é mandatório dissociar essa exigência de juízos depreciativos sobre falares regionais.',
      data: '14/09/2026',
      status: 'corrigida',
      nota: 940
    }
  ]);

  const [selectedRedacao, setSelectedRedacao] = useState<Submissao | null>(null);
  const [nota, setNota] = useState('920');
  const [comentario, setComentario] = useState('Excelente progressão temática e domínio da norma culta. Atente-se apenas à pontuação no terceiro período.');
  const { showToast } = useToast();

  const handleSalvarCorrecao = () => {
    if (!selectedRedacao) return;

    setSubmissoes((prev) =>
      prev.map((s) =>
        s.id === selectedRedacao.id
          ? { ...s, status: 'corrigida', nota: parseInt(nota) || 900 }
          : s
      )
    );

    showToast(`Correção da redação de ${selectedRedacao.aluno} concluída com sucesso!`, 'success');
    setSelectedRedacao(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Correção de Redações
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Avalie os textos enviados pelos alunos e devolva pareceres formativos
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {submissoes.map((item) => (
          <Card key={item.id} padding="lg">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Data de Envio: {item.data} • Aluno(a): <strong style={{ color: 'var(--text-primary)' }}>{item.aluno}</strong>
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {item.tema}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Badge variant={item.status === 'corrigida' ? 'success' : 'warning'} size="sm">
                  {item.status === 'corrigida' ? `Nota: ${item.nota}/1000` : 'Pendente'}
                </Badge>
                <Button
                  variant={item.status === 'corrigida' ? 'secondary' : 'primary'}
                  size="sm"
                  icon={<Eye size={14} />}
                  onClick={() => setSelectedRedacao(item)}
                >
                  {item.status === 'corrigida' ? 'Revisar Parecer' : 'Avaliar Redação'}
                </Button>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxHeight: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              "{item.texto}"
            </p>
          </Card>
        ))}
      </div>

      {/* Modal de Correção */}
      <Modal
        isOpen={!!selectedRedacao}
        onClose={() => setSelectedRedacao(null)}
        title={selectedRedacao ? `Correção de Redação — ${selectedRedacao.aluno}` : ''}
        maxWidth="720px"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setSelectedRedacao(null)}>
              Cancelar
            </Button>
            <Button variant="primary" icon={<Send size={14} />} onClick={handleSalvarCorrecao}>
              Publicar Parecer
            </Button>
          </div>
        }
      >
        {selectedRedacao && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tema da Proposta:</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRedacao.tema}</h4>
            </div>

            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                maxHeight: '260px',
                overflowY: 'auto'
              }}
            >
              {selectedRedacao.texto}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1rem' }}>
              <Input
                label="Nota Final (0 a 1000)"
                type="number"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Comentários Pedagógicos & Sugestões:
                </label>
                <textarea
                  rows={4}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
