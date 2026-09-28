import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, mimeType = 'image/jpeg', userNotes } = req.body || {};

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'No image data provided.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(
    apiKey &&
    apiKey !== 'MY_GEMINI_API_KEY' &&
    apiKey !== 'YOUR_GEMINI_API_KEY'
  );

  if (!isKeyConfigured) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Running in interactive demo mode.',
      isDemoFallback: true,
    });
  }

  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').trim();
  let normalizedMime = (mimeType || 'image/jpeg').toLowerCase().trim();
  if (normalizedMime === 'image/jpg' || normalizedMime === 'image/pjpeg') {
    normalizedMime = 'image/jpeg';
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    const promptText = `
You are AgriGuard AI, an expert agricultural agronomist and crop protection vision assistant.
Analyze the provided image of a crop, plant leaf, fruit, stem, seedling, or visible pest.

INSTRUCTIONS:
1. Examine the image carefully for visible agricultural subjects.
2. Determine if a crop or plant is detected. If non-agricultural, set "plantDetected": false.
3. Evaluate the visible image quality ('good', 'fair', 'poor').
4. Identify the likely crop name.
5. Identify the primary visible problem or pest symptom with cautious language.
6. Provide an estimated AI confidence score (integer 0 to 100).
7. Classify severity strictly as: 'LOW', 'MODERATE', 'HIGH', or 'UNKNOWN'.
8. List strictly OBSERVED VISUAL SYMPTOMS.
9. Outline possible causes.
10. Detail practical RECOMMENDATIONS and INTEGRATED PEST MANAGEMENT (IPM) practices.
    CRITICAL: Never provide dangerous chemical mixing recipes. Always advise consulting local agricultural extension officers.
11. Provide proactive PREVENTION measures and MONITORING advice.
12. Give clear advice on WHEN TO CONSULT A QUALIFIED AGRONOMIST.

${userNotes ? `User added notes: "${String(userNotes).slice(0, 500)}"` : ''}
`;

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          inlineData: {
            mimeType: normalizedMime,
            data: cleanBase64,
          },
        },
        { text: promptText },
      ],
      config: {
        systemInstruction:
          'You are AgriGuard AI, an expert, cautious agricultural agronomist. Always return well-structured JSON complying exactly with the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            imageQuality: { type: Type.STRING },
            plantDetected: { type: Type.BOOLEAN },
            crop: { type: Type.STRING },
            problem: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            confidenceLevel: { type: Type.STRING },
            severity: { type: Type.STRING },
            visualSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            ipm: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            monitoring: { type: Type.ARRAY, items: { type: Type.STRING } },
            expertAdvice: { type: Type.STRING },
          },
          required: [
            'imageQuality',
            'plantDetected',
            'crop',
            'problem',
            'confidence',
            'confidenceLevel',
            'severity',
            'visualSymptoms',
            'possibleCauses',
            'recommendations',
            'ipm',
            'prevention',
            'monitoring',
            'expertAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const result = {
      ...parsed,
      id: 'analysis_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      analyzedAt: new Date().toISOString(),
      userNotes: userNotes || null,
      isDemo: false,
    };

    return res.json(result);
  } catch (err: any) {
    console.error('Gemini analysis error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze crop image.',
      isDemoFallback: true,
    });
  }
}
