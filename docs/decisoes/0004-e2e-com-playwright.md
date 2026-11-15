# ADR-0004: Smoke E2E com Playwright contra build de produção

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (proposta de Murat/QA)

## Contexto

O projeto não tinha nenhum teste. O brief pedia QA manual e evitar dependências novas. Na análise de custo surgiu um ponto que mudou a conta: a validação de responsividade exigia checar **7 rotas × 3 viewports = 21 combinações**. Feito à mão, isso já é metade do tempo de QA. Automatizado, roda em segundos e se repete a cada mudança.

O Playwright é hoje o padrão de mercado para E2E, e o próprio guia de testes do Next.js 16 tem uma seção dedicada a ele.

## Decisão

- Adicionar `@playwright/test` como devDependency, a única dependência nova da fase 1.
- A suíte fica em `e2e/smoke.spec.ts`. Ela roda em 3 projetos (1440, 768 e 390 px) contra o **build de produção** (`webServer` com `next build && next start`).
- Cobertura:
  - 7 rotas sem erro no console e sem overflow horizontal;
  - BRL nos KPIs;
  - filtro de período e tooltip;
  - sidebar e drawer;
  - busca de páginas;
  - RTL, login e erro de validação;
  - movimento reduzido.

## Alternativas consideradas

- **Só QA manual:** mais barato hoje, sem regressão automatizada amanhã.
- **Cypress:** viável, mas o Playwright tem paralelismo nativo, vários browsers e melhor integração com a documentação do Next.

## Consequências

- ✅ Resultado da fase 1: 49 cenários passando e 2 pulados por não se aplicarem ao toque.
- ✅ A suíte serve de base para o CI.
- ⚠️ Os testes assumem os valores do seed (ex.: `R$ 486.320,45`). Mudou o seed, atualize o teste.
- ⚠️ Só roda em Chromium por enquanto.
- 💡 Lição registrada: o Next.js injeta um `route-announcer` com `role="alert"`. Seletores de alerta precisam ser escopados (`form >> role=alert`).
