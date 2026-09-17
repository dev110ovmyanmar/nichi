"use client"

import { AppShell } from "@/components/shell/app-shell"
import { useStudyStore } from "@/hooks/use-study-store"
import { currentStreak } from "@/lib/stats"
import { todayISO } from "@/lib/dates"

export function NichiFrame({ children }: { children: React.ReactNode }) {
  const { logs } = useStudyStore()
  const streak = currentStreak(logs, todayISO())
  return <AppShell streak={streak}>{children}</AppShell>
}
