// Curated teaching cues only. No category-based or random image assignment.
const cardLearningCache = new Map();
const revealedMeanings = new Set();

function cardPOS(w) {
  const override = CARD_LEARNING.entries[w.word]?.pos;
  if (override) return override;
  const category = w.category;
  if (category === "Verbs") return { key: "verb", label: "Verb" };
  if (category === "Nouns") return { key: "noun", label: "Noun" };
  if (category === "Adjectives") {
    if (CARD_LEARNING.naAdjectives.includes(w.word))
      return { key: "na-adjective", label: "な-adjective" };
    if (CARD_LEARNING.iAdjectives.includes(w.word))
      return { key: "i-adjective", label: "い-adjective" };
    return { key: "adjective", label: "Adjective" };
  }
  if (category === "Adverbs") return { key: "adverb", label: "Adverb" };
  if (category === "Expressions")
    return { key: "expression", label: "Expression" };
  return { key: "other", label: category };
}
function learningForWord(w) {
  if (cardLearningCache.has(w.id)) return cardLearningCache.get(w.id);
  const config = CARD_LEARNING.entries[w.word] || {};
  const sentence =
    CARD_LEARNING.examplesByReading?.[w.word + "|" + w.reading] ||
    config.sentence;
  const visual = config.diagram ? "diagram" : "sentence";
  const result = { ...config, visual, sentence };
  cardLearningCache.set(w.id, result);
  return result;
}
function highlightedCardSentence(w, text) {
  // Curated offsets distinguish a particle from the same kana inside another word,
  // and identify the entire conjugated form instead of guessing a stem.
  const sentence = learningForWord(w).sentence;
  const { target, targetStart: index } = sentence;
  return (
    esc(text.slice(0, index)) +
    "<mark>" +
    esc(target) +
    "</mark>" +
    esc(text.slice(index + target.length))
  );
}
function learningDiagram(info) {
  const muted = "var(--diagram-muted)",
    accent = "var(--diagram-accent)";
  let drawing = "",
    label = "",
    caption = "";
  const text = (x, value) =>
    '<text x="' +
    x +
    '" y="69" text-anchor="middle" fill="currentColor" stroke="none" font-size="10">' +
    value +
    "</text>";
  if (info.diagram === "timeline") {
    const x = info.focus === "early" ? 25 : 99;
    drawing =
      '<path d="M12 35h100m-100-5v10m50-10v10m50-10v10m-6-10 6 5-6 5" stroke="' +
      muted +
      '"/><circle cx="' +
      x +
      '" cy="35" r="7" fill="' +
      accent +
      '" stroke="none"/>' +
      text(25, "早い") +
      text(99, "遅い");
    label = "Time comparison";
    caption =
      info.focus === "early"
        ? "Earlier in time, not faster"
        : "Later in time, not slower";
  } else if (info.diagram === "size") {
    const small = info.focus === "small";
    drawing =
      '<circle cx="28" cy="31" r="10" fill="' +
      (small ? accent : muted) +
      '" stroke="none"/><circle cx="91" cy="31" r="23" fill="' +
      (small ? muted : accent) +
      '" stroke="none"/>' +
      text(28, "小さい") +
      text(91, "大きい");
    label = "Size comparison";
    caption = small ? "The smaller size" : "The larger size";
  } else if (info.diagram === "temperature") {
    const levels = [
      { x: 22, y: 12, color: "#ad6554", word: "暑い", focus: "hot" },
      { x: 62, y: 27, color: "#6e927d", word: "涼しい", focus: "cool" },
      { x: 102, y: 38, color: "#6085a1", word: "寒い", focus: "cold" },
    ];
    drawing = levels
      .map(
        (t) =>
          '<path d="M' +
          (t.x - 5) +
          ' 38V11a5 5 0 0 1 10 0v27a9 9 0 1 1-10 0Z" stroke="' +
          muted +
          '"/><path data-temperature-level="' +
          t.focus +
          '" d="M' +
          t.x +
          " " +
          t.y +
          'V46" stroke="' +
          t.color +
          '" stroke-width="4"/><circle cx="' +
          t.x +
          '" cy="46" r="5" fill="' +
          t.color +
          '" stroke="none"/>' +
          text(t.x, t.word) +
          (info.focus === t.focus
            ? '<path d="M' +
              (t.x - 10) +
              ' 74h20" stroke="' +
              t.color +
              '" stroke-width="2"/>'
            : ""),
      )
      .join("");
    label = "Weather temperature comparison";
    caption = {
      hot: "Hot weather",
      cold: "Cold weather",
      cool: "Cool weather",
    }[info.focus];
  } else if (info.diagram === "equal") {
    drawing =
      '<circle cx="28" cy="31" r="17" fill="' +
      accent +
      '" stroke="none"/><circle cx="96" cy="31" r="17" fill="' +
      accent +
      '" stroke="none"/><path d="M54 27h16m-16 9h16" stroke="' +
      muted +
      '"/>' +
      text(62, "同じ");
    label = "Equal sizes";
    caption = "Both are the same size";
  }
  if (!drawing) return "";
  return (
    '<figure class="card-diagram" data-diagram="' +
    esc(info.diagram) +
    '"><svg viewBox="0 0 124 78" role="img" aria-label="' +
    label +
    '" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    drawing +
    '</svg><figcaption class="card-english">' +
    caption +
    "</figcaption></figure>"
  );
}

