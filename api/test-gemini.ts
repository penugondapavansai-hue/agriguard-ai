import { GoogleGenAI } from '@google/genai';

export default async function handler(_req: any, res: any) {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(
    apiKey &&
    apiKey !== 'MY_GEMINI_API_KEY' &&
    apiKey !== 'YOUR_GEMINI_API_KEY'
  );

  if (!isKeyConfigured) {
    return res.status(503).json({
      success: false,
      status: 'missing_api_key',
      message: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
      hint: 'Configure GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    const testResponse = await ai.models.generateContent({
      model,
      contents: 'Respond only with JSON: {"status": "OK"}',
      config: {
        responseMimeType: 'application/json',
      },
    });

    const durationMs = Date.now() - startTime;
    return res.json({
      success: true,
      status: 'connected',
      latencyMs: durationMs,
      model,
      response: testResponse.text?.trim() || '{"status": "OK"}',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    return res.status(500).json({
      success: false,
      status: 'gemini_error',
      latencyMs: durationMs,
      error: err.message || 'Gemini connection failed.',
      timestamp: new Date().toISOString(),
    });
  }
}
