"use client"

import { use, useEffect, useMemo, useState } from "react"
import { ChapterQuiz } from "@/components/jlpt/chapter-quiz"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { kanjiMasterChapter } from "@/data/books"
import { loadKanji } from "@/lib/jlpt/catalog"
import { itemsInChapter } from "@/lib/jlpt/curriculum"
import { kanjiQuiz } from "@/lib/jlpt/quiz"
import type { KanjiEntry } from "@/lib/jlpt/types"

export default function KanjiQuizPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = use(params)
  const chapter = kanjiMasterChapter(chapterId)
  const [items, setItems] = useState<KanjiEntry[] | null>(null)

  useEffect(() => {
    loadKanji().then(setItems)
  }, [])

  const questions = useMemo(() => {
    if (!items) return []
    return kanjiQuiz(itemsInChapter(items, chapterId))
  }, [items, chapterId])

  if (!chapter) return <p>အခန်း မတွေ့ပါ။</p>

  return (
    <div>
      <ModuleHero
        backHref={`/kanji/ch/${chapter.id}`}
        kicker={`第${chapter.number}章 quiz`}
        title={chapter.titleJa}
        description="အဓိပ္ပာယ်၊ 音読み၊ 星問題 熟語။ ၇၀% အထက် ရရင် အခန်း ပြီးဆုံး မှတ်သည်။"
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
