const VE_KEY = "kotoba_verb_explorer_v1";
const veLibrary = [...EXPLORER_VERBS, ...VERB_LIBRARY_ADDITIONS];
const veById = new Map(veLibrary.map((v) => [v.id, v]));
const veCommon = [
  "食べる",
  "飲む",
  "行く",
  "来る",
  "する",
  "見る",
  "聞く",
  "書く",
  "読む",
  "話す",
  "買う",
  "帰る",
  "出かける",
  "起きる",
];
const veNormalize = (s) =>
  s
    .normalize("NFKC")
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 96))
    .toLowerCase()
    .replace(/ō/g, "ou")
    .replace(/ū/g, "uu")
    .replace(/[\s’'.,。？！!?・-]/g, "");
const veSearchIndex = veLibrary.map((v) => [
  v,
  veNormalize([v.jp, v.kana, verbRomaji(v.kana), ...v.en].join(" ")),
]);
veLoadCustom();
let veReadingPreferenceSet = false;
let veSaved = { favorites: [], recent: [], readings: true, romaji: true };
try {
  const saved = JSON.parse(localStorage.getItem(VE_KEY) || "{}");
  for (const key of ["favorites", "recent"])
    if (Array.isArray(saved[key]))
      veSaved[key] = [
        ...new Set(saved[key].filter((id) => veById.has(id))),
      ].slice(0, key === "recent" ? 8 : veById.size);
  for (const key of ["readings", "romaji"])
    if (typeof saved[key] === "boolean") {
      veSaved[key] = saved[key];
      if (key === "readings") veReadingPreferenceSet = true;
    }
} catch {}
const veState = {
  selected: "食べる",
  tab: "essentials",
  suggestions: [],
  active: -1,
  question: null,
};
const veCache = new Map();
function veForms(v) {
  if (!veCache.has(v.id)) veCache.set(v.id, verbConjugations(v));
  return veCache.get(v.id);
}
function vePersist() {
  try {
    localStorage.setItem(VE_KEY, JSON.stringify(veSaved));
  } catch {}
}
// Align kanji runs with okurigana, so long examples wrap naturally on phones.
function veRuby(jp, kana) {
  const hira = (s) =>
    s
      .replace(/\s/g, "")
      .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 96));
  const reading = hira(kana),
    chunks = jp.match(/[一-龯々]+|[^一-龯々]+/g) || [jp];
  let offset = 0;
  return chunks
    .map((chunk, i) => {
      if (!/^[一-龯々]+$/.test(chunk)) {
        const normalized = hira(chunk);
        if (reading.startsWith(normalized, offset)) offset += normalized.length;
        return esc(chunk);
      }
      const next = chunks[i + 1] ? hira(chunks[i + 1]) : "";
      let end = next ? reading.indexOf(next, offset) : reading.length;
      if (end < offset) end = reading.length;
      const r = reading.slice(offset, end);
      offset = end;
      return (
        "<ruby>" +
        esc(chunk) +
        '<rt class="ve-reading">' +
        esc(r) +
        "</rt></ruby>"
      );
    })
    .join("");
}

