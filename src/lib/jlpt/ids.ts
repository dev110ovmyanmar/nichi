/** Normalize dynamic-route ids that Next may leave percent-encoded. */
export function decodeEntryId(raw: string) {
  let current = raw
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(current)
      if (next === current) break
      current = next
    } catch {
      break
    }
  }
  return current
}

export function findById<T extends { id: string }>(items: T[], raw: string) {
  const id = decodeEntryId(raw)
  return (
    items.find((item) => item.id === id) ??
    items.find((item) => item.id === raw) ??
    items.find((item) => encodeURIComponent(item.id) === raw) ??
    null
  )
}

export function entryHref(base: "/vocab" | "/kanji", id: string) {
  return `${base}/${encodeURIComponent(id)}`
}
