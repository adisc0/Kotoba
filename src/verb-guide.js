// An offline reference, rendered only when opened. Forms/examples reuse the
// conjugation engine and reviewed dictionary rather than another set of tables.
const VE_GUIDE_TOPICS = [
  {
    id: "groups",
    title: "Three Japanese verb groups",
    level: "Foundation",
    text: "Group 1 (Godan) changes its final kana across vowel rows. Group 2 (Ichidan) usually drops its final る. Group 3 includes する, 来る, and their compounds. The last letter alone is not a reliable classifier: 帰る・入る・切る are Group 1, while 食べる・見る・着る are Group 2.",
    rows: [
      ["帰る", "polite"],
      ["食べる", "polite"],
      ["する", "polite"],
      ["来る", "polite"],
    ],
    example: ["飲む", "polite"],
    note: "For an unfamiliar る-ending verb, confirm its group in a dictionary or with Yuma-san. Raw こする is not a する-compound; a spelling ending in くる is not automatically 来る.",
  },
  {
    id: "polite",
    title: "ます-form and polite tense",
    level: "Foundation",
    text: "Use the polite stem with ます, ません, ました, or ませんでした. For Group 1, change the final u-row kana to its i-row partner. For Group 2, remove る. Use し for する and き for 来る.",
    rows: [
      ["食べる", "polite"],
      ["食べる", "politeNegative"],
      ["食べる", "politePast"],
      ["食べる", "politePastNegative"],
    ],
    example: ["勉強する", "politePast"],
    note: "Dictionary form and ます-form are both non-past: habits, general facts, or future plans. A time word supplies context. ます does not itself mean “am doing.”",
  },
  {
    id: "negative",
    title: "ない-form",
    level: "Foundation",
    text: "Group 1: use the a-row plus ない; final う becomes わない. Group 2: remove る and add ない. する becomes しない; 来る becomes こない. For plain past negative, replace ない with なかった.",
    rows: [
      ["飲む", "negative"],
      ["買う", "negative"],
      ["食べる", "negative"],
      ["する", "negative"],
      ["来る", "negative"],
      ["ある", "negative"],
    ],
    example: ["読む", "pastNegative"],
    note: "ある is special: ない, not あらない. ない is plain style; ません is polite style.",
  },
  {
    id: "past",
    title: "た-form",
    level: "Foundation",
    text: "For Group 1, the final consonant determines the sound change. Group 2 uses the stem plus た. Irregulars: する → した; 来る → きた. The た-form describes a completed event or a past situation.",
    rows: [
      ["買う", "past"],
      ["待つ", "past"],
      ["帰る", "past"],
      ["読む", "past"],
      ["遊ぶ", "past"],
      ["書く", "past"],
      ["泳ぐ", "past"],
      ["話す", "past"],
      ["行く", "past"],
    ],
    sound: "ta",
    example: ["料理する", "past"],
    note: "う・つ・る → った; む・ぶ・ぬ → んだ; く → いた; ぐ → いだ; す → した. 行く is exceptional: 行った.",
  },
  {
    id: "te",
    title: "て-form",
    level: "Foundation",
    text: "The sound-change families match the た-form: った ↔ って; んだ ↔ んで; いた ↔ いて; いだ ↔ いで; した ↔ して. Group 2 uses its stem plus て. Irregulars: して and きて.",
    rows: [
      ["買う", "te"],
      ["読む", "te"],
      ["書く", "te"],
      ["泳ぐ", "te"],
      ["話す", "te"],
      ["行く", "te"],
      ["食べる", "te"],
      ["来る", "te"],
    ],
    example: ["飲む", "request"],
    note: "The て-form connects clauses or takes another expression. It does not independently specify past/present tense or politeness. 行く → 行って, not 行いて.",
  },
  {
    id: "want",
    title: "たい-form",
    level: "Foundation",
    text: "Attach たい to the polite stem. It behaves like an い-adjective: たい → たくない → たかった → たくなかった. Adding です makes these desire statements more polite.",
    rows: [
      ["食べる", "want"],
      ["食べる", "wantNegative"],
      ["食べる", "wantPast"],
      ["食べる", "wantPastNegative"],
    ],
    example: ["行く", "want"],
    note: "たい describes the speaker’s desire to act. たかった means “wanted to,” not that the action happened. For a wish that another person acts, use person に + てほしい.",
  },
  {
    id: "continuous",
    title: "ている and ていた",
    level: "Foundation",
    text: "Attach いる to the て-form; change that auxiliary for tense and politeness. 食べている is often an ongoing action. 起きている describes being awake. 行っている can describe a resulting state (having gone and being away) or a habit.",
    rows: [
      ["食べる", "continuous"],
      ["食べる", "continuousPolite"],
      ["食べる", "continuousPast"],
      ["食べる", "continuousPastPolite"],
      ["食べる", "continuousNegativePolite"],
      ["行く", "continuous"],
      ["起きる", "continuous"],
    ],
    example: ["読む", "continuousPastPolite"],
    note: "食べた = ate / the eating happened. 食べていた = was eating at that time. ている is not always “is doing”; verb meaning and context determine the interpretation. Basic existence ある・いる normally do not take another ている.",
  },
  {
    id: "potential",
    title: "Potential form",
    level: "N4 study",
    text: "Group 1: e-row plus る. Group 2: stem plus られる. Irregulars: する → できる; 来る → こられる. Standard potential verbs subsequently conjugate like Group 2 verbs.",
    rows: [
      ["飲む", "potential"],
      ["読む", "potential"],
      ["食べる", "potential"],
      ["見る", "potential"],
      ["する", "potential"],
      ["来る", "potential"],
    ],
    example: ["書く", "potential"],
    note: "食べられる can be potential or passive: sentence structure supplies the meaning. Do not automatically drop ら in study answers. 見える / 聞こえる describe visibility / audibility; 見られる / 聞ける describe ability or opportunity. Some verbs do not have an ordinary potential form.",
  },
  {
    id: "patterns",
    title: "Common grammar patterns using conjugated verbs",
    level: "N5–N4 study",
    text: "A verb form is a building block. These are attached grammatical constructions, rather than additional standalone inflections. The final element carries much of the tense and politeness.",
    rows: [
      ["食べる", "request"],
      ["食べる", "after"],
      ["食べる", "try"],
      ["食べる", "experience"],
      ["食べる", "permission"],
      ["食べる", "prohibition"],
      ["食べる", "obligation"],
      ["食べる", "wantOther"],
      ["行く", "ifTo"],
      ["行く", "ifTara"],
      ["行く", "ifBa"],
    ],
    example: ["読む", "experience"],
    note: "と introduces predictable/habitual results; avoid a direct command as the result clause. たら can refer to a future condition despite its past-form base. ば has its own restrictions and is not interchangeable in every context. Person に + てほしい asks for someone else’s action.",
  },
  {
    id: "exceptions",
    title: "Exceptions and irregular verbs",
    level: "Foundation → N4+",
    text: "Store the group explicitly instead of guessing. Godan verbs ending in る still use Godan changes. する-compounds retain their noun prefix. 来 switches readings: くる → きます / きて / こない / こられる.",
    rows: [
      ["帰る", "negative"],
      ["切る", "polite"],
      ["着る", "polite"],
      ["行く", "te"],
      ["する", "potential"],
      ["勉強する", "politePast"],
      ["来る", "negative"],
      ["ある", "negative"],
      ["話す", "causativePassive"],
    ],
    example: ["来る", "politePast"],
    note: "For compounds ending in 行く, preserve its 行って / 行った sound change. Causative/passive patterns extend beyond a beginner reference; check their examples and restrictions in Advanced · N4+. Final す does not take the shortened causative-passive.",
  },
];
function veFormMarkup(v, f) {
  const p = verbParts(v, f);
  return (
    '<span class="ve-base g-verb">' +
    veRuby(p.stem, p.stemKana) +
    '</span><span class="ve-ending g-ending">' +
    veRuby(p.ending, p.endingKana) +
    "</span>"
  );
}
function veReferenceExamples(v, f) {
  if (!v.custom)
    return { verb: v, form: f, reference: false, examples: verbExamples(v, f) };
  const sample =
    EXPLORER_VERBS.find(
      (x) =>
        x.group === v.group &&
        (v.group !== 3 ||
          x.kana.endsWith("する") === v.kana.endsWith("する")) &&
        !veForms(x).find((y) => y.id === f.id).unavailable,
    ) || EXPLORER_VERBS[0];
  const form = veForms(sample).find((x) => x.id === f.id);
  return {
    verb: sample,
    form,
    reference: true,
    examples: verbExamples(sample, form),
  };
}
function veTemporalNote(v, f) {
  if (["dictionary", "polite", "negative", "politeNegative"].includes(f.id))
    return "Non-past: habits, general facts, or future events. Use the sentence context to choose the English tense.";
  if (f.id.startsWith("continuous"))
    return f.id.includes("Past")
      ? "Past ongoing action, repeated habit, or resulting state at a past reference time."
      : "Current ongoing action, repeated habit, or resulting state; the verb’s meaning matters.";
  if (
    ["past", "politePast", "pastNegative", "politePastNegative"].includes(f.id)
  )
    return "Past: an event or situation occurred (or did not occur). This alone does not express an ongoing action.";
  if (f.id.startsWith("want"))
    return f.id.includes("Past")
      ? "Past desire, not proof that the action took place."
      : "Non-past desire. たい describes wanting to act; てほしい concerns another person’s action.";
  if (f.kind === "pattern" || f.id === "te")
    return "This is a connecting form or construction. Its surrounding clause and final expression determine tense and politeness.";
  return "This form adds a grammatical meaning such as ability, condition, intention, or voice. Context determines time reference.";
}
function veGuideRender() {
  const guide = el("veGuide");
  if (guide.dataset.ready) return;
  guide.dataset.ready = "true";
  guide.innerHTML =
    '<div class="ve-practice-heading"><div><h2 id="veGuideTitle" tabindex="-1">Conjugation Guide</h2><p class="ve-note">A beginner reference with N4 extensions. Study labels are guides, not official JLPT assignments.</p></div><button type="button" class="btn small" data-ve="close-guide">Close guide</button></div><nav class="ve-guide-nav" aria-label="Conjugation guide topics">' +
    VE_GUIDE_TOPICS.map(
      (t) =>
        '<button type="button" data-ve-topic="' +
        t.id +
        '">' +
        t.title +
        "</button>",
    ).join("") +
    "</nav>" +
    VE_GUIDE_TOPICS.map((t, i) => {
      const rows = t.rows
        .map(([word, id]) => {
          const v = veById.get(word),
            f = veForms(v).find((f) => f.id === id);
          return (
            '<tr><th scope="row">' +
            esc(word) +
            "<small>" +
            esc(f.label) +
            '</small></th><td lang="ja">' +
            veFormMarkup(v, f) +
            '</td><td class="ve-romaji">' +
            esc(f.romaji) +
            "</td><td data-no-translate>" +
            esc(verbGloss(v, f)) +
            "</td></tr>"
          );
        })
        .join("");
      const v = veById.get(t.example[0]),
        f = veForms(v).find((f) => f.id === t.example[1]),
        example = verbExamples(v, f)[0];
      return (
        '<details id="veGuide-' +
        t.id +
        '" class="ve-guide-topic"' +
        (i === 0 ? " open" : "") +
        "><summary><span>" +
        t.title +
        "</span><small>" +
        t.level +
        "</small></summary><p>" +
        esc(t.text) +
        '</p><div class="ve-guide-table-wrap"><table class="ve-guide-table"><caption class="ve-sr">' +
        t.title +
        '</caption><thead><tr><th scope="col">Verb / form</th><th scope="col">Japanese</th><th class="ve-romaji" scope="col">Romaji</th><th scope="col">Meaning</th></tr></thead><tbody>' +
        rows +
        '</tbody></table></div><div class="ve-guide-example" data-no-translate><p class="ve-example-jp" lang="ja">' +
        veRuby(example.jp, example.kana) +
        '</p><p class="ve-romaji">' +
        esc(example.romaji) +
        "</p><p>" +
        esc(example.en) +
        '</p></div><p class="ve-guide-note">' +
        esc(t.note) +
        '</p><button type="button" class="btn small" data-ve-guide-form="' +
        f.id +
        '">Explore this form with your selected verb</button></details>'
      );
    }).join("");
}
