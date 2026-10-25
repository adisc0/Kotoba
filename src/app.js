"use strict";
const CATEGORIES = [
    "Verbs",
    "Nouns",
    "Adjectives",
    "Adverbs",
    "Questions & pronouns",
    "Particles & grammar",
    "Connectors",
    "Expressions",
    "Numbers",
  ],
  STORE_KEY = "kotoba_display_v1",
  ART_SHAPES = {
    cat: '<path fill="#edbcaa" d="M20 34 22 17 35 26 Q40 24 45 26 L59 17 61 34 Q67 42 61 55 Q52 68 40 67 Q22 67 18 53 Q14 42 20 34Z"/><path fill="#fce9dc" d="M29 51 Q40 57 51 51 Q49 62 40 62 Q31 62 29 51Z" stroke="none"/><path d="M29 42v2m22-2v2"/><path d="M36 51 Q40 54 44 51 M40 50v4 M24 51l-8-2m9 7-8 3m38-8 8-2m-8 7 8 3" stroke-width="2.2"/><path fill="#e58e86" stroke="none" d="M25 48a3 2 0 1 0 6 0a3 2 0 1 0-6 0m24 0a3 2 0 1 0 6 0a3 2 0 1 0-6 0"/>',
    ramen:
      '<path d="M18 41 Q19 67 40 68 Q61 67 62 41Z" fill="#f3b18e"/><path d="M17 41 Q40 47 63 41" fill="none"/><path d="M20 41 Q40 35 60 41" fill="#ffecc1"/><path d="M26 38 Q23 25 31 18M40 36 Q36 28 43 20M54 36 Q50 28 56 20" fill="none" stroke="#c69879"/><circle cx="29" cy="48" r="5" fill="#fff6e7"/><path d="m27 46 4 4m0-4-4 4" stroke="#e4b067"/><path d="M36 55q4 5 8 0m-12-6v2m16-2v2"/><path d="M21 28h36" stroke="#92a977" stroke-width="5"/>',
    rice: '<path d="M16 41 Q18 67 40 68 Q62 67 64 41Z" fill="#b4cfc0"/><path d="M20 40Q17 24 29 24Q35 12 44 24Q57 18 60 38Z" fill="#fffdf5"/><path d="M22 41h36M33 53v2m14-2v2m-11 6q4 3 8 0" fill="none"/>',
    coffee:
      '<path d="M19 31h38v22Q56 64 38 64Q19 64 19 53Z" fill="#f9d9be"/><path d="M57 34h5q11 2 2 14-3 4-8 3" fill="none" stroke-width="4"/><path d="M27 21q-5-6 2-11m11 11q-5-6 2-11m10 11q-5-6 2-11" fill="none" stroke="#bba391"/><path d="M29 45v2m17-2v2m-14 5q7 7 12 0"/><path d="M16 65h46"/>',
    banana:
      '<path d="M18 23Q10 53 32 64Q55 71 67 42Q48 53 36 46Q26 41 25 22Z" fill="#f1cf68"/><path d="M22 22l3-4m-4 42q7 6 13 6" fill="none"/><path d="M38 50v2m11 0v2m-12 4q6 5 10-1"/><ellipse cx="34" cy="55" rx="4" ry="2.5" fill="#f2a69b" stroke="none"/>',
    egg: '<path d="M40 15C24 15 20 44 23 54q4 14 17 14t17-14c3-10-1-39-17-39Z" fill="#ffefc5"/><circle cx="40" cy="47" r="12" fill="#f4c76a"/><path d="M35 45v2m10-2v2m-8 5q3 4 6 0"/>',
    water:
      '<path d="M40 11Q30 29 23 41Q12 67 40 69Q68 67 57 41Z" fill="#b4dbdf"/><path d="M32 45v3m16-3v3m-13 7q5 4 10 0M27 40q2-7 7-14" stroke="#4b777e" fill="none"/>',
    bread:
      '<path d="M21 31Q16 14 32 16Q40 11 48 16Q64 15 60 31V63H21Z" fill="#ecc49b"/><path d="M27 36Q24 23 34 24Q40 19 46 24Q55 21 54 35V58H27Z" fill="#fff3d5"/><path d="M35 43v2m11-2v2m-11 8q6 4 11 0"/>',
    meat: '<path d="M20 47Q18 20 40 18Q62 19 63 44Q60 64 41 66Q23 65 20 47Z" fill="#e9ad9d"/><path d="M30 34q15-10 21 5T34 54" fill="none" stroke="#fff1dc" stroke-width="5"/><path d="M31 46v2m18-2v2m-12 6q4 4 8 0"/>',
    chicken:
      '<path d="M22 24Q34 12 49 23Q64 34 55 51Q45 67 28 57Q14 47 22 24Z" fill="#efba87"/><path d="M50 51l10 11" stroke="#f8edd7" stroke-width="8"/><circle cx="62" cy="64" r="7" fill="#fff8e9"/><path d="M30 40v2m16-2v2m-11 8q4 3 8 0"/>',
    drink:
      '<path d="M25 26h30l-3 39H29Z" fill="#b4dad1"/><path d="M40 26 50 12l7 0" fill="none"/><path d="M30 34h20M33 46v2m14-2v2m-12 7q4 4 8 0"/>',
    gift: '<rect x="20" y="34" width="40" height="31" rx="5" fill="#f0b4aa"/><path d="M16 27h48v12H16z" fill="#f8d7bd"/><path d="M38 27Q17 26 24 16Q30 10 40 27Q48 9 57 16Q64 28 42 27" fill="#fff4e2"/><path d="M40 27v38" stroke="#d27a77" stroke-width="5"/><path d="M29 49v2m23-2v2m-20 6q8 5 15 0" stroke="#916b5f"/>',
    heart:
      '<path d="M40 67 18 45Q5 31 20 20Q31 13 40 25Q49 13 60 20Q76 31 62 45Z" fill="#f1a7a4"/><path d="M32 42v2m16-2v2m-13 8q5 4 10 0"/>',
    flower:
      '<circle cx="40" cy="27" r="12" fill="#f2b8ba"/><circle cx="53" cy="38" r="12" fill="#f2b8ba"/><circle cx="49" cy="54" r="12" fill="#f2b8ba"/><circle cx="31" cy="54" r="12" fill="#f2b8ba"/><circle cx="27" cy="38" r="12" fill="#f2b8ba"/><circle cx="40" cy="41" r="12" fill="#f2d17f"/><path d="M36 41v1m8-1v1m-7 4q3 3 6 0"/>',
    sun: '<circle cx="40" cy="40" r="20" fill="#f3d58d"/><path d="M40 7v8m0 50v8M7 40h8m50 0h8M17 17l6 6m34 34 6 6m0-46-6 6M23 57l-6 6" fill="none" stroke="#dcac68" stroke-width="3"/><path d="M32 37v3m16-3v3m-12 8q5 5 9 0"/>',
    cloud:
      '<path d="M24 58Q12 59 13 44Q12 33 26 32Q27 18 41 18Q56 18 58 33Q72 35 67 50Q64 58 56 58Z" fill="#c9d9df"/><path d="M31 41v2m17-2v2m-14 7q6 5 11 0"/>',
    rain: '<path d="M24 47Q12 48 14 35Q14 26 25 25Q28 12 41 14Q55 15 57 27Q68 28 66 40Q65 47 54 47Z" fill="#c6d8e4"/><path d="m23 55-4 9m22-9-4 9m22-9-4 9" stroke="#88b5cd" stroke-width="4" fill="none"/><path d="M32 33v2m16-2v2m-13 6q5 4 10 0"/>',
    wind: '<path d="M12 27h37q13 0 10-11t-15-2M12 40h54q10 1 8 11t-14 2M12 52h27q12 0 10 11t-13 1" fill="none" stroke="#9ebcbd" stroke-width="5"/>',
    snow: '<path d="M40 10v60M14 25l52 30M14 55l52-30M31 18l9 9 9-9m-18 44 9-9 9 9" fill="none" stroke="#9ecbd4" stroke-width="4"/>',
    moon: '<path d="M49 13Q22 21 27 47Q29 65 50 66Q32 77 18 59Q6 42 20 24Q31 10 49 13Z" fill="#e6c99e"/><circle cx="54" cy="35" r="4" fill="#f2cc83" stroke="none"/><path d="m60 49 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" fill="#f5dfae"/>',
    clock:
      '<circle cx="40" cy="40" r="29" fill="#e6e3c9"/><circle cx="40" cy="40" r="24" fill="#fffaf0"/><path d="M40 21v20l11 8" stroke-width="4" fill="none"/><path d="M31 54q9 5 18 0" fill="none" stroke="#b8aa95"/>',
    calendar:
      '<rect x="18" y="21" width="44" height="45" rx="7" fill="#f0c7b2"/><path d="M18 34h44M29 14v13m22-13v13" stroke-width="4"/><rect x="26" y="41" width="13" height="13" rx="3" fill="#fffaeb"/><path d="m29 47 3 3 5-6" fill="none" stroke="#92ad94"/>',
    music:
      '<path d="M34 22v36a9 7 0 1 1-7-7h7V23l27-7v32a9 7 0 1 1-7-7h7V16Z" fill="#d2bddf"/><path d="M34 33 61 26" fill="none" stroke="#ab95bb" stroke-width="3"/>',
    movie:
      '<rect x="15" y="24" width="50" height="39" rx="5" fill="#bfd5ca"/><path d="M15 32h50M22 24l8 8m7-8 8 8m8-8 8 8" fill="none"/><path d="m34 39 15 9-15 9Z" fill="#f9edcf"/>',
    ball: '<circle cx="40" cy="40" r="28" fill="#fbf9e9"/><path d="m40 27-11 8 5 13h13l5-13Z" fill="#b9c8b7"/><path d="M29 35 17 30m35 5 11-5M34 48l-6 18m19-18 6 18M40 27V12" fill="none"/>',
    game: '<path d="M24 30Q14 31 10 53Q8 64 18 65Q23 65 33 55h14q10 10 15 10Q72 64 70 53Q66 31 56 30Z" fill="#b3cadc"/><path d="M26 39v16m-8-8h16" stroke-width="4"/><circle cx="52" cy="43" r="3" fill="#edb2ab"/><circle cx="60" cy="51" r="3" fill="#e5cb83"/>',
    camera:
      '<rect x="13" y="26" width="54" height="37" rx="8" fill="#dfd3c3"/><path d="M23 26l5-8h18l6 8" fill="#d7c0aa"/><circle cx="40" cy="45" r="14" fill="#f8f5eb"/><circle cx="40" cy="45" r="8" fill="#a7c6c0"/><circle cx="58" cy="33" r="2" fill="#dca89f"/>',
    book: '<path d="M11 22Q27 16 40 24Q53 16 69 22V63Q52 58 40 66Q26 58 11 63Z" fill="#c7d9c4"/><path d="M40 24v42M18 32q9-3 16 0m-16 8q9-3 16 0m12-8q9-3 16 0m-16 8q9-3 16 0" fill="none" stroke="#91b2a1" stroke-width="2"/><path d="M31 51h5m8 0h5"/>',
    pen: '<path d="m20 57 32-39q4-5 10 0t0 9L29 66l-14 3Z" fill="#e5c3d1"/><path d="m20 57 9 9m20-45 13 11" fill="none"/><circle cx="52" cy="48" r="3" fill="#f6d28f" stroke="none"/>',
    speech:
      '<path d="M12 20Q40 8 68 20V53Q52 65 38 60L22 69V56Q11 54 12 42Z" fill="#b7d5cc"/><path d="M26 38v2m14-2v2m14-2v2" stroke-width="4"/>',
    ear: '<path d="M50 58Q50 68 40 69Q27 68 28 55Q28 49 20 44Q9 35 16 22Q21 10 37 11Q59 13 61 32Q60 48 48 49" fill="#f3c1af"/><path d="M30 41Q20 27 30 22Q42 16 49 28Q53 38 43 42Q34 46 38 55" fill="none"/>',
    eye: '<path d="M10 42Q40 10 70 42Q40 72 10 42Z" fill="#f8f5e9"/><circle cx="40" cy="42" r="16" fill="#adcab7"/><circle cx="40" cy="42" r="8" fill="#6e8a7c"/><circle cx="44" cy="37" r="4" fill="#fffdf7" stroke="none"/>',
    shoe: '<path d="M15 45q14 5 25-16l11 11q4 11 17 12v12H14Q9 54 15 45Z" fill="#a9cac3"/><path d="M35 38l9 7m-13 0 9 7M18 57h48" fill="none" stroke="#f7f2e3" stroke-width="3"/>',
    gym: '<rect x="17" y="25" width="10" height="30" rx="3" fill="#b5cfc0"/><rect x="53" y="25" width="10" height="30" rx="3" fill="#b5cfc0"/><path d="M9 33h8v14H9zm54 0h8v14h-8z" fill="#92b6b1"/><path d="M27 40h26" stroke-width="6"/>',
    home: '<path d="m11 38 29-24 29 24v27H11Z" fill="#efd2ad"/><path d="M8 39 40 11l32 28" fill="none" stroke="#cc9e8e" stroke-width="6"/><rect x="34" y="44" width="14" height="21" rx="3" fill="#fff7e8"/><path d="M20 46h8v10h-8zm32 0h8v10h-8z" fill="#b9d9d3"/>',
    train:
      '<rect x="19" y="13" width="42" height="50" rx="10" fill="#c8d9c7"/><path d="M24 25h32v18H24Z" fill="#e2f1e8"/><circle cx="30" cy="53" r="4" fill="#f5dda1"/><circle cx="50" cy="53" r="4" fill="#f5dda1"/><path d="m26 62-7 9m35-9 7 9" fill="none"/>',
    mountain:
      '<path d="M7 65 34 19 53 49 61 37 75 65Z" fill="#a9c9bc"/><path d="M22 40 34 19l14 23-12-6-7 6Z" fill="#f5f3e7"/><circle cx="57" cy="19" r="8" fill="#f3d68f" stroke="none"/>',
    japan:
      '<path d="M12 53h56M21 53l6-30h26l6 30M17 22h46M38 22v31" fill="none" stroke="#cd8d82" stroke-width="6"/><path d="M45 39q-9-12-18 0" fill="none"/><circle cx="60" cy="15" r="6" fill="#f0b5ae" stroke="none"/>',
    laptop:
      '<rect x="14" y="16" width="52" height="39" rx="5" fill="#bfd0cb"/><rect x="19" y="21" width="42" height="29" rx="2" fill="#e7f2e7"/><path d="m10 59 60 0-5 8H15Z" fill="#a6b8ad"/><path d="M30 37v2m20-2v2m-16 6q5 3 10 0"/>',
    people:
      '<circle cx="28" cy="28" r="13" fill="#f6c8ae"/><circle cx="51" cy="30" r="11" fill="#e8b59c"/><path d="M8 65Q8 47 28 47Q40 47 42 59Q45 47 54 47Q71 47 72 65Z" fill="#bcd7c7"/><path d="M25 29v2m7-2v2m-6 6q4 3 7-1m15-8v2m6-2v2"/>',
    broom:
      '<path d="M28 65 50 15" fill="none" stroke="#b89277" stroke-width="6"/><path d="M24 56q10 9 24 5L43 72H20Z" fill="#f3d699"/><path d="m54 32 3 5 6 2-6 3-3 5-3-5-6-3 6-2Z" fill="#f9dba1"/>',
    shopping:
      '<path d="M20 29h40l-3 38H23Z" fill="#eec7be"/><path d="M29 30v-7q0-13 11-13t11 13v7" fill="none"/><path d="M33 47v2m14-2v2m-10 7q3 3 6 0"/>',
    happy:
      '<circle cx="40" cy="40" r="27" fill="#f4d59d"/><path d="M30 35v4m20-4v4M28 47q12 18 24 0" fill="none" stroke-width="3"/><circle cx="22" cy="44" r="5" fill="#f0b4aa" stroke="none"/><circle cx="58" cy="44" r="5" fill="#f0b4aa" stroke="none"/>',
    sleepy:
      '<path d="M22 30q14-21 33-4Q72 42 56 59Q40 72 24 59Q7 43 22 30Z" fill="#d9cae2"/><path d="M27 42q5 5 10 0m7 0q5 5 10 0m-17 11q3 3 6 0" fill="none"/><path d="M60 15h12l-12 13h12" fill="none" stroke="#b7a5ca" stroke-width="3"/>',
    question:
      '<circle cx="40" cy="40" r="28" fill="#eddab6"/><path d="M29 32q0-11 11-11 12 0 12 11 0 8-12 13v5" fill="none" stroke-width="5"/><circle cx="40" cy="59" r="3" fill="#536054" stroke="none"/>',
    grammar:
      '<rect x="18" y="17" width="44" height="49" rx="8" fill="#d2d4df"/><path d="M28 29h24m-24 10h17m-17 10h24" fill="none" stroke="#faf6ed" stroke-width="4"/><path d="m39 56 4 4 9-10" fill="none" stroke="#8da999" stroke-width="3"/>',
    arrows:
      '<path d="M15 28h49m0 0L52 17m12 11L52 39M65 54H16m0 0 12-11M16 54l12 11" fill="none" stroke="#86b7ae" stroke-width="5"/>',
    sparkle:
      '<path d="m40 10 7 22 22 7-22 7-7 22-7-22-22-7 22-7Z" fill="#f4d7a0"/><path d="m61 10 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#e8b1af"/>',
    leaf: '<path d="M15 61Q13 15 67 17Q63 69 15 61Z" fill="#bbd6bd"/><path d="M18 59 61 23M35 42 28 28m15 6 13 6" fill="none" stroke="#80af98" stroke-width="3"/>',
  },
  ART_WORDS = {
    cat: "neko",
    ramen: "raamen",
    rice: "gohan asagohan hirugohan ohirugohan bangohan oyakodon udon",
    coffee: "koohii",
    banana: "banana",
    egg: "tamago sukuranburueggu",
    water: "mizu",
    bread: "pandasaru",
    meat: "gyuuniku",
    chicken: "toriniku",
    drink: "nomu nomimono osake",
    gift: "morau tanomu",
    heart: "suki daisuki shinjiru",
    flower: "kirei",
    sun: "hare atsui asa kesa gozen",
    cloud: "kumo kumori tenki",
    rain: "ame ooame",
    wind: "kaze suzushii",
    snow: "samui",
    moon: "yoru konya kon'ya kinounoyoru konbanha oyasumi",
    clock: "ima sakki hayai osoi",
    calendar:
      "kyou kinou ashita mainichi shuumatsu shuu senshuu raishuu gogo itsu yasumi",
    music: "ongaku utau oto",
    movie: "eiga miru",
    ball: "sakkaa asobu",
    game: "geemu",
    camera: "shashin miseru",
    book: "nihongo benkyou benkyousuru yomu kanji hiragana katakana oboeru",
    pen: "kaku",
    speech:
      "hanasu hanaseru iu hanashi onegaishimasu yoroshikuonegaishimasu douiuimi imi",
    ear: "kiku kikoeru",
    eye: "mite",
    shoe: "aruku hashiru ugoku iku kuru kaeru modoru",
    gym: "jimu",
    home: "ie uchi heya sumu hikkosu soujisuru",
    train: "eki",
    mountain: "kouen oosaka firipin",
    japan: "nihon shusshin",
    laptop: "shigoto hataraku isogashii",
    people:
      "tomodachi ani okaasan otousan ane oneesan sensei watashi anata jibun au",
    broom: "soujisuru",
    shopping: "kau konbini",
    happy:
      "genki ureshii tanoshii oishii iidesune daijoubu arigatou otsukaresama",
    sleepy: "nemui neru okiru tsukareru yasumu",
    question:
      "nani doko dore doushite nande donna kore sore are koko soko asoko kochira kotchi",
    grammar:
      "kara made ha ga o ni de to no mo ka yori nagara tekara naitoikemasen temoiidesuka mashou tai teimasu dake shika",
    arrows: "sorekara soshite demo kedo dakara konoato atode maeni",
    sparkle:
      "maa maa maamaa metcha sukoshi amari tokuni onaji chotto takusan yoku nantonaku mada mou itsumo totemo deki ru dekiru naru hajimeru tsuzukeru wakaru omou",
  },
  ART_LOOKUP = {};
