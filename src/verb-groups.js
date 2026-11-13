const vgLabels = [
  "All verbs",
  "Group 1 · Godan",
  "Group 2 · Ichidan",
  "Group 3 · Irregular",
];
const vgExceptions = new Set(["帰る", "走る", "入る", "切る", "知る"]);
const vgState = {
  group: 0,
  query: "",
  sort: "reading",
  question: null,
  previous: null,
};
const vgIndex = veLibrary.map((v) => [
  v,
  veNormalize([v.jp, v.kana, verbRomaji(v.kana), v.en[0]].join(" ")),
]);
function vgReason(v) {
  if (vgExceptions.has(v.jp))
    return `${v.jp} is a recorded Godan exception to the usual いる / える clue. Its final る changes to り in the ます-form and ら in the ない-form. Learn its group with the word.`;
  if (v.group === 1)
    return `A Godan verb, explicitly classified in the library. Its final ${v.kana.slice(-1)} changes vowel rows for different endings.${v.jp === "行く" ? " 行く is exceptional: its て / た forms are 行って / 行った." : ""}${v.sense === "aru" ? " Its negative is the special form ない." : ""}`;
  if (v.group === 2)
    return "An Ichidan verb, explicitly classified in the library. Remove the final る, then add ます, ない, た, or て. An いる / える ending is a clue, not proof of the group.";
  return v.jp.endsWith("する")
    ? "A する-family irregular verb. Keep the noun prefix (if present), then conjugate する: します, しない, した, して."
    : "来る is irregular: くる becomes きます, こない, きた, and きて. The reading of 来 changes with the form.";
}
function vgInitialize() {
  const root = el("verbGroupsPage");
  if (root.dataset.ready) return;
  root.dataset.ready = "true";
  root.innerHTML = `<div class="vg-page"><div class="section-title"><div><h2>Verb Groups <small lang="ja">動詞グループ</small></h2><p>Find a verb, understand its group, explore its forms.</p></div><button type="button" class="btn small" data-vg="quiz">Group quiz</button></div>
 <details class="vg-notes"><summary>How to Identify Verb Groups</summary><div class="vg-note-grid"><section><h3>1 · Godan / う-verbs</h3><p>Final kana changes vowel rows when conjugated. Endings include う, く, ぐ, す, つ, ぬ, ぶ, む, and る.</p><p lang="ja">書く → 書きます · 飲む → 飲まない</p></section><section><h3>2 · Ichidan / る-verbs</h3><p>Usually end in いる or える. Remove る before adding basic endings. Confirm the group in a dictionary.</p><p lang="ja">食べる → 食べます · 見る → 見ない</p></section><section><h3>3 · Irregular / する・来る</h3><p>する and 来る use special stems. Noun + する compounds follow the same pattern as する.</p><p lang="ja">勉強する → 勉強します · 来る → 来ます（きます）</p></section></div><p><strong>Watch the exceptions:</strong> not every いる / える verb is Ichidan.</p><div class="vg-exceptions">${[...vgExceptions].map((id) => `<button class="btn small" type="button" data-vg-find="${id}">${veRuby(veById.get(id).jp, veById.get(id).kana)} · Group 1</button>`).join("")}</div><p class="ve-note">Beginner and useful next-step vocabulary; uncertain JLPT word-level labels are omitted. <a href="https://guidetojapanese.org/learn/grammar/verbs" target="_blank" rel="noopener noreferrer">Classification reference ↗</a></p></details>
 <section id="vgQuiz" class="vg-quiz" hidden aria-label="Verb group quiz"></section>
 <div class="vg-toolbar"><label class="vg-search">Search verbs<input id="vgSearch" type="search" placeholder="書く · かく · kaku · write" autocomplete="off"></label><label>Sort by<select id="vgSort"><option value="reading">Japanese reading</option><option value="english">English meaning</option></select></label></div>
 <div class="vg-filters" role="group" aria-label="Filter verb groups">${vgLabels.map((s, i) => `<button type="button" class="btn small" data-vg-group="${i}" aria-pressed="${i === 0}">${s}<span>${i ? veLibrary.filter((v) => v.group === i).length : veLibrary.length}</span></button>`).join("")}</div><p id="vgCount" class="ve-note" role="status"></p><div id="vgCards" class="vg-grid"></div></div>`;
  root.addEventListener("input", (e) => {
    if (e.target.id === "vgSearch") {
      vgState.query = e.target.value;
      vgRender();
    }
  });
  root.addEventListener("change", (e) => {
    if (e.target.id === "vgSort") {
      vgState.sort = e.target.value;
      vgRender();
    }
  });
  root.addEventListener("click", vgClick);
  // Previews are built only on first expansion, not for every search keystroke.
  root.addEventListener(
    "toggle",
    (e) => {
      const d = e.target;
      if (d.matches?.("details[data-vg-card]") && d.open && !d.dataset.loaded) {
        const v = veById.get(d.dataset.vgCard);
        d.querySelector(".vg-detail").innerHTML = vgDetail(v);
        d.dataset.loaded = "true";
      }
    },
    true,
  );
  vgRender();
}
function vgRender() {
  const q = veNormalize(vgState.query);
  const rows = vgIndex
    .filter(
      ([v, s]) =>
        (!vgState.group || v.group === vgState.group) && (!q || s.includes(q)),
    )
    .map(([v]) => v)
    .sort((a, b) =>
      vgState.sort === "english"
        ? a.en[0].localeCompare(b.en[0], "en")
        : a.kana.localeCompare(b.kana, "ja"),
    );
  el("vgCount").textContent = `${rows.length} of ${veLibrary.length} verbs`;
  el("vgCards").innerHTML = rows.length
    ? rows
        .map(
          (v) =>
            `<details class="vg-card" data-vg-card="${esc(v.id)}"><summary><span class="vg-card-group">${vgLabels[v.group]}${vgExceptions.has(v.jp) ? " · Exception" : ""}</span><span class="vg-word" lang="ja">${veRuby(v.jp, v.kana)}</span><span class="vg-romaji" data-no-translate>${esc(verbRomaji(v.kana))}</span><span class="vg-meaning" data-no-translate>to ${esc(v.en[0])}</span><span class="vg-card-hint">Forms & group notes</span></summary><div class="vg-detail"></div></details>`,
        )
        .join("")
    : "<p>No matching verbs. Try another reading or meaning.</p>";
  el("verbGroupsPage")
    .querySelectorAll("[data-vg-group]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(Number(b.dataset.vgGroup) === vgState.group),
      ),
    );
}
function vgDetail(v) {
  const forms = veForms(v).filter((f) =>
    ["polite", "negative", "past", "te"].includes(f.id),
  );
  return `<p>${esc(vgReason(v))}</p><dl class="vg-preview">${forms.map((f) => `<div><dt>${esc(f.label)}</dt><dd lang="ja">${veFormMarkup(v, f)}</dd><dd class="vg-romaji" data-no-translate>${esc(f.romaji)}</dd></div>`).join("")}</dl><button type="button" class="btn small" data-vg-open="${esc(v.id)}">Open in Conjugation Explorer</button>`;
}
function vgNewQuestion() {
  const pool = veLibrary.filter((v) => v.id !== vgState.previous);
  const v = pool[Math.floor(Math.random() * pool.length)];
  vgState.question = { id: v.id, answered: false };
  vgState.previous = v.id;
  const box = el("vgQuiz");
  box.hidden = false;
  box.innerHTML = `<div class="ve-practice-heading"><h3 id="vgQuizTitle" tabindex="-1">Which group does this verb belong to?</h3><button type="button" class="btn small" data-vg="close-quiz">Close quiz</button></div><p class="vg-word" lang="ja">${veRuby(v.jp, v.kana)}</p><p data-no-translate>${esc(verbRomaji(v.kana))} · to ${esc(v.en[0])}</p><div class="vg-answers">${vgLabels
    .slice(1)
    .map(
      (s, i) =>
        `<button type="button" class="btn small" data-vg-answer="${i + 1}">${s}</button>`,
    )
    .join("")}</div><div id="vgFeedback" role="status"></div>`;
  el("vgQuizTitle").focus();
}
function vgClick(e) {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.vgGroup !== undefined) {
    vgState.group = Number(b.dataset.vgGroup);
    vgRender();
  }
  if (b.dataset.vgFind) {
    vgState.group = 0;
    vgState.query = b.dataset.vgFind;
    el("vgSearch").value = vgState.query;
    vgRender();
    const d = el("vgCards").querySelector("details");
    d.open = true;
    d.querySelector("summary").focus();
  }
  if (b.dataset.vgOpen) {
    setPage("verbs");
    veSelect(b.dataset.vgOpen);
    el("veSearch").focus();
  }
  if (b.dataset.vg === "quiz" || b.dataset.vg === "next") vgNewQuestion();
  if (b.dataset.vg === "close-quiz") {
    el("vgQuiz").hidden = true;
    el("verbGroupsPage").querySelector('[data-vg="quiz"]').focus();
  }
  if (b.dataset.vgAnswer && vgState.question && !vgState.question.answered) {
    vgState.question.answered = true;
    const v = veById.get(vgState.question.id),
      correct = Number(b.dataset.vgAnswer) === v.group;
    el("vgQuiz")
      .querySelectorAll("[data-vg-answer]")
      .forEach((x) => {
        x.disabled = true;
        if (Number(x.dataset.vgAnswer) === v.group)
          x.classList.add("vg-correct");
      });
    el("vgFeedback").innerHTML =
      `<p><strong>${correct ? "Correct!" : "Not quite."} ${vgLabels[v.group]}.</strong></p><p>${esc(vgReason(v))}</p><button type="button" class="btn small" data-vg="next">Another question</button>`;
  }
}
