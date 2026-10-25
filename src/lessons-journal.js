// One small stationery illustration system. Fixed paints keep the artwork the
// same in both themes; all artwork is inline SVG for offline use.
function lessonJournalSticker(subject) {
  const drawings = {
    notebook: `<path d="M22 20h44q5 0 5 5v58H22q-6 0-6-6V26q0-6 6-6Z" fill="#c9c4d9"/><path d="M26 20v63M19 32h12m-12 13h12m-12 13h12m-12 13h12"/><path d="M35 33h25v18H35Z" fill="#faf3e8"/><path d="M41 39h13m-13 6h9"/><path d="m78 26 7 3-13 39-8 7 1-11Z" fill="#e5c998"/><path d="m65 64 7 4m6-42 2-6q1-4 5-2t2 5l-2 6"/><path d="M48 77q-9-2-9-10l-3-2 2-5-1-8 8 4q9-4 17 0l8-4-1 8 2 5-3 2q0 10-10 11Z" fill="#c9c7ce"/><path d="m43 63 3-1m14 1 3-1m-12 6 3 2 3-2m-3 2-3 3m3-3 3 3"/><path d="M42 70h-7m30 0h7" stroke="#9c909f"/>`,
    trial: `<path d="m18 29 52-6 6 41-52 6Z" fill="#d9c8d4"/><path d="m26 38 20 12 19-17m-39 28 15-17m15-2 13 15"/><path d="m48 57 25-5 10 25-30 6Z" fill="#f4eddf"/><path d="M57 64h12m-10 7h9"/><path d="M20 19v-6m-7 11-5-2m69-6 4-4" stroke="#ab9575"/>`,
    l1: `<path d="M23 25h55v50H23Z" fill="#c5d8d2"/><path d="M23 36h55"/><rect x="43" y="19" width="17" height="10" rx="3" fill="#e6dcc6"/><circle cx="38" cy="49" r="6" fill="#f1ddce"/><path d="M30 65q0-10 8-10t8 10m8-16h15m-15 8h15m-15 8h9"/><path d="m18 48-5 26 3 8 6-6 5-26Z" fill="#e2c798"/><path d="m13 74 9 2"/>`,
    l2: `<path d="M15 23h46v35H35l-10 8v-8H15Z" fill="#c8d8df"/><path d="M43 46h42v31H73l-8 8v-8H43Z" fill="#e4cbd3"/><text x="38" y="47" text-anchor="middle" font-size="23" stroke="none" fill="#5e5660">あ</text><text x="64" y="69" text-anchor="middle" font-size="20" stroke="none" fill="#5e5660">A</text>`,
    l3: `<path d="M22 24q13-4 28 2 15-6 28-2v51q-14-4-28 2-14-6-28-2Z" fill="#f4eddf"/><path d="M50 26v51m-20-9h11m18 0h11"/><path d="M50 47c-11-14-23-1 0 13 23-14 11-27 0-13Z" fill="#dbb9c5"/><path d="M64 23v18l5-4 5 4V23" fill="#c5d8d2"/>`,
    l4: `<path d="M17 55h48q-2 24-24 24T17 55Z" fill="#c5d8d2"/><path d="M14 55h54m-39 28h24M26 37l45-16m-42 23 46-16"/><path d="M69 46h15v28H69Zm15 5q13 0 9 11-2 5-9 4" fill="#e5c998"/><path d="M73 34q-5-5 0-9m9 10q-5-5 0-9" stroke="#9c909f"/>`,
    l5: `<rect x="20" y="35" width="59" height="43" rx="7" fill="#c8d8df"/><path d="M38 35v-8q0-5 5-5h13q5 0 5 5v8M30 35v43m39-43v43"/><path d="m43 46 31-6 5 17-31 6Z" fill="#f4eddf"/><path d="m51 49 17-3m-15 9 10-2M29 82v3m40-3v3"/><path d="M14 18h17m-8-7v14" stroke="#ab9575"/>`,
    l6: `<circle cx="49" cy="47" r="29" fill="#e2d5bc"/><circle cx="49" cy="47" r="23" fill="#faf3e8"/><path d="M49 27v4m20 16h-4M49 67v-4M29 47h4M49 47l-13-3m13 3v16"/><circle cx="49" cy="47" r="2" fill="#5e5660"/><path d="M30 74h38m-32 0-3 7m29-7 3 7"/><path d="m78 22 9 4-7 17-9-4Z" fill="#d9c8d4"/><path d="m77 29 4 2m-6 3 4 2"/>`,
  };
  return `<svg class="journal-sticker" data-sticker="${esc(subject)}" viewBox="0 0 104 100" fill="none" stroke="#5e5660" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 12Q49 4 87 14q11 28 5 64-32 17-76 8Q4 48 15 12Z" fill="#f5eee4" stroke="#fff9f0" stroke-width="4"/><g>${drawings[subject] || drawings.notebook}</g></svg>`;
}

