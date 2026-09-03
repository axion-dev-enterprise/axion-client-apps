# CHANGELOG — Positive Mind Website

Todas as mudanças significativas do projeto são documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Unreleased]

---

## Regras de conteúdo

### Sem emojis
Nenhum emoji deve ser usado em nenhuma página, seção ou componente do site.
Isso inclui: ícones decorativos em arrays de dados (`icone: '🌿'`), renders `<span aria-hidden="true">...</span>`, textos em botões, labels, badges ou qualquer outro elemento visual.

---

## [0.8.1] — 2026-04-30 — Logos de Clientes + Limpeza da Página Clientes

### Adicionado
- `public/photos/logos-clientes/` — 39 logos reais adicionadas à pasta pública (PNG/JPG/JFIF/WEBP)
- `src/data/clientes.js` — convertido de array de strings para array de objetos `{ nome, logo }` com paths para todas as 39 logos
- `src/data/clientesDetalhados.js` — campo `logo` adicionado em todos os 39 clientes

### Alterado
- `Clientes/Clientes.jsx` (seção carrossel — Home) — agora renderiza `<img>` com logo real; fallback texto para clientes sem logo; caixas `120×80px` com fundo branco, `object-fit: contain`, cor original (sem grayscale); hover: borda laranja
- `pages/Clientes/Clientes.jsx` — removidos: título do grid, subtítulo, filtros por setor, nome e badge de setor em cada card; grid agora exibe apenas logos em caixas quadradas (`aspect-ratio: 1/1`) com fundo branco e `padding: 16px`; removido state/filtro (`useState`, `setorAtivo`)
- `pages/Clientes/Clientes.module.css` — adicionados `.clienteLogoBox`, `.clienteLogo`; `.clienteInicial` adaptado para fallback de texto
- `Clientes/Clientes.module.css` — `.item` padronizado `120×80px` fundo branco; `.itemLogo` `object-fit: contain` sem filtro; `.itemTexto` fallback escuro

### Removido
- **DAEE** e **Erpflex** removidos de `clientes.js` e `clientesDetalhados.js` (sem logo disponível)
- Contagem atualizada de **42+** para **39** em todos os arquivos: `Clientes.jsx` (seção), `pages/Clientes/Clientes.jsx` (PageHero, stats, CTA), aria-labels e nota do carrossel

---

## [0.8.0] — 2026-04-29 — Sprint 8: Reestruturação da Landing Page

### Alterado
- `Home.jsx` — nova sequência de seções: Hero → Clientes → Cases → AnosExperiencia → DorDoCliente → Diferenciais → ServicosSection → TreinamentosEmAcao → CTAFinal
- `Home.jsx` — removidas seções `Depoimentos` e `MauroTeaser` da landing page
- `Cases/Cases.jsx` — cases substituídos por empresas com foto real (CT&T, Floresta Esperia, Soul Elite); cards agora têm imagem 16:9 no topo com tag overlay
- `AnosExperiencia/AnosExperiencia.jsx` — foto `_CR_0156.jpg` adicionada como background com overlay escuro; layout original (texto esquerda, stats direita) mantido; parallax no desktop
- `ServicosSection/ServicosSection.jsx` — emojis substituídos por fotos por tipo de serviço: Outdoor (`equipe floresta esperia1.jpeg`), Indoor (`ct&t foto equipe3.jpeg`), Liderança (`_CR_9977.jpg`), Palestrante (`_CR_9930.jpg`)
- `Header/Header.jsx` — hide-on-scroll: header some ao rolar para baixo e reaparece ao rolar para cima
- `Clientes/Clientes.jsx` — removida seção "Cases de destaque" da página de clientes

---

## [0.7.0] — 2026-04-27 — Sprint 7: GA4 + Handoff

### Adicionado
- `index.html` — Google Analytics 4 (placeholder `G-XXXXXXXXXX` — substituir pelo ID real antes do deploy)
- `docs/HANDOFF.md` — guia completo de manutenção: Formspree, GA4, blog, clientes, deploy Vercel, DNS Registro.br, cancelar Wix, assets pendentes, checklist QA

### Verificado (QA de código)
- Todos os links internos cobrem as 8 rotas — Header (7) + Footer (8) ✅
- Todas as `<img>` têm `alt` text ✅
- `vercel.json` com SPA rewrites + security headers + cache immutable ✅
- WhatsApp: todos os pontos usam `whatsappLink()` de `empresa.js` — número `5511947265463` ✅
- Build produção: ✅ sem erros — 177.69 kB JS / 13.83 kB CSS

