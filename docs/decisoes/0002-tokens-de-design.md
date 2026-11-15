# ADR-0002: Tokens de design únicos (`@theme` + espelho em TS)

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (com Sally/UX e Caravaggio/visual)

## Contexto

A auditoria encontrou a cor da marca antiga (`#0075ff`) fixada no código 16 vezes. O mesmo gradiente de card estava copiado inline em 7 arquivos, e havia 40 ocorrências de classes de tema claro sobre fundo escuro, o que deixava a página de Billing ilegível. Retematizar trocando cores arquivo por arquivo seria lento e frágil.

## Decisão

- **Fonte da verdade:** os tokens ficam em `@theme`, no arquivo `src/app/globals.css`:
  - cores: `canvas`, `surface`, `primary`, `accent`, `fg`, `muted`…
  - sombras e easing.
- O Tailwind v4 transforma cada token em utilitário (`bg-surface`, `text-muted`, `shadow-glow`).
- O Recharts e os atributos SVG não leem classes Tailwind. Por isso, `src/lib/tokens.ts` espelha os mesmos valores, junto com as durações de animação.
- Padrões recorrentes viram classes de componente (`.fn-card`, `.fn-well`, `.fn-btn-primary`, `.fn-skeleton`) ou componentes React (`Card`, `CardHeader`, `ErrorState`, `DeltaBadge`).

## Alternativas consideradas

- **Variáveis CSS lidas em runtime no Recharts:** `var()` em atributo de apresentação SVG não é confiável entre navegadores.
- **Biblioteca de design system externa:** viola a restrição de não adicionar dependências sem necessidade.

## Consequências

- ✅ Um único lugar para mudar a marca.
- ✅ Contraste calculado nos tokens: `muted` sobre `surface` dá 5,6:1, e `primary-light` sobre `surface` dá 6,6:1.
- ⚠️ Os dois arquivos (`globals.css` e `tokens.ts`) precisam ficar em sincronia. Há um comentário avisando nos dois.
- ✅ Verificação objetiva: `grep -ri "#0075ff" src` retorna 0.
