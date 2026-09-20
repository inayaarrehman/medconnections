// Headless functional self-test for MedConnections.
// Validates the puzzle data set and exercises the core game-logic functions
// (no browser/DOM required). Run with: node scripts/selftest.mjs

// Minimal localStorage polyfill so storage.js functions work under plain Node.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  }
}

import allPuzzles, {
  validatePuzzle,
  dailyPuzzles,
  systemPuzzles,
  generatedPuzzles,
  getPuzzleById,
  getPublishedPuzzles,
  SYSTEMS,
} from '../src/puzzles.js'
import connectionBank, { validateBankCategory, DIFFICULTY_TIERS, BANK_STATUS, CONNECTION_TYPES } from '../src/data/connectionBank.js'
import {
  categoriesCompatible,
  assemblePuzzleFromCategories,
  autoGeneratePuzzles,
  scoreCombo,
  assembleSystemPuzzle,
} from '../src/utils/puzzleAssembler.js'
import { dateKey, dayNumber, getDailyPuzzleIndex, buildTiles, isFullMatch, isOneAway, shuffle } from '../src/utils/game.js'
import { getDailyPuzzleForDate, isFutureDateKey } from '../src/utils/dailyPuzzle.js'
import {
  categoriesForSystem,
  systemMasteryCounts,
  systemMasterySummary,
  systemsWithContent,
} from '../src/utils/mastery.js'
import {
  recordResult,
  loadStats,
  saveProgress,
  loadProgress,
  clearProgress,
  recordDailyHistory,
  getDailyHistory,
  recordSystemAttempt,
  getSystemProgress,
  recordWeakSpots,
  getWeakSpots,
  getConceptMastery,
  recordConceptMastery,
  getMasteryState,
} from '../src/utils/storage.js'

let failures = 0
const ok = (label) => console.log(`  ok  - ${label}`)
const fail = (label, detail) => {
  failures += 1
  console.log(`FAIL  - ${label}${detail ? `\n        ${detail}` : ''}`)
}
const assert = (cond, label, detail) => (cond ? ok(label) : fail(label, detail))

console.log(`\nMedConnections self-test\n${'='.repeat(40)}`)

// ---------------------------------------------------------------
console.log('\n[1] Puzzle bank structure (daily + system, data-driven schema)')
assert(Array.isArray(allPuzzles) && allPuzzles.length >= 1, `puzzle bank is non-empty (${allPuzzles.length} puzzles)`)
assert(dailyPuzzles.length >= 1, `daily puzzles present (${dailyPuzzles.length})`)
assert(systemPuzzles.length >= 1, `system puzzles present (${systemPuzzles.length})`)

const seenIds = new Set()
allPuzzles.forEach((p, i) => {
  const errors = validatePuzzle(p)
  assert(errors.length === 0, `puzzle[${i}] "${p.title}" (${p.id}) is structurally valid`, errors.join('; '))
  assert(!seenIds.has(p.id), `puzzle[${i}] id "${p.id}" is unique`)
  seenIds.add(p.id)
  assert(SYSTEMS.length === 16, 'SYSTEMS list has 16 named organ systems')
})

allPuzzles.forEach((p, i) => {
  const total = p.categories.reduce((sum, c) => sum + c.items.length, 0)
  assert(total === 16, `puzzle[${i}] has 16 total items`, `got ${total}`)
})

assert(getPuzzleById(dailyPuzzles[0].id)?.id === dailyPuzzles[0].id, 'getPuzzleById resolves a known daily puzzle')
assert(getPuzzleById('does-not-exist') === null, 'getPuzzleById returns null for unknown id')
assert(getPublishedPuzzles().every((p) => p.status === 'published'), 'getPublishedPuzzles only returns published puzzles')

// ---------------------------------------------------------------
console.log('\n[2] Tile building & shuffling')
const testPuzzle = allPuzzles[0]
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
  const p = allPuzzles[1]
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
  const p = allPuzzles[2]
  const t = buildTiles(p)
  let mistakes = 0
  for (let i = 0; i < 4; i++) {
    const a = t.filter((x) => x.catIndex === i % 4).slice(0, 2)
    const b = t.filter((x) => x.catIndex === (i + 1) % 4).slice(0, 2)
    const guess = [...a, ...b]
    if (!isFullMatch(guess)) mistakes++
  }
  assert(mistakes === 4, 'four deliberately-wrong guesses register as four mistakes')
}

