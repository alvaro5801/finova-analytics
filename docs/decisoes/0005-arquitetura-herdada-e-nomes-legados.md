# ADR-0005: Preservar a arquitetura herdada e renomear só a camada de UI

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva

## Contexto

O template já tinha uma arquitetura sólida: Next.js App Router, rotas REST com envelope `{ data }` / `{ error }`, RTK Query com um hook por widget e Prisma com o adapter libSQL (SQLite local ou Turso). As restrições do projeto pediam para preservá-la.

O problema é que os nomes eram do domínio antigo: `SatisfactionRate`, `ReferralSummary`, `ActiveUsersPoint`, `/api/satisfaction`… e eles agora representam meta de receita, saúde financeira e volume de transações.

## Decisão

- **Mantidos:** rotas de API, modelos do Prisma, hooks RTK Query e o envelope de resposta.
- **Renomeados** (com `git mv`, preservando o histórico): os **componentes de UI**, para nomes que dizem o que mostram.

  | Antes | Depois |
  |---|---|
  | `WelcomeCard` | `MonthSummaryCard` |
  | `SatisfactionCard` | `RevenueGoalCard` |
  | `ReferralCard` | `FinancialHealthCard` |
  | `ProjectsCard` | `BudgetsCard` |
  | `OrdersCard` | `RecentTransactionsCard` |
  | `SalesOverviewCard` | `RevenueExpensesCard` |
  | `ActiveUsersCard` | `TransactionVolumeCard` |

- O significado financeiro de cada modelo fica documentado num comentário em `schema.prisma` e na tabela de API do `README.md`.

## Consequências

- ✅ Risco baixo: nenhuma rota ou contrato de API mudou de forma.
- ⚠️ Há uma dívida explícita: o nome do modelo não bate com o domínio. O próximo passo é renomear modelos e rotas juntos, numa fase própria, com migração.
