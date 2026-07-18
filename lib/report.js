// lib/report.js
// Generates premium AI-powered leadership reports using the Anthropic API.

export async function generateReport(quizTitle, primaryStyle, scores = {}, lang = 'en') {
  const scoreLines = Object.keys(scores).length > 0
    ? Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(', ')
    : 'Not provided';

  const isSpanish = lang === 'es';

  const prompt = isSpanish
    ? `Eres un coach ejecutivo senior de primer nivel mundial en LEANGLE HR LAB, con 20 años de experiencia trabajando con CEOs, directores y líderes de alto rendimiento en empresas Fortune 500. Un líder ha completado la evaluación "${quizTitle}".

Estilo principal: ${primaryStyle}
Desglose de puntuación: ${scoreLines}

Escribe un informe de liderazgo PREMIUM y EXTENSO que justifique una inversión de $29. Este informe debe sentirse como una sesión de coaching ejecutivo de alta calidad — profundo, personalizado, directo y transformador.

Usa exactamente estas secciones:

## Tu ADN de ${quizTitle}
Escribe 4-5 oraciones ricas y matizadas sobre lo que hace a este líder únicamente efectivo. Ve más allá de lo superficial — explora la psicología detrás de este estilo, cómo se formó y por qué es una ventaja competitiva real en el entorno empresarial actual.

## El Impacto de Tu Estilo en Tu Equipo
Describe en detalle (4-5 oraciones) cómo tu estilo afecta a las personas a tu alrededor — qué sienten los miembros de tu equipo, cómo te perciben los stakeholders, y qué cultura creas inconscientemente. Sé específico y honesto.

## Donde Brillas — Tus 3 Superpoderes
Para cada superpoder, escribe 3-4 oraciones describiendo un escenario real y vívido. Hazlo tan específico que el líder se vea a sí mismo en la descripción.

Superpoder 1: [título]
[descripción detallada]

Superpoder 2: [título]
[descripción detallada]

Superpoder 3: [título]
[descripción detallada]

## Tu Zona de Crecimiento — Lo Que Nadie Te Dice
Escribe 3 puntos ciegos honestos, específicos y un poco incómodos. Para cada uno, explica (2-3 oraciones) por qué ocurre, cómo se manifiesta en situaciones reales y qué consecuencias tiene si no se aborda. No seas genérico — sé el coach que dice la verdad.

## El Contexto Que Te Frena vs. El Que Te Libera
Esta sección es única: describe en detalle los entornos, culturas y situaciones donde este estilo PROSPERA (3-4 oraciones) versus donde LUCHA (3-4 oraciones). Ayuda al líder a entender en qué tipo de organización y rol encajan mejor.

## Plan de Acción de 30 Días — Semana por Semana
Semana 1: [título de enfoque]
Acción: [acción específica y conductual, no genérica]
Por qué importa: [1-2 oraciones explicando el impacto]

Semana 2: [título de enfoque]
Acción: [acción específica y conductual]
Por qué importa: [1-2 oraciones]

Semana 3: [título de enfoque]
Acción: [acción específica y conductual]
Por qué importa: [1-2 oraciones]

Semana 4: [título de enfoque]
Acción: [acción específica y conductual]
Por qué importa: [1-2 oraciones]

## Una Pregunta Para Llevar Contigo
Termina con una pregunta poderosa y reflexiva que este líder debería hacerse regularmente — algo que capture la esencia de su mayor oportunidad de crecimiento.

## Tu Mantra de Liderazgo
Una frase poderosa, memorable y personal que capture quiénes son como líderes en su mejor momento.

Reglas críticas: Usa "tú" a lo largo del texto. Cada sección debe ser sustancial. Nada genérico. Escribe como si conocieras a esta persona. El tono debe ser de coach ejecutivo senior — directo, empático, provocador y transformador.`

    : `You are a world-class senior executive coach at LEANGLE HR LAB with 20 years of experience working with CEOs, board members, and high-performance leaders at Fortune 500 companies. A leader has completed the "${quizTitle}" assessment.

Primary style: ${primaryStyle}
Score breakdown: ${scoreLines}

Write a PREMIUM, COMPREHENSIVE leadership report that genuinely justifies a $29 investment. This report should feel like a high-quality executive coaching session — deep, personalised, direct, and transformative. Not a summary. Not generic advice. A real insight into who this person is as a leader.

Use exactly these sections:

## Your ${quizTitle} DNA
Write 4-5 rich, nuanced sentences about what makes this leader uniquely effective. Go beyond the surface — explore the psychology behind this style, how it likely developed, and why it's a genuine competitive advantage in today's business environment. Make the leader feel deeply understood.

## How Your Style Shapes Those Around You
Describe in detail (4-5 sentences) how your style affects the people around you — what your team members feel, how stakeholders perceive you, and what culture you unconsciously create. Be specific and honest. Include both the magnetic pull of your style and its unintended ripple effects.

## Where You Shine — Your 3 Leadership Superpowers
For each superpower, write 3-4 sentences describing a vivid, real-world scenario. Make it so specific that the leader recognises themselves immediately.

Superpower 1: [title]
[detailed description of scenario and why this style excels here]

Superpower 2: [title]
[detailed description of scenario and why this style excels here]

Superpower 3: [title]
[detailed description of scenario and why this style excels here]

## Your Growth Edge — What Nobody Tells You
Write 3 honest, specific, slightly uncomfortable blind spots. For each one, explain (2-3 sentences) why it happens psychologically, how it shows up in real situations, and what the long-term cost is if left unaddressed. Be the coach who tells the truth with care.

## Where You Thrive vs. Where You Struggle
This is a unique section: describe in detail the environments, cultures and situations where this style THRIVES (3-4 sentences) versus where it STRUGGLES (3-4 sentences). Help the leader understand what type of organisation, team and role brings out their best — and what drains them.

## Your 30-Day Action Plan — Week by Week
Week 1: [focus title]
Action: [specific, behavioural action — not generic advice]
Why it matters: [1-2 sentences on the real impact this will have]

Week 2: [focus title]
Action: [specific, behavioural action]
Why it matters: [1-2 sentences]

Week 3: [focus title]
Action: [specific, behavioural action]
Why it matters: [1-2 sentences]

Week 4: [focus title]
Action: [specific, behavioural action]
Why it matters: [1-2 sentences]

## A Question To Carry With You
End with one powerful, reflective question this leader should ask themselves regularly — something that captures the essence of their biggest growth opportunity. Make it memorable and thought-provoking.

## Your Leadership Mantra
One powerful, memorable, personal sentence that captures who they are as a leader at their very best. Not a cliché. Something that feels written just for them.

Critical rules: Use "you" throughout. Every section must be substantial — minimum 3-4 sentences each. Nothing generic. Write as if you know this person. Tone should be senior executive coach — direct, empathetic, challenging, and transformative. The leader should finish reading this and feel they've had a breakthrough conversation.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);

  const data = await response.json();
  return data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '';
}
