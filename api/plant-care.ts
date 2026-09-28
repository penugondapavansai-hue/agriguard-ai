import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, language = 'en' } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Plant name or query is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    const promptText = `
You are a master botanist and plant care agronomist.
Generate a comprehensive, scientifically grounded botanical plant care profile for: "${query}".
Target language: ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}.
`;

    const response = await ai.models.generateContent({
      model,
      contents: promptText,
      config: {
        systemInstruction: 'You are a master botanist. Return structured JSON matching the requested schema.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const profile = {
      ...parsed,
      id: 'ai_' + slug + '_' + Date.now().toString(36),
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      isAiGenerated: true,
    };

    return res.json(profile);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate plant care guide.' });
  }
}
