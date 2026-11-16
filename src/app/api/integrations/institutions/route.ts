import { ok } from "@/lib/api-utils";
import { DEMO_INSTITUTIONS } from "@/lib/banking/demo-data";
import { bankingMode } from "@/lib/banking/provider";

/** No modo Pluggy, a escolha do banco acontece dentro do widget dela; aqui só listamos os de demonstração. */
export async function GET() {
  return ok(bankingMode() === "demo" ? DEMO_INSTITUTIONS : []);
}
