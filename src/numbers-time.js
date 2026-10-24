const NUMBER_DIGITS = [
  "零",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
];
const NUMBER_KANA = [
  "れい",
  "いち",
  "に",
  "さん",
  "よん",
  "ご",
  "ろく",
  "なな",
  "はち",
  "きゅう",
];
const NUMBER_ROMAJI = [
  "rei",
  "ichi",
  "ni",
  "san",
  "yon",
  "go",
  "roku",
  "nana",
  "hachi",
  "kyuu",
];
function japaneseNumber(n) {
  if (n === 0) return { jp: "零", kana: "れい", romaji: "rei" };
  let jp = "",
    kana = "",
    roman = [];
  for (const [unit, kanji, reading, romaji, exceptions] of [
    [
      1000,
      "千",
      "せん",
      "sen",
      { 3: ["さんぜん", "sanzen"], 8: ["はっせん", "hassen"] },
    ],
    [
      100,
      "百",
      "ひゃく",
      "hyaku",
      {
        3: ["さんびゃく", "sanbyaku"],
        6: ["ろっぴゃく", "roppyaku"],
        8: ["はっぴゃく", "happyaku"],
      },
    ],
    [10, "十", "じゅう", "juu", {}],
  ]) {
    const count = Math.floor(n / unit);
    n %= unit;
    if (!count) continue;
    jp += (count === 1 ? "" : NUMBER_DIGITS[count]) + kanji;
    const special = exceptions[count];
    kana += special
      ? special[0]
      : (count === 1 ? "" : NUMBER_KANA[count]) + reading;
    roman.push(
      special ? special[1] : (count === 1 ? "" : NUMBER_ROMAJI[count]) + romaji,
    );
  }
  if (n) {
    jp += NUMBER_DIGITS[n];
    kana += NUMBER_KANA[n];
    roman.push(NUMBER_ROMAJI[n]);
  }
  return { jp, kana, romaji: roman.join(" ") };
}
const HOUR_KANA = [
  "れいじ",
  "いちじ",
  "にじ",
  "さんじ",
  "よじ",
  "ごじ",
  "ろくじ",
  "しちじ",
  "はちじ",
  "くじ",
  "じゅうじ",
  "じゅういちじ",
  "じゅうにじ",
];
const HOUR_ROMAJI = [
  "reiji",
  "ichiji",
  "niji",
  "sanji",
  "yoji",
  "goji",
  "rokuji",
  "shichiji",
  "hachiji",
  "kuji",
  "juuji",
  "juuichiji",
  "juuniji",
];
function japaneseMinutes(m) {
  const ones = [
    "",
    "いっぷん",
    "にふん",
    "さんぷん",
    "よんぷん",
    "ごふん",
    "ろっぷん",
    "ななふん",
    "はっぷん",
    "きゅうふん",
  ];
  const roman = [
    "",
    "ippun",
    "nifun",
    "sanpun",
    "yonpun",
    "gofun",
    "roppun",
    "nanafun",
    "happun",
    "kyuufun",
  ];
  if (m === 0) return { jp: "", kana: "", romaji: "" };
  const tens = Math.floor(m / 10),
    last = m % 10;
  const prefix =
    tens === 0
      ? ""
      : (tens === 1 ? "" : NUMBER_KANA[tens]) +
        (last === 0 ? "じゅっぷん" : "じゅう");
  const rp =
    tens === 0
      ? ""
      : (tens === 1 ? "" : NUMBER_ROMAJI[tens]) +
        (last === 0 ? "juppun" : "juu");
  return {
    jp: japaneseNumber(m).jp + "分",
    kana: prefix + ones[last],
    romaji: rp + roman[last],
  };
}
let clockHour = 9,
  clockMinute = 0,
  clockDragHand = "minute";
function clockPhrase(h, m) {
  const hour = h === 0 ? 0 : h % 12 || 12,
    period = h < 12 ? "午前" : "午後",
    pk = h < 12 ? "ごぜん" : "ごご",
    pr = h < 12 ? "gozen" : "gogo",
    minutes =
      m === 30 ? { jp: "半", kana: "はん", romaji: "han" } : japaneseMinutes(m);
  return {
    jp: period + japaneseNumber(hour).jp + "時" + minutes.jp + "です。",
    kana:
      pk + " " + HOUR_KANA[hour] + (m ? " " + minutes.kana : "") + " です。",
    romaji:
      pr + " " + HOUR_ROMAJI[hour] + (m ? " " + minutes.romaji : "") + " desu.",
    half: "",
    digital: String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"),
  };
}
function updateClock() {
  const p = clockPhrase(clockHour, clockMinute);
  el("timeDigital").textContent = p.digital;
  el("timeJapanese").textContent = p.jp;
  el("timeKana").textContent = p.kana;
  el("timeRomaji").textContent = p.romaji;
  el("timeHalf").textContent = p.half ? "You can also say " + p.half : "";
  el("timeHalf").classList.toggle("hidden", !p.half);
  el("hourControl").value = clockHour;
  el("minuteControl").value = clockMinute;
  el("clockHourHand").setAttribute(
    "transform",
    "rotate(" + ((clockHour % 12) * 30 + clockMinute * 0.5) + " 150 150)",
  );
  el("clockMinuteHand").setAttribute(
    "transform",
    "rotate(" + clockMinute * 6 + " 150 150)",
  );
  el("learningClock").setAttribute(
    "aria-label",
    "Interactive clock set to " +
      p.digital +
      ". Use the hour and minute selectors to set a time.",
  );
}
function renderNumber(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > 9999) {
    el("numberResult").textContent = "Choose a whole number from 0 to 9,999.";
    return;
  }
  const p = japaneseNumber(n);
  el("numberResult").innerHTML =
    '<strong lang="ja">' +
    p.jp +
    '</strong><span lang="ja">' +
    p.kana +
    "</span><span>" +
    p.romaji +
    "</span>";
  el("numberListen").dataset.reading = p.kana;
}
el("hourControl").innerHTML = Array.from(
  { length: 24 },
  (_, h) =>
    '<option value="' + h + '">' + String(h).padStart(2, "0") + "</option>",
).join("");
el("minuteControl").innerHTML = Array.from(
  { length: 60 },
  (_, m) =>
    '<option value="' + m + '">' + String(m).padStart(2, "0") + "</option>",
).join("");
// Build the analog clock face once; hands are updated without replacing controls.
el("clockFaceMarks").innerHTML =
  Array.from(
    { length: 60 },
    (_, i) =>
      '<line x1="150" y1="' +
      (i % 5 === 0 ? 23 : 27) +
      '" x2="150" y2="' +
      (i % 5 === 0 ? 34 : 31) +
      '" transform="rotate(' +
      i * 6 +
      ' 150 150)" class="' +
      (i % 5 === 0 ? "clock-major-tick" : "clock-minor-tick") +
      '"/>',
  ).join("") +
  Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1,
      a = (hour * Math.PI) / 6;
    return (
      '<text x="' +
      (150 + 100 * Math.sin(a)) +
      '" y="' +
      (150 - 100 * Math.cos(a)) +
      '" text-anchor="middle" dominant-baseline="central">' +
      hour +
      "</text>"
    );
  }).join("");
