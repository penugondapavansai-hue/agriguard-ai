import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plantName, question, language = 'en' } = req.body || {};
  if (!plantName || !question) {
    return res.status(400).json({ error: 'Plant name and question are required.' });
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
You are a warm, highly knowledgeable agricultural agronomist and master gardener.
The user is asking a question about caring for: "${plantName}".
User's Question: "${question}"
Target Language: ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}.

Provide a clear, accurate, actionable, and encouraging answer with:
- Direct solution to their question.
- Practical steps or precautions.
- Safe organic/cultural remedies.
- When to consult local extension officers.
Keep it concise, friendly, and well-structured.
`;

    const result = await ai.models.generateContent({
      model,
      contents: promptText,
    });

    return res.json({ answer: result.text || 'No response generated.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to answer plant care question.' });
  }
}
