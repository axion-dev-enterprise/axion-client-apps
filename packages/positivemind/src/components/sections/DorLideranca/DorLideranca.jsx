import { whatsappLink } from '@/data/empresa'
import styles from './DorLideranca.module.css'

const msgDiagnostico = 'Olá, Mauro! Gostaria de um diagnóstico grátis sobre os gargalos de liderança da minha empresa.'

const dores = [
  {
    num: '01',
    titulo: 'O Promovido Técnico',
    desc: 'Você promoveu seu melhor técnico e ele virou o pior líder do time. Ele sabe fazer, mas não sabe guiar.'
  },
  {
    num: '02',
    titulo: 'Microgestão Infinita',
    desc: 'Nada anda se você não estiver em cima cobrando micro. Você se tornou escravo da sua própria empresa.'
  },
  {
    num: '03',
    titulo: 'Turnover no Management',
    desc: 'A gerência muda a cada 6 meses. O time se sente perdido, desmotivado e a transição custa caro.'
  }
]

const sintomas = [
  'O CEO centraliza todas as decisões estratégicas e operacionais.',
  'Os líderes intermediários não assumem responsabilidades pelos resultados.',
  'Existe excesso de retrabalho por falta de clareza e delegação.',
  'O turnover (rotatividade) está aumentando nos cargos de liderança.',
  'Falta total de alinhamento e comunicação entre diferentes áreas.'
]

export default function DorLideranca() {
  return (
    <section className={styles.section}>
      <div className="container">
        <span className={styles.eyebrow}>O Diagnóstico</span>
        <h2 className={styles.title}>
          Se sua empresa tem entre <span className={styles.accent}>50 e 200 funcionários</span>, você já vive isso:
        </h2>

        <div className={styles.gridDores}>
          {dores.map(({ num, titulo, desc }) => (
            <div key={num} className={styles.cardDor}>
              <span className={styles.cardNum}>{num}</span>
              <h3 className={styles.cardTitle}>{titulo}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.splitSintomas}>
          <div className={styles.sintomasLeft}>
            <h3 className={styles.sintomasTitle}>Os sintomas visíveis do gargalo:</h3>
            <p className={styles.sintomasText}>
              Empresas nesse tamanho crescem de forma acelerada no faturamento e tamanho da equipe, mas a maturidade dos líderes intermediários fica travada. Isso sobrecarrega o topo e gera gargalos operacionais constantes.
            </p>
            <a
              href={whatsappLink(msgDiagnostico)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnCta}
            >
              Mapear Meus Sintomas
            </a>
          </div>
          <div className={styles.sintomasRight}>
            <ul className={styles.listSintomas}>
              {sintomas.map((sintoma, idx) => (
                <li key={idx} className={styles.sintomaItem}>
                  <svg className={styles.sintomaIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{sintoma}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
