import styles from './DepoimentosCases.module.css'

const depoimentos = [
  {
    nome: 'Ana Moser',
    cargo: 'Atleta Olímpica e Empresária',
    foto: '/photos/cases/ana-moser.webp',
    quote: 'O trabalho com o Mauro me preparou para entrar no Programa Aprendiz do Roberto Justus com clareza de propósito e emocional alinhado. Mais do que vencer a competição, aprendi o que significa liderar com consciência.',
    servico: 'Leader Coaching'
  },
  {
    nome: 'Wagner Coppini (Wagão)',
    cargo: 'Técnico — Seleção Brasileira sub-21 de Vôlei',
    foto: '/photos/cases/wagao-tecnico.jpg',
    quote: 'Descobri, trabalhando com o Mauro, que minhas próprias crenças sobre liderança eram meu maior obstáculo. O processo mudou a forma como me relaciono com meus atletas — e os resultados do grupo seguiram.',
    servico: 'Mentoria Esportiva & Liderança'
  },
  {
    nome: 'Suelle',
    cargo: 'Jogadora da Seleção Brasileira de Vôlei',
    foto: '/photos/cases/suelle-selecao.jpg',
    quote: 'Eu treinava meu físico todos os dias, mas nunca tinha trabalhado minha mente da mesma forma. Com o Mauro, eliminei bloqueios que travavam minha performance sem eu perceber. Senti a diferença dentro de quadra desde as primeiras sessões.',
    servico: 'Coaching Individual'
  }
]

export default function DepoimentosCases() {
  return (
    <section className={styles.section}>
      <div className="container">
        <span className={styles.eyebrow}>Resultados Reais</span>
        <h2 className={styles.title}>
          Quem já treinou e <span className={styles.accent}>recomenda</span>
        </h2>

        <div className={styles.grid}>
          {depoimentos.map(({ nome, cargo, foto, quote, servico }, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.fotoWrapper}>
                <img src={foto} alt={nome} className={styles.foto} loading="lazy" />
                <span className={styles.badgeServico}>{servico}</span>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.quoteIcon}>“</span>
                <p className={styles.quoteText}>{quote}</p>
                <div className={styles.autor}>
                  <h4 className={styles.nome}>{nome}</h4>
                  <span className={styles.cargo}>{cargo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
