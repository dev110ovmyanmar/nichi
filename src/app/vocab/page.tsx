import { ModuleHero } from "@/components/jlpt/module-hero"
import { VocabBrowser } from "@/components/jlpt/vocab-browser"

export default function VocabPage() {
  return (
    <div>
      <ModuleHero
        kicker="語彙 · Tango 2500"
        title="N2 Tango ၂၅၀၀"
        description="အခန်းနှင့် အပိုင်းအလိုက် (chapter / section)။ Furigana၊ 品詞၊ 自動詞/他動詞၊ မြန်မာအဓိပ္ပာယ်၊ ဥပမာဝါကျ အသံ။"
      />
      <VocabBrowser />
    </div>
  )
}
