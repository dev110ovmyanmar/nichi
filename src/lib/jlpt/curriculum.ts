import { TANGO_CHAPTERS } from "@/data/books"
import { SOUMATOME_KANJI_WEEKS } from "@/data/soumatome-kanji"
import type {
  CurriculumChapter,
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

function studySections(chapter: CurriculumChapter) {
  const withKeywords = chapter.sections.filter((section) => section.keywords.length > 0)
  return withKeywords.length ? withKeywords : chapter.sections
}

function bestSlot(text: string, chapters: CurriculumChapter[]) {
  const last = chapters[chapters.length - 1]
  const lastStudy = studySections(last).at(-1)!
  let best = {
    chapterId: last.id,
    sectionId: lastStudy.id,
    score: 0,
  }
  for (const chapter of chapters) {
    for (const section of studySections(chapter)) {
      const score = scoreKeywords(text, section.keywords)
      if (score > best.score) {
        best = { chapterId: chapter.id, sectionId: section.id, score }
      }
    }
  }
  return best
}

function kanaChapterFallback(reading: string) {
  const ch = (reading || "")[0] || "あ"
  const map: Record<string, string> = {
    あ: "t01",
    い: "t01",
    う: "t02",
    え: "t02",
    お: "t03",
    か: "t04",
    き: "t05",
    く: "t06",
    け: "t07",
    こ: "t08",
    さ: "t09",
    し: "t10",
    す: "t11",
    せ: "t12",
    そ: "t13",
    た: "t14",
    ち: "t15",
    つ: "t16",
    て: "t17",
    と: "t18",
    な: "t08",
    に: "t07",
    ぬ: "t02",
    ね: "t08",
    の: "t19",
    は: "t03",
    ひ: "t04",
    ふ: "t11",
    へ: "t05",
    ほ: "t02",
    ま: "t06",
    み: "t01",
    む: "t08",
    め: "t09",
    も: "t19",
    や: "t15",
    ゆ: "t11",
    よ: "t09",
    ら: "t12",
    り: "t13",
    る: "t17",
    れ: "t10",
    ろ: "t14",
    わ: "t20",
    を: "t20",
    ん: "t20",
    が: "t04",
    ぎ: "t05",
    ぐ: "t06",
    げ: "t07",
    ご: "t08",
    ざ: "t09",
    じ: "t10",
    ず: "t11",
    ぜ: "t12",
    ぞ: "t13",
    だ: "t14",
    ぢ: "t15",
    づ: "t16",
    で: "t17",
    ど: "t18",
    ば: "t03",
    び: "t04",
    ぶ: "t11",
    べ: "t05",
    ぼ: "t02",
    ぱ: "t03",
    ぴ: "t04",
    ぷ: "t11",
    ぺ: "t05",
    ぽ: "t02",
  }
  return map[ch] ?? "t20"
}

export function assignVocab(raw: RawVocab[]): VocabEntry[] {
  const counts: Record<string, number> = {}
  return raw.map((item) => {
    const text = blob([item.word, item.reading, item.pos, ...item.meanings])
    let slot = bestSlot(text, TANGO_CHAPTERS)
    if (slot.score === 0) {
      const chapterId = kanaChapterFallback(item.reading)
      const chapter = TANGO_CHAPTERS.find((entry) => entry.id === chapterId) ?? TANGO_CHAPTERS[19]
      const section =
        item.level === "N3" ? chapter.sections.at(-1)! : chapter.sections[0]
      slot = { chapterId: chapter.id, sectionId: section.id, score: 0 }
    }
    const verbChapter = TANGO_CHAPTERS.find((entry) => entry.id === "t17")
    if (item.transitivity && verbChapter && slot.score < 4) {
      const section =
        item.transitivity === "vi" ? verbChapter.sections[1] : verbChapter.sections[0]
      slot = { chapterId: verbChapter.id, sectionId: section.id, score: 4 }
    }
    const key = slot.sectionId
    counts[key] = (counts[key] ?? 0) + 1
    return {
      ...item,
      examples: item.examples ?? [],
      chapterId: slot.chapterId,
      sectionId: slot.sectionId,
      order: counts[key],
    }
  })
}

export function assignKanji(raw: RawKanji[], vocab: VocabEntry[]): KanjiEntry[] {
  const counts: Record<string, number> = {}
  return raw.map((item) => {
    const text = blob([item.character, ...item.onyomi, ...item.kunyomi, ...item.meanings])
    let slot = bestSlot(text, SOUMATOME_KANJI_WEEKS)
    if (slot.score === 0) {
      const weekIndex =
        item.strokes <= 7 ? 0 : item.strokes <= 10 ? 2 : item.strokes <= 13 ? 4 : 6
      const chapter = SOUMATOME_KANJI_WEEKS[weekIndex] ?? SOUMATOME_KANJI_WEEKS[7]
      const days = studySections(chapter)
      const section = days[item.strokes % days.length]
      slot = { chapterId: chapter.id, sectionId: section.id, score: 0 }
    }
    const chapter = SOUMATOME_KANJI_WEEKS.find((entry) => entry.id === slot.chapterId)
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
    const key = slot.sectionId
    counts[key] = (counts[key] ?? 0) + 1
    return {
      ...item,
      chapterId: slot.chapterId,
      sectionId: slot.sectionId,
      order: counts[key],
      radical: item.radical ?? chapter?.radical ?? "⼀",
      radicalMy: item.radicalMy ?? chapter?.radicalMy ?? "ရင်းမြစ်",
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
