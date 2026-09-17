import { cn } from "@/lib/utils"

export function formatExamClock(total: number) {
  const minutes = Math.floor(Math.max(0, total) / 60)
  const seconds = Math.max(0, total) % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function ExamClock({
  seconds,
  label,
}: {
  seconds: number
  label: string
}) {
  const urgent = seconds <= 5 * 60
  return (
    <div
      className={cn(
        "sticky top-16 z-20 flex items-center justify-between rounded-2xl px-3 py-2 text-sm ring-1",
        urgent
          ? "bg-destructive/10 text-destructive ring-destructive/20"
          : "bg-card ring-foreground/8"
      )}
    >
      <span>{label}</span>
      <span className="font-heading tabular-nums">{formatExamClock(seconds)}</span>
    </div>
  )
}
