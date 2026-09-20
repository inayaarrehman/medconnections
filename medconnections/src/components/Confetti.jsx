import React, { useMemo } from 'react'

const COLORS = ['#f0c419', '#5aa469', '#4a90d9', '#9b6bd4', '#ff8fa3']

export default function Confetti({ count = 60 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 6,
      })),
    [count]
  )

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: p.size,
            height: p.size * 0.5,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
