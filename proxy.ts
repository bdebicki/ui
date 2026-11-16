import { NextRequest, NextResponse } from "next/server";
import { authConfiguration, safeReturnTo, sameOrigin, validSession } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/login" || pathname === "/api/session") return NextResponse.next();
  const config = authConfiguration();
  const token = config.mode === "enabled" ? request.cookies.get(config.cookieName)?.value : undefined;
  const api = pathname === "/api" || pathname.startsWith("/api/");
  if (!validSession(token, config)) {
    if (api) return NextResponse.json(
      { error: config.mode === "unconfigured" ? "Dostęp nie jest skonfigurowany." : "Sesja wygasła. Zaloguj się ponownie." },
      { status: config.mode === "unconfigured" ? 503 : 401, headers: { "Cache-Control": "no-store" } },
    );
    const login = new URL("/login", request.url);
    login.searchParams.set("from", safeReturnTo(pathname + search));
    return NextResponse.redirect(login);
  }
  if (api && !["GET", "HEAD", "OPTIONS"].includes(request.method) && !sameOrigin(request)) {
    return NextResponse.json({ error: "Nieprawidłowe źródło żądania." }, { status: 403 });
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