function lessonJournalOverview() {
  const total = YUMA_LESSONS.length;
  const terms = new Set(YUMA_LESSONS.flatMap((l) => l.vocab.map((w) => w.word)))
    .size;
  const sentences = YUMA_LESSONS.reduce(
    (sum, l) => sum + l.sentences.length,
    0,
  );
  // Preview surfaces are selected from the corresponding source chapter only.
  const previews = {
    trial: ["こんにちは", "元気", "もう一度"],
    l1: ["私", "出身", "趣味"],
    l2: ["日本語", "英語", "わかりました"],
    l3: ["好き", "昨日", "曇り"],
    l4: ["食べる", "飲む", "毎日"],
    l5: ["料理する", "旅行する", "ました"],
    l6: ["何時", "半", "起きる"],
  };
  return `<div class="lesson-journal">
    <header class="journal-hero">
      <div class="journal-intro"><div class="journal-eyebrow">ALKEN’S NOTEBOOK <span aria-hidden="true">/</span> LESSON NOTES</div>
      <h1>Lessons with <span>Yuma-san.</span></h1>
      <p class="journal-subtitle" lang="ja">ゆまさんとのレッスンノート</p>
      <p class="journal-welcome">Notes from our lessons together—words to revisit, sentences to try, and a little more Japanese each week.</p>
      <p class="journal-thanks">With thanks to Yuma-san, one lesson at a time.</p></div>
      <button type="button" class="yuma-portrait journal-portrait" aria-label="Yuma-san and her gray cat — send some hearts" title="A little hello from Yuma-san ♡"><span class="portrait-lady"><svg class="yuma-lady-doodle" viewBox="0 0 40 40" fill="none" stroke="#514957" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 35V14C7 6 12 2 20 2s13 4 13 12v21l-6-2-7 2-7-2Z" fill="#655463"/><path d="M9 17v16m3-8v9m16-17v16m3-17v18" stroke="#a18b9e" opacity=".6"/><path d="M10 17v6c0 6 4 9 10 9s10-4 10-10v-6c-5 0-9-2-12-6-1 4-4 6-8 7Z" fill="#f3d4bd"/><path d="M9 19c-4-2-4 5 1 5m20-5c4-2 4 5-1 5" fill="#f3d4bd"/><ellipse cx="14" cy="24" rx="3" ry="1.8" fill="#d999ab" stroke="none" opacity=".3"/><ellipse cx="26" cy="24" rx="3" ry="1.8" fill="#d999ab" stroke="none" opacity=".3"/><path d="M13 21q1.5-2 3 0m8 0q1.5-2 3 0M18 25q2 3 4 0"/><path d="M12 31c-4 1-6 3-6 6m22-6c4 1 6 3 6 6M14 30l6 5 6-5"/><path d="M28 8c-1-5-6-4-5-1l5 3c5 1 8-3 5-4-2-1-4 1-5 2Z" fill="#ddd0e7"/><circle cx="28" cy="9" r="1.5" fill="#d999ab" stroke="none"/><path d="m3 6 1-2 1 2m30 24 1 1 2-2" stroke="#a7789e"/></svg></span><span class="portrait-cat"><svg viewBox="0 0 100 110" fill="none" stroke="#555568" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M70 91c27 6 27-25 17-24-6 0-1 10-9 12" stroke="#93939f" stroke-width="9"/><path d="M25 94c-4-24 4-40 24-40s28 17 24 40Z" fill="#a5a5b2"/><path d="M21 39 19 10 39 23q11-5 23 0l19-13-2 30c8 25-6 35-29 35S13 63 21 39Z" fill="#b8b8c4"/><path d="m25 23 1 14 9-8m40-6-1 14-9-8" fill="#e6bcc9" stroke="none"/><path class="doja-face" d="M33 46q4-5 7 0m20 0q4-5 7 0m-21 8 4 3 4-3m-4 3q-5 7-9 1m9-1q5 7 9 1M17 53l13 2M17 61l13-2m40-4 13-2m-13 6 13 2M37 83v11m25-11v11"/><ellipse cx="31" cy="53" rx="5" ry="3" fill="#e6bcc9" stroke="none"/><ellipse cx="69" cy="53" rx="5" ry="3" fill="#e6bcc9" stroke="none"/></svg></span></button>
    </header>
    <dl class="journal-progress" aria-label="Lesson collection at a glance">
      <div><dt>Chapters, including trial</dt><dd>${total}</dd></div>
      <div><dt>Unique lesson terms</dt><dd>${terms}</dd></div>
      <div><dt>Example sentences</dt><dd>${sentences}</dd></div>
    </dl>
    <div class="journal-index-heading"><h2>Your lesson journal</h2><span lang="ja">レッスンの記録</span></div>
    <div class="lesson-list journal-entries">${YUMA_LESSONS.map((l) => {
      const sourceWords = new Set(l.vocab.map((w) => w.word));
      const chips = (previews[l.id] || l.vocab.map((w) => w.word))
        .filter((w) => sourceWords.has(w))
        .slice(0, 3);
      return `<button type="button" class="lesson-tile journal-entry" data-lesson-open="${esc(l.id)}">
        <span class="journal-entry-art">${lessonJournalSticker(l.id)}</span>
        <span class="journal-entry-body"><span class="journal-entry-meta"><span>${esc(l.tag)}</span><time>${esc(l.date)}</time></span>
        <span class="journal-entry-title">${esc(l.title)}</span><span class="journal-entry-description">${esc(l.short)}</span>
        <span class="journal-word-previews" lang="ja">${chips.map((w) => `<span>${esc(w)}</span>`).join("")}</span>
        <span class="journal-entry-footer"><span>${l.vocab.length} words · ${l.sentences.length} sentences</span><span class="journal-read">Open chapter <span aria-hidden="true">↗</span></span></span></span>
      </button>`;
    }).join("")}</div>
    <aside class="journal-source-note"><span>From Yuma-san’s Preply lesson notes, Aug 27–Oct 13. “Extra practice” labels identify additional study sentences.</span></aside>
    <aside class="journal-next"><span class="journal-next-label">Next in the notebook</span><p><span lang="ja">～時から～時まで</span> <span>— from … until …</span></p><span class="journal-next-note">The next topic from Lesson 6, not content already taught.</span></aside>
  </div>`;
}
