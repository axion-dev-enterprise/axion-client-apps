import { clientes } from '@/data/clientes'
import styles from './Clientes.module.css'

const metade = Math.ceil(clientes.length / 2)
const fileira1 = clientes.slice(0, metade)
const fileira2 = clientes.slice(metade)

function Fileira({ items, reverse }) {
  const duplicado = [...items, ...items]
  return (
    <div className={styles.track} aria-hidden="true">
      <div className={`${styles.list} ${reverse ? styles.listReverse : ''}`}>
        {duplicado.map(({ nome, logo }, i) => (
          <span key={`${nome}-${i}`} className={styles.item}>
            {logo
              ? <img src={logo} alt={nome} className={styles.itemLogo} loading="lazy" decoding="async" />
              : <span className={styles.itemTexto}>{nome}</span>
            }
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Clientes() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className="container">
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
            Quem confia na Positive Mind
          </span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            Algumas das empresas que a{' '}
            <span style={{ color: 'var(--pm-orange)' }}>Positive Mind transformou</span>
          </h2>
        </div>
      </div>

      <div className={styles.carrossel} role="img" aria-label="Logos das empresas clientes: Yamaha, Google, Danone, Globo, Mastercard e outras 35 empresas">
        <Fileira items={fileira1} reverse={false} />
        <Fileira items={fileira2} reverse />
      </div>

      <div className="container">
        <p className={styles.nota}>
          Yamaha · Google · Asics · Danone · Globo · Mastercard · Porto Seguro · Scania · Schneider Electric · e mais 30 empresas
        </p>
      </div>
    </section>
  )
}
