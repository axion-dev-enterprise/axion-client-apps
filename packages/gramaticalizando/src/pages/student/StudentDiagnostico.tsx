import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  HelpCircle,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

interface Alternativa {
  id: string;
  letra: string;
  texto: string;
}

interface Questao {
  id: number;
  enunciado: string;
  textoApoio?: string;
  alternativas: Alternativa[];
  topico: string;
  explicacao?: string;
  respostaCorreta?: string;
}

interface DiagnosticoResultado {
  score: number;
  totalQuestoes: number;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  recomendacoes: string[];
  pontosFortes: string[];
  topicosDesempenho: { [key: string]: { total: number; acertos: number } };
  gabaritoComentado: {
    questaoId: number;
    enunciado: string;
    suaResposta: string;
    respostaCorreta: string;
    correta: boolean;
    topico: string;
    explicacao: string;
  }[];
}

const QUESTOES_FALLBACK: Questao[] = [
  {
    id: 1,
    topico: 'Interpretação de Texto',
    enunciado: 'Em "O silêncio das ruas não era ausência de vida, mas uma trégua necessária", a conjunção "mas" estabelece com a oração anterior uma relação de:',
    alternativas: [
      { id: '1_a', letra: 'A', texto: 'Adição de fatos rotineiros' },
      { id: '1_b', letra: 'B', texto: 'Oposição ou contraste de sentidos' },
      { id: '1_c', letra: 'C', texto: 'Conclusão lógica do argumento' },
      { id: '1_d', letra: 'D', texto: 'Causa determinante do silêncio' }
    ],
    respostaCorreta: 'B',
    explicacao: 'A conjunção coordenativa adversativa "mas" expressa contraste, oposição ou ressalva em relação à oração anterior.'
  },
  {
    id: 2,
    topico: 'Sintaxe',
    enunciado: 'Assinale a alternativa em que o termo em destaque funciona como SUJEITO da oração: "Faltavam-lhe [recursos] para concluir o projeto no prazo".',
    alternativas: [
      { id: '2_a', letra: 'A', texto: 'Recursos' },
      { id: '2_b', letra: 'B', texto: 'Lhe (objeto indireto)' },
      { id: '2_c', letra: 'C', texto: 'O sujeito é oculto ou elíptico' },
      { id: '2_d', letra: 'D', texto: 'O sujeito é indeterminado' }
    ],
    respostaCorreta: 'A',
    explicacao: 'Quem faltava? "Recursos" faltavam a ele (lhe). O termo "recursos" é o sujeito simples posposto do verbo faltar.'
  },
  {
    id: 3,
    topico: 'Crase',
    enunciado: 'O sinal indicativo de crase está empregado CORRETAMENTE de acordo com a norma-padrão em:',
    alternativas: [
      { id: '3_a', letra: 'A', texto: 'Ele começou à redigir o documento com rapidez.' },
      { id: '3_b', letra: 'B', texto: 'Encaminhamos a solicitação à diretoria executiva.' },
      { id: '3_c', letra: 'C', texto: 'Referiu-se à todas as regras do edital anterior.' },
      { id: '3_d', letra: 'D', texto: 'Fez uma promessa à prazo sem garantia legal.' }
    ],
    respostaCorreta: 'B',
    explicacao: 'Há crase diante de substantivo feminino determinado ("a diretoria") regido por preposição exigida pelo verbo encaminhar ("a + a = à"). Não há crase antes de verbo, pronome indefinido ou palavra masculina.'
  },
  {
    id: 4,
    topico: 'Concordância Verbal',
    enunciado: 'Indique a frase que respeita integralmente as regras de concordância verbal da norma-padrão:',
    alternativas: [
      { id: '4_a', letra: 'A', texto: 'Haviam muitos candidatos aguardando o resultado oficial.' },
      { id: '4_b', letra: 'B', texto: 'Fazem dois anos que não se realiza concurso para o órgão.' },
      { id: '4_c', letra: 'C', texto: 'Alugam-se salas comerciais no centro da cidade.' },
      { id: '4_d', letra: 'D', texto: 'Tratam-se de questões prioritárias para a gestão pública.' }
    ],
    respostaCorreta: 'C',
    explicacao: 'Com a partícula apassivadora "se", o verbo concorda com o sujeito paciente: "Salas comerciais são alugadas" -> "Alugam-se salas comerciais". Os verbos "haver" e "fazer" de tempo são impessoais (ficam no singular).'
  },
  {
    id: 5,
    topico: 'Pontuação',
    enunciado: 'O uso da vírgula está ADEQUADO e fundamentado nas regras gramaticais em:',
    alternativas: [
      { id: '5_a', letra: 'A', texto: 'Os professores dedicados, corrigiram todas as redações ontem.' },
      { id: '5_b', letra: 'B', texto: 'Durante a prova de Português, o candidato manteve a serenidade.' },
      { id: '5_c', letra: 'C', texto: 'A aluna declarou, que pretendia revisar as questões de crase.' },
      { id: '5_d', letra: 'D', texto: 'Comprei cadernos, canetas, e, apostilas para o semestre.' }
    ],
    respostaCorreta: 'B',
    explicacao: 'A vírgula isola o adjunto adverbial de tempo deslocado ("Durante a prova de Português"). É proibido separar sujeito do predicado ou verbo do seu objeto direto com vírgula.'
  },
  {
    id: 6,
    topico: 'Regência Verbal',
    enunciado: 'A regência verbal atende à norma-padrão da língua na seguinte alternativa:',
    alternativas: [
      { id: '6_a', letra: 'A', texto: 'O médico assistiu o paciente durante toda a intervenção cirúrgica.' },
      { id: '6_b', letra: 'B', texto: 'Todos os cidadãos aspiram um país com mais oportunidades.' },
      { id: '6_c', letra: 'C', texto: 'Prefiro estudar gramática do que perder tempo com distrações.' },
      { id: '6_d', letra: 'D', texto: 'O servidor visou ao passaporte antes do embarque internacional.' }
    ],
    respostaCorreta: 'A',
    explicacao: 'No sentido de prestar socorro ou auxílio, o verbo "assistir" é transitivo direto (rege objeto sem preposição). Já no sentido de almejar, "aspirar" exige preposição "a". E quem prefere, prefere uma coisa A outra.'
  },
  {
    id: 7,
    topico: 'Morfologia',
    enunciado: 'Na oração "O candidato que estuda com disciplina atinge seus objetivos", a palavra "que" classifica-se como:',
    alternativas: [
      { id: '7_a', letra: 'A', texto: 'Conjunção integrante que introduz oração substantiva' },
      { id: '7_b', letra: 'B', texto: 'Pronome relativo que retoma o termo antecedente "candidato"' },
      { id: '7_c', letra: 'C', texto: 'Partícula expletiva ou de realce estilístico' },
      { id: '7_d', letra: 'D', texto: 'Advérbio de intensidade com valor conotativo' }
    ],
    respostaCorreta: 'B',
    explicacao: 'O "que" substitui o substantivo "candidato" e introduz uma oração subordinada adjetiva restritiva: "O candidato O QUAL estuda com disciplina". Trata-se de pronome relativo.'
  },
  {
    id: 8,
    topico: 'Ortografia e Acentuação',
    enunciado: 'Segundo o Acordo Ortográfico vigente, assinale a opção em que todas as palavras estão grafadas e acentuadas CORRETAMENTE:',
    alternativas: [
      { id: '8_a', letra: 'A', texto: 'Idéia, assembléia, vôo, jibóia' },
      { id: '8_b', letra: 'B', texto: 'Micro-ondas, anti-inflamatório, ideia, heroico' },
      { id: '8_c', letra: 'C', texto: 'Auto-escola, para-quedas, hiper-resistente, pólen' },
      { id: '8_d', letra: 'D', texto: 'Anti-social, semi-aberto, gratuíto, rúbrica' }
    ],
    respostaCorreta: 'B',
    explicacao: 'Com o Acordo Ortográfico, letras iguais se separam por hífen ("micro-ondas", "anti-inflamatório") e perdeu-se o acento dos ditongos abertos "ei" e "oi" nas palavras paroxítonas ("ideia", "heroico").'
  },
  {
    id: 9,
    topico: 'Sintaxe do Período Composto',
    enunciado: 'Em "Embora houvesse divergências conceituais, os especialistas homologaram a proposta", a oração destacada expressa sentido de:',
    alternativas: [
      { id: '9_a', letra: 'A', texto: 'Concessão (fato que poderia inviabilizar o principal, mas não impede)' },
      { id: '9_b', letra: 'B', texto: 'Causa (o motivo determinante da homologação)' },
      { id: '9_c', letra: 'C', texto: 'Proporção (evolução simultânea das duas orações)' },
      { id: '9_d', letra: 'D', texto: 'Condição indispensável para o cumprimento da meta' }
    ],
    respostaCorreta: 'A',
    explicacao: '"Embora" é a clássica conjunção subordinativa concessiva, indicando um obstáculo ou ressalva que não impede a realização da oração principal.'
  },
  {
    id: 10,
    topico: 'Colocação Pronominal',
    enunciado: 'A próclise é OBRIGATÓRIA segundo a norma culta na seguinte opção:',
    alternativas: [
      { id: '10_a', letra: 'A', texto: 'Entregou-me o relatório assinado no final da tarde.' },
      { id: '10_b', letra: 'B', texto: 'Não se esqueça de revisar os tópicos mais recorrentes da banca.' },
      { id: '10_c', letra: 'C', texto: 'Desejo dedicar-me integralmente aos estudos neste semestre.' },
      { id: '10_d', letra: 'D', texto: 'Quando puder, avise-nos com antecedência sobre o horário.' }
    ],
    respostaCorreta: 'B',
    explicacao: 'A palavra de sentido negativo "Não" é fator atrativo obrigatório de próclise ("Não se esqueça"), impossibilitando a ênclise.'
  }
];

