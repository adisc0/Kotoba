const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("@playwright/test");
const root = path.resolve(__dirname, "..");
const dictionary = require("../src/data/explorer-verbs.json");
const api = vm.runInNewContext(
  fs.readFileSync(path.join(root, "src/verb-engine.js"), "utf8") +
    fs.readFileSync(path.join(root, "src/verb-learning.js"), "utf8") +
    ";({verbConjugations,verbExamples,verbFormation,verbRomaji})",
);
const forms = (word) =>
  new Map(
    api
      .verbConjugations(dictionary.find((v) => v.jp === word))
      .map((f) => [f.id, f]),
  );

test("verb rules match reference fixtures, explicitly handling groups and exceptions", () => {
  const fixtures = {
    買う: [
      "買わない",
      "買います",
      "買って",
      "買った",
      "買える",
      "買われる",
      "買わせる",
      "買わされる",
    ],
    待つ: [
      "待たない",
      "待ちます",
      "待って",
      "待った",
      "待てる",
      "",
      "待たせる",
      "待たされる",
    ],
    読む: [
      "読まない",
      "読みます",
      "読んで",
      "読んだ",
      "読める",
      "読まれる",
      "読ませる",
      "読まされる",
    ],
    泳ぐ: [
      "泳がない",
      "泳ぎます",
      "泳いで",
      "泳いだ",
      "泳げる",
      "",
      "泳がせる",
      "泳がされる",
    ],
    書く: [
      "書かない",
      "書きます",
      "書いて",
      "書いた",
      "書ける",
      "書かれる",
      "書かせる",
      "書かされる",
    ],
    話す: [
      "話さない",
      "話します",
      "話して",
      "話した",
      "話せる",
      "話される",
      "話させる",
      "話させられる",
    ],
    帰る: [
      "帰らない",
      "帰ります",
      "帰って",
      "帰った",
      "帰れる",
      "",
      "帰らせる",
      "帰らされる",
    ],
    食べる: [
      "食べない",
      "食べます",
      "食べて",
      "食べた",
      "食べられる",
      "食べられる",
      "食べさせる",
      "食べさせられる",
    ],
    行く: [
      "行かない",
      "行きます",
      "行って",
      "行った",
      "行ける",
      "",
      "行かせる",
      "行かされる",
    ],
    する: [
      "しない",
      "します",
      "して",
      "した",
      "できる",
      "される",
      "させる",
      "させられる",
    ],
    来る: [
      "来ない",
      "来ます",
      "来て",
      "来た",
      "来られる",
      "来られる",
      "来させる",
      "来させられる",
    ],
  };
  const ids = [
    "negative",
    "polite",
    "te",
    "past",
    "potential",
    "passive",
    "causative",
    "causativePassive",
  ];
  for (const [word, values] of Object.entries(fixtures)) {
    const rows = forms(word);
    ids.forEach((id, i) =>
      assert.equal(rows.get(id).jp, values[i], word + " " + id),
    );
  }
  assert.equal(forms("来る").get("negative").kana, "こない");
  assert.equal(forms("来る").get("polite").romaji, "kimasu");
  assert.equal(forms("来る").get("imperative").kana, "こい");
  assert.equal(forms("ある").get("negative").jp, "ない");
  assert.equal(forms("ある").get("pastNegative").jp, "なかった");
  assert.equal(forms("ある").get("potential").jp, "");
  assert(forms("いる").get("continuous").unavailable);
  assert.equal(
    forms("帰る").get("causativePassive").variants[0].jp,
    "帰らせられる",
  );
  assert.equal(forms("食べる").get("wantPast").jp, "食べたかった");
  assert.equal(forms("食べる").get("prohibition").romaji, "tabete wa ikenai");
  assert.equal(api.verbRomaji("しゅくだい"), "shukudai");
  assert.equal(api.verbRomaji("いって"), "itte");
  assert.equal(dictionary.find((v) => v.jp === "切る").group, 1);
  assert.equal(dictionary.find((v) => v.jp === "着る").group, 2);
});

test("every supported row has formation, meaning, two readable contextual examples, and no bogus states", () => {
  assert.equal(new Set(dictionary.map((v) => v.id)).size, dictionary.length);
  for (const v of dictionary) {
    assert.equal(v.frames.length, 2);
    const rows = api.verbConjugations(v);
    assert.equal(rows.length, 40);
    assert.equal(rows.filter((f) => f.tier === "essentials").length, 18);
    for (const f of rows) {
      if (f.unavailable) {
        assert.equal(f.jp, "");
        assert.equal(api.verbExamples(v, f).length, 0);
        continue;
      }
      const formation = api.verbFormation(v, f);
      assert(formation.path && formation.rule && f.meaning && f.caution);
      const examples = api.verbExamples(v, f);
      assert.equal(examples.length, 2, v.jp + " " + f.id);
      assert.notEqual(examples[0].jp, examples[1].jp);
      for (const ex of examples) {
        for (const key of ["jp", "kana", "romaji", "en"])
          assert(
            ex[key] && !/undefined|NaN/.test(ex[key]),
            v.jp + " " + f.id + " " + key,
          );
        assert(!/[一-龯ァ-ヺ]/.test(ex.kana));
      }
    }
  }
  const eating = dictionary.find((v) => v.jp === "食べる");
  const passive = api.verbExamples(eating, forms("食べる").get("passive"))[0];
  assert.equal(passive.kana.trim(), "ごはん は よく たべられる。");
  assert(passive.romaji.includes(" wa "));
  const doing = dictionary.find((v) => v.jp === "する");
  assert.equal(
    api.verbExamples(doing, forms("する").get("potential"))[0].jp,
    "宿題ができる。",
  );
  assert(
    api
      .verbExamples(
        dictionary.find((v) => v.jp === "起きる"),
        forms("起きる").get("continuous"),
      )[0]
      .en.includes("awake"),
  );
});

