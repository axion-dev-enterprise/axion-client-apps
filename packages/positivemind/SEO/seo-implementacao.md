# SEO — Plano de Implementação
## Positive Mind Treinamentos | positivemind.com.br

---

## Estado Atual

**Maturidade SEO: 55%**

| Área | Status |
|------|--------|
| Meta tags raiz (index.html) | ✅ Completo |
| Schema.org base (LocalBusiness + Person) | ✅ Completo |
| robots.txt | ✅ Completo |
| Sitemap | ⚠️ Incompleto — falta /infraestrutura e posts de blog |
| SEO por página | ❌ 6 de 10 páginas sem componente SEO |
| Google Analytics | ❌ ID placeholder `G-XXXXXXXXXX` — zero dados coletados |
| og:image | ❌ Arquivo `public/og-image.jpg` não existe |
| Schema avançado (Service, Article, FAQ, Breadcrumb) | ❌ Ausente |

---

## Arquitetura SEO Atual

### Componente SEO — código real (`src/components/common/SEO/SEO.jsx`)

```jsx
const SITE_NAME = 'Positive Mind Treinamentos'
const SITE_URL = 'https://positivemind.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

export default function SEO({ titulo, descricao, canonical, image, tipo = 'website' }) {
  const titulo_completo = titulo
    ? `${titulo} | ${SITE_NAME}`
    : `${SITE_NAME} — Team Building & Desenvolvimento Humano`
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL

  return (
    <Helmet>
      <title>{titulo_completo}</title>
      <meta name="description" content={descricao} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={tipo} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={titulo_completo} />
      <meta property="og:description" content={descricao} />
      <meta property="og:image" content={image} />
      ...
    </Helmet>
  )
}
```

**Fórmula do título gerada:**
```
{titulo} | Positive Mind Treinamentos
```

**Limites a respeitar:**
- `titulo` (prop): máximo **50 caracteres** — resultado final fica ~70 com o sufixo
- `descricao`: entre **120 e 160 caracteres** — Google trunca acima disso

**O componente atual NÃO gera:** Schema.org JSON-LD, breadcrumb, article schema.

### Estrutura de dados dos posts (`src/data/blog/posts.js`)

Campos disponíveis por post — relevantes para SEO dinâmico:

```js
{
  slug: 'o-que-e-team-building',      // → canonical URL: /blog/{slug}
  titulo: 'O que é Team Building...',  // → <title> e og:title
  resumo: 'Turn-over alto...',         // → meta description (verificar 120–160 chars)
  categoria: 'Team Building',          // → Article schema > articleSection
  data: '2026-04-10',                  // → Article schema > datePublished
  tempoLeitura: 6,                     // → pode virar meta extra / schema
  conteudo: [...]                      // → corpo do post
}
```

**Nota:** O campo `imagemCapa` não existe no schema atual. Para Article schema completo, adicionar `imagemCapa` ao objeto de cada post.

---

## Gap 1 — Google Analytics (CRÍTICO)

**Problema:** `G-XXXXXXXXXX` é placeholder em dois arquivos. Nenhum dado coletado desde o lançamento.

**Arquivos:**
- `public/gtag-init.js` — linha 4: `gtag('config', 'G-XXXXXXXXXX')`
- `index.html` — linha 39: `?id=G-XXXXXXXXXX`

**Fix:**
1. Acessar analytics.google.com → criar conta / propriedade para `positivemind.com.br`
2. Copiar Measurement ID (formato real: `G-ABC123XYZ`)
3. Substituir `G-XXXXXXXXXX` nos dois arquivos acima
4. Fazer deploy
5. Validar: GA4 → DebugView → acessar o site → ver eventos chegando em tempo real

---

## Gap 2 — og:image ausente (CRÍTICO)

**Problema:** `/og-image.jpg` referenciado em `index.html` e como default no `SEO.jsx` mas o arquivo não existe em `public/`. Todo compartilhamento no WhatsApp, LinkedIn e Twitter mostra preview sem imagem.

