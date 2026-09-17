"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatMonth, formatPrettyDate } from "@/lib/dates"
import { formatDuration } from "@/lib/stats"
import { cn } from "@/lib/utils"
import type { HeatmapWeek } from "@/lib/types"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const LEVEL_CLASS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-muted",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/70",
  4: "bg-primary",
}

type ActivityHeatmapProps = {
  weeks: HeatmapWeek[]
}

export function ActivityHeatmap({ weeks }: ActivityHeatmapProps) {
  const monthLabels = weeks.map((week, index) => {
    const first = week.days[0]?.date
    if (!first) return ""
    const month = formatMonth(first)
    const previous = index === 0 ? null : formatMonth(weeks[index - 1].days[0].date)
    return month !== previous ? month : ""
  })

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Activity heatmap</CardTitle>
        <CardDescription>
          GitHub-style view of the last {weeks.length} weeks. Darker cells mean
          you hit more of the daily target.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto pt-4">
        <div className="min-w-[560px]">
          <div
            className="mb-2 grid gap-1 text-[10px] text-muted-foreground"
            style={{
              gridTemplateColumns: `32px repeat(${weeks.length}, minmax(0, 1fr))`,
            }}
          >
            <span />
            {monthLabels.map((label, index) => (
              <span key={`month-${index}`} className="truncate">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-rows-7 gap-1">
            {WEEKDAYS.map((weekday, dayIndex) => (
              <div
                key={weekday}
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `32px repeat(${weeks.length}, minmax(0, 1fr))`,
                }}
              >
                <span className="text-[10px] leading-3 text-muted-foreground">
                  {dayIndex % 2 === 1 ? weekday : ""}
                </span>
                {weeks.map((week) => {
                  const cell = week.days[dayIndex]
                  return (
                    <div
                      key={cell.date}
                      title={`${formatPrettyDate(cell.date)} · ${
                        cell.minutes === 0
                          ? "No study"
                          : formatDuration(cell.minutes)
                      }`}
                      className={cn(
                        "aspect-square rounded-[3px]",
                        LEVEL_CLASS[cell.level]
                      )}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            {([0, 1, 2, 3, 4] as const).map((level) => (
              <span
                key={level}
                className={cn("size-3 rounded-[3px]", LEVEL_CLASS[level])}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
