import { useState, useEffect } from "react";

const B = {
  navy:"#1A2535",navyD:"#0F1823",navyL:"#243040",gold:"#B8965A",
  goldL:"#D4AF7A",silver:"#C8CDD6",white:"#FFFFFF",muted:"#6B7A8D",
  border:"#2A3A4D",success:"#4A9B7F",
};

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    tagline: "LEADERSHIP DIAGNOSTICS",
    hero: "Know yourself. Lead better.",
    heroSub: "Six evidence-informed assessments designed for leaders who take their development seriously. Each quiz delivers instant free results — unlock your full AI report for $29.",
    start: "Start the Quiz →",
    next: "Next →",
    seeResults: "See My Results →",
    allQuizzes: "← All Quizzes",
    analyzing: "Analysing your responses…",
    analyzingSub: "Building your leadership profile",
    breakdown: "Your Breakdown",
    strengths: "✅ Strengths",
    watchouts: "⚠️ Watch Outs",
    unlockTitle: "Unlock Your Full Report",
    unlockSub: "An AI-powered deep-dive into your leadership style — your DNA, hidden blind spots, and a personalised 30-day action plan.",
    unlockFeatures: ["📋 Full personalised leadership report","🎯 30-day action plan (week by week)","💡 Your leadership mantra","📬 Sent to your inbox instantly"],
    unlockBtn: "Get Full Report — $29",
    unlockNote: "One-time payment · Instant access · 30-day guarantee",
    premiumReport: "Premium Report",
    reportSent: "📬 Report sent to",
    bookmark: "Bookmark this page to revisit anytime.",
    tryAnother: "Try another assessment:",
    payTitle: "Complete Your Order",
    paySub: "Personalised AI report · One-time $29",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    payBtn: "Pay $29 & Get My Report",
    processing: "Processing…",
    secure: "🔒 Secure · 30-day money-back guarantee",
    backResults: "← Back to results",
    questions: "questions",
    primaryStyle: "Your primary style",
    footer: "© 2025 LEANGLE HR LAB · All rights reserved",
    redirecting: "Redirecting to secure checkout…",
  },
  es: {
    tagline: "DIAGNÓSTICOS DE LIDERAZGO",
    hero: "Conócete. Lidera mejor.",
    heroSub: "Seis evaluaciones basadas en evidencia diseñadas para líderes que toman su desarrollo en serio. Cada evaluación entrega resultados gratuitos instantáneos — desbloquea tu informe completo de IA por $29.",
    start: "Comenzar →",
    next: "Siguiente →",
    seeResults: "Ver Mis Resultados →",
    allQuizzes: "← Todas las Evaluaciones",
    analyzing: "Analizando tus respuestas…",
    analyzingSub: "Construyendo tu perfil de liderazgo",
    breakdown: "Tu Desglose",
    strengths: "✅ Fortalezas",
    watchouts: "⚠️ Puntos de Atención",
    unlockTitle: "Desbloquea Tu Informe Completo",
    unlockSub: "Un análisis profundo de tu estilo de liderazgo generado por IA — tu ADN, puntos ciegos ocultos y un plan de acción personalizado de 30 días.",
    unlockFeatures: ["📋 Informe de liderazgo personalizado completo","🎯 Plan de acción de 30 días (semana por semana)","💡 Tu mantra de liderazgo","📬 Enviado a tu bandeja de entrada al instante"],
    unlockBtn: "Obtener Informe Completo — $29",
    unlockNote: "Pago único · Acceso instantáneo · Garantía de 30 días",
    premiumReport: "Informe Premium",
    reportSent: "📬 Informe enviado a",
    bookmark: "Guarda esta página para revisitarla en cualquier momento.",
    tryAnother: "Prueba otra evaluación:",
    payTitle: "Completa Tu Pedido",
    paySub: "Informe de IA personalizado · Pago único $29",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@empresa.com",
    payBtn: "Pagar $29 y Obtener Mi Informe",
    processing: "Procesando…",
    secure: "🔒 Seguro · Garantía de devolución de 30 días",
    backResults: "← Volver a resultados",
    questions: "preguntas",
    primaryStyle: "Tu estilo principal",
    footer: "© 2025 LEANGLE HR LAB · Todos los derechos reservados",
    redirecting: "Redirigiendo al pago seguro…",
  }
};

