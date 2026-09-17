"use client"

import { use, useEffect } from "react"
import Link from "next/link"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { BookmarkButton } from "@/components/jlpt/ruby-word"
import { GRAMMAR, grammarById } from "@/data/grammar"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"

export default function GrammarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const item = grammarById(id)
  const { progress, toggleBookmark, update } = useJlptProgress()

  useEffect(() => {
    if (item) update({ lastGrammarId: item.id })
  }, [item, update])

  if (!item) return <p>မတွေ့ပါ။</p>

  return (
    <div className="grid gap-5">
      <ModuleHero
        backHref="/grammar"
        kicker="文法"
        title={item.pattern}
        description={item.meaningMy}
      />
      <div className="flex justify-end">
        <BookmarkButton
          active={progress.bookmarks.grammar.includes(item.id)}
          onClick={() => toggleBookmark("grammar", item.id)}
          label="Bookmark grammar"
        />
      </div>
      <section className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
        <h2 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          接続
        </h2>
        <p className="mt-1 font-medium">{item.connection}</p>
        <p className="my-script mt-1 text-sm text-muted-foreground">{item.connectionMy}</p>
      </section>
      {item.examples.map((example) => (
        <figure key={example.ja} className="rounded-3xl bg-muted/40 p-4">
          <p className="text-lg leading-8">{example.ja}</p>
          <p className="my-script mt-2 text-sm">{example.my}</p>
          <p className="mt-1 text-xs text-muted-foreground">{example.en}</p>
        </figure>
      ))}
      {item.notesMy ? (
        <p className="my-script rounded-2xl bg-primary/8 px-4 py-3 text-sm">{item.notesMy}</p>
      ) : null}
      {item.similar?.length ? (
        <div>
          <h2 className="text-sm font-medium">ဆင်တူပုံစံ</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.similar.map((sid) => {
              const other = GRAMMAR.find((entry) => entry.id === sid)
              if (!other) return null
              return (
                <Link
                  key={sid}
                  href={`/grammar/${sid}`}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {other.pattern}
                </Link>
              )
            })}
            <Link href="/grammar/compare" className="rounded-full bg-muted px-3 py-1 text-sm">
              နှိုင်းယှဉ်ရန်
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
