export async function generateReport(quizTitle, primaryStyle, data = {}) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('No API key');

    // Customized prompts for each leadership style with research backing
    const stylePrompts = {
      'Visionary': `You are generating a detailed leadership assessment report for a VISIONARY leader. Base your analysis on transformational leadership theory (Bass & Avolio, 1994) and visionary/charismatic leadership research.

Create a comprehensive report with these sections using ## headers. Focus on future-orientation, big-picture thinking, and inspirational capability.

## Your ${quizTitle} DNA - Visionary Leader
Write 3 detailed paragraphs about their core visionary essence. Reference how they inspire through articulation of compelling futures. Discuss their ability to challenge the status quo and envision possibilities.

## How Others Experience You
Write 5 bullet points with "- " prefix. Focus on: how they're perceived as inspirational, their ability to paint futures, their comfort with big thinking, their conviction and passion, their effect on team optimism.

## Your 3 Leadership Superpowers
Write 3 detailed paragraphs (one per superpower). Examples: Possibility Thinking (seeing what could be), Inspirational Communication (making people believe), Change Catalysis (leading transformation).

## Your Growth Edge and Derailers
Write 4 detailed paragraphs. Address: staying grounded in present execution, listening to cautious voices, managing impatience with pace of change, balancing vision with pragmatism. Reference Bass & Avolio's research on idealized influence.

## Communication and Influence Style
Write 3 detailed paragraphs. Discuss: influencing through vision and narrative, how you mobilize through meaning-making, your use of symbolism and metaphor, your natural ability to build emotional commitment.

## Team Dynamics and Impact
Write 2 detailed paragraphs. Cover: how your team responds to your vision with high engagement, how they feel energized but may need direction, the culture of possibility you create.

## Leadership Blind Spots
Write 5 bullet points with "- " prefix. Address: may overlook practical obstacles, can minimize risk appropriately, might move too fast, could lose some detail-oriented people, may underestimate resource constraints.

## Your 30-Day Action Plan
Write specific actions for each week that a visionary leader would benefit from. Focus on: listening deeply, staying connected to execution, celebrating small wins, grounding vision in reality.

## Recommended Books for Visionary Leaders
Recommend 4 books different from typical leadership books. For EACH book write:
- Title and author
- 2-3 sentences on why it's valuable for visionary leaders specifically
- How it addresses their growth areas

Good choices: Good to Great by Collins (disciplined execution), The Innovator's Dilemma by Christensen (anticipating disruption), Blue Ocean Strategy by Kim & Mauborgne (creating new possibilities), Imaginal Governance literature.

Use ONLY ASCII characters. No special symbols.`,

      'Analyzer': `You are generating a detailed leadership assessment report for an ANALYZER leader. Base your analysis on decision-making research (Kahneman & Tversky), analytical leadership theory, and empirical problem-solving frameworks.

Create a comprehensive report with these sections using ## headers. Focus on systematic thinking, data-driven decision-making, and rigorous analysis.

## Your ${quizTitle} DNA - Analyzer Leader
Write 3 detailed paragraphs about their core analytical essence. Reference their systematic approach, data orientation, thoroughness, and ability to break down complex problems. Discuss how their rigor builds credibility.

## How Others Experience You
Write 5 bullet points with "- " prefix. Focus on: being seen as thorough and competent, trusted for rigorous thinking, respected for asking tough questions, viewed as cautious (appropriately), seen as detail-oriented and precise.

## Your 3 Leadership Superpowers
Write 3 detailed paragraphs (one per superpower). Examples: Problem Decomposition (breaking complex issues into manageable parts), Risk Identification (seeing problems before they emerge), Data Synthesis (turning information into insight).

## Your Growth Edge and Derailers
Write 4 detailed paragraphs. Address: analysis paralysis risk, need for speed in fast-changing environments, emotional intelligence in communication, building conviction with incomplete data. Reference Kahneman's research on decision-making under uncertainty.

## Communication and Influence Style
Write 3 detailed paragraphs. Discuss: influencing through logic and evidence, your data-driven approach to persuasion, how you build cases methodically, your tendency toward conservative recommendations, need to acknowledge emotional/relational factors.

## Team Dynamics and Impact
Write 2 detailed paragraphs. Cover: how your rigor inspires confidence in team, how some may find pace slow, how you create cultures of evidence-based thinking, the need to balance analysis with action.

## Leadership Blind Spots
Write 5 bullet points with "- " prefix. Address: may appear cold or unfeeling, analysis can slow momentum, may undervalue intuition, risk being seen as indecisive, can overwhelm others with detail.

## Your 30-Day Action Plan
Write specific actions for each week that an analyzer leader would benefit from. Focus on: making faster decisions, connecting with emotions, celebrating non-data wins, listening to gut instincts.

## Recommended Books for Analyzer Leaders
Recommend 4 books different from typical leadership books. For EACH book write:
- Title and author
- 2-3 sentences on why it's valuable for analyzer leaders specifically
- How it addresses their growth areas

Good choices: Thinking, Fast and Slow by Kahneman, The Black Swan by Nassim Taleb, Radical Markets by Weyl & Zhang, Predictions by Kessler.

Use ONLY ASCII characters. No special symbols.`,

      'Coach': `You are generating a detailed leadership assessment report for a COACH leader. Base your analysis on coaching leadership research (Goleman, 2000), emotional intelligence frameworks (Mayer & Salovey), and development-focused leadership theory.

Create a comprehensive report with these sections using ## headers. Focus on people development, emotional awareness, and growth-oriented leadership.

## Your ${quizTitle} DNA - Coach Leader
Write 3 detailed paragraphs about their core coaching essence. Reference their focus on human potential, empathy, commitment to development, and belief in people's capacity to grow. Discuss their emotional attunement.

## How Others Experience You
Write 5 bullet points with "- " prefix. Focus on: being seen as genuinely invested in people, trusted with vulnerabilities, viewed as developing talent, experienced as psychologically safe, perceived as caring and committed.

## Your 3 Leadership Superpowers
Write 3 detailed paragraphs (one per superpower). Examples: Potential Recognition (seeing people's best selves), Development Architecture (creating growth pathways), Psychological Safety Creation (making it safe to be human at work).

## Your Growth Edge and Derailers
Write 4 detailed paragraphs. Address: need to balance support with accountability, risk of being seen as soft, importance of clear boundaries and standards, development can take time but results compound. Reference Goleman on coaching leadership.

## Communication and Influence Style
Write 3 detailed paragraphs. Discuss: influencing through belief in people, your empathetic listening approach, how you help people discover their own answers, your ability to see strengths others miss, importance of balancing support with challenge.

## Team Dynamics and Impact
Write 2 detailed paragraphs. Cover: how your team experiences high psychological safety and engagement, how you build loyal, committed teams, how this culture drives retention and discretionary effort, the foundation you create for performance.

## Leadership Blind Spots
Write 5 bullet points with "- " prefix. Address: may avoid difficult conversations, can be slow to hold people accountable, might invest too heavily in people who aren't committed, could be hurt by betrayal, need to ensure performance standards.

## Your 30-Day Action Plan
Write specific actions for each week that a coach leader would benefit from. Focus on: having difficult conversations, setting clear expectations, celebrating team progress, documenting impact.

## Recommended Books for Coach Leaders
Recommend 4 books different from typical leadership books. For EACH book write:
- Title and author
- 2-3 sentences on why it's valuable for coach leaders specifically
- How it addresses their growth areas

Good choices: Multipliers by Liz Wiseman (maximizing others' capability), Dare to Lead by Brené Brown (courageous leadership), Crucial Conversations by Patterson (having hard conversations), Transitions by Bridges (managing change with people).

Use ONLY ASCII characters. No special symbols.`,

      'Driver': `You are generating a detailed leadership assessment report for a DRIVER leader. Base your analysis on achievement motivation research (McClelland, 1987), goal-orientation theory, and results-focused leadership frameworks.

Create a comprehensive report with these sections using ## headers. Focus on results, accountability, momentum, and high performance standards.

## Your ${quizTitle} DNA - Driver Leader
Write 3 detailed paragraphs about their core driver essence. Reference their focus on results, competitive drive, high standards, and ability to move things forward. Discuss their comfort with pressure and pace.

## How Others Experience You
Write 5 bullet points with "- " prefix. Focus on: being seen as results-oriented and reliable, viewed as holding high standards, experienced as moving things forward, perceived as competitive, seen as urgent and action-oriented.

## Your 3 Leadership Superpowers
Write 3 detailed paragraphs (one per superpower). Examples: Momentum Creation (moving initiatives forward), Accountability Culture (making things real), High-Performance Expectations (bringing out best work).

## Your Growth Edge and Derailers
Write 4 detailed paragraphs. Address: balancing drive with relationships, risk of appearing cold or uncaring, importance of explaining the 'why' behind urgency, need to celebrate beyond results. Reference McClelland's research on achievement motivation.

## Communication and Influence Style
Write 3 detailed paragraphs. Discuss: influencing through clarity of goals and expectations, your direct communication style, how you mobilize through urgency and possibility, the importance of acknowledging relational costs, balancing push with connection.

## Team Dynamics and Impact
Write 2 detailed paragraphs. Cover: how your team delivers results consistently, how some may feel stressed or burnout risk, the culture of accountability you create, importance of ensuring sustainability alongside achievement.

## Leadership Blind Spots
Write 5 bullet points with "- " prefix. Address: may seem uncaring about people, can create burnout if unchecked, might miss important relationship damage, could be impatient with careful thinking, relationships can suffer from constant urgency.

## Your 30-Day Action Plan
Write specific actions for each week that a driver leader would benefit from. Focus on: slowing down to listen, recognizing people beyond results, acknowledging effort not just outcomes, building deeper relationships.

## Recommended Books for Driver Leaders
Recommend 4 books different from typical leadership books. For EACH book write:
- Title and author
- 2-3 sentences on why it's valuable for driver leaders specifically
- How it addresses their growth areas

Good choices: The Goal by Goldratt (systems thinking), Essentialism by McKeown (focus vs. frenzy), Emotional Intelligence by Goleman (relational awareness), The Paradox of Choice by Schwartz (decision-making).

Use ONLY ASCII characters. No special symbols.`,

      'Supporter': `You are generating a detailed leadership assessment report for a SUPPORTER leader. Base your analysis on team dynamics research, collaborative leadership theory (Rousseau et al., 2006), and psychological safety frameworks (Edmondson, 1999).

Create a comprehensive report with these sections using ## headers. Focus on collaboration, inclusion, harmony, and collective success.

## Your ${quizTitle} DNA - Supporter Leader
Write 3 detailed paragraphs about their core supporter essence. Reference their focus on team harmony, collaborative approach, commitment to inclusion, and ability to bring diverse people together. Discuss their relational orientation.

## How Others Experience You
Write 5 bullet points with "- " prefix. Focus on: being seen as collaborative and inclusive, experienced as valuing everyone's input, perceived as creating harmony, viewed as team player, trusted as someone who puts group first.

## Your 3 Leadership Superpowers
Write 3 detailed paragraphs (one per superpower). Examples: Inclusion Mastery (bringing everyone in), Consensus Building (creating agreement), Collective Intelligence (unleashing team brainpower).

## Your Growth Edge and Derailers
Write 4 detailed paragraphs. Address: need to balance collaboration with timely decisions, importance of clarity when consensus takes too long, risk of avoiding necessary conflict, importance of speed sometimes overriding agreement. Reference Edmondson's work on psychological safety.

## Communication and Influence Style
Write 3 detailed paragraphs. Discuss: influencing through listening and inclusion, how you bring reluctant voices into conversations, your ability to find common ground, importance of being able to make calls when needed, balancing input with decisiveness.

## Team Dynamics and Impact
Write 2 detailed paragraphs. Cover: how your team experiences high inclusion and engagement, the psychological safety you create, how collective intelligence emerges, the importance of ensuring decisions are timely alongside inclusive.

## Leadership Blind Spots
Write 5 bullet points with "- " prefix. Address: consensus-seeking can slow momentum, may avoid necessary tough decisions, could be conflict-avoidant, might not push dissenting views hard enough, speed sometimes requires moving without full agreement.

## Your 30-Day Action Plan
Write specific actions for each week that a supporter leader would benefit from. Focus on: making faster solo decisions, addressing conflicts directly, moving forward without unanimity, celebrating individual contributions.

## Recommended Books for Supporter Leaders
Recommend 4 books different from typical leadership books. For EACH book write:
- Title and author
- 2-3 sentences on why it's valuable for supporter leaders specifically
- How it addresses their growth areas

Good choices: Crucial Conversations by Patterson (navigating disagreement), The 5 Dysfunctions of a Team by Lencioni (trust and conflict), Permission to Lead by Schaefer (decisive leadership), Nonviolent Communication by Rosenberg.

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
    const text = data.content?.[0]?.text || '';

    if (!text || text.length < 100) {
      return generateMockReport(primaryStyle);
    }

    return text;
  } catch (error) {
    console.error('Report generation error:', error.message);
    return generateMockReport(primaryStyle);
  }
}

function generateMockReport(style) {
  return `## Your Leadership DNA
You bring a unique perspective to leadership. Your approach is shaped by your values and experiences. You continue to grow and develop as a leader.

## How Others Experience You
- Team members appreciate your contributions
- Colleagues respect your approach
- Stakeholders value your perspective
- Others see your commitment
- People recognize your strengths

## Your 3 Leadership Superpowers
You excel in specific areas. Your strengths create value. You bring distinct capabilities to your role.

## Your Growth Edge and Derailers
Continue developing in key areas. Stay aware of potential pitfalls. Build on your strengths. Remain open to feedback.

## Communication and Influence Style
You influence through your authentic approach. Your communication resonates with others. You build trust through consistency.

## Team Dynamics and Impact
Your presence matters to your team. You contribute to team success. You create positive dynamics.

## Leadership Blind Spots
Monitor these areas. Ask for feedback regularly. Seek perspective from trusted advisors.

## Your 30-Day Action Plan
Week 1: Reflect on feedback and insights
Week 2: Identify one development priority
Week 3: Create an action plan for growth
Week 4: Begin implementation and tracking

## Recommended Books for ${style} Leaders
Explore leadership development resources. Read widely in your field. Learn from other leaders' experiences.`;
}
