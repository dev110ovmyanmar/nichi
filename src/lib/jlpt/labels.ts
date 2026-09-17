import type { CurriculumChapter, CurriculumSection } from "@/lib/jlpt/types"

export function chapterUnitLabel(chapter: CurriculumChapter) {
  return `第${chapter.number}${chapter.unitJa ?? "章"}`
}

export function sectionUnitLabel(chapter: CurriculumChapter, section: CurriculumSection) {
  const unit = chapter.sectionUnitJa ?? "節"
  return `${section.number}${unit}`
}

export function isPracticeSection(section: CurriculumSection) {
  return section.number === 7 || section.titleJa.includes("実戦")
}
