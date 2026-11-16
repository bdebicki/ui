import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authConfiguration, safeReturnTo, validSession } from "./session";

export async function authentication() {
  const cookieStore = await cookies();
  const config = authConfiguration();
  const token = config.mode === "enabled" ? cookieStore.get(config.cookieName)?.value : undefined;
  return { config, authenticated: validSession(token, config) };
}

/** Call again at the page/data boundary; Proxy is only the first gate. */
export async function requirePageSession(returnTo = "/") {
  const state = await authentication();
  if (!state.authenticated) redirect(`/login?from=${encodeURIComponent(safeReturnTo(returnTo))}`);
}

/** Call before reading data in every private Route Handler. */
export async function sessionError() {
  const { config, authenticated } = await authentication();
  if (authenticated) return null;
  return Response.json(
    { error: config.mode === "unconfigured" ? "Dostęp nie jest skonfigurowany." : "Sesja wygasła. Zaloguj się ponownie." },
    { status: config.mode === "unconfigured" ? 503 : 401, headers: { "Cache-Control": "no-store" } },
  );
}
