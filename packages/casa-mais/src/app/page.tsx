import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/data/db';
import {
  Wrench,
  Zap,
  Droplets,
  Key,
  Bug,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Phone,
  Calendar,
  Sparkles,
} from '@/components/Icons';
import FaqAccordion from '@/components/FaqAccordion';
import PlanComparisonTable from '@/components/PlanComparisonTable';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function HomePage() {
  const plans = db.getPlans();
  const services = db.getServices();

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid var(--border-card)',
        paddingTop: '40px',
        paddingBottom: '60px',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}>
            {/* Left Col: Text & CTAs */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '20px',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.12)',
              }}>
                <Sparkles size={16} />
                <span>SUA CASA CUIDADA O ANO INTEIRO</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                lineHeight: 1.15,
                marginBottom: '16px',
                fontWeight: 800,
              }}>
                Precisou, chamou. <br />
                <span style={{ color: 'var(--primary-green)' }}>A gente resolve.</span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '540px',
              }}>
                Tenha assistência residencial completa quando precisar. Uma mensalidade simples e atendimento ágil na palma da sua mão pelo celular.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
                <Link href="#planos" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  <span>Conhecer Planos</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/cliente/chamados/novo" className="btn btn-navy" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  <Wrench size={18} />
                  <span>Preciso de Assistência</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>Profissionais Checados</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>Atendimento em até 2h</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>Sem Custos Ocultos</span>
                </div>
              </div>
            </div>

            {/* Right Col: Official Visual Badge with Logo & Service Pills */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-card)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 20px 40px -15px rgba(11, 37, 69, 0.15)',
                width: '100%',
                maxWidth: '440px',
                textAlign: 'center',
              }}>
                <div style={{ position: 'relative', width: '100%', height: '240px', marginBottom: '16px' }}>
                  <Image
                    src="/logo.png"
                    alt="CASA+ Assistência e Manutenção Residencial"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>

                <div style={{
                  backgroundColor: 'var(--primary-navy)',
                  color: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  marginBottom: '16px',
                }}>
                  SUA CASA CUIDADA O ANO INTEIRO.
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Planos a partir de <strong>R$ 29,90/mês</strong> com chaveiro, eletricista, encanador e reparos inclusos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 7 SERVICE CATEGORIES (MATCHING LOGO EXACT ICONS) */}
      <section id="servicos" style={{ padding: '60px 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-card)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            <span className="badge badge-blue" style={{ marginBottom: '10px' }}>REDE COMPLETA DE ESPECIALISTAS</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Os serviços que você mais precisa</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Em vez de procurar profissionais avulsos e arriscar a segurança da sua família, conte com técnicos homologados e auditados pelo CASA+.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            justifyItems: 'center',
          }}>
            {services.map((srv) => (
              <div
                key={srv.id}
                className="card card-hover"
                style={{
                  padding: '20px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: '100%',
                  minHeight: '160px',
                }}
              >
                <div
                  className="service-pill-icon"
                  style={{ backgroundColor: srv.color, marginBottom: '12px' }}
                >
                  {srv.category === 'ENCANAMENTO' && <Droplets size={26} />}
                  {srv.category === 'ELETRICIDADE' && <Zap size={26} />}
                  {srv.category === 'CHAVEIRO' && <Key size={26} />}
                  {srv.category === 'PEQUENOS_REPAROS' && <Wrench size={26} />}
                  {srv.category === 'DEDETIZACAO' && <Bug size={26} />}
                  {srv.category === 'CAIXA_DAGUA' && <ShieldCheck size={26} />}
                  {srv.category === 'ELETRODOMESTICOS' && <Cpu size={26} />}
                </div>

                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary-navy)', marginBottom: '4px' }}>
                  {srv.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  Atendimento ágil
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PLANS SECTION (3 TIERS) */}
      <section id="planos" style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px auto' }}>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>ASSINATURA SIMPLES & RECORRENTE</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>Escolha o plano ideal para o seu lar</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Economize em manutenções e tenha a tranquilidade de ser atendido sem cobranças abusivas. Cancele quando quiser.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            alignItems: 'stretch',
          }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="card"
                style={{
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.popular ? '2px solid var(--primary-green)' : '1px solid var(--border-card)',
                  boxShadow: plan.popular ? '0 12px 30px -8px rgba(22, 163, 74, 0.25)' : 'var(--shadow-sm)',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Popular Pill */}
                {plan.highlightBadge && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: plan.popular ? 'var(--primary-green)' : 'var(--primary-navy)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    letterSpacing: '0.05em',
                  }}>
                    {plan.highlightBadge}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', minHeight: '40px' }}>
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)' }}>R$</span>
                    <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1 }}>
                      {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>/mês</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                    Cobrança mensal no cartão ou PIX
                  </span>
                </div>

                {/* Features List */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flexGrow: 1 }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <Link
                  href={`/checkout?plano=${plan.id}`}
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-navy'} btn-block`}
                  style={{ padding: '14px' }}
                >
                  <span>Contratar {plan.name.replace('Plano ', '')}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>

          <PlanComparisonTable />
        </div>
      </section>

      {/* 4. COMO FUNCIONA (4 PASSOS) */}
      <section id="como-funciona" style={{ padding: '70px 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-card)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px auto' }}>
            <span className="badge badge-amber" style={{ marginBottom: '10px' }}>FLUXO DESCOMPLICADO</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Como funciona o CASA+</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Desde a assinatura até a conclusão do reparo, tudo é registrado e acompanhado em tempo real.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '24px',
          }}>
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                margin: '0 auto 16px auto',
              }}>
                1
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Assine o Plano</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Escolha o Essencial, Família ou Premium e tenha franquias de chamados liberadas imediatamente.
              </p>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                margin: '0 auto 16px auto',
              }}>
                2
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Abra o Chamado</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Descreva o problema pelo celular, envie fotos ou vídeos e confirme seu endereço residencial.
              </p>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                margin: '0 auto 16px auto',
              }}>
                3
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Técnico a Caminho</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                O sistema localiza o prestador qualificado mais próximo e você acompanha o status pelo WhatsApp e painel.
              </p>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#ede9fe',
                color: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                margin: '0 auto 16px auto',
              }}>
                4
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Serviço & Avaliação</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                O profissional realiza o serviço com comprovação fotográfica (antes/depois) e você avalia a experiência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROVA SOCIAL & SEGURANÇA */}
      <section style={{ padding: '60px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{
            background: 'var(--primary-navy)',
            borderRadius: '24px',
            padding: '48px 32px',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'center',
          }}>
            <div>
              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SEGURANÇA & RIGOR
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '2rem', marginTop: '8px', marginBottom: '14px' }}>
                Quem entra na sua casa foi rigorosamente avaliado.
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
                Nossa rede parceira passa por checagem cadastral, teste de habilitação técnica e monitoramento contínuo de avaliações dos clientes.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#22c55e', lineHeight: 1, marginBottom: '6px' }}>
                  4.9 / 5
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', marginBottom: '6px' }}>
                  <Star size={16} filled />
                  <Star size={16} filled />
                  <Star size={16} filled />
                  <Star size={16} filled />
                  <Star size={16} filled />
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Média de avaliação</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '6px' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '22px' }}>
                  Profissionais com antecedentes checados
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (DÚVIDAS FREQUENTES) */}
      <section id="faq" style={{ padding: '80px 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-card)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px auto' }}>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>DÚVIDAS FREQUENTES</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>Perguntas Frequentes</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Tire todas as suas dúvidas sobre coberturas, prazos de atendimento e regras da assinatura.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* 7. CALL TO ACTION FINAL */}
      <section style={{ padding: '70px 0', textAlign: 'center', backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '2.3rem', marginBottom: '14px' }}>
            Pronto para ter sua casa cuidada o ano inteiro?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '30px' }}>
            Comece hoje mesmo com o Plano Essencial ou Família e nunca mais passe sufoco com imprevistos domésticos.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <Link href="#planos" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              <span>Assinar Agora</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp contact launcher */}
      <FloatingWhatsApp />
    </div>
  );
}
