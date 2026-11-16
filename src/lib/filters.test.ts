import { describe, test } from "node:test";
import assert from "node:assert/strict";
import type { AuthorData, OrderEventData, ProjectData } from "../types/dashboard.ts";
import { filterBankTransactions, filterBudgets, filterTeam, filterTransactions, matchesQuery, uniqueSorted } from "./filters.ts";

const order = (id: number, title: string, description: string, amountCents: number) =>
  ({ id, title, description, amountCents }) as OrderEventData;
const orders = [
  order(1, "Recebimento do pedido #1", "Vendas online", 1000),
  order(2, "Folha de pagamento", "Pessoal", -5000),
  order(3, "Benefícios da equipe", "Pessoal", -2000),
  order(4, "Reembolso", "Ajustes", 300),
];

const author = (id: number, name: string, department: string, status: AuthorData["status"]) =>
  ({ id, name, email: `${name.split(" ")[0].toLowerCase()}@finova.example`, function: "Analista", department, status }) as AuthorData;
const team = [
  author(1, "Marina Costa", "Diretoria", "online"),
  author(2, "Rafael Almeida", "Controladoria", "offline"),
  author(3, "André Barbosa", "Controladoria", "online"),
];

const project = (id: number, name: string, status: ProjectData["status"], budgetCents: number | null) =>
  ({ id, name, status, budgetCents }) as ProjectData;
const projects = [
  project(1, "Logística e frete", "working", null),
  project(2, "Auditoria fiscal", "done", 100),
  project(3, "Clube de benefícios", "cancelled", null),
];

describe("matchesQuery", () => {
  test("ignora acentos, caixa e espaços nas pontas", () => {
    assert.equal(matchesQuery(["Benefícios da equipe"], "  BENEFICIOS "), true);
    assert.equal(matchesQuery(["Folha"], "aluguel"), false);
    assert.equal(matchesQuery(["Qualquer"], ""), true);
  });
});

describe("filterTransactions", () => {
  test("combina tipo, busca e categoria", () => {
    assert.deepEqual(filterTransactions(orders, { type: "out", query: "", category: "" }).map((o) => o.id), [2, 3]);
    assert.deepEqual(filterTransactions(orders, { type: "in", query: "", category: "" }).map((o) => o.id), [1, 4]);
    assert.deepEqual(filterTransactions(orders, { type: "all", query: "pessoal", category: "" }).map((o) => o.id), [2, 3]);
    assert.deepEqual(filterTransactions(orders, { type: "out", query: "folha", category: "Pessoal" }).map((o) => o.id), [2]);
    assert.deepEqual(filterTransactions(orders, { type: "in", query: "", category: "Pessoal" }), []);
  });
});

describe("filterTeam", () => {
  test("combina busca por nome ou e-mail, status e departamento", () => {
    assert.deepEqual(filterTeam(team, { query: "andre", status: "all", department: "" }).map((a) => a.id), [3]);
    assert.deepEqual(filterTeam(team, { query: "rafael@", status: "all", department: "" }).map((a) => a.id), [2]);
    assert.deepEqual(filterTeam(team, { query: "", status: "online", department: "Controladoria" }).map((a) => a.id), [3]);
  });
});

describe("filterBudgets", () => {
  test("combina status, busca e só sem orçamento", () => {
    assert.deepEqual(filterBudgets(projects, { status: "all", query: "", noBudget: true }).map((p) => p.id), [1, 3]);
    assert.deepEqual(filterBudgets(projects, { status: "working", query: "", noBudget: true }).map((p) => p.id), [1]);
    assert.deepEqual(filterBudgets(projects, { status: "all", query: "auditoria", noBudget: false }).map((p) => p.id), [2]);
  });
});

describe("uniqueSorted", () => {
  test("remove repetidos e ordena em português", () => {
    assert.deepEqual(uniqueSorted(["Pessoal", "Ajustes", "Pessoal", "Ética"]), ["Ajustes", "Ética", "Pessoal"]);
  });
});

describe("filterBankTransactions", () => {
  const tx = (id: number, description: string, category: string, amountCents: number, institutionName: string) => ({
    id,
    description,
    category,
    amountCents,
    institutionName,
  });
  const imported = [
    tx(1, "Salário", "Salário", 1_250_000, "Banco Horizonte"),
    tx(2, "Supermercado", "Alimentação", -30_000, "Banco Horizonte"),
    tx(3, "Restaurante", "Alimentação", -9_000, "Aurora Digital"),
  ];

  test("combina busca, tipo, categoria e banco", () => {
    const all = { query: "", type: "all" as const, category: "", institution: "" };
    assert.deepEqual(filterBankTransactions(imported, { ...all, category: "Alimentação" }).map((t) => t.id), [2, 3]);
    assert.deepEqual(filterBankTransactions(imported, { ...all, type: "in" }).map((t) => t.id), [1]);
    assert.deepEqual(filterBankTransactions(imported, { ...all, institution: "Aurora Digital" }).map((t) => t.id), [3]);
    assert.deepEqual(filterBankTransactions(imported, { ...all, query: "alimentacao", type: "out" }).map((t) => t.id), [2, 3]);
  });
});
