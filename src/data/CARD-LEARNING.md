# Vocabulary teaching cues

card-learning.json holds authored beginner examples and optional visual cues. Word IDs, browsing categories, and lesson records remain unchanged.

Every dictionary and lesson entry requires a sentence with jp, romaji, en, target, and targetStart (a JavaScript string offset). The examples are short original teaching sentences. Romaji uses wa for the particle は and o for を. Casual expressions retain casual endings. Numeric examples avoid unexplained counter readings.

The target is the exact form in the sentence, including conjugations such as 飲みました, 早く, and つまらなかった. Its offset distinguishes particles from kana inside other words. No runtime conjugation or machine translation is used. examplesByReading handles homographs such as 家 (いえ / うち). The build rejects missing examples or invalid highlight spans. Add a complete example here whenever adding a word. Details uses the same example.

Optional diagrams are explicitly curated: timeline (early/late), size (large/small), temperature (hot/cool/cold weather), and equal. They sit beside the word, without a large container, and never replace the sentence. Temperature cues compare three mercury levels and underline the relevant one. 暑い/寒い describe weather, not object temperature. 早い illustrates time, not speed (速い). Never assign diagrams by category or randomly.

Antonym connections must name an existing appropriate opposite and open its Details dialog. Study Mode hides English until revealed, keeping Japanese and romaji visible. Audio retains the existing browser speech feature.

Adjective groups are explicit, not inferred from spelling. A pos override refines a browsing category: おすすめ is a noun, 三回 a counter phrase, 週 a counter, and です the polite copula.

同じ is labeled as a special adjective: 同じ + noun (no な before ordinary nouns), and 同じです predicatively. 同じなのです is a separate explanatory construction. It is excluded from the ordinary な-adjective list. Usage checked against [TUFS](https://www.coelang.tufs.ac.jp/modules/ja/vmod/v_search_detail.php?id=239&ls=%E3%81%8A&rf=3) (attributive and predicative examples) and [Kanjipedia](https://www.kanjipedia.jp/kotoba/0005255200) (direct noun modification).
