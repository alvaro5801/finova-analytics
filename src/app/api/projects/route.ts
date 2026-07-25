import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return ok(projects);
}
