import Link from "next/link"
import { READINGS } from "@/data/reading"
import { ModuleHero } from "@/components/jlpt/module-hero"

const KIND: Record<string, string> = {
  short: "短文",
  medium: "中文",
  long: "長文",
  info: "情報検索",
}

export default function ReadingIndexPage() {
  return (
    <div>
      <ModuleHero
        kicker="読解"
        title="N2 ဖတ်ရှု စက်"
        description="短文၊ 中文၊ 長文၊ 情報検索။ စကားလုံးတို့ရင် မြန်မာ အဓိပ္ပာယ် ပေါ်သည်။"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {READINGS.map((item) => (
          <Link
            key={item.id}
            href={`/reading/${item.id}`}
            className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
          >
            <p className="text-xs text-muted-foreground">
              {KIND[item.kind]} · {item.minutes} မိနစ်
            </p>
            <p className="mt-1 font-heading text-lg font-semibold">{item.title}</p>
            <p className="my-script mt-1 text-sm text-muted-foreground">{item.titleMy}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
