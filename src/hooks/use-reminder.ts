"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { currentTimeHHMM, todayISO } from "@/lib/dates"
import type { AppSettings } from "@/lib/types"

type Options = {
  ready: boolean
  settings: AppSettings
  studiedToday: boolean
  onNotified: (date: string) => void
}

export function useReminder({
  ready,
  settings,
  studiedToday,
  onNotified,
}: Options) {
  const enabled = settings.reminderEnabled
  const reminderTime = settings.reminderTime
  const reminderMessage = settings.reminderMessage
  const lastNotifiedDate = settings.lastNotifiedDate

  useEffect(() => {
    if (!ready || !enabled) return

    const fire = () => {
      const today = todayISO()
      if (lastNotifiedDate === today) return
      if (studiedToday) return
      if (currentTimeHHMM() !== reminderTime) return

      toast(reminderMessage, {
        description: "Open the logger and keep your streak going.",
        duration: 8000,
      })

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification("Nichi · study reminder", {
            body: reminderMessage,
            tag: `nichi-${today}`,
          })
        } catch {
          // Some browsers block constructed notifications outside a gesture.
        }
      }

      onNotified(today)
    }

    fire()
    const id = window.setInterval(fire, 15_000)
    return () => window.clearInterval(id)
  }, [
    ready,
    enabled,
    reminderTime,
    reminderMessage,
    lastNotifiedDate,
    studiedToday,
    onNotified,
  ])
}
