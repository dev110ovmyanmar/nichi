"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GRAMMAR } from "@/data/grammar"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"

export function GrammarBrowser() {
  const [query, setQuery] = useState("")
  const { progress } = useJlptProgress()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GRAMMAR
    return GRAMMAR.filter(
      (item) =>
        item.pattern.toLowerCase().includes(q) ||
        item.meaningEn.toLowerCase().includes(q) ||
        item.meaningMy.includes(query) ||
        item.connection.includes(query) ||
        item.tags.some((tag) => tag.includes(q))
    )
  }, [query])

  return (
    <div className="grid gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="パターン・接続・မြန်မာ"
          className="pl-9"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} / {GRAMMAR.length} ပုံစံ
        {progress.bookmarks.grammar.length
          ? ` · စာညှပ် ${progress.bookmarks.grammar.length}`
          : ""}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/grammar/${item.id}`}
            className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
          >
            <p className="font-heading text-lg font-semibold">{item.pattern}</p>
            <p className="my-script mt-1 text-sm text-muted-foreground">{item.meaningMy}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">{item.connection}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
