import { useState } from 'react'
import styles from './VideoEmbed.module.css'

export default function VideoEmbed({ videoId, title }) {
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)

  if (playing) {
    return (
      <div className={styles.wrapper}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.thumb} onClick={() => setPlaying(true)} aria-label={`Reproduzir: ${title}`}>
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          onError={() => setThumb(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)}
        />
        <span className={styles.playBtn} aria-hidden="true">
          <svg viewBox="0 0 68 48" width="68" height="48">
            <path className={styles.playBg} d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/>
            <path className={styles.playArrow} d="M45 24 27 14v20z"/>
          </svg>
        </span>
      </button>
    </div>
  )
}
