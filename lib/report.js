// lib/report.js
// Generates AI-powered leadership reports using the Anthropic API.
// Runs server-side only — API key is never exposed to the browser.

export async function generateReport(quizTitle, primaryStyle, scores) {
  const scoreLines = scores
    ? Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(', ')
    : 'Not provided';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a world-class executive coach at LEANGLE HR LAB. A leader has just completed the "${quizTitle}" assessment.

Primary style: ${primaryStyle}
Score breakdown: ${scoreLines}

Write a premium personalised leadership report with exactly these sections:

## Your ${quizTitle} DNA
2–3 sentences describing what makes this leader distinctively effective in this area. Make it feel personal and specific.

## Where You Shine
3 specific, vivid real-world scenarios where this style creates exceptional results. Each should be a concrete situation a leader would recognise.

## Your Growth Edge
2–3 honest, specific blind spots this leader likely hasn't fully recognised yet. Be direct but constructive.

## 30-Day Action Plan
5 concrete, weekly actions the leader can start this Monday. Each must be specific and behavioural — no generic advice.

## Your Leadership Mantra
One powerful sentence this leader can return to when under pressure.

Rules: Use "you" throughout. Be direct, insightful and personalised. No filler sentences. No generic leadership clichés.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content
    ?.filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n') || '';
}
