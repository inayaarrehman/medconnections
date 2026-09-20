import React, { useState } from 'react'
import { DIFFICULTY } from '../puzzles.js'

const levelColor = (level) => DIFFICULTY.find((d) => d.level === level)?.color || '#888'
const levelName = (level) => DIFFICULTY.find((d) => d.level === level)?.name || ''

export default function ReviewConnections({ puzzle }) {
  const [openIndex, setOpenIndex] = useState(null)

  const ordered = puzzle.categories
    .map((c, i) => ({ ...c, catIndex: i }))
    .sort((a, b) => a.level - b.level)

  return (
    <div className="review-panel">
      {ordered.map((cat) => {
        const isOpen = openIndex === cat.catIndex
        return (
          <div className="accordion-item" key={cat.catIndex}>
            <button
              className="accordion-header"
              style={{ borderLeftColor: levelColor(cat.level) }}
              onClick={() => setOpenIndex(isOpen ? null : cat.catIndex)}
              aria-expanded={isOpen}
            >
              <span className="accordion-level" style={{ color: levelColor(cat.level) }}>
                {levelName(cat.level)}
              </span>
              <span className="accordion-title">{cat.title}</span>
              <span className="accordion-caret">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="accordion-body">
                <p className="accordion-explanation">{cat.explanation}</p>
                <ul className="accordion-item-list">
                  {cat.items.map((item) => (
                    <li key={item.term}>
                      <strong>{item.term}</strong>
                      <span>{item.why}</span>
                    </li>
                  ))}
                </ul>
                <p className="remember-line">
                  <span className="remember-label">Remember this</span>
                  {cat.remember}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
