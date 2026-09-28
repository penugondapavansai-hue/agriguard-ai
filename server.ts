import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Discontinued / Obsolete Gemini models that return 404 in current API versions
const OBSOLETE_MODELS = new Set([
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-001",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
]);

function resolveValidModel(rawModel?: string): string {
  if (!rawModel || OBSOLETE_MODELS.has(rawModel.trim())) {
    return "gemini-3.6-flash";
  }
  return rawModel.trim();
}

// Gemini Model Configuration - defaults to gemini-3.6-flash
const CONFIGURED_GEMINI_MODEL = resolveValidModel(process.env.GEMINI_MODEL);
console.log(`Gemini model configured: ${CONFIGURED_GEMINI_MODEL}`);

// Enable JSON body parser with limit for base64 image data (25MB max)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// In-memory rate limiting and abuse protection
interface RateLimitRecord {
  count: number;
  resetTime: number;
  lastRequestTime: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window
const MAX_REQUESTS_PER_WINDOW = 30; // 30 analyses per hour per IP
const MIN_REQUEST_INTERVAL_MS = 1500; // 1.5s interval to prevent rapid automated spam

// Periodic cleanup of expired rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// Initialize Google GenAI client lazily or when available
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

import { saveAnalysisToDb, getAnalysesFromDb, getForumPostsFromDb, createForumPostInDb, syncUserProfileToDb } from "./src/db/queries.ts";

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  const hasDb = Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME);
  res.json({
    status: "ok",
    hasGeminiKey: hasKey,
    hasDatabase: hasDb,
    configuredModel: CONFIGURED_GEMINI_MODEL,
    timestamp: new Date().toISOString(),
    service: "AgriGuard AI Crop Pest Detection Service",
  });
});

// Database API routes for persistent storage
app.get("/api/analyses", async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    const history = await getAnalysesFromDb(userId);
    res.json(history);
  } catch (error) {
    console.error("Failed to fetch analyses from database:", error);
    res.status(500).json({ error: "Failed to fetch diagnostic history from database." });
  }
});

app.post("/api/analyses/save", async (req, res) => {
  try {
    const { analysis, userId } = req.body;
    if (!analysis || !analysis.id) {
      return res.status(400).json({ error: "Invalid analysis payload." });
    }
    const saved = await saveAnalysisToDb(analysis, userId);
    res.json(saved);
  } catch (error) {
    console.error("Failed to save analysis in database:", error);
    res.status(500).json({ error: "Failed to save analysis to database." });
  }
});

app.get("/api/forum/posts", async (_req, res) => {
  try {
    const posts = await getForumPostsFromDb();
    res.json(posts);
  } catch (error) {
    console.error("Failed to fetch forum posts from database:", error);
    res.status(500).json({ error: "Failed to fetch forum posts." });
  }
});

app.post("/api/forum/posts", async (req, res) => {
  try {
    const post = req.body;
    if (!post || !post.title || !post.crop) {
      return res.status(400).json({ error: "Missing required post fields." });
    }
    const created = await createForumPostInDb(post);
    res.json(created);
  } catch (error) {
    console.error("Failed to create forum post in database:", error);
    res.status(500).json({ error: "Failed to save community post." });
  }
});

app.post("/api/user/sync", async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.uid) {
      return res.status(400).json({ error: "Invalid profile data." });
    }
    const synced = await syncUserProfileToDb(profile);
    res.json(synced);
  } catch (error) {
    console.error("Failed to sync user profile in database:", error);
    res.status(500).json({ error: "Failed to sync user profile." });
  }
});

