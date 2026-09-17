import { DEFAULT_SETTINGS, LEGACY_STORAGE_KEYS, STORAGE_KEY, SUBJECTS } from "@/lib/constants"
import { addDays, todayISO } from "@/lib/dates"
import type { AppSettings, AppStore, MasteryStatus, StudyLog } from "@/lib/types"

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `log-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createSeedLogs(): StudyLog[] {
  const today = todayISO()
  const now = new Date().toISOString()

  const sessions: Array<{
    daysAgo: number
    subject: (typeof SUBJECTS)[number] | string
    hours: number
    minutes: number
    status: MasteryStatus
    notes: string
  }> = [
    { daysAgo: 48, subject: "Kanji", hours: 0, minutes: 40, status: "completed", notes: "Core 2000 review set A." },
    { daysAgo: 45, subject: "Grammar", hours: 1, minutes: 0, status: "completed", notes: " bunpo 〜わけではない drill." },
    { daysAgo: 41, subject: "Vocabulary", hours: 0, minutes: 30, status: "completed", notes: "Anki new: 20." },
    { daysAgo: 38, subject: "Reading", hours: 0, minutes: 45, status: "needs_review", notes: "One N2 passage, slow on inference." },
    { daysAgo: 34, subject: "Listening", hours: 0, minutes: 25, status: "in_progress", notes: "Shadowed a news clip once." },
    { daysAgo: 31, subject: "Kanji", hours: 0, minutes: 50, status: "completed", notes: "Wrote 15 missed kanji." },
    { daysAgo: 27, subject: "Past Papers", hours: 1, minutes: 10, status: "needs_review", notes: "2019 July language knowledge." },
    { daysAgo: 24, subject: "Grammar", hours: 0, minutes: 40, status: "completed", notes: "〜ものだ vs 〜ことだ." },
    { daysAgo: 21, subject: "Vocabulary", hours: 0, minutes: 35, status: "completed", notes: "Workplace keigo verbs." },
    { daysAgo: 18, subject: "Reading", hours: 0, minutes: 55, status: "in_progress", notes: "Timed 600-character passage." },
    { daysAgo: 14, subject: "Listening", hours: 0, minutes: 40, status: "completed", notes: "Point comprehension set." },
    { daysAgo: 12, subject: "Kanji", hours: 0, minutes: 30, status: "completed", notes: "Look-alike 成 / 達 / 続." },
    { daysAgo: 10, subject: "Grammar", hours: 0, minutes: 50, status: "completed", notes: "Conditionals ば / たら / と." },
    { daysAgo: 8, subject: "Past Papers", hours: 0, minutes: 45, status: "needs_review", notes: "Listening 2018 December." },
    { daysAgo: 6, subject: "Grammar", hours: 1, minutes: 0, status: "completed", notes: "Reviewed ば-conditional vs たら." },
    { daysAgo: 5, subject: "Kanji", hours: 0, minutes: 40, status: "needs_review", notes: "Drilled 20 N2 kanji." },
    { daysAgo: 5, subject: "Vocabulary", hours: 0, minutes: 30, status: "completed", notes: "Anki: 35 new, 48 reviews." },
    { daysAgo: 4, subject: "Reading", hours: 0, minutes: 50, status: "needs_review", notes: "NHK Easy + one N2 passage." },
    { daysAgo: 3, subject: "Listening", hours: 0, minutes: 35, status: "in_progress", notes: "Shadowed a So-matome dialogue twice." },
    { daysAgo: 2, subject: "Grammar", hours: 0, minutes: 45, status: "completed", notes: "わけではない contrast." },
    { daysAgo: 2, subject: "Kanji", hours: 0, minutes: 25, status: "completed", notes: "Wrote each missed kanji 8 times." },
    { daysAgo: 1, subject: "Vocabulary", hours: 0, minutes: 40, status: "completed", notes: "Review deck at 92% retention." },
    { daysAgo: 1, subject: "Reading", hours: 0, minutes: 30, status: "in_progress", notes: "Timed a 600-character passage." },
  ]

  return sessions.map((session, index) => ({
    id: `seed-${index + 1}`,
    date: addDays(today, -session.daysAgo),
    subject: session.subject,
    hours: session.hours,
    minutes: session.minutes,
    notes: session.notes,
    status: session.status,
    source: "manual",
    createdAt: now,
    updatedAt: now,
  }))
}

function isLog(value: unknown): value is StudyLog {
  if (!value || typeof value !== "object") return false
  const log = value as StudyLog
  return (
    typeof log.id === "string" &&
    typeof log.date === "string" &&
    typeof log.subject === "string" &&
    typeof log.hours === "number" &&
    typeof log.minutes === "number"
  )
}

export function parseSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object") return DEFAULT_SETTINGS
  const settings = value as Partial<AppSettings>
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    reminderTime: settings.reminderTime || DEFAULT_SETTINGS.reminderTime,
    reminderMessage:
      settings.reminderMessage || DEFAULT_SETTINGS.reminderMessage,
    dailyGoalMinutes:
      typeof settings.dailyGoalMinutes === "number"
        ? settings.dailyGoalMinutes
        : DEFAULT_SETTINGS.dailyGoalMinutes,
    examDate: settings.examDate || DEFAULT_SETTINGS.examDate,
    examName: settings.examName || DEFAULT_SETTINGS.examName,
    pomodoroSubject:
      settings.pomodoroSubject || DEFAULT_SETTINGS.pomodoroSubject,
  }
}

function readRawStore(raw: string): AppStore | null {
  try {
    const parsed = JSON.parse(raw) as Partial<AppStore> & {
      version?: number
    }
    const logs = Array.isArray(parsed.logs) ? parsed.logs.filter(isLog) : null
    if (!logs) return null
    return {
      logs,
      settings: parseSettings(parsed.settings),
    }
  } catch {
    return null
  }
}

export function loadStore(): AppStore {
  if (typeof window === "undefined") {
    return { logs: [], settings: DEFAULT_SETTINGS }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = readRawStore(raw)
      if (parsed) return parsed
    }

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = window.localStorage.getItem(key)
      if (!legacy) continue
      const parsed = readRawStore(legacy)
      if (parsed) {
        saveStore(parsed)
        return parsed
      }
    }

    const seeded: AppStore = {
      logs: createSeedLogs(),
      settings: DEFAULT_SETTINGS,
    }
    saveStore(seeded)
    return seeded
  } catch {
    return { logs: createSeedLogs(), settings: DEFAULT_SETTINGS }
  }
}

export function saveStore(store: AppStore) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function newLogId() {
  return createId()
}

export function serializeExport(store: AppStore) {
  return JSON.stringify(
    {
      app: "nichi",
      version: 2,
      exportedAt: new Date().toISOString(),
      logs: store.logs,
      settings: store.settings,
    },
    null,
    2
  )
}

export function parseImport(json: string): AppStore {
  const parsed = JSON.parse(json) as Partial<AppStore> & { version?: unknown }
  const logs = Array.isArray(parsed.logs) ? parsed.logs.filter(isLog) : []
  if (logs.length === 0 && !parsed.settings) {
    throw new Error("No sessions or settings found in that file.")
  }
  return {
    logs,
    settings: parseSettings(parsed.settings),
  }
}
