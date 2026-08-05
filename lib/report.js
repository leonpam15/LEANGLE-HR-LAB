// lib/report.js
export async function generateReport(quizTitle, primaryStyle, scores = {}) {
  const scoreLines = Object.keys(scores).length > 0
    ? Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(', ')
    : 'Not provided';

    const prompt = `You are a senior executive coach at LEANGLE HR LAB. A leader completed the "${quizTitle}" assessment. Primary style: ${primaryStyle}. Score breakdown: ${scoreLines}.

Write a concise premium leadership report in English. Be direct and specific. Use exactly these sections with NO extra content:

## Your ${quizTitle} DNA
3 sentences about what makes this leader uniquely wired. Specific and psychological.

## How Others Experience You
- Your direct reports likely experience you as [2 sentences]
- Your peers likely experience you as [2 sentences]  
- Your manager or stakeholders likely experience you as [2 sentences]

## Where You Shine — Your 3 Leadership Superpowers

Superpower 1: [title - 2 sentences]

Superpower 2: [title - 2 sentences]

Superpower 3: [title - 2 sentences]

## Your Growth Edge & Derailers Under Pressure
- [2 sentences on blind spot 1]
- [2 sentences on blind spot 2]
- [2 sentences naming the specific derailer under pressure]

## Where You Thrive vs. Where You Struggle
3 sentences on where this style flourishes. 2 sentences on where it struggles.

## Your 30-Day Action Plan — Week by Week

Week 1: [title]
Action: [one specific action]
Why it matters: [one sentence]

Week 2: [title]
Action: [one specific action]
Why it matters: [one sentence]

Week 3: [title]
Action: [one specific action]
Why it matters: [one sentence]

Week 4: [title]
Action: [one specific action]
Why it matters: [one sentence]

## A Question To Carry With You
[One powerful reflective question - one sentence]

## Your Leadership Mantra
[One memorable sentence capturing who they are at their best]

Rules: Use "you" throughout. Be direct. No padding. No extra sections.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);
  const data = await response.json();
  return data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '';
}
