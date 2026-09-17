export type MasteryStatus = "in_progress" | "needs_review" | "completed"

export type StudyLog = {
  id: string
  date: string
  subject: string
  hours: number
  minutes: number
  notes: string
  status: MasteryStatus
  createdAt: string
  updatedAt: string
}

export type AppSettings = {
  reminderEnabled: boolean
  reminderTime: string
  reminderMessage: string
  dailyGoalMinutes: number
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