// Developer Diagnostic Connection Test Endpoint
app.get("/api/test-gemini", async (_req, res) => {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY");

  if (!isKeyConfigured) {
    return res.status(503).json({
      success: false,
      status: "missing_api_key",
      message: "GEMINI_API_KEY is not configured in the server environment.",
      hint: "Configure your GEMINI_API_KEY in the AI Studio Settings > Secrets panel.",
    });
  }

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        success: false,
        status: "client_init_failed",
        message: "Failed to initialize Google GenAI SDK client instance.",
      });
    }

    const testModels = Array.from(new Set([CONFIGURED_GEMINI_MODEL, "gemini-3.6-flash", "gemini-3.7-flash"]));
    let lastError: any = null;
    let successfulModel = "";
    let testResponseText = "";

    for (const modelName of testModels) {
      try {
        const testResponse = await ai.models.generateContent({
          model: modelName,
          contents: "Respond only with the exact JSON string: {\"status\": \"OK\"}",
          config: {
            responseMimeType: "application/json",
          },
        });
        successfulModel = modelName;
        testResponseText = (testResponse.text || "{}").trim();
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini Connection Test] Model ${modelName} encountered error:`, err?.message || err);
      }
    }

    if (!successfulModel) {
      throw lastError || new Error("All candidate Gemini models failed connection test.");
    }

    const durationMs = Date.now() - startTime;
    console.log(`[Gemini Connection Test] Verified with ${successfulModel} in ${durationMs}ms:`, testResponseText);

    return res.json({
      success: true,
      status: "connected",
      latencyMs: durationMs,
      model: successfulModel,
      response: testResponseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    const rawMsg = error?.message || String(error);
    console.error(`[Gemini Connection Test] Failed in ${durationMs}ms:`, rawMsg);

    let statusCode = 500;
    let statusCategory = "gemini_error";
    let userMsg = "Gemini API connection test failed.";
    let retryAfterSeconds: number | undefined;

    if (rawMsg.includes("API_KEY_INVALID") || rawMsg.includes("API key not valid") || rawMsg.includes("401")) {
      statusCode = 401;
      statusCategory = "invalid_api_key";
      userMsg = "The configured GEMINI_API_KEY is invalid or expired. Please check Settings > Secrets.";
    } else if (rawMsg.includes("PERMISSION_DENIED") || rawMsg.includes("403")) {
      statusCode = 403;
      statusCategory = "permission_denied";
      userMsg = "Permission denied for this GEMINI_API_KEY or Generative Language API is disabled.";
    } else if (rawMsg.includes("RESOURCE_EXHAUSTED") || rawMsg.includes("429") || rawMsg.includes("Quota")) {
      statusCode = 429;
      statusCategory = "quota_exhausted";
      userMsg = "Gemini API free tier rate limit reached. Please wait a few moments before retrying.";
      const retryMatch = rawMsg.match(/retry in\s+([0-9.]+)\s*s/i) || rawMsg.match(/"retryDelay":\s*"([0-9]+)s"/i);
      if (retryMatch && retryMatch[1]) {
        retryAfterSeconds = Math.max(1, Math.ceil(parseFloat(retryMatch[1])));
      }
    } else if (rawMsg.includes("UNAVAILABLE") || rawMsg.includes("503")) {
      statusCode = 503;
      statusCategory = "service_unavailable";
      userMsg = "Gemini AI service is temporarily unavailable.";
    }

    return res.status(statusCode).json({
      success: false,
      status: statusCategory,
      latencyMs: durationMs,
      error: userMsg,
      retryAfterSeconds,
      details: rawMsg,
      timestamp: new Date().toISOString(),
    });
  }
});

// Helper to safely extract and parse JSON from Gemini text response
function safeParseGeminiJson(rawText: string): any {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response received from Gemini model.");
  }

  let cleaned = rawText.trim();
  // Strip Markdown code block indicators (```json ... ``` or ``` ...)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // If standard parse failed, attempt to find the outermost JSON object
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (nestedErr) {
        console.error("Regex extracted JSON failed to parse:", match[0]);
      }
    }
    throw new Error(`Failed to parse AI output as JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Crop Pest Analysis Handler
async function handleCropAnalysis(req: express.Request, res: express.Response) {
  try {
    // Client IP extraction & Rate limiting check
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();

    const record = ipRequestMap.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS, lastRequestTime: 0 };

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }

    if (now - record.lastRequestTime < MIN_REQUEST_INTERVAL_MS) {
      return res.status(429).json({
        error: "Please wait a moment before submitting another crop analysis request.",
        retryAfterMs: MIN_REQUEST_INTERVAL_MS,
      });
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
      const waitMinutes = Math.ceil((record.resetTime - now) / (60 * 1000));
      return res.status(429).json({
        error: `Hourly analysis request limit reached (${MAX_REQUESTS_PER_WINDOW} per hour). Please try again in ${waitMinutes} minutes or explore sample specimens.`,
        limitExceeded: true,
        isDemoFallback: true,
      });
    }

    const { imageBase64, mimeType = "image/jpeg", userNotes } = req.body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({
        error: "No valid image data provided for crop analysis.",
      });
    }

    // Clean base64 string if it contains data URI header
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "").trim();

    if (cleanBase64.length < 50) {
      return res.status(400).json({
        error: "The provided image data is empty or invalid. Please select a valid crop photograph.",
      });
    }

    // Supported & Normalized MIME types
    let normalizedMime = (mimeType || "image/jpeg").toLowerCase().trim();
    if (normalizedMime === "image/jpg" || normalizedMime === "image/pjpeg") {
      normalizedMime = "image/jpeg";
    }

    const validMimes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimes.includes(normalizedMime)) {
      return res.status(400).json({
        error: "Unsupported image format. Please upload JPG, PNG, or WEBP.",
      });
    }

    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. You can explore interactive demo analysis or configure your API key in Settings > Secrets.",
        isDemoFallback: true,
      });
    }

    record.count += 1;
    record.lastRequestTime = now;
    ipRequestMap.set(clientIp, record);

    const sanitizedNotes = typeof userNotes === "string" ? userNotes.slice(0, 500) : "";

    const promptText = `
You are AgriGuard AI, an expert agricultural agronomist and crop protection vision assistant.
Analyze the provided image of a crop, plant leaf, fruit, stem, seedling, or visible pest.

INSTRUCTIONS:
1. Examine the image carefully for visible agricultural subjects (plant parts, leaves, stems, fruits, soil damage, insects, fungus, or pest damage).
2. Determine if a crop or plant is detected. If the image is non-agricultural (e.g. car, furniture, human face, unrelated object), set "plantDetected": false and explain in "problem".
3. Evaluate the visible image quality ('good', 'fair', 'poor'). If blurred or dark, note it.
4. Identify the likely crop name (e.g., 'Tomato', 'Rice / Paddy', 'Cotton', 'Chilli', 'Brinjal', 'Maize', 'Wheat', 'Soybean', etc.).
5. Identify the primary visible problem or pest symptom with cautious language (e.g., "Possible aphid-like insect damage", "Likely early blight leaf spot", "Suspected nutrient deficiency or chlorosis"). NEVER claim 100% certainty.
6. Provide an estimated AI confidence score (integer 0 to 100) based purely on visual clarity.
7. Classify severity strictly as: 'LOW' (minimal damage), 'MODERATE' (notable symptoms requiring regular monitoring), 'HIGH' (severe visible damage warranting prompt local expert attention), or 'UNKNOWN'.
8. List strictly OBSERVED VISUAL SYMPTOMS (e.g. "Leaf curling along margins", "Yellow chlorotic halos", "Clustered sap-sucking nymphs visible on underside"). Do NOT hallucinate unobservable microscopic details.
9. Outline possible causes (e.g., "Insect feeding by sucking pests", "Fungal pathogen under humid conditions").
10. Detail practical, beginner-friendly RECOMMENDATIONS and INTEGRATED PEST MANAGEMENT (IPM) practices (cultural sanitation, physical barriers, biological controls, moisture regulation).
    CRITICAL SAFETY MANDATE: NEVER provide dangerous pesticide mixing instructions, exact chemical concentrate dosages, or hazardous homebrew chemical recipes. Always include: "Always verify with local agricultural extension officers and read approved product label instructions."
11. Provide proactive PREVENTION measures (crop rotation, clean seed stock, field sanitation) and MONITORING advice (inspection frequency, scouting tips).
12. Give clear advice on WHEN TO CONSULT A QUALIFIED AGRONOMIST.

${sanitizedNotes ? `User added notes about their crop: "${sanitizedNotes}"` : ""}
`;

    console.log(`[AgriGuard Vision API] Initiating Gemini analysis (MIME: ${normalizedMime}, Size: ${Math.round(cleanBase64.length / 1024)} KB)...`);

    const candidateModels = Array.from(new Set([CONFIGURED_GEMINI_MODEL, "gemini-3.6-flash", "gemini-3.7-flash"]));
    let lastError: any = null;
    let response: any = null;
    let usedModel = "";

    for (const modelName of candidateModels) {
      // Try each model up to 2 times (e.g. if temporary 503 high demand spike occurs)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`[AgriGuard Vision API] Attempting generation with model: ${modelName} (attempt ${attempt})...`);
          response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  mimeType: normalizedMime,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
            config: {
              systemInstruction:
                "You are AgriGuard AI, an expert, cautious agricultural agronomist. Always return well-structured JSON complying exactly with the requested schema. Prioritize safe IPM agricultural guidance and never recommend dangerous pesticide formulas.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  imageQuality: {
                    type: Type.STRING,
                    description: "Quality of image: 'good', 'fair', or 'poor'",
                  },
                  plantDetected: {
                    type: Type.BOOLEAN,
                    description: "True if a plant, crop, leaf, fruit, or farm pest is visible in image",
                  },
                  crop: {
                    type: Type.STRING,
                    description: "Identified crop name (e.g. Tomato, Rice, Cotton, Chilli, Brinjal, Unknown Crop)",
                  },
                  problem: {
                    type: Type.STRING,
                    description: "Possible problem or pest identified with cautious terminology (e.g. 'Likely aphid infestation', 'Possible powdery mildew')",
                  },
                  confidence: {
                    type: Type.INTEGER,
                    description: "AI confidence score between 0 and 100",
                  },
                  severity: {
                    type: Type.STRING,
                    description: "Severity level: 'LOW', 'MODERATE', 'HIGH', or 'UNKNOWN'",
                  },
                  visualSymptoms: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of visible symptoms spotted by the AI",
                  },
                  possibleCauses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of probable underlying biological or environmental causes",
                  },
                  recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Immediate safe recommendations and cultural action steps",
                  },
                  ipm: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Integrated Pest Management suggestions (biological, cultural, physical)",
                  },
                  prevention: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Preventative agricultural practices for future seasons",
                  },
                  monitoring: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Monitoring frequency, scouting schedule, and key signs to track",
                  },
                  expertAdvice: {
                    type: Type.STRING,
                    description: "Guidance on when and how to consult certified local agricultural experts",
                  },
                },
                required: [
                  "imageQuality",
                  "plantDetected",
                  "crop",
                  "problem",
                  "confidence",
                  "severity",
                  "visualSymptoms",
                  "recommendations",
                  "ipm",
                  "prevention",
                  "monitoring",
                  "expertAdvice",
                ],
              },
            },
          });

          usedModel = modelName;
          break; // Successfully generated content!
        } catch (err: any) {
          lastError = err;
          const errMsg = err?.message || String(err);
          console.warn(`[AgriGuard Vision API] Model ${modelName} attempt ${attempt} failed:`, errMsg);

          // If it was a 503 demand spike and attempt 1, wait 800ms and retry
          if (attempt === 1 && (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand"))) {
            await new Promise((r) => setTimeout(r, 800));
            continue;
          }
          break; // Move to next model
        }
      }

      if (response) break;
    }

    if (!response) {
      throw lastError || new Error("All Gemini candidate models failed to process the image.");
    }

    const rawText = response.text || "{}";
    let analysisData: any;
    try {
      analysisData = safeParseGeminiJson(rawText);
    } catch (parseError: any) {
      console.error("Failed to parse Gemini JSON output:", parseError?.message, "Raw sample:", rawText.slice(0, 300));
      return res.status(502).json({
        error: "The AI model returned an unexpected response format. Please try again with a clear photo.",
        isDemoFallback: true,
      });
    }

    // Normalize confidence and severity
    const confidenceVal = Math.min(100, Math.max(0, Number(analysisData.confidence) || 50));
    let severityVal: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN" = "MODERATE";
    const rawSev = String(analysisData.severity || "").toUpperCase();
    if (rawSev.includes("LOW")) severityVal = "LOW";
    else if (rawSev.includes("HIGH") || rawSev.includes("CRITICAL")) severityVal = "HIGH";
    else if (rawSev.includes("UNKNOWN")) severityVal = "UNKNOWN";
    else severityVal = "MODERATE";

    // Determine confidence level category
    let confidenceLevel: "HIGH CONFIDENCE" | "LIKELY" | "POSSIBLE" | "UNKNOWN" = "POSSIBLE";
    if (confidenceVal >= 80) confidenceLevel = "HIGH CONFIDENCE";
    else if (confidenceVal >= 60) confidenceLevel = "LIKELY";
    else if (confidenceVal >= 35) confidenceLevel = "POSSIBLE";
    else confidenceLevel = "UNKNOWN";

    const finalResult = {
      id: "analysis_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      analyzedAt: new Date().toISOString(),
      imageQuality: analysisData.imageQuality || "good",
      plantDetected: analysisData.plantDetected !== false,
      crop: analysisData.crop || "Identified Crop",
      problem: analysisData.problem || "Unspecified Plant Symptom",
      confidence: confidenceVal,
      confidenceLevel,
      severity: severityVal,
      visualSymptoms: Array.isArray(analysisData.visualSymptoms) && analysisData.visualSymptoms.length > 0 ? analysisData.visualSymptoms : ["Visible leaf discoloration"],
      possibleCauses: Array.isArray(analysisData.possibleCauses) && analysisData.possibleCauses.length > 0 ? analysisData.possibleCauses : ["Environmental or biotic stress"],
      recommendations: Array.isArray(analysisData.recommendations) && analysisData.recommendations.length > 0 ? analysisData.recommendations : ["Inspect nearby plants regularly", "Maintain balanced irrigation"],
      ipm: Array.isArray(analysisData.ipm) && analysisData.ipm.length > 0 ? analysisData.ipm : ["Regular field scouting", "Use physical barriers where appropriate"],
      prevention: Array.isArray(analysisData.prevention) && analysisData.prevention.length > 0 ? analysisData.prevention : ["Crop rotation", "Clean field borders"],
      monitoring: Array.isArray(analysisData.monitoring) && analysisData.monitoring.length > 0 ? analysisData.monitoring : ["Scout fields twice weekly during early morning"],
      expertAdvice: analysisData.expertAdvice || "Consult your local agricultural extension service if symptoms spread rapidly or persist after basic cultural management.",
      isDemo: false,
      modelUsed: usedModel,
    };

    console.log(`[AgriGuard Vision API] Successfully analyzed with ${usedModel}: ${finalResult.crop} - ${finalResult.problem} (${finalResult.confidence}%)`);
    return res.json(finalResult);
  } catch (error: any) {
    const rawMsg = error?.message || String(error);
    console.error("[AgriGuard Vision API Error]:", rawMsg);

    let statusCode = 500;
    let userFriendlyError = "Something went wrong while analyzing your image with Gemini AI. Please check your connection or try again.";
    let retryAfterSeconds: number | undefined;

    if (rawMsg.includes("API_KEY_INVALID") || rawMsg.includes("API key not valid") || error?.status === 401) {
      statusCode = 401;
      userFriendlyError = "The Gemini API key is invalid or expired. Please check your API key in Settings > Secrets.";
    } else if (rawMsg.includes("PERMISSION_DENIED") || error?.status === 403) {
      statusCode = 403;
      userFriendlyError = "Permission denied. Ensure the Generative Language API is enabled for your project.";
    } else if (rawMsg.includes("RESOURCE_EXHAUSTED") || rawMsg.includes("429") || error?.status === 429) {
      statusCode = 429;
      userFriendlyError = "Gemini AI rate limit or quota exceeded. Please wait a moment before trying again or explore demo mode.";
      const retryMatch = rawMsg.match(/retry in\s+([0-9.]+)\s*s/i) || rawMsg.match(/"retryDelay":\s*"([0-9]+)s"/i);
      if (retryMatch && retryMatch[1]) {
        retryAfterSeconds = Math.max(1, Math.ceil(parseFloat(retryMatch[1])));
      } else {
        retryAfterSeconds = 12;
      }
    } else if (rawMsg.includes("NOT_FOUND") || error?.status === 404) {
      statusCode = 404;
      userFriendlyError = "The requested Gemini model is currently unavailable.";
    } else if (rawMsg.includes("UNAVAILABLE") || rawMsg.includes("503") || error?.status === 503) {
      statusCode = 503;
      userFriendlyError = "Gemini AI service is temporarily busy. Please try again shortly.";
    }

    return res.status(statusCode).json({
      error: userFriendlyError,
      retryAfterSeconds,
      details: process.env.NODE_ENV !== "production" ? rawMsg : undefined,
      isDemoFallback: true,
    });
  }
}

// Register both /api/analyze-crop and /api/analyze for compatibility
app.post("/api/analyze-crop", handleCropAnalysis);
app.post("/api/analyze", handleCropAnalysis);

// AI Plant Care Dossier Generation Endpoint
app.post("/api/plant-care", async (req, res) => {
  try {
    const { query, language = "en" } = req.body;
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ error: "Plant search query is required." });
    }

    const cleanQuery = query.trim().slice(0, 100);
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: "AI service is currently unavailable. Please check your Gemini API key in settings.",
      });
    }

    const promptText = `
You are a world-class agronomist, botanist, and plant care specialist.
Generate a comprehensive, scientifically accurate, and practical botanical care dossier for the plant species or crop: "${cleanQuery}".
The target language is: ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}.

