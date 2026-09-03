# PLANEJAMENTO DE SPRINTS — POSITIVE MIND WEBSITE
**Versão:** 1.1  
**Data:** Abril/2026  
**Stack:** React + Vite + Atlassian Design System (`@atlaskit`)  
**Deploy:** Vercel | **Domínio:** positivemind.com.br

---

## VISÃO GERAL DO PROJETO

| Item | Detalhe |
|---|---|
| Total de páginas | 8 |
| Total de sprints | 8 |
| Duração estimada por sprint | 3–5 dias úteis |
| Duração total estimada | 5–7 semanas |
| Idioma | Português (BR) |

---

## LEGENDA DE STATUS

| Símbolo | Significado |
|---|---|
| ⏳ | A fazer |
| 🔄 | Em andamento |
| ✅ | Concluído |
| 🔴 | Bloqueado (aguarda asset do cliente) |

---

## BLOQUEADORES CONHECIDOS

Assets pendentes do cliente — afetam sprints específicos:

| Asset | Bloqueio | Sprint afetada |
|---|---|---|
| Fotos dos treinamentos | Galeria, Hero background, Fazenda | Sprint 4 |
| Depoimentos em vídeo e texto | Seção Depoimentos (novo topo da Home) | Sprint 8 |
| Fotos e lista completa dos espaços de infraestrutura | Página Infraestrutura | Sprint 8 |
| Logos dos clientes em alta resolução | Seção Clientes | Sprint 2 |
| Razão social da empresa | Rodapé | Sprint 2 |
| Vídeo https://youtu.be/rqJFzpz360Q | Galeria | Sprint 4 |

> Enquanto assets não chegam: usar placeholders com dimensões corretas e notas "SUBSTITUIR".

---

## SPRINT 0 — SETUP DO PROJETO
**Objetivo:** Repositório configurado, stack rodando, design system instalado, tokens de cor do cliente aplicados.  
**Duração estimada:** 2–3 dias úteis

### Tarefas

#### 0.1 — Scaffolding
- [x] `npm create vite@latest positivemind-site -- --template react`
- [x] Configurar ESLint + Prettier
- [x] Configurar absolute imports (`@/components`, `@/pages`, `@/assets`)
- [x] Configurar `.gitignore` adequado
- [x] Commit inicial

#### 0.2 — Instalação do Atlassian Design System
```bash
npm install @atlaskit/button @atlaskit/tokens @atlaskit/theme
npm install @atlaskit/grid @atlaskit/heading @atlaskit/icon
npm install @atlaskit/primitives @atlaskit/css-reset
npm install @atlaskit/badge @atlaskit/tag
```

#### 0.3 — Configuração de Tokens (cores do cliente)
- [x] Criar `src/styles/tokens.css` com variáveis CSS personalizadas:
  ```css
  :root {
    --color-primary:    #F5A623;  /* laranja — MIND */
    --color-dark:       #0A0A0A;  /* preto — fundo */
    --color-gray:       #D4D4D4;  /* cinza — POSITIVE */
    --color-white:      #FFFFFF;
    --color-primary-hover: #E8951A;
    --color-primary-dark:  #C47D10;
  }
  ```
- [x] Sobrescrever tokens Atlassian para usar paleta Positive Mind
- [x] Configurar tema global (dark background padrão)

#### 0.4 — Tipografia
- [x] Importar Google Fonts: **Barlow Condensed** (bold/700) para headlines + **Inter** para corpo
- [x] Configurar escala tipográfica (`src/styles/typography.css`)

#### 0.5 — Estrutura de Pastas
```
src/
├── assets/
│   ├── images/         ← logo, mauro, placeholders
│   └── icons/
├── components/
│   ├── common/         ← Header, Footer, WhatsAppButton
│   ├── sections/       ← componentes de seção reutilizáveis
│   └── ui/             ← wrappers de componentes Atlaskit
├── pages/
│   ├── Home/
│   ├── Servicos/
│   ├── MauroGambini/
│   ├── Galeria/
│   ├── Clientes/
│   ├── Fazenda/
│   ├── Blog/
│   └── Contato/
├── styles/
│   ├── tokens.css
│   ├── typography.css
│   └── global.css
├── routes/             ← React Router v6
└── data/               ← conteúdo estático (JSON/JS)
```

