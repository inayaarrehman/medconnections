import React, { useEffect, useMemo, useState } from 'react'
import { systemPuzzles } from './puzzles.js'
import Home from './components/Home.jsx'
import Game from './components/Game.jsx'
import Archive from './components/Archive.jsx'
import Systems from './components/Systems.jsx'
import HowToModal from './components/HowToModal.jsx'
import StatsModal from './components/StatsModal.jsx'
import DevViewer from './components/DevViewer.jsx'
import { dateKey, dayNumber } from './utils/game.js'
import { getDailyPuzzleForDate } from './utils/dailyPuzzle.js'
import {
  loadStats,
  recordResult,
  loadProgress,
  getDailyHistory,
  recordDailyHistory,
  getSystemProgress,
  recordSystemAttempt,
  recordWeakSpots,
} from './utils/storage.js'

// Builds Weak Spot data points from one finished attempt: every category
// touched by a wrong guess (the "concepts involved"), plus every category's
// final solved/unsolved status. Keyed by category title so the same concept
// aggregates across different puzzles.
function buildWeakSpotResults(puzzle, guessLog) {
  const results = []
  const solvedSet = new Set()
  guessLog.forEach((g) => {
    if (g.correct) {
      const catIndex = g.catIndexes[0]
      solvedSet.add(catIndex)
      results.push({ tag: puzzle.categories[catIndex].title, solved: true })
    } else {
      const uniqueCats = [...new Set(g.catIndexes)]
      uniqueCats.forEach((ci) => {
        results.push({ tag: puzzle.categories[ci].title, solved: false })
      })
    }
  })
  puzzle.categories.forEach((cat, i) => {
    if (!solvedSet.has(i)) {
      results.push({ tag: cat.title, solved: false })
    }
  })
  return results
}

