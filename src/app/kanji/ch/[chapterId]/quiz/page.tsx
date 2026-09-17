"use client"

import { use, useEffect, useMemo, useState } from "react"
import { ChapterQuiz } from "@/components/jlpt/chapter-quiz"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { soumatomeKanjiWeek } from "@/data/books"
import { loadKanji } from "@/lib/jlpt/catalog"
import { itemsInChapter } from "@/lib/jlpt/curriculum"
import { chapterUnitLabel } from "@/lib/jlpt/labels"
import { kanjiQuiz } from "@/lib/jlpt/quiz"
import type { KanjiEntry } from "@/lib/jlpt/types"

export default function KanjiQuizPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = use(params)
  const chapter = soumatomeKanjiWeek(chapterId)
  const [items, setItems] = useState<KanjiEntry[] | null>(null)

  useEffect(() => {
    loadKanji().then(setItems)
  }, [])

  const questions = useMemo(() => {
    if (!items) return []
    return kanjiQuiz(itemsInChapter(items, chapterId))
  }, [items, chapterId])

  if (!chapter) return <p>အပတ် မတွေ့ပါ။</p>

  return (
    <div>
      <ModuleHero
        backHref={`/kanji/ch/${chapter.id}`}
        kicker={`${chapterUnitLabel(chapter)} 実戦問題`}
        title={chapter.titleJa}
        description="အဓိပ္ပာယ်၊ 音読み၊ 星問題 熟語။ ၇၀% အထက် ရရင် ဤအပတ် ပြီးဆုံး မှတ်သည်။"
      />
      {items ? (
        <ChapterQuiz
          questions={questions}
          kind="kanji"
          chapterId={chapter.id}
          backHref={`/kanji/ch/${chapter.id}`}
          title={chapter.titleJa}
        />
      ) : (
        <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
      )}
    </div>
  )
}
