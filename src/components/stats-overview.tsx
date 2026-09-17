"use client"

import { Flame, Target, Timer, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDuration } from "@/lib/stats"

type StatsOverviewProps = {
  todayMinutes: number
  weekMinutes: number
  streak: number
  longestStreak: number
  dailyGoalMinutes: number
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: typeof Timer
}) {
  return (
    <Card className="bg-card/80">
      <CardContent className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1 font-heading text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/80">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsOverview({
  todayMinutes,
  weekMinutes,
  streak,
  longestStreak,
  dailyGoalMinutes,
}: StatsOverviewProps) {
  const goalPercent =
    dailyGoalMinutes === 0
      ? 0
      : Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100))

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Today"
        value={formatDuration(todayMinutes)}
        hint={
          todayMinutes === 0
            ? "Start a session to keep the streak"
            : `${goalPercent}% of today’s ${formatDuration(dailyGoalMinutes)} goal`
        }
        icon={Timer}
      />
      <StatCard
        label="This week"
        value={formatDuration(weekMinutes)}
        hint="Last 7 days, including today"
        icon={TrendingUp}
      />
      <StatCard
        label="Streak"
        value={`${streak} day${streak === 1 ? "" : "s"}`}
        hint={
          streak === 0
            ? "Log today to begin a new streak"
            : `Best run: ${longestStreak} days`
        }
        icon={Flame}
      />
      <Card className="bg-card/80">
        <CardContent>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Daily goal
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
            {formatDuration(todayMinutes)} / {formatDuration(dailyGoalMinutes)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
