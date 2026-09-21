import React, { useMemo, useState } from 'react'
import { SYSTEMS } from '../puzzles.js'
import { categoriesForSystem, systemMasteryCounts, systemMasterySummary } from '../utils/mastery.js'

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="mini-progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="mini-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function Systems({ bank, mastery, onPlaySystem, onBack, playNotice, onDismissPlayNotice }) {
  const [selected, setSelected] = useState(null)

  const rows = useMemo(
    () =>
      SYSTEMS.map((system) => {
        const { total, solved } = systemMasteryCounts(bank, system, mastery)
        return { system, total, solved }
      }),
    [bank, mastery]
  )

  if (selected) {
    const { total, solved } = systemMasteryCounts(bank, selected, mastery)
    const { strong, needsWork, recent } = systemMasterySummary(bank, selected, mastery)
    return (
      <div className="systems">
        <div className="game-header">
          <button className="icon-btn" onClick={() => setSelected(null)} aria-label="Back">
            &larr; Systems
          </button>
          <div className="game-header-title">
            <span>{selected}</span>
          </div>
          <div />
        </div>

        <div className="system-detail">
          <h1 className="system-detail-title">{selected}</h1>
          <p className="system-detail-count">
            {solved} of {total} connections solved
          </p>
          <ProgressBar value={solved} max={total} />
          {playNotice && (
            <p className="system-play-notice" role="status">
              {playNotice}{' '}
              <button className="link-btn" onClick={onDismissPlayNotice}>
                Dismiss
              </button>
            </p>
          )}
          <button className="primary-btn system-play-btn" onClick={() => onPlaySystem(selected)}>
            Play
          </button>
        </div>

        {(strong.length > 0 || needsWork.length > 0 || recent.length > 0) && (
          <div className="your-system">
            <h2 className="home-section-heading">Your {selected}</h2>
            {strong.length > 0 && (
              <div className="your-system-row">
                <span className="your-system-label strong">Strong</span>
                <span className="your-system-values">{strong.join(', ')}</span>
              </div>
            )}
            {needsWork.length > 0 && (
              <div className="your-system-row">
                <span className="your-system-label needs-work">Needs work</span>
                <span className="your-system-values">{needsWork.join(', ')}</span>
              </div>
            )}
            {recent.length > 0 && (
              <div className="your-system-row">
                <span className="your-system-label recent">Recent</span>
                <span className="your-system-values">{recent.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="systems">
      <div className="game-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          &larr; Back
        </button>
        <div className="game-header-title">
          <span>Systems</span>
        </div>
        <div />
      </div>

      <div className="system-compact-list">
        {rows.map(({ system, total, solved }) => {
          const empty = total === 0
          return (
            <button
              key={system}
              className={`system-row ${empty ? 'system-row-empty' : ''}`}
              onClick={() => !empty && setSelected(system)}
              disabled={empty}
            >
              <span className="system-row-name">{system}</span>
              {empty ? (
                <span className="system-row-soon">Coming soon</span>
              ) : (
                <>
                  <ProgressBar value={solved} max={total} />
                  <span className="system-row-count">
                    {solved}/{total}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { categoriesForSystem }
