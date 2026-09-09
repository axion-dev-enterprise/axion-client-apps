'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck } from '@/components/Icons';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Como funciona a assinatura do Casa+?',
    answer: 'Você escolhe o plano que melhor atende à sua residência (Essencial, Família ou Premium), paga uma mensalidade fixa no cartão ou PIX automático, e passa a ter assistência técnica e preventiva garantida na palma da mão, sem custos extras de mão de obra nos limites da sua cobertura.',
  },
  {
    question: 'Qual é o prazo de chegada para chamados de emergência?',
    answer: 'Em imprevistos graves (cano estourado, chave travada na porta principal ou curto geral no quadro elétrico), o sistema despacha o técnico credenciado mais próximo com SLA de atendimento prioritário em até 2 horas.',
  },
  {
    question: 'Existe período de carência para o primeiro chamado?',
    answer: 'Para serviços emergenciais corretivos (chaveiro, eletricidade, encanador e reparos rápidos), o atendimento fica disponível imediatamente após a confirmação do pagamento. Benefícios preventivos anuais (como dedetização completa e limpeza de caixa d’água) contam com carência de 30 dias.',
  },
  {
    question: 'Quem são os profissionais que entrarão na minha casa?',
    answer: 'Nossa rede parceira passa por um rigoroso processo de triagem: verificação de antecedentes criminais, validação de referências profissionais e testes de aptidão técnica. Além disso, cada prestador mantém índice de aprovação monitorado com nota mínima de 4.8.',
  },
  {
    question: 'Posso cancelar a assinatura a qualquer momento?',
    answer: 'Sim, você tem total liberdade. Não exigimos fidelidade e você pode solicitar o cancelamento ou alteração de plano a qualquer momento pelo painel do assinante ou diretamente com nosso suporte via WhatsApp.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="card"
              style={{
                borderRadius: '16px',
                border: isOpen ? '1px solid var(--primary-green)' : '1px solid var(--border-card)',
                boxShadow: isOpen ? '0 4px 14px rgba(22, 163, 74, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)',
                overflow: 'hidden',
                transition: 'all 200ms ease',
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  backgroundColor: isOpen ? '#f0fdf4' : '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 150ms ease',
                }}
              >
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: isOpen ? '#15803d' : 'var(--primary-navy)',
                }}>
                  {faq.question}
                </span>
                <div style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease',
                  color: isOpen ? 'var(--primary-green)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <ChevronDown size={20} />
                </div>
              </button>

              {isOpen && (
                <div style={{
                  padding: '16px 24px 24px 24px',
                  backgroundColor: '#ffffff',
                  borderTop: '1px solid rgba(22, 163, 74, 0.1)',
                }}>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
