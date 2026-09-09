# 🏠 CASA+ — Plataforma de Assistência e Manutenção Residencial

> **Slogan:** *Sua casa cuidada o ano inteiro.*  
> **Versão:** 1.0.0 (MVP para Validação Comercial)  
> **Ecossistema:** AXION Enterprise (`axion-client-apps/packages/casa-mais`)  
> **Deploy:** Vercel (`casa-mais.vercel.app`)

---

## 🌟 Visão Geral do Produto

O **CASA+** é a plataforma digital de assinatura de assistência e manutenção residencial que conecta clientes a uma rede qualificada de profissionais (chaveiro, encanador, eletricista, pequenos reparos, dedetização, limpeza de caixa d'água e eletrodomésticos) através de mensalidades previsíveis e acionamento simplificado via smartphone.

---

## 💳 Modelo de Assinaturas (3 Planos)

1. **Plano Essencial — R$ 29,90/mês**:
   - Chaveiro 24h
   - Eletricista residencial
   - Encanador & Desentupimento
   - Pequenos reparos
   - Descontos em serviços adicionais

2. **Plano Família — R$ 49,90/mês (Mais Popular)**:
   - Tudo do Essencial
   - 1 Dedetização anual completa
   - 1 Limpeza preventiva de caixa d’água anual
   - 1 Inspeção preventiva anual
   - Franquia de utilização ampliada

3. **Plano Premium — R$ 79,90/mês (Completo VIP)**:
   - Tudo do Família
   - 2 Dedetizações anuais completas
   - 2 Visitas preventivas anuais
   - Assistência para eletrodomésticos (Lavadora, Geladeira, Fogão)
   - Máxima prioridade no despacho

---

## 📱 Módulos & Rotas do Sistema

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Landing Page de Alta Conversão com os 7 Serviços e Planos | Público |
| `/checkout?plano=...` | Checkout de Assinatura Recorrente (Cartão + PIX) com Cupom | Público |
| `/cliente` | Dashboard "Meu Casa+" com Contador Dinâmico de Franquias | Assinante |
| `/cliente/chamados/novo` | Wizard em 5 Passos para Abertura de Chamado | Assinante |
| `/cliente/chamados/[id]` | Timeline em Tempo Real dos 8 Estados e Avaliação 1-5 Estrelas | Assinante |
| `/prestador` | Painel do Técnico com Aceite/Recusa e Finalização com Fotos Antes/Depois | Prestador |
| `/admin` | Painel Administrativo Master com DRE, KPIs, Despacho e Editor sem Hardcode | Administrador |
| `/api/health` | Sonda de Saúde RFC 7807 | Público |
| `/api/requests` | API de Chamados com Validação Automática de Cotas | Autenticado |
| `/api/webhooks/payments` | Receptor de Webhooks de Pagamento Recorrente | Gateway |

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 14/15 App Router (TypeScript + React 18)
- **Design System:** Padrão Big Tech (Inter + Plus Jakarta Sans) com 100% SVG Lucide Isomórfico (Zero Emojis como ícones em UI)
- **Persistência:** Camada Relacional In-Memory + Sincronização Dinâmica em `/tmp/casa_mais_store.json` (Resiliente para Vercel Serverless)
- **Controle de Cotas:** Motor que calcula utilizações no período e impede abertura acima do limite contratado (Requisito #20)
- **Regras Dinâmicas:** Cidades, preços e limites editáveis via painel sem nada fixo no código (Requisito #35)

---

## 🚀 Execução Local

```bash
# Entrar no subpacote
cd packages/casa-mais

# Instalar dependências (via PNPM na raiz do monorepo)
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev # http://localhost:3085
```
