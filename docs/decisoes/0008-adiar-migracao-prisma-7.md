# ADR-0008: Adiar a migração para o Prisma 7 e aceitar temporariamente uma vulnerabilidade alta na CLI

- **Status:** Aceita (temporária, com gatilhos de revisão)
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (debate: Winston e Murat a favor de migrar já; Amelia e John pela cautela antes da demo)

## Contexto

Depois da correção do Next.js ([ADR-0007](0007-pipeline-ci-cd.md)), o `npm audit --omit=dev` ainda aponta **3 ocorrências de severidade alta**. Na análise, elas são **uma única vulnerabilidade**, contada uma vez em cada pacote da cadeia de dependências:

| Pacote | Como aparece |
|---|---|
| `deepmerge-ts@7.1.5` | **[GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx)**: esgotamento de pilha ao mesclar grafos de objetos recursivos (corrigido na 8.0.0) |
| `@prisma/config@6.19.3` | depende de `deepmerge-ts` |
| `prisma@6.19.3` | depende de `@prisma/config` |

A correção disponível é o **Prisma 7.10.1**, que é uma versão major.

### Exposição real

- O código vulnerável está na **CLI do Prisma**, no carregador do `prisma.config.ts`. Ela roda em desenvolvimento e no CI (`generate`, `db push`) e só mescla a **nossa própria configuração**, que é confiável.
- O client que roda na Vercel (`src/generated/prisma` + `@prisma/adapter-libsql`) **não inclui** essa dependência. Nenhuma entrada de usuário chega ao `deepmerge-ts`.
- O pacote só aparece numa auditoria de produção porque `prisma` está em `dependencies`, e não em `devDependencies`.

### Custo de migrar agora

O Prisma 7 é uma versão major na camada usada pelas 11 rotas da API, às vésperas da demonstração. Mudanças esperadas, **a confirmar no guia oficial** antes de executar:

- configuração em `prisma.config.ts`;
- remoção de opções experimentais e do `engineType`;
- configuração do seed fora do `package.json`;
- requisitos mínimos de Node e TypeScript;
- comportamento de `db push` e `generate`.

O projeto já adiantou parte do caminho: gerador `prisma-client`, adapter libSQL 7.x e `prisma.config.ts`.

## Decisão

1. **Adiar** a migração para o Prisma 7 para uma fase própria, depois da demonstração.
2. **Aceitar temporariamente** a vulnerabilidade alta na CLI, pelos motivos da seção de exposição.
3. **Manter a política da pipeline:** crítica bloqueia, alta vira aviso no resumo do job de segurança. Se essa vulnerabilidade for reclassificada como crítica, o CI passa a bloquear sozinho.
4. Os majors do Dependabot **não** são ignorados, então o PR de atualização do Prisma 7 chega pelo próprio Dependabot. É esse PR que vai carregar a migração.

## Gatilhos para revisar a decisão (o que acontecer primeiro)

- Logo depois da demonstração da entrevista.
- Antes de o app receber **dados reais** ou usuários além da demo.
- Se o advisory mudar para **crítico** ou surgir uma vulnerabilidade nova no **client de runtime**.
- Se alguma dependência exigir o Prisma 7.

## Alternativas consideradas

- **Migrar agora:** a suíte E2E (49 cenários) daria uma boa rede de proteção. Descartada pelo risco de uma mudança major na camada de dados às vésperas da demo, com ganho de segurança baixo: a vulnerabilidade está só na CLI.
- **Mover `prisma` para `devDependencies`:** é o que a documentação do Prisma recomenda para a CLI, e tiraria o alerta da auditoria de produção. Mas isso **não corrige** a vulnerabilidade, só a tira do relatório. Fica registrada como melhoria a fazer junto com a migração.
- **Ignorar o advisory no `npm audit`:** descartado, porque esconderia o problema em vez de registrá-lo.

## Consequências

- ⚠️ O resumo do job de segurança vai mostrar 3 avisos de severidade alta até a migração. Isso é esperado e está documentado aqui.
- ✅ Nenhum risco novo para o runtime em produção.
- ✅ Correção de um argumento do debate: a migração para o Prisma 7 **não muda o schema do banco**, então não exige recriar o banco Turso de novo. Basta regenerar o client.

## Plano de migração (para a fase própria)

1. Ler o guia oficial "Upgrade to Prisma ORM 7" e confirmar a lista de mudanças acima.
2. Num branch: alinhar `prisma`, `@prisma/client` e `@prisma/adapter-libsql` na mesma 7.x, com versão fixa.
3. Mover `prisma` (CLI) para `devDependencies`.
4. Ajustar `prisma.config.ts`, `schema.prisma` e os scripts `db:*`. A configuração de seed sai do `package.json`.
5. Atualizar `engines.node` e o `.nvmrc`, se o mínimo do Prisma 7 pedir.
6. Rodar `npm run ci:local` e abrir um PR. O preview da Vercel valida o deploy antes do merge.
7. Criar um ADR novo que **substitua** este, com status `Substituída por ADR-XXXX`.
