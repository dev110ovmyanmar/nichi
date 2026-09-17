import { SOUMATOME_GOI_WEEKS } from "@/data/soumatome-goi"
import { SOUMATOME_KANJI_DAY } from "@/data/soumatome-kanji-map"
import { SOUMATOME_KANJI_SCENES } from "@/data/soumatome-kanji-scenes"
import { SOUMATOME_KANJI_WEEKS } from "@/data/soumatome-kanji"
import type {
  CurriculumChapter,
  CurriculumSection,
  ExampleSentence,
  KanjiEntry,
  VocabEntry,
} from "@/lib/jlpt/types"
import { displayMeaning } from "@/lib/jlpt/burmese"
import { isPracticeSection } from "@/lib/jlpt/labels"

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

export function studySections(chapter: CurriculumChapter) {
  const studying = chapter.sections.filter((section) => !isPracticeSection(section))
  return studying.length ? studying : chapter.sections
}

function isKatakanaWord(word: string) {
  return word.length > 0 && [...word].every((ch) => /[\u30A0-\u30FFー・]/.test(ch))
}

function isHiraganaWord(word: string) {
  return word.length > 0 && [...word].every((ch) => /[\u3040-\u309Fー]/.test(ch))
}

function kanjiCount(word: string) {
  return [...word].filter((ch) => /\p{Script=Han}/u.test(ch)).length
}

function isCompoundVerb(word: string, pos: string) {
  if (word.includes("を")) return true
  if (/^(引っ|取り|引き|打ち|押し|切り|言い|思い|乗り|走り|申し)/.test(word)) return true
  const hasOkurigana = /[ぁ-ん]/.test(word)
  return pos === "動詞" && kanjiCount(word) >= 2 && hasOkurigana
}

function isMimetic(word: string) {
  if (!isHiraganaWord(word) || word.length < 4) return false
  if (/(..)\1/.test(word.replace(/っ/g, ""))) return true
  return false
}

function looksAdverb(word: string, pos: string) {
  if (pos === "副詞") return true
  if (!isHiraganaWord(word) || pos === "動詞") return false
  if (["うどん", "おかず", "おくさん", "あかんぼう"].includes(word)) return false
  return /(?:ず|に|て|り|と|く|って)$/.test(word) || word.includes("っ")
}

type Slot = { chapter: CurriculumChapter; section: CurriculumSection }

function allStudySlots(chapters: CurriculumChapter[]): Slot[] {
  return chapters.flatMap((chapter) =>
    studySections(chapter).map((section) => ({ chapter, section }))
  )
}

function scoreStems(word: string, reading: string, stems: string[]) {
  let score = 0
  for (const stem of stems) {
    if (!stem || stem.startsWith("_")) continue
    if (word.includes(stem) || reading.includes(stem)) {
      score = Math.max(score, stem.length >= 3 ? 12 : stem.length === 2 ? 8 : 4)
    }
  }
  return score
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

function leastUsed(sections: CurriculumSection[], counts: Record<string, number>) {
  return [...sections].sort(
    (a, b) => (counts[a.id] ?? 0) - (counts[b.id] ?? 0) || a.id.localeCompare(b.id)
  )[0]
}

export function assignVocab(raw: RawVocab[]): VocabEntry[] {
  const counts: Record<string, number> = {}
  const slots = allStudySlots(SOUMATOME_GOI_WEEKS)
  const adverbWeek = SOUMATOME_GOI_WEEKS[3]
  const katakanaWeek = SOUMATOME_GOI_WEEKS[5]
  const kangoWeek = SOUMATOME_GOI_WEEKS[4]
  const synonymWeek = SOUMATOME_GOI_WEEKS[6]
  const idiomWeek = SOUMATOME_GOI_WEEKS[7]
  const reviewDays = idiomWeek ? studySections(idiomWeek).slice(4, 6) : []
  const kangoDays = kangoWeek ? studySections(kangoWeek) : []

  return raw.map((item) => {
    const ranked = slots.map((slot) => ({
      ...slot,
      score: scoreStems(item.word, item.reading, slot.section.keywords),
    }))

    if (isKatakanaWord(item.word) && katakanaWeek) {
      for (const row of ranked) {
        if (row.chapter.id === katakanaWeek.id) {
          row.score = Math.max(row.score, 9)
        }
      }
    } else if (isMimetic(item.word) && idiomWeek) {
      for (const row of ranked) {
        if (row.section.id === "g08-d3") row.score = Math.max(row.score, 11)
      }
    } else if (looksAdverb(item.word, item.pos) && adverbWeek) {
      for (const row of ranked) {
        if (row.chapter.id === adverbWeek.id) {
          row.score = Math.max(row.score, 8)
        }
      }
    } else if (isCompoundVerb(item.word, item.pos) && idiomWeek) {
      for (const row of ranked) {
        if (row.section.id === "g08-d1") row.score = Math.max(row.score, 10)
      }
    }

    ranked.sort((a, b) => b.score - a.score)
    let chosen =
      (ranked[0]?.score ?? 0) > 0 ? takeSlot(ranked, counts) : undefined

    if (!chosen || chosen.score === 0) {
      if (item.word.includes("を") && idiomWeek) {
        const section = studySections(idiomWeek)[1]
        chosen = { chapter: idiomWeek, section, score: 0 }
      } else if (item.pos === "動詞" && synonymWeek) {
        const section = leastUsed(studySections(synonymWeek), counts)
        chosen = { chapter: synonymWeek, section, score: 0 }
      } else if (item.level === "N3" && reviewDays.length) {
        const section = leastUsed(reviewDays, counts)
        chosen = { chapter: idiomWeek!, section, score: 0 }
      } else if (kangoDays.length && kangoWeek) {
        const section = leastUsed(kangoDays, counts)
        chosen = { chapter: kangoWeek, section, score: 0 }
      } else {
        chosen = takeSlot(ranked, counts)
      }
    }

    if (!chosen) {
      chosen = takeSlot(ranked, counts)
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
    const scene = SOUMATOME_KANJI_SCENES[item.character]
    const related = vocab.filter((word) => word.word.includes(item.character)).slice(0, 4)
    const sceneExample: ExampleSentence | null = scene
      ? { ja: scene.exampleJa, en: scene.exampleEn, my: scene.exampleMy }
      : null
    const examples: ExampleSentence[] = []
    if (sceneExample) examples.push(sceneExample)
    if (item.examples?.length) {
      for (const example of item.examples) {
        if (examples.length >= 3) break
        if (example.ja !== sceneExample?.ja) examples.push(example)
      }
    } else {
      for (const word of related) {
        const example = word.examples[0]
        if (!example || examples.length >= 3) break
        if (example.ja === sceneExample?.ja) continue
        examples.push({
          ja: example.ja,
          en: example.en,
          my: example.my ?? displayMeaning(word.meanings, word.meaningMy),
        })
      }
    }
    const key = section.id
    counts[key] = (counts[key] ?? 0) + 1
    const compounds = scene?.compounds?.length
      ? scene.compounds
      : related.map((word) => word.word)
    return {
      ...item,
      chapterId: chapter.id,
      sectionId: section.id,
      order: counts[key],
      radical: item.radical ?? chapter.radical ?? "⼀",
      radicalMy: item.radicalMy ?? chapter.radicalMy ?? "ရင်းမြစ်",
      examples,
      compounds,
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
