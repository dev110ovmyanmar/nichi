"use client"

import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHydrated } from "@/hooks/use-hydrated"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DURATION_PRESETS, SUBJECTS } from "@/lib/constants"
import { todayISO } from "@/lib/dates"
import { formatDuration, splitMinutes } from "@/lib/stats"
import { cn } from "@/lib/utils"
import type { MasteryStatus, StudyLog } from "@/lib/types"
import type { LogDraft } from "@/hooks/use-study-store"

const STATUS_OPTIONS: Array<{
  value: MasteryStatus
  label: string
}> = [
  { value: "in_progress", label: "In progress" },
  { value: "needs_review", label: "Review" },
  { value: "completed", label: "Done" },
]

type StudyFormProps = {
  editing: StudyLog | null
  onSubmit: (draft: LogDraft) => void
  onCancelEdit: () => void
}

function emptyDraft(): LogDraft {
  return {
    date: todayISO(),
    subject: "Grammar",
    hours: 0,
    minutes: 30,
    notes: "",
    status: "in_progress",
    source: "manual",
  }
}

function draftFromLog(log: StudyLog): LogDraft {
  return {
    date: log.date,
    subject: log.subject,
    hours: log.hours,
    minutes: log.minutes,
    notes: log.notes,
    status: log.status,
    source: log.source ?? "manual",
  }
}

