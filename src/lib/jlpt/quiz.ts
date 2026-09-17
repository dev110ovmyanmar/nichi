import type { KanjiEntry, QuizQuestion, VocabEntry } from "@/lib/jlpt/types"
import { displayMeaning } from "@/lib/jlpt/burmese"

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickChoices(correct: string, pool: string[], count = 4) {
  const unique = Array.from(new Set(pool.filter((item) => item && item !== correct)))
  const distractors = shuffle(unique).slice(0, count - 1)
  const choices = shuffle([correct, ...distractors])
  return {
    choices,
    answerIndex: choices.indexOf(correct),
  }
}

export function vocabQuiz(items: VocabEntry[]): QuizQuestion[] {
  const usable = items.filter((item) => item.meanings[0])
  const meaningPool = usable.map((item) => item.meanings[0])
  const wordPool = usable.map((item) => item.word)
  const readingPool = usable.map((item) => item.reading)

  const meaningQs = shuffle(usable)
    .slice(0, 8)
    .map((item) => {
      const meaning = displayMeaning(item.meanings, item.meaningMy)
      const { choices, answerIndex } = pickChoices(item.word, wordPool)
      return {
        id: `v-m-${item.id}`,
        kind: "choice" as const,
        promptJa: meaning,
        promptMy: `${item.reading} — အဓိပ္ပာယ်နှင့် ကိုက်သော စကားလုံး`,
        choices,
        answerIndex,
        explainMy: `${item.word} (${item.reading}) = ${meaning}`,
      }
    })

  const starQs = shuffle(usable)
    .slice(0, 4)
    .map((item) => {
      const { choices, answerIndex } = pickChoices(item.reading, readingPool)
      return {
        id: `v-s-${item.id}`,
        kind: "star" as const,
        promptJa: `「${item.word}」の読み ★`,
        promptMy: "星問題 — မှန်ကန်သော ဖတ်ပုံ",
        promptReading: item.word,
        choices,
        answerIndex,
        explainMy: `${item.word} ကို ${item.reading} ဟု ဖတ်သည်။`,
      }
    })

  return [...meaningQs, ...starQs]
}

export function kanjiQuiz(items: KanjiEntry[]): QuizQuestion[] {
  const usable = items.filter((item) => item.meanings[0])
  const charPool = usable.map((item) => item.character)
  const onPool = usable.flatMap((item) => item.onyomi).filter(Boolean)

  const meaningQs = shuffle(usable)
    .slice(0, 6)
    .map((item) => {
      const meaning = displayMeaning(item.meanings, item.meaningMy)
      const { choices, answerIndex } = pickChoices(item.character, charPool)
      return {
        id: `k-m-${item.id}`,
        kind: "choice" as const,
        promptJa: meaning,
        promptMy: "ဤအဓိပ္ပာယ်နှင့် ကိုက်သော 漢字",
        choices,
        answerIndex,
        explainMy: `${item.character} = ${meaning} · 音 ${item.onyomi.join("、") || "—"}`,
      }
    })

  const onQs = shuffle(usable.filter((item) => item.onyomi[0]))
    .slice(0, 4)
    .map((item) => {
      const { choices, answerIndex } = pickChoices(item.onyomi[0], onPool)
      return {
        id: `k-o-${item.id}`,
        kind: "choice" as const,
        promptJa: `${item.character} の音読み`,
        promptMy: "音読み ကို ရွေးပါ",
        choices,
        answerIndex,
        explainMy: `${item.character} 音 ${item.onyomi.join("、")} / 訓 ${item.kunyomi.join("、") || "—"}`,
      }
    })

  const starQs = shuffle(usable)
    .slice(0, 3)
    .map((item) => {
      const compound = item.compounds?.[0] ?? item.character
      const { choices, answerIndex } = pickChoices(item.character, charPool)
      return {
        id: `k-s-${item.id}`,
        kind: "star" as const,
        promptJa: `熟語「${compound}」の ★ 漢字`,
        promptMy: "星問題 — 熟語ထဲမှ 漢字",
        choices,
        answerIndex,
        explainMy: `${compound} တွင် ${item.character} ပါသည်။`,
      }
    })

  return [...meaningQs, ...onQs, ...starQs]
}
