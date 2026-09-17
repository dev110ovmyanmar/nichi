"use client"

import { Flame, Target, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ExamCountdown } from "@/components/exam-countdown"
import { Progress } from "@/components/ui/progress"
import { formatDuration } from "@/lib/stats"

type StatsOverviewProps = {
  todayMinutes: number
  weekMinutes: number
  streak: number
  longestStreak: number
  dailyGoalMinutes: number
  examName: string
  examDate: string
}

export function StatsOverview({
  todayMinutes,
  weekMinutes,
  streak,
  longestStreak,
  dailyGoalMinutes,
  examName,
  examDate,
}: StatsOverviewProps) {
  const goalPercent =
    dailyGoalMinutes === 0
      ? 0
      : Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100))

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Card className="bg-card/80 md:col-span-2 xl:col-span-1">
        <CardContent>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Daily target
              </p>
              <p className="mt-1 font-heading text-2xl font-semibold tracking-tight tabular-nums">
                {goalPercent}%
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/80">
              <Target className="size-4" />
            </div>
          </div>
          <Progress value={goalPercent} />
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDuration(todayMinutes)} / {formatDuration(dailyGoalMinutes)}{" "}
            today
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardContent className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Streak
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold tracking-tight tabular-nums">
              {streak} day{streak === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {streak === 0
                ? "Log today to begin a new streak"
                : `Best run: ${longestStreak} days`}
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/80">
            <Flame className="size-4" />
          </div>
        </CardContent>
      </Card>

      <ExamCountdown examName={examName} examDate={examDate} />

      <Card className="bg-card/80">
        <CardContent className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              This week
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold tracking-tight tabular-nums">
              {formatDuration(weekMinutes)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last 7 days, including today
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/80">
            <TrendingUp className="size-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
