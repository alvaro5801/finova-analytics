import type { AccountType } from "@/lib/banking/normalize";
import type { CreditCardData } from "@/lib/banking/demo-data";
import { demoProvider } from "@/lib/banking/demo-provider";
import { pluggyProvider } from "@/lib/banking/pluggy-provider";

export type BankingMode = "demo" | "pluggy";

/** Banco que o cliente pode escolher na lista do Finova. */
export interface Institution {
  /** Id do conector no agregador (texto: no modo demonstração é um slug). */
  id: string;
  name: string;
  /** Hex sem "#". */
  color: string;
  imageUrl: string | null;
  openFinance: boolean;
  /** Banco de testes do agregador. */
  sandbox: boolean;
}

export interface ProviderItem {
  id: string;
  institutionName: string;
  institutionColor: string;
  institutionImageUrl?: string | null;
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
  /** Só cartões de crédito: limite, fechamento, vencimento e pagamento mínimo. */
  credit?: CreditCardData;
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
  /** Bancos liberados para conexão, na ordem em que aparecem para o cliente. */
  listInstitutions(): Promise<Institution[]>;
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
