import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const stats = await prisma.statCard.findMany({ orderBy: { order: "asc" } });
  return ok(stats);
}
