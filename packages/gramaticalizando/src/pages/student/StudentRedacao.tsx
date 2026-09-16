import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Send,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Award,
  BookOpen,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { essaysApi } from '../../api/essays';
import { TemaRedacao, Redacao } from '../../types/essay';
import { useToast } from '../../context/ToastContext';

export const StudentRedacao: React.FC = () => {
  const [temas, setTemas] = useState<TemaRedacao[]>([]);
  const [selectedTema, setSelectedTema] = useState<TemaRedacao | null>(null);
  const [texto, setTexto] = useState('');
  const [redacoes, setRedacoes] = useState<Redacao[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal Detalhes / Correção da Professora
  const [selectedRedacao, setSelectedRedacao] = useState<Redacao | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [listTemas, myEssays] = await Promise.all([
        essaysApi.getTopics(),
        essaysApi.getMyEssays()
      ]);
      setTemas(listTemas);
      if (listTemas.length > 0) {
        setSelectedTema(listTemas[0]);
      }
      setRedacoes(myEssays);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados de redação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const wordCount = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const lineCount = texto ? texto.split('\n').length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTema) {
      showToast('Selecione uma proposta temática para sua redação.', 'warning');
      return;
    }
    if (texto.trim().length < 50) {
      showToast('A redação deve conter no mínimo 50 caracteres (idealmente entre 20 e 30 linhas).', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await essaysApi.submitEssay({
        temaTitulo: selectedTema.titulo,
        texto: texto.trim()
      });

      if (res && res.sucesso) {
        showToast(res.mensagem || 'Redação enviada com sucesso para correção da Profª Wilma!', 'success');
        setTexto('');
        // Recarregar histórico de redações
        const atualizadas = await essaysApi.getMyEssays();
        setRedacoes(atualizadas);
      } else {
        showToast(res?.mensagem || 'Falha ao submeter redação. Tente novamente.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Falha ao submeter redação para o servidor.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
            <PenTool size={22} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Laboratório de Redação
          </h1>
        </div>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
          Envie seus textos dissertativos e receba correções detalhadas por competência da Profª Wilma Barbosa.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.9fr)', gap: '2rem' }}>
        {/* Coluna da Esquerda: Editor de Envio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} style={{ color: 'var(--accent)' }} />
              Redigir Novo Texto
            </h3>

            {/* Seletor de Tema */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
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
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Badge variant="purple" size="sm">{selectedTema.categoria}</Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prazo: {selectedTema.prazo}</span>
                </div>
                <p style={{ lineHeight: 1.5, margin: 0, color: 'var(--text-primary)' }}>{selectedTema.descricao}</p>
                {selectedTema.textosMotivadores && selectedTema.textosMotivadores.length > 0 && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      Eixos & Textos Motivadores:
                    </span>
                    {selectedTema.textosMotivadores.map((tm, idx) => (
                      <p key={idx} style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                        {tm}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <textarea
                  rows={14}
                  placeholder="Comece a digitar seu texto dissertativo aqui... Respeite a estrutura formal: Introdução, Desenvolvimento 1, Desenvolvimento 2 e Conclusão com Proposta de Intervenção."
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
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Send size={16} />
                <span>Enviar Redação Para Correção</span>
              </Button>
            </form>
          </Card>
        </div>

        {/* Coluna da Direita: Histórico de Redações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card padding="lg">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--accent)' }} />
              Minhas Redações Enviadas
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                Carregando histórico de redações...
              </div>
            ) : redacoes.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <PenTool size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
                  Nenhuma redação enviada até o momento.
                </p>
                <p style={{ fontSize: '0.8125rem', margin: 0 }}>
                  Escolha uma proposta ao lado e envie seu primeiro texto para avaliação individualizada!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {redacoes.map((r) => {
                  const isCorrigida = r.status === 'corrigida';
                  return (
                    <div
                      key={r.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Enviada em {r.enviadaEm}
                        </span>
                        <Badge
                          variant={isCorrigida ? 'success' : 'warning'}
                          size="sm"
                        >
                          {isCorrigida ? 'Corrigida' : 'Aguardando Avaliação'}
                        </Badge>
                      </div>

                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {r.temaTitulo}
                      </h4>

                      {isCorrigida && r.notaFinal !== undefined && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nota Final:</span>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--success)' }}>
                              {r.notaFinal} / 1000
                            </span>
                          </div>

                          <Button
                            onClick={() => setSelectedRedacao(r)}
                            variant="outline"
                            size="sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                          >
                            <Eye size={14} />
                            <span>Ver Devolutiva</span>
                          </Button>
                        </div>
                      )}

                      {!isCorrigida && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          <Clock size={12} />
                          <span>Prazo de correção: em até 48 horas úteis</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal Devolutiva da Professora Wilma */}
      <Modal
        isOpen={!!selectedRedacao}
        onClose={() => setSelectedRedacao(null)}
        title="Devolutiva e Avaliação da Redação"
      >
        {selectedRedacao && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {/* Header da Redação */}
            <div style={{ backgroundColor: 'var(--bg-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                Tema da Redação
              </span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
                {selectedRedacao.temaTitulo}
              </h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Enviada: {selectedRedacao.enviadaEm}</span>
                {selectedRedacao.corrigidaEm && <span>• Corrigida: {selectedRedacao.corrigidaEm}</span>}
              </div>
            </div>

            {/* Destaque de Nota */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--accent-light)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={32} style={{ color: 'var(--accent)' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', display: 'block' }}>
                    Desempenho Geral
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)' }}>
                    {selectedRedacao.notaFinal ?? 'Avaliada'} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>/ 1000 pontos</span>
                  </span>
                </div>
              </div>
              <Badge variant="success" size="md">Aprovado</Badge>
            </div>

            {/* Competências Detalhadas */}
            {selectedRedacao.competencias && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  Detalhamento por Competência (Critérios Oficiais)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'C1: Domínio da Norma Padrão da Língua Escrita', valor: selectedRedacao.competencias.gramatica },
                    { label: 'C2: Compreensão da Proposta & Repertório Sociocultural', valor: selectedRedacao.competencias.coesao },
                    { label: 'C3: Seleção, Relação e Organização dos Argumentos', valor: selectedRedacao.competencias.coerencia },
                    { label: 'C4: Coesão Textual e Recursos Conectivos', valor: selectedRedacao.competencias.argumentacao },
                    { label: 'C5: Elaboração da Proposta de Intervenção Cidadã', valor: selectedRedacao.competencias.propostaIntervencao }
                  ].map((comp, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.625rem 0.875rem',
                        backgroundColor: 'var(--bg-surface-2)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {comp.label}
                      </span>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>
                        {comp.valor} / 200
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comentários da Professora Wilma */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Orientações Pedagógicas da Profª Wilma Barbosa
              </h4>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface-2)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--accent)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6
                }}
              >
                {selectedRedacao.comentariosProfessor || 'Parabéns pela dedicação na produção textual! Continue praticando os tópicos indicados no seu plano de estudos.'}
              </div>
            </div>

            {/* Texto Original Enviado */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Seu Texto Original
              </h4>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface-1)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {selectedRedacao.texto}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button onClick={() => setSelectedRedacao(null)} variant="primary">
                Entendido
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