**Especificação da imagem:**
- Dimensões: **1200 × 630px**
- Formato: JPG (menor que PNG para mesmo visual)
- Peso máximo: 300KB
- Conteúdo: Logo Positive Mind + tagline "A Team Building Company" + fundo escuro (#1A1A1A) com detalhe laranja
- Destino: `public/og-image.jpg`

**Validação após criar:** `opengraph.xyz` → colar URL → ver preview gerado.

---

## Gap 3 — SEO Ausente em 6 Páginas (CRÍTICO)

Todas as páginas abaixo usam o título genérico da `index.html` no Google e nas abas do browser. Todas precisam do import e do componente abaixo do `<>` no return.

**Padrão de implementação (igual para todas):**

```jsx
import SEO from '@/components/common/SEO/SEO'

export default function NomeDaPagina() {
  return (
    <>
      <SEO titulo="..." canonical="/rota" descricao="..." />
      {/* restante da página */}
    </>
  )
}
```

---

### 3.1 — Mauro Gambini (`src/pages/MauroGambini/MauroGambini.jsx`)

```jsx
import SEO from '@/components/common/SEO/SEO'

<SEO
  titulo="Mauro Gambini — Fundador da Positive Mind"
  canonical="/mauro-gambini"
  descricao="Fundador da Positive Mind, especialista em Team Building, Leader Coaching, PNL e Hipnose Clínica. 13 anos e 170+ empresas transformadas."
/>
```

> `titulo` = 44 chars ✅ | `descricao` = 143 chars ✅

---

### 3.2 — Contato (`src/pages/Contato/Contato.jsx`)

```jsx
import SEO from '@/components/common/SEO/SEO'

<SEO
  titulo="Contato — Diagnóstico Gratuito"
  canonical="/contato"
  descricao="Fale com a Positive Mind. Diagnóstico gratuito em 30 minutos, retorno em até 24 horas. Team Building, Leader Coaching e Palestrante para sua empresa."
/>
```

> `titulo` = 36 chars ✅ | `descricao` = 151 chars ✅

---

### 3.3 — Clientes (`src/pages/Clientes/Clientes.jsx`)

```jsx
import SEO from '@/components/common/SEO/SEO'

<SEO
  titulo="Clientes — Empresas que Confiam na Positive Mind"
  canonical="/clientes"
  descricao="170+ empresas confiam na Positive Mind. Google, Mastercard, Danone, Bunzl, Scania e muitas outras transformaram suas equipes com a gente."
/>
```

> `titulo` = 51 chars ✅ | `descricao` = 141 chars ✅

---

### 3.4 — Fazenda (`src/pages/Fazenda/Fazenda.jsx`)

```jsx
import SEO from '@/components/common/SEO/SEO'

<SEO
  titulo="Fazenda Morros Verdes — Team Building Outdoor"
  canonical="/fazenda"
  descricao="Fazenda Morros Verdes Ecolodge em Ibiúna/SP — um dos espaços parceiros da Positive Mind para Team Building Outdoor. Mata Atlântica preservada e estrutura completa."
/>
```

> `titulo` = 49 chars ✅ | `descricao` = 160 chars ✅ (limite exato)

---

### 3.5 — Blog (`src/pages/Blog/Blog.jsx`)

```jsx
import SEO from '@/components/common/SEO/SEO'

<SEO
  titulo="Blog — Liderança e Team Building"
  canonical="/blog"
  descricao="Artigos sobre Team Building, liderança corporativa e desenvolvimento de equipes. Produzido por Mauro Gambini — 13 anos, 170+ empresas atendidas."
/>
```

> `titulo` = 36 chars ✅ | `descricao` = 144 chars ✅

---

### 3.6 — Blog Post (`src/pages/Blog/BlogPost.jsx`)

Requer SEO **dinâmico** — cada post tem seu próprio título, descrição e canonical.

```jsx
import SEO from '@/components/common/SEO/SEO'

// Dentro do componente, onde `post` já está resolvido:
<SEO
  titulo={post.titulo}                              // max 50 chars — auditar posts
  canonical={`/blog/${post.slug}`}
  descricao={post.resumo}                           // verificar 120–160 chars por post
  image={post.imagemCapa || '/og-image.jpg'}        // campo ainda não existe nos posts
  tipo="article"
/>
```

**Ação necessária em `posts.js`:** adicionar campo `imagemCapa` a cada post quando houver foto de capa.

---

## Gap 4 — Sitemap Incompleto

**Arquivo:** `public/sitemap.xml`

**Problemas:**
- `/infraestrutura` — rota ativa no site, ausente do sitemap
- Posts de blog (`/blog/o-que-e-team-building`, etc.) — não listados
- `lastmod` de todas as entradas desatualizado (2026-04-27)

**Adicionar ao sitemap:**

```xml
<!-- Infraestrutura -->
<url>
  <loc>https://positivemind.com.br/infraestrutura</loc>
  <lastmod>2026-05-29</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>

<!-- Posts de blog (um bloco por post) -->
<url>
  <loc>https://positivemind.com.br/blog/o-que-e-team-building</loc>
  <lastmod>2026-04-10</lastmod>
  <changefreq>never</changefreq>
  <priority>0.6</priority>
</url>
```

**Regra de manutenção:** atualizar `lastmod` de uma página sempre que o conteúdo principal mudar. Datas erradas prejudicam o crawl budget.

---

## Gap 5 — Schema.org Avançado

O site tem `LocalBusiness` e `Person` no `index.html`. Faltam schemas específicos por página que geram rich results no Google.

### 5.1 — Service Schema (`/servicos`)

Gera rich result de serviço no Google. Um bloco por serviço oferecido.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Team Building Outdoor",
  "serviceType": "Team Building",
  "provider": { "@type": "Organization", "name": "Positive Mind", "url": "https://positivemind.com.br" },
  "areaServed": { "@type": "Country", "name": "Brasil" },
  "description": "Treinamentos de Team Building Outdoor na Fazenda Morros Verdes em Ibiúna/SP — dinâmicas vivenciais em Mata Atlântica para equipes de 10 a 100+ pessoas.",
  "url": "https://positivemind.com.br/servicos"
}
```

### 5.2 — FAQPage Schema (`/servicos`)

Gera accordion de perguntas diretamente no resultado do Google — aumenta CTR significativamente.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Qual a diferença entre Team Building Outdoor e Indoor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O Team Building Outdoor acontece em ambientes externos como a Fazenda Morros Verdes em Ibiúna/SP, com atividades na natureza. O Indoor é realizado em espaços fechados — hotéis, auditórios ou na própria empresa — e pode incluir dinâmicas criativas, de liderança ou comunicação."
      }
    },
    {
      "@type": "Question",
      "name": "Qual o número mínimo e máximo de participantes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Os programas da Positive Mind atendem grupos de 10 a mais de 100 pessoas. O formato é adaptado conforme o tamanho da equipe."
      }
    }
  ]
}
```

