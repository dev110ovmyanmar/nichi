import type { CurriculumChapter, CurriculumSection } from "@/lib/jlpt/types"

/**
 * 8-week / 7-day shells modelled on 日本語総まとめ N2 漢字 (Ask Publishing):
 * scene-based weeks (signs, machines, notices, documents, home, ads, info, news).
 * Kanji lists, readings, and example sentences come from OpenJLPT / KANJIDIC2 /
 * Tatoeba — not from the textbook.
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
  radical: string,
  radicalMy: string,
  days: CurriculumSection[]
): CurriculumChapter {
  const id = `k${String(number).padStart(2, "0")}`
  return {
    id,
    book: "soumatome-kanji",
    number,
    titleJa,
    titleMy,
    summaryMy,
    radical,
    radicalMy,
    unitJa: "週",
    sectionUnitJa: "日目",
    sections: days,
  }
}

export const SOUMATOME_KANJI_WEEKS: CurriculumChapter[] = [
  week(
    1,
    "漢字を見る① 街・建物",
    "မြို့နှင့် အဆောက်အအုံ တွင် တွေ့ရသော 漢字",
    "ဆိုင်းဘုတ်၊ သတိပေးချက်၊ ဘူတာ၊ ယာဉ်၊ စာတိုက်၊ ဆေးရုံ။",
    "示",
    "ပြသ",
    [
      day("k01", 1, "立て札・注意書き", "ဆိုင်းဘုတ်နှင့် သတိပေးချက်", [
        "sign", "notice", "warning", "caution", "danger", "forbidden", "prohibit",
        "stop", "keep", "out", "emergency", "alert", "strict",
      ]),
      day("k01", 2, "建物の中の表示", "အဆောက်အအုံတွင်း ဖော်ပြချက်", [
        "building", "floor", "elevator", "stair", "entrance", "exit", "open",
        "close", "room", "hall", "gate", "wall", "office",
      ]),
      day("k01", 3, "建物の設備", "အဆောက်အအုံ ပစ္စည်းများ", [
        "door", "window", "light", "air", "toilet", "restroom", "park",
        "facility", "equipment", "use",
      ]),
      day("k01", 4, "駅の表示", "ဘူတာ ဆိုင်းဘုတ်", [
        "station", "ticket", "transfer", "platform", "line", "track", "arrive",
        "depart", "delay", "schedule",
      ]),
      day("k01", 5, "乗り物の表示", "ယာဉ်ပေါ် ဖော်ပြချက်", [
        "train", "bus", "car", "vehicle", "ride", "seat", "priority", "baggage",
        "smoke", "emergency",
      ]),
      day("k01", 6, "郵便局・病院", "စာတိုက်နှင့် ဆေးရုံ", [
        "post", "mail", "letter", "hospital", "clinic", "doctor", "nurse",
        "medicine", "patient", "pharmacy",
      ]),
      day("k01", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    2,
    "漢字を使う① 機械・電化製品",
    "စက်နှင့် လျှပ်စစ်ပစ္စည်း",
    "လက်မှတ်စက်၊ ATM၊ အရောင်းစက်၊ ရီမုတ်၊ ဖုန်း၊ ကွန်ပျူတာ။",
    "金",
    "သတ္တု",
    [
      day("k02", 1, "自動券売機", "လက်မှတ်အလိုအလျောက်စက်", [
        "ticket", "automatic", "machine", "button", "select", "confirm", "cancel",
      ]),
      day("k02", 2, "現金自動支払機", "ATM / ငွေထုတ်စက်", [
        "money", "cash", "pay", "bank", "account", "withdraw", "deposit", "card",
        "pin", "balance",
      ]),
      day("k02", 3, "自動販売機", "အလိုအလျောက်ရောင်းစက်", [
        "sell", "vending", "drink", "coin", "change", "product", "buy",
      ]),
      day("k02", 4, "家電のリモコン", "အိမ်သုံးပစ္စည်း ရီမုတ်", [
        "electric", "remote", "power", "volume", "channel", "heat", "cool",
        "timer", "switch",
      ]),
      day("k02", 5, "電話・携帯電話", "ဖုန်းနှင့် မိုဘိုင်း", [
        "phone", "call", "mobile", "signal", "charge", "battery", "number",
        "hold", "message",
      ]),
      day("k02", 6, "パソコン", "ကွန်ပျူတာ", [
        "computer", "program", "file", "screen", "data", "network", "password",
        "print", "save",
      ]),
      day("k02", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    3,
    "漢字を使う② 通知・手続き",
    "အကြောင်းကြားစာနှင့် လုပ်ငန်းစဉ်",
    "ငွေတောင်းခံ၊ အိမ်မရှိ၊ ပွိုင့်ကတ်၊ အမှိုက်ခွဲ၊ အကြောင်းကြားလွှာ။",
    "言",
    "စကား",
    [
      day("k03", 1, "料金通知・振込", "ကြေးနှင့် လွှဲငွေ", [
        "fee", "bill", "charge", "transfer", "pay", "due", "tax", "cost",
        "amount",
      ]),
      day("k03", 2, "不在通知", "အိမ်မရှိ သတင်း", [
        "absent", "away", "delivery", "receive", "again", "leave", "notice",
      ]),
      day("k03", 3, "カード・券・預かり", "ကတ်၊ လက်မှတ်၊ အပ်နှံ", [
        "card", "coupon", "ticket", "point", "deposit", "keep", "receipt",
        "clean",
      ]),
      day("k03", 4, "ゴミの分別", "အမှိုက် ခွဲခြား", [
        "garbage", "waste", "recycle", "burn", "plastic", "paper", "separate",
        "trash", "environment",
      ]),
      day("k03", 5, "いろいろな通知①", "အကြောင်းကြားစာ ၁", [
        "notice", "inform", "announce", "change", "schedule", "cancel",
      ]),
      day("k03", 6, "いろいろな通知②", "အကြောင်းကြားစာ ၂", [
        "request", "confirm", "deadline", "period", "valid", "expire",
      ]),
      day("k03", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    4,
    "漢字を書く 書類・メール",
    "စာရွက်နှင့် မေးလ် ရေးသားခြင်း",
    "လျှောက်လွှာ၊ စာ၊ စီးပွားရေးမေးလ်၊ အဖြေလွှာ၊ စာစီစာကုံး။",
    "文",
    "စာ",
    [
      day("k04", 1, "伝票・申込書", "ဘောင်ချာနှင့် လျှောက်လွှာ", [
        "form", "apply", "application", "slip", "document", "fill", "name",
        "address",
      ]),
      day("k04", 2, "証明書・履歴書", "လက်မှတ်နှင့် ကိုယ်ရေးရာဇဝင်", [
        "certificate", "resume", "history", "prove", "identity", "copy",
      ]),
      day("k04", 3, "メール・はがき", "မေးလ်နှင့် ပိုစကတ်", [
        "mail", "email", "postcard", "write", "send", "reply", "letter",
      ]),
      day("k04", 4, "ビジネスメール", "စီးပွားရေး မေးလ်", [
        "business", "company", "regard", "attach", "meeting", "please",
        "contact",
      ]),
      day("k04", 5, "答案用紙", "အဖြေလွှာ", [
        "exam", "answer", "sheet", "score", "grade", "test", "question",
      ]),
      day("k04", 6, "作文", "စာစီစာကုံး", [
        "essay", "compose", "opinion", "reason", "example", "conclude",
        "write",
      ]),
      day("k04", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    5,
    "家庭用品・食品",
    "အိမ်သုံးပစ္စည်းနှင့် အစားအသောက်",
    "အိုး၊ အပူပေး၊ ဆပ်ပြာ၊ ဆေး၊ အစား၊ အင်တာကွန်။",
    "食",
    "စား",
    [
      day("k05", 1, "家庭用品① 熱源", "အိမ်သုံး ၁ · အပူ", [
        "heat", "hot", "pot", "heater", "boil", "warm", "fire", "steam",
      ]),
      day("k05", 2, "家庭用品②", "အိမ်သုံး ၂", [
        "home", "furniture", "tool", "box", "bag", "cloth", "use",
      ]),
      day("k05", 3, "洗剤・掃除", "ဆပ်ပြာနှင့် သန့်ရှင်းရေး", [
        "wash", "soap", "clean", "dirt", "stain", "laundry",
      ]),
      day("k05", 4, "薬", "ဆေးဝါး", [
        "medicine", "drug", "pill", "dose", "pain", "sick", "symptom", "heal",
      ]),
      day("k05", 5, "食品", "အစားအသောက်", [
        "food", "eat", "taste", "fresh", "expire", "ingredient", "salt",
        "sugar", "oil", "meat", "fish", "rice",
      ]),
      day("k05", 6, "インターホン・操作", "အင်တာကွန်နှင့် ခလုတ်", [
        "intercom", "button", "open", "talk", "camera", "lock",
      ]),
      day("k05", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    6,
    "漢字を見る② 広告・展示",
    "ကြော်ငြာ၊ မြေပုံ၊ ပြသမှု",
    "လက်ကမ်းကြော်ငြာ၊ မြေပုံ၊ ယဉ်ကျေးမှုအမွေ၊ နှိုင်းယှဉ်ရွေးချယ်။",
    "見",
    "မြင်",
    [
      day("k06", 1, "広告・チラシ", "ကြော်ငြာနှင့် လက်ကမ်းစာ", [
        "ad", "advertis", "flyer", "sale", "discount", "special", "free",
        "limited",
      ]),
      day("k06", 2, "店の案内", "ဆိုင် လမ်းညွှန်", [
        "shop", "store", "open", "closed", "floor", "guide", "bargain",
      ]),
      day("k06", 3, "イベント", "ပွဲတော်", [
        "event", "festival", "celebrate", "hold", "join", "ticket",
      ]),
      day("k06", 4, "地図", "မြေပုံ", [
        "map", "north", "south", "east", "west", "left", "right", "near",
        "direction", "place", "slope", "hill",
      ]),
      day("k06", 5, "文化財・展示", "ယဉ်ကျေးမှုအမွေနှင့် ပြပွဲ", [
        "culture", "exhibit", "museum", "art", "history", "temple", "treasure",
        "ritual",
      ]),
      day("k06", 6, "比較・選択", "နှိုင်းယှဉ် ရွေးချယ်", [
        "compare", "choice", "which", "same", "different", "better", "average",
      ]),
      day("k06", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    7,
    "掲示・案内・情報",
    "ကြေညာ၊ လမ်းညွှန်၊ သတင်းအချက်အလက်",
    "အလုပ်ခေါ်၊ ဘုတ်၊ မီနူး၊ စာမေးပွဲ၊ လမ်းပန်း၊ မိုးလေဝသ။",
    "日",
    "နေ့",
    [
      day("k07", 1, "求人・募集", "အလုပ်ခေါ်နှင့် စုဆောင်း", [
        "recruit", "hire", "job", "salary", "work", "apply", "staff", "want",
        "campaign", "enlist",
      ]),
      day("k07", 2, "掲示板・地域", "ကြေညာဘုတ်နှင့် ရပ်ကွက်", [
        "board", "community", "local", "newspaper", "region", "town", "ward",
      ]),
      day("k07", 3, "メニュー・成分", "မီနူးနှင့် ပါဝင်ပစ္စည်း", [
        "menu", "ingredient", "calorie", "contain", "allergy", "taste",
      ]),
      day("k07", 4, "受験案内", "စာမေးပွဲ လမ်းညွှန်", [
        "exam", "entrance", "apply", "guide", "school", "test", "pass", "fail",
      ]),
      day("k07", 5, "交通情報", "လမ်းပန်း သတင်း", [
        "traffic", "road", "accident", "delay", "closed", "route", "bridge",
      ]),
      day("k07", 6, "気象情報", "မိုးလေဝသ", [
        "weather", "rain", "snow", "wind", "storm", "typhoon", "hot", "cold",
        "temperature",
      ]),
      day("k07", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
  week(
    8,
    "ニュース・見出し・記事",
    "သတင်း၊ ခေါင်းစဉ်၊ ဆောင်းပါး",
    "သတင်းအမြန်၊ ခေါင်းစဉ်၊ သတင်းဆောင်းပါး N2 ခန်ဂျိ။",
    "言",
    "စကား",
    [
      day("k08", 1, "速報", "သတင်းအမြန်", [
        "news", "breaking", "report", "now", "urgent", "update",
      ]),
      day("k08", 2, "見出し①", "ခေါင်းစဉ် ၁", [
        "headline", "title", "increase", "decrease", "record", "first",
      ]),
      day("k08", 3, "見出し②", "ခေါင်းစဉ် ၂", [
        "agree", "oppose", "plan", "decide", "start", "end", "party", "faction",
      ]),
      day("k08", 4, "記事① 社会", "ဆောင်းပါး ၁ · လူမှု", [
        "society", "public", "government", "law", "crime", "police", "right",
        "citizen",
      ]),
      day("k08", 5, "記事② 経済・環境", "ဆောင်းပါး ၂ · စီးပွား/ပတ်ဝန်းကျင်", [
        "economy", "company", "market", "environment", "earth", "protect",
        "pollution", "energy", "tax",
      ]),
      day("k08", 6, "記事③ 科学・国際", "ဆောင်းပါး ၃ · သိပ္ပံ/နိုင်ငံတကာ", [
        "science", "space", "world", "nation", "develop", "technology",
        "research", "international",
      ]),
      day("k08", 7, "実戦問題", "အပတ်စဉ် လေ့ကျင့်ခန်း", []),
    ]
  ),
]
