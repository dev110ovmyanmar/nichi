import { ModuleHero } from "@/components/jlpt/module-hero"
import { VocabBrowser } from "@/components/jlpt/vocab-browser"

export default function VocabPage() {
  return (
    <div>
      <ModuleHero
        kicker="語彙"
        title="N2 ဝေါဟာရ"
        description="OpenJLPT N2 စာရင်း + N3 ပြန်လည်သုံးသပ်။ Furigana၊ 自動詞/他動詞 တဂ်၊ မြန်မာ/အင်္ဂလိပ် အဓိပ္ပာယ်။"
      />
      <VocabBrowser />
    </div>
  )
}
