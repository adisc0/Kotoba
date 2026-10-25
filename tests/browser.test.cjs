const { test } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const root = path.join(__dirname, "..");

test("reference navigation, word popup, lessons, kana, clock and display preferences", async () => {
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
    const url = pathToFileURL(path.join(root, "index.html")).href;
    await page.goto(url);
    assert.equal(await page.locator(".word-card").count(), 298);
    assert.equal(
      await page
        .locator(
          '[data-status-word], [data-action="favorite"], #addBtn, #statusFilter, #wordForm',
        )
        .count(),
      0,
    );
    assert.equal(
      await page
        .locator(".word-card .study-example, .word-card .verb-reference")
        .count(),
      0,
    );
    await page.locator("#searchInput").fill("taberu");
    await page.waitForTimeout(180);
    await page.locator(".word-open").first().click();
    assert(await page.locator("#wordDetailsDialog").evaluate((d) => d.open));
    assert.equal(await page.locator(".verb-form-row").count(), 13);
    await page.keyboard.press("Escape");
    await page.locator('[data-page="lessons"]').click();
    assert.equal(await page.locator(".lesson-tile").count(), 7);
    for (const id of await page
      .locator(".lesson-tile")
      .evaluateAll((nodes) => nodes.map((n) => n.dataset.lessonOpen))) {
      await page
        .locator('[data-lesson-open="' + id + '"]')
        .first()
        .click();
      assert((await page.locator(".sentence-card").count()) > 0);
      await page.locator('[data-lesson-action="breakdown"]').first().click();
      assert.equal(
        await page.locator(".sentence-details:not(.hidden)").count(),
        1,
      );
      await page.locator("[data-lesson-home]").first().click();
    }
    await page.locator('[data-page="grammar"]').click();
    assert.equal(await page.locator(".grammar-chapter").count(), 7);
    await page.locator('[data-page="kana"]').click();
    for (const [set, count] of [
      ["basic", 46],
      ["voiced", 25],
      ["combinations", 33],
    ]) {
      await page.locator('[data-kana-set="' + set + '"]').click();
      for (const script of ["hiragana", "katakana"]) {
        await page.locator('[data-kana-script="' + script + '"]').click();
        for (const view of ["compact", "pictures"]) {
          await page.locator('[data-kana-view="' + view + '"]').click();
          assert.equal(
            await page.locator("#kanaPanel [data-kana-listen]").count(),
            count,
          );
        }
      }
    }
    await page.locator('[data-page="numbers"]').click();
    await page.locator("#hourControl").selectOption("14");
    await page.locator("#minuteControl").selectOption("30");
    assert.equal(await page.locator("#timeDigital").textContent(), "14:30");
    assert.equal(
      await page.locator("#timeJapanese").textContent(),
      "午後二時半です。",
    );
    await page.locator('[data-number-tab="numbers"]').click();
    await page.locator("#numberInput").fill("3800");
    assert(
      (await page.locator("#numberResult").textContent()).includes(
        "さんぜんはっぴゃく",
      ),
    );
    const sidebarSize = await page
      .locator(".brand-title")
      .evaluate((e) => getComputedStyle(e).fontSize);
    await page.locator('[data-page="settings"]').click();
    await page.locator("#textSizeSelect").selectOption("20");
    assert.equal(
      await page
        .locator(".brand-title")
        .evaluate((e) => getComputedStyle(e).fontSize),
      sidebarSize,
    );
    await page.locator("#themeBtn").click();
    await page.reload();
    assert.equal(await page.locator("#textSizeSelect").inputValue(), "20");
    await page.locator('[data-page="lessons"]').click();
    assert.equal(await page.locator(".journal-entry").count(), 7);
    assert.equal(
      await page.locator(".journal-portrait .yuma-lady-doodle").count(),
      1,
    );
    await page.locator('[data-page="library"]').click();
    fs.mkdirSync(path.join(root, ".history", "qa"), { recursive: true });
    await page.screenshot({
      path: path.join(root, ".history", "qa", "reference-desktop.png"),
    });
    await page.setViewportSize({ width: 390, height: 844 });
    for (const name of ["library", "grammar", "kana", "numbers", "settings"]) {
      await page.locator('[data-page="' + name + '"]').click();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        name + " should not overflow on mobile",
      );
    }
    await page.locator('[data-page="library"]').click();
    await page.screenshot({
      path: path.join(root, ".history", "qa", "reference-mobile.png"),
    });
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
