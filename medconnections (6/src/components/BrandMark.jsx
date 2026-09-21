import React from 'react'

// The app's one recognizable visual motif: the four difficulty shapes
// (circle, triangle, diamond, square — the same ones used everywhere a
// difficulty is shown without relying on color alone) converging toward a
// single center point. It reads as "four separate things becoming one
// connection" — literally what solving a puzzle does — without borrowing
// a generic medical-cross symbol or any other app's tile/color language.
// Deliberately simple: it has to still read at favicon size.
//
// Used sparingly and on purpose (per product direction): the completion
// moment, loading/empty states, and small app-identity touches — never as
// a persistent decorative header on every screen.
export default function BrandMark({ size = 40, className = '', animate = false, decorative = false }) {
  return (
    <svg
      className={`brand-mark ${animate ? 'brand-mark-assemble' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Medical Connections mark'}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <line x1="10" y1="10" x2="24" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <line x1="38" y1="10" x2="24" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <line x1="10" y1="38" x2="24" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <line x1="38" y1="38" x2="24" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      {/* The four pieces, each in its own group so the completion animation
          (Section 9) can fly each one in from further out and have them
          converge on the center — "four separate ideas becoming one
          connection" — rather than the whole mark simply scaling in as one
          unit. Static (no transform) when `animate` is false. */}
      <g className="brand-piece brand-piece-tl">
        <circle cx="10" cy="10" r="5" fill="var(--difficulty-easy, #bb4c34)" />
      </g>
      <g className="brand-piece brand-piece-tr">
        <polygon points="38,5.5 43.3,14.5 32.7,14.5" fill="var(--difficulty-medium, #0f7a76)" />
      </g>
      <g className="brand-piece brand-piece-br">
        <rect x="33.5" y="33.5" width="9" height="9" rx="1.5" fill="var(--difficulty-hard, #3568c4)" transform="rotate(45 38 38)" />
      </g>
      <g className="brand-piece brand-piece-bl">
        <rect x="5.5" y="33.5" width="9" height="9" rx="2" fill="var(--difficulty-expert, #8c4fc2)" />
      </g>
      <circle className="brand-piece-center" cx="24" cy="24" r="4" fill="currentColor" />
    </svg>
  )
}
