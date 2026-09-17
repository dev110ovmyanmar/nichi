"use client"

import { use, useState } from "react"
import Link from "next/link"
import { READINGS } from "@/data/reading"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { ClickPassage } from "@/components/jlpt/click-passage"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { cn } from "@/lib/utils"

export default function ReadingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const item = READINGS.find((entry) => entry.id === id)
  const [choice, setChoice] = useState<number | null>(null)
  const { recordQuiz, update } = useJlptProgress()

  if (!item) return <p>မတွေ့ပါ။</p>

  return (
    <div className="grid gap-5">
      <ModuleHero
        backHref="/reading"
        kicker="読解"
        title={item.title}
        description={item.titleMy}
      />
      <ClickPassage body={item.body} vocab={item.vocab} />
      <section className="grid gap-2">
        <h2 className="font-medium">{item.question}</h2>
        <p className="my-script text-sm text-muted-foreground">{item.questionMy}</p>
        {item.choices.map((label, index) => {
          const selected = choice === index
          const correct = choice !== null && index === item.answerIndex
          const wrong = selected && !correct
          return (
            <button
              key={label}
              type="button"
              disabled={choice !== null}
              onClick={() => {
                setChoice(index)
                recordQuiz("reading", index === item.answerIndex ? 1 : 0, 1)
                update({ lastReadingId: item.id })
              }}
              className={cn(
                "rounded-2xl px-3 py-3 text-left text-sm ring-1 ring-foreground/10",
                correct && "bg-primary/15",
                wrong && "bg-destructive/10"
              )}
            >
              {label}
            </button>
          )
        })}
      </section>
      {choice !== null ? (
        <p className="my-script rounded-2xl bg-muted/60 px-4 py-3 text-sm leading-relaxed">
          {item.explainMy}
        </p>
      ) : null}
        <Link href="/reading" className="text-sm text-primary">
          ပိုဒ်များသို့
        </Link>
    </div>
  )
}
