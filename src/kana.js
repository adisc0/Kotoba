// Original picture-word chart. Each row contains a sound and two vocabulary cues.
const KANA_CUES = [
  [
    "a",
    "あ",
    "ア",
    "あめ",
    "ame",
    "rain",
    "☔",
    "アイス",
    "aisu",
    "ice cream",
    "🍨",
  ],
  ["i", "い", "イ", "いぬ", "inu", "dog", "🐶", "インク", "inku", "ink", "🖋️"],
  [
    "u",
    "う",
    "ウ",
    "うさぎ",
    "usagi",
    "rabbit",
    "🐰",
    "ウール",
    "uuru",
    "wool",
    "🧶",
  ],
  [
    "e",
    "え",
    "エ",
    "えんぴつ",
    "enpitsu",
    "pencil",
    "✏️",
    "エレベーター",
    "erebeetaa",
    "elevator",
    "🛗",
  ],
  [
    "o",
    "お",
    "オ",
    "おにぎり",
    "onigiri",
    "rice ball",
    "🍙",
    "オレンジ",
    "orenji",
    "orange",
    "🍊",
  ],
  [
    "ka",
    "か",
    "カ",
    "かさ",
    "kasa",
    "umbrella",
    "☂️",
    "カメラ",
    "kamera",
    "camera",
    "📷",
  ],
  ["ki", "き", "キ", "き", "ki", "tree", "🌳", "キー", "kii", "key", "🔑"],
  [
    "ku",
    "く",
    "ク",
    "くるま",
    "kuruma",
    "car",
    "🚗",
    "クッキー",
    "kukkii",
    "cookie",
    "🍪",
  ],
  [
    "ke",
    "け",
    "ケ",
    "けむし",
    "kemushi",
    "caterpillar",
    "🐛",
    "ケーキ",
    "keeki",
    "cake",
    "🍰",
  ],
  [
    "ko",
    "こ",
    "コ",
    "こめ",
    "kome",
    "rice grains",
    "🌾",
    "コーヒー",
    "koohii",
    "coffee",
    "☕",
  ],
  [
    "sa",
    "さ",
    "サ",
    "さかな",
    "sakana",
    "fish",
    "🐟",
    "サンドイッチ",
    "sandoitchi",
    "sandwich",
    "🥪",
  ],
  [
    "shi",
    "し",
    "シ",
    "しか",
    "shika",
    "deer",
    "🦌",
    "シール",
    "shiiru",
    "sticker",
    "🏷️",
  ],
  [
    "su",
    "す",
    "ス",
    "すし",
    "sushi",
    "sushi",
    "🍣",
    "スイカ",
    "suika",
    "watermelon",
    "🍉",
  ],
  [
    "se",
    "せ",
    "セ",
    "せんす",
    "sensu",
    "folding fan",
    "🪭",
    "セーター",
    "seetaa",
    "sweater",
    "🧥",
  ],
  [
    "so",
    "そ",
    "ソ",
    "そら",
    "sora",
    "sky",
    "🌤️",
    "ソファ",
    "sofa",
    "sofa",
    "🛋️",
  ],
  [
    "ta",
    "た",
    "タ",
    "たまご",
    "tamago",
    "egg",
    "🥚",
    "タクシー",
    "takushii",
    "taxi",
    "🚕",
  ],
  [
    "chi",
    "ち",
    "チ",
    "ちょう",
    "chou",
    "butterfly",
    "🦋",
    "チーズ",
    "chiizu",
    "cheese",
    "🧀",
  ],
  [
    "tsu",
    "つ",
    "ツ",
    "つき",
    "tsuki",
    "moon",
    "🌙",
    "ツナ",
    "tsuna",
    "tuna",
    "🐟",
  ],
  [
    "te",
    "て",
    "テ",
    "て",
    "te",
    "hand",
    "✋",
    "テレビ",
    "terebi",
    "television",
    "📺",
  ],
  [
    "to",
    "と",
    "ト",
    "とり",
    "tori",
    "bird",
    "🐦",
    "トマト",
    "tomato",
    "tomato",
    "🍅",
  ],
  [
    "na",
    "な",
    "ナ",
    "なす",
    "nasu",
    "eggplant",
    "🍆",
    "ナイフ",
    "naifu",
    "knife",
    "🔪",
  ],
  [
    "ni",
    "に",
    "ニ",
    "にんじん",
    "ninjin",
    "carrot",
    "🥕",
    "ニット",
    "nitto",
    "knitwear",
    "🧶",
  ],
  [
    "nu",
    "ぬ",
    "ヌ",
    "ぬの",
    "nuno",
    "cloth",
    "🧵",
    "ヌードル",
    "nuudoru",
    "noodles",
    "🍜",
  ],
  [
    "ne",
    "ね",
    "ネ",
    "ねこ",
    "neko",
    "cat",
    "🐱",
    "ネクタイ",
    "nekutai",
    "necktie",
    "👔",
  ],
  [
    "no",
    "の",
    "ノ",
    "のり",
    "nori",
    "seaweed",
    "🍙",
    "ノート",
    "nooto",
    "notebook",
    "📓",
  ],
  [
    "ha",
    "は",
    "ハ",
    "はな",
    "hana",
    "flower",
    "🌸",
    "ハンバーガー",
    "hanbaagaa",
    "hamburger",
    "🍔",
  ],
  [
    "hi",
    "ひ",
    "ヒ",
    "ひ",
    "hi",
    "fire",
    "🔥",
    "ヒーター",
    "hiitaa",
    "heater",
    "♨️",
  ],
  [
    "fu",
    "ふ",
    "フ",
    "ふね",
    "fune",
    "boat",
    "⛵",
    "フルーツ",
    "furuutsu",
    "fruit",
    "🍇",
  ],
  [
    "he",
    "へ",
    "ヘ",
    "へび",
    "hebi",
    "snake",
    "🐍",
    "ヘリコプター",
    "herikoputaa",
    "helicopter",
    "🚁",
  ],
  [
    "ho",
    "ほ",
    "ホ",
    "ほし",
    "hoshi",
    "star",
    "⭐",
    "ホテル",
    "hoteru",
    "hotel",
    "🏨",
  ],
  [
    "ma",
    "ま",
    "マ",
    "まめ",
    "mame",
    "beans",
    "🫘",
    "マイク",
    "maiku",
    "microphone",
    "🎤",
  ],
  [
    "mi",
    "み",
    "ミ",
    "みみ",
    "mimi",
    "ear",
    "👂",
    "ミルク",
    "miruku",
    "milk",
    "🥛",
  ],
  [
    "mu",
    "む",
    "ム",
    "むし",
    "mushi",
    "insect",
    "🐞",
    "ムーン",
    "muun",
    "moon (loanword)",
    "🌙",
  ],
  ["me", "め", "メ", "め", "me", "eye", "👁️", "メロン", "meron", "melon", "🍈"],
  [
    "mo",
    "も",
    "モ",
    "もも",
    "momo",
    "peach",
    "🍑",
    "モーター",
    "mootaa",
    "motor",
    "⚙️",
  ],
  [
    "ya",
    "や",
    "ヤ",
    "やま",
    "yama",
    "mountain",
    "⛰️",
    "ヤシ",
    "yashi",
    "palm tree",
    "🌴",
  ],
  [
    "yu",
    "ゆ",
    "ユ",
    "ゆき",
    "yuki",
    "snow",
    "❄️",
    "ユニコーン",
    "yunikoon",
    "unicorn",
    "🦄",
  ],
  [
    "yo",
    "よ",
    "ヨ",
    "よる",
    "yoru",
    "night",
    "🌃",
    "ヨット",
    "yotto",
    "yacht",
    "⛵",
  ],
  [
    "ra",
    "ら",
    "ラ",
    "らくだ",
    "rakuda",
    "camel",
    "🐪",
    "ラーメン",
    "raamen",
    "ramen",
    "🍜",
  ],
  [
    "ri",
    "り",
    "リ",
    "りんご",
    "ringo",
    "apple",
    "🍎",
    "リボン",
    "ribon",
    "ribbon",
    "🎀",
  ],
  [
    "ru",
    "る",
    "ル",
    "るす",
    "rusu",
    "away from home",
    "🏠",
    "ルビー",
    "rubii",
    "ruby",
    "💎",
  ],
  [
    "re",
    "れ",
    "レ",
    "れいぞうこ",
    "reizouko",
    "refrigerator",
    "🧊",
    "レモン",
    "remon",
    "lemon",
    "🍋",
  ],
  [
    "ro",
    "ろ",
    "ロ",
    "ろうそく",
    "rousoku",
    "candle",
    "🕯️",
    "ロボット",
    "robotto",
    "robot",
    "🤖",
  ],
  [
    "wa",
    "わ",
    "ワ",
    "わに",
    "wani",
    "crocodile",
    "🐊",
    "ワイン",
    "wain",
    "wine",
    "🍷",
  ],
  [
    "wo",
    "を",
    "ヲ",
    "ごはんをたべる",
    "gohan o taberu",
    "eat rice · を marks the object",
    "🍚",
    "ヲ",
    "o / wo",
    "rare in modern katakana; usually を",
    "🍚",
  ],
  [
    "n",
    "ん",
    "ン",
    "ほん",
    "hon",
    "book · ん is the final sound",
    "📖",
    "パン",
    "pan",
    "bread · ン is the final sound",
    "🍞",
  ],
];
const KANA_VOICED_ROWS = [
  [
    ["ga", "が", "か"],
    ["gi", "ぎ", "き"],
    ["gu", "ぐ", "く"],
    ["ge", "げ", "け"],
    ["go", "ご", "こ"],
  ],
  [
    ["za", "ざ", "さ"],
    ["ji", "じ", "し"],
    ["zu", "ず", "す"],
    ["ze", "ぜ", "せ"],
    ["zo", "ぞ", "そ"],
  ],
  [
    ["da", "だ", "た"],
    ["ji", "ぢ", "ち"],
    ["zu", "づ", "つ"],
    ["de", "で", "て"],
    ["do", "ど", "と"],
  ],
  [
    ["ba", "ば", "は"],
    ["bi", "び", "ひ"],
    ["bu", "ぶ", "ふ"],
    ["be", "べ", "へ"],
    ["bo", "ぼ", "ほ"],
  ],
  [
    ["pa", "ぱ", "は"],
    ["pi", "ぴ", "ひ"],
    ["pu", "ぷ", "ふ"],
    ["pe", "ぺ", "へ"],
    ["po", "ぽ", "ほ"],
  ],
];
const KANA_COMBINATION_BASES = [
  ["ky", "き"],
  ["sh", "し"],
  ["ch", "ち"],
  ["ny", "に"],
  ["hy", "ひ"],
  ["my", "み"],
  ["ry", "り"],
  ["gy", "ぎ"],
  ["j", "じ"],
  ["by", "び"],
  ["py", "ぴ"],
];
const toKatakana = (text) =>
  [...text]
    .map((c) =>
      c >= "ぁ" && c <= "ゖ" ? String.fromCharCode(c.charCodeAt(0) + 96) : c,
    )
    .join("");