Ensure all information is practical for both field farmers and home gardeners.
Return strictly valid JSON conforming to the schema with:
1. Scientific botanical classification (scientific name, family, growth habit, origin, difficulty).
2. Precise sunlight (level, recommended hours, conditions).
3. Detailed watering (frequency, moisture level, schedule tips, drought tolerance).
4. Soil parameters (type, pH range, drainage, description).
5. Temperature & humidity (ideal range, min/max tolerance, frost sensitivity, optimal humidity).
6. Nutrition/Fertilizer plan (NPK ratio, application frequency, best organic options, pro tips).
7. Pruning, staking, support, and propagation methods.
8. Common pests and fungal/bacterial diseases with symptoms, prevention, and organic control (IPM).
9. Companion planting (good neighbors, bad neighbors, reasons).
10. Lifecycle timeline (germination days, harvest days, seasonal care for spring/summer/autumn/winter).
11. Harvesting signs and proper post-harvest storage.
12. Pet toxicity information.
13. 3-4 golden agronomist "Pro Tips".
`;

    const candidateModels = Array.from(new Set([CONFIGURED_GEMINI_MODEL, "gemini-3.6-flash", "gemini-3.7-flash"]));
    let responseText = "";
    let usedModel = "";

    for (const modelName of candidateModels) {
      try {
        console.log(`[Plant Care API] Generating guide for "${cleanQuery}" with ${modelName}...`);
        const result = await ai.models.generateContent({
          model: modelName,
          contents: [{ text: promptText }],
          config: {
            systemInstruction:
              "You are an expert master agronomist and botanical researcher. Always output complete, valid, structured JSON without dangerous pesticide chemical mixing recipes.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                commonName: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                family: { type: Type.STRING },
                category: {
                  type: Type.STRING,
                  description: "One of: vegetable, grain, fruit, herb, houseplant, cash_crop, flower",
                },
                difficulty: {
                  type: Type.STRING,
                  description: "One of: Easy, Moderate, Challenging",
                },
                growthHabit: { type: Type.STRING },
                origin: { type: Type.STRING },
                shortDescription: { type: Type.STRING },
                sunlight: {
                  type: Type.OBJECT,
                  properties: {
                    level: { type: Type.STRING },
                    hours: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["level", "hours", "description"],
                },
                watering: {
                  type: Type.OBJECT,
                  properties: {
                    frequency: { type: Type.STRING },
                    moistureLevel: { type: Type.STRING },
                    scheduleTips: { type: Type.STRING },
                    droughtTolerance: { type: Type.STRING },
                  },
                  required: ["frequency", "moistureLevel", "scheduleTips", "droughtTolerance"],
                },
                soil: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    phRange: { type: Type.STRING },
                    drainage: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["type", "phRange", "drainage", "description"],
                },
                temperature: {
                  type: Type.OBJECT,
                  properties: {
                    idealRange: { type: Type.STRING },
                    minTemp: { type: Type.STRING },
                    maxTemp: { type: Type.STRING },
                    frostSensitive: { type: Type.BOOLEAN },
                    humidityLevel: { type: Type.STRING },
                  },
                  required: ["idealRange", "minTemp", "maxTemp", "frostSensitive", "humidityLevel"],
                },
                fertilizer: {
                  type: Type.OBJECT,
                  properties: {
                    npkRatio: { type: Type.STRING },
                    frequency: { type: Type.STRING },
                    bestType: { type: Type.STRING },
                    organicTips: { type: Type.STRING },
                  },
                  required: ["npkRatio", "frequency", "bestType", "organicTips"],
                },
                pruningAndSupport: {
                  type: Type.OBJECT,
                  properties: {
                    requiresSupport: { type: Type.BOOLEAN },
                    supportType: { type: Type.STRING },
                    pruningSeason: { type: Type.STRING },
                    pruningTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["requiresSupport", "pruningSeason", "pruningTips"],
                },
                propagation: {
                  type: Type.OBJECT,
                  properties: {
                    methods: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tips: { type: Type.STRING },
                  },
                },
                pestsAndDiseases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING },
                      symptoms: { type: Type.STRING },
                      prevention: { type: Type.STRING },
                      organicControl: { type: Type.STRING },
                    },
                    required: ["name", "type", "symptoms", "prevention", "organicControl"],
                  },
                },
                companionPlants: {
                  type: Type.OBJECT,
                  properties: {
                    good: { type: Type.ARRAY, items: { type: Type.STRING } },
                    bad: { type: Type.ARRAY, items: { type: Type.STRING } },
                    reason: { type: Type.STRING },
                  },
                  required: ["good", "bad", "reason"],
                },
                lifecycle: {
                  type: Type.OBJECT,
                  properties: {
                    germinationDays: { type: Type.STRING },
                    harvestDays: { type: Type.STRING },
                    season: { type: Type.STRING },
                    seasonsCare: {
                      type: Type.OBJECT,
                      properties: {
                        spring: { type: Type.STRING },
                        summer: { type: Type.STRING },
                        autumn: { type: Type.STRING },
                        winter: { type: Type.STRING },
                      },
                      required: ["spring", "summer", "autumn", "winter"],
                    },
                  },
                  required: ["germinationDays", "harvestDays", "season", "seasonsCare"],
                },
                harvesting: {
                  type: Type.OBJECT,
                  properties: {
                    signs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    method: { type: Type.STRING },
                    storageTips: { type: Type.STRING },
                  },
                  required: ["signs", "method", "storageTips"],
                },
                toxicity: {
                  type: Type.OBJECT,
                  properties: {
                    isToxicToPets: { type: Type.BOOLEAN },
                    details: { type: Type.STRING },
                  },
                },
                proTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "commonName",
                "scientificName",
                "family",
                "category",
                "difficulty",
                "growthHabit",
                "shortDescription",
                "sunlight",
                "watering",
                "soil",
                "temperature",
                "fertilizer",
                "pruningAndSupport",
                "pestsAndDiseases",
                "companionPlants",
                "lifecycle",
                "harvesting",
                "proTips",
              ],
            },
          },
        });

        responseText = result.text || "";
        usedModel = modelName;
        break;
      } catch (err: any) {
        console.warn(`[Plant Care API] Model ${modelName} failed:`, err?.message);
      }
    }

    if (!responseText) {
      return res.status(500).json({ error: "Failed to generate plant care guide. Please try again." });
    }

    const data = JSON.parse(responseText);
    const slug = cleanQuery.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    // Assign an appropriate image placeholder or unsplash botanical photo
    const profile = {
      ...data,
      id: "ai_" + slug + "_" + Date.now().toString(36),
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      isAiGenerated: true,
      modelUsed: usedModel,
    };

    return res.json(profile);
  } catch (error: any) {
    console.error("[Plant Care API Error]:", error);
    return res.status(500).json({ error: "An error occurred while generating plant care data." });
  }
});

// Interactive Plant Specialist Q&A Endpoint
app.post("/api/plant-care/ask", async (req, res) => {
  try {
    const { plantName, question, language = "en" } = req.body;
    if (!plantName || !question) {
      return res.status(400).json({ error: "Plant name and question are required." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: "AI service is unavailable." });
    }

    const promptText = `
