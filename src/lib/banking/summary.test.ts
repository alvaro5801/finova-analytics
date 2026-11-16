import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { bankSummary, type SummaryTransaction } from "./summary.ts";

let nextId = 1;
const tx = (date: string, amountCents: number, category = "Outros", accountType: "BANK" | "CREDIT" = "BANK") =>
  ({
    id: nextId++,
    date: new Date(`${date}T15:00:00Z`),
    description: category,
    category,
    amountCents,
    accountType,
  }) satisfies SummaryTransaction;

const transactions = [
  tx("2026-09-05", 800_000, "Salário"),
  tx("2026-09-10", -200_000, "Moradia"),
  tx("2026-11-05", 850_000, "Salário"),
  tx("2026-11-10", -150_000, "Moradia"),
  tx("2026-11-12", -40_000, "Restaurante", "CREDIT"),
  // Pagamento da fatura: sai da conta e entra no cartão. Não é receita nem despesa.
  tx("2026-11-07", -90_000, "Pagamento de cartão de crédito"),
  tx("2026-11-07", 90_000, "Pagamento de cartão de crédito", "CREDIT"),
];
const accounts = [
  { type: "BANK" as const, balanceCents: 1_000_000 },
  { type: "CREDIT" as const, balanceCents: 40_000 },
];

describe("bankSummary", () => {
  const summary = bankSummary(transactions, accounts)!;
  const stat = (key: string) => summary.stats.find((s) => s.key === key)!;

  test("série mensal contínua, sem buraco no mês sem lançamentos", () => {
    assert.deepEqual(
      summary.sales.map((s) => [s.month, s.revenueCents, s.expensesCents]),
      [
        ["2026-09", 800_000, 200_000],
        ["2026-10", 0, 0],
        ["2026-11", 850_000, 190_000],
      ],
    );
    assert.equal(summary.periodKey, "2026-11");
  });

  test("pagamento de fatura fica fora de receita e despesas", () => {
    assert.equal(stat("revenue").value, 850_000);
    assert.equal(stat("expenses").value, 190_000);
    assert.equal(stat("result").value, 660_000);
  });

  test("variação contra o mês anterior; mês anterior zerado não gera divisão por zero", () => {
    assert.equal(stat("revenue").changePct, 0);
    const growing = bankSummary(transactions.filter((t) => !t.date.toISOString().startsWith("2026-10")), accounts)!;
    assert.ok(Number.isFinite(growing.stats.find((s) => s.key === "result")!.changePct));
  });

  test("saldo em conta soma as contas correntes e mede a variação do mês", () => {
    // Movimento da conta corrente em novembro: +850.000 −150.000 −90.000 = +610.000 sobre 390.000 no início.
    assert.equal(stat("balance").value, 1_000_000);
    assert.equal(stat("balance").changePct, 156.4);
  });

  test("lançamentos recentes do mais novo para o mais antigo, com ícone por tipo", () => {
    const [first] = summary.orders;
    assert.equal(first.title, "Restaurante");
    assert.equal(first.icon, "arrow-out");
    assert.equal(summary.orders.find((o) => o.title === "Salário")!.icon, "arrow-in");
    assert.equal(summary.orders.find((o) => o.amountCents === -90_000)!.icon, "refresh");
  });

  test("sem transações não há resumo", () => {
    assert.equal(bankSummary([], accounts), null);
  });
});
