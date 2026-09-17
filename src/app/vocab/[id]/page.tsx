"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { AudioPlayer } from "@/components/jlpt/audio-player"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { BookmarkButton, RubyWord } from "@/components/jlpt/ruby-word"
import { FuriganaSentence, PosTags } from "@/components/jlpt/sentence"
import { tangoChapter } from "@/data/books"
import { Button } from "@/components/ui/button"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { displayMeaning } from "@/lib/jlpt/burmese"
import { loadVocab } from "@/lib/jlpt/catalog"
import { findById } from "@/lib/jlpt/ids"
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
    let cancelled = false
    loadVocab()
      .then((all) => {
        if (cancelled) return
        const found = findById(all, id)
        setItem(found)
        if (found) update({ lastVocabId: found.id })
      })
      .catch(() => {
        if (!cancelled) setItem(null)
      })
    return () => {
      cancelled = true
    }
  }, [id, update])

  if (item === undefined) {
    return <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
  }
  if (!item) {
    return <p>မတွေ့ပါ။</p>
  }

  const chapter = tangoChapter(item.chapterId)
  const section = chapter?.sections.find((entry) => entry.id === item.sectionId)

  return (
    <div className="grid gap-5">
      <ModuleHero
        backHref={chapter ? `/vocab/ch/${chapter.id}` : "/vocab"}
        kicker="語彙 · Tango 2500"
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
      </div>
      <AudioPlayer text={item.reading || item.word} label="単語の発音" />
      <PosTags pos={item.pos} transitivity={item.transitivity} level={item.level} />
      {chapter ? (
        <p className="text-sm text-muted-foreground">
          第{chapter.number}章 {chapter.titleJa}
          {section ? ` · ${section.titleJa}` : ""}
        </p>
      ) : null}
      <ul className="grid gap-1 text-sm text-muted-foreground">
        {item.meanings.map((meaning) => (
          <li key={meaning}>· {meaning}</li>
        ))}
      </ul>
      {(item.examples ?? []).map((example) => (
        <figure key={example.ja} className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
          <blockquote className="text-lg">
            <FuriganaSentence ja={example.ja} word={item.word} reading={item.reading} />
          </blockquote>
          <figcaption className="mt-2 text-sm text-muted-foreground">{example.en}</figcaption>
          {example.my ? (
            <p className="my-script mt-1 text-sm">{example.my}</p>
          ) : (
            <p className="my-script mt-1 text-sm text-muted-foreground">
              {displayMeaning(item.meanings, item.meaningMy)}
            </p>
          )}
          <div className="mt-3">
            <AudioPlayer text={example.ja} label="例文" />
          </div>
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
        {chapter ? (
          <Link
            href={`/vocab/ch/${chapter.id}/quiz`}
            className="inline-flex h-11 items-center rounded-2xl bg-secondary px-4 text-sm font-medium"
          >
            အခန်း quiz
          </Link>
        ) : null}
      </div>
    </div>
  )
}
