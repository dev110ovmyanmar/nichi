export type JlptLevel = "N2" | "N3"

export type Transitivity = "vi" | "vt" | "both"

export type ExampleSentence = {
  ja: string
  en: string
  my?: string
}

export type VocabEntry = {
  id: string
  word: string
  reading: string
  meanings: string[]
  meaningMy?: string
  level: JlptLevel
  pos: string
  transitivity: Transitivity | null
  examples: ExampleSentence[]
  chapterId: string
  sectionId: string
  order: number
}

export type KanjiEntry = {
  id: string
  character: string
  strokes: number
  onyomi: string[]
  kunyomi: string[]
  meanings: string[]
  meaningMy?: string
  grade: number | null
  freq: number | null
  level: "N2"
  compounds?: string[]
  chapterId: string
  sectionId: string
  order: number
  radical: string
  radicalMy: string
  examples: ExampleSentence[]
}

export type CurriculumSection = {
  id: string
  number: number
  titleJa: string
  titleMy: string
  /** Japanese stems used to place OpenJLPT entries on this day. */
  keywords: string[]
  introJa?: string
  introMy?: string
}

export type CurriculumChapter = {
  id: string
  book: "tango" | "kanji-master" | "soumatome-kanji" | "soumatome-goi"
  number: number
  titleJa: string
  titleMy: string
  summaryMy: string
  radical?: string
  radicalMy?: string
  unitJa?: "章" | "週"
  sectionUnitJa?: "節" | "日目"
  sections: CurriculumSection[]
}

export type GrammarEntry = {
  id: string
  pattern: string
  patternKana?: string
  meaningEn: string
  meaningMy: string
  connection: string
  connectionMy: string
  examples: Array<{ ja: string; my: string; en: string }>
  notesMy?: string
  tags: string[]
  similar?: string[]
}

export type NuancePair = {
  id: string
  title: string
  titleMy: string
  leftId: string
  rightId: string
  differenceMy: string
  tipMy: string
}

export type SortQuestion = {
  id: string
  promptMy: string
  tokens: string[]
  answer: string[]
  translationMy: string
  grammarId?: string
}

export type CompoundEntry = {
  id: string
  kind: "compound" | "idiom"
  word: string
  reading: string
  meaningMy: string
  meaningEn: string
  exampleJa: string
  exampleMy: string
}

export type ReadingKind = "short" | "medium" | "long" | "info"

export type ReadingPassage = {
  id: string
  kind: ReadingKind
  title: string
  titleMy: string
  minutes: number
  body: string
  vocab: Array<{ word: string; reading: string; my: string }>
  question: string
  questionMy: string
  choices: string[]
  answerIndex: number
  explainMy: string
}

export type ListeningSection =
  | "task"
  | "point"
  | "gist"
  | "response"
  | "integrated"

export type ListeningItem = {
  id: string
  section: ListeningSection
  sectionJa: string
  promptJa: string
  promptMy: string
  scriptJa: string
  scriptMy: string
  questionJa: string
  questionMy: string
  choicesJa: string[]
  choicesMy: string[]
  answerIndex: number
  explainMy: string
}

export type ExamSectionId = "language" | "reading" | "listening"

export type QuizKind =
  | "vocab"
  | "kanji"
  | "grammar"
  | "sort"
  | "reading"
  | "listening"
  | "exam"
  | "star"

export type QuizQuestion = {
  id: string
  kind: "choice" | "star"
  promptJa: string
  promptMy: string
  promptReading?: string
  choices: string[]
  answerIndex: number
  explainMy: string
}
