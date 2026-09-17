"use client"

import { useMemo, useState } from "react"
import { READINGS } from "@/data/reading"

export function ClickPassage({
  body,
  vocab,
}: {
  body: string
  vocab: Array<{ word: string; reading: string; my: string }>
}) {
  const [active, setActive] = useState<string | null>(null)
  const pieces = useMemo(() => {
    if (vocab.length === 0) return [body]
    const pattern = new RegExp(
      `(${vocab.map((item) => item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`
    )
    return body.split(pattern).filter(Boolean)
  }, [body, vocab])

  const selected = vocab.find((item) => item.word === active)

  return (
    <div>
      <p className="text-lg leading-9">
        {pieces.map((piece, index) => {
          const hit = vocab.find((item) => item.word === piece)
          if (!hit) return <span key={index}>{piece}</span>
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActive(hit.word === active ? null : hit.word)}
              className="rounded-sm bg-primary/12 px-0.5 font-medium text-primary"
            >
              {piece}
            </button>
          )
        })}
      </p>
      {selected ? (
        <div className="mt-3 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
          <p className="font-medium">
            {selected.word}{" "}
            <span className="text-muted-foreground">({selected.reading})</span>
          </p>
          <p className="my-script mt-1">{selected.my}</p>
        </div>
      ) : (
        <p className="my-script mt-3 text-xs text-muted-foreground">
          အရောင်ပါသော စကားလုံးကို နှိပ်ပါ — မြန်မာလို အဓိပ္ပာယ် ပေါ်လာမည်။
        </p>
      )}
    </div>
  )
}

