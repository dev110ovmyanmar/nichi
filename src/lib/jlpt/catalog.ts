import type { KanjiEntry, VocabEntry } from "@/lib/jlpt/types"

let vocabPromise: Promise<VocabEntry[]> | null = null
let kanjiPromise: Promise<KanjiEntry[]> | null = null

export function loadVocab(): Promise<VocabEntry[]> {
  if (!vocabPromise) {
    vocabPromise = fetch("/data/vocab.json").then((res) => {
      if (!res.ok) throw new Error("Could not load vocabulary")
      return res.json()
    })
  }
  return vocabPromise
}

export function loadKanji(): Promise<KanjiEntry[]> {
  if (!kanjiPromise) {
    kanjiPromise = fetch("/data/kanji.json").then((res) => {
      if (!res.ok) throw new Error("Could not load kanji")
      return res.json()
    })
  }
  return kanjiPromise
}

export const KANA_ROWS = [
  { id: "all", label: "全部" },
  { id: "あ", label: "あ", chars: "あいうえお" },
  { id: "か", label: "か", chars: "かきくけこがぎぐげご" },
  { id: "さ", label: "さ", chars: "さしすせそざじずぜぞ" },
  { id: "た", label: "た", chars: "たちつてとだぢづでど" },
  { id: "な", label: "な", chars: "なにぬねの" },
  { id: "は", label: "は", chars: "はひふへほばびぶべぼぱぴぷぺぽ" },
  { id: "ま", label: "ま", chars: "まみむめも" },
  { id: "や", label: "や", chars: "やゆよ" },
  { id: "ら", label: "ら", chars: "らりるれろ" },
  { id: "わ", label: "わ", chars: "わをん" },
] as const

export function readingHead(reading: string) {
  const ch = (reading || "").normalize("NFKC")[0] || ""
  return ch
}

export function matchesKanaRow(reading: string, rowId: string) {
  if (rowId === "all") return true
  const row = KANA_ROWS.find((item) => item.id === rowId)
  if (!row || !("chars" in row)) return true
  return row.chars.includes(readingHead(reading))
}