let kanaSet = "basic";
try {
  const saved = localStorage.getItem("kotoba-kana-set");
  if (["basic", "voiced", "combinations"].includes(saved)) kanaSet = saved;
} catch {}
function extraKanaRows() {
  if (kanaSet === "voiced")
    return KANA_VOICED_ROWS.map((row) =>
      row.map(([sound, h, base]) => ({
        sound,
        h,
        base,
        mark: sound[0] === "p" ? "゜" : "゛",
      })),
    );
  return KANA_COMBINATION_BASES.map(([prefix, base]) =>
    ["ゃ", "ゅ", "ょ"].map((mark, i) => ({
      sound: prefix + ["a", "u", "o"][i],
      h: base + mark,
      base,
      mark,
    })),
  );
}
function renderExtraKana(hira, title) {
  const combos = kanaSet === "combinations",
    rows = extraKanaRows(),
    columns = combos ? 3 : 5;
  const label = combos ? "Combination sounds" : "Voiced & P sounds";
  const explanation = combos
    ? "Small ゃ・ゅ・ょ blend with an i-row kana into one beat: き + ゅ → きゅ (kyu)."
    : "Two marks ゛ voice the consonant; the small circle ゜ changes the H row to P.";
  const head =
    '<div class="kana-section-heading"><h2>' +
    title +
    " · " +
    label +
    '</h2><p class="kana-extra-explanation">' +
    esc(
      hira
        ? explanation
        : explanation
            .replace(/き/g, "キ")
            .replace(/ゅ/g, "ュ")
            .replace(/ゃ/g, "ャ")
            .replace(/ょ/g, "ョ"),
    ) +
    "</p></div>";
  const cells = rows
    .map((row, r) =>
      row
        .map((cue, c) => {
          const character = hira ? cue.h : toKatakana(cue.h),
            base = hira ? cue.base : toKatakana(cue.base),
            mark = hira ? cue.mark : toKatakana(cue.mark);
          const plain = cue.base
              .normalize("NFD")
              .replace(/[\u3099\u309a]/g, ""),
            original = KANA_CUES.find((x) => x[1] === plain);
          const group = original ? kanaGroup(original[0]) : "vowels";
          if (kanaView === "compact")
            return (
              '<button type="button" class="kana-compact-cell" data-kana-group="' +
              group +
              '" style="--kana-column:' +
              (c + 1) +
              ";--kana-row:" +
              (r + 1) +
              '" data-kana-listen="' +
              cue.h +
              '" aria-label="Listen to ' +
              character +
              " (" +
              cue.sound +
              ')"><span lang="ja">' +
              character +
              "</span><span>" +
              cue.sound +
              "</span></button>"
            );
          return (
            '<article class="kana-cell" data-kana-group="' +
            group +
            '"><button type="button" class="kana-sound" data-kana-listen="' +
            cue.h +
            '" aria-label="Listen to ' +
            character +
            " (" +
            cue.sound +
            ')"><span lang="ja">' +
            character +
            '</span><span class="kana-romaji">' +
            cue.sound +
            '</span><span class="kana-listen-label">Listen ♫</span></button><span class="kana-picture" role="img" aria-label="Picture cue for the base kana ' +
            base +
            '">' +
            (original ? original[hira ? 6 : 10] : "✨") +
            '</span><div class="kana-formation" lang="ja">' +
            base +
            " <span>+</span> " +
            mark +
            '</div><p class="kana-cue-meaning">' +
            (combos
              ? "Blend into one beat"
              : "Add " +
                (cue.mark === "゜" ? "the small circle" : "the two marks")) +
            "</p></article>"
          );
        })
        .join(""),
    )
    .join("");
  const headers = combos ? ["ya", "yu", "yo"] : ["a", "i", "u", "e", "o"];
  return (
    head +
    '<div class="kana-extra-chart" style="--kana-extra-columns:' +
    columns +
    '">' +
    (kanaView === "compact"
      ? '<div class="kana-compact-vowels">' +
        headers.map((x) => "<span>" + x + "</span>").join("") +
        '</div><div class="kana-compact-chart">' +
        cells +
        "</div>"
      : '<div class="kana-chart">' + cells + "</div>") +
    "</div>" +
    (combos
      ? '<p class="kana-set-note">Keep the second character small: ' +
        (hira
          ? "きゅ (kyu) is one beat; きゆ (ki-yu) is two."
          : "キュ (kyu) is one beat; キユ (ki-yu) is two.") +
        "</p>"
      : '<p class="kana-set-note">' +
        (hira
          ? "じ / ぢ both sound like ji; ず / づ both sound like zu."
          : "ジ / ヂ both sound like ji; ズ / ヅ both sound like zu.") +
        " The spelling depends on the word.</p>")
  );
}
let kanaScript = "hiragana";
let kanaView = "compact";
try {
  if (localStorage.getItem("kotoba-kana-view") === "pictures")
    kanaView = "pictures";
} catch {}
function kanaGroup(sound) {
  if (["a", "i", "u", "e", "o"].includes(sound)) return "vowels";
  if (sound === "n") return "n-final";
  if (["chi", "tsu"].includes(sound)) return "t";
  if (sound === "fu") return "h";
  return sound[0];
}
function compactKanaChart(hira) {
  const rows = [
    ["a", "i", "u", "e", "o"],
    ["ka", "ki", "ku", "ke", "ko"],
    ["sa", "shi", "su", "se", "so"],
    ["ta", "chi", "tsu", "te", "to"],
    ["na", "ni", "nu", "ne", "no"],
    ["ha", "hi", "fu", "he", "ho"],
    ["ma", "mi", "mu", "me", "mo"],
    ["ya", null, "yu", null, "yo"],
    ["ra", "ri", "ru", "re", "ro"],
    ["wa", null, null, null, "wo"],
    ["n", null, null, null, null],
  ];
  return (
    '<div class="kana-compact-guide">Read each row left to right ↓</div><div class="kana-compact-vowels" aria-hidden="true"><span>a</span><span>i</span><span>u</span><span>e</span><span>o</span></div><div class="kana-compact-chart" aria-label="All 46 basic characters, in vowel order a i u e o">' +
    rows
      .map((row, r) =>
        row
          .map((sound, c) => {
            if (!sound) return "";
            const cue = KANA_CUES.find((x) => x[0] === sound),
              character = cue[hira ? 1 : 2];
            return (
              '<button type="button" class="kana-compact-cell" data-kana-group="' +
              kanaGroup(sound) +
              '" style="--kana-column:' +
              (c + 1) +
              ";--kana-row:" +
              (r + 1) +
              ";--kana-wide-column:" +
              (c + 1 + (r >= 6 ? 5 : 0)) +
              ";--kana-wide-row:" +
              (r >= 6 ? r - 5 : r + 1) +
              '" data-kana-listen="' +
              esc(sound === "wo" ? "お" : cue[1]) +
              '" aria-label="Listen to ' +
              esc(character) +
              " (" +
              esc(sound) +
              ')"><span lang="ja">' +
              esc(character) +
              "</span><span>" +
              esc(sound === "wo" ? "wo / o" : sound) +
              "</span></button>"
            );
          })
          .join(""),
      )
      .join("") +
    "</div>"
  );
}
function renderKana() {
  const hira = kanaScript === "hiragana",
    title = hira ? "Hiragana" : "Katakana";
  document.querySelectorAll("[data-kana-script]").forEach((b) => {
    const active = b.dataset.kanaScript === kanaScript;
    b.setAttribute("aria-selected", String(active));
    b.tabIndex = active ? 0 : -1;
  });
  el("kanaPanel").setAttribute(
    "aria-labelledby",
    hira ? "hiraganaTab" : "katakanaTab",
  );
  el("kanaPage").classList.toggle("kana-compact-view", kanaView === "compact");
  document
    .querySelectorAll("[data-kana-view]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.kanaView === kanaView)),
    );
  document
    .querySelectorAll("[data-kana-set]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.kanaSet === kanaSet)),
    );
  if (kanaSet !== "basic") {
    el("kanaPanel").innerHTML = renderExtraKana(hira, title);
    return;
  }
  if (kanaView === "compact") {
    el("kanaPanel").innerHTML =
      '<div class="kana-section-heading"><h2>' +
      title +
      " · At a glance</h2><p>All 46 basic characters. Tap any character to hear it; switch to Picture cards for memory cues.</p></div>" +
      compactKanaChart(hira);
    return;
  }
  el("kanaPanel").innerHTML =
    '<div class="kana-section-heading"><h2>' +
    title +
    ' · 46 basic characters</h2><p>Say the sound, then use the picture word to help it stick. Pictures are word cues, not stroke-order diagrams.</p></div><div class="kana-chart-scroll"><div class="kana-vowels" aria-hidden="true"><span>a</span><span>i</span><span>u</span><span>e</span><span>o</span></div><div class="kana-chart">' +
    KANA_CUES.map((row, index) => {
      const [sound, h, k] = row,
        offset = hira ? 3 : 7,
        [word, romaji, meaning, picture] = row.slice(offset, offset + 4);
      const position =
        index === 35
          ? 1
          : index === 36
            ? 3
            : index === 37
              ? 5
              : index === 43
                ? 1
                : index === 44
                  ? 5
                  : index === 45
                    ? 1
                    : null;
      const style = position ? ' style="grid-column:' + position + '"' : "";
      const note =
        sound === "wo"
          ? "Usually pronounced “o” as the object particle."
          : sound === "n"
            ? "A separate nasal sound; it does not start ordinary words."
            : hira && sound === "ha"
              ? "As a topic particle, は is pronounced “wa”."
              : hira && sound === "he"
                ? "As a direction particle, へ is pronounced “e”."
                : "";
      return (
        '<article class="kana-cell" data-kana-group="' +
        kanaGroup(sound) +
        '"' +
        style +
        '><button type="button" class="kana-sound" data-kana-listen="' +
        esc(sound === "wo" ? "お" : h) +
        '" aria-label="Listen to ' +
        esc(hira ? h : k) +
        " (" +
        esc(sound) +
        ')"><span lang="ja">' +
        esc(hira ? h : k) +
        '</span><span class="kana-romaji">' +
        esc(sound) +
        '</span><span class="kana-listen-label">Listen ♫</span></button><span class="kana-picture" role="img" aria-label="' +
        esc(meaning) +
        '">' +
        picture +
        '</span><div class="kana-cue-word" lang="ja">' +
        esc(word) +
        '</div><div class="kana-cue-romaji">' +
        esc(romaji) +
        '</div><div class="kana-cue-meaning">' +
        esc(meaning) +
        "</div>" +
        (note
          ? '<details class="kana-note"><summary>Reading tip</summary><p>' +
            esc(note) +
            "</p></details>"
          : "") +
        "</article>"
      );
    }).join("") +
    '</div></div><details class="kana-extra"><summary>Next: sound marks & small kana</summary><p>Two small marks change sounds: ' +
    (hira
      ? "か → が (ka → ga), は → ば (ha → ba), は → ぱ (ha → pa)."
      : "カ → ガ (ka → ga), ハ → バ (ha → ba), ハ → パ (ha → pa).") +
    "</p><p>Small " +
    (hira ? "ゃ・ゅ・ょ" : "ャ・ュ・ョ") +
    " combine with an i-row character: " +
    (hira ? "きゃ・きゅ・きょ" : "キャ・キュ・キョ") +
    " (kya, kyu, kyo).</p><p>Small " +
    (hira ? "っ" : "ッ") +
    " doubles the next consonant: " +
    (hira ? "きって (kitte, stamp)." : "クッキー (kukkii, cookie).") +
    "</p><p>" +
    (hira
      ? "A long vowel takes an extra beat: おかあさん (okaasan, mother)."
      : "ー holds the preceding vowel for another beat: コーヒー (koohii, coffee).") +
    "</p></details>";
}
el("kanaTabs").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-kana-script]");
  if (tab) {
    kanaScript = tab.dataset.kanaScript;
    renderKana();
  }
});
el("kanaTabs").addEventListener("keydown", (e) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  e.preventDefault();
  kanaScript =
    e.key === "Home"
      ? "hiragana"
      : e.key === "End"
        ? "katakana"
        : kanaScript === "hiragana"
          ? "katakana"
          : "hiragana";
  renderKana();
  document.querySelector('[data-kana-script="' + kanaScript + '"]').focus();
});
el("kanaPanel").addEventListener("click", (e) => {
  const b = e.target.closest("[data-kana-listen]");
  if (b) speak({ word: b.dataset.kanaListen, reading: b.dataset.kanaListen });
});
el("kanaViewToggle").addEventListener("click", (e) => {
  const b = e.target.closest("[data-kana-view]");
  if (!b || !["compact", "pictures"].includes(b.dataset.kanaView)) return;
  kanaView = b.dataset.kanaView;
  try {
    localStorage.setItem("kotoba-kana-view", kanaView);
  } catch {}
  renderKana();
});
el("kanaSetToggle").addEventListener("click", (e) => {
  const b = e.target.closest("[data-kana-set]");
  if (!b || !["basic", "voiced", "combinations"].includes(b.dataset.kanaSet))
    return;
  kanaSet = b.dataset.kanaSet;
  try {
    localStorage.setItem("kotoba-kana-set", kanaSet);
  } catch {}
  renderKana();
});
renderKana();
