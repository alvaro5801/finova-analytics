import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/api-utils";
import { parseDemoItemId } from "@/lib/banking/demo-data";
import { currentProvider } from "@/lib/banking/provider";
import { currentUserId, syncConnection } from "@/lib/banking/sync";

/** Recebe o itemId devolvido pelo widget, registra a conexão e faz a primeira importação. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { itemId?: string } | null;
  const itemId = body?.itemId;
  const provider = currentProvider();
  if (!itemId || (provider.mode === "demo" && !parseDemoItemId(itemId))) return fail("Conexão inválida.");

  try {
    const item = await provider.getItem(itemId);
    const userId = currentUserId();
    const existing = await prisma.bankConnection.findUnique({ where: { itemId } });
    if (existing && existing.userId !== userId) return fail("Conexão inválida.", 403);

    const connection =
      existing ??
      (await prisma.bankConnection.create({
        data: {
          userId,
          provider: provider.mode,
          itemId,
          institutionName: item.institutionName,
          institutionColor: item.institutionColor,
          status: "syncing",
        },
      }));
    const result = await syncConnection(connection.id);
    return ok({ id: connection.id, institutionName: item.institutionName, ...result }, existing ? 200 : 201);
  } catch {
    return fail("Não foi possível importar os dados do banco. Tente novamente.", 502);
  }
}
