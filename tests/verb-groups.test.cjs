const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("@playwright/test");
const root = path.resolve(__dirname, "..");
const verbs = [
  ...require("../src/data/explorer-verbs.json"),
  ...require("../src/data/verb-library.json"),
];
const api = vm.runInNewContext(
  fs.readFileSync(path.join(root, "src/verb-engine.js"), "utf8") +
    ";({verbConjugations})",
);
test("library has unique explicit classifications and accurate shared-engine previews", () => {
  assert.equal(verbs.length, 40);
  assert.equal(new Set(verbs.map((v) => v.id)).size, 40);
  for (const v of verbs) {
    assert([1, 2, 3].includes(v.group));
    for (const id of ["polite", "negative", "past", "te"]) {
      const f = api.verbConjugations(v).find((f) => f.id === id);
      assert(f.jp && f.kana && !f.unavailable, v.jp + id);
    }
  }
  for (const [jp, group, expected] of [
    ["教える", 2, ["教えます", "教えない", "教えた", "教えて"]],
    ["走る", 1, ["走ります", "走らない", "走った", "走って"]],
    ["知る", 1, ["知ります", "知らない", "知った", "知って"]],
    ["来る", 3, ["来ます", "来ない", "来た", "来て"]],
    ["掃除する", 3, ["掃除します", "掃除しない", "掃除した", "掃除して"]],
    ["行く", 1, ["行きます", "行かない", "行った", "行って"]],
    ["死ぬ", 1, ["死にます", "死なない", "死んだ", "死んで"]],
  ]) {
    const v = verbs.find((v) => v.jp === jp);
    assert.equal(v.group, group);
    const forms = api.verbConjugations(v);
    ["polite", "negative", "past", "te"].forEach((id, i) =>
      assert.equal(forms.find((f) => f.id === id).jp, expected[i]),
    );
  }
});
test("group library search, quiz, responsive layout and Explorer handoff work offline", async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.context().setOffline(true);
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.locator('[data-page="verbGroups"]').click();
    assert.equal(await page.locator(".vg-card").count(), 40);
    for (const q of ["掃除", "そうじ", "souji", "clean"]) {
      await page.locator("#vgSearch").fill(q);
      assert.equal(await page.locator(".vg-card").count(), 1);
    }
    await page.locator(".vg-card summary").click();
    await page.locator(".vg-preview").waitFor();
    assert(
      (await page.locator(".vg-preview").evaluate(e=>{const c=e.cloneNode(true);c.querySelectorAll("rt").forEach(x=>x.remove());return c.textContent;})).includes("掃除します"),
    );
    await page.locator("[data-vg-open]").click();
    assert.equal(await page.locator("#veSearch").inputValue(), "掃除する");
    assert(
      (await page.locator("#veSummary").innerText()).includes(
        "Curated library classification",
      ),
    );
    await page.locator('[data-ve-form="polite"]').count();
    await page.locator('[data-page="verbGroups"]').click();
    await page.locator("#vgSearch").fill("");
    await page.locator('[data-vg-group="2"]').click();
    assert.equal(
      await page.locator(".vg-card").count(),
      verbs.filter((v) => v.group === 2).length,
    );
    await page.locator("#vgSort").selectOption("english");
    const meanings = await page.locator(".vg-meaning").allTextContents();
    assert.deepEqual(
      meanings,
      [...meanings].sort((a, b) => a.localeCompare(b, "en")),
    );
    await page.locator('[data-vg="quiz"]').click();
    await page.locator('[data-vg-answer="1"]').click();
    assert.equal(await page.locator(".vg-correct").count(), 1);
    assert.equal(await page.locator("[data-vg-answer]:disabled").count(), 3);
    const previous = await page.locator("#vgQuiz .vg-word").innerText();
    await page.locator('[data-vg="next"]').click();
    assert.notEqual(
      await page.locator("#vgQuiz .vg-word").innerText(),
      previous,
    );
    await page.locator('[data-vg="close-quiz"]').click();
    await page.locator(".vg-notes summary").click();
    await page.locator('[data-vg-find="帰る"]').click();
    await page.locator(".vg-preview").waitFor();
    assert(
      (await page.locator(".vg-detail").innerText()).includes(
        "Godan exception",
      ),
    );
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        "overflow " + width,
      );
      const nav = await page.locator('[data-page="verbGroups"]').boundingBox();
      assert(nav.x >= 0 && nav.x + nav.width <= width + 1, "nav " + width);
    }
    await page.evaluate(() => document.body.classList.add("dark"));
    await page.setViewportSize({ width: 390, height: 900 });
    await page.screenshot({
      path: path.join(root, ".history/verb-groups-mobile.png"),
      fullPage: true,
    });
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
