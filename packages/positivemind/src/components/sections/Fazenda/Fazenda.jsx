import { Link } from 'react-router-dom'
import { whatsappLink } from '@/data/empresa'
import { trackMeta, MetaEvent } from '@/lib/metaPixel'
import styles from './Fazenda.module.css'

const atividades = [
  { nome: 'Canoagem' },
  { nome: 'Trilhas na Mata Atlântica' },
  { nome: 'Tirolesa' },
  { nome: 'Dinâmicas de grupo' },
  { nome: 'Workshops motivacionais' },
]

const estrutura = [
  { texto: 'Bangalôs e apartamentos de luxo' },
  { texto: 'Pensão completa — 4 refeições/dia' },
  { texto: 'Mata Atlântica preservada' },
  { texto: 'Ibiúna/SP — 1h30 da capital' },
]

const mensagem = 'Olá! Tenho interesse no Team Building na Fazenda Morros Verdes. Podem me contar mais?'

export default function Fazenda() {
  function handleTeamBuilding() {
    // Contact: clique no WhatsApp de team building na fazenda
    trackMeta(MetaEvent.CONTACT, { method: 'WhatsApp', content_name: 'Team Building Fazenda' })
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
              Espaço parceiro
            </span>
            <h2 className={`pm-h2 ${styles.titulo}`}>
              Fazenda Morros Verdes{' '}
              <span style={{ color: 'var(--pm-orange)' }}>Ecolodge</span>
            </h2>

            <div className={styles.badge}>
              <span className={styles.badgeText}>
                Propriedade de Ernesto Haberkorn — fundador da TOTVS
              </span>
            </div>

            <p className={`pm-body-lg ${styles.descricao}`}>
              Um espaço impossível de replicar. Em plena Mata Atlântica, a 1h30 de São Paulo,
              a Fazenda Morros Verdes é um dos espaços que utilizamos para treinamentos outdoor — onde
              a natureza amplifica os resultados de cada dinâmica.
            </p>

            <div className={styles.atividadesGrid}>
              {atividades.map(({ nome }) => (
                <div key={nome} className={styles.atividade}>
                  <span>{nome}</span>
                </div>
              ))}
            </div>

            <div className={styles.estrutura}>
              {estrutura.map(({ texto }) => (
                <div key={texto} className={styles.estruturaItem}>
                  <span className={styles.estruturaTexto}>{texto}</span>
                </div>
              ))}
            </div>

            <div className={styles.ctas}>
              <a
                href={whatsappLink(mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTeamBuilding}
                className={styles.ctaPrimary}
              >
                Quero fazer meu team building aqui
              </a>
              <Link to="/infraestrutura" className={styles.ctaSecondary}>
                Ver todos os espaços →
              </Link>
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.placeholder}>
              <p>Fotos da Fazenda Morros Verdes</p>
              <span className={styles.placeholderNote}>Em breve</span>
            </div>
            <div className={styles.destaque}>
              <blockquote className={styles.quote}>
                "A natureza retira as pessoas da zona de conforto de uma forma que nenhuma sala de reunião consegue."
              </blockquote>
              <cite className={styles.quoteAutor}>— Mauro Gambini, fundador da Positive Mind</cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
