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
        max_tokens: 2500,
        messages: [{
          role: 'user',
          content: `Create leadership report for ${primaryStyle} leader. Use ONLY ASCII characters. Section headers with ##:

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
4 paragraphs (one per week) with specific actions.

Use ONLY standard ASCII. No special symbols, no Unicode, no markdown. Plain text only.`
        }]
      })
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const result = await response.json();
    let text = result.content?.[0]?.text || '';
    
    // Clean special characters
    text = text.replace(/[^\x20-\x7E\n\r•-]/g, '');
    text = text.replace(/•/g, '-');
    
    if (text) return text;
    throw new Error('No content');
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return `## Your ${quizTitle} DNA
You are an ${primaryStyle} leader with unique strengths. You bring systematic thinking and analytical rigor to leadership.

## How Others Experience You
- Direct reports see you as thorough and reliable
- Peers respect your analytical approach
- Stakeholders trust your data-driven decisions
- Team members appreciate your structure
- Clients view you as professional

## Your 3 Leadership Superpowers
You solve complex problems systematically. You catch issues others miss. You build credibility through evidence-based decisions.

## Your Growth Edge and Derailers
Move faster when good enough works. Express care through relationships. Balance analysis with action. Get comfortable with ambiguity.

## Communication and Influence Style
You influence through logic and data. People value your insight because it's backed up with evidence. Be more warm in your communication.

## Team Dynamics and Impact
Your presence creates quality and accountability. Team feels confident work is excellent. They may need more encouragement to take risks.

## Leadership Blind Spots
- May seem overly critical
- Could slow momentum with analysis
- Might miss emotional dynamics
- Could appear cold

## Your 30-Day Action Plan
Week 1: Meet one-on-one with team members. Listen to their perspectives. Document your strengths.

Week 2: Identify situations where you could act faster. Join team activities. Share a personal story.

Week 3: Make a decision with 80% information. Compliment effort not just results. Review feedback themes.

Week 4: Celebrate team wins. Write down insights. Commit to one growth area.`;
  }
}