**Atenção:** as perguntas do schema devem ser idênticas ao texto visível na página para o Google validar.

### 5.3 — Article Schema (posts de blog)

Essencial para rich result de artigo (thumbnail + autor + data no SERP).

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "O que é Team Building e por que sua empresa precisa urgentemente",
  "author": {
    "@type": "Person",
    "name": "Mauro Gambini",
    "url": "https://positivemind.com.br/mauro-gambini"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Positive Mind",
    "logo": { "@type": "ImageObject", "url": "https://positivemind.com.br/favicon.svg" }
  },
  "datePublished": "2026-04-10",
  "dateModified": "2026-04-10",
  "image": "https://positivemind.com.br/photos/blog/o-que-e-team-building.jpg",
  "description": "Turn-over alto, comunicação falha, times desmotivados — esses problemas têm um nome e uma solução.",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://positivemind.com.br/blog/o-que-e-team-building" }
}
```

Os campos `datePublished` e `dateModified` vêm do campo `data` em `posts.js`. O campo `image` vem de `imagemCapa` (a adicionar em `posts.js`).

### 5.4 — BreadcrumbList (todas as páginas internas)

Aparece como trilha de navegação no resultado do Google abaixo do título — aumenta o espaço visual e CTR.

Padrão para qualquer página de nível 1 (ex: `/servicos`):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://positivemind.com.br/" },
    { "@type": "ListItem", "position": 2, "name": "Serviços", "item": "https://positivemind.com.br/servicos" }
  ]
}
```