export default function App() {
  const [isDevRoute, setIsDevRoute] = useState(() => window.location.hash === '#dev')
  useEffect(() => {
    const onHashChange = () => setIsDevRoute(window.location.hash === '#dev')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const [view, setView] = useState('home') // 'home' | 'game' | 'archive' | 'systems'
  const [gameCtx, setGameCtx] = useState(null)
  const [showHowTo, setShowHowTo] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState(loadStats())
  const [refreshTick, setRefreshTick] = useState(0)

  const today = new Date()
  const todayKey = dateKey(today)
  const todayDayNumber = dayNumber(today)

  const dailyDone = useMemo(() => {
    const p = loadProgress(`daily-${todayKey}`)
    return !!p?.gameOver
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey, refreshTick])

  const systemProgress = useMemo(() => getSystemProgress(), [refreshTick])
  const continueSystem = dailyDone ? systemProgress.lastPlayedSystem : null

  useEffect(() => {
    if (view === 'home') setRefreshTick((t) => t + 1)
  }, [view])

  const goHome = () => {
    setGameCtx(null)
    setView('home')
  }

  const openArchiveDay = (dateStr, puzzle, wasCompleted) => {
    const isToday = dateStr === todayKey
    setGameCtx({
      puzzle,
      mode: isToday ? 'daily' : 'archive',
      progressKey: `daily-${dateStr}`,
      headerLabel: isToday ? `Daily #${todayDayNumber}` : `Archive · ${dateStr}`,
      resultTitle: isToday ? "Today's Results" : `Result — ${dateStr}`,
      dailyNumber: puzzle.number,
      dailyStreak: stats.currentStreak,
      dateForHistory: dateStr,
      isToday,
    })
    setView('game')
  }

  const openDailyToday = () => {
    const puzzle = getDailyPuzzleForDate(today)
    if (!puzzle) return
    openArchiveDay(todayKey, puzzle, dailyDone)
  }

  const openSystemPuzzle = (puzzle) => {
    setGameCtx({
      puzzle,
      mode: 'system',
      progressKey: `system-${puzzle.id}`,
      headerLabel: puzzle.title,
      resultTitle: 'Puzzle Results',
      system: puzzle.systems[0],
      isDaily: false,
    })
    setView('game')
  }

  const handleContinueStudying = () => {
    const progress = getSystemProgress()
    const system = progress.lastPlayedSystem
    if (!system) return
    const puzzlesForSystem = systemPuzzles
      .filter((p) => p.status === 'published' && p.systems.includes(system))
      .sort((a, b) => a.number - b.number)
    if (puzzlesForSystem.length === 0) return
    const next =
      puzzlesForSystem.find((p) => !(progress.perPuzzle[p.id]?.completions > 0)) ||
      puzzlesForSystem.find((p) => p.id === progress.lastPlayedPuzzleId) ||
      puzzlesForSystem[0]
    openSystemPuzzle(next)
  }

  const handleFinish = ({ won, mistakes, guessLog, puzzle }) => {
    if (!gameCtx) return
    const { mode, dateForHistory, isToday, system } = gameCtx

    recordWeakSpots(buildWeakSpotResults(puzzle, guessLog))

    if (mode === 'daily' || mode === 'archive') {
      recordDailyHistory({
        date: dateForHistory,
        puzzleId: puzzle.id,
        puzzleNumber: puzzle.number,
        completed: true,
        won,
        mistakes,
        completedAt: new Date().toISOString(),
      })
      const updated = recordResult({ won, mistakes, isDaily: true, dailyKey: dateForHistory, countsTowardStreak: isToday })
      setStats(updated)
    } else if (mode === 'system') {
      const correctGuesses = guessLog.filter((g) => g.correct).length
      const totalGuesses = guessLog.length
      const solvedCount = new Set(guessLog.filter((g) => g.correct).map((g) => g.catIndexes[0])).size
      recordSystemAttempt({
        puzzleId: puzzle.id,
        system,
        won,
        mistakes,
        correctGuesses,
        totalGuesses,
        categoriesMissed: 4 - solvedCount,
      })
      const updated = recordResult({ won, mistakes, isDaily: false, countsTowardStreak: false })
      setStats(updated)
    }
    setRefreshTick((t) => t + 1)
  }

  if (isDevRoute) {
    return <DevViewer />
  }

  if (view === 'game' && gameCtx) {
    return (
      <div className="app-shell">
        <Game
          key={gameCtx.progressKey}
          puzzle={gameCtx.puzzle}
          isDaily={gameCtx.mode === 'daily' || gameCtx.mode === 'archive'}
          progressKey={gameCtx.progressKey}
          headerLabel={gameCtx.headerLabel}
          resultTitle={gameCtx.resultTitle}
          dailyNumber={gameCtx.dailyNumber}
          dailyStreak={gameCtx.isToday ? stats.currentStreak : 0}
          onExit={goHome}
          onFinish={handleFinish}
        />
      </div>
    )
  }

  if (view === 'archive') {
    return (
      <div className="app-shell">
        <Archive dailyHistory={getDailyHistory()} onOpenDay={openArchiveDay} onBack={goHome} />
      </div>
    )
  }

  if (view === 'systems') {
    return (
      <div className="app-shell">
        <Systems
          systemPuzzles={systemPuzzles}
          systemProgress={systemProgress}
          onPlayPuzzle={openSystemPuzzle}
          onBack={goHome}
        />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Home
        dailyNumber={todayDayNumber}
        dailyDone={dailyDone}
        currentStreak={stats.currentStreak}
        continueSystem={continueSystem}
        onPlayDaily={openDailyToday}
        onOpenArchive={() => setView('archive')}
        onOpenSystems={() => setView('systems')}
        onContinueStudying={handleContinueStudying}
        onOpenStats={() => setShowStats(true)}
        onOpenHowTo={() => setShowHowTo(true)}
      />
      {showHowTo && <HowToModal onClose={() => setShowHowTo(false)} />}
      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
    </div>
  )
}
