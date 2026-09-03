import { useParams, Link, Navigate } from 'react-router-dom'
import { whatsappLink } from '@/data/empresa'
import { posts, getPost, formatarData } from '@/data/blog/posts'
import styles from './BlogPost.module.css'

function renderBloco({ tipo, texto, itens }, i) {
  switch (tipo) {
    case 'h2':
      return <h2 key={i} className={styles.h2}>{texto}</h2>
    case 'paragrafo':
      return <p key={i} className={styles.paragrafo}>{texto}</p>
    case 'lista':
      return (
        <ul key={i} className={styles.lista}>
          {itens.map((item, j) => (
            <li key={j} className={styles.listaItem}>
              <span className={styles.listaBullet} aria-hidden="true">→</span>
              {item}
            </li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

const msgPost = 'Olá! Li um artigo no blog da Positive Mind e gostaria de saber mais sobre os treinamentos.'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) return <Navigate to="/blog" replace />

  const outrosPosts = posts.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <>
      {/* ─── HERO DO POST ─── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.breadcrumb}>
            <Link to="/" className={styles.breadLink}>Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/blog" className={styles.breadLink}>Blog</Link>
            <span aria-hidden="true">›</span>
            <span className={styles.breadCurrent}>{post.categoria}</span>
          </div>

          <div className={styles.postMeta}>
            <span className={styles.postCat}>{post.categoria}</span>
            <span className={styles.postData}>{formatarData(post.data)}</span>
            <span className={styles.postTempo}>{post.tempoLeitura} min de leitura</span>
          </div>

          <h1 className={`pm-h1 ${styles.titulo}`}>{post.titulo}</h1>
          <p className={`pm-body-lg ${styles.resumo}`}>{post.resumo}</p>
        </div>
      </section>

      {/* ─── CONTEÚDO ─── */}
      <div className={styles.layout}>
        <div className="container">
          <div className={styles.layoutInner}>
            <article className={styles.artigo}>
              {post.conteudo.map((bloco, i) => renderBloco(bloco, i))}
            </article>

            <aside className={styles.sidebar}>
              {/* CTA */}
              <div className={styles.sidebarCTA}>
                <p className={styles.sidebarCTATitulo}>
                  Pronto para transformar sua equipe?
                </p>
                <p className={styles.sidebarCTASub}>
                  Diagnóstico gratuito — sem compromisso.
                </p>
                <a
                  href={whatsappLink(msgPost)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sidebarCTABtn}
                >
                  Falar pelo WhatsApp
                </a>
              </div>

              {/* Outros posts */}
              {outrosPosts.length > 0 && (
                <div className={styles.sidebarPosts}>
                  <p className={styles.sidebarPostsTitulo}>Leia também</p>
                  {outrosPosts.map(p => (
                    <Link key={p.slug} to={`/blog/${p.slug}`} className={styles.sidebarPost}>
                      <span className={styles.sidebarPostCat}>{p.categoria}</span>
                      <span className={styles.sidebarPostTitulo}>{p.titulo}</span>
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* ─── NAVEGAÇÃO ─── */}
      <section className={styles.navSection}>
        <div className="container">
          <Link to="/blog" className={styles.voltarBtn}>
            ← Voltar para o Blog
          </Link>
        </div>
      </section>
    </>
  )
}