Para posts de blog (nível 2):
```json
{
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://positivemind.com.br/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://positivemind.com.br/blog" },
    { "@type": "ListItem", "position": 3, "name": "O que é Team Building...", "item": "https://positivemind.com.br/blog/o-que-e-team-building" }
  ]
}
```

---

## Gap 6 — Evolução do Componente SEO

Para suportar os schemas acima sem duplicar código por página.

### Alteração no `SEO.jsx`

Adicionar prop `schema` que aceita **objeto único ou array** (algumas páginas precisarão de Service + FAQ + Breadcrumb simultâneos):

```jsx
export default function SEO({ titulo, descricao, canonical, image, tipo = 'website', schema }) {
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : []

  return (
    <Helmet>
      <title>{titulo_completo}</title>
      <meta name="description" content={descricao} />
      <link rel="canonical" href={url} />
      {/* ... OG e Twitter como estão ... */}

      {/* JSON-LD — um bloco por schema */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  )
}
```

### Exemplo de uso — página /servicos com múltiplos schemas

```jsx
<SEO
  titulo="Serviços"
  canonical="/servicos"
  descricao="..."
  schema={[
    { "@type": "Service", ... },
    { "@type": "FAQPage", ... },
    { "@type": "BreadcrumbList", ... }
  ]}
/>
```

### Adição para ArticleType — campos extras

Para posts de blog, adicionar suporte a `datePublished` e `dateModified` que não fazem parte dos meta tags padrão mas são obrigatórios para Article schema:

```jsx
export default function SEO({ ..., datePublished, dateModified }) {
  // Esses valores entram apenas no Article schema
  // passados via prop schema={{ "@type": "Article", "datePublished": datePublished, ... }}
}
```

Na prática, montar o schema inteiro no `BlogPost.jsx` e passar via prop `schema`.

---

## Gap 7 — Google Search Console

**Problema:** Sem GSC, não há visibilidade sobre erros de indexação, keywords gerando cliques, ou Core Web Vitals por URL.

**Setup:**
1. Acessar search.google.com/search-console
2. Adicionar propriedade: `positivemind.com.br` (tipo: domínio)
3. Verificar via registro DNS TXT no painel do provedor de domínio (método mais robusto)
4. Submeter sitemap: `https://positivemind.com.br/sitemap.xml`
5. Vincular GA4: GSC → Settings → Linked Products → Google Analytics

**O que monitorar mensalmente:**
- Queries com impressões altas mas CTR baixo → meta description fraca
- Páginas com erro 404 → broken links internos
- Core Web Vitals → LCP, CLS, INP por página
- Cobertura → páginas excluídas / bloqueadas por crawl

---

## Palavras-chave Prioritárias

| Keyword | Volume est./mês | Competição | Página-alvo | Status atual |
|---------|----------------|------------|-------------|--------------|
| team building São Paulo | 1.000–2.000 | Média | /servicos | Não rankeando |
| team building outdoor | 500–1.000 | Baixa | /servicos | Não rankeando |
| team building empresa | 800–1.500 | Média | /servicos | Não rankeando |
| fazenda team building SP | 200–500 | Baixa | /fazenda | Não rankeando |
| palestrante motivacional empresas | 500–1.000 | Média | /servicos | Não rankeando |
| leader coaching São Paulo | 300–600 | Baixa | /servicos | Não rankeando |
| Mauro Gambini | 100–300 | Sem concorrência | /mauro-gambini | Não indexado |
| hipnose clínica São Paulo | 1.000–3.000 | Alta | /mauro-gambini | Não indexado |
| team building outdoor Ibiúna | 50–200 | Muito baixa | /fazenda | Não rankeando |
| o que é team building | 2.000–5.000 | Baixa | /blog/o-que-e-team-building | Não indexado |

> Volumes estimados com base em dados públicos do Google Keyword Planner (maio/2026). Validar com conta GA4 + GSC após configuração.

---

## Estratégia de Link Interno

Link interno distribui PageRank entre páginas e ajuda o Google a entender hierarquia.

**Regras:**

