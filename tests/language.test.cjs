const { test } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require("@playwright/test");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");

test("Japanese interface is reversible, persists, and translates dynamic views", async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  const errors = [];
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(
      pathToFileURL(path.join(__dirname, "..", "index.html")).href,
    );
    await page.locator("#languageToggle").click();
    assert.equal(await page.locator("html").getAttribute("lang"), "ja");
    assert.equal(await page.locator("#languageToggle").textContent(), "EN");
    assert.equal(
      (await page.locator("#vocabularyTitle").textContent()).trim(),
      "ことば辞典",
    );
    await page.locator("#searchInput").fill("taberu");
    await page.waitForTimeout(200);
    await page.locator(".word-open").first().click();
    await page.waitForTimeout(50);
    assert(
      (await page.locator("#wordDetailsContent").textContent()).includes(
        "動詞の活用",
      ),
    );
    assert(
      (await page.locator(".verb-form-meaning").allTextContents()).some(
        (x) => x === "I want to eat",
      ),
    );
    await page.keyboard.press("Escape");
    await page.locator('[data-page="lessons"]').click();
    await page.waitForTimeout(30);
    assert(
      (await page.locator("#lessonsContent").textContent()).includes(
        "こんにちは、ユマ先生！",
      ),
    );
    await page.locator(".lesson-tile").first().click();
    await page.locator('[data-lesson-action="breakdown"]').first().click();
    await page.locator('[data-page="kana"]').click();
    await page.locator('[data-kana-set="combinations"]').click();
    await page.waitForTimeout(30);
    assert(
      (await page.locator("#kanaPanel h2").textContent()).includes("拗音"),
    );
    await page.locator('[data-page="numbers"]').click();
    await page.locator("#hourControl").selectOption("14");
    await page.locator("#minuteControl").selectOption("30");
    assert.equal(
      await page.locator("#timeJapanese").textContent(),
      "午後二時半です。",
    );
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("lang"), "ja");
    await page.locator("#themeBtn").click();
    await page.waitForTimeout(250);
    assert.equal(
      await page
        .locator("body")
        .evaluate((e) => getComputedStyle(e).getPropertyValue("--bg").trim()),
      "#16171b",
    );
    fs.mkdirSync(path.join(__dirname, "..", ".history", "editorial"), {
      recursive: true,
    });
    await page.screenshot({
      path: path.join(
        __dirname,
        "..",
        ".history",
        "editorial",
        "playful-japanese-dark.png",
      ),
    });
    await page.setViewportSize({ width: 320, height: 844 });
    for (const name of [
      "library",
      "lessons",
      "grammar",
      "kana",
      "numbers",
      "settings",
    ]) {
      await page.locator('[data-page="' + name + '"]').click();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        name + " Japanese overflow",
      );
    }
    await page.locator("#languageToggle").click();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(
      (await page.locator('[data-page="library"]').textContent()).trim(),
      "Dictionary",
    );
    await page.locator('[data-page="library"]').click();
    assert.equal(
      (await page.locator("#vocabularyTitle").textContent()).trim(),
      "Dictionary",
    );
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
