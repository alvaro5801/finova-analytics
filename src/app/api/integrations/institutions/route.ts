import { fail, ok } from "@/lib/api-utils";
import { currentProvider } from "@/lib/banking/provider";

/** Bancos que o cliente pode escolher na lista do Finova (o widget do agregador abre direto no escolhido). */
export async function GET() {
  try {
    return ok(await currentProvider().listInstitutions());
  } catch (error) {
    console.error("[integrações] falha ao listar bancos:", error);
    return fail("Não foi possível carregar a lista de bancos.", 502);
  }
}
