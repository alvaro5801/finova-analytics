import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/api-utils";
import { currentUserId } from "@/lib/banking/sync";

/** Transações importadas de todos os bancos do usuário, mais recentes primeiro. */
export async function GET() {
  const transactions = await prisma.bankTransaction.findMany({
    where: { account: { connection: { userId: currentUserId() } } },
    orderBy: { date: "desc" },
    take: 2000,
    include: { account: { include: { connection: { select: { id: true, institutionName: true } } } } },
  });

  return ok(
    transactions.map((t) => ({
      id: t.id,
      date: t.date,
      description: t.description,
      category: t.category,
      amountCents: t.amountCents,
      accountType: t.account.type,
      accountName: t.account.name,
      connectionId: t.account.connection.id,
      institutionName: t.account.connection.institutionName,
    })),
  );
}
