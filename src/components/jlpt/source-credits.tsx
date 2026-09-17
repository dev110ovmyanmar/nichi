import {
  KANJI_OPEN_SOURCES,
  SOUMATOME_GOI_BOOK,
  SOUMATOME_KANJI_BOOK,
  VOCAB_OPEN_SOURCES,
  type OpenSourceCredit,
} from "@/data/sources"

export function SourceCite({
  id,
  book = "kanji",
}: {
  id: string
  book?: "kanji" | "goi"
}) {
  const list = book === "goi" ? VOCAB_OPEN_SOURCES : KANJI_OPEN_SOURCES
  const source = list.find((entry) => entry.id === id)
  if (!source) return null
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="text-[11px] font-medium text-primary underline-offset-2 hover:underline"
    >
      {source.title} · {source.license}
    </a>
  )
}

export function SourceCredits({
  compact = false,
  book = "kanji",
}: {
  compact?: boolean
  book?: "kanji" | "goi"
}) {
  const textbook = book === "goi" ? SOUMATOME_GOI_BOOK : SOUMATOME_KANJI_BOOK
  const sources: OpenSourceCredit[] =
    book === "goi" ? VOCAB_OPEN_SOURCES : KANJI_OPEN_SOURCES
  return (
    <aside className="rounded-3xl bg-card p-4 ring-1 ring-foreground/8">
      <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Sources
      </p>
      <p className="mt-2 text-sm">
        課程သည်{" "}
        <a
          href={textbook.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {textbook.title}
        </a>
        （{textbook.publisher}）၏ အပတ်/နေ့ ပုံစံကို လိုက်သည်။ စာအုပ်ပါ စာသား မကူးယူပါ။
      </p>
      <ul className={compact ? "mt-3 grid gap-2" : "mt-3 grid gap-2 sm:grid-cols-3"}>
        {sources.map((source) => (
          <li key={source.id}>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl bg-muted/50 px-3 py-2 hover:bg-muted"
            >
              <span className="block font-medium text-primary underline-offset-2">
                {source.title}
              </span>
              <span className="my-script mt-0.5 block text-xs text-muted-foreground">
                {source.roleMy}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {source.license}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                {source.url}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
