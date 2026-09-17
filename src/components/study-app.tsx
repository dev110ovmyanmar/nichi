"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { LogList } from "@/components/log-list"
import { ReminderBanner } from "@/components/reminder-banner"
import { SettingsDialog } from "@/components/settings-dialog"
import { StatsOverview } from "@/components/stats-overview"
import { StudyForm } from "@/components/study-form"
import { SubjectBreakdown } from "@/components/subject-breakdown"
import { WeeklyChart } from "@/components/weekly-chart"
import { useReminder } from "@/hooks/use-reminder"
import { useStudyStore, type LogDraft } from "@/hooks/use-study-store"
import { lastNDates, todayISO } from "@/lib/dates"
import { createSeedLogs } from "@/lib/storage"
import {
  currentStreak,
  formatDuration,
  longestStreak,
  minutesOnDate,
  subjectBreakdown,
  weekSeries,
  weekTotalMinutes,
} from "@/lib/stats"
import { DEFAULT_SETTINGS } from "@/lib/constants"
import type { StudyLog } from "@/lib/types"

export function StudyApp() {
  const {
    logs,
    settings,
    ready,
    addLog,
    updateLog,
    deleteLog,
    updateSettings,
    replaceAll,
  } = useStudyStore()
  const [editing, setEditing] = useState<StudyLog | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const today = todayISO()
  const todayMinutes = minutesOnDate(logs, today)
  const weekMinutes = weekTotalMinutes(logs)
  const streak = currentStreak(logs, today)
  const bestStreak = longestStreak(logs)
  const series = useMemo(() => weekSeries(logs), [logs])
  const subjects = useMemo(
    () => subjectBreakdown(logs, lastNDates(7, today)),
    [logs, today]
  )

  const handleNotified = useCallback(
    (date: string) => {
      updateSettings({ lastNotifiedDate: date })
    },
    [updateSettings]
  )

  useReminder({
    ready,
    settings,
    studiedToday: todayMinutes > 0,
    onNotified: handleNotified,
  })

  function handleSubmit(draft: LogDraft) {
    if (editing) {
      updateLog(editing.id, draft)
      toast.success("Session updated", {
        description: `${draft.subject} · ${formatDuration(draft.hours * 60 + draft.minutes)}`,
      })
      setEditing(null)
      return
    }
    addLog(draft)
    toast.success("Session logged", {
      description: `${draft.subject} · ${formatDuration(draft.hours * 60 + draft.minutes)}`,
    })
  }

  function handleEdit(log: StudyLog) {
    setEditing(log)
    document.getElementById("logger")?.scrollIntoView({ behavior: "smooth" })
  }

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading your journal…
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <AppHeader streak={streak} onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <section className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Keep showing up
          </p>
          <h1 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            A quiet place to log study, protect your streak, and see the week
            clearly.
          </h1>
        </section>

        <ReminderBanner
          visible={todayMinutes === 0}
          message={settings.reminderMessage}
          reminderTime={settings.reminderTime}
          onLogNow={() =>
            document.getElementById("logger")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        />

        <StatsOverview
          todayMinutes={todayMinutes}
          weekMinutes={weekMinutes}
          streak={streak}
          longestStreak={bestStreak}
          dailyGoalMinutes={settings.dailyGoalMinutes}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <StudyForm
            key={editing?.id ?? "new"}
            editing={editing}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditing(null)}
          />
          <div className="grid gap-6">
            <WeeklyChart series={series} totalMinutes={weekMinutes} />
            <SubjectBreakdown items={subjects} />
          </div>
        </div>

        <LogList
          logs={logs}
          today={today}
          onEdit={handleEdit}
          onDelete={(id) => {
            deleteLog(id)
            if (editing?.id === id) setEditing(null)
            toast.success("Session deleted")
          }}
        />
      </main>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onUpdateSettings={updateSettings}
        onRestoreSample={() => {
          replaceAll({ logs: createSeedLogs(), settings: DEFAULT_SETTINGS })
          setEditing(null)
        }}
        onClearLogs={() => {
          replaceAll({ logs: [] })
          setEditing(null)
        }}
      />
    </div>
  )
}
