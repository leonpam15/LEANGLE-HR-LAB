export async function generateReport(quizTitle, primaryStyle, data = {}) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('No API key');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 3500,
        messages: [{
          role: 'user',
          content: `Create leadership report for ${primaryStyle} leader. Use ONLY ASCII characters.

Section headers with ##:

## Your ${quizTitle} DNA
3 paragraphs about their core leadership essence.

## How Others Experience You
5 bullet points with "- " prefix.

## Your 3 Leadership Superpowers
3 paragraphs, one per superpower.

## Your Growth Edge and Derailers
4 paragraphs.

## Communication and Influence Style
3 paragraphs.

## Team Dynamics and Impact
2 paragraphs.

## Leadership Blind Spots
4 bullet points with "- " prefix.

## Your 30-Day Action Plan
4 paragraphs (one per week) with specific actions for a ${primaryStyle} leader.

## Recommended Books for ${primaryStyle} Leaders
List 4 specific book recommendations (NOT generic business books). For EACH book, write:
- Book title and author
- 2-3 sentences explaining why it's valuable for a ${primaryStyle} leader specifically
- How it addresses their development areas

Choose books different from typical leadership books. Make recommendations unique to their ${primaryStyle} style.

Use ONLY standard ASCII. No special symbols, no Unicode, no markdown.`
        }]
      })
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const result = await response.json();
    let text = result.content?.[0]?.text || '';
    
    text = text.replace(/[^\x20-\x7E\n\r-]/g, '');
    
    if (text) return text;
    throw new Error('No content');
  } catch (error) {
    return `## Your ${quizTitle} DNA
You are an ${primaryStyle} leader with unique strengths.

## How Others Experience You
- Direct reports see you as thorough
- Peers respect your approach
- Stakeholders trust your decisions
- Team appreciates your structure
- Clients view you as professional

## Your 3 Leadership Superpowers
You solve complex problems. You catch issues others miss. You build credibility through evidence.

## Your Growth Edge and Derailers
Move faster. Express care through relationships. Balance analysis with action. Get comfortable with ambiguity.

## Communication and Influence Style
You influence through logic and data. Back insights with evidence. Be more warm.

## Team Dynamics and Impact
Your presence creates quality and accountability. Team feels confident. They need more encouragement to take risks.

## Leadership Blind Spots
- May seem overly critical
- Could slow momentum
- Might miss emotional dynamics
- Could appear cold

## Your 30-Day Action Plan
Week 1: One-on-ones with team. Listen. Document strengths.
Week 2: Find faster decisions. Join activities. Share a story.
Week 3: 80% information decisions. Compliment effort. Review feedback.
Week 4: Celebrate wins. Write insights. Commit to growth.

## Recommended Books for ${primaryStyle} Leaders
Explore books tailored to your development.`;
  }
}
