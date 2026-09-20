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

export function recordResult({ won, mistakes, isDaily, dailyKey }) {
  const stats = loadStats()
  stats.gamesPlayed += 1
  if (won) stats.gamesWon += 1
  const clampedMistakes = Math.max(0, Math.min(4, mistakes))
  stats.mistakeDistribution[clampedMistakes] = (stats.mistakeDistribution[clampedMistakes] || 0) + 1

  if (isDaily) {
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
