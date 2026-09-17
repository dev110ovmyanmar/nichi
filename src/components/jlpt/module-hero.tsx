import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export function ModuleHero({
  kicker,
  title,
  description,
  backHref,
}: {
  kicker: string
  title: string
  description: string
  backHref?: string
}) {
  return (
    <section className="mb-5 grid gap-2">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
          ပြန်ရန်
        </Link>
      ) : (
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {kicker}
        </p>
      )}
      <h1 className="font-heading text-[1.7rem] leading-tight font-semibold tracking-tight">
        {title}
      </h1>
      <p className="my-script max-w-2xl text-sm text-muted-foreground">{description}</p>
    </section>
  )
}
