// Pure conjugation rules. Dictionary groups are explicit; never infer Group 2
// merely from る. Sources and linguistic scope are documented in VERB-EXPLORER.md.
const VKANA = Object.fromEntries(
  [
    ["あいうえお", "a i u e o"],
    ["かきくけこ", "ka ki ku ke ko"],
    ["がぎぐげご", "ga gi gu ge go"],
    ["さしすせそ", "sa shi su se so"],
    ["ざじずぜぞ", "za ji zu ze zo"],
    ["たちつてと", "ta chi tsu te to"],
    ["だぢづでど", "da ji zu de do"],
    ["なにぬねの", "na ni nu ne no"],
    ["はひふへほ", "ha hi fu he ho"],
    ["ばびぶべぼ", "ba bi bu be bo"],
    ["ぱぴぷぺぽ", "pa pi pu pe po"],
    ["まみむめも", "ma mi mu me mo"],
    ["やゆよ", "ya yu yo"],
    ["らりるれろ", "ra ri ru re ro"],
    ["わをん", "wa o n"],
  ].flatMap(([chars, readings]) =>
    [...chars].map((char, i) => [char, readings.split(" ")[i]]),
  ),
);
function verbRomaji(kana) {
  const chars = [...kana.normalize("NFKC")].map((c) =>
    c >= "ァ" && c <= "ヶ" ? String.fromCharCode(c.charCodeAt(0) - 96) : c,
  );
  let out = "";
  const syllable = (i) => {
    let r = VKANA[chars[i]] || chars[i];
    if ("ゃゅょ".includes(chars[i + 1] || " ") && /i$/.test(r)) {
      const vowel = { ゃ: "a", ゅ: "u", ょ: "o" }[chars[i + 1]];
      r =
        ({ shi: "sh", chi: "ch", ji: "j" }[r] || r.slice(0, -1) + "y") + vowel;
      return [r, 2];
    }
    return [r, 1];
  };
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "っ") {
      const next = syllable(i + 1)[0];
      out += next.startsWith("ch") ? "t" : next[0];
      continue;
    }
    if (chars[i] === "ー") {
      out += out.match(/[aeiou](?=[^aeiou]*$)/)?.[0] || "";
      continue;
    }
    const [r, n] = syllable(i);
    out +=
      chars[i] === "ん" && /^[aeiouy]/.test(syllable(i + 1)[0] || "")
        ? "n'"
        : r;
    i += n - 1;
  }
  return out;
}
const VENDINGS = {
  う: ["わ", "い", "え", "お", "って", "った"],
  く: ["か", "き", "け", "こ", "いて", "いた"],
  ぐ: ["が", "ぎ", "げ", "ご", "いで", "いだ"],
  す: ["さ", "し", "せ", "そ", "して", "した"],
  つ: ["た", "ち", "て", "と", "って", "った"],
  ぬ: ["な", "に", "ね", "の", "んで", "んだ"],
  ぶ: ["ば", "び", "べ", "ぼ", "んで", "んだ"],
  む: ["ま", "み", "め", "も", "んで", "んだ"],
  る: ["ら", "り", "れ", "ろ", "って", "った"],
};
function verbBases(v) {
  const pair = (jp, kana) => ({ jp, kana });
  const root = pair(v.jp.slice(0, -1), v.kana.slice(0, -1));
  const add = (base, jp, kana = jp) => pair(base.jp + jp, base.kana + kana);
  const dict = pair(v.jp, v.kana);
  let stem,
    a,
    e,
    o,
    te,
    ta,
    negative,
    potential,
    passive,
    causative,
    volitional,
    imperative,
    conditional;
  if (v.group === 3) {
    const suru = v.kana.endsWith("する");
    const prefix = pair(v.jp.slice(0, -2), v.kana.slice(0, -2));
    const form = (jp, kana = jp) =>
      add(prefix, !suru && !v.jp.endsWith("来る") ? kana : jp, kana);
    stem = suru ? form("し") : form("来", "き");
    te = suru ? form("して") : form("来て", "きて");
    ta = suru ? form("した") : form("来た", "きた");
    negative = suru ? form("しない") : form("来ない", "こない");
    potential = suru ? form("できる") : form("来られる", "こられる");
    passive = suru ? form("される") : form("来られる", "こられる");
    causative = suru ? form("させる") : form("来させる", "こさせる");
    volitional = suru ? form("しよう") : form("来よう", "こよう");
    imperative = suru ? form("しろ") : form("来い", "こい");
    conditional = suru ? form("すれば") : form("来れば", "くれば");
  } else if (v.group === 2) {
    stem = root;
    te = add(root, "て");
    ta = add(root, "た");
    negative = add(root, "ない");
    potential = passive = add(root, "られる");
    causative = add(root, "させる");
    volitional = add(root, "よう");
    imperative = add(root, "ろ");
    conditional = add(root, "れば");
  } else {
    const row = VENDINGS[v.kana.slice(-1)];
    if (!row) throw Error("Unsupported dictionary ending: " + v.jp);
    a = add(root, row[0]);
    stem = add(root, row[1]);
    e = add(root, row[2]);
    o = add(root, row[3]);
    const iku = v.jp.endsWith("行く") || v.jp === "いく" || v.ikuException;
    te = add(root, iku ? "って" : row[4]);
    ta = add(root, iku ? "った" : row[5]);
    negative =
      v.jp === "ある" || v.sense === "aru"
        ? pair("ない", "ない")
        : add(a, "ない");
    potential = add(e, "る");
    passive = add(a, "れる");
    causative = add(a, "せる");
    volitional = add(o, "う");
    imperative = e;
    conditional = add(e, "ば");
  }
  const cut = (p, n) => pair(p.jp.slice(0, -n), p.kana.slice(0, -n));
  const causativePassive = add(cut(causative, 1), "られる");
  const shortCausativePassive =
    v.group === 1 && v.kana.slice(-1) !== "す" ? add(a, "される") : null;
  return {
    dict,
    stem,
    te,
    ta,
    negative,
    potential,
    passive,
    causative,
    volitional,
    imperative,
    conditional,
    causativePassive,
    shortCausativePassive,
    add,
    cut,
  };
}
// [id, label, base, suffix, kind, register, explanation, caution]
const VERB_FORM_SPECS = [
  [
    "dictionary",
    "Dictionary",
    "dict",
    "",
    "form",
    "plain",
    "The plain non-past form: habits, general facts, or future actions.",
    "Plain does not mean past. Use ます when a polite setting calls for it.",
  ],
  [
    "polite",
    "Polite non-past",
    "stem",
    "ます",
    "form",
    "polite",
    "A polite habit, general fact, or future action.",
    "Japanese non-past can refer to now generally or the future; it is not automatically continuous.",
  ],
  [
    "politeNegative",
    "Polite negative",
    "stem",
    "ません",
    "form",
    "polite",
    "A polite negative habit or future action.",
    "Do not attach ません to the dictionary form.",
  ],
  [
    "politePast",
    "Polite past",
    "stem",
    "ました",
    "form",
    "polite",
    "A completed event or past situation, expressed politely.",
    "A past event is different from an action or state that was ongoing: compare ていました.",
  ],
  [
    "politePastNegative",
    "Polite past negative",
    "stem",
    "ませんでした",
    "form",
    "polite",
    "Politely says that an event did not happen.",
    "ませんでした is negative past; ました is positive past.",
  ],
  [
    "negative",
    "Casual negative",
    "negative",
    "",
    "form",
    "plain",
    "The plain negative non-past form.",
    "ある is exceptional: its plain negative is ない, not あらない.",
  ],
  [
    "past",
    "Casual past",
    "ta",
    "",
    "form",
    "plain",
    "A completed past event or a past situation.",
    "た does not by itself mean “was doing.” Compare ていた for an ongoing action or resulting state in the past.",
  ],
  [
    "pastNegative",
    "Casual past negative",
    "negativeStem",
    "なかった",
    "form",
    "plain",
    "The plain negative past: did not do something.",
    "Replace the final ない with なかった; do not add it after the whole negative form.",
  ],
  [
    "te",
    "て-form",
    "te",
    "",
    "form",
    "neutral",
    "A connecting form, used with other clauses or grammatical patterns.",
    "It is not a past tense and is not a complete polite request on its own.",
  ],
  [
    "continuousPolite",
    "Polite continuous / state",
    "te",
    "います",
    "pattern",
    "polite",
    "An ongoing action, a repeated habit, or a resulting state, depending on the verb.",
    "食べている can mean “is eating”; 行っている can mean “has gone and is away.”",
  ],
  [
    "continuous",
    "Casual continuous / state",
    "te",
    "いる",
    "pattern",
    "plain",
    "An ongoing action, repeated habit, or resulting state in plain style.",
    "いる is an auxiliary here. Location/existence ある and いる normally do not take another ている.",
  ],
  [
    "continuousPastPolite",
    "Polite past continuous / state",
    "te",
    "いました",
    "pattern",
    "polite",
    "An action or state that was continuing at a past reference time.",
    "ている describes a current action/state; ていました places that action/state in the past.",
  ],
  [
    "continuousPast",
    "Casual past continuous / state",
    "te",
    "いた",
    "pattern",
    "plain",
    "A past ongoing action or resulting state, in plain style.",
    "食べた says the eating happened; 食べていた describes what was in progress at that time.",
  ],
  [
    "want",
    "Want to",
    "stem",
    "たい",
    "pattern",
    "plain",
    "The speaker wants to do the action. たい behaves like an い-adjective.",
    "Use たかった for a past desire. てほしい is a wish for someone else to act.",
  ],
  [
    "wantNegative",
    "Do not want to",
    "stem",
    "たくない",
    "pattern",
    "plain",
    "The speaker does not want to do the action.",
    "たい changes like an い-adjective: たい → たくない.",
  ],
  [
    "lets",
    "Let’s — polite",
    "stem",
    "ましょう",
    "form",
    "polite",
    "A polite proposal to do something together.",
    "ましょう suggests doing it; ませんか asks for the listener’s willingness more gently.",
  ],
  [
    "invitation",
    "Invitation",
    "stem",
    "ませんか",
    "pattern",
    "polite",
    "A gentle invitation: would you like to do this?",
    "With か this negative-shaped form can be an invitation, not a statement that you will not act.",
  ],
  [
    "request",
    "Please do",
    "te",
    "ください",
    "pattern",
    "polite",
    "A direct polite request for the listener to act.",
    "てください is a request, whereas the imperative can be blunt or forceful.",
  ],
  [
    "continuousNegativePolite",
    "Polite continuous negative",
    "te",
    "いません",
    "pattern",
    "polite",
    "The action/state is not continuing, or has not happened in a relevant context.",
    "The meaning depends on whether this verb describes an action, habit, or resulting state.",
  ],
  [
    "continuousNegative",
    "Casual continuous negative",
    "te",
    "いない",
    "pattern",
    "plain",
    "The plain negative of ている.",
    "Standard written Japanese retains い; contracted てない is not the practice target here.",
  ],
  [
    "continuousPastNegativePolite",
    "Polite past continuous negative",
    "te",
    "いませんでした",
    "pattern",
    "polite",
    "The action/state was not continuing at that past time.",
    "This differs from simply saying that an event did not happen.",
  ],
  [
    "continuousPastNegative",
    "Casual past continuous negative",
    "te",
    "いなかった",
    "pattern",
    "plain",
    "The plain negative of a past ongoing action/state.",
    "Compare しなかった (did not do) and していなかった (was not doing / had not done).",
  ],
  [
    "volitional",
    "Let’s / intention — casual",
    "volitional",
    "",
    "form",
    "plain",
    "A casual suggestion or an expression of the speaker’s intention.",
    "よう / おう is not the same as a wish in たい.",
  ],
  [
    "potential",
    "Potential",
    "potential",
    "",
    "form",
    "plain",
    "The ability or possibility of performing an action.",
    "The standard Group 2 form retains ら: 食べられる. This can look identical to the passive; context matters.",
  ],
  [
    "ifTo",
    "When / if — と",
    "dict",
    "と",
    "pattern",
    "neutral",
    "Introduces a predictable result, habitual consequence, or automatic sequence.",
    "Normally do not use a request, command, or the speaker’s intention as the direct result clause.",
  ],
  [
    "ifTara",
    "If / when — たら",
    "ta",
    "ら",
    "pattern",
    "neutral",
    "A condition or sequence after an event has happened.",
    "Despite its た base, たら can describe a future condition.",
  ],
  [
    "ifBa",
    "If — ば",
    "conditional",
    "",
    "form",
    "plain",
    "A conditional form. It can also occur in ばいいですか to ask what one should do.",
    "ば, たら, and と overlap, but their restrictions and emphasis differ.",
  ],
  [
    "after",
    "After doing",
    "te",
    "から",
    "pattern",
    "neutral",
    "The following action takes place after this action.",
    "This から marks sequence after a て-form, not a reason after a whole sentence.",
  ],
  [
    "try",
    "Try doing",
    "te",
    "みる",
    "pattern",
    "plain",
    "Try an action to see what it is like or what happens.",
    "This is not the same construction as ようとする (attempt to do).",
  ],
  [
    "experience",
    "Have done before",
    "ta",
    "ことがある",
    "pattern",
    "plain",
    "Experience of having done something at least once.",
    "Use the た-form, not the dictionary form, before ことがある.",
  ],
  [
    "permission",
    "May do",
    "te",
    "もいい",
    "pattern",
    "plain",
    "Permission: doing the action is allowed.",
    "Add ですか for a polite permission question.",
  ],
  [
    "prohibition",
    "Must not do",
    "te",
    "はいけない",
    "pattern",
    "plain",
    "The action is prohibited or not acceptable.",
    "This means “must not,” not “do not have to.”",
  ],
  [
    "obligation",
    "Must do",
    "negativeStem",
    "なければならない",
    "pattern",
    "plain",
    "The action is necessary: must / have to do it.",
    "The negative-looking condition produces a positive obligation. It is not a prohibition.",
  ],
  [
    "wantOther",
    "Want someone to do",
    "te",
    "ほしい",
    "pattern",
    "plain",
    "The speaker wants another person to do something.",
    "Mark the person with に. Compare 私が食べたい (I want to eat) and 友達に食べてほしい (I want my friend to eat).",
  ],
  [
    "wantPast",
    "Wanted to",
    "stem",
    "たかった",
    "pattern",
    "plain",
    "The speaker had a desire to do the action in the past.",
    "食べたかった means wanted to eat, not necessarily that the speaker actually ate.",
  ],
  [
    "wantPastNegative",
    "Did not want to",
    "stem",
    "たくなかった",
    "pattern",
    "plain",
    "The speaker did not have the desire to do the action in the past.",
    "This describes desire, not whether the event actually occurred.",
  ],
  [
    "passive",
    "Passive",
    "passive",
    "",
    "form",
    "plain",
    "A subject receives an action, or is affected by someone else’s action.",
    "Do not simply keep an active sentence’s particles. Intransitive verbs may need an indirect/adversative passive.",
  ],
  [
    "causative",
    "Causative",
    "causative",
    "",
    "form",
    "plain",
    "Make or let another person do an action; context determines force or permission.",
    "This form alone does not tell you whether the person was forced or allowed to act.",
  ],
  [
    "causativePassive",
    "Causative-passive",
    "causativePassive",
    "",
    "form",
    "plain",
    "Be made to do something, often against one’s wishes.",
    "Build causative first, then passive. Many Group 1 verbs also have a shorter form.",
  ],
  [
    "imperative",
    "Imperative",
    "imperative",
    "",
    "form",
    "plain",
    "A direct command. Appropriate in limited contexts, including urgent directions.",
    "Often too forceful for everyday polite requests. Prefer てください when appropriate.",
  ],
];
function verbConjugations(v) {
  const b = verbBases(v);
  b.negativeStem = b.cut(b.negative, 2);
  return VERB_FORM_SPECS.map((spec, index) => {
    const [id, label, base, suffix, kind, register, meaning, caution] = spec;
    let value = b.add(b[base], suffix),
      variants = [];
    if (id === "causativePassive" && b.shortCausativePassive) {
      variants = [value];
      value = b.shortCausativePassive;
    }
    const essentials = index < 18;
    const isContinuous = id.startsWith("continuous");
    let unavailable = "";
    if (
      v.custom &&
      v.usage !== "action" &&
      ![
        "dictionary",
        "polite",
        "politeNegative",
        "politePast",
        "politePastNegative",
        "negative",
        "past",
        "pastNegative",
        "te",
        "ifBa",
        "ifTo",
        "ifTara",
      ].includes(id)
    )
      unavailable =
        "Confirm that this is a volitional action before using this construction. Its lexical usage has not been reviewed.";
    if (
      v.custom &&
      ["わかる", "できる", "みえる", "きこえる"].includes(v.kana) &&
      id === "potential"
    )
      unavailable =
        "This verb already expresses understanding, ability, visibility, or audibility. Do not mechanically make another potential form.";
    if (
      v.sense === "aru" &&
      ![
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
      ].includes(id)
    )
      unavailable =
        "Not offered for the inanimate-existence sense of ある. Use a context-specific expression instead.";
    if (
      v.sense === "iru" &&
      (isContinuous ||
        ["passive", "causative", "causativePassive"].includes(id))
    )
      unavailable =
        "Not offered for the basic animate-existence sense. いる already describes presence; other senses need a specific context.";
    if (
      id === "passive" &&
      !v.passive &&
      !v.custom &&
      !["する", "来る"].includes(v.jp) &&
      !v.sense
    )
      unavailable =
        "This sense has no curated basic direct-passive examples here. Use a context-specific passive construction; an intransitive verb may require an indirect passive.";
    const auxRomaji =
      {
        はいけない: "wa ikenai",
        もいい: "mo ii",
        みる: "miru",
        ことがある: "koto ga aru",
      }[suffix] || verbRomaji(suffix);
    const romaji =
      base === "te" && suffix
        ? verbRomaji(b.te.kana) + " " + auxRomaji
        : suffix === "ことがある"
          ? verbRomaji(b.ta.kana) + " koto ga aru"
          : verbRomaji(value.kana);
    return {
      id,
      label,
      jp: unavailable ? "" : value.jp,
      kana: unavailable ? "" : value.kana,
      romaji: unavailable ? "" : romaji,
      kind,
      register,
      meaning,
      caution,
      base,
      suffix,
      variants: unavailable
        ? []
        : variants.map((p) => ({ ...p, romaji: verbRomaji(p.kana) })),
      tier: index >= 36 ? "advanced" : essentials ? "essentials" : "all",
      unavailable,
    };
  });
}

