# ADR-0001: Dinheiro como inteiro em centavos, formatado só na UI

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (sessão de planejamento com Winston/arquitetura, Amelia/dev, Mary/análise)

## Contexto

O template guardava valores monetários como **strings já formatadas** em dólar (`"$53,000"`, `"$14,000"`), em três tabelas. Para exibir BRL, existiam dois caminhos:

1. Trocar as strings do seed por `"R$ 53.000,00"`, cerca de 20 minutos.
2. Modelar dinheiro como número, cerca de 1 hora, mexendo em schema, tipos, seed e componentes.

O mercado não tem dúvida aqui: gateways de pagamento como Stripe e Adyen trafegam valores como **inteiros na menor unidade da moeda**. `float` acumula erro de arredondamento, e string formatada impede cálculo, ordenação e troca de locale.

Ao modelar, apareceu um segundo problema: algumas métricas misturam tipos. "Crescimento anual" é uma porcentagem, e "Clientes ativos" é uma contagem.

## Decisão

- Todo valor monetário é um `Int` em **centavos**, com o sufixo `Cents` no nome da coluna (`amountCents`, `budgetCents`, `revenueCents`…).
- Métricas mistas usam `value Int` + `format`:
  - `currency` são centavos;
  - `percent` são pontos-base (1% = 100);
  - `number` são unidades.
- A formatação acontece **só na UI**, em `src/lib/format.ts`, com `Intl` pt-BR.
- Datas de fatura passam a ser `DateTime`, e meses viram a chave `"AAAA-MM"`, também formatados na UI.

## Alternativas consideradas

- **Strings em BRL no seed.** Mais rápido, mas mantém o problema de modelagem. Descartada na sessão de planejamento: "é a primeira coisa que um entrevistador sênior aponta".
- **`Decimal` do Prisma.** Exato, mas menos portável entre bancos e serializado como string no JSON. Inteiros resolvem o problema com menos atrito.
- **`Float`.** Descartado por erro de arredondamento.

## Consequências

- ✅ Os valores são somáveis e comparáveis. Os widgets calculam resultado, margem, entradas e saídas a partir dos dados, sem números fixos na tela.
- ✅ Trocar locale ou moeda passa a ser só uma mudança em `format.ts`.
- ⚠️ `Int` no Prisma tem 32 bits, ou seja, um teto de cerca de R$ 21,4 milhões por valor. Para escala real, migrar para `BigInt`.
- ⚠️ O `Intl` pt-BR insere um **espaço não separável** (U+00A0) depois de `R$`. Testes devem usar `/R\$\s/`.
- ⚠️ A mudança de schema é destrutiva para bancos existentes. Os bancos local e Turso precisam de `db:reset` (veja a [operação de deploy](../operacao/deploy.md)).

## Referências

`prisma/schema.prisma` (convenções no topo) · `prisma/seed.ts` · `src/lib/format.ts` · `src/types/dashboard.ts`
