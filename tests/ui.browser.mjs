import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { once } from "node:events";

// Create a temporary route so test fixtures never ship with the application.
const route = new URL("../app/ui-regression/", import.meta.url);
await mkdir(route); // Deliberately fail if a real route already exists.
let server;
let browser;
async function build() {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build"], { stdio: "pipe" });
  let output = "";
  child.stdout.on("data", (data) => { output += data; });
  child.stderr.on("data", (data) => { output += data; });
  const [code] = await once(child, "exit");
  if (code !== 0) throw new Error(output);
}
try {
  await writeFile(new URL("page.tsx", route), 'export { default } from "@/tests/fixtures/ui";\n');
  await build();
  const port = 3217;
  const base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], { stdio: "pipe" });
  let logs = "";
  server.stdout.on("data", (data) => { logs += data; });
  server.stderr.on("data", (data) => { logs += data; });
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(logs);
    try { if ((await fetch(`${base}/ui-regression`)).ok) { ready = true; break; } } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error(`Preview did not start: ${logs}`);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => { errors.push(error.message); console.error(error.message); });
  page.on("console", (message) => { if (message.type() === "error") console.error(message.text()); });
  async function expectColor(locator, property, expected) {
    const colors = await locator.evaluate((element, { property, expected }) => {
      const context = document.createElement("canvas").getContext("2d");
      function pixel(color) {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      }
      return [pixel(getComputedStyle(element)[property]), pixel(expected)];
    }, { property, expected });
    expect(colors[0]).toEqual(colors[1]);
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/ui-regression`);
    await expect(page.getByTestId("fixture")).toHaveAttribute("data-ready", "true");
    await expect(page.getByRole("button", { name: "Primary", exact: true })).toHaveCSS("border-radius", "8px");
    await expect(page.getByRole("button", { name: "Primary", exact: true })).toHaveCSS("padding-top", "6px");
    await expectColor(page.getByRole("button", { name: "Primary", exact: true }), "backgroundColor", "oklch(0.508 0.118 165.612)");
    const navbar = page.getByRole("navigation", { name: "Nawigacja aplikacji" });
    expect((await navbar.boundingBox()).height).toBe(40);
    const navContainer = await navbar.locator(":scope > div").boundingBox();
    expect(navContainer.width).toBe(Math.min(width, 1152));
    expect(navContainer.x).toBe(Math.max(0, (width - 1152) / 2));
    const cardBox = await page.getByTestId("composed-card").boundingBox();
    for (const id of ["composed-header", "composed-content", "composed-footer"]) {
      const section = page.getByTestId(id);
      const box = await section.boundingBox();
      expect(box.x - cardBox.x).toBe(17); // 16 px padding + border, no nested side padding.
      await expect(section).toHaveCSS("padding-left", "0px");
    }
    await page.getByRole("button", { name: "Otwórz dialog" }).click();
    await expectColor(page.getByRole("dialog"), "borderTopColor", "#e4e4e7");
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page.locator('[data-slot="card"]').first()).toHaveCSS("padding-top", "24px");
    await expect(page.locator('[data-slot="card"]').first()).toHaveCSS("border-radius", "16px");
    await expect(page.locator('[data-slot="card"]').first()).toHaveCSS("box-shadow", "none");
    await expectColor(page.locator('[data-slot="card"]').first(), "borderTopColor", "#e4e4e7");
    expect(await page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/Geist/);
    await expect(page.getByRole("button", { name: "Usuń" })).toHaveCSS("width", "32px");
    await expect(page.getByRole("link", { name: "Linked card" })).toHaveAttribute("href", "/about");
    const input = page.getByRole("textbox", { name: "Buffered input" });
    await input.fill("abc");
    await expect(input).toHaveValue("abc");
    await input.blur();
    await expect(input).toHaveValue("ABC");
    await expect(input).toHaveCSS("border-radius", "8px");
    const textarea = page.getByRole("textbox", { name: "Buffered textarea" });
    await textarea.fill("notes lowercase");
    await expect(textarea).toHaveValue("notes lowercase");
    await textarea.blur();
    await expect(textarea).toHaveValue("NOTES LOWERCASE");
    await page.getByRole("spinbutton", { name: "Number" }).fill("-5");
    await expect(page.getByTestId("number")).toHaveText("2");
    await page.getByRole("spinbutton", { name: "Number" }).blur();
    await expect(page.getByRole("spinbutton", { name: "Number" })).toHaveValue("2");
    const combo = page.getByPlaceholder("Wybierz lub wpisz");
    await combo.fill("Bet");
    await page.getByRole("option", { name: "Beta", exact: true }).click();
    await expect(combo).toHaveValue("Beta");
    await expect(combo).toHaveCSS("padding-right", "32px");
    await expect(page.getByTestId("commit")).toHaveText("Beta");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await combo.fill("Gam");
    await combo.press("ArrowDown");
    await combo.press("Enter");
    await expect(combo).toHaveValue("Gamma");
    await expect(page.getByTestId("commit")).toHaveText("Gamma");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await combo.fill("  Własna opcja  ");
    await combo.blur();
    await expect(page.getByTestId("commit")).toHaveText("Własna opcja");
    await combo.fill("Beta");
    await combo.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    const toggle = page.getByRole("button", { name: "Priorytet", exact: true });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    const today = page.getByRole("radio", { name: "Dzisiaj", exact: true });
    await today.click();
    await expect(today).toHaveAttribute("aria-checked", "true");
    await page.getByRole("radio", { name: "Przypięte" }).click();
    await page.getByRole("combobox", { name: "Więcej" }).selectOption("today");
    await expect(today).toHaveAttribute("aria-checked", "true");
    const bottom = page.getByPlaceholder("Przy dolnej krawędzi");
    await bottom.scrollIntoViewIfNeeded();
    await bottom.click();
    const option = page.getByRole("option", { name: "Dolna opcja" });
    await expect(option).toBeInViewport();
    await option.click();
    await expect(bottom).toHaveValue("Dolna opcja");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    console.log(`UI interactions and metrics passed at ${width}px`);
  }
  await page.screenshot({ path: "/tmp/ui-shadcn-components.png", fullPage: true });
  for (const route of ["/", "/about", "/settings"]) {
    const response = await page.goto(base + route);
    expect(response.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  }
  expect(errors).toEqual([]);
  await page.screenshot({ path: "/tmp/ui-shadcn-migration.png", fullPage: true });
  console.log("All routes passed without browser errors.");
} finally {
  await browser?.close();
  await rm(new URL("page.tsx", route), { force: true });
  await rm(route, { recursive: true });
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
  // Restore production output without the temporary test route, even on failure.
  await build();
}
