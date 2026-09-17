"use client"

import Link from "next/link"
import type { CurriculumChapter } from "@/lib/jlpt/types"
import { cn } from "@/lib/utils"

export function ChapterList({
  chapters,
  hrefFor,
  counts,
  known,
  completed,
}: {
  chapters: CurriculumChapter[]
  hrefFor: (chapterId: string) => string
  counts: Record<string, number>
  known: Record<string, number>
  completed: string[]
}) {
  return (
    <div className="grid gap-2">
      {chapters.map((chapter) => {
        const total = counts[chapter.id] ?? 0
        const done = known[chapter.id] ?? 0
        const percent = total ? Math.round((done / total) * 100) : 0
        const isDone = completed.includes(chapter.id)
        return (
          <Link
            key={chapter.id}
            href={hrefFor(chapter.id)}
            className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  第{chapter.number}章
                  {isDone ? " · 完了" : ""}
                </p>
                <p className="font-heading mt-0.5 text-lg font-semibold">{chapter.titleJa}</p>
                <p className="my-script mt-0.5 text-sm text-muted-foreground">
                  {chapter.titleMy}
                </p>
              </div>
              <p className="text-right text-xs tabular-nums text-muted-foreground">
                {done}/{total}
                <span className="mt-1 block">{percent}%</span>
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full bg-primary", percent === 0 && "opacity-30")}
                style={{ width: `${Math.max(percent, percent === 0 ? 4 : 0)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {chapter.sections.map((section) => section.titleJa).join(" · ")}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
