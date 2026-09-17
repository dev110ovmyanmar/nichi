import Link from "next/link"
import { GRAMMAR } from "@/data/grammar"
import { ModuleHero } from "@/components/jlpt/module-hero"

export default function GrammarPage() {
  return (
    <div>
      <ModuleHero
        kicker="文法"
        title="N2 သဒ္ဒါ"
        description="接続 စည်းကမ်း၊ မြန်မာ ရှင်းချက်၊ ဥပမာ၊ နီးစပ်ပုံစံ နှိုင်းယှဉ်၊ 星問題 စီခြင်း။"
      />
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Link
          href="/grammar/compare"
          className="rounded-2xl bg-secondary px-4 py-3 text-sm font-medium"
        >
          ニュアンス နှိုင်းယှဉ်
        </Link>
        <Link
          href="/grammar/sort"
          className="rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
        >
          星問題 並べ替え
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {GRAMMAR.map((item) => (
          <Link
            key={item.id}
            href={`/grammar/${item.id}`}
            className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
          >
            <p className="font-heading text-lg font-semibold">{item.pattern}</p>
            <p className="my-script mt-1 text-sm text-muted-foreground">{item.meaningMy}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">{item.connection}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
