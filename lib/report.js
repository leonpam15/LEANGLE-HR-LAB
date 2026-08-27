export async function generateReport(quizTitle, primaryStyle, data = {}) {
  const prompt = `You are a professional executive coach writing a personalized leadership assessment report.

Generate a detailed, personalized leadership report for someone with these characteristics:
- Assessment: ${quizTitle}
- Primary Leadership Style: ${primaryStyle}

Write EXACTLY 8 sections, each 2-3 paragraphs. Use clear section headers starting with ##. Be specific, insightful, and actionable.

SECTIONS:
1. ## Your ${quizTitle} DNA
2. ## How Others Experience You
3. ## Your 3 Leadership Superpowers
4. ## Your Growth Edge & Derailers
5. ## Communication & Influence Style
6. ## Team Dynamics & Impact
7. ## Leadership Blind Spots
8. ## Your 30-Day Action Plan

Make it vivid, specific, and actionable.`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Anthropic API failed: ${err.error?.message || response.status}`);
  }
  const result = await response.json();
  return result.content[0].text;
}
