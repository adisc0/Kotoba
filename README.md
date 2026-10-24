# Kotoba — Alken's Japanese reference

A static reference book: searchable vocabulary, verb forms and examples, lessons,
a grammar index, kana charts, and an interactive Japanese clock. No login,
database, runtime dependencies, or progress synchronization.

## Open or preview

Open the root `index.html` in a browser. Keep its `assets/` folder alongside it.
For an HTTP preview, run `pnpm build`, then `pnpm preview` and visit
http://127.0.0.1:4173.

## Develop

Requires Node.js 24 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

The browser tests use installed Microsoft Edge on Windows. On other systems,
run `pnpm exec playwright install chromium` first.

Edit source files, then rebuild. Root `index.html`, `assets/`, and `dist/` are
generated; direct edits to generated files will be overwritten.

| Source | Purpose |
|---|---|
| `src/data/words.json` | Vocabulary, readings, meanings and examples |
| `src/data/lessons.json` | Shared lesson material and grammar patterns |
| `src/data/forms.json` | Precomputed verb forms, translations and examples |
| `src/data/grammar.json` | Verified sentence segments for grammar colors |
| `src/app.js` | Dictionary, lessons, grammar, popups and display preferences |
| `src/kana.js` | Kana data, charts and sound cues |
| `src/numbers-time.js` | Numbers, time readings and clock interactions |
| `src/styles.css` | Shared styling |
| `src/index.html` | Page structure |

Use unique word and lesson IDs. Check new forms and translations before adding
them. Examples without grammar annotations remain readable in the normal text
color rather than guessing their grammar.

## Build and publishing

`build.mjs` combines shared content and source scripts into one minified classic
JavaScript bundle and one optimized stylesheet. Content hashes in asset names
prevent stale releases. Relative paths support GitHub Pages project subpaths
and opening the local HTML file. Dependencies are build/test tools only.

The publishing folder is `dist/`: HTML, stylesheet, script and `.nojekyll` only.
Source files, tests, archives, and node_modules are not included.

For GitHub Pages, make this Kotoba folder the repository root, push to `main`,
and choose **GitHub Actions** as the Pages source in repository settings. The
included workflow builds, tests and deploys `dist/`. This workspace has not been
published or connected to GitHub yet.

## Content and preferences

Content changes happen in source files and are published together. Every device
then sees the same reference. There is no browser-only word editor.

Only display choices (theme, reading hints, text size, kana layout/set) use local
storage. These can differ by device without affecting reference content.

Previous browser data is never deleted. If old personal words or lesson notes
are found, **Display & about** offers a recovery download so useful material can
be reviewed and added to shared content. The pre-refactor app and development
scripts are retained locally under `.history/`, excluded from Git and publishing.
