import PageHero from '@/components/ui/PageHero/PageHero'
import { whatsappLink } from '@/data/empresa'
import styles from './Fazenda.module.css'

const msg = 'Olá! Tenho interesse em fazer um treinamento na Fazenda Morros Verdes. Podem me contar mais?'

const atividades = [
  { nome: 'Canoagem', descricao: 'Sincronismo, confiança mútua e liderança situacional em lago natural.' },
  { nome: 'Trilhas na Mata Atlântica', descricao: 'Resiliência, foco e colaboração em trilhas guiadas pela Mata Atlântica preservada.' },
  { nome: 'Tirolesa', descricao: 'Superação de medos, encorajamento do time e confiança no grupo.' },
  { nome: 'Dinâmicas de grupo', descricao: 'Exercícios de comunicação, alinhamento e resolução de conflitos em campo aberto.' },
  { nome: 'Workshops motivacionais', descricao: 'Sessões de desenvolvimento com PNL e coaching aplicado ao contexto de cada equipe.' },
  { nome: 'Operação Resgate', descricao: 'Atividade de alta energia que desenvolve planejamento, comunicação e trabalho em equipe.' },
  { nome: 'Futebol de Robô', descricao: 'Concentração, escuta ativa e trabalho em equipe com dinamismo e muita diversão.' },
  { nome: 'Quick Games', descricao: 'Dinâmicas de aquecimento e integração para ativar a energia do grupo.' },
]

const estrutura = [
  { titulo: 'Bangalôs e apartamentos', desc: 'Acomodações de luxo para grupos de qualquer tamanho, com toda a infraestrutura.' },
  { titulo: 'Pensão completa', desc: '4 refeições por dia — café, almoço, lanche e jantar incluídos no pacote.' },
  { titulo: 'Mata Atlântica preservada', desc: 'Bioma raro em plena preservação — um ambiente impossível de replicar na cidade.' },
  { titulo: 'Ibiúna/SP — 1h30', desc: 'A 90 minutos da capital paulista. Fácil de chegar, impossível de esquecer.' },
  { titulo: 'Acessibilidade', desc: 'Espaço adaptado para receber equipes de diferentes perfis e necessidades.' },
  { titulo: 'Infraestrutura completa', desc: 'Energia, água quente, área para eventos, estacionamento e suporte completo.' },
]

export default function Fazenda() {
  return (
    <>
      <PageHero
        eyebrow="Espaço parceiro"
        titulo="Fazenda Morros Verdes"
        highlight="Ecolodge"
        sub="Uma das opções para Team Building Outdoor da Positive Mind — propriedade de Ernesto Haberkorn, fundador da TOTVS, em plena Mata Atlântica em Ibiúna/SP."
      />

      {/* ─── DESTAQUE PARCERIA ─── */}
      <section className={styles.parceriaSection}>
        <div className="container">
          <div className={styles.parceriaGrid}>
            <div className={styles.parceriaVisual}>
              <div className={styles.photoPlaceholder}>
                <p>Fotos da Fazenda</p>
                <span className={styles.placeholderNote}>Em breve</span>
              </div>
            </div>
            <div className={styles.parceriaContent}>
              <div className={styles.badge}>
                <span className={styles.badgeText}>
                  Propriedade de Ernesto Haberkorn — fundador da TOTVS
                </span>
              </div>
              <h2 className={`pm-h2 ${styles.titulo}`}>
                Uma parceria que nasceu de uma <span className={styles.orange}>amizade e de propósito</span>
              </h2>
              <p className={`pm-body-lg ${styles.desc}`}>
                Ernesto Haberkorn, fundador da TOTVS — maior empresa de tecnologia de gestão da América Latina —
                é proprietário da Fazenda Morros Verdes Ecolodge em Ibiúna/SP. A parceria com a Positive Mind
                nasceu de um encontro entre dois empresários com visão parecida: que o desenvolvimento humano
                é o maior diferencial competitivo de qualquer organização.
              </p>
              <p className={`pm-body-lg ${styles.desc}`}>
                Mauro Gambini foi convidado por Ernesto para desenvolver o treinamento NETAS e, em fevereiro
                de 2025, os dois gravaram um podcast ao vivo sobre liderança, propósito e empreendedorismo.
                A fazenda é uma das opções de espaço para treinamentos outdoor da Positive Mind.
              </p>
              <a
                href={whatsappLink(msg)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtn}
              >
                Quero fazer meu team building aqui
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ESTRUTURA ─── */}
      <section className={styles.estruturaSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>Infraestrutura</span>
            <h2 className={`pm-h2 ${styles.titulo}`}>
              Conforto de <span className={styles.orange}>hotel</span>, experiência de <span className={styles.orange}>natureza</span>
            </h2>
          </div>
          <div className={styles.estruturaGrid}>
            {estrutura.map(({ titulo, desc }) => (
              <div key={titulo} className={styles.estruturaCard}>
                <h3 className={styles.estruturaTitulo}>{titulo}</h3>
                <p className={styles.estruturaDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ATIVIDADES ─── */}
      <section className={styles.atividadesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="pm-label" style={{ color: 'var(--pm-orange)' }}>O que fazemos lá</span>
            <h2 className={`pm-h2 ${styles.titulo}`}>
              Atividades que <span className={styles.orange}>transformam na prática</span>
            </h2>
          </div>
          <div className={styles.atividadesGrid}>
            {atividades.map(({ nome, descricao }) => (
              <div key={nome} className={styles.atividadeCard}>
                <div>
                  <h3 className={styles.atividadeNome}>{nome}</h3>
                  <p className={styles.atividadeDesc}>{descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALERIA PLACEHOLDER ─── */}
      <section className={styles.galeriaSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={`pm-h2 ${styles.titulo}`}>Galeria</h2>
          </div>
          <div className={styles.galeriaGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.galeriaItem} />
            ))}
          </div>
          <p className={styles.galeriaNota}>Fotos do espaço em breve — aguardando envio do cliente.</p>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={`pm-h1 ${styles.ctaTitulo}`}>
              Leve sua equipe para a <span className={styles.orange}>Fazenda Morros Verdes</span>
            </h2>
            <p className={styles.ctaSub}>
              Um dia imersivo na natureza vale mais do que meses de treinamento em sala de aula.
              Fale com a gente e monte seu programa.
            </p>
            <a
              href={whatsappLink(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnLarge}
            >
              Montar meu programa de Team Building
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
