export function pad(value: number) {
  return String(value).padStart(2, "0")
}

export function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDays(isoDate: string, days: number) {
  const date = parseISODate(isoDate)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function parseISODate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function formatShortDay(isoDate: string) {
  return parseISODate(isoDate).toLocaleDateString(undefined, {
    weekday: "short",
  })
}

export function formatPrettyDate(isoDate: string) {
  return parseISODate(isoDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function formatFullDate(isoDate: string) {
  return parseISODate(isoDate).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function lastNDates(n: number, end = todayISO()) {
  return Array.from({ length: n }, (_, index) => addDays(end, index - (n - 1)))
}

export function currentTimeHHMM() {
  const now = new Date()
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`
}
