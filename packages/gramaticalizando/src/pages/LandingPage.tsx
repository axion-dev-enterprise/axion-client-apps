import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  ChevronRight,
  HelpCircle,
  Clock,
  Layers,
  Award
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
        'Acesso na Web e Mobile'
      ],
      whatsappUrl: 'https://wa.me/5521992013060?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20o%20Plano%20Iniciante%20do%20Gramaticalizando%20(R%24%2029%2C00%2Fm%C3%AAs).'
    },
    {
      id: 'medio',
      name: 'Médio',
      price: '47,90',
      period: '/mês',
      description: 'Nosso plano mais procurado: conteúdo completo + 4 correções de redação por mês.',
      badge: 'MAIS ESCOLHIDO',
      features: [
        'Tudo do Plano Iniciante',
        '4 Correções Detalhadas de Redação/mês',
        'Simulados Inéditos com Ranking',
        'Aulas Exclusivas de Análise Sintática',
        'Suporte a dúvidas via WhatsApp Oficial'
      ],
      whatsappUrl: 'https://wa.me/5521992013060?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20o%20Plano%20M%C3%A9dio%20do%20Gramaticalizando%20(R%24%2047%2C90%2Fm%C3%AAs).'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '120,00',
      period: '/mês',
      description: 'Mentoria intensiva completa para quem busca nota máxima em concursos de alto nível.',
      badge: 'MENTORIA VIP',
      features: [
        'Tudo do Plano Médio',
        'Redações Ilimitadas com Devolutiva em 48h',
        'Mentoria Individual com Professor Mensal',
        'Plantão de Dúvidas Direto com a Coordenação',
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
      answer: 'Você envia o seu texto digitado diretamente pela nossa plataforma. Nossos professores corrigem detalhadamente cada critério (Gramática, Coesão, Coerência, Argumentação e Proposta de Intervenção) com nota e comentários personalizados.'
    },
    {
      question: 'Posso acessar a plataforma pelo celular ou tablet?',
      answer: 'Sim! Toda a plataforma foi construída com tecnologia moderna responsiva, funcionando perfeitamente em computadores, notebooks, tablets e smartphones.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          paddingTop: '5rem',
          paddingBottom: '4rem',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, rgba(9, 9, 11, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Badge variant="purple" size="md">
              <Sparkles size={14} />
              Metodologia de Aprendizagem Guiada 2026
            </Badge>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 800,
              maxWidth: '900px',
              margin: '0 auto 1.5rem',
              letterSpacing: '-0.03em',
              lineHeight: 1.15
            }}
          >
            Aprenda Língua Portuguesa com Clareza, Método e{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Alto Desempenho
            </span>
            .
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6
            }}
          >
            A plataforma definitiva para vestibulares, concursos e concurseiros que não podem perder pontos na prova de Português e Redação.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3rem'
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
              variant="secondary"
              size="lg"
              onClick={() => navigate('/registro')}
            >
              Criar Conta Gratuita
            </Button>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span>7 Módulos Canônicos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span>41 Aulas Estruturadas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span>Atendimento Direto WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos do Curso */}
      <section id="modulos" className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="purple" size="sm" style={{ marginBottom: '0.75rem' }}>
            GRADE PROGRAMÁTICA CANÔNICA
          </Badge>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
            Tudo o Que Você Precisa Para Gabaritar Português
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            Conteúdo organizado sequencialmente, da fonética básica à sintaxe e estilística avançada.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {CANONICAL_MODULES.map((mod, index) => (
            <Card
              key={mod.id}
              variant="interactive"
              padding="lg"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(147, 51, 234, 0.15)',
                      color: 'var(--accent-hover)',
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

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>
                  {mod.titulo}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {mod.descricao}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  {mod.aulas.slice(0, 3).map((aula) => (
                    <div key={aula.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{aula.titulo}</span>
                    </div>
                  ))}
                  {mod.aulas.length > 3 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-text)', marginTop: '0.25rem' }}>
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
      <section id="planos" className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="purple" size="sm" style={{ marginBottom: '0.75rem' }}>
            VALORES & MATRÍCULA
          </Badge>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
            Planos Acessíveis e Transparentes
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            Escolha seu plano e converse diretamente com o nosso atendimento no WhatsApp para liberação imediata.
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
                border: plan.badge ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                boxShadow: plan.badge ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
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

                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '40px' }}>
                  {plan.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>R$</span>
                  <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.5rem' }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={16} color="var(--success)" style={{ marginTop: '3px', flexShrink: 0 }} />
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
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container" style={{ maxWidth: '800px', paddingTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
            Perguntas Frequentes
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Tire todas as suas dúvidas sobre a plataforma e o método Gramaticalizando.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <Card
                key={index}
                padding="md"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveFaq(isOpen ? null : index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                    {faq.question}
                  </h4>
                  <span style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)' }}>
                    <ChevronRight size={18} />
                  </span>
                </div>
                {isOpen && (
                  <p style={{ marginTop: '0.875rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem' }}>
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
