import { DEFAULT_SETTINGS, STORAGE_KEY, SUBJECTS } from "@/lib/constants"
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
    {
      daysAgo: 6,
      subject: "JLPT N2 Grammar",
      hours: 1,
      minutes: 0,
      status: "completed",
      notes: "Reviewed ば-conditional vs たら. Wrote 10 example sentences.",
    },
    {
      daysAgo: 5,
      subject: "Kanji",
      hours: 0,
      minutes: 40,
      status: "needs_review",
      notes: "Drilled 20 N2 kanji. 成、達、続 still mix together.",
    },
    {
      daysAgo: 5,
      subject: "Vocabulary",
      hours: 0,
      minutes: 30,
      status: "completed",
      notes: "Anki: 35 new, 48 reviews. Focused on 敬語 verbs.",
    },
    {
      daysAgo: 4,
      subject: "Reading",
      hours: 0,
      minutes: 50,
      status: "needs_review",
      notes: "NHK Easy + one N2 passage. Inference questions were slow.",
    },
    {
      daysAgo: 3,
      subject: "Listening",
      hours: 0,
      minutes: 35,
      status: "in_progress",
      notes: "Shadowed a So-matome dialogue twice. Need more speed.",
    },
    {
      daysAgo: 2,
      subject: "JLPT N2 Grammar",
      hours: 0,
      minutes: 45,
      status: "completed",
      notes: "Covered わけではない / というわけではない contrast.",
    },
    {
      daysAgo: 2,
      subject: "Kanji",
      hours: 0,
      minutes: 25,
      status: "completed",
      notes: "Wrote each missed kanji 8 times from yesterday.",
    },
    {
      daysAgo: 1,
      subject: "Vocabulary",
      hours: 0,
      minutes: 40,
      status: "completed",
      notes: "Review deck at 92% retention. Added 12 workplace words.",
    },
    {
      daysAgo: 1,
      subject: "Reading",
      hours: 0,
      minutes: 30,
      status: "in_progress",
      notes: "Timed a 600-character passage. Finished with 2 minutes left.",
    },
  ]

  return sessions.map((session, index) => ({
    id: `seed-${index + 1}`,
    date: addDays(today, -session.daysAgo),
    subject: session.subject,
    hours: session.hours,
    minutes: session.minutes,
    notes: session.notes,
    status: session.status,
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

function parseSettings(value: unknown): AppSettings {
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
  }
}

export function loadStore(): AppStore {
  if (typeof window === "undefined") {
    return { logs: [], settings: DEFAULT_SETTINGS }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded: AppStore = {
        logs: createSeedLogs(),
        settings: DEFAULT_SETTINGS,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw) as Partial<AppStore>
    const logs = Array.isArray(parsed.logs) ? parsed.logs.filter(isLog) : []
    return {
      logs,
      settings: parseSettings(parsed.settings),
    }
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
