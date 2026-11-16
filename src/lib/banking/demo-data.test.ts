import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { DEMO_INSTITUTIONS, createDemoItemId, demoAccounts, demoTransactions, parseDemoItemId } from "./demo-data.ts";

const createdAt = new Date("2026-11-01T12:00:00Z");
const now = new Date("2026-11-15T12:00:00Z");
const itemId = createDemoItemId(DEMO_INSTITUTIONS[0].id, createdAt.getTime(), () => 0.42);

describe("itemId de demonstração", () => {
  test("guarda a instituição e a data de criação", () => {
    const parsed = parseDemoItemId(itemId);
    assert.equal(parsed?.institution.id, DEMO_INSTITUTIONS[0].id);
    assert.equal(parsed?.createdAt.getTime(), createdAt.getTime());
  });

  test("rejeita ids que não são do modo demonstração", () => {
    assert.equal(parseDemoItemId("3f1c2e1a-uuid-da-pluggy"), null);
    assert.equal(parseDemoItemId("demo_banco-inexistente_abc_def"), null);
  });
});

describe("transações de demonstração", () => {
  test("são determinísticas: sincronizar de novo não muda o histórico", () => {
    assert.deepEqual(demoTransactions(itemId, "BANK", now), demoTransactions(itemId, "BANK", now));
  });

  test("cada conexão gera um histórico diferente", () => {
    const other = createDemoItemId(DEMO_INSTITUTIONS[1].id, createdAt.getTime(), () => 0.9);
    assert.notDeepEqual(demoTransactions(itemId, "BANK", now), demoTransactions(other, "BANK", now));
  });

  test("cobrem ~90 dias antes da conexão até hoje, com ids únicos", () => {
    const txs = demoTransactions(itemId, "BANK", now);
    const start = createdAt.getTime() - 91 * 86_400_000;
    assert.ok(txs.length > 60);
    assert.ok(txs.every((t) => t.date.getTime() >= start && t.date.getTime() <= now.getTime()));
    assert.equal(new Set(txs.map((t) => t.externalId)).size, txs.length);
  });

  test("conta tem salário como entrada; cartão tem compras como saída e pagamento como entrada", () => {
    const bank = demoTransactions(itemId, "BANK", now);
    assert.ok(bank.some((t) => t.category === "Salário" && t.amountCents > 0));
    const card = demoTransactions(itemId, "CREDIT", now);
    assert.ok(card.filter((t) => t.category !== "Pagamento de fatura").every((t) => t.amountCents < 0));
    assert.ok(card.some((t) => t.category === "Pagamento de fatura" && t.amountCents > 0));
  });
});

describe("contas de demonstração", () => {
  test("uma conta corrente e um cartão, com número mascarado", () => {
    const accounts = demoAccounts(itemId, now);
    assert.deepEqual(accounts.map((a) => a.type), ["BANK", "CREDIT"]);
    assert.ok(accounts.every((a) => /^•••• \d{4}$/.test(a.number)));
    assert.ok(accounts[1].balanceCents >= 0, "fatura em aberto é um valor devido, não negativo");
  });
});
