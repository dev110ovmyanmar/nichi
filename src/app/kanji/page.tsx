import { ModuleHero } from "@/components/jlpt/module-hero"
import { KanjiBrowser } from "@/components/jlpt/kanji-browser"

export default function KanjiPage() {
  return (
    <div>
      <ModuleHero
        kicker="漢字"
        title="N2 漢字 ၃၆၇ လုံး"
        description="On/Kun၊ စုတ်ချက်အရေအတွက်၊ KanjiVG stroke order နှင့် ကိုယ်တိုင်ရေးလေ့ကျင့်ခန်း။"
      />
      <KanjiBrowser />
    </div>
  )
}
