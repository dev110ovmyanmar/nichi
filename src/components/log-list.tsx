"use client"

import { useMemo, useState } from "react"
import {
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Search,
  Timer,
  Trash2,
  Zap,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  FALLBACK_SUBJECT_COLORS,
  STATUS_LABELS,
  SUBJECT_COLORS,
} from "@/lib/constants"
import { addDays, formatPrettyDate } from "@/lib/dates"
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

function sourceLabel(source: StudyLog["source"]) {
  if (source === "pomodoro") return "Pomodoro"
  if (source === "preset") return "Quick add"
  return null
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
          className="grid grid-cols-4 rounded-full bg-muted p-1"
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
                  "h-9 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
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

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-muted/50 px-4 py-12 text-center">
            <NotebookPen className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">No matching sessions</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              {logs.length === 0
                ? "Tap +15m at the bottom to start a streak and fill the weekly chart."
                : "Try another filter or search term."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {groups.map((group) => (
              <section key={group.date} className="grid gap-2">
                <div className="flex items-baseline justify-between px-1">
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {dayLabel(group.date, today)}
                  </h3>
                  <p className="text-xs font-medium tabular-nums text-muted-foreground">
                    {formatDuration(group.minutes)}
                    <span className="text-muted-foreground/70">
                      {" "}
                      · {group.items.length}
                    </span>
                  </p>
                </div>
                <ul className="overflow-hidden rounded-2xl bg-muted/40">
                  {group.items.map((log, index) => {
                    const source = sourceLabel(log.source)
                    const duration = formatDuration(totalMinutes(log))
                    return (
                      <li
                        key={log.id}
                        className={cn(
                          index > 0 && "border-t border-border/60"
                        )}
                      >
                        <div className="flex items-stretch">
                          <button
                            type="button"
                            onClick={() => onEdit(log)}
                            className="flex min-w-0 flex-1 items-stretch gap-3 px-3 py-3 text-left"
                          >
                            <span
                              className="w-1 shrink-0 self-stretch rounded-full"
                              style={{ backgroundColor: subjectColor(log.subject) }}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate font-medium">
                                  {log.subject}
                                </span>
                                {log.source === "pomodoro" ? (
                                  <Timer className="size-3.5 shrink-0 text-muted-foreground" />
                                ) : null}
                                {log.source === "preset" ? (
                                  <Zap className="size-3.5 shrink-0 text-muted-foreground" />
                                ) : null}
                              </span>
                              <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                                <span
                                  className={cn(
                                    log.status === "completed" && "text-primary",
                                    log.status === "needs_review" &&
                                      "text-amber-600 dark:text-amber-400"
                                  )}
                                >
                                  {STATUS_LABELS[log.status]}
                                </span>
                                {source ? (
                                  <>
                                    <span aria-hidden>·</span>
                                    <span>{source}</span>
                                  </>
                                ) : null}
                              </span>
                              {log.notes ? (
                                <span className="mt-1 block line-clamp-2 text-sm text-muted-foreground">
                                  {log.notes}
                                </span>
                              ) : null}
                            </span>
                            <span className="self-center font-heading text-base font-semibold tabular-nums tracking-tight">
                              {duration}
                            </span>
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "mt-1.5 mr-1 size-10 shrink-0"
                              )}
                              aria-label={`More for ${log.subject}`}
                            >
                              <MoreHorizontal />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-36">
                              <DropdownMenuItem onClick={() => onEdit(log)}>
                                <Pencil />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setPendingDelete(log)}
                              >
                                <Trash2 />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </CardContent>

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
    </Card>
  )
}
