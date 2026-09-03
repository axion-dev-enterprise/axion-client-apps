import styles from './NossosTreinamentos.module.css'

const treinamentos = [
  {
    foto: '/photos/treinamentos/0869e734-58c7-47af-a81e-ebbb328ed601.jfif',
    titulo: 'Pirâmide',
    descricao:
      'Na Pirâmide Humana, cada participante sustenta e é sustentado pelos outros — uma metáfora poderosa sobre confiança, interdependência e o papel de cada pessoa no resultado coletivo.',
  },
  {
    foto: '/photos/treinamentos/0d655114-1778-46ec-9995-db301677935d.jfif',
    titulo: 'Operação Resgate',
    descricao:
      'Missão colaborativa que exige comunicação ágil, liderança e tomada de decisão sob pressão. Os participantes aprendem que o sucesso depende da união de todos.',
  },
  {
    foto: '/photos/treinamentos/116d60e8-5b41-41bb-a5e1-1dbdb46f5d60.jfif',
    titulo: 'Dominó Humano',
    descricao:
      'Demonstra como cada ação individual impacta diretamente os resultados coletivos. Fortalece responsabilidade, comprometimento e interdependência entre áreas e pessoas.',
  },
  {
    foto: '/photos/treinamentos/7f17fb0c-203a-4929-bfa1-1e97579088e2.jfif',
    titulo: 'Grandes Times',
    descricao:
      'Atividade de alto impacto para integrar grandes grupos de forma dinâmica e participativa, evidenciando visão sistêmica, liderança compartilhada e alinhamento entre áreas.',
  },
  {
    foto: '/photos/treinamentos/89344205-e1ed-4618-9e77-2555e5aa4f2f.jfif',
    titulo: 'Dinâmicas Indoor',
    descricao:
      'Jogos e atividades práticas que fortalecem comunicação, colaboração e liderança. Por meio de desafios vivenciais, os participantes desenvolvem novas habilidades e aumentam o engajamento.',
  },
  {
    foto: '/photos/treinamentos/96e48c1d-257e-42bf-aae4-1341e9d0c2bc.jfif',
    titulo: 'Caça ao Tesouro',
    descricao:
      'Desafia equipes a trabalharem juntas em busca de pistas e objetivos comuns. Mais do que encontrar um tesouro, os participantes descobrem o valor da colaboração para alcançar resultados extraordinários.',
  },
  {
    foto: '/photos/treinamentos/9ebc2cb2-b4ca-4c94-a33d-b4d87df54ca9.jfif',
    titulo: 'Mergulho 360°',
    descricao:
      'Experiência transformadora que convida os participantes a saírem da zona de conforto com coragem e foco. Desenvolve autoconfiança, inteligência emocional e a capacidade de superar os próprios limites.',
  },
  {
    foto: '/photos/treinamentos/b65f2c6f-b1b6-4a60-872b-65b232252233.jfif',
    titulo: 'Palestra: Fundador da TOTVS',
    descricao:
      'Palestra do empresário Ernesto Haberkorn, 83 anos, fundador da TOTVS. Qualidade de vida e case de sucesso inspiram colaboradores a construírem carreiras de alto impacto como líderes e empreendedores.',
  },
]

export default function NossosTreinamentos() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
            Dinâmicas vivenciais
          </span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            Nossos{' '}
            <span style={{ color: 'var(--pm-orange)' }}>Jogos</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {treinamentos.map(({ foto, titulo, descricao }) => (
            <div key={titulo} className={styles.card}>
              <div className={styles.cardImagem}>
                <img
                  src={foto}
                  alt={titulo}
                  className={styles.imagem}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={`pm-h3 ${styles.cardTitulo}`}>{titulo}</h3>
                <p className={`pm-body ${styles.cardTexto}`}>{descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