for (const [key, entries] of Object.entries(ART_WORDS))
  for (const r of entries.split(" ")) r && (ART_LOOKUP[r] = key);
Object.assign(ART_LOOKUP, {
  hikkosu: "home",
  soujisuru: "broom",
  ryourisuru: "ramen",
  taberu: "rice",
  nomu: "drink",
  onakaippai: "rice",
  osusume: "gift",
  osusumehanandesuka: "gift",
  ganbarimasu: "sparkle",
  arigatou: "heart",
  mouichido: "arrows",
  hajimemashite: "people",
  wakarimashita: "happy",
  konnichiha: "sun",
  ookii: "mountain",
  chiisai: "flower",
  tanomu: "gift",
  ugoku: "shoe",
  koto: "grammar",
  mono: "gift",
  tabemono: "rice",
  maeni: "clock",
  atode: "clock",
  soudesuka: "question",
  omoshiroi: "happy",
  tsumaranai: "sleepy",
  taihen: "cloud",
  kantan: "flower",
  ooi: "people",
  oshieru: "book",
  kau: "shopping",
});
const ART_BG = {
  cat: "#fae3d8",
  ramen: "#fae8d4",
  rice: "#e6efe2",
  coffee: "#f2e3db",
  banana: "#fff2cd",
  egg: "#fff1dc",
  water: "#e0f0ed",
  bread: "#fff0df",
  meat: "#f8e5db",
  chicken: "#fae8d3",
  drink: "#e5f0ec",
  gift: "#fee9e7",
  heart: "#fee7e5",
  flower: "#fee8ef",
  sun: "#fff1d4",
  cloud: "#e7eef0",
  rain: "#e4eefa",
  wind: "#e4f0ed",
  snow: "#e7f2f4",
  moon: "#f0e9f2",
  clock: "#f4ecd9",
  calendar: "#f9e9df",
  music: "#eee4f2",
  movie: "#e7f0e5",
  ball: "#eaf1e3",
  game: "#e4eafa",
  camera: "#f2e9dc",
  book: "#e7eee3",
  pen: "#f4e7f1",
  speech: "#e5f1ee",
  ear: "#fae8de",
  eye: "#eaf1eb",
  shoe: "#e5eee9",
  gym: "#e6f0eb",
  home: "#f7ead8",
  train: "#e4eee6",
  mountain: "#e2ede9",
  japan: "#fee9e5",
  laptop: "#e5efeb",
  people: "#f6e9e1",
  broom: "#f6eedf",
  shopping: "#fbe8e2",
  happy: "#fff0d9",
  sleepy: "#eee8f7",
  question: "#f4ecdf",
  grammar: "#edebf3",
  arrows: "#e4f2f0",
  sparkle: "#fff2dd",
  leaf: "#eaf1e4",
};
function artFor(w) {
  if (w.artHint && ART_SHAPES[w.artHint]) return w.artHint;
  const r = String(w.romaji || "")
    .toLowerCase()
    .replace(/[\s-]/g, "");
  if (ART_LOOKUP[r]) return ART_LOOKUP[r];
  const meaning = String(w.meaning || "").toLowerCase(),
    checks = [
      [/cat|kitten/, "cat"],
      [/coffee|tea/, "coffee"],
      [/ramen|noodle|pasta/, "ramen"],
      [/food|eat|meal|rice/, "rice"],
      [/banana|fruit/, "banana"],
      [/drink|beverage/, "drink"],
      [/rain/, "rain"],
      [/cloud/, "cloud"],
      [/sun|hot weather/, "sun"],
      [/cold|snow/, "snow"],
      [/weather|wind/, "cloud"],
      [/sleep|tired/, "sleepy"],
      [/house|home|live|relocat|move house/, "home"],
      [/write/, "pen"],
      [/hear|listen/, "ear"],
      [/watch|see/, "eye"],
      [/talk|speak|say/, "speech"],
      [/read|study|learn/, "book"],
      [/walk|run|move|go /, "shoe"],
      [/music|sing/, "music"],
      [/work|job/, "laptop"],
      [/gift|present|request|receive/, "gift"],
      [/friend|sister|brother|mother|father|teacher|person/, "people"],
      [/cook/, "ramen"],
      [/clean/, "broom"],
      [/buy|shop/, "shopping"],
      [/happy|good|great|fun|like/, "happy"],
      [/time|day|week|yesterday|tomorrow/, "calendar"],
      [/why|where|what|which|how/, "question"],
    ];
  for (const [re, key] of checks) if (re.test(meaning)) return key;
  return (
    {
      Verbs: "shoe",
      Nouns: "book",
      Adjectives: "happy",
      Adverbs: "sparkle",
      Expressions: "speech",
      Connectors: "arrows",
      "Particles & grammar": "grammar",
      "Questions & pronouns": "question",
    }[w.category] || "flower"
  );
}