#### 0.6 — Roteamento
- [x] Instalar React Router v6
- [x] Configurar rotas: `/`, `/servicos`, `/mauro-gambini`, `/galeria`, `/clientes`, `/fazenda`, `/blog`, `/contato`
- [x] Layout raiz com Header + Footer persistentes

#### 0.7 — Componentes Globais Base
- [x] `Header` — logo + menu navegação + CTA WhatsApp
- [x] `Footer` — contato, redes sociais, CNPJ, endereço
- [x] `WhatsAppButton` — botão flutuante fixo (canto inferior direito)
- [x] `SEOHead` — wrapper para meta tags por página

#### 0.8 — Assets Base
- [x] Copiar `logo-positivemind.jpg` e `mauro-gambini_perfil.jpeg` de `static/` para `src/assets/images/`
- [x] Criar arquivo `src/data/empresa.js` com todos os dados do cliente (números, contatos, links)

#### 0.9 — Deploy Base no Vercel
- [x] Conectar repositório ao Vercel
- [x] Configurar variáveis de ambiente (se necessário)
- [x] Preview URL funcionando

**Entregável:** Site em branco rodando na URL de preview do Vercel com Header, Footer e roteamento configurados.

---

## SPRINT 1 — LANDING PAGE: PARTE SUPERIOR
**Objetivo:** Seções 1–4 da Landing Page construídas e responsivas.  
**Duração estimada:** 4–5 dias úteis  
**Bloqueadores:** Nenhum (conteúdo disponível)

### Seções desta sprint

