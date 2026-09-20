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
import puzzles from '../src/puzzles.js'
import Home from '../src/components/Home.jsx'
import Game from '../src/components/Game.jsx'
import HowToModal from '../src/components/HowToModal.jsx'
import StatsModal from '../src/components/StatsModal.jsx'
import ReviewConnections from '../src/components/ReviewConnections.jsx'
import Confetti from '../src/components/Confetti.jsx'
import { buildTiles } from '../src/utils/game.js'
import { saveProgress } from '../src/utils/storage.js'

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

check('Home renders with no progress yet', () =>
  renderToStaticMarkup(
    React.createElement(Home, {
      puzzles,
      dailyNumber: 999,
      dailyDone: false,
      currentStreak: 0,
      practiceStatus: {},
      onPlayDaily: () => {},
      onPlayPractice: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
)

check('Home renders unlocked + streak flame + mixed practice statuses', () =>
  renderToStaticMarkup(
    React.createElement(Home, {
      puzzles,
      dailyNumber: 999,
      dailyDone: true,
      currentStreak: 7,
      practiceStatus: { p01: 'won', p02: 'lost', p03: 'progress' },
      onPlayDaily: () => {},
      onPlayPractice: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
)

const homeHtml = check('Home output contains all 10 practice tiles + 3 coming-soon cards', () => {
  const html = renderToStaticMarkup(
    React.createElement(Home, {
      puzzles,
      dailyNumber: 1,
      dailyDone: true,
      currentStreak: 0,
      practiceStatus: {},
      onPlayDaily: () => {},
      onPlayPractice: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
  const tileMatches = html.match(/practice-tile/g) || []
  const lockedMatches = html.match(/locked-card/g) || []
  if (tileMatches.length !== puzzles.length) {
    throw new Error(`expected ${puzzles.length} practice tiles, found ${tileMatches.length}`)
  }
  if (lockedMatches.length !== 3) {
    throw new Error(`expected 3 coming-soon locked cards, found ${lockedMatches.length}`)
  }
  return html
})

check('Home practice grid is gated (locked class) before daily is done', () => {
  const html = renderToStaticMarkup(
    React.createElement(Home, {
      puzzles,
      dailyNumber: 1,
      dailyDone: false,
      currentStreak: 0,
      practiceStatus: {},
      onPlayDaily: () => {},
      onPlayPractice: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
  if (!html.includes('practice-grid locked')) throw new Error('expected "practice-grid locked" class when daily not done')
  return html
})

// --- Game component: fresh game state ---

check('Game renders a fresh puzzle (16 tiles, 4 lives)', () => {
  const html = renderToStaticMarkup(
    React.createElement(Game, {
      puzzle: puzzles[0],
      isDaily: false,
      progressKey: 'smoketest-fresh',
      headerLabel: 'Puzzle 1',
      onExit: () => {},
      onFinish: () => {},
    })
  )
  const liveDots = (html.match(/dot dot-live/g) || []).length
  if (liveDots !== 4) throw new Error(`expected 4 live mistake dots on a fresh game, found ${liveDots}`)
  return html
})

for (const p of puzzles) {
  check(`Game renders puzzle "${p.title}" without throwing`, () =>
    renderToStaticMarkup(
      React.createElement(Game, {
        puzzle: p,
        isDaily: false,
        progressKey: `smoketest-${p.id}`,
        headerLabel: p.title,
        onExit: () => {},
        onFinish: () => {},
      })
    )
  )
}

// --- Game component: pre-seeded WIN state (exercises the result card, streak
// banner and share-text logic without needing a real browser to click through) ---

check('Game renders the result card + streak banner on a pre-seeded win', () => {
  const p = puzzles[1]
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

check('Game renders the result card on a pre-seeded loss (no streak banner)', () => {
  const p = puzzles[2]
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

// --- ReviewConnections: exercise every puzzle's explanation/why/remember content ---

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
