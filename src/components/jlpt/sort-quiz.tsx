"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { GRAMMAR } from "@/data/grammar"
import { SORT_QUESTIONS } from "@/data/practice"
import { Button } from "@/components/ui/button"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { cn } from "@/lib/utils"

export function SortQuiz() {
  const { recordQuiz } = useJlptProgress()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const question = SORT_QUESTIONS[index]
  const remaining = useMemo(
    () => question.tokens.filter((token) => !picked.includes(token)),
    [picked, question]
  )

  function submit() {
    const correct = question.answer.every((token, i) => picked[i] === token)
    const nextScore = score + (correct ? 1 : 0)
    if (index + 1 >= SORT_QUESTIONS.length) {
      setScore(nextScore)
      setDone(true)
      recordQuiz("sort", nextScore, SORT_QUESTIONS.length)
      return
    }
    setScore(nextScore)
    setIndex(index + 1)
    setPicked([])
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-card p-6 text-center ring-1 ring-foreground/8">
        <p className="font-heading text-3xl font-semibold">
          {score}/{SORT_QUESTIONS.length}
        </p>
        <p className="my-script mt-2 text-sm text-muted-foreground">
          星問題 ပြီးပါပြီ။
        </p>
        <Button className="mt-4" onClick={() => {
          setIndex(0)
          setPicked([])
          setScore(0)
          setDone(false)
        }}>
          ထပ်လုပ်ရန်
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        {index + 1} / {SORT_QUESTIONS.length}
      </p>
      <p className="my-script text-sm">{question.promptMy}</p>
      <div className="min-h-16 rounded-2xl bg-muted/50 p-3">
        <div className="flex flex-wrap gap-2">
          {picked.map((token) => (
            <button
              key={token}
              type="button"
              className="rounded-full bg-primary px-3 py-2 text-sm text-primary-foreground"
              onClick={() => setPicked((current) => current.filter((item) => item !== token))}
            >
              {token}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((token) => (
          <button
            key={token}
            type="button"
            className="rounded-full bg-card px-3 py-2 text-sm ring-1 ring-foreground/10"
            onClick={() => setPicked((current) => [...current, token])}
          >
            {token}
          </button>
        ))}
      </div>
      <Button type="button" className="h-11" disabled={picked.length === 0} onClick={submit}>
        検算
      </Button>
      {question.grammarId ? (
        <Link
          href={`/grammar/${question.grammarId}`}
          className={cn("text-sm text-primary")}
        >
          {GRAMMAR.find((item) => item.id === question.grammarId)?.pattern} ကို ကြည့်ရန်
        </Link>
      ) : null}
    </div>
  )
}
