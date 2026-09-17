# Nichi N2 — JLPT N2 for Burmese speakers

Local-first JLPT N2 prep: vocabulary, kanji, grammar, reading, listening, a timed mock exam, and the original daily study journal. Explanations are in **မြန်မာ** and Japanese. Nothing is uploaded.

## Modules

- **語彙** — 3,500+ N2+N3 words (OpenJLPT), furigana, 自動詞/他動詞 tags when inferred, bookmarks, TTS.
- **漢字** — 367 N2 kanji, on/kun, stroke count, KanjiVG stroke order + writing pad, compound links.
- **文法** — 60+ N2 patterns with 接続, Burmese notes, nuance compare, 星問題 sorting.
- **複合動詞・慣用句** — compound verbs and idioms with Burmese glosses.
- **読解** — short / medium / long / 情報検索 passages with click-to-translate and Burmese answer notes.
- **聴解** — five exam sections, 0.8x–1.2x Japanese speech, JP/MY script toggle.
- **模擬試験** — scaled Language / Reading / Listening scores, pass at 90/180 with 19-point sectional cut-offs.
- **Journal** — daily logger, streak, heatmap, Pomodoro, exam countdown (bell settings).

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

## Data & licenses

- Vocab/kanji JSON in `public/data/` is derived from [OpenJLPT](https://github.com/evanclan/OpenJLPT) (CC BY-SA 4.0), which uses JMdict/KANJIDIC2 (EDRDG), tanos.co.uk level tags (CC BY), and Tatoeba examples (CC BY 2.0 FR). See `public/data/ATTRIBUTION.md`.
- Burmese grammar notes, reading passages, listening scripts, and mock-exam copy are original.
- Progress: `localStorage` keys `nichi.jlpt-progress.v1` and `nichi.study-store.v2`.

Listening uses the browser `speechSynthesis` Japanese voice when available (no bundled audio files).
