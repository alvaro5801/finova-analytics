import { prisma } from "@/lib/prisma";
import { fail, ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const rate = await prisma.satisfactionRate.findFirst();
  if (!rate) return fail("Satisfaction data not found", 404);
  return ok(rate);
}
