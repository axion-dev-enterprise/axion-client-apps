import { useEffect } from 'react'
import SEO from '@/components/common/SEO/SEO'
import PageHero from '@/components/ui/PageHero/PageHero'
import CTAFinal from '@/components/sections/CTAFinal/CTAFinal'
import { empresa, whatsappLink } from '@/data/empresa'
import { trackMeta, MetaEvent } from '@/lib/metaPixel'
import styles from './Hipnoterapia.module.css'

const msgHipnose = 'Olá! Gostaria de saber mais sobre as sessões de Hipnose Clínica / Esportiva com o Mauro Gambini.'

const areasFoco = [
  {
    titulo: 'Controle de Ansiedade & Estresse',
    desc: 'Redução de sintomas físicos e mentais da ansiedade, proporcionando clareza mental e controle emocional imediato.'
  },
  {
    titulo: 'Tratamento de Burnout',
    desc: 'Recuperação do esgotamento profissional extremo, reorganizando o foco, energia e estabelecendo limites mentais saudáveis.'
  },
  {
    titulo: 'Performance Esportiva',
    desc: 'Eliminação de bloqueios de desempenho, aumento do foco sob pressão e ativação do estado de fluxo (flow state) para competidores.'
  },
  {
    titulo: 'Fobias & Bloqueios Emocionais',
    desc: 'Resolução rápida de fobias específicas (como medo de falar em público) e traumas que travam o desenvolvimento pessoal.'
  }
]

export default function Hipnoterapia() {
  useEffect(() => {
    trackMeta(MetaEvent.VIEW_CONTENT, { content_name: 'Página Hipnoterapia', content_type: 'service' })
  }, [])

  return (
    <>
      <SEO
        titulo="Hipnose Clínica & Esportiva"
        descricao="Desenvolvimento pessoal e alta performance mental. Controle de ansiedade, tratamento de burnout, eliminação de bloqueios emocionais e foco esportivo."
        canonical="/hipnoterapia"
      />

      <PageHero
        eyebrow="Atendimento Individual"
        titulo="Hipnose Clínica &"
        highlight="Esportiva"
        sub="Treinamento mental e reprogramação comportamental para executivos, atletas e profissionais de alta performance."
      />

      <section className={styles.section}>
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.contentCol}>
              <h2 className={styles.subTitle}>Como a Hipnoterapia Clínica pode te ajudar</h2>
              <p className={styles.desc}>
                A hipnoterapia é uma ferramenta clínica cientificamente comprovada, que atua diretamente no subconsciente para reconfigurar padrões de comportamento e reações emocionais indesejadas. Não há misticismo: é neurociência aplicada ao desenvolvimento de hábitos e controle de estados mentais.
              </p>

              <div className={styles.gridFoco}>
                {areasFoco.map(({ titulo, desc }, i) => (
                  <div key={i} className={styles.cardFoco}>
                    <h3 className={styles.cardTitle}>{titulo}</h3>
                    <p className={styles.cardDesc}>{desc}</p>
                  </div>
                ))}
              </div>

              <div className={styles.caseBox}>
                <h3 className={styles.caseTitle}>Destaque: Hipnose Esportiva</h3>
                <p className={styles.caseDesc}>
                  <strong>Case Suelle (Seleção Brasileira de Vôlei):</strong> O trabalho focado na eliminação de bloqueios mentais ocultos e no ganho de foco absoluto ajudou a jogadora a liderar suas decisões profissionais e alcançar seu mais alto rendimento nas quadras olímpicas.
                </p>
              </div>
            </div>

            <aside className={styles.ctaCol}>
              <div className={styles.ctaCard}>
                <h3 className={styles.ctaTitle}>Agende sua Sessão</h3>
                <p className={styles.ctaDesc}>
                  Os atendimentos individuais de Hipnose Clínica e Esportiva são realizados pelo próprio Mauro Gambini de forma presencial em São Paulo ou online.
                </p>
                <a
                  href={whatsappLink(msgHipnose)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnPrimary}
                >
                  Agendar pelo WhatsApp
                </a>
                <span className={styles.telefone}>{empresa.whatsappFormatado}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTAFinal />
    </>
  )
}
