# Nichi — Study tracker

Nichi is a local-first study journal: log sessions, run Pomodoros, protect a streak, and see progress toward an exam date. Built for language exams (JLPT and similar) but it works for any tagged subject.

All data stays in the browser via `localStorage`. There is no account and no server.

## Features

- **Daily logger** — date (defaults to today), subject tags (Kanji, Grammar, Reading, Listening, Vocabulary, Past Papers), hours/minutes, notes, and mastery.
- **Quick-add presets** — `+15m`, `+30m`, `+1h` instantly log the selected tag.
- **Daily target** — progress bar toward a 2-hour default goal (editable).
- **Exam countdown** — customizable exam name and date.
- **Streaks** — consecutive days with at least one session.
- **Weekly analytics** — bar chart of hours per day and a donut of subject mix.
- **Activity heatmap** — GitHub-style last 17 weeks.
- **Pomodoro** — 25/5 timer that auto-logs a 25-minute session when a focus block finishes.
- **Reminders** — daily time and message, in-app toast, optional browser notifications.
- **Backup** — export and import JSON from settings.
- **Theme** — light and dark, Linear/Notion-like layout, responsive.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first visit seeds sample history so charts and the heatmap are not empty. Restore, clear, or import JSON from **Targets & reminders** (bell icon).

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

Sessions and settings are stored under `nichi.study-store.v2`. Export JSON from settings if you want a portable backup. Clearing site data in the browser removes them.
