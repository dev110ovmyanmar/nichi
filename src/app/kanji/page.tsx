import { ModuleHero } from "@/components/jlpt/module-hero"
import { KanjiBrowser } from "@/components/jlpt/kanji-browser"
import { SOUMATOME_KANJI_BOOK } from "@/data/sources"

export default function KanjiPage() {
  return (
    <div>
      <ModuleHero
        kicker={`漢字 · ${SOUMATOME_KANJI_BOOK.title}`}
        title="８週 · ７日目"
        description="Ask Publishing 総まとめ ပုံစံ — အပတ်လိုက် မြင်ကွင်း၊ 音訓၊ 部首၊ စုတ်ချက်၊ 熟語၊ ဥပမာနှင့် ၇ရက်မြောက် 実戦問題။"
      />
      <KanjiBrowser />
    </div>
  )
}