// Original doodles, shared by the cover and vocabulary illustrations.
function vividArt(markup) {
  const colors = {
    "#edbcaa": "#fa786b",
    "#fce9dc": "#fff8e9",
    "#f3b18e": "#ffba36",
    "#b4cfc0": "#53be9a",
    "#f9d9be": "#ffce3c",
    "#f2b8ba": "#ff759f",
    "#f2d17f": "#ffcd3c",
    "#f3d58d": "#ffcf32",
    "#f1a7a4": "#fa696d",
    "#b4dbdf": "#44b8ee",
    "#c9d9df": "#65c1f1",
    "#b4dad1": "#57c8ad",
    "#f1cf68": "#ffdb42",
    "#f0b4aa": "#f77e99",
    "#e6e3c9": "#aab4fb",
    "#ecc49b": "#ffb64e",
    "#f0c7b2": "#ff9d62",
    "#e58e86": "#f35162",
  };
  return markup.replace(
    /#[a-f0-9]{6}/gi,
    (color) => colors[color.toLowerCase()] || color,
  );
}

function retroArtShape(key, original) {
  const shapes = {
    book: '<path d="m19 15 36-3q7 0 8 8l3 40q0 7-8 8l-35 2q-6 0-7-7l-3-40q-1-7 6-8Z" fill="#ffd13d"/><path d="m24 15 3 54m5-45 21-2m-20 8 13-1" fill="none"/><ellipse cx="38" cy="42" rx="5" ry="8" fill="white"/><ellipse cx="52" cy="41" rx="5" ry="8" fill="white"/><path d="m39 42 1 4m13-5 1 4" stroke-width="3.5"/><path d="M38 55q9 7 18-2-2 14-10 10Z" fill="#202b38"/><path d="m40 57 12-2" stroke="white" stroke-width="3"/>',
    coffee:
      '<path d="M18 29h36l-1 23q-1 13-16 13-17 0-18-13Z" fill="#ffce3c"/><path d="M54 33q19-1 12 14-4 8-13 4" fill="none" stroke-width="4"/><path d="M27 20q-5-6 2-12m13 12q-5-6 2-12" fill="none"/><ellipse cx="29" cy="43" rx="4" ry="7" fill="white"/><ellipse cx="43" cy="43" rx="4" ry="7" fill="white"/><path d="m30 43 1 4m13-4 1 4" stroke-width="3"/><path d="M29 55q8 7 17-1" fill="none"/><path d="m28 65-4 6m21-6 4 6" fill="none"/><path d="M18 72h12m15 0h12" stroke-width="4"/>',
    cat: '<path d="m19 34 1-17 17 10q7-2 13 0l14-13-1 23q9 16-2 26-12 12-30 5Q12 62 15 46Z" fill="#fa786b"/><path d="m25 25 6 8m25-5-3 7" stroke="#fff8e9" stroke-width="4"/><ellipse cx="32" cy="43" rx="5" ry="8" fill="white"/><path d="m33 43 1 5m13-6q5-6 10-1" fill="none" stroke-width="3"/><path d="m39 53 5 3 4-4m-4 4q8 14 15 1m-15-1q-6 11-12 2" fill="none"/><path d="m12 51 12 1M12 60l12-3m35-4 10-2m-9 7 9 2" fill="none"/>',
    flower:
      '<path d="M29 25q-5-15 8-16 11 0 12 12 11-12 19-1 6 10-7 17 16 4 10 17-6 11-20 3 3 15-10 16-12-1-10-15-13 8-21-4-6-12 8-19-14-7-8-17 8-9 19 7Z" fill="#ff759f"/><circle cx="40" cy="41" r="17" fill="#ffcd3c"/><ellipse cx="35" cy="38" rx="4" ry="6" fill="white"/><ellipse cx="47" cy="38" rx="4" ry="6" fill="white"/><path d="m36 39 1 3m11-3 1 3M32 48q10 10 20-1" fill="none"/>',
    water:
      '<path d="M40 11Q29 29 22 41 10 66 38 69q28 2 24-23Q58 29 40 11Z" fill="#44b8ee"/><path d="M29 39q2-8 8-16" stroke="white" stroke-width="4" fill="none"/><ellipse cx="34" cy="47" rx="4" ry="7" fill="white"/><ellipse cx="48" cy="46" rx="4" ry="7" fill="white"/><path d="m35 47 1 4m13-5 1 4M33 59q10 8 20-3" fill="none"/>',
    happy:
      '<circle cx="40" cy="40" r="29" fill="#ffcd3c"/><ellipse cx="29" cy="33" rx="6" ry="10" fill="white"/><ellipse cx="48" cy="33" rx="6" ry="10" fill="white"/><path d="m31 34 1 6m18-6 1 6" stroke-width="4"/><path d="M24 50q16 10 33-3-4 22-18 18Z" fill="#202b38"/><path d="m29 53 22-2" stroke="white" stroke-width="4"/>',
  };
  return shapes[key] || original;
}

