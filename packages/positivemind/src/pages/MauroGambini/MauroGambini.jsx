import mauroImg from '@/assets/images/mauro-gambini_perfil.jpeg'
import VideoEmbed from '@/components/ui/VideoEmbed/VideoEmbed'
import { empresa, whatsappLink } from '@/data/empresa'
import styles from './MauroGambini.module.css'

const msgContato = 'Olá! Quero entrar em contato com o Mauro Gambini para saber mais sobre os serviços da Positive Mind.'
const msgHipnose = 'Olá! Tenho interesse na Hipnose Clínica com o Mauro Gambini. Podem me contar mais?'

const especializacoes = [
  { area: 'Psicologia', inst: 'FMU' },
  { area: 'Life & Global Coaching', inst: 'Netprofit' },
  { area: 'Leader Coaching', inst: 'Instituto Zetta Coaching' },
  { area: 'PNL — Programação Neurolinguística', inst: 'Instituto Tera' },
  { area: 'Psicanálise (especializada em Burnout)', inst: null },
  { area: 'Terapia Cognitivo-Comportamental (TCC)', inst: null },
  { area: 'Hipnose Clínica', inst: 'Escola da Hipnose' },
  { area: 'Hipnose Sistêmica', inst: 'Instituto Rogério Castilho' },
]

const casesNotaveis = [
  {
    foto: '/photos/cases/ana-moser.webp',
    fotoAlt: 'Ana Moser',
    nome: 'Ana Moser',
    contexto: 'Atleta olímpica e empresária',
    servico: 'Leader Coaching',
    quote: 'O trabalho com o Mauro me preparou para entrar no Programa Aprendiz do Roberto Justus com clareza de propósito e emocional alinhado. Mais do que vencer a competição, aprendi o que significa liderar com consciência.',
  },
  {
    foto: '/photos/cases/suelle-selecao.jpg',
    fotoAlt: 'Suelle — Seleção Brasileira de Vôlei',
    nome: 'Suelle',
    contexto: 'Jogadora da Seleção Brasileira de Vôlei',
    servico: 'Coaching Individual',
    quote: 'Eu treinava meu físico todos os dias, mas nunca tinha trabalhado minha mente da mesma forma. Com o Mauro, eliminei bloqueios que travavam minha performance sem eu perceber. Senti a diferença dentro de quadra desde as primeiras sessões.',
  },
  {
    foto: '/photos/cases/wagao-tecnico.jpg',
    fotoAlt: 'Wagão — Técnico Seleção Brasileira sub-21',
    nome: 'Wagão',
    contexto: 'Técnico — Seleção Brasileira sub-21 de Vôlei',
    servico: 'Leader Coaching',
    quote: 'Descobri, trabalhando com o Mauro, que minhas próprias crenças sobre liderança eram meu maior obstáculo. O processo mudou a forma como me relaciono com meus atletas — e os resultados do grupo seguiram.',
  },
]

const bioLonga = [
  'Cresceu na Zona Norte de São Paulo, filho de imigrantes que construíram tudo do zero. Aos 13, o futebol ensinou o que significa liderar situacionalmente — seguir um líder, confiar no time, vencer junto. Aos 15, uma cirurgia de 29 pontos encerrou a carreira e inaugurou o primeiro ciclo de resiliência: cair, aceitar e se reconstruir. Essas duas lições fundamentam o Leader Coaching e o Team Building da Positive Mind até hoje.',
  'Da recuperação veio a música. Com o violão que amava desde criança, gravou no CD coletivo Rock Brasil ao lado de Lobão e RPM. Desempregado, comprou um teclado com metade do dinheiro que tinha — dias depois, recebeu a ligação da Sony Music. Cigana do Amor, gravada por Beto Barbosa, chegou como uma entrega pessoal de um Ford XR3. A lição ficou: agir com coragem antes de ter todas as certezas é o coração da metodologia da Positive Mind.',
  'Com 8 especializações — Psicologia, Coaching, PNL, TCC, Psicanálise e Hipnose Clínica — e 13 anos dedicados ao desenvolvimento humano e organizacional, Mauro fundou a Positive Mind com uma convicção simples: tudo o que viveu tem uma função. Cada história virou ferramenta. Cada superação virou método. E o método funciona porque não vem de livros.',
]

