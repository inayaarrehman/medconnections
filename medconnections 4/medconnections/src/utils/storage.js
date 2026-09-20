const STATS_KEY = 'medconnections.stats.v1'
const PROGRESS_KEY_PREFIX = 'medconnections.progress.'

const defaultStats = () => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastCompletedDailyKey: null, // yyyy-mm-dd of the last daily puzzle completed
  mistakeDistribution: [0, 0, 0, 0, 0], // index = mistakes made (0-4)
})

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return defaultStats()
    const parsed = JSON.parse(raw)
    return { ...defaultStats(), ...parsed }
  } catch {
    return defaultStats()
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // localStorage unavailable (private mode, etc.) - fail silently, game still works
  }
}

// `countsTowardStreak` should be true only when this finish is for TODAY's
// actual Daily Puzzle — playing/backfilling a past Archive day still counts
// toward overall played/won/mistake stats, but must never move the streak
// (that would make streaks gameable by replaying old dates).
export function recordResult({ won, mistakes, isDaily, dailyKey, countsTowardStreak }) {
  const stats = loadStats()
  stats.gamesPlayed += 1
  if (won) stats.gamesWon += 1
  const clampedMistakes = Math.max(0, Math.min(4, mistakes))
  stats.mistakeDistribution[clampedMistakes] = (stats.mistakeDistribution[clampedMistakes] || 0) + 1

  if (isDaily && countsTowardStreak) {
    if (won && stats.lastCompletedDailyKey !== dailyKey) {
      stats.currentStreak += 1
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
      stats.lastCompletedDailyKey = dailyKey
    } else if (!won) {
      stats.currentStreak = 0
      stats.lastCompletedDailyKey = dailyKey
    }
  }
  saveStats(stats)
  return stats
}

// Per-puzzle-instance progress, so a reload mid-game doesn't lose state.
export function saveProgress(key, progress) {
  try {
    localStorage.setItem(PROGRESS_KEY_PREFIX + key, JSON.stringify(progress))
  } catch {
    // ignore
  }
}

