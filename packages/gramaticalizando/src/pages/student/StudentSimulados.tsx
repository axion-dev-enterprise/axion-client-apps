import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  HelpCircle,
  Play
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  simuladosApi,
  SimuladoItemResumo,
  SimuladoCompleto,
  ResultadoSimulado
} from '../../api/simulados';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface LocalSimuladoAttempt {
  concluido: boolean;
  porcentagem: number;
  corretas: number;
  total: number;
  concluidoEm: string;
}

export const StudentSimulados: React.FC = () => {
  const { user } = useAuth();
  const [simulados, setSimulados] = useState<SimuladoItemResumo[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado da Prova Ativa
  const [simuladoAtivo, setSimuladoAtivo] = useState<SimuladoCompleto | null>(null);
  const [questaoIndex, setQuestaoIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [tempoRestante, setTempoRestante] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Resultado
  const [resultado, setResultado] = useState<ResultadoSimulado | null>(null);

  // Modal Confirmação de Saída
  const [modalSairAberto, setModalSairAberto] = useState(false);

  const { showToast } = useToast();

  const getStorageKey = () => `gramaticalizando_simulados_${user?.id || 'anon'}`;

  const loadLocalAttempts = (): Record<string, LocalSimuladoAttempt> => {
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  };

  const saveLocalAttempt = (simId: string, attempt: LocalSimuladoAttempt) => {
    try {
      const current = loadLocalAttempts();
      current[simId] = attempt;
      localStorage.setItem(getStorageKey(), JSON.stringify(current));
    } catch {}
  };

  const loadSimulados = async () => {
    const localAttempts = loadLocalAttempts();

    try {
      setLoading(true);
      const list = await simuladosApi.listar();
      const merged = list.map(s => {
        const local = localAttempts[s.id];
        const isDone = s.concluido || (local && local.concluido);
        return {
          ...s,
          concluido: isDone,
          ultimaNota: s.ultimaNota !== null && s.ultimaNota !== undefined ? s.ultimaNota : (local ? local.porcentagem : null),
          corretas: s.corretas !== null && s.corretas !== undefined ? s.corretas : (local ? local.corretas : null),
          concluidoEm: s.concluidoEm || (local ? local.concluidoEm : null)
        };
      });
      setSimulados(merged);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar simulados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSimulados();
  }, [user?.id]);

  // Timer do Simulado
  useEffect(() => {
    if (!simuladoAtivo || resultado || tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalizarAutomatico();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [simuladoAtivo, resultado, tempoRestante]);

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleIniciarSimulado = async (id: string) => {
    try {
      setLoading(true);
      const sim = await simuladosApi.obterPorId(id);
      if (!sim || !sim.questoes || sim.questoes.length === 0) {
        showToast('Não foi possível carregar as questões deste simulado.', 'error');
        return;
      }
      setSimuladoAtivo(sim);
      setQuestaoIndex(0);
      setRespostas({});
      setResultado(null);
      setTempoRestante(sim.tempoMinutos * 60);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message || 'Erro ao iniciar simulado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarAlternativa = (questaoId: string, altId: string) => {
    if (resultado) return;
    setRespostas((prev) => ({
      ...prev,
      [questaoId]: altId
    }));
  };

  const handleFinalizarAutomatico = async () => {
    showToast('O tempo da prova acabou! Computando suas respostas...', 'info');
    await submeterProva();
  };

  const submeterProva = async () => {
    if (!simuladoAtivo) return;
    setSubmitting(true);
    try {
      const res = await simuladosApi.finalizar(simuladoAtivo.id, respostas);
      if (res) {
        setResultado(res);

        // Salva imediatamente no LocalStorage (offline-first, zero perda de progresso)
        saveLocalAttempt(simuladoAtivo.id, {
          concluido: true,
          porcentagem: res.porcentagem,
          corretas: res.corretas,
          total: res.total,
          concluidoEm: new Date().toISOString()
        });

        showToast(`Simulado concluído! Aproveitamento: ${res.porcentagem}%`, 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast('Erro ao processar gabarito do simulado.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Falha ao enviar respostas do simulado.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReiniciarSimulado = () => {
    if (simuladoAtivo) {
      setResultado(null);
      setRespostas({});
      setQuestaoIndex(0);
      setTempoRestante(simuladoAtivo.tempoMinutos * 60);
    }
  };

  const handleVoltarParaLista = () => {
    setSimuladoAtivo(null);
    setResultado(null);
    setRespostas({});
    setQuestaoIndex(0);
    loadSimulados();
  };

  // 1. TELA DE RESULTADO / GABARITO
  if (resultado && simuladoAtivo) {
    const totalRespondidas = Object.keys(respostas).length;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header de Resultado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
              Resultado Final • {simuladoAtivo.banca}
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
              {simuladoAtivo.titulo}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button onClick={handleReiniciarSimulado} variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={16} />
              <span>Refazer Simulado</span>
            </Button>
            <Button onClick={handleVoltarParaLista} variant="primary">
              Outros Simulados
            </Button>
          </div>
        </div>

        {/* Card de Score */}
        <Card padding="lg" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, display: 'block' }}>
                Aproveitamento
              </span>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)' }}>
                {resultado.porcentagem}%
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, display: 'block' }}>
                Acertos
              </span>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>
                {resultado.corretas} <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>/ {resultado.total}</span>
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600, display: 'block' }}>
                Erros
              </span>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--danger)' }}>
                {resultado.erradas}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>
                Respondidas
              </span>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {totalRespondidas} <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>/ {resultado.total}</span>
              </span>
            </div>
          </div>
        </Card>

        {/* Gabarito Comentado Questão a Questão */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} style={{ color: 'var(--accent)' }} />
            Gabarito Oficial & Comentários Pedagógicos
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {resultado.correcao.map((item, index) => {
              const questaoOriginal = simuladoAtivo.questoes.find(q => q.id === item.id);
              return (
                <Card key={item.id} padding="lg" style={{ borderLeft: `4px solid ${item.acertou ? 'var(--success)' : 'var(--danger)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>
                      Questão {index + 1}
                    </span>
                    <Badge variant={item.acertou ? 'success' : 'danger'}>
                      {item.acertou ? 'Você Acertou' : 'Você Errou'}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {questaoOriginal?.enunciado || `Questão ${index + 1}`}
                  </p>

                  {/* Alternativas com indicação */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {questaoOriginal?.alternativas.map((alt) => {
                      const foiMarcada = String(item.respostaAluno).toLowerCase() === String(alt.id).toLowerCase();
                      const eCorreta = String(item.respostaCorreta).toLowerCase() === String(alt.id).toLowerCase();

                      let bg = 'var(--bg-surface-2)';
                      let border = '1px solid var(--border-subtle)';
                      let textColor = 'var(--text-primary)';

                      if (eCorreta) {
                        bg = 'rgba(16, 185, 129, 0.1)';
                        border = '1px solid var(--success)';
                        textColor = 'var(--success)';
                      } else if (foiMarcada && !item.acertou) {
                        bg = 'rgba(239, 68, 68, 0.1)';
                        border = '1px solid var(--danger)';
                        textColor = 'var(--danger)';
                      }

                      return (
                        <div
                          key={alt.id}
                          style={{
                            padding: '0.625rem 0.875rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: bg,
                            border,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.875rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <strong style={{ textTransform: 'uppercase' }}>{alt.id})</strong>
                            <span style={{ color: textColor }}>{alt.texto}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                            {eCorreta && <span style={{ color: 'var(--success)' }}>Gabarito Oficial</span>}
                            {foiMarcada && !eCorreta && <span style={{ color: 'var(--danger)' }}>Sua Resposta</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explicação da Professora Wilma */}
                  <div style={{ backgroundColor: 'var(--bg-surface-1)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                      Comentário da Profª Wilma Barbosa:
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {item.explicacao || 'Explicação gramatical padrão de acordo com o edital da banca.'}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. TELA DE EXECUÇÃO DA PROVA (SIMULADO ATIVO)
  if (simuladoAtivo) {
    const questaoAtual = simuladoAtivo.questoes[questaoIndex];
    const totalQuestoes = simuladoAtivo.questoes.length;
    const alternativaMarcada = respostas[questaoAtual?.id];
    const isTempoCritico = tempoRestante < 300; // menos de 5 minutos

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Topbar da Prova */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '1rem',
            zIndex: 10
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
              {simuladoAtivo.banca}
            </span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {simuladoAtivo.titulo}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Cronômetro */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: isTempoCritico ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface-2)',
                color: isTempoCritico ? 'var(--danger)' : 'var(--text-primary)',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              <Clock size={18} />
              <span>{formatarTempo(tempoRestante)}</span>
            </div>

            <Button onClick={() => setModalSairAberto(true)} variant="ghost" size="sm" style={{ color: 'var(--text-muted)' }}>
              Sair da Prova
            </Button>
          </div>
        </div>

        {/* Questão & Alternativas */}
        {questaoAtual && (
          <Card padding="lg">
            {/* Header da Questão */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>
                Questão {questaoIndex + 1} de {totalQuestoes}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {Object.keys(respostas).length} de {totalQuestoes} respondidas
              </span>
            </div>

            {/* Enunciado */}
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              {questaoAtual.enunciado}
            </p>

            {/* Alternativas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {questaoAtual.alternativas.map((alt) => {
                const isSelected = alternativaMarcada === alt.id;
                return (
                  <button
                    key={alt.id}
                    onClick={() => handleSelecionarAlternativa(questaoAtual.id, alt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-surface-2)',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                      color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.925rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-surface-1)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}
                    >
                      {alt.id.toUpperCase()}
                    </span>
                    <span style={{ lineHeight: 1.4 }}>{alt.texto}</span>
                  </button>
                );
              })}
            </div>

            {/* Ações de Navegação */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <Button
                onClick={() => setQuestaoIndex((prev) => Math.max(0, prev - 1))}
                disabled={questaoIndex === 0}
                variant="outline"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ArrowLeft size={16} />
                <span>Anterior</span>
              </Button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {questaoIndex < totalQuestoes - 1 ? (
                  <Button
                    onClick={() => setQuestaoIndex((prev) => prev + 1)}
                    variant="primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span>Próxima</span>
                    <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button
                    onClick={submeterProva}
                    variant="primary"
                    isLoading={submitting}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                  >
                    <CheckCircle size={16} />
                    <span>Finalizar e Ver Gabarito</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Mapa de Questões (Navegação Rápida) */}
        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            Navegação Rápida de Questões:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {simuladoAtivo.questoes.map((q, idx) => {
              const respondida = !!respostas[q.id];
              const isAtual = idx === questaoIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setQuestaoIndex(idx)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-sm)',
                    border: isAtual ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                    backgroundColor: respondida ? 'var(--accent)' : isAtual ? 'var(--accent-light)' : 'var(--bg-surface-2)',
                    color: respondida ? '#ffffff' : isAtual ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Sair */}
        <Modal
          isOpen={modalSairAberto}
          onClose={() => setModalSairAberto(false)}
          title="Abandonar Simulado?"
        >
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Se você sair agora, as respostas selecionadas nesta tentativa não serão salvas como avaliação concluída. Deseja realmente sair?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button onClick={() => setModalSairAberto(false)} variant="outline">
                Continuar Prova
              </Button>
              <Button onClick={handleVoltarParaLista} variant="outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                Sim, Sair do Simulado
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // 3. TELA INICIAL: LISTAGEM DE SIMULADOS DISPONÍVEIS
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
            <FileCheck size={22} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Simulados & Treinamento
          </h1>
        </div>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
          Teste seus conhecimentos em condições reais de prova com bancas examinadoras e tempo cronometrado.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          Carregando simulados disponíveis...
        </div>
      ) : simulados.length === 0 ? (
        <Card style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <FileCheck size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nenhum simulado publicado no momento
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
            Aguarde a liberação dos próximos simulados e cronogramas pela coordenação pedagógica.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {simulados.map((sim) => (
            <Card
              key={sim.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                border: sim.concluido ? '1px solid var(--success)' : '1px solid var(--border-subtle)',
                borderLeft: sim.concluido ? '4px solid var(--success)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: sim.concluido ? 'rgba(16, 185, 129, 0.02)' : '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge variant="purple">{sim.banca}</Badge>
                    {sim.concluido && (
                      <Badge variant="success" size="sm">Concluído</Badge>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    <span>{sim.tempoMinutos} min</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {sim.titulo}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {sim.descricao || 'Simulado completo focado nas peculiaridades e pegadinhas da banca examinadora.'}
                </p>

                {sim.concluido && sim.ultimaNota !== null && sim.ultimaNota !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.625rem 0.875rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <CheckCircle size={16} color="var(--success)" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)' }}>
                      Último resultado: <strong>{sim.ultimaNota}%</strong> ({sim.corretas}/{sim.totalQuestoes} acertos)
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {sim.totalQuestoes} Questões
                </span>
                <Button
                  onClick={() => handleIniciarSimulado(sim.id)}
                  variant={sim.concluido ? 'outline' : 'primary'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {sim.concluido ? <RotateCcw size={14} /> : <Play size={14} />}
                  <span>{sim.concluido ? 'Refazer Simulado' : 'Iniciar Simulado'}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
