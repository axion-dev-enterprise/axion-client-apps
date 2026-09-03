import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '@/components/ui/PageHero/PageHero'
import CTAFinal from '@/components/sections/CTAFinal/CTAFinal'
import { whatsappLink } from '@/data/empresa'
import SEO from '@/components/common/SEO/SEO'
import styles from './Servicos.module.css'

const msgTeamBuilding = 'Olá! Tenho interesse em Team Building para minha equipe. Podem me ajudar com um diagnóstico?'
const msgLideranca    = 'Olá! Tenho interesse no Programa de Liderança — Leader Coaching. Podem me contar mais?'
const msgPalestr      = 'Olá! Tenho interesse em contratar o Mauro Gambini como palestrante. Podem me contar mais?'

const modalidades = [
  {
    tipo: 'Outdoor',
    local: 'Fazenda Morros Verdes ou espaço à sua escolha',
    pontos: [
      'Imersão na natureza — desconexão total da rotina',
      'Atividades físicas e emocionalmente desafiadoras',
      'Vínculos formados em condições reais de pressão',
      'Duração: 1 a 2 dias completos',
    ],
    destaque: 'Realizado em espaços parceiros como a Fazenda Morros Verdes — Ibiúna/SP',
  },
  {
    tipo: 'Indoor',
    local: 'Na sua empresa ou espaço fechado',
    pontos: [
      'Zero logística — acontece na sua sede',
      'Dinâmicas focadas em comunicação e alinhamento',
      'Resultado imediato — aplicável no dia seguinte',
      'Duração: meio período ou dia completo',
    ],
    destaque: 'Adaptado ao espaço e aos desafios reais do seu time',
  },
]

const etapas = [
  {
    mes: 'Mês 1',
    foco: 'Diagnóstico e autoconhecimento',
    desc: 'Mapeamento profundo do perfil de liderança, pontos cegos, padrões de comportamento e crenças que limitam o potencial de cada gestor.',
  },
  {
    mes: 'Mês 2',
    foco: 'Inteligência emocional',
    desc: 'Desenvolvimento da capacidade de ler, gerir e usar as emoções — próprias e da equipe — como vantagem estratégica em momentos de pressão.',
  },
  {
    mes: 'Mês 3',
    foco: 'Comunicação e influência',
    desc: 'Comunicação assertiva, feedback construtivo, escuta ativa e como liderar pela influência genuína — não pela autoridade do cargo.',
  },
  {
    mes: 'Mês 4',
    foco: 'Gestão de pessoas e resultados',
    desc: 'Delegação eficaz, criação de autonomia, desenvolvimento contínuo da equipe e como bater metas sem destruir o clima organizacional.',
  },
]

const temasPalestra = [
  'Alta performance e gestão de energia',
  'Neurociência aplicada à liderança',
  'Resiliência — adversidade como combustível',
  'Cultura de times e pertencimento',
  'Propósito que move equipes',
  'Comportamento humano nas organizações',
]

