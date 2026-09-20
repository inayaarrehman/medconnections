// MedConnections puzzle bank.
// Each puzzle has 4 categories of 4 items = 16 tiles.
// Difficulty order (like NYT Connections): yellow (easiest) -> green -> blue -> purple (trickiest).
// "level" is just an internal number 1-4 used for color + sort; it does not need to be
// perfectly calibrated, it's a vibe, same as the real thing.

export const DIFFICULTY = [
  { level: 1, name: 'Yellow', color: '#f0c419' },
  { level: 2, name: 'Green', color: '#5aa469' },
  { level: 3, name: 'Blue', color: '#4a90d9' },
  { level: 4, name: 'Purple', color: '#9b6bd4' },
]

const puzzles = [
  {
    id: 'p01',
    title: 'Classic Signs & Associations',
    categories: [
      {
        level: 1,
        title: 'Causes of elevated JVP',
        items: ['Right heart failure', 'Tricuspid regurgitation', 'Cardiac tamponade', 'Constrictive pericarditis'],
      },
      {
        level: 2,
        title: 'HLA-associated diseases',
        items: ['Ankylosing spondylitis', 'Celiac disease', 'Type 1 diabetes', 'Narcolepsy'],
      },
      {
        level: 3,
        title: 'Prolong the QT interval',
        items: ['Amiodarone', 'Hypokalemia', 'Methadone', 'Congenital long QT syndrome'],
      },
      {
        level: 4,
        title: 'Diseases with granulomas',
        items: ['Sarcoidosis', 'Tuberculosis', "Crohn disease", 'Granulomatosis with polyangiitis'],
      },
    ],
  },
  {
    id: 'p02',
    title: 'Eponyms & Animals',
    categories: [
      {
        level: 1,
        title: 'Descriptor involves an animal',
        items: ['Butterfly rash', 'Buffalo hump', "Owl's eye inclusions", 'Elephantiasis'],
      },
      {
        level: 2,
        title: '"___ bodies" (eponymous inclusions)',
        items: ['Lewy', 'Aschoff', 'Councilman', 'Negri'],
      },
      {
        level: 3,
        title: 'Portal ___',
        items: ['Hypertension', 'Vein', 'Triad', 'Hypertensive gastropathy'],
      },
      {
        level: 4,
        title: 'Starts with "hyper" but causes a LOW value',
        items: ['Hyperventilation', 'Hyperparathyroidism', 'Hyperaldosteronism', 'Hyperinsulinemia'],
      },
    ],
  },
  {
    id: 'p03',
    title: 'Places & Passages',
    categories: [
      {
        level: 1,
        title: 'Diseases named after places',
        items: ['Rocky Mountain spotted fever', "Legionnaires' disease", 'Lyme disease', 'West Nile virus'],
      },
      {
        level: 2,
        title: 'Passes through the diaphragm',
        items: ['Aorta', 'Esophagus', 'Inferior vena cava', 'Vagus nerve'],
      },
      {
        level: 3,
        title: 'Fetal structure → adult remnant',
        items: ['Ductus arteriosus', 'Foramen ovale', 'Umbilical vein', 'Ductus venosus'],
      },
      {
        level: 4,
        title: 'Inherited/acquired hypercoagulable states',
        items: ['Factor V Leiden', 'Protein C deficiency', 'Antiphospholipid syndrome', 'Prothrombin G20210A'],
      },
    ],
  },
  {
    id: 'p04',
    title: 'Micro Meets Path',
    categories: [
      {
        level: 1,
        title: 'Acid-fast organisms',
        items: ['Mycobacterium tuberculosis', 'Nocardia asteroides', 'Cryptosporidium parvum', 'Cyclospora cayetanensis'],
      },
      {
        level: 2,
        title: 'Dimorphic fungi',
        items: ['Histoplasma capsulatum', 'Coccidioides immitis', 'Blastomyces dermatitidis', 'Paracoccidioides brasiliensis'],
      },
      {
        level: 3,
        title: 'Spirochetes',
        items: ['Treponema pallidum', 'Borrelia burgdorferi', 'Leptospira interrogans', 'Borrelia recurrentis'],
      },
      {
        level: 4,
        title: 'Obligate intracellular organisms',
        items: ['Rickettsia rickettsii', 'Chlamydia trachomatis', 'Coxiella burnetii', 'Orientia tsutsugamushi'],
      },
    ],
  },
  {
    id: 'p05',
    title: 'Physical Exam Signs',
    categories: [
      {
        level: 1,
        title: 'Signs of appendicitis',
        items: ["McBurney's point tenderness", "Rovsing's sign", 'Psoas sign', 'Obturator sign'],
      },
      {
        level: 2,
        title: 'Signs of meningeal irritation',
        items: ["Kernig's sign", "Brudzinski's sign", 'Nuchal rigidity', 'Jolt accentuation'],
      },
      {
        level: 3,
        title: 'Signs of hypocalcemia',
        items: ["Chvostek's sign", "Trousseau's sign", 'Carpopedal spasm', 'Prolonged QT interval'],
      },
      {
        level: 4,
        title: 'Findings in cardiac tamponade',
        items: ['Pulsus paradoxus', 'Electrical alternans', "Beck's triad", 'Muffled heart sounds'],
      },
    ],
  },
  {
    id: 'p06',
    title: 'Named Things in Pathology',
    categories: [
      {
        level: 1,
        title: 'Eponymous medical triads',
        items: ["Charcot's triad", "Beck's triad", "Virchow's triad", "Cushing's triad"],
      },
      {
        level: 2,
        title: 'Classic imaging descriptions',
        items: ['String of pearls', 'String of beads', 'Honeycombing', 'Ground-glass opacity'],
      },
      {
        level: 3,
        title: 'Eponymous cells in pathology',
        items: ['Reed-Sternberg cells', 'Anitschkow cells', 'Langhans giant cells', 'Touton giant cells'],
      },
      {
        level: 4,
        title: 'Paraneoplastic syndromes',
        items: ['Lambert-Eaton myasthenic syndrome', 'SIADH', 'Ectopic Cushing syndrome', 'Hypercalcemia of malignancy'],
      },
    ],
  },
  {
    id: 'p07',
    title: 'Genetics & Inheritance',
    categories: [
      {
        level: 1,
        title: 'Autosomal dominant conditions',
        items: ['Huntington disease', 'Marfan syndrome', 'Neurofibromatosis type 1', 'Familial hypercholesterolemia'],
      },
      {
        level: 2,
        title: 'Autosomal recessive conditions',
        items: ['Cystic fibrosis', 'Sickle cell disease', 'Phenylketonuria', 'Tay-Sachs disease'],
      },
      {
        level: 3,
        title: 'X-linked recessive conditions',
        items: ['Hemophilia A', 'Duchenne muscular dystrophy', 'G6PD deficiency', 'Red-green color blindness'],
      },
      {
        level: 4,
        title: 'Trinucleotide repeat disorders',
        items: ['Fragile X syndrome', 'Myotonic dystrophy', 'Friedreich ataxia', 'Kennedy disease'],
      },
    ],
  },
  {
    id: 'p08',
    title: 'Onc & Heme',
    categories: [
      {
        level: 1,
        title: 'Leukemias',
        items: ['Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Chronic lymphocytic leukemia', 'Chronic myeloid leukemia'],
      },
      {
        level: 2,
        title: 'Disease-defining translocations',
        items: ['t(9;22) Philadelphia chromosome', 't(15;17)', 't(8;14)', 't(14;18)'],
      },
      {
        level: 3,
        title: 'Tumor markers',
        items: ['CA-125', 'CA 19-9', 'Alpha-fetoprotein', 'CEA'],
      },
      {
        level: 4,
        title: 'Classic lab/pathology findings in leukemia',
        items: ['Auer rods', 'Smudge cells', 'TdT positivity', 'TRAP positivity'],
      },
    ],
  },
  {
    id: 'p09',
    title: 'Toxidromes & Pharm',
    categories: [
      {
        level: 1,
        title: "Anticholinergic toxidrome ('mad, blind, red, dry')",
        items: ['Confusion/delirium', 'Mydriasis', 'Flushed skin', 'Dry mucous membranes'],
      },
      {
        level: 2,
        title: 'Can precipitate serotonin syndrome',
        items: ['SSRIs', 'MAOIs', 'Tramadol', 'Linezolid'],
      },
      {
        level: 3,
        title: 'Antidote',
        items: ['N-acetylcysteine', 'Fomepizole', 'Physostigmine', 'Naloxone'],
      },
      {
        level: 4,
        title: 'Zero-order elimination kinetics',
        items: ['Ethanol', 'Phenytoin', 'Aspirin (high dose)', 'Heparin'],
      },
    ],
  },
  {
    id: 'p10',
    title: 'Congenital & Development',
    categories: [
      {
        level: 1,
        title: 'Cyanotic congenital heart defects',
        items: ['Tetralogy of Fallot', 'Transposition of the great arteries', 'Truncus arteriosus', 'Tricuspid atresia'],
      },
      {
        level: 2,
        title: 'Pharyngeal arch derivatives',
        items: ["Mandible", 'Stapes', 'Greater horn of hyoid', 'Thyroid cartilage'],
      },
      {
        level: 3,
        title: 'TORCH infections',
        items: ['Toxoplasmosis', 'Rubella', 'Cytomegalovirus', 'Herpes simplex virus'],
      },
      {
        level: 4,
        title: 'Neural tube defects',
        items: ['Spina bifida occulta', 'Anencephaly', 'Chiari II malformation', 'Meningomyelocele'],
      },
    ],
  },
]