export default function MauroGambini() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroFoto}>
            <img
              src={mauroImg}
              alt="Mauro Gambini — Fundador da Positive Mind"
              className={styles.heroImg}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className={styles.heroContent}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>
              O Facilitador
            </span>
            <h1 className={`pm-display ${styles.heroNome}`}>Mauro Gambini</h1>
            <p className={styles.heroCargos}>
              Fundador da Positive Mind · Team Building · Leader Coaching · Palestrante Motivacional
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}><span className={styles.statN}>13+</span><span className={styles.statL}>anos de experiência</span></div>
              <div className={styles.stat}><span className={styles.statN}>+170</span><span className={styles.statL}>empresas atendidas</span></div>
              <div className={styles.stat}><span className={styles.statN}>4k+</span><span className={styles.statL}>profissionais treinados</span></div>
              <div className={styles.stat}><span className={styles.statN}>8</span><span className={styles.statL}>especializações</span></div>
            </div>
            <div className={styles.heroCTAs}>
              <a
                href={whatsappLink(msgContato)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaPrimary}
              >
                Falar com o Mauro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BIO LONGA ─── */}
      <section id="bio" className={styles.bioSection}>
        <div className="container">
          <div className={styles.bioLayout}>
            <div className={styles.bioSidebar}>
              <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>A história</span>
              <h2 className={`pm-h2 ${styles.bioTitulo}`}>Uma vida que virou método</h2>
              <div className={styles.bioDestaque}>
                <p>"Cada experiência tem uma função. Cada superação virou ferramenta."</p>
              </div>
            </div>
            <div className={styles.bioTexto}>
              {bioLonga.map((paragrafo, i) => (
                <p key={i} className={`pm-body ${styles.bioParagrafo}`}>{paragrafo}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FORMAÇÃO E ESPECIALIZAÇÕES ─── */}
      <section className={styles.formacaoSection}>
        <div className="container">
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Formação</span>
          <h2 className={`pm-h2 ${styles.sectionTitulo}`}>
            8 especializações aplicadas ao <span className={styles.orange}>contexto corporativo</span>
          </h2>
          <div className={styles.formacaoGrid}>
            {especializacoes.map(({ area, inst }, i) => (
              <div key={i} className={styles.formacaoCard}>
                <div className={styles.formacaoNumero}>{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <p className={styles.formacaoArea}>{area}</p>
                  {inst && <p className={styles.formacaoInst}>{inst}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CASES NOTÁVEIS ─── */}
      <section className={styles.casesSection}>
        <div className="container">
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Cases notáveis</span>
          <h2 className={`pm-h2 ${styles.sectionTitulo}`}>
            Resultados que <span className={styles.orange}>falam por si</span>
          </h2>
          <div className={styles.casesGrid}>
            {casesNotaveis.map(({ foto, fotoAlt, nome, contexto, servico, quote }) => (
              <div key={nome} className={styles.caseCard}>
                <div className={styles.caseFotoWrap}>
                  <img src={foto} alt={fotoAlt} className={styles.caseFoto} loading="lazy" decoding="async" />
                  <span className={styles.caseServico}>{servico}</span>
                </div>
                <div className={styles.caseBody}>
                  <span className={styles.quoteIcon} aria-hidden="true">"</span>
                  <p className={styles.caseQuote}>{quote}</p>
                  <div className={styles.caseAutor}>
                    <span className={styles.caseNome}>{nome}</span>
                    <span className={styles.caseContexto}>{contexto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VÍDEO — SALES CLUBE ─── */}
      <section className={styles.videosSection}>
        <div className="container">
          <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Assista</span>
          <h2 className={`pm-h2 ${styles.sectionTitulo}`}>
            Mauro Gambini no <span className={styles.orange}>Sales Clube</span>
          </h2>
          <div className={styles.videoDestaque}>
            <VideoEmbed videoId="N4IMEYnPlNE" title="Palestra e Team Building com Mauro Gambini e Ernesto Haberkorn | Sales Club" />
            <div className={styles.videoInfo}>
              <p className={styles.videoTitulo}>Palestra e Team Building com Ernesto Haberkorn — fundador da TOTVS</p>
              <p className={styles.videoDesc}>Mauro Gambini e Ernesto Haberkorn no Sales Clube — uma conversa sobre liderança, alta performance e desenvolvimento humano com um dos maiores empresários do Brasil.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIPNOSE CLÍNICA ─── */}
      <section className={styles.hipnoseSection}>
        <div className="container">
          <div className={styles.hipnoseInner}>
            <div>
              <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Serviço individual</span>
              <h2 className={`pm-h2 ${styles.sectionTitulo}`}>
                Hipnose <span className={styles.orange}>Clínica</span>
              </h2>
              <p className={`pm-body-lg ${styles.hipnoseDesc}`}>
                Além dos treinamentos corporativos, Mauro Gambini atende individualmente por
                Hipnose Clínica — um serviço separado da Positive Mind, voltado ao desenvolvimento pessoal.
                Também oferece Hipnose Esportiva para atletas e times profissionais.
              </p>
              <div className={styles.hipnoseCases}>
                <p className={styles.hipnoseCaseTitulo}>Case de Hipnose Esportiva:</p>
                <p className={styles.hipnoseCaseDesc}>
                  Suelle — jogadora da Seleção Brasileira de Vôlei. Trabalho de Coaching e Hipnose Esportiva
                  que resultou em maior foco, eliminação de bloqueios mentais e melhor performance dentro de quadra.
                </p>
              </div>
            </div>
            <div className={styles.hipnoseCTA}>
              <p className={styles.hipnoseCTATexto}>
                Atendimento individual — agende pelo WhatsApp
              </p>
              <a
                href={whatsappLink(msgHipnose)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaPrimary}
              >
                Agendar sessão de Hipnose
              </a>
              <p className={styles.hipnoseTel}>{empresa.whatsappFormatado}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={`pm-h1 ${styles.ctaTitulo}`}>
              Quer o Mauro no <span className={styles.orange}>seu evento ou empresa?</span>
            </h2>
            <p className={styles.ctaSub}>
              Palestra, Leader Coaching, Team Building ou Hipnose Esportiva — fale direto pelo WhatsApp.
            </p>
            <a
              href={whatsappLink(msgContato)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPrimaryLarge}
            >
              Falar com o Mauro agora
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