function doodleScene() {
  return (
    '<svg class="doodle-scene reading-nook" viewBox="0 0 480 390" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    '<path d="M69 207C41 119 106 53 195 73 273 23 396 61 414 149c54 85-10 174-106 170-104 39-219 9-239-112Z" fill="#e7edf3"/>' +
    '<g stroke="#514957" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<ellipse cx="240" cy="329" rx="178" ry="10" fill="#514957" opacity=".08" stroke="none"/>' +
    '<path d="M124 282h205q13 0 13 13v17q0 12-13 12H124q-13 0-13-12v-17q0-13 13-13Z" fill="#458af3"/>' +
    '<path d="M138 292h182v21H138Z" fill="#fff8e9" stroke-width="3"/><path d="M148 302h160" stroke="#c6b9b6" stroke-width="2"/>' +
    '<path d="m137 249 185-10q14-1 15 12l1 18q0 12-13 13l-185 10q-12 0-13-12l-1-18q-1-12 11-13Z" fill="#ff779b"/>' +
    '<path d="m151 258 168-9 1 23-168 9Z" fill="#fff8e9" stroke-width="3"/><path d="m164 270 141-8" stroke="#c6b9b6" stroke-width="2"/>' +
    '<path d="M137 226h174q12 0 12 12v13H125v-13q0-12 12-12Z" fill="#ffd13d"/>' +
    '<path d="M278 282v27l10-7 10 7v-28" fill="#ffd13d" stroke-width="3"/>' +
    '<path d="M158 201q5-48 63-48 62-3 68 49l5 26H160Z" fill="#a5a5b2"/>' +
    '<path d="M287 204q46-18 42 13-4 26-52 11" fill="none" stroke="#93939f" stroke-width="18"/>' +
    '<path d="M165 181q-4-12-4-29l24 12q18-8 37-1l23-13q2 19-3 32 8 31-36 32-45 0-41-33Z" fill="#b8b8c4"/>' +
    '<path d="m167 160 5 13 11-6m55-8-4 13-11-6" fill="#e6bcc9" stroke="none"/>' +
    '<path d="M177 182q6 6 12 0m25 0q6 6 12 0m-28 8 5 3 5-3m-5 3q-5 7-10 1m10-1q5 7 10 1" fill="none" stroke-width="3.5"/>' +
    '<path d="m156 183 17 2m-17 8 17-2m61-6 16-3m-16 11 16 2" fill="none" stroke-width="3"/>' +
    '<ellipse cx="175" cy="191" rx="9" ry="5" fill="#e6bcc9" stroke="none"/><ellipse cx="231" cy="191" rx="9" ry="5" fill="#e6bcc9" stroke="none"/>' +
    '<ellipse cx="191" cy="222" rx="14" ry="8" fill="#b8b8c4" stroke-width="4"/><ellipse cx="221" cy="222" rx="14" ry="8" fill="#b8b8c4" stroke-width="4"/><path d="m187 222 0 3m7-3v3m24-3v3m7-3v3M198 165l2 6m8-7-1 7" fill="none" stroke="#93939f" stroke-width="2.5"/>' +
    '<path d="M49 264h54l-4 41q-1 13-23 13-23 0-24-13Z" fill="#ffd13d"/>' +
    '<path d="M103 273q25-3 22 13-2 14-24 12" fill="none"/><path d="M61 248q-8-11 2-22m20 22q-8-11 2-22" fill="none" stroke-width="3.5"/>' +
    '<path d="M40 320h76" fill="none"/>' +
    '<path d="M371 260q-8-54 5-95m-2 49 23-21m-24 1-23-20" fill="none" stroke-width="4"/>' +
    '<path d="M375 185q-4-35 17-41 11 24-17 41Zm16 16q3-31 27-32 3 25-27 32Zm-24-13q-27-2-30-25 24-5 30 25Z" fill="#58bd9b" stroke-width="3.5"/>' +
    '<path d="M346 251h57l-7 55q-1 12-22 12-20 0-21-12Z" fill="#cbbbdc"/>' +
    '<path d="M343 251h63v12h-63Z" fill="#cbbbdc" stroke-width="4"/>' +
    '<path d="M105 126q11-16 22 0" fill="none" stroke="#e5b653" stroke-width="3"/>' +
    '<path d="m304 111 4-8 4 8 8 4-8 4-4 8-4-8-8-4Z" fill="#ffd13d" stroke-width="2.5"/>' +
    '<circle cx="122" cy="174" r="3" fill="#cbbbdc" stroke="none"/><circle cx="344" cy="136" r="4" fill="#ff779b" stroke="none"/>' +
    "</g></svg>"
  );
}

function stickerSVG(w, cssClass = "sticker-svg") {
  const key = artFor(w),
    shape = retroArtShape(key, ART_SHAPES[key] || ART_SHAPES.flower);
  return `<svg class="${cssClass}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="${ART_BG[key] || "#f8eee6"}"/><circle cx="64" cy="14" r="3" fill="#fffdf7"/><g stroke="#202b38" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${vividArt(shape)}</g></svg>`;
}
function updatePictureControls() {
  document.body.classList.toggle("no-pictures", !state.illustrations);
  const b = el("pictureToggle");
  ((b.textContent = state.illustrations ? "Pictures on" : "Pictures off"),
    b.setAttribute("aria-pressed", String(state.illustrations)));
}
function togglePictures(value) {
  ((state.illustrations = value),
    persist(),
    updatePictureControls(),
    page === "library" && renderLibrary(),
    page === "lessons" && renderLessons());
}
const icons = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>',
    speaker:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9H2v6h3l5 4V5L5 9ZM14 9a4 4 0 0 1 0 6M17 6a8 8 0 0 1 0 12"/></svg>',
  },
  el = (id) => document.getElementById(id),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    ),
  safeStoreGet = () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    } catch {
      return {};
    }
  };
let saved = safeStoreGet();
if (!Object.keys(saved).length)
  try {
    saved = JSON.parse(localStorage.getItem("alken_kotoba_offline_v1") || "{}");
  } catch {
    saved = {};
  }
let state = {
    dark: !!saved.dark,
    studyMode: !!saved.studyMode,
    illustrations: saved.illustrations !== !1,
    readingMode: ["furigana", "kana", "clean"].includes(saved.readingMode)
      ? saved.readingMode
      : "furigana",
  },
  page = "library",
  activeCategory = "All words",
  search = "",
  sort = "default";
const LESSON_EXTRAS = [],
  seenLessonWords = new Set(BASE_WORDS.map((w) => w.word + "|" + w.reading));
for (const lesson of YUMA_LESSONS)
  for (const item of lesson.vocab) {
    const key = item.word + "|" + item.reading;
    seenLessonWords.has(key) ||
      (seenLessonWords.add(key),
      LESSON_EXTRAS.push({
        ...item,
        id: "lessonword_" + lesson.id + "_" + LESSON_EXTRAS.length,
        topic: lesson.theme,
        source: "Yuma lesson review",
        example: "",
        translation: "",
        note: "",
      }));
  }
const WORDS = Object.freeze([...BASE_WORDS, ...LESSON_EXTRAS]),
  wordById = new Map(WORDS.map((w) => [w.id, w])),
  wordBySurface = new Map(WORDS.map((w) => [w.word + "|" + w.reading, w])),
  wordBySurfaceOnly = new Map(WORDS.map((w) => [w.word, w])),
  searchIndex = new Map(
    WORDS.map((w) => [
      w.id,
      [
        w.word,
        w.reading,
        w.romaji,
        w.meaning,
        w.category,
        w.topic,
        w.note,
        w.example,
        w.translation,
        w.polite,
        w.te,
      ]
        .join(" ")
        .toLowerCase(),
    ]),
  );
let cachedReadingPairs;
const japaneseCache = /* @__PURE__ */ new Map();
let activeLessonId = null,
  lessonsMenuOpen = !1;
