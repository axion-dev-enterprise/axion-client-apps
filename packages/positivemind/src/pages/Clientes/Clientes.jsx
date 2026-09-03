import { useState } from 'react'
import PageHero from '@/components/ui/PageHero/PageHero'
import { whatsappLink } from '@/data/empresa'
import { clientesDetalhados, setores } from '@/data/clientesDetalhados'
import styles from './Clientes.module.css'

const msgCliente = 'Olá! Vi a lista de clientes da Positive Mind e gostaria de saber como vocês podem ajudar minha empresa também.'

const setoresVisiveis = setores.filter(s => s.id !== 'todos')

export default function Clientes() {
  const [filtroAtivo, setFiltroAtivo] = useState('todos')

  const clientesFiltrados = filtroAtivo === 'todos'
    ? clientesDetalhados
    : clientesDetalhados.filter(c => c.setor === filtroAtivo)

  return (
    <>
      <PageHero
        eyebrow="Quem confia na Positive Mind"
        titulo="Empresas que"
        highlight="transformaram suas equipes"
        sub="De startups a multinacionais — 13 anos construindo times de alta performance em todo o Brasil."
      />

      {/* ─── STATS ─── */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { valor: '+170', label: 'Empresas atendidas' },
              { valor: '4.000+', label: 'Profissionais treinados' },
              { valor: '13+', label: 'Anos de experiência' },
              { valor: '7', label: 'Setores atendidos' },
            ].map(({ valor, label }) => (
              <div key={label} className={styles.statCard}>
                <span className={styles.statValor}>{valor}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MURAL DE CLIENTES ─── */}
      <section className={styles.muralSection}>
        <div className="container">
          <div className={styles.muralTitulo}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Portfólio</span>
            <h2 className={`pm-h2 ${styles.muralH2}`}>
              Algumas das empresas que já{' '}
              <span className={styles.orange}>passaram pela Positive Mind</span>
            </h2>
            <p className={styles.muralSub}>
              Um recorte de 13 anos de trabalho — empresas de diferentes setores, tamanhos e regiões do Brasil, entre muitas outras que transformaram suas equipes com a gente.
            </p>
          </div>

          <div className={styles.muralHeader}>
            <div className={styles.muralFiltros}>
              <button
                className={`${styles.filtroBtn} ${filtroAtivo === 'todos' ? styles.filtroAtivo : ''}`}
                onClick={() => setFiltroAtivo('todos')}
              >
                Todos
              </button>
              {setoresVisiveis.map(({ id, label }) => (
                <button
                  key={id}
                  className={`${styles.filtroBtn} ${filtroAtivo === id ? styles.filtroAtivo : ''}`}
                  onClick={() => setFiltroAtivo(filtroAtivo === id ? 'todos' : id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.clientesGrid}>
            {clientesFiltrados.map(({ nome, logo }) => (
              <div key={nome} className={styles.clienteCard}>
                <div className={styles.clienteLogoBox}>
                  {logo
                    ? <img src={logo} alt={nome} className={styles.clienteLogo} loading="lazy" decoding="async" />
                    : <span className={styles.clienteInicial}>{nome.charAt(0)}</span>
                  }
                </div>
                <span className={styles.clienteNome}>{nome}</span>
              </div>
            ))}
          </div>

          {clientesFiltrados.length === 0 && (
            <p className={styles.semResultados}>Nenhum cliente neste setor ainda.</p>
          )}
        </div>
      </section>

      {/* ─── FRASE DE IMPACTO ─── */}
      <section className={styles.fraseSection}>
        <div className="container">
          <div className={styles.fraseInner}>
            <div className={styles.fraseLine} />
            <blockquote className={styles.fraseTexto}>
              Cada empresa desta lista parou, olhou para dentro e mudou algo real. Não foi um evento de um dia — foi um processo. E a segunda-feira seguinte foi diferente.
            </blockquote>
            <p className={styles.fraseAutor}>Mauro Gambini — Fundador da Positive Mind</p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <h2 className={`pm-h2 ${styles.ctaTitulo}`}>
                Sua empresa pode ser <span className={styles.orange}>a próxima</span>
              </h2>
              <p className={styles.ctaSub}>
                Já são mais de 170 empresas transformadas. Fale com a gente e descubra como a
                Positive Mind pode ajudar a sua equipe.
              </p>
            </div>
            <a
              href={whatsappLink(msgCliente)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Quero transformar minha equipe
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
