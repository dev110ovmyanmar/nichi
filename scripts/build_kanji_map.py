"""Place each N2 kanji on a 総まとめ scene day by KANJIDIC2 meaning.

Does not copy Ask Publishing lists. Caps each study day so leftovers are
not dumped into week 8."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
items = json.loads((ROOT / "public/data/kanji.json").read_text())
OUT = ROOT / "src/data/soumatome-kanji-map.ts"

# Seed characters that clearly belong on a scene day.
SEEDS: list[tuple[str, str]] = [
    ("k01-d1", "禁停駐令則符印札"),
    ("k01-d2", "階門戸層床隅奥央"),
    ("k01-d3", "設築柱塔城殿宇造"),
    ("k01-d4", "線券改橋陸延順各"),
    ("k01-d5", "輸航鉄輪舟隻荷泊"),
    ("k01-d6", "郵療患胃臓血毒届"),
    ("k02-d1", "械販換個枚片双包"),
    ("k02-d2", "預貯貨替億倍均算"),
    ("k02-d3", "缶瓶液喫菓溶沸蒸"),
    ("k02-d4", "灯針筒圧乾湿凍燃"),
    ("k02-d5", "接触召叫絡伸傾"),
    ("k02-d6", "録編複版刷刊捜棒"),
    ("k03-d1", "税額領再翌承封"),
    ("k03-d2", "跡裏底辺囲郊坂"),
    ("k03-d3", "袋濯衣帽布糸綿"),
    ("k03-d4", "汚捨掃灰枯燥埋"),
    ("k03-d5", "希依紹効了略復"),
    ("k03-d6", "簡副旧省庁署"),
    ("k04-d1", "姓籍巻歴筆著誌"),
    ("k04-d2", "敬拝伺贈署"),
    ("k04-d3", "章詞述簡"),
    ("k04-d4", "敬拝"),
    ("k04-d5", "課採卒訓"),
    ("k04-d6", "章詞述"),
    ("k05-d1", "湯焼氷炭"),
    ("k05-d2", "皿帽畳机"),
    ("k05-d3", "粉磨"),
    ("k05-d4", "悩肌膚汗涙乳"),
    ("k05-d5", "塩油粉卵菜麦甘辛"),
    ("k05-d6", "濃薄脂粒浴泉涼滴"),
    ("k06-d1", "賞祭"),
    ("k06-d2", "営"),
    ("k06-d3", "祝踊劇芸像"),
    ("k06-d4", "谷森林岸湾湖河島"),
    ("k06-d5", "仏宝"),
    ("k06-d6", "比均超並競"),
    ("k07-d1", "募雇採講"),
    ("k07-d2", "庁署区村"),
    ("k07-d3", "含材"),
    ("k07-d4", "童幼"),
    ("k07-d5", "損爆乱暴"),
    ("k07-d6", "雲曇震涼波"),
    ("k08-d1", "党軍勢減増"),
    ("k08-d2", "協総府県査委"),
    ("k08-d3", "革域境導欧"),
    ("k08-d4", "農貿鉱営暴乱"),
    ("k08-d5", "税経環防補"),
    ("k08-d6", "科学宇星技"),
]

THEMES: dict[str, str] = {
    "k01-d1": "prohibition ban forbid halt stopping park reside decree orders laws rule seal stamp tag placard token sign warning",
    "k01-d2": "storey stair floor door gate corner nook interior heart center middle layer story eaves tatami desk table bed flats",
    "k01-d3": "establishment build construct pillar pagoda tower castle mansion palace eaves roof house enclose surround paint",
    "k01-d4": "line track ticket reformation change bridge land delay schedule each every order turn station",
    "k01-d5": "transport navigate sail iron wheel boat ship vessel baggage freight overnight ride vehicle",
    "k01-d6": "mail hospital heal cure disease ill stomach viscera blood poison deliver report nurse medicine",
    "k02-d1": "machine instrument marketing sell interchange individual sheet pair wrap pack ticket",
    "k02-d2": "deposit savings freight goods exchange hundred million double average calculate money bank",
    "k02-d3": "can bottle liquid consume eat drink candy melt boil steam juice vending",
    "k02-d4": "lamp light needle pipe pressure dry damp frozen burn heat remote switch",
    "k02-d5": "touch contact call shout entwine expand lean phone hold",
    "k02-d6": "record compile duplicate printing print search rod computer file screen",
    "k03-d1": "tax amount jurisdiction again following next seal closing bill fee transfer",
    "k03-d2": "tracks back reverse bottom vicinity outskirts suburbs slope absent away",
    "k03-d3": "sack bag laundry garment cap linen cloth thread cotton keep receipt coupon",
    "k03-d4": "dirty pollute discard sweep ashes wither parch bury garbage waste recycle burn",
    "k03-d5": "hope request introduce merit complete abbreviation restore notice confirm",
    "k03-d6": "simplicity vice former ministry government office signature police valid expire",
    "k04-d1": "surname enroll register scroll volume history curriculum write document records form apply",
    "k04-d2": "certificate resume prove identity copy respect pray present award signature",
    "k04-d3": "badge chapter composition words poetry mention state mail postcard letter",
    "k04-d4": "business company regard attach meeting please contact respect pray visit",
    "k04-d5": "chapter lesson exam answer score grade test question graduate instruction",
    "k04-d6": "essay compose opinion reason example conclude write composition poem",
    "k05-d1": "hot water bath bake ice charcoal fire heat boil steam warm",
    "k05-d2": "dish plate cap tatami desk table furniture tool box home",
    "k05-d3": "flour powder grind polish wash soap clean laundry dirt stain",
    "k05-d4": "worry pain skin sweat tears milk medicine sick symptom heal dose",
    "k05-d5": "salt oil egg vegetable wheat sweet spicy food taste fresh ingredient sugar meat fish rice",
    "k05-d6": "concentrated dilute fat grains bathe spring cool drip button intercom",
    "k06-d1": "prize reward sale discount special free limited advertisement flyer",
    "k06-d2": "camp conduct business shop store open closed floor guide bargain",
    "k06-d3": "celebrate dance drama play technique art statue event festival hold join",
    "k06-d4": "valley forest woods beach gulf lake river island map north south east west slope hill",
    "k06-d5": "buddha treasure temple exhibit museum culture history ritual",
    "k06-d6": "compare average transcend row equal emulate compete choice same different",
    "k07-d1": "recruit hire employ lecture apply job salary work staff want campaign",
    "k07-d2": "government office police ward village town community local newspaper region",
    "k07-d3": "contain lumber ingredients menu calorie allergy taste",
    "k07-d4": "juvenile infancy childhood exam entrance school test pass fail",
    "k07-d5": "damage bomb riot war disorder traffic accident delay closed route",
    "k07-d6": "cloud cloudy quake cool waves weather rain snow wind storm typhoon temperature",
    "k08-d1": "party faction news breaking report urgent update now",
    "k08-d2": "cooperation general prefecture investigate committee headline title increase decrease record",
    "k08-d3": "reform range boundary guidance europe agree oppose plan decide start end",
    "k08-d4": "society public government law crime police right citizen army force troops",
    "k08-d5": "economy company market environment earth protect pollution energy tax agriculture trade",
    "k08-d6": "science space world nation develop technology research international star",
}

DAYS = [f"k{w:02d}-d{d}" for w in range(1, 9) for d in range(1, 7)]
CAP = 9
char_set = {item["character"] for item in items}

ASSIGN: dict[str, str] = {}
counts: Counter[str] = Counter()


def put(day: str, ch: str) -> bool:
    if ch not in char_set or ch in ASSIGN:
        return False
    if counts[day] >= CAP:
        return False
    ASSIGN[ch] = day
    counts[day] += 1
    return True


for day, text in SEEDS:
    for ch in text:
        put(day, ch)


def score(item: dict, day: str) -> int:
    theme = THEMES[day]
    total = 0
    for meaning in item["meanings"]:
        for word in re.findall(r"[a-zA-Z]+", meaning.lower()):
            if len(word) < 3:
                continue
            if word in theme:
                total += 3 if len(word) >= 6 else 2
    return total


unassigned = [item for item in items if item["character"] not in ASSIGN]
unassigned.sort(key=lambda item: -(item.get("freq") or 9999))

for item in unassigned:
    ranked = sorted(
        DAYS,
        key=lambda day: (-score(item, day), counts[day], day),
    )
    placed = False
    for day in ranked:
        if put(day, item["character"]):
            placed = True
            break
    if not placed:
        # Raise cap for leftover only after every day is full.
        day = min(DAYS, key=lambda d: (counts[d], d))
        ASSIGN[item["character"]] = day
        counts[day] += 1

assert len(ASSIGN) == len(items)

print("per-day counts:")
for week in range(1, 9):
    wid = f"k{week:02d}"
    parts = [f"d{d}:{counts[f'{wid}-d{d}']}" for d in range(1, 7)]
    print(f"  {wid}", " ".join(parts), "total", sum(counts[f"{wid}-d{d}"] for d in range(1, 7)))

lines = [
    "/** Scene-day map for OpenJLPT N2 kanji (KANJIDIC2 meanings). Not textbook text. */",
    "export const SOUMATOME_KANJI_DAY: Record<string, string> = {",
]
for item in items:
    ch = item["character"]
    lines.append(f"  {json.dumps(ch, ensure_ascii=False)}: {json.dumps(ASSIGN[ch])},")
lines.append("}")
lines.append("")
OUT.write_text("\n".join(lines), encoding="utf-8")
print("wrote", OUT)