function lessonById(id) {
  return YUMA_LESSONS.find((l) => l.id === id);
}
function lessonWords(l) {
  return l.vocab.map((item) => {
    const existing =
      wordBySurface.get(item.word + "|" + item.reading) ||
      wordBySurfaceOnly.get(item.word);
    return existing
      ? { ...item, id: existing.id, artHint: item.artHint || existing.artHint }
      : item;
  });
}
function lessonBadge(l) {
  return l.date;
}
function lessonSideBar() {
  const expanded =
    page === "lessons" &&
    lessonsMenuOpen &&
    !window.matchMedia("(max-width:850px)").matches;
  (el("lessonSideNav").classList.toggle("open", expanded),
    el("yumaNavToggle").setAttribute("aria-expanded", String(expanded)),
    (el("lessonSideNav").innerHTML = YUMA_LESSONS.map(
      (l) =>
        `<button type="button" data-lesson-side="${esc(l.id)}" class="${activeLessonId === l.id ? "active" : ""}" ${activeLessonId === l.id ? 'aria-current="page"' : ""}><span>${l.number === "00" ? "🌸 Trial" : `Lesson ${l.number}`} · ${esc(l.label)}</span><span class="lesson-dot">↗</span></button>`,
    ).join("")));
}
function lessonOverview() {
  return lessonJournalOverview();
}

