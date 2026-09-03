# GUIA DE MANUTENÇÃO — POSITIVE MIND WEBSITE

> Este guia explica como fazer as tarefas de manutenção mais comuns sem precisar de desenvolvedor.

---

## 1. DEPLOY NO VERCEL (passo a passo)

### Pré-requisitos
- Conta no Vercel: vercel.com
- Repositório no GitHub conectado ao Vercel

### Passos
1. Push para o branch `main` → Vercel faz deploy automático
2. Acompanhar em: `vercel.com/dashboard`
3. URL de preview gerada a cada push

### Conectar domínio positivemind.com.br
1. No Vercel: Project → Settings → Domains → Add Domain → `positivemind.com.br`
2. Vercel vai exibir os registros DNS necessários (CNAME ou A)
3. No Registro.br: acessar `registro.br`, ir em DNS do domínio, adicionar os registros
4. Aguardar propagação: 24–48h
5. SSL é automático (gerenciado pelo Vercel)

---

## 2. ATIVAR O FORMULÁRIO DE CONTATO (Formspree)

1. Criar conta gratuita em: formspree.io
2. Criar novo Form → copiar o Form ID (ex: `xpwzgkqo`)
3. Abrir `src/pages/Contato/Contato.jsx`
4. Linha 7: substituir `'xpwzgkqo'` pelo ID real
5. Fazer push → deploy automático

---

## 3. ATIVAR GOOGLE ANALYTICS 4

1. Criar conta em: analytics.google.com
2. Criar Propriedade → Web → copiar o Measurement ID (formato `G-XXXXXXXXXX`)
3. Abrir `index.html`
4. Substituir as duas ocorrências de `G-XXXXXXXXXX` pelo ID real (linhas ~22 e ~24)
5. Fazer push → deploy automático

---

## 4. ADICIONAR POST NO BLOG

Arquivo: `src/data/blog/posts.js`

Adicionar objeto no array `posts`:

```js
{
  slug: 'url-do-post',           // sem espaços, só letras/hifens
  titulo: 'Título do Post',
  resumo: 'Resumo curto para o card na listagem (1-2 frases).',
  categoria: 'Team Building',    // Team Building | Liderança | Comportamento
  data: '2026-05-01',            // formato AAAA-MM-DD
  tempoLeitura: '5 min',
  conteudo: `
    <h2>Subtítulo da seção</h2>
    <p>Parágrafo do post...</p>
    <p>Outro parágrafo...</p>
    <h2>Outra seção</h2>
    <p>Continua...</p>
  `,
}
```

> O post aparece automaticamente na listagem `/blog` e na URL `/blog/url-do-post`.

---

## 5. ATUALIZAR DADOS DA EMPRESA

Arquivo: `src/data/empresa.js`

Dados atualizáveis:
- `whatsapp` e `whatsappFormatado` — número de contato
- `email` — email comercial
- `endereco` — endereço físico
- `razaoSocial` — preencher quando confirmar com cliente (atualmente `null`)
- `numeros.empresas`, `.profissionais`, `.anos` — métricas de credibilidade

---

## 6. ADICIONAR LOGO DE CLIENTE

Arquivo: `src/data/clientes.js`

Adicionar nome no array `clientes`:
```js
'Nova Empresa Ltda',
```

> Enquanto não houver logo em imagem, o carrossel exibe os nomes estilizados.
> Para adicionar logo real: salvar imagem em `src/assets/images/clientes/` e atualizar o componente.

---

## 7. CANCELAR O WIX

**Só cancelar após confirmar que `positivemind.com.br` está respondendo no novo site.**

1. Acessar conta Wix
2. Planos e Pagamentos → Cancelar assinatura
3. O domínio continua no Registro.br — independente do Wix

---

## 8. ASSETS PENDENTES DO CLIENTE

Quando receber, substituir os placeholders:

| Asset | Onde usar | Arquivo destino |
|---|---|---|
| Fotos dos treinamentos | Páginas Serviços, Galeria | `src/assets/images/treinamentos/` |
| Fotos da Fazenda Morros Verdes | Página Fazenda | `src/assets/images/fazenda/` |
| Logos dos clientes (alta res) | Carrossel Clientes | `src/assets/images/clientes/` |
| Depoimentos em vídeo | Seção Cases, Galeria | Embed YouTube — adicionar IDs em `src/data/videos.js` |
| Depoimentos em texto | Seção Cases | `src/data/` — criar `depoimentos.js` |

---

## 9. CHECKLIST DE QA (antes do deploy final)

### Funcional
- [ ] Todos os links do menu funcionando (todas as 8 páginas)
- [ ] WhatsApp abre com número correto: `(11) 94726-5463`
- [ ] Formulário `/contato` envia e exibe mensagem de sucesso
- [ ] Todos os vídeos YouTube carregam ao clicar (click-to-load)
- [ ] Carrossel de clientes funcionando
- [ ] Links do rodapé funcionando

### Breakpoints a testar
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 768px (iPad)
- [ ] 1280px (desktop)
- [ ] 1440px (desktop grande)

### Navegadores
- [ ] Chrome
- [ ] Safari
- [ ] Firefox

### SEO
- [ ] `positivemind.com.br/sitemap.xml` acessível
- [ ] `positivemind.com.br/robots.txt` acessível
- [ ] Título e descrição corretos em cada página
- [ ] Schema.org validado: search.google.com/test/rich-results

---

## 10. CONTATOS DO PROJETO

| Papel | Contato |
|---|---|
| Cliente | Mauro Gambini — `maurogambini@positivemind.com.br` |
| Dev | Kaique — `kaique.silvestre.22@gmail.com` |
