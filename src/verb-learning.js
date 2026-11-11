// Context-aware study examples. Each frame supplies its object/location and
// reading; transformations use the same engine as the table and practice.
function verbGloss(v, f) {
  const basicExist = [
    "dictionary",
    "polite",
    "politeNegative",
    "politePast",
    "politePastNegative",
    "negative",
    "past",
    "pastNegative",
  ];
  if (v.sense && basicExist.includes(f.id)) {
    const past = f.id.toLowerCase().includes("past"),
      negative = f.id.toLowerCase().includes("negative");
    return (
      (past ? "there was / were" : "there is / are") + (negative ? " not" : "")
    );
  }
  const [base, past, ing, pp] =
    v.sense === "iru" ? ["stay", "stayed", "staying", "stayed"] : v.en;
  if (f.unavailable) return f.unavailable;
  const continuous = f.id.startsWith("continuous");
  if (continuous) {
    const negative = f.id.includes("Negative"),
      isPast = f.id.includes("Past");
    return v.aspect === "result"
      ? `${isPast ? "had" : "have"} ${negative ? "not " : ""}${pp} (resulting state)`
      : v.aspect === "awake"
        ? `${isPast ? "was" : "be"} ${negative ? "not " : ""}awake`
        : `${isPast ? "was" : "be"} ${negative ? "not " : ""}${ing}`;
  }
  return (
    {
      dictionary: base + " / will " + base,
      polite: base + " / will " + base,
      politeNegative: "do not / will not " + base,
      politePast: past,
      politePastNegative: "did not " + base,
      negative: "do not / will not " + base,
      past: past,
      pastNegative: "did not " + base,
      te: "connecting form; not a tense by itself",
      want: "want to " + base,
      wantNegative: "do not want to " + base,
      wantPast: "wanted to " + base,
      wantPastNegative: "did not want to " + base,
      lets: "let’s " + base,
      volitional: "let’s / intend to " + base,
      invitation: "would you like to " + base + "?",
      request: "please " + base,
      potential: "can " + base,
      ifTo: "a predictable result after the action",
      ifTara: "if / after someone does this",
      ifBa: "if someone does this",
      after: "after doing this",
      try: "try " + ing,
      experience: "have " + pp + " before",
      permission: "may " + base,
      prohibition: "must not " + base,
      obligation: "must " + base,
      wantOther: "want someone else to " + base,
      passive: "be " + pp + " / be affected by the action",
      causative: "make / let someone " + base,
      causativePassive: "be made to " + base,
      imperative: base + "!",
    }[f.id] || f.meaning
  );
}
function verbFormation(v, f) {
  const b = verbBases(v);
  let rule = "";
  if (f.base === "stem")
    rule =
      v.group === 2
        ? "Remove final る to get the polite stem."
        : v.group === 1
          ? "Change the final u-row kana to its i-row partner to get the polite stem."
          : "Use the irregular polite stem: する → し; 来る → き. Compounds keep their noun prefix.";
  else if (["te", "ta"].includes(f.base))
    rule =
      v.jp === "行く"
        ? "行く is exceptional: 行って / 行った, not 行いて / 行いた."
        : v.group === 2
          ? "Remove final る, then add て / た."
          : v.group === 3
            ? "Use する → して / した, or 来る → きて / きた."
            : "う・つ・る → って / った; む・ぶ・ぬ → んで / んだ; く → いて / いた; ぐ → いで / いだ; す → して / した.";
  else if (f.base === "negativeStem")
    rule =
      "Start with the ない-form, remove ない, then attach the shown ending.";
  else if (f.base === "negative")
    rule =
      v.jp === "ある"
        ? "ある has the exceptional negative ない."
        : v.group === 1
          ? "Change the final kana to the a-row, then add ない. Final う becomes わない."
          : v.group === 2
            ? "Remove final る and add ない."
            : "Use する → しない, 来る → こない.";
  else if (f.base === "potential")
    rule =
      v.group === 1
        ? "Change final u-row to e-row and add る."
        : v.group === 2
          ? "Remove final る and add られる."
          : "する → できる; 来る → こられる. The reading of 来 changes.";
  else if (f.base === "passive")
    rule =
      v.group === 1
        ? "Change final u-row to a-row and add れる."
        : v.group === 2
          ? "Remove る and add られる."
          : "する → される; 来る → こられる.";
  else if (f.base === "causative")
    rule =
      v.group === 1
        ? "Change final u-row to a-row and add せる."
        : v.group === 2
          ? "Remove る and add させる."
          : "する → させる; 来る → こさせる.";
  else if (f.base === "causativePassive")
    rule =
      "Make the causative, remove its final る, then add られる. Most Group 1 verbs also allow the shorter a-row + される; verbs ending in す retain the long form.";
  else if (f.base === "conditional")
    rule =
      v.group === 1
        ? "Change final u-row to e-row and add ば."
        : v.group === 2
          ? "Remove final る and add れば."
          : "する → すれば; 来る → くれば.";
  else if (f.base === "volitional")
    rule =
      v.group === 1
        ? "Change final u-row to o-row and add う."
        : v.group === 2
          ? "Remove final る and add よう."
          : "する → しよう; 来る → こよう.";
  else if (f.base === "imperative")
    rule =
      v.group === 1
        ? "Change final u-row to e-row."
        : v.group === 2
          ? "Remove final る and add ろ."
          : "する → しろ; 来る → こい.";
  else rule = "Start with the dictionary form.";
  if (f.suffix) rule += " Attach " + f.suffix + " to that base.";
  return {
    path: [v.jp, b[f.base]?.jp, f.jp]
      .filter((x, i, a) => x && a.indexOf(x) === i)
      .join(" → "),
    rule,
  };
}
function verbExamples(v, f) {
  if (f.unavailable) return [];
  const id = f.id;
  const sentence = (jp, kana, en) => ({
    jp,
    kana,
    romaji: verbRomaji(kana.replace(/(^| )は(?= |$)/g, "$1わ"))
      .replace(verbRomaji(f.kana), f.romaji)
      .replace(/。/g, ".")
      .replace(/、/g, ", ")
      .replace(/？/g, "?"),
    en,
  });
  if (v.sense === "aru" || v.sense === "iru") {
    const basic = [
      "dictionary",
      "polite",
      "politeNegative",
      "politePast",
      "politePastNegative",
      "negative",
      "past",
      "pastNegative",
      "te",
      "ifTo",
      "ifTara",
      "ifBa",
    ];
    if (basic.includes(id))
      return v.frames.map(([p, k, en]) => {
        const negative = [
            "negative",
            "politeNegative",
            "pastNegative",
            "politePastNegative",
          ].includes(id),
          past = [
            "past",
            "politePast",
            "pastNegative",
            "politePastNegative",
          ].includes(id);
        let jp = p + f.jp,
          kana = k + f.kana,
          english = `There ${past ? (negative ? "wasn’t" : "was") : negative ? "isn’t" : "is"} ${en}.`;
        if (id === "te") {
          jp += "、助かります";
          kana += "、たすかります";
          english = `There is ${en}, which is helpful.`;
        }
        if (["ifTo", "ifTara", "ifBa"].includes(id)) {
          const tail = id === "ifTo" ? "安心です" : "教えてください";
          jp += "、" + tail;
          kana += "、" + (id === "ifTo" ? "あんしんです" : "おしえてください");
          english =
            id === "ifTo"
              ? `When there is ${en}, I feel reassured.`
              : `If there is ${en}, please let me know.`;
        }
        return sentence(jp + "。", kana + "。", english);
      });
    // Here いる means stay/be at a place, not a second continuous auxiliary.
    return [
      ["ここに", "ここに", "here"],
      ["家に", "いえに", "at home"],
    ].map(([p, k, en]) => {
      const [jp, kana, english] = verbExampleClause(v, f, p, k, en, true);
      return sentence(jp, kana, english);
    });
  }
  if (id === "passive" && v.group === 3) {
    const suru = v.kana.endsWith("する");
    if (suru && v.jp === "する")
      return [
        ["そんなことを", "そんなことを", "when someone does that to me"],
        [
          "同じことを何度も",
          "おなじことをなんども",
          "when someone does the same thing to me repeatedly",
        ],
      ].map(([p, k, en]) =>
        sentence(
          p + f.jp + "と困ります。",
          k + f.kana + "とこまります。",
          "It is a problem " + en + ".",
        ),
      );
    if (!suru)
      return [
        ["急に", "きゅうに", "without warning"],
        ["夜遅く", "よるおそく", "late at night"],
      ].map(([p, k, en]) =>
        sentence(
          "友達に" + p + f.jp + "と困ります。",
          "ともだちに" + k + f.kana + "とこまります。",
          "It would inconvenience me if a friend came " + en + ".",
        ),
      );
  }
  return v.frames.map(([p, k, en]) => {
    const [jp, kana, english] = verbExampleClause(v, f, p, k, en, false);
    return sentence(jp, kana, english);
  });
}
function verbExampleClause(v, f, p, k, object, staying) {
  const [base, past, ing, pp] = staying
    ? ["stay", "stayed", "staying", "stayed"]
    : v.en;
  const id = f.id,
    action = base + " " + object;
  let jp = p + f.jp,
    kana = k + f.kana,
    en = "I " + action + ".";
  const tail = (j, r) => {
    jp += j;
    kana += r;
  };
  if (["politeNegative", "negative"].includes(id))
    en = "I don’t " + action + ".";
  if (["politePast", "past"].includes(id))
    en = "I " + past + " " + object + ".";
  if (["politePastNegative", "pastNegative"].includes(id))
    en = "I didn’t " + action + ".";
  if (id.startsWith("continuous")) {
    const neg = id.includes("Negative"),
      was = id.includes("Past");
    en =
      v.aspect === "result"
        ? `I ${was ? "had" : "have"} ${neg ? "not " : ""}${pp} ${object}.`
        : v.aspect === "awake"
          ? `I ${was ? "was" : "am"} ${neg ? "not " : ""}awake ${object}.`
          : `I ${was ? "was" : "am"} ${neg ? "not " : ""}${ing} ${object}.`;
  }
  if (id === "te") {
    tail("、よかったです", "、よかったです");
    en = "I’m glad I " + past + " " + object + ".";
  }
  if (id === "want") en = "I want to " + action + ".";
  if (id === "wantNegative") en = "I don’t want to " + action + ".";
  if (id === "wantPast") en = "I wanted to " + action + ".";
  if (id === "wantPastNegative") en = "I didn’t want to " + action + ".";
  if (id === "lets" || id === "volitional") en = "Let’s " + action + ".";
  if (id === "invitation") {
    tail("？", "？");
    en = "Would you like to " + action + "?";
  }
  if (id === "request") en = "Please " + action + ".";
  if (id === "potential") {
    en = "I can " + action + ".";
    if (v.jp === "する") {
      jp = jp.replace(/を(?=できる)/, "が");
      kana = k.replace(/を\s*$/, "が ") + f.kana;
    }
  }
  if (id === "ifTo") {
    const learn = ["読む", "書く", "見る", "聞く", "話す", "勉強する"].includes(
      v.jp,
    );
    const relax = ["食べる", "飲む", "泳ぐ", "遊ぶ", "寝る"].includes(v.jp);
    const j = learn
      ? "勉強になります"
      : relax
        ? "元気になります"
        : "安心します";
    const r = learn
      ? "べんきょうになります"
      : relax
        ? "げんきになります"
        : "あんしんします";
    tail("、" + j, "、" + r);
    en =
      "When I " +
      action +
      ", " +
      (learn
        ? "I learn something."
        : relax
          ? "I feel refreshed."
          : "I feel reassured.");
  }
  if (id === "ifTara") {
    tail("、教えてください", "、おしえて ください");
    en = "When you " + action + ", please let me know.";
  }
  if (id === "ifBa") {
    jp = "いつ" + jp;
    kana = "いつ " + kana;
    tail("いいですか", " いい です か");
    en = "When should I " + action + "?";
  }
  if (id === "after") {
    tail("、話しましょう", "、はなしましょう");
    en = "Let’s talk after we " + action + ".";
  }
  if (id === "try") en = "I will try " + ing + " " + object + ".";
  if (id === "experience") en = "I have " + pp + " " + object + " before.";
  if (id === "permission") en = "You may " + action + ".";
  if (id === "prohibition") en = "You must not " + action + ".";
  if (id === "obligation") en = "I must " + action + ".";
  if (id === "wantOther") {
    jp = "友達に" + jp;
    kana = "ともだち に " + kana;
    en = "I want my friend to " + action + ".";
  }
  if (id === "imperative") en = action[0].toUpperCase() + action.slice(1) + "!";
  if (id === "passive") {
    // Direct passives are offered only for explicitly curated transitive senses.
    jp = p.replace(/を$/, "は") + "よく" + f.jp;
    kana = k.replace(/を\s*$/, "は ") + "よく " + f.kana;
    const plurals = {
      "a photo": "Photos",
      "a video": "Videos",
      "a book": "Books",
      "a newspaper": "Newspapers",
      "a name": "Names",
      "a computer": "Computers",
      "a dictionary": "Dictionaries",
      "a coat": "Coats",
      "a shirt": "Shirts",
      kanji: "Kanji",
      vegetables: "Vegetables",
    };
    const subject = plurals[object] || object;
    en =
      subject[0].toUpperCase() +
      subject.slice(1) +
      " " +
      (!!plurals[object] ? "are" : "is") +
      " often " +
      pp +
      ".";
  }
  if (id === "causative") {
    const marker = p.endsWith("を") ? "に" : "を";
    jp = "弟" + marker + jp;
    kana = "おとうと " + marker + " " + kana;
    en = "I make or let my younger brother " + action + ".";
  }
  if (id === "causativePassive") {
    jp = "先生に" + jp;
    kana = "せんせい に " + kana;
    en = "I am made to " + action + " by my teacher.";
  }
  return [
    jp + (jp.endsWith("？") ? "" : "。"),
    kana + (kana.endsWith("？") ? "" : "。"),
    en,
  ];
}
