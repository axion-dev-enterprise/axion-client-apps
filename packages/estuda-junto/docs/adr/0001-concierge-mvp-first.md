# ADR-0001 — Validar por operação concierge antes de automatizar

- **Status:** Aceito
- **Data:** 2026-09-01
- **Contexto:** O maior risco do produto é comportamental: estudantes podem não
  se sentir à vontade para estudar por vídeo com alguém desconhecido ou podem
  não retornar após a primeira experiência.

## Decisão

Executar a fase inicial com landing page, cadastro, matching manual, ferramenta
de videochamada de terceiro e pesquisa pós-sessão. A equipe acompanhará o
funil em uma base operacional com acesso restrito.

## Consequências

- Valida o comportamento com menor custo e em poucas semanas.
- Exige operação humana e disponibilidade limitada, o que é aceitável nesta
  fase.
- Não gera validação de escalabilidade técnica.
- Não serão coletados dados além do necessário para matching, segurança e
  métricas; a política de retenção deve ser definida antes da captação pública.
