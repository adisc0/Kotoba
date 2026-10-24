const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("shared content has valid IDs, lesson links, examples and grammar annotations", () => {
  const words = JSON.parse(read("src/data/words.json"));
  const lessons = JSON.parse(read("src/data/lessons.json"));
  assert.equal(new Set(words.map((w) => w.id)).size, words.length);
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  assert.equal(lessons.length, 7);
  for (const w of words) assert(w.word && w.meaning && w.category);
  const grammar = JSON.parse(read("src/data/grammar.json"));
  for (const [text, segments] of Object.entries(grammar))
    assert.equal(segments.map((s) => s[0]).join(""), text);
  const forms = JSON.parse(read("src/data/forms.json"));
  for (const form of Object.values(forms)) {
    assert.equal(form.rows.filter((r) => r[0].startsWith("Casual")).length, 4);
    for (const row of form.rows)
      assert(row[4].jp && row[4].en && grammar[row[4].jp]);
  }
});

test("clock handles irregular readings, han and 24-hour periods", () => {
  const source = read("src/numbers-time.js");
  const ast = require("acorn").parse(source, { ecmaVersion: "latest" });
  const pure = ast.body
    .filter(
      (n) =>
        n.type === "VariableDeclaration" || n.type === "FunctionDeclaration",
    )
    .map((n) => source.slice(n.start, n.end))
    .join("\n");
  const context = {};
  vm.createContext(context);
  vm.runInContext(pure, context);
  assert.equal(context.clockPhrase(14, 30).romaji, "gogo niji han desu.");
  assert.equal(context.clockPhrase(14, 30).jp, "午後二時半です。");
  assert.equal(context.japaneseNumber(3800).kana, "さんぜんはっぴゃく");
  for (let h = 0; h < 24; h++)
    for (let m = 0; m < 60; m++) {
      const phrase = context.clockPhrase(h, m);
      assert(!phrase.kana.includes("undefined"));
      assert.equal(
        phrase.digital,
        String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"),
      );
    }
});
