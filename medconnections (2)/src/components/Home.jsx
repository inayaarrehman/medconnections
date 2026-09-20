import React from 'react'

const COMING_SOON = [
  { icon: '⚡', title: '5-Minute Challenge', blurb: 'Fast rounds, personal bests.' },
  { icon: '🎯', title: 'Weak Spots', blurb: 'Concepts you keep missing, resurfaced.' },
]

export default function Home({
  dailyNumber,
  dailyDone,
  currentStreak,
  continueSystem,
  onPlayDaily,
  onOpenArchive,
  onOpenSystems,
  onContinueStudying,
  onOpenStats,
  onOpenHowTo,
}) {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Medical Connections</h1>
        <p className="tagline">Find what links four clinical concepts. One category at a time.</p>
        {currentStreak > 0 && <div className="home-streak">🔥 {currentStreak} day streak</div>}
      </header>

      <div className="home-actions">
        <button className="icon-btn ghost" onClick={onOpenHowTo}>
          ? How to play
        </button>
        <button className="icon-btn ghost" onClick={onOpenStats}>
          📊 Stats
        </button>
      </div>

      <section className="daily-card">
        <div className="daily-card-text">
          <span className="daily-eyebrow">Daily Puzzle #{dailyNumber}</span>
          <h2>{dailyDone ? '✓ Daily puzzle complete' : "Today's Connections"}</h2>
          <p>
            {dailyDone
              ? 'Nice work. Explore the Archive or a System puzzle below.'
              : 'Find four hidden medical connections. Everyone gets the same puzzle today.'}
          </p>
        </div>
        <button className="primary-btn" onClick={onPlayDaily}>
          {dailyDone ? 'Review today' : 'Play'}
        </button>
      </section>

      {dailyDone && continueSystem && (
        <button className="continue-banner" onClick={onContinueStudying}>
          <span>Continue {continueSystem} →</span>
        </button>
      )}

      <section>
        <h3 className="section-title">Study</h3>
        <p className="section-sub">
          {dailyDone ? 'Browse past puzzles or study by system.' : "Unlocks once you finish today's Daily Connections."}
        </p>
        <div className={`study-grid ${dailyDone ? '' : 'locked'}`}>
          <button className="study-card" onClick={() => dailyDone && onOpenArchive()} disabled={!dailyDone}>
            <span className="study-card-icon">🗓️</span>
            <span className="study-card-title">Archive</span>
            <span className="study-card-blurb">Past Daily Puzzles, review or catch up on missed days.</span>
          </button>
          <button className="study-card" onClick={() => dailyDone && onOpenSystems()} disabled={!dailyDone}>
            <span className="study-card-icon">🫀</span>
            <span className="study-card-title">Systems Library</span>
            <span className="study-card-blurb">Unlimited, replayable puzzles by organ system.</span>
          </button>
          {!dailyDone && (
            <div className="practice-lock-overlay">
              <span>🔒 Complete today's puzzle to unlock</span>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="section-title">Coming soon</h3>
        <p className="section-sub">More ways to play, on the way.</p>
        <div className="coming-soon-row">
          {COMING_SOON.map((c) => (
            <div className="locked-card" key={c.title} title="Coming soon">
              <span className="locked-icon">{c.icon}</span>
              <span className="locked-title">{c.title}</span>
              <span className="locked-blurb">{c.blurb}</span>
              <span className="locked-badge">Coming soon</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
