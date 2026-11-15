import { describe, test } from "node:test";
import assert from "node:assert/strict";
import reducer, { inviteAccount, removeAccount, updateAccount, validateAccountForm } from "./accountsSlice.ts";

const initial = reducer(undefined, { type: "init" });
const me = initial.currentId;
const other = initial.accounts.find((a) => a.id !== me)!;

describe("accountsSlice", () => {
  test("a conta logada começa como administradora", () => {
    assert.equal(initial.accounts.find((a) => a.id === me)?.role, "admin");
  });

  test("convidar adiciona a conta com convite pendente", () => {
    const state = reducer(
      initial,
      inviteAccount({ id: "acc-new", name: "Nova Pessoa", email: "nova@finova.example", jobTitle: "Analista", role: "viewer" }),
    );
    const added = state.accounts.at(-1)!;
    assert.equal(state.accounts.length, initial.accounts.length + 1);
    assert.equal(added.status, "invited");
    assert.equal(added.role, "viewer");
  });

  test("editar altera só os campos enviados", () => {
    const state = reducer(initial, updateAccount({ id: other.id, changes: { role: "admin", jobTitle: "Gerente" } }));
    const edited = state.accounts.find((a) => a.id === other.id)!;
    assert.equal(edited.role, "admin");
    assert.equal(edited.jobTitle, "Gerente");
    assert.equal(edited.email, other.email);
  });

  test("excluir remove outra conta, mas nunca a conta logada", () => {
    assert.equal(reducer(initial, removeAccount(other.id)).accounts.some((a) => a.id === other.id), false);
    assert.equal(reducer(initial, removeAccount(me)).accounts.some((a) => a.id === me), true);
  });

  test("a conta logada não perde o próprio papel de administradora", () => {
    const state = reducer(initial, updateAccount({ id: me, changes: { role: "viewer", name: "Marina C." } }));
    const mine = state.accounts.find((a) => a.id === me)!;
    assert.equal(mine.role, "admin");
    assert.equal(mine.name, "Marina C.");
  });
});

describe("validateAccountForm", () => {
  const emails = ["marina.costa@finova.example", "rafael.almeida@finova.example"];

  test("exige nome, e-mail válido e e-mail ainda não cadastrado", () => {
    assert.deepEqual(Object.keys(validateAccountForm({ name: " ", email: "x@", jobTitle: "" }, emails)).sort(), [
      "email",
      "name",
    ]);
    assert.ok(validateAccountForm({ name: "Ana", email: "RAFAEL.almeida@finova.example", jobTitle: "" }, emails).email);
  });

  test("ao editar, o próprio e-mail não conta como repetido", () => {
    assert.deepEqual(
      validateAccountForm({ name: "Rafael", email: "rafael.almeida@finova.example", jobTitle: "" }, emails, "rafael.almeida@finova.example"),
      {},
    );
  });
});
