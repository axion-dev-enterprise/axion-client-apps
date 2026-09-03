import styles from './Cases.module.css'

const cases = [
  {
    foto: '/photos/01919dd9-4c07-4019-85ab-a21ada95a775(1).JPG',
    nome: 'Asics',
    contexto: 'Team Building Outdoor',
    servico: 'Team Building Outdoor',
    descricao:
      'O time da Asics viveu uma experiência de Team Building Outdoor focada em colaboração, comunicação e alinhamento — atividades ao ar livre que conectaram áreas e fortaleceram a cultura de alta performance.',
    destaque: true,
  },
  {
    foto: '/photos/piramide3.jpeg',
    nome: 'Syngenta',
    contexto: 'Team Building Indoor — Desafio da Pirâmide',
    servico: 'Team Building Indoor',
    descricao:
      'O time da Syngenta viveu um Team Building Indoor intenso enfrentando o desafio de construir uma pirâmide de 1,80m usando apenas palitos de churrasco e fita adesiva — atividade que coloca à prova trabalho em equipe, comunicação, planejamento e gestão de pressão em tempo real.',
    destaque: false,
  },
  {
    foto: '/photos/team bulding magna.jpeg',
    nome: 'Magna',
    contexto: 'Team Building Outdoor — Integração de Equipes',
    servico: 'Team Building Outdoor',
    descricao:
      'O time da Magna viveu uma experiência de Team Building Outdoor focada em integração, liderança e confiança — dinâmicas ao ar livre que uniram colaboradores de diferentes áreas em torno de um objetivo comum e fortaleceram a cultura de equipe.',
    destaque: false,
  },
]

export default function Cases() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
            Cases de sucesso
          </span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            Quem já transformou{' '}
            <span style={{ color: 'var(--pm-orange)' }}>sua performance</span>{' '}
            com nosso Team Building
          </h2>
        </div>

        <div className={styles.grid}>
          {cases.map(({ foto, nome, contexto, servico, descricao, destaque }) => (
            <div key={contexto} className={styles.card}>
              <div className={styles.cardImagem}>
                <img src={foto} alt={nome} className={styles.imagem} loading="lazy" decoding="async" />
              </div>
              <div className={styles.cardBody}>
                <h3 className={`pm-h3 ${styles.nome}`}>{nome}</h3>
                <p className={styles.contexto}>{contexto}</p>
                <p className={`pm-body ${styles.descricao}`}>{descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