function veGroup(v) {
  return ["", "Group 1 · う-verb", "Group 2 · る-verb", "Group 3 · Irregular"][
    v.group
  ];
}
function veGroupNote(v) {
  if (v.library)
    return "Curated library classification. Forms use the shared conjugation engine; contextual examples use a reviewed reference verb.";
  if (v.custom)
    return "Group confirmed by you. Forms are calculated offline from that group; lexical meaning and usage are unreviewed.";
  return v.group === 1
    ? "A Godan verb: its last kana changes vowel rows. A final る does not make it Group 2."
    : v.group === 2
      ? "An Ichidan verb: remove the final る to form the stem. This group is explicitly recorded in the dictionary."
      : "An irregular verb. する and 来る have special stems; する compounds retain their noun prefix.";
}
function veInitialize() {
  const root = el("verbsPage");
  if (root.dataset.ready) return;
  root.dataset.ready = "true";
  if (!veReadingPreferenceSet) veSaved.readings = state.readingMode !== "clean";
  root.innerHTML = `<div class="ve"><header class="ve-heading"><div><div class="hero-kicker">動詞活用 · KOTOBA</div><h1>Verb Explorer</h1><p>Find a verb. Understand its forms. Put them into practice.</p></div><div class="ve-header-actions"><button class="btn small" type="button" data-ve="guide">Conjugation Guide</button><button class="btn small" type="button" data-ve="practice">Practice</button></div></header>
 <div class="ve-search-heading"><label class="ve-search-label" for="veSearch">Search verbs</label><button type="button" class="btn small" data-ve="new-verb">New verb</button></div><div class="ve-search-wrap"><input id="veSearch" type="search" autocomplete="off" placeholder="食べる · たべる · taberu · eat" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="veSuggestions"><ul id="veSuggestions" role="listbox" aria-label="Verb suggestions" hidden></ul></div><p id="veSearchStatus" class="ve-note" role="status"></p>
 <div class="ve-common" aria-label="Commonly studied verbs">${veCommon.map((id) => `<button type="button" data-ve-select="${id}" lang="ja">${id}</button>`).join("")}</div>
 <details class="ve-saved"><summary>Favorites & recent verbs</summary><div id="veSaved"></div></details>
 ${veCustomMarkup()}<div id="veSummary"></div><div class="ve-controls"><div class="ve-tabs" role="tablist" aria-label="Conjugation study tiers">${[
   ["essentials", "N5 Essentials"],
   ["all", "All Forms"],
   ["advanced", "Advanced · N4+"],
 ]
   .map(
     ([key, label]) =>
       `<button id="veTab-${key}" type="button" role="tab" data-ve-tab="${key}" aria-controls="veForms">${label}</button>`,
   )
   .join(
     "",
   )}</div><fieldset class="ve-display"><legend class="ve-sr">Reading display</legend><label><input type="checkbox" data-ve-display="readings" ${veSaved.readings ? "checked" : ""}> Readings</label><label><input type="checkbox" data-ve-display="romaji" ${veSaved.romaji ? "checked" : ""}> Romaji</label></fieldset></div>
 <section id="veGuide" class="ve-practice ve-guide" hidden aria-labelledby="veGuideTitle"></section><div id="veForms" role="tabpanel" tabindex="0"></div>
 <section id="vePractice" class="ve-practice" hidden aria-labelledby="vePracticeTitle"><div class="ve-practice-heading"><h2 id="vePracticeTitle" tabindex="-1">Practice conjugations</h2><button type="button" class="btn small" data-ve="close-practice">Close practice</button></div><div class="ve-practice-filters"><label>Study tier<select id="vePracticeScope"><option value="essentials">N5 Essentials</option><option value="all">All Forms</option></select></label><label>Verb group<select id="vePracticeGroup"><option value="all">All groups</option><option value="1">Group 1 · う-verbs</option><option value="2">Group 2 · る-verbs</option><option value="3">Group 3 · Irregular</option></select></label><label>Form family<select id="vePracticeFamily"><option value="all">All registers</option><option value="polite">Polite forms</option><option value="plain">Casual forms</option><option value="te">て-form & continuous</option></select></label><label>Answer mode<select id="vePracticeMode"><option value="typed">Type Japanese</option><option value="choice">Multiple choice</option></select></label></div><div id="veQuestion"></div></section>
 <p class="ve-note ve-sources">${EXPLORER_VERBS.length} curated verbs · Works offline. Study tiers are learning guides; unverified JLPT word-level tags are omitted. <a href="https://tsunagarujp.mext.go.jp/assets/download/conjugation_of_verbs_2_ver202404.pdf" target="_blank" rel="noopener noreferrer">MEXT conjugation reference ↗</a> · <a href="https://guidetojapanese.org/learn/grammar/causepass" target="_blank" rel="noopener noreferrer">Usage reference ↗</a></p></div>`;
  root.addEventListener("click", veClick);
  root.addEventListener("submit", (e) => {
    if (e.target.id === "veCustomForm") veSaveCustom(e);
  });
  // Keep combobox focus while a pointer selects a listbox option.
  root.addEventListener("pointerdown", (e) => {
    if (e.target.closest("#veSuggestions [data-ve-select]")) e.preventDefault();
  });
  root.addEventListener("input", (e) => {
    if (e.target.id === "veSearch") veSuggest(e.target.value);
    if (["veCustomJP", "veCustomKana"].includes(e.target.id)) veCustomInfer();
  });
  root.addEventListener("keydown", veKeydown);
  root.addEventListener("change", (e) => {
    const display = e.target.dataset.veDisplay;
    if (display) {
      veSaved[display] = e.target.checked;
      veApplyDisplay();
      vePersist();
    }
    if (e.target.closest(".ve-practice-filters")) veNextQuestion();
  });
  root.addEventListener("focusout", () =>
    queueMicrotask(() => {
      if (!el("veSearch").parentElement.contains(document.activeElement))
        veCloseSuggestions();
    }),
  );
  veSelect(veState.selected, false);
  veApplyDisplay();
}
function veApplyDisplay() {
  const root = el("verbsPage");
  root.dataset.readings = String(veSaved.readings);
  root.dataset.romaji = String(veSaved.romaji);
}
function veSelect(id, remember = true) {
  const v = veById.get(id);
  if (!v) return;
  veState.selected = id;
  if (remember) {
    veSaved.recent = [id, ...veSaved.recent.filter((x) => x !== id)].slice(
      0,
      8,
    );
    vePersist();
  }
  el("veSearch").value = v.jp;
  veCloseSuggestions();
  const aspect =
    v.aspect === "result"
      ? "With this movement verb, ている often describes having gone/come/returned and the resulting state; it can also describe a habit."
      : v.aspect === "awake"
        ? "起きている means “be awake,” not necessarily “be in the process of getting up.”"
        : v.aspect === "wear"
          ? "着ている describes wearing clothes, a resulting state, rather than putting them on."
          : "";
  el("veSummary").innerHTML =
    `<section class="ve-summary"><div><span class="ve-group ve-group-${v.group}">${veGroup(v)}</span><h2 lang="ja">${veRuby(v.jp, v.kana)}</h2><p class="ve-romaji">${esc(verbRomaji(v.kana))}</p><p data-no-translate>${esc(v.en[0])}${v.sense === "iru" ? " · animate presence / staying" : v.sense === "aru" ? " · inanimate existence" : ""}</p></div><button type="button" class="btn small" data-ve="favorite" aria-pressed="${veSaved.favorites.includes(id)}">${veSaved.favorites.includes(id) ? "Saved to favorites" : "Save favorite"}</button><p class="ve-group-note">${veGroupNote(v)}${aspect ? " " + aspect : ""}</p>${v.custom ? '<p class="ve-custom-notice">' + (v.library ? "Library supplement." : "User-provided verb.") + " No meaning or context sentence has been inferred. Examples use a reviewed reference verb.</p>" : ""}</section>`;
  veRenderSaved();
  veRenderTable();
}
function veRenderSaved() {
  el("veSaved").innerHTML = ["favorites", "recent"]
    .map(
      (key) =>
        `<div class="ve-saved-row"><span>${key === "favorites" ? "Favorites" : "Recent"}</span>${veSaved[key].length ? veSaved[key].map((id) => `<button type="button" data-ve-select="${esc(id)}" lang="ja">${esc(id)}</button>`).join("") : `<small>${key === "favorites" ? "No favorites yet." : "Choose a verb to start your recent list."}</small>`}</div>`,
    )
    .join("");
}
function veSuggest(query) {
  const q = veNormalize(query);
  veState.suggestions = q
    ? veSearchIndex
        .filter(([, key]) => key.includes(q))
        .map(([v]) => v)
        .slice(0, 8)
    : [];
  veState.active = -1;
  el("veSuggestions").innerHTML = veState.suggestions
    .map(
      (v, i) =>
        `<li role="option" id="veOption-${i}" data-ve-select="${esc(v.id)}" aria-selected="false"><span lang="ja">${esc(v.jp)} <small>${esc(v.kana)}</small></span><span>${esc(v.en[0])}</span></li>`,
    )
    .join("");
  const open = !!veState.suggestions.length;
  el("veSuggestions").hidden = !open;
  el("veSearch").setAttribute("aria-expanded", String(open));
  el("veSearch").removeAttribute("aria-activedescendant");
  el("veSearchStatus").textContent = q
    ? open
      ? `${veState.suggestions.length} suggestions. Use arrow keys and Enter, or tap a verb.`
      : "Not found. Use New verb to enter its reading and confirm the group."
    : "";
}
function veCloseSuggestions() {
  veState.suggestions = [];
  veState.active = -1;
  if (!el("veSuggestions")) return;
  el("veSuggestions").hidden = true;
  el("veSearch").setAttribute("aria-expanded", "false");
  el("veSearch").removeAttribute("aria-activedescendant");
  el("veSearchStatus").textContent = "";
}
function veKeydown(e) {
  if (e.isComposing) return;
  if (e.target.id === "veSearch") {
    if (e.key === "Escape") {
      veCloseSuggestions();
      return;
    }
    const list = veState.suggestions;
    if (["ArrowDown", "ArrowUp"].includes(e.key) && list.length) {
      e.preventDefault();
      veState.active =
        (veState.active + (e.key === "ArrowDown" ? 1 : -1) + list.length) %
        list.length;
      el("veSuggestions").hidden = false;
      el("veSearch").setAttribute("aria-expanded", "true");
      el("veSearch").setAttribute(
        "aria-activedescendant",
        "veOption-" + veState.active,
      );
      [...el("veSuggestions").children].forEach((node, i) =>
        node.setAttribute("aria-selected", String(i === veState.active)),
      );
    }
    if (e.key === "Enter" && list.length) {
      e.preventDefault();
      veSelect(list[Math.max(0, veState.active)].id);
    }
  }
  if (e.target.id === "veAnswer" && e.key === "Enter") {
    e.preventDefault();
    veCheckAnswer();
  }
  const tab = e.target.closest("[data-ve-tab]");
  if (tab && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
    e.preventDefault();
    const tabs = [...el("verbsPage").querySelectorAll("[data-ve-tab]")];
    const i =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? 2
          : (tabs.indexOf(tab) + (e.key === "ArrowRight" ? 1 : 2)) % 3;
    veState.tab = tabs[i].dataset.veTab;
    veRenderTable();
    tabs[i].focus();
  }
}
function veRenderTable() {
  const v = veById.get(veState.selected),
    forms = veForms(v).filter(
      (f) => veState.tab === "all" || f.tier === veState.tab,
    );
  el("verbsPage")
    .querySelectorAll("[data-ve-tab]")
    .forEach((b) => {
      const selected = b.dataset.veTab === veState.tab;
      b.setAttribute("aria-selected", String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
  el("veForms").setAttribute("aria-labelledby", "veTab-" + veState.tab);
  el("veForms").innerHTML =
    `<p class="ve-note">${forms.length} entries · “Pattern” means grammar attached to a verb form, rather than a standalone conjugation. Expand a row to learn more.</p><p class="ve-form-legend"><span class="g-verb">Base / stem</span><span class="g-ending">Ending / attached pattern</span></p><p class="ve-note">Colors show the base used for this form; it is not always the ます-stem.</p><table class="ve-table"><caption class="ve-sr">Conjugations of ${esc(v.jp)}</caption><thead><tr><th scope="col">Form</th><th scope="col">Japanese</th><th class="ve-romaji" scope="col">Romaji</th><th scope="col">English</th><th scope="col"><span class="ve-sr">Copy</span></th></tr></thead><tbody>${forms.map((f) => `<tr class="ve-main" data-ve-expand="${f.id}"><th scope="row"><button type="button" aria-expanded="false" aria-controls="veDetail-${f.id}">${esc(f.label)}<span class="ve-row-meta"><span class="ve-register-${f.register}">${f.register === "plain" ? "Plain" : f.register === "polite" ? "Polite" : "Neutral"}</span>${f.kind === "pattern" ? "<span>Pattern</span>" : ""}</span></button></th><td class="ve-japanese" lang="ja">${f.unavailable ? '<span class="ve-unavailable">Context-specific</span>' : veFormMarkup(v, f)}</td><td class="ve-romaji">${esc(f.romaji)}</td><td class="ve-gloss">${f.unavailable ? "See usage note" : esc(verbGloss(v, f))}</td><td class="ve-copy-cell"><button type="button" class="mini-icon" data-ve-copy="${f.id}" aria-label="Copy Japanese: ${esc(f.label)}" ${f.unavailable ? "disabled" : ""}>⧉</button></td></tr><tr class="ve-detail" id="veDetail-${f.id}" hidden><td colspan="5"></td></tr>`).join("")}</tbody></table>`;
}
function veRenderExplanation(v, f) {
  if (f.unavailable)
    return `<div class="ve-explanation"><p role="note">${esc(f.unavailable)}</p><p>${esc(f.caution)}</p></div>`;
  const formation = verbFormation(v, f),
    study = veReferenceExamples(v, f),
    examples = study.examples;
  return `<div class="ve-explanation"><div class="ve-explanation-grid"><section><h3>Meaning</h3><p>${esc(f.meaning)}</p><p class="ve-time-note">${esc(veTemporalNote(v, f))}</p><h3>Formation</h3><p class="ve-formation" lang="ja">${esc(formation.path)}</p><p>${esc(formation.rule)}</p>${f.variants.length ? `<p>Also standard: <span lang="ja">${f.variants.map((x) => veRuby(x.jp, x.kana)).join(" / ")}</span><span class="ve-romaji"> · ${f.variants.map((x) => esc(x.romaji)).join(" / ")}</span></p>` : ""}</section><section><h3>Grammar notes</h3><p>${f.register === "polite" ? "Polite style." : f.register === "plain" ? "Plain/casual style." : "A connecting construction; the rest of the sentence sets the politeness."} ${f.kind === "pattern" ? "This is an attached grammar pattern." : ""}</p>${v.aspect && f.id.startsWith("continuous") ? `<p>${esc(el("veSummary").querySelector(".ve-group-note").textContent)}</p>` : ""}<h3>Common mistakes</h3><p>${esc(f.caution)}</p></section></div><h3>Examples · practice wording</h3>${study.reference ? '<p class="ve-custom-notice">Reference examples with <span lang="ja">' + esc(study.verb.jp) + "</span>. These are not verified sentences for your new verb.</p>" : ""}<div class="ve-example-grid">${examples.map((x) => `<div class="ve-example" data-no-translate><p class="ve-example-jp" lang="ja">${veRuby(x.jp, x.kana)}</p><p class="ve-romaji">${esc(x.romaji)}</p><p>${esc(x.en)}</p><button type="button" class="mini-icon" data-ve-speak="${esc(x.jp)}" aria-label="Listen to example sentence">${icons.speaker}</button></div>`).join("")}</div></div>`;
}
async function veCopy(f, button) {
  try {
    if (!navigator.clipboard?.writeText) throw Error("No clipboard API");
    await navigator.clipboard.writeText(f.jp);
    button.textContent = "✓";
    setTimeout(() => {
      if (button.isConnected) button.textContent = "⧉";
    }, 1000);
  } catch {
    el("veCopyFallback")?.remove();
    const label = document.createElement("label");
    label.id = "veCopyFallback";
    label.className = "ve-copy-fallback";
    label.textContent = "Copy Japanese";
    const input = document.createElement("input");
    input.type = "text";
    input.readOnly = true;
    input.value = f.jp;
    label.appendChild(input);
    el("veForms").prepend(label);
    input.focus();
    input.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {}
    if (copied) {
      label.remove();
      toast("Copied Japanese.");
    } else toast("Japanese selected. Use your device’s Copy command.");
  }
}

function veClick(e) {
  const guideTopic = e.target.closest("[data-ve-topic]");
  if (guideTopic) {
    const topic = el("veGuide-" + guideTopic.dataset.veTopic);
    topic.open = true;
    topic.scrollIntoView({ block: "start", behavior: "auto" });
    return;
  }
  const guideForm = e.target.closest("[data-ve-guide-form]");
  if (guideForm) {
    veState.tab = "all";
    veRenderTable();
    const button = el("verbsPage").querySelector(
      '[data-ve-expand="' + guideForm.dataset.veGuideForm + '"] th button',
    );
    button.click();
    button.focus();
    return;
  }
  const select = e.target.closest("[data-ve-select]");
  if (select) {
    veSelect(select.dataset.veSelect);
    el("veSearch").focus();
    return;
  }
  const tab = e.target.closest("[data-ve-tab]");
  if (tab) {
    veState.tab = tab.dataset.veTab;
    veRenderTable();
    return;
  }
  const copy = e.target.closest("[data-ve-copy]");
  if (copy) {
    veCopy(
      veForms(veById.get(veState.selected)).find(
        (f) => f.id === copy.dataset.veCopy,
      ),
      copy,
    );
    return;
  }
  const speech = e.target.closest("[data-ve-speak]");
  if (speech) {
    speak({ word: speech.dataset.veSpeak, reading: speech.dataset.veSpeak });
    return;
  }
  const row = e.target.closest("[data-ve-expand]");
  if (row) {
    const id = row.dataset.veExpand,
      detail = el("veDetail-" + id),
      v = veById.get(veState.selected);
    if (!detail.firstElementChild.innerHTML)
      detail.firstElementChild.innerHTML = veRenderExplanation(
        v,
        veForms(v).find((f) => f.id === id),
      );
    detail.hidden = !detail.hidden;
    row
      .querySelector("button")
      .setAttribute("aria-expanded", String(!detail.hidden));
    return;
  }
  const action = e.target.closest("[data-ve]")?.dataset.ve;
  if (action === "favorite") {
    const id = veState.selected;
    veSaved.favorites = veSaved.favorites.includes(id)
      ? veSaved.favorites.filter((x) => x !== id)
      : [...veSaved.favorites, id];
    vePersist();
    veSelect(id, false);
  }
  if (action === "new-verb") veOpenCustom();
  if (action === "close-custom") {
    el("veCustom").hidden = true;
    el("verbsPage").querySelector('[data-ve="new-verb"]').focus();
  }
  if (action === "guide") {
    veGuideRender();
    el("veGuide").hidden = false;
    el("veGuideTitle").focus();
    el("veGuide").scrollIntoView({ block: "start", behavior: "auto" });
  }
  if (action === "close-guide") {
    el("veGuide").hidden = true;
    el("verbsPage").querySelector('[data-ve="guide"]').focus();
  }
  if (action === "practice") {
    el("vePractice").hidden = false;
    if (!veState.question) veNextQuestion();
    el("vePracticeTitle").focus();
    el("vePractice").scrollIntoView({ block: "start", behavior: "auto" });
  }
  if (action === "close-practice") {
    el("vePractice").hidden = true;
    el("verbsPage").querySelector('[data-ve="practice"]').focus();
  }
  if (action === "check") veCheckAnswer();
  if (action === "next") veNextQuestion();
  const choice = e.target.closest("[data-ve-answer]");
  if (choice) {
    el("veQuestion")
      .querySelectorAll("[data-ve-answer]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === choice)));
    veState.question.answer = choice.dataset.veAnswer;
  }
}
function vePracticePool() {
  const scope = el("vePracticeScope").value,
    group = el("vePracticeGroup").value,
    family = el("vePracticeFamily").value;
  return EXPLORER_VERBS.filter(
    (v) => group === "all" || v.group === Number(group),
  ).flatMap((v) =>
    veForms(v)
      .filter(
        (f) =>
          !f.unavailable &&
          (scope === "all" || f.tier === "essentials") &&
          (family === "all" ||
            (family === "te"
              ? f.id === "te" || f.id.startsWith("continuous")
              : f.register === family)),
      )
      .map((f) => ({ v, f })),
  );
}
function veNextQuestion() {
  const pool = vePracticePool().filter(
    (q) => veState.question?.key !== q.v.id + ":" + q.f.id,
  );
  if (!pool.length) {
    el("veQuestion").textContent = "No questions match these filters.";
    veState.question = null;
    return;
  }
  const q = pool[Math.floor(Math.random() * pool.length)];
  q.key = q.v.id + ":" + q.f.id;
  q.answer = "";
  veState.question = q;
  let answerHTML =
    '<label class="ve-answer-label">Your answer (kanji or hiragana)<input id="veAnswer" type="text" lang="ja" autocomplete="off" spellcheck="false"></label>';
  if (el("vePracticeMode").value === "choice") {
    const wrong = [
      ...new Set(
        veForms(q.v)
          .filter(
            (f) =>
              !f.unavailable &&
              f.jp !== q.f.jp &&
              !q.f.variants.some((x) => x.jp === f.jp),
          )
          .map((f) => f.jp),
      ),
    ];
    const choices = [q.f.jp, ...veShuffle(wrong).slice(0, 3)];
    veShuffle(choices);
    answerHTML =
      '<div class="ve-answer-choices" role="group" aria-label="Answer choices">' +
      choices
        .map(
          (x) =>
            `<button type="button" data-ve-answer="${esc(x)}" aria-pressed="false" lang="ja">${esc(x)}</button>`,
        )
        .join("") +
      "</div>";
  }
  el("veQuestion").innerHTML =
    `<div class="ve-question-prompt"><p lang="ja">${veRuby(q.v.jp, q.v.kana)} <span class="ve-romaji">${esc(verbRomaji(q.v.kana))}</span></p><p>Give the form: <strong>${esc(q.f.label)}</strong></p></div>${answerHTML}<div class="ve-practice-actions"><button type="button" class="btn primary small" data-ve="check">Check answer</button><button type="button" class="btn small" data-ve="next">Next question</button></div><div id="veFeedback" role="status" aria-live="polite" aria-atomic="true"></div>`;
}
function veCheckAnswer() {
  const q = veState.question;
  if (!q) return;
  const answer = el("veAnswer")?.value || q.answer;
  if (!answer.trim()) {
    el("veFeedback").textContent = "Enter an answer or choose an option first.";
    return;
  }
  const accepted = [q.f, ...q.f.variants]
    .flatMap((x) => [x.jp, x.kana])
    .map(veNormalize);
  const correct = accepted.includes(veNormalize(answer));
  const formation = verbFormation(q.v, q.f);
  el("veFeedback").innerHTML =
    `<div class="ve-feedback ${correct ? "ve-correct" : "ve-incorrect"}"><h3>${correct ? "Correct!" : "Not quite — here is the form"}</h3><p class="ve-example-jp" lang="ja">${veRuby(q.f.jp, q.f.kana)}</p><p class="ve-romaji">${esc(q.f.romaji)}</p><p data-no-translate>${esc(verbGloss(q.v, q.f))}</p><p>${esc(formation.rule)}</p>${q.f.variants.length ? `<p>Also accepted: <span lang="ja">${esc(q.f.variants[0].jp)}</span></p>` : ""}</div>`;
}

function veShuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
