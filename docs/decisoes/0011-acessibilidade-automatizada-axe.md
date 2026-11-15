# ADR-0011: Acessibilidade automatizada com axe-core no E2E (WCAG A/AA)

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (proposta de Murat/QA, com Sally/UX)

## Contexto

O relatório de QA da fase 1 registrou que a acessibilidade não tinha sido verificada: os atributos ARIA foram aplicados, mas nada os conferia. O contraste dos tokens foi calculado à mão ([ADR-0002](0002-tokens-de-design.md)), mas isso não garante o contraste de cada combinação real na tela.

O **axe-core** é o motor de regras de acessibilidade mais usado no mercado, inclusive pelas ferramentas de acessibilidade do Chrome DevTools e do Lighthouse. Ele roda dentro do Playwright pelo pacote `@axe-core/playwright`. O Node não tem nada equivalente embutido, então desta vez a dependência nova se justifica, ao contrário do [ADR-0010](0010-testes-unitarios-node-test.md).

## Decisão

- Adicionar `@axe-core/playwright` como **devDependency**. Ele não vai para produção.
- Criar `e2e/a11y.spec.ts` com as regras **WCAG 2.0, 2.1 e 2.2, níveis A e AA**. A suíte cobre as 7 rotas e dois estados dinâmicos: a busca aberta e o drawer aberto. Tudo nos 3 viewports, como parte do gate **E2E** do CI.
- **Sem falsos positivos de animação:** o teste roda com movimento reduzido e espera `document.getAnimations()` terminar antes de analisar. O axe mede contraste com a opacidade *atual*, e um fade-in em andamento acusaria contraste baixo onde não há.
- A lista de rotas foi extraída para `e2e/routes.ts`, compartilhada com o smoke.

## O que a primeira execução encontrou (e foi corrigido)

| Regra | Problema | Correção |
|---|---|---|
| **2.5.3 Rótulo no nome** | Os botões "3M/6M/12M" tinham o nome acessível "Últimos 3 meses". Quem navega por voz diz "clique em 3M" e nada acontece. O link do logo também tinha um rótulo diferente do texto visível | O texto visível vem primeiro, e o complemento só para leitor de tela vai depois: "3M (últimos 3 meses)". No link do logo, o nome passa a ser o próprio texto, "Finova Analytics" |
| **2.1.1 Teclado** | As tabelas que rolam na horizontal no celular não podiam ser roladas pelo teclado | O contêiner virou uma região nomeada e focável (`role="region"` + `tabIndex={0}`) |

A suíte falhou em 20 de 25 cenários antes das correções e passa em todos depois.

## Alternativas consideradas

- **pa11y ou Lighthouse só para acessibilidade:** usam o mesmo axe por baixo, mas exigem servidor e ferramenta à parte. Dentro do Playwright, os estados dinâmicos são testados com os mesmos passos do smoke.
- **Só auditoria manual:** necessária, mas não impede regressões.

## Consequências

- ✅ Uma regressão de acessibilidade agora bloqueia o merge, como qualquer teste.
- ✅ A suíte E2E passou para 78 cenários (74 executados e 4 pulados por não se aplicarem ao viewport), em cerca de 1 minuto localmente.
- ⚠️ **O axe cobre cerca de metade dos critérios WCAG.** Ordem de leitura, qualidade dos textos alternativos e a experiência real com leitor de tela (NVDA, VoiceOver) continuam manuais.
- ⚠️ As tabelas ganharam um ponto de foco extra no teclado mesmo quando não precisam rolar (no desktop). É o padrão recomendado e custa pouco.
