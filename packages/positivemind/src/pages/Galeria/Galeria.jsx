import { useState, useCallback, useEffect } from 'react'
import PageHero from '@/components/ui/PageHero/PageHero'
import SEO from '@/components/common/SEO/SEO'
import { fotos } from '@/data/fotos'
import styles from './Galeria.module.css'

const FOTOS_POR_PAGINA = 16

function Lightbox({ fotos, indiceInicial, onClose }) {
  const [indice, setIndice] = useState(indiceInicial)

  const anterior = useCallback(() => setIndice(i => (i - 1 + fotos.length) % fotos.length), [fotos.length])
  const proximo  = useCallback(() => setIndice(i => (i + 1) % fotos.length), [fotos.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  anterior()
      if (e.key === 'ArrowRight') proximo()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [anterior, proximo, onClose])

  return (
    <div className={styles.lightboxOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Visualizar foto">
      <button className={styles.lightboxClose} onClick={onClose} aria-label="Fechar">✕</button>

      <button
        className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
        onClick={(e) => { e.stopPropagation(); anterior() }}
        aria-label="Foto anterior"
      >
        ‹
      </button>

      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <img
          src={fotos[indice]}
          alt={`Treinamento Positive Mind — foto ${indice + 1}`}
          className={styles.lightboxImg}
        />
        <p className={styles.lightboxCounter}>{indice + 1} / {fotos.length}</p>
      </div>

      <button
        className={`${styles.lightboxNav} ${styles.lightboxNext}`}
        onClick={(e) => { e.stopPropagation(); proximo() }}
        aria-label="Próxima foto"
      >
        ›
      </button>
    </div>
  )
}

function Paginacao({ pagina, totalPaginas, onAnterior, onProximo, onIr }) {
  return (
    <div className={styles.paginacao}>
      <button
        className={styles.paginacaoBtn}
        onClick={onAnterior}
        disabled={pagina === 0}
        aria-label="Página anterior"
      >
        ‹
      </button>
      {Array.from({ length: totalPaginas }, (_, i) => (
        <button
          key={i}
          className={`${styles.paginacaoNum} ${pagina === i ? styles.paginacaoAtiva : ''}`}
          onClick={() => onIr(i)}
          aria-label={`Página ${i + 1}`}
          aria-current={pagina === i ? 'page' : undefined}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={styles.paginacaoBtn}
        onClick={onProximo}
        disabled={pagina === totalPaginas - 1}
        aria-label="Próxima página"
      >
        ›
      </button>
    </div>
  )
}

export default function Galeria() {
  const [lightboxIndice, setLightboxIndice] = useState(null)
  const [paginaFotos, setPaginaFotos] = useState(0)

  const totalPaginasFotos = Math.ceil(fotos.length / FOTOS_POR_PAGINA)

  const fotosVisiveis = fotos.slice(paginaFotos * FOTOS_POR_PAGINA, (paginaFotos + 1) * FOTOS_POR_PAGINA)

  const indiceGlobalFoto = (i) => paginaFotos * FOTOS_POR_PAGINA + i

  return (
    <>
      <SEO
        titulo="Galeria"
        canonical="/galeria"
        descricao="Fotos dos treinamentos de Team Building da Positive Mind. Veja nossas ações em campo com empresas como Google, Mastercard, Danone e mais."
      />

      <PageHero
        eyebrow="Galeria"
        titulo="Veja a Positive Mind"
        highlight="em ação"
        sub="Fotos dos nossos treinamentos reais — experiências que transformam equipes."
      />

      {/* ─── FOTOS ─── */}
      <section className={styles.fotosSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`pm-h2 ${styles.sectionTitulo}`}>
              Fotos dos treinamentos
              <span className={styles.fotoCount}>{fotos.length} fotos</span>
            </h2>
          </div>

          <div className={styles.fotosGrid}>
            {fotosVisiveis.map((src, i) => (
              <button
                key={src}
                className={styles.fotoItem}
                onClick={() => setLightboxIndice(indiceGlobalFoto(i))}
                aria-label={`Abrir foto ${indiceGlobalFoto(i) + 1}`}
              >
                <img
                  src={src}
                  alt={`Treinamento Positive Mind — foto ${indiceGlobalFoto(i) + 1}`}
                  loading="lazy"
                  className={styles.fotoImg}
                />
                <div className={styles.fotoOverlay} aria-hidden="true" />
              </button>
            ))}
          </div>

          {totalPaginasFotos > 1 && (
            <Paginacao
              pagina={paginaFotos}
              totalPaginas={totalPaginasFotos}
              onAnterior={() => setPaginaFotos(p => p - 1)}
              onProximo={() => setPaginaFotos(p => p + 1)}
              onIr={(i) => setPaginaFotos(i)}
            />
          )}
        </div>
      </section>

      {/* ─── LIGHTBOX ─── */}
      {lightboxIndice !== null && (
        <Lightbox
          fotos={fotos}
          indiceInicial={lightboxIndice}
          onClose={() => setLightboxIndice(null)}
        />
      )}
    </>
  )
}
