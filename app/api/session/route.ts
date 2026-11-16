import { cookies } from "next/headers";
import { authentication, sessionError } from "@/lib/auth/server";
import { authConfiguration, createSession, equalSecret, sameOrigin, SESSION_SECONDS } from "@/lib/auth/session";

// Baseline per-process limit. Multi-instance deployments must use a shared store.
let attempts = 0;
let windowStart = 0;
const WINDOW_MS = 15 * 60 * 1000;
function result(body: object, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function GET() {
  const error = await sessionError();
  if (error) return error;
  const { config } = await authentication();
  return result({ authenticated: true, enabled: config.mode === "enabled" });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return result({ error: "Nieprawidłowe źródło żądania." }, 403);
  const config = authConfiguration();
  if (config.mode === "unconfigured") return result({ error: "Dostęp nie jest skonfigurowany." }, 503);
  if (config.mode === "development") return result({ ok: true });
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return result({ error: "Wyślij dane formularza jako JSON." }, 415);
  }
  const now = Date.now();
  if (now - windowStart >= WINDOW_MS) { attempts = 0; windowStart = now; }
  if (attempts >= 10) return result({ error: "Za dużo prób. Spróbuj ponownie za 15 minut." }, 429,
    { "Retry-After": String(Math.max(1, Math.ceil((windowStart + WINDOW_MS - now) / 1000))) });
  attempts++;
  let password: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return result({ error: "Dane formularza są za duże." }, 413);
    const input = JSON.parse(raw);
    password = input?.password;
  } catch { return result({ error: "Nieprawidłowe dane formularza." }, 400); }
  if (typeof password !== "string" || password.length > 1024 || !equalSecret(password, config.password)) {
    return result({ error: "Nieprawidłowy PIN lub hasło." }, 401);
  }
  (await cookies()).set(config.cookieName, createSession(config), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/", maxAge: SESSION_SECONDS,
  });
  return result({ ok: true });
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return result({ error: "Nieprawidłowe źródło żądania." }, 403);
  const config = authConfiguration();
  if (config.mode === "enabled") (await cookies()).set(config.cookieName, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0,
  });
  return result({ ok: true });
}
