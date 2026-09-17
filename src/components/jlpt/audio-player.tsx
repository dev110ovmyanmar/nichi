"use client"

import { Pause, Play, Volume2 } from "lucide-react"
import { useEffect, useState } from "react"
import { speakJapanese, stopSpeaking } from "@/lib/jlpt/tts"
import { cn } from "@/lib/utils"

const RATES = [0.8, 0.9, 1, 1.1, 1.2] as const

export function AudioPlayer({
  text,
  label,
  compact = false,
}: {
  text: string
  label?: string
  compact?: boolean
}) {
  const [rate, setRate] = useState(1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  function toggle() {
    if (playing) {
      stopSpeaking()
      setPlaying(false)
      return
    }
    speakJapanese(text, rate)
    setPlaying(true)
    window.setTimeout(() => setPlaying(false), Math.max(1200, text.length * 280 * (1 / rate)))
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label ?? "再生"}
        className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary"
      >
        {playing ? <Pause className="size-4" /> : <Volume2 className="size-4" />}
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
      <button
        type="button"
        onClick={toggle}
        className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
        aria-label={playing ? "停止" : "再生"}
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label ?? "聞く"}</p>
        <p className="truncate text-[11px] text-muted-foreground">{text}</p>
      </div>
      <div className="flex gap-1">
        {RATES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRate(value)}
            className={cn(
              "h-8 rounded-full px-2 text-[11px] tabular-nums",
              rate === value ? "bg-primary text-primary-foreground" : "bg-background"
            )}
          >
            {value.toFixed(1)}x
          </button>
        ))}
      </div>
    </div>
  )
}
