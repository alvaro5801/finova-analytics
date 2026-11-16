import { fail, ok } from "@/lib/api-utils";
import { currentProvider } from "@/lib/banking/provider";
import { currentUserId } from "@/lib/banking/sync";

export async function POST() {
  const provider = currentProvider();
  try {
    return ok({ mode: provider.mode, connectToken: await provider.createConnectToken(currentUserId()) });
  } catch {
    return fail("Não foi possível iniciar a conexão com o banco. Tente novamente.", 502);
  }
}
