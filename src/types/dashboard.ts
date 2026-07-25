export type StatColor = "dark" | "info" | "success" | "primary" | "warning" | "danger";

export interface StatCardData {
  id: number;
  key: string;
  title: string;
  value: string;
  changePct: number;
  changeLabel: string;
  icon: string;
  color: StatColor;
  order: number;
}

export interface SalesPointData {
  id: number;
  month: string;
  value: number;
  secondary: number;
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
  value: string;
  icon: string;
  order: number;
}

export interface ActiveUsersResponse {
  chart: ActiveUsersPointData[];
  stats: ActiveUsersStatData[];
}

export interface SatisfactionRateData {
  id: number;
  value: number;
  label: string;
  totalVotes: number;
}

export interface ReferralPointData {
  id: number;
  series: "invited" | "bonus";
  month: string;
  value: number;
  order: number;
}

export interface ReferralSummaryData {
  id: number;
  series: "invited" | "bonus";
  total: string;
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
  budget: string;
  completion: number;
  status: "working" | "done" | "cancelled";
  order: number;
}

export interface OrderEventData {
  id: number;
  title: string;
  description: string;
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
  date: string;
  code: string;
  amount: string;
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
