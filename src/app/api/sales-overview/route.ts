import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const points = await prisma.salesPoint.findMany({ orderBy: { order: "asc" } });
  return ok(points);
}