export function loadProgress(key) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearProgress(key) {
  try {
    localStorage.removeItem(PROGRESS_KEY_PREFIX + key)
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------
// Daily Puzzle history (powers the Archive). Keyed by calendar date so the
// Archive can list every day played without scanning all progress keys.
// In a real backend this is one row per (user, date).
// ---------------------------------------------------------------------
const DAILY_HISTORY_KEY = 'medconnections.dailyHistory.v1'

export function getDailyHistory() {
  try {
    const raw = localStorage.getItem(DAILY_HISTORY_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getDailyHistoryList() {
  const history = getDailyHistory()
  return Object.values(history).sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function recordDailyHistory(entry) {
  const history = getDailyHistory()
  history[entry.date] = { ...history[entry.date], ...entry }
  try {
    localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history))
  } catch {
    // ignore
  }
  return history
}

// ---------------------------------------------------------------------
// System Library progress. Tracks per-puzzle and per-system aggregates,
// plus which system was played most recently (for "Continue Studying").
// ---------------------------------------------------------------------
const SYSTEM_PROGRESS_KEY = 'medconnections.systemProgress.v1'

const defaultSystemProgress = () => ({
  perPuzzle: {},
  perSystem: {},
  lastPlayedSystem: null,
  lastPlayedPuzzleId: null,
})

export function getSystemProgress() {
  try {
    const raw = localStorage.getItem(SYSTEM_PROGRESS_KEY)
    if (!raw) return defaultSystemProgress()
    return { ...defaultSystemProgress(), ...JSON.parse(raw) }
  } catch {
    return defaultSystemProgress()
  }
}

function saveSystemProgress(progress) {
  try {
    localStorage.setItem(SYSTEM_PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // ignore
  }
}

// `system` is the puzzle's primary organ system (a string). `correctGuesses`
// and `totalGuesses` come from the guess log of one attempt, and feed a
// simple accuracy metric per system.
export function recordSystemAttempt({ puzzleId, system, won, mistakes, correctGuesses, totalGuesses, categoriesMissed }) {
  const progress = getSystemProgress()

  const puzzleStats = progress.perPuzzle[puzzleId] || { attempts: 0, completions: 0, lastWon: null, lastMistakes: null }
  puzzleStats.attempts += 1
  if (won) puzzleStats.completions += 1
  puzzleStats.lastWon = won
  puzzleStats.lastMistakes = mistakes
  progress.perPuzzle[puzzleId] = puzzleStats

  const sysStats = progress.perSystem[system] || {
    attempted: 0,
    completed: 0,
    correctGuesses: 0,
    totalGuesses: 0,
    categoriesMissed: 0,
  }
  sysStats.attempted += 1
  if (won) sysStats.completed += 1
  sysStats.correctGuesses += correctGuesses || 0
  sysStats.totalGuesses += totalGuesses || 0
  sysStats.categoriesMissed += categoriesMissed || 0
  progress.perSystem[system] = sysStats

  progress.lastPlayedSystem = system
  progress.lastPlayedPuzzleId = puzzleId

  saveSystemProgress(progress)
  return progress
}

// ---------------------------------------------------------------------
// Weak Spot data collection. Keyed by category title (the same string
// shown in the Review panel), so it naturally aggregates the same concept
// across different puzzles. This only COLLECTS data for now — the
// personalized Weak Spots mode itself is a later phase.
// ---------------------------------------------------------------------
const WEAK_SPOTS_KEY = 'medconnections.weakSpots.v1'

export function getWeakSpots() {
  try {
    const raw = localStorage.getItem(WEAK_SPOTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveWeakSpots(spots) {
  try {
    localStorage.setItem(WEAK_SPOTS_KEY, JSON.stringify(spots))
  } catch {
    // ignore
  }
}

// results: array of { tag, solved: boolean }, one entry per category
// encountered in a single puzzle attempt (whether solved cleanly, solved
// after a wrong guess involving it, or never solved at a loss).
export function recordWeakSpots(results) {
  const spots = getWeakSpots()
  const today = dateKeyLocal()
  results.forEach(({ tag, solved }) => {
    const entry = spots[tag] || { timesEncountered: 0, timesSolved: 0, timesMissed: 0, lastEncountered: null }
    entry.timesEncountered += 1
    if (solved) entry.timesSolved += 1
    else entry.timesMissed += 1
    entry.lastEncountered = today
    spots[tag] = entry
  })
  saveWeakSpots(spots)
  return spots
}

function dateKeyLocal(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// ---------------------------------------------------------------------
// Concept Mastery. Tracked per connection-bank category id (not per
// puzzle — the same category can appear in many different assembled
// puzzles over time). A concept should not become "mastered" just
// because it was seen once: state is driven by a streak of CLEAN solves
// (guessed correctly without any wrong guess touching that category
// first), and any miss resets the streak. This is a simple model today,
// but the shape (timesSeen/currentStreak/lastSeenAt per concept) is
// exactly what a future spaced-repetition scheduler would build on —
// nothing here needs to change to add one later.
//
// States (internal only — not all necessarily shown verbatim in the UI):
//   unseen   — no entry yet
//   seen     — attempted at least once, but no active clean-solve streak
//   learning — 1-2 clean solves in a row, most recently
//   mastered — 3+ clean solves in a row, most recently
// ---------------------------------------------------------------------
const CONCEPT_MASTERY_KEY = 'medconnections.conceptMastery.v1'
const MASTERY_STREAK_FOR_LEARNING = 1
const MASTERY_STREAK_FOR_MASTERED = 3

export function getConceptMastery() {
  try {
    const raw = localStorage.getItem(CONCEPT_MASTERY_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveConceptMastery(mastery) {
  try {
    localStorage.setItem(CONCEPT_MASTERY_KEY, JSON.stringify(mastery))
  } catch {
    // ignore
  }
}

function deriveMasteryState(currentStreak) {
  if (currentStreak >= MASTERY_STREAK_FOR_MASTERED) return 'mastered'
  if (currentStreak >= MASTERY_STREAK_FOR_LEARNING) return 'learning'
  return 'seen'
}

// results: array of { bankCategoryId, cleanSolve }, one entry per bank
// category that was actually playable in the finished puzzle (i.e. it
// has a bankCategoryId — hand-written Daily Puzzle categories don't and
// are simply skipped by the caller before this is invoked).
export function recordConceptMastery(results) {
  const mastery = getConceptMastery()
  const today = dateKeyLocal()
  results.forEach(({ bankCategoryId, cleanSolve }) => {
    if (!bankCategoryId) return
    const entry = mastery[bankCategoryId] || { timesSeen: 0, currentStreak: 0, state: 'unseen', lastSeenAt: null, lastResult: null }
    entry.timesSeen += 1
    entry.currentStreak = cleanSolve ? entry.currentStreak + 1 : 0
    entry.state = deriveMasteryState(entry.currentStreak)
    entry.lastSeenAt = today
    entry.lastResult = cleanSolve ? 'clean' : 'missed'
    mastery[bankCategoryId] = entry
  })
  saveConceptMastery(mastery)
  return mastery
}

export function getMasteryState(mastery, bankCategoryId) {
  return mastery[bankCategoryId]?.state || 'unseen'
}

// ---------------------------------------------------------------------
// 5-Minute Challenge. Deliberately its own key, its own personal best,
// and NOT wired into the Daily Puzzle streak — playing the Challenge is
// optional extra practice, and this module never touches
// `medconnections.stats.v1`'s streak fields (see storage's `recordResult`
// above). A capped history (most recent 20 runs) is kept for a future
// stats view; only `personalBest` is required by the Challenge UI today.
// ---------------------------------------------------------------------
const CHALLENGE_KEY = 'medconnections.challenge.v1'
const CHALLENGE_HISTORY_LIMIT = 20

const defaultChallengeStats = () => ({
  personalBest: 0,
  history: [],
})

export function getChallengeStats() {
  try {
    const raw = localStorage.getItem(CHALLENGE_KEY)
    if (!raw) return defaultChallengeStats()
    return { ...defaultChallengeStats(), ...JSON.parse(raw) }
  } catch {
    return defaultChallengeStats()
  }
}

function saveChallengeStats(stats) {
  try {
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

// summary: { score, roundsAttempted, roundsCorrect, accuracy, avgResponseMs,
//            conceptTagsMissed, organSystemsMissed, highestMultiplier, completedAt }
// Returns { stats, isNewBest } so the results screen can show "New personal
// best" without recomputing anything itself.
export function recordChallengeResult(summary) {
  const stats = getChallengeStats()
  const isNewBest = summary.score > stats.personalBest
  if (isNewBest) stats.personalBest = summary.score
  stats.history = [summary, ...stats.history].slice(0, CHALLENGE_HISTORY_LIMIT)
  saveChallengeStats(stats)
  return { stats, isNewBest }
}
