import { whatsappLink } from '@/data/empresa'
import styles from './DiagnosticoGratuito.module.css'

const msgDiag = 'Olá, Mauro! Gostaria de agendar o Diagnóstico de Liderança Onsite Gratuito para a minha empresa.'

const entregaveis = [
  {
    titulo: 'Entrevista Presencial',
    desc: 'Conversa direta com você (CEO) e 2 líderes-chave do seu time para entender o dia a dia.'
  },
  {
    titulo: 'Mapeamento Rápido',
    desc: 'Identificação clara das forças da liderança e dos gargalos operacionais/comportamentais.'
  },
  {
    titulo: 'Plano de Ação PDF',
    desc: 'Relatório estruturado com os 3 principais pontos a serem corrigidos nos próximos 90 dias.'
  }
]

export default function DiagnosticoGratuito() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.badge}>Só para São Paulo & Grande SP</div>
          <h2 className={styles.title}>
            Diagnóstico de Liderança <span className={styles.accent}>Onsite Gratuito</span>
          </h2>
          <p className={styles.subtitle}>
            Eu vou até a sua empresa em São Paulo e, em 90 minutos, estruturamos o seguinte diagnóstico:
          </p>

          <div className={styles.entregaveisGrid}>
            {entregaveis.map(({ titulo, desc }, index) => (
              <div key={index} className={styles.cardEntregavel}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconCircle}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>{titulo}</h3>
                </div>
                <p className={styles.cardDesc}>{desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.footerDestaque}>
            <div className={styles.politicas}>
              <div className={styles.politicaItem}>
                <span className={styles.check}>✔</span> Sem pitch de venda na hora
              </div>
              <div className={styles.politicaItem}>
                <span className={styles.check}>✔</span> Sem qualquer compromisso comercial
              </div>
              <div className={styles.politicaItem}>
                <span className={styles.check}>✔</span> Vagas limitadas: apenas 3 empresas/mês
              </div>
            </div>

            <a
              href={whatsappLink(msgDiag)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Quero Garantir Minha Vaga
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
