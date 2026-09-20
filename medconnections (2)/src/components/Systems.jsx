import React, { useState } from 'react'
import { SYSTEMS } from '../puzzles.js'

export default function Systems({ systemPuzzles, systemProgress, onPlayPuzzle, onBack }) {
  const [selected, setSelected] = useState(null)

  const published = systemPuzzles.filter((p) => p.status === 'published')

  if (selected) {
    const puzzlesForSystem = published.filter((p) => p.systems.includes(selected)).sort((a, b) => a.number - b.number)
    return (
      <div className="systems">
        <div className="game-header">
          <button className="icon-btn" onClick={() => setSelected(null)} aria-label="Back">
            ← Systems
          </button>
          <div className="game-header-title">
            <span>{selected}</span>
          </div>
          <div />
        </div>

        {puzzlesForSystem.length === 0 && <p className="section-sub">No puzzles in this system yet — coming soon.</p>}

        <div className="system-puzzle-list">
          {puzzlesForSystem.map((p) => {
            const stats = systemProgress.perPuzzle[p.id]
            return (
              <button className="system-puzzle-row" key={p.id} onClick={() => onPlayPuzzle(p)}>
                <span className="system-puzzle-title">{p.title}</span>
                {stats?.completions > 0 ? (
                  <span className="practice-badge won">
                    ✓ Solved{stats.attempts > 1 ? ` · ${stats.attempts}x played` : ''}
                  </span>
                ) : stats?.attempts > 0 ? (
                  <span className="practice-badge lost">Attempted — retry</span>
                ) : (
                  <span className="practice-badge">New</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="systems">
      <div className="game-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ← Back
        </button>
        <div className="game-header-title">
          <span>Systems Library</span>
        </div>
        <div />
      </div>

      <p className="section-sub">Unlimited, replayable puzzles organized by organ system.</p>

      <div className="system-grid">
        {SYSTEMS.map((system) => {
          const count = published.filter((p) => p.systems.includes(system)).length
          const stats = systemProgress.perSystem[system]
          const accuracy =
            stats && stats.totalGuesses > 0 ? Math.round((stats.correctGuesses / stats.totalGuesses) * 100) : null
          return (
            <button
              key={system}
              className={`system-tile ${count === 0 ? 'system-tile-empty' : ''}`}
              onClick={() => count > 0 && setSelected(system)}
              disabled={count === 0}
            >
              <span className="system-tile-name">{system}</span>
              <span className="system-tile-count">
                {count === 0 ? 'Coming soon' : `${count} puzzle${count === 1 ? '' : 's'}`}
              </span>
              {stats && (
                <span className="system-tile-progress">
                  {stats.completed}/{stats.attempted} completed{accuracy !== null ? ` · ${accuracy}% accuracy` : ''}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
