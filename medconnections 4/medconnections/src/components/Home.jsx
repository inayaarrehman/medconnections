import React from 'react'
import { SYSTEMS } from '../puzzles.js'

const SYSTEMS_PREVIEW = SYSTEMS.slice(0, 4).join(' · ') + ' · ...'

export default function Home({
  dailyNumber,
  dailyDone,
  currentStreak,
  continueSystem,
  continueSystemMastered,
  continueSystemTotal,
  challengeBest,
  onPlayDaily,
  onOpenSystems,
  onContinueStudying,
  onStartChallenge,
  onOpenStats,
  onOpenHowTo,
}) {
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="home">
      <div className="home-topbar">
        <button className="text-link home-topbar-link" onClick={onOpenStats}>
          Stats
        </button>
        <button className="text-link home-topbar-link" onClick={onOpenHowTo}>
          How to play
        </button>
      </div>

      <section className="home-section home-hero-section">
        <h1 className="home-title">Medical Connections</h1>
        <p className="home-meta">
          Daily #{dailyNumber} &middot; {todayLabel}
        </p>
        <p className="home-tagline">16 concepts. Four connections.</p>

        {!dailyDone ? (
          <button className="primary-btn" onClick={onPlayDaily}>
            Play today&rsquo;s puzzle
          </button>
        ) : (
          <p className="home-done-line">
            Today complete{currentStreak > 0 ? ` · ${currentStreak} day streak` : ''}
          </p>
        )}
      </section>

      {dailyDone && continueSystem && (
        <section className="home-section">
          <h2 className="home-section-heading">Continue</h2>
          <p className="home-row-title">{continueSystem}</p>
          <p className="home-row-sub">
            {continueSystemMastered} of {continueSystemTotal} connections
          </p>
          <button className="secondary-btn" onClick={onContinueStudying}>
            Continue
          </button>
        </section>
      )}

      <section className="home-section">
        <h2 className="home-section-heading">5-Minute Challenge</h2>
        <p className="home-row-sub">A fast mix of medical association rounds.</p>
        {challengeBest > 0 && <p className="home-row-sub">Personal best: {challengeBest.toLocaleString()}</p>}
        <button className="secondary-btn" onClick={onStartChallenge}>
          Start
        </button>
      </section>

      <section className="home-section">
        <h2 className="home-section-heading">Systems</h2>
        <p className="home-row-sub">{SYSTEMS_PREVIEW}</p>
        <button className="text-link home-link" onClick={onOpenSystems}>
          Browse systems &rarr;
        </button>
      </section>
    </div>
  )
}
