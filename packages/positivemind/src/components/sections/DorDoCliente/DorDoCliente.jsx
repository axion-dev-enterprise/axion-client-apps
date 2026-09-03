import { whatsappLink } from '@/data/empresa'
import { trackMeta, MetaEvent } from '@/lib/metaPixel'
import styles from './DorDoCliente.module.css'

const dores = [
  {
    numero: '01',
    titulo: 'Pessoas que saem antes do tempo',
    texto: 'Turn-over alto não é problema de RH — é sintoma de equipe sem propósito, sem pertencimento e sem liderança que inspire.',
  },
  {
    numero: '02',
    titulo: 'Comunicação que gera conflito',
    texto: 'Ruídos internos, informações perdidas e decisões sem alinhamento custam tempo, dinheiro e clima organizacional.',
  },
  {
    numero: '03',
    titulo: 'Time que não joga junto',
    texto: 'Quando cada um busca só o próprio resultado, o coletivo perde — e os resultados da empresa pagam o preço.',
  },
  {
    numero: '04',
    titulo: 'Potencial desperdiçado',
    texto: 'Times desmotivados entregam uma fração do que poderiam. Erros, retrabalho e atrasos viram rotina.',
  },
  {
    numero: '05',
    titulo: 'Departamentos em silos',
    texto: 'Quando áreas não se falam, projetos travam. Colaboração real entre times é o que separa empresas medianas das de alta performance.',
  },
  {
    numero: '06',
    titulo: 'Gestor que não lidera',
    texto: 'Cargo não é liderança. Sem inteligência emocional, comunicação e delegação eficaz, o gestor limita o time inteiro.',
  },
]

const msgDiagnostico = 'Olá! Me identifiquei com alguns dos problemas do site da Positive Mind. Gostaria de fazer um diagnóstico da minha equipe.'

export default function DorDoCliente() {
  function handleDiagnostico() {
    // Contact + Schedule: clique no diagnóstico gratuito (padrão Meta)
    trackMeta(MetaEvent.CONTACT, { method: 'WhatsApp', content_name: 'Diagnóstico Gratuito' })
    trackMeta(MetaEvent.SCHEDULE, { content_name: 'Diagnóstico Gratuito' })
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
            Você se identifica?
          </span>
          <h2 className={`pm-h2 ${styles.titulo}`}>
            Esses problemas estão{' '}
            <span style={{ color: 'var(--pm-orange)' }}>travando sua empresa</span>
          </h2>
          <p className={`pm-body-lg ${styles.sub}`}>
            Se algum desses cenários soa familiar, sua equipe precisa de mais do que uma reunião.
          </p>
        </div>

        <div className={styles.grid}>
          {dores.map(({ numero, titulo, texto }) => (
            <div key={numero} className={styles.card}>
              <span className={styles.numero}>{numero}</span>
              <h3 className={`pm-h3 ${styles.cardTitulo}`}>{titulo}</h3>
              <p className={`pm-body ${styles.cardTexto}`}>{texto}</p>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerTitulo}>
              Se você marcou 3 ou mais — é hora de agir.
            </p>
            <p className={styles.footerSub}>
              A Positive Mind faz um diagnóstico gratuito da sua equipe e apresenta
              a solução certa para o momento da sua empresa.
            </p>
          </div>
          <a
            href={whatsappLink(msgDiagnostico)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDiagnostico}
            className={styles.ctaBtn}
          >
            Quero um diagnóstico gratuito
          </a>
        </div>
      </div>
    </section>
  )
}
