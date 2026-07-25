import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const [points, summary, score] = await Promise.all([
    prisma.referralPoint.findMany({ orderBy: { order: "asc" } }),
    prisma.referralSummary.findMany(),
    prisma.scoreRing.findFirst(),
  ]);
  return ok({ points, summary, score });
}
