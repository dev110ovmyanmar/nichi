import { SOUMATOME_GOI_WEEKS } from "@/data/soumatome-goi"
import { SOUMATOME_KANJI_DAY } from "@/data/soumatome-kanji-map"
import { SOUMATOME_KANJI_WEEKS } from "@/data/soumatome-kanji"
import type {
  CurriculumChapter,
  CurriculumSection,
  ExampleSentence,
  KanjiEntry,
  VocabEntry,
} from "@/lib/jlpt/types"
import { displayMeaning } from "@/lib/jlpt/burmese"

type RawVocab = Omit<VocabEntry, "chapterId" | "sectionId" | "order"> & {
  chapterId?: string
  sectionId?: string
  order?: number
}

type RawKanji = Omit<
  KanjiEntry,
  "chapterId" | "sectionId" | "order" | "radical" | "radicalMy" | "examples"
> & {
  chapterId?: string
  sectionId?: string
  order?: number
  radical?: string
  radicalMy?: string
  examples?: ExampleSentence[]
}

function blob(parts: string[]) {
  return parts.join(" ").toLowerCase()
}

function scoreKeywords(text: string, keywords: string[]) {
  let score = 0
  for (const keyword of keywords) {
    if (!keyword) continue
    if (text.includes(keyword.toLowerCase())) {
      score += keyword.length >= 6 ? 3 : 2
    }
  }
  return score
}

export function studySections(chapter: CurriculumChapter) {
  const withKeywords = chapter.sections.filter((section) => section.keywords.length > 0)
  return withKeywords.length ? withKeywords : chapter.sections
}

function isKatakanaWord(word: string) {
  return word.length > 0 && [...word].every((ch) => /[\u30A0-\u30FFー・]/.test(ch))
}

function isHiraganaWord(word: string) {
  return word.length > 0 && [...word].every((ch) => /[\u3040-\u309Fー]/.test(ch))
}

type Slot = { chapter: CurriculumChapter; section: CurriculumSection }

function allStudySlots(chapters: CurriculumChapter[]): Slot[] {
  return chapters.flatMap((chapter) =>
    studySections(chapter).map((section) => ({ chapter, section }))
  )
}

function takeSlot(
  ranked: Array<Slot & { score: number }>,
  counts: Record<string, number>
) {
  const best = ranked[0]?.score ?? 0
  const pool = ranked.filter((item) => (best > 0 ? item.score === best : true))
  pool.sort(
    (a, b) =>
      (counts[a.section.id] ?? 0) - (counts[b.section.id] ?? 0) ||
      a.section.id.localeCompare(b.section.id)
  )
  return pool[0]
}

export function assignVocab(raw: RawVocab[]): VocabEntry[] {
  const counts: Record<string, number> = {}
  const slots = allStudySlots(SOUMATOME_GOI_WEEKS)
  const adverbWeek = SOUMATOME_GOI_WEEKS[3]
  const katakanaWeek = SOUMATOME_GOI_WEEKS[5]
  const kangoWeek = SOUMATOME_GOI_WEEKS[4]
  const reviewWeek = SOUMATOME_GOI_WEEKS[7]

  return raw.map((item) => {
    const text = blob([item.word, item.reading, item.pos, ...item.meanings])
    let ranked = slots.map((slot) => ({
      ...slot,
      score: scoreKeywords(text, slot.section.keywords),
    }))

    if (isKatakanaWord(item.word) && katakanaWeek) {
      ranked = ranked.map((slot) =>
        slot.chapter.id === katakanaWeek.id
          ? { ...slot, score: Math.max(slot.score, 8) }
          : slot
      )
    } else if (
      (isHiraganaWord(item.word) || item.pos === "副詞") &&
      adverbWeek
    ) {
      ranked = ranked.map((slot) =>
        slot.chapter.id === adverbWeek.id
          ? { ...slot, score: Math.max(slot.score, 8) }
          : slot
      )
    }

    ranked.sort((a, b) => b.score - a.score)
    let chosen = takeSlot(ranked, counts)

    if ((chosen?.score ?? 0) === 0) {
      const fallback = item.level === "N3" ? reviewWeek : kangoWeek
      const days = fallback ? studySections(fallback) : studySections(SOUMATOME_GOI_WEEKS[4])
      const section = [...days].sort(
        (a, b) => (counts[a.id] ?? 0) - (counts[b.id] ?? 0)
      )[0]
      chosen = {
        chapter: fallback ?? SOUMATOME_GOI_WEEKS[4],
        section,
        score: 0,
      }
    }

    const key = chosen.section.id
    counts[key] = (counts[key] ?? 0) + 1
    return {
      ...item,
      examples: item.examples ?? [],
      chapterId: chosen.chapter.id,
      sectionId: chosen.section.id,
      order: counts[key],
    }
  })
}

export function assignKanji(raw: RawKanji[], vocab: VocabEntry[]): KanjiEntry[] {
  const counts: Record<string, number> = {}
  return raw.map((item) => {
    const sectionId = SOUMATOME_KANJI_DAY[item.character]
    const located = SOUMATOME_KANJI_WEEKS.flatMap((chapter) =>
      chapter.sections
        .filter((section) => section.id === sectionId)
        .map((section) => ({ chapter, section }))
    )[0]
    const chapter = located?.chapter ?? SOUMATOME_KANJI_WEEKS[0]
    const section = located?.section ?? studySections(chapter)[0]
    const related = vocab.filter((word) => word.word.includes(item.character)).slice(0, 4)
    const examples: ExampleSentence[] =
      item.examples?.length
        ? item.examples
        : related.flatMap((word) =>
            word.examples.slice(0, 1).map((example) => ({
              ja: example.ja,
              en: example.en,
              my: example.my ?? displayMeaning(word.meanings, word.meaningMy),
            }))
          )
    const key = section.id
    counts[key] = (counts[key] ?? 0) + 1
    return {
      ...item,
      chapterId: chapter.id,
      sectionId: section.id,
      order: counts[key],
      radical: item.radical ?? chapter.radical ?? "⼀",
      radicalMy: item.radicalMy ?? chapter.radicalMy ?? "ရင်းမြစ်",
      examples,
      compounds: item.compounds ?? related.map((word) => word.word),
    }
  })
}

export function itemsInChapter<T extends { chapterId: string }>(
  items: T[],
  chapterId: string
) {
  return items.filter((item) => item.chapterId === chapterId)
}

export function itemsInSection<T extends { sectionId: string; order: number }>(
  items: T[],
  sectionId: string
) {
  return items.filter((item) => item.sectionId === sectionId).sort((a, b) => a.order - b.order)
}

export function chapterProgress<T extends { id: string; chapterId: string }>(
  items: T[],
  chapterId: string,
  knownIds: string[]
) {
  const inChapter = itemsInChapter(items, chapterId)
  const known = inChapter.filter((item) => knownIds.includes(item.id)).length
  return {
    total: inChapter.length,
    known,
    percent: inChapter.length ? Math.round((known / inChapter.length) * 100) : 0,
  }
}
