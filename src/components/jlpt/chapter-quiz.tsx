"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import type { QuizKind, QuizQuestion } from "@/lib/jlpt/types"
import { cn } from "@/lib/utils"

export function ChapterQuiz({
  questions,
  kind,
  chapterId,
  backHref,
  title,
}: {
  questions: QuizQuestion[]
  kind: QuizKind
  chapterId?: string
  backHref: string
  title: string
}) {
  const { recordQuiz, completeChapter } = useJlptProgress()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const question = questions[index]
  const starCount = useMemo(
    () => questions.filter((item) => item.kind === "star").length,
    [questions]
  )

  if (!questions.length) {
    return <p className="text-sm text-muted-foreground">ဤအခန်းတွင် မေးခွန်း မလုံလောက်ပါ။</p>
  }

  function choose(choiceIndex: number) {
    if (picked !== null || !question) return
    setPicked(choiceIndex)
    if (choiceIndex === question.answerIndex) setScore((value) => value + 1)
  }

  function next() {
    if (!question) return
    if (index + 1 >= questions.length) {
      const finalScore = score
      recordQuiz(kind, finalScore, questions.length, chapterId)
      if (chapterId && finalScore >= Math.ceil(questions.length * 0.7)) {
        completeChapter(kind === "kanji" ? "kanji" : "tango", chapterId)
      }
      setDone(true)
      return
    }
    setIndex(index + 1)
    setPicked(null)
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-card p-6 text-center ring-1 ring-foreground/8">
        <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{title}</p>
        <p className="font-heading mt-2 text-4xl font-semibold tabular-nums">
          {score}/{questions.length}
        </p>
        <p className="my-script mt-2 text-sm text-muted-foreground">
          {score >= Math.ceil(questions.length * 0.7)
            ? "အခန်း ပြီးဆုံးအဖြစ် မှတ်ထားသည်။"
            : "၇၀% အထက် ရမှ အခန်း ပြီးဆုံး မှတ်မည်။"}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link
            href={backHref}
            className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            အခန်းသို့
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        {index + 1}/{questions.length}
        {question.kind === "star" ? " · 星問題" : ""}
        {starCount ? ` · 星 ${starCount}` : ""}
      </p>
      <h2 className="font-heading text-xl font-semibold leading-relaxed">{question.promptJa}</h2>
      <p className="my-script text-sm text-muted-foreground">{question.promptMy}</p>
      <div className="grid gap-2">
        {question.choices.map((choice, choiceIndex) => {
          const selected = picked === choiceIndex
          const correct = picked !== null && choiceIndex === question.answerIndex
          const wrong = selected && !correct
          return (
            <button
              key={`${question.id}-${choice}`}
              type="button"
              disabled={picked !== null}
              onClick={() => choose(choiceIndex)}
              className={cn(
                "rounded-2xl bg-card px-3 py-3 text-left ring-1 ring-foreground/10",
                correct && "bg-primary/15 text-primary ring-primary/30",
                wrong && "bg-destructive/10 text-destructive"
              )}
            >
              {choice}
            </button>
          )
        })}
      </div>
      {picked !== null ? (
        <div className="grid gap-3">
          <p className="my-script text-sm text-muted-foreground">{question.explainMy}</p>
          <Button className="h-11 rounded-2xl" onClick={next}>
            {index + 1 >= questions.length ? "ရလဒ်" : "ရှေ့"}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
