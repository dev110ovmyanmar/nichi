"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { BookmarkButton } from "@/components/jlpt/ruby-word"
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
              {section.introJa && !practice ? (
                <p className="rounded-2xl bg-muted/40 px-3 py-2 text-sm leading-6">
                  {section.introJa}
                  <span className="my-script mt-1 block text-xs text-muted-foreground">
                    {section.introMy}
                  </span>
                </p>
              ) : null}
              {practice ? (
                <Link
                  href={`/kanji/ch/${chapter.id}/quiz`}
                  className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
                >
                  <p className="font-medium">この週の漢字を実戦問題で確認します。</p>
                  <p className="my-script mt-1 text-sm text-muted-foreground">
                    အဓိပ္ပာယ်၊ 音読み၊ 星問題 熟語 · ၇၀% အထက် ရရင် အပတ် ပြီးဆုံး။
                  </p>
                </Link>
              ) : (
                <div className="grid gap-2">
                  {kanji.length ? (
                    kanji.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-3xl bg-card p-3 ring-1 ring-foreground/8 sm:p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Link
                            href={entryHref("/kanji", item.id)}
                            className="font-heading w-16 shrink-0 text-center text-4xl leading-none sm:w-20 sm:text-5xl"
                          >
                            {item.character}
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link href={entryHref("/kanji", item.id)} className="block">
                              <p className="text-xs text-muted-foreground">
                                音 {item.onyomi.slice(0, 2).join("・") || "—"}
                                <span className="mx-1">/</span>
                                訓 {item.kunyomi.slice(0, 2).join("・") || "—"}
                              </p>
                              <p className="mt-1 text-sm font-medium">
                                {item.compounds?.slice(0, 3).join("・") || "—"}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {displayMeaning(item.meanings, item.meaningMy)}
                                <span className="ml-2">{item.strokes}画</span>
                              </p>
                            </Link>
                          </div>
                          <BookmarkButton
                            active={progress.bookmarks.kanji.includes(item.id)}
                            onClick={() => toggleBookmark("kanji", item.id)}
                            label="Bookmark kanji"
                          />
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">ဤနေ့အတွက် 漢字 မရှိသေးပါ။</p>
                  )}
                </div>
              )}
            </section>
          )
        })
      )}
    </div>
  )
}