export function StudyForm({ editing, onSubmit, onCancelEdit }: StudyFormProps) {
  const knownSubjects = useMemo(() => new Set<string>(SUBJECTS), [])
  const [draft, setDraft] = useState<LogDraft>(() =>
    editing ? draftFromLog(editing) : emptyDraft()
  )
  const [customSubject, setCustomSubject] = useState(() =>
    editing && !knownSubjects.has(editing.subject) ? editing.subject : ""
  )
  const [error, setError] = useState<string | null>(null)
  const [showCustomTime, setShowCustomTime] = useState(false)
  const hydrated = useHydrated()

  const usingCustom = !knownSubjects.has(draft.subject)
  const selectedMinutes = draft.hours * 60 + draft.minutes

  function update<K extends keyof LogDraft>(key: K, value: LogDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function setSubject(subject: string) {
    setCustomSubject("")
    update("subject", subject)
  }

  function applyPreset(total: number, logNow: boolean) {
    const split = splitMinutes(total)
    if (logNow) {
      const subject = usingCustom ? customSubject.trim() : draft.subject
      if (!subject) {
        setError("Pick a subject first.")
        return
      }
      onSubmit({
        ...draft,
        subject,
        hours: split.hours,
        minutes: split.minutes,
        notes: draft.notes.trim(),
        source: "preset",
      })
      if (!editing) {
        setDraft({
          ...emptyDraft(),
          subject: knownSubjects.has(subject) ? subject : "Grammar",
        })
        setCustomSubject(knownSubjects.has(subject) ? "" : "")
      }
      setError(null)
      return
    }
    update("hours", split.hours)
    update("minutes", split.minutes)
  }

  function saveDraft() {
    const subject = usingCustom ? customSubject.trim() : draft.subject.trim()
    const hours = Number(draft.hours) || 0
    const minutes = Number(draft.minutes) || 0

    if (!subject) {
      setError("Choose a subject tag.")
      return
    }
    if (hours < 0 || minutes < 0 || minutes > 59) {
      setError("Minutes should be between 0 and 59.")
      return
    }
    if (hours * 60 + minutes < 1) {
      setError("Add at least one minute.")
      return
    }

    onSubmit({
      ...draft,
      subject,
      hours,
      minutes,
      notes: draft.notes.trim(),
      source: editing ? draft.source : "manual",
    })

    if (!editing) {
      setDraft({
        ...emptyDraft(),
        subject: knownSubjects.has(subject) ? subject : "Grammar",
      })
      setCustomSubject(knownSubjects.has(subject) ? "" : "")
    }
    setError(null)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    saveDraft()
  }

  const presetButtons = (
    <div className="grid grid-cols-3 gap-2">
      {DURATION_PRESETS.map((minutes) => (
        <Button
          key={minutes}
          type="button"
          className="h-12 rounded-2xl text-base font-semibold lg:h-11 lg:rounded-xl lg:text-sm"
          variant="secondary"
          onClick={() => applyPreset(minutes, !editing)}
        >
          {minutes === 60 ? "+1h" : `+${minutes}m`}
        </Button>
      ))}
    </div>
  )

  return (
    <>
      <Card id="logger" className="scroll-mt-20">
      <CardHeader className="border-b">
        <CardTitle className="text-lg sm:text-base">
          {editing ? "Edit session" : "Log study"}
        </CardTitle>
        <CardDescription>
          Pick a subject, then tap a time. On a phone the chips stay at the bottom.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="study-date">Date</Label>
              <Input
                id="study-date"
                type="date"
                value={draft.date}
                max={todayISO()}
                onChange={(event) => update("date", event.target.value)}
                required
              />
            </div>
            <div className="hidden items-end sm:flex">
              <p className="pb-2 text-xs text-muted-foreground tabular-nums">
                {formatDuration(selectedMinutes)} selected
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Subject</Label>
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
              {SUBJECTS.map((subject) => {
                const active = draft.subject === subject
                return (
                  <Button
                    key={subject}
                    type="button"
                    className="h-10 min-h-10 shrink-0 rounded-full px-3.5"
                    variant={active ? "default" : "outline"}
                    onClick={() => setSubject(subject)}
                  >
                    {subject}
                  </Button>
                )
              })}
            </div>
            {usingCustom ? (
              <Input
                placeholder="Custom topic"
                value={customSubject}
                onChange={(event) => {
                  setCustomSubject(event.target.value)
                  update("subject", event.target.value)
                }}
              />
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Quick log</Label>
              <span className="text-xs text-muted-foreground tabular-nums sm:hidden">
                {formatDuration(selectedMinutes)}
              </span>
            </div>
            <div className="hidden lg:block">{presetButtons}</div>
            <button
              type="button"
              onClick={() => setShowCustomTime((open) => !open)}
              className="min-h-11 appearance-none bg-transparent p-0 text-left text-sm font-medium text-muted-foreground lg:hidden"
            >
              {showCustomTime ? "Hide custom time" : "Need a custom time?"}
            </button>
            <div
              className={cn(
                "grid-cols-2 gap-3 lg:grid",
                showCustomTime ? "grid" : "hidden"
              )}
            >
              <div className="grid gap-1.5">
                <Label htmlFor="study-hours">Hours</Label>
                <Input
                  id="study-hours"
                  inputMode="numeric"
                  type="number"
                  min={0}
                  max={12}
                  value={draft.hours}
                  onChange={(event) =>
                    update("hours", Number(event.target.value))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="study-minutes">Minutes</Label>
                <Input
                  id="study-minutes"
                  inputMode="numeric"
                  type="number"
                  min={0}
                  max={59}
                  value={draft.minutes}
                  onChange={(event) =>
                    update("minutes", Number(event.target.value))
                  }
                />
              </div>
            </div>
            <button
              type="button"
              onClick={saveDraft}
              className={cn(
                "min-h-11 appearance-none bg-transparent p-0 text-left text-sm font-medium text-primary underline-offset-4 hover:underline",
                showCustomTime || editing ? "inline" : "hidden lg:inline"
              )}
            >
              Save {formatDuration(selectedMinutes)}
            </button>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="study-notes">Notes</Label>
            <Textarea
              id="study-notes"
              placeholder="What clicked today?"
              className="min-h-20"
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((option) => {
                const active = draft.status === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update("status", option.value)}
                    className={cn(
                      "h-10 rounded-full border text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {editing ? (
            <div className="hidden gap-2 lg:flex">
              <Button type="button" className="h-11 flex-1" onClick={saveDraft}>
                <Check data-icon="inline-start" />
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={onCancelEdit}
              >
                <RotateCcw data-icon="inline-start" />
                Cancel
              </Button>
            </div>
          ) : null}
        </form>
      </CardContent>
      </Card>
      {hydrated
        ? createPortal(
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/90 px-4 pt-3 shadow-[0_-12px_32px_oklch(0.28_0.035_250/0.12)] backdrop-blur-xl pb-[max(0.85rem,env(safe-area-inset-bottom))] lg:hidden">
              {editing ? (
                <div className="mx-auto flex max-w-6xl gap-2">
                  <Button
                    type="button"
                    className="h-12 flex-1 rounded-2xl"
                    onClick={saveDraft}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl"
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="mx-auto max-w-6xl">{presetButtons}</div>
              )}
            </div>,
            document.body
          )
        : null}
    </>
  )
}
