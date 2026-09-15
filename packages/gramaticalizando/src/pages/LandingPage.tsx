import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  ChevronRight,
  Clock,
  GraduationCap,
  ShieldCheck,
  FileCheck2,
  PenTool,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CANONICAL_MODULES } from '../data/canonical-modules';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      id: 'iniciante',
      name: 'Iniciante',
      price: '29,00',
      period: '/mês',
      description: 'Ideal para quem busca reforço básico e preparação pontual para concursos.',
      badge: null,
      features: [
        'Acesso aos 7 Módulos de Gramática',
        'Banco com 500+ Questões Gabaritadas',
        'Material Teórico em PDF para Download',
        'Cronograma Básico de Estudos',
        'Acesso Imediato na Web e Mobile'
      ],
      whatsappUrl: 'https://wa.me/5521992013060?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20o%20Plano%20Iniciante%20do%20Gramaticalizando%20(R%24%2029%2C00%2Fm%C3%AAs).'
    },
    {
      id: 'medio',
      name: 'Médio',
      price: '47,90',
      period: '/mês',
      description: 'O mais escolhido: curso completo com 4 correções detalhadas de redação por mês.',
      badge: 'MAIS ESCOLHIDO',
      features: [
        'Tudo do Plano Iniciante',
        '4 Correções Detalhadas de Redação/mês',
        'Simulados com Gabarito Comentado',
        'Aulas Exclusivas de Análise Sintática',
        'Plantão de Dúvidas Direto no WhatsApp'
      ],
      whatsappUrl: 'https://wa.me/5521992013060?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20o%20Plano%20M%C3%A9dio%20do%20Gramaticalizando%20(R%24%2047%2C90%2Fm%C3%AAs).'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '120,00',
      period: '/mês',
      description: 'Mentoria intensiva para quem não pode perder pontos na prova de Português e Redação.',
      badge: 'MENTORIA VIP',
      features: [
        'Tudo do Plano Médio',
        'Redações Ilimitadas com Devolutiva em 48h',
        'Mentoria Individual com a Professora',
        'Análise de Perfil e Dificuldades Específicas',
        'Garantia de Atualizações Contínuas'
      ],
      whatsappUrl: 'https://wa.me/5521992013060?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20o%20Plano%20Pro%20do%20Gramaticalizando%20(R%24%20120%2C00%2Fm%C3%AAs).'
    }
  ];

  const faqs = [
    {
      question: 'Como funciona a ativação da minha matrícula via WhatsApp?',
      answer: 'Ao clicar no plano desejado, você será direcionado para o nosso atendimento oficial no WhatsApp (21 99201-3060). Nossa equipe gera sua chave de acesso imediata e vincula o seu e-mail em menos de 5 minutos.'
    },
    {
      question: 'O conteúdo é atualizado conforme o Novo Acordo Ortográfico?',
      answer: 'Sim, 100% atualizado. Cobrimos todas as mudanças do Acordo Ortográfico vigente, incluindo regras de hífen, acentuação de ditongos abertos em paroxítonas e queda do trema.'
    },
    {
      question: 'Como são feitas as correções de redação?',
      answer: 'Você envia o seu texto digitado diretamente pela nossa plataforma. Nossos professores corrigem detalhadamente cada critério (Gramática, Coesão, Coerência, Argumentação e Proposta de Intervenção) com nota e comentários pedagógicos.'
    },
    {
      question: 'Posso acessar a plataforma pelo celular ou tablet?',
      answer: 'Sim! Toda a plataforma foi construída com tecnologia moderna responsiva, funcionando perfeitamente em computadores, notebooks, tablets e smartphones.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', backgroundColor: '#ffffff' }}>
      {/* Hero Section — White & Roxo com Foto da Professora */}
      <section
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '4rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: '3.5rem'
            }}
          >
            {/* Coluna da Esquerda: Textos e CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '580px' }}>
              <div>
                <Badge variant="purple" size="md">
                  CURSO COMPLETO DE LÍNGUA PORTUGUESA & REDAÇÃO
                </Badge>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em'
                }}
              >
                Aprenda Língua Portuguesa com clareza, método e{' '}
                <span style={{ color: 'var(--accent)' }}>foco na aprovação</span>.
              </h1>

              <p
                style={{
                  fontSize: '1.125rem',
                  color: '#475569',
                  lineHeight: 1.6
                }}
              >
                Aulas didáticas direto ao ponto, teoria estruturada da fonética à sintaxe avançada, simulados com questões comentadas e correção personalizada das suas redações.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '0.5rem'
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                  onClick={() => {
                    const el = document.getElementById('planos');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Conhecer Planos & Matrícula
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/registro')}
                >
                  Criar Conta Gratuita
                </Button>
              </div>

              {/* Destaques de Confiança */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '1.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontSize: '0.875rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 600, color: '#334155' }}>7 Módulos Oficiais</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 600, color: '#334155' }}>41 Aulas Estruturadas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 600, color: '#334155' }}>Atendimento no WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Imagem Real da Professora */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '440px',
                  borderRadius: '24px',
                  backgroundColor: '#f5f3ff', // Soft purple background container
                  border: '2px solid #ede9fe',
                  padding: '1.5rem 1.5rem 0 1.5rem',
                  boxShadow: '0 20px 40px -15px rgba(107, 33, 168, 0.15)',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}
              >
                <img
                  src="/img/professora.png"
                  alt="Professora do Gramaticalizando"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '460px',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />

                {/* Badge Flutuante Pedagógico */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    left: '1.25rem',
                    right: '1.25rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      flexShrink: 0
                    }}
                  >
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                      Acompanhamento Docente
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Mentoria e correções individuais em cada etapa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Diagnóstico Interativo de Nivelamento */}
      <section
        id="diagnostico"
        style={{
          padding: '5rem 0',
          backgroundColor: '#faf5ff',
          borderTop: '1px solid #f3e8ff',
          borderBottom: '1px solid #f3e8ff',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            {/* Coluna de Texto e Benefícios */}
            <div>
              <Badge variant="purple" size="sm" style={{ marginBottom: '1rem' }}>
                <Sparkles size={14} style={{ marginRight: '6px' }} />
                TESTE DE NIVELAMENTO GRATUITO
              </Badge>
              <h2
                style={{
                  fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.025em',
                  marginBottom: '1rem',
                  lineHeight: 1.2
                }}
              >
                Descubra seu real nível em Língua Portuguesa em 5 minutos
              </h2>
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem'
                }}
              >
                Faça nosso diagnóstico pedagógico gratuito com 10 questões comentadas pela <strong>Professora Wilma</strong>. Identifique exatamente onde você perde pontos (crase, concordância, regência ou pontuação) e receba sua trilha de estudos personalizada.
              </p>

              {/* Lista de Vantagens */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b21a8'
                    }}
                  >
                    <CheckCircle size={15} />
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b' }}>
                    10 questões selecionadas no padrão das bancas mais concorridas
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b21a8'
                    }}
                  >
                    <CheckCircle size={15} />
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b' }}>
                    Gabarito 100% comentado alternativa por alternativa
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b21a8'
                    }}
                  >
                    <CheckCircle size={15} />
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b' }}>
                    Classificação imediata em Iniciante, Intermediário ou Avançado
                  </span>
                </div>
              </div>

              {/* Botão de Ação */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/diagnostico')}
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(107, 33, 168, 0.3)',
                    padding: '0.875rem 2rem'
                  }}
                >
                  Iniciar Teste Diagnóstico
                  <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </Button>
                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Sem cadastro prévio • 100% gratuito
                </span>
              </div>
            </div>

            {/* Coluna Card Preview Interativo */}
            <div>
              <Card
                variant="default"
                padding="lg"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 35px -10px rgba(107, 33, 168, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  borderRadius: '16px',
                  position: 'relative'
                }}
              >
                {/* Header do Card Preview */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f3e8ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b21a8'
                      }}
                    >
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase' }}>
                        Questão Exemplo
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        Crase e Regência
                      </div>
                    </div>
                  </div>
                  <Badge variant="purple" size="sm">
                    Simulado Real
                  </Badge>
                </div>

                {/* Enunciado Preview */}
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  "O sinal indicativo de crase está empregado CORRETAMENTE de acordo com a norma-padrão em:"
                </p>

                {/* Alternativas Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#94a3b8' }}>A</span>
                    <span>Ele começou à redigir o documento com rapidez.</span>
                  </div>

                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#faf5ff',
                      border: '2px solid #6b21a8',
                      fontSize: '0.875rem',
                      color: '#581c87',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#6b21a8', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>B</span>
                      <span>Encaminhamos a solicitação à diretoria executiva.</span>
                    </div>
                    <CheckCircle size={16} color="#6b21a8" />
                  </div>

                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#94a3b8' }}>C</span>
                    <span>Referiu-se à todas as regras do edital anterior.</span>
                  </div>
                </div>

                {/* Footer do Card Preview com CTA */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    padding: '0.875rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Descubra seu aproveitamento completo:
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/diagnostico')}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#6b21a8',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Fazer Teste <ChevronRight size={14} />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos do Curso */}
      <section id="modulos" className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="purple" size="sm" style={{ marginBottom: '0.75rem' }}>
            CONTEÚDO PROGRAMÁTICO
          </Badge>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: '#0f172a', marginBottom: '0.75rem' }}>
            Grade Curricular Completa
          </h2>
          <p style={{ color: '#475569', maxWidth: '640px', margin: '0 auto' }}>
            Domine desde a base da fonética até os tópicos mais exigidos em concursos: crase, concordância e regência.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {CANONICAL_MODULES.map((mod) => (
            <Card
              key={mod.id}
              variant="interactive"
              padding="lg"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f3e8ff',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <Badge variant="neutral" size="sm">
                    {mod.aulas.length} Aulas
                  </Badge>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                  {mod.titulo}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {mod.descricao}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  {mod.aulas.slice(0, 3).map((aula) => (
                    <div key={aula.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{aula.titulo}</span>
                    </div>
                  ))}
                  {mod.aulas.length > 3 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.25rem' }}>
                      + {mod.aulas.length - 3} aulas adicionais no módulo
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Planos e Preços com Redirecionamento WhatsApp */}
      <section id="planos" style={{ backgroundColor: '#f8fafc', padding: '5rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="purple" size="sm" style={{ marginBottom: '0.75rem' }}>
              INVESTIMENTO & MATRÍCULA
            </Badge>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: '#0f172a', marginBottom: '0.75rem' }}>
              Planos Transparentes Para Cada Etapa
            </h2>
            <p style={{ color: '#475569', maxWidth: '640px', margin: '0 auto' }}>
              Escolha o plano ideal e converse diretamente com a nossa equipe no WhatsApp para ativação instantânea.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'stretch'
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                variant="elevated"
                padding="lg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  border: plan.badge ? '2px solid var(--accent)' : '1px solid #e2e8f0',
                  boxShadow: plan.badge ? '0 12px 30px -8px rgba(107, 33, 168, 0.2)' : 'var(--shadow-md)'
                }}
              >
                <div>
                  {plan.badge && (
                    <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)' }}>
                      <Badge variant="purple" size="sm">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', minHeight: '40px' }}>
                    {plan.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '1.25rem', color: '#64748b' }}>R$</span>
                    <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: '0.9375rem', color: '#64748b' }}>{plan.period}</span>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.5rem' }}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: '#334155' }}>
                        <CheckCircle size={16} color="var(--accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={plan.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  <Button
                    variant="whatsapp"
                    size="lg"
                    icon={<MessageCircle size={18} />}
                    style={{ width: '100%' }}
                  >
                    Assinar no WhatsApp
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.75rem' }}>
            Dúvidas Frequentes
          </h2>
          <p style={{ color: '#475569' }}>
            Tudo o que você precisa saber sobre o curso e as formas de acesso.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <Card
                key={index}
                padding="md"
                style={{ cursor: 'pointer', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                onClick={() => setActiveFaq(isOpen ? null : index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                    {faq.question}
                  </h4>
                  <span style={{ color: '#64748b', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)' }}>
                    <ChevronRight size={18} />
                  </span>
                </div>
                {isOpen && (
                  <p style={{ marginTop: '0.875rem', color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, borderTop: '1px solid #f1f5f9', paddingTop: '0.875rem' }}>
                    {faq.answer}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
