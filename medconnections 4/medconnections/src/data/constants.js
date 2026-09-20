// Difficulty tiers, easiest -> trickiest. An original palette (coral,
// sage, cobalt, plum) rather than NYT's yellow/green/blue/purple — kept in
// sync with the --difficulty-* CSS variables in styles.css.
export const DIFFICULTY = [
  { level: 1, name: 'Coral', color: '#e2664d' },
  { level: 2, name: 'Sage', color: '#2f9174' },
  { level: 3, name: 'Cobalt', color: '#3568c4' },
  { level: 4, name: 'Plum', color: '#8c4fc2' },
]

// The full organ-system library. A system with zero puzzles today still
// shows up (as "coming soon") so the nav doesn't have to change shape as
// content is added.
export const SYSTEMS = [
  'Cardiology',
  'Pulmonary',
  'Renal',
  'Neurology',
  'GI',
  'Endocrine',
  'Heme/Onc',
  'MSK',
  'Reproductive',
  'Psychiatry',
  'Microbiology',
  'Immunology',
  'Dermatology',
  'Pharmacology',
  'Biochemistry/Genetics',
  'Mixed / Step Review',
]

export const PUZZLE_STATUS = ['draft', 'reviewed', 'published']
