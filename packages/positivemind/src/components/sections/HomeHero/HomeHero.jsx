import mauroImg from '@/assets/images/mauro-gambini_perfil.jpeg'
import { whatsappLink } from '@/data/empresa'
import styles from './HomeHero.module.css'

const msgGargalos = 'Olá, Mauro! Gostaria de saber mais informações sobre o Treinamento de Liderança. Tenho interesse em desenvolver minhas competências de liderança e conhecer melhor a metodologia aplicada.'

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Positive Mind · Liderança & Liderado</span>
          <h1 className={styles.headline}>
            Sua empresa tem 100 funcionários, mas só <span className={styles.accent}>1 CEO pra apagar incêndio?</span>
          </h1>
          <p className={styles.sub}>
            O problema não é falta de gente. É falta de liderança eficaz.
          </p>
          <div className={styles.descriptionBlock}>
            <p>
              Se sua empresa tem entre 50 e 200 funcionários, você já passou por isso: você promoveu seu melhor técnico e ele virou o pior líder do time. Nada anda se você não estiver em cima cobrando micro. O turnover na gerência tá caro e desmotiva o resto do time.
            </p>
            <p className={styles.highlightText}>
              Isso acontece porque nesse tamanho a empresa cresce, mas a liderança não.
            </p>
          </div>
          <div className={styles.ctas}>
            <a
              href={whatsappLink(msgGargalos)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Quero entender meus gargalos
            </a>
            <a
              href={whatsappLink(msgGargalos)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              Quero um diagnóstico grátis
            </a>
          </div>
          <p className={styles.metaText}>
            * Aplicado em +47 empresas de 50-200 pessoas na Grande SP nos últimos 12 meses.
          </p>
        </div>
        <div className={styles.imageWrapper}>
          <img
            src={mauroImg}
            alt="Mauro Gambini — Fundador da Positive Mind"
            className={styles.image}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
