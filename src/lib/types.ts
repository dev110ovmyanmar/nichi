export type MasteryStatus = "in_progress" | "needs_review" | "completed"

export type LogSource = "manual" | "preset" | "pomodoro"

export type StudyLog = {
  id: string
  date: string
  subject: string
  hours: number
  minutes: number
  notes: string
  status: MasteryStatus
  source?: LogSource
  createdAt: string
  updatedAt: string
}

export type AppSettings = {
  reminderEnabled: boolean
  reminderTime: string
  reminderMessage: string
  dailyGoalMinutes: number
  examDate: string
  examName: string
  pomodoroSubject: string
  lastNotifiedDate: string | null
  notificationsGranted: boolean
}

export type AppStore = {
  logs: StudyLog[]
  settings: AppSettings
}

export type DayMinutes = {
  date: string
  label: string
  minutes: number
}

export type SubjectShare = {
  subject: string
  minutes: number
  percent: number
  color: string
}

export type HeatmapCell = {
  date: string
  minutes: number
  level: 0 | 1 | 2 | 3 | 4
}

export type HeatmapWeek = {
  days: HeatmapCell[]
}
