# Quick Spec — Finova Analytics

> Spec técnica da fase 1, aprovada antes da implementação. Requisitos de produto: [PRD inicial](prd-inicial.md). Decisões detalhadas: [ADRs](../decisoes/README.md).

**Data:** 2026-11-15 · **Base:** `vision-dashboard` @ `91399f3` · **Status:** ✅ implementada em 2026-11-15 (ver [relatório de QA](../qualidade/relatorio-qa-fase-1.md)) · aprovada em 2026-11-15 (D1, D4 e D5 conforme recomendação de mercado, sem cortes) · **Orçamento:** ~9h20

## 1. Objetivo

Transformar o Vision Dashboard em **Finova Analytics**, um SaaS financeiro premium em dark mode, com animações sóbrias (200–400 ms) e navegação fluida, para apresentar em uma entrevista de Desenvolvedor Full Stack. A arquitetura atual é preservada: não haverá novo backend, mudança de schema nem serviços externos.

## 2. Auditoria (estado atual)

**Stack:** Next.js 16.2.11 (App Router, Turbopack) · React 19.2 · TypeScript · Tailwind v4 (`@theme inline`) · Redux Toolkit + RTK Query · Framer Motion 12 · Recharts 3 · lucide-react · Prisma 6.19 + `@prisma/adapter-libsql` 7.9 (SQLite local / Turso).

**Estrutura:** 7 páginas (`/dashboard`, `/tables`, `/billing`, `/profile`, `/rtl`, `/sign-in`, `/sign-up`, e `/` redireciona) · 11 rotas de API com envelope `{ data }` / `{ error }` · 1 hook RTK Query por widget, com skeleton e estado de erro isolado · `prisma/dev.db` versionado no git.

**Scripts:** `dev`, `build`, `start`, `lint`, `postinstall: prisma generate`, `db:push`, `db:seed`, `db:reset`.

### Problemas encontrados

| # | Problema | Onde | Impacto |
|---|---|---|---|
| A1 | `node_modules` não instalado; build e lint ainda não foram verificados | raiz | Bloqueia a validação até `npm install` |
| A2 | `prisma` 6.19 com `@prisma/adapter-libsql` 7.9 (versões major diferentes) | `package.json` | Risco no `prisma generate` e em runtime |
| A3 | Paleta Vision UI (`#0075ff`) fixada no código 16 vezes; gradiente de card inline repetido em 7 arquivos | `components/**` | Retematizar exige tokens e não só trocar cores |
| A4 | Classes de tema claro sobre fundo escuro (`text-slate-700`, `border-slate-100`, `bg-rose-50`): 40 ocorrências | `billing/*`, estados de erro | **Billing fica praticamente ilegível** |
| A5 | Domínio não é financeiro: "Today's Users", "Satisfaction Rate", "Referral Tracking", projetos com logos de Figma/Slack/Spotify/Jira/InVision, autores `@creative-tim.com` | `seed.ts`, cards | O produto parece um reskin e não um SaaS financeiro |
| A6 | Valores monetários são **strings** no banco (`"$53,000"`) em `StatCard.value`, `Project.budget` e `Invoice.amount` | `schema.prisma` | Para usar BRL é preciso trocar o seed (ver D1) |
| A7 | Nenhum suporte a `prefers-reduced-motion` | todo o app | Requisito do FIN-06 |
| A8 | Alturas fixas por linha (`h-[320px]`, `h-[445px]`, `h-[500px]`) e larguras fixas no `ReferralCard` (cerca de 480 px de conteúdo) | `dashboard/page.tsx`, `ReferralCard.tsx` | Overflow provável em 390 px |
| A9 | `WelcomeCard`: imagem de água-viva, "Dohn Jon", "Tap to record". Body usa `background.jpg` | `WelcomeCard.tsx`, `globals.css` | Identidade fora do produto |
| A10 | Busca da navbar é só visual (não faz nada) | `Navbar.tsx` | Risco na demo se clicarem nela |
| A11 | `lang="en"`, título "Vision UI Dashboard", auth com marca "Material Dashboard" | `layout.tsx`, `(auth)/layout.tsx` | Marca inconsistente |
| A12 | `Card` usa `hover:border-white/25`, mas não tem borda | `ui/Card.tsx` | O hover não tem efeito |
| A13 | Nenhum teste automatizado | — | O QA será manual + build + lint |

