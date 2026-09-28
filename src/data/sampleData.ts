import { SampleCropData } from '../types';

// High-fidelity agricultural SVG illustrations formatted as Data URLs for sample preview
function createCropSvg(color1: string, color2: string, text: string, iconType: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-opacity="0.25"/>
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#g)" rx="16"/>
    
    <!-- Background leaf patterns -->
    <g opacity="0.12" fill="#ffffff">
      <path d="M50,400 Q150,200 400,250 Q250,450 50,400 Z"/>
      <path d="M550,50 Q450,250 200,200 Q350,0 550,50 Z"/>
      <circle cx="100" cy="100" r="60"/>
      <circle cx="500" cy="380" r="80"/>
    </g>

    <!-- Main Plant Card Container -->
    <g filter="url(#shadow)" transform="translate(100, 60)">
      <rect width="400" height="280" rx="16" fill="#ffffff" fill-opacity="0.96"/>
      
      <!-- Scanning Grid / Agriculture Marker Lines -->
      <line x1="30" y1="60" x2="370" y2="60" stroke="#e2e8f0" stroke-dasharray="4,4" stroke-width="1.5"/>
      <line x1="30" y1="210" x2="370" y2="210" stroke="#e2e8f0" stroke-dasharray="4,4" stroke-width="1.5"/>
      
      <!-- Leaf & Insect Illustration -->
      <g transform="translate(200, 130)">
        <!-- Stem & Main Leaf -->
        <path d="M0,70 Q-10,10 -60,-40 Q0,-80 50,-30 Q70,20 0,70 Z" fill="${color1}" fill-opacity="0.85"/>
        <path d="M0,70 L0,-40" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M0,20 Q-25,5 -35,-15" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M0,0 Q25,-15 35,-30" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
        
        <!-- Pest damage spots / marks -->
        <circle cx="-25" cy="-20" r="5" fill="#f59e0b" opacity="0.9"/>
        <circle cx="-15" cy="-35" r="4" fill="#ef4444" opacity="0.85"/>
        <circle cx="20" cy="-10" r="6" fill="#f59e0b" opacity="0.85"/>
        <circle cx="10" cy="25" r="4.5" fill="#ef4444" opacity="0.8"/>
        
        <!-- Pest Pinpoint Reticle -->
        <circle cx="20" cy="-10" r="14" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="20" y1="-28" x2="20" y2="8" stroke="#ef4444" stroke-width="1"/>
        <line x1="2" y1="-10" x2="38" y2="-10" stroke="#ef4444" stroke-width="1"/>
      </g>
      
      <!-- Tag / Header -->
      <rect x="30" y="24" width="130" height="24" rx="12" fill="${color1}" fill-opacity="0.15"/>
      <text x="42" y="40" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="${color1}">SAMPLE SPECIMEN</text>

      <text x="370" y="41" text-anchor="end" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748b">AI Scan Overlay</text>
      
      <!-- Footer Caption -->
      <text x="200" y="244" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#1e293b">${text}</text>
      <text x="200" y="264" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">Visual pest & symptom evidence recorded</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_CROPS: SampleCropData[] = [
  {
    id: 'sample-tomato',
    cropName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    problemName: 'Aphid Infestation & Leaf Curl Damage',
    problemCategory: 'pest',
    sampleImage: createCropSvg('#059669', '#047857', 'Tomato — Aphid Damage', 'leaf'),
    description: 'Upward curling foliage with visible clusters of small sap-sucking nymphs on the underside of young tomato leaflets.',
    result: {
      id: 'demo-sample-tomato',
      analyzedAt: new Date().toISOString(),
      imageQuality: 'good',
      plantDetected: true,
      crop: 'Tomato (Solanum lycopersicum)',
      problem: 'Likely Aphid Infestation & Vector-Induced Leaf Curl',
      confidence: 84,
      confidenceLevel: 'HIGH CONFIDENCE',
      severity: 'MODERATE',
      visualSymptoms: [
        'Upward inward leaf margin curling on young growth',
        'Visible clustering of tiny yellowish-green nymphs on leaf undersides',
        'Light chlorotic stippling and mild leaf puckering',
        'Slight sticky honeydew sheen with early signs of black sooty mold'
      ],
      possibleCauses: [
        'Feeding by Aphis gossypii (cotton/melon aphid) or Myzus persicae (green peach aphid)',
        'Warm, dry microclimate encouraging rapid reproductive cycling',
        'Excessive vegetative succulent growth often triggered by over-fertilization'
      ],
      recommendations: [
        'Inspect nearby plants and undersides of leaves immediately to map the boundary of infestation',
        'Prune and safely isolate heavily infested lower leaf clusters',
        'Apply strong water spray to dislodge aphid colonies from young shoots without damaging tissues',
        'Avoid excessive synthetic nitrogen applications that encourage soft foliage growth'
      ],
      ipm: [
        'Encourage and release natural predators like ladybird beetles (Coccinellidae) and hoverfly larvae',
        'Install yellow sticky traps (15–20 per acre) above crop canopy to monitor alate (winged) populations',
        'Apply certified horticultural neem oil (0.5%–1% v/v) or insecticidal soap during late evening hours'
      ],
      prevention: [
        'Maintain clean field borders and eliminate alternate weed hosts like Parthenium and Solanum nigrum',
        'Use reflective silver plastic mulches during early transplanting to deter winged aphids',
        'Practice companion planting with marigolds or aromatic herbs to repel pest clusters'
      ],
      monitoring: [
        'Scout 20 randomly selected plants twice weekly, specifically examining the top three leaf tiers',
        'Establish action threshold: Initiate management when >15% of sampled shoots harbor active colonies'
      ],
      expertAdvice: 'Consult a local agricultural extension officer if curling spreads across >25% of the plot or if virus-like mosaic symptoms appear.',
      isDemo: true,
    }
  },
  {
    id: 'sample-rice',
    cropName: 'Rice / Paddy',
    scientificName: 'Oryza sativa',
    problemName: 'Brown Plant Hopper (BPH) & Hopper Burn Symptoms',
    problemCategory: 'pest',
    sampleImage: createCropSvg('#0284c7', '#0369a1', 'Rice — Brown Plant Hopper', 'paddy'),
    description: 'Yellowing and browning tillers near water level with early circular patches of hopper burn in dense canopy paddy.',
    result: {
      id: 'demo-sample-rice',
      analyzedAt: new Date().toISOString(),
      imageQuality: 'good',
      plantDetected: true,
      crop: 'Rice / Paddy (Oryza sativa)',
      problem: 'Likely Brown Plant Hopper (Nilaparvata lugens) Damage',
      confidence: 86,
      confidenceLevel: 'HIGH CONFIDENCE',
      severity: 'HIGH',
      visualSymptoms: [
        'Lower stem base browning with visible tiny brown planthopper nymphs and adults',
        'Circular patches of yellowing drying leaves resembling localized hopper burn',
        'Reduced tiller vigor and drooping leaves at the panicle initiation stage'
      ],
      possibleCauses: [
        'High humidity and stagnant water layers at the base of dense transplanted rice stands',
        'Indiscriminate early-season pyrethroid usage eliminating spider and mirid bug predators',
        'High plant density preventing adequate aeration and sunlight penetration'
      ],
      recommendations: [
        'Practice alternate wetting and drying (AWD) by draining standing field water for 3 to 4 days',
        'Create alleyways ("skip rows") every 2 meters in dense fields to improve air circulation and sunlight',
        'Scout at water level by gently shaking 10 tillers over a white inspection tray'
      ],
      ipm: [
        'Conserve natural predators such as wolf spiders (Lycosa pseudoannulata) and mirid bugs (Cyrtorhinus lividipennis)',
        'Avoid blanket prophylactic chemical spraying which worsens BPH resurgence',
        'Use neem formulations or approved microbial bio-agents as recommended by state agricultural universities'
      ],
      prevention: [
        'Plant resistant or tolerant rice cultivars recommended for your agro-climatic zone',
        'Adopt wider spacing (e.g. 20 cm x 15 cm) rather than crowded transplanting',
        'Apply balanced potassium fertilization to strengthen culm wall cell structure'
      ],
      monitoring: [
        'Inspect the base of 20 hills along a diagonal transect every 3 days during tillering and heading',
        'Action threshold: 5–10 hoppers per hill during vegetative stage, or 10–15 per hill during flowering'
      ],
      expertAdvice: 'Urgent: Hopper burn can expand rapidly across acres within 48-72 hours. Contact your local Krishi Vigyan Kendra (KVK) or extension agronomist immediately.',
      isDemo: true,
    }
  },
  {
    id: 'sample-cotton',
    cropName: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    problemName: 'Whitefly Infestation & Leaf Crinkling',
    problemCategory: 'pest',
    sampleImage: createCropSvg('#7c3aed', '#6d28d9', 'Cotton — Whitefly Vector', 'cotton'),
    description: 'Upward cup-shaped leaves with silvering and tiny white winged insects fluttering when plants are agitated.',
    result: {
      id: 'demo-sample-cotton',
      analyzedAt: new Date().toISOString(),
      imageQuality: 'good',
      plantDetected: true,
      crop: 'Cotton (Gossypium hirsutum)',
      problem: 'Suspected Whitefly (Bemisia tabaci) Complex Damage',
      confidence: 79,
      confidenceLevel: 'LIKELY',
      severity: 'MODERATE',
      visualSymptoms: [
        'Chlorotic yellow spotting with upward curling and thickened leaf veins',
        'Clusters of tiny white-winged adults emerging from under-leaf surfaces upon brushing',
        'Accumulation of sticky excreted honeydew on mid-canopy leaves'
      ],
      possibleCauses: [
        'Dry weather coupled with elevated daytime temperatures favoring rapid generations',
        'Vector transmission risk for Cotton Leaf Curl Virus (CLCuV)',
        'Resistance buildup from repetitive single-mode insecticide usage in surrounding tracts'
      ],
      recommendations: [
        'Install yellow sticky traps across the field perimeter to intercept incoming migrators',
        'Direct spray nozzles towards the undersides of leaves where insects congregate',
        'Remove and destroy symptomatic early volunteer host plants'
      ],
      ipm: [
        'Encourage parasitoid wasps (Encarsia formosa and Eretmocerus spp.) and green lacewings (Chrysoperla carnea)',
        'Apply botanical 5% Neem Seed Kernel Extract (NSKE) or commercial azadirachtin 1500 ppm',
        'Spray Beauveria bassiana or Verticillium lecanii entomopathogenic fungal bio-formulations'
      ],
      prevention: [
        'Grow barrier crops like maize, sorghum, or pearl millet (2–3 rows) around cotton fields',
        'Avoid staggered or delayed sowings that expose young seedlings to peak pest flights',
        'Strictly destroy cotton crop residues after harvest to break overwintering cycles'
      ],
      monitoring: [
        'Observe the 3rd leaf from the top on 20 random plants weekly during morning hours before 9:00 AM',
        'Economic threshold: 6–8 nymphs/adults per leaf'
      ],
      expertAdvice: 'Consult a university farm advisor if leaf curl virus symptoms (enations or vein thickening) appear on more than 5% of plants.',
      isDemo: true,
    }
  },
  {
    id: 'sample-chilli',
    cropName: 'Chilli / Pepper',
    scientificName: 'Capsicum annuum',
    problemName: 'Chilli Thrips & Mite Complex (Murda Disease)',
    problemCategory: 'pest',
    sampleImage: createCropSvg('#ea580c', '#c2410c', 'Chilli — Thrips & Mites', 'pepper'),
    description: 'Boat-shaped upward curling of leaves with brownish bronzing scars on undersides and stunted shoot growth.',
    result: {
      id: 'demo-sample-chilli',
      analyzedAt: new Date().toISOString(),
      imageQuality: 'good',
      plantDetected: true,
      crop: 'Chilli / Hot Pepper (Capsicum annuum)',
      problem: 'Likely Chilli Thrips (Scirtothrips dorsalis) Infestation',
      confidence: 83,
      confidenceLevel: 'HIGH CONFIDENCE',
      severity: 'MODERATE',
      visualSymptoms: [
        'Upward curling of leaf margins with boat-shaped puckering',
        'Brownish-bronze rasped feeding streaks on the undersides of leaves and calyx',
        'Shortened internodes leading to rosette-like compact top canopy growth'
      ],
      possibleCauses: [
        'Prolonged dry spells followed by sudden warm sunny weather',
        'Continuous monocropping of Solanaceous species without rotational breaks',
        'Destruction of predatory phytoseiid mites through non-selective spraying'
      ],
      recommendations: [
        'Install blue sticky traps (specifically attractive to thrips) at crop height (10–12 traps/acre)',
        'Ensure adequate micro-irrigation to maintain optimal field soil moisture levels',
        'Prune heavily stunted shoots and burn or deeply bury debris outside the field'
      ],
      ipm: [
        'Conserve predatory mites (Amblyseius swirskii) and predatory pirate bugs (Orius spp.)',
        'Apply garlic-chilli extract or Pongamia oil soap solutions as gentle contact repellents',
        'Rotate modes of action if any approved botanical or selective chemical treatments are advised locally'
      ],
      prevention: [
        'Intercrop with marigold, coriander, or cowpea to attract beneficial hoverflies and bees',
        'Treat seedlings with bio-inoculants like Trichoderma viride and Pseudomonas fluorescens before transplanting',
        'Avoid planting downwind from older harvested chilli fields'
      ],
      monitoring: [
        'Scout early morning by tapping 5 terminal shoots per location onto a white sheet of paper',
        'Action threshold: 2–3 thrips per leaf or noticeable crinkling on emerging growth'
      ],
      expertAdvice: 'Seek advice from your district horticulture specialist if flower drop exceeds 40% or fruit scars develop.',
      isDemo: true,
    }
  },
  {
    id: 'sample-brinjal',
    cropName: 'Brinjal / Eggplant',
    scientificName: 'Solanum melongena',
    problemName: 'Shoot and Fruit Borer (BSFB) Damage',
    problemCategory: 'pest',
    sampleImage: createCropSvg('#854d0e', '#713f12', 'Brinjal — Shoot & Fruit Borer', 'eggplant'),
    description: 'Wilting and drooping terminal vegetative shoots with tiny bore exit holes and frass deposits on developing fruits.',
    result: {
      id: 'demo-sample-brinjal',
      analyzedAt: new Date().toISOString(),
      imageQuality: 'good',
      plantDetected: true,
      crop: 'Brinjal / Eggplant (Solanum melongena)',
      problem: 'Likely Brinjal Shoot and Fruit Borer (Leucinodes orbonalis)',
      confidence: 88,
      confidenceLevel: 'HIGH CONFIDENCE',
      severity: 'HIGH',
      visualSymptoms: [
        'Wilting, drooping, and drying of tender terminal shoots ("dead hearts")',
        'Entry bore holes plugged with dark larval frass on stem nodes and fruit calyx',
        'Deformed, unmarketable developing fruits with internal tunneling'
      ],
      possibleCauses: [
        'High moth population flying during twilight hours laying eggs on tender foliage',
        'Larvae immediately boring into shoot tissue within hours of hatching, escaping superficial contact sprays',
        'Warm humid weather accelerating life cycle to under 25 days'
      ],
      recommendations: [
        'Clip off and destroy all wilted shoots below the point of larval entry every 3 to 4 days',
        'Collect and bury all infested dropped or damaged fruits into a deep compost pit',
        'Install Leucinodes pheromone traps (12–15 traps/acre) to monitor and mass trap male moths'
      ],
      ipm: [
        'Release egg parasitoids (Trichogramma chilonis) @ 50,000/ha at weekly intervals',
        'Spray Bacillus thuringiensis (Bt) kurstaki formulation during early shoot initiation',
        'Apply 4% Neem Seed Kernel Extract (NSKE) at flowering onset to deter moth oviposition'
      ],
      prevention: [
        'Avoid continuous ratoon cropping of brinjal; follow strict crop rotation with pulses or cereals',
        'Remove crop stubble immediately after final harvest and perform deep summer ploughing',
        'Plant barrier rows of maize or sunflower around the field'
      ],
      monitoring: [
        'Scout fields twice a week for freshly drooping shoot tips and frass holes',
        'Action threshold: >5% shoot damage or 1 moth caught per pheromone trap per night'
      ],
      expertAdvice: 'Fruit borer can destroy up to 70% of crop value. Coordinate with local extension officers for area-wide community pheromone trapping.',
      isDemo: true,
    }
  },
  {
    id: 'sample-groundnut',
    cropName: 'Groundnut / Peanut',
    scientificName: 'Arachis hypogaea',
    problemName: 'Tikka Leaf Spot & Spodoptera Defoliation',
    problemCategory: 'fungal',
    sampleImage: createCropSvg('#15803d', '#166534', 'Groundnut — Tikka Leaf Spot', 'peanut'),
    description: 'Circular dark brown to black necrotic spots with yellow chlorotic halos on upper leaf surfaces and ragged leaf margin bites.',
    result: {
      id: 'demo-sample-groundnut',
      analyzedAt: new Date().toISOString(),
      imageQuality: 'good',
      plantDetected: true,
      crop: 'Groundnut / Peanut (Arachis hypogaea)',
      problem: 'Likely Tikka Leaf Spot (Cercospora arachidicola / Phaeoisariopsis personata)',
      confidence: 85,
      confidenceLevel: 'HIGH CONFIDENCE',
      severity: 'MODERATE',
      visualSymptoms: [
        'Sub-circular reddish-brown spots with prominent bright yellow halos on older leaves',
        'Premature defoliation and leaf drop from lower canopy branches',
        'Slight irregular chewing notches along leaf margins from early instar caterpillars'
      ],
      possibleCauses: [
        'High relative humidity (>85%) combined with warm temperatures (25–30°C)',
        'Prolonged leaf wetness caused by overhead sprinkler irrigation or dew accumulation',
        'Airborne fungal conidia originating from infected crop debris'
      ],
      recommendations: [
        'Switch from overhead sprinkler to furrow or drip irrigation to minimize canopy wetness duration',
        'Collect and safely burn or bury severely infected lower fallen leaves',
        'Ensure adequate soil drainage to prevent prolonged water stagnation around pod zones'
      ],
      ipm: [
        'Apply biocontrol agent Trichoderma harzianum or Pseudomonas fluorescens as foliar spray',
        'Intercrop groundnut with pearl millet or pigeon pea (4:1 ratio) to slow fungal spore dispersal',
        'Apply certified copper oxychloride or sulfur dust formulations if approved by local agricultural departments'
      ],
      prevention: [
        'Use certified disease-free treated seed kernels before sowing',
        'Follow a 2-year crop rotation with non-host cereals such as sorghum, pearl millet, or maize',
        'Maintain balanced fertilizer application, ensuring sufficient potassium and calcium (gypsum)'
      ],
      monitoring: [
        'Scout lower canopy leaves of 25 plants across the plot starting 30 days after sowing',
        'Action threshold: Appearance of leaf spots on more than 10% of lower canopy foliage'
      ],
      expertAdvice: 'If defoliation reaches the upper third of the canopy before pod maturity, contact your local agronomist for targeted fungicide recommendations.',
      isDemo: true,
    }
  }
];
