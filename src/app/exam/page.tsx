import Link from "next/link"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { ExamRunner } from "@/components/jlpt/exam-runner"

export default function ExamPage() {
  return (
    <div className="grid gap-5">
      <ModuleHero
        kicker="模擬試験"
        title="N2 အစမ်းစာမေးပွဲ"
        description="ဘာသာစကား+ဖတ်ရှု ၁၀၅ မိနစ်၊ နားထောင် ၅၀ မိနစ်။ ရမှတ်ကို ၁၈၀ သို့ စကေးချပြီး ကဏ္ဍဖြတ်မှတ် ၁၉၊ စု ၉၀ နှင့် တိုင်းသည်။"
      />
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/listening" className="rounded-full bg-muted px-3 py-2">
          聴解 သီးသန့်
        </Link>
        <Link href="/journal" className="rounded-full bg-muted px-3 py-2">
          မှတ်တမ်း
        </Link>
        <Link href="/kanji" className="rounded-full bg-muted px-3 py-2">
          漢字
        </Link>
        <Link href="/compounds" className="rounded-full bg-muted px-3 py-2">
          複合動詞
        </Link>
      </div>
      <ExamRunner />
    </div>
  )
}
