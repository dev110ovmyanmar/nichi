"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AudioPlayer } from "@/components/jlpt/audio-player"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { BookmarkButton, RubyWord } from "@/components/jlpt/ruby-word"
import { PosTags } from "@/components/jlpt/sentence"
import { tangoChapter } from "@/data/books"
import { SOUMATOME_GOI_BOOK } from "@/data/sources"
import { SourceCredits } from "@/components/jlpt/source-credits"
import { chapterUnitLabel, isPracticeSection, sectionUnitLabel } from "@/lib/jlpt/labels"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { displayMeaning } from "@/lib/jlpt/burmese"
import { loadVocab } from "@/lib/jlpt/catalog"
import { itemsInChapter, itemsInSection } from "@/lib/jlpt/curriculum"
import { entryHref } from "@/lib/jlpt/ids"
import type { VocabEntry } from "@/lib/jlpt/types"

export default function TangoChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = use(params)
  const chapter = tangoChapter(chapterId)
  const [items, setItems] = useState<VocabEntry[] | null>(null)
  const { progress, toggleBookmark } = useJlptProgress()

  useEffect(() => {
    loadVocab().then(setItems)
  }, [])

  const inChapter = useMemo(
    () => (items ? itemsInChapter(items, chapterId) : []),
    [items, chapterId]
  )

  if (!chapter) return <p>အပတ် မတွေ့ပါ။</p>

  return (
    <div className="grid gap-5">
      <ModuleHero
        backHref="/vocab"
        kicker={`${SOUMATOME_GOI_BOOK.title} · ${chapterUnitLabel(chapter)}`}
        title={chapter.titleJa}
        description={chapter.summaryMy}
      />
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/vocab/ch/${chapter.id}/quiz`}
          className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          ７日目 実戦問題
        </Link>
        <p className="self-center text-xs text-muted-foreground">
          {inChapter.length} ဝေါဟာရ
        </p>
      </div>
      {!items ? (
        <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
      ) : (
        chapter.sections.map((section) => {
          const words = itemsInSection(inChapter, section.id)
          return (
            <section key={section.id} className="grid gap-2">
              <h2 className="font-heading text-base font-semibold">
                {sectionUnitLabel(chapter, section)} {section.titleJa}
                <span className="my-script ml-2 text-sm font-normal text-muted-foreground">
                  {section.titleMy}
                </span>
              </h2>
              {section.introJa && !isPracticeSection(section) ? (
                <p className="rounded-2xl bg-muted/40 px-3 py-2 text-sm leading-6">
                  {section.introJa}
                  <span className="my-script mt-1 block text-xs text-muted-foreground">
                    {section.introMy}
                  </span>
                </p>
              ) : null}
              {isPracticeSection(section) ? (
                <Link
                  href={`/vocab/ch/${chapter.id}/quiz`}
                  className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
                >
                  <p className="font-medium">ဤအပတ် 語彙 ကို quiz ဖြင့် စစ်ပါ။</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    အဓိပ္ပာယ်နှင့် 星問題 · ၇၀% အထက် ရရင် အပတ် ပြီးဆုံး။
                  </p>
                </Link>
              ) : words.length === 0 ? (
                <p className="text-sm text-muted-foreground">ဤအပိုင်းတွင် စကားလုံး မရှိသေးပါ။</p>
              ) : (
                <div className="grid gap-2">
                  {words.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
                    >
                      <div className="flex items-start gap-2">
                        <Link href={entryHref("/vocab", item.id)} className="min-w-0 flex-1">
                          <p className="font-heading text-xl font-semibold">
                            <RubyWord word={item.word} reading={item.reading} />
                          </p>
                          <p className="my-script mt-1 text-sm">
                            {displayMeaning(item.meanings, item.meaningMy)}
                          </p>
                        </Link>
                        <AudioPlayer text={item.reading || item.word} compact />
                        <BookmarkButton
                          active={progress.bookmarks.vocab.includes(item.id)}
                          onClick={() => toggleBookmark("vocab", item.id)}
                          label="Bookmark"
                        />
                      </div>
                      <div className="mt-2">
                        <PosTags
                          pos={item.pos}
                          transitivity={item.transitivity}
                          level={item.level}
                        />
                      </div>
                      {item.examples[0] ? (
                        <div className="mt-3 rounded-2xl bg-muted/40 p-3">
                          <p className="text-sm leading-7">{item.examples[0].ja}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.examples[0].en}
                          </p>
                          {item.examples[0].my ? (
                            <p className="my-script mt-1 text-xs">{item.examples[0].my}</p>
                          ) : null}
                          <div className="mt-2">
                            <AudioPlayer
                              text={item.examples[0].ja}
                              label="例文"
                            />
                          </div>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )
        })
      )}
      <SourceCredits compact book="goi" />
    </div>
  )
}
