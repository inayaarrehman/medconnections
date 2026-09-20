// Headless functional self-test for MedConnections.
// Validates the puzzle data set and exercises the core game-logic functions
// (no browser/DOM required). Run with: node scripts/selftest.mjs

import puzzles, { validatePuzzle } from '../src/puzzles.js'
import {
  dateKey,
  dayNumber,
  getDailyPuzzleIndex,
  buildTiles,
  isFullMatch,
  isOneAway,
  shuffle,
} from '../src/utils/game.js'

let failures = 0
const ok = (label) => console.log(`  ok  - ${label}`)
const fail = (label, detail) => {
  failures += 1
  console.log(`FAIL  - ${label}${detail ? `\n        ${detail}` : ''}`)
}
const assert = (cond, label, detail) => (cond ? ok(label) : fail(label, detail))

console.log(`\nMedConnections self-test\n${'='.repeat(40)}`)

// ---------------------------------------------------------------
console.log('\n[1] Puzzle bank structure')
assert(Array.isArray(puzzles) && puzzles.length >= 1, `puzzle bank is non-empty (${puzzles.length} puzzles)`)

const seenIds = new Set()
puzzles.forEach((p, i) => {
  const errors = validatePuzzle(p)
  assert(errors.length === 0, `puzzle[${i}] "${p.title}" is structurally valid`, errors.join('; '))
  assert(!seenIds.has(p.id), `puzzle[${i}] id "${p.id}" is unique`)
  seenIds.add(p.id)
})

// Global duplicate-item check within each puzzle already covered by validatePuzzle.
// Also sanity-check total tile count per puzzle.
puzzles.forEach((p, i) => {
  const total = p.categories.reduce((sum, c) => sum + c.items.length, 0)
  assert(total === 16, `puzzle[${i}] has 16 total items`, `got ${total}`)
})

// ---------------------------------------------------------------
console.log('\n[2] Tile building & shuffling')
const testPuzzle = puzzles[0]
const tiles = buildTiles(testPuzzle)
assert(tiles.length === 16, 'buildTiles returns 16 tiles')
const textSet = new Set(tiles.map((t) => t.text))
assert(textSet.size === 16, 'all built tiles have unique text')
tiles.forEach((t) => {
  assert(
    typeof t.catIndex === 'number' && t.catIndex >= 0 && t.catIndex < 4,
    `tile "${t.text}" has a valid catIndex`
  )
})

// Shuffle should reorder (statistically) without changing membership.
const arr = Array.from({ length: 20 }, (_, i) => i)
const shuffled = shuffle(arr)
assert(shuffled.length === arr.length, 'shuffle preserves length')
assert(
  JSON.stringify(shuffled.slice().sort((a, b) => a - b)) === JSON.stringify(arr),
  'shuffle preserves the same set of elements'
)

// ---------------------------------------------------------------
console.log('\n[3] Match-detection logic')
const cat0Tiles = tiles.filter((t) => t.catIndex === 0)
assert(cat0Tiles.length === 4, 'found 4 tiles for category 0')
assert(isFullMatch(cat0Tiles), 'isFullMatch true for 4 same-category tiles')

const mixed = [...tiles.filter((t) => t.catIndex === 0).slice(0, 3), tiles.find((t) => t.catIndex === 1)]
assert(!isFullMatch(mixed), 'isFullMatch false for a 3+1 mix')
assert(isOneAway(mixed), 'isOneAway true for a 3+1 mix')

const twoAndTwo = [
  ...tiles.filter((t) => t.catIndex === 0).slice(0, 2),
  ...tiles.filter((t) => t.catIndex === 1).slice(0, 2),
]
assert(!isFullMatch(twoAndTwo), 'isFullMatch false for a 2+2 mix')
assert(!isOneAway(twoAndTwo), 'isOneAway false for a 2+2 mix')

// ---------------------------------------------------------------
console.log('\n[4] Simulated full playthrough (win path)')
{
  const p = puzzles[1]
  const t = buildTiles(p)
  let solved = []
  for (let cat = 0; cat < 4; cat++) {
    const group = t.filter((x) => x.catIndex === cat)
    if (isFullMatch(group)) solved.push(cat)
  }
  assert(solved.length === 4, 'every category in a fresh shuffle is internally consistent and matchable')
}

console.log('\n[5] Simulated full playthrough (loss path: 4 wrong guesses)')
{
  const p = puzzles[2]
  const t = buildTiles(p)
  let mistakes = 0
  // Deliberately construct 4 wrong (2+2) guesses.
  for (let i = 0; i < 4; i++) {
    const a = t.filter((x) => x.catIndex === i % 4).slice(0, 2)
    const b = t.filter((x) => x.catIndex === (i + 1) % 4).slice(0, 2)
    const guess = [...a, ...b]
    if (!isFullMatch(guess)) mistakes++
  }
  assert(mistakes === 4, 'four deliberately-wrong guesses register as four mistakes')
}

// ---------------------------------------------------------------
console.log('\n[6] Daily puzzle rotation')
const d1 = new Date(2026, 8, 19) // Sep 19, 2026
const d2 = new Date(2026, 8, 20) // Sep 20, 2026
const idx1 = getDailyPuzzleIndex(puzzles.length, d1)
const idx2 = getDailyPuzzleIndex(puzzles.length, d2)
assert(idx1 >= 0 && idx1 < puzzles.length, 'daily index for day 1 is in range')
assert(idx2 >= 0 && idx2 < puzzles.length, 'daily index for day 2 is in range')
assert(dateKey(d1) === '2026-09-19', 'dateKey formats correctly', dateKey(d1))
assert(typeof dayNumber(d1) === 'number' && dayNumber(d2) === dayNumber(d1) + 1, 'dayNumber increments by 1 per day')

// Same date should always produce the same index (determinism check).
const idx1Again = getDailyPuzzleIndex(puzzles.length, new Date(2026, 8, 19))
assert(idx1 === idx1Again, 'daily puzzle index is deterministic for a given date')

// ---------------------------------------------------------------
console.log(`\n${'='.repeat(40)}`)
if (failures === 0) {
  console.log(`ALL CHECKS PASSED (${puzzles.length} puzzles validated)\n`)
  process.exit(0)
} else {
  console.log(`${failures} CHECK(S) FAILED\n`)
  process.exit(1)
}
