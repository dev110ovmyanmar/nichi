"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { BookmarkButton, RubyWord } from "@/components/jlpt/ruby-word"
import { Input } from "@/components/ui/input"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { KANA_ROWS, loadVocab, matchesKanaRow } from "@/lib/jlpt/catalog"
import { displayMeaning } from "@/lib/jlpt/burmese"
import type { VocabEntry } from "@/lib/jlpt/types"
import { cn } from "@/lib/utils"

export function VocabBrowser() {
  const [items, setItems] = useState<VocabEntry[] | null>(null)
  const [query, setQuery] = useState("")
  const [row, setRow] = useState("all")
  const [level, setLevel] = useState<"N2" | "all">("N2")
  const [onlyBookmarks, setOnlyBookmarks] = useState(false)
  const [onlyVerb, setOnlyVerb] = useState(false)
  const { progress, toggleBookmark } = useJlptProgress()

  useEffect(() => {
    loadVocab().then(setItems)
  }, [])

  const filtered = useMemo(() => {
    if (!items) return []
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (level === "N2" && item.level !== "N2") return false
      if (onlyBookmarks && !progress.bookmarks.vocab.includes(item.id)) return false
      if (onlyVerb && !item.transitivity) return false
      if (!matchesKanaRow(item.reading, row)) return false
      if (!q) return true
      return (
        item.word.includes(query) ||
        item.reading.includes(query) ||
        item.meanings.some((meaning) => meaning.toLowerCase().includes(q))
      )
    })
  }, [items, query, row, level, onlyBookmarks, onlyVerb, progress.bookmarks.vocab])

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLevel("N2")}
          className={cn(
            "h-9 rounded-full px-3 text-sm",
            level === "N2" ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          N2 · {items ? items.filter((item) => item.level === "N2").length : "—"}
        </button>
        <button
          type="button"
          onClick={() => setLevel("all")}
          className={cn(
            "h-9 rounded-full px-3 text-sm",
            level === "all" ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          N2+N3 · {items ? items.length : "—"}
        </button>
        <button
          type="button"
          onClick={() => setOnlyVerb((value) => !value)}
          className={cn(
            "h-9 rounded-full px-3 text-sm",
            onlyVerb ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          自動詞・他動詞
        </button>
        <button
          type="button"
          onClick={() => setOnlyBookmarks((value) => !value)}
          className={cn(
            "h-9 rounded-full px-3 text-sm",
            onlyBookmarks ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          စာညှပ်
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="漢字・読み・English"
          className="pl-9"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {KANA_ROWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setRow(item.id)}
            className={cn(
              "h-9 shrink-0 rounded-full px-3 text-sm",
              row === item.id ? "bg-secondary text-secondary-foreground" : "bg-muted"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!items ? (
        <p className="text-sm text-muted-foreground">ဝေါဟာရ စာရင်း ခေါ်ယူနေသည်…</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.slice(0, 80).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-2xl bg-card p-3 ring-1 ring-foreground/8"
            >
              <Link href={`/vocab/${item.id}`} className="min-w-0 flex-1">
                <p className="truncate font-heading text-lg font-semibold">
                  <RubyWord word={item.word} reading={item.reading} />
                </p>
                <p className="my-script truncate text-sm text-muted-foreground">
                  {displayMeaning(item.meanings, item.meaningMy)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {item.pos}
                  {item.transitivity === "vi" ? " · 自動詞" : ""}
                  {item.transitivity === "vt" ? " · 他動詞" : ""}
                  {item.transitivity === "both" ? " · 自/他" : ""}
                  {" · "}
                  {item.level}
                </p>
              </Link>
              <BookmarkButton
                active={progress.bookmarks.vocab.includes(item.id)}
                onClick={() => toggleBookmark("vocab", item.id)}
                label="Bookmark"
              />
            </div>
          ))}
        </div>
      )}
      {items && filtered.length > 80 ? (
        <p className="text-center text-xs text-muted-foreground">
          {filtered.length} ခုထဲမှ ၈၀ ခု ပြထားသည်။ ရှာဖွေမှုကို ကျဉ်းပါ။
        </p>
      ) : null}
    </div>
  )
}
