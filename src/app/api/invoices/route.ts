import { prisma } from "@/lib/prisma";
import { ok, simulateLatency } from "@/lib/api-utils";

export async function GET() {
  await simulateLatency();
  const invoices = await prisma.invoice.findMany({ orderBy: { order: "asc" } });
  return ok(invoices);
}
