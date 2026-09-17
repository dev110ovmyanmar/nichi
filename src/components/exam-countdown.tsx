"use client"

import { CalendarClock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { daysUntil, formatPrettyDate } from "@/lib/dates"

type ExamCountdownProps = {
  examName: string
  examDate: string
}

export function ExamCountdown({ examName, examDate }: ExamCountdownProps) {
  const remaining = daysUntil(examDate)
  const label =
    remaining > 1
      ? `${remaining} days`
      : remaining === 1
        ? "Tomorrow"
        : remaining === 0
          ? "Today"
          : `${Math.abs(remaining)} days ago`

  return (
    <Card className="bg-card/90">
      <CardContent className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Exam
          </p>
          <p className="mt-1 font-heading text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {examName} · {formatPrettyDate(examDate)}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/80">
          <CalendarClock className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}