export const StudentDiagnostico: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [questoes, setQuestoes] = useState<Questao[]>(QUESTOES_FALLBACK);
  const [carregandoQuestoes, setCarregandoQuestoes] = useState(true);
  const [respostas, setRespostas] = useState<{ [questaoId: number]: string }>({});
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [etapa, setEtapa] = useState<'intro' | 'quiz' | 'processando' | 'resultado'>('intro');
  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null);
  const [exibirGabarito, setExibirGabarito] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar questões do backend com fallback resiliente
  useEffect(() => {
    let montado = true;
    const carregar = async () => {
      try {
        const resp = await fetch('/api/diagnostico/questoes', {
          credentials: 'include'
        });
        if (resp.ok) {
          const dados = await resp.json();
          if (dados && Array.isArray(dados.questoes) && dados.questoes.length > 0 && montado) {
            setQuestoes(dados.questoes);
          }
        }
      } catch (e) {
        console.warn('Usando banco de questões canônico local para o diagnóstico.', e);
      } finally {
        if (montado) setCarregandoQuestoes(false);
      }
    };
    carregar();
    return () => {
      montado = false;
    };
  }, []);

  const questaoAtual = questoes[indiceAtual] || questoes[0];
  const totalQuestoes = questoes.length;
  const totalRespondidas = Object.keys(respostas).length;
  const progressoPercent = Math.round(((indiceAtual + 1) / totalQuestoes) * 100);

  const selecionarAlternativa = (letra: string) => {
    if (!questaoAtual) return;
    setRespostas(prev => ({
      ...prev,
      [questaoAtual.id]: letra
    }));
  };

  const proximaQuestao = () => {
    if (indiceAtual < totalQuestoes - 1) {
      setIndiceAtual(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const questaoAnterior = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finalizarDiagnostico = async () => {
    setEtapa('processando');
    setErro(null);

    // Formatar payload para submissão
    const payloadRespostas = questoes.map(q => ({
      questaoId: String(q.id),
      resposta: respostas[q.id] || ''
    }));

    try {
      const resp = await fetch('/api/aluno/diagnostico/processar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          foco: 'concursos',
          horasSemanais: 6,
          respostas: payloadRespostas
        })
      });

      if (resp.ok) {
        const dados = await resp.json();
        if (dados && dados.sucesso && dados.diagnostico) {
          const diag = dados.diagnostico;
          const correcoes = Array.isArray(dados.correcoesIndividuais) ? dados.correcoesIndividuais : [];

          const topicosDesemp: { [key: string]: { total: number; acertos: number } } = {};
          if (diag.resultadosPorTopico) {
            Object.keys(diag.resultadosPorTopico).forEach(k => {
              const t = diag.resultadosPorTopico[k];
              topicosDesemp[t.nome || k] = { total: t.total, acertos: t.acertos };
            });
          }

          const gabarito = correcoes.map((c: any, idx: number) => ({
            questaoId: c.questaoId || idx + 1,
            enunciado: c.enunciado || `Questão ${idx + 1}`,
            suaResposta: c.respostaAluno ? c.respostaAluno.toUpperCase() : 'Não respondida',
            respostaCorreta: c.respostaCorreta ? c.respostaCorreta.toUpperCase() : 'A',
            correta: !!c.acertou,
            topico: c.topico || 'Geral',
            explicacao: c.explicacao || 'Explicação da Professora Wilma Barbosa.'
          }));

          const nivelFormatado: 'Iniciante' | 'Intermediário' | 'Avançado' =
            diag.nivel === 'Avançado' ? 'Avançado' : diag.nivel === 'Intermediário' ? 'Intermediário' : 'Iniciante';

          setResultado({
            score: diag.totalAcertos,
            totalQuestoes: diag.totalQuestoes,
            nivel: nivelFormatado,
            recomendacoes: diag.lacunasIdentificadas && diag.lacunasIdentificadas.length > 0
              ? diag.lacunasIdentificadas.map((lacuna: string) => `Reforçar estudo intensivo em: ${lacuna}`)
              : ['Excelente! Mantenha a prática constante com simulados e redações.'],
            pontosFortes: nivelFormatado === 'Avançado'
              ? ['Domínio sólido da sintaxe, concordância e interpretação']
              : ['Boa dedicação e leitura atenta dos enunciados'],
            topicosDesempenho: topicosDesemp,
            gabaritoComentado: gabarito
          });

          setEtapa('resultado');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    } catch (e) {
      console.warn('Processamento local seguro do diagnóstico disparado:', e);
    }

    // Fallback pedagógico rigoroso caso a API falhe
    let score = 0;
    const gabaritoComentado = questoes.map(q => {
      const suaResposta = respostas[q.id] || '';
      const respostaCorreta = q.respostaCorreta || 'A';
      const correta = suaResposta.toUpperCase() === respostaCorreta.toUpperCase();
      if (correta) score++;
      return {
        questaoId: q.id,
        enunciado: q.enunciado,
        suaResposta,
        respostaCorreta,
        correta,
        topico: q.topico,
        explicacao: q.explicacao || 'Explicação pedagógica da Professora Wilma.'
      };
    });

    let nivel: 'Iniciante' | 'Intermediário' | 'Avançado' = 'Iniciante';
    const recomendacoes: string[] = [];
    const pontosFortes: string[] = [];

    if (score >= 8) {
      nivel = 'Avançado';
      pontosFortes.push('Domínio sólido da sintaxe do período e morfologia');
      pontosFortes.push('Excelente precisão em regras de concordância e regência');
      recomendacoes.push('Praticar questões de bancas de alto nível (FGV, Cebraspe, FCC)');
      recomendacoes.push('Focar no refinamento de crase facultativa e pontuação expressiva');
    } else if (score >= 5) {
      nivel = 'Intermediário';
      pontosFortes.push('Boa compreensão de leitura e identificação de classes gramaticais');
      recomendacoes.push('Revisar aprofundadamente regência verbal e nominal com exercícios práticos');
      recomendacoes.push('Treinar casos especiais de concordância verbal com particípio e sujeito composto');
    } else {
      nivel = 'Iniciante';
      recomendacoes.push('Iniciar pelo Módulo 1: Classes de Palavras e Morfologia Essencial');
      recomendacoes.push('Consolidar a estrutura sintática básica da oração: Sujeito, Verbo e Complementos');
      recomendacoes.push('Assistir às videoaulas fundamentais da Professora Wilma com foco em conceitos elementares');
    }

    // Calcular tópico a tópico
    const topicosDesempenho: { [key: string]: { total: number; acertos: number } } = {};
    gabaritoComentado.forEach(item => {
      if (!topicosDesempenho[item.topico]) {
        topicosDesempenho[item.topico] = { total: 0, acertos: 0 };
      }
      topicosDesempenho[item.topico].total++;
      if (item.correta) topicosDesempenho[item.topico].acertos++;
    });

    setResultado({
      score,
      totalQuestoes: questoes.length,
      nivel,
      recomendacoes,
      pontosFortes,
      topicosDesempenho,
      gabaritoComentado
    });
    setEtapa('resultado');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reiniciar = () => {
    setRespostas({});
    setIndiceAtual(0);
    setResultado(null);
    setExibirGabarito(false);
    setEtapa('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '80vh', padding: '2.5rem 0', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '920px', margin: '0 auto' }}>

        {/* ========================================================= */}
        {/* ETAPA 1: INTRODUÇÃO AO DIAGNÓSTICO                        */}
        {/* ========================================================= */}
        {etapa === 'intro' && (
          <div>
            {/* Header de Apresentação */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <Badge variant="purple" size="md" style={{ marginBottom: '1rem' }}>
                <Sparkles size={14} style={{ marginRight: '6px' }} />
                AVALIAÇÃO DE NIVELAMENTO GRATUITA
              </Badge>
              <h1
                style={{
                  fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.025em',
                  marginBottom: '1rem',
                  lineHeight: 1.2
                }}
              >
                Diagnóstico Pedagógico de Português
              </h1>
              <p
                style={{
                  fontSize: '1.125rem',
                  color: '#475569',
                  maxWidth: '680px',
                  margin: '0 auto',
                  lineHeight: 1.6
                }}
              >
                Descubra em apenas 5 minutos o seu nível real em Língua Portuguesa. Nossa metodologia analisa sua proficiência em 5 áreas essenciais e cria sua trilha personalizada de estudos.
              </p>
            </div>

            {/* Grid de Destaques Pedagógicos */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}
            >
              <Card variant="default" padding="lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b21a8'
                    }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>10 Questões Reais</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                  Questões selecionadas e calibradas com padrão das principais bancas de concursos públicos e vestibulares.
                </p>
              </Card>

              <Card variant="default" padding="lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b21a8'
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>5 a 10 Minutos</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                  Rápido e direto ao ponto. Responda no seu ritmo sem cronômetro punitivo ou pegadinhas sem contexto.
                </p>
              </Card>

              <Card variant="default" padding="lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b21a8'
                    }}
                  >
                    <GraduationCap size={20} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Gabarito Comentado</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                  Receba ao final a explicação fundamentada de cada alternativa pela Professora Wilma.
                </p>
              </Card>
            </div>

            {/* Áreas Avaliadas */}
            <Card
              variant="default"
              padding="lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                marginBottom: '2.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Competências Avaliadas no Diagnóstico:
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem'
                }}
              >
                {[
                  'Interpretação e Coesão Textual',
                  'Sintaxe do Período Simples e Composto',
                  'Regras Práticas de Crase',
                  'Concordância Verbal e Nominal',
                  'Regência e Pontuação da Norma-Padrão'
                ].map((topico, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.625rem 0.875rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <CheckCircle2 size={16} color="#6b21a8" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                      {topico}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA Iniciar */}
            <div style={{ textAlign: 'center' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setEtapa('quiz')}
                style={{
                  fontSize: '1.0625rem',
                  padding: '1rem 2.5rem',
                  boxShadow: '0 10px 25px -5px rgba(107, 33, 168, 0.3)'
                }}
              >
                Iniciar Diagnóstico Agora
                <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </Button>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.875rem' }}>
                Totalmente gratuito • Não requer cartão de crédito • Resultado instantâneo
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ETAPA 2: QUESTIONÁRIO INTERATIVO                          */}
        {/* ========================================================= */}
        {etapa === 'quiz' && questaoAtual && (
          <div>
            {/* Topbar do Quiz */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Questão {indiceAtual + 1} de {totalQuestoes}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  {questaoAtual.topico}
                </h2>
              </div>
              <Badge variant="neutral" size="md">
                {totalRespondidas}/{totalQuestoes} respondidas
              </Badge>
            </div>

            {/* Barra de Progresso */}
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e2e8f0',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '2rem'
              }}
            >
              <div
                style={{
                  width: `${progressoPercent}%`,
                  height: '100%',
                  backgroundColor: '#6b21a8',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>

            {/* Card da Questão */}
            <Card
              variant="default"
              padding="lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                marginBottom: '2rem'
              }}
            >
              {/* Texto de Apoio se houver */}
              {questaoAtual.textoApoio && (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderLeft: '4px solid #6b21a8',
                    borderRadius: '4px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9375rem',
                    color: '#334155',
                    fontStyle: 'italic',
                    lineHeight: 1.6
                  }}
                >
                  {questaoAtual.textoApoio}
                </div>
              )}

              {/* Enunciado */}
              <div
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem'
                }}
              >
                {questaoAtual.enunciado}
              </div>

              {/* Lista de Alternativas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {questaoAtual.alternativas.map((alt) => {
                  const selecionada = respostas[questaoAtual.id] === alt.letra;
                  return (
                    <button
                      key={alt.id}
                      type="button"
                      onClick={() => selecionarAlternativa(alt.letra)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        width: '100%',
                        padding: '1rem 1.25rem',
                        textAlign: 'left',
                        backgroundColor: selecionada ? '#faf5ff' : '#ffffff',
                        border: selecionada ? '2px solid #6b21a8' : '1px solid #cbd5e1',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!selecionada) {
                          e.currentTarget.style.borderColor = '#94a3b8';
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selecionada) {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: selecionada ? '#6b21a8' : '#f1f5f9',
                          color: selecionada ? '#ffffff' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {alt.letra}
                      </span>
                      <span
                        style={{
                          fontSize: '0.9375rem',
                          color: selecionada ? '#581c87' : '#1e293b',
                          fontWeight: selecionada ? 600 : 400,
                          lineHeight: 1.5
                        }}
                      >
                        {alt.texto}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Navegador Inferior */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                variant="outline"
                onClick={questaoAnterior}
                disabled={indiceAtual === 0}
                style={{ opacity: indiceAtual === 0 ? 0.5 : 1 }}
              >
                <ArrowLeft size={16} style={{ marginRight: '6px' }} />
                Anterior
              </Button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {questoes.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIndiceAtual(idx)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: idx === indiceAtual ? '2px solid #6b21a8' : '1px solid #e2e8f0',
                      backgroundColor: respostas[questoes[idx].id] ? '#f3e8ff' : '#ffffff',
                      color: idx === indiceAtual ? '#6b21a8' : respostas[questoes[idx].id] ? '#7e22ce' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {indiceAtual < totalQuestoes - 1 ? (
                <Button variant="primary" onClick={proximaQuestao}>
                  Próxima
                  <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={finalizarDiagnostico}
                  disabled={totalRespondidas === 0}
                  style={{ backgroundColor: '#15803d', borderColor: '#15803d' }}
                >
                  <FileCheck size={16} style={{ marginRight: '6px' }} />
                  Concluir Diagnóstico
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ETAPA 3: PROCESSANDO RESULTADO                            */}
        {/* ========================================================= */}
        {etapa === 'processando' && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '4px solid #e9d5ff',
                borderTopColor: '#6b21a8',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem auto'
              }}
            />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Processando seu Diagnóstico Pedagógico...
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
              Analisando suas respostas por tópicos e formulando recomendações personalizadas.
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* ETAPA 4: RESULTADO & GABARITO                             */}
        {/* ========================================================= */}
        {etapa === 'resultado' && resultado && (
          <div>
            {/* Cabeçalho do Resultado */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <Badge variant="purple" size="md" style={{ marginBottom: '1rem' }}>
                <Award size={14} style={{ marginRight: '6px' }} />
                DIAGNÓSTICO CONCLUÍDO COM SUCESSO
              </Badge>
              <h1
                style={{
                  fontSize: 'clamp(1.875rem, 3.5vw, 2.25rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '0.75rem'
                }}
              >
                Seu Nível Pedagógico: <span style={{ color: '#6b21a8' }}>{resultado.nivel}</span>
              </h1>
              <p style={{ fontSize: '1rem', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
                Você acertou <strong>{resultado.score} de {resultado.totalQuestoes} questões</strong> ({Math.round((resultado.score / resultado.totalQuestoes) * 100)}% de aproveitamento).
              </p>
            </div>

            {/* Placar Principal Bento Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}
            >
              {/* Card de Nível e Desempenho */}
              <Card
                variant="default"
                padding="lg"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Status Geral
                    </span>
                    <Badge
                      variant={resultado.nivel === 'Avançado' ? 'success' : resultado.nivel === 'Intermediário' ? 'purple' : 'warning'}
                      size="sm"
                    >
                      {resultado.nivel}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                    {resultado.score} / {resultado.totalQuestoes}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                    {resultado.score >= 8
                      ? 'Excelente domínio da norma culta e estruturas sintáticas complexas.'
                      : resultado.score >= 5
                      ? 'Boa base com pontos específicos de atenção em regência e concordância.'
                      : 'Oportunidade ideal para construir a base desde os conceitos fundamentais.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="outline" size="sm" onClick={() => setExibirGabarito(!exibirGabarito)} style={{ flex: 1 }}>
                    <HelpCircle size={16} style={{ marginRight: '6px' }} />
                    {exibirGabarito ? 'Ocultar Gabarito' : 'Ver Gabarito'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={reiniciar}>
                    <RotateCcw size={16} style={{ marginRight: '6px' }} />
                    Refazer
                  </Button>
                </div>
              </Card>

              {/* Card de Desempenho por Tópico */}
              <Card
                variant="default"
                padding="lg"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
                  Aproveitamento por Tópico:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(resultado.topicosDesempenho).map(([topico, dados]) => {
                    const pct = Math.round((dados.acertos / dados.total) * 100);
                    return (
                      <div key={topico}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{topico}</span>
                          <span style={{ color: '#64748b' }}>{dados.acertos}/{dados.total} ({pct}%)</span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '999px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              backgroundColor: pct >= 80 ? '#16a34a' : pct >= 50 ? '#6b21a8' : '#f59e0b',
                              borderRadius: '999px'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Recomendações Pedagógicas */}
            <Card
              variant="default"
              padding="lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                marginBottom: '2.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Recomendações da Professora Wilma para sua Trilha:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resultado.recomendacoes.map((rec, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#faf5ff',
                      borderRadius: '8px',
                      border: '1px solid #f3e8ff'
                    }}
                  >
                    <ChevronRight size={18} color="#6b21a8" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.9375rem', color: '#581c87', fontWeight: 500, lineHeight: 1.5 }}>
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Banner de Conversão se Visitante */}
            {!isAuthenticated && (
              <Card
                variant="default"
                padding="lg"
                style={{
                  backgroundColor: '#6b21a8',
                  color: '#ffffff',
                  borderRadius: '16px',
                  marginBottom: '2.5rem',
                  boxShadow: '0 10px 25px -5px rgba(107, 33, 168, 0.4)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#ffffff' }}>
                    Salve seu resultado e comece a estudar gratuitamente
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: '#f3e8ff', maxWidth: '580px', lineHeight: 1.6 }}>
                    Crie sua conta no Gramaticalizando para salvar sua trilha de estudos, acessar as aulas específicas para o seu nível e enviar suas redações para correção pedagógica.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <Link to="/registro">
                      <Button
                        variant="secondary"
                        size="lg"
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#6b21a8',
                          fontWeight: 700,
                          border: 'none'
                        }}
                      >
                        Criar Conta Gratuita
                        <ArrowRight size={18} style={{ marginLeft: '6px' }} />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="lg"
                        style={{
                          borderColor: '#d8b4fe',
                          color: '#ffffff',
                          backgroundColor: 'transparent'
                        }}
                      >
                        Já tenho conta
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Gabarito Comentado Detalhado */}
            {exibirGabarito && (
              <div style={{ marginTop: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '1.25rem'
                  }}
                >
                  Gabarito Detalhado e Comentado
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {resultado.gabaritoComentado.map((item, idx) => (
                    <Card
                      key={item.questaoId}
                      variant="default"
                      padding="lg"
                      style={{
                        backgroundColor: '#ffffff',
                        border: item.correta ? '1px solid #bbf7d0' : '1px solid #fecaca',
                        borderLeft: item.correta ? '4px solid #16a34a' : '4px solid #dc2626'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
                            Questão {idx + 1} • {item.topico}
                          </span>
                        </div>
                        <Badge variant={item.correta ? 'success' : 'danger'} size="sm">
                          {item.correta ? 'Acertou' : 'Errou'}
                        </Badge>
                      </div>

                      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.5 }}>
                        {item.enunciado}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          gap: '1.5rem',
                          fontSize: '0.875rem',
                          marginBottom: '1rem',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px'
                        }}
                      >
                        <div>
                          <span style={{ color: '#64748b' }}>Sua resposta: </span>
                          <strong style={{ color: item.correta ? '#16a34a' : '#dc2626' }}>
                            {item.suaResposta || 'Em branco'}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Gabarito oficial: </span>
                          <strong style={{ color: '#16a34a' }}>{item.respostaCorreta}</strong>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '0.875rem 1rem',
                          backgroundColor: '#faf5ff',
                          borderRadius: '6px',
                          border: '1px solid #f3e8ff'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                          Comentário Pedagógico (Prof. Wilma)
                        </span>
                        <p style={{ fontSize: '0.875rem', color: '#581c87', margin: 0, lineHeight: 1.5 }}>
                          {item.explicacao}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
