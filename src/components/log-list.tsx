"use client"

import { useMemo, useState } from "react"
import { NotebookPen, Pencil, Search, Timer, Trash2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  FALLBACK_SUBJECT_COLORS,
  STATUS_LABELS,
  SUBJECT_COLORS,
} from "@/lib/constants"
import { addDays, formatPrettyDate, parseISODate } from "@/lib/dates"
import { formatDuration, totalMinutes } from "@/lib/stats"
import { cn } from "@/lib/utils"
import type { MasteryStatus, StudyLog } from "@/lib/types"

type Filter = "all" | "today" | MasteryStatus

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "needs_review", label: "Review" },
  { value: "completed", label: "Done" },
]

type LogListProps = {
  logs: StudyLog[]
  today: string
  onEdit: (log: StudyLog) => void
  onDelete: (id: string) => void
}

function subjectColor(subject: string) {
  return SUBJECT_COLORS[subject] ?? FALLBACK_SUBJECT_COLORS[0]
}

function dayLabel(date: string, today: string) {
  if (date === today) return "Today"
  if (date === addDays(today, -1)) return "Yesterday"
  return formatPrettyDate(date)
}

function calendarParts(date: string) {
  const parsed = parseISODate(date)
  return {
    day: parsed.getDate(),
    month: parsed.toLocaleDateString(undefined, { month: "short" }),
  }
}

export function LogList({ logs, today, onEdit, onDelete }: LogListProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [pendingDelete, setPendingDelete] = useState<StudyLog | null>(null)

  const totalLogged = useMemo(
    () => logs.reduce((sum, log) => sum + totalMinutes(log), 0),
    [logs]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs.filter((log) => {
      if (filter === "today" && log.date !== today) return false
      if (filter === "needs_review" && log.status !== "needs_review") return false
      if (filter === "completed" && log.status !== "completed") return false
      if (!q) return true
      return (
        log.subject.toLowerCase().includes(q) ||
        log.notes.toLowerCase().includes(q)
      )
    })
  }, [filter, logs, query, today])

  const groups = useMemo(() => {
    const byDate = new Map<string, StudyLog[]>()
    for (const log of filtered) {
      const current = byDate.get(log.date)
      if (current) current.push(log)
      else byDate.set(log.date, [log])
    }
    return [...byDate.entries()].map(([date, items]) => ({
      date,
      items,
      minutes: items.reduce((sum, log) => sum + totalMinutes(log), 0),
    }))
  }, [filtered])

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Study log</CardTitle>
          <CardDescription>
            {logs.length === 0
              ? "Nothing saved yet"
              : `${formatDuration(totalLogged)} across ${logs.length} session${logs.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filter sessions"
          >
            {FILTERS.map((item) => {
              const active = filter === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subjects or notes"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center">
            <NotebookPen className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">No matching sessions</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              {logs.length === 0
                ? "Tap +15m at the bottom to start a streak and fill the weekly chart."
                : "Try another filter or search term."}
            </p>
          </CardContent>
        </Card>
      ) : (
        groups.map((group) => {
          const stamp = calendarParts(group.date)
          return (
            <section
              key={group.date}
              className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8 sm:p-5"
            >
              <header className="mb-4 flex items-center gap-3">
                <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <span className="text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {stamp.month}
                  </span>
                  <span className="font-heading text-xl leading-none font-semibold tabular-nums">
                    {stamp.day}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-semibold tracking-tight">
                    {dayLabel(group.date, today)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(group.minutes)} · {group.items.length}{" "}
                    session{group.items.length === 1 ? "" : "s"}
                  </p>
                </div>
              </header>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((log) => {
                  const color = subjectColor(log.subject)
                  return (
                    <article
                      key={log.id}
                      className="flex min-h-44 flex-col rounded-3xl p-4 ring-1 ring-foreground/8"
                      style={{
                        background: `linear-gradient(165deg, color-mix(in oklch, ${color} 22%, var(--card)) 0%, var(--card) 48%)`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-medium",
                            log.status === "completed" &&
                              "bg-primary/15 text-primary",
                            log.status === "needs_review" &&
                              "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                            log.status === "in_progress" &&
                              "bg-background/70 text-muted-foreground"
                          )}
                        >
                          {STATUS_LABELS[log.status]}
                        </span>
                        <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
                          {formatDuration(totalMinutes(log))}
                        </p>
                      </div>

                      <h4 className="mt-4 font-heading text-xl font-semibold tracking-tight">
                        {log.subject}
                      </h4>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {log.source === "pomodoro" ? (
                          <>
                            <Timer className="size-3.5" />
                            Pomodoro
                          </>
                        ) : log.source === "preset" ? (
                          <>
                            <Zap className="size-3.5" />
                            Quick add
                          </>
                        ) : (
                          "Logged by hand"
                        )}
                      </p>
                      <p
                        className={cn(
                          "mt-3 flex-1 text-sm leading-relaxed",
                          log.notes
                            ? "text-foreground/80"
                            : "text-muted-foreground italic"
                        )}
                      >
                        {log.notes || "No notes yet."}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-10 flex-1 rounded-full"
                          onClick={() => onEdit(log)}
                        >
                          <Pencil data-icon="inline-start" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-10 rounded-full px-3"
                          aria-label={`Delete ${log.subject}`}
                          onClick={() => setPendingDelete(log)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })
      )}

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this session?</DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? `${pendingDelete.subject} · ${formatDuration(totalMinutes(pendingDelete))} on ${formatPrettyDate(pendingDelete.date)} will be removed from this device.`
                : "This cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => setPendingDelete(null)}
            >
              Keep it
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-11 sm:min-w-24"
              onClick={() => {
                if (pendingDelete) onDelete(pendingDelete.id)
                setPendingDelete(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
