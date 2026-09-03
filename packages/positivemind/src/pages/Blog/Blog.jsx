import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '@/components/ui/PageHero/PageHero'
import { posts, formatarData } from '@/data/blog/posts'
import styles from './Blog.module.css'

const categorias = ['Todas', ...new Set(posts.map(p => p.categoria))]

export default function Blog() {
  const [catAtiva, setCatAtiva] = useState('Todas')

  const postsFiltrados = catAtiva === 'Todas'
    ? posts
    : posts.filter(p => p.categoria === catAtiva)

  const [destaque, ...demais] = postsFiltrados

  return (
    <>
      <PageHero
        eyebrow="Blog"
        titulo="Conteúdo sobre"
        highlight="liderança e times"
        sub="Artigos práticos sobre Team Building, liderança e desenvolvimento de equipes — escritos por quem já fez isso +170 vezes."
      />

      <section className={styles.section}>
        <div className="container">
          {/* Filtros */}
          <div className={styles.filtros} role="tablist">
            {categorias.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={catAtiva === cat}
                className={`${styles.filtroBtn} ${catAtiva === cat ? styles.filtroAtivo : ''}`}
                onClick={() => setCatAtiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Post destaque */}
          {destaque && (
            <Link to={`/blog/${destaque.slug}`} className={styles.destaque}>
              <div className={styles.destaqueThumb} aria-hidden="true" />
              <div className={styles.destaqueContent}>
                <div className={styles.postMeta}>
                  <span className={styles.postCat}>{destaque.categoria}</span>
                  <span className={styles.postData}>{formatarData(destaque.data)}</span>
                  <span className={styles.postTempo}>{destaque.tempoLeitura} min de leitura</span>
                </div>
                <h2 className={`pm-h2 ${styles.destaqueTitulo}`}>{destaque.titulo}</h2>
                <p className={styles.destaqueResumo}>{destaque.resumo}</p>
                <span className={styles.lerMais}>Ler artigo completo →</span>
              </div>
            </Link>
          )}

          {/* Grid demais posts */}
          {demais.length > 0 && (
            <div className={styles.grid}>
              {demais.map(post => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className={styles.card}>
                  <div className={styles.cardThumb} aria-hidden="true" />
                  <div className={styles.cardContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.postCat}>{post.categoria}</span>
                      <span className={styles.postData}>{formatarData(post.data)}</span>
                    </div>
                    <h3 className={styles.cardTitulo}>{post.titulo}</h3>
                    <p className={styles.cardResumo}>{post.resumo}</p>
                    <span className={styles.lerMais}>Ler artigo →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {postsFiltrados.length === 0 && (
            <p className={styles.vazio}>Nenhum post nesta categoria ainda.</p>
          )}
        </div>
      </section>
    </>
  )
}
