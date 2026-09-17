"use client"

import Link from "next/link"
import {
  BookOpen,
  GraduationCap,
  Headphones,
  Languages,
  NotebookPen,
  PenLine,
  SpellCheck2,
} from "lucide-react"
import { ExamCountdown } from "@/components/exam-countdown"
import { GRAMMAR } from "@/data/grammar"
import { LISTENING } from "@/data/listening"
import { READINGS } from "@/data/reading"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { useStudyStore } from "@/hooks/use-study-store"
import { currentStreak, minutesOnDate } from "@/lib/stats"
import { todayISO } from "@/lib/dates"
import { formatDuration } from "@/lib/stats"

const MODULES = [
  {
    href: "/vocab",
    title: "語彙 · 総まとめ N2",
    my: "၈ပတ် × ၇ရက် · 品詞၊ ဥပမာ၊ 実戦問題",
    icon: Languages,
    detail: "N2 ၁,၇၉၃ + N3 · Ask Publishing ပုံစံ",
  },
  {
    href: "/kanji",
    title: "漢字 · 総まとめ N2",
    my: "၈ပတ် × ၇ရက် · စုတ်ချက်၊ 熟語၊ 実戦問題",
    icon: SpellCheck2,
    detail: "N2 ၃၆၇ လုံး · Ask Publishing ပုံစံ",
  },
  {
    href: "/grammar",
    title: "文法",
    my: "သဒ္ဒါ ကိုးကား + 星問題",
    icon: BookOpen,
    detail: `${GRAMMAR.length} ပုံစံ`,
  },
  {
    href: "/reading",
    title: "読解",
    my: "短文မှ 情報検索",
    icon: PenLine,
    detail: `${READINGS.length} ပိုဒ်`,
  },
  {
    href: "/listening",
    title: "聴解",
    my: "၅ ပိုင်း · အမြန်နှုန်း 0.8–1.2x",
    icon: Headphones,
    detail: `${LISTENING.length} ပုဒ်`,
  },
  {
    href: "/exam",
    title: "模擬試験",
    my: "အချိန်တွက် · ဖြတ်မှတ် ၉၀/၁၈၀",
    icon: GraduationCap,
    detail: "言語・読解・聴解",
  },
  {
    href: "/journal",
    title: "Study log",
    my: "နေ့စဉ် မှတ်တမ်း၊ streak၊ Pomodoro",
    icon: NotebookPen,
    detail: "localStorage",
  },
]

export default function HomePage() {
  const { logs, settings } = useStudyStore()
  const { progress } = useJlptProgress()
  const today = todayISO()
  const streak = currentStreak(logs, today)
  const todayMinutes = minutesOnDate(logs, today)
  const lastQuiz = progress.quizHistory[0]

  return (
    <div className="grid gap-5">
      <section>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          JLPT N2 · မြန်မာ
        </p>
        <h1 className="font-heading mt-1 max-w-xl text-[1.8rem] leading-tight font-semibold tracking-tight">
          ကျက်၊ နားထောင်၊ ဖြေ။ စာမေးပွဲနေ့အထိ။
        </h1>
        <p className="my-script mt-2 max-w-xl text-sm text-muted-foreground">
          ဝေါဟာရ၊ ခန်ဂျိ၊ သဒ္ဒါ၊ ဖတ်ရှု၊ နားထောင်၊ အစမ်းစာမေးပွဲ — မြန်မာလို ရှင်းချက်နှင့်။
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="font-heading mt-1 text-2xl font-semibold tabular-nums">
            {streak} ရက်
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ဒီနေ့ {formatDuration(todayMinutes)}
          </p>
        </div>
        <ExamCountdown examName={settings.examName} examDate={settings.examDate} />
        <div className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
          <p className="text-xs text-muted-foreground">စာညှပ်</p>
          <p className="font-heading mt-1 text-2xl font-semibold tabular-nums">
            {progress.bookmarks.vocab.length +
              progress.bookmarks.kanji.length +
              progress.bookmarks.grammar.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {lastQuiz
              ? `နောက်ဆုံး quiz ${lastQuiz.score}/${lastQuiz.total}`
              : "quiz မလုပ်ရသေး"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-3 rounded-3xl bg-card p-4 ring-1 ring-foreground/8"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <item.icon className="size-5" />
            </span>
            <span>
              <span className="block font-heading text-lg font-semibold">{item.title}</span>
              <span className="my-script mt-0.5 block text-sm text-muted-foreground">
                {item.my}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {item.detail}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
