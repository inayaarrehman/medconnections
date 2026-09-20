import React from 'react'

const COMING_SOON = [
  { icon: '⚡', title: '5-Minute Challenge', blurb: 'Fast rounds, personal bests.' },
  { icon: '🎯', title: 'Weak Spots', blurb: 'Concepts you keep missing, resurfaced.' },
  { icon: '🫀', title: 'Organ Systems', blurb: 'Unlimited puzzles by system.' },
]

export default function Home({
  puzzles,
  dailyNumber,
  dailyDone,
  currentStreak,
  practiceStatus,
  onPlayDaily,
  onPlayPractice,
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
              ? 'Nice work. Review your solved groups, or drop into a practice puzzle below.'
              : 'Find four hidden medical connections. Everyone gets the same puzzle today.'}
          </p>
        </div>
        <button className="primary-btn" onClick={onPlayDaily}>
          {dailyDone ? 'Review today' : 'Play'}
        </button>
      </section>

      <section>
        <h3 className="section-title">Practice puzzles</h3>
        <p className="section-sub">
          {dailyDone
            ? 'Play any set, any time — great for a quick study break.'
            : 'Unlocks once you finish today’s Daily Connections.'}
        </p>
        <div className={`practice-grid ${dailyDone ? '' : 'locked'}`}>
          {puzzles.map((p, i) => {
            const status = practiceStatus[p.id]
            return (
              <button
                className="practice-tile"
                key={p.id}
                onClick={() => dailyDone && onPlayPractice(i)}
                disabled={!dailyDone}
                aria-disabled={!dailyDone}
              >
                <span className="practice-num">Puzzle {i + 1}</span>
                {status === 'won' && <span className="practice-badge won">✓ Solved</span>}
                {status === 'lost' && <span className="practice-badge lost">Retry</span>}
                {status === 'progress' && <span className="practice-badge progress">In progress</span>}
              </button>
            )
          })}
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
