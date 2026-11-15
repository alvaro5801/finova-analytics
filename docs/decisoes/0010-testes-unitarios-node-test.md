# ADR-0010: Testes unitários com o test runner nativo do Node, sem dependência nova

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (proposta de Murat/QA)

## Contexto

O relatório de QA da fase 1 apontou que **não havia testes unitários**. O `src/lib/format.ts` era coberto só de forma indireta, pelo E2E. É justamente a função mais sensível da interface: todo valor em R$, porcentagem e data passa por ela, e ela tem a pegadinha do espaço não separável (U+00A0) do `Intl` pt-BR.

O caminho mais comum seria o Vitest, mas o projeto evita dependências novas quando as atuais bastam ([PRD](../produto/prd-inicial.md), restrição 7). O Node 24 do projeto (`.nvmrc`) já traz:

- o test runner `node:test` com `node:assert`;
- execução direta de TypeScript, por remoção de tipos;
- globs no `--test`.

## Decisão

- Testes unitários em `src/**/*.test.ts`, com `node:test` e `node:assert/strict`.
- O script `npm run test:unit` fixa `TZ=America/Sao_Paulo`, porque datas com horário dependem do fuso, e silencia o aviso `MODULE_TYPELESS_PACKAGE_JSON`. Mudar o `"type"` do `package.json` só por causa dos testes afetaria o projeto inteiro.
- O `tsconfig.json` ganha `allowImportingTsExtensions` (permitido com `noEmit`). O Node exige a extensão `.ts` no import, e assim os testes também passam pela checagem de tipos.
- Os testes rodam no job **Qualidade** do CI e no `npm run ci:local`.

## Alternativas consideradas

- **Vitest:** melhor ergonomia (modo watch, cobertura, mocks), mas é uma dependência nova sem necessidade para funções puras. Vale reavaliar se surgirem testes de componente React.
- **Jest:** precisaria de configuração de transformação para TypeScript e ESM. Mais peso, nenhum ganho aqui.

## Consequências

- ✅ 17 testes em cerca de 130 ms, sem nenhum pacote novo.
- ✅ **A suíte achou um bug na primeira execução:** `formatBRL` usava o hífen do `Intl` (U+002D) em valores negativos, enquanto `formatSignedBRL` e `formatDelta` usam o menos tipográfico (U+2212). A tela mostrava dois sinais diferentes, e foi corrigido.
- ✅ A eficácia foi verificada: com a correção desfeita, o teste correspondente falha.
- ⚠️ O script usa uma variável de ambiente em linha (`TZ=...`), que funciona em Linux e macOS. No Windows, rode via WSL ou defina a variável antes.
- ⚠️ Sem relatório de cobertura por enquanto. O `node --test --experimental-test-coverage` pode entrar quando houver mais módulos testados.
