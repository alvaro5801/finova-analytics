import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { cardExpenseIsPositive, mapItemStatus, maskAccountNumber, normalizeAmount, normalizeCardAmount } from "./normalize.ts";

describe("mapItemStatus", () => {
  test("traduz o ciclo de vida do Item da Pluggy para o status da conexão", () => {
    assert.equal(mapItemStatus("UPDATED"), "connected");
    assert.equal(mapItemStatus("UPDATING"), "syncing");
    assert.equal(mapItemStatus("OUTDATED"), "error");
    assert.equal(mapItemStatus("LOGIN_ERROR"), "reconnect");
    assert.equal(mapItemStatus("WAITING_USER_INPUT"), "reconnect");
  });

  test("consentimento revogado ou negado pede reconexão mesmo com status UPDATED", () => {
    assert.equal(mapItemStatus("UPDATED", "USER_AUTHORIZATION_REVOKED"), "reconnect");
    assert.equal(mapItemStatus("OUTDATED", "USER_AUTHORIZATION_NOT_GRANTED"), "reconnect");
  });
});

describe("normalizeAmount", () => {
  test("conta: o valor já vem com sinal (débito negativo, crédito positivo)", () => {
    assert.equal(normalizeAmount(-212.45, "DEBIT"), -21245);
    assert.equal(normalizeAmount(2482.26, "CREDIT"), 248226);
  });

  test("conta: débito com valor positivo é tratado como saída", () => {
    assert.equal(normalizeAmount(50, "DEBIT"), -5000);
  });

  test("arredonda para centavos sem erro de ponto flutuante", () => {
    assert.equal(normalizeAmount(-0.1 - 0.2), -30);
  });
});

describe("cartão de crédito", () => {
  // A documentação diz "compra = positivo"; o sandbox manda compra negativa. O sinal
  // predominante decide, porque num cartão as compras são a imensa maioria.
  test("descobre a convenção pelo sinal predominante", () => {
    assert.equal(cardExpenseIsPositive([159.2, 42, 89.9, -1200]), true);
    assert.equal(cardExpenseIsPositive([-89.9, -55.9, -21.9]), false);
  });

  test("compra vira saída nas duas convenções", () => {
    assert.equal(normalizeCardAmount(159.2, true, false), -15920);
    assert.equal(normalizeCardAmount(-89.9, false, false), -8990);
  });

  test("estorno (sinal oposto ao das compras) vira entrada", () => {
    assert.equal(normalizeCardAmount(-50, true, false), 5000);
    assert.equal(normalizeCardAmount(50, false, false), 5000);
  });

  test("pagamento da fatura é sempre entrada, qualquer que seja o sinal", () => {
    assert.equal(normalizeCardAmount(-1200, true, true), 120000);
    assert.equal(normalizeCardAmount(1200, false, true), 120000);
  });
});

describe("maskAccountNumber", () => {
  test("mostra só os 4 últimos dígitos", () => {
    assert.equal(maskAccountNumber("0001/12345-6"), "•••• 3456");
    assert.equal(maskAccountNumber("12"), "•••• 12");
    assert.equal(maskAccountNumber(null), "••••");
  });
});
