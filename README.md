# Nichi N2 — JLPT N2 for Burmese speakers

Local-first JLPT N2 prep for Myanmar learners: **Tango 2500-style vocabulary**, **総まとめ N2 漢字**, 170+ grammar patterns, reading, listening, a timed mock exam, and a daily study journal. Explanations are in **မြန်မာ** and Japanese. Nothing is uploaded.

Vocabulary chapters follow a Tango 2500-style 章 → 節 layout. Kanji follows the 8-week × 7-day scene layout of *日本語総まとめ N2 漢字* (Ask Publishing). Word lists, readings, stroke diagrams, and example sentences come from open data — not from those publications.

## Modules

- **語彙 · Tango 2500** — 20 chapters / 2 sections each. Word cards with kanji, furigana, 品詞, 自動詞・他動詞, Burmese meaning, example sentences, and a speed-controlled audio player. Chapter quizzes + 星問題.
- **漢字 · 日本語総まとめ N2 漢字** — 8 weeks × 7 days (days 1–6 study, day 7 実戦問題). On/kun (KANJIDIC2), radical, stroke order (KanjiVG + writing pad), 熟語, furigana example sentences (Tatoeba) with Burmese, week-end quizzes + 星問題.
- **文法** — 170+ N2 patterns with 接続, Burmese notes, nuance compare, 星問題 sorting.
- **複合動詞・慣用句** — compound verbs and idioms with Burmese glosses.
- **読解** — short / medium / long / 情報検索 passages with click-to-translate and Burmese answer notes.
- **聴解** — five exam sections (課題理解, ポイント理解, 概要理解, 即時応答, 統合理解), 0.8x–1.2x player, JP/MY script toggle.
- **模擬試験** — timed 言語知識・読解 105 min + 聴解 50 min; scaled scores, pass at 90/180 with 19-point sectional cut-offs.
- **Journal** — daily logger, streak, heatmap, Pomodoro, exam countdown.

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Data models

TypeScript interfaces live in `src/lib/jlpt/types.ts`. Tango chapters are in `src/data/books.ts`. Kanji weeks are in `src/data/soumatome-kanji.ts` (`chapterId` / `sectionId`). OpenJLPT JSON in `public/data/` is assigned into those weeks at load time (`src/lib/jlpt/curriculum.ts`).

## Data & licenses

Clickable credits also appear on the kanji hub and detail pages.

- **Textbook layout:** [日本語総まとめ N2 漢字](https://www.ask-books.com/jlpt/n2/) — Ask Publishing. Scene/week structure only; no book text.
- **Kanji stroke order:** [KanjiVG](https://github.com/KanjiVG/kanjivg) — CC BY-SA 3.0
- **Kanji dictionary:** [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) — EDRDG
- **Example sentences:** [Tatoeba Project](https://tatoeba.org) — CC BY 2.0
- Vocab/kanji JSON in `public/data/` is derived from [OpenJLPT](https://github.com/evanclan/OpenJLPT) (CC BY-SA 4.0). See `public/data/ATTRIBUTION.md`.
- Burmese grammar notes, reading passages, listening scripts, mock-exam copy, and the Tango *chapter shells* are original Nichi content.
- Audio uses the browser `speechSynthesis` Japanese voice when available (no bundled commercial audio files). The player UI exposes 0.8x–1.2x like an HTML5 control.
