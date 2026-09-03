import PageHero from '@/components/ui/PageHero/PageHero'
import SEO from '@/components/common/SEO/SEO'
import { whatsappLink } from '@/data/empresa'
import styles from './Infraestrutura.module.css'

const msgWhatsApp = 'Olá! Tenho interesse em conhecer os espaços da Positive Mind para treinamentos. Podem me ajudar?'

const espacos = [
  {
    id: 'hotel-fazenda-morros-verdes',
    nome: 'Hotel Fazenda Morros Verdes',
    tipo: 'Team Building Outdoor',
    localizacao: 'Ibiúna/SP — 1h30 de São Paulo',
    ambiente: 'Natureza — Mata Atlântica',
    descricao: 'Em plena Mata Atlântica em Ibiúna/SP — propriedade de Ernesto Haberkorn, fundador da TOTVS. Um dos espaços parceiros da Positive Mind para Team Building Outdoor, com estrutura completa e ambiente impossível de replicar na cidade.',
    destaque: 'Propriedade de Ernesto Haberkorn — fundador da TOTVS',
    foto: '/photos/infraestrutura/fazenda-morros-verdes-imagem.jpg',
    atividades: [
      { nome: 'Canoagem', desc: 'Sincronismo, confiança e liderança situacional em lago natural.' },
      { nome: 'Trilhas na Mata Atlântica', desc: 'Resiliência, foco e colaboração em trilhas guiadas.' },
      { nome: 'Tirolesa', desc: 'Superação de medos e confiança no grupo.' },
      { nome: 'Dinâmicas de grupo', desc: 'Comunicação, alinhamento e resolução de conflitos.' },
      { nome: 'Operação Resgate', desc: 'Planejamento, comunicação e trabalho em equipe.' },
      { nome: 'Futebol de Robô', desc: 'Escuta ativa e trabalho em equipe com diversão.' },
      { nome: 'Quick Games', desc: 'Dinâmicas de aquecimento e integração.' },
      { nome: 'Workshops motivacionais', desc: 'PNL e coaching aplicado ao contexto de cada equipe.' },
    ],
  },
  {
    id: 'refugio-cheiro-de-mato',
    nome: 'Refúgio Cheiro de Mato',
    tipo: 'Team Building Outdoor',
    localizacao: 'Interior de São Paulo — Região de Atibaia',
    ambiente: 'Refúgio na natureza',
    descricao: 'Refúgio em meio à mata nativa paulista, a menos de 80 km da capital. O isolamento é proposital: sem sinal de celular e longe das distrações do escritório, o grupo para de performar e começa a se conectar de verdade. O ambiente informal e acolhedor cria um espaço seguro onde barreiras caem mais rápido — e o aprendizado fica gravado em memória afetiva, não no papel.',
    destaque: 'Imersão total — desconexão que conecta pessoas',
    foto: '/photos/infraestrutura/cheirodemato.JPG',
    fotoPosition: 'center 65%',
    atividades: [
      { nome: 'Dinâmicas ao ar livre', desc: 'Atividades de integração e confiança em área verde aberta.' },
      { nome: 'Fogueira e encerramento', desc: 'Rituais de fechamento que consolidam os vínculos do grupo.' },
      { nome: 'Caminhadas guiadas', desc: 'Trilhas curtas que estimulam conversas profundas fora do contexto corporativo.' },
      { nome: 'Workshops imersivos', desc: 'Sessões de coaching e PNL aplicadas ao contexto real da equipe.' },
    ],
  },
  {
    id: 'hotel-vista-serrana',
    nome: 'Hotel Vista Serrana',
    tipo: 'Team Building Indoor e Outdoor',
    localizacao: 'Serra da Mantiqueira — Interior de São Paulo',
    ambiente: 'Hotel fazenda na serra',
    descricao: 'Aninhado na Serra da Mantiqueira, o Hotel Vista Serrana entrega o que poucos espaços conseguem: estrutura completa de hotel com a energia renovadora da montanha. Salas climatizadas para workshops e plenárias, mais amplas áreas externas com vistas abertas e gramados generosos para dinâmicas ao ar livre. O ambiente sereno reduz a resistência natural das pessoas ao novo — e facilita o tipo de conversa honesta que raramente acontece no escritório.',
    destaque: 'Serra + estrutura de hotel — o melhor dos dois mundos',
    foto: '/photos/infraestrutura/hotel-vista-serrana.jpg',
    atividades: [
      { nome: 'Dinâmicas outdoor', desc: 'Atividades de equipe em gramados amplos com vista para a serra.' },
      { nome: 'Salas de workshop', desc: 'Espaços climatizados para sessões de liderança e coaching em grupo.' },
      { nome: 'Trilhas na serra', desc: 'Caminhadas guiadas que estimulam conversas fora do contexto corporativo.' },
      { nome: 'Atividades noturnas', desc: 'Dinâmicas de encerramento que aproveitam o ambiente tranquilo da montanha.' },
    ],
  },
  {
    id: 'clube-esperia',
    nome: 'Clube Esperia',
    tipo: 'Team Building Indoor e Outdoor',
    localizacao: 'Marginal Pinheiros — São Paulo/SP',
    ambiente: 'Clube tradicional urbano',
    descricao: 'Fundado em 1899, o Clube Esperia é um dos mais tradicionais do Brasil — e um dos poucos espaços em São Paulo onde é possível fazer team building sem sair da cidade. À beira do Rio Pinheiros, o clube combina salões nobres para workshops e sessões plenárias com áreas externas para dinâmicas de equipe. O prestígio do ambiente eleva a percepção do evento antes mesmo de começar — e isso tem um efeito real sobre o engajamento do grupo.',
    destaque: 'Team building de alto nível sem sair da capital',
    foto: '/photos/infraestrutura/clube esperia.png',
    atividades: [
      { nome: 'Salões para workshops', desc: 'Espaços históricos com capacidade para grupos de diferentes tamanhos.' },
      { nome: 'Remo e atividades náuticas', desc: 'Experiências no Rio Pinheiros que criam desafios únicos de sincronismo.' },
      { nome: 'Dinâmicas indoor', desc: 'Atividades de comunicação e liderança em ambiente climatizado.' },
      { nome: 'Espaços externos', desc: 'Áreas abertas para dinâmicas de integração ao ar livre dentro do clube.' },
    ],
  },
  {
    id: 'hotel-mavsa',
    nome: 'Hotel Mavsa',
    tipo: 'Team Building Indoor e Outdoor',
    localizacao: 'Cesário Lange/SP — 130km de São Paulo',
    ambiente: 'Resort corporativo 5 estrelas',
    descricao: 'Um dos maiores resorts corporativos do interior paulista, o Mavsa combina infraestrutura de alto padrão com um ambiente naturalmente descontraído. Piscinas, spa, salões de evento e amplas áreas verdes — tudo pensado para que o grupo saia completamente do modo rotina. Quando as pessoas relaxam, a guarda baixa, as conversas ficam honestas e os vínculos se formam com mais rapidez. O Mavsa é o tipo de lugar que eleva a percepção do evento e garante que cada participante se sinta valorizado.',
    destaque: 'Ambiente de resort que acelera vínculos reais',
    foto: '/photos/infraestrutura/hotel_mavsa.jpg',
    atividades: [
      { nome: 'Piscinas e lazer', desc: 'Infraestrutura de resort que descontrai o grupo antes das atividades.' },
      { nome: 'Salões corporativos', desc: 'Espaços equipados para workshops, plenárias e apresentações.' },
      { nome: 'Atividades outdoor', desc: 'Dinâmicas em áreas verdes extensas com estrutura de apoio.' },
      { nome: 'Spa e bem-estar', desc: 'Estrutura de relaxamento que complementa a jornada de desenvolvimento.' },
      { nome: 'Gastronomia completa', desc: 'Experiência gastronômica incluída que reforça a sensação de cuidado e valorização.' },
    ],
  },
  {
    id: 'hotel-hipica-atibaia',
    nome: 'Hotel Hípica Atibaia',
    tipo: 'Team Building Outdoor',
    localizacao: 'Atibaia/SP — 70km de São Paulo',
    ambiente: 'Haras, natureza e hotel',
    descricao: 'Em Atibaia, a apenas 70 km de São Paulo, o Hotel Hípica combina haras, natureza exuberante e estrutura de hospedagem num ambiente que nenhum escritório consegue replicar. O contato com os cavalos cria momentos de vulnerabilidade genuína — e vulnerabilidade é o que constrói confiança entre pessoas. Além da equoterapia e das vivências equestres, o espaço dispõe de áreas abertas para dinâmicas corporativas em meio à natureza da Serra da Mantiqueira, a menos de 2 horas da capital.',
    destaque: 'Vivência equestre — conexão que nenhuma sala de reunião oferece',
    foto: '/photos/infraestrutura/hotel_ipica_atibaia.jpg',
    atividades: [
      { nome: 'Vivência equestre', desc: 'Interação com cavalos que desenvolve empatia, confiança e liderança situacional.' },
      { nome: 'Trilhas a cavalo', desc: 'Experiência de equitação guiada pela mata atlântica de Atibaia.' },
      { nome: 'Dinâmicas no haras', desc: 'Atividades de integração usando o ambiente equestre como catalisador.' },
      { nome: 'Áreas verdes externas', desc: 'Espaços amplos para dinâmicas de equipe em contato com a natureza.' },
      { nome: 'Hospedagem integrada', desc: 'Estrutura de hotel para programas com pernoite e imersão total.' },
    ],
  },
  {
    id: 'hotel-almenat',
    nome: 'Hotel Almenat',
    tipo: 'Team Building Indoor e Outdoor',
    localizacao: 'Interior de São Paulo — Região de Itatiba',
    ambiente: 'Hotel fazenda',
    descricao: 'Hotel fazenda no interior paulista, já palco de múltiplos treinamentos da Positive Mind com equipes de alta performance de empresas nacionais e multinacionais. O ambiente acolhedor e afastado das distrações urbanas cria as condições certas para o tipo de trabalho que exige foco real: liderança, inteligência emocional e alinhamento de equipe. Com estrutura indoor completa e áreas externas preparadas para dinâmicas, o Almenat entrega profundidade sem abrir mão do conforto.',
    destaque: 'Espaço testado e aprovado pela Positive Mind',
    foto: '/photos/infraestrutura/almenat.jpg',
    atividades: [
      { nome: 'Salas de treinamento', desc: 'Espaços estruturados para workshops de liderança e desenvolvimento de times.' },
      { nome: 'Áreas externas', desc: 'Jardins e espaços abertos para dinâmicas ao ar livre e atividades de equipe.' },
      { nome: 'Hospedagem completa', desc: 'Acomodações confortáveis para programas com pernoite e imersão.' },
      { nome: 'Espaços de convivência', desc: 'Ambientes informais que facilitam conexões autênticas entre os participantes.' },
    ],
  },
]

