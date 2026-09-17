"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { speakJapanese, stopSpeaking } from "@/lib/jlpt/tts"
import type { ListeningItem } from "@/lib/jlpt/types"
import { cn } from "@/lib/utils"

export function ListeningCard({
  item,
  onScored,
}: {
  item: ListeningItem
  onScored?: (correct: boolean) => void
}) {
  const [rate, setRate] = useState(1)
  const [script, setScript] = useState<"ja" | "my">("ja")
  const [choice, setChoice] = useState<number | null>(null)

  return (
    <article className="grid gap-4 rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
      <div>
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {item.sectionJa}
        </p>
        <p className="mt-1 font-medium">{item.promptJa}</p>
        <p className="my-script mt-1 text-sm text-muted-foreground">{item.promptMy}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          className="h-11 rounded-full"
          onClick={() => speakJapanese(item.scriptJa, rate)}
        >
          <Play data-icon="inline-start" />
          再生
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-full" onClick={stopSpeaking}>
          <Pause data-icon="inline-start" />
          停止
        </Button>
        {[0.8, 1, 1.2].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRate(value)}
            className={cn(
              "h-10 rounded-full px-3 text-sm",
              rate === value ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {value.toFixed(1)}x
          </button>
        ))}
        <button
          type="button"
          onClick={() => setScript((current) => (current === "ja" ? "my" : "ja"))}
          className="h-10 rounded-full bg-secondary px-3 text-sm"
        >
          {script === "ja" ? "မြန်မာစာ" : "日本語"}
        </button>
      </div>

      <div className="rounded-2xl bg-muted/50 p-3 text-sm leading-7">
        {script === "ja" ? item.scriptJa : <span className="my-script">{item.scriptMy}</span>}
      </div>

      <div className="grid gap-2">
        <p className="font-medium">{item.questionJa}</p>
        <p className="my-script text-sm text-muted-foreground">{item.questionMy}</p>
        {(script === "ja" ? item.choicesJa : item.choicesMy).map((label, index) => {
          const selected = choice === index
          const correct = choice !== null && index === item.answerIndex
          const wrong = selected && index !== item.answerIndex
          return (
            <button
              key={label}
              type="button"
              disabled={choice !== null}
              onClick={() => {
                setChoice(index)
                onScored?.(index === item.answerIndex)
              }}
              className={cn(
                "rounded-2xl px-3 py-3 text-left text-sm ring-1 ring-foreground/10",
                correct && "bg-primary/15 text-primary",
                wrong && "bg-destructive/10 text-destructive"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
      {choice !== null ? (
        <p className="my-script text-sm text-muted-foreground">{item.explainMy}</p>
      ) : null}
    </article>
  )
}
