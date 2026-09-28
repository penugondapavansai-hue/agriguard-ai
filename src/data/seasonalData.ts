import { SampleCropData } from '../types';

export interface ChemicalPestControl {
  chemicalName: string;
  activeIngredient: string;
  tradeNames: string[];
  targetPest: string;
  dosage: string;
  applicationMethod: string;
  preHarvestIntervalDays: number;
  safetyLevel: 'Caution (Green)' | 'Warning (Blue)' | 'Danger (Yellow)';
  applicationTips: string;
}

export interface BioPreventativeMeasure {
  name: string;
  type: 'Seed Treatment' | 'Cultural Practice' | 'Bio-Pesticide' | 'Physical Trap' | 'Beneficial Insects';
  instruction: string;
  timing: string;
}

export interface SeasonalCrop {
  id: string;
  name: string;
  teluguName: string;
  hindiName: string;
  scientificName: string;
  category: 'vegetables' | 'cereals' | 'pulses' | 'fruits' | 'commercial';
  sowingWindow: string;
  harvestDurationDays: string;
  waterRequirement: string;
  idealTemperature: string;
  soilType: string;
  keyPestsAndDiseases: string[];
  chemicalControls: ChemicalPestControl[];
  preventativeMeasures: BioPreventativeMeasure[];
  sampleCropId?: string;
  tagline: string;
}

export interface MonthSeasonalGuide {
  monthIndex: number; // 0 = Jan, 11 = Dec
  monthName: string;
  seasonName: string;
  seasonBadge: string;
  climateOverview: string;
  primaryFieldAdvisory: string[];
  keyPreventativeSteps: string[];
  recommendedCrops: SeasonalCrop[];
}

