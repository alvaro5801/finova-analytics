import { fail, ok, simulateLatency } from "@/lib/api-utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  await simulateLatency(300, 600);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("O corpo da requisição precisa ser um JSON válido.");
  }

  const { name, email, password } = (body ?? {}) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || name.trim().length < 2) {
    return fail("Informe seu nome completo.");
  }
  if (!email || !EMAIL_RE.test(email)) {
    return fail("Informe um e-mail válido.");
  }
  if (!password || password.length < 6) {
    return fail("A senha precisa ter pelo menos 6 caracteres.");
  }

  return ok(
    {
      user: { name, email },
      token: "mock-jwt-token",
    },
    201,
  );
}
