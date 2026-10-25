const { test } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require("@playwright/test");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

test("phone navigation, reading controls and word popup fit narrow touch screens", async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  const errors = [];
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(
      pathToFileURL(path.join(__dirname, "..", "index.html")).href,
    );
    for (const width of [320, 375, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      for (const name of [
        "library",
        "lessons",
        "grammar",
        "kana",
        "numbers",
        "settings",
      ]) {
        const tab = page.locator('[data-page="' + name + '"]');
        await tab.tap();
        assert.equal(await tab.getAttribute("aria-current"), "page");
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          name + " overflow at " + width,
        );
        const box = await tab.boundingBox();
        assert(box.y + box.height <= 844 && box.height >= 44);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-page="library"]').tap();
    assert.equal(await page.locator("#readingSettingsToggle").count(), 0);
    assert.equal(await page.locator("#studyPreferences").count(), 0);
    await page.locator('[data-page="settings"]').tap();
    await page.locator("#textSizeSelect").selectOption("18");
    await page.locator('[data-page="library"]').tap();
    await page.locator("#searchInput").fill("taberu");
    await page.waitForTimeout(200);
    await page.locator(".word-open").first().tap();
    assert(await page.locator("#wordDetailsDialog").evaluate((d) => d.open));
    const dialog = await page.locator("#wordDetailsDialog").boundingBox();
    assert(dialog.x >= 0 && dialog.width <= 390);
    await page.locator("#closeWordDetails").tap();
    await page.locator('[data-page="numbers"]').tap();
    await page.locator("#hourControl").selectOption("14");
    await page.locator("#minuteControl").selectOption("30");
    assert.equal(
      await page.locator("#timeJapanese").textContent(),
      "午後二時半です。",
    );
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
