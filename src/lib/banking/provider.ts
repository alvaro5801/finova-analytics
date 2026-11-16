import type { AccountType } from "@/lib/banking/normalize";
import { demoProvider } from "@/lib/banking/demo-provider";
import { pluggyProvider } from "@/lib/banking/pluggy-provider";

export type BankingMode = "demo" | "pluggy";

export interface ProviderItem {
  id: string;
  institutionName: string;
  institutionColor: string;
  status: string;
  executionStatus?: string | null;
  consentExpiresAt?: Date | null;
}

export interface ProviderAccount {
  externalId: string;
  type: AccountType;
  name: string;
  number: string;
  balanceCents: number;
}

export interface ProviderTransaction {
  externalId: string;
  date: Date;
  description: string;
  category: string;
  amountCents: number;
}

/** Contrato comum: o app fala com o agregador só por aqui, nunca direto com a API. */
export interface BankingProvider {
  mode: BankingMode;
  /** Token de vida curta que o navegador usa para abrir o fluxo de conexão. */
  createConnectToken(userId: string): Promise<string>;
  getItem(itemId: string): Promise<ProviderItem>;
  listAccounts(itemId: string): Promise<ProviderAccount[]>;
  listTransactions(account: { externalId: string; type: AccountType }, from: Date): Promise<ProviderTransaction[]>;
  /** Revoga o consentimento no agregador e apaga os dados de lá. */
  deleteItem(itemId: string): Promise<void>;
}

/** Pluggy só entra com as chaves configuradas; sem elas, o app roda em modo demonstração. */
export function bankingMode(): BankingMode {
  const { BANKING_PROVIDER, PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET } = process.env;
  return BANKING_PROVIDER === "pluggy" && PLUGGY_CLIENT_ID && PLUGGY_CLIENT_SECRET ? "pluggy" : "demo";
}

export function providerFor(mode: string): BankingProvider {
  return mode === "pluggy" ? pluggyProvider : demoProvider;
}

export function currentProvider(): BankingProvider {
  return providerFor(bankingMode());
}
