/**
 * Tradução dos dados do agregador (formato da Pluggy) para o modelo do Finova.
 * Funções puras, sem I/O: o provedor real e o de demonstração usam as mesmas regras.
 */

export type ConnectionStatus = "connected" | "syncing" | "error" | "reconnect";
export type AccountType = "BANK" | "CREDIT";

/** Estados que exigem que o usuário passe pelo banco de novo (consentimento ou login). */
const NEEDS_USER = new Set(["USER_AUTHORIZATION_REVOKED", "USER_AUTHORIZATION_NOT_GRANTED", "INVALID_CREDENTIALS"]);

export function mapItemStatus(status: string, executionStatus?: string | null): ConnectionStatus {
  if (executionStatus && NEEDS_USER.has(executionStatus)) return "reconnect";
  switch (status) {
    case "UPDATED":
      return "connected";
    case "UPDATING":
      return "syncing";
    case "LOGIN_ERROR":
    case "WAITING_USER_INPUT":
      return "reconnect";
    default:
      return "error";
  }
}

/** Conta: a Pluggy manda o valor com sinal (débito negativo). Débito positivo é tratado como saída. */
export function normalizeAmount(amount: number, txType?: "CREDIT" | "DEBIT"): number {
  const cents = Math.round(amount * 100);
  return txType === "DEBIT" && cents > 0 ? -cents : cents;
}

/**
 * Cartão: o sinal não é confiável entre ambientes (a documentação diz "compra = positivo",
 * o sandbox manda compra negativa, e o `type` vem CREDIT nos dois casos). Como as compras
 * são a imensa maioria num cartão, o sinal predominante indica qual é o de gasto.
 */
export function cardExpenseIsPositive(amounts: number[]): boolean {
  const positives = amounts.filter((a) => a > 0).length;
  const negatives = amounts.filter((a) => a < 0).length;
  return positives > negatives;
}

/** Compra vira saída; estorno (sinal oposto) e pagamento da fatura viram entrada. */
export function normalizeCardAmount(amount: number, expenseIsPositive: boolean, isBillPayment: boolean): number {
  const cents = Math.abs(Math.round(amount * 100));
  if (isBillPayment) return cents;
  const isExpense = expenseIsPositive ? amount > 0 : amount < 0;
  return isExpense ? -cents : cents;
}

export function maskAccountNumber(number?: string | null): string {
  const digits = (number ?? "").replace(/\D/g, "");
  return digits ? `•••• ${digits.slice(-4)}` : "••••";
}
