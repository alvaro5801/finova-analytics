# ADR-0009: Política de atualização de dependências (Dependabot)

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (com Murat/QA)

## Contexto

O **Dependabot** é o serviço do GitHub que vigia as dependências do projeto (pacotes npm e GitHub Actions). Ele tem três funções:

| Função | O que faz |
|---|---|
| **Alertas** | Avisa quando uma dependência tem vulnerabilidade conhecida |
| **Atualizações de segurança** | Abre PR automaticamente com a versão corrigida |
| **Atualizações de versão** | Abre PRs periódicos para manter as dependências em dia, mesmo sem vulnerabilidade |

É **gratuito, inclusive em repositório privado**. As execuções do próprio Dependabot não consomem minutos do Actions ([GitHub Changelog](https://github.blog/changelog/2024-04-22-dependabot-updates-on-actions-for-github-enterprise-cloud-and-free-pro-and-teams-users/)). O custo indireto é o **nosso CI**, que roda em cada PR aberto por ele: cerca de 7 minutos cobrados por execução, porque o GitHub arredonda cada job para o minuto inteiro.

A primeira configuração, com atualizações semanais e sem filtros, abriu **9 PRs em minutos**. Entre eles havia majors que não deveriam entrar sem planejamento:

- TypeScript 5.9 → 7.0;
- `@types/node` 20 → 26, à frente do Node 24 do projeto;
- Prisma 6 → 7 ([ADR-0008](0008-adiar-migracao-prisma-7.md)).

## Decisão

1. **Segurança é imediata.** Alertas e atualizações de segurança ficam ativos e não seguem agenda nem cooldown.
2. **Versões são mensais e agrupadas.** Minor e patch de produção num PR, os de desenvolvimento noutro, e as Actions num terceiro. Cada major vem num PR individual.
3. **Cooldown** antes de propor uma versão recém-publicada: 3 dias para patch, 7 para minor, 30 para major e 7 para Actions. Quando um pacote do npm é comprometido, a versão maliciosa costuma ser detectada e retirada em poucos dias. Esperar reduz esse risco de supply chain sem custo ([GitHub Blog: The case for a cooldown](https://github.blog/security/supply-chain-security/the-case-for-a-cooldown-why-dependabot-now-waits-before-issuing-version-updates/)).
4. **Ignorados de propósito:**
   - `@types/node` a partir da 25, porque os tipos acompanham o runtime (Node 24, `.nvmrc`) e sobem junto com ele;
   - majors do `typescript`, porque o TS 7 é uma troca de ferramenta e vai ter migração planejada.
5. **Triagem dos PRs:**

   | Tipo de PR | Regra |
   |---|---|
   | Segurança | Merge assim que o CI passar |
   | Grupos minor/patch | Merge depois do CI verde e de uma olhada no changelog dos pacotes de produção |
   | Major | Só com plano de migração (ADR) e numa fase própria |

## Alternativas consideradas

- **Atualizações semanais sem cooldown** (a configuração inicial): mais ruído, mais minutos de CI e exposição a versões recém-publicadas.
- **Renovate:** mais configurável, mas exige app de terceiros. O Dependabot é nativo e suficiente para o tamanho do projeto.
- **Só alertas, sem PRs automáticos:** a atualização viraria tarefa manual, que costuma ser esquecida.

## Consequências

- ✅ A cada mês chegam poucos PRs agrupados, e as correções de segurança chegam na hora.
- ✅ A configuração fica versionada e comentada (`.github/dependabot.yml`), em vez de espalhada em comentários `@dependabot ignore`.
- ⚠️ Atualizar o Node exige um passo manual: subir `.nvmrc`, `engines` e o limite do `@types/node` juntos.
