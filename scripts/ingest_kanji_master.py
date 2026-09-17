#!/usr/bin/env python3
"""Ingest Kanji Master N2 PDFs page-by-page into SQLite (and optional JSONL).

Designed for large files: one page is loaded at a time, parsed with regex,
then inserted immediately so the full document is never held in memory.

Usage:
  python scripts/ingest_kanji_master.py
  python scripts/ingest_kanji_master.py --pdf /path/to/kanji_master_n2.pdf
  python scripts/ingest_kanji_master.py --pdf book.pdf --db kanji_n2.db --jsonl kanji_n2.jsonl

Requires: pymupdf (import fitz)
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
from dataclasses import dataclass, field
from pathlib import Path

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz  # PyMuPDF legacy import
    except ImportError:  # pragma: no cover
        sys.stderr.write("Install PyMuPDF first:  pip install pymupdf\n")
        raise

KANJI_CHAR = re.compile(r"^[一-龯]$")
KANJI_RUN = re.compile(r"[一-龯々〆ヵヶ]")
HIRAGANA = re.compile(r"[ぁ-ゖー]+")
KATAKANA = re.compile(r"[ァ-ヶー]+")

CHAPTER_RE = re.compile(
    r"第\s*([0-9０-９一二三四五六七八九十]+)\s*(章|課|回|週)\s*([^\n]{0,40})"
)
SECTION_RE = re.compile(
    r"(?:第\s*([0-9０-９一二三四五六七八九十]+)\s*節\s*([^\n]{0,40})|"
    r"([0-9０-９]+)\s*[．.\-−]\s*([^\n]{1,40}))"
)
NUMBERED_KANJI_RE = re.compile(
    r"(?:^|\n)\s*(?:No\.?\s*)?([0-9０-９]{1,3})\s*([一-龯])\s*(?:\n|$)"
)
ONYOMI_LABEL_RE = re.compile(
    r"(?:音(?:読(?:み)?)?|オンヨミ|Onyomi)\s*[:：]?\s*([ァ-ヶー・･/／,、\s]+)",
    re.IGNORECASE,
)
KUNYOMI_LABEL_RE = re.compile(
    r"(?:訓(?:読(?:み)?)?|クンヨミ|Kunyomi)\s*[:：]?\s*([ぁ-ゖー・･.．っゃゅょ/／,、\s]+)",
    re.IGNORECASE,
)
VOCAB_RE = re.compile(
    r"([一-龯々〆ヵヶ]{2,8})\s*[（(]?\s*([ぁ-ゖァ-ヶー・]{2,})\s*[）)]?\s*([^\n]{0,60})"
)
PARTICLES = {"を", "に", "は", "が", "と", "で", "の", "も", "へ"}
EXAMPLE_RE = re.compile(
    r"(?:例(?:文)?\s*[）):：．.]?\s*)?([^\n。]{6,100}。)"
)
ZEN_DIGITS = str.maketrans("０１２３４５６７８９", "0123456789")
KANJI_NUMERALS = {
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10,
}


def parse_jp_int(value: str) -> int | None:
    if not value:
        return None
    text = value.translate(ZEN_DIGITS).strip()
    if text.isdigit():
        return int(text)
    if text in KANJI_NUMERALS:
        return KANJI_NUMERALS[text]
    if "十" in text:
        left, _, right = text.partition("十")
        tens = KANJI_NUMERALS.get(left, 1 if not left else None)
        ones = KANJI_NUMERALS.get(right, 0) if right else 0
        if tens is None:
            return None
        return tens * 10 + ones
    return None


def clean_reading_list(blob: str, kind: str) -> list[str]:
    parts = re.split(r"[・･/／,、\s]+", blob.strip())
    out: list[str] = []
    for part in parts:
        token = part.strip(" .．")
        if not token:
            continue
        if kind == "on" and not KATAKANA.fullmatch(token.replace("ー", "ア")):
            if not KATAKANA.search(token):
                continue
        if kind == "kun" and not HIRAGANA.search(token):
            continue
        if token not in out:
            out.append(token)
    return out


def default_pdf_path() -> Path | None:
    names = (
        "kanji_master_n2.pdf",
        "Kanji_Master_N2.pdf",
        "漢字マスターN2.pdf",
    )
    roots = (
        Path.cwd(),
        Path(__file__).resolve().parent.parent,
        Path(__file__).resolve().parent,
        Path.cwd() / "data",
        Path.cwd() / "public" / "data",
    )
    for root in roots:
        for name in names:
            candidate = root / name
            if candidate.is_file():
                return candidate
    return None


SCHEMA = """
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pages (
  page INTEGER PRIMARY KEY,
  chapter TEXT,
  section TEXT,
  raw_chars INTEGER
);

