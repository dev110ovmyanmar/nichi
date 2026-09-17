"use client"

import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

type ReminderBannerProps = {
  message: string
  reminderTime: string
  visible: boolean
  onLogNow: () => void
}

export function ReminderBanner({
  message,
  reminderTime,
  visible,
  onLogNow,
}: ReminderBannerProps) {
  if (!visible) return null

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/8 px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400">
            <BookOpen className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{message}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              No session logged today. Daily reminder is set for {reminderTime}.
            </p>
          </div>
        </div>
        <Button type="button" onClick={onLogNow} className="self-start sm:self-auto">
          Log a session
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
