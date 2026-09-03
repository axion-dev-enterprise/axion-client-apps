import { Link } from 'react-router-dom'
import { whatsappLink } from '@/data/empresa'
import { trackMeta, MetaEvent } from '@/lib/metaPixel'
import styles from './ServicosSection.module.css'

const servicos = [
  {
    foto: '/photos/instagram resgate.jpeg',
    tag: null,
    titulo: 'Team Building Outdoor',
    descricao:
      'Na natureza da Fazenda Morros Verdes Ecolodge, em Ibiúna/SP. Canoagem, trilhas, tirolesa e dinâmicas que geram conexão real e transformação rápida — menos teoria, mais experiência.',
    destaque: true,
    link: '/servicos#outdoor',
  },
  {
    foto: '/photos/ct&t foto equipe3.jpeg',
    tag: null,
    titulo: 'Team Building Indoor',
    descricao:
      'Dinâmicas estruturadas dentro da sua empresa ou em espaços fechados. Prático, controlado e ideal para trabalhar comunicação, alinhamento e colaboração com rapidez.',
    destaque: false,
    link: '/servicos#indoor',
  },
  {
    foto: '/photos/_CR_9977.jpeg',
    tag: null,
    titulo: 'Programa de Liderança',
    descricao:
      'Leader Coaching aplicado dentro da empresa durante 4 meses. Desenvolve líderes com inteligência emocional, comunicação e gestão de pessoas — com impacto direto no dia a dia.',
    destaque: false,
    link: '/servicos#lideranca',
  },
  {
    foto: '/photos/_CR_9930.jpeg',
    tag: null,
    titulo: 'Palestrante Motivacional',
    descricao:
      'Mauro Gambini como palestrante corporativo. Motivação, comportamento, neurociência aplicada e desenvolvimento humano — para eventos, convenções e kick-offs.',
    destaque: false,
    link: '/servicos#palestrante',
  },
]

const mensagemServico = 'Olá! Tenho interesse em um treinamento da Positive Mind. Podem me contar mais?'

export default function ServicosSection() {
  function handleFale() {
    // Contact: clique no WhatsApp da seção de serviços
    trackMeta(MetaEvent.CONTACT, { method: 'WhatsApp', content_name: 'Seção Serviços' })
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
            O que fazemos
          </span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            Soluções para{' '}
            <span style={{ color: 'var(--pm-orange)' }}>cada necessidade</span>{' '}
            da sua empresa
          </h2>
        </div>

        <div className={styles.grid}>
          {servicos.map(({ foto, tag, titulo, descricao, destaque, link }) => (
            <div key={titulo} className={styles.card}>
              <div className={styles.cardImagem}>
                <img src={foto} alt={titulo} className={styles.imagem} loading="lazy" decoding="async" />
                {tag && <span className={styles.tag}>{tag}</span>}
              </div>
              <div className={styles.cardBody}>
                <h3 className={`pm-h3 ${styles.cardTitulo}`}>{titulo}</h3>
                <p className={`pm-body ${styles.cardTexto}`}>{descricao}</p>
                <Link to={link} className={styles.saibaMais}>
                  Saiba mais →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaTexto}>
            Não sabe qual serviço é ideal para o seu momento?
          </p>
          <a
            href={whatsappLink(mensagemServico)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleFale}
            className={styles.ctaBtn}
          >
            Fale com a gente e descobrimos juntos
          </a>
        </div>
      </div>
    </section>
  )
}
