import React from 'react'
import { SYSTEM_ICONS } from './Systems.jsx'

export default function Home({
  dailyNumber,
  dailyDone,
  currentStreak,
  continueSystem,
  continueSystemMastered,
  continueSystemTotal,
  onPlayDaily,
  onOpenArchive,
  onOpenSystems,
  onContinueStudying,
  onOpenStats,
  onOpenHowTo,
}) {
  return (
    <div className="home">
      <div className="home-topbar">
        <button className="icon-btn ghost" onClick={onOpenArchive} aria-label="Archive">
          🗓️
        </button>
        <button className="icon-btn ghost" onClick={onOpenStats} aria-label="Stats">
          📊
        </button>
        <button className="icon-btn ghost" onClick={onOpenHowTo} aria-label="How to play">
          ?
        </button>
      </div>

      {!dailyDone ? (
        <div className="home-hero">
          <h1 className="home-hero-title">Medical Connections</h1>
          <p className="home-hero-daily">Daily #{dailyNumber}</p>
          <p className="home-hero-tagline">16 concepts. 4 hidden connections.</p>
          <button className="primary-btn home-hero-cta" onClick={onPlayDaily}>
            Play Today's Puzzle
          </button>
          {currentStreak > 0 && <div className="home-streak">🔥 {currentStreak} day streak</div>}
        </div>
      ) : (
        <>
          <div className="home-hero home-hero-done">
            <div className="home-complete-badge">✓ Today Complete</div>
            {currentStreak > 0 && <div className="home-streak">🔥 {currentStreak} day streak</div>}
          </div>

          <div className="keep-playing">
            <h3 className="section-title">Keep playing</h3>

            {continueSystem ? (
              <button className="primary-recommendation" onClick={onContinueStudying}>
                <span className="primary-recommendation-icon">{SYSTEM_ICONS[continueSystem] || '🔬'}</span>
                <span className="primary-recommendation-text">
                  <span className="primary-recommendation-label">Continue {continueSystem}</span>
                  <span className="primary-recommendation-sub">
                    {continueSystemMastered}/{continueSystemTotal} connections mastered
                  </span>
                </span>
                <span className="primary-recommendation-arrow">→</span>
              </button>
            ) : (
              <button className="primary-recommendation" onClick={onOpenSystems}>
                <span className="primary-recommendation-icon">🔬</span>
                <span className="primary-recommendation-text">
                  <span className="primary-recommendation-label">Explore Systems</span>
                  <span className="primary-recommendation-sub">16 organ systems, unlimited puzzles</span>
                </span>
                <span className="primary-recommendation-arrow">→</span>
              </button>
            )}

            <div className="secondary-row">
              <div className="locked-mini" title="Coming soon">
                <span className="locked-mini-icon">⚡</span>
                <span className="locked-mini-label">5-Minute Challenge</span>
                <span className="locked-mini-badge">Coming soon</span>
              </div>
              <div className="locked-mini" title="Coming soon">
                <span className="locked-mini-icon">🎯</span>
                <span className="locked-mini-label">Weak Spots</span>
                <span className="locked-mini-badge">Coming soon</span>
              </div>
            </div>

            {continueSystem && (
              <button className="text-link" onClick={onOpenSystems}>
                Explore all systems →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
