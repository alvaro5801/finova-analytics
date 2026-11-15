# Repositório, documentação viva e CI/CD

**Data:** 2026-11-15 · **Escopo:** segunda parte da fase 1, depois do redesign

## O que foi feito e por quê

### Repositório no GitHub
- **O quê:**
  - criamos `alvaro5801/finova-analytics`, **privado**;
  - o histórico do template foi preservado, com o remoto original renomeado para `upstream`;
  - os commits passaram a usar o e-mail *noreply* da conta.
- **Por quê:**
  - Preservar o histórico mantém a autoria de quem construiu a base.
  - O *noreply* liga os commits ao perfil sem expor e-mail.
  - O repositório é privado por decisão do dono do produto, e isso definiu os limites da pipeline ([ADR-0007](../decisoes/0007-pipeline-ci-cd.md)).

### Artefatos do BMAD fora do repositório
- **O quê:** `_bmad/`, `_bmad-output/` e `.claude/` no `.gitignore`. O que é documentação foi copiado para `docs/`.
- **Por quê:** é ferramenta de trabalho, não produto ([ADR-0006](../decisoes/0006-artefatos-bmad-locais.md)).

### Documentação viva
- **O quê:** `docs/` com PRD inicial, Quick Spec, ADRs, histórico, QA, operação e roteiro de demo, além do `CHANGELOG.md`.
- **Por quê:** quem chegar depois precisa entender o *porquê* das decisões sem depender de quem estava na sala. A seção "Como manter" em [docs/README.md](../README.md) define quando atualizar cada parte.

### Correção de segurança: Next.js 16.2.11 → 16.4.6
- **O quê:** atualizamos `next` e `eslint-config-next` para 16.4.6, com versão fixa como antes, e aplicamos `npm audit fix` sem mudar majors.
- **Por quê:** a auditoria da pipeline encontrou **RCEs críticas sem autenticação** na versão anterior. Com o deploy público, isso não podia esperar.
- **Como validamos:** lint, tipos e os 49 cenários E2E passaram na versão nova.
- **Incidente:** `npm audit fix --omit=dev` remove as devDependencies do `node_modules`. Um `npm install` comum as restaura. O lockfile não foi afetado.

### Pipeline de CI/CD
- **O quê:**
  - gates de qualidade, segurança e E2E;
  - deploy pela Vercel CLI (preview e produção, com smoke test);
  - burn-in semanal;
  - Dependabot e template de PR com checklist de documentação;
  - `npm run ci:local` para reproduzir o CI na máquina.
- **Por quê:** veja o [ADR-0007](../decisoes/0007-pipeline-ci-cd.md). O guia completo está em [ci-cd.md](../operacao/ci-cd.md).

## Pendências

- Configurar os secrets e variáveis da Vercel no GitHub e as variáveis do Turso na Vercel ([ci-cd.md](../operacao/ci-cd.md#configuração-uma-vez)).
- Rodar `npm run db:reset` contra o Turso antes da demo ([deploy.md](../operacao/deploy.md)).
- Migrar para o Prisma 7. As "3 altas" do `npm audit` são uma única vulnerabilidade, no `deepmerge-ts`, que fica só na CLI do Prisma e não no runtime. A decisão de adiar, com gatilhos e plano, está no [ADR-0008](../decisoes/0008-adiar-migracao-prisma-7.md).
