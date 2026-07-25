import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const [chart, stats] = await Promise.all([
    prisma.activeUsersPoint.findMany({ orderBy: { order: "asc" } }),
    prisma.activeUsersStat.findMany({ orderBy: { order: "asc" } }),
  ]);
  return ok({ chart, stats });
}