function verbResolveGroup(jp, kana) {
  if (
    jp === "する" ||
    (/[一-龯々ァ-ヶー]+する$/.test(jp) && kana.endsWith("する"))
  )
    return 3;
  if (
    jp === "来る" ||
    jp === "くる" ||
    (jp.endsWith("来る") && kana.endsWith("くる"))
  )
    return 3;
  // Raw こする is Godan, unlike noun + する; raw まくる is not 来る.
  if (kana.endsWith("る")) return 0;
  return VENDINGS[kana.slice(-1)] ? 1 : 0;
}
function verbNewEntry(input) {
  const jp = String(input.jp || "")
    .normalize("NFKC")
    .trim();
  const kana = String(input.kana || "")
    .normalize("NFKC")
    .trim()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 96));
  const group = Number(input.group),
    meaning = String(input.meaning || "").trim();
  if (!jp || jp.length > 40 || !/^[一-龯々ぁ-ゖァ-ヶー]+$/.test(jp))
    return {
      error: "Enter a Japanese dictionary form, without spaces or punctuation.",
    };
  if (!kana || kana.length > 70 || !/^[ぁ-ゖー]+$/.test(kana))
    return { error: "Enter the complete reading in hiragana." };
  if (meaning.length > 120)
    return { error: "Keep the optional meaning under 120 characters." };
  if (![1, 2, 3].includes(group))
    return {
      error:
        "Select the verb group. A final る alone cannot determine the group.",
    };
  const jpEnd = jp
    .slice(-1)
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 96));
  if (group === 1 && jpEnd !== kana.slice(-1))
    return {
      error: "The dictionary form and reading must have the same final kana.",
    };
  if (group === 1 && !VENDINGS[kana.slice(-1)])
    return {
      error:
        "A Group 1 dictionary form must end in う, く, ぐ, す, つ, ぬ, ぶ, む, or る.",
    };
  if (group === 2 && (!jp.endsWith("る") || !kana.endsWith("る")))
    return { error: "A Group 2 dictionary form must end in る." };
  if (
    group === 3 &&
    !(jp.endsWith("する") && kana.endsWith("する")) &&
    !((jp.endsWith("来る") || jp.endsWith("くる")) && kana.endsWith("くる"))
  )
    return { error: "Group 3 is for する, 来る, and their compounds." };
  if (
    [
      "愛する",
      "くださる",
      "なさる",
      "いらっしゃる",
      "おっしゃる",
      "ござる",
      "問う",
      "乞う",
      "請う",
    ].includes(jp) ||
    jp.endsWith("である") ||
    (jp === "得る" && kana === "うる")
  )
    return {
      error:
        "This verb has a lexical or honorific exception that needs a reviewed entry. It will not be guessed by the standard rules.",
    };
  const inferred = verbResolveGroup(jp, kana);
  if (inferred && inferred !== group)
    return {
      error:
        "The selected group conflicts with the supplied dictionary ending.",
    };
  return {
    verb: {
      id: "custom:" + jp + ":" + kana,
      jp,
      kana,
      group,
      custom: true,
      usage: ["action", "state"].includes(input.usage)
        ? input.usage
        : "unknown",
      en: [meaning || "Meaning not provided", "", "", ""],
      frames: [],
      ...(["有る", "在る"].includes(jp) && kana === "ある"
        ? { sense: "aru" }
        : {}),
    },
  };
}

