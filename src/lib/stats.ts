import {
  FALLBACK_SUBJECT_COLORS,
  SUBJECT_COLORS,
} from "@/lib/constants"
import {
  lastNDates,
  formatShortDay,
  todayISO,
  addDays,
  startOfWeekSunday,
} from "@/lib/dates"
import type {
  DayMinutes,
  HeatmapCell,
  HeatmapWeek,
  StudyLog,
  SubjectShare,
} from "@/lib/types"

export function totalMinutes(log: Pick<StudyLog, "hours" | "minutes">) {
  return log.hours * 60 + log.minutes
}

export function splitMinutes(total: number) {
  const safe = Math.max(0, Math.round(total))
  return { hours: Math.floor(safe / 60), minutes: safe % 60 }
}

export function formatDuration(minutes: number) {
  const safe = Math.max(0, Math.round(minutes))
  const hours = Math.floor(safe / 60)
  const mins = safe % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function logsOnDate(logs: StudyLog[], date: string) {
  return logs.filter((log) => log.date === date)
}

export function minutesOnDate(logs: StudyLog[], date: string) {
  return logsOnDate(logs, date).reduce((sum, log) => sum + totalMinutes(log), 0)
}

export function weekSeries(logs: StudyLog[]): DayMinutes[] {
  return lastNDates(7).map((date) => ({
    date,
    label: formatShortDay(date),
    minutes: minutesOnDate(logs, date),
  }))
}

export function weekTotalMinutes(logs: StudyLog[]) {
  return weekSeries(logs).reduce((sum, day) => sum + day.minutes, 0)
}

export function subjectBreakdown(
  logs: StudyLog[],
  dates: string[]
): SubjectShare[] {
  const dateSet = new Set(dates)
  const totals = new Map<string, number>()

  for (const log of logs) {
    if (!dateSet.has(log.date)) continue
    totals.set(log.subject, (totals.get(log.subject) ?? 0) + totalMinutes(log))
  }

  const total = [...totals.values()].reduce((sum, value) => sum + value, 0)
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([subject, minutes], index) => ({
      subject,
      minutes,
      percent: total === 0 ? 0 : Math.round((minutes / total) * 100),
      color:
        SUBJECT_COLORS[subject] ??
        FALLBACK_SUBJECT_COLORS[index % FALLBACK_SUBJECT_COLORS.length],
    }))
}

export function studiedDates(logs: StudyLog[]) {
  return [...new Set(logs.map((log) => log.date))].sort()
}

export function currentStreak(logs: StudyLog[], today = todayISO()) {
  const dates = new Set(studiedDates(logs))
  if (dates.size === 0) return 0

  let cursor = dates.has(today) ? today : addDays(today, -1)
  if (!dates.has(cursor)) return 0

  let streak = 0
  while (dates.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function longestStreak(logs: StudyLog[]) {
  const dates = studiedDates(logs)
  if (dates.length === 0) return 0

  let best = 1
  let run = 1
  for (let i = 1; i < dates.length; i += 1) {
    if (dates[i] === addDays(dates[i - 1], 1)) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }
  return best
}

export function heatmapLevel(
  minutes: number,
  dailyGoalMinutes: number
): HeatmapCell["level"] {
  if (minutes <= 0) return 0
  if (minutes < dailyGoalMinutes * 0.25) return 1
  if (minutes < dailyGoalMinutes * 0.5) return 2
  if (minutes < dailyGoalMinutes) return 3
  return 4
}

export function activityHeatmap(
  logs: StudyLog[],
  weeks = 17,
  dailyGoalMinutes = 120,
  today = todayISO()
): HeatmapWeek[] {
  const weekStart = startOfWeekSunday(today)
  const start = addDays(weekStart, -(weeks - 1) * 7)

  return Array.from({ length: weeks }, (_, weekIndex) => ({
    days: Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(start, weekIndex * 7 + dayIndex)
      const minutes = date > today ? 0 : minutesOnDate(logs, date)
      return {
        date,
        minutes,
        level: date > today ? 0 : heatmapLevel(minutes, dailyGoalMinutes),
      }
    }),
  }))
}
