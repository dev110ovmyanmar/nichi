import { RubyWord } from "@/components/jlpt/ruby-word"

export function FuriganaSentence({
  ja,
  word,
  reading,
}: {
  ja: string
  word?: string
  reading?: string
}) {
  if (!word || !reading || !ja.includes(word)) {
    return <span className="leading-8">{ja}</span>
  }
  const index = ja.indexOf(word)
  return (
    <span className="leading-8">
      {ja.slice(0, index)}
      <RubyWord word={word} reading={reading} />
      {ja.slice(index + word.length)}
    </span>
  )
}

export function PosTags({
  pos,
  transitivity,
  level,
}: {
  pos?: string
  transitivity?: "vi" | "vt" | "both" | null
  level?: string
}) {
  return (
    <div className="flex flex-wrap gap-1.5 text-[11px]">
      {pos ? <span className="rounded-full bg-muted px-2 py-0.5">{pos}</span> : null}
      {level ? <span className="rounded-full bg-muted px-2 py-0.5">{level}</span> : null}
      {transitivity === "vi" ? (
        <span className="rounded-full bg-secondary px-2 py-0.5">自動詞</span>
      ) : null}
      {transitivity === "vt" ? (
        <span className="rounded-full bg-secondary px-2 py-0.5">他動詞</span>
      ) : null}
      {transitivity === "both" ? (
        <span className="rounded-full bg-secondary px-2 py-0.5">自・他</span>
      ) : null}
    </div>
  )
}
