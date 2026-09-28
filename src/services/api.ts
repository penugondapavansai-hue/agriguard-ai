import { AnalysisResult, Language, PlantCareProfile } from '../types';

const STORAGE_KEY = 'agriguard_analysis_history_v1';

export async function checkServerHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
  try {
    const res = await fetch('/api/health', { method: 'GET' });
    if (!res.ok) return { status: 'error', hasGeminiKey: false };
    return await res.json();
  } catch (e) {
    return { status: 'offline', hasGeminiKey: false };
  }
}

export interface GeminiConnectionTestResult {
  success: boolean;
  status: string;
  latencyMs?: number;
  model?: string;
  response?: string;
  error?: string;
  details?: string;
  message?: string;
  hint?: string;
  timestamp: string;
}

export async function testGeminiConnection(): Promise<GeminiConnectionTestResult> {
  try {
    const res = await fetch('/api/test-gemini', { method: 'GET' });
    const data = await res.json();
    return data;
  } catch (e: any) {
    return {
      success: false,
      status: 'network_failure',
      error: 'Could not connect to backend server /api/test-gemini endpoint.',
      details: e?.message || String(e),
      timestamp: new Date().toISOString(),
    };
  }
}

export async function analyzeCropImage(params: {
  imageBase64: string;
  mimeType?: string;
  userNotes?: string;
}): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze-crop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  let data: any;
  try {
    data = await response.json();
  } catch (jsonErr) {
    console.error('[AgriGuard API] Non-JSON response received from server:', jsonErr);
    throw new Error(`Server returned status ${response.status} with non-JSON response.`);
  }

  if (!response.ok) {
    console.warn(`[AgriGuard API] Request failed with HTTP ${response.status}:`, data);
    const errorMsg = data.error || data.message || `Failed to analyze crop image (HTTP ${response.status}).`;
    const err: any = new Error(errorMsg);
    err.status = response.status;
    err.isDemoFallback = Boolean(data.isDemoFallback);
    err.limitExceeded = Boolean(data.limitExceeded);
    err.retryAfterSeconds = data.retryAfterSeconds;
    err.details = data.details;
    throw err;
  }

  return data;
}

// Local Storage and Cloud SQL Database History Management
export async function syncAnalysisToCloudSql(result: AnalysisResult, userId?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/analyses/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis: result, userId }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not sync analysis to database:', err);
    return false;
  }
}

export async function fetchAnalysesFromCloudSql(userId?: string): Promise<AnalysisResult[]> {
  try {
    const url = userId ? `/api/analyses?userId=${encodeURIComponent(userId)}` : '/api/analyses';
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch analyses from Cloud SQL:', err);
    return [];
  }
}

export function getSavedAnalyses(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading analysis history from localStorage:', e);
    return [];
  }
}

export function saveAnalysisToHistory(result: AnalysisResult): boolean {
  try {
    const current = getSavedAnalyses();
    // Check if already saved
    const exists = current.some((item) => item.id === result.id);
    if (exists) {
      // Update existing
      const updated = current.map((item) => (item.id === result.id ? result : item));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    }

    // Limit image thumbnail storage size to avoid exceeding localStorage quota (max 20 records)
    const sanitizedResult = { ...result };
    if (sanitizedResult.imageThumbnail && sanitizedResult.imageThumbnail.length > 500000) {
      // Trim very large thumbnails if needed
      sanitizedResult.imageThumbnail = sanitizedResult.imageThumbnail.slice(0, 300000);
    }

    const updated = [sanitizedResult, ...current].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Error saving analysis to localStorage:', e);
    return false;
  }
}

export function removeAnalysisFromHistory(id: string): AnalysisResult[] {
  try {
    const current = getSavedAnalyses();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error removing analysis from localStorage:', e);
    return [];
  }
}

export function clearAllHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing history:', e);
    return false;
  }
}

// Plant Care AI & Storage API
const FAVORITES_STORAGE_KEY = 'agriguard_favorite_plants';
const PLANT_NOTES_KEY_PREFIX = 'agriguard_plant_notes_';

export async function fetchAiPlantCare(query: string, language: Language | string = 'en'): Promise<PlantCareProfile> {
  const response = await fetch('/api/plant-care', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, language }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to generate AI plant care guide.');
  }

  return await response.json();
}

export async function askPlantSpecialist(plantName: string, question: string, language: Language | string = 'en'): Promise<string> {
  const response = await fetch('/api/plant-care/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plantName, question, language }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to get answer from plant specialist.');
  }

  const data = await response.json();
  return data.answer || 'No response generated.';
}

export function getFavoritePlantIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleFavoritePlant(id: string): string[] {
  try {
    const favs = getFavoritePlantIds();
    const exists = favs.includes(id);
    const updated = exists ? favs.filter((f) => f !== id) : [...favs, id];
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getPlantCustomNotes(plantId: string): string {
  try {
    return localStorage.getItem(`${PLANT_NOTES_KEY_PREFIX}${plantId}`) || '';
  } catch {
    return '';
  }
}

export function savePlantCustomNotes(plantId: string, notes: string): void {
  try {
    localStorage.setItem(`${PLANT_NOTES_KEY_PREFIX}${plantId}`, notes);
  } catch (e) {
    console.warn('Could not save plant notes:', e);
  }
}
