import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/api-utils";
import { providerFor } from "@/lib/banking/provider";
import { currentUserId, deleteConnectionData } from "@/lib/banking/sync";

/** Desconectar: revoga o consentimento no agregador e apaga os dados importados. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const connection = await prisma.bankConnection.findFirst({ where: { id, userId: currentUserId() } });
  if (!connection) return fail("Conexão não encontrada.", 404);

  try {
    await providerFor(connection.provider).deleteItem(connection.itemId);
  } catch {
    return fail("Não foi possível revogar o acesso no banco. Tente novamente.", 502);
  }
  await deleteConnectionData(id);
  return ok({ id });
}
