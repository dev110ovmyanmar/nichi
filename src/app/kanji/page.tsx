import { ModuleHero } from "@/components/jlpt/module-hero"
import { KanjiBrowser } from "@/components/jlpt/kanji-browser"

export default function KanjiPage() {
  return (
    <div>
      <ModuleHero
        kicker="漢字 · Kanji Master"
        title="Kanji Master N2"
        description="အခန်းလိုက် 音訓၊ 部首၊ စုတ်ချက်အစီအစဉ်၊ 熟語၊ ဥပမာဝါကျနှင့် အခန်း-အဆုံး quiz။"
      />
      <KanjiBrowser />
    </div>
  )
}
