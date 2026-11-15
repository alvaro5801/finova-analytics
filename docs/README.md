# Documentação do Finova Analytics

Esta é uma **documentação viva**: ela muda junto com o código. O README da raiz mostra como rodar o projeto. Aqui ficam o *porquê* das decisões e o histórico.

## Mapa

| Seção | Conteúdo |
|---|---|
| [Produto](produto/) | [PRD inicial](produto/prd-inicial.md) · [Quick Spec da fase 1](produto/quick-spec.md) |
| [Decisões (ADRs)](decisoes/README.md) | Decisões de arquitetura e engenharia, com contexto e alternativas |
| [Histórico](historico/) | O que foi feito em cada fase e por quê. [Fase 1](historico/2026-11-15-fase-1.md) |
| [Qualidade](qualidade/) | [Relatório de QA da fase 1](qualidade/relatorio-qa-fase-1.md) |
| [Operação](operacao/) | [Deploy (Vercel + Turso)](operacao/deploy.md) |
| [Apresentação](apresentacao/) | [Roteiro de demo de 5 minutos](apresentacao/roteiro-demo.md) |
| [Screenshots](screenshots/) | Capturas do build de produção |

O registro resumido de versões fica no [CHANGELOG](../CHANGELOG.md).

## Como manter

Toda mudança relevante atualiza a documentação **no mesmo PR**:

1. **Decisão nova ou que muda uma anterior?** Crie um ADR em `decisoes/` usando o modelo. ADRs aceitos não são editados: um ADR novo substitui o antigo.
2. **Fechou uma fase ou entrega?** Crie `historico/AAAA-MM-DD-<fase>.md` (o que, por quê, incidentes) e uma entrada no `CHANGELOG.md`.
3. **Mudou como rodar, testar ou fazer deploy?** Atualize o README da raiz e `operacao/`.
4. **Rodou QA?** O relatório vai para `qualidade/`, dizendo também **o que não foi testado**.

### Sobre o BMAD

O projeto é planejado com o método BMAD. As pastas de trabalho do BMAD (`_bmad/`, `_bmad-output/`, `.claude/`) ficam **só na máquina local** ([ADR-0006](decisoes/0006-artefatos-bmad-locais.md)). Ao fechar uma fase, os artefatos que valem como documentação (spec, relatório de QA, roteiro) são copiados para cá, num formato que não depende do BMAD.
