import type { CurriculumChapter } from "@/lib/jlpt/types"
import { SOUMATOME_GOI_WEEKS } from "@/data/soumatome-goi"
import { SOUMATOME_KANJI_WEEKS } from "@/data/soumatome-kanji"

/**
 * Week/day shells modelled on 日本語総まとめ N2 語彙 and 漢字 (Ask Publishing).
 * Item lists and example sentences are OpenJLPT — not copied from those books.
 */

export const TANGO_CHAPTERS = SOUMATOME_GOI_WEEKS
export const KANJI_MASTER_CHAPTERS = SOUMATOME_KANJI_WEEKS
export { SOUMATOME_GOI_WEEKS, SOUMATOME_KANJI_WEEKS }

export function tangoChapter(id: string) {
  return SOUMATOME_GOI_WEEKS.find((chapter) => chapter.id === id) ?? null
}

export function soumatomeGoiWeek(id: string) {
  return tangoChapter(id)
}

export function kanjiMasterChapter(id: string) {
  return SOUMATOME_KANJI_WEEKS.find((chapter) => chapter.id === id) ?? null
}

export function soumatomeKanjiWeek(id: string) {
  return kanjiMasterChapter(id)
}

export function findSection(chapters: CurriculumChapter[], sectionId: string) {
  for (const chapter of chapters) {
    const section = chapter.sections.find((item) => item.id === sectionId)
    if (section) return { chapter, section }
  }
  return null
}
