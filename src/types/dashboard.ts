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
