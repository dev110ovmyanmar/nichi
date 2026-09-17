"use client"

import { useEffect, useRef, useState } from "react"

function kanjiVgUrl(character: string) {
  const code = character.codePointAt(0)?.toString(16).padStart(5, "0")
  return `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${code}.svg`
}

export function KanjiStroke({ character }: { character: string }) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  useEffect(() => {
    let cancelled = false
    setSvg(null)
    setError(false)
    fetch(kanjiVgUrl(character))
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => {
        if (!cancelled) setSvg(text.replace(/<\?xml[^>]*>/, ""))
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [character])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [character])

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-muted/50 p-4">
        {svg ? (
          <div
            className="kanji-stroke h-full w-full text-foreground [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <p className="font-heading text-7xl">{character}</p>
        )}
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {error
            ? "Stroke SVG မရပါ။ အောက်တွင် ကိုယ်တိုင် ရေးလေ့ကျင့်ပါ။"
            : "စုတ်ချက် အစီအစဉ် · ညာဘက်တွင် ရေးကြည့်ပါ"}
        </p>
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="w-full touch-none rounded-3xl bg-background ring-1 ring-foreground/10"
          onPointerDown={(event) => {
            drawing.current = true
            const ctx = canvasRef.current?.getContext("2d")
            if (!ctx) return
            const { x, y } = point(event)
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.strokeStyle = "currentColor"
            ctx.lineWidth = 8
            ctx.lineCap = "round"
          }}
          onPointerMove={(event) => {
            if (!drawing.current) return
            const ctx = canvasRef.current?.getContext("2d")
            if (!ctx) return
            const { x, y } = point(event)
            ctx.lineTo(x, y)
            ctx.stroke()
          }}
          onPointerUp={() => {
            drawing.current = false
          }}
        />
        <button
          type="button"
          className="mt-2 text-sm font-medium text-primary"
          onClick={() => {
            const canvas = canvasRef.current
            const ctx = canvas?.getContext("2d")
            if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
          }}
        >
          ဖျက်ရန်
        </button>
      </div>
    </div>
  )
}
