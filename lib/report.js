// Personalized book recommendations for each leadership style
const bookRecommendations = {
  'Visionary': [
    { title: 'Blue Ocean Strategy', author: 'W. Chan Kim & Renée Mauborgne', desc: 'Shows how to create uncontested market spaces rather than competing in crowded industries. Perfect for visionaries who see possibilities others miss. Teaches you to move beyond incremental improvement to transformational value creation. Directly addresses your strength in seeing what could be.' },
    { title: 'The Innovator\'s Dilemma', author: 'Clayton M. Christensen', desc: 'Explains why successful companies fail by not anticipating disruptive innovation. Essential for visionaries who want to stay ahead of market shifts. Teaches you to see around corners and position your organization for future relevance. Helps you avoid the trap of success-induced complacency.' },
    { title: 'Metaphorically Selling', author: 'Art Sobczak', desc: 'Teaches the power of stories and metaphors in communication and influence. Visionaries naturally think in images and possibilities - this book amplifies that strength. Shows how to make abstract futures feel real and compelling to others. Deepens your ability to inspire through narrative.' },
    { title: 'The Lean Startup', author: 'Eric Ries', desc: 'Bridges vision and execution by teaching rapid experimentation and validated learning. Visionaries often struggle with the path from possibility to reality. This book teaches how to test ideas quickly and iterate. Helps you stay grounded in reality while pursuing bold visions.' }
  ],
  
  'Analyzer': [
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', desc: 'Nobel laureate explores how our minds make decisions and where we systematically deceive ourselves. Perfect for analytical leaders who want to understand decision-making deeply. Shows when data-driven thinking helps and when intuition matters. Helps you make faster decisions with appropriate confidence levels.' },
    { title: 'The Black Swan', author: 'Nassim Nicholas Taleb', desc: 'Explores rare, high-impact events that fall outside normal statistical predictions. Challenges analytical thinking by showing limits of past-data prediction. Essential reading for risk management and building resilience. Teaches humility about what we can actually predict.' },
    { title: 'Competing Against Luck', author: 'Clayton Christensen', desc: 'Applies rigorous research methodology to understanding customer needs and business growth. Analytical framework for innovation grounded in research, not intuition. Shows how to test theories systematically before full investment. Combines analytical rigor with practical application.' },
    { title: 'Emotional Intelligence', author: 'Daniel Goleman', desc: 'Scientific research on how emotions drive decision-making and relationships. Analyzes address this blind spot through research and evidence. Shows empirically how emotional awareness improves outcomes. Provides framework for understanding non-rational factors in business.' }
  ],
  
  'Coach': [
    { title: 'Multipliers', author: 'Liz Wiseman', desc: 'Shows how great leaders amplify the intelligence and capability of everyone around them. Research-based distinction between multipliers (who expand others) and diminishers (who extract capability). Coach leaders naturally multiply - this book helps you amplify that impact. Shows how to ask better questions and stretch people intentionally.' },
    { title: 'Dare to Lead', author: 'Brené Brown', desc: 'Explores vulnerability as leadership strength, not weakness. Grounded in research on shame, fear, and courage. Shows how authentic, vulnerable leadership creates psychological safety. Deepens your ability to be human at work while leading effectively. Transforms how you build trust.' },
    { title: 'Nonviolent Communication', author: 'Marshall Rosenberg', desc: 'Framework for empathetic, connected communication that honors everyone\'s needs. Deepens your natural listening and empathy skills. Teaches how to express yourself fully while honoring others. Transforms conflicts into connection opportunities. Powerful for coaches.' },
    { title: 'Permission to Lead', author: 'Todd Henry & Schaefer', desc: 'Explores how to lead with both care for people AND clear accountability. Coaches sometimes struggle with accountability - this book balances both. Shows how to hold people to high standards while showing genuine care. Integrates challenge with support.' }
  ],
  
  'Driver': [
    { title: 'The Goal', author: 'Eliyahu Goldratt', desc: 'Novel teaching Theory of Constraints - how to identify and eliminate system bottlenecks. Perfect for drivers who want results but need systemic thinking. Shows that not all activity creates results - focus matters most. Teaches how to optimize toward meaningful goals, not just effort.' },
    { title: 'Essentialism', author: 'Greg McKeown', desc: 'Teaches discipline of doing less but better. Drivers risk burnout by trying to do everything. Shows how to say no strategically so yes means something. Improves quality of results by focusing energy ruthlessly. Sustainable high performance framework.' },
    { title: 'Radical Candor', author: 'Kim Scott', desc: 'Framework for direct feedback that cares personally while challenging directly. Drivers naturally direct - this teaches to direct WITH care. Shows how to give honest feedback that develops people. Transforms relationships from transactional to transformational.' },
    { title: 'The Five Dysfunctions of a Team', author: 'Patrick Lencioni', desc: 'Shows why teams underperform despite having talented people. Drivers achieve results alone but need teams. Teaches foundations of trust, healthy conflict, commitment, accountability, and focus on collective results. Multiplies driver impact through team health.' }
  ],
  
  'Supporter': [
    { title: 'Psychological Safety', author: 'Amy Edmondson', desc: 'Foundational research on why teams with psychological safety outperform. Supporters naturally create safety - this teaches why it matters and how to measure it. Shows how safety enables learning, innovation, and accountability. Validates your approach with neuroscience and organizational research.' },
    { title: 'Crucial Conversations', author: 'Kerry Patterson, Joseph Grenny, Ron McMillan', desc: 'Teaches how to address conflict directly while maintaining respect and relationships. Supporters sometimes avoid necessary difficult conversations. Shows how to balance care with candor. Transforms conflict from relationship threat to opportunity for connection.' },
    { title: 'The Art of Gathering', author: 'Priya Parker', desc: 'Explores how to create meaningful group experiences and conversations. Supporters naturally convene people - this teaches how to make gatherings transformational. Shows how to design interactions that bring out collective intelligence. Deepens your ability to facilitate connection.' },
    { title: 'Decisive', author: 'Chip & Dan Heath', desc: 'Framework for making good decisions when you have multiple options and stakeholders. Supporters struggle with speed when seeking consensus - teaches decision frameworks. Shows how to involve people\'s input while moving forward decisively. Balances inclusion with action.' }
  ]
};