## 3. Decisões técnicas

| ID | Decisão | Padrão proposto | Alternativa |
|---|---|---|---|
| D1 | Armazenamento de dinheiro | ✅ **Aprovado: inteiros em centavos.** `Invoice.amountCents`, `Project.budgetCents` (nullable), `SalesPoint.revenueCents/expensesCents`, `OrderEvent.amountCents` (com sinal). Métricas mistas (`StatCard`, `ActiveUsersStat`, `ReferralSummary`) passam a `value Int` + `format` (`currency` = centavos · `percent` = pontos-base · `number`). Formatação só na UI (`src/lib/format.ts`). Datas de fatura viram `DateTime` | Strings formatadas no seed (descartada) |
| D4 | Duração da animação de desenho dos gráficos | ✅ **Aprovado: 700 ms só na primeira montagem**, 300 ms nas atualizações (filtro de período) e 0 com reduced motion. Transições de UI ficam em 200–400 ms | 400 ms fixos (descartada) |
| D5 | Teste automatizado | ✅ **Aprovado: smoke test com Playwright** (`@playwright/test`, devDependency) parametrizado em 7 rotas × 3 viewports, com verificação de overflow e de erros no console. Substitui a checagem manual do FIN-07 | Só QA manual (descartada) |
| D6 | Busca da navbar | **Busca de páginas** (filtra itens do menu e navega com Enter), sem backend | Manter só visual e evitar na demo |
| D7 | Fonte | **Geist** via `next/font/google`, com `tabular-nums` nos valores | Inter |
| D8 | Dados de demonstração | Badge "Demo" visível na navbar e e-mails `@finova.example` (TLD reservado) | — |

## 4. Stories e critérios de aceite

### FIN-00 · Fundação técnica · P0 · 20 min *(nova, pré-requisito)*
- `npm install` (o `postinstall` roda `prisma generate`), leitura dos guias relevantes em `node_modules/next/dist/docs/` (fontes, metadata, `app/icon`) e baseline de `npm run lint` e `npm run build` **antes** de qualquer mudança.
- **AC:** existe o registro do estado inicial (passa ou falha, com a saída). Falhas anteriores ficam documentadas e não são atribuídas ao trabalho novo.

### FIN-01 · Identidade visual · P0 · 1h
- Tokens no `@theme` de `globals.css`: `bg #090E1A`, `surface #151D30`, `primary #7958F5`, `accent #22D3EE`, `text #E8EDF7`, mais derivados (`muted`, `border`, `success`, `danger`, `warning`), raios, sombras, durações (`200/300/400ms`) e easing.
- Geist como fonte, `lang="pt-BR"`, metadata "Finova Analytics", logo Finova em SVG (`components/brand/FinovaLogo.tsx`) e favicon `app/icon.svg`.
- Body com fundo sólido e glow radial sutil em CSS. Sai o `background.jpg`.
- `Card` com borda discreta real, sombra suave e superfície por token. `.grad-brand` passa a ir de primary para accent.
- **AC:** `grep -ri "#0075ff" src` retorna 0 · nenhum `background-image` de foto no body · texto principal com contraste AA sobre `surface` · telas de auth exibem a marca Finova.

### FIN-04 · Sidebar e navbar · P0 · 1h
- Sidebar: logo Finova, rótulos em PT-BR, pill ativo em `primary` com indicador, card de ajuda com os tokens. A RTL vai para o grupo "Outros" (D3).
- Navbar: breadcrumb em PT-BR, busca de páginas (D6) com foco em `primary`, avatar, badge "Demo".
- **AC:** o estado ativo está correto nas 7 rotas · o drawer mobile abre e fecha · a busca navega para uma página existente · nenhuma regressão na direção RTL.

### FIN-02 · Dashboard financeiro · P0 · 1h30 *(depende do seed dos KPIs; ver FIN-05)*
- 4 KPIs (Receita, Despesas, Saldo, Crescimento) com ícone lucide em chip colorido (sem PNG), valor grande `tabular-nums` e badge de variação com seta e "vs. mês anterior".
- `WelcomeCard` vira "Resumo do mês": saudação, saldo em destaque e fundo abstrato em CSS/SVG.
- Widgets reaproveitados com semântica financeira (D2). Estados de erro escuros via `components/ui/ErrorState.tsx`, que substitui 10 blocos duplicados.
- **AC:** os KPIs exibem BRL e variação colorida · nenhum resíduo de tema claro em todo o app (`grep "slate-700\|bg-rose-50"` retorna 0) · os skeletons têm o mesmo formato do layout final.