// ---------------------------------------------------------------
console.log('\n[6] Daily puzzle resolution (date-determined, same for everyone)')
const d1 = new Date(2026, 8, 19) // Sep 19, 2026 - matches an explicit dailyPuzzles date
const d2 = new Date(2026, 8, 20)
assert(dateKey(d1) === '2026-09-19', 'dateKey formats correctly', dateKey(d1))
assert(typeof dayNumber(d1) === 'number' && dayNumber(d2) === dayNumber(d1) + 1, 'dayNumber increments by 1 per day')

const daily1 = getDailyPuzzleForDate(d1)
const daily1Again = getDailyPuzzleForDate(new Date(2026, 8, 19))
assert(!!daily1, 'getDailyPuzzleForDate resolves a puzzle for an explicit daily date')
assert(daily1?.id === daily1Again?.id, 'getDailyPuzzleForDate is deterministic for the same date')

// Far-future date with no explicit entry should still resolve via rotation fallback.
const farFuture = new Date(2027, 5, 15)
const fallback = getDailyPuzzleForDate(farFuture)
assert(!!fallback, 'getDailyPuzzleForDate falls back to rotation for a date with no explicit daily')
assert(!isFutureDateKey(dateKey(new Date())), "today's date is never considered a future date")
assert(isFutureDateKey('2099-01-01'), 'a date far in the future is correctly detected as a future date')

// Old index-based rotation helper still used as the daily fallback mechanism.
const idx1 = getDailyPuzzleIndex(getPublishedPuzzles().length, d1)
assert(idx1 >= 0 && idx1 < getPublishedPuzzles().length, 'getDailyPuzzleIndex stays in range')

// ---------------------------------------------------------------
console.log('\n[7] Storage: stats, streak-gaming prevention, progress round-trip')
{
  localStorage.clear()
  let stats = recordResult({ won: true, mistakes: 1, isDaily: true, dailyKey: '2026-01-01', countsTowardStreak: true })
  assert(stats.currentStreak === 1, 'winning a counted daily increments the streak')
  stats = recordResult({ won: true, mistakes: 0, isDaily: true, dailyKey: '2020-01-01', countsTowardStreak: false })
  assert(stats.currentStreak === 1, 'winning a backfilled Archive day (countsTowardStreak=false) does NOT move the streak')
  assert(stats.gamesPlayed === 2, 'gamesPlayed still increments for every finished game, streak or not')

  saveProgress('daily-2026-01-02', { gameOver: true, won: true })
  assert(loadProgress('daily-2026-01-02')?.gameOver === true, 'saveProgress/loadProgress round-trip works')
  clearProgress('daily-2026-01-02')
  assert(loadProgress('daily-2026-01-02') === null, 'clearProgress removes saved progress')
}

console.log('\n[8] Storage: Daily history (Archive), System progress, Weak Spots')
{
  localStorage.clear()
  recordDailyHistory({ date: '2026-02-01', puzzleId: 'daily-0001', puzzleNumber: 1, completed: true, won: true, mistakes: 2 })
  const history = getDailyHistory()
  assert(history['2026-02-01']?.won === true, 'recordDailyHistory/getDailyHistory round-trip works')

  recordSystemAttempt({
    puzzleId: 'sys-cardio-0001',
    system: 'Cardiology',
    won: true,
    mistakes: 1,
    correctGuesses: 4,
    totalGuesses: 5,
    categoriesMissed: 0,
  })
  const sysProgress = getSystemProgress()
  assert(sysProgress.lastPlayedSystem === 'Cardiology', 'recordSystemAttempt sets lastPlayedSystem (for Continue Studying)')
  assert(sysProgress.perPuzzle['sys-cardio-0001']?.completions === 1, 'recordSystemAttempt tracks per-puzzle completions')
  assert(sysProgress.perSystem['Cardiology']?.attempted === 1, 'recordSystemAttempt tracks per-system aggregates')

  recordWeakSpots([
    { tag: 'QT-prolonging drugs', solved: false },
    { tag: 'QT-prolonging drugs', solved: false },
    { tag: 'Nephritic syndromes', solved: true },
  ])
  const weakSpots = getWeakSpots()
  assert(weakSpots['QT-prolonging drugs']?.timesEncountered === 2, 'recordWeakSpots aggregates repeated misses on the same concept')
  assert(weakSpots['QT-prolonging drugs']?.timesMissed === 2, 'recordWeakSpots tracks timesMissed correctly')
  assert(weakSpots['Nephritic syndromes']?.timesSolved === 1, 'recordWeakSpots tracks timesSolved correctly')
}

