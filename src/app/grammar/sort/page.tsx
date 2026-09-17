import { ModuleHero } from "@/components/jlpt/module-hero"
import { SortQuiz } from "@/components/jlpt/sort-quiz"

export default function SortPage() {
  return (
    <div>
      <ModuleHero
        backHref="/grammar"
        kicker="文法"
        title="星問題 並べ替え"
        description="N2 စာမေးပွဲပုံစံ စကားလုံးစီခြင်း။ အစီအစဉ် မှန်အောင် တို့ထည့်ပါ။"
      />
      <SortQuiz />
    </div>
  )
}
