import { test } from "node:test";
import assert from "node:assert/strict";
import { authConfiguration, createSession, validSession, safeReturnTo, sameOrigin, SESSION_SECONDS } from "../lib/auth/session.ts";

const config = authConfiguration({ NODE_ENV: "production", APP_PASSWORD: "test-password", SESSION_SECRET: "a".repeat(32) });
const now = 1_800_000_000_000;

test("only entirely unconfigured local development bypasses authentication", () => {
  assert.equal(authConfiguration({ NODE_ENV: "development" }).mode, "development");
  for (const env of [
    { NODE_ENV: "production" }, { NODE_ENV: "development", VERCEL: "1" },
    { NODE_ENV: "development", APP_PASSWORD: "1234" },
    { NODE_ENV: "development", SESSION_SECRET: "x".repeat(32) },
    { NODE_ENV: "production", APP_PASSWORD: "123", SESSION_SECRET: "x".repeat(32) },
    { NODE_ENV: "production", APP_PASSWORD: "1234", SESSION_SECRET: "short" },
    { NODE_ENV: "production", APP_PASSWORD: "1234", SESSION_SECRET: "x".repeat(32), AUTH_COOKIE_NAME: "bad;cookie" },
  ]) assert.equal(authConfiguration(env).mode, "unconfigured");
  assert.equal(validSession(undefined, { mode: "unconfigured" }, now), false);
});

test("signed sessions survive reloads until the fixed 30-day expiry", () => {
  const token = createSession(config, now);
  assert.equal(validSession(token, config, now), true);
  assert.equal(validSession(token, config, now + SESSION_SECONDS * 1000 - 1), true);
  assert.equal(validSession(token, config, now + SESSION_SECONDS * 1000), false);
  assert.equal(validSession(token, config, now - 1000), false);
});

test("reject forged, malformed and cross-application tokens; rotate credentials", () => {
  const token = createSession(config, now);
  for (const invalid of [undefined, "1", "", "v1.1.x", token + ".extra", token.slice(0, -1), "x".repeat(1000)]) {
    assert.equal(validSession(invalid, config, now), false);
  }
  for (const changed of [
    { ...config, password: "new-password" }, { ...config, secret: "b".repeat(32) },
    { ...config, cookieName: "another-app" },
  ]) assert.equal(validSession(token, changed, now), false);
  assert.throws(() => createSession({ mode: "unconfigured" }));
});

test("return URLs preserve local page and query, but prevent open redirects and loops", () => {
  assert.equal(safeReturnTo("/settings?tab=layout#section"), "/settings?tab=layout#section");
  for (const path of [undefined, ["/about"], "https://evil.test", "//evil.test", "/\\evil.test", "/\nevil.test", "/login", "/api/session", "/a/../login"]) {
    assert.equal(safeReturnTo(path), "/");
  }
});

test("mutations require an explicit matching origin", () => {
  assert.equal(sameOrigin(new Request("http://localhost:3217/api/session", {
    headers: { origin: "http://127.0.0.1:3217", host: "127.0.0.1:3217" },
  })), true);
  assert.equal(sameOrigin(new Request("https://app.test/api/session", { headers: { origin: "https://app.test" } })), true);
  for (const origin of [undefined, "https://evil.test", "null", "https://app.test:444"]) {
    assert.equal(sameOrigin(new Request("https://app.test/api/session", { headers: origin ? { origin } : {} })), false);
  }
});
