const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("@playwright/test");
const lessons = require("../src/data/lessons.json");

test("lesson journal preserves source content, counts, previews, and offline artwork", async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    await page.context().setOffline(true);
    await page.goto(
      pathToFileURL(path.resolve(__dirname, "../index.html")).href,
    );
    await page.locator('[data-page="lessons"]').click();
    assert.equal(
      await page.locator(".journal-hero h1").textContent(),
      "Lessons with Yuma-san.",
    );
    assert.equal(
      await page.locator(".journal-subtitle").textContent(),
      "ゆまさんとのレッスンノート",
    );
    await page.locator(".yuma-portrait").hover();
    assert.equal(await page.locator(".yuma-celebration").count(), 1);
    await page.keyboard.press("Escape");
    const counts = await page.locator(".journal-progress dd").allTextContents();
    assert.deepEqual(counts.map(Number), [
      lessons.length,
      new Set(lessons.flatMap((l) => l.vocab.map((w) => w.word))).size,
      lessons.reduce((sum, l) => sum + l.sentences.length, 0),
    ]);
    for (const lesson of lessons) {
      const card = page.locator(
        '.journal-entry[data-lesson-open="' + lesson.id + '"]',
      );
      assert.equal(
        await card.locator(".journal-entry-title").textContent(),
        lesson.title,
      );
      assert.equal(await card.locator("time").textContent(), lesson.date);
      assert.equal(
        await card.locator(".journal-entry-description").textContent(),
        lesson.short,
      );
      const chips = await card
        .locator(".journal-word-previews > span")
        .allTextContents();
      assert(chips.length >= 2 && chips.length <= 3);
      assert(chips.every((word) => lesson.vocab.some((w) => w.word === word)));
      assert.equal(
        await card
          .locator(".journal-entry-footer > span")
          .first()
          .textContent(),
        `${lesson.vocab.length} words · ${lesson.sentences.length} sentences`,
      );
    }
    const paints = () =>
      page.locator(".journal-sticker *").evaluateAll((nodes) =>
        nodes.map((n) => {
          const c = getComputedStyle(n);
          return [c.fill, c.stroke, c.strokeWidth];
        }),
      );
    const light = await paints();
    await page.locator("#themeBtn").click();
    await page.waitForTimeout(250);
    assert.deepEqual(await paints(), light);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const language of ["en", "ja"]) {
        if ((await page.locator("html").getAttribute("lang")) !== language) {
          await page.locator("#languageToggle").click();
          await page.waitForTimeout(750);
        }
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
        const heights = await page
          .locator(".journal-entry")
          .evaluateAll((nodes) =>
            nodes.map((n) => n.getBoundingClientRect().height),
          );
        assert(
          Math.max(...heights) - Math.min(...heights) < 1,
          `Unequal cards at ${width} / ${language}`,
        );
        assert(
          await page
            .locator(".journal-entry")
            .evaluateAll((nodes) =>
              nodes.every((n) => n.scrollWidth <= n.clientWidth + 1),
            ),
        );
      }
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.locator('[data-page="library"]').click();
    await page.locator('[data-page="lessons"]').click();
    assert.equal(
      await page.locator("#yumaNavToggle").getAttribute("aria-expanded"),
      "false",
    );
    await page.locator('[data-page="lessons"]').click();
    assert(!(await page.locator("#lessonSideNav").isVisible()));
    assert.equal(await page.locator(".journal-entry").count(), 7);
    await page.locator(".journal-entry").first().click();
    assert((await page.locator(".sentence-card").count()) > 0);
    await page.locator('[data-page="lessons"]').click();
    assert.equal(await page.locator(".journal-entry").count(), 7);
    assert(!(await page.locator("#lessonSideNav").isVisible()));
  } finally {
    await browser.close();
  }
});