### FIN-03 · Gráficos e animações · P0 · 1h30
- Área: Receita × Despesas em `primary`/`accent`, gradientes, legenda, domínio Y automático com ticks BRL compactos ("R$ 10 mil"), meses em PT-BR, tooltip customizado (superfície, borda, valores BRL) e `activeDot` com glow.
- Barras: fluxo de caixa com gradiente, cursor de hover e tooltip. Gauges com os tokens.
- Animação de entrada conforme D4. Desligada com reduced motion (hook `usePrefersReducedMotion`, porque o Recharts ignora o `MotionConfig`).
- **AC:** tooltips em BRL/pt-BR · nenhum eixo cortado em 390 px · gráficos estáticos com `prefers-reduced-motion: reduce`.

### FIN-05 · Dados brasileiros · P1 · 45 min
- `src/lib/format.ts`: `formatBRL`, `formatCompactBRL`, `formatPercent`, `formatDate` (pt-BR).
- Seed com dados de demonstração coerentes: valores em R$, meses em PT, equipe fictícia `@finova.example`, datas das transações derivadas de `date`. Dados inline de `BillingSummary` e da página RTL em BRL. Rodar `npm run db:reset`.
- **AC:** nenhum `$` seguido de número em `src/` e `prisma/seed.ts` · datas no formato pt-BR · badge "Demo" visível.

### FIN-06 · Microinterações · P1 · 45 min
- `MotionConfig reducedMotion="user"` global. Card com hover-lift (−2 px e borda `primary/20`, 200 ms), botões com `scale(0.98)` no press, `focus-visible` em `primary`.
- Filtro de período **3M / 6M / 12M** no gráfico de receita (fatiamento no cliente, pill animado com `layoutId`).
- **AC:** com reduced motion não há translate nem scale · todo elemento interativo tem `focus-visible` · o filtro muda os dados do gráfico.

### FIN-07 · Responsividade · P1 · 45 min
- Alturas fixas só a partir de `lg` (`min-h` abaixo disso). `ReferralCard` fluido. Tabelas com scroll horizontal dentro do card.
- **AC:** em 1440, 768 e 390 px, `scrollWidth <= innerWidth` em todas as rotas · nenhum texto cortado.

### FIN-08 · QA e apresentação · P0 · 45 min
- `lint` + `build` + smoke manual nas 7 rotas (console sem erros) + 3 viewports + reduced motion.
- Relatório de QA honesto (o que foi e o que não foi testado) e roteiro de demo de 5 min em `docs/apresentacao/`.
- **AC:** build passa, ou os impedimentos anteriores estão documentados · o roteiro inclui a seção "decisões e trade-offs" (D1, D5).

## 5. Arquivos

**Modificados:** `src/app/globals.css` · `src/app/layout.tsx` · `src/app/(app)/layout.tsx` · `src/app/(auth)/layout.tsx` · `src/app/(auth)/sign-in/page.tsx` · `src/app/(auth)/sign-up/page.tsx` · `src/app/(app)/dashboard/page.tsx` · `src/app/(app)/billing/page.tsx` · `src/app/(app)/tables/page.tsx` · `src/app/(app)/profile/page.tsx` · `src/app/(app)/rtl/page.tsx` · `src/store/provider.tsx` · `src/config/nav.ts` · `src/lib/icon-map.tsx` · `src/components/ui/{Card,Reveal,Skeleton,Toggle}.tsx` · `src/components/layout/{Sidebar,Navbar}.tsx` · `src/components/dashboard/*` (9) · `src/components/billing/*` (3) · `src/components/tables/AuthorsTable.tsx` · `prisma/seed.ts` · `prisma/dev.db` (regerado) · `README.md`.

**Novos:** `src/lib/format.ts` · `src/hooks/usePrefersReducedMotion.ts` · `src/components/brand/FinovaLogo.tsx` · `src/components/ui/ErrorState.tsx` · `src/components/ui/ChartTooltip.tsx` · `src/app/icon.svg` · `docs/qualidade/relatorio-qa-fase-1.md` · `docs/apresentacao/roteiro-demo.md`.