test("explorer search, expansion, copy, isolated persistence and both practice modes work offline", async () => {
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
    await page.evaluate(() =>
      localStorage.setItem("verb-explorer-unrelated-test", "preserve me"),
    );
    await page.locator('[data-page="verbs"]').click();
    assert.equal(await page.locator(".ve-main").count(), 18);
    for (const query of ["食べる", "たべる", "taberu", "eat"]) {
      await page.locator("#veSearch").fill(query);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      assert.equal(await page.locator("#veSearch").inputValue(), "食べる");
    }
    await page.locator("#veSearch").fill("kaeru");
    await page.locator('#veSuggestions [data-ve-select="帰る"]').click();
    assert((await page.locator(".ve-group").textContent()).includes("Group 1"));
    await page.locator('[data-ve="favorite"]').click();
    assert.equal(
      await page.locator('[data-ve="favorite"]').getAttribute("aria-pressed"),
      "true",
    );
    await page.locator('[data-ve-tab="all"]').click();
    assert.equal(await page.locator(".ve-main").count(), 40);
    await page.locator('[data-ve-expand="causativePassive"] th button').click();
    assert.equal(
      await page.locator("#veDetail-causativePassive .ve-example").count(),
      2,
    );
    await page.evaluate(() => {
      window.__copies = [];
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (text) => window.__copies.push(text) },
      });
    });
    await page.locator('[data-ve-copy="causativePassive"]').click();
    assert.deepEqual(await page.evaluate(() => window.__copies), [
      "帰らされる",
    ]);
    await page.locator('[data-ve-display="readings"]').uncheck();
    await page.locator('[data-ve-display="romaji"]').uncheck();
    assert.equal(
      await page.locator("#veSummary rt").first().isVisible(),
      false,
    );
    assert.equal(
      await page.locator("#veSummary .ve-romaji").isVisible(),
      false,
    );
    await page.reload();
    await page.locator('[data-page="verbs"]').click();
    await page.locator('.ve-common [data-ve-select="帰る"]').click();
    assert.equal(
      await page.locator('[data-ve="favorite"]').getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(
      await page.locator('[data-ve-display="readings"]').isChecked(),
      false,
    );
    assert.equal(
      await page.evaluate(() =>
        localStorage.getItem("verb-explorer-unrelated-test"),
      ),
      "preserve me",
    );
    await page.locator('[data-ve="practice"]').click();
    await page.locator("#vePracticeGroup").selectOption("3");
    await page.locator("#vePracticeFamily").selectOption("te");
    const prompt = page.locator(".ve-question-prompt");
    const word = await prompt
      .locator("p")
      .first()
      .evaluate((node) => {
        const clone = node.cloneNode(true);
        clone.querySelectorAll("rt,.ve-romaji").forEach((n) => n.remove());
        return clone.textContent.trim();
      });
    const v = dictionary.find((v) => v.jp === word);
    assert.equal(v.group, 3);
    const label = await prompt.locator("strong").textContent(),
      form = api.verbConjugations(v).find((f) => f.label === label);
    assert(form.id === "te" || form.id.startsWith("continuous"));
    await page.locator("#veAnswer").fill(form.kana);
    await page.keyboard.press("Enter");
    assert(
      (await page.locator("#veFeedback").textContent()).includes("Correct!"),
    );
    await page.locator("#vePracticeMode").selectOption("choice");
    assert.equal(await page.locator("[data-ve-answer]").count(), 4);
    await page.locator("[data-ve-answer]").first().click();
    await page.locator('[data-ve="check"]').click();
    assert(
      (await page.locator("#veFeedback .ve-example-jp").textContent()).length >
        0,
    );
    await page.locator('[data-ve="next"]').click();
    assert.equal(await page.locator("#veFeedback").textContent(), "");
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test("explorer is responsive, keyboard accessible, bilingual and wraps expanded furigana", async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 320, height: 1000 },
    });
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.locator('[data-page="verbs"]').click();
    assert.equal(
      await page.locator('[data-page="verbs"]').getAttribute("aria-current"),
      "page",
    );
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator('[data-ve-tab="all"]').click();
      for (const id of [
        "request",
        "causativePassive",
        "wantOther",
        "continuousPastNegativePolite",
      ]) {
        const button = page.locator('[data-ve-expand="' + id + '"] th button');
        if ((await button.getAttribute("aria-expanded")) === "false")
          await button.click();
      }
      for (const lang of ["en", "ja"]) {
        if ((await page.locator("html").getAttribute("lang")) !== lang) {
          await page.locator("#languageToggle").click();
          await page.waitForTimeout(750);
        }
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          "Overflow " + width + " " + lang,
        );
      }
    }
    await page.locator('[data-ve-tab="essentials"]').focus();
    await page.keyboard.press("End");
    assert.equal(
      await page
        .locator('[data-ve-tab="advanced"]')
        .getAttribute("aria-selected"),
      "true",
    );
    assert.equal(await page.locator(".ve-main").count(), 4);
    await page.locator("#themeBtn").click();
    await page.locator('[data-page="lessons"]').click();
    assert.equal(
      await page.locator(".journal-next,.journal-source-note").count(),
      0,
    );
    assert.equal(await page.locator(".yuma-portrait").count(), 1);
  } finally {
    await browser.close();
  }
});
