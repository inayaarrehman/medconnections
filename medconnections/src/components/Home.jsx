import React from 'react'

export default function Home({
  puzzles,
  dailyIndex,
  dailyNumber,
  dailyDone,
  practiceStatus,
  onPlayDaily,
  onPlayPractice,
  onOpenStats,
  onOpenHowTo,
}) {
  return (
    <div className="home">
      <header className="home-header">
        <h1>
          Med<span className="accent">Connections</span>
        </h1>
        <p className="tagline">Find what links four clinical concepts. One category at a time.</p>
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
          <h2>{dailyDone ? "You've solved today's puzzle" : "Today's connections"}</h2>
          <p>A new set drops every day at midnight. Four categories, sixteen terms, one shot at a clean streak.</p>
        </div>
        <button className="primary-btn" onClick={onPlayDaily}>
          {dailyDone ? 'Review today' : 'Play'}
        </button>
      </section>

      <section>
        <h3 className="section-title">Practice puzzles</h3>
        <p className="section-sub">Play any set, any time — great for a quick study break.</p>
        <div className="practice-grid">
          {puzzles.map((p, i) => {
            const status = practiceStatus[p.id]
            return (
              <button className="practice-tile" key={p.id} onClick={() => onPlayPractice(i)}>
                <span className="practice-num">Puzzle {i + 1}</span>
                {status === 'won' && <span className="practice-badge won">✓ Solved</span>}
                {status === 'lost' && <span className="practice-badge lost">Retry</span>}
                {status === 'progress' && <span className="practice-badge progress">In progress</span>}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
