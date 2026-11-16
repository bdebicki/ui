import { chromium, expect } from "@playwright/test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";

export async function authChecks({ browser, base, password }) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${base}/settings?tab=layout`);
    await expect(page).toHaveURL(/\/login\?from=/);
    await expect(page.getByRole("heading", { name: "Zaloguj się" })).toBeVisible();
    expect((await context.request.get(`${base}/api/session`)).status()).toBe(401);
    expect((await context.request.get(`${base}/api/private-not-existing`)).status()).toBe(401);
    expect((await context.request.post(`${base}/api/session`, { data: { password }, headers: { Origin: "https://other.test" } })).status()).toBe(403);
    await page.getByLabel("PIN lub hasło", { exact: true }).fill("wrong-password");
    await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Nieprawidłowy PIN lub hasło." })).toBeVisible();
    await page.getByLabel("PIN lub hasło", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
    await expect(page).toHaveURL(`${base}/settings?tab=layout`);
    await page.reload();
    await expect(page.getByRole("button", { name: "Wyloguj", exact: true })).toBeVisible();
    const [cookie] = (await context.cookies()).filter(c => c.name === "ui-test-session");
    expect(cookie).toMatchObject({ httpOnly: true, secure: true, sameSite: "Lax", path: "/" });
    expect(cookie.expires - Date.now() / 1000).toBeGreaterThan(29 * 86400);
    expect(await page.evaluate(() => document.cookie)).not.toContain("ui-test-session");
    expect((await context.request.get(`${base}/api/session`)).status()).toBe(200);
    expect((await context.request.delete(`${base}/api/session`, { headers: { Origin: "https://other.test" } })).status()).toBe(403);
    // Return from another page, then a new tab in the same browser session.
    const other = await context.newPage();
    await other.goto("about:blank");
    await page.bringToFront();
    await page.reload();
    await expect(page).toHaveURL(`${base}/settings?tab=layout`);
    await other.goto(`${base}/about`);
    await expect(other).toHaveURL(`${base}/about`);
    await page.getByRole("button", { name: "Wyloguj", exact: true }).click();
    await expect(page).toHaveURL(`${base}/login`);
    expect((await context.request.get(`${base}/api/session`)).status()).toBe(401);
    await other.reload();
    await expect(other).toHaveURL(/\/login/);
    await context.addCookies([{ ...cookie, value: "1" }]);
    expect((await context.request.get(`${base}/api/session`)).status()).toBe(401);
    console.log("Auth: protection, login, reload, navigation, cookie policy, logout and forgery passed.");
  } finally { await context.close(); }

  // A real on-disk browser profile verifies persistence across browser restarts.
  const profile = await mkdtemp(join(tmpdir(), "ui-auth-browser-"));
  let persistent;
  try {
    persistent = await chromium.launchPersistentContext(profile, { headless: true });
    const page = await persistent.newPage();
    await page.goto(`${base}/login`);
    await page.getByLabel("PIN lub hasło", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
    await expect(page).toHaveURL(`${base}/`);
    await persistent.close();
    persistent = await chromium.launchPersistentContext(profile, { headless: true });
    const reopened = await persistent.newPage();
    await reopened.goto(`${base}/about`);
    await expect(reopened).toHaveURL(`${base}/about`);
    console.log("Auth: signed session survived an actual browser restart.");
  } finally { await persistent?.close(); await rm(profile, { recursive: true, force: true }); }

  const request = await browser.newContext();
  try {
    let response;
    for (let attempt = 0; attempt < 11; attempt++) {
      response = await request.request.post(`${base}/api/session`, {
        data: { password: "wrong-password" }, headers: { Origin: base },
      });
      if (response.status() === 429) break;
      expect(response.status()).toBe(401);
    }
    expect(response.status()).toBe(429);
    expect(Number(response.headers()["retry-after"])).toBeGreaterThan(0);
    console.log("Auth: login attempt limit passed.");
  } finally { await request.close(); }

  const unconfiguredBase = "http://127.0.0.1:3218";
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3218"], {
    stdio: "pipe", env: { ...process.env, APP_PASSWORD: "", SESSION_SECRET: "", AUTH_COOKIE_NAME: "unconfigured-test" },
  });
  let logs = "";
  server.stdout.on("data", chunk => { logs += chunk; });
  server.stderr.on("data", chunk => { logs += chunk; });
  const unconfigured = await browser.newContext();
  try {
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      if (server.exitCode !== null) throw new Error(logs);
      try { if ((await fetch(`${unconfiguredBase}/login`)).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    expect(ready, logs).toBe(true);
    const page = await unconfigured.newPage();
    await page.goto(`${unconfiguredBase}/about`);
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("button", { name: "Zaloguj się", exact: true })).toBeDisabled();
    expect((await unconfigured.request.get(`${unconfiguredBase}/api/session`)).status()).toBe(503);
    expect((await unconfigured.request.post(`${unconfiguredBase}/api/session`, {
      data: { password }, headers: { Origin: unconfiguredBase },
    })).status()).toBe(503);
    console.log("Auth: production without credentials blocks access.");
  } finally {
    await unconfigured.close();
    if (server.exitCode === null) { server.kill("SIGTERM"); await once(server, "exit"); }
  }
}
