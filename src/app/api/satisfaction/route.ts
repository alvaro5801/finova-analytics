import { prisma } from "@/lib/prisma";
import { fail, ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const rate = await prisma.satisfactionRate.findFirst();
  if (!rate) return fail("Meta de receita não encontrada.", 404);
  return ok(rate);
}
