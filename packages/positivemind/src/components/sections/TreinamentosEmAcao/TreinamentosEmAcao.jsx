import { fotos } from '@/data/fotos'
import styles from './TreinamentosEmAcao.module.css'

const fotosEmbaralhadas = [...fotos].sort(() => Math.random() - 0.5)
const fotosDestaque = fotosEmbaralhadas.slice(0, 12)

export default function TreinamentosEmAcao() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Momentos reais</span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            Treinamentos <span className={styles.orange}>em ação</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {fotosDestaque.map((src, i) => (
            <div key={src} className={styles.item}>
              <img
                src={src}
                alt={`Treinamento Positive Mind — foto ${i + 1}`}
                loading="lazy"
                className={styles.img}
              />
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <a href="/galeria" className={styles.ctaBtn}>
            Ver todas as fotos →
          </a>
        </div>
      </div>
    </section>
  )
}
