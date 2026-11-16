import type { MetricFormat } from "@/types/dashboard";

/**
 * Formatação pt-BR na borda da aplicação (D1). O banco guarda inteiros
 * (centavos, pontos-base, unidades) e só a UI transforma em texto.
 *
 * Atenção: o Intl insere um espaço NÃO separável (U+00A0) entre "R$" e o número.
 * Em testes, use /R\$\s/ e não "R$ " com espaço comum.
 */
const LOCALE = "pt-BR";

const brl = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "BRL" });
const brlCompact = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const integer = new Intl.NumberFormat(LOCALE);
const percent = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const MINUS = "−";

/**
 * 12345678 → "R$ 123.456,78".
 * Negativos usam o menos tipográfico (U+2212), o mesmo de `formatSignedBRL` e `formatDelta`:
 * o Intl usaria o hífen comum (U+002D), o que deixaria dois sinais diferentes na mesma tela.
 */
export function formatBRL(cents: number) {
  const formatted = brl.format(Math.abs(cents) / 100);
  return cents < 0 ? `${MINUS}${formatted}` : formatted;
}

/** 48632045 → "R$ 486,3 mil" (eixos e rótulos curtos). */
export function formatBRLCompact(cents: number) {
  return brlCompact.format(cents / 100);
}

/** Entradas com "+" e saídas com "−" (sinal de menos tipográfico). */
export function formatSignedBRL(cents: number) {
  const abs = formatBRL(Math.abs(cents));
  return cents < 0 ? `${MINUS}${abs}` : `+${abs}`;
}

export function formatNumber(value: number) {
  return integer.format(value);
}

const decimal1 = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** 8.7 → "8,7" */
export function formatDecimal(value: number) {
  return decimal1.format(value);
}

/** Recebe pontos percentuais: 12.4 → "12,4%". */
export function formatPercent(pct: number) {
  return percent.format(pct / 100);
}

/** Variação com sinal: 12.4 → "+12,4%", -3 → "−3,0%". */
export function formatDelta(pct: number) {
  const abs = formatPercent(Math.abs(pct));
  return pct < 0 ? `${MINUS}${abs}` : `+${abs}`;
}

export function formatMetric(value: number, format: MetricFormat) {
  switch (format) {
    case "currency":
      return formatBRL(value);
    case "percent":
      return formatPercent(value / 100); // pontos-base → pontos percentuais
    case "number":
      return formatNumber(value);
  }
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parseMonthKey(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

const monthShort = new Intl.DateTimeFormat(LOCALE, { month: "short" });
const monthLong = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" });
const monthName = new Intl.DateTimeFormat(LOCALE, { month: "long" });

/** "2026-10" → "Out" */
export function formatMonthShort(key: string) {
  return capitalize(monthShort.format(parseMonthKey(key)).replace(".", ""));
}

/** "2026-10" → "Outubro de 2026" */
export function formatMonthLong(key: string) {
  return capitalize(monthLong.format(parseMonthKey(key)));
}

/** "2026-10" → "outubro" */
export function formatMonthName(key: string) {
  return monthName.format(parseMonthKey(key));
}

const dateMedium = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "short", year: "numeric" });
const dateTimeShort = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/** ISO → "01 de nov. de 2026" */
export function formatDate(iso: string | Date) {
  return dateMedium.format(new Date(iso));
}

/** ISO → "15 de nov., 14:32" */
export function formatDateTime(iso: string | Date) {
  return dateTimeShort.format(new Date(iso));
}

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: "always" });

/** "há 5 minutos", "há 3 horas"... Abaixo de 1 minuto: "agora há pouco". */
export function formatRelative(iso: string | Date, now = new Date()) {
  const seconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return "agora há pouco";
  if (abs < 3600) return relative.format(Math.round(seconds / 60), "minute");
  if (abs < 86_400) return relative.format(Math.round(seconds / 3600), "hour");
  return relative.format(Math.round(seconds / 86_400), "day");
}
