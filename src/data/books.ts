import type { CurriculumChapter } from "@/lib/jlpt/types"

/**
 * Original chapter/section shells modelled on typical N2 Tango 2500 and
 * Kanji Master course books (theme → section → items). Item lists, example
 * sentences, and Burmese notes are original / OpenJLPT — not copied from
 * those publications.
 */

export const TANGO_CHAPTERS: CurriculumChapter[] = [
  {
    id: "t01",
    book: "tango",
    number: 1,
    titleJa: "生活の基本",
    titleMy: "နေ့စဉ်ဘဝ အခြေခံ",
    summaryMy: "နေထိုင်မှု၊ နေ့စဉ်လုပ်ရိုးလုပ်စဉ်၊ အိမ်နှင့် မြို့နေဘဝ။",
    sections: [
      {
        id: "t01-s1",
        number: 1,
        titleJa: "住まいと暮らし",
        titleMy: "အိမ်နှင့် နေထိုင်မှု",
        keywords: [
          "house", "home", "room", "apartment", "furniture", "door", "window",
          "live", "resident", "neighbor", "neighborhood", "rent", "kitchen",
          "bath", "toilet", "building", "roof", "wall", "floor", "garden",
        ],
      },
      {
        id: "t01-s2",
        number: 2,
        titleJa: "日課と習慣",
        titleMy: "နေ့စဉ်နှင့် အလေ့အကျင့်",
        keywords: [
          "daily", "habit", "usual", "always", "often", "sometimes", "rarely",
          "routine", "wake", "sleep", "morning", "evening", "as usual", "as ever",
          "lifestyle", "custom",
        ],
      },
    ],
  },
  {
    id: "t02",
    book: "tango",
    number: 2,
    titleJa: "食事と健康",
    titleMy: "အစားအသောက်နှင့် ကျန်းမာရေး",
    summaryMy: "အစားအစာ၊ ချက်ပြုတ်၊ ခန္ဓာကိုယ်နှင့် ဆေးရုံ။",
    sections: [
      {
        id: "t02-s1",
        number: 1,
        titleJa: "食べ物・料理",
        titleMy: "အစားအစာနှင့် ဟင်းလျာ",
        keywords: [
          "food", "eat", "meal", "cook", "rice", "bread", "fruit", "vegetable",
          "meat", "fish", "taste", "delicious", "hungry", "thirsty", "drink",
          "restaurant", "menu", "ingredient", "salt", "sugar", "oil", "freeze",
          "refrigerat", "well", "paddy", "farm",
        ],
      },
      {
        id: "t02-s2",
        number: 2,
        titleJa: "体と医療",
        titleMy: "ခန္ဓာကိုယ်နှင့် ဆေးကုသမှု",
        keywords: [
          "health", "body", "sick", "ill", "disease", "hospital", "doctor",
          "nurse", "medicine", "pharmacy", "pain", "hurt", "injury", "blood",
          "heart", "stomach", "fever", "cough", "diagnosis", "treatment",
          "symptom", "patient", "clinic", "dental", "surgery",
        ],
      },
    ],
  },
  {
    id: "t03",
    book: "tango",
    number: 3,
    titleJa: "移動と交通",
    titleMy: "သွားလာမှုနှင့် ပို့ဆောင်ရေး",
    summaryMy: "ရထား၊ ကား၊ လမ်းညွှန်၊ ခရီးသွား။",
    sections: [
      {
        id: "t03-s1",
        number: 1,
        titleJa: "乗り物",
        titleMy: "ယာဉ်များ",
        keywords: [
          "train", "bus", "car", "taxi", "bicycle", "plane", "airport", "station",
          "ticket", "transfer", "commute", "drive", "ride", "vehicle", "traffic",
          "road", "highway", "bridge", "ship", "port",
        ],
      },
      {
        id: "t03-s2",
        number: 2,
        titleJa: "旅行と方向",
        titleMy: "ခရီးနှင့် ဦးတည်ရာ",
        keywords: [
          "travel", "trip", "tour", "hotel", "luggage", "map", "direction",
          "left", "right", "north", "south", "east", "west", "arrive", "depart",
          "delay", "schedule", "passport", "sightseeing",
        ],
      },
    ],
  },
  {
    id: "t04",
    book: "tango",
    number: 4,
    titleJa: "買い物とお金",
    titleMy: "ဈေးဝယ်နှင့် ငွေကြေး",
    summaryMy: "ဈေးနှုန်း၊ ပေးချေ၊ ဆုံးရှုံး/အမြတ်။",
    sections: [
      {
        id: "t04-s1",
        number: 1,
        titleJa: "店と買い物",
        titleMy: "ဆိုင်နှင့် ဈေးဝယ်",
        keywords: [
          "shop", "store", "buy", "sell", "price", "cheap", "expensive",
          "discount", "customer", "product", "goods", "brand", "order",
          "return", "receipt", "cash", "card",
        ],
      },
      {
        id: "t04-s2",
        number: 2,
        titleJa: "金銭と損得",
        titleMy: "ငွေနှင့် အမြတ်အရှုံး",
        keywords: [
          "money", "pay", "cost", "fee", "tax", "salary", "wage", "budget",
          "save", "spend", "loan", "debt", "profit", "loss", "gain", "cheap",
          "valuable", "worth", "account", "bank", "coin", "bill",
        ],
      },
    ],
  },
  {
    id: "t05",
    book: "tango",
    number: 5,
    titleJa: "仕事と職場",
    titleMy: "အလုပ်နှင့် ရုံး",
    summaryMy: "အလုပ်ခွင်၊ တာဝန်၊ စီးပွားရေး ဝေါဟာရ။",
    sections: [
      {
        id: "t05-s1",
        number: 1,
        titleJa: "職業と勤務",
        titleMy: "အလုပ်အကိုင်နှင့် တာဝန်ထမ်းဆောင်",
        keywords: [
          "work", "job", "occupation", "office", "company", "employee", "boss",
          "colleague", "meeting", "overtime", "resign", "hire", "recruit",
          "career", "duty", "shift", "part-time", "full-time", "unemploy",
        ],
      },
      {
        id: "t05-s2",
        number: 2,
        titleJa: "ビジネス",
        titleMy: "စီးပွားရေး",
        keywords: [
          "business", "commerce", "trade", "industry", "contract", "client",
          "project", "deadline", "report", "document", "copy", "print",
          "conference", "negotiate", "profit", "management", "department",
        ],
      },
    ],
  },
  {
    id: "t06",
    book: "tango",
    number: 6,
    titleJa: "学校と学習",
    titleMy: "ကျောင်းနှင့် သင်ကြားမှု",
    summaryMy: "စာမေးပွဲ၊ ဘာသာရပ်၊ သုတေသန။",
    sections: [
      {
        id: "t06-s1",
        number: 1,
        titleJa: "授業と試験",
        titleMy: "သင်ခန်းစာနှင့် စာမေးပွဲ",
        keywords: [
          "school", "class", "lesson", "teacher", "student", "exam", "test",
          "homework", "study", "learn", "grade", "score", "pass", "fail",
          "university", "lecture", "textbook", "dictionary", "arithmetic",
        ],
      },
      {
        id: "t06-s2",
        number: 2,
        titleJa: "知識と研究",
        titleMy: "ဗဟုသုတနှင့် သုတေသန",
        keywords: [
          "knowledge", "research", "science", "theory", "experiment", "data",
          "analyze", "method", "education", "culture", "history", "language",
          "translate", "memory", "forget", "remember", "understand",
        ],
      },
    ],
  },
  {
    id: "t07",
    book: "tango",
    number: 7,
    titleJa: "人間関係",
    titleMy: "လူမှုဆက်ဆံရေး",
    summaryMy: "မိသားစု၊ သူငယ်ချင်း၊ လူမှုအခန်းကဏ္ဍ။",
    sections: [
      {
        id: "t07-s1",
        number: 1,
        titleJa: "家族と友人",
        titleMy: "မိသားစုနှင့် သူငယ်ချင်း",
        keywords: [
          "family", "parent", "father", "mother", "child", "son", "daughter",
          "brother", "sister", "friend", "marry", "wedding", "couple", "baby",
          "relative", "guest", "host",
        ],
      },
      {
        id: "t07-s2",
        number: 2,
        titleJa: "社会的な関係",
        titleMy: "လူမှုဆက်ဆံမှု",
        keywords: [
          "people", "person", "relationship", "society", "public", "private",
          "polite", "rude", "help", "thanks", "apology", "promise", "trust",
          "cooperate", "conflict", "argue", "introduce", "stranger", "crowd",
        ],
      },
    ],
  },
  {
    id: "t08",
    book: "tango",
    number: 8,
    titleJa: "気持ちと性格",
    titleMy: "ခံစားချက်နှင့် စရိုက်",
    summaryMy: "စိတ်ခံစားမှု၊ သဘောထား၊ ကိုယ်ရည်ကိုယ်သွေး။",
    sections: [
      {
        id: "t08-s1",
        number: 1,
        titleJa: "感情",
        titleMy: "ခံစားချက်",
        keywords: [
          "feel", "emotion", "happy", "sad", "angry", "worry", "afraid", "fear",
          "surprise", "shock", "amaz", "lonely", "bored", "excited", "nervous",
          "relief", "regret", "hope", "wish", "love", "hate", "like",
        ],
      },
      {
        id: "t08-s2",
        number: 2,
        titleJa: "性格と態度",
        titleMy: "စရိုက်နှင့် သဘောထား",
        keywords: [
          "character", "personality", "modest", "humility", "honest", "kind",
          "strict", "lazy", "serious", "gentle", "brave", "selfish", "attitude",
          "patience", "effort", "confidence", "pride", "humble",
        ],
      },
    ],
  },
  {
    id: "t09",
    book: "tango",
    number: 9,
    titleJa: "様子・程度・比較",
    titleMy: "အခြေအနေ၊ အတိုင်းအတာ၊ နှိုင်းယှဉ်",
    summaryMy: "ကြိယာဝိသေသန၊ အတိုင်းအတာ၊ ဆင်တူ/ကွာခြား။",
    sections: [
      {
        id: "t09-s1",
        number: 1,
        titleJa: "様子と程度",
        titleMy: "အခြေအနေနှင့် အတိုင်းအတာ",
        keywords: [
          "relatively", "compar", "quite", "rather", "almost", "completely",
          "slightly", "extremely", "enough", "too", "very", "hardly", "barely",
          "gradually", "suddenly", "immediately", "constantly", "approximately",
          "degree", "level", "condition", "state", "appearance",
        ],
      },
      {
        id: "t09-s2",
        number: 2,
        titleJa: "比較と類似",
        titleMy: "နှိုင်းယှဉ်နှင့် ဆင်တူ",
        keywords: [
          "compare", "similar", "same", "different", "opposite", "equal",
          "average", "majority", "minority", "increase", "decrease", "more",
          "less", "better", "worse", "contrast",
        ],
      },
    ],
  },
  {
    id: "t10",
    book: "tango",
    number: 10,
    titleJa: "時間と変化",
    titleMy: "အချိန်နှင့် ပြောင်းလဲမှု",
    summaryMy: "ကာလ၊ အရှိန်၊ စတင်/ပြီးဆုံး၊ ပြောင်းလဲ။",
    sections: [
      {
        id: "t10-s1",
        number: 1,
        titleJa: "時間・頻度",
        titleMy: "အချိန်နှင့် ကြိမ်နှုန်း",
        keywords: [
          "time", "hour", "minute", "second", "day", "week", "month", "year",
          "season", "period", "duration", "recently", "finally", "soon",
          "already", "yet", "still", "again", "once", "twice", "frequency",
        ],
      },
      {
        id: "t10-s2",
        number: 2,
        titleJa: "変化と進行",
        titleMy: "ပြောင်းလဲမှုနှင့် တိုးတက်မှု",
        keywords: [
          "change", "become", "grow", "develop", "progress", "begin", "start",
          "continue", "finish", "end", "stop", "remain", "maintain", "improve",
          "worsen", "shift", "trend",
        ],
      },
    ],
  },
  {
    id: "t11",
    book: "tango",
    number: 11,
    titleJa: "自然と環境",
    titleMy: "သဘာဝနှင့် ပတ်ဝန်းကျင်",
    summaryMy: "ရာသီဥတု၊ မြေ၊ တိရစ္ဆာန်၊ ပတ်ဝန်းကျင်ပြဿနာ။",
    sections: [
      {
        id: "t11-s1",
        number: 1,
        titleJa: "天候と自然",
        titleMy: "ရာသီဥတုနှင့် သဘာဝ",
        keywords: [
          "weather", "rain", "snow", "wind", "storm", "typhoon", "sun", "cloud",
          "hot", "cold", "temperature", "nature", "mountain", "river", "sea",
          "tree", "flower", "animal", "bird", "insect", "earth", "sky", "field",
          "soil", "plow", "cultivate", "till", "float",
        ],
      },
      {
        id: "t11-s2",
        number: 2,
        titleJa: "環境問題",
        titleMy: "ပတ်ဝန်းကျင်ပြဿနာ",
        keywords: [
          "environment", "pollution", "recycle", "energy", "global", "climate",
          "protect", "destroy", "waste", "garbage", "resource", "forest",
          "oxygen", "carbon", "sustain",
        ],
      },
    ],
  },
  {
    id: "t12",
    book: "tango",
    number: 12,
    titleJa: "社会と政治",
    titleMy: "လူမှုနှင့် နိုင်ငံရေး",
    summaryMy: "အစိုးရ၊ ဥပဒေ၊ သတင်း၊ နိုင်ငံသား။",
    sections: [
      {
        id: "t12-s1",
        number: 1,
        titleJa: "政治と法律",
        titleMy: "နိုင်ငံရေးနှင့် ဥပဒေ",
        keywords: [
          "politics", "government", "law", "legal", "rule", "right", "duty",
          "vote", "election", "party", "nation", "country", "citizen", "tax",
          "police", "crime", "punish", "court", "judge", "policy",
        ],
      },
      {
        id: "t12-s2",
        number: 2,
        titleJa: "報道と公共",
        titleMy: "သတင်းနှင့် အများပြည်သူ",
        keywords: [
          "news", "media", "newspaper", "broadcast", "article", "public",
          "society", "community", "volunteer", "welfare", "population",
          "census", "event", "festival", "ceremony",
        ],
      },
    ],
  },
  {
    id: "t13",
    book: "tango",
    number: 13,
    titleJa: "経済と数字",
    titleMy: "စီးပွားရေးနှင့် ကိန်းဂဏန်း",
    summaryMy: "စျေးကွက်၊ ကိန်း၊ တိုင်းတာ၊ အချိုး။",
    sections: [
      {
        id: "t13-s1",
        number: 1,
        titleJa: "経済",
        titleMy: "စီးပွားရေး",
        keywords: [
          "economy", "economic", "market", "stock", "inflation", "export",
          "import", "consume", "produce", "supply", "demand", "company",
          "corporation", "invest", "bankrupt", "growth",
        ],
      },
      {
        id: "t13-s2",
        number: 2,
        titleJa: "数量と測定",
        titleMy: "အရေအတွက်နှင့် တိုင်းတာ",
        keywords: [
          "number", "amount", "quantity", "measure", "weight", "length",
          "width", "height", "size", "percent", "ratio", "average", "total",
          "count", "calculate", "statistics", "concentration", "density",
          "unit", "figure",
        ],
      },
    ],
  },
  {
    id: "t14",
    book: "tango",
    number: 14,
    titleJa: "科学と技術",
    titleMy: "သိပ္ပံနှင့် နည်းပညာ",
    summaryMy: "စက်၊ အင်တာနက်၊ သုတေသနကိရိယာ။",
    sections: [
      {
        id: "t14-s1",
        number: 1,
        titleJa: "機械とIT",
        titleMy: "စက်နှင့် အိုင်တီ",
        keywords: [
          "machine", "engine", "computer", "program", "internet", "software",
          "device", "tool", "equipment", "electric", "battery", "screen",
          "data", "file", "system", "network", "digital", "robot", "cooler",
          "air conditioner",
        ],
      },
      {
        id: "t14-s2",
        number: 2,
        titleJa: "科学",
        titleMy: "သိပ္ပံ",
        keywords: [
          "science", "physics", "chemistry", "biology", "experiment",
          "laboratory", "element", "material", "metal", "gas", "liquid",
          "solid", "energy", "force", "pressure", "abstract",
        ],
      },
    ],
  },
  {
    id: "t15",
    book: "tango",
    number: 15,
    titleJa: "文化・芸術・娯楽",
    titleMy: "ယဉ်ကျေးမှု၊ အနုပညာ၊ အပန်းဖြေ",
    summaryMy: "ဂီတ၊ ရုပ်ရှင်၊ အားကစား၊ ပွဲတော်။",
    sections: [
      {
        id: "t15-s1",
        number: 1,
        titleJa: "芸術と表現",
        titleMy: "အနုပညာနှင့် ဖော်ပြမှု",
        keywords: [
          "art", "music", "song", "paint", "picture", "photo", "film", "movie",
          "novel", "story", "poem", "theater", "dance", "design", "beauty",
          "color", "sound", "voice", "accent",
        ],
      },
      {
        id: "t15-s2",
        number: 2,
        titleJa: "趣味とスポーツ",
        titleMy: "ဝါသနာနှင့် အားကစား",
        keywords: [
          "hobby", "sport", "game", "play", "team", "match", "win", "lose",
          "practice", "exercise", "leisure", "holiday", "festival", "celebrate",
          "party", "fun", "enjoy",
        ],
      },
    ],
  },
  {
    id: "t16",
    book: "tango",
    number: 16,
    titleJa: "コミュニケーション",
    titleMy: "ဆက်သွယ်ရေး",
    summaryMy: "ပြောဆို၊ ရေးသား၊ တောင်းပန်၊ တောင်းဆို။",
    sections: [
      {
        id: "t16-s1",
        number: 1,
        titleJa: "話す・聞く",
        titleMy: "ပြောနှင့် နားထောင်",
        keywords: [
          "speak", "talk", "say", "tell", "ask", "answer", "listen", "hear",
          "conversation", "discuss", "opinion", "explain", "announce",
          "whisper", "shout", "call", "phone", "which reminds",
        ],
      },
      {
        id: "t16-s2",
        number: 2,
        titleJa: "読む・書く",
        titleMy: "ဖတ်နှင့် ရေး",
        keywords: [
          "read", "write", "letter", "email", "note", "record", "document",
          "sign", "form", "application", "description", "sentence", "word",
          "meaning", "translate", "publish",
        ],
      },
    ],
  },
  {
    id: "t17",
    book: "tango",
    number: 17,
    titleJa: "動作の動詞",
    titleMy: "လုပ်ဆောင်မှု ကြိယာများ",
    summaryMy: "ကိုင်၊ ရွှေ့၊ ထည့်၊ ထုတ် — 自動詞/他動詞 ဇယား။",
    sections: [
      {
        id: "t17-s1",
        number: 1,
        titleJa: "他動詞",
        titleMy: "ကြိယာကံရှိ (他動詞)",
        keywords: [
          "to take", "to put", "to give", "to open", "to close", "to break",
          "to cut", "to make", "to build", "to move", "to raise", "to drop",
          "to throw", "to pull", "to push", "to pick", "to produce", "to prevent",
          "to disturb", "to strengthen", "to intensify", "to reinforce",
        ],
      },
      {
        id: "t17-s2",
        number: 2,
        titleJa: "自動詞",
        titleMy: "ကြိယာကံမဲ့ (自動詞)",
        keywords: [
          "to begin", "to end", "to open", "to close", "to break", "to fall",
          "to rise", "to appear", "to disappear", "to remain", "to happen",
          "to occur", "to float", "to come to mind",
        ],
      },
    ],
  },
  {
    id: "t18",
    book: "tango",
    number: 18,
    titleJa: "思考と判断",
    titleMy: "တွေးခေါ်နှင့် ဆုံးဖြတ်ချက်",
    summaryMy: "ထင်မြင်၊ စဉ်းစား၊ ဆုံးဖြတ်၊ တာဝန်။",
    sections: [
      {
        id: "t18-s1",
        number: 1,
        titleJa: "考える",
        titleMy: "တွေးသည်",
        keywords: [
          "think", "consider", "idea", "plan", "imagine", "guess", "expect",
          "believe", "doubt", "notice", "realize", "remember", "forget",
          "decide", "choice", "judgment", "vague", "ambiguous",
        ],
      },
      {
        id: "t18-s2",
        number: 2,
        titleJa: "責任と義務",
        titleMy: "တာဝန်နှင့် တာဝန်ဝတ္တရား",
        keywords: [
          "responsibility", "duty", "must", "should", "necessary", "need",
          "possible", "impossible", "permission", "forbid", "allow", "refuse",
          "accept", "promise", "rule", "limit",
        ],
      },
    ],
  },
  {
    id: "t19",
    book: "tango",
    number: 19,
    titleJa: "抽象と論理",
    titleMy: "စိတ္တဇနှင့် ယုတ္တိ",
    summaryMy: "အကြောင်းအကျိုး၊ ရည်ရွယ်ချက်၊ အခြေအနေ။",
    sections: [
      {
        id: "t19-s1",
        number: 1,
        titleJa: "原因・目的",
        titleMy: "အကြောင်းရင်းနှင့် ရည်ရွယ်ချက်",
        keywords: [
          "reason", "cause", "because", "therefore", "purpose", "aim", "goal",
          "result", "effect", "influence", "due to", "so that", "in order",
          "success", "failure", "problem", "solution",
        ],
      },
      {
        id: "t19-s2",
        number: 2,
        titleJa: "抽象名詞",
        titleMy: "စိတ္တဇ နာမ်များ",
        keywords: [
          "abstract", "situation", "condition", "case", "fact", "truth",
          "reality", "existence", "value", "meaning", "sense", "way", "method",
          "point", "basis", "standard", "principle", "opportunity",
          "information", "example", "explanation",
        ],
      },
    ],
  },
  {
    id: "t20",
    book: "tango",
    number: 20,
    titleJa: "接続と機能語",
    titleMy: "ချိတ်ဆက်စကားလုံးများ",
    summaryMy: "သို့သော်၊ ထို့ကြောင့်၊ အထူးသဖြင့် — စာကြောင်းချိတ်။",
    sections: [
      {
        id: "t20-s1",
        number: 1,
        titleJa: "接続詞・副詞",
        titleMy: "စကားချိတ်နှင့် ကြိယာဝိသေသန",
        keywords: [
          "however", "but", "although", "therefore", "besides", "especially",
          "finally", "suddenly", "recently", "immediately", "anyway", "besides",
          "moreover", "meanwhile", "otherwise", "for example",
        ],
      },
      {
        id: "t20-s2",
        number: 2,
        titleJa: "その他の語彙",
        titleMy: "အခြား ဝေါဟာရ (N3 ပြန်လည်သုံးသပ် အပါအဝင်)",
        keywords: [],
      },
    ],
  },
]