CREATE TABLE IF NOT EXISTS kanji (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character TEXT NOT NULL,
  onyomi TEXT NOT NULL DEFAULT '[]',
  kunyomi TEXT NOT NULL DEFAULT '[]',
  chapter TEXT,
  chapter_number INTEGER,
  section TEXT,
  section_number INTEGER,
  page INTEGER NOT NULL,
  source_order INTEGER,
  UNIQUE (character, page, source_order)
);

CREATE TABLE IF NOT EXISTS vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kanji_id INTEGER NOT NULL,
  word TEXT NOT NULL,
  reading TEXT,
  gloss TEXT,
  page INTEGER NOT NULL,
  FOREIGN KEY (kanji_id) REFERENCES kanji(id)
);

CREATE TABLE IF NOT EXISTS examples (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kanji_id INTEGER NOT NULL,
  vocab_id INTEGER,
  sentence TEXT NOT NULL,
  page INTEGER NOT NULL,
  FOREIGN KEY (kanji_id) REFERENCES kanji(id),
  FOREIGN KEY (vocab_id) REFERENCES vocabulary(id)
);

CREATE INDEX IF NOT EXISTS idx_kanji_char ON kanji(character);
CREATE INDEX IF NOT EXISTS idx_kanji_chapter ON kanji(chapter_number, section_number);
CREATE INDEX IF NOT EXISTS idx_vocab_word ON vocabulary(word);
"""


@dataclass
class VocabHit:
    word: str
    reading: str
    gloss: str


@dataclass
class KanjiEntry:
    character: str
    onyomi: list[str] = field(default_factory=list)
    kunyomi: list[str] = field(default_factory=list)
    vocabulary: list[VocabHit] = field(default_factory=list)
    examples: list[str] = field(default_factory=list)
    chapter: str = ""
    chapter_number: int | None = None
    section: str = ""
    section_number: int | None = None
    page: int = 0
    source_order: int = 0

    def merge_readings(self, onyomi: list[str], kunyomi: list[str]) -> None:
        for item in onyomi:
            if item not in self.onyomi:
                self.onyomi.append(item)
        for item in kunyomi:
            if item not in self.kunyomi:
                self.kunyomi.append(item)


def page_lines_from_dict(payload: dict) -> tuple[list[str], list[tuple[float, str]]]:
    """Reading-order lines plus (font_size, text) spans for heading kanji."""
    rows: list[tuple[float, float, float, str]] = []
    spans: list[tuple[float, str]] = []
    for block in payload.get("blocks", []):
        if block.get("type", 0) != 0:
            continue
        for line in block.get("lines", []):
            pieces: list[str] = []
            sizes: list[float] = []
            y0 = line.get("bbox", [0, 0, 0, 0])[1]
            x0 = line.get("bbox", [0, 0, 0, 0])[0]
            for span in line.get("spans", []):
                text = span.get("text", "")
                size = float(span.get("size") or 0)
                if text.strip():
                    pieces.append(text)
                    sizes.append(size)
                    spans.append((size, text.strip()))
            joined = "".join(pieces).strip()
            if joined:
                avg = sum(sizes) / len(sizes) if sizes else 0
                rows.append((y0, x0, avg, joined))
    rows.sort(key=lambda item: (round(item[0], 1), item[1]))
    return [item[3] for item in rows], spans


def large_kanji(spans: list[tuple[float, str]]) -> list[str]:
    body = [size for size, text in spans if len(text) > 1]
    if not body:
        return []
    body.sort()
    median = body[len(body) // 2]
    threshold = max(median * 1.35, median + 2.5)
    found: list[str] = []
    for size, text in spans:
        if size < threshold:
            continue
        for char in text:
            if KANJI_CHAR.match(char) and char not in found:
                found.append(char)
    return found


def detect_headings(text: str, current: dict[str, object]) -> None:
    chapter = CHAPTER_RE.search(text)
    if chapter:
        number = parse_jp_int(chapter.group(1))
        title = f"第{chapter.group(1)}{chapter.group(2)} {chapter.group(3).strip()}".strip()
        current["chapter"] = title
        current["chapter_number"] = number
    section = SECTION_RE.search(text)
    if section:
        if section.group(1):
            number = parse_jp_int(section.group(1))
            rest = (section.group(2) or "").strip()
            title = f"第{section.group(1)}節 {rest}".strip()
        else:
            number = parse_jp_int(section.group(3) or "")
            title = (section.group(4) or section.group(0)).strip()
        current["section"] = title[:80]
        current["section_number"] = number


def vocab_from_line(line: str, kanji: str) -> list[VocabHit]:
    stripped = line.strip()
    if stripped.startswith(("例文", "例）", "例:", "例：", "例.")):
        return []
    hits: list[VocabHit] = []
    for match in VOCAB_RE.finditer(line):
        word, reading, gloss = match.group(1), match.group(2), match.group(3).strip()
        if kanji not in word or word == kanji:
            continue
        if reading in PARTICLES:
            continue
        gloss = re.sub(r"^[：:\-−]\s*", "", gloss)
        gloss = gloss.strip(" ・/／")
        if gloss in {"音読み", "訓読み", "音", "訓", "例文", "例"}:
            gloss = ""
        if gloss.endswith("。"):
            gloss = ""
        hits.append(VocabHit(word=word, reading=reading, gloss=gloss[:80]))
    return hits


def examples_from_line(line: str) -> list[str]:
    stripped = line.strip()
    labeled = stripped.startswith(("例文", "例）", "例:", "例：", "例.", "例 "))
    if "。" not in stripped and not labeled:
        return []
    if not labeled and re.match(
        r"[一-龯々〆ヵヶ]{2,8}\s*[（(]?[ぁ-ゖァ-ヶー・]{2,}[）)]?",
        stripped,
    ):
        return []
    found: list[str] = []
    for match in EXAMPLE_RE.finditer(stripped):
        sentence = match.group(1).strip()
        if not KANJI_RUN.search(sentence):
            continue
        if sentence not in found:
            found.append(sentence)
    return found


def parse_page(
    page_no: int,
    text: str,
    payload: dict,
    current: dict[str, object],
) -> list[KanjiEntry]:
    detect_headings(text, current)
    lines, spans = page_lines_from_dict(payload)
    joined = "\n".join(lines) if lines else text

    ordered: list[str] = []
    for match in NUMBERED_KANJI_RE.finditer(joined):
        char = match.group(2)
        if char not in ordered:
            ordered.append(char)
    for char in large_kanji(spans):
        if char not in ordered:
            ordered.append(char)

    if not ordered:
        return []

    # Split the page into slices starting at each numbered/large kanji.
    slices: list[tuple[str, str]] = []
    positions: list[tuple[int, str]] = []
    for char in ordered:
        numbered = re.search(
            rf"(?:^|\n)\s*(?:No\.?\s*)?[0-9０-９]{{1,3}}\s*{re.escape(char)}\s*(?:\n|$)",
            joined,
        )
        idx = numbered.start() if numbered else joined.find(char)
        if idx < 0:
            idx = 0
        positions.append((idx, char))
    positions.sort(key=lambda item: item[0])
    for i, (idx, char) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(joined)
        slices.append((char, joined[idx:end]))

    entries: list[KanjiEntry] = []
    for order, (char, chunk) in enumerate(slices, start=1):
        entry = KanjiEntry(
            character=char,
            chapter=str(current.get("chapter") or ""),
            chapter_number=current.get("chapter_number")  # type: ignore[arg-type]
            if isinstance(current.get("chapter_number"), int)
            else None,
            section=str(current.get("section") or ""),
            section_number=current.get("section_number")  # type: ignore[arg-type]
            if isinstance(current.get("section_number"), int)
            else None,
            page=page_no,
            source_order=order,
        )
        on_match = ONYOMI_LABEL_RE.search(chunk)
        kun_match = KUNYOMI_LABEL_RE.search(chunk)
        if on_match:
            entry.merge_readings(clean_reading_list(on_match.group(1), "on"), [])
        if kun_match:
            entry.merge_readings([], clean_reading_list(kun_match.group(1), "kun"))
        if not entry.onyomi:
            # Fallback: katakana-only line near the headword.
            for line in chunk.splitlines()[:8]:
                compact = line.strip()
                if KATAKANA.fullmatch(compact.replace("・", "").replace("ー", "ア")):
                    entry.merge_readings(clean_reading_list(compact, "on"), [])
                    break
        if not entry.kunyomi:
            for line in chunk.splitlines()[:10]:
                compact = line.strip()
                if HIRAGANA.fullmatch(compact.replace("・", "").replace(".", "")):
                    entry.merge_readings([], clean_reading_list(compact, "kun"))
                    break
        for line in chunk.splitlines():
            for vocab in vocab_from_line(line, char):
                if all(existing.word != vocab.word for existing in entry.vocabulary):
                    entry.vocabulary.append(vocab)
            for sentence in examples_from_line(line):
                if sentence not in entry.examples:
                    entry.examples.append(sentence)
        entries.append(entry)
    return entries


def connect_db(path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(SCHEMA)
    return conn


def insert_entry(
    conn: sqlite3.Connection,
    entry: KanjiEntry,
    jsonl_fp,
) -> None:
    cursor = conn.execute(
        """
        INSERT OR IGNORE INTO kanji (
          character, onyomi, kunyomi, chapter, chapter_number,
          section, section_number, page, source_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            entry.character,
            json.dumps(entry.onyomi, ensure_ascii=False),
            json.dumps(entry.kunyomi, ensure_ascii=False),
            entry.chapter or None,
            entry.chapter_number,
            entry.section or None,
            entry.section_number,
            entry.page,
            entry.source_order,
        ),
    )
    kanji_id = cursor.lastrowid
    if not kanji_id:
        row = conn.execute(
            """
            SELECT id FROM kanji
            WHERE character = ? AND page = ? AND source_order = ?
            """,
            (entry.character, entry.page, entry.source_order),
        ).fetchone()
        kanji_id = row[0] if row else None
    if not kanji_id:
        return

    vocab_ids: dict[str, int] = {}
    for vocab in entry.vocabulary:
        vocab_cursor = conn.execute(
            """
            INSERT INTO vocabulary (kanji_id, word, reading, gloss, page)
            VALUES (?, ?, ?, ?, ?)
            """,
            (kanji_id, vocab.word, vocab.reading, vocab.gloss or None, entry.page),
        )
        vocab_ids[vocab.word] = vocab_cursor.lastrowid

    for sentence in entry.examples:
        linked = None
        for word, vid in vocab_ids.items():
            if word in sentence:
                linked = vid
                break
        conn.execute(
            """
            INSERT INTO examples (kanji_id, vocab_id, sentence, page)
            VALUES (?, ?, ?, ?)
            """,
            (kanji_id, linked, sentence, entry.page),
        )

    if jsonl_fp is not None:
        payload = {
            "character": entry.character,
            "onyomi": entry.onyomi,
            "kunyomi": entry.kunyomi,
            "chapter": entry.chapter,
            "chapterNumber": entry.chapter_number,
            "section": entry.section,
            "sectionNumber": entry.section_number,
            "page": entry.page,
            "order": entry.source_order,
            "vocabulary": [
                {"word": item.word, "reading": item.reading, "gloss": item.gloss}
                for item in entry.vocabulary
            ],
            "examples": entry.examples,
        }
        jsonl_fp.write(json.dumps(payload, ensure_ascii=False) + "\n")
        jsonl_fp.flush()


