import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/api-utils";
import { bankingMode } from "@/lib/banking/provider";
import { currentUserId } from "@/lib/banking/sync";

export async function GET() {
  const connections = await prisma.bankConnection.findMany({
    where: { userId: currentUserId() },
    orderBy: { createdAt: "asc" },
    include: { accounts: { orderBy: { type: "asc" }, include: { _count: { select: { transactions: true } } } } },
  });

  return ok({
    mode: bankingMode(),
    // Mostra o banco de testes da Pluggy no widget. Desligar em produção.
    sandbox: process.env.PLUGGY_SANDBOX === "true",
    // Lista explícita do que vai ao navegador: `itemId` e `userId` ficam só no servidor.
    connections: connections.map((c) => ({
      id: c.id,
      provider: c.provider,
      institutionName: c.institutionName,
      institutionColor: c.institutionColor,
      institutionImageUrl: c.institutionImageUrl,
      status: c.status,
      lastSyncAt: c.lastSyncAt,
      consentExpiresAt: c.consentExpiresAt,
      createdAt: c.createdAt,
      accounts: c.accounts.map((a) => ({
        id: a.id,
        type: a.type,
        name: a.name,
        number: a.number,
        balanceCents: a.balanceCents,
        brand: a.brand,
        level: a.level,
        creditLimitCents: a.creditLimitCents,
        availableLimitCents: a.availableLimitCents,
        billCloseDate: a.billCloseDate,
        billDueDate: a.billDueDate,
        minimumPaymentCents: a.minimumPaymentCents,
        transactionCount: a._count.transactions,
      })),
    })),
  });
}
