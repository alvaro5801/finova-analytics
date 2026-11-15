# ADR-0006: Artefatos do BMAD ficam locais; só a documentação vai ao repositório

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva

## Contexto

O projeto é planejado e executado com o método BMAD, que cria três pastas:

- `_bmad/`: configuração e scripts;
- `.claude/skills/`: agentes e workflows;
- `_bmad-output/`: artefatos de trabalho, memória das sessões e rascunhos.

Esse material é ferramenta pessoal de trabalho, não parte do produto.

## Decisão

- `_bmad/`, `_bmad-output/` e `.claude/` ficam no `.gitignore`.
- Tudo o que for **documentação do projeto** é publicado em `docs/`, num formato independente do BMAD:
  - PRD e spec;
  - ADRs;
  - histórico;
  - QA;
  - operação;
  - apresentação.

## Consequências

- ✅ O repositório só tem o que importa a quem lê ou mantém o produto.
- ⚠️ Ao fechar uma fase, é preciso **promover** os artefatos relevantes de `_bmad-output/` para `docs/`. O passo a passo está em [docs/README.md](../README.md).