// ---------------------------------------------------------------
console.log('\n[9] Connection Bank structure & validation')
{
  assert(Array.isArray(connectionBank) && connectionBank.length >= 1, `connection bank is non-empty (${connectionBank.length} categories)`)
  const bankIds = new Set()
  connectionBank.forEach((c, i) => {
    const errors = validateBankCategory(c)
    assert(errors.length === 0, `bank[${i}] "${c.title}" (${c.id}) is structurally valid`, errors.join('; '))
    assert(!bankIds.has(c.id), `bank[${i}] id "${c.id}" is unique`)
    bankIds.add(c.id)
    assert(DIFFICULTY_TIERS.includes(c.difficulty), `bank[${i}] has a valid difficulty tier`, c.difficulty)
    assert(BANK_STATUS.includes(c.status), `bank[${i}] has a valid status`, c.status)
    assert(CONNECTION_TYPES.includes(c.connectionType), `bank[${i}] has a valid connectionType`, c.connectionType)
  })

  const verified = connectionBank.filter((c) => c.status === 'verified')
  const needsReview = connectionBank.filter((c) => c.status === 'needs_review')
  assert(verified.length > 0, `at least one verified bank category exists (${verified.length})`)
  assert(needsReview.length >= 1, 'at least one category is intentionally flagged needs_review (kept, not deleted)')

  // Invalid category should be rejected with specific errors, not silently accepted.
  const badCategory = { id: 'bad', title: 'x', tiles: ['a', 'a', 'b', 'c'], difficulty: 'nope' }
  const badErrors = validateBankCategory(badCategory)
  assert(badErrors.length > 0, 'validateBankCategory rejects a structurally invalid category', badErrors.join('; '))
}

console.log('\n[10] Puzzle Assembler: compatibility, scoring, generation')
{
  const easy = connectionBank.find((c) => c.id === 'bank-easy-01')
  const medium = connectionBank.find((c) => c.id === 'bank-medium-01')
  const hard = connectionBank.find((c) => c.id === 'bank-hard-01')
  const expert = connectionBank.find((c) => c.id === 'bank-expert-01')
  assert(categoriesCompatible([easy, medium, hard, expert]), 'four categories with no shared tile text are compatible')

  const dupCategory = { ...easy, id: 'dup', tiles: [...easy.tiles] } // shares all 4 tiles with `easy`
  assert(!categoriesCompatible([easy, dupCategory]), 'two categories sharing tile text are correctly flagged incompatible')

  const assembled = assemblePuzzleFromCategories([easy, medium, hard, expert], {
    id: 'test-assembled-0001',
    number: 9001,
    title: 'Test Assembled Puzzle',
  })
  const assembledErrors = validatePuzzle(assembled)
  assert(assembledErrors.length === 0, 'assemblePuzzleFromCategories produces a puzzle that passes validatePuzzle', assembledErrors.join('; '))
  assert(assembled.categories.map((c) => c.level).sort().join(',') === '1,2,3,4', 'assembled puzzle maps easy/medium/hard/expert to levels 1-4')

  let threw = false
  try {
    assemblePuzzleFromCategories([easy, medium, hard], { id: 'x', number: 1, title: 'x' })
  } catch {
    threw = true
  }
  assert(threw, 'assemblePuzzleFromCategories throws when given fewer than 4 categories')

  assert(
    scoreCombo([easy, medium, hard, expert]) > 0,
    'scoreCombo returns a positive internal quality score for a valid combo'
  )

  assert(generatedPuzzles.length >= 1, `at least one puzzle was auto-generated from the bank (${generatedPuzzles.length})`)
  generatedPuzzles.forEach((p, i) => {
    const errors = validatePuzzle(p)
    assert(errors.length === 0, `generatedPuzzles[${i}] "${p.title}" passes validatePuzzle`, errors.join('; '))
    assert(p.source.includes('connection bank'), `generatedPuzzles[${i}] records its bank provenance in source`)
  })

  // Regenerating with the same seed must reproduce the same puzzle set
  // (content-review reproducibility).
  const regenerated = autoGeneratePuzzles(connectionBank, { count: generatedPuzzles.length, seed: 20260919, startNumber: 1 })
  assert(
    regenerated.map((p) => p.id).join(',') === generatedPuzzles.map((p) => p.id).join(','),
    'autoGeneratePuzzles is deterministic for a fixed seed (reproducible regeneration)'
  )

  // The needs_review category must never be selected into a generated puzzle.
  const usedBankIds = new Set(generatedPuzzles.flatMap((p) => p.categories.map((c) => c.bankCategoryId)))
  assert(!usedBankIds.has('bank-easy-04'), 'the needs_review bank category is never used in auto-generated puzzles')
}