**Intocados:** `prisma/schema.prisma` · `src/app/api/**` · `src/store/api/**` · `src/store/slices/**` · `src/lib/prisma.ts` · `prisma.config.ts` · `next.config.ts`.

## 6. Ordem e estimativa

| Ordem | Story | Estimativa | Acumulado | Validação ao fim |
|---|---|---|---|---|
| 0 | FIN-00 Fundação | 0h20 | 0h20 | baseline de lint e build registrado |
| 1 | FIN-01 Identidade | 1h00 | 1h20 | todas as rotas renderizam com os tokens |
| 2 | FIN-04 Sidebar/Navbar | 1h00 | 2h20 | navegação nas 7 rotas |
| 3 | FIN-02 Dashboard + seed dos KPIs | 1h30 | 3h50 | dashboard sem resíduo claro |
| 4 | FIN-03 Gráficos | 1h30 | 5h20 | tooltips e animações |
| — | **Gate: P0 estável?** | — | — | lint + build |
| 5 | FIN-05 Dados BR | 0h45 | 6h05 | grep `$` retorna 0 |
| 6 | FIN-06 Microinterações | 0h45 | 6h50 | teste de reduced motion |
| 7 | FIN-07 Responsividade | 0h45 | 7h35 | 3 viewports |
| 8 | FIN-08 QA + roteiro | 0h45 | **8h20** | relatório |

**Revisão pós-aprovação:** D1 +45–60 min (feito no início do FIN-02 junto com todo o seed, o que antecipa parte do FIN-05), D5 +~10 min líquidos. Total estimado ~9h20, sem cortes. ~~Folga: −20 min.~~ Se estourar, a ordem de corte é: o filtro de período do FIN-06, depois a busca do FIN-04 (fica só visual) e por fim o refinamento dos gauges no FIN-03. O FIN-06 obrigatório (reduced motion) custa uma linha e não se corta.

## 7. Riscos e dependências

| Risco | Prob. | Mitigação |
|---|---|---|
| R1 · O `npm install` ou o `prisma generate` falha (A2) | Média | O FIN-00 roda antes de tudo. A falha é documentada como anterior ao trabalho, sem atualizar versões fora do escopo sem aprovação |
| R2 · Breaking changes do Next 16 (fontes, metadata, ícones) | Média | Ler `node_modules/next/dist/docs/` antes de codar (AGENTS.md) |
| R3 · O build depende de rede para o Google Fonts | Baixa | Já acontece hoje com o Plus Jakarta. Não é um risco novo |
| R4 · Overflow em 390 px (A8) | Alta | Tratado no FIN-07, com medição de `scrollWidth` |
| R5 · O Recharts não respeita o `MotionConfig` | Certa | Hook próprio + `isAnimationActive` |
| R6 · FIN-02 depende do seed dos KPIs (FIN-05) | Certa | A parte dos KPIs do seed entra no FIN-02 |
| R7 · `prisma/dev.db` é versionado | Certa | Regerar e commitar junto com o seed. **Se a demo rodar na Vercel com Turso, é preciso rodar `db:seed` contra o Turso (ação sua)** |
| R8 · Orçamento de 8h sem folga | Alta | Gate depois dos P0 e ordem de corte definida |

## 8. Funcionalidades preservadas

- As 7 rotas e o redirect `/` → `/dashboard`.
- As 11 rotas de API, o envelope `{ data }` / `{ error }` e o `simulateLatency` (que mantém os skeletons visíveis na demo).
- Os hooks RTK Query, os skeletons por widget e o isolamento de erro por widget.
- A auth mock (validação de sign-in/up) e o usuário do `authSlice` na navbar e no perfil.
- O drawer mobile com animação spring e o pill ativo com `layoutId`.
- O suporte a direção RTL (propriedades lógicas `start-*`/`end-*`).
- O Prisma + adaptador libSQL, a troca local/Turso por env e o schema inalterado.
- A configuração de deploy na Vercel (`serverExternalPackages`).

## 9. Fora do escopo

Auth real · novos endpoints ou backend · mudança de schema · light mode · framework de i18n · novas páginas · refatoração de estado/RTK.
