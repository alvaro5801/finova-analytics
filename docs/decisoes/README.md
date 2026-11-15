# Registro de decisões (ADRs)

Cada decisão que muda como o sistema é construído ganha um ADR curto, com o contexto, a decisão, as alternativas descartadas e as consequências. O ADR **não é editado depois de aceito**. Se a decisão mudar, cria-se um novo ADR que substitui o anterior (status `Substituída por ADR-XXXX`).

| ADR | Decisão | Status |
|---|---|---|
| [0001](0001-dinheiro-em-centavos.md) | Dinheiro como inteiro em centavos, formatado só na UI | Aceita |
| [0002](0002-tokens-de-design.md) | Tokens de design únicos (`@theme` + espelho em TS) | Aceita |
| [0003](0003-politica-de-animacao.md) | Política de animação e movimento reduzido | Aceita |
| [0004](0004-e2e-com-playwright.md) | Smoke E2E com Playwright contra build de produção | Aceita |
| [0005](0005-arquitetura-herdada-e-nomes-legados.md) | Preservar a arquitetura herdada e renomear só a camada de UI | Aceita |
| [0006](0006-artefatos-bmad-locais.md) | Artefatos do BMAD ficam locais; só a documentação vai ao repositório | Aceita |
| [0007](0007-pipeline-ci-cd.md) | Pipeline de CI/CD com GitHub Actions e deploy pela Vercel CLI | Aceita |
| [0008](0008-adiar-migracao-prisma-7.md) | Adiar a migração para o Prisma 7 e aceitar temporariamente uma vulnerabilidade alta na CLI | Aceita (temporária) |
| [0009](0009-politica-de-dependencias.md) | Política de atualização de dependências (Dependabot) | Aceita |
| [0010](0010-testes-unitarios-node-test.md) | Testes unitários com o test runner nativo do Node, sem dependência nova | Aceita |
| [0011](0011-acessibilidade-automatizada-axe.md) | Acessibilidade automatizada com axe-core no E2E (WCAG A/AA) | Aceita |

## Modelo

```markdown
# ADR-XXXX: Título no imperativo

- **Status:** Proposta | Aceita | Substituída por ADR-YYYY
- **Data:** AAAA-MM-DD
- **Decisores:** nomes

## Contexto
O problema e as forças em jogo.

## Decisão
O que foi decidido, em uma ou duas frases.

## Alternativas consideradas
O que foi descartado e por quê.

## Consequências
O que fica melhor, o que fica pior e o que passa a ser exigido.
```