export const SEASONAL_GUIDE_DATA: MonthSeasonalGuide[] = [
  // 0. JANUARY
  {
    monthIndex: 0,
    monthName: 'January',
    seasonName: 'Late Winter / Rabi Season',
    seasonBadge: '❄️ Rabi Maturity & Sowing',
    climateOverview: 'Cool, crisp days with chilly nights and early morning fog. Ideal for cool-season greens, root vegetables, and grain grain-filling stages.',
    primaryFieldAdvisory: [
      'Morning dew and fog increase risk of fungal rust, late blight, and powdery mildew.',
      'Maintain light, frequent irrigation to protect delicate root systems from nocturnal frost.',
      'Scout regularly for aphid colonies congregating on tender shoots as temperature begins gradual ascent.'
    ],
    keyPreventativeSteps: [
      'Apply protective sulfur or mancozeb sprays at the first sign of dense fog to prevent powdery mildew.',
      'Set up yellow sticky traps (6–8 per acre) to intercept flying aphid vectors of viral diseases.',
      'Treat late winter seeds with Trichoderma viride @ 5g/kg seed before sowing.'
    ],
    recommendedCrops: [
      {
        id: 'jan-tomato',
        name: 'Tomato',
        teluguName: 'టమోటా',
        hindiName: 'टमाटर',
        scientificName: 'Solanum lycopersicum',
        category: 'vegetables',
        sowingWindow: 'Mid-late winter transplanting',
        harvestDurationDays: '65 - 85 days',
        waterRequirement: 'Medium',
        idealTemperature: '18°C - 26°C',
        soilType: 'Well-drained sandy loam rich in organic matter',
        tagline: 'High yield potential with proactive blight & aphid management.',
        sampleCropId: 'sample-tomato',
        keyPestsAndDiseases: ['Late Blight (Phytophthora)', 'Aphids & Whiteflies', 'Fruit Borer (Helicoverpa)'],
        chemicalControls: [
          {
            chemicalName: 'Mancozeb 75% WP',
            activeIngredient: 'Mancozeb (Dithiocarbamate)',
            tradeNames: ['Dithane M-45', 'Indofil M-45', 'Uthane'],
            targetPest: 'Early & Late Blight, Leaf Spot',
            dosage: '2.0 - 2.5 g / liter of water (Foliar spray)',
            applicationMethod: 'Foliar spray evenly covering both upper and lower leaf surfaces.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Apply early morning when winds are calm; repeat after 10-12 days if damp weather persists.'
          },
          {
            chemicalName: 'Imidacloprid 17.8% SL',
            activeIngredient: 'Imidacloprid (Neonicotinoid)',
            tradeNames: ['Confidor', 'Tatamida', 'Victor'],
            targetPest: 'Aphids, Whiteflies, Jassids (vectors of Leaf Curl)',
            dosage: '0.4 - 0.5 ml / liter of water',
            applicationMethod: 'Foliar systemic spray at early vegetative stage.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Do not spray during full bloom to safeguard honeybees and local pollinators.'
          },
          {
            chemicalName: 'Chlorantraniliprole 18.5% SC',
            activeIngredient: 'Chlorantraniliprole (Anthranilic Diamide)',
            tradeNames: ['Coragen', 'Cover', 'Shenzi'],
            targetPest: 'Tomato Fruit Borer (Helicoverpa armigera)',
            dosage: '0.3 - 0.4 ml / liter of water',
            applicationMethod: 'Targeted spray on flower clusters and developing green fruits.',
            preHarvestIntervalDays: 3,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Highly effective ovicide-larvicide; rotate chemistry with Emamectin Benzoate.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Neem Oil Azadirachtin 10,000 ppm',
            type: 'Bio-Pesticide',
            instruction: 'Spray 3 ml/L with mild surfactant every 10 days to deter sucking pests.',
            timing: 'Early vegetative to flowering'
          },
          {
            name: 'African Marigold Trap Cropping',
            type: 'Cultural Practice',
            instruction: 'Plant 1 row of flowering marigold for every 16 rows of tomato to attract fruit borer egg-laying.',
            timing: 'At transplanting time'
          }
        ]
      },
      {
        id: 'jan-mustard',
        name: 'Mustard / Rapeseed',
        teluguName: 'ఆవాలు',
        hindiName: 'सरसों',
        scientificName: 'Brassica juncea',
        category: 'commercial',
        sowingWindow: 'Late sowing or pod filling care',
        harvestDurationDays: '100 - 120 days',
        waterRequirement: 'Low',
        idealTemperature: '15°C - 24°C',
        soilType: 'Loamy to clay loam with good drainage',
        tagline: 'Crucial pod filling stage requiring strict aphid deterrence.',
        keyPestsAndDiseases: ['Mustard Aphid (Lipaphis erysimi)', 'Alternaria Blight', 'White Rust'],
        chemicalControls: [
          {
            chemicalName: 'Dimethoate 30% EC',
            activeIngredient: 'Dimethoate (Organophosphate)',
            tradeNames: ['Rogor', 'Tara-909'],
            targetPest: 'Mustard Aphid colonies on central inflorescence',
            dosage: '1.5 - 2.0 ml / liter of water',
            applicationMethod: 'Foliar spray when 20% plants show aphid colonies.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Spray late afternoon (after 3 PM) to prevent harming foraging bees.'
          },
          {
            chemicalName: 'Copper Oxychloride 50% WP',
            activeIngredient: 'Copper Oxychloride',
            tradeNames: ['Blitox 50', 'Fytolan', 'Cupramar'],
            targetPest: 'Alternaria Leaf Blight & White Rust',
            dosage: '2.5 g / liter of water',
            applicationMethod: 'Foliar wash ensuring penetration into dense canopy.',
            preHarvestIntervalDays: 10,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Use non-ionic wetting agent for better leaf adhesion.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Yellow Water Pan Traps',
            type: 'Physical Trap',
            instruction: 'Install 4-5 yellow water pans per acre at crop canopy height to track winged aphid influx.',
            timing: 'Throughout flowering stage'
          }
        ]
      },
      {
        id: 'jan-chickpea',
        name: 'Chickpea / Bengal Gram',
        teluguName: 'శనగలు',
        hindiName: 'चना',
        scientificName: 'Cicer arietinum',
        category: 'pulses',
        sowingWindow: 'Pod formation & late rabi management',
        harvestDurationDays: '90 - 110 days',
        waterRequirement: 'Low',
        idealTemperature: '16°C - 25°C',
        soilType: 'Deep black soil or sandy loam',
        tagline: 'High protein pulse requiring strict protection against pod borers.',
        keyPestsAndDiseases: ['Gram Pod Borer (Helicoverpa)', 'Fusarium Wilt', 'Ascochyta Blight'],
        chemicalControls: [
          {
            chemicalName: 'Emamectin Benzoate 5% SG',
            activeIngredient: 'Emamectin Benzoate',
            tradeNames: ['Proclaim', 'EM-1', 'Missile'],
            targetPest: 'Gram Pod Borer caterpillars feeding on pods',
            dosage: '0.4 - 0.5 g / liter of water',
            applicationMethod: 'Foliar spray during early instar caterpillar emergence.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Target spray directly onto pod clusters; fast-acting stomach poison.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Helicoverpa Pheromone Traps',
            type: 'Physical Trap',
            instruction: 'Place 5-6 traps per acre with Helilure septa to monitor male moth activity.',
            timing: 'From 50% flowering onwards'
          },
          {
            name: 'Bird Perches (T-shaped wooden poles)',
            type: 'Cultural Practice',
            instruction: 'Erect 15-20 T-poles per acre to encourage insectivorous birds (Drongos, Mynas) to feed on larvae.',
            timing: 'Throughout vegetative and pod stage'
          }
        ]
      }
    ]
  },

  // 1. FEBRUARY
  {
    monthIndex: 1,
    monthName: 'February',
    seasonName: 'Early Spring / Late Rabi & Zaid Prep',
    seasonBadge: '🌱 Spring Transition & Cucurbits',
    climateOverview: 'Gradual warming with rising sunshine hours. Sucking pests multiply rapidly as temperatures climb towards 28°C.',
    primaryFieldAdvisory: [
      'Transitioning to warm weather crops like Okra, Watermelon, and Gourds.',
      'Sucking pests like thrips and red spider mites increase exponentially with dry warmth.',
      'Ensure seed bed preparation with solarized soil to eliminate soil-borne pathogens.'
    ],
    keyPreventativeSteps: [
      'Drench nursery beds with carbendazim or Trichoderma to prevent damping-off in seedling stage.',
      'Incorporate well-rotted Farm Yard Manure (FYM) enriched with Pseudomonas.',
      'Install blue sticky traps in capsicum and okra plots for thrips detection.'
    ],
    recommendedCrops: [
      {
        id: 'feb-okra',
        name: 'Okra / Lady Finger',
        teluguName: 'బెండకాయ',
        hindiName: 'भिंडी',
        scientificName: 'Abelmoschus esculentus',
        category: 'vegetables',
        sowingWindow: 'Spring/Summer sowing starts',
        harvestDurationDays: '45 - 60 days',
        waterRequirement: 'Medium',
        idealTemperature: '24°C - 35°C',
        soilType: 'Sandy loam to clay loam rich in organic matter',
        tagline: 'Fast maturing summer vegetable prone to shoot/fruit borer and whiteflies.',
        keyPestsAndDiseases: ['Shoot and Fruit Borer (Earias)', 'Yellow Vein Mosaic Virus (Whitefly vector)', 'Jassids'],
        chemicalControls: [
          {
            chemicalName: 'Spinosad 45% SC',
            activeIngredient: 'Spinosad (Naturalyte fermentation product)',
            tradeNames: ['Tracer', 'Spintor', 'Conserve'],
            targetPest: 'Spotted Bollworm / Shoot and Fruit Borer',
            dosage: '0.3 - 0.4 ml / liter of water',
            applicationMethod: 'Foliar spray at initiation of flowering and early fruit set.',
            preHarvestIntervalDays: 3,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Bio-derived chemical safe for beneficial predators; low mammalian toxicity.'
          },
          {
            chemicalName: 'Acetamiprid 20% SP',
            activeIngredient: 'Acetamiprid',
            tradeNames: ['Pride', 'Manik', 'Ekka'],
            targetPest: 'Whiteflies & Jassids (prevention of Yellow Vein Mosaic)',
            dosage: '0.4 g / liter of water',
            applicationMethod: 'Foliar spray covering under-surface of leaves.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Rotate with Diafenthiuron or Flonicamid to prevent pest tolerance build-up.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'YVMV-Resistant Seed Selection',
            type: 'Cultural Practice',
            instruction: 'Sow hybrid cultivars certified resistant to Yellow Vein Mosaic (e.g., Arka Anamika, Parbhani Kranti).',
            timing: 'Seed purchase & sowing'
          },
          {
            name: 'Yellow Sticky Traps',
            type: 'Physical Trap',
            instruction: 'Erect 8-10 yellow cards per acre at 1 foot above crop canopy.',
            timing: '15 days after germination'
          }
        ]
      },
      {
        id: 'feb-cucumber',
        name: 'Cucumber & Gourds',
        teluguName: 'దోసకాయ',
        hindiName: 'खीरा / ककड़ी',
        scientificName: 'Cucumis sativus',
        category: 'vegetables',
        sowingWindow: 'Spring planting on raised beds or basins',
        harvestDurationDays: '50 - 70 days',
        waterRequirement: 'Medium to High',
        idealTemperature: '22°C - 32°C',
        soilType: 'Fertile sandy loam with pH 6.0 - 7.5',
        tagline: 'High market demand cucurbits requiring vigilance against fruit fly and downy mildew.',
        keyPestsAndDiseases: ['Cucurbit Fruit Fly (Bactrocera cucurbitae)', 'Downy Mildew (Pseudoperonospora)', 'Powdery Mildew'],
        chemicalControls: [
          {
            chemicalName: 'Cymoxanil 8% + Mancozeb 64% WP',
            activeIngredient: 'Cymoxanil + Mancozeb',
            tradeNames: ['Curzate M8', 'Moximate', 'Acrobat MZ'],
            targetPest: 'Downy Mildew (angular yellow leaf lesions)',
            dosage: '2.0 g / liter of water',
            applicationMethod: 'Systemic curative + contact foliar spray.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Apply as soon as humid morning conditions trigger early leaf yellowing.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Cue-Lure Fruit Fly Traps',
            type: 'Physical Trap',
            instruction: 'Install 6-8 Cue-lure parapheromone traps per acre to mass-trap male fruit flies before oviposition.',
            timing: 'At flower initiation'
          }
        ]
      }
    ]
  },

  // 2. MARCH
  {
    monthIndex: 2,
    monthName: 'March',
    seasonName: 'Peak Spring / Zaid Summer Sowing',
    seasonBadge: '☀️ Zaid Season Launch',
    climateOverview: 'Rising temperatures (28°C - 36°C) with low humidity and high evaporation rates. Rapid melon and pulse growth.',
    primaryFieldAdvisory: [
      'Ideal for sowing watermelon, muskmelon, cowpea, green gram, and maize.',
      'Mulching with straw or black/silver polythene preserves vital soil moisture and halts weed growth.',
      'Red spider mites and thrips peak under dry hot winds.'
    ],
    keyPreventativeSteps: [
      'Install drip irrigation with fertigation to maintain uniform soil moisture without leaf wetting.',
      'Dust sulfur or spray wettable sulfur (2g/L) to prevent powdery mildew in melons and gourds.',
      'Seed treatment with Rhizobium culture (200g per 10kg seed) for pulses.'
    ],
    recommendedCrops: [
      {
        id: 'mar-watermelon',
        name: 'Watermelon & Melons',
        teluguName: 'పుచ్చకాయ',
        hindiName: 'तरबूज',
        scientificName: 'Citrullus lanatus',
        category: 'fruits',
        sowingWindow: 'Early Zaid season sowing',
        harvestDurationDays: '75 - 95 days',
        waterRequirement: 'Medium (Drip preferred)',
        idealTemperature: '25°C - 38°C',
        soilType: 'Sandy riverbeds or deep sandy loam',
        tagline: 'High value summer fruit requiring strict mite and fruit fly management.',
        keyPestsAndDiseases: ['Red Spider Mites (Tetranychus)', 'Fruit Fly', 'Fusarium Wilt', 'Anthracnose'],
        chemicalControls: [
          {
            chemicalName: 'Spiromesifen 22.9% SC',
            activeIngredient: 'Spiromesifen (Tetronic acid)',
            tradeNames: ['Oberon', 'Volt', 'Spiror'],
            targetPest: 'Red Spider Mites & Whitefly nymphs',
            dosage: '0.8 - 1.0 ml / liter of water',
            applicationMethod: 'Foliar spray targeting the underside of leaves where mites web.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Provide thorough coverage; disrupts lipid biosynthesis of mite eggs and nymphs.'
          },
          {
            chemicalName: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
            activeIngredient: 'Azoxystrobin + Difenoconazole',
            tradeNames: ['Amistar Top', 'Godrej Symphony', 'Custodia'],
            targetPest: 'Anthracnose, Gummy Stem Blight, Powdery Mildew',
            dosage: '1.0 ml / liter of water',
            applicationMethod: 'Dual-action systemic preventive and curative spray.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Spray during cool evening hours; avoid phytotoxicity in extreme noon heat.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Reflective Silver Mulch (25-30 micron)',
            type: 'Cultural Practice',
            instruction: 'Lay silver-black mulch sheet on raised beds to repel flying insects and conserve 40% water.',
            timing: 'Bed preparation before sowing'
          }
        ]
      },
      {
        id: 'mar-moong',
        name: 'Green Gram / Moong',
        teluguName: 'పెసలు',
        hindiName: 'मूँग',
        scientificName: 'Vigna radiata',
        category: 'pulses',
        sowingWindow: 'Summer Moong sowing after Rabi harvest',
        harvestDurationDays: '60 - 70 days',
        waterRequirement: 'Low',
        idealTemperature: '28°C - 38°C',
        soilType: 'Well-drained loam with neutral pH',
        tagline: 'Short-duration soil-enriching pulse with rapid returns.',
        keyPestsAndDiseases: ['Yellow Mosaic Virus (Whitefly vector)', 'Pod Borer (Maruca vitrata)', 'Cercospora Leaf Spot'],
        chemicalControls: [
          {
            chemicalName: 'Flonicamid 50% WG',
            activeIngredient: 'Flonicamid',
            tradeNames: ['Ulala', 'Theme', 'T-Shield'],
            targetPest: 'Whiteflies (vector of Yellow Mosaic Virus)',
            dosage: '0.3 g / liter of water',
            applicationMethod: 'Systemic selective feeding blocker spray.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Stops sap-sucking within 30 minutes; safe on beneficial honeybees.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Seed Treatment with Thiamethoxam 30 FS',
            type: 'Seed Treatment',
            instruction: 'Treat seeds @ 3 ml/kg seed before sowing to provide 30 days systemic protection against whiteflies.',
            timing: 'Immediately prior to sowing'
          }
        ]
      }
    ]
  },

  // 3. APRIL
  {
    monthIndex: 3,
    monthName: 'April',
    seasonName: 'Late Spring / Mid-Summer',
    seasonBadge: '🔥 Summer Protection & Solarization',
    climateOverview: 'Intense solar radiation, high daytime temperatures (34°C - 42°C). High risk of sunburn, thermal stress, and mite flares.',
    primaryFieldAdvisory: [
      'Irrigate during early morning or late night to minimize thermal shock and evaporation loss.',
      'Utilize empty fields for Deep Summer Ploughing (Soil Solarization) to kill soil nematodes and fungal spores.',
      'Shade nets (35-50% green/white) protect delicate seedling nurseries.'
    ],
    keyPreventativeSteps: [
      'Apply potassium silicate (2g/L) or anti-transpirants to build drought and heat tolerance.',
      'Drench root zones with bio-fertilizers (VAM / Mycorrhiza) for root moisture absorption.',
      'Check irrigation filters frequently to avoid drip emitter clogging.'
    ],
    recommendedCrops: [
      {
        id: 'apr-maize',
        name: 'Summer Maize / Corn',
        teluguName: 'మొక్కజొన్న',
        hindiName: 'मक्का',
        scientificName: 'Zea mays',
        category: 'cereals',
        sowingWindow: 'Summer irrigated grain or fodder maize',
        harvestDurationDays: '85 - 100 days',
        waterRequirement: 'Medium',
        idealTemperature: '26°C - 38°C',
        soilType: 'Deep alluvial or fertile loam',
        tagline: 'Vigorous biomass producer; requires proactive Fall Armyworm vigilance.',
        sampleCropId: 'sample-maize',
        keyPestsAndDiseases: ['Fall Armyworm (Spodoptera frugiperda)', 'Stem Borer (Chilo partellus)', 'Maydis Leaf Blight'],
        chemicalControls: [
          {
            chemicalName: 'Chlorantraniliprole 18.5% SC',
            activeIngredient: 'Chlorantraniliprole',
            tradeNames: ['Coragen', 'Vesticor'],
            targetPest: 'Fall Armyworm whorl feeding larvae',
            dosage: '0.4 ml / liter of water',
            applicationMethod: 'Directed spray aimed right into the central whorl of each maize plant.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Apply early morning when larvae are actively feeding inside the central whorl.'
          },
          {
            chemicalName: 'Emamectin Benzoate 5% SG',
            activeIngredient: 'Emamectin Benzoate',
            tradeNames: ['Proclaim', 'King-Emam'],
            targetPest: 'Early instar FAW & Stem Borer caterpillars',
            dosage: '0.4 - 0.5 g / liter of water',
            applicationMethod: 'Whorl application with high volume knapsack sprayer.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Add wetting agent (sand/ash mixture baiting in severe outbreaks).'
          }
        ],
        preventativeMeasures: [
          {
            name: 'FAW Pheromone Lure Grid',
            type: 'Physical Trap',
            instruction: 'Install 5 funnel traps per acre with Spodo-lure at knee-height to monitor adult moth flight.',
            timing: 'From 15 days after germination'
          },
          {
            name: 'Trichogramma chilonis Egg Parasitoid Cards',
            type: 'Beneficial Insects',
            instruction: 'Release 50,000 parasitized eggs/acre (Trichocards) at 10 and 20 days crop age.',
            timing: 'Early vegetative stage'
          }
        ]
      },
      {
        id: 'apr-cowpea',
        name: 'Cowpea / Yardlong Bean',
        teluguName: 'అలసందలు',
        hindiName: 'लोबिया / बरबटी',
        scientificName: 'Vigna unguiculata',
        category: 'vegetables',
        sowingWindow: 'Summer vegetable sowing',
        harvestDurationDays: '55 - 75 days',
        waterRequirement: 'Low to Medium',
        idealTemperature: '26°C - 36°C',
        soilType: 'Sandy loam to well-drained red loam',
        tagline: 'Hardy legume that fixes nitrogen and thrives in warm sunshine.',
        keyPestsAndDiseases: ['Aphids (Aphis craccivora)', 'Pod Borer', 'Powdery Mildew'],
        chemicalControls: [
          {
            chemicalName: 'Thiamethoxam 25% WG',
            activeIngredient: 'Thiamethoxam (Neonicotinoid)',
            tradeNames: ['Actara', 'Areva', 'Extra-Super'],
            targetPest: 'Black Bean Aphids & Jassids',
            dosage: '0.3 - 0.4 g / liter of water',
            applicationMethod: 'Foliar spray targeting tender vine shoots.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Systemic absorption translocates through xylem to protect new growth.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Neem Seed Kernel Extract (NSKE 5%)',
            type: 'Bio-Pesticide',
            instruction: 'Spray 5% fresh NSKE solution at first appearance of black aphid colonies on flower buds.',
            timing: 'Bud formation stage'
          }
        ]
      }
    ]
  },

  // 4. MAY
  {
    monthIndex: 4,
    monthName: 'May',
    seasonName: 'Late Summer / Pre-Monsoon Preparation',
    seasonBadge: '🚜 Kharif Nursery Prep',
    climateOverview: 'Extreme summer heat with occasional pre-monsoon convective thunderstorms. Focus shifts to seed sourcing and nursery bed preparation.',
    primaryFieldAdvisory: [
      'Prepare raised nursery beds for Paddy (Rice), Chilli, Eggplant, and Tomato for the upcoming Kharif season.',
      'Sow green manure crops (Dhaincha / Sunn Hemp) with early pre-monsoon rains to incorporate biomass.',
      'Solarize nursery soil with transparent polythene for 25-30 days to kill weed seeds and root-knot nematodes.'
    ],
    keyPreventativeSteps: [
      'Incorporate 10 tonnes of FYM/compost per hectare during final summer plowing.',
      'Seed treatment with Carbendazim (2g/kg) + Thiram (2g/kg) or Trichoderma viride (10g/kg).',
      'Clean farm drainage channels to prevent monsoon waterlogging.'
    ],
    recommendedCrops: [
      {
        id: 'may-cotton',
        name: 'Cotton',
        teluguName: 'పత్తి',
        hindiName: 'कपास',
        scientificName: 'Gossypium hirsutum',
        category: 'commercial',
        sowingWindow: 'Pre-monsoon irrigated cotton sowing',
        harvestDurationDays: '150 - 180 days',
        waterRequirement: 'Medium',
        idealTemperature: '28°C - 40°C',
        soilType: 'Deep fertile black cotton soil (Vertisols)',
        tagline: 'King of fibers requiring comprehensive sucking pest and bollworm management.',
        sampleCropId: 'sample-cotton',
        keyPestsAndDiseases: ['Pink Bollworm (Pectinophora)', 'Whiteflies & Jassids', 'Thrips', 'Bacterial Blight'],
        chemicalControls: [
          {
            chemicalName: 'Diafenthiuron 50% WP',
            activeIngredient: 'Diafenthiuron (Thiourea derivative)',
            tradeNames: ['Pegasus', 'Derby', 'Polaris'],
            targetPest: 'Whiteflies (all nymph stages) & Red Mites',
            dosage: '1.0 - 1.2 g / liter of water',
            applicationMethod: 'Foliar spray with uniform canopy coverage.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Activates by vapor action inside dense canopy; extremely potent against resistant whiteflies.'
          },
          {
            chemicalName: 'Fipronil 5% SC',
            activeIngredient: 'Fipronil (Phenylpyrazole)',
            tradeNames: ['Regent', 'Prince', 'Mahaveer'],
            targetPest: 'Thrips & Jassids causing leaf curl',
            dosage: '1.5 - 2.0 ml / liter of water',
            applicationMethod: 'Foliar spray at early vegetative stage (30-45 DAS).',
            preHarvestIntervalDays: 15,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Provides systemic protection and phytotonic greening effect.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'PB-Rope L / Pheromone Mating Disruption',
            type: 'Physical Trap',
            instruction: 'Tie 8-10 Pink Bollworm pheromone dispensers per acre at square formation to disrupt mating cycles.',
            timing: '45 days after sowing'
          },
          {
            name: 'Border Cropping with Castor and Sorghum',
            type: 'Cultural Practice',
            instruction: 'Plant 2 rows of Maize/Sorghum around cotton perimeter as barrier crop against migrating whiteflies.',
            timing: 'At time of cotton sowing'
          }
        ]
      },
      {
        id: 'may-ginger',
        name: 'Ginger & Turmeric',
        teluguName: 'అల్లం / పసుపు',
        hindiName: 'अदरक / हल्दी',
        scientificName: 'Zingiber officinale',
        category: 'commercial',
        sowingWindow: 'Pre-monsoon planting of seed rhizomes',
        harvestDurationDays: '210 - 240 days',
        waterRequirement: 'High',
        idealTemperature: '25°C - 35°C',
        soilType: 'Rich, friable loamy soil rich in humus',
        tagline: 'High-value rhizome spices requiring strict prevention against rhizome rot.',
        keyPestsAndDiseases: ['Rhizome Rot (Pythium / Soft Rot)', 'Shoot Borer (Conogethes)', 'Bacterial Wilt'],
        chemicalControls: [
          {
            chemicalName: 'Metalaxyl 8% + Mancozeb 64% WP',
            activeIngredient: 'Metalaxyl + Mancozeb',
            tradeNames: ['Ridomil Gold', 'Matco', 'Master'],
            targetPest: 'Pythium Rhizome Soft Rot',
            dosage: '2.5 g / liter of water (Rhizome treatment & soil drench)',
            applicationMethod: 'Dip rhizomes for 30 minutes before planting; drench soil at first sign of yellowing.',
            preHarvestIntervalDays: 21,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Ensure beds have raised drainage slopes to prevent standing water.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Trichoderma enriched FYM Application',
            type: 'Bio-Pesticide',
            instruction: 'Mix 5 kg Trichoderma harzianum in 500 kg FYM, keep moist for 7 days, apply in furrows before planting.',
            timing: 'Basal application at planting'
          }
        ]
      }
    ]
  },

  // 5. JUNE
  {
    monthIndex: 5,
    monthName: 'June',
    seasonName: 'Early Monsoon / Kharif Sowing Onset',
    seasonBadge: '🌧️ Monsoon Sowing Commences',
    climateOverview: 'Arrival of Southwest Monsoon. High humidity (75-90%), warm temperatures (28°C - 34°C). Ideal for broad-acre sowing.',
    primaryFieldAdvisory: [
      'Commence direct seeding and nursery transplanting of Rice (Paddy), Soybean, Groundnut, and Pulses after receiving 75-100mm rain.',
      'Warm damp soils promote rapid weed flushes and damping-off fungi.',
      'Check seed germination percentages before large-scale field drilling.'
    ],
    keyPreventativeSteps: [
      'Apply pre-emergence herbicides (e.g. Pendimethalin 30 EC @ 1L/acre) within 48 hours of sowing.',
      'Treat legume seeds with Rhizobium and Phosphate Solubilizing Bacteria (PSB) bio-inoculants.',
      'Install light traps to catch nocturnal beetles and hairy caterpillars.'
    ],
    recommendedCrops: [
      {
        id: 'jun-paddy',
        name: 'Paddy / Rice',
        teluguName: 'వరి',
        hindiName: 'धान / चावल',
        scientificName: 'Oryza sativa',
        category: 'cereals',
        sowingWindow: 'Main Kharif Nursery Sowing & Transplanting',
        harvestDurationDays: '115 - 145 days',
        waterRequirement: 'High',
        idealTemperature: '24°C - 35°C',
        soilType: 'Heavy clay loam or clay holding water',
        tagline: 'Global staple grain demanding vigilant stem borer, blast, and leaf folder defense.',
        sampleCropId: 'sample-paddy',
        keyPestsAndDiseases: ['Yellow Stem Borer (Scirpophaga)', 'Rice Blast (Pyricularia)', 'Leaf Folder (Cnaphalocrocis)', 'Sheath Blight'],
        chemicalControls: [
          {
            chemicalName: 'Cartap Hydrochloride 4% G / 50% SP',
            activeIngredient: 'Cartap Hydrochloride',
            tradeNames: ['Padan', 'Caldan', 'Kritap'],
            targetPest: 'Yellow Stem Borer (Dead hearts & White ears) & Leaf Folder',
            dosage: '7.5 kg / acre (Granules) or 2.0 g / L (Spray)',
            applicationMethod: 'Broadcasting in standing water or foliar spray at tillering.',
            preHarvestIntervalDays: 21,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Maintain 2-3 cm standing water in field for 3 days after granule broadcasting.'
          },
          {
            chemicalName: 'Tricyclazole 75% WP',
            activeIngredient: 'Tricyclazole (Melanin biosynthesis inhibitor)',
            tradeNames: ['Beam', 'Baan', 'Sivic'],
            targetPest: 'Leaf Blast, Node Blast, and Neck Blast',
            dosage: '0.6 g / liter of water',
            applicationMethod: 'Preventive foliar spray at early tillering and panicle emergence.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Most trusted systemic blast fungicide; prevents spore penetration into leaf cuticle.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Root Dip Treatment of Seedlings',
            type: 'Seed Treatment',
            instruction: 'Dip seedling roots in solution of Chlorpyrifos 20 EC (1 ml/L) or Carbendazim (1 g/L) for 30 minutes before transplanting.',
            timing: 'At transplanting'
          },
          {
            name: 'Alternate Wetting and Drying (AWD)',
            type: 'Cultural Practice',
            instruction: 'Allow field water to subside before re-irrigating to strengthen root anchoring and deter Brown Planthopper buildup.',
            timing: 'From tillering onwards'
          }
        ]
      },
      {
        id: 'jun-soybean',
        name: 'Soybean',
        teluguName: 'సోయాబీన్',
        hindiName: 'सोयाबीन',
        scientificName: 'Glycine max',
        category: 'commercial',
        sowingWindow: 'Main Kharif rainfed sowing',
        harvestDurationDays: '90 - 105 days',
        waterRequirement: 'Medium',
        idealTemperature: '25°C - 32°C',
        soilType: 'Deep fertile loams and black soils',
        tagline: 'High protein and oil crop prone to Girdle Beetle and Spodoptera defoliation.',
        keyPestsAndDiseases: ['Girdle Beetle (Obereopsis)', 'Tobacco Caterpillar (Spodoptera)', 'Yellow Mosaic Virus', 'Collar Rot'],
        chemicalControls: [
          {
            chemicalName: 'Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC',
            activeIngredient: 'Chlorantraniliprole + Lambda-cyhalothrin',
            tradeNames: ['Ampligo', 'Voliam Flexi'],
            targetPest: 'Girdle Beetle, Semilooper, Spodoptera caterpillars',
            dosage: '0.4 ml / liter of water',
            applicationMethod: 'Foliar spray at 30-35 DAS when first girdling cuts appear.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Capsule suspension formulation provides fast knockdown plus 20-day residual control.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Bradyrhizobium japonicum Inoculation',
            type: 'Seed Treatment',
            instruction: 'Mix 5g bio-inoculant per kg seed to maximize nitrogen-fixing root nodule formation.',
            timing: 'Immediately before seed sowing'
          }
        ]
      }
    ]
  },

  // 6. JULY
  {
    monthIndex: 6,
    monthName: 'July',
    seasonName: 'Main Kharif Vegetative Stage',
    seasonBadge: '🌿 Peak Monsoon & Active Tillering',
    climateOverview: 'Continuous overcast skies, heavy rainfall, high humidity (>85%). Explosive vegetative growth accompanied by high disease pressure.',
    primaryFieldAdvisory: [
      'Maintain surface drainage in non-paddy crops (cotton, pulses, maize) to prevent root asphyxiation.',
      'Apply first top-dressing of nitrogen (Urea) in paddy and maize during active tillering/knee-high stage.',
      'Bacterial and fungal foliar blights spread rapidly through splash dispersal.'
    ],
    keyPreventativeSteps: [
      'Scout field corners and bunds for early pest foci (armyworms, sucking pests).',
      'Spray copper fungicides + Streptocycline during breaks in rainfall to protect vegetables.',
      'Weed thoroughly to eliminate pest shelter habitats.'
    ],
    recommendedCrops: [
      {
        id: 'jul-chilli',
        name: 'Chilli & Pepper',
        teluguName: 'మిరపకాయ',
        hindiName: 'मिर्च',
        scientificName: 'Capsicum annuum',
        category: 'vegetables',
        sowingWindow: 'Kharif Transplanting',
        harvestDurationDays: '120 - 150 days',
        waterRequirement: 'Medium',
        idealTemperature: '22°C - 32°C',
        soilType: 'Well-drained sandy loam or black loam',
        tagline: 'High commercial value spice requiring intensive thrips, mite, and anthracnose control.',
        sampleCropId: 'sample-chilli',
        keyPestsAndDiseases: ['Chilli Thrips (Scirtothrips dorsalis)', 'Yellow Mites (Polyphagotarsonemus)', 'Anthracnose / Dieback (Colletotrichum)', 'Chilli Leaf Curl'],
        chemicalControls: [
          {
            chemicalName: 'Spinetoram 11.7% SC',
            activeIngredient: 'Spinetoram (Spinosyn class)',
            tradeNames: ['Delegate', 'Largo', 'Summit'],
            targetPest: 'Black Thrips & Leaf Curl causing thrips',
            dosage: '0.8 - 1.0 ml / liter of water',
            applicationMethod: 'Foliar spray reaching the tender growing terminal shoots.',
            preHarvestIntervalDays: 3,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Outstanding control against invasive black thrips (Thrips parvispinus).'
          },
          {
            chemicalName: 'Pyraclostrobin 20% WG',
            activeIngredient: 'Pyraclostrobin (Strobilurin)',
            tradeNames: ['Cabrio Top (combo)', 'Headline', 'Insignia'],
            targetPest: 'Anthracnose, Dieback, and Frogeye Leaf Spot',
            dosage: '1.0 g / liter of water',
            applicationMethod: 'Protective systemic spray before fruit setting.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Enhances plant vitality and chlorophyll retention.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Blue & Yellow Sticky Trap Array',
            type: 'Physical Trap',
            instruction: 'Install 10 blue traps (for thrips) and 10 yellow traps (for whiteflies/aphids) per acre.',
            timing: 'At transplanting time'
          },
          {
            name: 'Neem & Karanj Oil Alternate Spray',
            type: 'Bio-Pesticide',
            instruction: 'Spray 5 ml/L botanical oil mix every 7 days as oviposition deterrent.',
            timing: 'Throughout early vegetative phase'
          }
        ]
      },
      {
        id: 'jul-groundnut',
        name: 'Groundnut / Peanut',
        teluguName: 'వేరుశనగ',
        hindiName: 'मूंगफली',
        scientificName: 'Arachis hypogaea',
        category: 'commercial',
        sowingWindow: 'Kharif sowing completion & pegging',
        harvestDurationDays: '105 - 120 days',
        waterRequirement: 'Medium',
        idealTemperature: '25°C - 32°C',
        soilType: 'Light sandy loam with friable texture for peg penetration',
        tagline: 'Oilseed crop requiring strict Tikka disease and collar rot prevention.',
        keyPestsAndDiseases: ['Tikka Leaf Spot (Cercospora)', 'Collar Rot (Aspergillus)', 'Spodoptera Defoliator', 'White Grub'],
        chemicalControls: [
          {
            chemicalName: 'Hexaconazole 5% + Captan 70% WP',
            activeIngredient: 'Hexaconazole + Captan',
            tradeNames: ['Taqat', 'Sprint', 'Rizolex'],
            targetPest: 'Early & Late Tikka Leaf Spot, Rust',
            dosage: '2.0 g / liter of water',
            applicationMethod: 'Foliar spray when small dark spots first appear on lower leaves.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Covers both systemic eradication and broad-spectrum contact protection.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Gypsum Application at Flowering',
            type: 'Cultural Practice',
            instruction: 'Apply 200 kg Gypsum per acre at 40-45 DAS around root zone to provide calcium for solid pod/shell formation.',
            timing: 'Pegging stage (40-45 DAS)'
          }
        ]
      }
    ]
  },

  // 7. AUGUST (CURRENT MONTH)
  {
    monthIndex: 7,
    monthName: 'August',
    seasonName: 'Late Kharif / Peak Monsoon Management',
    seasonBadge: '🌧️ Active Monsoon Diagnostics & Care',
    climateOverview: 'Warm, highly humid (80-95%) with frequent monsoon showers. Ideal conditions for fungal spores, bacterial blights, and rapid insect hatching.',
    primaryFieldAdvisory: [
      'Prioritize surface drainage in all vegetable and cotton plots to prevent collar rot and damping-off.',
      'Sow early nursery of cruciferous vegetables (Cauliflower, Cabbage) under protective net houses.',
      'Inspect fruit and flower crops for borer entrance holes after heavy downpours.'
    ],
    keyPreventativeSteps: [
      'Add agricultural wetting agent/sticker (silicone spreader @ 0.5 ml/L) with all sprays to prevent wash-off.',
      'Prune dead/senescent lower leaves in tomato, chilli, and brinjal to improve air circulation.',
      'Monitor for Brown Planthopper (BPH) at the base of paddy hills.'
    ],
    recommendedCrops: [
      {
        id: 'aug-brinjal',
        name: 'Brinjal / Eggplant',
        teluguName: 'వంకాయ',
        hindiName: 'बैंगन',
        scientificName: 'Solanum melongena',
        category: 'vegetables',
        sowingWindow: 'Transplanting & active vegetative growth',
        harvestDurationDays: '70 - 90 days',
        waterRequirement: 'Medium',
        idealTemperature: '22°C - 32°C',
        soilType: 'Deep, rich loamy soil with good organic content',
        tagline: 'Popular high-yielding vegetable requiring rigorous Shoot and Fruit Borer control.',
        keyPestsAndDiseases: ['Shoot & Fruit Borer (Leucinodes orbonalis)', 'Phomopsis Blight', 'Epilachna Beetle', 'Little Leaf Disease'],
        chemicalControls: [
          {
            chemicalName: 'Emamectin Benzoate 5% SG',
            activeIngredient: 'Emamectin Benzoate',
            tradeNames: ['Proclaim', 'Missile', 'King-Emam'],
            targetPest: 'Brinjal Shoot & Fruit Borer caterpillars',
            dosage: '0.4 g / liter of water',
            applicationMethod: 'Foliar spray directed at shoots, flower buds, and developing calyxes.',
            preHarvestIntervalDays: 3,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Apply as soon as withered/drooping shoots appear; clip and destroy bored shoots before spraying.'
          },
          {
            chemicalName: 'Chlorantraniliprole 18.5% SC',
            activeIngredient: 'Chlorantraniliprole',
            tradeNames: ['Coragen', 'Cover'],
            targetPest: 'Fruit borer larval entries',
            dosage: '0.3 - 0.4 ml / liter of water',
            applicationMethod: 'Thorough coverage at 15-day intervals during fruiting.',
            preHarvestIntervalDays: 3,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Very safe for humans with minimal residue; rotate with Spinosad.'
          },
          {
            chemicalName: 'Copper Oxychloride 50% WP + Streptocycline',
            activeIngredient: 'Copper Oxychloride (50%) + Streptomycin Sulfate (90%)',
            tradeNames: ['Blitox 50 + Streptocycline pouch'],
            targetPest: 'Phomopsis Fruit Rot & Bacterial Wilt',
            dosage: '2.5 g Blitox + 0.1 g Streptocycline per liter',
            applicationMethod: 'Foliar spray and root collar drench.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Spray during dry interval between monsoon showers.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Leucinodes Pheromone Traps (Lucilure)',
            type: 'Physical Trap',
            instruction: 'Install 8-10 Lucilure traps per acre at canopy height to capture male moths and lower egg count.',
            timing: 'From 20 days after transplanting'
          },
          {
            name: 'Mechanical Shoot Clipping',
            type: 'Cultural Practice',
            instruction: 'Walk fields twice weekly to clip and deep-bury drooping terminal shoots containing larvae.',
            timing: 'Continuous weekly activity'
          }
        ]
      },
      {
        id: 'aug-cauliflower',
        name: 'Cauliflower & Cabbage',
        teluguName: 'కాలిఫ్లవర్',
        hindiName: 'फूलगोभी / पत्तागोभी',
        scientificName: 'Brassica oleracea',
        category: 'vegetables',
        sowingWindow: 'Early Kharif Nursery Sowing & Raised Bed Planting',
        harvestDurationDays: '60 - 80 days',
        waterRequirement: 'Medium',
        idealTemperature: '18°C - 28°C',
        soilType: 'Heavy loam rich in organic matter and boron',
        tagline: 'High value early crucifer crop prone to Diamondback Moth (DBM) and black rot.',
        keyPestsAndDiseases: ['Diamondback Moth (Plutella xylostella)', 'Black Rot (Xanthomonas)', 'Damping-off in nursery', 'Tobacco Caterpillar'],
        chemicalControls: [
          {
            chemicalName: 'Chlorfenapyr 10% SC',
            activeIngredient: 'Chlorfenapyr (Pyrrole compound)',
            tradeNames: ['Intrepid', 'Spectra', 'Pirate'],
            targetPest: 'Resistant Diamondback Moth (DBM) larvae & Thrips',
            dosage: '1.5 - 2.0 ml / liter of water',
            applicationMethod: 'Foliar spray with thorough underside leaf coverage.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Uncouples oxidative phosphorylation; breaks resistance from pyrethroid overuse.'
          },
          {
            chemicalName: 'Carbendazim 12% + Mancozeb 63% WP',
            activeIngredient: 'Carbendazim + Mancozeb',
            tradeNames: ['SAAF', 'Sixer', 'Companion'],
            targetPest: 'Damping-off, Alternaria Leaf Spot, Downy Mildew',
            dosage: '1.5 - 2.0 g / liter of water',
            applicationMethod: 'Nursery bed drench and early field foliar spray.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Apply to seedling nursery 5 days before transplanting to field.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Indian Mustard Intercropping / Trap Crop',
            type: 'Cultural Practice',
            instruction: 'Plant 2 rows of mustard every 25 rows of cabbage/cauliflower to trap 80% of DBM moths.',
            timing: 'Sow mustard 10 days before cauliflower'
          },
          {
            name: 'Bacillus thuringiensis (Bt kurstaki) Spray',
            type: 'Bio-Pesticide',
            instruction: 'Spray Bt formulation (Dipel / Biolep @ 2 g/L) at sunset for biological caterpillar control.',
            timing: 'Early vegetative leaf expansion'
          }
        ]
      },
      {
        id: 'aug-frenchbeans',
        name: 'French Beans / Bush Beans',
        teluguName: 'బీన్స్',
        hindiName: 'फ्रेंच बीन्स',
        scientificName: 'Phaseolus vulgaris',
        category: 'vegetables',
        sowingWindow: 'August/September hill & plain sowing',
        harvestDurationDays: '50 - 65 days',
        waterRequirement: 'Medium',
        idealTemperature: '18°C - 26°C',
        soilType: 'Loamy soil with pH 5.5 - 6.8',
        tagline: 'Quick cash crop requiring stem fly and bean rust surveillance.',
        keyPestsAndDiseases: ['Stem Fly (Ophiomyia phaseoli)', 'Bean Rust (Uromyces)', 'Anthracnose', 'Aphids'],
        chemicalControls: [
          {
            chemicalName: 'Tebuconazole 25.9% EC',
            activeIngredient: 'Tebuconazole (Triazole)',
            tradeNames: ['Folicur', 'Topper', 'Tebuzol'],
            targetPest: 'Bean Rust & Powdery Mildew',
            dosage: '1.0 ml / liter of water',
            applicationMethod: 'Foliar spray at first appearance of rusty pustules.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Systemic ergosterol biosynthesis inhibitor providing quick eradication.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Seed Treatment with Imidacloprid 70 WS',
            type: 'Seed Treatment',
            instruction: 'Treat seeds @ 3g/kg seed before sowing to eliminate stem fly damage in first 25 days.',
            timing: 'Prior to sowing'
          }
        ]
      }
    ]
  },

  // 8. SEPTEMBER
  {
    monthIndex: 8,
    monthName: 'September',
    seasonName: 'Late Monsoon / Pre-Rabi Prep',
    seasonBadge: '🍂 Transition to Autumn Crops',
    climateOverview: 'Retreating monsoon with dropping nighttime temperatures. Humid days transitioning into cooler evenings, triggering powdery mildews and root grubs.',
    primaryFieldAdvisory: [
      'Prepare land for early winter potato, carrot, radish, and rabi onion nurseries.',
      'Monitor mature Kharif paddy for panicle blast and brown planthopper as water is drawn down.',
      'Deep plowing after final monsoon showers traps residual soil moisture for Rabi sowing.'
    ],
    keyPreventativeSteps: [
      'Apply Trichoderma viride enriched compost into soil during seedbed preparation.',
      'Drain excess standing water 10 days before harvesting early Kharif crops.',
      'Sow Coriander, Spinach, and Radish in short gaps for rapid early winter market supply.'
    ],
    recommendedCrops: [
      {
        id: 'sep-potato',
        name: 'Potato',
        teluguName: 'బంగాళాదుంప',
        hindiName: 'आलू',
        scientificName: 'Solanum tuberosum',
        category: 'vegetables',
        sowingWindow: 'Early autumn tuber planting',
        harvestDurationDays: '75 - 95 days',
        waterRequirement: 'Medium',
        idealTemperature: '16°C - 24°C',
        soilType: 'Loose, friable sandy loam rich in organic matter',
        tagline: 'High energy tuber crop demanding strict seed treatment and early blight defense.',
        keyPestsAndDiseases: ['Early & Late Blight (Phytophthora)', 'Potato Tuber Moth (Phthorimaea)', 'Black Scurf (Rhizoctonia)', 'Aphids'],
        chemicalControls: [
          {
            chemicalName: 'Propineb 70% WP',
            activeIngredient: 'Propineb (Zinc-containing Dithiocarbamate)',
            tradeNames: ['Antracol', 'Propi-Care'],
            targetPest: 'Early Blight & Foliar leaf spots',
            dosage: '2.5 g / liter of water',
            applicationMethod: 'Preventive foliar wash supplying essential Zinc nutrition as well.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Apply proactively before cloudy cool spells trigger blight sporulation.'
          },
          {
            chemicalName: 'Dimethomorph 50% WP',
            activeIngredient: 'Dimethomorph (Cinnamic acid derivative)',
            tradeNames: ['Acrobat', 'Sphinx', 'Merit'],
            targetPest: 'Late Blight (curative systemic control)',
            dosage: '1.0 g / liter of water',
            applicationMethod: 'Tank mix with Mancozeb (2g/L) for dual contact + systemic punch.',
            preHarvestIntervalDays: 10,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Stops cell wall formation of oomycete fungi within 4 hours of spraying.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Seed Tuber Disinfection (Boric Acid 3%)',
            type: 'Seed Treatment',
            instruction: 'Dip cut or whole seed tubers in 3% Boric acid solution for 20 minutes to prevent Black Scurf.',
            timing: 'Before tuber planting'
          },
          {
            name: 'Earthing Up & Ridge Formation',
            type: 'Cultural Practice',
            instruction: 'Heap soil around plant base at 30 DAS to prevent tuber exposure to sun and tuber moth egg-laying.',
            timing: '30 and 45 days after planting'
          }
        ]
      },
      {
        id: 'sep-radish',
        name: 'Radish & Carrot',
        teluguName: 'ముల్లంగి / క్యారెట్',
        hindiName: 'मूली / गाजर',
        scientificName: 'Raphanus sativus',
        category: 'vegetables',
        sowingWindow: 'Autumn raised bed direct drilling',
        harvestDurationDays: '40 - 60 days',
        waterRequirement: 'Medium',
        idealTemperature: '15°C - 25°C',
        soilType: 'Deep loose sandy loam without gravel or hardpan',
        tagline: 'Crisp fast-growing root vegetables requiring flea beetle and rot protection.',
        keyPestsAndDiseases: ['Flea Beetles (Phyllotreta)', 'Mustard Sawfly', 'Alternaria Blight', 'Root Splitting'],
        chemicalControls: [
          {
            chemicalName: 'Cypermethrin 10% EC',
            activeIngredient: 'Cypermethrin (Synthetic Pyrethroid)',
            tradeNames: ['Ustaad', 'Cymbush', 'Ripcord'],
            targetPest: 'Flea beetles shot-holing foliage & Sawfly larvae',
            dosage: '1.0 ml / liter of water',
            applicationMethod: 'Targeted contact spray at dusk.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Provides rapid knockdown action against chewing beetles on young cotyledons.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Floating Row Covers (Agro-textile)',
            type: 'Physical Trap',
            instruction: 'Cover seedling beds with 17 gsm fleece netting for first 20 days to exclude flea beetles completely.',
            timing: 'Immediately after seed drilling'
          }
        ]
      }
    ]
  },

  // 9. OCTOBER
  {
    monthIndex: 9,
    monthName: 'October',
    seasonName: 'Rabi Season Kickoff / Post-Monsoon',
    seasonBadge: '🌾 Main Rabi Planting Season',
    climateOverview: 'Clear sunny skies with falling night temperatures (18°C - 24°C). The premier sowing window for wheat, mustard, chickpea, garlic, and winter vegetables.',
    primaryFieldAdvisory: [
      'Commence sowing of high-yielding Mustard, Bengal Gram, Lentils, and Rabi Onion nurseries.',
      'Incorporate balanced basal NPK (especially Phosphorus & Potash) for vigorous winter root establishment.',
      'Ensure soil has optimum moisture (field capacity) at the time of seed drilling.'
    ],
    keyPreventativeSteps: [
      'Seed dressing with Rhizobium and Trichoderma is non-negotiable for rabi pulse yields.',
      'Calibrate seed drill depth to 3-5 cm for wheat and mustard to ensure uniform germination.',
      'Install light traps to catch last generation armyworms.'
    ],
    recommendedCrops: [
      {
        id: 'oct-mustard',
        name: 'Mustard & Rapeseed',
        teluguName: 'ఆవాలు',
        hindiName: 'सरसों',
        scientificName: 'Brassica juncea',
        category: 'commercial',
        sowingWindow: 'Optimal sowing window (1st to 20th October)',
        harvestDurationDays: '110 - 130 days',
        waterRequirement: 'Low',
        idealTemperature: '18°C - 25°C',
        soilType: 'Alluvial to medium loam with good moisture retention',
        tagline: 'Premier rabi oilseed; timely October sowing avoids severe peak-season aphid damage.',
        keyPestsAndDiseases: ['Mustard Aphid', 'White Rust (Albugo candida)', 'Painted Bug (Bagrada)', 'Alternaria Blight'],
        chemicalControls: [
          {
            chemicalName: 'Thiamethoxam 25% WG',
            activeIngredient: 'Thiamethoxam',
            tradeNames: ['Actara', 'Cruiser'],
            targetPest: 'Painted Bug & Early Flea Beetles at germination',
            dosage: '0.3 g / liter of water',
            applicationMethod: 'Foliar spray at 15-20 days crop stage.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Controls sap-suckers and stimulates root growth.'
          },
          {
            chemicalName: 'Metalaxyl 35% WS',
            activeIngredient: 'Metalaxyl',
            tradeNames: ['Apron 35 SD', 'Krilaxyl'],
            targetPest: 'White Rust & Downy Mildew seed-borne infection',
            dosage: '6 g / kg of seed (Dry seed treatment)',
            applicationMethod: 'Thorough seed coating before sowing.',
            preHarvestIntervalDays: 60,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Ensures emerging seedlings are free from systemic white stag-head formation.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Timely Early Sowing in October',
            type: 'Cultural Practice',
            instruction: 'Complete sowing by October 20 to allow crop to mature before major aphid populations build in January.',
            timing: 'First 3 weeks of October'
          }
        ]
      },
      {
        id: 'oct-onion',
        name: 'Onion (Rabi)',
        teluguName: 'ఉల్లిపాయ',
        hindiName: 'प्याज',
        scientificName: 'Allium cepa',
        category: 'vegetables',
        sowingWindow: 'Rabi Nursery Sowing in raised beds',
        harvestDurationDays: '130 - 150 days',
        waterRequirement: 'Medium',
        idealTemperature: '15°C - 26°C',
        soilType: 'Rich friable loam with pH 6.5 - 7.5',
        tagline: 'High storage potential rabi onion requiring thrips and purple blotch management.',
        keyPestsAndDiseases: ['Onion Thrips (Thrips tabaci)', 'Purple Blotch (Alternaria porri)', 'Stemphylium Blight', 'Damping Off'],
        chemicalControls: [
          {
            chemicalName: 'Difenoconazole 25% EC',
            activeIngredient: 'Difenoconazole (Triazole)',
            tradeNames: ['Score', 'Domain', 'Tayto'],
            targetPest: 'Purple Blotch & Stemphylium leaf blight',
            dosage: '0.8 - 1.0 ml / liter of water',
            applicationMethod: 'Foliar spray with sticker (surfactant is mandatory on waxy onion leaves).',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Mix with non-ionic sticker like Agral-90 or Sandovit @ 0.5 ml/L.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Blue Sticky Traps in Nursery',
            type: 'Physical Trap',
            instruction: 'Place 6 blue sticky traps per 100 sq meter of onion nursery to intercept early thrips.',
            timing: 'From 10 days after germination'
          }
        ]
      }
    ]
  },

  // 10. NOVEMBER
  {
    monthIndex: 10,
    monthName: 'November',
    seasonName: 'Peak Rabi Sowing / Cool Autumn',
    seasonBadge: '🌾 Wheat & Pulse Main Sowing',
    climateOverview: 'Pleasantly cool days (22°C - 26°C) and crisp cold nights (12°C - 16°C). The golden window for planting high-yielding wheat varieties.',
    primaryFieldAdvisory: [
      'Sow main season Wheat (PBW, HD, WH varieties) using zero-tillage or conventional seed-cum-fertilizer drills.',
      'Transplant 40-45 day old onion seedlings into main field.',
      'Thin out dense mustard and chickpea rows to maintain optimal 30x10 cm plant geometry.'
    ],
    keyPreventativeSteps: [
      'Pre-emergence weed control in wheat with Pendimethalin or Sulfosulfuron + Metsulfuron.',
      'Treat wheat seed with Tebuconazole (1g/kg) to eliminate Loose Smut and Karnal Bunt.',
      'Provide first Crown Root Initiation (CRI) irrigation in wheat at 20-25 DAS.'
    ],
    recommendedCrops: [
      {
        id: 'nov-wheat',
        name: 'Wheat',
        teluguName: 'గోధుమలు',
        hindiName: 'गेहूं',
        scientificName: 'Triticum aestivum',
        category: 'cereals',
        sowingWindow: 'Optimal sowing window (1st to 25th November)',
        harvestDurationDays: '120 - 145 days',
        waterRequirement: 'Medium (4-5 critical irrigations)',
        idealTemperature: '12°C - 24°C',
        soilType: 'Fertile clay loam to loam with good water capacity',
        tagline: 'Nation’s primary foodgrain; requires CRI irrigation and rust/smut protection.',
        sampleCropId: 'sample-wheat',
        keyPestsAndDiseases: ['Yellow & Brown Rust (Puccinia)', 'Loose Smut (Ustilago)', 'Termites (Microtermes)', 'Phalaris minor (Canary grass weed)'],
        chemicalControls: [
          {
            chemicalName: 'Tebuconazole 2% DS',
            activeIngredient: 'Tebuconazole',
            tradeNames: ['Raxil', 'Tebu-Seed'],
            targetPest: 'Loose Smut, Karnal Bunt, and Flag Smut',
            dosage: '1.0 g / kg of wheat seed',
            applicationMethod: 'Dry seed dressing in rotating drum before drilling.',
            preHarvestIntervalDays: 90,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Protects entire crop cycle from internally seed-borne smut fungi.'
          },
          {
            chemicalName: 'Chlorpyrifos 20% EC',
            activeIngredient: 'Chlorpyrifos (Organophosphate)',
            tradeNames: ['Dursban', 'Radar', 'Tricel'],
            targetPest: 'Subterranean Termites cutting crown roots',
            dosage: '1.0 - 1.5 liters / acre mixed with irrigation water or sand',
            applicationMethod: 'Soil application along first CRI irrigation channel.',
            preHarvestIntervalDays: 30,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Apply in evening irrigation to prevent termite seedling wilting.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Zero Tillage Direct Sowing (Happy Seeder)',
            type: 'Cultural Practice',
            instruction: 'Drill wheat directly into standing paddy stubble to conserve moisture and suppress weeds by 60%.',
            timing: 'At time of sowing'
          }
        ]
      },
      {
        id: 'nov-garlic',
        name: 'Garlic',
        teluguName: 'వెల్లుల్లి',
        hindiName: 'लहसुन',
        scientificName: 'Allium sativum',
        category: 'commercial',
        sowingWindow: 'Winter clove planting',
        harvestDurationDays: '130 - 160 days',
        waterRequirement: 'Medium',
        idealTemperature: '12°C - 22°C',
        soilType: 'Rich sandy loam with pH 6.0 - 7.0',
        tagline: 'High value cash spice requiring healthy clove selection and mite defense.',
        keyPestsAndDiseases: ['Garlic Thrips', 'Stem and Bulb Nematode', 'White Rot (Sclerotium)', 'Purple Blotch'],
        chemicalControls: [
          {
            chemicalName: 'Carbosulfan 25% EC',
            activeIngredient: 'Carbosulfan (Carbamate)',
            tradeNames: ['Marshal', 'Rambo'],
            targetPest: 'Thrips & Bulb mites in soil',
            dosage: '2.0 ml / liter of water',
            applicationMethod: 'Foliar spray and base drenching.',
            preHarvestIntervalDays: 14,
            safetyLevel: 'Warning (Blue)',
            applicationTips: 'Wear full protective gloves when handling.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Clove Soaking with Trichoderma + Carbendazim',
            type: 'Seed Treatment',
            instruction: 'Soak healthy cloves in Carbendazim 2g/L for 15 minutes before dibbling into beds.',
            timing: 'Just before planting'
          }
        ]
      }
    ]
  },

  // 11. DECEMBER
  {
    monthIndex: 11,
    monthName: 'December',
    seasonName: 'Peak Winter / Mid-Rabi Care',
    seasonBadge: '❄️ Cold Wave & Frost Vigilance',
    climateOverview: 'Coldest month with dense morning fogs, low nocturnal temperatures (4°C - 12°C), and low solar evaporation. High risk of frost and powdery mildews.',
    primaryFieldAdvisory: [
      'Irrigate crops during frost warnings; wet soil holds heat longer and prevents frost freeze-damage.',
      'Create evening smoke screens (smudge pots/dry biomass) on northern field borders to ward off freezing winds.',
      'Monitor wheat and peas for yellow rust and powdery mildew as fog lingers.'
    ],
    keyPreventativeSteps: [
      'Spray 0.1% Thiourea or 0.2% Potassium Nitrate (13-0-45) to induce cold and frost resilience.',
      'Scout pea crops twice weekly for powdery white dusting on lower foliage.',
      'Weed second time in late-sown rabi crops.'
    ],
    recommendedCrops: [
      {
        id: 'dec-peas',
        name: 'Green Peas / Garden Pea',
        teluguName: 'బఠానీలు',
        hindiName: 'मटर',
        scientificName: 'Pisum sativum',
        category: 'vegetables',
        sowingWindow: 'Mid-winter flowering & pod filling',
        harvestDurationDays: '60 - 75 days',
        waterRequirement: 'Low to Medium',
        idealTemperature: '10°C - 20°C',
        soilType: 'Well-drained loam to silt loam',
        tagline: 'Sweet winter vegetable demanding powdery mildew and pod borer vigilance.',
        keyPestsAndDiseases: ['Powdery Mildew (Erysiphe pisi)', 'Pea Leaf Miner (Phytomyza)', 'Pod Borer (Helicoverpa)', 'Rust'],
        chemicalControls: [
          {
            chemicalName: 'Wettable Sulfur 80% WDG',
            activeIngredient: 'Sulfur 80% WDG',
            tradeNames: ['Sulfex', 'Thiovit', 'Insufl'],
            targetPest: 'Powdery Mildew (white flour-like dusting on leaves)',
            dosage: '2.5 - 3.0 g / liter of water',
            applicationMethod: 'Foliar spray covering entire canopy upon initial detection.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Provides both excellent fungal cure and essential sulfur micronutrient.'
          },
          {
            chemicalName: 'Indoxacarb 14.5% SC',
            activeIngredient: 'Indoxacarb (Oxadiazine class)',
            tradeNames: ['Avaunt', 'King-Doxa', 'Plethora (combo)'],
            targetPest: 'Pea Pod Borer caterpillars puncturing young pods',
            dosage: '0.8 ml / liter of water',
            applicationMethod: 'Spray at 50% flowering to protect developing flat pods.',
            preHarvestIntervalDays: 5,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Voltage-gated sodium channel blocker; rapid feeding cessation within 2 hours.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Cow Urine & Fermented Milk (Buttermilk) Spray',
            type: 'Bio-Pesticide',
            instruction: 'Mix 1 liter sour buttermilk + 1 liter cow urine in 10 liters water as traditional mild antifungal spray.',
            timing: 'Weekly preventive application'
          }
        ]
      },
      {
        id: 'dec-coriander',
        name: 'Coriander & Leafy Greens',
        teluguName: 'కొత్తిమీర',
        hindiName: 'धनिया / मेथी / पालक',
        scientificName: 'Coriandrum sativum',
        category: 'vegetables',
        sowingWindow: 'Winter continuous multi-cut sowing',
        harvestDurationDays: '35 - 50 days',
        waterRequirement: 'Medium',
        idealTemperature: '12°C - 22°C',
        soilType: 'Rich, moisture retentive garden loam',
        tagline: 'High margin aromatic green requiring stem gall and aphid protection.',
        keyPestsAndDiseases: ['Stem Gall (Protomyces macrosporus)', 'Powdery Mildew', 'Aphids'],
        chemicalControls: [
          {
            chemicalName: 'Hexaconazole 5% SC',
            activeIngredient: 'Hexaconazole',
            tradeNames: ['Contaf Plus', 'Sitara', 'Glow'],
            targetPest: 'Stem Gall swelling & Powdery Mildew',
            dosage: '1.0 ml / liter of water',
            applicationMethod: 'Foliar spray at 30 days crop growth.',
            preHarvestIntervalDays: 7,
            safetyLevel: 'Caution (Green)',
            applicationTips: 'Spray only if meant for grain seed production; avoid on fresh culinary leaves within 7 days of cutting.'
          }
        ],
        preventativeMeasures: [
          {
            name: 'Seed Crushing & Soaking (Coriander splits)',
            type: 'Cultural Practice',
            instruction: 'Split mericarps gently into two halves and soak in water for 12 hours before sowing for 90% uniform germination.',
            timing: 'Pre-sowing treatment'
          }
        ]
      }
    ]
  }
];

export function getGuideForMonth(monthIndex: number): MonthSeasonalGuide {
  const normalized = Math.max(0, Math.min(11, monthIndex));
  return SEASONAL_GUIDE_DATA[normalized] || SEASONAL_GUIDE_DATA[7];
}