function lessonVocabCard(w) {
  return vocabularyLearningCard(w, true);
}
const STUDY_READINGS = [
  ["明日", "あした"],
  ["昨日", "きのう"],
  ["今日", "きょう"],
  ["日本語", "にほんご"],
  ["何時", "なんじ"],
  ["毎日", "まいにち"],
  ["時々", "ときどき"],
  ["仕事", "しごと"],
  ["先生", "せんせい"],
  ["牛乳", "ぎゅうにゅう"],
  ["今年", "ことし"],
  ["来年", "らいねん"],
  ["旅行", "りょこう"],
  ["料理", "りょうり"],
  ["勉強", "べんきょう"],
  ["食べます", "たべます"],
  ["食べました", "たべました"],
  ["飲みます", "のみます"],
  ["飲みません", "のみません"],
  ["見ます", "みます"],
  ["見ました", "みました"],
  ["起きます", "おきます"],
  ["寝ます", "ねます"],
  ["寝ました", "ねました"],
  ["起きました", "おきました"],
  ["作ります", "つくります"],
  ["趣味", "しゅみ"],
  ["名前", "なまえ"],
  ["家族", "かぞく"],
  ["私", "わたし"],
  ["雨", "あめ"],
  ["日本", "にほん"],
  ["何", "なに"],
  ["元気", "げんき"],
  ["曇り", "くもり"],
  ["お酒", "おさけ"],
  ["一度", "いちど"],
  ["時間", "じかん"],
  ["時", "じ"],
  ["半", "はん"],
  ["二十六歳", "にじゅうろくさい"],
  ["寒い", "さむい"],
  ["暑い", "あつい"],
  ["忙しい", "いそがしい"],
  ["勉強します", "べんきょうします"],
  ["美味しい", "おいしい"],
];
function studyReadingPairs(parts = []) {
  if (!cachedReadingPairs) {
    const map2 = /* @__PURE__ */ new Map();
    for (const [jp, kana] of [
      ...STUDY_READINGS,
      ...WORDS.map((w) => [w.word, w.reading]),
      ...YUMA_LESSONS.flatMap((l) => l.vocab.map((w) => [w.word, w.reading])),
    ])
      jp &&
        kana &&
        /[一-龯々]/u.test(jp) &&
        /^[ぁ-ゖァ-ヺー\s]+$/u.test(kana) &&
        !map2.has(jp) &&
        map2.set(jp, kana);
    cachedReadingPairs = [...map2].sort((a, b) => b[0].length - a[0].length);
  }
  if (!parts.length) return cachedReadingPairs;
  const map = new Map(cachedReadingPairs);
  for (const p of parts)
    p.jp &&
      p.kana &&
      /[一-龯々]/u.test(p.jp) &&
      /^[ぁ-ゖァ-ヺー\s]+$/u.test(p.kana) &&
      map.set(p.jp, p.kana);
  return [...map].sort((a, b) => b[0].length - a[0].length);
}
function rubyTerm(jp, rd) {
  let left = 0,
    right = 0;
  for (; left < jp.length && left < rd.length && jp[left] === rd[left];) left++;
  for (
    ;
    right < jp.length - left &&
    right < rd.length - left &&
    jp[jp.length - right - 1] === rd[rd.length - right - 1];
  )
    right++;
  let kanji = jp.slice(left, jp.length - right),
    kana = rd.slice(left, rd.length - right);
  return !/[一-龯々]/u.test(kanji) || !kana
    ? esc(jp)
    : esc(jp.slice(0, left)) +
        "<ruby>" +
        esc(kanji) +
        "<rt>" +
        esc(kana) +
        "</rt></ruby>" +
        esc(jp.slice(jp.length - right));
}
function rawStudyJapanese(text, parts = []) {
  const mode = state.readingMode;
  if (mode === "clean") return esc(text);
  const pairs = studyReadingPairs(parts);
  let result = "",
    i = 0;
  for (; i < text.length;) {
    const match = pairs.find(([jp]) => text.startsWith(jp, i));
    if (match) {
      const [jp, kana] = match;
      ((result += mode === "kana" ? esc(kana) : rubyTerm(jp, kana)),
        (i += jp.length));
    } else ((result += esc(text[i])), i++);
  }
  return result;
}
function grammarLegend() {
  return '<div class="grammar-legend" aria-label="Grammar color key"><span class="g-regular">Nouns / other words</span><span class="g-particle">Particles</span><span class="g-verb">Verb stems</span><span class="g-ending">Endings / auxiliaries</span><span class="g-adjective">Adjectives</span></div>';
}
function uncachedStudyJapanese(text, parts = []) {
  const segments = GRAMMAR_SEGMENTS[text];
  if (!segments) return rawStudyJapanese(text, parts);
  const mode = state.readingMode;
  let rich;
  try {
    (mode === "kana" && (state.readingMode = "furigana"),
      (rich = rawStudyJapanese(text, parts)));
  } finally {
    state.readingMode = mode;
  }
  const root = document.createElement("span");
  root.innerHTML = rich;
  const kinds = segments.flatMap(([surface, kind]) =>
    Array(surface.length).fill(kind),
  );
  let cursor = 0;
  const labels = {
    regular: "Noun / other word",
    particle: "Particle",
    verb: "Verb stem",
    ending: "Ending / auxiliary",
    adjective: "Adjective",
  };
  function paint(node) {
    if (node.nodeType === 3) {
      const value = node.nodeValue,
        fragment = document.createDocumentFragment();
      let start = 0;
      for (; start < value.length;) {
        const kind = kinds[cursor] || "regular";
        let end = start + 1;
        for (; end < value.length && kinds[cursor + end - start] === kind;)
          end++;
        const span = document.createElement("span");
        ((span.className = "g-" + kind),
          (span.title = labels[kind]),
          (span.textContent = value.slice(start, end)),
          fragment.appendChild(span),
          (cursor += end - start),
          (start = end));
      }
      node.replaceWith(fragment);
      return;
    }
    if (node.nodeName === "RUBY") {
      const copy = node.cloneNode(!0);
      copy.querySelectorAll("rt,rp").forEach((n) => n.remove());
      const length = copy.textContent.length,
        kind = kinds[cursor] || "regular";
      if (
        (node.classList.add("g-" + kind),
        (node.title = labels[kind]),
        (cursor += length),
        mode === "kana")
      ) {
        const span = document.createElement("span");
        ((span.className = "g-" + kind),
          (span.title = labels[kind]),
          (span.textContent = [...node.querySelectorAll("rt")]
            .map((n) => n.textContent)
            .join("")),
          node.replaceWith(span));
      }
      return;
    }
    [...node.childNodes].forEach(paint);
  }
  return ([...root.childNodes].forEach(paint), root.innerHTML);
}
function readingModeLabel() {
  return state.readingMode === "furigana"
    ? "Readings are shown above familiar kanji"
    : state.readingMode === "kana"
      ? "Kana reading practice"
      : "Try reading the kanji without hints";
}
function setReadingMode(mode) {
  if (!["furigana", "kana", "clean"].includes(mode)) return;
  const open = [
    ...document.querySelectorAll(".sentence-details:not(.hidden)"),
  ].map((d) => d.id);
  if (
    ((state.readingMode = mode),
    persist(),
    updateReadingControls(),
    page === "lessons")
  ) {
    renderLessons();
    for (const id of open) {
      el(id)?.classList.remove("hidden");
      const b = document.querySelector(
        '[data-lesson-action="breakdown"][data-sentence-id="' +
          id.replace("sentence-detail-", "") +
          '"]',
      );
      b &&
        (b.setAttribute("aria-expanded", "true"),
        (b.textContent = "✦ Hide breakdown ↑"));
    }
  }
  (page === "grammar" && renderGrammar(),
    el("wordDetailsDialog").open &&
      openWordDetails(el("wordDetailsDialog").dataset.wordId));
}
function updateReadingControls() {
  (document.body.classList.toggle(
    "reading-clean",
    state.readingMode === "clean",
  ),
    document.querySelectorAll("[data-reading-mode]").forEach((b) => {
      const active = b.dataset.readingMode === state.readingMode;
      (b.classList.toggle("active", active),
        b.setAttribute("aria-pressed", String(active)));
    }));
}
function lessonSentenceCard(s, i) {
  const id = String(i),
    label = `${esc(s.source || "Practice example")} · ${String(i + 1).padStart(2, "0")}`;
  return `<article class="sentence-card"><div class="sentence-main"><div class="sentence-body"><div class="sentence-badge"><span class="sentence-index">${String(i + 1).padStart(2, "0")}</span>${label}</div><div class="sentence-jp" lang="ja">${studyJapanese(s.jp, s.parts || [])}</div>${s.romaji ? `<details class="reading-extra"><summary>Romaji pronunciation</summary><div class="sentence-romaji">${esc(s.romaji)}</div></details>` : ""}<div class="sentence-translation"><span class="study-caption">ENGLISH MEANING</span><p>${esc(s.en)}</p></div></div><div class="sentence-art" aria-hidden="true">${stickerSVG({ romaji: s.art || "", meaning: s.art || "Japanese", category: "Expressions" })}</div></div><div class="sentence-actions"><button data-lesson-action="sentence-speak" data-sentence-id="${id}" >${icons.speaker} Listen to Japanese</button><button data-lesson-action="breakdown" data-sentence-id="${id}" aria-expanded="false">✦ Break it down ↓</button></div>${`<div class="sentence-details hidden" id="sentence-detail-${i}"><div class="study-caption" style="margin-bottom:10px">✦ HOW THE SENTENCE WORKS</div><div class="sentence-parts">${s.parts.map((p) => `<div class="sentence-part"><span class="jp" lang="ja">${studyJapanese(p.jp, [p])}</span><span class="rd" lang="ja">${esc(p.kana || "")}</span><span class="romaji-small">${esc(p.reading)}</span><span class="gloss">${esc(p.meaning)}</span></div>`).join("")}</div><div class="sentence-tip">✎ ${esc(s.tip)}</div></div>`}</article>`;
}
function lessonFocusPanel(l) {
  const rows = (l.focus || [])
    .map(
      (f, i) =>
        `<div class="lesson-pattern"><span class="lesson-pattern-kicker">${esc(f.label)}</span><div class="lesson-pattern-jp" lang="ja">${studyJapanese(f.jp)}</div><div class="lesson-pattern-romaji">${esc(f.romaji)}</div><div class="lesson-pattern-en">${esc(f.en)}</div></div>`,
    )
    .join("");
  return `<section class="lesson-section" id="lesson-focus"><div class="lesson-section-heading"><div><h2>Today's lesson focus <span style="color:var(--accent)">.</span></h2><p>The main patterns Yuma-san covered in this session.</p></div></div>${grammarLegend()}<div class="lesson-pattern-grid">${rows}</div>${l.upnext ? `<div class="lesson-next"><span>🌱 Next step in the notes</span><strong>${esc(l.upnext)}</strong></div>` : ""}</section>`;
}
function lessonClockPanel(l) {
  return l.clock
    ? `<section class="lesson-section" id="lesson-time"><div class="lesson-section-heading"><div><h2>Clock & number garden <span style="color:var(--accent)">.</span></h2><p>First read the number, then the time. Pay attention to 4, 7 and 9 o’clock!</p></div><span class="clock-note-pill">🕰️ Numbers 1–12</span></div><div class="clock-grid">${l.clock
        .map(([num, read, roma, time, tread, troma]) => {
          const special = ["4", "7", "9"].includes(num);
          return `<div class="clock-card ${special ? "special" : ""}"><div class="clock-top"><span class="clock-big-num">${esc(num)}</span><div class="clock-face" aria-hidden="true"><span class="clock-hand" style="transform:translateX(-50%) rotate(${Number(num) * 30}deg)"></span><span class="clock-center"></span></div></div><div class="clock-number-reading">${esc(read)}</div><div class="clock-time-jp" lang="ja">${studyJapanese(time)}</div><div class="clock-time-reading" lang="ja">${esc(tread)}</div><div class="clock-time-romaji">${esc(troma)}</div>${special ? '<div class="clock-special-tag">✦ Special reading</div>' : ""}</div>`;
        })
        .join(
          "",
        )}</div><div class="clock-bottom"><div class="clock-feature"><span class="clock-feature-icon">🕡</span><div><b>六時半（ろくじはん）</b><span>Rokuji han · 6:30 · 半 = half past</span></div></div><div class="clock-feature"><span class="clock-feature-icon">❔</span><div><b>何時（なんじ）</b><span>Nanji · What time?</span></div></div><div class="clock-feature"><span class="clock-feature-icon">🧩</span><div><b>六時に起きます</b><span>Rokuji ni okimasu · Wake up at 6</span></div></div></div></section>`
    : "";
}
function lessonDetail(l) {
  const index = YUMA_LESSONS.findIndex((x) => x.id === l.id),
    wds = lessonWords(l);
  return `<button type="button" class="lesson-back" data-lesson-home="yes">← All lessons</button>
<div class="lesson-selected" style="--lesson-tint:${esc(l.accent)}"><div class="lesson-selected-top"><div><div class="hero-kicker">✦ ${esc(l.tag)} · ${esc(l.date)}</div><h1>${esc(l.title)}</h1><div class="lesson-jp" lang="ja">${esc(l.ja)}</div><p class="lesson-desc">${esc(l.short)}</p></div><div class="lesson-cover-art">${stickerSVG({ romaji: "", meaning: l.theme, category: "Nouns", artHint: l.art })}</div></div><div class="lesson-goal"><span style="font-size:18px">🎯</span><div><strong>Lesson goal</strong><br>${esc(l.goal)}</div></div></div>
<div class="lesson-number-tabs" role="group" aria-label="Switch lessons">${YUMA_LESSONS.map((t) => `<button type="button" data-lesson-open="${esc(t.id)}" class="${t.id === l.id ? "active" : ""}">${t.number === "00" ? "🌸 Trial" : `Lesson ${t.number}`}</button>`).join("")}</div>
<div class="lesson-jump" role="group" aria-label="Jump to lesson section"><button data-jump="focus">🧩 Lesson focus</button>${l.clock ? '<button data-jump="time">🕰️ Number clock</button>' : ""}<button data-jump="vocab">🍡 Vocabulary</button><button data-jump="sentences">💬 Sentences</button></div>
${lessonFocusPanel(l)}${l.clock ? `<details class="lesson-optional" id="lesson-clock-extra"><summary>Clock & number reference</summary>${lessonClockPanel(l)}</details>` : ""}
<section class="lesson-section" id="lesson-vocab"><div class="lesson-section-heading"><div><h2>Words to remember <span style="color:var(--accent)">.</span></h2><p>${wds.length} words and expressions</p></div></div><div class="lesson-vocab-grid">${wds.map(lessonVocabCard).join("")}</div></section>
<section class="lesson-section" id="lesson-sentences"><div class="lesson-section-heading"><div><h2>Sentence garden <span style="color:var(--accent)">.</span></h2><p>Read the Japanese first, peek at the meaning, then explore the grammar. Change reading hints at the top.</p></div></div>${grammarLegend()}<div class="lesson-sentence-grid">${l.sentences.map((s, i) => lessonSentenceCard(s, i)).join("")}</div></section>
<div class="lesson-footer-actions"><button type="button" class="btn" data-lesson-home="yes">← All chapters</button>${index < YUMA_LESSONS.length - 1 ? `<button type="button" class="btn primary" data-lesson-open="${esc(YUMA_LESSONS[index + 1].id)}">Next chapter →</button>` : ""}</div>`;
}
function renderLessons() {
  (lessonSideBar(),
    (el("lessonsContent").innerHTML = activeLessonId
      ? lessonDetail(lessonById(activeLessonId))
      : lessonOverview()));
}
function showLesson(id) {
  ((activeLessonId = id),
    (lessonsMenuOpen = !window.matchMedia("(max-width:850px)").matches),
    setPage("lessons"),
    renderLessons(),
    window.scrollTo(0, 0));
}
function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {}
}
function words() {
  return WORDS;
}
function getWord(id) {
  return wordById.get(id);
}
function toast(message) {
  const t = el("toast");
  ((t.textContent = message),
    t.classList.add("show"),
    clearTimeout(toast.timer),
    (toast.timer = setTimeout(() => t.classList.remove("show"), 3e3)));
}
function updateSidebarProgress() {
  el("sidebarTotalWords").textContent = words().length;
}
function stats() {
  (updateSidebarProgress(),
    (el("dictionaryCount").textContent =
      WORDS.length + " words & expressions"));
}
function setPage(p) {
  const pages = [
    "library",
    "lessons",
    "grammar",
    "kana",
    "numbers",
    "settings",
  ];
  if (pages.includes(p)) {
    ((page = p), p !== "lessons" && (lessonsMenuOpen = !1));
    for (const name of pages) {
      el(name + "Page").classList.toggle("hidden", name !== p);
      const tab = document.querySelector('[data-page="' + name + '"]');
      (tab.classList.toggle("active", name === p),
        name === p
          ? tab.setAttribute("aria-current", "page")
          : tab.removeAttribute("aria-current"));
    }
    (p === "library" && renderLibrary(),
      p === "lessons" ? renderLessons() : lessonSideBar(),
      p === "grammar" && renderGrammar(),
      window.scrollTo({ top: 0, behavior: "auto" }));
  }
}
const matches = (w, q) => !q || searchIndex.get(w.id).includes(q);
function categoryNav() {
  let html = `<button type="button" class="catbtn ${activeCategory === "All words" ? "active" : ""}" data-cat="All words"><span class="category-label">All words</span><span class="count">${words().length}</span></button>`;
  for (const cat of CATEGORIES)
    html += `<button type="button" class="catbtn ${activeCategory === cat ? "active" : ""}" data-cat="${esc(cat)}"><span class="category-label">${esc(cat)}</span><span class="count">${words().filter((x) => x.category === cat).length}</span></button>`;
  el("categories").innerHTML = html;
}
function filteredWords() {
  let a = WORDS.filter(
    (w) =>
      (activeCategory === "All words" || w.category === activeCategory) &&
      matches(w, search.toLowerCase()),
  );
  return (
    sort === "az" &&
      a.sort((a2, b) =>
        (a2.romaji || a2.reading || a2.word).localeCompare(
          b.romaji || b.reading || b.word,
        ),
      ),
    sort === "recent" && a.reverse(),
    a
  );
}
function stableHash(s) {
  let h = 99;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function renderCard(w) {
  return vocabularyLearningCard(w);
}

function verbFormsPanel(w) {
  const reference = VERB_FORMS[w.word];
  if (!reference) return "";
  const groups = [
    ["Everyday forms", reference.rows.slice(0, 6)],
    [
      "Casual forms · present, negative, past & past negative",
      reference.rows.filter((r) => r[0].startsWith("Casual")),
    ],
    [
      "Want to, can & let’s",
      reference.rows.filter((r) =>
        ["Want to", "Potential", "Volitional"].includes(r[0]),
      ),
    ],
  ];
  return (
    '<section class="verb-reference" aria-label="Verb forms"><div class="verb-reference-heading"><h3>Verb forms</h3><span class="verb-group">' +
    esc(reference.group) +
    "</span></div>" +
    groups
      .map(
        ([label, rows]) =>
          '<section class="verb-form-group"><h4>' +
          esc(label) +
          '</h4><div class="verb-form-list">' +
          rows
            .map(
              ([name, jp, romaji, meaning, example]) =>
                '<div class="verb-form-row"><div class="verb-form-label">' +
                esc(name) +
                '</div><div class="verb-form-jp" lang="ja">' +
                studyJapanese(jp) +
                '</div><div class="verb-form-romaji">' +
                esc(romaji) +
                '</div><div class="verb-form-meaning">' +
                esc(meaning) +
                "</div>" +
                (example
                  ? '<details class="verb-form-example"><summary>Example sentence</summary><div lang="ja">' +
                    studyJapanese(example.jp) +
                    '</div><div class="verb-form-romaji">' +
                    esc(example.romaji) +
                    "</div><p>" +
                    esc(example.en) +
                    "</p></details>"
                  : "") +
                "</div>",
            )
            .join("") +
          "</div></section>",
      )
      .join("") +
    "</section>"
  );
}
function openWordDetails(id) {
  const w = getWord(id);
  if (!w) return;
  const dialog = el("wordDetailsDialog");
  ((dialog.dataset.wordId = id),
    (el("wordDetailsTitle").textContent = w.word),
    (el("wordDetailsContent").innerHTML =
      '<div class="word-detail-summary"><div lang="ja">' +
      esc(w.reading || "") +
      '</div><div class="word-romaji">' +
      esc(w.romaji || "") +
      "</div><p>" +
      esc(w.meaning) +
      '</p><button type="button" class="btn small" data-action="speak" data-id="' +
      esc(id) +
      '">Listen to pronunciation</button></div>' +
      renderWordExtra(w)),
    dialog.open ||
      (dialog.showModal(), (el("wordDetailsContent").scrollTop = 0)));
}
function groupedWordCards(list) {
  return [...new Set(list.map((w) => w.category))]
    .map((cat) => {
      const items = list.filter((w) => w.category === cat);
      return (
        '<section class="word-category-section" aria-label="' +
        esc(cat) +
        '"><div class="word-category-heading"><h3>' +
        esc(cat) +
        "</h3><span>" +
        items.length +
        " word" +
        (items.length === 1 ? "" : "s") +
        '</span></div><div class="word-grid">' +
        items.map(renderCard).join("") +
        "</div></section>"
      );
    })
    .join("");
}
function renderLibrary() {
  (stats(), categoryNavStateOnly());
  const list = filteredWords();
  (el("allWordsBack").classList.toggle(
    "hidden",
    activeCategory === "All words" && !search,
  ),
    (el("resultCount").textContent =
      list.length + " of " + WORDS.length + " entries"),
    el("wordGrid").classList.toggle(
      "grouped-word-list",
      activeCategory === "All words",
    ),
    (el("wordGrid").innerHTML =
      activeCategory === "All words"
        ? groupedWordCards(list)
        : list.map(renderCard).join("")),
    el("emptyState").classList.toggle("hidden", list.length > 0));
}
function categoryNavStateOnly() {
  const pool = WORDS.filter((w) => matches(w, search.toLowerCase()));
  for (const b of el("categories").querySelectorAll("[data-cat]")) {
    (b.classList.toggle("active", b.dataset.cat === activeCategory),
      b.setAttribute("aria-pressed", String(b.dataset.cat === activeCategory)));
    const count = b.querySelector(".count");
    count &&
      (count.textContent =
        b.dataset.cat === "All words"
          ? pool.length
          : pool.filter((w) => w.category === b.dataset.cat).length);
  }
}
function speak(w) {
  if (!("speechSynthesis" in window)) {
    toast("Audio is not supported in this browser.");
    return;
  }
  try {
    const speech = new SpeechSynthesisUtterance(
      w.word.includes(" / ") ? w.reading : w.word,
    );
    ((speech.lang = "ja-JP"), (speech.rate = 0.85));
    const voices = window.speechSynthesis.getVoices(),
      jp =
        voices.find(
          (v) => v.lang.toLowerCase().startsWith("ja") && v.localService,
        ) || voices.find((v) => v.lang.toLowerCase().startsWith("ja"));
    (jp
      ? (speech.voice = jp)
      : toast("Japanese voice may need to be installed on your device."),
      window.speechSynthesis.cancel(),
      window.speechSynthesis.speak(speech));
  } catch {
    toast("Audio unavailable. Try installing a Japanese speech voice.");
  }
}
let themeTransitionTimer;
function setTheme() {
  clearTimeout(themeTransitionTimer);
  const animate = !window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  document.body.classList.toggle("theme-changing", animate);
  state.dark = !state.dark;
  document.body.classList.toggle("dark", state.dark);
  el("themeBtn").textContent = state.dark ? "☀" : "☾";
  persist();
  if (animate) {
    themeTransitionTimer = setTimeout(() => {
      document.body.classList.remove("theme-changing");
    }, 220);
  }
}

function randomWord() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  word && openWordDetails(word.id);
}
(document.querySelectorAll("[data-page]").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.page === "lessons") {
      if (window.matchMedia("(max-width:850px)").matches) {
        activeLessonId = null;
        lessonsMenuOpen = false;
        setPage("lessons");
        return;
      }
      if (page === "lessons") {
        ((lessonsMenuOpen = !lessonsMenuOpen), lessonSideBar());
        return;
      }
      ((activeLessonId = null),
        (lessonsMenuOpen = !window.matchMedia("(max-width:850px)").matches));
    }
    setPage(b.dataset.page);
  }),
),
  document.querySelectorAll("[data-reference]").forEach((b) =>
    b.addEventListener("click", () => {
      (setPage(b.dataset.reference),
        b.dataset.reference === "library" && el("searchInput").focus());
    }),
  ),
  el("allWordsBack").addEventListener("click", () => {
    ((activeCategory = "All words"),
      (search = ""),
      (el("searchInput").value = ""),
      renderLibrary());
  }),
  el("categories").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    b && ((activeCategory = b.dataset.cat), renderLibrary());
  }),
  el("closeWordDetails").addEventListener("click", () =>
    el("wordDetailsDialog").close(),
  ),
  el("wordDetailsDialog").addEventListener("click", (e) => {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    (e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom) &&
      e.currentTarget.close();
  }));
