"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AudioPlayer } from "@/components/jlpt/audio-player"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { KanjiStroke } from "@/components/jlpt/kanji-stroke"
import { BookmarkButton } from "@/components/jlpt/ruby-word"
import { FuriganaSentence } from "@/components/jlpt/sentence"
import { SourceCite, SourceCredits } from "@/components/jlpt/source-credits"
import { soumatomeKanjiWeek } from "@/data/books"
import { SOUMATOME_KANJI_BOOK } from "@/data/sources"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { displayMeaning } from "@/lib/jlpt/burmese"
import { loadKanji, loadVocab } from "@/lib/jlpt/catalog"
import { entryHref, findById } from "@/lib/jlpt/ids"
import { chapterUnitLabel, sectionUnitLabel } from "@/lib/jlpt/labels"
import type { KanjiEntry, VocabEntry } from "@/lib/jlpt/types"

export default function KanjiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [item, setItem] = useState<KanjiEntry | null | undefined>(undefined)
  const [compounds, setCompounds] = useState<VocabEntry[]>([])
  const { progress, toggleBookmark, markKnown } = useJlptProgress()

  useEffect(() => {
    let cancelled = false
    loadKanji()
      .then((all) => {
        if (cancelled) return
        const found = findById(all, id)
        setItem(found)
        if (!found) return
        loadVocab().then((vocab) => {
          if (cancelled) return
          setCompounds(
            vocab.filter((word) => word.word.includes(found.character)).slice(0, 8)
          )
        })
      })
      .catch(() => {
        if (!cancelled) setItem(null)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const meaning = useMemo(
    () => (item ? displayMeaning(item.meanings, item.meaningMy) : ""),
    [item]
  )

  if (item === undefined) return <p className="text-sm text-muted-foreground">ခေါ်ယူနေသည်…</p>
  if (!item) return <p>မတွေ့ပါ။</p>

  const chapter = soumatomeKanjiWeek(item.chapterId)
  const section = chapter?.sections.find((entry) => entry.id === item.sectionId)
  const speakText = item.onyomi[0] || item.kunyomi[0] || item.character

  return (
    <div className="grid gap-5">
      <ModuleHero
        backHref={chapter ? `/kanji/ch/${chapter.id}` : "/kanji"}
        kicker={`漢字 · ${SOUMATOME_KANJI_BOOK.title}`}
        title={item.character}
        description={meaning}
      />
      <div className="flex items-end justify-between gap-3">
        <p className="font-heading text-7xl leading-none">{item.character}</p>
        <BookmarkButton
          active={progress.bookmarks.kanji.includes(item.id)}
          onClick={() => toggleBookmark("kanji", item.id)}
          label="Bookmark kanji"
        />
      </div>
      <AudioPlayer text={speakText} label="読み" />
      <div className="grid gap-1 text-sm">
        <p>
          <span className="text-muted-foreground">この場面の熟語 · </span>
          {item.compounds?.length ? item.compounds.slice(0, 4).join("・") : "—"}
        </p>
        <p>
          <span className="text-muted-foreground">音読み · </span>
          {item.onyomi.join("、") || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">訓読み · </span>
          {item.kunyomi.join("、") || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">部首 · </span>
          {item.radical}（{item.radicalMy}）
        </p>
        <p>
          <span className="text-muted-foreground">画数 · </span>
          {item.strokes} 画
        </p>
        {chapter ? (
          <p>
            <span className="text-muted-foreground">課程 · </span>
            {chapterUnitLabel(chapter)} {chapter.titleJa}
            {section ? ` · ${sectionUnitLabel(chapter, section)} ${section.titleJa}` : ""}
          </p>
        ) : null}
        <p className="pt-1">
          <SourceCite id="kanjidic2" />
        </p>
      </div>
      <KanjiStroke character={item.character} />
      <section>
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-heading text-base font-semibold">例文</h2>
          <SourceCite id="tatoeba" />
        </div>
        <div className="mt-2 grid gap-2">
          {(item.examples?.length ? item.examples : []).slice(0, 3).map((example) => (
            <figure key={example.ja} className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
              <p className="text-lg">
                <FuriganaSentence
                  ja={example.ja}
                  word={item.character}
                  reading={item.kunyomi[0] || item.onyomi[0]}
                />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{example.en}</p>
              {example.my ? (
                <p className="my-script mt-1 text-sm">{example.my}</p>
              ) : null}
              <div className="mt-2">
                <AudioPlayer text={example.ja} label="例文" />
              </div>
            </figure>
          ))}
          {!item.examples?.length ? (
            <p className="text-sm text-muted-foreground">ဥပမာဝါကျ မရှိသေးပါ။</p>
          ) : null}
        </div>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold">この場面の熟語</h2>
        <p className="mt-2 text-sm">{item.compounds?.join("・") || "—"}</p>
        <ul className="mt-2 grid gap-2">
          {compounds.map((word) => (
            <li key={word.id}>
              <Link href={entryHref("/vocab", word.id)} className="text-primary">
                {word.word}{" "}
                <span className="text-muted-foreground">({word.reading})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="flex gap-2">
        <button
          type="button"
          className="h-11 flex-1 rounded-2xl bg-primary text-primary-foreground"
          onClick={() => markKnown("kanji", item.id)}
        >
          {progress.knownKanji.includes(item.id) ? "ကျက်ပြီး" : "ကျက်ပြီးဟု မှတ်"}
        </button>
        {chapter ? (
          <Link
            href={`/kanji/ch/${chapter.id}/quiz`}
            className="inline-flex h-11 items-center rounded-2xl bg-secondary px-4 text-sm font-medium"
          >
            実戦問題
          </Link>
        ) : null}
      </div>
      <SourceCredits compact />
    </div>
  )
}
