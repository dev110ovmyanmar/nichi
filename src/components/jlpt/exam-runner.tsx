"use client"

import { useMemo, useState } from "react"
import { GRAMMAR } from "@/data/grammar"
import { LISTENING } from "@/data/listening"
import { READINGS } from "@/data/reading"
import { Button } from "@/components/ui/button"
import { ClickPassage } from "@/components/jlpt/click-passage"
import { ListeningCard } from "@/components/jlpt/listening-card"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"
import { passedN2, scaleSection } from "@/lib/jlpt/progress"
import { cn } from "@/lib/utils"

type Phase = "intro" | "language" | "reading" | "listening" | "result"

const LANGUAGE = GRAMMAR.slice(0, 12).map((item, index) => ({
  id: item.id,
  prompt: `${item.pattern} ၏ အဓိပ္ပာယ်နှင့် ကိုက်သော ဝါကျ`,
  choices: item.examples.map((example) => example.ja).concat(
    GRAMMAR[(index + 3) % GRAMMAR.length].examples[0].ja
  ).slice(0, 3),
  answer: item.examples[0].ja,
}))

export function ExamRunner() {
  const { recordQuiz } = useJlptProgress()
  const [phase, setPhase] = useState<Phase>("intro")
  const [langIndex, setLangIndex] = useState(0)
  const [langCorrect, setLangCorrect] = useState(0)
  const [readIndex, setReadIndex] = useState(0)
  const [readCorrect, setReadCorrect] = useState(0)
  const [listenCorrect, setListenCorrect] = useState(0)
  const [listenDone, setListenDone] = useState(0)
  const readingSet = useMemo(() => READINGS.slice(0, 4), [])
  const listeningSet = useMemo(() => LISTENING.slice(0, 6), [])

  const languageScore = scaleSection(langCorrect, LANGUAGE.length)
  const readingScore = scaleSection(readCorrect, readingSet.length)
  const listeningScore = scaleSection(listenCorrect, listeningSet.length)
  const overall = languageScore + readingScore + listeningScore
  const pass = passedN2(languageScore, readingScore, listeningScore)

  if (phase === "intro") {
    return (
      <div className="grid gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/8">
        <p className="my-script text-sm leading-relaxed">
          အစစ်အမှန် N2 ပုံစံ — 言語知識・読解 ၁၀၅ မိနစ်၊ 聴解 ၅၀ မိနစ်။ ဤ simulator တွင် မေးခွန်းအရေအတွက် လျှော့ထားသော်လည်း အမှတ်ကို ၆၀/၆၀/၆၀ (စု ၁၈၀) သို့ စကေးချပြီး ဖြတ်မှတ် ၉၀ နှင့် ကဏ္ဍ ၁၉ ဖြင့် တိုင်းသည်။
        </p>
        <ul className="my-script grid gap-1 text-sm text-muted-foreground">
          <li>言語知識 · {LANGUAGE.length} ပုဒ်</li>
          <li>読解 · {readingSet.length} ပိုဒ်</li>
          <li>聴解 · {listeningSet.length} ပုဒ်</li>
        </ul>
        <Button className="h-12 rounded-2xl" onClick={() => setPhase("language")}>
          စတင်ရန်
        </Button>
      </div>
    )
  }

  if (phase === "language") {
    const item = LANGUAGE[langIndex]
    return (
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          言語知識 {langIndex + 1}/{LANGUAGE.length}
        </p>
        <h2 className="font-heading text-xl font-semibold">{item.prompt}</h2>
        <div className="grid gap-2">
          {item.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className="rounded-2xl bg-card px-3 py-3 text-left ring-1 ring-foreground/10"
              onClick={() => {
                const correct = choice === item.answer
                const next = langCorrect + (correct ? 1 : 0)
                if (langIndex + 1 >= LANGUAGE.length) {
                  setLangCorrect(next)
                  setPhase("reading")
                } else {
                  setLangCorrect(next)
                  setLangIndex(langIndex + 1)
                }
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === "reading") {
    const passage = readingSet[readIndex]
    return (
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          読解 {readIndex + 1}/{readingSet.length}
        </p>
        <h2 className="font-heading text-xl font-semibold">{passage.title}</h2>
        <ClickPassage body={passage.body} vocab={passage.vocab} />
        <p className="font-medium">{passage.question}</p>
        {passage.choices.map((choice, index) => (
          <button
            key={choice}
            type="button"
            className="rounded-2xl bg-card px-3 py-3 text-left ring-1 ring-foreground/10"
            onClick={() => {
              const next = readCorrect + (index === passage.answerIndex ? 1 : 0)
              if (readIndex + 1 >= readingSet.length) {
                setReadCorrect(next)
                setPhase("listening")
              } else {
                setReadCorrect(next)
                setReadIndex(readIndex + 1)
              }
            }}
          >
            {choice}
          </button>
        ))}
      </div>
    )
  }

  if (phase === "listening") {
    const item = listeningSet[listenDone] ?? listeningSet[0]
    return (
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          聴解 {Math.min(listenDone + 1, listeningSet.length)}/{listeningSet.length}
        </p>
        <ListeningCard
          key={item.id}
          item={item}
          onScored={(correct) => {
            const nextCorrect = listenCorrect + (correct ? 1 : 0)
            const nextDone = listenDone + 1
            setListenCorrect(nextCorrect)
            setListenDone(nextDone)
            if (nextDone >= listeningSet.length) {
              recordQuiz("exam", scaleSection(langCorrect, LANGUAGE.length) + scaleSection(readCorrect, readingSet.length) + scaleSection(nextCorrect, listeningSet.length), 180)
              setPhase("result")
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="grid gap-4 rounded-3xl bg-card p-5 text-center ring-1 ring-foreground/8">
      <p className={cn("font-heading text-4xl font-semibold", pass ? "text-primary" : "text-destructive")}>
        {pass ? "合格" : "不合格"}
      </p>
      <p className="font-heading text-2xl tabular-nums">{overall} / 180</p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <ScoreCell label="言語知識" value={languageScore} />
        <ScoreCell label="読解" value={readingScore} />
        <ScoreCell label="聴解" value={listeningScore} />
      </div>
      <p className="my-script text-sm text-muted-foreground">
        ဖြတ်မှတ်: စုစုပေါင်း ၉၀ နှင့် ကဏ္ဍစီ ၁၉ အထက်။
      </p>
      <Button onClick={() => window.location.reload()}>ထပ်ဖြေရန်</Button>
    </div>
  )
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-muted/50 px-2 py-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-heading text-lg font-semibold tabular-nums">{value}/60</p>
    </div>
  )
}
