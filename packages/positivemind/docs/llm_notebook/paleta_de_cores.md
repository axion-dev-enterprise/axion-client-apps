# 🎨 Paleta de Cores e Identidade Visual

Este documento define as especificações cromáticas e os tokens de design do ecossistema visual da **Positive Mind** e de **Mauro Gambini**, projetado para garantir a consistência de marca no desenvolvimento de novos produtos, páginas e criativos.

---

## 🍊 1. Positive Mind (Design System)

A identidade visual da Positive Mind é fundamentada estritamente nas cores de seu logotipo oficial: **Laranja**, **Preto**, **Cinza Claro** e **Branco**.

### 🎨 Paleta de Cores Hexadecimal

| Nome | Hexadecimal | Uso Recomendado |
|---|---|---|
| **Laranja Principal** | `#F5A623` | Destaques, CTAs primários, links ativos e elementos-chave (`--pm-orange`). |
| **Laranja Hover** | `#E8951A` | Estados de hover em botões e interações (`--pm-orange-hover`). |
| **Laranja Escuro** | `#C47D10` | Estados pressed e contrastes especiais (`--pm-orange-dark`). |
| **Laranja Claro** | `#FBD08A` | Bordas suaves, fundos sutis e degradês (`--pm-orange-light`). |
| **Preto Absoluto** | `#0A0A0A` | Fundo principal da aplicação (`--pm-black`). |
| **Preto Suave** | `#141414` | Fundos secundários, seções alternadas (`--pm-black-soft`). |
| **Preto Card** | `#1A1A1A` | Fundo de cartões de informações e depoimentos (`--pm-black-card`). |
| **Preto Borda** | `#2A2A2A` | Divisórias e bordas sutis (`--pm-black-border`). |
| **Cinza Claro** | `#D4D4D4` | Texto do corpo principal, subtítulos secundários (`--pm-gray`). |
| **Cinza Médio** | `#9E9E9E` | Informações de suporte, metadados (`--pm-gray-mid`). |
| **Cinza Escuro** | `#555555` | Textos desativados, placeholders (`--pm-gray-dark`). |
| **Branco Puro** | `#FFFFFF` | Títulos principais (`<h1>` a `<h3>`), ícones de destaque (`--pm-white`). |

### 🛠️ Tokens de CSS do Design System (`tokens.css`)

```css
:root {
  /* Cores de Marca */
  --pm-orange:        #F5A623;
  --pm-orange-hover:  #E8951A;
  --pm-orange-dark:   #C47D10;
  --pm-orange-light:  #FBD08A;
  --pm-black:         #0A0A0A;
  --pm-black-soft:    #141414;
  --pm-black-card:    #1A1A1A;
  --pm-black-border:  #2A2A2A;
  --pm-gray:          #D4D4D4;
  --pm-gray-mid:      #9E9E9E;
  --pm-gray-dark:     #555555;
  --pm-white:         #FFFFFF;

  /* Sombras */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-card-hover: 0 8px 40px rgba(245, 166, 35, 0.25);
}
```

---

## 💻 2. Mauro Gambini (Wix Site & Cores Originais)

O site institucional de Mauro Gambini (`maurogambini.com.br`) foi desenvolvido utilizando a plataforma Wix e adota uma paleta baseada no tema original de transição para a Positive Mind.

### 🎨 Cores Identificadas no Site de Origem

*   **Laranja Suave / Pêssego:** `#FCAD64` (`--color_12` / `--color_19` / `--color_42`) — muito utilizado em elementos secundários e grafismos de apoio.
*   **Laranja Queimado / Coral:** `#FA9F1B` / `#fe9361` — cor de destaque para títulos no Wix.
*   **Verde Floresta / Ecolodge:** `#44912D` (`--color_17`) e `#47541B` (`--color_21`) — cores temáticas associadas à Fazenda Morros Verdes Ecolodge e sustentabilidade.
*   **Vermelho Destaque:** `#DA2128` (`--color_33`) — usado pontualmente para alertas ou avisos.

---

## 🧠 3. Aplicações para o Notebook LLM

Ao gerar copys ou projetar novas interfaces para estas marcas, o LLM deve:
1.  **Priorizar o Tema Escuro (Dark Mode):** O contraste principal é texto branco (`#FFFFFF`) e cinza claro (`#D4D4D4`) sobre fundo preto absoluto (`#0A0A0A`).
2.  **Cuidado com a Acessibilidade (WCAG):** O laranja principal (`#F5A623`) deve ser usado apenas para botões com texto preto interno ou títulos de tamanho grande para garantir legibilidade e contraste mínimos (relação 4.5:1).
3.  **Associação de Cores:** Laranja = Ação/Energia/Liderança. Preto = Profissionalismo/Sofisticação. Verde = Natureza/Fazenda/Outdoor.
