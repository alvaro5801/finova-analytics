import { fail, ok, simulateLatency } from "@/lib/api-utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  await simulateLatency(300, 600);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON.");
  }

  const { name, email, password } = (body ?? {}) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || name.trim().length < 2) {
    return fail("Please enter your full name.");
  }
  if (!email || !EMAIL_RE.test(email)) {
    return fail("Please enter a valid email address.");
  }
  if (!password || password.length < 6) {
    return fail("Password must be at least 6 characters.");
  }

  return ok(
    {
      user: { name, email },
      token: "mock-jwt-token",
    },
    201,
  );
}
