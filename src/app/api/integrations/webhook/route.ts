import { timingSafeEqual } from "node:crypto";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/api-utils";
import { deleteConnectionData, syncConnection } from "@/lib/banking/sync";

/**
 * Webhook da Pluggy. Ela não assina as chamadas: autenticamos por um cabeçalho secreto
 * cadastrado junto com o webhook (POST /webhooks com `headers`). Sem o segredo, 401.
 */
function authorized(request: Request) {
  const secret = process.env.PLUGGY_WEBHOOK_SECRET;
  const received = request.headers.get("x-finova-webhook-secret");
  if (!secret || !received) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(received);
  return a.length === b.length && timingSafeEqual(a, b);
}

const SYNC_EVENTS = new Set(["item/updated", "item/login_succeeded", "transactions/created", "transactions/updated", "transactions/deleted"]);

export async function POST(request: Request) {
  if (!authorized(request)) return fail("Não autorizado.", 401);

  const event = (await request.json().catch(() => null)) as { event?: string; itemId?: string } | null;
  if (!event?.event || !event.itemId) return ok({ ignored: true });

  const connection = await prisma.bankConnection.findUnique({ where: { itemId: event.itemId } });
  if (!connection) return ok({ ignored: true });

  // A Pluggy espera resposta em até 10 s: respondemos já e processamos depois.
  after(async () => {
    if (event.event === "item/deleted") await deleteConnectionData(connection.id);
    else if (event.event === "item/error") await prisma.bankConnection.update({ where: { id: connection.id }, data: { status: "error" } });
    else if (event.event === "item/waiting_user_action" || event.event === "item/waiting_user_input")
      await prisma.bankConnection.update({ where: { id: connection.id }, data: { status: "reconnect" } });
    else if (SYNC_EVENTS.has(event.event!)) await syncConnection(connection.id).catch(() => undefined);
  });
  return ok({ received: true });
}
