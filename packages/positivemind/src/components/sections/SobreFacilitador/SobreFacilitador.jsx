import mauroImg from '@/assets/images/mauro-gambini_perfil.jpeg'
import { whatsappLink } from '@/data/empresa'
import styles from './SobreFacilitador.module.css'

const msgContato = 'Olá, Mauro! Gostaria de conversar sobre treinamento de lideranças para a minha empresa.'

const stats = [
  { valor: '20+', rotulo: 'Anos desenvolvendo líderes' },
  { valor: '5k+', rotulo: 'Profissionais treinados' },
  { valor: '100+', rotulo: 'Empresas atendidas' },
  { valor: 'Ex-executivo', rotulo: 'Do Fundador da TOTVS' }
]

export default function SobreFacilitador() {
  return (
    <section className={styles.section}>
      <div className="container">
        <span className={styles.eyebrow}>Quem vai até sua empresa</span>
        <h2 className={styles.title}>O Facilitador</h2>

        <div className={styles.layout}>
          <div className={styles.imageCol}>
            <img
              src={mauroImg}
              alt="Mauro Gambini — Treinador Comportamental e Liderança"
              className={styles.image}
              loading="lazy"
            />
          </div>

          <div className={styles.textCol}>
            <h3 className={styles.subTitle}>Mauro Gambini</h3>
            <p className={styles.cargos}>
              Fundador da Positive Mind · Team Building · Leader Coaching · Palestrante Motivacional
            </p>

            <div className={styles.bio}>
              <p>
                Sou especialista na formação de líderes intermediários para empresas em crescimento. Nos últimos 15 anos, colaborei com empresas de São Paulo, incluindo setores de tecnologia, saúde e automobilística, para aliviar a carga dos CEOs e desenvolver líderes que alcançam resultados sem a necessidade de microgestão.
              </p>
              <p>
                Com 8 especializações — incluindo Psicologia, Coaching, PNL, TCC, Psicanálise e Hipnose Clínica — e uma trajetória que combina liderança de times, resiliência pessoal e vivência de mercado (trabalhando diretamente com Ernesto Haberkorn, fundador da TOTVS), criei a metodologia da Positive Mind para entregar resultados práticos, sem rodeios.
              </p>
            </div>

            <div className={styles.statsGrid}>
              {stats.map(({ valor, rotulo }, index) => (
                <div key={index} className={styles.statCard}>
                  <span className={styles.statValor}>{valor}</span>
                  <span className={styles.statRotulo}>{rotulo}</span>
                </div>
              ))}
            </div>

            <a
              href={whatsappLink(msgContato)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnCta}
            >
              Falar Direto com o Mauro
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
