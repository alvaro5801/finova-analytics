import type { AuthorData, OrderEventData, ProjectData } from "../types/dashboard.ts";

/** Minúsculas, sem acentos e sem espaços nas pontas: "Benefícios" casa com "beneficios". */
export function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesQuery(fields: string[], query: string) {
  const q = normalizeText(query);
  return !q || fields.some((field) => normalizeText(field).includes(q));
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export type TransactionType = "all" | "in" | "out";

export interface TransactionFilters {
  type: TransactionType;
  query: string;
  /** Vazio = todas as categorias. */
  category: string;
}

export function filterTransactions(orders: OrderEventData[], f: TransactionFilters) {
  return orders.filter(
    (o) =>
      (f.type === "all" || (f.type === "in" ? o.amountCents > 0 : o.amountCents < 0)) &&
      (!f.category || o.description === f.category) &&
      matchesQuery([o.title, o.description], f.query),
  );
}

export interface TeamFilters {
  query: string;
  status: "all" | AuthorData["status"];
  department: string;
}

export function filterTeam(authors: AuthorData[], f: TeamFilters) {
  return authors.filter(
    (a) =>
      (f.status === "all" || a.status === f.status) &&
      (!f.department || a.department === f.department) &&
      matchesQuery([a.name, a.email, a.function], f.query),
  );
}

export interface BudgetFilters {
  status: "all" | ProjectData["status"];
  query: string;
  noBudget: boolean;
}

export function filterBudgets(projects: ProjectData[], f: BudgetFilters) {
  return projects.filter(
    (p) =>
      (f.status === "all" || p.status === f.status) &&
      (!f.noBudget || p.budgetCents === null) &&
      matchesQuery([p.name], f.query),
  );
}
