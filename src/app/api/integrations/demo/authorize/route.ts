import { fail, ok, simulateLatency } from "@/lib/api-utils";
import { DEMO_INSTITUTIONS, createDemoItemId } from "@/lib/banking/demo-data";
import { isValidDemoConnectToken } from "@/lib/banking/demo-provider";
import { bankingMode } from "@/lib/banking/provider";

/** Faz o papel do widget do agregador no modo demonstração: o "banco" aprova e devolve o itemId. */
export async function POST(request: Request) {
  if (bankingMode() !== "demo") return fail("Disponível só no modo demonstração.", 404);

  const body = (await request.json().catch(() => null)) as { connectToken?: string; institutionId?: string } | null;
  if (!isValidDemoConnectToken(body?.connectToken)) return fail("Sessão de conexão expirada. Comece de novo.", 401);
  if (!DEMO_INSTITUTIONS.some((i) => i.id === body?.institutionId)) return fail("Instituição desconhecida.");

  await simulateLatency(500, 900);
  return ok({ itemId: createDemoItemId(body!.institutionId!) });
}
