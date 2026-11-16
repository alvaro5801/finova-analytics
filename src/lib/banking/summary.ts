/**
 * Resumo da Visão geral calculado com as transações importadas dos bancos, nos mesmos
 * formatos dos dados de demonstração: os gráficos e cards não precisam saber a origem.
 */
import type { OrderEventData, SalesPointData, StatCardData } from "../../types/dashboard.ts";

export interface SummaryTransaction {
  id: number;
  date: Date;
  description: string;
  category: string;
  amountCents: number;
  accountType: "BANK" | "CREDIT";
}

export interface SummaryAccount {
  type: "BANK" | "CREDIT";
  balanceCents: number;
}

export interface BankSummary {
  /** Mês mais recente com lançamentos ("AAAA-MM"). */
  periodKey: string;
  stats: StatCardData[];
  sales: SalesPointData[];
  orders: OrderEventData[];
}

/**
 * Pagamento da fatura sai da conta e entra no cartão: é transferência entre contas da
 * mesma pessoa. Contar como despesa dobraria os gastos (as compras já estão no cartão).
 */
export const BILL_PAYMENT_CATEGORIES = new Set(["Pagamento de fatura", "Pagamento de cartão de crédito"]);
const RECENT_LIMIT = 30;

/** Competência no fuso de Brasília (UTC−3), sem depender do fuso do servidor. */
const monthKey = (date: Date) => new Date(date.getTime() - 3 * 3_600_000).toISOString().slice(0, 7);

function monthsBetween(first: string, last: string) {
  const keys: string[] = [];
  let [year, month] = first.split("-").map(Number);
  for (let key = first; key <= last; ) {
    keys.push(key);
    month += 1;
    if (month > 12) [year, month] = [year + 1, 1];
    key = `${year}-${String(month).padStart(2, "0")}`;
  }
  return keys;
}

/** Variação percentual com uma casa; base zero não tem variação definida e vira 0. */
const pctChange = (current: number, previous: number) =>
  previous === 0 ? 0 : Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;

export function bankSummary(transactions: SummaryTransaction[], accounts: SummaryAccount[]): BankSummary | null {
  if (transactions.length === 0) return null;
  const isBillPayment = (t: SummaryTransaction) => BILL_PAYMENT_CATEGORIES.has(t.category);

  const byMonth = new Map<string, { revenue: number; expenses: number }>();
  for (const t of transactions) {
    const key = monthKey(t.date);
    const month = byMonth.get(key) ?? { revenue: 0, expenses: 0 };
    if (!isBillPayment(t)) {
      if (t.amountCents > 0) month.revenue += t.amountCents;
      else month.expenses -= t.amountCents;
    }
    byMonth.set(key, month);
  }

  const keys = [...byMonth.keys()].sort();
  const months = monthsBetween(keys[0], keys.at(-1)!);
  const sales: SalesPointData[] = months.map((month, i) => ({
    id: i + 1,
    month,
    revenueCents: byMonth.get(month)?.revenue ?? 0,
    expensesCents: byMonth.get(month)?.expenses ?? 0,
    order: i,
  }));

  const periodKey = months.at(-1)!;
  const current = sales.at(-1)!;
  const previous = sales.at(-2) ?? { revenueCents: 0, expensesCents: 0 };
  const result = current.revenueCents - current.expensesCents;
  const previousResult = previous.revenueCents - previous.expensesCents;

  // Saldo das contas correntes; a variação compara com o saldo no início do mês.
  const balance = accounts.filter((a) => a.type === "BANK").reduce((sum, a) => sum + a.balanceCents, 0);
  const monthNet = transactions
    .filter((t) => t.accountType === "BANK" && monthKey(t.date) === periodKey)
    .reduce((sum, t) => sum + t.amountCents, 0);
  const startBalance = balance - monthNet;

  const stat = (
    order: number,
    key: string,
    title: string,
    value: number,
    changePct: number,
    changeLabel: string,
    icon: string,
    color: StatCardData["color"],
  ): StatCardData => ({ id: order + 1, key, title, value, format: "currency", changePct, changeLabel, icon, color, order });

  const stats = [
    stat(0, "revenue", "Receita do mês", current.revenueCents, pctChange(current.revenueCents, previous.revenueCents), "vs. mês anterior", "trending-up", "primary"),
    stat(1, "expenses", "Despesas do mês", current.expensesCents, pctChange(current.expensesCents, previous.expensesCents), "vs. mês anterior", "receipt", "warning"),
    stat(2, "balance", "Saldo em conta", balance, pctChange(balance, startBalance), "no mês", "wallet", "info"),
    stat(3, "result", "Resultado do mês", result, pctChange(result, previousResult), "vs. mês anterior", "chart-line", "success"),
  ];

  const orders: OrderEventData[] = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, RECENT_LIMIT)
    .map((t, i) => {
      const bill = isBillPayment(t);
      const incoming = t.amountCents > 0;
      return {
        id: t.id,
        title: t.description,
        description: t.category,
        amountCents: t.amountCents,
        date: t.date.toISOString(),
        color: bill ? "info" : incoming ? "success" : "warning",
        icon: bill ? "refresh" : incoming ? "arrow-in" : "arrow-out",
        order: i,
      };
    });

  return { periodKey, stats, sales, orders };
}
