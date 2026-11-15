# Roteiro de demonstração: Finova Analytics (5 min)

**Antes de começar:**

- `npm run db:reset && npm run build && npm run start`.
- Abra `/sign-in` numa aba e o editor com `prisma/schema.prisma` e `src/lib/format.ts` em outra.
- DevTools já aberto, mas recolhido.
- Zoom do navegador em 100%.

---

## 0:00–0:30 · Contexto

> "Recebi um template de dashboard genérico e transformei em um SaaS financeiro brasileiro em cerca de 9 horas, com um fluxo estruturado: auditoria, spec com critérios de aceite, implementação por story e QA automatizado. Não criei backend novo. Reaproveitei a arquitetura Next.js + RTK Query + Prisma que já existia."

## 0:30–1:30 · Primeira impressão

1. **Login:** marca Finova e glow sutil. Apague a senha, digite `123` e clique em **Entrar**.
   - *"A validação vem da API, em português, e aparece no próprio formulário."*
2. Corrija a senha e entre. O painel abre com a saudação "Olá, Marina".
3. **KPIs:** os números fazem a contagem de 0 até o valor.
   - *"A seta das despesas fica vermelha porque despesa subindo é ruim. A cor segue o significado, não o sinal."*
4. **Resumo do mês:** *"O resultado é receita menos despesas, e a margem é calculada. Os números conversam entre si."*

## 1:30–2:30 · Interações

1. Passe o mouse no gráfico **Receita × Despesas**: o tooltip mostra o mês por extenso, os valores em BRL e o resultado.
2. Clique em **3M → 6M → 12M**: o pill desliza e o gráfico se redesenha em 300 ms.
   - *"O desenho inicial leva 700 ms. As trocas de período são mais rápidas, para não cansar."*
3. Aperte **`/`**, digite `fatura` e dê **Enter**: a busca de páginas abre o Faturamento.
4. Mostre o pill ativo da sidebar deslizando entre as páginas.

## 2:30–3:15 · Responsivo e acessibilidade

1. DevTools → modo dispositivo → **390 px**: os KPIs ficam em grade 2×2 e o menu vira drawer (abra e navegue).
2. *"O tamanho dos valores usa container query: acompanha a largura do card, não da tela. Não trunca de 320 a 1920 px."*
3. DevTools → Rendering → **prefers-reduced-motion: reduce** e recarregue: tudo aparece pronto, sem contagem nem desenho.

## 3:15–4:15 · Engenharia (abra o código)

1. **`prisma/schema.prisma`, comentário do topo:**
   > "O dinheiro fica em **centavos inteiros**. Nada de float nem string formatada no banco. Métricas mistas têm `value Int` + `format`. Foi uma decisão consciente: custou uma hora a mais, mas é como gateways de pagamento trabalham."
2. **`src/lib/format.ts`:** *"A formatação fica só na borda, com `Intl` pt-BR. E tem uma pegadinha: o `Intl` coloca um espaço não separável depois do R$, o que quebra testes escritos com espaço comum."*
3. **`src/app/(app)/dashboard/page.tsx`:** *"Cada widget tem o próprio hook, skeleton e erro com retry. Uma rota que cai não derruba o painel."*
4. **Terminal:** `npm run test:e2e`.
   - *"São 78 cenários em 3 viewports: rotas, overflow, console limpo, BRL, filtro, busca, RTL, login, reduced motion e acessibilidade WCAG AA com axe. Tudo contra o build de produção. Mais 17 testes unitários, que acharam um bug de sinal negativo na primeira execução."*

## 4:15–5:00 · Trade-offs e próximos passos

- *"Os nomes de modelos e rotas vieram do template. Documentei o significado de cada um no README. O próximo passo seria renomear junto com a API."*
- *"Os KPIs são pré-calculados no seed. Em produção, seriam agregados das transações."*
- *"`Int` de 32 bits aguenta cerca de R$ 21 milhões em centavos. Para escala real, iria para `BigInt`."*
- *"Auth é simulada de propósito. Não era o foco do desafio."*

---

## Perguntas prováveis

| Pergunta | Resposta curta |
|---|---|
| Por que centavos e não `Decimal`? | Inteiro é exato, portável entre bancos e é o padrão de gateways como Stripe e Adyen. A formatação fica na UI. |
| Como garantiu que nada quebrou? | Lint, tipos, 17 testes unitários e 78 cenários E2E (incluindo acessibilidade WCAG AA) em 3 viewports. O relatório de QA lista também o que **não** foi testado. |
| Por que Recharts e não D3? | Já estava no projeto. Restrição: não adicionar dependências sem necessidade. |
| Como lida com dark mode e cores? | Tokens únicos em `@theme`, espelhados em `tokens.ts` para o Recharts. Contraste AA calculado. |
| O que faria com mais tempo? | Renomear modelos e API, criar agregados reais, Turso em produção, testes unitários em `format.ts` e Safari/Firefox no E2E. |

## Plano B

- Se o servidor não subir, use os screenshots em `docs/screenshots/`.
- Se o gráfico não aparecer, rode `npm run db:reset`: o banco precisa do seed novo.
