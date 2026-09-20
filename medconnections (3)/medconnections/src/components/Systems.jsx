import React, { useMemo, useState } from 'react'
import { SYSTEMS } from '../puzzles.js'
import { categoriesForSystem, systemMasteryCounts, systemMasterySummary } from '../utils/mastery.js'

const SYSTEM_ICONS = {
  Cardiology: '❤️',
  Pulmonary: '🫁',
  Renal: '🫘',
  GI: '🍽️',
  Neurology: '🧠',
  Endocrine: '🦋',
  'Heme/Onc': '🩸',
  MSK: '🦴',
  Reproductive: '🌸',
  Psychiatry: '🧩',
  Microbiology: '🦠',
  Immunology: '🛡️',
  Dermatology: '🧴',
  Pharmacology: '💊',
  'Biochemistry/Genetics': '🧬',
  'Mixed / Step Review': '🔀',
}

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="mini-progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="mini-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function Systems({ bank, mastery, onPlaySystem, onBack }) {
  const [selected, setSelected] = useState(null)

  const rows = useMemo(
    () =>
      SYSTEMS.map((system) => {
        const { total, mastered } = systemMasteryCounts(bank, system, mastery)
        return { system, total, mastered }
      }),
    [bank, mastery]
  )

  if (selected) {
    const { total, mastered } = systemMasteryCounts(bank, selected, mastery)
    const { strong, needsWork, recent } = systemMasterySummary(bank, selected, mastery)
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

        <div className="system-detail-hero">
          <span className="system-detail-icon">{SYSTEM_ICONS[selected] || '🔬'}</span>
          <div className="system-detail-count">
            {mastered} / {total} <span>connections mastered</span>
          </div>
          <ProgressBar value={mastered} max={total} />
          <button className="primary-btn system-play-btn" onClick={() => onPlaySystem(selected)}>
            Play
          </button>
        </div>

        {(strong.length > 0 || needsWork.length > 0 || recent.length > 0) && (
          <div className="your-system">
            <h3 className="section-title">Your {selected}</h3>
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
          ← Back
        </button>
        <div className="game-header-title">
          <span>Explore Systems</span>
        </div>
        <div />
      </div>

      <div className="system-compact-list">
        {rows.map(({ system, total, mastered }) => {
          const empty = total === 0
          return (
            <button
              key={system}
              className={`system-row ${empty ? 'system-row-empty' : ''}`}
              onClick={() => !empty && setSelected(system)}
              disabled={empty}
            >
              <span className="system-row-icon">{SYSTEM_ICONS[system] || '🔬'}</span>
              <span className="system-row-name">{system}</span>
              {empty ? (
                <span className="system-row-soon">Coming soon</span>
              ) : (
                <>
                  <ProgressBar value={mastered} max={total} />
                  <span className="system-row-count">
                    {mastered}/{total}
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

export { SYSTEM_ICONS, categoriesForSystem }
