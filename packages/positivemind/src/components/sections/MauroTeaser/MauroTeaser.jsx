import { Link } from 'react-router-dom'
import mauroImg from '@/assets/images/mauro-gambini_perfil.jpeg'
import styles from './MauroTeaser.module.css'

const especialidades = [
  'Psicologia — FMU',
  'Life & Global Coaching',
  'Leader Coaching',
  'PNL — Programação Neurolinguística',
  'Psicanálise (Burnout)',
  'Terapia Cognitivo-Comportamental',
  'Hipnose Clínica',
  'Hipnose Esportiva',
]

export default function MauroTeaser() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.foto}>
            <img
              src={mauroImg}
              alt="Mauro Gambini — Fundador da Positive Mind"
              className={styles.img}
              loading="lazy"
            />
            <div className={styles.fotoOverlay} aria-hidden="true" />
          </div>

          <div className={styles.content}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
              O facilitador
            </span>

            <h2 className={`pm-h2 ${styles.nome}`}>Mauro Gambini</h2>

            <p className={styles.titulo}>
              Fundador da Positive Mind · Team Building · Leader Coaching · Palestrante Motivacional
            </p>

            <p className={`pm-body-lg ${styles.bio}`}>
              Paulistano da Zona Norte, filho de imigrantes, ex-jogador de futebol e compositor
              de músicas gravadas por artistas famosos. A trajetória de Mauro Gambini é marcada
              por coragem, resiliência e uma capacidade única de transformar adversidade em
              aprendizado — as mesmas habilidades que ele desenvolve nas equipes das maiores
              empresas do Brasil há mais de 13 anos.
            </p>

            <div className={styles.especialidades}>
              <p className={styles.especialidadesLabel}>8 especializações</p>
              <div className={styles.tags}>
                {especialidades.map(e => (
                  <span key={e} className={styles.tag}>{e}</span>
                ))}
              </div>
            </div>

            <Link to="/mauro-gambini" className={styles.cta}>
              Conhecer a história completa →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
