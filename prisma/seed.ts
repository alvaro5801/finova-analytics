import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Dados de DEMONSTRAÇÃO da Finova Analytics. Todos os nomes, valores e e-mails são fictícios
 * (domínio reservado `.example`). Dinheiro em centavos (D1), datas relativas ao momento do seed.
 */

/** R$ → centavos, sem passar por float acumulado: reais(1234.56) === 123456. */
const reais = (value: number) => Math.round(value * 100);

const now = new Date();
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
/** Primeiro dia do mês, `offset` meses a partir do mês atual (negativo = passado). */
const monthStart = (offset: number) => new Date(now.getFullYear(), now.getMonth() + offset, 1);
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

async function main() {
  await prisma.statCard.deleteMany();
  await prisma.salesPoint.deleteMany();
  await prisma.activeUsersPoint.deleteMany();
  await prisma.activeUsersStat.deleteMany();
  await prisma.satisfactionRate.deleteMany();
  await prisma.referralPoint.deleteMany();
  await prisma.referralSummary.deleteMany();
  await prisma.project.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.author.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.scoreRing.deleteMany();

  // ── Série mensal: últimos 12 meses fechados (o mês corrente ainda está aberto) ──
  const revenue = [401_250.4, 455_830.1, 368_412.75, 372_904.3, 398_116.0, 410_782.55, 425_390.2, 418_027.9, 446_513.35, 461_208.6, 432_669.8, 486_320.45];
  const expenses = [268_430.0, 301_275.6, 259_118.4, 262_740.15, 271_305.9, 279_660.3, 284_118.75, 281_402.2, 290_884.0, 296_517.45, 300_548.1, 312_870.3];
  const months = revenue.map((_, i) => monthStart(i - 12));

  await prisma.salesPoint.createMany({
    data: months.map((d, i) => ({
      month: monthKey(d),
      revenueCents: reais(revenue[i]),
      expensesCents: reais(expenses[i]),
      order: i,
    })),
  });

  // ── KPIs: derivados da própria série para manter a demo coerente ──
  const last = revenue.length - 1;
  const pctChange = (curr: number, prev: number) => Math.round(((curr - prev) / prev) * 1000) / 10;
  const balanceCents = reais(1_284_560.12);

  await prisma.statCard.createMany({
    data: [
      {
        key: "revenue",
        title: "Receita do mês",
        value: reais(revenue[last]),
        format: "currency",
        changePct: pctChange(revenue[last], revenue[last - 1]),
        changeLabel: "vs. mês anterior",
        icon: "trending-up",
        color: "primary",
        order: 0,
      },
      {
        key: "expenses",
        title: "Despesas do mês",
        value: reais(expenses[last]),
        format: "currency",
        changePct: pctChange(expenses[last], expenses[last - 1]),
        changeLabel: "vs. mês anterior",
        icon: "receipt",
        color: "warning",
        order: 1,
      },
      {
        key: "balance",
        title: "Saldo em caixa",
        value: balanceCents,
        format: "currency",
        changePct: 8.7,
        changeLabel: "vs. mês anterior",
        icon: "wallet",
        color: "info",
        order: 2,
      },
      {
        key: "growth",
        title: "Crescimento anual",
        value: 2360, // 23,6% em pontos-base
        format: "percent",
        changePct: 3.2,
        changeLabel: "vs. trimestre anterior",
        icon: "chart-line",
        color: "success",
        order: 3,
      },
    ],
  });

  // ── Volume de transações: últimos 7 dias ──
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const tx = [1284, 1512, 1433, 1698, 1947, 876, 512];
  await prisma.activeUsersPoint.createMany({
    data: days.map((day, i) => ({ day, value: tx[i], order: i })),
  });

  await prisma.activeUsersStat.createMany({
    data: [
      { label: "Transações", value: tx.reduce((a, b) => a + b, 0), format: "number", icon: "activity", order: 0 },
      { label: "Ticket médio", value: reais(182.4), format: "currency", icon: "receipt", order: 1 },
      { label: "Clientes ativos", value: 3418, format: "number", icon: "users", order: 2 },
      { label: "Inadimplência", value: 230, format: "percent", icon: "alert", order: 3 },
    ],
  });

  // ── Meta anual: % calculado a partir da receita do ano corrente ──
  const targetCents = reais(6_000_000);
  const yearRevenueCents = months.reduce(
    (sum, d, i) => (d.getFullYear() === now.getFullYear() ? sum + reais(revenue[i]) : sum),
    0,
  );
  await prisma.satisfactionRate.create({
    data: {
      value: Math.round((yearRevenueCents / targetCents) * 1000) / 10,
      label: `Meta de receita ${now.getFullYear()}`,
      targetCents,
    },
  });

  // ── Saúde financeira ──
  const marginBp = Math.round(((revenue[last] - expenses[last]) / revenue[last]) * 10_000);
  await prisma.referralSummary.createMany({
    data: [
      { series: "receivables", label: "Contas a receber", value: reais(642_180.0), format: "currency", changePct: 6.3 },
      { series: "margin", label: "Margem líquida", value: marginBp, format: "percent", changePct: 1.8 },
    ],
  });
  await prisma.scoreRing.create({
    data: { label: "Score financeiro", value: 8.7, maxValue: 10, caption: "Saudável" },
  });
  await prisma.referralPoint.createMany({
    data: months.slice(-6).map((d, i) => ({
      series: "receivables",
      month: monthKey(d),
      value: [512, 548, 561, 590, 604, 642][i],
      order: i,
    })),
  });

  // ── Orçamentos por área ──
  await prisma.project.createMany({
    data: [
      { name: "Marketing de performance", icon: "megaphone", members: "MC,RA,JS", budgetCents: reais(185_000), completion: 72, status: "working", order: 0 },
      { name: "Plataforma e engenharia", icon: "code", members: "LP,TS,GV", budgetCents: reais(420_000), completion: 64, status: "working", order: 1 },
      { name: "Expansão regional Sul", icon: "building", members: "AB,CF", budgetCents: reais(275_000), completion: 100, status: "done", order: 2 },
      { name: "Atendimento ao cliente", icon: "headphones", members: "DM,EK,FR", budgetCents: reais(98_000), completion: 100, status: "done", order: 3 },
      { name: "Logística e frete", icon: "truck", members: "HN,IO", budgetCents: null, completion: 18, status: "working", order: 4 },
      { name: "Programa de fidelidade", icon: "gift", members: "PQ,RS", budgetCents: reais(64_000), completion: 35, status: "cancelled", order: 5 },
    ],
  });

  // ── Transações recentes (entradas positivas, saídas negativas) ──
  await prisma.orderEvent.createMany({
    data: [
      { title: "Recebimento do pedido #48213", description: "Vendas online", amountCents: reais(12_480.0), date: hoursAgo(2), color: "success", icon: "arrow-in", order: 0 },
      { title: "Folha de pagamento", description: "Pessoal", amountCents: -reais(96_350.0), date: hoursAgo(19), color: "danger", icon: "users", order: 1 },
      { title: "Contrato corporativo #2087", description: "Contratos B2B", amountCents: reais(34_600.0), date: hoursAgo(27), color: "success", icon: "landmark", order: 2 },
      { title: "Infraestrutura em nuvem", description: "Tecnologia", amountCents: -reais(8_920.4), date: hoursAgo(50), color: "warning", icon: "server", order: 3 },
      { title: "Impostos (DAS)", description: "Tributos", amountCents: -reais(21_304.15), date: hoursAgo(98), color: "danger", icon: "scale", order: 4 },
      { title: "Reembolso de fornecedor", description: "Ajustes", amountCents: reais(1_150.0), date: hoursAgo(122), color: "info", icon: "refresh", order: 5 },
    ],
  });

  // ── Equipe ──
  await prisma.author.createMany({
    data: [
      { name: "Marina Costa", email: "marina.costa@finova.example", avatarColor: "primary", function: "Diretora financeira (CFO)", department: "Diretoria", status: "online", employed: "23/04/2018", order: 0 },
      { name: "Rafael Almeida", email: "rafael.almeida@finova.example", avatarColor: "info", function: "Analista financeiro", department: "Controladoria", status: "offline", employed: "11/01/2019", order: 1 },
      { name: "Juliana Souza", email: "juliana.souza@finova.example", avatarColor: "success", function: "Gerente de FP&A", department: "Planejamento", status: "online", employed: "19/09/2017", order: 2 },
      { name: "Lucas Pereira", email: "lucas.pereira@finova.example", avatarColor: "warning", function: "Engenheiro de dados", department: "Tecnologia", status: "online", employed: "24/12/2020", order: 3 },
      { name: "Beatriz Fernandes", email: "beatriz.fernandes@finova.example", avatarColor: "danger", function: "Contadora", department: "Contabilidade", status: "offline", employed: "04/10/2021", order: 4 },
      { name: "Gabriel Oliveira", email: "gabriel.oliveira@finova.example", avatarColor: "dark", function: "Analista de risco", department: "Crédito", status: "offline", employed: "14/09/2020", order: 5 },
      { name: "Camila Ribeiro", email: "camila.ribeiro@finova.example", avatarColor: "info", function: "Product designer", department: "Produto", status: "online", employed: "02/02/2022", order: 6 },
    ],
  });

  // ── Faturas da assinatura (1º dia de cada mês, mais recente primeiro) ──
  const invoiceAmounts = [1_490.0, 1_490.0, 1_490.0, 1_320.5, 1_320.5, 1_189.0];
  await prisma.invoice.createMany({
    data: invoiceAmounts.map((amount, i) => {
      const issuedAt = monthStart(-i);
      return {
        issuedAt,
        code: `#FN-${monthKey(issuedAt).replace("-", "")}`,
        amountCents: reais(amount),
        order: i,
      };
    }),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed concluído.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
