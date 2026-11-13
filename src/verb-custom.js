const VE_CUSTOM_KEY = "kotoba_custom_verbs_v1";
const veCustomEntries = [];
function veRegisterCustom(v) {
  if (veById.has(v.id)) return;
  veById.set(v.id, v);
  veCustomEntries.push(v);
  veSearchIndex.push([
    v,
    veNormalize([v.jp, v.kana, verbRomaji(v.kana), v.en[0]].join(" ")),
  ]);
}
function veLoadCustom() {
  try {
    const stored = JSON.parse(localStorage.getItem(VE_CUSTOM_KEY) || "[]");
    if (!Array.isArray(stored)) return;
    for (const input of stored.slice(0, 200)) {
      const { verb } = verbNewEntry(input);
      if (verb) veRegisterCustom(verb);
    }
  } catch {}
}
function veCustomMarkup() {
  return `<section id="veCustom" class="ve-practice" hidden aria-labelledby="veCustomTitle"><div class="ve-practice-heading"><h2 id="veCustomTitle" tabindex="-1">Conjugate a new verb</h2><button type="button" class="btn small" data-ve="close-custom">Close</button></div><p class="ve-note">Enter a dictionary form, not a ます-form. Confirm the group; endings such as る do not determine it reliably. Meanings are optional and are never guessed.</p><form id="veCustomForm" novalidate><div class="ve-custom-fields"><label>Dictionary form<input id="veCustomJP" required maxlength="40" lang="ja" autocomplete="off" placeholder="調べる"></label><label>Hiragana reading<input id="veCustomKana" required maxlength="70" lang="ja" autocomplete="off" placeholder="しらべる"></label><label>Verb group<select id="veCustomGroup" required><option value="">Choose the group</option><option value="1">Group 1 · う-verbs</option><option value="2">Group 2 · る-verbs</option><option value="3">Group 3 · Irregular</option></select></label><label>Meaning (optional)<input id="veCustomMeaning" maxlength="120" autocomplete="off" placeholder="Your meaning, if known"></label><label>Verb use<select id="veCustomUsage"><option value="unknown">Not sure yet</option><option value="action">Volitional action</option><option value="state">State / involuntary event</option></select></label></div><p id="veCustomGroupHint" class="ve-note" aria-live="polite"></p><p class="ve-note">Unreviewed verbs show rule-derived forms and clearly labeled examples with a reviewed verb. No sentence or translation is invented for your verb. With uncertain usage, only basic inflections are offered. Practice continues to use the reviewed dictionary.</p><button class="btn small primary" type="submit">Conjugate & save locally</button><p id="veCustomError" role="alert" tabindex="-1"></p></form></section>`;
}
function veOpenCustom() {
  const query = el("veSearch").value.trim();
  el("veCustom").hidden = false;
  el("veCustomJP").value = /^[一-龯々ぁ-ゖァ-ヶー]+$/.test(query) ? query : "";
  const known = WORDS.filter((w) => w.word === query && w.category === "Verbs");
  el("veCustomKana").value =
    known.length === 1
      ? known[0].reading
      : /^[ぁ-ゖー]+$/.test(query)
        ? query
        : "";
  el("veCustomMeaning").value = "";
  el("veCustomUsage").value = "unknown";
  el("veCustomError").textContent = "";
  veCustomInfer();
  el("veCustomJP").focus();
  el("veCustom").scrollIntoView({ block: "start", behavior: "auto" });
}
function veCustomInfer() {
  const jp = el("veCustomJP").value.trim(),
    kana = el("veCustomKana").value.trim();
  const known = EXPLORER_VERBS.find((v) => v.jp === jp && v.kana === kana);
  const group = known?.group || verbResolveGroup(jp, kana);
  el("veCustomGroup").value = group ? String(group) : "";
  el("veCustomGroupHint").textContent = group
    ? "Group identified from the reviewed dictionary or an unambiguous ending. Confirm your dictionary form before saving."
    : "The group is ambiguous. Select it from a dictionary or ask Yuma-san; it will not be guessed.";
}
function veSaveCustom(e) {
  e.preventDefault();
  const input = {
    jp: el("veCustomJP").value,
    kana: el("veCustomKana").value,
    group: el("veCustomGroup").value,
    meaning: el("veCustomMeaning").value,
    usage: el("veCustomUsage").value,
  };
  const { verb, error } = verbNewEntry(input);
  if (error) {
    el("veCustomError").textContent = error;
    el("veCustomError").focus();
    return;
  }
  const reviewed = EXPLORER_VERBS.find(
    (v) => v.jp === verb.jp && v.kana === verb.kana,
  );
  if (reviewed && reviewed.group !== verb.group) {
    el("veCustomError").textContent =
      "This verb already has a reviewed group. Choose it from the search suggestions.";
    return;
  }
  if (!reviewed) {
    if (veCustomEntries.length >= 200 && !veById.has(verb.id)) {
      el("veCustomError").textContent =
        "The local custom dictionary is full (200 verbs).";
      return;
    }
    // Re-saving updates user-confirmed metadata without changing favorites IDs.
    const old = veCustomEntries.findIndex((v) => v.id === verb.id);
    if (old >= 0) {
      veCustomEntries.splice(old, 1);
      veById.delete(verb.id);
      veCache.delete(verb.id);
      const i = veSearchIndex.findIndex(([v]) => v.id === verb.id);
      if (i >= 0) veSearchIndex.splice(i, 1);
    }
    veRegisterCustom(verb);
    try {
      localStorage.setItem(
        VE_CUSTOM_KEY,
        JSON.stringify(
          veCustomEntries.map((v) => ({
            jp: v.jp,
            kana: v.kana,
            group: v.group,
            meaning: v.en[0] === "Meaning not provided" ? "" : v.en[0],
            usage: v.usage,
          })),
        ),
      );
    } catch {
      toast(
        "Custom verb works for this session; browser storage is unavailable.",
      );
    }
  }
  el("veCustom").hidden = true;
  veSelect(reviewed?.id || verb.id);
  el("veSummary").scrollIntoView({ block: "start", behavior: "auto" });
}
