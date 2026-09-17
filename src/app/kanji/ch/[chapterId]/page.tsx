"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { BookmarkButton } from "@/components/jlpt/ruby-word"
import { SourceCredits } from "@/components/jlpt/source-credits"
import { soumatomeKanjiWeek } from "@/data/books"
import { SOUMATOME_KANJI_BOOK } from "@/data/sources"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { displayMeaning } from "@/lib/jlpt/burmese"
import { loadKanji } from "@/lib/jlpt/catalog"
import { itemsInChapter, itemsInSection } from "@/lib/jlpt/curriculum"
import { entryHref } from "@/lib/jlpt/ids"
import { chapterUnitLabel, isPracticeSection, sectionUnitLabel } from "@/lib/jlpt/labels"
import type { KanjiEntry } from "@/lib/jlpt/types"

export default function KanjiChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = use(params)
  const chapter = soumatomeKanjiWeek(chapterId)
  const [items, setItems] = useState<KanjiEntry[] | null>(null)
  const { progress, toggleBookmark } = useJlptProgress()

  useEffect(() => {
    loadKanji().then(setItems)
  }, [])

  const inChapter = useMemo(
    () => (items ? itemsInChapter(items, chapterId) : []),
    [items, chapterId]
  )

  if (!chapter) return <p>အပတ် မတွေ့ပါ။</p>

  return (
    <div className="grid gap-5">
      <ModuleHero
        backHref="/kanji"
        kicker={`${SOUMATOME_KANJI_BOOK.title} · ${chapterUnitLabel(chapter)}`}
        title={chapter.titleJa}
        description={`${chapter.summaryMy} ရင်းမြစ် ${chapter.radical ?? ""} (${chapter.radicalMy ?? ""})`}
      />
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/kanji/ch/${chapter.id}/quiz`}
          className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          ７日目 実戦問題
        </Link>
        <p className="self-center text-xs text-muted-foreground">{inChapter.length} 漢字</p>
      </div>
      {!items ? (
        <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
      ) : (
        chapter.sections.map((section) => {
          const kanji = itemsInSection(inChapter, section.id)
          const practice = isPracticeSection(section)
          return (
            <section key={section.id} className="grid gap-2">
              <h2 className="font-heading text-base font-semibold">
                {sectionUnitLabel(chapter, section)} {section.titleJa}
                <span className="my-script ml-2 text-sm font-normal text-muted-foreground">
                  {section.titleMy}
                </span>
              </h2>
              {practice ? (
                <Link
                  href={`/kanji/ch/${chapter.id}/quiz`}
                  className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
                >
                  <p className="font-medium">ဤအပတ် 漢字 ကို quiz ဖြင့် စစ်ပါ။</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    အဓိပ္ပာယ်၊ 音読み၊ 星問題 熟語 · ၇၀% အထက် ရရင် အပတ် ပြီးဆုံး။
                  </p>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {kanji.length ? (
                    kanji.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-3xl bg-card p-3 ring-1 ring-foreground/8"
                      >
                        <Link href={entryHref("/kanji", item.id)} className="block text-center">
                          <span className="font-heading text-4xl">{item.character}</span>
                          <span className="mt-1 block text-[11px] text-muted-foreground">
                            {item.strokes}画 · {item.radical}
                          </span>
                          <span className="mt-1 block line-clamp-2 text-xs">
                            {displayMeaning(item.meanings, item.meaningMy)}
                          </span>
                          <span className="mt-1 block text-[11px] text-muted-foreground">
                            音 {item.onyomi.slice(0, 2).join("、") || "—"}
                          </span>
                        </Link>
                        <div className="mt-2 flex justify-center">
                          <BookmarkButton
                            active={progress.bookmarks.kanji.includes(item.id)}
                            onClick={() => toggleBookmark("kanji", item.id)}
                            label="Bookmark kanji"
                          />
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="col-span-full text-sm text-muted-foreground">
                      ဤနေ့အတွက် 漢字 မရှိသေးပါ။
                    </p>
                  )}
                </div>
              )}
            </section>
          )
        })
      )}
      <SourceCredits compact />
    </div>
  )
}