// ── QUIZ DATA (bilingual) ─────────────────────────────────────────────────────
const QUIZZES = [
  {
    id:"communication",
    title:{en:"Leadership Communication Style",es:"Estilo de Comunicación de Liderazgo"},
    subtitle:{en:"Discover how you lead conversations",es:"Descubre cómo lideras las conversaciones"},
    emoji:"💬",duration:"3 min",
    styles:{
      Collaborative:{emoji:"🤝",tagline:{en:"The Bridge Builder",es:"El Constructor de Puentes"},color:"#4A7FA5",
        summary:{en:"You lead through inclusion. Your instinct is to gather people, create dialogue, and build shared ownership. Teams feel heard around you — which drives genuine buy-in.",es:"Lideras a través de la inclusión. Tu instinto es reunir a las personas, crear diálogo y construir propiedad compartida. Los equipos se sienten escuchados contigo."},
        strengths:{en:["Builds trust and psychological safety","Excellent at cross-functional alignment","Creates high team engagement"],es:["Construye confianza y seguridad psicológica","Excelente en alineación interfuncional","Crea alto compromiso del equipo"]},
        blindspots:{en:["Can slow decisions when speed matters","May avoid necessary confrontation","Risk of consensus fatigue"],es:["Puede ralentizar decisiones cuando se necesita velocidad","Puede evitar la confrontación necesaria","Riesgo de fatiga por consenso"]}},
      Directive:{emoji:"🎯",tagline:{en:"The Clear Commander",es:"El Comandante Claro"},color:"#C0622F",
        summary:{en:"You lead with clarity and pace. When the pressure is on, people look to you because you cut through noise and make things happen.",es:"Lideras con claridad y ritmo. Bajo presión, la gente te busca porque eliminas el ruido y haces que las cosas sucedan."},
        strengths:{en:["Decisive in high-stakes moments","Clear accountability structures","Keeps teams focused"],es:["Decisivo en momentos de alta presión","Estructuras claras de responsabilidad","Mantiene los equipos enfocados"]},
        blindspots:{en:["Can feel top-down to creative thinkers","May under-invest in emotional context","Risk of disengagement"],es:["Puede sentirse jerárquico para pensadores creativos","Puede subestimar el contexto emocional","Riesgo de desconexión"]}},
      Empathetic:{emoji:"💚",tagline:{en:"The Human-First Leader",es:"El Líder con las Personas Primero"},color:"#4A9B7F",
        summary:{en:"You lead with deep awareness of the people around you. You notice what's unsaid, respond to emotion before logic, and build loyalty through genuine care.",es:"Lideras con profunda conciencia de las personas a tu alrededor. Notas lo no dicho, respondes a la emoción antes que a la lógica."},
        strengths:{en:["Exceptional at retaining talent","Creates safety for hard conversations","Strong at individual development"],es:["Excepcional en retención de talento","Crea seguridad para conversaciones difíciles","Fuerte en desarrollo individual"]},
        blindspots:{en:["May prioritise harmony over hard truths","Can personalise feedback too much","Risk of perceived indecisiveness"],es:["Puede priorizar la armonía sobre verdades difíciles","Puede personalizar demasiado el feedback","Riesgo de indecisión percibida"]}},
      Analytical:{emoji:"📊",tagline:{en:"The Evidence-Led Leader",es:"El Líder Basado en Evidencia"},color:"#7B6FA5",
        summary:{en:"You lead with rigour. Your communication is grounded in data, preparation and logic. People trust what you say because you've done the work.",es:"Lideras con rigor. Tu comunicación se basa en datos, preparación y lógica. La gente confía en lo que dices porque has hecho el trabajo."},
        strengths:{en:["Highly credible under scrutiny","Excellent at strategic communication","Reduces ambiguity"],es:["Muy creíble bajo escrutinio","Excelente en comunicación estratégica","Reduce la ambigüedad"]},
        blindspots:{en:["Can feel distant or over-complicated","May under-weight emotional signals","Risk of analysis paralysis"],es:["Puede sentirse distante o complicado","Puede subestimar señales emocionales","Riesgo de parálisis por análisis"]}},
    },
    questions:[
      {q:{en:"When your team misses a deadline, your first move is to…",es:"Cuando tu equipo no cumple un plazo, tu primer paso es…"},options:[{text:{en:"Call a meeting to understand what went wrong",es:"Convocar una reunión para entender qué salió mal"},s:"Collaborative"},{text:{en:"Send a clear message outlining consequences and next steps",es:"Enviar un mensaje claro sobre consecuencias y próximos pasos"},s:"Directive"},{text:{en:"Check in with each person individually",es:"Hablar individualmente con cada persona"},s:"Empathetic"},{text:{en:"Analyse the data and identify the root cause",es:"Analizar los datos e identificar la causa raíz"},s:"Analytical"}]},
      {q:{en:"Your team is divided on a big decision. You…",es:"Tu equipo está dividido en una decisión importante. Tú…"},options:[{text:{en:"Facilitate discussion until consensus forms",es:"Facilitas la discusión hasta llegar a un consenso"},s:"Collaborative"},{text:{en:"Make the call yourself — someone has to lead",es:"Tomas la decisión tú mismo — alguien tiene que liderar"},s:"Directive"},{text:{en:"Focus on how each person feels about the options",es:"Te enfocas en cómo se siente cada persona"},s:"Empathetic"},{text:{en:"Present pros, cons and data, then decide",es:"Presentas pros, contras y datos, luego decides"},s:"Analytical"}]},
      {q:{en:"How do you typically open a team meeting?",es:"¿Cómo sueles comenzar una reunión de equipo?"},options:[{text:{en:"Ask everyone to share one update or win",es:"Pides a todos que compartan una actualización o logro"},s:"Collaborative"},{text:{en:"Jump straight into the agenda — time is precious",es:"Vas directo a la agenda — el tiempo es valioso"},s:"Directive"},{text:{en:"Check in on how people are feeling this week",es:"Preguntas cómo se siente la gente esta semana"},s:"Empathetic"},{text:{en:"Review metrics and progress since last time",es:"Revisas métricas y progreso desde la última vez"},s:"Analytical"}]},
      {q:{en:"A high performer tells you they're burned out. You…",es:"Un empleado destacado te dice que está agotado. Tú…"},options:[{text:{en:"Involve the team in redistributing workload",es:"Involucras al equipo en redistribuir la carga de trabajo"},s:"Collaborative"},{text:{en:"Reassign tasks immediately and set a recovery plan",es:"Reasignas tareas inmediatamente y estableces un plan de recuperación"},s:"Directive"},{text:{en:"Sit with them, listen deeply, and ask what they need",es:"Te sientas con ellos, escuchas profundamente y preguntas qué necesitan"},s:"Empathetic"},{text:{en:"Review their workload data and identify patterns",es:"Revisas los datos de su carga de trabajo e identificas patrones"},s:"Analytical"}]},
      {q:{en:"When giving feedback, you tend to…",es:"Al dar retroalimentación, tiendes a…"},options:[{text:{en:"Co-create improvement ideas with the person",es:"Co-crear ideas de mejora con la persona"},s:"Collaborative"},{text:{en:"Be direct and specific about what needs to change",es:"Ser directo y específico sobre lo que debe cambiar"},s:"Directive"},{text:{en:"Sandwich criticism with strong emotional support",es:"Intercalar críticas con fuerte apoyo emocional"},s:"Empathetic"},{text:{en:"Use examples and metrics to back up every point",es:"Usar ejemplos y métricas para respaldar cada punto"},s:"Analytical"}]},
      {q:{en:"Your writing style (emails, Slack) is…",es:"Tu estilo de escritura (correos, Slack) es…"},options:[{text:{en:"Conversational — you invite replies and input",es:"Conversacional — invitas respuestas y participación"},s:"Collaborative"},{text:{en:"Concise — bullet points, action items, clear owner",es:"Conciso — puntos clave, acciones, responsable claro"},s:"Directive"},{text:{en:"Warm — you acknowledge effort and check in personally",es:"Cálido — reconoces el esfuerzo y te contactas personalmente"},s:"Empathetic"},{text:{en:"Detailed — context, rationale and references included",es:"Detallado — incluyes contexto, justificación y referencias"},s:"Analytical"}]},
      {q:{en:"When a new initiative is announced from above, you…",es:"Cuando se anuncia una nueva iniciativa desde arriba, tú…"},options:[{text:{en:"Bring your team together to discuss how to approach it",es:"Reúnes a tu equipo para discutir cómo abordarlo"},s:"Collaborative"},{text:{en:"Translate it into clear tasks and assign ownership fast",es:"Lo conviertes en tareas claras y asignas responsables rápidamente"},s:"Directive"},{text:{en:"Think first about how this will affect team morale",es:"Primero piensas en cómo afectará la moral del equipo"},s:"Empathetic"},{text:{en:"Read every document before communicating anything",es:"Lees todos los documentos antes de comunicar nada"},s:"Analytical"}]},
      {q:{en:"How do you handle conflict between two team members?",es:"¿Cómo manejas el conflicto entre dos miembros del equipo?"},options:[{text:{en:"Bring them together for a facilitated conversation",es:"Los reúnes para una conversación facilitada"},s:"Collaborative"},{text:{en:"Set clear expectations and rules of engagement",es:"Estableces expectativas claras y reglas de participación"},s:"Directive"},{text:{en:"Speak to each separately, validating both sides",es:"Hablas con cada uno por separado, validando ambos lados"},s:"Empathetic"},{text:{en:"Diagnose the root cause before involving anyone",es:"Diagnosticas la causa raíz antes de involucrar a nadie"},s:"Analytical"}]},
      {q:{en:"What does 'great leadership communication' mean to you?",es:"¿Qué significa para ti una 'gran comunicación de liderazgo'?"},options:[{text:{en:"Creating space where everyone's voice is heard",es:"Crear un espacio donde se escuche la voz de todos"},s:"Collaborative"},{text:{en:"Being clear, consistent and decisive under pressure",es:"Ser claro, consistente y decisivo bajo presión"},s:"Directive"},{text:{en:"Building trust through honesty and genuine care",es:"Construir confianza a través de la honestidad y el cuidado genuino"},s:"Empathetic"},{text:{en:"Communicating with evidence so people respect your reasoning",es:"Comunicar con evidencia para que la gente respete tu razonamiento"},s:"Analytical"}]},
      {q:{en:"When you sense your team is losing motivation, you…",es:"Cuando sientes que tu equipo está perdiendo motivación, tú…"},options:[{text:{en:"Run a team session to reconnect to purpose",es:"Organizas una sesión para reconectar con el propósito"},s:"Collaborative"},{text:{en:"Set a short-term challenge with a clear reward",es:"Estableces un desafío a corto plazo con una recompensa clara"},s:"Directive"},{text:{en:"Have honest one-on-ones to understand what's going on",es:"Tienes conversaciones individuales honestas para entender qué pasa"},s:"Empathetic"},{text:{en:"Look at workload, output trends and flag patterns",es:"Analizas carga de trabajo, tendencias de rendimiento y patrones"},s:"Analytical"}]},
    ],
  },
  {
    id:"conflict",
    title:{en:"Conflict Resolution Style",es:"Estilo de Resolución de Conflictos"},
    subtitle:{en:"How you handle tension and disagreement",es:"Cómo manejas la tensión y el desacuerdo"},
    emoji:"⚡",duration:"3 min",
    styles:{
      Mediator:{emoji:"🕊️",tagline:{en:"The Peacemaker",es:"El Pacificador"},color:"#4A9B7F",summary:{en:"You instinctively seek common ground. When tension rises, you become the calm in the room.",es:"Buscas instintivamente puntos en común. Cuando la tensión aumenta, te conviertes en la calma del equipo."},strengths:{en:["Restores team harmony quickly","Skilled at reframing conflict as shared problems","Creates lasting agreements"],es:["Restaura la armonía del equipo rápidamente","Hábil para replantear conflictos como problemas compartidos","Crea acuerdos duraderos"]},blindspots:{en:["May avoid necessary confrontation","Can be seen as lacking conviction","Risk of unresolved underlying issues"],es:["Puede evitar la confrontación necesaria","Puede verse como falta de convicción","Riesgo de problemas subyacentes sin resolver"]}},
      Confronter:{emoji:"🔥",tagline:{en:"The Direct Resolver",es:"El Resolvedor Directo"},color:"#C0622F",summary:{en:"You face conflict head-on. You believe unaddressed tension festers.",es:"Enfrentas el conflicto de frente. Crees que la tensión sin abordar se agrava."},strengths:{en:["Prevents issues from dragging on","Respected for honesty and clarity","Clears the air effectively"],es:["Evita que los problemas se prolonguen","Respetado por honestidad y claridad","Despeja el ambiente de manera efectiva"]},blindspots:{en:["Can escalate rather than resolve","May feel aggressive to sensitive personalities","Risk of winning the argument, losing the relationship"],es:["Puede escalar en lugar de resolver","Puede sentirse agresivo para personalidades sensibles","Riesgo de ganar el argumento y perder la relación"]}},
      Avoider:{emoji:"🌊",tagline:{en:"The Strategic Pauser",es:"El Pausador Estratégico"},color:"#4A7FA5",summary:{en:"You pick your battles deliberately. You know not every conflict is worth fighting.",es:"Eliges tus batallas deliberadamente. Sabes que no todo conflicto vale la pena."},strengths:{en:["Prevents unnecessary escalation","Strong long-term perspective","Skilled at letting small tensions dissolve naturally"],es:["Previene escaladas innecesarias","Perspectiva a largo plazo sólida","Hábil para dejar que pequeñas tensiones se disuelvan"]},blindspots:{en:["Important issues can go unaddressed","Team may read silence as approval","Risk of resentment building quietly"],es:["Problemas importantes pueden quedar sin abordar","El equipo puede interpretar el silencio como aprobación","Riesgo de resentimiento acumulado"]}},
      Collaborator:{emoji:"🔧",tagline:{en:"The Problem-Solver",es:"El Solucionador de Problemas"},color:"#7B6FA5",summary:{en:"You treat conflict as a design problem. You gather perspectives and find root causes.",es:"Tratas el conflicto como un problema de diseño. Reúnes perspectivas y encuentras causas raíz."},strengths:{en:["Produces durable, creative solutions","Builds trust through fairness","Turns conflict into team growth"],es:["Produce soluciones duraderas y creativas","Construye confianza a través de la justicia","Convierte el conflicto en crecimiento del equipo"]},blindspots:{en:["Can over-complicate simple disputes","Time-intensive process","May frustrate those wanting a quick decision"],es:["Puede complicar demasiado disputas simples","Proceso que consume mucho tiempo","Puede frustrar a quienes quieren una decisión rápida"]}},
    },
    questions:[
      {q:{en:"Two team members clash openly in a meeting. You…",es:"Dos miembros del equipo chocan abiertamente en una reunión. Tú…"},options:[{text:{en:"Step in and redirect to shared goals",es:"Intervienes y redirigis hacia metas comunes"},s:"Mediator"},{text:{en:"Address the tension directly — name what just happened",es:"Abordas la tensión directamente — nombras lo que ocurrió"},s:"Confronter"},{text:{en:"Let it settle and follow up privately later",es:"Dejas que se calme y haces seguimiento privado después"},s:"Avoider"},{text:{en:"Pause the meeting and set up a proper resolution session",es:"Pausas la reunión y organizas una sesión de resolución"},s:"Collaborator"}]},
      {q:{en:"Someone is consistently undermining a colleague. You…",es:"Alguien está socavando consistentemente a un colega. Tú…"},options:[{text:{en:"Bring both parties together to find common ground",es:"Reúnes a ambas partes para encontrar puntos en común"},s:"Mediator"},{text:{en:"Call it out with the person directly and immediately",es:"Lo señalas con la persona directamente e inmediatamente"},s:"Confronter"},{text:{en:"Monitor it closely before acting",es:"Lo monitoreas de cerca antes de actuar"},s:"Avoider"},{text:{en:"Investigate the root cause before any conversation",es:"Investigas la causa raíz antes de cualquier conversación"},s:"Collaborator"}]},
      {q:{en:"You disagree strongly with a decision from your manager. You…",es:"Estás en fuerte desacuerdo con una decisión de tu gerente. Tú…"},options:[{text:{en:"Find a way to raise concerns without creating friction",es:"Encuentras una manera de plantear preocupaciones sin crear fricción"},s:"Mediator"},{text:{en:"Tell them clearly why you think it's wrong",es:"Les dices claramente por qué crees que está equivocado"},s:"Confronter"},{text:{en:"Raise it once, then let it go if they don't change",es:"Lo planteas una vez, luego lo dejas si no cambian"},s:"Avoider"},{text:{en:"Build a case with data and request a proper discussion",es:"Construyes un caso con datos y solicitas una discusión formal"},s:"Collaborator"}]},
      {q:{en:"A conflict is affecting team output. Your first priority is…",es:"Un conflicto está afectando el rendimiento del equipo. Tu primera prioridad es…"},options:[{text:{en:"Restore the relationship so work can resume",es:"Restaurar la relación para que el trabajo pueda continuar"},s:"Mediator"},{text:{en:"Resolve the conflict quickly, even if it's uncomfortable",es:"Resolver el conflicto rápidamente, aunque sea incómodo"},s:"Confronter"},{text:{en:"Minimise disruption while the dust settles",es:"Minimizar la interrupción mientras se asienta el polvo"},s:"Avoider"},{text:{en:"Fix the structural issue that caused it",es:"Arreglar el problema estructural que lo causó"},s:"Collaborator"}]},
      {q:{en:"Someone gives you harsh feedback you think is unfair. You…",es:"Alguien te da una retroalimentación dura que crees injusta. Tú…"},options:[{text:{en:"Acknowledge their perspective and look for the grain of truth",es:"Reconoces su perspectiva y buscas el grano de verdad"},s:"Mediator"},{text:{en:"Respond immediately and defend your position",es:"Respondes inmediatamente y defiendes tu posición"},s:"Confronter"},{text:{en:"Process it privately before responding",es:"Lo procesas en privado antes de responder"},s:"Avoider"},{text:{en:"Ask for specific examples before forming a response",es:"Pides ejemplos específicos antes de formar una respuesta"},s:"Collaborator"}]},
      {q:{en:"The conflict has gone on too long. You…",es:"El conflicto ha durado demasiado. Tú…"},options:[{text:{en:"Propose a fresh start and ask everyone to move on",es:"Propones un nuevo comienzo y pides a todos que sigan adelante"},s:"Mediator"},{text:{en:"Force a conclusion — decide who's right and act",es:"Fuerzas una conclusión — decides quién tiene razón y actúas"},s:"Confronter"},{text:{en:"Give it more time — pressure rarely helps",es:"Das más tiempo — la presión raramente ayuda"},s:"Avoider"},{text:{en:"Restructure how the parties interact to remove the friction",es:"Reestructuras cómo interactúan las partes para eliminar la fricción"},s:"Collaborator"}]},
      {q:{en:"What do you believe about workplace conflict?",es:"¿Qué crees sobre el conflicto en el lugar de trabajo?"},options:[{text:{en:"It's mostly avoidable with better communication",es:"Es mayormente evitable con mejor comunicación"},s:"Mediator"},{text:{en:"It's healthy if handled openly and quickly",es:"Es saludable si se maneja abierta y rápidamente"},s:"Confronter"},{text:{en:"Most conflict resolves itself if given space",es:"La mayoría de los conflictos se resuelven solos si se les da espacio"},s:"Avoider"},{text:{en:"It's a symptom of a deeper systemic issue",es:"Es un síntoma de un problema sistémico más profundo"},s:"Collaborator"}]},
      {q:{en:"After a resolved conflict, you…",es:"Después de resolver un conflicto, tú…"},options:[{text:{en:"Check in with both parties to make sure the air is clear",es:"Verificas con ambas partes que el ambiente esté despejado"},s:"Mediator"},{text:{en:"Move on — it's done, no need to revisit",es:"Sigues adelante — está hecho, no hay necesidad de revisitar"},s:"Confronter"},{text:{en:"Keep a watchful eye from a distance",es:"Mantienes un ojo vigilante desde la distancia"},s:"Avoider"},{text:{en:"Document what happened and update your team processes",es:"Documentas lo que ocurrió y actualizas los procesos del equipo"},s:"Collaborator"}]},
    ],
  },
  {
    id:"feedback",
    title:{en:"Feedback Style",es:"Estilo de Retroalimentación"},
    subtitle:{en:"How you give and receive critical input",es:"Cómo das y recibes retroalimentación crítica"},
    emoji:"🎙️",duration:"3 min",
    styles:{
      Coach:{emoji:"🌱",tagline:{en:"The Growth Guide",es:"El Guía de Crecimiento"},color:"#4A9B7F",summary:{en:"You give feedback as an investment. People leave your conversations feeling capable and seen.",es:"Das retroalimentación como una inversión. Las personas salen de tus conversaciones sintiéndose capaces y reconocidas."},strengths:{en:["Builds lasting performance improvement","Creates psychological safety","Strong at developing junior talent"],es:["Construye mejora de rendimiento duradera","Crea seguridad psicológica","Fuerte en desarrollar talento junior"]},blindspots:{en:["May soften feedback until the message is lost","Can feel slow when urgency is needed","Risk of over-praising mediocre work"],es:["Puede suavizar tanto la retroalimentación que el mensaje se pierda","Puede sentirse lento cuando se necesita urgencia","Riesgo de elogiar en exceso el trabajo mediocre"]}},
      Challenger:{emoji:"💪",tagline:{en:"The Straight Talker",es:"El Hablador Directo"},color:"#C0622F",summary:{en:"You believe in direct, honest feedback. People know exactly where they stand with you.",es:"Crees en la retroalimentación directa y honesta. Las personas saben exactamente dónde están contigo."},strengths:{en:["Clear, actionable and memorable","No guessing required","Drives rapid improvement in confident people"],es:["Clara, accionable y memorable","No hay necesidad de adivinar","Impulsa la mejora rápida en personas seguras"]},blindspots:{en:["Can damage confidence in sensitive individuals","May miss emotional context","Risk of feedback feeling like criticism"],es:["Puede dañar la confianza en individuos sensibles","Puede perderse el contexto emocional","Riesgo de que la retroalimentación se sienta como crítica"]}},
      Connector:{emoji:"🤝",tagline:{en:"The Relationship Feeder",es:"El Cultivador de Relaciones"},color:"#4A7FA5",summary:{en:"You tailor your feedback to the individual. You read the room and ensure the person feels safe enough to hear you.",es:"Adaptas tu retroalimentación al individuo. Lees el ambiente y aseguras que la persona se sienta segura para escucharte."},strengths:{en:["Highly personalised and trusted","Excellent retention of top performers","Creates deep loyalty"],es:["Altamente personalizada y de confianza","Excelente retención de alto rendimiento","Crea lealtad profunda"]},blindspots:{en:["Consistency can be a challenge across the team","May avoid hard truths to protect the relationship","Risk of perceived favouritism"],es:["La consistencia puede ser un desafío en el equipo","Puede evitar verdades difíciles para proteger la relación","Riesgo de favoritismo percibido"]}},
      Analyst:{emoji:"📐",tagline:{en:"The Evidence Builder",es:"El Constructor de Evidencias"},color:"#7B6FA5",summary:{en:"You come to feedback conversations prepared with data, examples, and structured observations.",es:"Llegas a las conversaciones de retroalimentación preparado con datos, ejemplos y observaciones estructuradas."},strengths:{en:["Objective and hard to dismiss","Clear on what 'better' looks like","Creates measurable improvement plans"],es:["Objetivo y difícil de desestimar","Claro sobre cómo se ve 'mejor'","Crea planes de mejora medibles"]},blindspots:{en:["Can feel clinical or impersonal","May miss the emotional dimension","Risk of overwhelming with data"],es:["Puede sentirse clínico o impersonal","Puede perderse la dimensión emocional","Riesgo de abrumar con datos"]}},
    },
    questions:[
      {q:{en:"Before a feedback conversation, you…",es:"Antes de una conversación de retroalimentación, tú…"},options:[{text:{en:"Think about what will motivate this person to grow",es:"Piensas en qué motivará a esta persona a crecer"},s:"Coach"},{text:{en:"Plan exactly what you need to say and keep it tight",es:"Planificas exactamente qué debes decir y lo mantienes conciso"},s:"Challenger"},{text:{en:"Consider their current state and how to meet them there",es:"Consideras su estado actual y cómo llegar a ellos ahí"},s:"Connector"},{text:{en:"Gather examples, notes and context to back your points",es:"Reúnes ejemplos, notas y contexto para respaldar tus puntos"},s:"Analyst"}]},
      {q:{en:"You open a feedback conversation by…",es:"Abres una conversación de retroalimentación…"},options:[{text:{en:"Asking what they feel went well first",es:"Preguntando primero qué creen que salió bien"},s:"Coach"},{text:{en:"Going straight to the point",es:"Yendo directamente al punto"},s:"Challenger"},{text:{en:"Checking in on how they're feeling about their performance",es:"Verificando cómo se sienten respecto a su rendimiento"},s:"Connector"},{text:{en:"Setting context with the data you've gathered",es:"Estableciendo contexto con los datos que has reunido"},s:"Analyst"}]},
      {q:{en:"Someone pushes back on your feedback. You…",es:"Alguien rechaza tu retroalimentación. Tú…"},options:[{text:{en:"Explore their perspective — they may have a point",es:"Explotas su perspectiva — pueden tener razón"},s:"Coach"},{text:{en:"Hold your position if you believe you're right",es:"Mantienes tu posición si crees que tienes razón"},s:"Challenger"},{text:{en:"Back off if it protects the relationship",es:"Cedes si eso protege la relación"},s:"Connector"},{text:{en:"Go back to your evidence and walk through it calmly",es:"Vuelves a tu evidencia y la repasas con calma"},s:"Analyst"}]},
      {q:{en:"Your feedback lands badly and they shut down. You…",es:"Tu retroalimentación cae mal y se cierran. Tú…"},options:[{text:{en:"Pause, reassure them, and reframe with encouragement",es:"Pausas, los tranquilizas y reformulas con aliento"},s:"Coach"},{text:{en:"Give them space — they'll process it in their own time",es:"Les das espacio — lo procesarán a su tiempo"},s:"Challenger"},{text:{en:"Drop everything and focus on rebuilding the connection",es:"Dejas todo y te enfocas en reconstruir la conexión"},s:"Connector"},{text:{en:"Ask clarifying questions to understand where it went wrong",es:"Haces preguntas aclaratorias para entender dónde salió mal"},s:"Analyst"}]},
      {q:{en:"When receiving feedback yourself, you prefer…",es:"Cuando recibes retroalimentación, prefieres…"},options:[{text:{en:"A coaching conversation that helps you identify your own gaps",es:"Una conversación de coaching que te ayude a identificar tus propias brechas"},s:"Coach"},{text:{en:"Blunt, specific, no frills",es:"Directo, específico, sin adornos"},s:"Challenger"},{text:{en:"Feedback from someone who knows and trusts you",es:"Retroalimentación de alguien que te conoce y confía en ti"},s:"Connector"},{text:{en:"Structured input with clear examples and evidence",es:"Aportaciones estructuradas con ejemplos claros y evidencia"},s:"Analyst"}]},
      {q:{en:"After giving feedback, you…",es:"Después de dar retroalimentación, tú…"},options:[{text:{en:"Follow up to see how they're implementing the suggestions",es:"Haces seguimiento para ver cómo están implementando las sugerencias"},s:"Coach"},{text:{en:"Let them get on with it — the ball is in their court",es:"Los dejas seguir — la pelota está en su cancha"},s:"Challenger"},{text:{en:"Check in to make sure the relationship feels intact",es:"Verificas que la relación se sienta intacta"},s:"Connector"},{text:{en:"Track whether their performance improves measurably",es:"Haces seguimiento de si su rendimiento mejora mediblemente"},s:"Analyst"}]},
      {q:{en:"What do you believe makes feedback effective?",es:"¿Qué crees que hace efectiva la retroalimentación?"},options:[{text:{en:"It helps someone believe in their own potential",es:"Ayuda a alguien a creer en su propio potencial"},s:"Coach"},{text:{en:"It's honest, even when uncomfortable",es:"Es honesta, incluso cuando es incómoda"},s:"Challenger"},{text:{en:"It's delivered by someone the recipient trusts",es:"La entrega alguien en quien el receptor confía"},s:"Connector"},{text:{en:"It's specific, evidence-based and actionable",es:"Es específica, basada en evidencia y accionable"},s:"Analyst"}]},
      {q:{en:"When someone on your team is underperforming, you…",es:"Cuando alguien de tu equipo tiene bajo rendimiento, tú…"},options:[{text:{en:"Invest time in understanding what's blocking them",es:"Inviertes tiempo en entender qué los está bloqueando"},s:"Coach"},{text:{en:"Have a frank conversation about the gap immediately",es:"Tienes una conversación franca sobre la brecha de inmediato"},s:"Challenger"},{text:{en:"Approach carefully to protect their confidence",es:"Te acercas con cuidado para proteger su confianza"},s:"Connector"},{text:{en:"Build a performance improvement plan with clear metrics",es:"Construyes un plan de mejora de rendimiento con métricas claras"},s:"Analyst"}]},
    ],
  },
  {
    id:"decision",
    title:{en:"Decision-Making Style",es:"Estilo de Toma de Decisiones"},
    subtitle:{en:"How you make calls under pressure",es:"Cómo tomas decisiones bajo presión"},
    emoji:"⚖️",duration:"3 min",
    styles:{
      Instinctive:{emoji:"⚡",tagline:{en:"The Bold Mover",es:"El Ejecutor Audaz"},color:"#C0622F",summary:{en:"You trust your gut. Your speed to act gives you a decisive edge in fast-moving environments.",es:"Confías en tu instinto. Tu velocidad para actuar te da una ventaja decisiva en entornos dinámicos."},strengths:{en:["Fast and confident under pressure","Energises teams with decisiveness","Cuts through over-analysis"],es:["Rápido y seguro bajo presión","Energiza los equipos con decisión","Corta el exceso de análisis"]},blindspots:{en:["Can overlook important data","May move before the team is ready","Risk of pattern bias in novel situations"],es:["Puede ignorar datos importantes","Puede moverse antes de que el equipo esté listo","Riesgo de sesgo de patrones en situaciones nuevas"]}},
      Consensus:{emoji:"🗳️",tagline:{en:"The People Unifier",es:"El Unificador de Personas"},color:"#4A7FA5",summary:{en:"You believe the best decisions are made together. You invest in alignment before acting.",es:"Crees que las mejores decisiones se toman juntos. Inviertes en alineación antes de actuar."},strengths:{en:["High team buy-in","Surfaces blind spots through diverse input","Decisions stick because people helped make them"],es:["Alto compromiso del equipo","Descubre puntos ciegos a través de aportes diversos","Las decisiones perduran porque las personas ayudaron a tomarlas"]},blindspots:{en:["Slow in urgent situations","Can be paralysed by disagreement","Risk of lowest-common-denominator outcomes"],es:["Lento en situaciones urgentes","Puede paralizarse por el desacuerdo","Riesgo de resultados del mínimo común denominador"]}},
      Methodical:{emoji:"🔬",tagline:{en:"The Careful Strategist",es:"El Estratega Cuidadoso"},color:"#7B6FA5",summary:{en:"You take a structured approach to every decision. You define the problem, gather data, evaluate options.",es:"Adoptas un enfoque estructurado para cada decisión. Defines el problema, reúnes datos, evalúas opciones."},strengths:{en:["Highly defensible decisions","Excellent in complex, high-stakes situations","Minimises costly mistakes"],es:["Decisiones muy defendibles","Excelente en situaciones complejas de alto riesgo","Minimiza errores costosos"]},blindspots:{en:["Slow when speed is essential","Can frustrate teams who want action","Risk of over-engineering simple decisions"],es:["Lento cuando la velocidad es esencial","Puede frustrar a equipos que quieren acción","Riesgo de sobrecomplicar decisiones simples"]}},
      Adaptive:{emoji:"🌊",tagline:{en:"The Situational Decider",es:"El Decididor Situacional"},color:"#4A9B7F",summary:{en:"You read the room before choosing how to decide. You adjust your style to the stakes and context.",es:"Lees el ambiente antes de decidir cómo decidir. Ajustas tu estilo según las apuestas y el contexto."},strengths:{en:["Highly versatile across contexts","Trusted across different team cultures","Effective in ambiguous environments"],es:["Muy versátil en diferentes contextos","Confiable en diferentes culturas de equipo","Efectivo en entornos ambiguos"]},blindspots:{en:["Can appear inconsistent","Team may struggle to predict your approach","Risk of over-calibrating to others' preferences"],es:["Puede parecer inconsistente","El equipo puede tener dificultades para predecir tu enfoque","Riesgo de calibrarse demasiado a las preferencias de otros"]}},
    },
    questions:[
      {q:{en:"A critical decision needs to be made today. You…",es:"Hoy hay que tomar una decisión crítica. Tú…"},options:[{text:{en:"Go with your gut — you've seen this before",es:"Confías en tu instinto — ya has visto esto antes"},s:"Instinctive"},{text:{en:"Get your key people in a room before deciding",es:"Reúnes a tus personas clave antes de decidir"},s:"Consensus"},{text:{en:"Request more time to gather the right information",es:"Solicitas más tiempo para reunir la información correcta"},s:"Methodical"},{text:{en:"Assess what this decision actually requires and act accordingly",es:"Evalúas qué requiere realmente esta decisión y actúas en consecuencia"},s:"Adaptive"}]},
      {q:{en:"When you look back at your best decisions, they were…",es:"Cuando miras atrás tus mejores decisiones, fueron…"},options:[{text:{en:"Made quickly and backed by strong instinct",es:"Tomadas rápidamente y respaldadas por un fuerte instinto"},s:"Instinctive"},{text:{en:"Made collaboratively with full team support",es:"Tomadas colaborativamente con pleno apoyo del equipo"},s:"Consensus"},{text:{en:"Made after thorough analysis and preparation",es:"Tomadas después de un análisis y preparación exhaustivos"},s:"Methodical"},{text:{en:"Made differently depending on the situation",es:"Tomadas de manera diferente según la situación"},s:"Adaptive"}]},
      {q:{en:"Your team is split on two options. You…",es:"Tu equipo está dividido entre dos opciones. Tú…"},options:[{text:{en:"Back the option that feels right and commit",es:"Apoyas la opción que se siente correcta y te comprometes"},s:"Instinctive"},{text:{en:"Keep talking until you reach genuine agreement",es:"Sigues hablando hasta llegar a un acuerdo genuino"},s:"Consensus"},{text:{en:"Build a framework to evaluate both options objectively",es:"Construyes un marco para evaluar ambas opciones objetivamente"},s:"Methodical"},{text:{en:"Assess whether this needs a group call or an executive one",es:"Evalúas si esto necesita una decisión grupal o ejecutiva"},s:"Adaptive"}]},
      {q:{en:"You made a decision that turned out to be wrong. You…",es:"Tomaste una decisión que resultó incorrecta. Tú…"},options:[{text:{en:"Own it, pivot fast, and trust your next call",es:"Lo asumes, pivotas rápido y confías en tu próxima decisión"},s:"Instinctive"},{text:{en:"Review whether the team process broke down",es:"Revisas si el proceso del equipo falló"},s:"Consensus"},{text:{en:"Audit where your analysis went wrong",es:"Auditas dónde falló tu análisis"},s:"Methodical"},{text:{en:"Reflect on whether you used the right decision approach",es:"Reflexionas si usaste el enfoque de decisión correcto"},s:"Adaptive"}]},
      {q:{en:"Under extreme time pressure, you are most likely to…",es:"Bajo extrema presión de tiempo, es más probable que…"},options:[{text:{en:"Act on instinct — it's faster and usually right",es:"Actúes por instinto — es más rápido y generalmente correcto"},s:"Instinctive"},{text:{en:"Make a quick call to your two most trusted people",es:"Hagas una llamada rápida a tus dos personas más confiables"},s:"Consensus"},{text:{en:"Apply a rapid version of your usual structured process",es:"Apliques una versión rápida de tu proceso estructurado habitual"},s:"Methodical"},{text:{en:"Read what the moment needs and act on that",es:"Leas lo que el momento necesita y actúes en consecuencia"},s:"Adaptive"}]},
      {q:{en:"What makes a decision 'good' to you?",es:"¿Qué hace que una decisión sea 'buena' para ti?"},options:[{text:{en:"It moved things forward at the right moment",es:"Hizo avanzar las cosas en el momento correcto"},s:"Instinctive"},{text:{en:"Everyone understood and supported it",es:"Todos la entendieron y apoyaron"},s:"Consensus"},{text:{en:"It was made with the right information and logic",es:"Se tomó con la información y lógica correctas"},s:"Methodical"},{text:{en:"It was right for that specific context",es:"Fue correcta para ese contexto específico"},s:"Adaptive"}]},
      {q:{en:"How do you feel about uncertainty when deciding?",es:"¿Cómo te sientes con la incertidumbre al decidir?"},options:[{text:{en:"Comfortable — certainty is a luxury you rarely have",es:"Cómodo — la certeza es un lujo que raramente tienes"},s:"Instinctive"},{text:{en:"Better when you've heard other perspectives",es:"Mejor cuando has escuchado otras perspectivas"},s:"Consensus"},{text:{en:"Uncomfortable — you reduce it before acting",es:"Incómodo — la reduces antes de actuar"},s:"Methodical"},{text:{en:"It depends on the stakes and the timeline",es:"Depende de las apuestas y el plazo"},s:"Adaptive"}]},
      {q:{en:"Your default when facing a high-stakes decision is to…",es:"Tu comportamiento predeterminado ante una decisión de alto riesgo es…"},options:[{text:{en:"Decide and defend — hesitation costs more than mistakes",es:"Decidir y defender — la hesitación cuesta más que los errores"},s:"Instinctive"},{text:{en:"Build consensus — a shared decision is a stronger one",es:"Construir consenso — una decisión compartida es más fuerte"},s:"Consensus"},{text:{en:"Analyse thoroughly — the work up front saves pain later",es:"Analizar a fondo — el trabajo previo ahorra dolor después"},s:"Methodical"},{text:{en:"Choose the approach that fits the problem in front of you",es:"Elegir el enfoque que se adapte al problema frente a ti"},s:"Adaptive"}]},
    ],
  },
  {
    id:"motivation",
    title:{en:"What Motivates You at Work",es:"Qué Te Motiva en el Trabajo"},
    subtitle:{en:"Uncover your core professional driver",es:"Descubre tu motor profesional principal"},
    emoji:"🔋",duration:"3 min",
    styles:{
      Autonomy:{emoji:"🦅",tagline:{en:"The Independent Driver",es:"El Conductor Independiente"},color:"#4A7FA5",summary:{en:"You are energised by ownership and freedom. Micromanagement drains you — trust fuels you.",es:"Te energiza la propiedad y la libertad. La microgestión te agota — la confianza te impulsa."},strengths:{en:["High self-direction and initiative","Thrives in ambiguous, unstructured roles","Produces excellent solo output"],es:["Alta autodirección e iniciativa","Prospera en roles ambiguos y no estructurados","Produce excelente trabajo individual"]},blindspots:{en:["Can struggle in heavily collaborative environments","May resist direction even when it's helpful","Risk of isolation from team dynamics"],es:["Puede tener dificultades en entornos muy colaborativos","Puede resistir la dirección incluso cuando es útil","Riesgo de aislamiento de la dinámica del equipo"]}},
      Mastery:{emoji:"🏆",tagline:{en:"The Excellence Seeker",es:"El Buscador de Excelencia"},color:"#7B6FA5",summary:{en:"You are driven to be exceptional. The pursuit of craft, skill, and depth is what gets you out of bed.",es:"Estás impulsado a ser excepcional. La búsqueda del oficio, la habilidad y la profundidad es lo que te levanta de la cama."},strengths:{en:["Consistently high standards","Deep expertise and credibility","Drives quality across the team"],es:["Estándares consistentemente altos","Profunda experiencia y credibilidad","Impulsa la calidad en todo el equipo"]},blindspots:{en:["Can become perfectionistic","May struggle to delegate","Risk of disengagement when growth plateaus"],es:["Puede volverse perfeccionista","Puede tener dificultades para delegar","Riesgo de desconexión cuando el crecimiento se estanca"]}},
      Purpose:{emoji:"🌍",tagline:{en:"The Mission Carrier",es:"El Portador de la Misión"},color:"#4A9B7F",summary:{en:"You need your work to matter. When connected to something bigger, you bring extraordinary energy.",es:"Necesitas que tu trabajo importe. Cuando estás conectado a algo más grande, traes energía extraordinaria."},strengths:{en:["Exceptionally resilient under pressure","Inspires others with conviction","Sustains effort through difficulty"],es:["Excepcionalmente resiliente bajo presión","Inspira a otros con convicción","Sostiene el esfuerzo a través de las dificultades"]},blindspots:{en:["Can disengage rapidly when values feel compromised","May struggle in commercial-first cultures","Risk of burnout when carrying too much meaning"],es:["Puede desconectarse rápidamente cuando los valores se sienten comprometidos","Puede tener dificultades en culturas orientadas al comercio","Riesgo de agotamiento cuando carga demasiado significado"]}},
      Recognition:{emoji:"🌟",tagline:{en:"The Impact Seeker",es:"El Buscador de Impacto"},color:"#B8965A",summary:{en:"You are motivated by knowing your work is seen and valued. Visibility and appreciation are your fuel.",es:"Te motiva saber que tu trabajo es visto y valorado. La visibilidad y el aprecio son tu combustible."},strengths:{en:["High energy and enthusiasm","Strong relationship builder","Drives visible outcomes"],es:["Alta energía y entusiasmo","Fuerte constructor de relaciones","Impulsa resultados visibles"]},blindspots:{en:["Can under-invest in behind-the-scenes work","May need external validation more than is healthy","Risk of competing rather than collaborating"],es:["Puede subestimar el trabajo entre bastidores","Puede necesitar validación externa más de lo saludable","Riesgo de competir en lugar de colaborar"]}},
    },
    questions:[
      {q:{en:"You feel most energised at work when…",es:"Te sientes más energizado en el trabajo cuando…"},options:[{text:{en:"You have full ownership of a project with no interference",es:"Tienes plena propiedad de un proyecto sin interferencias"},s:"Autonomy"},{text:{en:"You're getting better at something that challenges you",es:"Estás mejorando en algo que te desafía"},s:"Mastery"},{text:{en:"Your work is making a tangible difference",es:"Tu trabajo está haciendo una diferencia tangible"},s:"Purpose"},{text:{en:"Your contribution is acknowledged by people who matter",es:"Tu contribución es reconocida por las personas que importan"},s:"Recognition"}]},
      {q:{en:"What drains you most at work?",es:"¿Qué te agota más en el trabajo?"},options:[{text:{en:"Being micromanaged or second-guessed",es:"Ser microgestado o cuestionado constantemente"},s:"Autonomy"},{text:{en:"Doing shallow, repetitive work with no growth",es:"Hacer trabajo superficial y repetitivo sin crecimiento"},s:"Mastery"},{text:{en:"Working on things that feel meaningless",es:"Trabajar en cosas que se sienten sin sentido"},s:"Purpose"},{text:{en:"Putting in effort that goes completely unnoticed",es:"Poner esfuerzo que pasa completamente desapercibido"},s:"Recognition"}]},
      {q:{en:"When you take on a new role, you most hope for…",es:"Cuando asumes un nuevo rol, lo que más esperas es…"},options:[{text:{en:"The freedom to define how you do your job",es:"La libertad de definir cómo haces tu trabajo"},s:"Autonomy"},{text:{en:"A steep learning curve with real skill development",es:"Una curva de aprendizaje empinada con desarrollo real de habilidades"},s:"Mastery"},{text:{en:"Work that genuinely matters to people or the world",es:"Trabajo que genuinamente importa a las personas o al mundo"},s:"Purpose"},{text:{en:"Visibility and a platform to demonstrate your impact",es:"Visibilidad y una plataforma para demostrar tu impacto"},s:"Recognition"}]},
      {q:{en:"You've gone above and beyond on a project. What matters most?",es:"Has ido más allá en un proyecto. ¿Qué importa más?"},options:[{text:{en:"Knowing you did it your way and it worked",es:"Saber que lo hiciste a tu manera y funcionó"},s:"Autonomy"},{text:{en:"That you pushed your skills to a new level",es:"Que llevaste tus habilidades a un nuevo nivel"},s:"Mastery"},{text:{en:"That it made a real difference to the people it served",es:"Que marcó una diferencia real para las personas a las que sirvió"},s:"Purpose"},{text:{en:"That the right people know what you delivered",es:"Que las personas correctas saben lo que entregaste"},s:"Recognition"}]},
      {q:{en:"You're considering leaving a job. The main reason would be…",es:"Estás considerando dejar un trabajo. La razón principal sería…"},options:[{text:{en:"Too much oversight and not enough trust",es:"Demasiada supervisión y no suficiente confianza"},s:"Autonomy"},{text:{en:"You've stopped growing and feel stagnant",es:"Has dejado de crecer y te sientes estancado"},s:"Mastery"},{text:{en:"The mission no longer resonates with your values",es:"La misión ya no resuena con tus valores"},s:"Purpose"},{text:{en:"Your contributions feel invisible and unvalued",es:"Tus contribuciones se sienten invisibles y no valoradas"},s:"Recognition"}]},
      {q:{en:"When you're at your best professionally, you feel…",es:"Cuando estás en tu mejor momento profesionalmente, te sientes…"},options:[{text:{en:"In control of your direction and trusted to deliver",es:"En control de tu dirección y con confianza para entregar"},s:"Autonomy"},{text:{en:"In flow — improving in real time",es:"En flujo — mejorando en tiempo real"},s:"Mastery"},{text:{en:"Connected to something that genuinely matters",es:"Conectado a algo que genuinamente importa"},s:"Purpose"},{text:{en:"Seen, appreciated, and part of something visible",es:"Visto, apreciado y parte de algo visible"},s:"Recognition"}]},
      {q:{en:"The best manager you ever had…",es:"El mejor gerente que hayas tenido…"},options:[{text:{en:"Set the goal and got out of your way",es:"Estableció el objetivo y se apartó de tu camino"},s:"Autonomy"},{text:{en:"Invested in your development and pushed you to grow",es:"Invirtió en tu desarrollo y te impulsó a crecer"},s:"Mastery"},{text:{en:"Connected your work to a bigger mission",es:"Conectó tu trabajo a una misión más grande"},s:"Purpose"},{text:{en:"Consistently recognised and celebrated your contributions",es:"Reconoció y celebró consistentemente tus contribuciones"},s:"Recognition"}]},
      {q:{en:"What does 'career success' mean to you?",es:"¿Qué significa el 'éxito profesional' para ti?"},options:[{text:{en:"Building something on your own terms",es:"Construir algo en tus propios términos"},s:"Autonomy"},{text:{en:"Being genuinely excellent at what you do",es:"Ser genuinamente excelente en lo que haces"},s:"Mastery"},{text:{en:"Leaving something better than you found it",es:"Dejar algo mejor de lo que encontraste"},s:"Purpose"},{text:{en:"Being respected and known for your impact",es:"Ser respetado y conocido por tu impacto"},s:"Recognition"}]},
    ],
  },
  {
    id:"stress",
    title:{en:"Workplace Stress Response",es:"Respuesta al Estrés Laboral"},
    subtitle:{en:"How you react under pressure",es:"Cómo reaccionas bajo presión"},
    emoji:"🌡️",duration:"3 min",
    styles:{
      Fighter:{emoji:"🔥",tagline:{en:"The Pressure Activator",es:"El Activador de Presión"},color:"#C0622F",summary:{en:"Stress activates you. When pressure builds, you push harder and move faster. You perform under fire.",es:"El estrés te activa. Cuando la presión aumenta, empujas más fuerte y te mueves más rápido. Rindes bajo presión."},strengths:{en:["High output under pressure","Natural crisis leader","Drives urgency in the team"],es:["Alto rendimiento bajo presión","Líder natural en crisis","Impulsa la urgencia en el equipo"]},blindspots:{en:["Can be perceived as aggressive","Team may disengage under your pressure","Risk of burning bridges in the heat of the moment"],es:["Puede percibirse como agresivo","El equipo puede desconectarse bajo tu presión","Riesgo de quemar puentes en el calor del momento"]}},
      Fixer:{emoji:"🔧",tagline:{en:"The Problem Eliminator",es:"El Eliminador de Problemas"},color:"#4A7FA5",summary:{en:"When stress arrives, you go into action mode. You identify what's broken and fix it.",es:"Cuando llega el estrés, entras en modo acción. Identificas qué está roto y lo arreglas."},strengths:{en:["Fast and resourceful under pressure","Gives the team direction","Productive stress response"],es:["Rápido y recursivo bajo presión","Da dirección al equipo","Respuesta productiva al estrés"]},blindspots:{en:["May fix symptoms rather than causes","Can exhaust yourself solving everyone else's problems","Risk of skipping the emotional dimension"],es:["Puede arreglar síntomas en lugar de causas","Puede agotarse resolviendo los problemas de todos","Riesgo de saltarse la dimensión emocional"]}},
      Freezer:{emoji:"❄️",tagline:{en:"The Thoughtful Pauser",es:"El Pausador Reflexivo"},color:"#7B6FA5",summary:{en:"Under stress, you go quiet. You need to process before responding — your best thinking happens after.",es:"Bajo estrés, te quedas callado. Necesitas procesar antes de responder — tu mejor pensamiento ocurre después."},strengths:{en:["Avoids reactive, costly decisions","Calm presence in chaotic moments","Deeply considered responses"],es:["Evita decisiones reactivas y costosas","Presencia tranquila en momentos caóticos","Respuestas profundamente consideradas"]},blindspots:{en:["Can appear disengaged or passive","Team may need direction you're not yet giving","Risk of missing the window to act"],es:["Puede parecer desconectado o pasivo","El equipo puede necesitar dirección que aún no estás dando","Riesgo de perder la ventana para actuar"]}},
      Connector:{emoji:"🤝",tagline:{en:"The Support Seeker",es:"El Buscador de Apoyo"},color:"#4A9B7F",summary:{en:"When stress builds, you reach for your people. You process out loud and co-regulate with others.",es:"Cuando el estrés aumenta, buscas a tu gente. Procesas en voz alta y te co-regulas con otros."},strengths:{en:["Builds team cohesion under pressure","Emotionally intelligent in crises","Prevents siloed stress responses"],es:["Construye cohesión del equipo bajo presión","Emocionalmente inteligente en crisis","Previene respuestas de estrés aisladas"]},blindspots:{en:["May over-share stress and amplify team anxiety","Can struggle to act without social validation","Risk of becoming dependent on others to self-regulate"],es:["Puede compartir demasiado el estrés y amplificar la ansiedad del equipo","Puede tener dificultades para actuar sin validación social","Riesgo de depender de otros para autorregularse"]}},
    },
    questions:[
      {q:{en:"When a crisis hits at work, your first instinct is to…",es:"Cuando llega una crisis al trabajo, tu primer instinto es…"},options:[{text:{en:"Take charge — you'll figure it out as you go",es:"Tomar el control — lo resolverás sobre la marcha"},s:"Fighter"},{text:{en:"Identify what's broken and start fixing it",es:"Identificar qué está roto y empezar a arreglarlo"},s:"Fixer"},{text:{en:"Take a breath and assess before doing anything",es:"Respirar y evaluar antes de hacer cualquier cosa"},s:"Freezer"},{text:{en:"Call someone you trust to think it through",es:"Llamar a alguien de confianza para pensarlo juntos"},s:"Connector"}]},
      {q:{en:"Under high pressure, your team would describe you as…",es:"Bajo alta presión, tu equipo te describiría como…"},options:[{text:{en:"Intense, urgent, and driving hard",es:"Intenso, urgente y empujando fuerte"},s:"Fighter"},{text:{en:"Practical, resourceful, and action-oriented",es:"Práctico, recursivo y orientado a la acción"},s:"Fixer"},{text:{en:"Quiet, measured, and hard to read",es:"Callado, mesurado y difícil de leer"},s:"Freezer"},{text:{en:"Supportive, communicative, and bringing people together",es:"Solidario, comunicativo y uniendo a las personas"},s:"Connector"}]},
      {q:{en:"When you're overwhelmed, the behaviour you most regret is…",es:"Cuando estás abrumado, el comportamiento que más lamentas es…"},options:[{text:{en:"Snapping at people or speaking too bluntly",es:"Responder bruscamente o hablar demasiado directamente"},s:"Fighter"},{text:{en:"Taking on too much and not asking for help",es:"Asumir demasiado y no pedir ayuda"},s:"Fixer"},{text:{en:"Going silent when people need direction from you",es:"Quedarte en silencio cuando las personas necesitan dirección tuya"},s:"Freezer"},{text:{en:"Leaning on others too much and spreading your anxiety",es:"Apoyarte demasiado en otros y difundir tu ansiedad"},s:"Connector"}]},
      {q:{en:"The best way to support you under stress is to…",es:"La mejor manera de apoyarte bajo estrés es…"},options:[{text:{en:"Give you space to lead your way through it",es:"Darte espacio para liderar a tu manera"},s:"Fighter"},{text:{en:"Give you a clear problem to solve",es:"Darte un problema claro que resolver"},s:"Fixer"},{text:{en:"Give you time to think before expecting a response",es:"Darte tiempo para pensar antes de esperar una respuesta"},s:"Freezer"},{text:{en:"Check in, listen, and work through it together",es:"Verificar, escuchar y trabajarlo juntos"},s:"Connector"}]},
      {q:{en:"After a stressful period at work, you recover by…",es:"Después de un período estresante en el trabajo, te recuperas…"},options:[{text:{en:"Getting straight back into action — rest feels like losing",es:"Volviendo directamente a la acción — el descanso se siente como perder"},s:"Fighter"},{text:{en:"Ticking off your to-do list and clearing the backlog",es:"Tachando tu lista de tareas y limpiando el trabajo pendiente"},s:"Fixer"},{text:{en:"Withdrawing and having quiet, undemanding time",es:"Retirándote y teniendo tiempo tranquilo y sin exigencias"},s:"Freezer"},{text:{en:"Talking it through with people you trust",es:"Hablándolo con personas de confianza"},s:"Connector"}]},
      {q:{en:"When stress is building before a big deadline, you…",es:"Cuando el estrés aumenta antes de un plazo importante, tú…"},options:[{text:{en:"Push harder and set a relentless pace",es:"Empujas más fuerte y estableces un ritmo implacable"},s:"Fighter"},{text:{en:"Break down every task and work the list",es:"Desglosás cada tarea y trabajas la lista"},s:"Fixer"},{text:{en:"Slow down internally even if you keep moving externally",es:"Te desacelerás internamente aunque sigas moviéndote externamente"},s:"Freezer"},{text:{en:"Rally the team for a collective push",es:"Convocas al equipo para un empuje colectivo"},s:"Connector"}]},
      {q:{en:"Your stress usually comes from…",es:"Tu estrés generalmente proviene de…"},options:[{text:{en:"Losing control or being blocked from acting",es:"Perder el control o ser bloqueado para actuar"},s:"Fighter"},{text:{en:"Problems that don't have clear solutions",es:"Problemas que no tienen soluciones claras"},s:"Fixer"},{text:{en:"Too many demands with no space to think",es:"Demasiadas demandas sin espacio para pensar"},s:"Freezer"},{text:{en:"Feeling isolated or disconnected from your team",es:"Sentirte aislado o desconectado de tu equipo"},s:"Connector"}]},
      {q:{en:"At your best under pressure, you are…",es:"En tu mejor momento bajo presión, eres…"},options:[{text:{en:"Unstoppable — pressure is your superpower",es:"Imparable — la presión es tu superpoder"},s:"Fighter"},{text:{en:"Resourceful — you always find a way",es:"Recursivo — siempre encuentras una manera"},s:"Fixer"},{text:{en:"Measured — you make the clearest calls in the room",es:"Mesurado — tomas las decisiones más claras en la sala"},s:"Freezer"},{text:{en:"Galvanising — you bring the team together when it counts",es:"Galvanizador — unes al equipo cuando más importa"},s:"Connector"}]},
    ],
  },
];

