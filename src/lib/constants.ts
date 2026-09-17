import type { AppSettings, MasteryStatus } from "@/lib/types"

export const STORAGE_KEY = "nichi.study-store.v2"
export const LEGACY_STORAGE_KEYS = ["nichi.study-store.v1"]

export const SUBJECTS = [
  "Kanji",
  "Grammar",
  "Reading",
  "Listening",
  "Vocabulary",
  "Past Papers",
] as const

export const SUBJECT_COLORS: Record<string, string> = {
  Kanji: "var(--chart-2)",
  Grammar: "var(--chart-1)",
  Reading: "var(--chart-3)",
  Listening: "var(--chart-4)",
  Vocabulary: "var(--chart-5)",
  "Past Papers": "oklch(0.58 0.12 310)",
}

export const FALLBACK_SUBJECT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export const STATUS_LABELS: Record<MasteryStatus, string> = {
  in_progress: "In progress",
  needs_review: "Needs review",
  completed: "Completed",
}

export const DURATION_PRESETS = [15, 30, 60] as const

export const POMODORO_FOCUS_SECONDS = 25 * 60
export const POMODORO_BREAK_SECONDS = 5 * 60

export const DEFAULT_SETTINGS: AppSettings = {
  reminderEnabled: true,
  reminderTime: "19:00",
  reminderMessage: "Time to study for JLPT N2!",
  dailyGoalMinutes: 120,
  examDate: "2026-12-06",
  examName: "JLPT N2",
  pomodoroSubject: "Grammar",
  lastNotifiedDate: null,
  notificationsGranted: false,
}
