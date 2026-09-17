"use client"

import { use } from "react"
import { LISTENING } from "@/data/listening"
import { ModuleHero } from "@/components/jlpt/module-hero"
import { ListeningCard } from "@/components/jlpt/listening-card"
import { useJlptProgress } from "@/hooks/use-jlpt-progress"

export default function ListeningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const item = LISTENING.find((entry) => entry.id === id)
  const { recordQuiz } = useJlptProgress()

  if (!item) return <p>မတွေ့ပါ။</p>

  return (
    <div>
      <ModuleHero
        backHref="/listening"
        kicker="聴解"
        title={item.sectionJa}
        description={item.promptMy}
      />
      <ListeningCard
        item={item}
        onScored={(correct) => recordQuiz("listening", correct ? 1 : 0, 1)}
      />
    </div>
  )
}
