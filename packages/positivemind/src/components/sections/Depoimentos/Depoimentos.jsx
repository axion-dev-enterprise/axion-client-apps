import styles from './Depoimentos.module.css'

/*
 * Para adicionar depoimento: inserir objeto no array abaixo.
 * Formato: { id, nome, empresa, cargo, video: '/videos/arquivo.mp4' }
 */
const depoimentos = []

export default function Depoimentos() {
  if (depoimentos.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Quem viveu, aprova</span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            O que nossos <span className={styles.orange}>clientes dizem</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {depoimentos.map(({ id, nome, empresa, cargo, video }) => (
            <div key={id} className={styles.card}>
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                controls
                className={styles.video}
                aria-label={`Depoimento de ${nome} — ${empresa}`}
              />
              <div className={styles.info}>
                <strong className={styles.nome}>{nome}</strong>
                <span className={styles.cargo}>{cargo}</span>
                <span className={styles.empresa}>{empresa}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
