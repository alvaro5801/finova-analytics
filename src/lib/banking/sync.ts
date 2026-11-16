import { prisma } from "@/lib/prisma";
import { mapItemStatus } from "@/lib/banking/normalize";
import { providerFor } from "@/lib/banking/provider";

const DAY = 86_400_000;
/** Primeira importação: até 1 ano. Depois, só os últimos dias (pegam transações pendentes que mudaram). */
const FIRST_SYNC_DAYS = 365;
const RESYNC_OVERLAP_DAYS = 7;
/** Logo após o login, o agregador ainda está coletando os dados (status UPDATING). */
const WAIT_UPDATING_MS = 45_000;
const POLL_INTERVAL_MS = 2_000;

/** Dono das conexões. O login ainda é simulado; com autenticação real, vem da sessão. */
export function currentUserId() {
  return "demo-user";
}

export async function syncConnection(connectionId: number) {
  const connection = await prisma.bankConnection.findUniqueOrThrow({ where: { id: connectionId } });
  const provider = providerFor(connection.provider);
  const from = new Date(
    connection.lastSyncAt
      ? connection.lastSyncAt.getTime() - RESYNC_OVERLAP_DAYS * DAY
      : Date.now() - FIRST_SYNC_DAYS * DAY,
  );

  await prisma.bankConnection.update({ where: { id: connectionId }, data: { status: "syncing" } });
  try {
    let item = await provider.getItem(connection.itemId);
    for (const deadline = Date.now() + WAIT_UPDATING_MS; item.status === "UPDATING" && Date.now() < deadline; ) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      item = await provider.getItem(connection.itemId);
    }
    const accounts = await provider.listAccounts(connection.itemId);
    let imported = 0;

    for (const { credit, ...account } of accounts) {
      const valid = (d?: Date) => (d && !Number.isNaN(d.getTime()) ? d : null);
      const data = {
        type: account.type,
        name: account.name,
        number: account.number,
        balanceCents: account.balanceCents,
        brand: credit?.brand || null,
        level: credit?.level || null,
        creditLimitCents: credit?.creditLimitCents ?? null,
        availableLimitCents: credit?.availableLimitCents ?? null,
        billCloseDate: valid(credit?.billCloseDate),
        billDueDate: valid(credit?.billDueDate),
        minimumPaymentCents: credit?.minimumPaymentCents ?? null,
      };
      const saved = await prisma.bankAccount.upsert({
        where: { externalId: account.externalId },
        create: { ...data, externalId: account.externalId, connectionId },
        update: data,
      });
      const transactions = await provider.listTransactions(account, from);
      // Substitui a janela inteira: cobre transações novas, alteradas (pendente → lançada) e removidas.
      await prisma.$transaction([
        prisma.bankTransaction.deleteMany({ where: { accountId: saved.id, date: { gte: from } } }),
        prisma.bankTransaction.createMany({ data: transactions.map((t) => ({ ...t, accountId: saved.id })) }),
      ]);
      imported += transactions.length;
    }

    await prisma.bankConnection.update({
      where: { id: connectionId },
      data: {
        status: mapItemStatus(item.status, item.executionStatus),
        institutionName: item.institutionName,
        institutionColor: item.institutionColor,
        institutionImageUrl: item.institutionImageUrl ?? null,
        consentExpiresAt: item.consentExpiresAt ?? null,
        lastSyncAt: new Date(),
      },
    });
    return { accounts: accounts.length, imported };
  } catch (error) {
    await prisma.bankConnection.update({ where: { id: connectionId }, data: { status: "error" } });
    throw error;
  }
}

/** Apaga a conexão e tudo o que foi importado dela (LGPD: revogar = apagar). */
export async function deleteConnectionData(connectionId: number) {
  const accounts = await prisma.bankAccount.findMany({ where: { connectionId }, select: { id: true } });
  const accountIds = accounts.map((a) => a.id);
  await prisma.$transaction([
    prisma.bankTransaction.deleteMany({ where: { accountId: { in: accountIds } } }),
    prisma.bankAccount.deleteMany({ where: { connectionId } }),
    prisma.bankConnection.delete({ where: { id: connectionId } }),
  ]);
}
