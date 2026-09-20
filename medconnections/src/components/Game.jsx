import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DIFFICULTY } from '../puzzles.js'
import { buildTiles, isFullMatch, isOneAway, shuffle, MAX_MISTAKES } from '../utils/game.js'
import { loadProgress, saveProgress } from '../utils/storage.js'
import Confetti from './Confetti.jsx'

const levelColor = (level) => DIFFICULTY.find((d) => d.level === level)?.color || '#888'
const levelEmoji = { 1: '🟨', 2: '🟩', 3: '🟦', 4: '🟪' }

export default function Game({ puzzle, isDaily, progressKey, headerLabel, onExit, onFinish }) {
  const initial = useMemo(() => {
    const saved = loadProgress(progressKey)
    if (saved && saved.puzzleId === puzzle.id) return saved
    return {
      puzzleId: puzzle.id,
      tiles: buildTiles(puzzle),
      solvedCats: [],
      mistakes: 0,
      guessLog: [],
      gameOver: false,
      won: false,
    }
  }, [progressKey, puzzle])

  const [tiles, setTiles] = useState(initial.tiles)
  const [solvedCats, setSolvedCats] = useState(initial.solvedCats)
  const [mistakes, setMistakes] = useState(initial.mistakes)
  const [guessLog, setGuessLog] = useState(initial.guessLog)
  const [gameOver, setGameOver] = useState(initial.gameOver)
  const [won, setWon] = useState(initial.won)

  const [selected, setSelected] = useState([])
  const [shakeIds, setShakeIds] = useState([])
  const [message, setMessage] = useState('')
  const [popCatIndex, setPopCatIndex] = useState(null)
  const [copied, setCopied] = useState(false)
  const finishReported = useRef(false)
  const msgTimer = useRef(null)

  // Persist progress on every meaningful change.
  useEffect(() => {
    saveProgress(progressKey, {
      puzzleId: puzzle.id,
      tiles,
      solvedCats,
      mistakes,
      guessLog,
      gameOver,
      won,
    })
  }, [progressKey, puzzle.id, tiles, solvedCats, mistakes, guessLog, gameOver, won])

  useEffect(() => {
    if (gameOver && !finishReported.current) {
      finishReported.current = true
      onFinish({ won, mistakes })
    }
  }, [gameOver, won, mistakes, onFinish])

  const flashMessage = (text, ms = 1500) => {
    setMessage(text)
    clearTimeout(msgTimer.current)
    msgTimer.current = setTimeout(() => setMessage(''), ms)
  }

  useEffect(() => () => clearTimeout(msgTimer.current), [])

  const remainingTiles = tiles.filter((t) => !solvedCats.includes(t.catIndex))

  const toggleTile = (tile) => {
    if (gameOver) return
    setSelected((prev) => {
      const already = prev.find((t) => t.text === tile.text && t.catIndex === tile.catIndex)
      if (already) return prev.filter((t) => t !== already)
      if (prev.length >= 4) return prev
      return [...prev, tile]
    })
  }

  const handleShuffle = () => {
    setTiles((prev) => {
      const unsolved = prev.filter((t) => !solvedCats.includes(t.catIndex))
      const solved = prev.filter((t) => solvedCats.includes(t.catIndex))
      return [...solved, ...shuffle(unsolved)]
    })
  }

  const handleDeselect = () => setSelected([])

  const handleSubmit = () => {
    if (selected.length !== 4 || gameOver) return
    const alreadyGuessed = guessLog.some(
      (g) => JSON.stringify(g.catIndexes.slice().sort()) === JSON.stringify(selected.map((t) => t.catIndex).sort())
    )

    const levels = selected.map((t) => t.level).sort((a, b) => a - b)
    const catIndexes = selected.map((t) => t.catIndex)

    if (isFullMatch(selected)) {
      const catIndex = selected[0].catIndex
      setSolvedCats((prev) => [...prev, catIndex])
      setGuessLog((prev) => [...prev, { levels: [selected[0].level, selected[0].level, selected[0].level, selected[0].level], catIndexes, correct: true }])
      setPopCatIndex(catIndex)
      setTimeout(() => setPopCatIndex(null), 700)
      setSelected([])
      flashMessage('Nice! 🎯')

      if (solvedCats.length + 1 === 4) {
        setTimeout(() => {
          setWon(true)
          setGameOver(true)
        }, 500)
      }
      return
    }

    // Wrong guess
    setGuessLog((prev) => [...prev, { levels, catIndexes, correct: false }])
    setShakeIds(selected.map((t) => t.text))
    setTimeout(() => setShakeIds([]), 500)

    if (alreadyGuessed) {
      flashMessage('Already tried that combo')
    } else if (isOneAway(selected)) {
      flashMessage('One away...')
    } else {
      flashMessage('Not quite')
    }

    const newMistakes = mistakes + 1
    setMistakes(newMistakes)
    if (newMistakes >= MAX_MISTAKES) {
      setSelected([])
      setTimeout(() => {
        setSolvedCats([0, 1, 2, 3])
        setGameOver(true)
        setWon(false)
      }, 500)
    }
  }

  const mistakesLeft = MAX_MISTAKES - mistakes

  const shareText = useMemo(() => {
    const rows = guessLog
      .map((g) => g.levels.map((lv) => levelEmoji[lv]).join(''))
      .join('\n')
    const label = isDaily ? `MedConnections ${headerLabel}` : `MedConnections — ${puzzle.title}`
    const result = won ? 'Solved it' : 'So close'
    return `${label}\n${result} (${mistakes}/${MAX_MISTAKES} mistakes)\n${rows}`
  }, [guessLog, isDaily, headerLabel, puzzle.title, won, mistakes])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage('Copy failed — select and copy manually')
    }
  }

  const orderedSolvedCats = puzzle.categories
    .map((c, i) => ({ ...c, catIndex: i }))
    .filter((c) => solvedCats.includes(c.catIndex))
    .sort((a, b) => solvedCats.indexOf(a.catIndex) - solvedCats.indexOf(b.catIndex))

  return (
    <div className="game">
      <div className="game-header">
        <button className="icon-btn" onClick={onExit} aria-label="Back">
          ← Back
        </button>
        <div className="game-header-title">
          <span>{headerLabel}</span>
        </div>
        <div className="mistakes-indicator" aria-label={`${mistakesLeft} mistakes remaining`}>
          {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
            <span key={i} className={`dot ${i < mistakesLeft ? 'dot-live' : 'dot-spent'}`} />
          ))}
        </div>
      </div>

      {message && <div className="toast">{message}</div>}

      <div className="solved-stack">
        {orderedSolvedCats.map((c) => (
          <div
            key={c.catIndex}
            className={`solved-banner ${popCatIndex === c.catIndex ? 'pop' : ''}`}
            style={{ backgroundColor: levelColor(c.level) }}
          >
            <div className="solved-banner-title">{c.title}</div>
            <div className="solved-banner-items">{c.items.join(', ')}</div>
          </div>
        ))}
      </div>

      {!gameOver && (
        <>
          <div className="tile-grid">
            {remainingTiles.map((tile) => {
              const isSelected = selected.some((t) => t.text === tile.text && t.catIndex === tile.catIndex)
              const isShaking = shakeIds.includes(tile.text)
              return (
                <button
                  key={tile.text}
                  className={`tile ${isSelected ? 'tile-selected' : ''} ${isShaking ? 'tile-shake' : ''}`}
                  onClick={() => toggleTile(tile)}
                >
                  {tile.text}
                </button>
              )
            })}
          </div>

          <div className="game-controls">
            <button className="secondary-btn" onClick={handleShuffle}>
              Shuffle
            </button>
            <button className="secondary-btn" onClick={handleDeselect} disabled={selected.length === 0}>
              Deselect
            </button>
            <button className="primary-btn" onClick={handleSubmit} disabled={selected.length !== 4}>
              Submit
            </button>
          </div>
        </>
      )}

      {gameOver && (
        <div className="result-card">
          {won && <Confetti />}
          <h2>{won ? '🎉 Solved!' : 'Puzzle over'}</h2>
          <p>
            {won
              ? `You got it in ${mistakes} mistake${mistakes === 1 ? '' : 's'}.`
              : 'Here are the groups you missed — check them out below.'}
          </p>
          <div className="share-row">
            <pre className="share-preview">{shareText}</pre>
            <button className="primary-btn" onClick={handleShare}>
              {copied ? 'Copied!' : 'Copy results'}
            </button>
          </div>
          <button className="secondary-btn" onClick={onExit}>
            Back to home
          </button>
        </div>
      )}
    </div>
  )
}
