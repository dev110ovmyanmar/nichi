"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  POMODORO_BREAK_SECONDS,
  POMODORO_FOCUS_SECONDS,
  SUBJECTS,
} from "@/lib/constants"
import { formatClock, todayISO } from "@/lib/dates"
import { cn } from "@/lib/utils"
import type { LogDraft } from "@/hooks/use-study-store"

type Mode = "focus" | "break"

type PomodoroTimerProps = {
  subject: string
  onSubjectChange: (subject: string) => void
  onComplete: (draft: LogDraft) => void
}

export function PomodoroTimer({
  subject,
  onSubjectChange,
  onComplete,
}: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>("focus")
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(POMODORO_FOCUS_SECONDS)
  const endsAtRef = useRef<number | null>(null)
  const finishingRef = useRef(false)

  const total = mode === "focus" ? POMODORO_FOCUS_SECONDS : POMODORO_BREAK_SECONDS
  const progress = Math.max(0, Math.min(100, ((total - remaining) / total) * 100))

  useEffect(() => {
    if (!running) return

    const tick = () => {
      const endsAt = endsAtRef.current
      if (endsAt === null) return
      const next = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setRemaining(next)
      if (next > 0) {
        finishingRef.current = false
        return
      }
      if (finishingRef.current) return
      finishingRef.current = true

      setRunning(false)
      endsAtRef.current = null

      if (mode === "focus") {
        onComplete({
          date: todayISO(),
          subject,
          hours: 0,
          minutes: 25,
          notes: "Pomodoro focus block",
          status: "completed",
          source: "pomodoro",
        })
        toast.success("Focus block logged · 25m", {
          description: `${subject} is on the journal. Take a 5-minute break.`,
        })
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          new Notification("Nichi · focus complete", {
            body: `25 minutes of ${subject} saved. Break time.`,
          })
        }
        setMode("break")
        setRemaining(POMODORO_BREAK_SECONDS)
        return
      }

      toast("Break over", { description: "Ready for the next 25 minutes?" })
      setMode("focus")
      setRemaining(POMODORO_FOCUS_SECONDS)
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [mode, onComplete, running, subject])

  function start() {
    finishingRef.current = false
    endsAtRef.current = Date.now() + remaining * 1000
    setRunning(true)
  }

  function pause() {
    setRunning(false)
    if (endsAtRef.current) {
      setRemaining(Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000)))
    }
    endsAtRef.current = null
  }

  function reset() {
    setRunning(false)
    endsAtRef.current = null
    setRemaining(mode === "focus" ? POMODORO_FOCUS_SECONDS : POMODORO_BREAK_SECONDS)
  }

  function skip() {
    setRunning(false)
    endsAtRef.current = null
    if (mode === "focus") {
      setMode("break")
      setRemaining(POMODORO_BREAK_SECONDS)
      return
    }
    setMode("focus")
    setRemaining(POMODORO_FOCUS_SECONDS)
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle>Pomodoro</CardTitle>
        <CardDescription>
          25 minutes of focus, then 5 minutes off. A completed focus block is
          logged automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-5">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {SUBJECTS.map((item) => (
            <Button
              key={item}
              type="button"
              className="h-10 shrink-0 rounded-full"
              variant={subject === item ? "default" : "outline"}
              onClick={() => onSubjectChange(item)}
              disabled={running && mode === "focus"}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-6">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {mode === "focus" ? "Focus" : "Break"}
          </p>
          <p className="font-heading text-5xl font-semibold tracking-tight tabular-nums">
            {formatClock(remaining)}
          </p>
          <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-200",
                mode === "focus" ? "bg-primary" : "bg-emerald-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center">
          {running ? (
            <Button type="button" className="h-11 col-span-3 sm:col-auto" onClick={pause}>
              <Pause data-icon="inline-start" />
              Pause
            </Button>
          ) : (
            <Button type="button" className="h-11 col-span-3 sm:col-auto" onClick={start}>
              <Play data-icon="inline-start" />
              {remaining === total ? "Start" : "Resume"}
            </Button>
          )}
          <Button type="button" variant="outline" className="h-11" onClick={reset}>
            <RotateCcw data-icon="inline-start" />
            Reset
          </Button>
          <Button type="button" variant="ghost" className="h-11" onClick={skip}>
            <SkipForward data-icon="inline-start" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
