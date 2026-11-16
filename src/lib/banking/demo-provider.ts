import { randomUUID } from "node:crypto";
import { demoAccounts, demoTransactions, parseDemoItemId } from "@/lib/banking/demo-data";
import type { BankingProvider } from "@/lib/banking/provider";

const TOKEN_TTL_MS = 30 * 60_000;
const CONSENT_DAYS = 365;

/** Mesmo formato de vida curta do Connect Token da Pluggy (30 min), sem assinatura: é só demonstração. */
export function isValidDemoConnectToken(token: unknown) {
  const match = typeof token === "string" ? /^demo_ct_([0-9a-z]+)_[0-9a-f-]{36}$/.exec(token) : null;
  return !!match && parseInt(match[1], 36) > Date.now();
}

const itemIdOf = (accountExternalId: string) => accountExternalId.split(":")[0];

export const demoProvider: BankingProvider = {
  mode: "demo",

  async createConnectToken() {
    return `demo_ct_${(Date.now() + TOKEN_TTL_MS).toString(36)}_${randomUUID()}`;
  },

  async getItem(itemId) {
    const parsed = parseDemoItemId(itemId);
    if (!parsed) throw new Error("Conexão de demonstração inválida.");
    return {
      id: itemId,
      institutionName: parsed.institution.name,
      institutionColor: parsed.institution.color,
      status: "UPDATED",
      executionStatus: "SUCCESS",
      consentExpiresAt: new Date(parsed.createdAt.getTime() + CONSENT_DAYS * 86_400_000),
    };
  },

  async listAccounts(itemId) {
    return demoAccounts(itemId);
  },

  async listTransactions(account, from) {
    return demoTransactions(itemIdOf(account.externalId), account.type).filter((t) => t.date >= from);
  },

  async deleteItem() {
    // Nada a revogar fora do Finova: o banco de demonstração não existe de verdade.
  },
};
