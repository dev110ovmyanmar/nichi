export type OpenSourceCredit = {
  id: string
  title: string
  roleMy: string
  license: string
  url: string
}

export const KANJI_OPEN_SOURCES: OpenSourceCredit[] = [
  {
    id: "kanjivg",
    title: "KanjiVG",
    roleMy: "စုတ်ချက်အစီအစဉ် (stroke order)",
    license: "CC BY-SA 3.0",
    url: "https://github.com/KanjiVG/kanjivg",
  },
  {
    id: "kanjidic2",
    title: "KANJIDIC2",
    roleMy: "ခန်ဂျိ အဘိဓာန် · 音訓၊ 意味၊ 画数",
    license: "EDRDG",
    url: "https://www.edrdg.org/wiki/index.php/KANJIDIC_Project",
  },
  {
    id: "tatoeba",
    title: "Tatoeba Project",
    roleMy: "ဥပမာဝါကျများ",
    license: "CC BY 2.0",
    url: "https://tatoeba.org",
  },
]

export const SOUMATOME_KANJI_BOOK = {
  title: "日本語総まとめ N2 漢字",
  publisher: "Ask Publishing",
  url: "https://www.ask-books.com/jlpt/n2/",
} as const
