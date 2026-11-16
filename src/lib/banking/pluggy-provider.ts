/**
 * Cliente mínimo da API da Pluggy (https://docs.pluggy.ai), só no servidor.
 * As chaves vêm de variáveis de ambiente e nunca chegam ao navegador.
 */
import { cardExpenseIsPositive, maskAccountNumber, normalizeAmount, normalizeCardAmount } from "@/lib/banking/normalize";
import type { AccountType } from "@/lib/banking/normalize";
import type { BankingProvider, Institution, ProviderAccount, ProviderTransaction } from "@/lib/banking/provider";

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
let cachedInstitutions: { list: Institution[]; expiresAt: number } | null = null;
const INSTITUTIONS_TTL_MS = 3_600_000;
/** Tipos de conector oferecidos: contas de pessoa física e de empresa. */
const BANK_TYPES = new Set(["PERSONAL_BANK", "BUSINESS_BANK"]);

interface PluggyConnector {
  id: number;
  name: string;
  type: string;
  primaryColor?: string | null;
  imageUrl?: string | null;
  isSandbox?: boolean;
  isOpenFinance?: boolean;
}

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
  connector: { name: string; primaryColor?: string; imageUrl?: string | null };
}

const hex = (color?: string | null) => (color ?? "9498a1").replace("#", "");

interface PluggyAccount {
  id: string;
  type: AccountType;
  name: string;
  marketingName?: string | null;
  number?: string | null;
  balance: number;
  creditData?: {
    brand?: string | null;
    level?: string | null;
    creditLimit?: number | null;
    availableCreditLimit?: number | null;
    balanceCloseDate?: string | null;
    balanceDueDate?: string | null;
    minimumPayment?: number | null;
  } | null;
}

/** "MASTERCARD" → "Mastercard", "BLACK" → "Black". */
const titleCase = (text?: string | null) =>
  (text ?? "").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
const cents = (value?: number | null) => Math.round((value ?? 0) * 100);
/** Datas de fatura vêm só com o dia; meio-dia UTC evita "voltar um dia" no fuso de Brasília. */
const billDate = (day?: string | null) => (day ? new Date(`${day.slice(0, 10)}T15:00:00Z`) : new Date(NaN));

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

  async listInstitutions() {
    if (cachedInstitutions && cachedInstitutions.expiresAt > Date.now()) return cachedInstitutions.list;
    // A API só devolve os conectores liberados para esta aplicação: em produção, os bancos reais.
    const sandbox = process.env.PLUGGY_SANDBOX === "true" ? "&sandbox=true" : "";
    const { results } = await pluggy<{ results: PluggyConnector[] }>(`/connectors?countries=BR${sandbox}`);
    const list = results
      .filter((c) => BANK_TYPES.has(c.type))
      .map((c) => ({
        id: String(c.id),
        name: c.name,
        color: hex(c.primaryColor),
        imageUrl: c.imageUrl ?? null,
        openFinance: !!c.isOpenFinance,
        sandbox: !!c.isSandbox,
      }))
      // Bancos reais antes dos de teste; Open Finance primeiro; depois por nome.
      .sort(
        (a, b) =>
          Number(a.sandbox) - Number(b.sandbox) ||
          Number(b.openFinance) - Number(a.openFinance) ||
          a.name.localeCompare(b.name, "pt-BR"),
      );
    cachedInstitutions = { list, expiresAt: Date.now() + INSTITUTIONS_TTL_MS };
    return list;
  },

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
      institutionColor: hex(item.connector.primaryColor),
      institutionImageUrl: item.connector.imageUrl ?? null,
      status: item.status,
      executionStatus: item.executionStatus,
      consentExpiresAt: item.consentExpiresAt ? new Date(item.consentExpiresAt) : null,
    };
  },

  async listAccounts(itemId): Promise<ProviderAccount[]> {
    const { results } = await pluggy<{ results: PluggyAccount[] }>(`/accounts?itemId=${encodeURIComponent(itemId)}`);
    return results.map((account) => {
      const credit = account.type === "CREDIT" ? account.creditData : null;
      return {
        externalId: account.id,
        type: account.type,
        name: account.name || account.marketingName || "Conta",
        number: maskAccountNumber(account.number),
        // Cartão: o sinal do saldo varia; guardamos a fatura como valor devido (positivo).
        balanceCents: account.type === "CREDIT" ? Math.abs(cents(account.balance)) : cents(account.balance),
        credit: credit
          ? {
              brand: titleCase(credit.brand),
              level: titleCase(credit.level),
              creditLimitCents: cents(credit.creditLimit),
              availableLimitCents: cents(credit.availableCreditLimit),
              billCloseDate: billDate(credit.balanceCloseDate),
              billDueDate: billDate(credit.balanceDueDate),
              minimumPaymentCents: cents(credit.minimumPayment),
            }
          : undefined,
      };
    });
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
