import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Positive Mind Treinamentos'
const SITE_URL = 'https://positivemind.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_DESCRIPTION =
  'Treinamentos de Team Building, Liderança e Desenvolvimento Humano para empresas. Positive Mind — Mauro Gambini.'

export default function SEO({
  titulo,
  descricao = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  tipo = 'website',
}) {
  const titulo_completo = titulo ? `${titulo} | ${SITE_NAME}` : `${SITE_NAME} — Team Building & Desenvolvimento Humano`
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL

  return (
    <Helmet>
      <title>{titulo_completo}</title>
      <meta name="description" content={descricao} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={tipo} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={titulo_completo} />
      <meta property="og:description" content={descricao} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titulo_completo} />
      <meta name="twitter:description" content={descricao} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