#### 1.1 — Hero (Seção 1)
**Conteúdo:**
- Headline: *"Transformamos equipes em times de alta performance"*
- Subheadline com proposta de valor
- Números em destaque: **170+ empresas** | **8.000+ profissionais** | **15+ anos**
- Embed do vídeo YouTube: https://www.youtube.com/watch?v=kBM7jKQYHEA
- CTA primário: botão WhatsApp → `(11) 94726-5463`
- Fundo: preto (#0A0A0A) com elemento visual laranja

**Componentes Atlaskit usados:** `@atlaskit/button`, `@atlaskit/heading`, `@atlaskit/primitives`  
**Componentes customizados:** `HeroSection`, `StatCounter`, `VideoEmbed`, `CTAButton`

#### 1.2 — Dor do Cliente (Seção 2)
**Conteúdo:** 6 cards com os problemas que a empresa resolve:
1. Turn-over alto
2. Comunicação interna falha
3. Falta de espírito de time e colaboração
4. Rendimento e produtividade baixos
5. Dificuldade de integração entre times
6. Liderança sem impacto

**Layout:** Grid 3×2 (desktop) / 2×3 (tablet) / 1×6 (mobile)  
**Estilo:** Cards com borda laranja, ícone, título, texto curto

#### 1.3 — Serviços (Seção 3)
**Conteúdo:** 4 cards de serviço:
1. Team Building Outdoor *(parceria Fazenda Morros Verdes)*
2. Team Building Indoor
3. Programa de Liderança — Leader Coaching *(4 meses)*
4. Palestrante Motivacional

**Layout:** Grid 4 colunas (desktop) / 2 colunas (tablet) / 1 coluna (mobile)  
**Interação:** Hover com elevação + cor laranja  
**Cada card:** Ícone + título + descrição curta + link "Saiba mais"

#### 1.4 — Diferenciais (Seção 4)
**Conteúdo:** Por que escolher a Positive Mind:
- 15+ anos de experiência
- Parceria exclusiva com Fazenda Morros Verdes Ecolodge
- Conexão com Ernesto Haberkorn (TOTVS)
- Metodologia própria (PNL, TCC, Coaching, Hipnose)
- Atendimento em todo o Brasil
- Foco em resultados mensuráveis

**Layout:** Alternado — texto | visual | texto | visual (desktop)

**Entregável:** Hero + Dor + Serviços + Diferenciais — responsivos, pixel-perfect com identidade visual.

---

## SPRINT 2 — LANDING PAGE: PARTE INFERIOR
**Objetivo:** Seções 5–11 da Landing Page + rodapé.  
**Duração estimada:** 4–5 dias úteis  
**Bloqueadores:** 🔴 Logos clientes, depoimentos, razão social

### Seções desta sprint

#### 2.1 — Fazenda Morros Verdes (Seção 5)
**Conteúdo:**
- Headline de destaque sobre a parceria
- Descrição da fazenda (Ibiúna/SP, Mata Atlântica, 1h30 de SP)
- Conexão com Ernesto Haberkorn (TOTVS) — diferencial
- Atividades: canoagem, trilhas, tirolesa, dinâmicas
- CTA para página `/fazenda`
- 🔴 Placeholder para fotos da fazenda

#### 2.2 — Cases de Sucesso (Seção 6)
**Conteúdo:**
- Card Ana Moser — vencedora do Aprendiz, Leader Coaching
- Card E.C. Pinheiros — time feminino Super Liga, Hipnose Esportiva
- Card Wagão — Técnico Seleção sub-21, Leader Coaching
- 🔴 Depoimentos em vídeo (embeds YouTube quando disponível)
- 🔴 Depoimentos em texto (cards com foto + nome + empresa)

**Fallback:** Seção construída com estrutura + texto dos cases — vídeos/depoimentos adicionados quando recebidos.

#### 2.3 — Mauro Gambini Teaser (Seção 7)
**Conteúdo:**
- Foto profissional (`mauro-gambini_perfil.jpeg`) ✅
- Nome + títulos
- Bio curta (versão disponível no doc)
- 8 especialidades listadas
- CTA: "Conheça a história completa" → `/mauro-gambini`

#### 2.4 — Galeria / Vídeos (Seção 8)
**Conteúdo:** Grid de embeds YouTube:
- Treinamento — poder do pensamento positivo: https://youtu.be/7H-VrSPYulw
- Treinamento PNL ao ar livre: https://www.youtube.com/watch?v=ydwPhFdOgbo
- Team Building: https://youtu.be/s7rlHWS2YBY
- O que é Team Building: https://youtu.be/ItpwBJtExoE

#### 2.5 — Clientes (Seção 9)
**Conteúdo:** 42 empresas atendidas  
**Layout:** Carrossel infinito com logos  
🔴 Logos em alta: usar nomes em texto estilizado como fallback  
**Lista completa:** Yamaha, Google, Asics, Danone, Dia%, Globo, Mastercard, E.C. Pinheiros, EMS, Porto Seguro, Ituran, 99, OAB São Paulo, Mercado Livre, DAEE, Scania, Syngenta, CI&T, Bunzl, Esperia, Fraga, FICO, Solvì, Premier Tech, Henry Peças, TOPdesk, Strategicos Group, Waelzholz, Almenat, Heidelberg, Flwow, Erpflex, Schneider Electric, Magna, SKF, Trilha Carreira, OTCA, Céu de Prata, LSEG, Voxline, Authentic Feet, Mercado Livre

#### 2.6 — CTA Final (Seção 10)
**Conteúdo:**
- Headline: *"Pronto para transformar sua equipe?"*
- Subheadline: diagnóstico gratuito
- CTA: WhatsApp + Email
- Fundo: laranja (#F5A623) com texto preto — máximo contraste e energia

#### 2.7 — Rodapé (Seção 11)
**Conteúdo:**
- Logo Positive Mind
- Navegação rápida (todas as páginas)
- Contato: email, WhatsApp, endereço
- Redes sociais: Instagram, YouTube
- CNPJ: 57.025.894/0001-91
- 🔴 Razão social (usar "Positive Mind" até confirmar)
- Copyright © 2026

**Entregável:** Landing Page 100% completa (com fallbacks para assets pendentes).

---

## SPRINT 3 — PÁGINAS: SERVIÇOS + MAURO GAMBINI
**Objetivo:** Duas páginas internas mais importantes do site.  
**Duração estimada:** 4–5 dias úteis  
**Bloqueadores:** Nenhum crítico

### 3.1 — Página Serviços (`/servicos`)

**Estrutura:**
- Hero da página com headline forte
- Seção Team Building Outdoor (destaque — parceria Fazenda)
  - Texto completo do serviço
  - Atividades documentadas: Operação Resgate, Futebol de Robô, Quick Games
  - 🔴 Fotos dos treinamentos
  - Embed vídeo: https://youtu.be/ItpwBJtExoE
- Seção Team Building Indoor
- Seção Programa de Liderança (Leader Coaching — 4 meses, detalhado)
- Seção Palestrante Motivacional
- CTA WhatsApp em cada seção
- FAQ básico (por que team building? como funciona? etc.)

### 3.2 — Página Mauro Gambini (`/mauro-gambini`)

**Estrutura completa (doc seção 15):**
- Hero: foto profissional + nome + títulos
- Bio longa (texto completo redigido no doc, seção 7)
- Especialidades (8 áreas)
- Formação e certificações (8 certificações com instituições)
- Cases notáveis: Ana Moser, E.C. Pinheiros, Wagão
- Programa de Liderança — Leader Coaching detalhado
- Hipnose Clínica (serviço individual separado)
- Hipnose Esportiva (E.C. Pinheiros)
- Vídeos em destaque:
  - Podcast com Ernesto Haberkorn: https://www.youtube.com/watch?v=N4IMEYnPlNE
  - A minha história: https://www.youtube.com/watch?v=-vPtW2YHIj4
- 🔴 Depoimentos de clientes específicos
- CTA: Agendar / contato direto WhatsApp

**Entregável:** `/servicos` e `/mauro-gambini` completas e linkadas do menu e Landing Page.

---

## SPRINT 4 — PÁGINAS: GALERIA + CLIENTES
**Objetivo:** Páginas de prova social — vídeos, fotos e logos.  
**Duração estimada:** 3–4 dias úteis  
**Bloqueadores:** 🔴 Fotos dos treinamentos, logos em alta, depoimentos em vídeo

### 4.1 — Página Galeria (`/galeria`)

**Estrutura:**
- Filtros: Todos | Vídeos | Fotos | Depoimentos
- Grid de vídeos YouTube (7 vídeos mapeados):
  - https://www.youtube.com/watch?v=kBM7jKQYHEA
  - https://youtu.be/ItpwBJtExoE
  - https://youtu.be/7H-VrSPYulw
  - https://www.youtube.com/watch?v=ydwPhFdOgbo
  - https://youtu.be/s7rlHWS2YBY
  - https://www.youtube.com/watch?v=N4IMEYnPlNE
  - https://www.youtube.com/watch?v=-vPtW2YHIj4
  - 🔴 https://youtu.be/rqJFzpz360Q (verificar)
- 🔴 Grid de fotos dos treinamentos (lightbox ao clicar)
- 🔴 Grid de depoimentos em vídeo

**Fallback:** Seção de fotos oculta com `// TODO` até receber assets.

### 4.2 — Página Clientes (`/clientes`)

**Estrutura:**
- Headline com número: 42+ empresas atendidas
- Grid de logos (alta resolução quando disponível)
- Fallback: lista estilizada com nomes das empresas
- Segmentação por setor (se possível identificar)
- Cases de sucesso em destaque (Ana Moser, E.C. Pinheiros, Seleção sub-21)
- CTA: *"Sua empresa pode ser a próxima"*

**Entregável:** `/galeria` e `/clientes` funcionais com todos os vídeos embedados e fallbacks para fotos/logos.

---

## SPRINT 5 — PÁGINAS: FAZENDA + BLOG
**Objetivo:** Página de parceria exclusiva + estrutura do blog.  
**Duração estimada:** 3–4 dias úteis  
**Bloqueadores:** 🔴 Fotos da Fazenda Morros Verdes

### 5.1 — Página Fazenda Morros Verdes (`/fazenda`)

**Estrutura:**
- Hero imersivo — natureza, Mata Atlântica (🔴 fotos pendentes)
- Sobre a fazenda: localização, estrutura, bioma
- Conexão com Ernesto Haberkorn (TOTVS) — história da parceria
- Atividades disponíveis:
  - Canoagem
  - Trilhas na Mata Atlântica
  - Tirolesa
  - Dinâmicas de grupo
  - Workshops motivacionais
- Estrutura da fazenda: bangalôs, apartamentos de luxo, pensão completa
- Galeria de fotos (🔴 pendente)
- CTA: *"Faça seu team building na fazenda"* → WhatsApp

### 5.2 — Página Blog (`/blog`)

**Estrutura:**
- Grid de posts com thumbnail, título, data, categoria, resumo
- Paginação
- Página individual de post (`/blog/:slug`)
- Posts iniciais: migrar os 2 posts existentes do Wix (⚠️ confirmar com cliente)
- Posts sugeridos para criação futura:
  - "O que é Team Building e por que sua empresa precisa"
  - "5 sinais de que sua equipe precisa de um treinamento"
  - "A diferença entre Team Building Indoor e Outdoor"
  - "Como o Leader Coaching transforma lideranças em 4 meses"

**Tecnologia do blog:** Conteúdo em Markdown (`/src/data/blog/`) — sem CMS por enquanto.

**Entregável:** `/fazenda` (com placeholders) e `/blog` com estrutura funcionando.

---

## SPRINT 6 — PÁGINA: CONTATO + SEO + ACESSIBILIDADE
**Objetivo:** Contato funcional, SEO configurado, acessibilidade básica garantida.  
**Duração estimada:** 3–4 dias úteis  
**Bloqueadores:** Nenhum

### 6.1 — Página Contato (`/contato`)

**Estrutura:**
- Formulário de contato:
  - Nome (obrigatório)
  - E-mail (obrigatório)
  - Empresa
  - Telefone / WhatsApp
  - Serviço de interesse (select: Team Building Outdoor, Indoor, Liderança, Palestrante)
  - Número de participantes (select: 10–30, 30–60, 60–100, 100+)
  - Mensagem / Objetivo do treinamento
  - Botão enviar
- Informações de contato direto:
  - WhatsApp: (11) 94726-5463
  - Email: maurogambini@positivemind.com.br
  - Instagram: @positivemindtreinamentos
  - YouTube: youtube.com/@CEOMauroGambini
- Endereço: Rua Guaranésia, 1070 — São Paulo/SP
- Integração: Formspree ou EmailJS (sem backend)

**Componentes Atlaskit:** `@atlaskit/form`, `@atlaskit/textfield`, `@atlaskit/select`, `@atlaskit/textarea`, `@atlaskit/button`

### 6.2 — SEO

- [x] Metatags por página (título, descrição, OG tags)
- [x] `sitemap.xml` gerado automaticamente
- [x] `robots.txt`
- [x] Schema.org markup (LocalBusiness, Person para Mauro)
- [x] Open Graph para compartilhamento em redes sociais
- [x] Favicon (baseado no logo)
- [ ] Google Analytics 4 — aguardando Measurement ID real (placeholder `G-XXXXXXXXXX` no `index.html`)

### 6.3 — Acessibilidade

- [ ] ARIA labels em componentes interativos
- [ ] Navegação por teclado testada
- [x] Contraste de cores validado (WCAG AA — laranja + preto tem excelente contraste)
- [ ] Alt text em todas as imagens
- [ ] Focus indicators visíveis

### 6.4 — Performance

- [x] Lazy loading de imagens
- [x] Embeds YouTube com thumbnail + click-to-load (evitar carregar iframes de cara)
- [ ] Otimização de imagens (WebP onde possível)
- [x] Code splitting por rota (lazy + Suspense em `App.jsx`)

**Entregável:** `/contato` funcional com envio de email, SEO configurado, performance otimizada.

---

## SPRINT 7 — QA + DEPLOY FINAL
**Objetivo:** Site aprovado, domínio apontado, Wix cancelável.  
**Duração estimada:** 2–3 dias úteis

### 7.1 — QA Completo

**Dispositivos/breakpoints a testar:**
- Mobile: 375px (iPhone SE), 390px (iPhone 14), 414px
- Tablet: 768px (iPad), 1024px (iPad Pro)
- Desktop: 1280px, 1440px, 1920px

**Navegadores:**
- Chrome, Firefox, Safari, Edge

**Checklist funcional:**
- [ ] Todos os links internos funcionando
- [ ] WhatsApp abre com número correto e mensagem pré-formatada
- [ ] Embeds de vídeo carregando
- [ ] Formulário de contato enviando
- [ ] Animações suaves (sem janks)
- [ ] Imagens com fallback se não carregarem
- [ ] Carrossel de clientes funcionando
- [ ] Menu hambúrguer no mobile
- [ ] Footer com informações corretas

### 7.2 — Deploy Final no Vercel

- [ ] Build de produção sem erros (`npm run build`)
- [ ] Preview final aprovado pelo cliente
- [ ] Domínio `positivemind.com.br` adicionado no Vercel
- [ ] DNS no Registro.br: configurar registros CNAME/A
- [ ] SSL automático (Vercel gerencia)
- [ ] Aguardar propagação: 24–48h
- [ ] Testar site no domínio final

### 7.3 — Handoff

- [x] Documentação de manutenção básica (como adicionar post no blog, atualizar dados)
- [x] Instruções para adicionar fotos/depoimentos pendentes
- [ ] Cancelamento do Wix (só após confirmar domínio funcionando)

**Entregável:** Site ao vivo em positivemind.com.br. Missão cumprida.

---

## SPRINT 8 — AJUSTES PÓS-REVISÃO MAURO GAMBINI
**Objetivo:** Reestruturar landing page, header e página de infraestrutura conforme feedback do cliente.  
**Duração estimada:** 3–4 dias úteis  
**Data do pedido:** Abril/2026  
**Status:** 🔄 Em andamento

### 8.1 — Reestruturação da Landing Page (Home)

**Nova ordem de seções — 11 seções:**

| Ordem | Seção | Componente | Status |
|---|---|---|---|
| 1 | Hero — badge "A Team Building Company" removido | `Hero` | ✅ |
| 2 | Depoimentos dos clientes em vídeo | `Depoimentos` (novo) | ✅ vídeos wireados |
| 3 | Cases de sucesso | `Cases` | ✅ |
| 4 | Anos de experiência | `AnosExperiencia` (novo) | ✅ |
| 5 | Dor do cliente | `DorDoCliente` | ✅ |
| 6 | Por que a Positive Mind | `Diferenciais` | ✅ |
| 7 | Mauro Gambini teaser | `MauroTeaser` | ✅ |
| 8 | Logos das empresas com animação | `Clientes` | ✅ |
| 9 | Serviços | `ServicosSection` | ✅ |
| 10 | Galeria de vídeos | `GaleriaVideos` | ✅ |
| 11 | CTA Final | `CTAFinal` | ✅ |

**Ajustes adicionais:**
- ✅ Badge "A Team Building Company" removido do Hero
- ✅ WhatsApp button: animação de brilho verde removida — botão simplificado
- ✅ `AnosExperiencia` criado como componente separado (stats extraídos do `Diferenciais`)

### 8.2 — Reestruturação do Header

**Sequência final aprovada:**

| Posição | Label | Rota | Status |
|---|---|---|---|
| 1 | Home | `/` | ✅ |
| 2 | Serviços | `/servicos` | ✅ |
| 3 | Infraestrutura | `/infraestrutura` | ✅ |
| 4 | Clientes | `/clientes` | ✅ |
| 5 | Mauro Gambini | `/mauro-gambini` | ✅ |
| 6 | Blog | `/blog` | ✅ |
| 7 | Contato | `/contato` | ✅ |

### 8.3 — Página Infraestrutura (`/infraestrutura`)

**7 espaços confirmados pelo Mauro:**

| Espaço | Localização | Tipo | Status |
|---|---|---|---|
| Hotel Fazenda Morros Verdes | Ibiúna/SP | Outdoor | ✅ (parceria Ernesto Haberkorn/TOTVS) |
| Refúgio Cheiro de Mato | Interior SP | Outdoor | ✅ |
| Hotel Vista Serrana | Interior SP | Indoor+Outdoor | ✅ |
| Clube Esperia | São Paulo/SP | Indoor+Outdoor | ✅ |
| Hotel Mavsa | Cesário Lange/SP | Resort | ✅ |
| Hotel Hípica Atibaia | Atibaia/SP | Outdoor (haras) | ✅ |
| Hotel Almenat | Interior SP | Indoor+Outdoor | ✅ |

🔴 **Pendente:** Fotos específicas de cada espaço para substituir placeholders

### 8.4 — Assets Recebidos

**Vídeos (`public/videos/`):**

| Arquivo | Uso | Status |
|---|---|---|
| `depoimento gregory.mp4` | Depoimentos (Home) | ✅ wireado |
| `rafael.mp4` | Depoimentos (Home) | ✅ wireado |
| `Anderson heidelberg.mp4` | Depoimentos (Home) | ✅ wireado |
| `Mastercard.mp4` | Depoimentos (Home) | ✅ wireado |
| `Schneider reduzido.mp4` | Depoimentos (Home) | ✅ wireado |
| `VOXLINE VIDEO.mp4` | Depoimentos (Home) | ✅ wireado |
| `Asics sales meeting.mp4` | Galeria | ⏳ não wireado ainda |
| `Google treinamento.mp4` | Galeria | ⏳ não wireado ainda |
| `OPERACAO RESGATE ALMENAT HOTEL.mp4` | Galeria / Infraestrutura | ⏳ não wireado ainda |
| `TEAM BUILDIND LSEG.mp4` | Galeria | ⏳ não wireado ainda |
| `Team Building Bunzl.mp4` | Galeria | ⏳ não wireado ainda |
| `Welcome - Positive mind.mp4` | Hero ou intro | ⏳ definir uso |

**Fotos (`public/photos/`):**
- ~110 fotos de treinamentos recebidas
- ⏳ Pendente: wirear nas páginas Galeria e Infraestrutura

**Pendências restantes:**

| Item | Status |
|---|---|
| Nomes completos dos depoentes (Gregory, Rafael) | 🔴 Confirmar com Mauro |
| Cargos e empresas dos depoentes | 🔴 Confirmar com Mauro |
| Fotos específicas por espaço | 🔴 Confirmar com Mauro |
| Wirear fotos na página Galeria | ⏳ A fazer |
| Wirear vídeos de treinamento na Galeria | ⏳ A fazer |

**Entregável:** Landing page reestruturada ✅ + header 7 links ✅ + página `/infraestrutura` 7 espaços ✅ + depoimentos wireados ✅

---

## RESUMO EXECUTIVO — CRONOGRAMA

| Sprint | Conteúdo | Duração | Status |
|---|---|---|---|
| **Sprint 0** | Setup: Vite + Atlaskit + tokens + roteamento + Header/Footer | 2–3 dias | ✅ |
| **Sprint 1** | Landing Page (Hero, Dor, Serviços, Diferenciais) | 4–5 dias | ✅ |
| **Sprint 2** | Landing Page (Fazenda, Cases, Mauro teaser, Galeria, Clientes, CTA, Footer) | 4–5 dias | ✅ |
| **Sprint 3** | Páginas `/servicos` + `/mauro-gambini` | 4–5 dias | ✅ |
| **Sprint 4** | Páginas `/galeria` + `/clientes` | 3–4 dias | ✅ |
| **Sprint 5** | Páginas `/fazenda` + `/blog` | 3–4 dias | ✅ |
| **Sprint 6** | Página `/contato` + SEO + acessibilidade + performance | 3–4 dias | ✅ |
| **Sprint 7** | QA completo + deploy final + handoff | 2–3 dias | 🔄 |
| **Sprint 8** | Reestruturação landing page + header + página infraestrutura | 3–4 dias | ⏳ |
| **TOTAL** | | **28–37 dias úteis** | 🔄 |

---

## DADOS CENTRAIS — REFERÊNCIA RÁPIDA

```js
// src/data/empresa.js
export const empresa = {
  nome: "Positive Mind",
  slogan: "A Team Building Company",
  cnpj: "57.025.894/0001-91",
  razaoSocial: null, // CONFIRMAR COM CLIENTE
  fundador: "Mauro Gambini",
  whatsapp: "5511947265463",
  whatsappFormatado: "(11) 94726-5463",
  email: "maurogambini@positivemind.com.br",
  endereco: "Rua Guaranésia, 1070 — São Paulo/SP",
  instagram: "https://instagram.com/positivemindtreinamentos",
  youtube: "https://youtube.com/@CEOMauroGambini",
  numeros: {
    empresas: "170+",
    profissionais: "8.000+",
    anos: "15+"
  }
}
```

---

## DECISÕES TÉCNICAS

| Decisão | Escolha | Motivo |
|---|---|---|
| Framework | React + Vite | Definido pelo cliente (doc seção 16) |
| Design System | Atlassian Design System (`@atlaskit`) | Definido pelo cliente |
| Roteamento | React Router v6 | Padrão React SPA |
| Formulário | Formspree | Sem backend necessário — escolha técnica definida |
| Animações | CSS transitions + Framer Motion (se necessário) | Leve, sem overhead |
| Blog | Markdown local — conteúdo novo baseado nos dados do cliente | Sem CMS por enquanto — simples de manter |
| Fontes | Barlow Condensed + Inter | Estilo industrial/condensado = alinhado ao logo |
| Deploy | Vercel | Definido pelo cliente (doc seção 16) |
| Imagens | Lazy loading + WebP | Performance mobile |
| YouTube embeds | Click-to-load (thumbnail first) | Performance / Core Web Vitals |

---

*Versão 1.1 — Abril/2026 — Atualizado com checkboxes e Sprint 8 (ajustes Mauro Gambini)*
