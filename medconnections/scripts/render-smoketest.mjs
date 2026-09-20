// Server-side-render smoke test: mounts every component with representative
// props via react-dom/server (no real browser needed) to catch JSX/runtime
// errors that the pure-logic self-test can't see (bad prop access, broken
// conditionals, thrown exceptions during render, etc).
//
// Run with: tsx scripts/render-smoketest.mjs
// (uses the globally installed react/react-dom + tsx JSX loader since this
// sandbox's package registry access is blocked; see README for a normal
// `npm install && npm run build` on a machine with registry access.)

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puzzles from '../src/puzzles.js'
import Home from '../src/components/Home.jsx'
import Game from '../src/components/Game.jsx'
import HowToModal from '../src/components/HowToModal.jsx'
import StatsModal from '../src/components/StatsModal.jsx'
import Confetti from '../src/components/Confetti.jsx'

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
      dailyIndex: 0,
      dailyNumber: 999,
      dailyDone: false,
      practiceStatus: {},
      onPlayDaily: () => {},
      onPlayPractice: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
)

check('Home renders with mixed practice statuses', () =>
  renderToStaticMarkup(
    React.createElement(Home, {
      puzzles,
      dailyIndex: 2,
      dailyNumber: 999,
      dailyDone: true,
      practiceStatus: { p01: 'won', p02: 'lost', p03: 'progress' },
      onPlayDaily: () => {},
      onPlayPractice: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
)

const homeHtml = check('Home output contains all 10 practice tiles', () => {
  const html = renderToStaticMarkup(
    React.createElement(Home, {
      puzzles,
      dailyIndex: 0,
      dailyNumber: 1,
      dailyDone: false,
      practiceStatus: {},
      onPlayDaily: () => {},
      onPlayPractice: () => {},
      onOpenStats: () => {},
      onOpenHowTo: () => {},
    })
  )
  const matches = html.match(/practice-tile/g) || []
  if (matches.length !== puzzles.length) {
    throw new Error(`expected ${puzzles.length} practice tiles, found ${matches.length}`)
  }
  return html
})

// --- Game component: fresh game, mid-game (some solved), and game-over states ---

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
  const tileCount = (html.match(/class="tile /g) || []).length + (html.match(/class="tile"/g) || []).length
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
