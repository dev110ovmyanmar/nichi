"use client"

import { useMemo, useState } from "react"
import { NotebookPen, Pencil, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { STATUS_LABELS } from "@/lib/constants"
import { formatPrettyDate } from "@/lib/dates"
import { formatDuration, totalMinutes } from "@/lib/stats"
import { cn } from "@/lib/utils"
import type { MasteryStatus, StudyLog } from "@/lib/types"

type Filter = "all" | "today" | MasteryStatus

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "needs_review", label: "Needs review" },
  { value: "completed", label: "Completed" },
]

type LogListProps = {
  logs: StudyLog[]
  today: string
  onEdit: (log: StudyLog) => void
  onDelete: (id: string) => void
}

export function LogList({ logs, today, onEdit, onDelete }: LogListProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [pendingDelete, setPendingDelete] = useState<StudyLog | null>(null)

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

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Study log</CardTitle>
        <CardDescription>
          {logs.length === 0
            ? "Nothing saved yet"
            : `${logs.length} session${logs.length === 1 ? "" : "s"} saved locally`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subjects or notes"
              className="pl-8"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((item) => (
              <Button
                key={item.value}
                type="button"
                size="sm"
                variant={filter === item.value ? "default" : "outline"}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-10 text-center">
            <NotebookPen className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium">No matching sessions</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              {logs.length === 0
                ? "Add your first session to start a streak and fill the weekly chart."
                : "Try another filter or search term."}
            </p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {filtered.map((log) => (
              <li
                key={log.id}
                className="rounded-xl border border-border bg-background/60 px-3 py-3 sm:px-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{log.subject}</p>
                      <Badge
                        variant={
                          log.status === "completed"
                            ? "default"
                            : log.status === "needs_review"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {STATUS_LABELS[log.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatPrettyDate(log.date)}
                      {log.date === today ? " · today" : ""} ·{" "}
                      {formatDuration(totalMinutes(log))}
                    </p>
                    {log.notes ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {log.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Edit ${log.subject}`}
                      onClick={() => onEdit(log)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Delete ${log.subject}`}
                      onClick={() => setPendingDelete(log)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
                ? `${pendingDelete.subject} on ${formatPrettyDate(pendingDelete.date)} will be removed from this device.`
                : "This cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
            >
              Keep it
            </Button>
            <Button
              type="button"
              variant="destructive"
              className={cn("sm:min-w-24")}
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
