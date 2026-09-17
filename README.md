# Nichi — Daily study journal

Nichi is a focused web app for logging daily study, protecting a streak, and seeing the last seven days of progress. It is built for language learners (JLPT N2 and similar routines) but works for any subject.

All data stays in the browser via `localStorage`. There is no account and no server.

## Features

- **Daily logger** — date (defaults to today), subject, hours/minutes, notes, and mastery tags (`In progress`, `Needs review`, `Completed`). Add, edit, and delete sessions.
- **Reminders** — customizable daily time and message, in-app toast, optional browser `Notification` API alerts, and a banner when today is still empty.
- **Streaks** — consecutive days with at least one logged session, plus longest streak.
- **Weekly analytics** — total time for the last 7 days, a bar chart of minutes per day, and a subject mix (time and percent).
- **Theme** — light and dark mode, Linear/Notion-like layout, responsive on phone and desktop.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first visit seeds a sample JLPT week so charts are not empty. Restore or clear that sample from **Reminders & settings** (bell icon).

```bash
npm run build
npm start
```

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Lucide icons
- Recharts
- `localStorage` persistence

## Data

Sessions and settings are stored under the key `nichi.study-store.v1`. Clearing site data in the browser removes them.
