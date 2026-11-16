export type StatColor = "dark" | "info" | "success" | "primary" | "warning" | "danger";

/** D1: "currency" = centavos · "percent" = pontos-base (1% = 100) · "number" = unidades. */
export type MetricFormat = "currency" | "percent" | "number";

export interface StatCardData {
  id: number;
  key: string;
  title: string;
  value: number;
  format: MetricFormat;
  changePct: number;
  changeLabel: string;
  icon: string;
  color: StatColor;
  order: number;
}

export interface SalesPointData {
  id: number;
  /** Período "AAAA-MM". */
  month: string;
  revenueCents: number;
  expensesCents: number;
  order: number;
}

export interface ActiveUsersPointData {
  id: number;
  day: string;
  value: number;
  order: number;
}

export interface ActiveUsersStatData {
  id: number;
  label: string;
  value: number;
  format: MetricFormat;
  icon: string;
  order: number;
}

export interface ActiveUsersResponse {
  chart: ActiveUsersPointData[];
  stats: ActiveUsersStatData[];
}

/** Meta anual de receita: `value` = % atingido de `targetCents`. */
export interface SatisfactionRateData {
  id: number;
  value: number;
  label: string;
  targetCents: number;
}

export interface ReferralPointData {
  id: number;
  series: string;
  month: string;
  value: number;
  order: number;
}

export interface ReferralSummaryData {
  id: number;
  series: string;
  label: string;
  value: number;
  format: MetricFormat;
  changePct: number;
}

export interface ScoreRingData {
  id: number;
  label: string;
  value: number;
  maxValue: number;
  caption: string;
}

export interface ReferralResponse {
  points: ReferralPointData[];
  summary: ReferralSummaryData[];
  score: ScoreRingData | null;
}

export interface ProjectData {
  id: number;
  name: string;
  icon: string;
  members: string;
  /** `null` = orçamento não definido. */
  budgetCents: number | null;
  completion: number;
  status: "working" | "done" | "cancelled";
  order: number;
}

export interface OrderEventData {
  id: number;
  title: string;
  description: string;
  /** Positivo = entrada, negativo = saída. */
  amountCents: number;
  date: string;
  color: StatColor;
  icon: string;
  order: number;
}

export interface AuthorData {
  id: number;
  name: string;
  email: string;
  avatarColor: StatColor;
  function: string;
  department: string;
  status: "online" | "offline";
  employed: string;
  order: number;
}

export interface InvoiceData {
  id: number;
  issuedAt: string;
  code: string;
  amountCents: number;
  order: number;
}

export interface ApiEnvelope<T> {
  data: T;
}

export interface ApiErrorEnvelope {
  error: { message: string };
}

export interface AuthUser {
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// ── Integrações bancárias ──
export type BankingMode = "demo" | "pluggy";
export type BankConnectionStatus = "connected" | "syncing" | "error" | "reconnect";

export interface BankAccountData {
  id: number;
  type: "BANK" | "CREDIT";
  name: string;
  number: string;
  /** Conta: saldo. Cartão: fatura em aberto. */
  balanceCents: number;
  /** Campos só de cartão de crédito (nulos em conta corrente). */
  brand: string | null;
  level: string | null;
  creditLimitCents: number | null;
  availableLimitCents: number | null;
  billCloseDate: string | null;
  billDueDate: string | null;
  minimumPaymentCents: number | null;
  transactionCount: number;
}

export interface BankConnectionData {
  id: number;
  provider: BankingMode;
  institutionName: string;
  institutionColor: string;
  institutionImageUrl: string | null;
  status: BankConnectionStatus;
  lastSyncAt: string | null;
  consentExpiresAt: string | null;
  createdAt: string;
  accounts: BankAccountData[];
}

export interface IntegrationsResponse {
  mode: BankingMode;
  sandbox: boolean;
  connections: BankConnectionData[];
}

export interface BankInstitutionData {
  id: string;
  name: string;
  color: string;
  imageUrl: string | null;
  openFinance: boolean;
  sandbox: boolean;
}

export interface BankTransactionData {
  id: number;
  date: string;
  description: string;
  category: string;
  /** Positivo = entrada, negativo = saída. */
  amountCents: number;
  accountType: "BANK" | "CREDIT";
  accountName: string;
  connectionId: number;
  institutionName: string;
}

/** Visão geral calculada com as transações dos bancos conectados. */
export interface BankSummaryData {
  periodKey: string;
  stats: StatCardData[];
  sales: SalesPointData[];
  orders: OrderEventData[];
  transactionCount: number;
  institutions: string[];
}

export interface ConnectResultData {
  id: number;
  institutionName: string;
  accounts: number;
  imported: number;
}
