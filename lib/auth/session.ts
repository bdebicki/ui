import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_SECONDS = 60 * 60 * 24 * 30;
export type AuthConfiguration =
  | { mode: "development" }
  | { mode: "unconfigured" }
  | { mode: "enabled"; password: string; secret: string; cookieName: string };

export function authConfiguration(env = process.env): AuthConfiguration {
  const { APP_PASSWORD, SESSION_SECRET } = env;
  if (env.NODE_ENV === "development" && !env.VERCEL && !APP_PASSWORD && !SESSION_SECRET) {
    return { mode: "development" };
  }
  const cookieName = env.AUTH_COOKIE_NAME || "base-session";
  if (!APP_PASSWORD || APP_PASSWORD.length < 4 || APP_PASSWORD.length > 1024 ||
      !SESSION_SECRET || SESSION_SECRET.length < 32 || !/^[\w-]{1,64}$/.test(cookieName)) {
    return { mode: "unconfigured" };
  }
  return { mode: "enabled", password: APP_PASSWORD, secret: SESSION_SECRET, cookieName };
}

export function equalSecret(left: string, right: string) {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(left), hash(right));
}

function signature(payload: string, config: Extract<AuthConfiguration, { mode: "enabled" }>) {
  return createHmac("sha256", config.secret)
    .update(JSON.stringify([config.cookieName, config.password, payload]))
    .digest("base64url");
}

export function createSession(config: AuthConfiguration, now = Date.now()) {
  if (config.mode !== "enabled") throw new Error("Authentication is not configured");
  const payload = `v1.${Math.floor(now / 1000) + SESSION_SECONDS}`;
  return `${payload}.${signature(payload, config)}`;
}

export function validSession(token: string | undefined, config: AuthConfiguration, now = Date.now()) {
  if (config.mode === "development") return true;
  if (config.mode !== "enabled" || !token || token.length > 128) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !/^\d{1,12}$/.test(parts[1])) return false;
  const expires = Number(parts[1]);
  return expires > now / 1000 && expires <= Math.floor(now / 1000) + SESSION_SECONDS &&
    equalSecret(parts[2], signature(`${parts[0]}.${parts[1]}`, config));
}

/** Only return local page URLs, never an external or authentication endpoint. */
export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") ||
      value.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(value)) return "/";
  const url = new URL(value, "https://internal.invalid");
  if (url.origin !== "https://internal.invalid" || url.pathname === "/login" ||
      url.pathname.startsWith("/api/") || url.pathname === "/api") return "/";
  return `${url.pathname}${url.search}${url.hash}`;
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const source = new URL(origin);
    const target = new URL(request.url);
    // Next's internal URL can use localhost even when the browser uses 127.0.0.1.
    // Host is the actual HTTP authority; do not trust arbitrary forwarded-host headers.
    return source.origin === origin && source.protocol === target.protocol &&
      source.host === (request.headers.get("host") || target.host);
  } catch { return false; }
}
