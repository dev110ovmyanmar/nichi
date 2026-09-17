"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { DEFAULT_SETTINGS } from "@/lib/constants"
import { loadStore, newLogId, saveStore } from "@/lib/storage"
import type {
  AppSettings,
  AppStore,
  LogSource,
  MasteryStatus,
  StudyLog,
} from "@/lib/types"

export type LogDraft = {
  date: string
  subject: string
  hours: number
  minutes: number
  notes: string
  status: MasteryStatus
  source?: LogSource
}

const emptyStore: AppStore = { logs: [], settings: DEFAULT_SETTINGS }

let memory: AppStore | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function read(): AppStore {
  if (memory) return memory
  memory = loadStore()
  return memory
}

function write(next: AppStore) {
  memory = next
  saveStore(next)
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useStudyStore() {
  const store = useSyncExternalStore(subscribe, read, () => emptyStore)

  const addLog = useCallback((draft: LogDraft) => {
    const current = read()
    const now = new Date().toISOString()
    const log: StudyLog = {
      id: newLogId(),
      ...draft,
      source: draft.source ?? "manual",
      createdAt: now,
      updatedAt: now,
    }
    write({ ...current, logs: [log, ...current.logs] })
    return log
  }, [])

  const updateLog = useCallback((id: string, draft: LogDraft) => {
    const current = read()
    const now = new Date().toISOString()
    write({
      ...current,
      logs: current.logs.map((log) =>
        log.id === id ? { ...log, ...draft, updatedAt: now } : log
      ),
    })
  }, [])

  const deleteLog = useCallback((id: string) => {
    const current = read()
    write({
      ...current,
      logs: current.logs.filter((log) => log.id !== id),
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    const current = read()
    write({
      ...current,
      settings: { ...current.settings, ...patch },
    })
  }, [])

  const replaceAll = useCallback(
    (next: { logs?: StudyLog[]; settings?: AppSettings }) => {
      const current = read()
      write({
        logs: next.logs ?? current.logs,
        settings: next.settings ?? current.settings,
      })
    },
    []
  )

  const sortedLogs = useMemo(
    () =>
      [...store.logs].sort((a, b) => {
        if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt)
        return b.date.localeCompare(a.date)
      }),
    [store.logs]
  )

  return {
    logs: sortedLogs,
    settings: store.settings,
    addLog,
    updateLog,
    deleteLog,
    updateSettings,
    replaceAll,
  }
}
