import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { paginate } from "./pagination.ts";

const items = ["a", "b", "c", "d", "e", "f", "g"];

describe("paginate", () => {
  test("primeira página traz os primeiros itens e o intervalo exibido", () => {
    assert.deepEqual(paginate(items, 1, 5), {
      items: ["a", "b", "c", "d", "e"],
      page: 1,
      totalPages: 2,
      total: 7,
      from: 1,
      to: 5,
    });
  });

  test("última página pode vir incompleta", () => {
    const result = paginate(items, 2, 5);
    assert.deepEqual(result.items, ["f", "g"]);
    assert.equal(result.from, 6);
    assert.equal(result.to, 7);
  });

  test("página fora do intervalo é ajustada para o limite", () => {
    assert.equal(paginate(items, 9, 5).page, 2);
    assert.equal(paginate(items, 0, 5).page, 1);
  });

  test("lista vazia tem uma página e intervalo zerado", () => {
    assert.deepEqual(paginate([], 1, 5), { items: [], page: 1, totalPages: 1, total: 0, from: 0, to: 0 });
  });
});