console.log('\n[11] Organ System Library: live assembly, mastery bias, cross-system fallback')
{
  assert(SYSTEMS.length === 16, 'organ system library lists 16 named systems')

  // Every system, even ones with little/no dedicated bank content, must be
  // able to produce a complete, valid, single-solution puzzle via the
  // cross-system tier fallback.
  SYSTEMS.forEach((system) => {
    const puzzle = assembleSystemPuzzle(connectionBank, system, { mastery: {} })
    assert(!!puzzle, `assembleSystemPuzzle produces a puzzle for "${system}" (cross-system fallback covers thin systems)`)
    if (puzzle) {
      const errors = validatePuzzle(puzzle)
      assert(errors.length === 0, `assembled "${system}" puzzle passes validatePuzzle`, errors.join('; '))
      const levels = puzzle.categories.map((c) => c.level).sort().join(',')
      assert(levels === '1,2,3,4', `assembled "${system}" puzzle has exactly one easy/medium/hard/expert category each`)
    }
  })

  // Live assembly must be non-deterministic run-to-run (uses Math.random by
  // default) but every run must still validate.
  const runA = assembleSystemPuzzle(connectionBank, 'Cardiology', { mastery: {} })
  const runB = assembleSystemPuzzle(connectionBank, 'Cardiology', { mastery: {} })
  assert(!!runA && !!runB, 'assembleSystemPuzzle can be called repeatedly for the same system')

  const withContent = systemsWithContent(connectionBank, SYSTEMS)
  assert(withContent.includes('Cardiology'), 'systemsWithContent reports Cardiology has dedicated bank categories')
}

console.log('\n[12] Concept mastery: streak-based state machine, storage round-trip')
{
  localStorage.clear()
  assert(getMasteryState({}, 'bank-easy-01') === 'unseen', 'a never-seen bank category defaults to "unseen"')

  let mastery = recordConceptMastery([{ bankCategoryId: 'bank-easy-01', cleanSolve: true }])
  assert(getMasteryState(mastery, 'bank-easy-01') === 'learning', 'a single clean solve moves a category to "learning", not "mastered"')

  mastery = recordConceptMastery([{ bankCategoryId: 'bank-easy-01', cleanSolve: true }])
  assert(getMasteryState(mastery, 'bank-easy-01') === 'learning', 'a second consecutive clean solve is still "learning" (mastery requires a streak of 3)')

  mastery = recordConceptMastery([{ bankCategoryId: 'bank-easy-01', cleanSolve: true }])
  assert(getMasteryState(mastery, 'bank-easy-01') === 'mastered', 'a third consecutive clean solve reaches "mastered" (not from a single exposure)')

  mastery = recordConceptMastery([{ bankCategoryId: 'bank-easy-01', cleanSolve: false }])
  assert(getMasteryState(mastery, 'bank-easy-01') === 'seen', 'any missed/dirty solve resets the streak (mastered -> seen), never stays "mastered" on a miss')

  const reloaded = getConceptMastery()
  assert(getMasteryState(reloaded, 'bank-easy-01') === 'seen', 'concept mastery persists to localStorage and reloads correctly')
}

console.log('\n[13] Mastery derivation helpers (per-system counts & summaries)')
{
  localStorage.clear()
  const mastery = recordConceptMastery([
    { bankCategoryId: 'bank-easy-01', cleanSolve: true },
    { bankCategoryId: 'bank-easy-01', cleanSolve: true },
    { bankCategoryId: 'bank-easy-01', cleanSolve: true },
  ])
  const cardioCats = categoriesForSystem(connectionBank, 'Cardiology')
  assert(cardioCats.every((c) => c.status === 'verified'), 'categoriesForSystem only returns verified categories')

  const counts = systemMasteryCounts(connectionBank, 'Cardiology', mastery)
  assert(typeof counts.total === 'number' && typeof counts.mastered === 'number', 'systemMasteryCounts returns {total, mastered}')
  assert(counts.total >= counts.mastered, 'mastered count never exceeds total verified categories for a system')

  const summary = systemMasterySummary(connectionBank, 'Cardiology', mastery)
  assert(
    Array.isArray(summary.strong) && Array.isArray(summary.needsWork) && Array.isArray(summary.recent),
    'systemMasterySummary returns {strong, needsWork, recent} arrays'
  )
}

// ---------------------------------------------------------------
console.log(`\n${'='.repeat(40)}`)
if (failures === 0) {
  console.log(`ALL CHECKS PASSED (${allPuzzles.length} puzzles validated: ${dailyPuzzles.length} daily, ${systemPuzzles.length} system)\n`)
  process.exit(0)
} else {
  console.log(`${failures} CHECK(S) FAILED\n`)
  process.exit(1)
}
