"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Volume2 } from "lucide-react"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { BookmarkButton, RubyWord } from "@/components/jlpt/ruby-word"
import { Button } from "@/components/ui/button"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { displayMeaning } from "@/lib/jlpt/burmese"
import { loadVocab } from "@/lib/jlpt/catalog"
import { speakJapanese } from "@/lib/jlpt/tts"
import type { VocabEntry } from "@/lib/jlpt/types"

export default function VocabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [item, setItem] = useState<VocabEntry | null | undefined>(undefined)
  const { progress, toggleBookmark, markKnown, update } = useJlptProgress()

  useEffect(() => {
    loadVocab().then((all) => {
      const found = all.find((entry) => entry.id === id) ?? null
      setItem(found)
      if (found) update({ lastVocabId: found.id })
    })
  }, [id, update])

  if (item === undefined) {
    return <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
  }
  if (!item) {
    return <p>မတွေ့ပါ။</p>
  }

  return (
    <div className="grid gap-5">
      <ModuleHero
        backHref="/vocab"
        kicker="語彙"
        title={item.word}
        description={displayMeaning(item.meanings, item.meaningMy)}
      />
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-heading text-4xl font-semibold">
          <RubyWord word={item.word} reading={item.reading} />
        </p>
        <BookmarkButton
          active={progress.bookmarks.vocab.includes(item.id)}
          onClick={() => toggleBookmark("vocab", item.id)}
          label="Bookmark"
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full"
          onClick={() => speakJapanese(item.word)}
        >
          <Volume2 data-icon="inline-start" />
          聞く
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-muted px-3 py-1">{item.pos}</span>
        <span className="rounded-full bg-muted px-3 py-1">{item.level}</span>
        {item.transitivity === "vi" ? (
          <span className="rounded-full bg-secondary px-3 py-1">自動詞</span>
        ) : null}
        {item.transitivity === "vt" ? (
          <span className="rounded-full bg-secondary px-3 py-1">他動詞</span>
        ) : null}
        {item.transitivity === "both" ? (
          <span className="rounded-full bg-secondary px-3 py-1">自・他</span>
        ) : null}
      </div>
      <ul className="grid gap-1 text-sm text-muted-foreground">
        {item.meanings.map((meaning) => (
          <li key={meaning}>· {meaning}</li>
        ))}
      </ul>
      {item.examples.map((example) => (
        <figure key={example.ja} className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
          <blockquote className="text-lg leading-8">{example.ja}</blockquote>
          <figcaption className="mt-2 text-sm text-muted-foreground">{example.en}</figcaption>
          {example.my ? (
            <p className="my-script mt-1 text-sm">{example.my}</p>
          ) : null}
        </figure>
      ))}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={progress.knownVocab.includes(item.id) ? "default" : "outline"}
          className="h-11 flex-1 rounded-2xl"
          onClick={() => markKnown("vocab", item.id)}
        >
          {progress.knownVocab.includes(item.id) ? "ကျက်ပြီး" : "ကျက်ပြီးဟု မှတ်"}
        </Button>
        <Link
          href="/kanji"
          className="inline-flex h-11 items-center rounded-2xl bg-secondary px-4 text-sm font-medium"
        >
          漢字 Hub
        </Link>
      </div>
    </div>
  )
}