// Basic integrity check helper (used by the self-test script and, defensively, at runtime).
export function validatePuzzle(p) {
  const errors = []
  if (!p.id) errors.push('missing id')
  if (!p.title) errors.push('missing title')
  if (!Array.isArray(p.categories) || p.categories.length !== 4) {
    errors.push('must have exactly 4 categories')
  } else {
    const allItems = []
    p.categories.forEach((c, i) => {
      if (!c.title) errors.push(`category ${i} missing title`)
      if (!Array.isArray(c.items) || c.items.length !== 4) {
        errors.push(`category ${i} ("${c.title}") must have exactly 4 items`)
      } else {
        c.items.forEach((it) => allItems.push(it))
      }
      if (![1, 2, 3, 4].includes(c.level)) errors.push(`category ${i} has invalid level`)
    })
    if (allItems.length !== 16) errors.push('puzzle must have exactly 16 items total')
    const unique = new Set(allItems.map((s) => s.trim().toLowerCase()))
    if (unique.size !== allItems.length) errors.push('duplicate item text within puzzle')
    const levels = p.categories.map((c) => c.level).sort()
    if (JSON.stringify(levels) !== JSON.stringify([1, 2, 3, 4])) {
      errors.push('categories must use levels 1,2,3,4 exactly once each')
    }
  }
  return errors
}

export default puzzles
