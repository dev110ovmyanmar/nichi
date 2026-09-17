"use client"

import { useCallback, useSyncExternalStore } from "react"
import {
  loadProgress,
  saveProgress,
  toggleList,
  type JlptProgress,
} from "@/lib/jlpt/progress"
import type { QuizKind } from "@/lib/jlpt/types"

const empty = loadProgress()
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function snapshot() {
  return loadProgress()
}

export function useJlptProgress() {
  const progress = useSyncExternalStore(subscribe, snapshot, () => empty)

  const update = useCallback((patch: Partial<JlptProgress>) => {
    saveProgress(patch)
    emit()
  }, [])

  const toggleBookmark = useCallback(
    (kind: keyof JlptProgress["bookmarks"], id: string) => {
      const current = loadProgress()
      update({
        bookmarks: {
          ...current.bookmarks,
          [kind]: toggleList(current.bookmarks[kind], id),
        },
      })
    },
    [update]
  )

  const markKnown = useCallback((kind: "vocab" | "kanji", id: string) => {
    const current = loadProgress()
    if (kind === "vocab") {
      update({ knownVocab: toggleList(current.knownVocab, id) })
    } else {
      update({ knownKanji: toggleList(current.knownKanji, id) })
    }
  }, [update])

  const recordQuiz = useCallback(
    (kind: QuizKind, score: number, total: number) => {
      const current = loadProgress()
      update({
        quizHistory: [
          {
            id: `${kind}-${Date.now()}`,
            kind,
            score,
            total,
            at: new Date().toISOString(),
          },
          ...current.quizHistory,
        ].slice(0, 40),
      })
    },
    [update]
  )

  return { progress, update, toggleBookmark, markKnown, recordQuiz }
}
