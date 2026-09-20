// Difficulty tiers, same convention as NYT Connections: yellow (easiest) -> purple (trickiest).
export const DIFFICULTY = [
  { level: 1, name: 'Yellow', color: '#f0c419' },
  { level: 2, name: 'Green', color: '#5aa469' },
  { level: 3, name: 'Blue', color: '#4a90d9' },
  { level: 4, name: 'Purple', color: '#9b6bd4' },
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
