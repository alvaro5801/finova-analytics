/**
 * Banco de demonstração: instituições fictícias e histórico gerado de forma
 * determinística a partir do `itemId`. Sincronizar de novo devolve as mesmas
 * transações passadas (mais as dos dias novos), como um banco de verdade.
 */
import type { AccountType } from "./normalize.ts";

export interface DemoInstitution {
  id: string;
  name: string;
  /** Hex sem "#", no mesmo formato do `primaryColor` da Pluggy. */
  color: string;
}

export const DEMO_INSTITUTIONS: DemoInstitution[] = [
  { id: "horizonte", name: "Banco Horizonte", color: "5bb89d" },
  { id: "aurora", name: "Aurora Digital", color: "88bfe6" },
  { id: "capital-sul", name: "Capital Sul", color: "ecb461" },
  { id: "nuvem", name: "Nuvem Bank", color: "9498a1" },
  { id: "cooperativa-vale", name: "Cooperativa do Vale", color: "5eca8e" },
  { id: "atlantico", name: "Banco Atlântico", color: "d4733d" },
];

export interface DemoAccount {
  externalId: string;
  type: AccountType;
  name: string;
  number: string;
  balanceCents: number;
}

export interface DemoTransaction {
  externalId: string;
  date: Date;
  description: string;
  category: string;
  amountCents: number;
}

const DAY = 86_400_000;
const HISTORY_DAYS = 90;

export function createDemoItemId(institutionId: string, now = Date.now(), random = Math.random) {
  const suffix = Math.floor(random() * 36 ** 6).toString(36).padStart(6, "0");
  return `demo_${institutionId}_${now.toString(36)}_${suffix}`;
}

export function parseDemoItemId(itemId: string) {
  const match = /^demo_([a-z-]+)_([0-9a-z]+)_([0-9a-z]+)$/.exec(itemId);
  const institution = match && DEMO_INSTITUTIONS.find((i) => i.id === match[1]);
  if (!match || !institution) return null;
  return { institution, createdAt: new Date(parseInt(match[2], 36)) };
}

/** FNV-1a: transforma uma string em semente numérica estável. */
function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32: gerador pseudoaleatório pequeno e reprodutível. */
function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (r: () => number, min: number, max: number) => Math.round((min + r() * (max - min)) * 100);

interface Template {
  description: string;
  category: string;
  min: number;
  max: number;
  /** Probabilidade de ocorrer num dia qualquer. */
  chance: number;
  inflow?: boolean;
}

const BANK_DAILY: Template[] = [
  { description: "Supermercado", category: "Alimentação", min: 80, max: 450, chance: 0.22 },
  { description: "Pix recebido", category: "Transferências", min: 50, max: 800, chance: 0.12, inflow: true },
  { description: "Pix enviado", category: "Transferências", min: 30, max: 400, chance: 0.14 },
  { description: "Farmácia", category: "Saúde", min: 25, max: 180, chance: 0.08 },
  { description: "Posto de combustível", category: "Transporte", min: 120, max: 300, chance: 0.1 },
];

const CARD_DAILY: Template[] = [
  { description: "Restaurante", category: "Alimentação", min: 45, max: 220, chance: 0.25 },
  { description: "Delivery de comida", category: "Alimentação", min: 35, max: 120, chance: 0.3 },
  { description: "Corrida por aplicativo", category: "Transporte", min: 15, max: 60, chance: 0.35 },
  { description: "Loja online", category: "Compras", min: 60, max: 600, chance: 0.12 },
  { description: "Cinema", category: "Lazer", min: 40, max: 90, chance: 0.06 },
  { description: "Livraria", category: "Compras", min: 40, max: 150, chance: 0.05 },
];

/** Valor da fatura paga num mês: o mesmo número sai da conta e entra no cartão. */
function billAmount(itemId: string, monthKey: string) {
  return between(rng(`${itemId}:bill:${monthKey}`), 1800, 4200);
}

