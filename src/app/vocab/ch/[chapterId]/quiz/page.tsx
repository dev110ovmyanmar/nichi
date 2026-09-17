"use client"

import { use, useEffect, useMemo, useState } from "react"
import { ChapterQuiz } from "@/components/jlpt/chapter-quiz"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { tangoChapter } from "@/data/books"
import { chapterUnitLabel } from "@/lib/jlpt/labels"
import { loadVocab } from "@/lib/jlpt/catalog"
import { itemsInChapter } from "@/lib/jlpt/curriculum"
import { vocabQuiz } from "@/lib/jlpt/quiz"
import type { VocabEntry } from "@/lib/jlpt/types"

export default function TangoQuizPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = use(params)
  const chapter = tangoChapter(chapterId)
  const [items, setItems] = useState<VocabEntry[] | null>(null)

  useEffect(() => {
    loadVocab().then(setItems)
  }, [])

  const questions = useMemo(() => {
    if (!items) return []
    return vocabQuiz(itemsInChapter(items, chapterId))
  }, [items, chapterId])

  if (!chapter) return <p>အပတ် မတွေ့ပါ။</p>

  return (
    <div>
      <ModuleHero
        backHref={`/vocab/ch/${chapter.id}`}
        kicker={`${chapterUnitLabel(chapter)} 実戦問題`}
        title={chapter.titleJa}
        description="အဓိပ္ပာယ် ရွေးခြင်းနှင့် 星問題 ဖတ်ပုံ။ ၇၀% အထက် ရရင် ဤအပတ် ပြီးဆုံး မှတ်သည်။"
      />
      {items ? (
        <ChapterQuiz
          questions={questions}
          kind="vocab"
          chapterId={chapter.id}
          backHref={`/vocab/ch/${chapter.id}`}
          title={chapter.titleJa}
        />
      ) : (
        <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
      )}
    </div>
  )
}
