export interface ChemicalPesticideItem {
  tradeName: string;
  activeIngredient: string;
  dosagePerLiter: string;
  dosageFor15LTank: string;
  targetStage: string;
  phiDays: number; // Pre-Harvest Interval in days
  actionType: 'Systemic' | 'Contact' | 'Translaminar' | 'Broad-Spectrum';
  safetyWarning: string;
}

export interface OrganicBiopesticideItem {
  name: string;
  preparation: string;
  dosagePerLiter: string;
  frequency: string;
  benefits: string;
}

export interface DamagedCropRescueGuide {
  damageCategory: string;
  categoryIcon: string;
  commonSymptoms: string[];
  immediateRescueSteps: string[];
  chemicalPesticides: ChemicalPesticideItem[];
  organicBiopesticides: OrganicBiopesticideItem[];
  nutritionalRecovery: string;
  safetyDirections: string[];
}

export interface CropSpecificPesticideGuide {
  cropId: string;
  cropName: string;
  commonDamages: DamagedCropRescueGuide[];
}

export const GENERAL_DAMAGE_RESCUE_GUIDELINES: DamagedCropRescueGuide[] = [
  {
    damageCategory: 'Foliar Blights, Rusts & Fungal Leaf Spots',
    categoryIcon: '🍂',
    commonSymptoms: [
      'Concentric target-like brown/black bullseye rings on leaves',
      'Water-soaked necrotic lesions spreading rapidly in humid weather',
      'Orange-brown powdery pustules under leaves (Rust)',
      'White powdery or downy coating on upper and lower leaf surfaces',
      'Premature leaf yellowing and severe defoliation'
    ],
    immediateRescueSteps: [
      'Sanitize the field immediately: Clip off and remove heavily blighted bottom leaves with clean shears.',
      'Do NOT compost infected leaves; burn or bury them deep away from crops.',
      'Halt all overhead sprinkler irrigation; convert to soil-level drip to prevent spore splashback.',
      'Spray in early morning (6:00 AM - 9:00 AM) or late afternoon with a non-ionic silicon spreader.'
    ],
    chemicalPesticides: [
      {
        tradeName: 'Amistar Top / Custodia',
        activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dosagePerLiter: '1.0 ml / Litre of water',
        dosageFor15LTank: '15 ml in 15L Knapsack Sprayer',
        targetStage: 'Active lesion outbreak and preventative canopy protection',
        phiDays: 5,
        actionType: 'Systemic',
        safetyWarning: 'Do not apply more than 2 consecutive sprays; alternate with different chemical MOA group.'
      },
      {
        tradeName: 'Dithane M-45 / Indofil M-45',
        activeIngredient: 'Mancozeb 75% WP',
        dosagePerLiter: '2.0 - 2.5 g / Litre of water',
        dosageFor15LTank: '35 - 40 g in 15L Knapsack Sprayer',
        targetStage: 'Early spot onset; broad contact protectant barrier',
        phiDays: 7,
        actionType: 'Contact',
        safetyWarning: 'Wear respirator mask during mixing; toxic to aquatic organisms.'
      },
      {
        tradeName: 'Ridomil Gold',
        activeIngredient: 'Metalaxyl-M 4% + Mancozeb 64% WP',
        dosagePerLiter: '2.0 g / Litre of water',
        dosageFor15LTank: '30 g in 15L Knapsack Sprayer',
        targetStage: 'Aggressive Late Blight, Downy Mildew, and Phytophthora',
        phiDays: 7,
        actionType: 'Systemic',
        safetyWarning: 'Excellent translaminar and systemic mobility; apply before heavy rain.'
      },
      {
        tradeName: 'Folicur / Score',
        activeIngredient: 'Tebuconazole 25.9% EC / Difenoconazole 25% EC',
        dosagePerLiter: '0.75 - 1.0 ml / Litre of water',
        dosageFor15LTank: '12 - 15 ml in 15L Knapsack Sprayer',
        targetStage: 'Severe powdery mildew, rust, and purple blotch',
        phiDays: 14,
        actionType: 'Systemic',
        safetyWarning: 'Potent triazole fungicide; ensure proper pre-harvest safety interval.'
      }
    ],
    organicBiopesticides: [
      {
        name: 'Cold-Pressed Neem Oil (10,000 PPM / Azadirachtin)',
        preparation: 'Mix with 1 ml organic liquid soap / sticker in lukewarm water',
        dosagePerLiter: '3.0 - 5.0 ml / Litre',
        frequency: 'Every 5 - 7 days on both upper and lower leaf surfaces',
        benefits: 'Natural antifungal coating and insect anti-feedant properties.'
      },
      {
        name: 'Trichoderma viride / harzianum Bio-Fungicide',
        preparation: 'Mix bio-formulation in water with jaggery/molasses for activation',
        dosagePerLiter: '5.0 g / Litre (foliar & soil drench)',
        frequency: 'Every 10 days',
        benefits: 'Hyper-parasitizes pathogenic fungal mycelium and induces systemic plant resistance.'
      },
      {
        name: 'Copper Oxychloride 50% WP (Blitox / Blue Copper)',
        preparation: 'Slurry mix in water before adding to tank',
        dosagePerLiter: '2.5 - 3.0 g / Litre',
        frequency: 'Once every 10-14 days',
        benefits: 'OMRI-approved broad-spectrum contact bactericide and fungicide.'
      }
    ],
    nutritionalRecovery: 'After fungal containment (day 3-5), apply foliar spray of Chelated Zinc (12% EDTA) at 1 g/L + Water-soluble NPK 19-19-19 at 3 g/L + Seaweed extract (2 ml/L) to regenerate damaged photosynthetic leaf tissue.',
    safetyDirections: [
      'Always spray with the wind at your back to prevent spray drift onto operator.',
      'Wear protective rubber gloves, N95 face mask, goggles, and waterproof apron.',
      'Keep livestock and pets out of sprayed crop plots for at least 24 hours.'
    ]
  },
  {
    damageCategory: 'Chewing Caterpillars, Stem Borers & Armyworms',
    categoryIcon: '🐛',
    commonSymptoms: [
      'Large irregular holes chewed through leaves, buds, and growing shoots',
      'Boreholes in stems, corn ears, or tomato fruits filled with brown frass (caterpillar droppings)',
      'Entire branches or seedlings defoliated overnight (Armyworm / Hornworm damage)',
      'Dead heart symptom (drying central shoot) in cereal and paddy tillers'
    ],
    immediateRescueSteps: [
      'Handpick visible large caterpillars immediately into soapy water in small plots.',
      'Install Pheromone Traps (4 - 6 traps per acre) to monitor and trap adult male moths.',
      'Inspect crop early in the morning or late twilight when caterpillars feed actively.',
      'Spray targeted larvicide during 1st and 2nd instar young larval stages for 98%+ kill rate.'
    ],
    chemicalPesticides: [
      {
        tradeName: 'Coragen / Voliam Flexi',
        activeIngredient: 'Chlorantraniliprole 18.5% SC',
        dosagePerLiter: '0.3 - 0.4 ml / Litre of water',
        dosageFor15LTank: '5 - 6 ml in 15L Knapsack Sprayer',
        targetStage: 'Fruit borer, stem borer, Diamondback Moth (DBM), Fall Armyworm',
        phiDays: 3,
        actionType: 'Systemic',
        safetyWarning: 'Activates ryanodine receptors causing immediate feeding paralysis within 2 hours; very safe for beneficials.'
      },
      {
        tradeName: 'Proclaim / Emamec',
        activeIngredient: 'Emamectin Benzoate 5% SG',
        dosagePerLiter: '0.4 - 0.5 g / Litre of water',
        dosageFor15LTank: '6 - 8 g in 15L Knapsack Sprayer',
        targetStage: 'Heavy caterpillar foliage damage, pod borer, Helicoverpa',
        phiDays: 3,
        actionType: 'Translaminar',
        safetyWarning: 'Stops caterpillar feeding within 2-4 hours; penetrates leaf epidermis.'
      },
      {
        tradeName: 'Ampligo / Karate Zeon',
        activeIngredient: 'Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC',
        dosagePerLiter: '0.5 ml / Litre of water',
        dosageFor15LTank: '8 ml in 15L Knapsack Sprayer',
        targetStage: 'Emergency dual action: instant knockdown of adults + long residual on larvae',
        phiDays: 7,
        actionType: 'Broad-Spectrum',
        safetyWarning: 'Avoid spraying when honeybees are actively foraging in morning bloom.'
      }
    ],
    organicBiopesticides: [
      {
        name: 'Bacillus thuringiensis var. kurstaki (Dipel / Biolep)',
        preparation: 'Dissolve microbial powder in clean non-chlorinated water',
        dosagePerLiter: '2.0 g / Litre of water',
        frequency: 'Every 5 days during active caterpillar infestation',
        benefits: 'Produces delta-endotoxin crystals that selectively rupture caterpillar stomach lining with zero toxicity to humans or pollinators.'
      },
      {
        name: 'Spinosad 45% SC (Conserve / Tracer)',
        preparation: 'Mix gently in spray tank',
        dosagePerLiter: '0.3 ml / Litre of water',
        frequency: 'Once every 7-10 days',
        benefits: 'Naturally derived fermentation product of soil bacterium Saccharopolyspora spinosa.'
      },
      {
        name: 'Neem Seed Kernel Extract (NSKE 5%)',
        preparation: 'Pound 50g neem seeds, soak overnight in 1L water, filter through muslin cloth',
        dosagePerLiter: '50 ml / Litre of spray',
        frequency: 'Weekly',
        benefits: 'Potent insect growth regulator (IGR) disrupting larval molting and pupation.'
      }
    ],
    nutritionalRecovery: 'Foliar spray with Amino Acid bio-stimulant (2 ml/L) + Urea (0.5% or 5 g/L) to accelerate rapid regrowth of damaged leaf canopies.',
    safetyDirections: [
      'Never spray against strong wind.',
      'Do not eat, drink, or smoke while handling insecticide concentrates.',
      'Wash spray equipment thoroughly in designated drainage away from wells.'
    ]
  },
  {
    damageCategory: 'Sucking Pests (Aphids, Whiteflies, Thrips & Mites)',
    categoryIcon: '🦗',
    commonSymptoms: [
      'Leaves cupping downward or upward with crinkled, distorted new flush growth',
      'Sticky shiny liquid (honeydew) on foliage followed by black velvety sooty mold',
      'Silvery or bronzed stippling on leaf undersides with fine spider webbing (Mites/Thrips)',
      'Mosaic yellow mottling and vein clearing (viral transmission by whiteflies/aphids)'
    ],
    immediateRescueSteps: [
      'Install Bright Yellow Sticky Traps (for Whiteflies/Aphids) & Blue Sticky Traps (for Thrips) at 8-10 per acre.',
      'Use high-pressure water jet spraying to dislodge heavy colonies on undersides of leaves.',
      'Remove and burn severely stunted virus-infected plants (Leaf Curl / Mosaic) to prevent vector transmission.'
    ],
    chemicalPesticides: [
      {
        tradeName: 'Confidor / Imidagold',
        activeIngredient: 'Imidacloprid 17.8% SL',
        dosagePerLiter: '0.3 - 0.5 ml / Litre of water',
        dosageFor15LTank: '5 - 7.5 ml in 15L Knapsack Sprayer',
        targetStage: 'Aphids, Jassids, Leafhoppers, Plant bugs',
        phiDays: 7,
        actionType: 'Systemic',
        safetyWarning: 'Do not spray during full bloom to protect honeybees; spray in evening after sunset.'
      },
      {
        tradeName: 'Actara / Cruiser',
        activeIngredient: 'Thiamethoxam 25% WG',
        dosagePerLiter: '0.3 - 0.5 g / Litre of water',
        dosageFor15LTank: '5 - 8 g in 15L Knapsack Sprayer',
        targetStage: 'Whiteflies, Mealybugs, Thrips, Green leafhoppers',
        phiDays: 5,
        actionType: 'Systemic',
        safetyWarning: 'Rapidly absorbed by plant roots and foliage; gives 15-20 days residual protection.'
      },
      {
        tradeName: 'Oberon / Pegasus',
        activeIngredient: 'Spiromesifen 22.9% SC / Diafenthiuron 50% WP',
        dosagePerLiter: '1.0 ml or 1.0 g / Litre of water',
        dosageFor15LTank: '15 ml/g in 15L Knapsack Sprayer',
        targetStage: 'Resistant Red Spider Mites, Yellow Mites, and Whitefly Nymphs',
        phiDays: 7,
        actionType: 'Contact',
        safetyWarning: 'Inhibits lipid biosynthesis in mites; target lower leaf canopy thoroughly.'
      }
    ],
    organicBiopesticides: [
      {
        name: 'Verticillium lecanii / Beauveria bassiana Bio-Insecticide',
        preparation: 'Mix spores in water with 1 ml Tween-20 / sticker',
        dosagePerLiter: '5.0 g / Litre',
        frequency: 'Spray in late afternoon in high relative humidity',
        benefits: 'Entomopathogenic fungi that infect and mummify whiteflies, thrips, and aphids within 4-6 days.'
      },
      {
        name: 'Pure Cold-Pressed Neem Oil (3,000 - 10,000 PPM)',
        preparation: 'Emulsify with 1 ml dish soap per litre of water',
        dosagePerLiter: '5.0 ml / Litre',
        frequency: 'Every 4-5 days for 3 cycles',
        benefits: 'Smothers soft-bodied insects, deters egg laying, and blocks insect hormone receptors.'
      },
      {
        name: 'Potassium Salt of Fatty Acids (Insecticidal Soap)',
        preparation: 'Ready to dilute in soft water',
        dosagePerLiter: '10.0 ml / Litre',
        frequency: 'Targeted spot spray',
        benefits: 'Dissolves waxy protective cuticles of aphids and mealybugs causing rapid dehydration.'
      }
    ],
    nutritionalRecovery: 'Foliar application of Potassium Nitrate (13-0-45) at 4 g/L + Micronutrient mix (2 g/L) to strengthen vascular cell walls against further sap piercing.',
    safetyDirections: [
      'Target the undersides of leaves where sucking pests colonize.',
      'Do not apply oils or soaps in direct noon sun (>32°C) to avoid foliage burn (phytotoxicity).'
    ]
  },
  {
    damageCategory: 'Bacterial Wilts, Cankers & Black Rot',
    categoryIcon: '🦠',
    commonSymptoms: [
      'Rapid wilting of green leaves without preliminary yellowing during daytime',
      'Vascular browning inside stem when cut lengthwise; white milky bacterial ooze in water glass test',
      'Dark water-soaked angular leaf spots bordered by leaf veins',
      'Raised corky lesions on fruit and citrus twigs (Bacterial Canker)'
    ],
    immediateRescueSteps: [
      'Immediately rogue out and destroy severely wilted plants including root ball.',
      'Sterilize pruning shears with 70% isopropyl alcohol between each plant cut.',
      'Stop all furrow flood irrigation that carries bacterial streaming along the row.',
      'Apply agricultural bactericide drench to surrounding healthy plant root zones.'
    ],
    chemicalPesticides: [
      {
        tradeName: 'Plantomycin / Streptocycline',
        activeIngredient: 'Streptomycin Sulphate 90% + Tetracycline Hydrochloride 10% SP',
        dosagePerLiter: '0.1 - 0.2 g / Litre of water (6g pouch in 45-50L water)',
        dosageFor15LTank: '2 g in 15L Knapsack Sprayer',
        targetStage: 'Bacterial Leaf Blight, Canker, Black Rot, Vascular Wilt',
        phiDays: 14,
        actionType: 'Systemic',
        safetyWarning: 'Always tank-mix with Copper Oxychloride for synergistic antibacterial efficacy.'
      },
      {
        tradeName: 'Kocide / Blue Copper + Streptocycline',
        activeIngredient: 'Copper Hydroxide 53.8% DF + Streptomycin mix',
        dosagePerLiter: '2.0 g Copper + 0.1 g Streptocycline / Litre',
        dosageFor15LTank: '30 g Copper + 1.5 g Streptocycline in 15L Tank',
        targetStage: 'Foliar bacterial spots, fire blight, angular lesions',
        phiDays: 7,
        actionType: 'Contact',
        safetyWarning: 'Do not mix with acidic fertilizers or organophosphates.'
      }
    ],
    organicBiopesticides: [
      {
        name: 'Pseudomonas fluorescens Bio-Bactericide',
        preparation: 'Mix in water and apply as root drench and foliar spray',
        dosagePerLiter: '10.0 g / Litre of water',
        frequency: 'Every 7-10 days',
        benefits: 'Produces phenazine antibiotics and siderophores that starve and displace pathogenic bacteria.'
      },
      {
        name: 'Bacillus subtilis (Serenade ASO)',
        preparation: 'Mix in spray water',
        dosagePerLiter: '4.0 - 5.0 ml / Litre',
        frequency: 'Preventative and early curative spray',
        benefits: 'Colonizes leaf surface forming a living biological shield against bacterial infection.'
      }
    ],
    nutritionalRecovery: 'Drench soil with Calcium Nitrate (2 g/L) + Boron (0.5 g/L) to strengthen plant cell wall pectate layers.',
    safetyDirections: [
      'Use certified disease-free seeds and seedlings.',
      'Practice minimum 3-year crop rotation with non-host crops.'
    ]
  },
  {
    damageCategory: 'Root Rots, Collar Rots & Damping Off',
    categoryIcon: '🟤',
    commonSymptoms: [
      'Seedlings collapsing and rotting at the soil line (Damping-off)',
      'Roots turned brown/black, mushy, and sloughing off (Pythium / Rhizoctonia / Fusarium)',
      'Stunted yellowing plants with poor feeder root development',
      'White fungal web-like growth around the collar base at soil level (Sclerotium collar rot)'
    ],
    immediateRescueSteps: [
      'Immediately improve drainage; aerate topsoil around stem base and let soil dry out.',
      'Do root collar drenching immediately with targeted fungicide around the drip line.',
      'Avoid piling soil or organic mulch directly against the soft stem base.'
    ],
    chemicalPesticides: [
      {
        tradeName: 'Aliette',
        activeIngredient: 'Fosetyl-Al 80% WP',
        dosagePerLiter: '2.0 g / Litre of water',
        dosageFor15LTank: '30 g in 15L Knapsack Sprayer (Drenching)',
        targetStage: 'Phytophthora root rot, Pythium damping off, collar rot',
        phiDays: 7,
        actionType: 'Systemic',
        safetyWarning: 'Unique two-way systemic mobility (moves upward to leaves and downward to root tips).'
      },
      {
        tradeName: 'Bavistin / Dhanustin',
        activeIngredient: 'Carbendazim 50% WP',
        dosagePerLiter: '1.5 - 2.0 g / Litre of water',
        dosageFor15LTank: '25 - 30 g in 15L Tank (Soil Drench)',
        targetStage: 'Fusarium wilt, Rhizoctonia root rot, collar rot',
        phiDays: 14,
        actionType: 'Systemic',
        safetyWarning: 'Drench 150-200 ml of solution around the root zone of each affected plant.'
      },
      {
        tradeName: 'Saaf / Companion',
        activeIngredient: 'Carbendazim 12% + Mancozeb 63% WP',
        dosagePerLiter: '2.0 g / Litre of water',
        dosageFor15LTank: '30 g in 15L Tank',
        targetStage: 'Dual systemic and contact root and stem collar rot control',
        phiDays: 10,
        actionType: 'Broad-Spectrum',
        safetyWarning: 'Excellent broad spectrum curative drench for seedling beds and nursery trays.'
      }
    ],
    organicBiopesticides: [
      {
        name: 'Trichoderma viride + Pseudomonas fluorescens Root Mix',
        preparation: 'Mix 10g of each in 1L water with compost slurry',
        dosagePerLiter: '10.0 - 20.0 g / Litre',
        frequency: 'At transplanting and every 15 days in damp soil',
        benefits: 'Aggressively colonizes root rhizosphere, secreting chitinases that digest fungal cell walls.'
      },
      {
        name: 'Neem Cake Powder (Soil Amendment)',
        preparation: 'Incorporate into root zone soil',
        dosagePerLiter: '50 - 100 g per plant root zone',
        frequency: 'Pre-planting and post-infestation amendment',
        benefits: 'Releases natural limonoids that suppress root-knot nematodes and pathogenic fungi.'
      }
    ],
    nutritionalRecovery: 'Drench with Humic Acid 12% (3 ml/L) + Seaweed extract (2 ml/L) to trigger explosive secondary white feeder root regrowth.',
    safetyDirections: [
      'Ensure soil is slightly moist before chemical drenching to allow uniform root absorption.',
      'Wear waterproof boots and gloves when performing basal drenching.'
    ]
  }
];

export const CROP_SPECIFIC_PESTICIDE_DATA: Record<string, DamagedCropRescueGuide[]> = {
  tomato: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  'chili-pepper': GENERAL_DAMAGE_RESCUE_GUIDELINES,
  'rice-paddy': GENERAL_DAMAGE_RESCUE_GUIDELINES,
  wheat: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  cotton: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  potato: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  corn: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  apple: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  mango: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  citrus: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  cucumber: GENERAL_DAMAGE_RESCUE_GUIDELINES,
  strawberry: GENERAL_DAMAGE_RESCUE_GUIDELINES,
};

/**
 * Returns damaged crop pesticide rescue guide for a specific plant or fallback general guide
 */
export function getDamagedCropRescueGuides(cropIdOrName?: string): DamagedCropRescueGuide[] {
  if (!cropIdOrName) return GENERAL_DAMAGE_RESCUE_GUIDELINES;
  const key = cropIdOrName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return CROP_SPECIFIC_PESTICIDE_DATA[key] || GENERAL_DAMAGE_RESCUE_GUIDELINES;
}
