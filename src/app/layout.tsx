import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Noto_Sans_JP, Noto_Sans_Myanmar } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { NichiFrame } from "@/components/shell/nichi-frame"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const notoJp = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const notoMy = Noto_Sans_Myanmar({
  variable: "--font-myanmar",
  subsets: ["myanmar"],
  weight: ["400", "500", "700"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2433" },
  ],
}

export const metadata: Metadata = {
  title: "Nichi N2 — JLPT N2 for Burmese speakers",
  description:
    "JLPT N2 vocabulary, kanji, grammar, reading, listening, and mock exams with Burmese explanations, plus a daily study journal.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="my"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoJp.variable} ${notoMy.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <NichiFrame>{children}</NichiFrame>
          <Toaster position="top-center" offset={{ top: 72 }} mobileOffset={{ top: 64 }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
