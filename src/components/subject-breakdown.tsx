"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SubjectShare } from "@/lib/types"
import { formatDuration } from "@/lib/stats"

type SubjectBreakdownProps = {
  items: SubjectShare[]
}

export function SubjectBreakdown({ items }: SubjectBreakdownProps) {
  const hasData = items.length > 0

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle>Subject mix</CardTitle>
        <CardDescription>
          Donut view of this week’s time by tag
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {hasData ? (
          <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
            <div className="mx-auto h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={items}
                    dataKey="minutes"
                    nameKey="subject"
                    innerRadius={38}
                    outerRadius={62}
                    paddingAngle={3}
                    stroke="var(--card)"
                    strokeWidth={3}
                  >
                    {items.map((item) => (
                      <Cell key={item.subject} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null
                      const item = payload[0].payload as SubjectShare
                      return (
                        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                          <p className="font-medium">{item.subject}</p>
                          <p className="mt-1 text-muted-foreground">
                            {formatDuration(item.minutes)} · {item.percent}%
                          </p>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.subject}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="truncate">{item.subject}</span>
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percent}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No subject mix yet. Add a session to see the weekly breakdown.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
