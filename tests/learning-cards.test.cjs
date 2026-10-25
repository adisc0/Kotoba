const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("@playwright/test");
const root = path.join(__dirname, "..");
const launch = () =>
  chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });

test("learning cues are explicitly configured and preserve source vocabulary", () => {
  const words = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/words.json"), "utf8"),
  );
  const lessons = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/lessons.json"), "utf8"),
  );
  const config = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/card-learning.json"), "utf8"),
  );
  const surfaces = new Set(
    [...words, ...lessons.flatMap((l) => l.vocab)].map((w) => w.word),
  );
  for (const [word, cue] of Object.entries(config.entries)) {
    assert(surfaces.has(word));
    if (cue.diagram)
      assert(
        ["timeline", "size", "temperature", "equal"].includes(cue.diagram),
      );
    if (cue.antonym) {
      assert(surfaces.has(cue.antonym));
      assert.equal(config.entries[cue.antonym].antonym, word);
    }
  }
  for (const word of [...words, ...lessons.flatMap((l) => l.vocab)]) {
    const sentence =
      config.examplesByReading?.[word.word + "|" + word.reading] ||
      config.entries[word.word]?.sentence;
    assert(
      sentence?.jp && sentence.romaji && sentence.en,
      word.word + " needs all three example lines",
    );
    assert.equal(
      sentence.jp.slice(
        sentence.targetStart,
        sentence.targetStart + sentence.target.length,
      ),
      sentence.target,
      word.word,
    );
  }
  assert(!config.naAdjectives.includes("同じ"));
  assert.equal(config.entries["同じ"].pos.key, "special-adjective");
  assert(config.entries["同じ"].sentence.jp.includes("同じクラス"));
  assert.equal(config.entries["早い"].sentence.target, "早く");
  assert.equal(config.entries["飲む"].sentence.target, "飲みました");
  assert.equal(config.entries["つまらない"].sentence.target, "つまらなかった");
});

