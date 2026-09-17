"use client"

import { COMPOUNDS } from "@/data/compounds"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { BookmarkButton } from "@/components/jlpt/ruby-word"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { cn } from "@/lib/utils"

export default function CompoundsPage() {
  const { progress, toggleBookmark } = useJlptProgress()
  const verbs = COMPOUNDS.filter((item) => item.kind === "compound")
  const idioms = COMPOUNDS.filter((item) => item.kind === "idiom")

  return (
    <div>
      <ModuleHero
        kicker="複合動詞・慣用句"
        title="ကြိယာပေါင်းစပ်နှင့် စကားအသုံးအနှုန်း"
        description="N2 တွင် မကြာခဏ ပေါ်သော 複合動詞 နှင့် 慣用句။"
      />
      <h2 className="font-heading mb-2 text-base font-semibold">複合動詞</h2>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {verbs.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading text-xl font-semibold">{item.word}</p>
                <p className="text-xs text-muted-foreground">{item.reading}</p>
              </div>
              <BookmarkButton
                active={progress.bookmarks.compounds.includes(item.id)}
                onClick={() => toggleBookmark("compounds", item.id)}
                label="Bookmark compound"
              />
            </div>
            <p className="my-script mt-2 text-sm">{item.meaningMy}</p>
            <p className="mt-3 text-sm leading-7">{item.exampleJa}</p>
            <p className="my-script mt-1 text-xs text-muted-foreground">{item.exampleMy}</p>
          </article>
        ))}
      </div>
      <h2 className="font-heading mb-2 text-base font-semibold">慣用句</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {idioms.map((item) => (
          <article
            key={item.id}
            className={cn("rounded-3xl bg-card p-4 ring-1 ring-foreground/8")}
          >
            <p className="font-heading text-xl font-semibold">{item.word}</p>
            <p className="my-script mt-2 text-sm">{item.meaningMy}</p>
            <p className="mt-3 text-sm leading-7">{item.exampleJa}</p>
            <p className="my-script mt-1 text-xs text-muted-foreground">{item.exampleMy}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