function t(obj, lang) { return typeof obj === "string" ? obj : (obj[lang] || obj.en); }
function tally(arr) { const r={}; arr.forEach(a=>{r[a]=(r[a]||0)+1;}); return r; }
function topStyle(s) { return Object.entries(s).sort((a,b)=>b[1]-a[1])[0][0]; }

function Logo({ size=1 }) {
  return (
    <div style={{textAlign:"center",userSelect:"none"}}>
      <div style={{fontSize:22*size,fontWeight:300,letterSpacing:8*size,color:B.white,fontFamily:"Georgia,serif",lineHeight:1.1}}>LEANGLE</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8*size,marginTop:2*size}}>
        <div style={{height:1,width:28*size,background:B.gold}}/>
        <div style={{fontSize:10*size,letterSpacing:5*size,color:B.silver,fontFamily:"system-ui"}}>HR LAB</div>
        <div style={{height:1,width:28*size,background:B.gold}}/>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{display:"flex",gap:6,justifyContent:"center",padding:"8px 0"}}>
      {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:B.gold,animation:"bounce 1.2s infinite",animationDelay:`${i*0.2}s`}}/>)}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}

function ScoreBar({label,value,max,color}) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:13,color:B.silver}}>{label}</span>
        <span style={{fontSize:13,color:B.muted}}>{value}/{max}</span>
      </div>
      <div style={{height:6,borderRadius:99,background:B.border}}>
        <div style={{height:"100%",borderRadius:99,background:color,width:`${(value/max)*100}%`,transition:"width 1s ease"}}/>
      </div>
    </div>
  );
}

