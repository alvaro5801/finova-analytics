/**
 * Cliente mínimo da API da Pluggy (https://docs.pluggy.ai), só no servidor.
 * As chaves vêm de variáveis de ambiente e nunca chegam ao navegador.
 */
import { cardExpenseIsPositive, maskAccountNumber, normalizeAmount, normalizeCardAmount } from "@/lib/banking/normalize";
import type { AccountType } from "@/lib/banking/normalize";
import type { BankingProvider, ProviderAccount, ProviderTransaction } from "@/lib/banking/provider";

const BASE_URL = "https://api.pluggy.ai";
/** A API key dura 2 h; renovamos com folga para não usar uma chave prestes a expirar. */
const API_KEY_TTL_MS = 110 * 60_000;
/** Limite de páginas por conta (500 transações cada) para uma sincronização não rodar sem fim. */
const MAX_PAGES = 20;

/** Categoria "Credit card payment" da Pluggy: no cartão, é o pagamento da fatura (entrada). */
const BILL_PAYMENT_CATEGORY_ID = "05100000";
const CATEGORIES_TTL_MS = 24 * 3_600_000;

let cachedKey: { value: string; expiresAt: number } | null = null;
let cachedCategories: { byId: Map<string, string>; expiresAt: number } | null = null;

async function apiKey() {
  if (cachedKey && cachedKey.expiresAt > Date.now()) return cachedKey.value;
  const res = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId: process.env.PLUGGY_CLIENT_ID, clientSecret: process.env.PLUGGY_CLIENT_SECRET }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Pluggy recusou a autenticação (${res.status}).`);
  const { apiKey: value } = (await res.json()) as { apiKey: string };
  cachedKey = { value, expiresAt: Date.now() + API_KEY_TTL_MS };
  return value;
}

async function pluggy<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-API-KEY": await apiKey(), ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Pluggy respondeu ${res.status} em ${path.split("?")[0]}.`);
  return (await res.json()) as T;
}

/** As categorias vêm em inglês nas transações; a Pluggy publica a tradução em /categories. */
async function categoryNames() {
  if (cachedCategories && cachedCategories.expiresAt > Date.now()) return cachedCategories.byId;
  const { results } = await pluggy<{ results: { id: string; description: string; descriptionTranslated?: string }[] }>(
    "/categories",
  );
  const byId = new Map(results.map((c) => [c.id, c.descriptionTranslated || c.description]));
  cachedCategories = { byId, expiresAt: Date.now() + CATEGORIES_TTL_MS };
  return byId;
}

interface PluggyItem {
  id: string;
  status: string;
  executionStatus?: string;
  consentExpiresAt?: string | null;
  connector: { name: string; primaryColor?: string };
}

interface PluggyAccount {
  id: string;
  type: AccountType;
  name: string;
  marketingName?: string | null;
  number?: string | null;
  balance: number;
}

interface PluggyTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type?: "CREDIT" | "DEBIT";
  category?: string | null;
  categoryId?: string | null;
}

export const pluggyProvider: BankingProvider = {
  mode: "pluggy",

  async createConnectToken(userId) {
    // `clientUserId` precisa ir dentro de `options`: na raiz a Pluggy ignora sem avisar.
    const { accessToken } = await pluggy<{ accessToken: string }>("/connect_token", {
      method: "POST",
      body: JSON.stringify({ options: { clientUserId: userId } }),
    });
    return accessToken;
  },

  async getItem(itemId) {
    const item = await pluggy<PluggyItem>(`/items/${encodeURIComponent(itemId)}`);
    return {
      id: item.id,
      institutionName: item.connector.name,
      institutionColor: item.connector.primaryColor ?? "9498a1",
      status: item.status,
      executionStatus: item.executionStatus,
      consentExpiresAt: item.consentExpiresAt ? new Date(item.consentExpiresAt) : null,
    };
  },

  async listAccounts(itemId): Promise<ProviderAccount[]> {
    const { results } = await pluggy<{ results: PluggyAccount[] }>(`/accounts?itemId=${encodeURIComponent(itemId)}`);
    return results.map((account) => ({
      externalId: account.id,
      type: account.type,
      name: account.marketingName || account.name,
      number: maskAccountNumber(account.number),
      // Cartão: o sinal do saldo não é documentado; guardamos a fatura como valor devido (positivo).
      balanceCents: account.type === "CREDIT" ? Math.abs(Math.round(account.balance * 100)) : Math.round(account.balance * 100),
    }));
  },

  async listTransactions(account, from): Promise<ProviderTransaction[]> {
    // /v2/transactions (por cursor): o endpoint paginado antigo é descontinuado em 31/12/2026.
    const raw: PluggyTransaction[] = [];
    let path: string | null =
      `/v2/transactions?accountId=${encodeURIComponent(account.externalId)}&dateFrom=${from.toISOString().slice(0, 10)}`;
    for (let page = 0; path && page < MAX_PAGES; page++) {
      const { results, next }: { results: PluggyTransaction[]; next: string | null } = await pluggy(path);
      raw.push(...results);
      // `next` pode vir como caminho pronto ou só como cursor.
      path = !next
        ? null
        : next.startsWith("/") || next.startsWith("http")
          ? next.replace(BASE_URL, "")
          : `/v2/transactions?accountId=${encodeURIComponent(account.externalId)}&after=${encodeURIComponent(next)}`;
    }

    const categories = await categoryNames();
    const isBillPayment = (tx: PluggyTransaction) => tx.categoryId === BILL_PAYMENT_CATEGORY_ID;
    const expenseIsPositive = cardExpenseIsPositive(raw.filter((tx) => !isBillPayment(tx)).map((tx) => tx.amount));

    return raw.map((tx) => ({
      externalId: tx.id,
      date: new Date(tx.date),
      description: tx.description,
      category: (tx.categoryId && categories.get(tx.categoryId)) || tx.category || "Outros",
      amountCents:
        account.type === "CREDIT"
          ? normalizeCardAmount(tx.amount, expenseIsPositive, isBillPayment(tx))
          : normalizeAmount(tx.amount, tx.type),
    }));
  },

  async deleteItem(itemId) {
    await pluggy(`/items/${encodeURIComponent(itemId)}`, { method: "DELETE" });
  },
};
