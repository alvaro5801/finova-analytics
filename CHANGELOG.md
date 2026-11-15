# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versões seguem [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Sidebar retrátil no desktop: botão na navbar recolhe o menu para um trilho de ícones (só na sessão). No lugar do card de demonstração, o botão **Sair**.
- Paginação (5 por página) em Equipe financeira, Orçamentos por área, Transações recentes e Faturas, com componente reutilizável.
- Filtros: Transações recentes (tipo, busca, categoria, com totais do recorte), Equipe financeira (busca, status, departamento) e Orçamentos por área em Relatórios (status, busca, sem orçamento).
- Faturamento: download da fatura em PDF, gerado no navegador sem dependência nova; cadastro de cartão com prévia ao vivo, máscaras, validação (Luhn e validade) e opção de cartão principal. Só os 4 últimos dígitos ficam guardados.
- Perfil: edição dos dados (nome sincronizado com a navbar) e área **Usuários e permissões**, só para administradores, com convite, edição de papel e exclusão. A conta logada não pode se excluir nem perder o papel de admin.
- Seed com mais registros fictícios (18 pessoas, 14 orçamentos, 16 transações, 14 faturas) para demonstrar a paginação.
- Testes unitários de paginação, filtros, cartão, PDF e regras de contas; E2E da sidebar retrátil e auditoria axe com a sidebar recolhida.
- Testes de acessibilidade com axe-core (WCAG 2.0/2.1/2.2 A e AA) nas 7 rotas e nos estados de busca aberta e drawer aberto, nos 3 viewports ([ADR-0011](docs/decisoes/0011-acessibilidade-automatizada-axe.md)).
- Testes unitários de `src/lib/format.ts` com `node:test` (17 casos, sem dependência nova), rodando no job Qualidade do CI ([ADR-0010](docs/decisoes/0010-testes-unitarios-node-test.md)).

### Corrigido
- Teste E2E instável no CI (atalho `/` da busca, que falhou na primeira tentativa e passou no retry). Os testes agora esperam `<html data-app-ready>`, um sinal de que o React hidratou e os listeners existem, antes de interagir (`gotoReady`).
- Acessibilidade (WCAG 2.5.3): os botões 3M/6M/12M e o link do logo agora têm nome acessível que contém o texto visível.
- Acessibilidade (WCAG 2.1.1): as tabelas com rolagem horizontal podem ser roladas pelo teclado.
- Valores negativos em `formatBRL` usavam o hífen (U+002D), enquanto o resto da interface usa o menos tipográfico (U+2212). Bug encontrado pelos novos testes unitários.

### Alterado
- Nova paleta: base neutra quase preta, verde-água como cor principal (item ativo, foco, botões com texto escuro), azul-céu para destaques e tons de status dessaturados. Sem roxo nem degradês. Gráficos em azul (receita) e terracota (despesas), validados para daltonismo.
- Sidebar sem "Entrar" e "Criar conta"; busca de páginas sem essas opções e sem a Prévia RTL; navbar sem o botão "Entrar".
- Dependabot: atualizações de versão mensais e agrupadas, com cooldown (3/7/30 dias para patch/minor/major); `@types/node` acompanha o Node 24; majors do TypeScript ficam para migração planejada ([ADR-0009](docs/decisoes/0009-politica-de-dependencias.md)).
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
