"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { AppHeader } from "@/components/app-header"
import { LogList } from "@/components/log-list"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { ReminderBanner } from "@/components/reminder-banner"
import { SettingsDialog } from "@/components/settings-dialog"
import { StatsOverview } from "@/components/stats-overview"
import { StudyForm } from "@/components/study-form"
import { SubjectBreakdown } from "@/components/subject-breakdown"
import { WeeklyChart } from "@/components/weekly-chart"
import { useReminder } from "@/hooks/use-reminder"
import { useStudyStore, type LogDraft } from "@/hooks/use-study-store"
import { lastNDates, todayISO } from "@/lib/dates"
import {
  createSeedLogs,
  parseImport,
  serializeExport,
} from "@/lib/storage"
import {
  activityHeatmap,
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
  const heatmap = useMemo(
    () => activityHeatmap(logs, 17, settings.dailyGoalMinutes, today),
    [logs, settings.dailyGoalMinutes, today]
  )

  const handleNotified = useCallback(
    (date: string) => {
      updateSettings({ lastNotifiedDate: date })
    },
    [updateSettings]
  )

  useReminder({
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
    toast.success(
      draft.source === "preset" ? "Quick session logged" : "Session logged",
      {
        description: `${draft.subject} · ${formatDuration(draft.hours * 60 + draft.minutes)}`,
      }
    )
  }

  const handlePomodoroComplete = useCallback(
    (draft: LogDraft) => {
      addLog(draft)
    },
    [addLog]
  )

  function handleEdit(log: StudyLog) {
    setEditing(log)
    document.getElementById("logger")?.scrollIntoView({ behavior: "smooth" })
  }

  function exportData() {
    const json = serializeExport({ logs, settings })
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `nichi-study-${today}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Exported study data")
  }

  async function importData(file: File) {
    try {
      const text = await file.text()
      const next = parseImport(text)
      replaceAll(next)
      setEditing(null)
      toast.success("Imported study data", {
        description: `${next.logs.length} session${next.logs.length === 1 ? "" : "s"} loaded.`,
      })
    } catch (error) {
      toast.error("Could not import that file", {
        description:
          error instanceof Error ? error.message : "Use a Nichi JSON export.",
      })
    }
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
            Track daily study, hit a 2-hour target, and watch the exam date get
            closer.
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
          examName={settings.examName}
          examDate={settings.examDate}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <StudyForm
            key={editing?.id ?? "new"}
            editing={editing}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditing(null)}
          />
          <PomodoroTimer
            subject={settings.pomodoroSubject}
            onSubjectChange={(subject) =>
              updateSettings({ pomodoroSubject: subject })
            }
            onComplete={handlePomodoroComplete}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyChart series={series} totalMinutes={weekMinutes} />
          <SubjectBreakdown items={subjects} />
        </div>

        <ActivityHeatmap weeks={heatmap} />

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
        onExport={exportData}
        onImport={importData}
      />
    </div>
  )
}
