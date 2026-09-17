"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { KanjiStroke } from "@/components/jlpt/kanji-stroke"
import { BookmarkButton } from "@/components/jlpt/ruby-word"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { displayMeaning } from "@/lib/jlpt/burmese"
import { loadKanji, loadVocab } from "@/lib/jlpt/catalog"
import type { KanjiEntry, VocabEntry } from "@/lib/jlpt/types"

export default function KanjiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [item, setItem] = useState<KanjiEntry | null | undefined>(undefined)
  const [compounds, setCompounds] = useState<VocabEntry[]>([])
  const { progress, toggleBookmark, markKnown } = useJlptProgress()

  useEffect(() => {
    loadKanji().then((all) => {
      const found = all.find((entry) => entry.id === id) ?? null
      setItem(found)
      if (!found) return
      loadVocab().then((vocab) => {
        setCompounds(
          vocab
            .filter((word) => word.word.includes(found.character))
            .slice(0, 8)
        )
      })
    })
  }, [id])

  const meaning = useMemo(
    () => (item ? displayMeaning(item.meanings, item.meaningMy) : ""),
    [item]
  )

  if (item === undefined) return <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
  if (!item) return <p>မတွေ့ပါ။</p>

  return (
    <div className="grid gap-5">
      <ModuleHero backHref="/kanji" kicker="漢字" title={item.character} description={meaning} />
      <div className="flex items-end justify-between gap-3">
        <p className="font-heading text-7xl leading-none">{item.character}</p>
        <BookmarkButton
          active={progress.bookmarks.kanji.includes(item.id)}
          onClick={() => toggleBookmark("kanji", item.id)}
          label="Bookmark kanji"
        />
      </div>
      <div className="grid gap-1 text-sm">
        <p>
          <span className="text-muted-foreground">音読み · </span>
          {item.onyomi.join("、") || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">訓読み · </span>
          {item.kunyomi.join("、") || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">画数 · </span>
          {item.strokes} 画
        </p>
      </div>
      <KanjiStroke character={item.character} />
      <section>
        <h2 className="font-heading text-base font-semibold">熟語</h2>
        <ul className="mt-2 grid gap-2">
          {compounds.map((word) => (
            <li key={word.id}>
              <Link href={`/vocab/${word.id}`} className="text-primary">
                {word.word}{" "}
                <span className="text-muted-foreground">({word.reading})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <button
        type="button"
        className="h-11 rounded-2xl bg-primary text-primary-foreground"
        onClick={() => markKnown("kanji", item.id)}
      >
        {progress.knownKanji.includes(item.id) ? "ကျက်ပြီး" : "ကျက်ပြီးဟု မှတ်"}
      </button>
    </div>
  )
}
