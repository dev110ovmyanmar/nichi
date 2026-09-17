import Link from "next/link"
import { LISTENING } from "@/data/listening"
import { ModuleHero } from "@/components/jlpt/module-hero"

const SECTION: Record<string, string> = {
  task: "課題理解",
  point: "ポイント理解",
  gist: "概要理解",
  response: "即時応答",
  integrated: "統合理解",
}

export default function ListeningIndexPage() {
  return (
    <div>
      <ModuleHero
        kicker="聴解"
        title="N2 နားထောင်"
        description="၅ ပိုင်း။ HTML5 မဟုတ် — ja-JP စကားပြောအင်ဂျင်ဖြင့် 0.8x–1.2x၊ ဂျပန်/မြန်မာ စာသား ပြောင်းနိုင်သည်။"
      />
      <div className="grid gap-2">
        {LISTENING.map((item) => (
          <Link
            key={item.id}
            href={`/listening/${item.id}`}
            className="rounded-3xl bg-card px-4 py-3 ring-1 ring-foreground/8"
          >
            <p className="text-xs text-muted-foreground">{SECTION[item.section]}</p>
            <p className="mt-1 font-medium">{item.questionJa}</p>
            <p className="my-script mt-1 text-sm text-muted-foreground">{item.questionMy}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
