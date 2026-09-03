import styles from './Diferenciais.module.css'

const diferenciais = [
  {
    numero: '01',
    titulo: '13+ anos de experiência',
    descricao:
      'Mais de 13 anos desenvolvendo equipes em todo o Brasil. Metodologia testada, refinada e comprovada com +170 empresas de diferentes setores.',
  },
  {
    numero: '02',
    titulo: 'Espaços parceiros para Team Building Outdoor',
    descricao:
      'Trabalhamos com espaços cuidadosamente selecionados — como a Fazenda Morros Verdes em Ibiúna/SP, com Mata Atlântica, bangalôs de luxo e pensão completa. O ambiente certo para cada equipe.',
  },
  {
    numero: '03',
    titulo: 'Metodologia multidisciplinar',
    descricao:
      'Combinação de Psicologia, PNL, TCC, Psicanálise, Coaching e Hipnose aplicada ao contexto corporativo. Não é motivação superficial — é transformação com base científica.',
  },
  {
    numero: '04',
    titulo: 'Cases de renome nacional',
    descricao:
      'Ana Moser, Seleção Brasileira sub-21 de vôlei, Esporte Clube Pinheiros, Google, Danone, Mastercard, Globo — entre +170 empresas e personalidades atendidas.',
  },
  {
    numero: '05',
    titulo: 'Atendimento em todo o Brasil',
    descricao:
      'Equipe mobilizada para qualquer estado. Presença confirmada nas principais capitais e regiões do país, sem restrições geográficas para sua empresa.',
  },
  {
    numero: '06',
    titulo: 'Foco em resultados mensuráveis',
    descricao:
      'Cada treinamento tem objetivos claros definidos junto ao RH. O impacto é acompanhado — em engajamento, colaboração, produtividade e retenção de talentos.',
  },
]

export default function Diferenciais() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.left}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
              Por que a Positive Mind
            </span>
            <h2 className={`pm-h2 ${styles.titulo}`}>
              O que nos torna{' '}
              <span style={{ color: 'var(--pm-orange)' }}>diferentes</span>
            </h2>
            <p className={`pm-body-lg ${styles.sub}`}>
              Não somos mais uma empresa de treinamentos. Somos especialistas em transformar
              a cultura de times — com metodologia, estrutura e resultados que comprovam.
            </p>
          </div>

          <div className={styles.right}>
            {diferenciais.map(({ numero, titulo, descricao }) => (
              <div key={numero} className={styles.item}>
                <span className={styles.itemNumero}>{numero}</span>
                <div className={styles.itemContent}>
                  <h3 className={`pm-h3 ${styles.itemTitulo}`}>{titulo}</h3>
                  <p className={`pm-body ${styles.itemDescricao}`}>{descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
