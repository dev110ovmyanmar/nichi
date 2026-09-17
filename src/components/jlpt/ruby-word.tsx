import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function RubyWord({
  word,
  reading,
  className,
}: {
  word: string
  reading: string
  className?: string
}) {
  const showRuby = Boolean(reading) && reading !== word
  return (
    <span className={cn("inline-block leading-none", className)}>
      {showRuby ? (
        <ruby className="ruby-jp">
          {word}
          <rt className="text-[0.55em] font-normal text-muted-foreground">
            {reading}
          </rt>
        </ruby>
      ) : (
        word
      )}
    </span>
  )
}

export function BookmarkButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border",
        active
          ? "border-primary bg-primary/12 text-primary"
          : "border-border text-muted-foreground"
      )}
    >
      <Star className={cn("size-4", active && "fill-current")} />
    </button>
  )
}
