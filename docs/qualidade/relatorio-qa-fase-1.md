# Relatório de QA: Finova Analytics (FIN-08)

**Data:** 2026-11-15 · **Escopo:** fase 1 (FIN-00 a FIN-08) · **Base:** `91399f3`

Este relatório registra o que foi testado de fato e o que ficou de fora.

## 1. Verificações automatizadas

| Verificação | Comando | Resultado |
|---|---|---|
| Lint | `npm run lint` | ✅ 0 erros e 0 warnings |
| Tipos | `npx tsc --noEmit` | ✅ sem erros |
| Build de produção | `npm run build` | ✅ 22 páginas geradas, 11 rotas de API |
| E2E (Playwright, Chromium) | `npm run test:e2e` | ✅ **49 passaram**, 2 pulados de propósito (hover e busca não se aplicam ao celular), 0 falhas |

### Cobertura do E2E (×3 viewports: 1440, 768 e 390 px)

- 7 rotas: renderizam, sem erro no console, `scrollWidth <= innerWidth`.
- 404 em PT-BR.
- KPIs em BRL (`R$ 486.320,45`, `R$ 312.870,30`, `23,6%`).
- O filtro 3M/6M/12M muda `aria-pressed` e o texto do resultado.
- O tooltip mostra o mês por extenso, as séries e o resultado em BRL (desktop e tablet).
- Navegação: sidebar no desktop, drawer abaixo de 1024 px (o drawer fecha depois do clique).
- A busca de páginas (atalho `/` + Enter) navega para `/billing` (desktop e tablet).
- A prévia RTL aplica `dir=rtl` e restaura ao sair.
- O login simulado leva ao painel. O erro de validação da API aparece em PT-BR.
- Movimento reduzido: o KPI já tem o valor final no primeiro frame e a `transition-duration` dos cards fica abaixo de 1 ms.

## 2. Verificações manuais (screenshots via Playwright)

- Todas as rotas em 1440, 768 e 390 px foram inspecionadas visualmente.
- Truncamento dos KPIs medido em 10 larguras (320, 360, 390, 430, 768, 1024, 1280, 1366, 1440 e 1920 px): nenhum valor truncado depois do ajuste com container queries.
- Contraste calculado pela fórmula WCAG para os tokens principais:
  - `muted` sobre `surface`: 5,6:1
  - `primary-light` sobre `surface`: 6,6:1
  - branco sobre `primary`: 4,6:1
- Dados coerentes entre widgets: o resultado do mês é receita − despesas, a margem é calculada, a meta anual é calculada a partir da série, e as entradas/saídas e o total faturado são somados dos registros.

## 3. Critérios de aceite da spec

| Critério | Status |
|---|---|
| Aplicação inicia localmente sem erros | ✅ (`dev` e `start` verificados) |
| Identidade visual consistente | ✅ tokens únicos e 0 ocorrências de `#0075ff` e de classes de tema claro |
| Cards e gráficos com animações suaves | ✅ 200–400 ms na UI, 700 ms no desenho, 300 ms nas atualizações |
| Navegação funciona | ✅ coberto pelo E2E |
| Valores em BRL | ✅ coberto pelo E2E |
| Desktop, tablet e celular | ✅ coberto pelo E2E (overflow) e pela inspeção visual |
| Sem erros críticos no console | ✅ coberto pelo E2E |
| Build de produção passa | ✅ |
| Roteiro de demo de 5 min | ✅ [roteiro-demo.md](../apresentacao/roteiro-demo.md) |

## 4. O que NÃO foi testado

- **Outros navegadores:** só Chromium. Safari (iOS) e Firefox não foram testados.
- **Dispositivos reais:** apenas viewports emuladas. Nenhum teste em celular físico.
- **Leitor de tela:** os atributos ARIA foram aplicados (combobox, `aria-current`, `aria-pressed`, `role=alert`, rótulos de gráfico), mas nada foi verificado com NVDA ou VoiceOver.
- **Deploy Vercel + Turso:** não foi executado. O schema mudou, e o banco Turso precisa de `db:reset` (ação destrutiva, a ser feita por você).
- **Performance:** Lighthouse e Core Web Vitals não foram medidos.
- **Testes unitários:** não existem. `format.ts` é coberto indiretamente pelo E2E.

## 5. Problemas conhecidos (não bloqueantes)

- **RTL:** textos em português dentro do layout RTL mostram pontuação "invertida" (comportamento bidi esperado do navegador). Como a página é uma prévia de layout, a pontuação não foi tratada.
- **Botões sem ação:** sino de notificações sem ação (só tooltip). "PDF" e "Novo" estão marcados como `aria-disabled`.
- **`npm audit`:** reporta 18 vulnerabilidades (7 moderadas, 10 altas, 1 crítica). Elas **já existiam** antes deste trabalho (apareceram no primeiro `npm install`) e não foram tratadas para não atualizar versões fora do escopo.
- **Versões do Prisma:** CLI e client na 6.19 com `@prisma/adapter-libsql` na 7.9 (versões major diferentes). Funciona, mas vale alinhar.
- **npm 11:** não executou os install scripts de 6 pacotes (gate do `allowScripts`). O `prisma generate` roda pelo `postinstall` do próprio projeto, e o build passa.

## 6. Desvios da spec

- **D1 maior que o planejado:** além de `Invoice`, `Project` e `StatCard`, a migração alcançou `SalesPoint`, `OrderEvent`, `ActiveUsersStat`, `ReferralSummary` e `SatisfactionRate`, para que nenhum valor formatado ficasse no banco.
- **`src/app/api/**`:** só mudaram strings. As mensagens de erro foram traduzidas, e o usuário simulado agora se chama "Marina Costa" (era "Demo User"). Nenhuma lógica foi alterada.
- **Componentes renomeados:** `WelcomeCard` → `MonthSummaryCard`, `SatisfactionCard` → `RevenueGoalCard`, `ReferralCard` → `FinancialHealthCard`, `ProjectsCard` → `BudgetsCard`, `OrdersCard` → `RecentTransactionsCard`, `SalesOverviewCard` → `RevenueExpensesCard`, `ActiveUsersCard` → `TransactionVolumeCard`. Os renames foram feitos com `git mv`, preservando o histórico.
- **Prévia RTL:** voltou a inverter a direção do app, como o README original descrevia (o código não fazia isso).
- **Assets removidos:** os assets que ficaram órfãos foram excluídos: `public/icons/*.png`, `public/images/*` e `src/app/favicon.ico` (substituído por `app/icon.svg`).
- **ESLint:** passou a ignorar `.claude/`, `_bmad/` e `_bmad-output/` (os 3 erros do estado inicial vinham dessas ferramentas).