function vocabularyLearningCard(input, lesson = false) {
  const w = { ...(wordById.get(input.id) || {}), ...input };
  const info = learningForWord(w),
    pos = cardPOS(w);
  const hidden = state.studyMode && !revealedMeanings.has(w.id);
  const meaningId =
    "meaning-" +
    (lesson ? "lesson-" + activeLessonId + "-" : "dictionary-") +
    w.id;
  let cue = "";
  if (info.sentence) {
    const example = info.sentence;
    cue =
      '<div class="card-context"><div class="card-context-top"><span>In context</span><button type="button" class="mini-icon example-audio" data-action="example" data-id="' +
      esc(w.id) +
      '" aria-label="Listen to example sentence">' +
      icons.speaker +
      '</button></div><p class="card-context-jp" lang="ja">' +
      highlightedCardSentence(w, example.jp) +
      "</p>" +
      (example.romaji
        ? '<p class="card-context-romaji">' + esc(example.romaji) + "</p>"
        : "") +
      '<p class="context-translation card-english">' +
      esc(example.en) +
      "</p></div>";
  }
  const opposite = info.antonym && wordBySurfaceOnly.get(info.antonym);
  const antonym = opposite
    ? '<div class="card-antonym"><span>Opposite</span><button type="button" data-action="opposite" data-id="' +
      esc(w.id) +
      '" data-target-id="' +
      esc(opposite.id) +
      '"><span lang="ja">' +
      esc(w.word) +
      " ↔ " +
      esc(opposite.word) +
      "</span></button></div>"
    : "";
  let html =
    '<article class="word-card learning-card' +
    (lesson ? " lv-card" : "") +
    (hidden ? " meaning-hidden" : "") +
    '" data-id="' +
    esc(w.id) +
    '" data-pos="' +
    pos.key +
    '" data-visual="' +
    esc(info.visual) +
    '"' +
    (state.studyMode
      ? ' tabindex="0" aria-label="' + esc(w.word) + ' · study card"'
      : "") +
    '><div class="card-top"><span class="type-pill">' +
    pos.label +
    '</span><button type="button" class="mini-icon" data-action="speak" data-id="' +
    esc(w.id) +
    '" aria-label="Listen to ' +
    esc(w.word) +
    '">' +
    icons.speaker +
    '</button></div><div class="word-heading"><div class="word-heading-text"><button type="button" class="word-kanji word-open' +
    (lesson ? " lv-jp" : "") +
    '" lang="ja" data-action="' +
    (state.studyMode ? "reveal" : "more") +
    '" data-id="' +
    esc(w.id) +
    '"' +
    (!state.studyMode ? ' aria-haspopup="dialog"' : "") +
    ">" +
    esc(w.word) +
    '</button><div class="word-reading" lang="ja">' +
    esc(w.reading) +
    '</div><div class="word-romaji">' +
    esc(w.romaji || "") +
    "</div></div>" +
    (info.diagram ? learningDiagram(info) : "") +
    "</div>" +
    (info.usage
      ? '<p class="card-usage" lang="ja">' + esc(info.usage) + "</p>"
      : "") +
    '<div class="word-meaning card-english" id="' +
    esc(meaningId) +
    '">' +
    esc(w.meaning) +
    '</div><button type="button" class="reveal-meaning' +
    (!state.studyMode ? " hidden" : "") +
    '" data-action="reveal" data-id="' +
    esc(w.id) +
    '" aria-controls="' +
    esc(meaningId) +
    '" aria-expanded="' +
    String(!hidden) +
    '">' +
    (hidden ? "Reveal meaning" : "Hide meaning") +
    "</button>" +
    cue +
    antonym +
    '<div class="card-footer"><span class="source-label">' +
    esc(w.topic || w.source || w.category) +
    '</span><button type="button" class="card-more" data-action="more" data-id="' +
    esc(w.id) +
    '" aria-haspopup="dialog">Details</button></div></article>';
  if (info.focus)
    html = html.replace(
      'data-visual="',
      'data-diagram-focus="' + esc(info.focus) + '" data-visual="',
    );
  // Hidden translations are removed from the accessibility tree, not merely blurred.
  if (hidden)
    html = html
      .replaceAll(
        'class="word-meaning card-english"',
        'hidden class="word-meaning card-english"',
      )
      .replaceAll(
        'class="context-translation card-english"',
        'hidden class="context-translation card-english"',
      )
      .replaceAll('class="card-english"', 'hidden class="card-english"');
  return html;
}
function revealCardMeaning(card) {
  const id = card.dataset.id;
  revealedMeanings.has(id)
    ? revealedMeanings.delete(id)
    : revealedMeanings.add(id);
  const shown = revealedMeanings.has(id);
  for (const matching of document.querySelectorAll(".learning-card")) {
    if (matching.dataset.id !== id) continue;
    matching.classList.toggle("meaning-hidden", !shown);
    matching
      .querySelectorAll(".card-english")
      .forEach((node) => (node.hidden = !shown));
    const button = matching.querySelector(".reveal-meaning");
    button.setAttribute("aria-expanded", String(shown));
    button.textContent = shown ? "Hide meaning" : "Reveal meaning";
  }
}
function syncStudyModeControls() {
  const toggle = el("studyModeToggle");
  toggle.setAttribute("aria-pressed", String(state.studyMode));
  el("studyModeHint").hidden = !state.studyMode;
  document.body.classList.toggle("study-mode", state.studyMode);
}
function handleLearningAction(e) {
  const b = e.target.closest("[data-action]");
  if (!b || !["reveal", "example", "opposite"].includes(b.dataset.action))
    return false;
  const w = getWord(b.dataset.id);
  if (!w) return true;
  if (b.dataset.action === "reveal")
    revealCardMeaning(b.closest(".learning-card"));
  if (b.dataset.action === "example") {
    const sentence = learningForWord(w).sentence;
    if (sentence) speak({ word: sentence.jp, reading: sentence.jp });
  }
  if (b.dataset.action === "opposite") openWordDetails(b.dataset.targetId);
  return true;
}
function initializeLearningCards() {
  syncStudyModeControls();
  el("studyModeToggle").addEventListener("click", () => {
    state.studyMode = !state.studyMode;
    revealedMeanings.clear();
    persist();
    syncStudyModeControls();
    renderLibrary();
    if (page === "lessons" && activeLessonId) renderLessons();
  });
  el("lessonsContent").addEventListener("click", handleWordAction);
  document.addEventListener("click", (e) => {
    if (
      !state.studyMode ||
      e.target.closest("button,a,input,select,summary,details")
    )
      return;
    const card = e.target.closest(".learning-card");
    if (card) revealCardMeaning(card);
  });
  document.addEventListener("keydown", (e) => {
    if (
      state.studyMode &&
      e.target.matches(".learning-card") &&
      ["Enter", " "].includes(e.key)
    ) {
      e.preventDefault();
      revealCardMeaning(e.target);
    }
  });
}