function LangToggle({lang, setLang}) {
  return (
    <button onClick={()=>setLang(lang==="en"?"es":"en")} style={{
      background:"none",border:`1px solid ${B.border}`,borderRadius:99,
      padding:"4px 12px",color:B.silver,fontSize:12,cursor:"pointer",
      fontFamily:"system-ui",display:"flex",alignItems:"center",gap:6,
      transition:"all 0.2s",
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=B.gold;e.currentTarget.style.color=B.gold;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.color=B.silver;}}
    >
      {lang==="en" ? "🇪🇸 ES" : "🇬🇧 EN"}
    </button>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("home");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});
  const [primary, setPrimary] = useState(null);
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);

  const tx = T[lang];

  useEffect(() => {
    const hash = window.location.hash.replace("#","");
    if (hash) { const q=QUIZZES.find(x=>x.id===hash); if(q) startQuiz(q); }
  }, []);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz); setQIndex(0); setAnswers([]); setSelected(null);
    setScores({}); setPrimary(null); setScreen("quiz");
    window.location.hash = quiz.id;
  };

  const handleNext = () => {
    if (!selected) return;
    const na = [...answers, selected];
    setAnswers(na); setSelected(null);
    if (qIndex+1 < activeQuiz.questions.length) { setQIndex(qIndex+1); }
    else {
      const fs=tally(na); const p=topStyle(fs);
      setScores(fs); setPrimary(p);
      setScreen("analyzing");
      setTimeout(()=>setScreen("results"),2600);
    }
  };

  const handlePay = async () => {
    if (!email) return;
    setPaying(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          email, quizId:activeQuiz.id,
          quizTitle: t(activeQuiz.title, lang),
          primaryStyle: primary, scores, lang,
        }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      alert(lang==="en" ? "Payment error. Please try again." : "Error de pago. Por favor intenta de nuevo.");
      setPaying(false);
    }
  };

  const goHome = () => { setScreen("home"); window.location.hash=""; };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen==="home") return (
    <div style={{minHeight:"100vh",background:B.navyD,fontFamily:"Georgia,serif"}}>
      <div style={{borderBottom:`1px solid ${B.border}`,padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{width:60}}/>
        <Logo size={1.1}/>
        <LangToggle lang={lang} setLang={setLang}/>
      </div>
      <div style={{padding:"48px 24px 32px",textAlign:"center",maxWidth:620,margin:"0 auto"}}>
        <div style={{display:"inline-block",background:`${B.gold}22`,border:`1px solid ${B.gold}55`,borderRadius:99,padding:"6px 18px",marginBottom:20}}>
          <span style={{fontSize:11,color:B.gold,letterSpacing:3,fontFamily:"system-ui",fontWeight:600}}>{tx.tagline}</span>
        </div>
        <h1 style={{color:B.white,fontSize:30,fontWeight:400,lineHeight:1.3,marginBottom:14,letterSpacing:0.5}}>{tx.hero}</h1>
        <p style={{color:B.silver,fontSize:15,lineHeight:1.7,fontFamily:"system-ui"}}>{tx.heroSub}</p>
      </div>
      <div style={{maxWidth:700,margin:"0 auto",padding:"0 16px 60px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
        {QUIZZES.map(quiz=>(
          <div key={quiz.id} onClick={()=>startQuiz(quiz)} style={{background:B.navyL,border:`1px solid ${B.border}`,borderRadius:14,padding:"22px",cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=B.gold;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{position:"absolute",top:0,right:0,width:50,height:50,background:`${B.gold}10`,borderRadius:"0 0 0 50px"}}/>
            <div style={{fontSize:28,marginBottom:12}}>{quiz.emoji}</div>
            <h3 style={{color:B.white,fontSize:15,fontWeight:400,marginBottom:5,lineHeight:1.3,letterSpacing:0.3}}>{t(quiz.title,lang)}</h3>
            <p style={{color:B.muted,fontSize:12,fontFamily:"system-ui",lineHeight:1.5,marginBottom:14}}>{t(quiz.subtitle,lang)}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:B.gold,fontFamily:"system-ui"}}>⏱ {quiz.duration} · {quiz.questions.length} {tx.questions}</span>
              <span style={{fontSize:12,color:B.gold,fontFamily:"system-ui",fontWeight:600}}>{lang==="en"?"Start →":"Comenzar →"}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${B.border}`,padding:"20px",textAlign:"center"}}>
        <Logo size={0.65}/>
        <p style={{color:B.muted,fontSize:11,fontFamily:"system-ui",marginTop:10}}>{tx.footer}</p>
      </div>
    </div>
  );

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (screen==="quiz" && activeQuiz) {
    const q = activeQuiz.questions[qIndex];
    const progress = (qIndex/activeQuiz.questions.length)*100;
    return (
      <div style={{minHeight:"100vh",background:B.navyD,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${B.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={goHome} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:13}}>{tx.allQuizzes}</button>
          <Logo size={0.6}/>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:12,color:B.muted}}>{qIndex+1}/{activeQuiz.questions.length}</span>
            <LangToggle lang={lang} setLang={setLang}/>
          </div>
        </div>
        <div style={{height:3,background:B.border}}>
          <div style={{height:"100%",background:B.gold,width:`${progress}%`,transition:"width 0.4s ease"}}/>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
          <div style={{maxWidth:520,width:"100%"}}>
            <div style={{marginBottom:8}}>
              <span style={{fontSize:11,color:B.gold,letterSpacing:3,textTransform:"uppercase"}}>{activeQuiz.emoji} {t(activeQuiz.title,lang)}</span>
            </div>
            <h2 style={{color:B.white,fontSize:19,fontWeight:400,marginBottom:26,lineHeight:1.5,fontFamily:"Georgia,serif",letterSpacing:0.3}}>{t(q.q,lang)}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {q.options.map((opt,i)=>(
                <button key={i} onClick={()=>setSelected(opt.s)} style={{
                  textAlign:"left",padding:"13px 16px",borderRadius:9,cursor:"pointer",fontSize:14,lineHeight:1.5,fontFamily:"system-ui",
                  border:selected===opt.s?`2px solid ${B.gold}`:`2px solid ${B.border}`,
                  background:selected===opt.s?`${B.gold}18`:B.navyL,
                  color:selected===opt.s?B.white:B.silver,transition:"all 0.15s",
                }}>{t(opt.text,lang)}</button>
              ))}
            </div>
            <button onClick={handleNext} disabled={!selected} style={{
              marginTop:18,width:"100%",padding:"13px",borderRadius:9,border:"none",fontSize:15,fontWeight:600,
              cursor:selected?"pointer":"not-allowed",background:selected?B.gold:B.border,
              color:selected?B.navyD:B.muted,transition:"all 0.2s",fontFamily:"system-ui",
            }}>
              {qIndex+1===activeQuiz.questions.length ? tx.seeResults : tx.next}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ANALYZING ─────────────────────────────────────────────────────────────
  if (screen==="analyzing") return (
    <div style={{minHeight:"100vh",background:B.navyD,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <Logo size={0.8}/>
        <div style={{marginTop:36,fontSize:36}}>🔍</div>
        <h2 style={{color:B.white,fontSize:18,fontWeight:400,margin:"14px 0 6px",fontFamily:"Georgia,serif"}}>{tx.analyzing}</h2>
        <p style={{color:B.muted,fontSize:13,fontFamily:"system-ui"}}>{tx.analyzingSub}</p>
        <div style={{marginTop:20}}><LoadingDots/></div>
      </div>
    </div>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen==="results" && activeQuiz && primary) {
    const sd = activeQuiz.styles[primary];
    const maxQ = activeQuiz.questions.length;
    return (
      <div style={{minHeight:"100vh",background:B.navyD,fontFamily:"system-ui",overflowY:"auto"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${B.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={goHome} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:13}}>{tx.allQuizzes}</button>
          <Logo size={0.6}/>
          <LangToggle lang={lang} setLang={setLang}/>
        </div>
        <div style={{maxWidth:540,margin:"0 auto",padding:"20px 16px 60px"}}>
          <div style={{background:B.navyL,border:`1px solid ${B.gold}55`,borderRadius:18,padding:"28px 22px",marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:8}}>{sd.emoji}</div>
            <div style={{fontSize:10,color:B.gold,letterSpacing:3,textTransform:"uppercase",marginBottom:6,fontFamily:"system-ui"}}>{tx.primaryStyle}</div>
            <h1 style={{color:B.white,fontSize:24,fontWeight:400,fontFamily:"Georgia,serif",marginBottom:4,letterSpacing:0.5}}>{primary}</h1>
            <div style={{color:B.silver,fontSize:13,fontStyle:"italic",marginBottom:14}}>"{t(sd.tagline,lang)}"</div>
            <p style={{color:B.silver,fontSize:14,lineHeight:1.7}}>{t(sd.summary,lang)}</p>
          </div>
          <div style={{background:B.navyL,border:`1px solid ${B.border}`,borderRadius:14,padding:"18px 22px",marginBottom:14}}>
            <h3 style={{color:B.white,fontSize:12,fontWeight:600,marginBottom:14,letterSpacing:1.5,textTransform:"uppercase"}}>{tx.breakdown}</h3>
            {Object.entries(activeQuiz.styles).map(([name,s])=>(
              <ScoreBar key={name} label={`${s.emoji} ${name}`} value={scores[name]||0} max={maxQ} color={s.color}/>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div style={{background:B.navyL,border:`1px solid ${B.border}`,borderRadius:12,padding:16}}>
              <div style={{fontSize:11,fontWeight:700,color:B.success,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{tx.strengths}</div>
              {t(sd.strengths,lang).map((s,i)=><p key={i} style={{fontSize:12,color:B.silver,marginBottom:5,lineHeight:1.5}}>· {s}</p>)}
            </div>
            <div style={{background:B.navyL,border:`1px solid ${B.border}`,borderRadius:12,padding:16}}>
              <div style={{fontSize:11,fontWeight:700,color:B.goldL,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{tx.watchouts}</div>
              {t(sd.blindspots,lang).map((b,i)=><p key={i} style={{fontSize:12,color:B.silver,marginBottom:5,lineHeight:1.5}}>· {b}</p>)}
            </div>
          </div>
          <div style={{background:`linear-gradient(135deg,${B.navyL},#1A2535)`,border:`1px solid ${B.gold}55`,borderRadius:18,padding:"24px 22px",textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:8}}>🔓</div>
            <h3 style={{color:B.white,fontSize:17,fontWeight:400,fontFamily:"Georgia,serif",marginBottom:8,letterSpacing:0.3}}>{tx.unlockTitle}</h3>
            <p style={{color:B.silver,fontSize:13,lineHeight:1.7,marginBottom:16}}>{tx.unlockSub}</p>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:18,textAlign:"left"}}>
              {tx.unlockFeatures.map(f=><div key={f} style={{color:B.silver,fontSize:13}}>✓ {f}</div>)}
            </div>
            <button onClick={()=>setScreen("paywall")} style={{width:"100%",padding:"14px",borderRadius:9,border:"none",background:B.gold,color:B.navyD,fontSize:15,fontWeight:700,cursor:"pointer",letterSpacing:0.5,fontFamily:"system-ui"}}>
              {tx.unlockBtn}
            </button>
            <p style={{color:B.muted,fontSize:11,marginTop:8,fontFamily:"system-ui"}}>{tx.unlockNote}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── PAYWALL — email only, Stripe handles payment ──────────────────────────
  if (screen==="paywall") return (
    <div style={{minHeight:"100vh",background:B.navyD,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui",overflowY:"auto"}}>
      <div style={{maxWidth:420,width:"100%",background:B.navyL,border:`1px solid ${B.border}`,borderRadius:20,padding:"32px 26px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Logo size={0.8}/>
          <div style={{marginTop:20,fontSize:32}}>📋</div>
          <h2 style={{color:B.white,fontSize:18,fontWeight:400,fontFamily:"Georgia,serif",marginTop:8,marginBottom:4}}>{tx.payTitle}</h2>
          <p style={{color:B.muted,fontSize:13}}>{tx.paySub}</p>
        </div>
        <div style={{background:B.navyD,borderRadius:9,padding:"11px 14px",marginBottom:18,display:"flex",justifyContent:"space-between"}}>
          <span style={{color:B.silver,fontSize:14}}>{t(activeQuiz?.title,lang)}</span>
          <span style={{color:B.gold,fontSize:15,fontWeight:700}}>$29</span>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,color:B.silver,marginBottom:6,letterSpacing:0.5,textTransform:"uppercase"}}>{tx.emailLabel}</label>
          <input
            type="email" value={email}
            onChange={ev=>setEmail(ev.target.value)}
            placeholder={tx.emailPlaceholder}
            style={{width:"100%",padding:"12px 14px",borderRadius:8,border:`1px solid ${B.border}`,background:B.navyD,color:B.white,fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"system-ui"}}
          />
        </div>
        <p style={{color:B.muted,fontSize:12,marginBottom:16,lineHeight:1.5,textAlign:"center"}}>
          {lang==="en"
            ? "You'll be redirected to Stripe's secure checkout to complete payment."
            : "Serás redirigido al pago seguro de Stripe para completar tu compra."}
        </p>
        <button onClick={handlePay} disabled={paying||!email} style={{
          width:"100%",padding:"14px",borderRadius:9,border:"none",fontSize:15,fontWeight:700,
          cursor:paying||!email?"not-allowed":"pointer",
          background:paying||!email?B.border:B.gold,
          color:paying||!email?B.muted:B.navyD,transition:"all 0.2s",
        }}>
          {paying ? tx.processing : tx.payBtn}
        </button>
        <p style={{textAlign:"center",color:B.muted,fontSize:11,marginTop:10}}>{tx.secure}</p>
        <button onClick={()=>setScreen("results")} style={{display:"block",margin:"10px auto 0",background:"none",border:"none",color:B.muted,fontSize:12,cursor:"pointer"}}>
          {tx.backResults}
        </button>
      </div>
    </div>
  );

  return null;
}
