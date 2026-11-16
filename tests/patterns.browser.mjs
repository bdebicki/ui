import { expect } from "@playwright/test";

export async function patternChecks({ page, browser, base }) {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.getByRole("button", { name: "Przywróć przykładowe dane", exact: true }).click();
    const table = page.getByRole("table", { name: "Przykładowe wpisy" });
    await expect(table.getByRole("row")).toHaveCount(4);
    expect(await page.locator("select, datalist").count()).toBe(0);
    const add = page.getByRole("button", { name: "Dodaj wpis", exact: true });
    await add.click();
    const form = page.getByRole("dialog", { name: "Dodaj wpis", exact: true });
    await expect(form.getByLabel("Nazwa", { exact: false })).toBeFocused();
    const title = `Nowy wpis ${width}`;
    await form.getByLabel("Nazwa", { exact: false }).fill(title);
    const category = form.getByRole("combobox", { name: "Kategoria wpisu" });
    await category.fill("Nowa kategoria");
    const list = page.getByRole("listbox");
    await expect(list).toBeVisible();
    // The dialog opening animation briefly scales its input, while the portalled list is not scaled.
    await expect.poll(async () => {
      const listBox = await list.locator("..").boundingBox();
      const inputBox = await category.boundingBox();
      return Math.abs(listBox.width - inputBox.width);
    }).toBeLessThan(1);
    await expect(list.locator("..")).toHaveCSS("box-shadow", "none");
    await page.screenshot({ path: `/tmp/ui-patterns-menu-${width}.png`, animations: "disabled" });
    await category.press("ArrowDown");
    await category.press("Enter");
    await expect(form).toBeVisible();
    await expect(category).toHaveValue("Nowa kategoria");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await form.getByLabel("Notatka", { exact: false }).fill("Pełna notatka widoczna w szczegółach.");
    await form.press("Escape");
    const discard = page.getByRole("dialog", { name: "Odrzucić zmiany?" });
    await expect(discard).toBeVisible();
    await discard.getByRole("button", { name: "Wróć do edycji" }).click();
    await expect(form.getByLabel("Notatka", { exact: false })).toHaveValue("Pełna notatka widoczna w szczegółach.");
    await form.getByRole("button", { name: "Zapisz", exact: true }).click();
    await expect(form).toHaveCount(0);
    await expect(add).toBeFocused();
    await page.reload();
    let row = table.getByRole("row").filter({ hasText: title });
    await expect(row).toBeVisible();
    await expect(row).not.toContainText("Pełna notatka");

    await row.getByRole("button", { name: `Edytuj: ${title}`, exact: true }).click();
    const edit = page.getByRole("dialog", { name: "Edytuj wpis" });
    await edit.getByLabel("Nazwa", { exact: false }).fill("Zmiana do odrzucenia");
    await edit.getByRole("button", { name: "Zamknij formularz" }).click();
    await discard.getByRole("button", { name: "Odrzuć zmiany", exact: true }).click();
    await expect(edit).toHaveCount(0);
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: `Edytuj: ${title}`, exact: true }).click();
    await expect(edit.getByLabel("Nazwa", { exact: false })).toHaveValue(title);
    const editCategory = edit.getByRole("combobox", { name: "Kategoria wpisu" });
    await editCategory.fill("Ele");
    await page.getByRole("option", { name: "Elektronika", exact: true }).click();
    await edit.getByRole("button", { name: "Zapisz", exact: true }).click();
    await expect(row).toContainText("Elektronika");

    const filter = page.getByRole("combobox", { name: "Filtr kategorii" });
    await filter.click();
    await filter.fill("brak takiej kategorii");
    await expect(page.getByText("Brak pasujących opcji.")).toBeVisible();
    await filter.press("Escape");
    await expect(filter).toHaveValue("Wszystkie kategorie");
    await filter.click();
    await page.getByRole("option", { name: "Elektronika", exact: true }).click();
    await expect(table.getByRole("row")).toHaveCount(3);
    await page.getByRole("button", { name: "Wyczyść filtry", exact: true }).click();
    await page.getByLabel("Wyszukiwanie", { exact: true }).fill("nieistniejący wpis");
    await expect(page.getByText("Brak wyników dla wybranych filtrów.")).toBeVisible();
    await page.getByRole("button", { name: "Wyczyść filtry", exact: true }).first().click();
    await row.getByRole("button", { name: `Oznacz jako gotowe: ${title}`, exact: true }).click();
    await expect(row.getByRole("button", { name: `Przywróć: ${title}`, exact: true })).toBeVisible();
    await row.getByRole("button", { name: `Usuń: ${title}`, exact: true }).click();
    const remove = page.getByRole("dialog", { name: "Usunąć wpis?" });
    await remove.getByRole("button", { name: "Anuluj", exact: true }).click();
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: `Usuń: ${title}`, exact: true }).click();
    await remove.getByRole("button", { name: "Usuń wpis", exact: true }).click();
    await expect(row).toHaveCount(0);
    await page.reload();
    row = page.getByRole("row").filter({ hasText: title });
    await expect(row).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width > 600) {
      for (const row of await table.locator("tbody tr").all()) expect((await row.boundingBox()).height).toBeLessThan(65);
    }
    await page.screenshot({ path: `/tmp/ui-patterns-${width}.png`, fullPage: true });
    console.log(`Patterns: modal, create/select lists, filtering, editing, discard, quick action, delete and persistence passed at ${width}px.`);
  }

  await page.goto(`${base}/ui-regression`);
  await page.getByRole("button", { name: "Testuj formularz", exact: true }).click();
  const fixture = page.getByRole("dialog", { name: "Formularz testowy" });
  await fixture.getByLabel("Nazwa testowa").fill("Błąd");
  await fixture.getByRole("button", { name: "Zapisz", exact: true }).click();
  await expect(fixture.getByRole("button", { name: "Zapisywanie…", exact: true })).toBeDisabled();
  await fixture.press("Escape");
  await expect(fixture).toBeVisible();
  await expect(fixture.getByRole("alert")).toHaveText("Zapis nie powiódł się. Wpisane dane pozostają.");
  await expect(fixture.getByLabel("Nazwa testowa")).toHaveValue("Błąd");
  await fixture.getByLabel("Nazwa testowa").fill("Poprawiony wpis");
  await fixture.getByRole("button", { name: "Zapisz", exact: true }).click();
  await expect(fixture).toHaveCount(0);
  console.log("Patterns: save lock and recovery from a failed save passed.");

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    storageState: await page.context().storageState() });
  try {
    const phone = await touch.newPage();
    await phone.goto(base);
    await phone.getByRole("button", { name: "Dodaj wpis", exact: true }).tap();
    const form = phone.getByRole("dialog", { name: "Dodaj wpis", exact: true });
    await form.getByLabel("Nazwa", { exact: false }).fill("Wpis dotykowy");
    await form.getByRole("combobox", { name: "Kategoria wpisu" }).tap();
    await phone.getByRole("option", { name: "Hobby", exact: true }).tap();
    await expect(form.getByRole("combobox", { name: "Kategoria wpisu" })).toHaveValue("Hobby");
    await form.getByRole("button", { name: "Zapisz", exact: true }).tap();
    await expect(phone.getByRole("row").filter({ hasText: "Wpis dotykowy" })).toBeVisible();
    console.log("Patterns: touch selection inside a modal passed.");
  } finally { await touch.close(); }
}
