# Verb Explorer

The explorer is independent of the vocabulary and lesson records. Its 30-verb starter dictionary is `explorer-verbs.json`; no lesson or word IDs are changed. N5 Essentials is a study grouping, not a claim that every associated grammar construction has an official N5 assignment. Per-word JLPT tags are omitted rather than inferred.

## Modules

- `verb-engine.js`: pure Japanese/kana conjugation rules, kana-to-romaji conversion, form metadata and applicability checks.
- `verb-learning.js`: English glosses, formation explanations, and two contextual practice examples per supported entry.
- `verb-explorer.js`: search/listbox, reading display, accessible tables, lazy explanations, clipboard fallback, favorites/recents and practice. It initializes only when the tab opens. Event delegation avoids per-row handlers; conjugations are cached per verb. No dependency or runtime network request is added.

Favorites, the eight most recent selections, and reading preferences use only `kotoba_verb_explorer_v1`. Existing display preferences and legacy material are untouched. Practice answers are session-only.

## Dictionary expansion

Each entry records its `id`, Japanese `jp`, hiragana `kana`, explicit `group` (1/2/3), English `[base, past, participle-ing, past-participle]`, and two frames `[Japanese prefix, kana prefix, English complement]`. Kana frames include word/particle spacing for readable romaji. Meanings and examples represent the curated lexical sense, not every dictionary sense of a verb.

Never infer Ichidan membership from final る. 帰る・入る・切る are explicitly Godan; 着る is Ichidan. 行く's て/た exception, する/来る stems, 来's changing readings, ある → ない, and full/short causative-passives are handled explicitly. Final す does not receive the abbreviated causative-passive.

`passive: true` is reserved for curated direct-passive frames with a を object. する and 来る have dedicated contextual passive examples. Other passive senses are marked context-specific instead of showing a misleading direct-passive sentence. `sense: aru/iru` restricts constructions inappropriate to basic existence; いる's additional examples use its staying sense. Unoffered rows have no Japanese target, cannot be copied, and never enter practice.

`aspect: result/awake/wear` distinguishes movement/result states, 起きている (being awake), and 着ている (wearing). A ている construction is never universally translated as an action in progress. Additional verbs need lexical and example review, not just a mechanically correct ending.

Practice accepts standard Japanese or hiragana, including both standard causative-passive variants when offered. It does not silently accept colloquial ら-dropped potential forms. Multiple-choice distractors are distinct forms of the same verb. Reading and romaji switches are independent of Kotoba's other reading settings.

## Linguistic references

- [MEXT / Agency for Cultural Affairs: conjugation table](https://tsunagarujp.mext.go.jp/assets/download/conjugation_of_verbs_2_ver202404.pdf): Godan/Ichidan/irregular stems, ない・ます・ば・volitional・て・た・potential・passive・causative・causative-passive. The test fixtures independently record examples from this table and required exceptions.
- [Tae Kim: potential](https://guidetojapanese.org/learn/complete/potential): ability versus visibility/audibility; non-mechanical treatment of ある.
- [Tae Kim: causative and passive](https://guidetojapanese.org/learn/grammar/causepass): causative make/let, indirect passives, causative-passive order and standard shortened forms.
- [Tae Kim: desire](https://guidetojapanese.org/learn/grammar/desire): たい's adjectival endings, たかった, and wanting another person to act.

The examples are original practice wording assembled from curated frames, not quotations or newly attributed Yuma lesson content. Formation/usage descriptions are authored summaries. Tests cover reference fixtures and all dictionary/form profiles, but mechanical checks do not replace linguistic review when expanding the dictionary.
