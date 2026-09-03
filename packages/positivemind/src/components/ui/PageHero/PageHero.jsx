import styles from './PageHero.module.css'

export default function PageHero({ eyebrow, titulo, highlight, sub, children }) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        {eyebrow && (
          <span className={`pm-label ${styles.eyebrow}`}>{eyebrow}</span>
        )}
        <h1 className={`pm-h1 ${styles.titulo}`}>
          {titulo}{' '}
          {highlight && <span className={styles.highlight}>{highlight}</span>}
        </h1>
        {sub && <p className={`pm-body-lg ${styles.sub}`}>{sub}</p>}
        {children}
      </div>
    </section>
  )
}
