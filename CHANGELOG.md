# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versões seguem [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Alterado
- CI: runners fixados em `ubuntu-24.04`, em vez de `ubuntu-latest`, que está migrando para o Ubuntu 26.

### Documentação
- [ADR-0008](docs/decisoes/0008-adiar-migracao-prisma-7.md): migração para o Prisma 7 adiada, com a análise de exposição (vulnerabilidade só na CLI), os gatilhos de revisão e o plano de migração.

## [0.2.1] - 2026-11-15

### Segurança
- Next.js e `eslint-config-next` atualizados de 16.2.11 para **16.4.6**. A versão anterior tinha RCEs críticas sem autenticação (GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr, GHSA-2xp9-vwfh-vxw4, GHSA-vcvr-r3jv-pc5j, GHSA-p293-qw3h-jr36).
- Correções transitivas sem mudança de major (`npm audit fix`).

### Adicionado
- Pipeline de CI/CD: gates de qualidade, segurança e E2E; deploy pela Vercel CLI (preview e produção) com smoke test; burn-in semanal ([ADR-0007](docs/decisoes/0007-pipeline-ci-cd.md)).
- Dependabot (npm e GitHub Actions), template de PR, `.nvmrc`, `npm run typecheck` e `npm run ci:local`.

## [0.2.0] - 2026-11-15

Fase 1: o template Vision UI vira **Finova Analytics**. Detalhes em [docs/historico/2026-11-15-fase-1.md](docs/historico/2026-11-15-fase-1.md).

### Adicionado
- Identidade visual Finova: tokens de design, fonte Geist, logo e favicon em SVG ([ADR-0002](docs/decisoes/0002-tokens-de-design.md)).
- KPIs financeiros com contagem animada, resumo do mês, meta anual, saúde financeira, orçamentos por área e transações recentes.
- Gráfico Receita × Despesas com filtro 3M/6M/12M e tooltip em BRL; volume de transações com o dia de pico destacado.
- Busca de páginas acessível (atalho `/`), selo "Dados demo" e página 404 em PT-BR.
- `ErrorState` com "Tentar novamente" em todos os widgets.
- Suporte completo a `prefers-reduced-motion` ([ADR-0003](docs/decisoes/0003-politica-de-animacao.md)).
- Suíte E2E com Playwright: 7 rotas × 3 viewports, mais fluxos ([ADR-0004](docs/decisoes/0004-e2e-com-playwright.md)).
- Documentação viva em `docs/`: PRD, spec, ADRs, histórico, QA, operação e roteiro de demo.

### Alterado
- **Breaking:** valores monetários passam a ser inteiros em centavos, e métricas usam `value Int` + `format` ([ADR-0001](docs/decisoes/0001-dinheiro-em-centavos.md)). Bancos existentes precisam de `npm run db:reset`.
- Seed reescrito com dados brasileiros fictícios e coerentes entre si (domínio `.example`).
- Componentes do dashboard renomeados para nomes de domínio, sem mudança na API ([ADR-0005](docs/decisoes/0005-arquitetura-herdada-e-nomes-legados.md)).
- Interface e mensagens de erro da API em PT-BR.
- Layout responsivo com container queries nos KPIs.
- A prévia RTL volta a inverter a direção do app, como documentado.

### Corrigido
- Billing, Tabelas e Perfil estavam ilegíveis (classes de tema claro sobre fundo escuro).
- Overflow e alturas fixas no celular.

### Removido
- Imagens do template sem uso (`public/icons/*.png`, `public/images/*`) e o `favicon.ico` padrão.

## [0.1.0]

Base: recriação do Material/Vision UI Dashboard em Next.js 16, Redux Toolkit, Prisma e libSQL (template original).