export default function Infraestrutura() {
  return (
    <>
      <SEO
        titulo="Infraestrutura"
        canonical="/infraestrutura"
        descricao="Conheça os espaços parceiros da Positive Mind para Team Building. Fazenda Morros Verdes em Ibiúna/SP, Clube Esperia e outros ambientes cuidadosamente selecionados."
      />

      <PageHero
        eyebrow="Espaços parceiros"
        titulo="Você escolhe o"
        highlight="local ideal"
        sub="Os espaços abaixo são parceiros da Positive Mind — ambientes cuidadosamente selecionados. Mas você tem total liberdade para escolher qualquer local: hotel, clube, sede da sua empresa ou qualquer espaço que preferir. A gente se adapta."
      />

      {/* ─── ESPAÇOS ─── */}
      {espacos.map((espaco, idx) => (
        <section
          key={espaco.id}
          className={`${styles.espacoSection} ${idx % 2 === 1 ? styles.espacoAlt : ''}`}
        >
          <div className="container">
            <div className={styles.espacoGrid}>
              <div className={styles.espacoVisual}>
                {espaco.videoBackground ? (
                  <video
                    src={espaco.videoBackground}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.espacoBgVideo}
                    aria-label={espaco.nome}
                  />
                ) : espaco.foto ? (
                  <img
                    src={espaco.foto}
                    alt={espaco.nome}
                    className={styles.espacoFoto}
                    style={espaco.fotoPosition ? { objectPosition: espaco.fotoPosition } : undefined}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <p>{espaco.nome}</p>
                    <span className={styles.placeholderNote}>Fotos em breve</span>
                  </div>
                )}
              </div>

              <div className={styles.espacoContent}>
                <div className={styles.badgeRow}>
                  <div className={styles.badge}>
                    <span className={styles.badgeText}>{espaco.destaque}</span>
                  </div>
                  <span className={styles.parceiroBadge}>Parceiro Positive Mind</span>
                </div>

                <div className={styles.espacoMeta}>
                  <span className={styles.metaTag}>{espaco.tipo}</span>
                  <span className={styles.metaTag}>{espaco.localizacao}</span>
                  <span className={styles.metaTag}>{espaco.ambiente}</span>
                </div>

                <h2 className={`pm-h2 ${styles.titulo}`}>
                  {espaco.nome}
                </h2>

                <p className={`pm-body-lg ${styles.desc}`}>{espaco.descricao}</p>

                {espaco.atividades.length > 0 && (
                  <div className={styles.atividadesList}>
                    <h3 className={styles.atividadesTitle}>Atividades disponíveis</h3>
                    <div className={styles.atividadesGrid}>
                      {espaco.atividades.map(({ nome, desc }) => (
                        <div key={nome} className={styles.atividadeItem}>
                          <div>
                            <strong>{nome}</strong>
                            <p>{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={whatsappLink(msgWhatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaBtn}
                >
                  Quero usar este espaço
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ─── CTA FINAL ─── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={`pm-h1 ${styles.ctaTitulo}`}>
              Você decide o local e <span className={styles.orange}>nós garantimos o resultado.</span>
            </h2>
            <p className={styles.ctaSub}>
              Os espaços parceiros são sugestões — não obrigações. A Positive Mind se desloca
              para qualquer local que você escolher: a sede da sua empresa, um hotel, uma fazenda
              ou qualquer espaço que faça sentido para a sua equipe. Levamos toda a estrutura,
              metodologia e facilitação necessárias. O que importa é a transformação que acontece
              dentro do seu time.
            </p>
            <a
              href={whatsappLink(msgWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnLarge}
            >
              Falar com a Positive Mind
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
