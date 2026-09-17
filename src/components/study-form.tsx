"use client"

import { useMemo, useState } from "react"
import { Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  hint: string
}> = [
  { value: "in_progress", label: "In progress", hint: "Still working through it" },
  { value: "needs_review", label: "Needs review", hint: "Come back to this" },
  { value: "completed", label: "Completed", hint: "Comfortable for now" },
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
        setError("Pick a subject tag first.")
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
        setDraft({ ...emptyDraft(), subject: knownSubjects.has(subject) ? subject : "Grammar" })
        setCustomSubject(knownSubjects.has(subject) ? "" : "")
      }
      setError(null)
      return
    }
    update("hours", split.hours)
    update("minutes", split.minutes)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
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
      setError("Add at least one minute of study time.")
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

  return (
    <Card id="logger">
      <CardHeader className="border-b">
        <CardTitle>
          {editing ? "Edit session" : "Log today’s study"}
        </CardTitle>
        <CardDescription>
          Date, subject tag, duration, notes — or tap a preset to log instantly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
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

          <div className="grid gap-2">
            <Label>Subject tag</Label>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECTS.map((subject) => {
                const active = draft.subject === subject
                return (
                  <Button
                    key={subject}
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => setSubject(subject)}
                  >
                    {subject}
                  </Button>
                )
              })}
              <Button
                type="button"
                size="sm"
                variant={usingCustom ? "default" : "outline"}
                onClick={() => {
                  update("subject", customSubject || "")
                }}
              >
                Custom
              </Button>
            </div>
            {usingCustom ? (
              <Input
                placeholder="e.g. Keigo, pitch accent"
                value={customSubject}
                onChange={(event) => {
                  setCustomSubject(event.target.value)
                  update("subject", event.target.value)
                }}
              />
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label>Duration</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatDuration(selectedMinutes)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_PRESETS.map((minutes) => (
                <Button
                  key={minutes}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset(minutes, !editing)}
                >
                  {minutes === 60 ? "+1h" : `+${minutes}m`}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {editing
                ? "Presets fill the duration fields. Save when you are done."
                : "Tap +15m / +30m / +1h to log immediately, or set a custom time and press Add session."}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="study-hours">Hours</Label>
                <Input
                  id="study-hours"
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
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              <Check data-icon="inline-start" />
              {editing ? "Save changes" : "Add session"}
            </Button>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="study-notes">Notes / key takeaways</Label>
            <Textarea
              id="study-notes"
              placeholder="What clicked? What still needs another pass?"
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Mastery</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {STATUS_OPTIONS.map((option) => {
                const active = draft.status === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update("status", option.value)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left transition-colors",
                      active
                        ? "border-foreground/20 bg-foreground text-background"
                        : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    <span className="block text-sm font-medium">
                      {option.label}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block text-xs",
                        active ? "text-background/70" : "text-muted-foreground"
                      )}
                    >
                      {option.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit">
              <Check data-icon="inline-start" />
              {editing ? "Save changes" : "Add session"}
            </Button>
            {editing ? (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                <RotateCcw data-icon="inline-start" />
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
