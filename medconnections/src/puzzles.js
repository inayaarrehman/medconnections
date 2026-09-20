// Medical Connections puzzle bank.
// Each puzzle has 4 categories of 4 items = 16 tiles.
// Difficulty order (like NYT Connections): yellow (easiest) -> green -> blue -> purple (trickiest).
//
// Each category carries:
//   - title: the hidden connection, revealed only after the group is solved
//   - explanation: one or two sentences on WHY these four belong together
//   - remember: one high-yield takeaway sentence
//   - items: [{ term, why }] — term is what shows on the tile, why is a one-line
//     rationale for that specific item, shown in the post-game Review panel

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
        explanation:
          "Anything that backs blood up into the right atrium — pump failure, valve failure, or a pericardium that won't let the heart fill — shows up as a distended neck vein.",
        remember: 'Elevated JVP = something is stopping blood from getting into (or through) the right heart.',
        items: [
          { term: 'Right heart failure', why: 'Systemic venous congestion backs up into the jugular veins.' },
          { term: 'Tricuspid regurgitation', why: 'Blood regurgitates into the right atrium, raising venous pressure.' },
          { term: 'Cardiac tamponade', why: 'Pericardial fluid restricts right-sided filling, raising venous pressure.' },
          { term: 'Constrictive pericarditis', why: 'A rigid pericardium limits diastolic filling, raising venous pressure.' },
        ],
      },
      {
        level: 2,
        title: 'HLA-associated diseases',
        explanation:
          'Each of these autoimmune/immune-mediated conditions has a well-known HLA allele association that shows up constantly on exams.',
        remember: 'HLA associations are board-favorite pairings — B27, DQ2/8, DR3/4, and DQB1*06:02 are the ones to know.',
        items: [
          { term: 'Ankylosing spondylitis', why: 'Strongly linked to HLA-B27.' },
          { term: 'Celiac disease', why: 'Linked to HLA-DQ2/DQ8.' },
          { term: 'Type 1 diabetes', why: 'Linked to HLA-DR3/DR4.' },
          { term: 'Narcolepsy', why: 'Linked to HLA-DQB1*06:02.' },
        ],
      },
      {
        level: 3,
        title: 'Prolong the QT interval',
        explanation:
          'All four slow ventricular repolarization — through drugs, electrolytes, or inherited channel defects — and share the same downstream risk: torsades de pointes.',
        remember: 'Anything that delays repolarization (drug, lyte, or gene) prolongs QT and risks torsades.',
        items: [
          { term: 'Amiodarone', why: 'A class III antiarrhythmic that blocks potassium channels, prolonging repolarization.' },
          { term: 'Hypokalemia', why: 'Low potassium delays repolarization.' },
          { term: 'Methadone', why: 'Blocks the cardiac hERG potassium channel.' },
          { term: 'Congenital long QT syndrome', why: 'Inherited ion channel mutations delay repolarization.' },
        ],
      },
      {
        level: 4,
        title: 'Diseases with granulomas',
        explanation:
          "Granulomas are the immune system's way of walling off something it can't clear — an organism, foreign material, or in autoimmune disease, itself.",
        remember: 'Granulomas are not just TB — sarcoid, Crohn, and GPA all wall things off too.',
        items: [
          { term: 'Sarcoidosis', why: 'Non-caseating granulomas, classically pulmonary/hilar.' },
          { term: 'Tuberculosis', why: 'Caseating granulomas containing acid-fast bacilli.' },
          { term: 'Crohn disease', why: 'Non-caseating granulomas anywhere along the GI tract.' },
          { term: 'Granulomatosis with polyangiitis', why: 'Necrotizing granulomas of the respiratory tract and kidneys.' },
        ],
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
        explanation:
          "Medicine borrows animal imagery whenever a finding looks like one — an odd but effective way to remember a distinctive exam or pathology finding.",
        remember: 'When a finding gets an animal nickname, picture the animal — it usually nails the finding.',
        items: [
          { term: 'Butterfly rash', why: "The malar rash of lupus, shaped like a butterfly across the cheeks and nose." },
          { term: 'Buffalo hump', why: 'Dorsocervical fat pad of Cushing syndrome.' },
          { term: "Owl's eye inclusions", why: "CMV-infected cells show a large owl's-eye intranuclear inclusion." },
          { term: 'Elephantiasis', why: "Chronic lymphatic filariasis causes massive limb swelling resembling an elephant's leg." },
        ],
      },
      {
        level: 2,
        title: '"___ bodies" (eponymous inclusions)',
        explanation:
          "Pathologists love naming inclusion bodies after whoever first described them — each is a microscopic signature of one specific disease.",
        remember: "A named 'body' on a slide is shorthand for one disease — learn the pairing, not the person.",
        items: [
          { term: 'Lewy', why: 'Alpha-synuclein inclusions in Parkinson disease and Lewy body dementia.' },
          { term: 'Aschoff', why: 'Granulomas found in the myocardium in rheumatic fever.' },
          { term: 'Councilman', why: 'Apoptotic hepatocytes seen in viral hepatitis and yellow fever.' },
          { term: 'Negri', why: 'Cytoplasmic inclusions in neurons infected with rabies virus.' },
        ],
      },
      {
        level: 3,
        title: 'Portal ___',
        explanation:
          "'Portal' describes the liver's unique blood-supply system — a second capillary bed between two veins — and everything downstream of it when that system backs up.",
        remember: "'Portal' always points back to blood flowing gut to liver, and what happens when that flow is blocked.",
        items: [
          { term: 'Hypertension', why: 'Elevated pressure in the portal venous system, usually from cirrhosis.' },
          { term: 'Vein', why: 'Carries nutrient-rich blood from the gut to the liver.' },
          { term: 'Triad', why: 'Portal vein, hepatic artery, and bile duct traveling together at the liver edge.' },
          { term: 'Hypertensive gastropathy', why: "Mucosal congestion from portal hypertension, causing a 'snakeskin' stomach lining." },
        ],
      },
      {
        level: 4,
        title: 'Starts with "hyper" but causes a LOW value',
        explanation:
          "Each condition's name describes what's overactive — the hormone, drive, or process — not the lab value that results from it.",
        remember: "Don't let the prefix fool you — 'hyper-' describes the driver, not always the number it produces.",
        items: [
          { term: 'Hyperventilation', why: 'Blowing off CO2 faster than it is produced causes hypocapnia.' },
          { term: 'Hyperparathyroidism', why: 'Excess PTH increases renal phosphate wasting, causing hypophosphatemia.' },
          { term: 'Hyperaldosteronism', why: 'Excess aldosterone drives renal potassium wasting, causing hypokalemia.' },
          { term: 'Hyperinsulinemia', why: 'Excess insulin drives cellular glucose uptake, causing hypoglycemia.' },
        ],
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
        explanation:
          'Geography is one of medicine\'s favorite naming conventions — usually marking where a disease was first identified or a notable outbreak occurred.',
        remember: "A place-name diagnosis just marks discovery location, not where you're likely to catch it today.",
        items: [
          { term: 'Rocky Mountain spotted fever', why: 'Rickettsia rickettsii, first recognized in the Rocky Mountain region.' },
          { term: "Legionnaires' disease", why: "Named after an outbreak at a 1976 American Legion convention in Philadelphia." },
          { term: 'Lyme disease', why: 'First identified in Lyme, Connecticut.' },
          { term: 'West Nile virus', why: 'First isolated in the West Nile district of Uganda.' },
        ],
      },
      {
        level: 2,
        title: 'Passes through the diaphragm',
        explanation:
          '"I ate ten eggs at twelve" — the diaphragm has three major openings, each at a different vertebral level, each carrying specific structures.',
        remember: 'T8 = vena cava, T10 = esophagus (+vagus), T12 = aorta (+thoracic duct, azygous vein).',
        items: [
          { term: 'Aorta', why: 'Passes through the aortic hiatus at T12.' },
          { term: 'Esophagus', why: 'Passes through the esophageal hiatus at T10, alongside the vagus nerve.' },
          { term: 'Inferior vena cava', why: 'Passes through the caval opening at T8.' },
          { term: 'Vagus nerve', why: 'Travels with the esophagus through the esophageal hiatus at T10.' },
        ],
      },
      {
        level: 3,
        title: 'Fetal structure → adult remnant',
        explanation:
          'Fetal circulation bypasses the lungs and liver using shunts that close after birth and persist as fibrous cords or scars.',
        remember: 'Every fetal shunt leaves an adult remnant — closure is what changes, not disappearance.',
        items: [
          { term: 'Ductus arteriosus', why: 'Becomes the ligamentum arteriosum after birth.' },
          { term: 'Foramen ovale', why: 'Becomes the fossa ovalis once it seals.' },
          { term: 'Umbilical vein', why: 'Becomes the ligamentum teres hepatis.' },
          { term: 'Ductus venosus', why: 'Becomes the ligamentum venosum.' },
        ],
      },
      {
        level: 4,
        title: 'Inherited/acquired hypercoagulable states',
        explanation:
          'Each of these tips the coagulation balance toward clotting, whether by resisting anticoagulant proteins or by outright autoantibody attack.',
        remember: 'Recurrent clots in a young patient? Think inherited/acquired thrombophilia workup.',
        items: [
          { term: 'Factor V Leiden', why: 'Factor V resistant to degradation by protein C, the most common inherited thrombophilia.' },
          { term: 'Protein C deficiency', why: 'Reduced ability to inactivate factors Va and VIIIa.' },
          { term: 'Antiphospholipid syndrome', why: 'Autoantibodies promote clotting; acquired, often with lupus.' },
          { term: 'Prothrombin G20210A', why: 'A mutation that increases prothrombin levels.' },
        ],
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
        explanation:
          'Acid-fastness comes from a lipid-rich cell wall (mycobacteria) or a resistant oocyst wall (some parasites) that holds onto stain despite an acid wash.',
        remember: 'Acid-fast is not just TB — Nocardia, Cryptosporidium, and Cyclospora all stain the same way.',
        items: [
          { term: 'Mycobacterium tuberculosis', why: 'Waxy mycolic acid cell wall resists Gram stain but retains carbol fuchsin.' },
          { term: 'Nocardia asteroides', why: 'Partially acid-fast, unlike its look-alike Actinomyces.' },
          { term: 'Cryptosporidium parvum', why: 'Acid-fast oocysts seen in stool of immunocompromised patients.' },
          { term: 'Cyclospora cayetanensis', why: 'Acid-fast oocysts causing prolonged watery diarrhea.' },
        ],
      },
      {
        level: 2,
        title: 'Dimorphic fungi',
        explanation:
          'Dimorphic fungi live as mold in the cool environment and convert to yeast at body temperature — each with its own geographic hotspot.',
        remember: 'Dimorphic = mold in the cold, yeast in the heat — and each one has a home region.',
        items: [
          { term: 'Histoplasma capsulatum', why: 'Found in Ohio/Mississippi River valley soil, associated with bird/bat droppings.' },
          { term: 'Coccidioides immitis', why: "Found in the desert Southwest; causes 'Valley fever.'" },
          { term: 'Blastomyces dermatitidis', why: 'Found in the central/eastern US and Great Lakes region.' },
          { term: 'Paracoccidioides brasiliensis', why: "Found in Latin America; causes a 'captain's wheel' yeast pattern." },
        ],
      },
      {
        level: 3,
        title: 'Spirochetes',
        explanation:
          'Spirochetes share a distinctive corkscrew shape that lets them move through tissue and evade easy staining.',
        remember: 'Thin, coiled, and hard to Gram stain — think spirochete, then narrow by exposure history.',
        items: [
          { term: 'Treponema pallidum', why: 'Causes syphilis; too thin to see on Gram stain, needs dark-field microscopy.' },
          { term: 'Borrelia burgdorferi', why: 'Causes Lyme disease, transmitted by Ixodes ticks.' },
          { term: 'Leptospira interrogans', why: 'Causes leptospirosis, transmitted via animal urine-contaminated water.' },
          { term: 'Borrelia recurrentis', why: 'Causes relapsing fever, transmitted by lice.' },
        ],
      },
      {
        level: 4,
        title: 'Obligate intracellular organisms',
        explanation:
          'These organisms depend on host cell machinery (often ATP) to survive, so they cannot be cultured on standard bacterial media.',
        remember: 'If it cannot be cultured outside a cell, think Rickettsia, Chlamydia, Coxiella, or Orientia.',
        items: [
          { term: 'Rickettsia rickettsii', why: "Can't make its own ATP; must live inside host cells." },
          { term: 'Chlamydia trachomatis', why: 'Lacks the machinery to make its own ATP outside a host cell.' },
          { term: 'Coxiella burnetii', why: 'Survives inside phagolysosomes of host cells; causes Q fever.' },
          { term: 'Orientia tsutsugamushi', why: 'Causes scrub typhus; obligate intracellular like other rickettsiae.' },
        ],
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
        explanation:
          'Each sign reflects peritoneal or muscular irritation from an inflamed appendix in a particular anatomic position.',
        remember: 'Appendix position changes which sign shows up — retrocecal leads to psoas, pelvic leads to obturator.',
        items: [
          { term: "McBurney's point tenderness", why: 'Maximal tenderness one-third from the ASIS to the umbilicus.' },
          { term: "Rovsing's sign", why: 'Palpating the left lower quadrant causes right lower quadrant pain.' },
          { term: 'Psoas sign', why: 'Pain on hip extension suggests a retrocecal inflamed appendix irritating the psoas.' },
          { term: 'Obturator sign', why: 'Pain on internal rotation of the flexed hip suggests a pelvic appendix.' },
        ],
      },
      {
        level: 2,
        title: 'Signs of meningeal irritation',
        explanation:
          'Inflamed meninges hurt when stretched, so anything that stretches the spinal cord or its coverings reproduces pain or reflex guarding.',
        remember: 'Meningismus signs all work by stretching irritated meninges one way or another.',
        items: [
          { term: "Kernig's sign", why: 'Pain/resistance on knee extension with the hip flexed.' },
          { term: "Brudzinski's sign", why: 'Passive neck flexion causes involuntary hip/knee flexion.' },
          { term: 'Nuchal rigidity', why: 'Resistance to passive neck flexion.' },
          { term: 'Jolt accentuation', why: 'Headache worsens with horizontal head rotation.' },
        ],
      },
      {
        level: 3,
        title: 'Signs of hypocalcemia',
        explanation:
          'Calcium stabilizes neuromuscular membranes — take it away and nerves/muscles fire too easily, and the heart\'s repolarization slows.',
        remember: 'Low calcium means irritable nerves and muscles (Chvostek, Trousseau, spasm) plus a longer QT.',
        items: [
          { term: "Chvostek's sign", why: 'Tapping the facial nerve causes facial muscle twitching.' },
          { term: "Trousseau's sign", why: 'Inflating a BP cuff above systolic causes carpal spasm.' },
          { term: 'Carpopedal spasm', why: 'Sustained contraction of hand/foot muscles from neuromuscular irritability.' },
          { term: 'Prolonged QT interval', why: 'Low calcium delays ventricular repolarization.' },
        ],
      },
      {
        level: 4,
        title: 'Findings in cardiac tamponade',
        explanation:
          'Fluid compressing the heart from outside restricts filling and muffles both its sounds and its normal beat-to-beat consistency.',
        remember: 'Tamponade squeezes the heart from outside — filling drops, sounds muffle, and the axis wobbles beat to beat.',
        items: [
          { term: 'Pulsus paradoxus', why: 'An exaggerated drop in systolic BP with inspiration.' },
          { term: 'Electrical alternans', why: 'Beat-to-beat QRS amplitude variation from the heart swinging in fluid.' },
          { term: "Beck's triad", why: 'Hypotension, JVD, and muffled heart sounds.' },
          { term: 'Muffled heart sounds', why: 'Pericardial fluid dampens transmitted heart sounds.' },
        ],
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
        explanation: 'Each triad is a memorable three-finding pattern pointing to one specific diagnosis.',
        remember: 'A named triad is a diagnosis shortcut — learn the three findings as a set, not separately.',
        items: [
          { term: "Charcot's triad", why: 'Fever, jaundice, and RUQ pain — ascending cholangitis.' },
          { term: "Beck's triad", why: 'Hypotension, JVD, and muffled heart sounds — tamponade.' },
          { term: "Virchow's triad", why: 'Stasis, endothelial injury, and hypercoagulability — thrombosis risk.' },
          { term: "Cushing's triad", why: 'Hypertension, bradycardia, and irregular respirations — rising ICP.' },
        ],
      },
      {
        level: 2,
        title: 'Classic imaging descriptions',
        explanation:
          'Radiology loves a good visual metaphor — each phrase is shorthand for a specific, recognizable imaging pattern.',
        remember: 'Learn the picture the phrase paints, and the diagnosis usually follows.',
        items: [
          { term: 'String of pearls', why: "Dilated ovarian follicles arranged around the ovary's edge in PCOS." },
          { term: 'String of beads', why: 'Alternating stenosis and dilation of the renal artery in fibromuscular dysplasia.' },
          { term: 'Honeycombing', why: 'Subpleural cystic airspaces seen in usual interstitial pneumonia/pulmonary fibrosis.' },
          { term: 'Ground-glass opacity', why: 'Hazy increased lung density, classic for Pneumocystis pneumonia (also COVID).' },
        ],
      },
      {
        level: 3,
        title: 'Eponymous cells in pathology',
        explanation:
          'Each named cell type is a microscopic fingerprint that helps pathologists pin down a specific disease at a glance.',
        remember: 'A named giant/inclusion cell is pattern recognition at the microscope — learn cell shape, then disease.',
        items: [
          { term: 'Reed-Sternberg cells', why: "Binucleate 'owl-eye' cells diagnostic of Hodgkin lymphoma." },
          { term: 'Anitschkow cells', why: 'Activated macrophages with caterpillar-shaped nuclei, found in Aschoff bodies in rheumatic fever.' },
          { term: 'Langhans giant cells', why: 'Multinucleated macrophages with peripherally arranged nuclei, seen in TB granulomas.' },
          { term: 'Touton giant cells', why: 'Multinucleated cells with a wreath of nuclei around a foamy center, seen in xanthomas.' },
        ],
      },
      {
        level: 4,
        title: 'Paraneoplastic syndromes',
        explanation:
          "Tumors can act at a distance — secreting hormone-like substances or triggering autoimmunity — causing symptoms unrelated to the tumor's physical location.",
        remember: 'Lung cancer is the paraneoplastic overachiever — know which cell type causes which syndrome.',
        items: [
          { term: 'Lambert-Eaton myasthenic syndrome', why: 'Antibodies against presynaptic calcium channels, classically with small cell lung cancer.' },
          { term: 'SIADH', why: 'Ectopic ADH secretion, classically from small cell lung cancer.' },
          { term: 'Ectopic Cushing syndrome', why: 'Ectopic ACTH secretion, classically from small cell lung cancer.' },
          { term: 'Hypercalcemia of malignancy', why: 'PTHrP secretion, classically from squamous cell lung cancer.' },
        ],
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
        explanation:
          'One mutated copy is enough to cause disease — often affecting a structural protein or a dose-sensitive pathway.',
        remember: 'AD conditions need just one bad copy — think structural proteins and growth-regulating genes.',
        items: [
          { term: 'Huntington disease', why: 'CAG repeat expansion; one copy causes disease.' },
          { term: 'Marfan syndrome', why: 'Fibrillin-1 mutation affecting connective tissue.' },
          { term: 'Neurofibromatosis type 1', why: 'NF1 tumor suppressor mutation.' },
          { term: 'Familial hypercholesterolemia', why: 'LDL receptor mutation raising LDL from birth.' },
        ],
      },
      {
        level: 2,
        title: 'Autosomal recessive conditions',
        explanation:
          'These are typically enzyme or transporter deficiencies — a single working copy usually makes enough protein to prevent disease.',
        remember: 'AR conditions usually knock out an enzyme — one working copy is usually enough to compensate.',
        items: [
          { term: 'Cystic fibrosis', why: 'CFTR mutation; needs two mutated copies.' },
          { term: 'Sickle cell disease', why: 'Beta-globin mutation; needs two copies for disease.' },
          { term: 'Phenylketonuria', why: 'Phenylalanine hydroxylase deficiency; needs two copies.' },
          { term: 'Tay-Sachs disease', why: 'Hexosaminidase A deficiency; needs two copies.' },
        ],
      },
      {
        level: 3,
        title: 'X-linked recessive conditions',
        explanation:
          'With only one X chromosome, males need just one mutated copy to show disease — these conditions cluster heavily in men.',
        remember: 'X-linked recessive: sons of carrier mothers are the ones who get sick.',
        items: [
          { term: 'Hemophilia A', why: 'Factor VIII deficiency; mostly affects males.' },
          { term: 'Duchenne muscular dystrophy', why: 'Dystrophin mutation; mostly affects males.' },
          { term: 'G6PD deficiency', why: 'Glucose-6-phosphate dehydrogenase deficiency; mostly affects males.' },
          { term: 'Red-green color blindness', why: 'Opsin gene mutation on the X chromosome; mostly affects males.' },
        ],
      },
      {
        level: 4,
        title: 'Trinucleotide repeat disorders',
        explanation:
          'These diseases share a mechanism, not an inheritance pattern — an unstable repeated DNA sequence that expands and can worsen across generations.',
        remember: "Repeat disorders often get worse each generation — that's called anticipation.",
        items: [
          { term: 'Fragile X syndrome', why: 'CGG repeat expansion on the X chromosome.' },
          { term: 'Myotonic dystrophy', why: 'CTG repeat expansion.' },
          { term: 'Friedreich ataxia', why: 'GAA repeat expansion — an exception that is autosomal recessive.' },
          { term: 'Kennedy disease', why: 'CAG repeat expansion; X-linked spinobulbar muscular atrophy.' },
        ],
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
        explanation:
          'Leukemias are named by cell line (lymphoid vs myeloid) and pace (acute vs chronic) — each combination has a classic age group and marker.',
        remember: 'Kids get ALL, adults with Auer rods get AML, smudge cells mean CLL, Philadelphia chromosome means CML.',
        items: [
          { term: 'Acute lymphoblastic leukemia', why: 'Most common childhood leukemia; lymphoblasts crowd the marrow.' },
          { term: 'Acute myeloid leukemia', why: 'Myeloblasts, often with Auer rods; more common in adults.' },
          { term: 'Chronic lymphocytic leukemia', why: 'Mature-appearing lymphocytes with smudge cells; older adults.' },
          { term: 'Chronic myeloid leukemia', why: 'Driven by the Philadelphia chromosome; overproduction of granulocytes.' },
        ],
      },
      {
        level: 2,
        title: 'Disease-defining translocations',
        explanation: 'Each translocation fuses two genes into a fusion product that drives a specific, named blood cancer.',
        remember: 'A translocation is often the diagnosis — memorize the pairing, not just the number.',
        items: [
          { term: 't(9;22) Philadelphia chromosome', why: 'BCR-ABL fusion, defines chronic myeloid leukemia.' },
          { term: 't(15;17)', why: 'PML-RARA fusion, defines acute promyelocytic leukemia.' },
          { term: 't(8;14)', why: 'MYC-IGH fusion, defines Burkitt lymphoma.' },
          { term: 't(14;18)', why: 'BCL2-IGH fusion, defines follicular lymphoma.' },
        ],
      },
      {
        level: 3,
        title: 'Tumor markers',
        explanation:
          'Tumor markers are proteins a cancer sheds into the blood — useful for monitoring treatment response more than screening.',
        remember: 'Tumor markers track disease; they rarely diagnose it on their own.',
        items: [
          { term: 'CA-125', why: 'Elevated in ovarian cancer.' },
          { term: 'CA 19-9', why: 'Elevated in pancreatic cancer.' },
          { term: 'Alpha-fetoprotein', why: 'Elevated in hepatocellular carcinoma and yolk sac tumors.' },
          { term: 'CEA', why: 'Elevated in colorectal cancer, though nonspecific.' },
        ],
      },
      {
        level: 4,
        title: 'Classic lab/pathology findings in leukemia',
        explanation: 'Each finding is a lab or smear clue pathologists use to pin a leukemia diagnosis at the bench.',
        remember: 'Auer rods mean AML, smudge cells mean CLL, TdT means ALL, TRAP means hairy cell.',
        items: [
          { term: 'Auer rods', why: 'Needle-like cytoplasmic inclusions in AML blasts.' },
          { term: 'Smudge cells', why: 'Fragile lymphocytes that rupture during a blood smear in CLL.' },
          { term: 'TdT positivity', why: 'Marker of immature lymphoblasts, positive in ALL.' },
          { term: 'TRAP positivity', why: 'Tartrate-resistant acid phosphatase, positive in hairy cell leukemia.' },
        ],
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
        explanation:
          'Blocking muscarinic receptors everywhere at once produces this whole-body constellation, classically from antihistamines, TCAs, or plant alkaloids.',
        remember: "The anticholinergic mnemonic ('mad, blind, red, dry, hot') is a whole toxidrome in five words.",
        items: [
          { term: 'Confusion/delirium', why: "'Mad as a hatter' — central muscarinic blockade." },
          { term: 'Mydriasis', why: "'Blind as a bat' — pupillary sphincter blockade." },
          { term: 'Flushed skin', why: "'Red as a beet' — cutaneous vasodilation." },
          { term: 'Dry mucous membranes', why: "'Dry as a bone' — blocked secretions." },
        ],
      },
      {
        level: 2,
        title: 'Can precipitate serotonin syndrome',
        explanation:
          'Any drug that raises synaptic serotonin can push a patient into serotonin syndrome, especially when combined with another serotonergic agent.',
        remember: 'Serotonin syndrome risk rises whenever two serotonin-raising drugs are combined — even unexpected ones like linezolid.',
        items: [
          { term: 'SSRIs', why: 'Increase synaptic serotonin by blocking reuptake.' },
          { term: 'MAOIs', why: 'Prevent serotonin breakdown, sharply raising levels.' },
          { term: 'Tramadol', why: 'Weak opioid with added serotonergic activity.' },
          { term: 'Linezolid', why: 'An antibiotic that also inhibits monoamine oxidase.' },
        ],
      },
      {
        level: 3,
        title: 'Antidote',
        explanation:
          'Each antidote works by directly countering its toxin\'s mechanism — replenishing what\'s depleted or blocking what\'s overactive.',
        remember: "Match the antidote to the mechanism it blocks, not just the drug it's 'for.'",
        items: [
          { term: 'N-acetylcysteine', why: 'Antidote for acetaminophen toxicity; replenishes glutathione.' },
          { term: 'Fomepizole', why: 'Antidote for methanol/ethylene glycol; blocks alcohol dehydrogenase.' },
          { term: 'Physostigmine', why: 'Antidote for anticholinergic toxicity; boosts acetylcholine.' },
          { term: 'Naloxone', why: 'Antidote for opioid overdose; competitive opioid receptor antagonist.' },
        ],
      },
      {
        level: 4,
        title: 'Zero-order elimination kinetics',
        explanation:
          'Once the enzyme or clearance system handling these drugs is saturated, a constant AMOUNT (not percentage) is cleared per unit time.',
        remember: 'PEA(H): Phenytoin, Ethanol, Aspirin (in overdose), Heparin — the classic zero-order drugs.',
        items: [
          { term: 'Ethanol', why: 'Eliminated at a constant rate regardless of concentration.' },
          { term: 'Phenytoin', why: 'Follows zero-order kinetics at therapeutic-to-toxic doses.' },
          { term: 'Aspirin (high dose)', why: 'Switches to zero-order kinetics in overdose.' },
          { term: 'Heparin', why: 'Cleared by saturable mechanisms, giving zero-order-like kinetics.' },
        ],
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
        explanation: 'Each defect lets deoxygenated blood bypass the lungs and reach systemic circulation directly, causing cyanosis.',
        remember: 'Cyanotic heart defects all share one theme: blood skips the lungs.',
        items: [
          { term: 'Tetralogy of Fallot', why: 'Most common cyanotic congenital heart defect.' },
          { term: 'Transposition of the great arteries', why: 'Aorta and pulmonary artery are swapped, creating two parallel circuits.' },
          { term: 'Truncus arteriosus', why: 'A single great vessel fails to separate into aorta and pulmonary artery.' },
          { term: 'Tricuspid atresia', why: "No tricuspid valve forms, so blood can't flow right atrium to right ventricle." },
        ],
      },
      {
        level: 2,
        title: 'Pharyngeal arch derivatives',
        explanation:
          'Each pharyngeal arch carries its own cartilage, nerve, and muscle — arch number predicts which adult structure it becomes.',
        remember: 'Pharyngeal arch number maps to a specific bone/cartilage: 1st jaw, 2nd ear, 3rd/4th-6th throat.',
        items: [
          { term: 'Mandible', why: "Derived from the first pharyngeal arch (Meckel's cartilage)." },
          { term: 'Stapes', why: "Derived from the second pharyngeal arch (Reichert's cartilage)." },
          { term: 'Greater horn of hyoid', why: 'Derived from the third pharyngeal arch.' },
          { term: 'Thyroid cartilage', why: 'Derived from the fourth and sixth pharyngeal arches.' },
        ],
      },
      {
        level: 3,
        title: 'TORCH infections',
        explanation:
          'TORCH infections cross the placenta (or are acquired at delivery) and share a tendency to affect the developing brain, eyes, and ears.',
        remember: 'TORCH organisms all target the same vulnerable trio: brain, eyes, ears.',
        items: [
          { term: 'Toxoplasmosis', why: 'Congenital infection causing intracranial calcifications and chorioretinitis.' },
          { term: 'Rubella', why: 'Congenital infection causing cataracts, deafness, and cardiac defects.' },
          { term: 'Cytomegalovirus', why: 'Most common congenital infection; causes periventricular calcifications.' },
          { term: 'Herpes simplex virus', why: 'Congenital/perinatal infection causing skin, eye, and CNS disease.' },
        ],
      },
      {
        level: 4,
        title: 'Neural tube defects',
        explanation:
          'All arise from incomplete closure of the neural tube early in development — low maternal folate is the classic shared risk factor.',
        remember: 'Neural tube defects share one preventable risk factor: folate deficiency.',
        items: [
          { term: 'Spina bifida occulta', why: 'Failure of vertebral arch fusion without herniation of neural tissue.' },
          { term: 'Anencephaly', why: 'Failure of the rostral neuropore to close, absent forebrain/skull.' },
          { term: 'Chiari II malformation', why: 'Downward displacement of the cerebellum, associated with myelomeningocele.' },
          { term: 'Meningomyelocele', why: 'Herniation of meninges and spinal cord through a vertebral defect.' },
        ],
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
    const allTerms = []
    p.categories.forEach((c, i) => {
      if (!c.title) errors.push(`category ${i} missing title`)
      if (!c.explanation) errors.push(`category ${i} ("${c.title}") missing explanation`)
      if (!c.remember) errors.push(`category ${i} ("${c.title}") missing remember line`)
      if (!Array.isArray(c.items) || c.items.length !== 4) {
        errors.push(`category ${i} ("${c.title}") must have exactly 4 items`)
      } else {
        c.items.forEach((it, j) => {
          if (!it || typeof it.term !== 'string' || !it.term.trim()) {
            errors.push(`category ${i} item ${j} missing term`)
          } else {
            allTerms.push(it.term)
          }
          if (!it || typeof it.why !== 'string' || !it.why.trim()) {
            errors.push(`category ${i} ("${c.title}") item "${it && it.term}" missing why`)
          }
        })
      }
      if (![1, 2, 3, 4].includes(c.level)) errors.push(`category ${i} has invalid level`)
    })
    if (allTerms.length !== 16) errors.push('puzzle must have exactly 16 items total')
    const unique = new Set(allTerms.map((s) => s.trim().toLowerCase()))
    if (unique.size !== allTerms.length) errors.push('duplicate item text within puzzle')
    const levels = p.categories.map((c) => c.level).sort()
    if (JSON.stringify(levels) !== JSON.stringify([1, 2, 3, 4])) {
      errors.push('categories must use levels 1,2,3,4 exactly once each')
    }
  }
  return errors
}

export default puzzles
