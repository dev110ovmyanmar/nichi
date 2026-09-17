import { ModuleHero } from "@/components/jlpt/module-hero"
import { VocabBrowser } from "@/components/jlpt/vocab-browser"
import { SOUMATOME_GOI_BOOK } from "@/data/sources"

export default function VocabPage() {
  return (
    <div>
      <ModuleHero
        kicker={`語彙 · ${SOUMATOME_GOI_BOOK.title}`}
        title="８週 · ７日目"
        description="Ask Publishing 総まとめ ပုံစံ — နေထိုင်မှုမှ 副詞၊ カタカナ၊ 類義語အထိ။ ၇ရက်မြောက် 実戦問題။"
      />
      <VocabBrowser />
    </div>
  )
}
