"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  GraduationCap,
  Headphones,
  Home,
  Languages,
  MoreHorizontal,
  NotebookPen,
  PenLine,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const PRIMARY = [
  { href: "/", label: "ပင်မ", ja: "Home", icon: Home },
  { href: "/vocab", label: "語彙", ja: "Vocab", icon: Languages },
  { href: "/grammar", label: "文法", ja: "Grammar", icon: BookOpen },
  { href: "/reading", label: "読解", ja: "Reading", icon: PenLine },
] as const

const MORE = [
  { href: "/listening", label: "聴解", ja: "Listening", icon: Headphones },
  { href: "/exam", label: "模擬", ja: "Mock exam", icon: GraduationCap },
  { href: "/kanji", label: "漢字", ja: "Kanji", icon: Languages },
  { href: "/compounds", label: "複合", ja: "Compounds", icon: BookOpen },
  { href: "/journal", label: "မှတ်တမ်း", ja: "Journal", icon: NotebookPen },
] as const

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppShell({
  children,
  streak,
}: {
  children: React.ReactNode
  streak: number
}) {
  const pathname = usePathname()
  const extraJournalPad = pathname.startsWith("/journal")

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              日
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-sm font-semibold">
                Nichi N2
              </span>
              <span className="block text-[11px] text-muted-foreground">
                JLPT N2 · မြန်မာ
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground tabular-nums">
              {streak} 日
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-8 px-4">
        <nav className="sticky top-20 hidden h-fit w-48 shrink-0 py-6 lg:block">
          <p className="mb-2 px-3 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Modules
          </p>
          <ul className="grid gap-1">
            {[...PRIMARY, ...MORE].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                    isActive(pathname, item.href)
                      ? "bg-primary/12 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  <span>{item.ja}</span>
                  <span className="ml-auto text-[11px] opacity-70">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main
          className={cn(
            "min-w-0 flex-1 pt-4 pb-28 lg:pt-6 lg:pb-10",
            extraJournalPad && "pb-44"
          )}
        >
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <ul className="mx-auto grid max-w-6xl grid-cols-5">
          {PRIMARY.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px]",
                  isActive(pathname, item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/exam"
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px]",
                ["/exam", "/listening", "/journal", "/kanji", "/compounds"].some(
                  (href) => isActive(pathname, href)
                )
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <MoreHorizontal className="size-5" />
              နောက်
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