### Pendente (ações manuais — não-código)
- Substituir `G-XXXXXXXXXX` no `index.html` pelo Measurement ID GA4 real
- Substituir `xpwzgkqo` no `Contato.jsx:7` pelo Form ID Formspree real
- QA manual: 375/768/1280/1440px — Chrome/Safari/Firefox
- Deploy: conectar repo ao Vercel + domínio + DNS Registro.br
- Cancelar Wix após confirmar domínio

---

## [0.6.0] — 2026-04-27 — Sprint 6: Contato + SEO + Performance

### Adicionado
- `src/pages/Contato/Contato.jsx` — página `/contato` completa:
  - Formulário com 7 campos (nome, email, empresa, telefone, serviço, participantes, mensagem)
  - Integração com Formspree (sem backend) — estado idle/sending/success/error
  - Sidebar com botão WhatsApp verde, email, endereço, redes sociais
  - Responsivo 2 colunas → 1 coluna mobile
- `public/sitemap.xml` — sitemap estático com 8 URLs e prioridades
- `public/robots.txt` — permite todos os crawlers, aponta para sitemap
- `index.html` — Schema.org JSON-LD:
  - `LocalBusiness` com nome, telefone, email, endereço, redes sociais, founder
  - `Person` (Mauro Gambini) com jobTitle, knowsAbout, alumniOf
  - `<link rel="sitemap">` apontando para `/sitemap.xml`

### Melhorado
- `src/App.jsx` — code splitting com `React.lazy` + `Suspense` em todas as 9 rotas
  - Cada página virou chunk JS independente (9 chunks separados)
  - Loader animado (spinner laranja) exibido durante carregamento de rota

### Técnico
- Build de produção: ✅ sem erros — 177.69 kB JS bundle principal / 58.93 kB gzip
- Code splitting: 9 page chunks + 5 shared chunks (VideoEmbed, CTAFinal, PageHero, videos, posts)
- VideoEmbed já tinha click-to-load (thumbnail first) ✅ — nenhuma alteração necessária
- Focus ring acessível (`outline: 2px solid var(--pm-orange)`) já em `global.css` ✅
- ARIA labels em formulário: `aria-label`, `aria-busy`, `aria-required`, `role="alert"` ✅

### Pendente (para Sprint 7)
- Trocar `FORMSPREE_ID` em `Contato.jsx` pelo ID real da conta Formspree do cliente
- Google Analytics 4 (na Sprint 7, antes do deploy final)

---

## [0.1.0] — 2026-04-27 — Sprint 0: Setup do Projeto

### Adicionado
- Scaffolding manual do projeto React + Vite (sem CRA)
- Configuração de absolute imports via alias `@/` no `vite.config.js`
- Instalação do Atlassian Design System (`@atlaskit/*`) com `--legacy-peer-deps`
- Instalação do React Router v6 para SPA com 8 rotas
- `src/styles/tokens.css` — variáveis CSS com paleta Positive Mind (#F5A623, #0A0A0A, #D4D4D4, #FFFFFF) sobrescrevendo tokens padrão Atlaskit (azul → laranja)
- `src/styles/typography.css` — escala tipográfica com Barlow Condensed (headlines) + Inter (corpo)
- `src/styles/global.css` — reset, scroll suave, scrollbar customizada, focus ring acessível
- `src/data/empresa.js` — dados centrais da empresa (contato, números, redes sociais, helper `whatsappLink()`)
- `src/data/clientes.js` — lista completa das 42 empresas atendidas
- `src/data/videos.js` — inventário dos 7 vídeos do YouTube mapeados
- `src/components/common/Header/` — header fixo com scroll-aware (transparente → preto fosco), nav responsiva, menu hambúrguer mobile, CTA WhatsApp
- `src/components/common/Footer/` — rodapé com 3 colunas (marca, navegação, contato), redes sociais, CNPJ
- `src/components/common/WhatsAppButton/` — botão flutuante fixo com tooltip hover
- `src/components/common/Layout/` — wrapper Layout com Header + Footer + WhatsAppButton
- `src/App.jsx` — roteamento completo das 8 páginas
- `src/main.jsx` — entry point com BrowserRouter e imports de estilos globais
- `index.html` — meta tags base, Google Fonts (Barlow Condensed + Inter), lang="pt-BR"
- Páginas placeholder para todas as 8 rotas (Home, Serviços, Mauro Gambini, Galeria, Clientes, Fazenda, Blog, Contato)
- Assets copiados de `static/` para `src/assets/images/` (logo + foto Mauro Gambini)
- `.gitignore` configurado
- `docs/SPRINT_PLANNING.md` — planejamento completo com 7 sprints, tarefas, bloqueadores e decisões técnicas

### Técnico
- Build de produção: ✅ sem erros — 174.98 kB JS / 13.83 kB CSS (gzipado: 57.51 kB / 3.65 kB)
- Dev server: `http://localhost:5173`
- Deploy: Vercel (a configurar na Sprint 7)
