// Derived, read-only views over (bank + conceptMastery) for the Organ
// System Library UI. Kept separate from utils/storage.js so storage.js
// stays a pure persistence layer and this stays pure derivation — neither
// needs the other's internals beyond the plain data each already returns.

// All verified bank categories tagged with `system` (a category can list
// more than one system, so it can count toward more than one library).
export function categoriesForSystem(bank, system) {
  return bank.filter((c) => c.status === 'verified' && c.systems.includes(system))
}

// { total, mastered } across every difficulty tier for one system —
// what the system grid and system header both show as "X / Y mastered".
export function systemMasteryCounts(bank, system, mastery) {
  const categories = categoriesForSystem(bank, system)
  const masteredCount = categories.filter((c) => mastery[c.id]?.state === 'mastered').length
  return { total: categories.length, mastered: masteredCount }
}

// Powers the "YOUR {SYSTEM}" section: a few concepts you've mastered
// (Strong), a few you keep missing (Needs work), and a few you've
// touched most recently (Recent) — all titles, not raw category ids.
export function systemMasterySummary(bank, system, mastery) {
  const categories = categoriesForSystem(bank, system)
  const withRecord = categories
    .map((c) => ({ category: c, record: mastery[c.id] }))
    .filter((x) => x.record)

  const strong = withRecord
    .filter((x) => x.record.state === 'mastered')
    .sort((a, b) => (b.record.lastSeenAt || '').localeCompare(a.record.lastSeenAt || ''))
    .slice(0, 3)
    .map((x) => x.category.title)

  const needsWork = withRecord
    .filter((x) => x.record.state !== 'mastered' && x.record.lastResult === 'missed')
    .sort((a, b) => b.record.timesSeen - a.record.timesSeen)
    .slice(0, 3)
    .map((x) => x.category.title)

  const recent = withRecord
    .sort((a, b) => (b.record.lastSeenAt || '').localeCompare(a.record.lastSeenAt || ''))
    .slice(0, 3)
    .map((x) => x.category.title)

  return { strong, needsWork, recent }
}

// Every system that has at least one verified category — used to build
// the compact, scannable system grid without hard-coding which systems
// currently have content.
export function systemsWithContent(bank, systemsList) {
  return systemsList.filter((s) => categoriesForSystem(bank, s).length > 0)
}
