// lib/report.js
// Generates AI-powered leadership reports using the Anthropic API.
// Supports English and Spanish output.

export async function generateReport(quizTitle, primaryStyle, scores = {}, lang = 'en') {
  const scoreLines = Object.keys(scores).length > 0
    ? Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(', ')
    : 'Not provided';

  const isSpanish = lang === 'es';

  const prompt = isSpanish
    ? `Eres un coach ejecutivo de primer nivel en LEANGLE HR LAB. Un líder ha completado la evaluación "${quizTitle}".

Estilo principal: ${primaryStyle}
Desglose de puntuación: ${scoreLines}

Escribe un informe de liderazgo premium personalizado con exactamente estas secciones en español:

## Tu ADN de ${quizTitle}
2-3 oraciones sobre lo que hace a este líder distintivamente efectivo en esta área.

## Dónde Brillas
3 escenarios reales y específicos donde este estilo crea resultados excepcionales.

## Tu Zona de Crecimiento
2-3 puntos ciegos honestos y específicos que este líder probablemente no ha reconocido completamente.

## Plan de Acción de 30 Días
5 acciones semanales concretas que el líder puede comenzar este lunes. Cada una debe ser específica y conductual.

## Tu Mantra de Liderazgo
Una frase poderosa a la que pueden volver bajo presión.

Usa "tú" a lo largo del texto. Sé directo, perspicaz y personalizado. Sin relleno.`
    : `You are a world-class executive coach at LEANGLE HR LAB. A leader has completed the "${quizTitle}" assessment.

Primary style: ${primaryStyle}
Score breakdown: ${scoreLines}

Write a premium personalised leadership report with exactly these sections:

## Your ${quizTitle} DNA
2-3 sentences on what makes this leader distinctively effective in this area.

## Where You Shine
3 specific, vivid real-world scenarios where this style creates exceptional results.

## Your Growth Edge
2-3 honest, specific blind spots this leader likely hasn't fully recognised yet.

## 30-Day Action Plan
5 concrete weekly actions the leader can start this Monday. Each must be specific and behavioural.

## Your Leadership Mantra
One powerful sentence they can return to under pressure.

Use "you" throughout. Be direct, insightful and personalised. No filler.`;

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
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);

  const data = await response.json();
  return data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '';
}
