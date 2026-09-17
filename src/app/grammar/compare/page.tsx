import Link from "next/link"
import { NUANCE } from "@/data/practice"
import { GRAMMAR, grammarById } from "@/data/grammar"
import { ModuleHero } from "@/components/jlpt/module-hero"

export default function ComparePage() {
  return (
    <div>
      <ModuleHero
        backHref="/grammar"
        kicker="文法"
        title="ニュアンス နှိုင်းယှဉ်"
        description="ဆင်တူ N2 ပုံစံများကို မြန်မာလို ခွဲပြသည်။"
      />
      <div className="grid gap-4">
        {NUANCE.map((pair) => {
          const left = grammarById(pair.leftId)
          const right = grammarById(pair.rightId)
          return (
            <article
              key={pair.id}
              className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
            >
              <h2 className="font-heading text-lg font-semibold">{pair.title}</h2>
              <p className="my-script mt-1 text-sm text-muted-foreground">{pair.titleMy}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {left ? (
                  <Link href={`/grammar/${left.id}`} className="rounded-2xl bg-muted/50 p-3">
                    <p className="font-medium">{left.pattern}</p>
                    <p className="my-script mt-1 text-xs text-muted-foreground">
                      {left.meaningMy}
                    </p>
                  </Link>
                ) : null}
                {right ? (
                  <Link href={`/grammar/${right.id}`} className="rounded-2xl bg-muted/50 p-3">
                    <p className="font-medium">{right.pattern}</p>
                    <p className="my-script mt-1 text-xs text-muted-foreground">
                      {right.meaningMy}
                    </p>
                  </Link>
                ) : null}
              </div>
              <p className="my-script mt-3 text-sm leading-relaxed">{pair.differenceMy}</p>
              <p className="mt-2 rounded-2xl bg-primary/8 px-3 py-2 text-sm">{pair.tipMy}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
