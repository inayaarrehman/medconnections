# MedConnections

A NYT Connections-style daily puzzle game for medical professionals. Find the hidden
clinical relationship linking four terms out of a 4x4 grid of sixteen — easiest
category is yellow, trickiest is purple, same as the original.

Built with React + Vite. No backend — everything runs client-side, with
localStorage used for stats and in-progress puzzles.

## Features

- **Daily puzzle** that's the same for everyone on a given day, plus a growing
  bank of **practice puzzles** you can play any time.
- Classic Connections rules: pick 4 tiles, submit, 4 mistakes allowed, "one away"
  hints, shuffle/deselect controls.
- Streaks, win rate, and a mistake-distribution chart, all saved locally.
- Shareable, Wordle-style emoji result grid (copies to clipboard).
- Ten hand-written puzzles spanning cardiology, immunology, pharmacology,
  micro, heme/onc, genetics, embryology, and classic eponyms — easy to extend
  (see below).

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo.
3. Vercel auto-detects the Vite framework preset (build command
   `npm run build`, output directory `dist` — also pinned in `vercel.json`).
4. Deploy. No environment variables are required.

## Adding new puzzles

Edit `src/puzzles.js`. Each puzzle needs exactly 4 categories, each with
exactly 4 unique items, and levels `1` (easiest/yellow) through `4`
(trickiest/purple) used exactly once. A `validatePuzzle` helper in that file
checks these invariants — see `scripts/selftest.mjs` for how it's used.

## Self-test

Two headless test scripts back this project — no browser required:

- `scripts/selftest.mjs` validates the entire puzzle bank (structure, exactly
  4x4 categories/items, no duplicates) and the core game logic (matching,
  "one away" detection, mistake counting, daily-puzzle rotation, shuffling).
- `scripts/render-smoketest.mjs` server-renders every component (Home, Game —
  once per puzzle, HowToModal, StatsModal, Confetti) with `react-dom/server`
  to catch any JSX/runtime errors before they'd ever hit a browser.

Run both with:

```bash
npm run test
```

(`npm install` first if you haven't — `test:render` uses `tsx`, listed as a
devDependency.)