function monthlyBank(itemId: string, day: Date, r: () => number): Omit<DemoTransaction, "externalId" | "date">[] {
  const monthKey = day.toISOString().slice(0, 7);
  switch (day.getUTCDate()) {
    case 5:
      return [{ description: "Salário", category: "Salário", amountCents: 1_250_000 }];
    case 10:
      return [{ description: "Aluguel", category: "Moradia", amountCents: -320_000 }];
    case 12:
      return [{ description: "Conta de luz", category: "Moradia", amountCents: -between(r, 180, 320) }];
    case 7:
      return [
        { description: "Pagamento da fatura do cartão", category: "Pagamento de fatura", amountCents: -billAmount(itemId, monthKey) },
      ];
    case 20:
      return [{ description: "Aplicação em CDB", category: "Investimentos", amountCents: -100_000 }];
    case 25:
      return [{ description: "Plano de saúde", category: "Saúde", amountCents: -65_000 }];
    default:
      return [];
  }
}

function monthlyCard(itemId: string, day: Date): Omit<DemoTransaction, "externalId" | "date">[] {
  const monthKey = day.toISOString().slice(0, 7);
  switch (day.getUTCDate()) {
    case 3:
      return [{ description: "Streaming de vídeo", category: "Assinaturas", amountCents: -5_590 }];
    case 8:
      return [{ description: "Streaming de música", category: "Assinaturas", amountCents: -2_190 }];
    case 7:
      return [{ description: "Pagamento recebido", category: "Pagamento de fatura", amountCents: billAmount(itemId, monthKey) }];
    case 18:
      return [{ description: "Armazenamento em nuvem", category: "Assinaturas", amountCents: -990 }];
    default:
      return [];
  }
}

export function demoTransactions(itemId: string, accountType: AccountType, now = new Date()): DemoTransaction[] {
  const parsed = parseDemoItemId(itemId);
  const createdAt = parsed?.createdAt ?? now;
  const firstDay = Math.floor(createdAt.getTime() / DAY) - HISTORY_DAYS;
  const lastDay = Math.floor(now.getTime() / DAY);
  const templates = accountType === "BANK" ? BANK_DAILY : CARD_DAILY;
  const out: DemoTransaction[] = [];

  for (let dayNumber = firstDay; dayNumber <= lastDay; dayNumber++) {
    const day = new Date(dayNumber * DAY);
    const r = rng(`${itemId}:${accountType}:${dayNumber}`);
    const entries = [
      ...(accountType === "BANK" ? monthlyBank(itemId, day, r) : monthlyCard(itemId, day)),
      ...templates
        .filter((t) => r() < t.chance)
        .map((t) => ({
          description: t.description,
          category: t.category,
          amountCents: (t.inflow ? 1 : -1) * between(r, t.min, t.max),
        })),
    ];
    entries.forEach((entry, i) => {
      // Horário estável entre 8h e 21h (UTC-3) para a lista não ficar toda à meia-noite.
      const date = new Date(day.getTime() + (11 + Math.floor(r() * 13)) * 3_600_000 + Math.floor(r() * 60) * 60_000);
      if (date.getTime() > now.getTime()) return;
      out.push({ externalId: `${itemId}:${accountType}:${dayNumber}:${i}`, date, ...entry });
    });
  }
  return out;
}

export function demoAccounts(itemId: string, now = new Date()): DemoAccount[] {
  const r = rng(`${itemId}:accounts`);
  const digits = () => String(1000 + Math.floor(r() * 9000));
  const bank = demoTransactions(itemId, "BANK", now);
  const card = demoTransactions(itemId, "CREDIT", now);

  // Fatura em aberto: compras desde o último pagamento (dia 7).
  const lastPayment = [...card].reverse().find((t) => t.category === "Pagamento de fatura");
  const openBill = card
    .filter((t) => t.amountCents < 0 && (!lastPayment || t.date > lastPayment.date))
    .reduce((sum, t) => sum - t.amountCents, 0);

  return [
    {
      externalId: `${itemId}:BANK`,
      type: "BANK",
      name: "Conta corrente",
      number: `•••• ${digits()}`,
      balanceCents: 480_000 + bank.reduce((sum, t) => sum + t.amountCents, 0),
    },
    {
      externalId: `${itemId}:CREDIT`,
      type: "CREDIT",
      name: "Cartão de crédito",
      number: `•••• ${digits()}`,
      balanceCents: openBill,
    },
  ];
}
