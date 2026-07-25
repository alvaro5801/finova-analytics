import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const authors = await prisma.author.findMany({ orderBy: { order: "asc" } });
  return ok(authors);
}