function handleWordAction(e) {
  if (handleLearningAction(e)) return;
  const b = e.target.closest("[data-action]");
  if (!b) return;
  const w = getWord(b.dataset.id);
  w &&
    (b.dataset.action === "speak" && speak(w),
    b.dataset.action === "more" && openWordDetails(w.id));
}
(el("wordDetailsContent").addEventListener("click", handleWordAction),
  el("wordGrid").addEventListener("click", handleWordAction));
initializeLearningCards();
let searchTimer;
(el("searchInput").addEventListener("input", (e) => {
  ((search = e.target.value.trim()),
    clearTimeout(searchTimer),
    (searchTimer = setTimeout(renderLibrary, 100)));
}),
  el("sortFilter").addEventListener("change", (e) => {
    ((sort = e.target.value), renderLibrary());
  }),
  el("randomWordBtn").addEventListener("click", randomWord),
  void 0,
  el("pictureToggle").addEventListener("click", () =>
    togglePictures(!state.illustrations),
  ),
  el("themeBtn").addEventListener("click", setTheme),
  el("themeBtn2").addEventListener("click", setTheme),
  document.addEventListener("keydown", (e) => {
    !["INPUT", "TEXTAREA", "SELECT"].includes(
      document.activeElement?.tagName,
    ) &&
      !el("wordDetailsDialog").open &&
      e.key === "/" &&
      page === "library" &&
      (e.preventDefault(), el("searchInput").focus());
  }),
  el("lessonSideNav").addEventListener("click", (e) => {
    const b = e.target.closest("[data-lesson-side]");
    b && showLesson(b.dataset.lessonSide);
  }),
  el("grammarContent").addEventListener("click", (e) => {
    const b = e.target.closest("[data-lesson-open]");
    b && showLesson(b.dataset.lessonOpen);
  }),
  el("lessonsContent").addEventListener("click", (e) => {
    const word = e.target.closest("[data-word-open]");
    if (word) {
      openWordDetails(word.dataset.wordOpen);
      return;
    }
    const open = e.target.closest("[data-lesson-open]");
    if (open) {
      showLesson(open.dataset.lessonOpen);
      return;
    }
    if (e.target.closest("[data-lesson-home]")) {
      ((activeLessonId = null), renderLessons(), window.scrollTo(0, 0));
      return;
    }
    const jump = e.target.closest("[data-jump]");
    if (jump) {
      (jump.dataset.jump === "time" && (el("lesson-clock-extra").open = !0),
        el("lesson-" + jump.dataset.jump)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }));
      return;
    }
    const b = e.target.closest("[data-lesson-action]");
    if (b) {
      if (b.dataset.lessonAction === "speak") {
        const w = getWord(b.dataset.wordId);
        w && speak(w);
      }
      if (b.dataset.lessonAction === "sentence-speak") {
        const s =
          lessonById(activeLessonId).sentences[Number(b.dataset.sentenceId)];
        s && speak({ word: s.jp, reading: s.jp });
      }
      if (b.dataset.lessonAction === "breakdown") {
        const closed = el(
          "sentence-detail-" + b.dataset.sentenceId,
        ).classList.toggle("hidden");
        (b.setAttribute("aria-expanded", String(!closed)),
          (b.textContent = closed
            ? "✦ Break it down ↓"
            : "✦ Hide breakdown ↑"));
      }
    }
  }),
  document.body.classList.toggle("dark", state.dark),
  (el("themeBtn").textContent = state.dark ? "☀" : "☾"),
  (el("heroStickers").innerHTML = doodleScene()),
  updatePictureControls(),
  categoryNav(),
  renderLibrary());
