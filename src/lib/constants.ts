import type { AppSettings, MasteryStatus } from "@/lib/types"

export const STORAGE_KEY = "nichi.study-store.v1"

export const SUBJECTS = [
  "JLPT N2 Grammar",
  "Kanji",
  "Reading",
  "Listening",
  "Vocabulary",
  "Speaking",
  "Mock Test",
] as const

export const SUBJECT_COLORS: Record<string, string> = {
  "JLPT N2 Grammar": "var(--chart-1)",
  Kanji: "var(--chart-2)",
  Reading: "var(--chart-3)",
  Listening: "var(--chart-4)",
  Vocabulary: "var(--chart-5)",
  Speaking: "oklch(0.62 0.14 310)",
  "Mock Test": "oklch(0.55 0.12 200)",
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

export const DEFAULT_SETTINGS: AppSettings = {
  reminderEnabled: true,
  reminderTime: "19:00",
  reminderMessage: "Time to study for JLPT N2!",
  dailyGoalMinutes: 60,
  lastNotifiedDate: null,
  notificationsGranted: false,
}