const faq = [
  {
    q: 'Quantas pessoas podem participar dos treinamentos?',
    r: 'Os treinamentos atendem desde grupos de 10 até mais de 300 pessoas. O formato, as atividades e a dinâmica são calibrados conforme o tamanho da equipe — times menores recebem mais profundidade individual; grupos maiores ganham a energia e o impacto de um evento completo.',
  },
  {
    q: 'Qual a diferença entre Team Building Outdoor e Indoor?',
    r: 'O Outdoor usa a natureza como catalisador: atividades físicas e emocionalmente desafiadoras em ambiente real criam vínculos profundos e duradouros, especialmente na Fazenda Morros Verdes em Ibiúna/SP. O Indoor acontece na própria empresa com dinâmicas estruturadas focadas em comunicação e alinhamento — resultado imediato, zero logística. O formato ideal depende do momento da equipe e do objetivo que você quer alcançar.',
  },
  {
    q: 'Os treinamentos são personalizados para cada empresa?',
    r: 'Sempre. Antes de qualquer treinamento fazemos um diagnóstico com o RH ou a liderança para entender os desafios reais, o perfil do time e o resultado esperado. Nada é tirado de prateleira. O programa é desenhado do zero para a realidade de cada grupo — da dinâmica à ordem do dia.',
  },
  {
    q: 'Quanto tempo dura cada formato?',
    r: 'Team Building Outdoor: 1 a 2 dias completos, geralmente com pernoite na Fazenda Morros Verdes. Team Building Indoor: meio período (4h) ou dia completo (8h). O Programa de Liderança Leader Coaching dura 4 meses com encontros periódicos dentro da empresa. As palestras variam entre 60 min, 90 min ou meio dia.',
  },
  {
    q: 'A Positive Mind atende em todo o Brasil?',
    r: 'Sim. Com 13+ anos de atuação e mais de 170 empresas atendidas, já realizamos treinamentos em todo o território nacional. Para Outdoor, a Fazenda Morros Verdes fica em Ibiúna/SP — 1h30 da capital. Para Indoor e palestra, nos deslocamos para qualquer cidade.',
  },
  {
    q: 'Como funciona o diagnóstico inicial?',
    r: 'É gratuito e rápido — pode ser feito pelo WhatsApp ou em uma reunião de 30 minutos. Você descreve o momento da equipe, os desafios e o que quer alcançar. A partir disso montamos uma proposta personalizada com formato, atividades, duração e investimento, sem compromisso.',
  },
  {
    q: 'Qual é o investimento em um treinamento?',
    r: 'O valor depende do formato, duração, número de participantes e complexidade do programa. Não trabalhamos com pacotes fixos — cada proposta é personalizada. O diagnóstico é gratuito: entre em contato pelo WhatsApp e receba uma proposta sob medida.',
  },
]

