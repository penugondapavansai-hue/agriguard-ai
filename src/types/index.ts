export type ConfidenceLevel = 'HIGH CONFIDENCE' | 'LIKELY' | 'POSSIBLE' | 'UNKNOWN';
export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN';
export type ImageQuality = 'good' | 'fair' | 'poor';
export type Language = 'en' | 'te' | 'hi';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AnalysisResult {
  id: string;
  analyzedAt: string;
  imageQuality: ImageQuality;
  plantDetected: boolean;
  crop: string;
  problem: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  severity: SeverityLevel;
  visualSymptoms: string[];
  possibleCauses: string[];
  recommendations: string[];
  ipm: string[];
  prevention: string[];
  monitoring: string[];
  expertAdvice: string;
  isDemo?: boolean;
  imageThumbnail?: string;
  userNotes?: string;
}

export interface ImageQualityReport {
  isValid: boolean;
  quality: ImageQuality;
  warnings: string[];
  suggestions: string[];
  brightnessScore?: number; // 0-255
  contrastScore?: number;
  isTooDark?: boolean;
  isTooBright?: boolean;
  isLowRes?: boolean;
}

export interface SampleCropData {
  id: string;
  cropName: string;
  scientificName: string;
  problemName: string;
  problemCategory: 'pest' | 'fungal' | 'bacterial' | 'viral' | 'deficiency';
  sampleImage: string;
  description: string;
  result: AnalysisResult;
}

export interface HistoryFilter {
  search: string;
  severity: string;
  crop: string;
  sortBy: 'newest' | 'oldest' | 'confidence';
}

export interface AppNotification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
}

export type UserRole = 'farmer' | 'agronomist' | 'moderator';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
  location?: string;
  cropSpecialty?: string;
  bio?: string;
  joinedAt: string;
  isVerifiedAgronomist?: boolean;
}

export type ForumIssueCategory =
  | 'all'
  | 'pest'
  | 'fungal'
  | 'bacterial'
  | 'viral'
  | 'deficiency'
  | 'weather'
  | 'general';

export type ForumUrgency = 'low' | 'medium' | 'high';

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorEmail?: string | null;
  authorAvatar?: string | null;
  authorRole: UserRole;
  authorLocation?: string;
  content: string;
  imageUrl?: string;
  isSolution?: boolean;
  likesCount: number;
  likedBy: string[];
  isFlagged?: boolean;
  flagReason?: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  authorName: string;
  authorEmail?: string | null;
  authorAvatar?: string | null;
  authorRole: UserRole;
  authorLocation?: string;
  title: string;
  description: string;
  crop: string;
  category: ForumIssueCategory;
  urgency: ForumUrgency;
  imageUrl?: string;
  analysisSnippet?: {
    problem: string;
    confidence: number;
    severity: SeverityLevel;
    recommendationSummary: string;
  };
  status: 'open' | 'resolved';
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  isPinned?: boolean;
  isFlagged?: boolean;
  flagReason?: string;
  verifiedSolutionCommentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ForumFilterState {
  crop: string;
  category: string;
  urgency: string;
  status: 'all' | 'open' | 'resolved';
  sortBy: 'newest' | 'most_active' | 'most_liked' | 'urgent';
  search: string;
  myPostsOnly?: boolean;
  flaggedOnly?: boolean;
}

export type PlantCategory =
  | 'all'
  | 'vegetable'
  | 'grain'
  | 'fruit'
  | 'herb'
  | 'houseplant'
  | 'cash_crop'
  | 'flower';

export type PlantCareDifficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface PlantPestIssue {
  name: string;
  type: 'pest' | 'fungal' | 'bacterial' | 'viral' | 'deficiency';
  symptoms: string;
  prevention: string;
  organicControl: string;
  chemicalControl?: string;
  activeIngredient?: string;
  recommendedPesticides?: string[];
  dosage?: string;
  safetyInterval?: string;
  emergencyRescueAction?: string;
}

export interface DamagedCropProtocol {
  damageCategory: string;
  symptoms: string;
  emergencyStep: string;
  chemicalPesticides: {
    name: string;
    activeIngredient: string;
    dosage: string;
    phiDays: number;
    notes: string;
  }[];
  organicBiocontrols: {
    name: string;
    dosage: string;
    timing: string;
  }[];
  postDamageRecovery: string;
}

export interface PlantCareProfile {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  category: 'vegetable' | 'grain' | 'fruit' | 'herb' | 'houseplant' | 'cash_crop' | 'flower';
  difficulty: PlantCareDifficulty;
  growthHabit: string;
  origin?: string;
  image: string;
  shortDescription: string;
  sunlight: {
    level: 'Full Sun' | 'Partial Sun / Shade' | 'Indirect Bright' | 'Low Light';
    hours: string;
    description: string;
  };
  watering: {
    frequency: string;
    moistureLevel: 'Low' | 'Moderate' | 'High' | 'Soaked';
    scheduleTips: string;
    droughtTolerance: 'High' | 'Medium' | 'Low';
  };
  soil: {
    type: string;
    phRange: string;
    drainage: 'Well-draining' | 'Moisture-retentive' | 'Sandy/Loamy';
    description: string;
  };
  temperature: {
    idealRange: string;
    minTemp: string;
    maxTemp: string;
    frostSensitive: boolean;
    humidityLevel: string;
  };
  fertilizer: {
    npkRatio: string;
    frequency: string;
    bestType: string;
    organicTips: string;
  };
  pruningAndSupport: {
    requiresSupport: boolean;
    supportType?: string;
    pruningSeason: string;
    pruningTips: string[];
  };
  propagation?: {
    methods: string[];
    tips: string;
  };
  pestsAndDiseases: PlantPestIssue[];
  companionPlants: {
    good: string[];
    bad: string[];
    reason: string;
  };
  lifecycle: {
    germinationDays: string;
    harvestDays: string;
    season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-round';
    seasonsCare: {
      spring: string;
      summer: string;
      autumn: string;
      winter: string;
    };
  };
  harvesting: {
    signs: string[];
    method: string;
    storageTips: string;
  };
  toxicity?: {
    isToxicToPets: boolean;
    details?: string;
  };
  proTips: string[];
  isAiGenerated?: boolean;
}

export interface PlantCareFilterState {
  search: string;
  category: PlantCategory;
  difficulty: string;
  sunlight: string;
  favoritesOnly: boolean;
}

