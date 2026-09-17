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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SUBJECTS } from "@/lib/constants"
import { todayISO } from "@/lib/dates"
import { cn } from "@/lib/utils"
import type { MasteryStatus, StudyLog } from "@/lib/types"
import type { LogDraft } from "@/hooks/use-study-store"

const CUSTOM_VALUE = "__custom__"

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
    subject: "JLPT N2 Grammar",
    hours: 0,
    minutes: 30,
    notes: "",
    status: "in_progress",
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

  const selectValue = knownSubjects.has(draft.subject)
    ? draft.subject
    : CUSTOM_VALUE

  function update<K extends keyof LogDraft>(key: K, value: LogDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const subject =
      selectValue === CUSTOM_VALUE ? customSubject.trim() : draft.subject.trim()
    const hours = Number(draft.hours) || 0
    const minutes = Number(draft.minutes) || 0

    if (!subject) {
      setError("Choose a subject or enter a custom topic.")
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
    })

    if (!editing) {
      setDraft({
        ...emptyDraft(),
        subject: knownSubjects.has(subject) ? subject : "JLPT N2 Grammar",
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
          မှတ်တမ်းတင်ရန် · date, topic, time, takeaways, and mastery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="grid gap-1.5">
              <Label htmlFor="study-subject">Subject / topic</Label>
              <Select
                value={selectValue}
                onValueChange={(value) => {
                  if (value === CUSTOM_VALUE) {
                    update("subject", customSubject || "")
                    return
                  }
                  if (value) update("subject", value)
                }}
              >
                <SelectTrigger id="study-subject" className="w-full">
                  <SelectValue placeholder="Choose a topic" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_VALUE}>Custom topic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectValue === CUSTOM_VALUE ? (
            <div className="grid gap-1.5">
              <Label htmlFor="custom-subject">Custom topic</Label>
              <Input
                id="custom-subject"
                placeholder="e.g. Keigo, Pitch accent, N2 mock listening"
                value={customSubject}
                onChange={(event) => {
                  setCustomSubject(event.target.value)
                  update("subject", event.target.value)
                }}
              />
            </div>
          ) : null}

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