el("numberChart").innerHTML = [
  ...Array.from({ length: 11 }, (_, i) => i),
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
  300,
  600,
  800,
  1000,
  3000,
  8000,
]
  .map((n) => {
    const p = japaneseNumber(n);
    return (
      '<button type="button" class="number-tile" data-number="' +
      n +
      '"><span>' +
      n.toLocaleString("en-US") +
      '</span><strong lang="ja">' +
      p.jp +
      '</strong><span lang="ja">' +
      p.kana +
      "</span><small>" +
      p.romaji +
      "</small></button>"
    );
  })
  .join("");
el("numberChart").addEventListener("click", (e) => {
  const b = e.target.closest("[data-number]");
  if (b) {
    el("numberInput").value = b.dataset.number;
    renderNumber(b.dataset.number);
    speak({ word: japaneseNumber(Number(b.dataset.number)).kana, reading: "" });
  }
});
el("numberInput").addEventListener("input", (e) =>
  renderNumber(e.target.value),
);
el("numberListen").addEventListener("click", () => {
  const n = Number(el("numberInput").value);
  if (Number.isInteger(n) && n >= 0 && n <= 9999)
    speak({ word: japaneseNumber(n).kana, reading: "" });
});
el("numbersTimeTabs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-number-tab]");
  if (!b) return;
  const time = b.dataset.numberTab === "time";
  el("timeStudyPanel").classList.toggle("hidden", !time);
  el("numberStudyPanel").classList.toggle("hidden", time);
  document
    .querySelectorAll("[data-number-tab]")
    .forEach((t) => t.setAttribute("aria-pressed", String(t === b)));
});
el("hourControl").addEventListener("change", (e) => {
  clockHour = Number(e.target.value);
  updateClock();
});
el("minuteControl").addEventListener("change", (e) => {
  clockMinute = Number(e.target.value);
  updateClock();
});
el("timeListen").addEventListener("click", () => {
  const p = clockPhrase(clockHour, clockMinute);
  speak({ word: p.kana.replace(/ /g, ""), reading: "" });
});
el("randomTime").addEventListener("click", () => {
  clockHour = Math.floor(Math.random() * 24);
  clockMinute = Math.floor(Math.random() * 12) * 5;
  updateClock();
});
el("clockHandMode").addEventListener("change", (e) => {
  if (["hour", "minute"].includes(e.target.value))
    clockDragHand = e.target.value;
});
let clockPointer = null;
function setClockFromPointer(e) {
  const rect = el("learningClock").getBoundingClientRect(),
    angle =
      ((Math.atan2(
        e.clientX - rect.left - rect.width / 2,
        -(e.clientY - rect.top - rect.height / 2),
      ) *
        180) /
        Math.PI +
        360) %
      360;
  if (clockDragHand === "hour") {
    const hour = Math.round(angle / 30) % 12;
    const previous = clockHour % 12;
    const delta = ((hour - previous + 18) % 12) - 6;
    clockHour = (clockHour + delta + 24) % 24;
  } else {
    const minute = Math.round(angle / 6) % 60;
    if (clockMinute >= 45 && minute <= 15) clockHour = (clockHour + 1) % 24;
    else if (clockMinute <= 15 && minute >= 45)
      clockHour = (clockHour + 23) % 24;
    clockMinute = minute;
  }
  updateClock();
}
el("learningClock").addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  const hand = e.target.closest("[data-clock-hand]");
  if (hand) {
    clockDragHand = hand.dataset.clockHand;
    el("clockHandMode").value = clockDragHand;
  }
  clockPointer = e.pointerId;
  e.currentTarget.setPointerCapture(e.pointerId);
  setClockFromPointer(e);
});
el("learningClock").addEventListener("pointermove", (e) => {
  if (clockPointer === e.pointerId) setClockFromPointer(e);
});
for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
  el("learningClock").addEventListener(name, () => {
    clockPointer = null;
  });
renderNumber(1);
updateClock();