test("study cards reveal accessibly, retain audio/details, and link accurate opposites", async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    assert.equal(await page.locator("#wordGrid .learning-card").count(), 298);
    assert.equal(
      await page
        .locator(
          ".learning-card .sticker-svg, .learning-card .word-sticker, .learning-card .lv-art",
        )
        .count(),
      0,
    );
    assert.equal(
      await page.locator('.learning-card[data-visual="diagram"]').count(),
      8,
    );
    assert(
      (await page.locator('.learning-card[data-visual="sentence"]').count()) >=
        88,
    );
    assert(
      (await page.locator('.learning-card[data-visual="none"]').count()) === 0,
    );
    for (const selector of [
      ".card-context",
      ".card-context-romaji",
      ".context-translation",
      ".card-context-jp mark",
      ".example-audio",
    ]) {
      assert.equal(
        await page.locator("#wordGrid .learning-card " + selector).count(),
        298,
      );
    }
    assert.equal(
      await page.locator(".word-heading > .card-diagram").count(),
      8,
    );
    assert.equal(await page.locator(".card-context .card-diagram").count(), 0);
    assert(
      await page
        .locator(".card-diagram")
        .evaluateAll((figures) =>
          figures.every(
            (f) =>
              f.getBoundingClientRect().width <= 104 &&
              f.getBoundingClientRect().height < 80,
          ),
        ),
    );
    const temperature = page.locator(
      '.learning-card[data-diagram-focus="hot"]',
    );
    const levels = await temperature
      .locator("[data-temperature-level]")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("d")));
    assert.deepEqual(levels, ["M22 12V46", "M62 27V46", "M102 38V46"]);
    assert(await temperature.locator(".card-context").count());
    await page.locator("#searchInput").fill("oishii");
    await page.waitForTimeout(180);
    const card = page
      .locator(".learning-card")
      .filter({ has: page.locator(".word-kanji", { hasText: "美味しい" }) });
    assert.equal(
      await card.locator(".card-context-jp mark").textContent(),
      "美味しい",
    );
    assert(
      (await card.locator(".card-context-romaji").textContent()).includes(
        "Kono raamen",
      ),
    );
    assert(await card.locator(".word-meaning").isVisible());
    await page.evaluate(() => {
      window.__spoken = [];
      speechSynthesis.speak = (utterance) =>
        window.__spoken.push(utterance.text);
    });
    await card.locator('[data-action="example"]').click();
    assert.equal(
      await page.evaluate(() => window.__spoken.at(-1)),
      "このラーメンは美味しいです。",
    );
    await card.locator('[data-action="speak"]').click();
    assert.equal(await page.evaluate(() => window.__spoken.at(-1)), "美味しい");
    await page.locator("#studyModeToggle").click();
    assert.equal(
      await page.locator("#studyModeToggle").getAttribute("aria-pressed"),
      "true",
    );
    assert(!(await card.locator(".word-meaning").isVisible()));
    assert(!(await card.locator(".context-translation").isVisible()));
    assert.equal(
      await card.locator(".reveal-meaning").getAttribute("aria-expanded"),
      "false",
    );
    await card.locator(".word-kanji").click();
    assert(await card.locator(".word-meaning").isVisible());
    assert(!(await page.locator("#wordDetailsDialog").evaluate((d) => d.open)));
    await card.focus();
    await page.keyboard.press("Enter");
    assert(!(await card.locator(".word-meaning").isVisible()));
    await card.dispatchEvent("click");
    assert(await card.locator(".context-translation").isVisible());
    await card.locator(".card-more").click();
    assert(await page.locator("#wordDetailsDialog").evaluate((d) => d.open));
    await page.keyboard.press("Escape");
    await page.locator("#searchInput").fill("ookii");
    await page.waitForTimeout(180);
    assert.equal(
      await page.locator('.card-diagram[data-diagram="size"]').count(),
      1,
    );
    await page.locator('[data-action="opposite"]').click();
    assert.equal(
      await page.locator("#wordDetailsTitle").textContent(),
      "小さい",
    );
    await page.keyboard.press("Escape");
    await page.reload();
    assert.equal(
      await page.locator("#studyModeToggle").getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(
      await page.locator(".learning-card .word-meaning:not([hidden])").count(),
      0,
    );
    await page.locator("#studyModeToggle").click();
    assert.equal(
      await page.locator(".learning-card .word-meaning[hidden]").count(),
      0,
    );
    await page.locator('[data-page="lessons"]').click();
    await page.locator("[data-lesson-open]").first().click();
    assert((await page.locator(".lv-card.learning-card").count()) > 0);
    assert.equal(await page.locator(".lv-card .lv-art").count(), 0);
    await page.locator(".lv-card .word-open").first().click();
    assert(await page.locator("#wordDetailsDialog").evaluate((d) => d.open));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test("learning cards fit phones in both languages and themes", async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 900 },
    });
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.locator('[data-cat="Adjectives"]').click();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const lang of ["en", "ja"]) {
        if ((await page.locator("html").getAttribute("lang")) !== lang) {
          await page.locator("#languageToggle").click();
          await page.waitForTimeout(750);
        }
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
        assert(
          await page
            .locator(".learning-card")
            .evaluateAll((cards) =>
              cards.every((c) => c.scrollWidth <= c.clientWidth + 1),
            ),
        );
      }
    }
    await page.locator("#themeBtn").click();
    await page.waitForTimeout(300);
    await page.locator("#studyModeToggle").click();
    assert.equal(
      await page.locator(".learning-card .card-english:not([hidden])").count(),
      0,
    );
    await page.locator(".reveal-meaning").first().click();
    assert(
      await page
        .locator(".learning-card")
        .first()
        .locator(".word-meaning")
        .isVisible(),
    );
  } finally {
    await browser.close();
  }
});