| De | Para | Texto âncora sugerido |
|----|------|-----------------------|
| Home | /servicos | "Conheça nossos serviços" |
| Home | /mauro-gambini | "Mauro Gambini" |
| Home | /fazenda | "Fazenda Morros Verdes" |
| /servicos | /fazenda | "Team Building Outdoor na Fazenda Morros Verdes" |
| /servicos | /contato | "Solicite um diagnóstico gratuito" |
| /mauro-gambini | /servicos | "Leader Coaching" / "Team Building" |
| /clientes | /servicos | "Conheça os serviços" |
| /blog/{post} | /servicos | keyword relacionada ao post |
| /blog/{post} | /contato | "Fale com a Positive Mind" |
| Footer | Todas as páginas | Links já existentes ✅ |

**Regra geral:** cada página interna deve receber ao menos 2–3 links internos de outras páginas.

---

## Plano de Execução por Fase

### Fase 1 — Quick Wins (2–4 horas)

| Tarefa | Arquivo | Impacto |
|--------|---------|---------|
| ID GA4 real | `public/gtag-init.js`, `index.html` | Dados começam a ser coletados |
| Criar og-image.jpg (1200×630) | `public/og-image.jpg` | Previews sociais funcionando |
| SEO em MauroGambini.jsx | `src/pages/MauroGambini/` | Página indexada com título correto |
| SEO em Contato.jsx | `src/pages/Contato/` | Conversão orgânica habilitada |
| SEO em Clientes.jsx | `src/pages/Clientes/` | Prova social indexada |
| SEO em Fazenda.jsx | `src/pages/Fazenda/` | Keyword local /fazenda |
| SEO em Blog.jsx | `src/pages/Blog/` | Indexação do índice do blog |
| /infraestrutura no sitemap | `public/sitemap.xml` | Crawl da página |
| Posts de blog no sitemap | `public/sitemap.xml` | Crawl dos artigos |
| Configurar Google Search Console | — | Visibilidade de erros e keywords |

### Fase 2 — Schemas e Blog (4–6 horas)

| Tarefa | Arquivo | Impacto |
|--------|---------|---------|
| Prop `schema` no SEO.jsx | `src/components/common/SEO/SEO.jsx` | Infraestrutura para JSON-LD por página |
| SEO dinâmico + Article schema em BlogPost.jsx | `src/pages/Blog/BlogPost.jsx` | Rich results de artigo no Google |
| FAQPage schema em /servicos | `src/pages/Servicos/Servicos.jsx` | Accordion no Google |
| BreadcrumbList em todas as páginas | via prop `schema` | Trilha de navegação no SERP |
| Adicionar campo `imagemCapa` nos posts | `src/data/blog/posts.js` | Image no Article schema |

### Fase 3 — Crescimento Orgânico (contínuo)

| Tarefa | Cadência | Impacto |
|--------|----------|---------|
| Publicar posts no blog | 1–2/mês | Tráfego orgânico de cauda longa |
| Monitorar GSC — queries e erros | Mensal | Otimização contínua |
| Core Web Vitals — LCP < 2.5s | Trimestral | Fator de ranking de velocidade |
| Backlinks — parceiros, imprensa, citações | Contínuo | Autoridade de domínio |
| Service schema para cada serviço | Fase 3 | Rich results de serviço |
| Link building interno consistente | A cada nova página/post | Distribuição de PageRank |

---

## Checklist de Validação Pós-Implementação

**Após cada deploy que envolva SEO:**

- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) — colar URL da página
- [ ] [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] [Meta Tags Preview](https://metatags.io) — verificar título e descrição gerados
- [ ] [OG Image Preview](https://opengraph.xyz) — verificar preview social
- [ ] `positivemind.com.br/sitemap.xml` — abrir no browser, confirmar XML válido
- [ ] GSC → Cobertura → submeter URL para indexação após deploy
- [ ] GA4 → DebugView → pageview chegando na página nova
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) — LCP < 2.5s, CLS < 0.1

---

## Referências

- [Google Search Central](https://developers.google.com/search)
- [Schema.org — Tipos](https://schema.org/docs/full.html)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Core Web Vitals](https://web.dev/vitals/)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)
- [Google Search Console](https://search.google.com/search-console)
