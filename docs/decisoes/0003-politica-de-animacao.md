# ADR-0003: Política de animação e movimento reduzido

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (debate entre Sally/UX e Caravaggio, que defendiam 700 ms, e Amelia/dev, que defendia seguir os 200–400 ms do brief)

## Contexto

O brief pedia animações de 200–400 ms. Durante o planejamento surgiu a dúvida se o *desenho* de um gráfico se encaixa nessa faixa. As referências de mercado separam duas categorias:

- **Transições de interface:** o Material 3 usa 250–400 ms.
- **Desenho de gráficos:** o Chart.js usa 1000 ms por padrão, e o Recharts usa 1500 ms.

O template não tinha nenhum suporte a `prefers-reduced-motion`.

## Decisão

| Tipo | Duração |
|---|---|
| Transições de interface (hover, drawer, dropdown, entrada de cards) | 200–400 ms |
| Desenho de gráfico, só na **primeira montagem** | 700 ms |
| Atualização de dados (ex.: filtro de período) | 300 ms |
| Contagem dos KPIs | 700 ms, a mesma do desenho dos gráficos |
| Com `prefers-reduced-motion: reduce` | **0**: tudo aparece pronto |

O movimento reduzido é tratado em três camadas, porque cada biblioteca tem seu próprio mecanismo:

1. `MotionConfig reducedMotion="user"` cobre o Framer Motion.
2. `useReducedMotion()` + `isAnimationActive` cobre o Recharts, que ignora o `MotionConfig`.
3. Uma media query em `globals.css` cobre as transições e animações CSS (shimmer, hover, gauges).

## Consequências

- ✅ Os valores ficam centralizados em `motionTokens` (`src/lib/tokens.ts`).
- ✅ Há verificação automatizada: o E2E confirma que, com movimento reduzido, o KPI já mostra o valor final no primeiro frame e as transições CSS ficam abaixo de 1 ms.
- ⚠️ Toda biblioteca de animação nova precisa entrar nas três camadas.
