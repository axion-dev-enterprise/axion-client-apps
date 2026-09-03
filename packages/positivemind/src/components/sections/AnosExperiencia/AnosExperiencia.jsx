import styles from './AnosExperiencia.module.css'

const stats = [
  { valor: '13+',   label: 'Anos de experiência' },
  { valor: '+170',  label: 'Empresas atendidas' },
  { valor: '4.000+',label: 'Profissionais treinados' },
]

export default function AnosExperiencia() {
  return (
    <section className={styles.section}>
      <div className={styles.overlay} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.inner}>
          <div className={styles.texto}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
              Experiência comprovada
            </span>
            <h2 className={`pm-h2 ${styles.titulo}`}>
              Desde 2013 <span className={styles.orange}>transformando equipes</span> em todo o Brasil
            </h2>
            <p className={`pm-body-lg ${styles.sub}`}>
              Mais de 13 anos de experiência com empresas dos mais variados setores —
              mais de 170 clientes, 4.000 profissionais treinados e uma metodologia que entrega
              resultado real dentro e fora da sala de reunião.
            </p>
          </div>

          <div className={styles.stats}>
            {stats.map(({ valor, label }) => (
              <div key={label} className={styles.statItem}>
                <span className={styles.statValor}>{valor}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
