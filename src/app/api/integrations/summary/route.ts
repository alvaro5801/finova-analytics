import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/api-utils";
import { bankSummary } from "@/lib/banking/summary";
import { currentUserId } from "@/lib/banking/sync";

/** Visão geral calculada com as transações importadas (nulo quando não há nenhuma). */
export async function GET() {
  const userId = currentUserId();
  const [transactions, accounts, connections] = await Promise.all([
    prisma.bankTransaction.findMany({
      where: { account: { connection: { userId } } },
      include: { account: { select: { type: true } } },
    }),
    prisma.bankAccount.findMany({ where: { connection: { userId } }, select: { type: true, balanceCents: true } }),
    prisma.bankConnection.findMany({ where: { userId }, select: { institutionName: true } }),
  ]);

  const summary = bankSummary(
    transactions.map((t) => ({
      id: t.id,
      date: t.date,
      description: t.description,
      category: t.category,
      amountCents: t.amountCents,
      accountType: t.account.type as "BANK" | "CREDIT",
    })),
    accounts.map((a) => ({ type: a.type as "BANK" | "CREDIT", balanceCents: a.balanceCents })),
  );

  return ok(
    summary && {
      ...summary,
      transactionCount: transactions.length,
      institutions: connections.map((c) => c.institutionName),
    },
  );
}
