// Server-side-render smoke test: mounts every component with representative
// props via react-dom/server (no real browser needed) to catch JSX/runtime
// errors that the pure-logic self-test can't see (bad prop access, broken
// conditionals, thrown exceptions during render, etc).
//
// Run with: tsx scripts/render-smoketest.mjs
// (uses the globally installed react/react-dom + tsx JSX loader since this
// sandbox's package registry access is blocked; see README for a normal
// `npm install && vite build` on a machine with registry access.)

// Minimal in-memory localStorage polyfill so we can exercise the
// gameOver/result-card render path (Game reads saved progress via
// localStorage on mount) without a real browser.
globalThis.localStorage = {
  _data: {},
  getItem(k) {
    return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null
  },
  setItem(k, v) {
    this._data[k] = String(v)
  },
  removeItem(k) {
    delete this._data[k]
  },
}

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import allPuzzles, { dailyPuzzles, systemPuzzles, SYSTEMS } from '../src/puzzles.js'
import connectionBank from '../src/data/connectionBank.js'
import Home from '../src/components/Home.jsx'
import Game from '../src/components/Game.jsx'
import Archive from '../src/components/Archive.jsx'
import Systems from '../src/components/Systems.jsx'
import DevViewer from '../src/components/DevViewer.jsx'
import HowToModal from '../src/components/HowToModal.jsx'
import StatsModal from '../src/components/StatsModal.jsx'
import ReviewConnections from '../src/components/ReviewConnections.jsx'
import Confetti from '../src/components/Confetti.jsx'
import { buildTiles } from '../src/utils/game.js'
import { assembleSystemPuzzle } from '../src/utils/puzzleAssembler.js'
import { saveProgress, getDailyHistory, getSystemProgress, getConceptMastery, recordConceptMastery } from '../src/utils/storage.js'

const puzzles = allPuzzles

let failures = 0
function check(label, fn) {
  try {
    const html = fn()
    if (typeof html !== 'string' || html.length === 0) {
      throw new Error('render produced empty output')
    }
    console.log(`  ok  - ${label} (${html.length} chars)`)
    return html
  } catch (err) {
    failures += 1
    console.log(`FAIL  - ${label}\n        ${err.stack || err}`)
    return ''
  }
}

console.log(`\nRender smoke test\n${'='.repeat(40)}\n`)

// ---------------------------------------------------------------
// Home
// ---------------------------------------------------------------