function verbParts(v, f) {
  if (f.unavailable)
    return { stem: "", ending: "", stemKana: "", endingKana: "" };
  let ending = f.suffix;
  if (!ending)
    ending =
      {
        dictionary:
          v.group === 3 && v.kana.endsWith("する") ? "する" : v.jp.slice(-1),
        negative: "ない",
        pastNegative: "なかった",
        te: f.jp.slice(-1),
        past: f.jp.slice(-1),
        potential:
          v.group === 1 ? "る" : v.kana.endsWith("する") ? "できる" : "られる",
        passive:
          v.group === 1
            ? "れる"
            : v.kana.endsWith("する")
              ? "される"
              : "られる",
        causative: v.group === 1 ? "せる" : "させる",
        causativePassive:
          v.group === 1
            ? f.jp.endsWith("される")
              ? "される"
              : "せられる"
            : "させられる",
        imperative:
          v.group === 1
            ? ""
            : v.group === 2
              ? "ろ"
              : v.kana.endsWith("する")
                ? "ろ"
                : "い",
        volitional: v.group === 1 ? "う" : "よう",
        ifBa: "ば",
      }[f.id] || "";
  if (!ending || !f.jp.endsWith(ending))
    return { stem: f.jp, stemKana: f.kana, ending: "", endingKana: "" };
  return {
    stem: f.jp.slice(0, -ending.length),
    stemKana: f.kana.slice(0, -ending.length),
    ending,
    endingKana: f.kana.slice(-ending.length),
  };
}