let yumaCelebrating = !1;
function sparkleYuma(tab) {
  if (
    yumaCelebrating ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  yumaCelebrating = !0;
  const rect = tab.getBoundingClientRect(),
    layer = document.createElement("div");
  ((layer.className = "yuma-celebration"),
    layer.setAttribute("aria-hidden", "true"));
  const originX = rect.left + rect.width * 0.5,
    originY = rect.top + rect.height * 0.45,
    glow = document.createElement("div");
  ((glow.className = "yuma-screen-glow"), layer.appendChild(glow));
  const colors = ["#ffb3d5", "#dac4ff", "#ffe6a8", "#a9e6da", "#fff1fa"];
  for (let i = 0; i < 110; i++) {
    const particle = document.createElement("span"),
      rain = i >= 70;
    ((particle.className =
      "yuma-party-particle " + (rain ? "yuma-heart-rain" : "yuma-heart-burst")),
      (particle.textContent = ["♥", "♡", "✦", "✧", "♥", "✿"][i % 6]),
      (particle.style.color = colors[i % colors.length]),
      (particle.style.fontSize =
        (rain ? 18 + Math.random() * 22 : 14 + Math.random() * 25) + "px"),
      (particle.style.left =
        (rain ? Math.random() * window.innerWidth : originX) + "px"),
      (particle.style.top = (rain ? -45 : originY) + "px"));
    const angle = (i / 70) * Math.PI * 2,
      distance =
        100 +
        Math.random() * Math.max(window.innerWidth, window.innerHeight) * 0.65;
    (particle.style.setProperty("--party-x", Math.cos(angle) * distance + "px"),
      particle.style.setProperty(
        "--party-y",
        Math.sin(angle) * distance + "px",
      ),
      particle.style.setProperty(
        "--party-drift",
        (Math.random() - 0.5) * 200 + "px",
      ),
      particle.style.setProperty(
        "--party-fall",
        window.innerHeight + 100 + "px",
      ),
      particle.style.setProperty(
        "--party-turn",
        (Math.random() - 0.5) * 480 + "deg",
      ),
      (particle.style.animationDelay =
        (rain ? 0.3 + Math.random() * 0.5 : Math.random() * 0.2) + "s"),
      (particle.style.animationDuration =
        (rain ? 2.2 + Math.random() * 0.6 : 1.5 + Math.random() * 0.8) + "s"),
      layer.appendChild(particle));
  }
  (document.body.appendChild(layer), tab.classList.add("yuma-party-dance"));
  let timer;
  function cleanup() {
    (clearTimeout(timer),
      layer.remove(),
      tab.classList.remove("yuma-party-dance"),
      (yumaCelebrating = !1),
      document.removeEventListener("keydown", escapeParty));
  }
  function escapeParty(e) {
    e.key === "Escape" && cleanup();
  }
  (document.addEventListener("keydown", escapeParty),
    (timer = setTimeout(cleanup, 3800)));
}
(document
  .getElementById("lessonsContent")
  .addEventListener("pointerover", (e) => {
    const portrait = e.target.closest(".yuma-portrait");
    portrait &&
      e.pointerType !== "touch" &&
      !portrait.contains(e.relatedTarget) &&
      sparkleYuma(portrait);
  }),
  document.getElementById("lessonsContent").addEventListener("focusin", (e) => {
    e.target.matches(".yuma-portrait") && sparkleYuma(e.target);
  }),
  document.getElementById("lessonsContent").addEventListener("click", (e) => {
    const portrait = e.target.closest(".yuma-portrait");
    portrait && sparkleYuma(portrait);
  }));
const textSizeSelect = document.getElementById("textSizeSelect");
function applyTextSize(value) {
  const size = ["16", "18", "20"].includes(value) ? value : "16";
  (document.documentElement.style.setProperty(
    "--material-scale",
    String(Number(size) / 16),
  ),
    (textSizeSelect.value = size));
}
try {
  applyTextSize(localStorage.getItem("kotoba-text-size"));
} catch {
  applyTextSize("16");
}
textSizeSelect.addEventListener("change", () => {
  applyTextSize(textSizeSelect.value);
  try {
    localStorage.setItem("kotoba-text-size", textSizeSelect.value);
  } catch {}
});
function studyJapanese(text, parts = []) {
  const key = state.readingMode + "|" + text + "|" + JSON.stringify(parts);
  if (japaneseCache.has(key)) return japaneseCache.get(key);
  const html = uncachedStudyJapanese(text, parts);
  return (
    japaneseCache.size > 2e3 && japaneseCache.clear(),
    japaneseCache.set(key, html),
    html
  );
}
function renderWordExtra(w) {
  const learning = learningForWord(w);
  const sentence = learning.sentence;
  const referenceNote = [w.note, learning.note].filter(Boolean).join(" ");
  const example = sentence
    ? '<section class="study-example"><div class="study-caption">EXAMPLE SENTENCE · 例文</div><div class="study-example-jp" lang="ja">' +
      highlightedCardSentence(w, sentence.jp) +
      '</div><p class="card-context-romaji">' +
      esc(sentence.romaji) +
      '</p><div class="study-example-en"><p>' +
      esc(sentence.en) +
      "</p></div></section>"
    : '<p class="word-forms-note">No example recorded for this entry yet.</p>';
  let forms = verbFormsPanel(w);
  return (
    !forms &&
      (w.polite || w.te) &&
      (forms =
        '<section class="verb-reference"><h3>Recorded forms</h3><div class="conj-grid study-conjugations">' +
        [
          ["Polite", w.polite],
          ["て-form", w.te],
        ]
          .filter((x) => x[1])
          .map(
            ([name, jp]) =>
              '<div class="conj-cell"><b>' +
              name +
              '</b><span lang="ja">' +
              studyJapanese(jp) +
              "</span></div>",
          )
          .join("") +
        "</div></section>"),
    example +
      forms +
      (referenceNote
        ? '<div class="study-note"><span>REFERENCE NOTE</span><p>' +
          esc(referenceNote) +
          "</p></div>"
        : "")
  );
}
function renderGrammar() {
  el("grammarContent").innerHTML = YUMA_LESSONS.filter((l) => l.focus?.length)
    .map(
      (l) =>
        '<section class="grammar-chapter"><div class="section-title"><div><h2>' +
        esc(l.title) +
        "</h2><p>" +
        esc(l.short) +
        '</p></div><button type="button" class="btn small" data-lesson-open="' +
        esc(l.id) +
        '">Open lesson ↗</button></div>' +
        lessonFocusPanel(l).replace(
          'id="lesson-focus"',
          'id="grammar-' + esc(l.id) + '"',
        ) +
        "</section>",
    )
    .join("");
}
try {
  const legacy = JSON.parse(
    localStorage.getItem("alken_kotoba_offline_v1") || "{}",
  );
  (legacy.custom?.length ||
    Object.values(legacy.lessonNotes || {}).some(Boolean) ||
    Object.values(legacy.lessonSentences || {}).some((x) => x.length)) &&
    (el("legacyRecovery").classList.remove("hidden"),
    el("downloadLegacy").addEventListener("click", () => {
      const url = URL.createObjectURL(
          new Blob([JSON.stringify(legacy, null, 2)], {
            type: "application/json",
          }),
        ),
        a = document.createElement("a");
      ((a.href = url),
        (a.download = "kotoba-earlier-material.json"),
        a.click(),
        setTimeout(() => URL.revokeObjectURL(url), 1e3));
    }));
} catch {}

window.matchMedia("(max-width:850px)").addEventListener("change", () => {
  if (window.matchMedia("(max-width:850px)").matches) lessonsMenuOpen = false;
  lessonSideBar();
});
