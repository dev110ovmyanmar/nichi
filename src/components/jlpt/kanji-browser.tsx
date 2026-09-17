"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { BookmarkButton } from "@/components/jlpt/ruby-word"
import { Input } from "@/components/ui/input"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { loadKanji } from "@/lib/jlpt/catalog"
import { displayMeaning } from "@/lib/jlpt/burmese"
import type { KanjiEntry } from "@/lib/jlpt/types"

export function KanjiBrowser() {
  const [items, setItems] = useState<KanjiEntry[] | null>(null)
  const [query, setQuery] = useState("")
  const { progress, toggleBookmark } = useJlptProgress()

  useEffect(() => {
    loadKanji().then(setItems)
  }, [])

  const filtered = useMemo(() => {
    if (!items) return []
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.character.includes(query) ||
        item.onyomi.some((reading) => reading.toLowerCase().includes(q)) ||
        item.kunyomi.some((reading) => reading.toLowerCase().includes(q)) ||
        item.meanings.some((meaning) => meaning.toLowerCase().includes(q))
    )
  }, [items, query])

  return (
    <div className="grid gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="漢字・音訓・meaning"
          className="pl-9"
        />
      </div>
      {!items ? (
        <p className="text-sm text-muted-foreground">漢字 စာရင်း ခေါ်ယူနေသည်…</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {filtered.slice(0, 96).map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center rounded-2xl bg-card p-3 text-center ring-1 ring-foreground/8"
            >
              <Link href={`/kanji/${item.id}`} className="block">
                <span className="font-heading text-3xl">{item.character}</span>
                <span className="mt-1 block line-clamp-1 text-[11px] text-muted-foreground">
                  {displayMeaning(item.meanings, item.meaningMy)}
                </span>
              </Link>
              <span className="mt-2">
                <BookmarkButton
                  active={progress.bookmarks.kanji.includes(item.id)}
                  onClick={() => toggleBookmark("kanji", item.id)}
                  label="Bookmark kanji"
                />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
