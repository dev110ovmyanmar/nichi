# Nichi N2 — JLPT N2 for Burmese speakers

Local-first JLPT N2 prep for Myanmar learners: **Tango 2500-style vocabulary**, **Kanji Master-style kanji**, 170+ grammar patterns, reading, listening, a timed mock exam, and a daily study journal. Explanations are in **မြန်မာ** and Japanese. Nothing is uploaded.

Chapter and section shells follow the *course-book layout* of Kanji Master N2 and Tango Nihongo 2500 (章 → 節 → items). Word lists, example sentences, and Burmese notes are original or from OpenJLPT — not copied from those publications.

## Modules

- **語彙 · Tango 2500** — 20 chapters / 2 sections each. Word cards with kanji, furigana, 品詞, 自動詞・他動詞, Burmese meaning, example sentences, and a speed-controlled audio player. Chapter quizzes + 星問題.
- **漢字 · Kanji Master** — 16 chapters. On/kun, radical, stroke order (KanjiVG + writing pad), 熟語, furigana example sentences with Burmese, chapter-end quizzes + 星問題.
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

TypeScript interfaces live in `src/lib/jlpt/types.ts`. Curriculum chapters are in `src/data/books.ts` (`chapterId` / `sectionId`). OpenJLPT JSON in `public/data/` is assigned into those chapters at load time (`src/lib/jlpt/curriculum.ts`).

## Kanji Master PDF ingest

If you have `kanji_master_n2.pdf`, extract chapter / section / kanji / 音訓 / 熟語 / 例文 **one page at a time** into SQLite (optional JSONL):

```bash
pip install -r scripts/requirements-ingest.txt
python scripts/ingest_kanji_master.py --pdf kanji_master_n2.pdf --db kanji_n2.db --jsonl kanji_n2.jsonl
```

The script prints `Processing page X of Y...`, never loads the whole PDF into RAM, and writes each entry as it goes. Place the PDF next to the command, or pass `--pdf`. Extracted textbook text stays local (`kanji_n2.db` is gitignored).

## Data & licenses

- Vocab/kanji JSON in `public/data/` is derived from [OpenJLPT](https://github.com/evanclan/OpenJLPT) (CC BY-SA 4.0), which uses JMdict/KANJIDIC2 (EDRDG), tanos.co.uk level tags (CC BY), and Tatoeba examples (CC BY 2.0 FR). See `public/data/ATTRIBUTION.md`.
- Burmese grammar notes, reading passages, listening scripts, mock-exam copy, and the Tango / Kanji Master *chapter shells* are original Nichi content.
- Audio uses the browser `speechSynthesis` Japanese voice when available (no bundled commercial audio files). The player UI exposes 0.8x–1.2x like an HTML5 control.
