import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { detectBrand, formatCardNumber, formatExpiry, isExpiryValid, luhnValid, validateCard } from "./card.ts";

const now = new Date(2026, 10, 15);

describe("cartão", () => {
  test("detecta a bandeira pelos primeiros dígitos", () => {
    assert.equal(detectBrand("4111"), "Visa");
    assert.equal(detectBrand("5555"), "Mastercard");
    assert.equal(detectBrand("2221"), "Mastercard");
    assert.equal(detectBrand("3782"), "Amex");
    assert.equal(detectBrand("6011"), "Cartão");
  });

  test("valida o número pelo algoritmo de Luhn", () => {
    assert.equal(luhnValid("4111111111111111"), true);
    assert.equal(luhnValid("5555555555554444"), true);
    assert.equal(luhnValid("4111111111111112"), false);
    assert.equal(luhnValid("4111"), false);
  });

  test("aplica as máscaras de número e validade", () => {
    assert.equal(formatCardNumber("4111a1111 11111111"), "4111 1111 1111 1111");
    assert.equal(formatCardNumber("41111111111111112222"), "4111 1111 1111 1111 222");
    assert.equal(formatExpiry("0828"), "08/28");
    assert.equal(formatExpiry("1"), "1");
  });

  test("aceita validade do mês atual em diante", () => {
    assert.equal(isExpiryValid("11/26", now), true);
    assert.equal(isExpiryValid("08/28", now), true);
    assert.equal(isExpiryValid("10/26", now), false);
    assert.equal(isExpiryValid("13/27", now), false);
  });

  test("aponta cada campo inválido e aceita um cartão completo", () => {
    assert.deepEqual(Object.keys(validateCard({ number: "", holder: " ", expiry: "", cvv: "1" }, now)).sort(), [
      "cvv",
      "expiry",
      "holder",
      "number",
    ]);
    assert.deepEqual(
      validateCard({ number: "4111 1111 1111 1111", holder: "Ana Lima", expiry: "08/28", cvv: "123" }, now),
      {},
    );
  });
});