def ingest(pdf_path: Path, db_path: Path, jsonl_path: Path | None) -> dict[str, int]:
    doc = fitz.open(pdf_path)
    total = doc.page_count
    conn = connect_db(db_path)
    conn.execute(
        "INSERT OR REPLACE INTO meta(key, value) VALUES (?, ?)",
        ("source_pdf", str(pdf_path.resolve())),
    )
    conn.execute(
        "INSERT OR REPLACE INTO meta(key, value) VALUES (?, ?)",
        ("page_count", str(total)),
    )
    conn.commit()

    current: dict[str, object] = {
        "chapter": "",
        "chapter_number": None,
        "section": "",
        "section_number": None,
    }
    stats = {"pages": total, "kanji": 0, "vocab": 0, "examples": 0}
    jsonl_fp = jsonl_path.open("a", encoding="utf-8") if jsonl_path else None

    try:
        for index in range(total):
            page_no = index + 1
            print(f"Processing page {page_no} of {total}...", flush=True)
            page = doc.load_page(index)
            text = page.get_text("text") or ""
            payload = page.get_text("dict")
            del page

            entries = parse_page(page_no, text, payload, current)
            conn.execute(
                """
                INSERT OR REPLACE INTO pages(page, chapter, section, raw_chars)
                VALUES (?, ?, ?, ?)
                """,
                (
                    page_no,
                    str(current.get("chapter") or "") or None,
                    str(current.get("section") or "") or None,
                    len(text),
                ),
            )
            for entry in entries:
                insert_entry(conn, entry, jsonl_fp)
                stats["kanji"] += 1
                stats["vocab"] += len(entry.vocabulary)
                stats["examples"] += len(entry.examples)
            conn.commit()
            del text, payload, entries
    finally:
        if jsonl_fp is not None:
            jsonl_fp.close()
        doc.close()
        conn.close()
    return stats


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Parse Kanji Master N2 PDF page-by-page into SQLite."
    )
    parser.add_argument(
        "--pdf",
        type=Path,
        default=None,
        help="Path to kanji_master_n2.pdf (default: search cwd / data / public/data)",
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=Path("kanji_n2.db"),
        help="SQLite output (default: ./kanji_n2.db)",
    )
    parser.add_argument(
        "--jsonl",
        type=Path,
        default=None,
        help="Also append one JSON object per kanji entry to this file",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    pdf_path = args.pdf or default_pdf_path()
    if pdf_path is None or not pdf_path.is_file():
        sys.stderr.write(
            "Could not find kanji_master_n2.pdf. Pass it with --pdf /path/to/file.pdf\n"
        )
        return 2
    jsonl_path = args.jsonl
    if jsonl_path:
        jsonl_path.parent.mkdir(parents=True, exist_ok=True)
    args.db.parent.mkdir(parents=True, exist_ok=True)
    print(f"Opening {pdf_path} → {args.db}", flush=True)
    stats = ingest(pdf_path, args.db, jsonl_path)
    print(
        "Done. "
        f"{stats['pages']} pages, {stats['kanji']} kanji, "
        f"{stats['vocab']} vocab, {stats['examples']} examples.",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