You are a warm, highly knowledgeable agricultural agronomist and master gardener.
The user is asking a question about caring for: "${plantName}".
User's Question: "${question}"
Target Language: ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}.

Provide a clear, accurate, actionable, and encouraging answer with:
- Direct solution to their question.
- Practical steps or precautions.
- Safe organic/cultural remedies.
- When to consult local extension officers.
Keep it concise, friendly, and well-structured with bullet points where appropriate.
`;

    const candidateModels = Array.from(new Set([CONFIGURED_GEMINI_MODEL, "gemini-3.6-flash", "gemini-3.7-flash"]));
    let answerText = "";

    for (const modelName of candidateModels) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents: [{ text: promptText }],
        });
        answerText = result.text || "";
        if (answerText) break;
      } catch (err: any) {
        console.warn(`[Plant Q&A] ${modelName} failed:`, err?.message);
      }
    }

    if (!answerText) {
      return res.status(500).json({ error: "Could not generate an answer at this moment." });
    }

    return res.json({ answer: answerText });
  } catch (error: any) {
    console.error("[Plant Q&A Error]:", error);
    return res.status(500).json({ error: "Failed to answer plant care question." });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(
      typeof __dirname !== "undefined" && __dirname.endsWith("dist")
        ? __dirname
        : path.join(process.cwd(), "dist")
    );
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌱 AgriGuard AI Server running at http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
