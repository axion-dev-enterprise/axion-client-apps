import React, { useState, useEffect } from 'react';
import { PenTool, Send, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { essaysApi } from '../../api/essays';
import { TemaRedacao, Redacao } from '../../types/essay';
import { useToast } from '../../context/ToastContext';

export const StudentRedacao: React.FC = () => {
  const [temas, setTemas] = useState<TemaRedacao[]>([]);
  const [selectedTema, setSelectedTema] = useState<TemaRedacao | null>(null);
  const [texto, setTexto] = useState('');
  const [redacoes, setRedacoes] = useState<Redacao[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      const list = await essaysApi.getTopics();
      setTemas(list);
      if (list.length > 0) setSelectedTema(list[0]);

      const myEssays = await essaysApi.getMyEssays();
      setRedacoes(myEssays);
    };
    loadData();
  }, []);

  const wordCount = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const lineCount = texto.split('\n').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTema) {
      showToast('Selecione um tema de redação.', 'warning');
      return;
    }
    if (wordCount < 100) {
      showToast('A redação deve conter no mínimo 100 palavras para envio.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const novaRedacao: Redacao = {
        id: Math.random().toString(36).substring(2, 9),
        alunoId: 'aluno-demo',
        alunoNome: 'Aluno Demo',
        temaId: selectedTema.id,
        temaTitulo: selectedTema.titulo,
        texto,
        status: 'pendente',
        enviadaEm: new Date().toLocaleDateString('pt-BR')
      };

      setRedacoes((prev) => [novaRedacao, ...prev]);
      setTexto('');
      showToast('Redação enviada com sucesso! A correção estará disponível em até 48 horas.', 'success');
    } catch {
      showToast('Falha ao submeter redação.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Laboratório de Redação
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Envie seus textos dissertativos e receba correções detalhadas por competência
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Editor de Envio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PenTool size={18} color="var(--accent)" />
              Redigir Novo Texto
            </h3>

            {/* Seletor de Tema */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Selecione a Proposta Temática:
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
                value={selectedTema?.id || ''}
                onChange={(e) => {
                  const t = temas.find((x) => x.id === e.target.value);
                  if (t) setSelectedTema(t);
                }}
              >
                {temas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.titulo}
                  </option>
                ))}
              </select>
            </div>

            {selectedTema && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Badge variant="purple" size="sm">{selectedTema.categoria}</Badge>
                  <span>Prazo: {selectedTema.prazo}</span>
                </div>
                <p style={{ lineHeight: 1.5 }}>{selectedTema.descricao}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <textarea
                  rows={14}
                  placeholder="Comece a digitar seu texto dissertativo aqui..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'var(--font-sans)'
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  required
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  <span>{wordCount} palavras • ~{lineCount} linhas</span>
                  <span>Mínimo recomendado: 150 a 300 palavras</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                icon={<Send size={16} />}
                style={{ width: '100%' }}
              >
                Enviar Redação Para Correção
              </Button>
            </form>
          </Card>
        </div>

        {/* Histórico de Redações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card padding="lg">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--accent)" />
              Minhas Redações Enviadas
            </h3>

            {redacoes.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>Nenhuma redação enviada até o momento.</p>
                <p style={{ fontSize: '0.8125rem', marginTop: '0.375rem' }}>
                  Escolha um tema ao lado e envie seu primeiro texto!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {redacoes.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Enviada em {r.enviadaEm}
                      </span>
                      <Badge
                        variant={r.status === 'corrigida' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {r.status === 'corrigida' ? 'Corrigida' : 'Aguardando Avaliação'}
                      </Badge>
                    </div>

                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {r.temaTitulo}
                    </h4>

                    {r.notaFinal && (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nota Final:</span>
                        <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>
                          {r.notaFinal}/1000
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
