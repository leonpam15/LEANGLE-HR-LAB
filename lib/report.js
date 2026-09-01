export async function generateReport(quizTitle, primaryStyle, data = {}) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log(`[API] Attempting request for ${primaryStyle}`);
    
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
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Write leadership report for ${primaryStyle} leader taking ${quizTitle}. Sections: DNA, Others See You, 3 Superpowers, Growth Edge, Communication, Team Impact, Blind Spots, 30-Day Plan. Specific to ${primaryStyle}.`
        }]
      })
    });

    console.log(`[API] Status: ${response.status}`);

    if (!response.ok) {
      const err = await response.json();
      console.log(`[API] Error: ${err.error?.message}`);
      throw new Error(`${response.status}`);
    }

    const result = await response.json();
    const text = result.content?.[0]?.text;
    
    if (text) {
      console.log(`[API] Success: ${text.length} chars`);
      return text;
    }
    throw new Error('No text');
  } catch (error) {
    console.log(`[API] Failed: ${error.message}`);
    return `## Your ${quizTitle} DNA\nAs a ${primaryStyle} leader, you excel.\n\n## How Others Experience You\n- Direct reports value you\n- Peers respect you\n- Stakeholders trust you\n- Team follows you\n- Clients see professionalism\n\n## Your 3 Leadership Superpowers\n${primaryStyle} strengths.\n\n## Your Growth Edge & Derailers\nDevelopment areas.\n\n## Communication & Influence Style\nNatural approach.\n\n## Team Dynamics & Impact\nYour impact.\n\n## Leadership Blind Spots\nAwareness areas.\n\n## Your 30-Day Action Plan\nWeek 1-4 progression.`;
  }
}
