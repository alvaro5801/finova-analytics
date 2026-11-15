# PRD inicial: Finova Analytics

| | |
|---|---|
| **Versão** | 1.0 (fase 1) |
| **Data** | 2026-11-15 |
| **Autor do produto** | Alvaro Silva |
| **Status** | Entregue. Ver o [histórico da fase 1](../historico/2026-11-15-fase-1.md) |
| **Origem** | Consolidado a partir do brief original do projeto e da [Quick Spec](quick-spec.md) aprovada |

> **Nota sobre a origem.** A fase 1 usou o fluxo enxuto do BMAD (Quick Flow), que vai do brief direto para uma Quick Spec técnica. Este documento consolida os requisitos de produto daquele brief num formato de PRD, como referência para as próximas fases. Não houve PRD separado antes da implementação.

## 1. Visão

Transformar um dashboard administrativo genérico (template Vision UI) no **Finova Analytics**, um SaaS financeiro premium que mostre, num só lugar, a saúde financeira de uma empresa: receitas, despesas, caixa, metas e orçamentos. A experiência precisa ser moderna, fluida e confiável.

## 2. Objetivo da fase 1

Entregar uma versão demonstrável, com identidade visual consistente, animações sofisticadas e navegação fluida, para apresentação numa **entrevista de Desenvolvedor Full Stack**. A demo precisa caber em 5 minutos.

**Prazo-alvo:** 8 horas. Após as decisões técnicas D1, D4 e D5, o orçamento aprovado passou a cerca de 9h20.

## 3. Público

| Persona | Necessidade |
|---|---|
| **Gestora financeira (CFO)**, persona fictícia "Marina Costa" | Ver o resultado do mês, o caixa e a evolução de receita e despesa sem abrir planilhas |
| **Analista financeiro** | Acompanhar orçamentos por área e transações recentes |
| **Avaliador técnico** (entrevista) | Encontrar decisões de engenharia defensáveis, qualidade verificável e uma demo estável |

## 4. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Identidade visual Finova: paleta, tipografia, logo, tokens reutilizáveis e estilos globais | P0 |
| RF-02 | Dashboard com KPIs de receita, despesas, saldo e crescimento, com ícones e hierarquia visual | P0 |
| RF-03 | Gráficos com tooltips, transições, hover e animação de entrada | P0 |
| RF-04 | Navegação (sidebar e navbar) com estado ativo, busca e cabeçalho | P0 |
| RF-05 | Valores em BRL, datas em pt-BR e dados de demonstração coerentes | P1 |
| RF-06 | Feedback visual em botões, cards e filtros, respeitando movimento reduzido | P1 |
| RF-07 | Layout sem overflow em 1440, 768 e 390 px | P1 |
| RF-08 | Validação da navegação, dos gráficos e do build, mais um roteiro de demonstração | P0 |

## 5. Requisitos não funcionais

- **Tema:** dark mode.
- **Paleta:** fundo `#090E1A`, superfície `#151D30`, primária `#7958F5`, destaque `#22D3EE`, texto `#E8EDF7`.
- **Tipografia:** Inter ou Geist (Geist foi a escolhida).
- **Movimento:** animações de 200–400 ms, sem efeitos que prejudiquem a leitura, respeitando `prefers-reduced-motion`.
- **Estilo:** bordas discretas, cards com profundidade suave e espaçamento generoso.
- **Idioma e região:** português do Brasil, moeda BRL.
- **Qualidade:** a aplicação inicia sem erros, o build de produção passa e não há erros críticos no console.

## 6. Restrições

1. Auditar o código antes de implementar.
2. Preservar a arquitetura existente.
3. Não criar um novo backend.
4. Não introduzir serviços externos desnecessários.
5. Reutilizar componentes e bibliotecas existentes.
6. Não remover funcionalidades operacionais.
7. Evitar dependências novas se as atuais forem suficientes.
8. Não inventar dados de produção: usar dados fictícios identificáveis como demonstração.
9. Priorizar impacto visual e estabilidade.
10. Não fazer refatorações extensas fora do escopo.

## 7. Critérios de aceite

- [x] Aplicação inicia localmente sem erros
- [x] Dashboard com identidade visual consistente
- [x] Cards e gráficos com animações suaves
- [x] Navegação funcionando
- [x] Valores monetários em BRL
- [x] Interface funcional em desktop, tablet e celular
- [x] Sem erros críticos no console
- [x] Build de produção passando
- [x] Roteiro de demonstração de 5 minutos

A evidência de cada item está no [relatório de QA](../qualidade/relatorio-qa-fase-1.md).

## 8. Fora do escopo (fase 1)

Autenticação real · novos endpoints ou backend · light mode · framework de i18n · novas páginas · refatoração de estado.

## 9. Próximas fases (candidatas)

- Renomear modelos e rotas herdados do template para nomes de domínio ([ADR-0005](../decisoes/0005-arquitetura-herdada-e-nomes-legados.md)).
- Calcular os KPIs como agregados das transações, em vez de linhas pré-calculadas no seed.
- Autenticação real com sessão.
- Banco Turso em produção com migrações versionadas.
- Testes unitários em `src/lib/format.ts` e E2E em Firefox e WebKit.