export default function Servicos() {
  const [faqAberto, setFaqAberto] = useState(null)

  return (
    <>
      <SEO
        titulo="Serviços"
        canonical="/servicos"
        descricao="Team Building Outdoor e Indoor, Programa de Liderança Leader Coaching e Palestrante Motivacional. Treinamentos sob medida para empresas em todo o Brasil."
      />

      <PageHero
        eyebrow="Nossos serviços"
        titulo="Soluções sob medida para"
        highlight="cada desafio da sua equipe"
        sub="Do team building na natureza ao programa de liderança dentro da sua empresa — cada solução desenhada para o resultado que você precisa."
      />

      {/* ─── TEAM BUILDING ─── */}
      <section id="team-building" className={styles.servico}>
        <div className="container">

          <div className={styles.tbIntro}>
            <div>
              <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Team Building</span>
              <h2 className={`pm-h2 ${styles.servicoTitulo}`}>
                Sua equipe aprende <span className={styles.orange}>fazendo</span>
              </h2>
              <p className={`pm-body-lg ${styles.servicoDesc}`}>
                Menos teoria. Mais experiência. Os treinamentos da Positive Mind tiram as pessoas da
                zona de conforto e criam situações reais onde colaboração, liderança e comunicação são
                exigidas — não ensinadas. O resultado aparece no trabalho na segunda-feira.
              </p>
            </div>
            <a
              href={whatsappLink(msgTeamBuilding)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Diagnóstico gratuito
            </a>
          </div>

          {/* Outdoor vs Indoor */}
          <div className={styles.modalidadesGrid}>
            {modalidades.map(({ tipo, local, pontos, destaque }) => (
              <div key={tipo} className={styles.modalidadeCard}>
                <div className={styles.modalidadeTop}>
                  <div>
                    <h3 className={styles.modalidadeTitulo}>Team Building {tipo}</h3>
                    <p className={styles.modalidadeLocal}>{local}</p>
                  </div>
                </div>
                <ul className={styles.modalidadePontos}>
                  {pontos.map(p => (
                    <li key={p} className={styles.beneficio}>
                      <span className={styles.check} aria-hidden="true">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className={styles.modalidadeDestaque}>{destaque}</p>
              </div>
            ))}
          </div>

          <div className={styles.tbLinks}>
            <Link to="/infraestrutura" className={styles.ctaLink}>Ver espaços parceiros →</Link>
            <Link to="/galeria" className={styles.ctaLink}>Ver galeria de treinamentos →</Link>
          </div>
        </div>
      </section>

      {/* ─── PROGRAMA DE LIDERANÇA ─── */}
      <section id="lideranca" className={`${styles.servico} ${styles.servicoAlt}`}>
        <div className="container">
          <div className={styles.servicoHeader}>
            <div>
              <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Programa</span>
              <h2 className={`pm-h2 ${styles.servicoTitulo}`}>
                Programa de <span className={styles.orange}>Liderança</span>
                <span className={styles.subtag}>Leader Coaching — 4 meses dentro da sua empresa</span>
              </h2>
              <p className={`pm-body-lg ${styles.servicoDesc}`}>
                Desenvolve líderes de dentro para fora — sem tirar a equipe da operação. Quatro meses de
                jornada contínua com foco em inteligência emocional, comunicação e gestão de pessoas. Não
                é palestra de um dia que não sai da gaveta. É transformação que permanece.
              </p>
            </div>
            <a
              href={whatsappLink(msgLideranca)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Quero o programa
            </a>
          </div>

          <div className={styles.etapas}>
            {etapas.map(({ mes, foco, desc }) => (
              <div key={mes} className={styles.etapa}>
                <div className={styles.etapaHeader}>
                  <span className={styles.etapaMes}>{mes}</span>
                </div>
                <h3 className={styles.etapaFoco}>{foco}</h3>
                <p className={styles.etapaDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PALESTRANTE ─── */}
      <section id="palestrante" className={styles.servico}>
        <div className="container">
          <div className={styles.servicoLayout}>
            <div className={styles.servicoFoto}>
              <img
                src="/photos/_CR_9895.jpg"
                alt="Mauro Gambini — Palestrante Motivacional"
                loading="lazy"
              />
            </div>

            <div className={styles.servicoContent}>
              <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Palestra</span>
              <h2 className={`pm-h2 ${styles.servicoTitulo}`}>
                Mauro Gambini <span className={styles.orange}>Palestrante</span>
              </h2>
              <p className={`pm-body-lg ${styles.servicoDesc}`}>
                13+ anos em palco. Neurociência, PNL e inteligência emocional — entregues com
                a autenticidade de quem viveu cada história. Conecta com qualquer plateia,
                de operário a C-Level, em convenções, kick-offs e eventos corporativos.
              </p>

              <div className={styles.temas}>
                <p className={styles.temasLabel}>Temas disponíveis</p>
                <div className={styles.temasGrid}>
                  {temasPalestra.map(t => (
                    <span key={t} className={styles.temaTag}>{t}</span>
                  ))}
                </div>
              </div>

              <ul className={styles.beneficios}>
                {[
                  'Customização completa para o tema e momento da empresa',
                  'Disponível para convenções, kick-offs e congressos',
                  'Formatos: 60 min, 90 min ou palestra de meio-dia',
                  'Atende todo o Brasil',
                ].map(b => (
                  <li key={b} className={styles.beneficio}>
                    <span className={styles.check} aria-hidden="true">✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappLink(msgPalestr)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtn}
              >
                Contratar palestra
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqHeader}>
            <div>
              <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Tire suas dúvidas</span>
              <h2 className={`pm-h2 ${styles.faqTitulo}`}>
                Perguntas <span className={styles.orange}>frequentes</span>
              </h2>
            </div>
            <a
              href={whatsappLink('Olá! Vim pelo site da Positive Mind e gostaria de tirar uma dúvida.')}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaLink}
            >
              Não achou? Fale pelo WhatsApp →
            </a>
          </div>

          <div className={styles.faqList}>
            {faq.map(({ q, r }, idx) => (
              <div key={q} className={`${styles.faqItem} ${faqAberto === idx ? styles.faqAberto : ''}`}>
                <button
                  className={styles.faqPergunta}
                  onClick={() => setFaqAberto(faqAberto === idx ? null : idx)}
                  aria-expanded={faqAberto === idx}
                >
                  <span>{q}</span>
                  <span className={styles.faqToggle} aria-hidden="true">
                    {faqAberto === idx ? '−' : '+'}
                  </span>
                </button>
                {faqAberto === idx && (
                  <p className={styles.faqResposta}>{r}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAFinal />
    </>
  )
}
