export async function generateReport(quizTitle, primaryStyle, data = {}) {
  const prompt = `You are a professional executive coach writing a personalized leadership assessment report.

Generate a detailed, personalized leadership report for someone with these characteristics:
- Assessment: ${quizTitle}
- Primary Leadership Style: ${primaryStyle}

Write EXACTLY 8 sections, each 2-3 paragraphs. Use clear section headers starting with ##. Be specific, insightful, and actionable.

SECTIONS:
1. ## Your ${quizTitle} DNA - What defines their leadership essence
2. ## How Others Experience You - Perspectives from direct reports, peers, stakeholders (3+ bullet points)
3. ## Your 3 Leadership Superpowers - Specific strengths with real-world applications
4. ## Your Growth Edge & Derailers - Challenges and development areas
5. ## Communication & Influence Style - How they communicate, preferred channels, blind spots
6. ## Team Dynamics & Impact - How they affect teams, collaboration patterns, influence
7. ## Leadership Blind Spots - Hidden patterns they may not see themselves
8. ## Your 30-Day Action Plan - Week 1-4 breakdown with specific daily/weekly actions

Make it vivid, specific, and actionable. No generic advice.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error('Anthropic API failed');
  const result = await response.json();
  return result.content[0].text;
}
