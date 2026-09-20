# Medical Connections

A NYT Connections-style daily puzzle game for medical professionals. Find the hidden
clinical relationship linking four terms out of a 4x4 grid of sixteen — easiest
category is yellow, trickiest is purple, same as the original.

Built with React + Vite. No backend — everything runs client-side, with
localStorage used for stats and in-progress puzzles. This is the **Phase 1
MVP** (per the product plan): a fully polished daily-game loop, with
Phase 2-4 features (5-Minute Challenge, Weak Spots, Organ System Library)
shown as tasteful "Coming Soon" cards rather than half-built stubs.

## Features

- **Daily puzzle** that's the same for everyone on a given day, plus a bank of
  **practice puzzles** that unlock once you finish today's daily.
- Classic Connections rules: pick 4 tiles, submit, 4 mistakes allowed, "one away"
  hints, shuffle/deselect controls. Category names stay hidden until solved.
- **Review Connections**: after the puzzle ends, tap any category to see why
  each of its four terms belongs, plus a one-line "Remember this" takeaway.
- Streaks (with milestone emphasis at 7/30/50/100 days), win rate, and a
  mistake-distribution chart, all saved locally.
- Shareable, Wordle-style emoji result grid (copies to clipboard), spoiler-free.
- Ten hand-written puzzles — each of the 40 categories carries its own
  explanation and per-item rationale — spanning cardiology, immunology,
  pharmacology, micro, heme/onc, genetics, embryology, and classic eponyms.

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

Edit `src/puzzles.js`. Each puzzle needs exactly 4 categories, each with:

- `title` — the hidden connection (revealed only after solving)
- `explanation` — one or two sentences on why the four items belong together
- `remember` — one high-yield takeaway sentence
- `items` — exactly 4 `{ term, why }` objects; `term` is what shows on the
  tile, `why` is a one-line rationale shown in the Review panel

...and levels `1` (easiest/yellow) through `4` (trickiest/purple) used
exactly once. A `validatePuzzle` helper in that file checks these invariants
— see `scripts/selftest.mjs` for how it's used.

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
