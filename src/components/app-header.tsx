"use client"

import { Bell, Flame } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

type AppHeaderProps = {
  streak: number
  onOpenSettings: () => void
}

export function AppHeader({ streak, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
            日
          </div>
          <div className="leading-tight">
            <p className="font-heading text-sm font-semibold tracking-tight">
              Nichi
            </p>
            <p className="text-xs text-muted-foreground">Daily study journal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium sm:flex">
            <Flame className="size-3.5 text-orange-500" />
            <span className="tabular-nums">{streak}</span>
            <span className="text-muted-foreground">day streak</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Reminder settings"
            onClick={onOpenSettings}
          >
            <Bell />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