export async function generateReport(quizTitle, primaryStyle, data = {}) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('No API key');

    // Highly specific, differentiated prompts for each style
    const stylePrompts = {
      'Visionary': `Create a detailed leadership assessment for a VISIONARY leader based on transformational leadership theory (Bass & Avolio, 1994).

## Your ${quizTitle} DNA - Visionary Leader
Write 3 rich paragraphs UNIQUE to visionary leaders. Focus on: seeing possibilities others miss, painting compelling futures, challenging the status quo, inspiring through conviction, comfort with ambiguity and change, natural optimism.

## How Others Experience You
Write 5 bullet points with "- " prefix SPECIFIC to visionary leaders:
- Your team feels inspired and energized by your perspective
- Colleagues see you as forward-thinking and possibility-focused
- You naturally attract people who want to work toward something meaningful
- Others view you as unconventional and willing to challenge assumptions
- People follow you because they believe in your vision of the future

## Your 3 Leadership Superpowers
Write 3 paragraphs of 4-5 sentences each, one per superpower:
Superpower 1 - Future Sense: Your ability to see possibilities others don't see. You recognize trends early. You paint compelling pictures of potential futures. You help others see what's possible.
Superpower 2 - Inspirational Conviction: Your deep belief in your vision is contagious. People catch your enthusiasm and optimism. You make big ideas feel achievable. You connect people to meaning and purpose.
Superpower 3 - Comfortable with Disruption: You thrive in uncertainty and change. You see volatility as opportunity. You energize teams during transitions. You help others embrace what's coming.

## Your Growth Edge and Derailers
Write 4 paragraphs addressing visionary-specific challenges:
1. Execution gap - You excel at vision but execution requires different disciplines
2. Listening to caution - Your optimism can override appropriate risk concerns
3. Impatience with pace - Change happens slower than you'd like
4. Grounding in present - You live in the future, which means today gets neglected

## Communication and Influence Style
Write 3 paragraphs about how visionary leaders influence:
1. You influence through vision, narrative, and possibility-thinking
2. You communicate in ways that inspire and make abstract futures feel real
3. You're most effective when you can connect to purpose and meaning

## Team Dynamics and Impact
Write 2 paragraphs about your team culture:
Teams experience high engagement and optimism. They feel energized to work toward something meaningful. They may need more direction on execution. They follow you willingly.

## Leadership Blind Spots
Write 5 bullet points for visionary-specific blind spots:
- May overlook practical obstacles and real constraints
- Can minimize appropriate risk caution
- Might move faster than organization's capacity
- Could lose detail-oriented, methodical people
- May underestimate how long execution actually takes

## Your 30-Day Action Plan
Write specific actions for each week:
Week 1: Slow down and listen - really hear concerns about your vision
Week 2: Ground yourself - spend a day focused purely on current execution
Week 3: Connect with skeptics - understand their caution
Week 4: Celebrate execution wins - recognize the people making vision real

Use ONLY ASCII characters. No special symbols.`,

      'Analyzer': `Create a detailed leadership assessment for an ANALYZER leader based on decision-making research (Kahneman & Tversky) and analytical leadership.

## Your ${quizTitle} DNA - Analyzer Leader
Write 3 rich paragraphs UNIQUE to analyzer leaders. Focus on: systematic thinking, data-driven orientation, thoroughness, ability to break down complex problems, building credibility through rigor, respect for evidence.

## How Others Experience You
Write 5 bullet points with "- " prefix SPECIFIC to analyzer leaders:
- Your team respects your thorough, thoughtful approach
- Colleagues trust your judgment because it's based on solid analysis
- You're seen as someone who asks the tough questions others miss
- Others view you as cautious in the best sense - you prevent costly mistakes
- People rely on you to identify risks and problems before they emerge

## Your 3 Leadership Superpowers
Write 3 paragraphs of 4-5 sentences each, one per superpower:
Superpower 1 - Problem Decomposition: You break complex, messy problems into manageable pieces. You identify root causes others miss. You create systematic frameworks for understanding. Your clarity enables team focus.
Superpower 2 - Risk Identification: You see potential problems before they materialize. Your caution prevents expensive failures. You ask the questions that reveal hidden assumptions. You build resilience through thoughtful planning.
Superpower 3 - Data Synthesis: You turn information overload into clear insight. You separate signal from noise. You build cases backed by evidence. Your rigor commands respect and credibility.

## Your Growth Edge and Derailers
Write 4 paragraphs addressing analyzer-specific challenges:
1. Analysis paralysis - More data doesn't always lead to better decisions
2. Speed matters - Markets move faster than perfect analysis allows
3. Emotional intelligence - People and relationships operate on different logic than data
4. Conviction with uncertainty - You must sometimes move forward without complete information

## Communication and Influence Style
Write 3 paragraphs about how analyzer leaders influence:
1. You influence through logic, evidence, and methodical argument
2. Your strength is building a case that stands up to scrutiny
3. Your challenge is making decisions with incomplete data and inspiring commitment to uncertain directions

## Team Dynamics and Impact
Write 2 paragraphs about your team culture:
Teams have confidence in your judgment and decisions. They appreciate the rigor. Some may find the pace slow or the bar too high. They trust you won't lead them astray.

## Leadership Blind Spots
Write 5 bullet points for analyzer-specific blind spots:
- May appear cold or emotionally unavailable
- Analysis can slow momentum and miss market windows
- Might undervalue intuition and relationship intelligence
- Risk appearing indecisive when waiting for more data
- Can overwhelm others with detail and complexity

## Your 30-Day Action Plan
Write specific actions for each week:
Week 1: Make one decision with 70% information instead of 90%
Week 2: Listen to someone's intuition without data backing
Week 3: Celebrate someone's effort even if results were imperfect
Week 4: Share a time your caution prevented disaster and acknowledge what nearly happened

Use ONLY ASCII characters. No special symbols.`,

      'Coach': `Create a detailed leadership assessment for a COACH leader based on coaching research (Goleman, 2000) and emotional intelligence.

## Your ${quizTitle} DNA - Coach Leader
Write 3 rich paragraphs UNIQUE to coach leaders. Focus on: belief in human potential, empathy and emotional attunement, commitment to development, creating environments where people flourish, psychological safety creation.

## How Others Experience You
Write 5 bullet points with "- " prefix SPECIFIC to coach leaders:
- Your team trusts you with vulnerabilities and real challenges
- People feel genuinely invested in by you
- Others experience you as believing in their potential even before they do
- You're seen as safe to approach with problems and struggles
- People choose to stay and develop under your leadership

## Your 3 Leadership Superpowers
Write 3 paragraphs of 4-5 sentences each, one per superpower:
Superpower 1 - Potential Recognition: You see people's best selves before they do. You identify strengths others overlook. You believe in people's capacity to grow. You make people feel seen and valued.
Superpower 2 - Development Architecture: You create pathways for growth and skill building. You connect people with opportunities that stretch them. You structure learning into daily work. Your team grows faster than teams with other leaders.
Superpower 3 - Psychological Safety Creation: You create environments where people can be fully human. People take risks and learn from mistakes. You make it safe to admit problems early. Your teams innovate and adapt faster.

## Your Growth Edge and Derailers
Write 4 paragraphs addressing coach-specific challenges:
1. Accountability balance - Support is good but people also need clear standards
2. Difficult conversations - You must sometimes have hard talks that feel risky to relationships
3. Development takes time - Not everyone wants to grow at your pace
4. Betrayal sensitivity - You're hurt when people leave or disappoint

## Communication and Influence Style
Write 3 paragraphs about how coach leaders influence:
1. You influence through belief in people and helping them discover their own answers
2. You lead through empathetic listening and genuine care
3. You're most effective when you balance support with challenge and clear expectations

## Team Dynamics and Impact
Write 2 paragraphs about your team culture:
Teams experience high psychological safety and engagement. People feel valued and developed. Retention is high. Performance comes from intrinsic motivation, not external pressure. You build cultures where people do their best work.

## Leadership Blind Spots
Write 5 bullet points for coach-specific blind spots:
- May avoid difficult conversations to protect relationships
- Can be slow to hold people accountable
- Might over-invest in people who aren't committed to development
- Risk being hurt by people who take opportunities and leave
- Need to balance care with clear performance expectations

## Your 30-Day Action Plan
Write specific actions for each week:
Week 1: Have one difficult performance conversation
Week 2: Set clear, non-negotiable standards for your team
Week 3: Document the impact your development is creating
Week 4: Celebrate one person's growth and their role in it

Use ONLY ASCII characters. No special symbols.`,

      'Driver': `Create a detailed leadership assessment for a DRIVER leader based on achievement motivation (McClelland, 1987).

## Your ${quizTitle} DNA - Driver Leader
Write 3 rich paragraphs UNIQUE to driver leaders. Focus on: results orientation, competitive drive, high standards, ability to move things forward, comfort with pressure and pace, accountability culture.

## How Others Experience You
Write 5 bullet points with "- " prefix SPECIFIC to driver leaders:
- Your team experiences you as focused and relentless on goals
- Colleagues see you as moving things forward consistently
- Others view you as holding yourself and others to high standards
- People respect your competitive drive and unwillingness to accept mediocrity
- You're known for translating ambition into action and results

## Your 3 Leadership Superpowers
Write 3 paragraphs of 4-5 sentences each, one per superpower:
Superpower 1 - Momentum Creation: You move initiatives forward with unstoppable force. You maintain urgency without creating panic. You keep teams focused on progress. You create velocity that compounds over time.
Superpower 2 - Accountability Culture: You make things real and measurable. You hold people accountable in ways that drive high performance. You translate strategy into action with clear ownership. You don't let things slip or hide.
Superpower 3 - High Performance Standards: You bring out exceptional work from people. You set expectations that stretch capability. You refuse to accept "good enough." You create cultures where excellence is the baseline expectation.

## Your Growth Edge and Derailers
Write 4 paragraphs addressing driver-specific challenges:
1. Relationships suffer - Your pace and push can damage connections
2. Burnout risk - Unsustainable pace catches up with you and your team
3. Balance is missing - Results matter but not at the cost of everything
4. People matter - You need them for long-term success

## Communication and Influence Style
Write 3 paragraphs about how driver leaders influence:
1. You influence through clarity of goals and creation of urgency
2. You mobilize people through directness and expectation
3. Your challenge is balancing drive with care and relational awareness

## Team Dynamics and Impact
Write 2 paragraphs about your team culture:
Teams deliver results consistently. They feel energized by momentum. Some experience stress and fatigue. Retention can be an issue as people burn out.

## Leadership Blind Spots
Write 5 bullet points for driver-specific blind spots:
- May seem uncaring about people as human beings
- Creates burnout if pace is unsustainable
- Might miss important relationship damage in pursuit of results
- Risk being impatient with thoughtful analysis and caution
- Relationships and trust erode under constant urgency and pressure

## Your 30-Day Action Plan
Write specific actions for each week:
Week 1: Slow down one meeting - listen more than talk
Week 2: Acknowledge someone's effort, not just their results
Week 3: Recognize someone's personal life or growth beyond work
Week 4: Reflect on what relationships have suffered from your drive

Use ONLY ASCII characters. No special symbols.`,

      'Supporter': `Create a detailed leadership assessment for a SUPPORTER leader based on team dynamics research (Edmondson, 1999).

## Your ${quizTitle} DNA - Supporter Leader
Write 3 rich paragraphs UNIQUE to supporter leaders. Focus on: collaboration, inclusion, harmony, bringing diverse people together, psychological safety, collective success.

## How Others Experience You
Write 5 bullet points with "- " prefix SPECIFIC to supporter leaders:
- Your team trusts that you value their input and perspective
- People feel genuinely included in decisions that affect them
- You're experienced as bringing out the best in diverse groups
- Others see you as creating harmony without requiring conformity
- People feel safe disagreeing with you because you listen

## Your 3 Leadership Superpowers
Write 3 paragraphs of 4-5 sentences each, one per superpower:
Superpower 1 - Inclusion Mastery: You bring diverse voices into conversations. You make quiet people feel safe to speak. You build teams where everyone contributes. You create cultures of genuine participation.
Superpower 2 - Consensus Building: You find common ground between competing interests. You negotiate in ways that honor everyone's needs. You build agreements that stick. You create ownership through involvement.
Superpower 3 - Collective Intelligence: You unleash team brainpower in ways individual genius can't match. You facilitate deep listening and thinking together. Your teams solve harder problems than expert-led teams. You make people smarter through collaboration.

## Your Growth Edge and Derailers
Write 4 paragraphs addressing supporter-specific challenges:
1. Decision speed - Consensus-seeking takes time markets don't always allow
2. Necessary conflict - Some decisions require decisive action, not negotiation
3. Clear accountability - Teams need someone to make the hard calls
4. Momentum vs agreement - Sometimes you must move forward without full buy-in

## Communication and Influence Style
Write 3 paragraphs about how supporter leaders influence:
1. You influence through listening, inclusion, and finding common ground
2. Your strength is making people feel heard and valued
3. Your challenge is moving decisively when consensus won't emerge

## Team Dynamics and Impact
Write 2 paragraphs about your team culture:
Teams experience high psychological safety and engagement. People feel valued and included. Collective intelligence emerges. The challenge is sometimes moving fast enough to compete.

## Leadership Blind Spots
Write 5 bullet points for supporter-specific blind spots:
- Consensus-seeking can slow momentum
- May avoid necessary difficult decisions
- Could be conflict-avoidant when tough calls are needed
- Might not push dissenting views hard enough
- Sometimes need to move forward without full agreement

## Your 30-Day Action Plan
Write specific actions for each week:
Week 1: Make one solo decision without seeking consensus
Week 2: Address a conflict directly instead of smoothing it over
Week 3: Move forward on something despite incomplete agreement
Week 4: Reflect on impact of fast, decisive leadership

Use ONLY ASCII characters. No special symbols.`
    };

    const prompt = stylePrompts[primaryStyle] || stylePrompts['Analyzer'];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const data = await response.json();
    let text = data.content?.[0]?.text || '';

    if (!text || text.length < 100) {
      text = generateMockReport(primaryStyle);
    }

    // Add personalized books section
    const books = bookRecommendations[primaryStyle] || bookRecommendations['Analyzer'];
    let booksSection = '\n## Recommended Books for ' + primaryStyle + ' Leaders\n';
    
    books.forEach((book, idx) => {
      booksSection += '\n' + (idx + 1) + '. ' + book.title + ' - ' + book.author + '\n';
      booksSection += book.desc + '\n';
    });

    return text + booksSection;
  } catch (error) {
    console.error('Report generation error:', error.message);
    return generateMockReport(primaryStyle);
  }
}

function generateMockReport(style) {
  return `## Your Leadership DNA
You bring a unique ${style} perspective to leadership.

## How Others Experience You
- Team members appreciate your contributions

## Your 3 Leadership Superpowers
You excel in specific areas.

## Your Growth Edge and Derailers
Continue developing in key areas.

## Communication and Influence Style
You influence authentically.

## Team Dynamics and Impact
Your presence matters to your team.

## Leadership Blind Spots
Monitor these areas.

## Your 30-Day Action Plan
Week 1: Reflect and listen
Week 2: Identify development priority
Week 3: Create action plan
Week 4: Begin implementation`;
}