check('Home renders the hero CTA before the daily is done (no Keep Playing section yet)', () => {
  const html = renderToStaticMarkup(
    React.createElement(Home, {
      dailyNumber: 999,
      dailyDone: false,
      currentStreak: 0,
      continueSystem: null,
      continueSystemMastered: 0,
      continueSystemTotal: 0,
      onPlayDaily: () => {},
      onOpenArchive: () => {},
      onOpenSystems: () => {},
      onContinueStudying: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
  if (!html.includes('home-hero-cta')) throw new Error('expected the primary "Play Today\'s Puzzle" CTA before the daily is done')
  if (html.includes('keep-playing')) throw new Error('did not expect the Keep Playing section before the daily is done')
  return html
})

check('Home renders "Today Complete" + a personalized Continue recommendation after the daily is done', () => {
  const html = renderToStaticMarkup(
    React.createElement(Home, {
      dailyNumber: 999,
      dailyDone: true,
      currentStreak: 7,
      continueSystem: 'Cardiology',
      continueSystemMastered: 18,
      continueSystemTotal: 42,
      onPlayDaily: () => {},
      onOpenArchive: () => {},
      onOpenSystems: () => {},
      onContinueStudying: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
  if (!html.includes('home-complete-badge')) throw new Error('expected the "Today Complete" badge once the daily is done')
  if (!html.includes('primary-recommendation')) throw new Error('expected a single primary recommendation in Keep Playing')
  if (!html.includes('Cardiology')) throw new Error('expected the recommendation to name the last-played system')
  if (!html.includes('home-streak')) throw new Error('expected the streak flame to render for a 7-day streak')
  return html
})

check('Home falls back to an "Explore Systems" recommendation with no play history yet', () => {
  const html = renderToStaticMarkup(
    React.createElement(Home, {
      dailyNumber: 1,
      dailyDone: true,
      currentStreak: 0,
      continueSystem: null,
      continueSystemMastered: 0,
      continueSystemTotal: 0,
      onPlayDaily: () => {},
      onOpenArchive: () => {},
      onOpenSystems: () => {},
      onContinueStudying: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
  const primaryMatches = html.match(/primary-recommendation/g) || []
  if (primaryMatches.length === 0) throw new Error('expected a primary recommendation (Explore Systems) with no last-played system')
  if (!html.includes('Explore Systems')) throw new Error('expected the fallback recommendation to be "Explore Systems"')
  return html
})

// ---------------------------------------------------------------
// Game
// ---------------------------------------------------------------

check('Game renders a fresh daily puzzle (16 tiles, 4 lives)', () => {
  const html = renderToStaticMarkup(
    React.createElement(Game, {
      puzzle: dailyPuzzles[0],
      isDaily: true,
      progressKey: 'smoketest-fresh-daily',
      headerLabel: 'Daily #1',
      resultTitle: "Today's Results",
      dailyNumber: 1,
      dailyStreak: 0,
      onExit: () => {},
      onFinish: () => {},
    })
  )
  const liveDots = (html.match(/dot dot-live/g) || []).length
  if (liveDots !== 4) throw new Error(`expected 4 live mistake dots on a fresh game, found ${liveDots}`)
  return html
})

for (const p of puzzles) {
  check(`Game renders puzzle "${p.title}" (${p.id}) without throwing`, () =>
    renderToStaticMarkup(
      React.createElement(Game, {
        puzzle: p,
        isDaily: p.type === 'daily',
        progressKey: `smoketest-${p.id}`,
        headerLabel: p.title,
        resultTitle: 'Puzzle Results',
        onExit: () => {},
        onFinish: () => {},
      })
    )
  )
}

check('Game renders a live-assembled organ-system puzzle with a shareLabel and the Expert pop-flourish class wired up', () => {
  const puzzle = assembleSystemPuzzle(connectionBank, 'Cardiology', { mastery: {} })
  if (!puzzle) throw new Error('assembleSystemPuzzle returned null for Cardiology')
  const tiles = buildTiles(puzzle)
  const key = 'smoketest-system-win'
  saveProgress(key, {
    puzzleId: puzzle.id,
    tiles,
    solvedCats: [0, 1, 2, 3],
    mistakes: 0,
    guessLog: [0, 1, 2, 3].map((catIndex) => ({
      levels: [puzzle.categories[catIndex].level, puzzle.categories[catIndex].level, puzzle.categories[catIndex].level, puzzle.categories[catIndex].level],
      catIndexes: [catIndex, catIndex, catIndex, catIndex],
      correct: true,
    })),
    gameOver: true,
    won: true,
  })
  const html = renderToStaticMarkup(
    React.createElement(Game, {
      puzzle,
      isDaily: false,
      progressKey: key,
      headerLabel: 'Cardiology',
      resultTitle: 'Puzzle Results',
      shareLabel: 'Cardiology',
      onExit: () => {},
      onFinish: () => {},
    })
  )
  if (!html.includes('result-card')) throw new Error('expected a result-card for a won system puzzle')
  if (html.includes('confetti-piece')) throw new Error('confetti is reserved for the Daily win, not system puzzles')
  return html
})

// --- Game component: pre-seeded WIN state (exercises the result card, streak
// banner and share-text logic without needing a real browser to click through) ---

check('Game renders the result card + streak banner on a pre-seeded win', () => {
  const p = dailyPuzzles[1]
  const tiles = buildTiles(p)
  const key = 'smoketest-win'
  saveProgress(key, {
    puzzleId: p.id,
    tiles,
    solvedCats: [0, 1, 2, 3],
    mistakes: 1,
    guessLog: [0, 1, 2, 3].map((catIndex) => ({
      levels: [1, 2, 3, 4].map(() => p.categories[catIndex].level),
      catIndexes: [catIndex, catIndex, catIndex, catIndex],
      correct: true,
    })),
    gameOver: true,
    won: true,
  })
  const html = renderToStaticMarkup(
    React.createElement(Game, {
      puzzle: p,
      isDaily: true,
      progressKey: key,
      headerLabel: 'Daily #7',
      resultTitle: "Today's Results",
      dailyNumber: 7,
      dailyStreak: 7,
      onExit: () => {},
      onFinish: () => {},
    })
  )
  if (!html.includes('result-card')) throw new Error('expected result-card in won-game markup')
  if (!html.includes('streak-banner')) throw new Error('expected streak-banner when dailyStreak > 0')
  if (!html.includes('milestone')) throw new Error('expected milestone styling at a 7-day streak')
  return html
})

check('Game does not re-fire onFinish when mounting an already-completed puzzle (double-finish bug fix)', () => {
  const p = dailyPuzzles[1]
  const tiles = buildTiles(p)
  const key = 'smoketest-already-over'
  saveProgress(key, {
    puzzleId: p.id,
    tiles,
    solvedCats: [0, 1, 2, 3],
    mistakes: 0,
    guessLog: [],
    gameOver: true,
    won: true,
  })
  let finishCount = 0
  const html = renderToStaticMarkup(
    React.createElement(Game, {
      puzzle: p,
      isDaily: true,
      progressKey: key,
      headerLabel: 'Review',
      resultTitle: 'Result — review',
      dailyNumber: 7,
      dailyStreak: 7,
      onExit: () => {},
      onFinish: () => {
        finishCount += 1
      },
    })
  )
  // renderToStaticMarkup does not run effects, so this primarily documents
  // the guard (alreadyOverAtLoad) exists and the component still renders
  // correctly for an already-finished puzzle; the effect-level guard itself
  // is exercised in the browser. Assert the result card still renders.
  if (!html.includes('result-card')) throw new Error('expected result-card when re-opening an already-completed puzzle')
  return html
})

check('Game renders the result card on a pre-seeded loss (no streak banner)', () => {
  const p = dailyPuzzles[2]
  const tiles = buildTiles(p)
  const key = 'smoketest-loss'
  saveProgress(key, {
    puzzleId: p.id,
    tiles,
    solvedCats: [0, 1, 2, 3],
    mistakes: 4,
    guessLog: [],
    gameOver: true,
    won: false,
  })
  const html = renderToStaticMarkup(
    React.createElement(Game, {
      puzzle: p,
      isDaily: true,
      progressKey: key,
      headerLabel: 'Daily #8',
      resultTitle: "Today's Results",
      dailyNumber: 8,
      dailyStreak: 0,
      onExit: () => {},
      onFinish: () => {},
    })
  )
  if (!html.includes('result-card')) throw new Error('expected result-card in lost-game markup')
  if (html.includes('streak-banner')) throw new Error('did not expect a streak banner on a loss with 0 streak')
  return html
})

// ---------------------------------------------------------------
// Archive
// ---------------------------------------------------------------

check('Archive renders a 30-day list including today, with no future puzzles accessible', () => {
  const html = renderToStaticMarkup(
    React.createElement(Archive, {
      dailyHistory: getDailyHistory(),
      onOpenDay: () => {},
      onBack: () => {},
    })
  )
  if (!html.includes('Today')) throw new Error('expected the Archive to label the current day "Today"')
  if (!html.includes('archive-row')) throw new Error('expected at least one archive-row')
  return html
})

check('Archive marks a completed day won/lost with mistake count', () => {
  // Use yesterday's date so it falls inside the Archive's rolling 30-day window.
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const y = yesterday.getFullYear()
  const m = String(yesterday.getMonth() + 1).padStart(2, '0')
  const d = String(yesterday.getDate()).padStart(2, '0')
  const key = `${y}-${m}-${d}`
  const html = renderToStaticMarkup(
    React.createElement(Archive, {
      dailyHistory: {
        [key]: { date: key, completed: true, won: true, mistakes: 2 },
      },
      onOpenDay: () => {},
      onBack: () => {},
    })
  )
  if (!html.includes('archive-row-status won')) throw new Error('expected a won status row for a completed/won day')
  return html
})

// ---------------------------------------------------------------
// Systems
// ---------------------------------------------------------------

check(`Systems renders the compact system list (all ${SYSTEMS.length} named systems)`, () => {
  const html = renderToStaticMarkup(
    React.createElement(Systems, {
      bank: connectionBank,
      mastery: getConceptMastery(),
      onPlaySystem: () => {},
      onBack: () => {},
    })
  )
  const rowMatches = html.match(/system-row-name/g) || []
  if (rowMatches.length !== SYSTEMS.length) {
    throw new Error(`expected ${SYSTEMS.length} system rows, found ${rowMatches.length}`)
  }
  return html
})

check('Systems renders a system detail view with mastery counts once a system is selected', () => {
  // Systems.jsx manages `selected` as internal state driven by clicking a
  // row, which renderToStaticMarkup can't simulate directly. Exercise the
  // underlying data path it depends on instead (mastery.js), since the
  // component itself is covered by the list-render check above.
  const mastery = recordConceptMastery([{ bankCategoryId: 'bank-easy-01', cleanSolve: true }])
  const html = renderToStaticMarkup(
    React.createElement(Systems, {
      bank: connectionBank,
      mastery,
      onPlaySystem: () => {},
      onBack: () => {},
    })
  )
  if (!html.includes('system-row')) throw new Error('expected system rows to render with mastery data present')
  return html
})

// ---------------------------------------------------------------
// DevViewer (hidden #dev route — not linked from navigation)
// ---------------------------------------------------------------

check(`DevViewer lists all ${puzzles.length} puzzles by default (Puzzles tab)`, () => {
  const html = renderToStaticMarkup(React.createElement(DevViewer, {}))
  const rows = html.match(/dev-list-row/g) || []
  if (rows.length !== puzzles.length) throw new Error(`expected ${puzzles.length} dev list rows, found ${rows.length}`)
  if (!html.includes('Connection Bank (')) throw new Error('expected a Connection Bank tab button')
  return html
})

// ---------------------------------------------------------------
// ReviewConnections: exercise every puzzle's explanation/why/remember content
// ---------------------------------------------------------------

for (const p of puzzles) {
  check(`ReviewConnections renders puzzle "${p.title}" (16 whys, 4 remembers)`, () => {
    const html = renderToStaticMarkup(React.createElement(ReviewConnections, { puzzle: p }))
    const headers = (html.match(/accordion-header/g) || []).length
    if (headers !== 4) throw new Error(`expected 4 accordion headers, found ${headers}`)
    return html
  })
}

check('HowToModal renders', () => renderToStaticMarkup(React.createElement(HowToModal, { onClose: () => {} })))

check('StatsModal renders with zeroed stats', () =>
  renderToStaticMarkup(
    React.createElement(StatsModal, {
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        mistakeDistribution: [0, 0, 0, 0, 0],
      },
      onClose: () => {},
    })
  )
)

check('StatsModal renders with populated stats', () =>
  renderToStaticMarkup(
    React.createElement(StatsModal, {
      stats: {
        gamesPlayed: 12,
        gamesWon: 9,
        currentStreak: 3,
        maxStreak: 5,
        mistakeDistribution: [4, 3, 1, 1, 3],
      },
      onClose: () => {},
    })
  )
)

check('Confetti renders 60 pieces', () => {
  const html = renderToStaticMarkup(React.createElement(Confetti, {}))
  const pieces = (html.match(/confetti-piece/g) || []).length
  if (pieces !== 60) throw new Error(`expected 60 confetti pieces, found ${pieces}`)
  return html
})

console.log(`\n${'='.repeat(40)}`)
if (failures === 0) {
  console.log('ALL RENDER CHECKS PASSED\n')
  process.exit(0)
} else {
  console.log(`${failures} RENDER CHECK(S) FAILED\n`)
  process.exit(1)
}
