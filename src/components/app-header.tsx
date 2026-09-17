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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground sm:size-9">
            日
          </div>
          <div className="min-w-0 leading-tight">
            <p className="font-heading text-sm font-semibold tracking-tight">
              Nichi
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Daily study journal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <Flame className="size-3.5 text-orange-500" />
            <span className="tabular-nums">{streak}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10"
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
