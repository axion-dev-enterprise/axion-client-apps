# Plano de montagem do MVP — fase de validação

## 1. Pergunta que será respondida

**Estudantes brasileiros estudam por videochamada com um parceiro compatível
indicado pela plataforma e desejam repetir a sessão?**

Esta fase mede comportamento, não interesse declarado. Uma lista de espera ou
clique em anúncio não é evidência suficiente.

## 2. Coorte inicial

| Dimensão | Definição inicial | Por quê |
| --- | --- | --- |
| Público | Maiores de 18 anos, preparando ENEM/vestibular | Reduzir risco jurídico e concentrar a aprendizagem inicial. |
| Geografia | Brasil | Mantém idioma, fuso e contexto educacional comuns. |
| Oferta | Sessão de estudo focada de 50 minutos | Formato simples, comparável e fácil de avaliar. |
| Capacidade | Agenda limitada por blocos de horário | Evita prometer match quando não há densidade. |
| Canais | Comunidades estudantis, conteúdo orgânico e convites | Aprender aquisição antes de escalar mídia paga. |

O recorte 18+ é uma proteção operacional provisória. Não implica que menores
serão excluídos do produto definitivo; a expansão exige validação jurídica e
controles específicos.

## 3. Fluxo operacional

```text
Landing page → cadastro consentido → formulário → triagem de segurança
→ matching manual → confirmação bilateral → link de videochamada
→ sessão de 50 min → pesquisa pós-sessão → convite para repetir
```

### Dados mínimos do formulário

- Primeiro nome ou apelido, e-mail e confirmação de maioridade.
- Matéria/objetivo, nível percebido e prova-alvo.
- Blocos de disponibilidade, duração desejada e preferência de câmera.
- Preferências essenciais de match: tema, horário e formato de estudo.
- Aceite de regras de convivência e canal de denúncia/bloqueio.

Não solicitar telefone, redes sociais ou dados sensíveis. O contato e a sessão
permanecem nos canais definidos pela operação.

## 4. Matching manual v1

1. Agrupar primeiro por janela de horário, depois por matéria/objetivo.
2. Priorizar compatibilidade simples; não introduzir filtros que reduzam a
   densidade antes de haver dados.
3. Enviar o perfil mínimo do possível parceiro a ambos e pedir aceite explícito.
4. Criar a sessão apenas após aceite bilateral.
5. Registrar motivo de recusa, ausência e encerramento antecipado em categorias
   padronizadas, sem texto livre com dados pessoais desnecessários.

## 5. Segurança operacional mínima

- Código de conduta visível antes da confirmação.
- Saída imediata da sessão e canal de denúncia/bloqueio em toda comunicação.
- Não compartilhar contatos pessoais nem links externos dentro do fluxo.
- Revisão humana de toda denúncia e suspensão preventiva quando necessária.
- Dados de matching acessíveis somente à operação; registrar apenas o mínimo
  necessário e definir prazo de retenção antes da captação pública.
- Nenhuma sessão com menores na fase de validação atual.

## 6. Instrumentação e métricas

Usar identificadores pseudônimos para conectar as etapas do funil. Registrar
evento, data/hora, status e motivo padronizado de falha.

| Métrica | Fórmula | Pergunta respondida |
| --- | --- | --- |
| Match rate | participantes com match / participantes elegíveis | Há densidade suficiente? |
| Match → call | chamadas iniciadas / matches aceitos | O match vira encontro real? |
| Completion | sessões concluídas / chamadas iniciadas | O formato funciona até o fim? |
| Repeat rate | participantes com 2ª sessão / participantes com 1ª | Há valor recorrente? |
| Buddy rate | pares que escolhem repetir juntos / pares concluídos | A relação recorrente emerge? |
| Report rate | denúncias / sessões iniciadas | A operação está segura? |

O painel operacional deve também acompanhar: tempo de pareamento, no-shows,
motivo de desistência, satisfação e percepção de produtividade.

## 7. Critérios de decisão após 100 sessões

Os limiares abaixo são hipóteses de trabalho, não metas a manipular. A decisão
considera volume, segurança e evidência qualitativa em conjunto.

| Sinal | Continuar e automatizar parcialmente | Reavaliar antes de construir |
| --- | --- | --- |
| Match rate | >= 70% dos elegíveis recebem match | Densidade insuficiente ou filtros excessivos |
| Match → call | >= 55% dos matches aceitos iniciam chamada | Convite, confiança ou agenda falham |
| Completion | >= 70% das chamadas chegam ao fim | Formato ou compatibilidade falham |
| Repeat rate | >= 30% fazem uma segunda sessão | Valor recorrente não demonstrado |
| Segurança | Nenhum padrão grave sem resposta e processo confiável | Qualquer risco grave ou recorrente é bloqueador |

Se os indicadores de segurança falharem, o ciclo é interrompido mesmo que as
métricas de crescimento sejam positivas.

## 8. Cadência proposta (quatro semanas)

| Semana | Objetivo | Entrega verificável |
| --- | --- | --- |
| 0 | Preparar operação e regras | Landing/formulário, código de conduta, planilha de funil e pesquisa pós-sessão. |
| 1 | Rodar piloto controlado | Primeiras 10–20 sessões e revisão dos motivos de falha. |
| 2 | Ajustar e aumentar a agenda | Matching refinado por evidência, sem adicionar produto desnecessário. |
| 3–4 | Atingir amostra de decisão | 100 sessões, relatório de funil e decisão GO/NO-GO para automação. |

## 9. Próxima entrega de produto, se houver sinal positivo

Automatizar somente os gargalos comprovados: onboarding, disponibilidade,
matching básico, confirmação/agendamento, histórico de sessões e métricas.
Vídeo próprio, pagamentos, chat aberto, gamificação e marketplace permanecem
fora do primeiro produto automatizado.