export const KANJI_MASTER_CHAPTERS: CurriculumChapter[] = [
  {
    id: "k01",
    book: "kanji-master",
    number: 1,
    titleJa: "人と身体",
    titleMy: "လူနှင့် ခန္ဓာကိုယ်",
    summaryMy: "လူ၊ မိသားစု၊ ကိုယ်အင်္ဂါ။",
    radical: "人",
    radicalMy: "လူ",
    sections: [
      {
        id: "k01-s1",
        number: 1,
        titleJa: "人・家族",
        titleMy: "လူနှင့် မိသားစု",
        keywords: [
          "person", "people", "man", "woman", "child", "parent", "family",
          "Mr.", "clan", "party", "faction", "group", "crowd", "self",
        ],
      },
      {
        id: "k01-s2",
        number: 2,
        titleJa: "体",
        titleMy: "ခန္ဓာကိုယ်",
        keywords: [
          "body", "heart", "hand", "foot", "eye", "ear", "mouth", "nose",
          "head", "blood", "bone", "skin", "hair", "breast", "milk", "snout",
        ],
      },
    ],
  },
  {
    id: "k02",
    book: "kanji-master",
    number: 2,
    titleJa: "心と感覚",
    titleMy: "စိတ်နှင့် အာရုံ",
    summaryMy: "ခံစားချက်၊ သဘောထား၊ သိမြင်မှု။",
    radical: "心",
    radicalMy: "စိတ်",
    sections: [
      {
        id: "k02-s1",
        number: 1,
        titleJa: "感情",
        titleMy: "ခံစားချက်",
        keywords: [
          "feel", "emotion", "love", "hate", "fear", "sad", "happy", "anger",
          "worry", "hope", "desire", "kind", "thick", "heavy", "rich",
        ],
      },
      {
        id: "k02-s2",
        number: 2,
        titleJa: "思考",
        titleMy: "တွေးခေါ်မှု",
        keywords: [
          "think", "mind", "idea", "know", "memory", "forget", "consider",
          "intention", "will", "belief", "doubt", "agreement", "consent",
        ],
      },
    ],
  },
  {
    id: "k03",
    book: "kanji-master",
    number: 3,
    titleJa: "動きと手",
    titleMy: "လှုပ်ရှားမှုနှင့် လက်",
    summaryMy: "ကိုင်၊ ရွှေ့၊ ထုတ်၊ တည်ဆောက်။",
    radical: "扌",
    radicalMy: "လက်",
    sections: [
      {
        id: "k03-s1",
        number: 1,
        titleJa: "動作",
        titleMy: "လုပ်ဆောင်မှု",
        keywords: [
          "move", "go", "come", "run", "walk", "stop", "stand", "sit", "enter",
          "leave", "return", "send", "take", "give", "put", "hold",
        ],
      },
      {
        id: "k03-s2",
        number: 2,
        titleJa: "作業",
        titleMy: "အလုပ်လုပ်ခြင်း",
        keywords: [
          "make", "build", "cut", "break", "open", "close", "pull", "push",
          "raise", "drop", "gather", "recruit", "campaign", "enlist",
        ],
      },
    ],
  },
  {
    id: "k04",
    book: "kanji-master",
    number: 4,
    titleJa: "自然と天候",
    titleMy: "သဘာဝနှင့် ရာသီဥတု",
    summaryMy: "တောင်၊ မြစ်၊ မိုး၊ လေ။",
    radical: "雨",
    radicalMy: "မိုး",
    sections: [
      {
        id: "k04-s1",
        number: 1,
        titleJa: "大地",
        titleMy: "မြေကြီး",
        keywords: [
          "earth", "land", "mountain", "hill", "slope", "incline", "river",
          "sea", "island", "field", "stone", "rock", "sand", "forest", "tree",
        ],
      },
      {
        id: "k04-s2",
        number: 2,
        titleJa: "天と気象",
        titleMy: "ကောင်းကင်နှင့် ရာသီဥတု",
        keywords: [
          "sky", "sun", "moon", "star", "rain", "snow", "wind", "cloud",
          "storm", "weather", "hot", "cold", "fire", "ice",
        ],
      },
    ],
  },
  {
    id: "k05",
    book: "kanji-master",
    number: 5,
    titleJa: "水・火・物質",
    titleMy: "ရေ၊ မီး၊ ပစ္စည်း",
    summaryMy: "သတ္တု၊ အရည်၊ လောင်ကျွမ်း။",
    radical: "金",
    radicalMy: "သတ္တု",
    sections: [
      {
        id: "k05-s1",
        number: 1,
        titleJa: "水と火",
        titleMy: "ရေနှင့် မီး",
        keywords: [
          "water", "oil", "steam", "boil", "wash", "wet", "dry", "fire",
          "burn", "heat", "light", "lamp",
        ],
      },
      {
        id: "k05-s2",
        number: 2,
        titleJa: "金属と物質",
        titleMy: "သတ္တုနှင့် ပစ္စည်း",
        keywords: [
          "metal", "gold", "silver", "copper", "iron", "mineral", "ore",
          "steel", "material", "substance", "gas", "liquid",
        ],
      },
    ],
  },
  {
    id: "k06",
    book: "kanji-master",
    number: 6,
    titleJa: "時間と方位",
    titleMy: "အချိန်နှင့် ဦးတည်ရာ",
    summaryMy: "နှစ်၊ ရာသီ၊ အရှေ့အနောက်။",
    radical: "日",
    radicalMy: "နေ/နေ့",
    sections: [
      {
        id: "k06-s1",
        number: 1,
        titleJa: "時間",
        titleMy: "အချိန်",
        keywords: [
          "time", "day", "month", "year", "week", "hour", "era", "season",
          "now", "old", "new", "early", "late", "past", "future",
        ],
      },
      {
        id: "k06-s2",
        number: 2,
        titleJa: "位置と方向",
        titleMy: "တည်နေရာနှင့် ဦးတည်ရာ",
        keywords: [
          "place", "position", "direction", "east", "west", "north", "south",
          "left", "right", "up", "down", "front", "back", "side", "center",
          "lean", "tilt", "trend", "level", "average",
        ],
      },
    ],
  },
  {
    id: "k07",
    book: "kanji-master",
    number: 7,
    titleJa: "建物と場所",
    titleMy: "အဆောက်အအုံနှင့် နေရာ",
    summaryMy: "အိမ်၊ မြို့၊ တံတား၊ နန်းတော်။",
    radical: "广",
    radicalMy: "အိမ်မိုး",
    sections: [
      {
        id: "k07-s1",
        number: 1,
        titleJa: "建物",
        titleMy: "အဆောက်အအုံ",
        keywords: [
          "house", "building", "store", "shop", "school", "hospital", "temple",
          "station", "bridge", "gate", "wall", "room", "hall", "mansion",
          "palace", "ticket",
        ],
      },
      {
        id: "k07-s2",
        number: 2,
        titleJa: "都市と土地",
        titleMy: "မြို့နှင့် မြေ",
        keywords: [
          "city", "town", "village", "capital", "country", "province", "road",
          "street", "park", "port", "farm", "land",
        ],
      },
    ],
  },
  {
    id: "k08",
    book: "kanji-master",
    number: 8,
    titleJa: "社会と政治",
    titleMy: "လူမှုနှင့် နိုင်ငံရေး",
    summaryMy: "နိုင်ငံ၊ ဥပဒေ၊ အခွန်၊ ပါတီ။",
    radical: "言",
    radicalMy: "စကား",
    sections: [
      {
        id: "k08-s1",
        number: 1,
        titleJa: "政治",
        titleMy: "နိုင်ငံရေး",
        keywords: [
          "politics", "government", "nation", "country", "law", "tax", "duty",
          "party", "vote", "official", "public", "war", "army", "soldier",
        ],
      },
      {
        id: "k08-s2",
        number: 2,
        titleJa: "制度",
        titleMy: "စနစ်",
        keywords: [
          "system", "rule", "order", "organization", "company", "office",
          "duty", "right", "role", "semi-", "correspond", "proportionate",
          "conform",
        ],
      },
    ],
  },
  {
    id: "k09",
    book: "kanji-master",
    number: 9,
    titleJa: "経済と仕事",
    titleMy: "စီးပွားရေးနှင့် အလုပ်",
    summaryMy: "ငွေ၊ ကုန်သွယ်၊ အခွန်၊ အလုပ်။",
    radical: "貝",
    radicalMy: "ခရုခွံ/တန်ဖိုး",
    sections: [
      {
        id: "k09-s1",
        number: 1,
        titleJa: "金銭",
        titleMy: "ငွေကြေး",
        keywords: [
          "money", "gold", "buy", "sell", "price", "cheap", "expensive",
          "profit", "loss", "tax", "fee", "pay", "wealth", "poor",
        ],
      },
      {
        id: "k09-s2",
        number: 2,
        titleJa: "労働",
        titleMy: "အလုပ်သမား",
        keywords: [
          "work", "labor", "job", "business", "industry", "farm", "produce",
          "product", "tool", "skill", "specialty", "exclusive", "mainly",
          "solely",
        ],
      },
    ],
  },
  {
    id: "k10",
    book: "kanji-master",
    number: 10,
    titleJa: "言語と知識",
    titleMy: "ဘာသာစကားနှင့် ဗဟုသုတ",
    summaryMy: "စာ၊ စကား၊ သင်ကြား၊ စာမေးပွဲ။",
    radical: "文",
    radicalMy: "စာ",
    sections: [
      {
        id: "k10-s1",
        number: 1,
        titleJa: "言葉",
        titleMy: "စကားလုံး",
        keywords: [
          "word", "language", "speak", "say", "read", "write", "letter",
          "book", "story", "name", "character", "sentence",
        ],
      },
      {
        id: "k10-s2",
        number: 2,
        titleJa: "学習",
        titleMy: "သင်ကြားမှု",
        keywords: [
          "learn", "study", "teach", "school", "exam", "question", "answer",
          "research", "knowledge", "wisdom", "culture",
        ],
      },
    ],
  },
  {
    id: "k11",
    book: "kanji-master",
    number: 11,
    titleJa: "力と争",
    titleMy: "အားနှင့် ပဋိပက္ခ",
    summaryMy: "စစ်၊ အား၊ အနိုင်၊ ကာကွယ်။",
    radical: "力",
    radicalMy: "အား",
    sections: [
      {
        id: "k11-s1",
        number: 1,
        titleJa: "力",
        titleMy: "အား",
        keywords: [
          "power", "force", "strong", "weak", "win", "lose", "fight", "attack",
          "defend", "protect", "danger", "safe",
        ],
      },
      {
        id: "k11-s2",
        number: 2,
        titleJa: "争い",
        titleMy: "ပဋိပက္ခ",
        keywords: [
          "war", "battle", "soldier", "army", "weapon", "peace", "crime",
          "punish", "judge", "prison",
        ],
      },
    ],
  },
  {
    id: "k12",
    book: "kanji-master",
    number: 12,
    titleJa: "形・色・量",
    titleMy: "ပုံသဏ္ဌာန်၊ အရောင်၊ ပမာဏ",
    summaryMy: "အရွယ်၊ အရောင်၊ အရေအတွက်။",
    radical: "糸",
    radicalMy: "ချည်",
    sections: [
      {
        id: "k12-s1",
        number: 1,
        titleJa: "形と色",
        titleMy: "ပုံနှင့် အရောင်",
        keywords: [
          "shape", "form", "round", "square", "long", "short", "wide", "narrow",
          "thick", "thin", "color", "red", "blue", "white", "black", "attire",
          "dress", "pretend", "disguise",
        ],
      },
      {
        id: "k12-s2",
        number: 2,
        titleJa: "数量",
        titleMy: "အရေအတွက်",
        keywords: [
          "number", "count", "many", "few", "all", "half", "double", "equal",
          "measure", "amount", "unit", "flock", "group", "herd",
        ],
      },
    ],
  },
  {
    id: "k13",
    book: "kanji-master",
    number: 13,
    titleJa: "衣食住",
    titleMy: "အဝတ်၊ အစား၊ နေထိုင်",
    summaryMy: "အစား၊ အဝတ်၊ နေ့စဉ်သုံးပစ္စည်း။",
    radical: "食",
    radicalMy: "စား",
    sections: [
      {
        id: "k13-s1",
        number: 1,
        titleJa: "食",
        titleMy: "အစားအသောက်",
        keywords: [
          "eat", "food", "rice", "drink", "taste", "cook", "meal", "fish",
          "meat", "vegetable", "fruit", "salt", "sugar",
        ],
      },
      {
        id: "k13-s2",
        number: 2,
        titleJa: "衣と道具",
        titleMy: "အဝတ်နှင့် ကိရိယာ",
        keywords: [
          "clothes", "wear", "cloth", "thread", "bag", "box", "tool", "paper",
          "furniture", "bed", "table", "vehicle", "car", "ship",
        ],
      },
    ],
  },
  {
    id: "k14",
    book: "kanji-master",
    number: 14,
    titleJa: "医療と生命",
    titleMy: "ဆေးကုသမှုနှင့် အသက်",
    summaryMy: "ရောဂါ၊ ဆေး၊ အသက်၊ သေ။",
    radical: "疒",
    radicalMy: "ရောဂါ",
    sections: [
      {
        id: "k14-s1",
        number: 1,
        titleJa: "病気",
        titleMy: "ရောဂါ",
        keywords: [
          "sick", "ill", "disease", "pain", "hurt", "medicine", "doctor",
          "hospital", "heal", "dead", "life", "live", "birth", "age",
        ],
      },
      {
        id: "k14-s2",
        number: 2,
        titleJa: "生物",
        titleMy: "သက်ရှိ",
        keywords: [
          "animal", "bird", "fish", "insect", "plant", "flower", "grass",
          "tree", "horse", "cow", "dog", "cat",
        ],
      },
    ],
  },
  {
    id: "k15",
    book: "kanji-master",
    number: 15,
    titleJa: "儀式と文化",
    titleMy: "အခမ်းအနားနှင့် ယဉ်ကျေးမှု",
    summaryMy: "ပွဲတော်၊ ဘာသာ၊ အနုပညာ။",
    radical: "示",
    radicalMy: "ပြသ",
    sections: [
      {
        id: "k15-s1",
        number: 1,
        titleJa: "祭と礼",
        titleMy: "ပွဲတော်နှင့် ယဉ်ကျေးမှု",
        keywords: [
          "ritual", "festival", "celebrate", "pray", "god", "temple", "offer",
          "ceremony", "polite", "etiquette", "deify",
        ],
      },
      {
        id: "k15-s2",
        number: 2,
        titleJa: "芸術",
        titleMy: "အနုပညာ",
        keywords: [
          "art", "music", "song", "paint", "picture", "beauty", "dance",
          "play", "drama", "poem",
        ],
      },
    ],
  },
  {
    id: "k16",
    book: "kanji-master",
    number: 16,
    titleJa: "抽象と難漢字",
    titleMy: "စိတ္တဇနှင့် ခက်သော ခန်ဂျိ",
    summaryMy: "ကျန်ရှိ N2 ခန်ဂျိ၊ စိတ္တဇ အဓိပ္ပာယ်များ။",
    radical: "心",
    radicalMy: "စိတ်",
    sections: [
      {
        id: "k16-s1",
        number: 1,
        titleJa: "抽象概念",
        titleMy: "စိတ္တဇ အယူအဆ",
        keywords: [
          "abstract", "true", "false", "good", "bad", "same", "different",
          "special", "common", "important", "necessary", "possible",
        ],
      },
      {
        id: "k16-s2",
        number: 2,
        titleJa: "その他",
        titleMy: "အခြား N2 ခန်ဂျိ",
        keywords: [],
      },
    ],
  },
]

export function tangoChapter(id: string) {
  return TANGO_CHAPTERS.find((chapter) => chapter.id === id) ?? null
}

export function kanjiMasterChapter(id: string) {
  return KANJI_MASTER_CHAPTERS.find((chapter) => chapter.id === id) ?? null
}

export function findSection(chapters: CurriculumChapter[], sectionId: string) {
  for (const chapter of chapters) {
    const section = chapter.sections.find((item) => item.id === sectionId)
    if (section) return { chapter, section }
  }
  return null
}
