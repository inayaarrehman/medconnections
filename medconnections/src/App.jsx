import React, { useEffect, useMemo, useState } from 'react'
import puzzles from './puzzles.js'
import Home from './components/Home.jsx'
import Game from './components/Game.jsx'
import HowToModal from './components/HowToModal.jsx'
import StatsModal from './components/StatsModal.jsx'
import { dateKey, dayNumber, getDailyPuzzleIndex } from './utils/game.js'
import { loadStats, recordResult, loadProgress } from './utils/storage.js'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'game'
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(null)
  const [isDaily, setIsDaily] = useState(false)
  const [showHowTo, setShowHowTo] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState(loadStats())
  const [refreshTick, setRefreshTick] = useState(0)

  const today = new Date()
  const todayKey = dateKey(today)
  const todayDayNumber = dayNumber(today)
  const dailyIndex = getDailyPuzzleIndex(puzzles.length, today)
  const dailyProgressKey = `daily-${todayKey}`

  const dailyDone = useMemo(() => {
    const p = loadProgress(dailyProgressKey)
    return !!p?.gameOver
  }, [dailyProgressKey, refreshTick])

  const practiceStatus = useMemo(() => {
    const status = {}
    puzzles.forEach((p) => {
      const saved = loadProgress(`practice-${p.id}`)
      if (!saved) return
      if (saved.gameOver && saved.won) status[p.id] = 'won'
      else if (saved.gameOver && !saved.won) status[p.id] = 'lost'
      else status[p.id] = 'progress'
    })
    return status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTick])

  useEffect(() => {
    if (view === 'home') setRefreshTick((t) => t + 1)
  }, [view])

  const openDaily = () => {
    setActivePuzzleIndex(dailyIndex)
    setIsDaily(true)
    setView('game')
  }

  const openPractice = (index) => {
    setActivePuzzleIndex(index)
    setIsDaily(false)
    setView('game')
  }

  const handleFinish = ({ won, mistakes }) => {
    const updated = recordResult({ won, mistakes, isDaily, dailyKey: todayKey })
    setStats(updated)
  }

  const goHome = () => setView('home')

  if (view === 'game' && activePuzzleIndex !== null) {
    const puzzle = puzzles[activePuzzleIndex]
    const progressKey = isDaily ? dailyProgressKey : `practice-${puzzle.id}`
    const headerLabel = isDaily ? `Daily #${todayDayNumber}` : `Puzzle ${activePuzzleIndex + 1}`
    return (
      <div className="app-shell">
        <Game
          key={progressKey}
          puzzle={puzzle}
          isDaily={isDaily}
          progressKey={progressKey}
          headerLabel={headerLabel}
          dailyNumber={todayDayNumber}
          dailyStreak={stats.currentStreak}
          onExit={goHome}
          onFinish={handleFinish}
        />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Home
        puzzles={puzzles}
        dailyIndex={dailyIndex}
        dailyNumber={todayDayNumber}
        dailyDone={dailyDone}
        currentStreak={stats.currentStreak}
        practiceStatus={practiceStatus}
        onPlayDaily={openDaily}
        onPlayPractice={openPractice}
        onOpenStats={() => setShowStats(true)}
        onOpenHowTo={() => setShowHowTo(true)}
      />
      {showHowTo && <HowToModal onClose={() => setShowHowTo(false)} />}
      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
    </div>
  )
}
