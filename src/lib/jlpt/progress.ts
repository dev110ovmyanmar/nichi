import type { QuizKind } from "@/lib/jlpt/types"
import { idbSet } from "@/lib/jlpt/idb"

const KEY = "nichi.jlpt-progress.v1"

export type JlptProgress = {
  bookmarks: {
    vocab: string[]
    kanji: string[]
    grammar: string[]
    compounds: string[]
  }
  knownVocab: string[]
  knownKanji: string[]
  completedChapters: {
    tango: string[]
    kanji: string[]
  }
  lastVocabId: string | null
  lastGrammarId: string | null
  lastReadingId: string | null
  quizHistory: Array<{
    id: string
    kind: QuizKind
    score: number
    total: number
    at: string
    chapterId?: string
  }>
}

const empty: JlptProgress = {
  bookmarks: { vocab: [], kanji: [], grammar: [], compounds: [] },
  knownVocab: [],
  knownKanji: [],
  completedChapters: { tango: [], kanji: [] },
  lastVocabId: null,
  lastGrammarId: null,
  lastReadingId: null,
  quizHistory: [],
}

let memory: JlptProgress | null = null

function read(): JlptProgress {
  if (memory) return memory
  if (typeof window === "undefined") return empty
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      memory = {
        ...empty,
        bookmarks: { vocab: [], kanji: [], grammar: [], compounds: [] },
        completedChapters: { tango: [], kanji: [] },
      }
      return memory
    }
    const parsed = JSON.parse(raw) as Partial<JlptProgress>
    memory = {
      ...empty,
      ...parsed,
      bookmarks: { ...empty.bookmarks, ...parsed.bookmarks },
      completedChapters: {
        ...empty.completedChapters,
        ...parsed.completedChapters,
      },
    }
    return memory
  } catch {
    memory = empty
    return empty
  }
}

function write(next: JlptProgress) {
  memory = next
  localStorage.setItem(KEY, JSON.stringify(next))
  void idbSet(KEY, next)
}

export function loadProgress() {
  return read()
}

export function saveProgress(patch: Partial<JlptProgress>) {
  const current = read()
  const next = { ...current, ...patch }
  write(next)
  return next
}

export function toggleList(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}

export const JLPT_CUTOFF = {
  overall: 90,
  section: 19,
  maxOverall: 180,
  maxSection: 60,
}

export function scaleSection(correct: number, total: number) {
  if (total === 0) return 0
  return Math.round((correct / total) * JLPT_CUTOFF.maxSection)
}

export function passedN2(language: number, reading: number, listening: number) {
  const overall = language + reading + listening
  return (
    overall >= JLPT_CUTOFF.overall &&
    language >= JLPT_CUTOFF.section &&
    reading >= JLPT_CUTOFF.section &&
    listening >= JLPT_CUTOFF.section
  )
}
