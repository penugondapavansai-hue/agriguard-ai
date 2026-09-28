export default function handler(_req: any, res: any) {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
    process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'
  );

  res.status(200).json({
    status: 'ok',
    hasGeminiKey: hasKey,
    hasDatabase: true,
    configuredModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    timestamp: new Date().toISOString(),
    service: 'AgriGuard AI Crop Pest Detection Service',
  });
}
