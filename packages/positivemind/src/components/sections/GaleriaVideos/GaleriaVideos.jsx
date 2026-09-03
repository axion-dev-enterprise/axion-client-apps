import { Link } from 'react-router-dom'
import VideoEmbed from '@/components/ui/VideoEmbed/VideoEmbed'
import { videos } from '@/data/videos'
import styles from './GaleriaVideos.module.css'

const videosDestaque = videos.filter(v =>
  ['kBM7jKQYHEA', '7H-VrSPYulw', 'ydwPhFdOgbo', 's7rlHWS2YBY'].includes(v.id)
)

export default function GaleriaVideos() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
            Veja em ação
          </span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            Treinamentos que{' '}
            <span style={{ color: 'var(--pm-orange)' }}>transformam na prática</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {videosDestaque.map((v, i) => (
            <div key={v.id} className={`${styles.item} ${i === 0 ? styles.itemDestaque : ''}`}>
              <VideoEmbed videoId={v.id} title={v.titulo} />
              <p className={styles.videoTitulo}>{v.titulo}</p>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Link to="/galeria" className={styles.verMais}>
            Ver todos os vídeos →
          </Link>
        </div>
      </div>
    </section>
  )
}
