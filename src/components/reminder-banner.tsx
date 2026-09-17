"use client"

import { BookOpen } from "lucide-react"

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
    <button
      type="button"
      onClick={onLogNow}
      className="flex w-full items-start gap-3 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-left"
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <BookOpen className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Nothing logged today · reminder {reminderTime}
        </p>
      </div>
      <span className="self-center text-xs font-medium text-primary">Log</span>
    </button>
  )
}
