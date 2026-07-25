import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const orders = await prisma.orderEvent.findMany({ orderBy: { order: "asc" } });
  return ok(orders);
}
