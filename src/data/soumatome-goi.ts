import type { CurriculumChapter, CurriculumSection } from "@/lib/jlpt/types"

/**
 * 8-week / 7-day shells modelled on 日本語総まとめ N2 語彙 (Ask Publishing).
 * Word lists and example sentences are OpenJLPT / Tatoeba — not copied from
 * the textbook. First half = daily-life scenes, second half = function
 * (adverbs, kango, katakana, synonyms, compounds).
 */

function day(
  weekId: string,
  number: number,
  titleJa: string,
  titleMy: string,
  keywords: string[]
): CurriculumSection {
  return {
    id: `${weekId}-d${number}`,
    number,
    titleJa,
    titleMy,
    keywords,
  }
}

function week(
  number: number,
  titleJa: string,
  titleMy: string,
  summaryMy: string,
  days: CurriculumSection[]
): CurriculumChapter {
  const id = `g${String(number).padStart(2, "0")}`
  return {
    id,
    book: "soumatome-goi",
    number,
    titleJa,
    titleMy,
    summaryMy,
    unitJa: "週",
    sectionUnitJa: "日目",
    sections: days,
  }
}

export const SOUMATOME_GOI_WEEKS: CurriculumChapter[] = [
  week(
    1,
    "暮らし① 住まい・家族",
    "နေထိုင်မှုနှင့် မိသားစု",
    "အခန်းငှား၊ ပြောင်းရွှေ့၊ ဧည့်သည်၊ အိမ်မှု၊ အားလပ်ရက်၊ ငွေကြေး။",
    [
      day("g01", 1, "アパートを探しています", "အခန်း ရှာနေသည်", [
        "apartment", "rent", "deposit", "mansion", "landlord", "tenant",
        "south", "facing", "walk", "built", "floor", "vacancy", "housing",
        "room", "kitchen", "bath", "balcony",
      ]),
      day("g01", 2, "引っ越しは大変です", "ပြောင်းရွှေ့ရတာ ခက်သည်", [
        "move", "moving", "cardboard", "tape", "pack", "unpack", "garbage",
        "recycle", "trash", "waste", "burnable", "plastic", "bag", "box",
      ]),
      day("g01", 3, "友人を招きました", "သူငယ်ချင်း ဖိတ်သည်", [
        "invite", "guest", "friend", "visit", "treat", "welcome", "entertain",
        "party", "host", "come over", "dinner",
      ]),
      day("g01", 4, "家事・子育ては大変です", "အိမ်မှုနှင့် ကလေးပြုစု", [
        "housework", "chore", "childcare", "raise", "laundry", "cook",
        "clean", "diaper", "infant", "parent", "household",
      ]),
      day("g01", 5, "夏休みを海で過ごしています", "နွေရာသီ အားလပ်ရက်", [
        "vacation", "summer", "sea", "beach", "hotel", "trip", "travel",
        "sightseeing", "spend", "holiday", "resort", "swim",
      ]),
      day("g01", 6, "お金を使いすぎました", "ငွေ အလွန်သုံးမိသည်", [
        "money", "bank", "withdraw", "deposit", "account", "fee", "income",
        "expense", "budget", "salary", "pay", "transfer", "red", "black",
        "thrifty", "wasteful",
      ]),
      day("g01", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    2,
    "暮らし② 仕事・パソコン",
    "အလုပ်နှင့် ကွန်ပျူတာ",
    "အလုပ်ချိန်၊ အလုပ်ဝင်၊ အစည်းအဝေး၊ PC၊ လုပ်ဖော်ကိုင်ဖက်၊ လစာ။",
    [
      day("g02", 1, "仕事の一日", "အလုပ်တစ်နေ့", [
        "work", "job", "task", "overtime", "busy", "deadline", "efficient",
        "lazy", "duty", "shift", "office",
      ]),
      day("g02", 2, "就職・退職", "အလုပ်ဝင် / ထွက်", [
        "employ", "hire", "recruit", "resign", "quit", "retire", "career",
        "interview", "resume", "join", "company", "job hunting",
      ]),
      day("g02", 3, "会議・出張", "အစည်းအဝေးနှင့် ခရီးစဉ်", [
        "meeting", "conference", "present", "proposal", "agenda", "minutes",
        "business trip", "discuss", "negotiate", "client",
      ]),
      day("g02", 4, "パソコン", "ကွန်ပျူတာ", [
        "computer", "file", "print", "password", "screen", "data", "click",
        "save", "delete", "network", "email", "software", "app",
      ]),
      day("g02", 5, "職場の人間関係", "လုပ်ငန်းခွင် ဆက်ဆံရေး", [
        "colleague", "boss", "subordinate", "workplace", "team", "coworker",
        "senior", "junior", "complain", "praise",
      ]),
      day("g02", 6, "給料・労働", "လစာနှင့် အလုပ်သမား", [
        "salary", "wage", "bonus", "labor", "union", "paid leave", "overtime",
        "full-time", "part-time", "welfare", "insurance",
      ]),
      day("g02", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    3,
    "人物描写・体調",
    "စရိုက်၊ စိတ်ခံစားမှု၊ ကျန်းမာရေး",
    "စရိုက်၊ အမူအရာ၊ စိတ်၊ နေမကောင်း၊ ကိုယ်လက်။",
    [
      day("g03", 1, "性格", "စရိုက်", [
        "personality", "character", "selfish", "kind", "stubborn", "cheerful",
        "serious", "shy", "arrogant", "modest", "honest", "lazy", "diligent",
      ]),
      day("g03", 2, "様子・態度", "အမူအရာနှင့် သဘောထား", [
        "attitude", "manner", "appearance", "behavior", "look", "seem",
        "polite", "rude", "calm", "nervous", "confident",
      ]),
      day("g03", 3, "感情①", "စိတ်ခံစားမှု ၁", [
        "happy", "sad", "angry", "glad", "feel", "emotion", "delight",
        "worry", "fear", "surprise", "love", "hate",
      ]),
      day("g03", 4, "感情②", "စိတ်ခံစားမှု ၂", [
        "disappointed", "bored", "anxious", "envy", "frustrated", "ashamed",
        "regret", "relieved", "jealous", "lonely",
      ]),
      day("g03", 5, "体調・病気", "ကျန်းမာရေး", [
        "sick", "ill", "health", "condition", "fever", "pain", "cough",
        "cold", "injury", "symptom", "recover", "hospital", "medicine",
      ]),
      day("g03", 6, "体と動作", "ကိုယ်နှင့် လှုပ်ရှား", [
        "shoulder", "chest", "waist", "stretch", "sit", "stand", "bend",
        "lift", "muscle", "posture", "nod", "bow",
      ]),
      day("g03", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    4,
    "副詞まとめ",
    "ကြိယာဝိသေသန",
    "အတိုင်းအတာ၊ အချိန်၊ မကြာခဏ၊ ပုံစံ၊ အကဲဖြတ်။",
    [
      day("g04", 1, "程度の副詞", "အတိုင်းအတာ", [
        "quite", "rather", "extremely", "completely", "almost", "hardly",
        "barely", "fairly", "highly", "slightly", "totally", "enough",
      ]),
      day("g04", 2, "時間の副詞", "အချိန်", [
        "suddenly", "finally", "immediately", "eventually", "soon", "already",
        "yet", "still", "just", "recently", "meanwhile",
      ]),
      day("g04", 3, "頻度・順序", "မကြာခဏနှင့် အစဉ်", [
        "always", "often", "rarely", "seldom", "usually", "first", "next",
        "then", "last", "again", "once", "twice",
      ]),
      day("g04", 4, "様態の副詞", "ပုံစံ", [
        "slowly", "carefully", "firmly", "loosely", "quietly", "clearly",
        "properly", "accidentally", "on purpose", "together",
      ]),
      day("g04", 5, "評価・判断", "အကဲဖြတ်", [
        "certainly", "indeed", "naturally", "of course", "probably", "perhaps",
        "surely", "definitely", "unfortunately", "actually",
      ]),
      day("g04", 6, "その他の副詞", "အခြား ကြိယာဝိသေသန", [
        "anyway", "somehow", "incidentally", "after all", "at least",
        "for example", "in other words", "besides", "however",
      ]),
      day("g04", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    5,
    "漢字語彙①",
    "ခန်ဂို ဝေါဟာရ ၁",
    "するကြိယာ၊ ခန်ဂို နာမ်၊ ဆန့်ကျင်ဘက်၊ 접사၊ စာဟန်။",
    [
      day("g05", 1, "する動詞", "する ကြိယာ", [
        "suru", "conduct", "perform", "carry out", "implement", "apply",
        "manage", "operate",
      ]),
      day("g05", 2, "漢語の名詞", "ခန်ဂို နာမ်", [
        "situation", "condition", "circumstance", "system", "structure",
        "organization", "process", "result", "effect", "purpose",
      ]),
      day("g05", 3, "対になる語", "အတွဲလိုက် စကား", [
        "opposite", "antonym", "increase", "decrease", "start", "end",
        "success", "failure", "advantage", "disadvantage",
      ]),
      day("g05", 4, "接頭語・接尾語", "ရှေ့/နောက် ဆက်", [
        "prefix", "suffix", "un-", "anti", "re-", "-ness", "pre-", "post-",
        "semi", "non",
      ]),
      day("g05", 5, "書面語", "စာဟန်", [
        "formal", "written", "official", "document", "hereby", "regarding",
        "aforementioned", "respectively",
      ]),
      day("g05", 6, "抽象概念", "စိတ္တဇ", [
        "concept", "abstract", "theory", "principle", "value", "meaning",
        "essence", "aspect", "factor", "trend",
      ]),
      day("g05", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    6,
    "カタカナ・外来語",
    "ကာတာကနနှင့် နိုင်ငံခြားစကား",
    "နေ့စဉ်၊ စီးပွား၊ IT၊ အစား၊ ယဉ်ကျေးမှု カタカナ။",
    [
      day("g06", 1, "日常のカタカナ", "နေ့စဉ် ကာတာကန", [
        "service", "stress", "claim", "trouble", "rule", "manner", "style",
        "point", "level", "pattern",
      ]),
      day("g06", 2, "ビジネスのカタカナ", "စီးပွားရေး ကာတာကန", [
        "business", "meeting", "presentation", "schedule", "plan", "project",
        "team", "member", "staff", "career",
      ]),
      day("g06", 3, "IT・メディア", "IT / မီဒီယာ", [
        "internet", "site", "app", "data", "system", "network", "media",
        "online", "digital", "file",
      ]),
      day("g06", 4, "食べ物・暮らし", "အစားနှင့် နေထိုင်မှု", [
        "menu", "calorie", "diet", "vitamin", "recycle", "energy", "eco",
        "organic",
      ]),
      day("g06", 5, "社会・文化", "လူမှုနှင့် ယဉ်ကျေးမှု", [
        "volunteer", "event", "festival", "design", "art", "image", "theme",
        "culture",
      ]),
      day("g06", 6, "その他の外来語", "အခြား နိုင်ငံခြားစကား", [
        "loan", "foreign", "katakana", "english", "borrowed",
      ]),
      day("g06", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    7,
    "類義語・使い分け",
    "နီးစပ်သော စကားလုံး ခွဲခြားသုံး",
    "မြင်၊ တွေး၊ ပြော၊ ပြောင်း၊ ရပ်၊ ကြီး/ငယ်။",
    [
      day("g07", 1, "見る・見える", "မြင် / ထင်ရှား", [
        "look", "see", "watch", "stare", "glance", "notice", "observe",
        "visible", "appear",
      ]),
      day("g07", 2, "思う・考える", "ထင် / စဉ်းစား", [
        "think", "consider", "believe", "guess", "suppose", "wonder",
        "expect", "assume",
      ]),
      day("g07", 3, "言う・述べる", "ပြော / ဖော်ပြ", [
        "say", "tell", "speak", "mention", "state", "explain", "claim",
        "express", "declare",
      ]),
      day("g07", 4, "変わる・変える", "ပြောင်းလဲ", [
        "change", "alter", "shift", "turn", "transform", "replace", "convert",
        "modify",
      ]),
      day("g07", 5, "止める・やめる", "ရပ် / ရပ်ဆိုင်း", [
        "stop", "quit", "cancel", "give up", "pause", "halt", "end", "cease",
      ]),
      day("g07", 6, "大きい・多い", "ကြီး / များ", [
        "big", "large", "great", "many", "much", "plenty", "increase",
        "expand", "huge",
      ]),
      day("g07", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    8,
    "慣用句・複合表現",
    "စကားပုံနှင့် ပေါင်းစပ် အသုံး",
    "ပေါင်းစပ်ကြိယာ၊ စကားပုံ၊ အသံလိုက်စကား၊ N3 ပြန်လည်သုံးသပ်။",
    [
      day("g08", 1, "複合動詞", "ပေါင်းစပ် ကြိယာ", [
        "compound", "take out", "take in", "look into", "cut off", "hold on",
        "give in", "put off",
      ]),
      day("g08", 2, "慣用句", "စကားပုံ", [
        "idiom", "set phrase", "proverb", "expression", "figure of speech",
      ]),
      day("g08", 3, "擬音語・擬態語", "အသံ/အမူ အတုစကား", [
        "onomatopoeia", "mimetic", "sound", "sizzle", "murmur", "glitter",
      ]),
      day("g08", 4, "ことばの決まり", "သတ်မှတ် စကားလုံး", [
        "collocation", "fixed", "set", "pattern", "phrase",
      ]),
      day("g08", 5, "N3の復習①", "N3 ပြန်လည်သုံးသပ် ၁", [
        "basic", "review", "beginner", "elementary",
      ]),
      day("g08", 6, "N3の復習②", "N3 ပြန်လည်သုံးသပ် ၂", [
        "everyday", "daily", "simple", "common",
      ]),
      day("g08", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
]
