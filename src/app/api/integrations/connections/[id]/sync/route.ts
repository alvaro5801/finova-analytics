import { prisma } from "@/lib/prisma";
import { fail, ok, simulateLatency } from "@/lib/api-utils";
import { currentUserId, syncConnection } from "@/lib/banking/sync";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const connection = await prisma.bankConnection.findFirst({ where: { id, userId: currentUserId() } });
  if (!connection) return fail("Conexão não encontrada.", 404);

  try {
    if (connection.provider === "demo") await simulateLatency(400, 800);
    return ok(await syncConnection(id));
  } catch (error) {
    console.error("[integrações] falha ao sincronizar:", error);
    return fail("A sincronização falhou. Tente novamente em instantes.", 502);
  }
}
