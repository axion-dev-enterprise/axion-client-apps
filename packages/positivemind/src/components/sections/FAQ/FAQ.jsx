import { useState } from 'react'
import styles from './FAQ.module.css'

const faqItems = [
  {
    pergunta: 'É realmente GRATUITO?',
    resposta: 'Sim, 100%. O diagnóstico presencial de 90 minutos é a minha forma de mostrar na prática como eu trabalho. Se fizer sentido para o seu momento atual, eu posso apresentar o programa de treinamento completo ao final. Caso contrário, você fica com o relatório em PDF e o mapeamento sem qualquer compromisso comercial.'
  },
  {
    pergunta: 'Atende fora de SP Capital?',
    resposta: 'Sim. Atendemos toda a Grande São Paulo de forma presencial: região do ABC, Alphaville, Barueri, Guarulhos, Osasco e municípios vizinhos. Para atendimentos em outras capitais ou regiões do Brasil, realizamos o diagnóstico de forma remota via videoconferência ou estruturamos pacotes específicos.'
  },
  {
    pergunta: 'Quanto tempo leva o diagnóstico?',
    resposta: 'Leva exatamente 90 minutos na sede da sua empresa. Agendamos no dia e horário que menos atrapalharem a operação e rotina da sua gestão, necessitando apenas da sua presença e de até 2 líderes-chave da equipe por alguns minutos.'
  },
  {
    pergunta: 'Como funciona a confidencialidade?',
    resposta: 'Tratamos todas as informações coletadas durante a entrevista e mapeamento com total sigilo corporativo. Se desejar, assinamos um termo de confidencialidade (NDA) antes da reunião de diagnóstico.'
  }
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggle = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx)
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <span className={styles.eyebrow}>Dúvidas Frequentes</span>
        <h2 className={styles.title}>Perguntas Respondidas</h2>

        <div className={styles.faqList}>
          {faqItems.map(({ pergunta, resposta }, idx) => {
            const isOpen = activeIndex === idx
            return (
              <div key={idx} className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ''}`}>
                <button
                  className={styles.questionBtn}
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.questionText}>{pergunta}</span>
                  <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                </button>
                <div className={`${styles.answerWrap} ${isOpen ? styles.answerWrapOpen : ''}`}>
                  <p className={styles.answerText}>{resposta}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
