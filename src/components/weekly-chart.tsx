"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DayMinutes } from "@/lib/types"
import { formatDuration } from "@/lib/stats"
import { formatPrettyDate } from "@/lib/dates"

type WeeklyChartProps = {
  series: DayMinutes[]
  totalMinutes: number
}

export function WeeklyChart({ series, totalMinutes }: WeeklyChartProps) {
  const maxMinutes = Math.max(60, ...series.map((day) => day.minutes))

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle>Weekly time</CardTitle>
        <CardDescription>
          တစ်ပတ်စာ မှတ်တမ်း · {formatDuration(totalMinutes)} across the last 7
          days
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} barSize={28}>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                domain={[0, maxMinutes]}
                tickFormatter={(value) => `${Math.round(Number(value) / 60)}h`}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "color-mix(in oklch, var(--foreground) 6%, transparent)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const day = payload[0].payload as DayMinutes
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                      <p className="font-medium">{formatPrettyDate(day.date)}</p>
                      <p className="mt-1 text-muted-foreground">
                        {day.minutes === 0
                          ? "No study logged"
                          : formatDuration(day.minutes)}
                      </p>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="minutes"
                fill="var(--chart-1)"
                radius={[8, 8, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {totalMinutes === 0 ? (
          <p className="pt-2 text-center text-sm text-muted-foreground">
            Log sessions this week to see the daily distribution.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
