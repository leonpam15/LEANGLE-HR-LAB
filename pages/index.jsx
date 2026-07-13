import { useState, useEffect } from "react";

// ── BRAND TOKENS ─────────────────────────────────────────────────────────────
const B = {
  navy:    "#1A2535",
  navyD:   "#0F1823",
  navyL:   "#243040",
  gold:    "#B8965A",
  goldL:   "#D4AF7A",
  silver:  "#C8CDD6",
  white:   "#FFFFFF",
  muted:   "#6B7A8D",
  border:  "#2A3A4D",
  success: "#4A9B7F",
};

// ── LOGO SVG ──────────────────────────────────────────────────────────────────
function Logo({ size = 1 }) {
  return (
    <div style={{ textAlign: "center", userSelect: "none" }}>
      <div style={{ fontSize: 22 * size, fontWeight: 300, letterSpacing: 8 * size, color: B.white, fontFamily: "'Georgia', serif", lineHeight: 1.1 }}>
        LEANGLE
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 * size, marginTop: 2 * size }}>
        <div style={{ height: 1, width: 28 * size, background: B.gold }} />
        <div style={{ fontSize: 10 * size, letterSpacing: 5 * size, color: B.silver, fontWeight: 400, fontFamily: "system-ui" }}>HR LAB</div>
        <div style={{ height: 1, width: 28 * size, background: B.gold }} />
      </div>
    </div>
  );
}

// ── QUIZ DATA ─────────────────────────────────────────────────────────────────
const QUIZZES = [
  {
    id: "communication",
    title: "Leadership Communication Style",
    subtitle: "Discover how you lead conversations",
    emoji: "💬",
    duration: "3 min",
    styles: {
      Collaborative: { emoji: "🤝", tagline: "The Bridge Builder", color: "#4A7FA5", summary: "You lead through inclusion. Your instinct is to gather people, create dialogue, and build shared ownership. Teams feel heard around you — which drives genuine buy-in.", strengths: ["Builds trust and psychological safety", "Excellent at cross-functional alignment", "Creates high team engagement"], blindspots: ["Can slow decisions when speed matters", "May avoid necessary confrontation", "Risk of consensus fatigue"] },
      Directive:     { emoji: "🎯", tagline: "The Clear Commander",  color: "#C0622F", summary: "You lead with clarity and pace. When the pressure is on, people look to you because you cut through noise and make things happen.", strengths: ["Decisive in high-stakes moments", "Clear accountability structures", "Keeps teams focused"], blindspots: ["Can feel top-down to creative thinkers", "May under-invest in emotional context", "Risk of disengagement"] },
      Empathetic:    { emoji: "💚", tagline: "The Human-First Leader", color: "#4A9B7F", summary: "You lead with deep awareness of the people around you. You notice what's unsaid, respond to emotion before logic, and build loyalty through genuine care.", strengths: ["Exceptional at retaining talent", "Creates safety for hard conversations", "Strong at individual development"], blindspots: ["May prioritise harmony over hard truths", "Can personalise feedback too much", "Risk of perceived indecisiveness"] },
      Analytical:    { emoji: "📊", tagline: "The Evidence-Led Leader", color: "#7B6FA5", summary: "You lead with rigour. Your communication is grounded in data, preparation and logic. People trust what you say because you've done the work.", strengths: ["Highly credible under scrutiny", "Excellent at strategic communication", "Reduces ambiguity"], blindspots: ["Can feel distant or over-complicated", "May under-weight emotional signals", "Risk of analysis paralysis"] },
    },
    questions: [
      { q: "When your team misses a deadline, your first move is to…", options: [{ text: "Call a meeting to understand what went wrong", s: "Collaborative" }, { text: "Send a clear message outlining consequences and next steps", s: "Directive" }, { text: "Check in with each person individually", s: "Empathetic" }, { text: "Analyse the data and identify the root cause", s: "Analytical" }] },
      { q: "Your team is divided on a big decision. You…", options: [{ text: "Facilitate discussion until consensus forms", s: "Collaborative" }, { text: "Make the call yourself — someone has to lead", s: "Directive" }, { text: "Focus on how each person feels about the options", s: "Empathetic" }, { text: "Present pros, cons and data, then decide", s: "Analytical" }] },
      { q: "How do you typically open a team meeting?", options: [{ text: "Ask everyone to share one update or win", s: "Collaborative" }, { text: "Jump straight into the agenda — time is precious", s: "Directive" }, { text: "Check in on how people are feeling this week", s: "Empathetic" }, { text: "Review metrics and progress since last time", s: "Analytical" }] },
      { q: "A high performer tells you they're burned out. You…", options: [{ text: "Involve the team in redistributing workload", s: "Collaborative" }, { text: "Reassign tasks immediately and set a recovery plan", s: "Directive" }, { text: "Sit with them, listen deeply, and ask what they need", s: "Empathetic" }, { text: "Review their workload data and identify patterns", s: "Analytical" }] },
      { q: "When giving feedback, you tend to…", options: [{ text: "Co-create improvement ideas with the person", s: "Collaborative" }, { text: "Be direct and specific about what needs to change", s: "Directive" }, { text: "Sandwich criticism with strong emotional support", s: "Empathetic" }, { text: "Use examples and metrics to back up every point", s: "Analytical" }] },
      { q: "Your writing style (emails, Slack) is…", options: [{ text: "Conversational — you invite replies and input", s: "Collaborative" }, { text: "Concise — bullet points, action items, clear owner", s: "Directive" }, { text: "Warm — you acknowledge effort and check in personally", s: "Empathetic" }, { text: "Detailed — context, rationale and references included", s: "Analytical" }] },
      { q: "When a new initiative is announced from above, you…", options: [{ text: "Bring your team together to discuss how to approach it", s: "Collaborative" }, { text: "Translate it into clear tasks and assign ownership fast", s: "Directive" }, { text: "Think first about how this will affect team morale", s: "Empathetic" }, { text: "Read every document before communicating anything", s: "Analytical" }] },
      { q: "How do you handle conflict between two team members?", options: [{ text: "Bring them together for a facilitated conversation", s: "Collaborative" }, { text: "Set clear expectations and rules of engagement", s: "Directive" }, { text: "Speak to each separately, validating both sides", s: "Empathetic" }, { text: "Diagnose the root cause before involving anyone", s: "Analytical" }] },
      { q: "What does 'great leadership communication' mean to you?", options: [{ text: "Creating space where everyone's voice is heard", s: "Collaborative" }, { text: "Being clear, consistent and decisive under pressure", s: "Directive" }, { text: "Building trust through honesty and genuine care", s: "Empathetic" }, { text: "Communicating with evidence so people respect your reasoning", s: "Analytical" }] },
      { q: "When you sense your team is losing motivation, you…", options: [{ text: "Run a team session to reconnect to purpose", s: "Collaborative" }, { text: "Set a short-term challenge with a clear reward", s: "Directive" }, { text: "Have honest one-on-ones to understand what's going on", s: "Empathetic" }, { text: "Look at workload, output trends and flag patterns", s: "Analytical" }] },
    ],
  },
  {
    id: "conflict",
    title: "Conflict Resolution Style",
    subtitle: "How you handle tension and disagreement",
    emoji: "⚡",
    duration: "3 min",
    styles: {
      Mediator:     { emoji: "🕊️", tagline: "The Peacemaker", color: "#4A9B7F", summary: "You instinctively seek common ground. When tension rises, you become the calm in the room — finding the shared interest beneath opposing positions.", strengths: ["Restores team harmony quickly", "Skilled at reframing conflict as shared problems", "Creates lasting agreements"], blindspots: ["May avoid necessary confrontation", "Can be seen as lacking conviction", "Risk of unresolved underlying issues"] },
      Confronter:   { emoji: "🔥", tagline: "The Direct Resolver", color: "#C0622F", summary: "You face conflict head-on. You believe unaddressed tension festers, so you name the issue and move toward resolution with directness and speed.", strengths: ["Prevents issues from dragging on", "Respected for honesty and clarity", "Clears the air effectively"], blindspots: ["Can escalate rather than resolve", "May feel aggressive to sensitive personalities", "Risk of winning the argument, losing the relationship"] },
      Avoider:      { emoji: "🌊", tagline: "The Strategic Pauser", color: "#4A7FA5", summary: "You pick your battles deliberately. You know not every conflict is worth fighting, and you preserve energy for what truly matters to the team.", strengths: ["Prevents unnecessary escalation", "Strong long-term perspective", "Skilled at letting small tensions dissolve naturally"], blindspots: ["Important issues can go unaddressed", "Team may read silence as approval", "Risk of resentment building quietly"] },
      Collaborator: { emoji: "🔧", tagline: "The Problem-Solver", color: "#7B6FA5", summary: "You treat conflict as a design problem. You gather perspectives, find root causes, and engineer solutions that satisfy everyone involved.", strengths: ["Produces durable, creative solutions", "Builds trust through fairness", "Turns conflict into team growth"], blindspots: ["Can over-complicate simple disputes", "Time-intensive process", "May frustrate those wanting a quick decision"] },
    },
    questions: [
      { q: "Two team members clash openly in a meeting. You…", options: [{ text: "Step in and redirect to shared goals", s: "Mediator" }, { text: "Address the tension directly — name what just happened", s: "Confronter" }, { text: "Let it settle and follow up privately later", s: "Avoider" }, { text: "Pause the meeting and set up a proper resolution session", s: "Collaborator" }] },
      { q: "Someone is consistently undermining a colleague. You…", options: [{ text: "Bring both parties together to find common ground", s: "Mediator" }, { text: "Call it out with the person directly and immediately", s: "Confronter" }, { text: "Monitor it closely before acting", s: "Avoider" }, { text: "Investigate the root cause before any conversation", s: "Collaborator" }] },
      { q: "You disagree strongly with a decision from your manager. You…", options: [{ text: "Find a way to raise concerns without creating friction", s: "Mediator" }, { text: "Tell them clearly why you think it's wrong", s: "Confronter" }, { text: "Raise it once, then let it go if they don't change", s: "Avoider" }, { text: "Build a case with data and request a proper discussion", s: "Collaborator" }] },
      { q: "A conflict is affecting team output. Your first priority is…", options: [{ text: "Restore the relationship so work can resume", s: "Mediator" }, { text: "Resolve the conflict quickly, even if it's uncomfortable", s: "Confronter" }, { text: "Minimise disruption while the dust settles", s: "Avoider" }, { text: "Fix the structural issue that caused it", s: "Collaborator" }] },
      { q: "Someone gives you harsh feedback you think is unfair. You…", options: [{ text: "Acknowledge their perspective and look for the grain of truth", s: "Mediator" }, { text: "Respond immediately and defend your position", s: "Confronter" }, { text: "Process it privately before responding", s: "Avoider" }, { text: "Ask for specific examples before forming a response", s: "Collaborator" }] },
      { q: "The conflict has gone on too long. You…", options: [{ text: "Propose a fresh start and ask everyone to move on", s: "Mediator" }, { text: "Force a conclusion — decide who's right and act", s: "Confronter" }, { text: "Give it more time — pressure rarely helps", s: "Avoider" }, { text: "Restructure how the parties interact to remove the friction", s: "Collaborator" }] },
      { q: "What do you believe about workplace conflict?", options: [{ text: "It's mostly avoidable with better communication", s: "Mediator" }, { text: "It's healthy if handled openly and quickly", s: "Confronter" }, { text: "Most conflict resolves itself if given space", s: "Avoider" }, { text: "It's a symptom of a deeper systemic issue", s: "Collaborator" }] },
      { q: "After a resolved conflict, you…", options: [{ text: "Check in with both parties to make sure the air is clear", s: "Mediator" }, { text: "Move on — it's done, no need to revisit", s: "Confronter" }, { text: "Keep a watchful eye from a distance", s: "Avoider" }, { text: "Document what happened and update your team processes", s: "Collaborator" }] },
    ],
  },
  {
    id: "feedback",
    title: "Feedback Style",
    subtitle: "How you give and receive critical input",
    emoji: "🎙️",
    duration: "3 min",
    styles: {
      Coach:      { emoji: "🌱", tagline: "The Growth Guide", color: "#4A9B7F", summary: "You give feedback as an investment. You frame every critique as a development opportunity, and people leave your conversations feeling capable and seen.", strengths: ["Builds lasting performance improvement", "Creates psychological safety", "Strong at developing junior talent"], blindspots: ["May soften feedback until the message is lost", "Can feel slow when urgency is needed", "Risk of over-praising mediocre work"] },
      Challenger: { emoji: "💪", tagline: "The Straight Talker", color: "#C0622F", summary: "You believe in direct, honest feedback delivered without softening. People know exactly where they stand with you, and they respect you for it.", strengths: ["Clear, actionable and memorable", "No guessing required", "Drives rapid improvement in confident people"], blindspots: ["Can damage confidence in sensitive individuals", "May miss emotional context", "Risk of feedback feeling like criticism, not support"] },
      Connector:  { emoji: "🤝", tagline: "The Relationship Feeder", color: "#4A7FA5", summary: "You tailor your feedback entirely to the individual. You read the room, adjust your delivery, and ensure the person feels safe enough to actually hear you.", strengths: ["Highly personalised and trusted", "Excellent retention of top performers", "Creates deep loyalty"], blindspots: ["Consistency can be a challenge across the team", "May avoid hard truths to protect the relationship", "Risk of perceived favouritism"] },
      Analyst:    { emoji: "📐", tagline: "The Evidence Builder", color: "#7B6FA5", summary: "You come to feedback conversations prepared. You bring data, examples, and structured observations — making your input hard to argue with and easy to act on.", strengths: ["Objective and hard to dismiss", "Clear on what 'better' looks like", "Creates measurable improvement plans"], blindspots: ["Can feel clinical or impersonal", "May miss the emotional dimension", "Risk of overwhelming with data instead of inspiring change"] },
    },
    questions: [
      { q: "Before a feedback conversation, you…", options: [{ text: "Think about what will motivate this person to grow", s: "Coach" }, { text: "Plan exactly what you need to say and keep it tight", s: "Challenger" }, { text: "Consider their current state and how to meet them there", s: "Connector" }, { text: "Gather examples, notes and context to back your points", s: "Analyst" }] },
      { q: "You open a feedback conversation by…", options: [{ text: "Asking what they feel went well first", s: "Coach" }, { text: "Going straight to the point", s: "Challenger" }, { text: "Checking in on how they're feeling about their performance", s: "Connector" }, { text: "Setting context with the data you've gathered", s: "Analyst" }] },
      { q: "Someone pushes back on your feedback. You…", options: [{ text: "Explore their perspective — they may have a point", s: "Coach" }, { text: "Hold your position if you believe you're right", s: "Challenger" }, { text: "Back off if it protects the relationship", s: "Connector" }, { text: "Go back to your evidence and walk through it calmly", s: "Analyst" }] },
      { q: "Your feedback lands badly and they shut down. You…", options: [{ text: "Pause, reassure them, and reframe with encouragement", s: "Coach" }, { text: "Give them space — they'll process it in their own time", s: "Challenger" }, { text: "Drop everything and focus on rebuilding the connection", s: "Connector" }, { text: "Ask clarifying questions to understand where it went wrong", s: "Analyst" }] },
      { q: "When receiving feedback yourself, you prefer…", options: [{ text: "A coaching conversation that helps you identify your own gaps", s: "Coach" }, { text: "Blunt, specific, no frills", s: "Challenger" }, { text: "Feedback from someone who knows and trusts you", s: "Connector" }, { text: "Structured input with clear examples and evidence", s: "Analyst" }] },
      { q: "After giving feedback, you…", options: [{ text: "Follow up to see how they're implementing the suggestions", s: "Coach" }, { text: "Let them get on with it — the ball is in their court", s: "Challenger" }, { text: "Check in to make sure the relationship feels intact", s: "Connector" }, { text: "Track whether their performance improves measurably", s: "Analyst" }] },
      { q: "What do you believe makes feedback effective?", options: [{ text: "It helps someone believe in their own potential", s: "Coach" }, { text: "It's honest, even when uncomfortable", s: "Challenger" }, { text: "It's delivered by someone the recipient trusts", s: "Connector" }, { text: "It's specific, evidence-based and actionable", s: "Analyst" }] },
      { q: "When someone on your team is underperforming, you…", options: [{ text: "Invest time in understanding what's blocking them", s: "Coach" }, { text: "Have a frank conversation about the gap immediately", s: "Challenger" }, { text: "Approach carefully to protect their confidence", s: "Connector" }, { text: "Build a performance improvement plan with clear metrics", s: "Analyst" }] },
    ],
  },
  {
    id: "decision",
    title: "Decision-Making Style",
    subtitle: "How you make calls under pressure",
    emoji: "⚖️",
    duration: "3 min",
    styles: {
      Instinctive: { emoji: "⚡", tagline: "The Bold Mover", color: "#C0622F", summary: "You trust your gut. Years of pattern recognition mean your instincts are often right — and your speed to act gives you a decisive edge in fast-moving environments.", strengths: ["Fast and confident under pressure", "Energises teams with decisiveness", "Cuts through over-analysis"], blindspots: ["Can overlook important data", "May move before the team is ready", "Risk of pattern bias in novel situations"] },
      Consensus:   { emoji: "🗳️", tagline: "The People Unifier", color: "#4A7FA5", summary: "You believe the best decisions are made together. You invest in alignment before acting, ensuring your team owns the outcome as much as you do.", strengths: ["High team buy-in", "Surfaces blind spots through diverse input", "Decisions stick because people helped make them"], blindspots: ["Slow in urgent situations", "Can be paralysed by disagreement", "Risk of lowest-common-denominator outcomes"] },
      Methodical:  { emoji: "🔬", tagline: "The Careful Strategist", color: "#7B6FA5", summary: "You take a structured approach to every decision. You define the problem, gather data, evaluate options, and act with confidence — because you've done the work.", strengths: ["Highly defensible decisions", "Excellent in complex, high-stakes situations", "Minimises costly mistakes"], blindspots: ["Slow when speed is essential", "Can frustrate teams who want action", "Risk of over-engineering simple decisions"] },
      Adaptive:    { emoji: "🌊", tagline: "The Situational Decider", color: "#4A9B7F", summary: "You read the room before choosing how to decide. You adjust your style to the stakes, the context and the people involved — which makes you remarkably versatile.", strengths: ["Highly versatile across contexts", "Trusted across different team cultures", "Effective in ambiguous environments"], blindspots: ["Can appear inconsistent", "Team may struggle to predict your approach", "Risk of over-calibrating to others' preferences"] },
    },
    questions: [
      { q: "A critical decision needs to be made today. You…", options: [{ text: "Go with your gut — you've seen this before", s: "Instinctive" }, { text: "Get your key people in a room before deciding", s: "Consensus" }, { text: "Request more time to gather the right information", s: "Methodical" }, { text: "Assess what this decision actually requires and act accordingly", s: "Adaptive" }] },
      { q: "When you look back at your best decisions, they were…", options: [{ text: "Made quickly and backed by strong instinct", s: "Instinctive" }, { text: "Made collaboratively with full team support", s: "Consensus" }, { text: "Made after thorough analysis and preparation", s: "Methodical" }, { text: "Made differently depending on the situation", s: "Adaptive" }] },
      { q: "Your team is split on two options. You…", options: [{ text: "Back the option that feels right and commit", s: "Instinctive" }, { text: "Keep talking until you reach genuine agreement", s: "Consensus" }, { text: "Build a framework to evaluate both options objectively", s: "Methodical" }, { text: "Assess whether this needs a group call or an executive one", s: "Adaptive" }] },
      { q: "You made a decision that turned out to be wrong. You…", options: [{ text: "Own it, pivot fast, and trust your next call", s: "Instinctive" }, { text: "Review whether the team process broke down", s: "Consensus" }, { text: "Audit where your analysis went wrong", s: "Methodical" }, { text: "Reflect on whether you used the right decision approach", s: "Adaptive" }] },
      { q: "Under extreme time pressure, you are most likely to…", options: [{ text: "Act on instinct — it's faster and usually right", s: "Instinctive" }, { text: "Make a quick call to your two most trusted people", s: "Consensus" }, { text: "Apply a rapid version of your usual structured process", s: "Methodical" }, { text: "Read what the moment needs and act on that", s: "Adaptive" }] },
      { q: "What makes a decision 'good' to you?", options: [{ text: "It moved things forward at the right moment", s: "Instinctive" }, { text: "Everyone understood and supported it", s: "Consensus" }, { text: "It was made with the right information and logic", s: "Methodical" }, { text: "It was right for that specific context", s: "Adaptive" }] },
      { q: "How do you feel about uncertainty when deciding?", options: [{ text: "Comfortable — certainty is a luxury you rarely have", s: "Instinctive" }, { text: "Better when you've heard other perspectives", s: "Consensus" }, { text: "Uncomfortable — you reduce it before acting", s: "Methodical" }, { text: "It depends on the stakes and the timeline", s: "Adaptive" }] },
      { q: "Your default when facing a high-stakes decision is to…", options: [{ text: "Decide and defend — hesitation costs more than mistakes", s: "Instinctive" }, { text: "Build consensus — a shared decision is a stronger one", s: "Consensus" }, { text: "Analyse thoroughly — the work up front saves pain later", s: "Methodical" }, { text: "Choose the approach that fits the problem in front of you", s: "Adaptive" }] },
    ],
  },
  {
    id: "motivation",
    title: "What Motivates You at Work",
    subtitle: "Uncover your core professional driver",
    emoji: "🔋",
    duration: "3 min",
    styles: {
      Autonomy:  { emoji: "🦅", tagline: "The Independent Driver", color: "#4A7FA5", summary: "You are energised by ownership and freedom. When you control your work, your output surges. Micromanagement drains you — trust fuels you.", strengths: ["High self-direction and initiative", "Thrives in ambiguous, unstructured roles", "Produces excellent solo output"], blindspots: ["Can struggle in heavily collaborative environments", "May resist direction even when it's helpful", "Risk of isolation from team dynamics"] },
      Mastery:   { emoji: "🏆", tagline: "The Excellence Seeker", color: "#7B6FA5", summary: "You are driven to be exceptional at what you do. The pursuit of craft, skill, and depth is what gets you out of bed. Being average is your biggest fear.", strengths: ["Consistently high standards", "Deep expertise and credibility", "Drives quality across the team"], blindspots: ["Can become perfectionistic", "May struggle to delegate", "Risk of disengagement when growth plateaus"] },
      Purpose:   { emoji: "🌍", tagline: "The Mission Carrier", color: "#4A9B7F", summary: "You need your work to matter. When you're connected to something bigger than a job title, you bring extraordinary energy. When you lose the 'why', you lose momentum fast.", strengths: ["Exceptionally resilient under pressure", "Inspires others with conviction", "Sustains effort through difficulty"], blindspots: ["Can disengage rapidly when values feel compromised", "May struggle in commercial-first cultures", "Risk of burnout when carrying too much meaning"] },
      Recognition: { emoji: "🌟", tagline: "The Impact Seeker", color: "#B8965A", summary: "You are motivated by knowing your work is seen and valued. Visibility, appreciation and acknowledgement aren't vanity — they're your fuel.", strengths: ["High energy and enthusiasm", "Strong relationship builder", "Drives visible outcomes"], blindspots: ["Can under-invest in behind-the-scenes work", "May need external validation more than is healthy", "Risk of competing rather than collaborating"] },
    },
    questions: [
      { q: "You feel most energised at work when…", options: [{ text: "You have full ownership of a project with no interference", s: "Autonomy" }, { text: "You're getting better at something that challenges you", s: "Mastery" }, { text: "Your work is making a tangible difference", s: "Purpose" }, { text: "Your contribution is acknowledged by people who matter", s: "Recognition" }] },
      { q: "What drains you most at work?", options: [{ text: "Being micromanaged or second-guessed", s: "Autonomy" }, { text: "Doing shallow, repetitive work with no growth", s: "Mastery" }, { text: "Working on things that feel meaningless", s: "Purpose" }, { text: "Putting in effort that goes completely unnoticed", s: "Recognition" }] },
      { q: "When you take on a new role, you most hope for…", options: [{ text: "The freedom to define how you do your job", s: "Autonomy" }, { text: "A steep learning curve with real skill development", s: "Mastery" }, { text: "Work that genuinely matters to people or the world", s: "Purpose" }, { text: "Visibility and a platform to demonstrate your impact", s: "Recognition" }] },
      { q: "You've gone above and beyond on a project. What matters most?", options: [{ text: "Knowing you did it your way and it worked", s: "Autonomy" }, { text: "That you pushed your skills to a new level", s: "Mastery" }, { text: "That it made a real difference to the people it served", s: "Purpose" }, { text: "That the right people know what you delivered", s: "Recognition" }] },
      { q: "You're considering leaving a job. The main reason would be…", options: [{ text: "Too much oversight and not enough trust", s: "Autonomy" }, { text: "You've stopped growing and feel stagnant", s: "Mastery" }, { text: "The mission no longer resonates with your values", s: "Purpose" }, { text: "Your contributions feel invisible and unvalued", s: "Recognition" }] },
      { q: "When you're at your best professionally, you feel…", options: [{ text: "In control of your direction and trusted to deliver", s: "Autonomy" }, { text: "In flow — improving in real time", s: "Mastery" }, { text: "Connected to something that genuinely matters", s: "Purpose" }, { text: "Seen, appreciated, and part of something visible", s: "Recognition" }] },
      { q: "The best manager you ever had…", options: [{ text: "Set the goal and got out of your way", s: "Autonomy" }, { text: "Invested in your development and pushed you to grow", s: "Mastery" }, { text: "Connected your work to a bigger mission", s: "Purpose" }, { text: "Consistently recognised and celebrated your contributions", s: "Recognition" }] },
      { q: "What does 'career success' mean to you?", options: [{ text: "Building something on your own terms", s: "Autonomy" }, { text: "Being genuinely excellent at what you do", s: "Mastery" }, { text: "Leaving something better than you found it", s: "Purpose" }, { text: "Being respected and known for your impact", s: "Recognition" }] },
    ],
  },
  {
    id: "stress",
    title: "Workplace Stress Response",
    subtitle: "How you react under pressure",
    emoji: "🌡️",
    duration: "3 min",
    styles: {
      Fighter:   { emoji: "🔥", tagline: "The Pressure Activator", color: "#C0622F", summary: "Stress activates you. When pressure builds, you push harder, speak louder, and move faster. You perform under fire — but your intensity can unsettle others.", strengths: ["High output under pressure", "Natural crisis leader", "Drives urgency in the team"], blindspots: ["Can be perceived as aggressive", "Team may disengage under your pressure", "Risk of burning bridges in the heat of the moment"] },
      Fixer:     { emoji: "🔧", tagline: "The Problem Eliminator", color: "#4A7FA5", summary: "When stress arrives, you go into action mode. You identify what's broken and fix it. You're most comfortable when you can do something — helplessness is your kryptonite.", strengths: ["Fast and resourceful under pressure", "Gives the team direction", "Productive stress response"], blindspots: ["May fix symptoms rather than causes", "Can exhaust yourself solving everyone else's problems", "Risk of skipping the emotional dimension"] },
      Freezer:   { emoji: "❄️", tagline: "The Thoughtful Pauser", color: "#7B6FA5", summary: "Under stress, you go quiet. You need to process before responding — and your best thinking often happens after the pressure has eased. Others may misread your stillness as disengagement.", strengths: ["Avoids reactive, costly decisions", "Calm presence in chaotic moments", "Deeply considered responses"], blindspots: ["Can appear disengaged or passive", "Team may need direction you're not yet giving", "Risk of missing the window to act"] },
      Connector: { emoji: "🤝", tagline: "The Support Seeker", color: "#4A9B7F", summary: "When stress builds, you reach for your people. You process out loud, gather support, and co-regulate with others. Isolation makes stress worse for you — connection is your reset.", strengths: ["Builds team cohesion under pressure", "Emotionally intelligent in crises", "Prevents siloed stress responses"], blindspots: ["May over-share stress and amplify team anxiety", "Can struggle to act without social validation", "Risk of becoming dependent on others to self-regulate"] },
    },
    questions: [
      { q: "When a crisis hits at work, your first instinct is to…", options: [{ text: "Take charge — you'll figure it out as you go", s: "Fighter" }, { text: "Identify what's broken and start fixing it", s: "Fixer" }, { text: "Take a breath and assess before doing anything", s: "Freezer" }, { text: "Call someone you trust to think it through", s: "Connector" }] },
      { q: "Under high pressure, your team would describe you as…", options: [{ text: "Intense, urgent, and driving hard", s: "Fighter" }, { text: "Practical, resourceful, and action-oriented", s: "Fixer" }, { text: "Quiet, measured, and hard to read", s: "Freezer" }, { text: "Supportive, communicative, and bringing people together", s: "Connector" }] },
      { q: "When you're overwhelmed, the behaviour you most regret is…", options: [{ text: "Snapping at people or speaking too bluntly", s: "Fighter" }, { text: "Taking on too much and not asking for help", s: "Fixer" }, { text: "Going silent when people need direction from you", s: "Freezer" }, { text: "Leaning on others too much and spreading your anxiety", s: "Connector" }] },
      { q: "The best way to support you under stress is to…", options: [{ text: "Give you space to lead your way through it", s: "Fighter" }, { text: "Give you a clear problem to solve", s: "Fixer" }, { text: "Give you time to think before expecting a response", s: "Freezer" }, { text: "Check in, listen, and work through it together", s: "Connector" }] },
      { q: "After a stressful period at work, you recover by…", options: [{ text: "Getting straight back into action — rest feels like losing", s: "Fighter" }, { text: "Ticking off your to-do list and clearing the backlog", s: "Fixer" }, { text: "Withdrawing and having quiet, undemanding time", s: "Freezer" }, { text: "Talking it through with people you trust", s: "Connector" }] },
      { q: "When stress is building before a big deadline, you…", options: [{ text: "Push harder and set a relentless pace", s: "Fighter" }, { text: "Break down every task and work the list", s: "Fixer" }, { text: "Slow down internally even if you keep moving externally", s: "Freezer" }, { text: "Rally the team for a collective push", s: "Connector" }] },
      { q: "Your stress usually comes from…", options: [{ text: "Losing control or being blocked from acting", s: "Fighter" }, { text: "Problems that don't have clear solutions", s: "Fixer" }, { text: "Too many demands with no space to think", s: "Freezer" }, { text: "Feeling isolated or disconnected from your team", s: "Connector" }] },
      { q: "At your best under pressure, you are…", options: [{ text: "Unstoppable — pressure is your superpower", s: "Fighter" }, { text: "Resourceful — you always find a way", s: "Fixer" }, { text: "Measured — you make the clearest calls in the room", s: "Freezer" }, { text: "Galvanising — you bring the team together when it counts", s: "Connector" }] },
    ],
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function tally(answers) {
  const t = {};
  answers.forEach(a => { t[a] = (t[a] || 0) + 1; });
  return t;
}
function topStyle(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}
function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "8px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: B.gold, animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}
function ScoreBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: B.silver }}>{label}</span>
        <span style={{ fontSize: 13, color: B.muted }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: B.border }}>
        <div style={{ height: "100%", borderRadius: 99, background: color, width: `${(value / max) * 100}%`, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");          // home | quiz | analyzing | results | paywall | premium
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});
  const [primary, setPrimary] = useState(null);
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  // Read ?quiz=id from hash for direct linking
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const q = QUIZZES.find(x => x.id === hash);
      if (q) startQuiz(q);
    }
  }, []);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
    setScores({});
    setPrimary(null);
    setAiReport("");
    setScreen("quiz");
    window.location.hash = quiz.id;
  };

  const handleAnswer = (styleKey) => setSelected(styleKey);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (qIndex + 1 < activeQuiz.questions.length) {
      setQIndex(qIndex + 1);
    } else {
      const finalScores = tally(newAnswers);
      const p = topStyle(finalScores);
      setScores(finalScores);
      setPrimary(p);
      setScreen("analyzing");
      setTimeout(() => setScreen("results"), 2600);
    }
  };

  const handlePay = async () => {
    if (!email) return;
    setPaying(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          primaryStyle: primary,
          scores,
        }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      alert("Payment error. Please try again.");
      setPaying(false);
    }
  };

  const goHome = () => { setScreen("home"); window.location.hash = ""; };

  // ── HOME ────────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: B.navyD, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${B.border}`, padding: "28px 24px", textAlign: "center" }}>
        <Logo size={1.1} />
      </div>

      {/* Hero */}
      <div style={{ padding: "56px 24px 40px", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: `${B.gold}22`, border: `1px solid ${B.gold}55`, borderRadius: 99, padding: "6px 18px", marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: B.gold, letterSpacing: 3, fontFamily: "system-ui", fontWeight: 600 }}>LEADERSHIP DIAGNOSTICS</span>
        </div>
        <h1 style={{ color: B.white, fontSize: 34, fontWeight: 400, lineHeight: 1.25, marginBottom: 16, letterSpacing: 0.5 }}>
          Know yourself.<br />Lead better.
        </h1>
        <p style={{ color: B.silver, fontSize: 16, lineHeight: 1.7, fontFamily: "system-ui", marginBottom: 0 }}>
          Six evidence-informed assessments designed for leaders who take their development seriously. Each quiz delivers instant free results — unlock your full AI report for $29.
        </p>
      </div>

      {/* Quiz Cards */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {QUIZZES.map(quiz => (
          <div key={quiz.id} onClick={() => startQuiz(quiz)} style={{ background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 16, padding: "24px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = B.gold; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `${B.gold}10`, borderRadius: "0 0 0 60px" }} />
            <div style={{ fontSize: 32, marginBottom: 14 }}>{quiz.emoji}</div>
            <h3 style={{ color: B.white, fontSize: 17, fontWeight: 400, marginBottom: 6, lineHeight: 1.3, letterSpacing: 0.3 }}>{quiz.title}</h3>
            <p style={{ color: B.muted, fontSize: 13, fontFamily: "system-ui", lineHeight: 1.5, marginBottom: 16 }}>{quiz.subtitle}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: B.gold, fontFamily: "system-ui" }}>⏱ {quiz.duration} · {quiz.questions.length} questions</span>
              <span style={{ fontSize: 13, color: B.gold, fontFamily: "system-ui", fontWeight: 600 }}>Start →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${B.border}`, padding: "24px", textAlign: "center" }}>
        <Logo size={0.7} />
        <p style={{ color: B.muted, fontSize: 11, fontFamily: "system-ui", marginTop: 12 }}>© 2024 LEANGLE HR LAB · All rights reserved</p>
      </div>
    </div>
  );

  // ── QUIZ ────────────────────────────────────────────────────────────────────
  if (screen === "quiz" && activeQuiz) {
    const q = activeQuiz.questions[qIndex];
    const progress = (qIndex / activeQuiz.questions.length) * 100;
    return (
      <div style={{ minHeight: "100vh", background: B.navyD, fontFamily: "system-ui", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={goHome} style={{ background: "none", border: "none", color: B.muted, cursor: "pointer", fontSize: 13 }}>← All Quizzes</button>
          <Logo size={0.6} />
          <span style={{ fontSize: 12, color: B.muted }}>{qIndex + 1}/{activeQuiz.questions.length}</span>
        </div>
        {/* Progress */}
        <div style={{ height: 3, background: B.border }}>
          <div style={{ height: "100%", background: B.gold, width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>
        {/* Content */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ maxWidth: 540, width: "100%" }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: B.gold, letterSpacing: 3, textTransform: "uppercase" }}>{activeQuiz.emoji} {activeQuiz.title}</span>
            </div>
            <h2 style={{ color: B.white, fontSize: 20, fontWeight: 400, marginBottom: 28, lineHeight: 1.45, fontFamily: "'Georgia', serif", letterSpacing: 0.3 }}>{q.q}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt.s)} style={{
                  textAlign: "left", padding: "14px 18px", borderRadius: 10, cursor: "pointer", fontSize: 14, lineHeight: 1.55, fontFamily: "system-ui",
                  border: selected === opt.s ? `2px solid ${B.gold}` : `2px solid ${B.border}`,
                  background: selected === opt.s ? `${B.gold}18` : B.navyL,
                  color: selected === opt.s ? B.white : B.silver,
                  transition: "all 0.15s"
                }}>{opt.text}</button>
              ))}
            </div>
            <button onClick={handleNext} disabled={!selected} style={{
              marginTop: 20, width: "100%", padding: "14px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 600, cursor: selected ? "pointer" : "not-allowed",
              background: selected ? B.gold : B.border, color: selected ? B.navyD : B.muted, transition: "all 0.2s", fontFamily: "system-ui"
            }}>
              {qIndex + 1 === activeQuiz.questions.length ? "See My Results →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ANALYZING ───────────────────────────────────────────────────────────────
  if (screen === "analyzing") return (
    <div style={{ minHeight: "100vh", background: B.navyD, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center" }}>
        <Logo size={0.8} />
        <div style={{ marginTop: 40, fontSize: 40 }}>🔍</div>
        <h2 style={{ color: B.white, fontSize: 20, fontWeight: 400, margin: "16px 0 8px", fontFamily: "'Georgia', serif" }}>Analysing your responses…</h2>
        <p style={{ color: B.muted, fontSize: 14 }}>Building your leadership profile</p>
        <div style={{ marginTop: 24 }}><LoadingDots /></div>
      </div>
    </div>
  );

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  if (screen === "results" && activeQuiz && primary) {
    const styleData = activeQuiz.styles[primary];
    const maxQ = activeQuiz.questions.length;
    return (
      <div style={{ minHeight: "100vh", background: B.navyD, fontFamily: "system-ui" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={goHome} style={{ background: "none", border: "none", color: B.muted, cursor: "pointer", fontSize: 13 }}>← All Quizzes</button>
          <Logo size={0.6} />
          <div style={{ width: 80 }} />
        </div>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 60px" }}>
          {/* Primary result */}
          <div style={{ background: B.navyL, border: `1px solid ${B.gold}55`, borderRadius: 20, padding: "32px 24px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>{styleData.emoji}</div>
            <div style={{ fontSize: 11, color: B.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{activeQuiz.title}</div>
            <h1 style={{ color: B.white, fontSize: 26, fontWeight: 400, fontFamily: "'Georgia', serif", marginBottom: 4, letterSpacing: 0.5 }}>{primary}</h1>
            <div style={{ color: B.silver, fontSize: 14, fontStyle: "italic", marginBottom: 16 }}>"{styleData.tagline}"</div>
            <p style={{ color: B.silver, fontSize: 14, lineHeight: 1.7 }}>{styleData.summary}</p>
          </div>

          {/* Scores */}
          <div style={{ background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
            <h3 style={{ color: B.white, fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Your Breakdown</h3>
            {Object.entries(activeQuiz.styles).map(([name, s]) => (
              <ScoreBar key={name} label={`${s.emoji} ${name}`} value={scores[name] || 0} max={maxQ} color={s.color} />
            ))}
          </div>

          {/* Strengths & Blindspots */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: B.success, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>✅ Strengths</div>
              {styleData.strengths.map((s, i) => <p key={i} style={{ fontSize: 12, color: B.silver, marginBottom: 6, lineHeight: 1.5 }}>· {s}</p>)}
            </div>
            <div style={{ background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: B.goldL, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>⚠️ Watch Outs</div>
              {styleData.blindspots.map((b, i) => <p key={i} style={{ fontSize: 12, color: B.silver, marginBottom: 6, lineHeight: 1.5 }}>· {b}</p>)}
            </div>
          </div>

          {/* Share link */}
          <div style={{ background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, color: B.gold, fontWeight: 600, marginBottom: 2 }}>📤 Share this quiz</div>
              <div style={{ fontSize: 11, color: B.muted, fontFamily: "monospace" }}>{window.location.origin}#{activeQuiz.id}</div>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}#${activeQuiz.id}`); }} style={{ background: B.border, border: "none", borderRadius: 8, padding: "8px 14px", color: B.silver, fontSize: 12, cursor: "pointer" }}>Copy</button>
          </div>

          {/* Premium CTA */}
          <div style={{ background: `linear-gradient(135deg, ${B.navyL}, #1A2535)`, border: `1px solid ${B.gold}55`, borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔓</div>
            <h3 style={{ color: B.white, fontSize: 18, fontWeight: 400, fontFamily: "'Georgia', serif", marginBottom: 8, letterSpacing: 0.3 }}>Unlock Your Full Report</h3>
            <p style={{ color: B.silver, fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>An AI-powered deep-dive into your leadership style. Your communication DNA, hidden blind spots, and a personalised 30-day action plan — delivered instantly.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, textAlign: "left" }}>
              {["📋 Full personalised leadership report", "🎯 30-day action plan (week by week)", "💡 Your leadership mantra", "📬 Sent to your inbox instantly"].map(f => (
                <div key={f} style={{ color: B.silver, fontSize: 13 }}>✓ {f}</div>
              ))}
            </div>
            <button onClick={() => setScreen("paywall")} style={{ width: "100%", padding: "15px", borderRadius: 10, border: "none", background: B.gold, color: B.navyD, fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}>
              Get Full Report — $29
            </button>
            <p style={{ color: B.muted, fontSize: 11, marginTop: 10 }}>One-time payment · Instant access · 30-day guarantee</p>
          </div>
        </div>
      </div>
    );
  }

  // ── PAYWALL ─────────────────────────────────────────────────────────────────
  if (screen === "paywall") return (
    <div style={{ minHeight: "100vh", background: B.navyD, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 460, width: "100%", background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 24, padding: "36px 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Logo size={0.8} />
          <div style={{ marginTop: 24, fontSize: 36 }}>📋</div>
          <h2 style={{ color: B.white, fontSize: 20, fontWeight: 400, fontFamily: "'Georgia', serif", marginTop: 10, marginBottom: 4 }}>Complete Your Order</h2>
          <p style={{ color: B.muted, fontSize: 13 }}>Personalised AI report · One-time $29</p>
        </div>
        <div style={{ background: B.navyD, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: B.silver, fontSize: 14 }}>{activeQuiz?.title} — Full Report</span>
          <span style={{ color: B.gold, fontSize: 16, fontWeight: 700 }}>$29</span>
        </div>
        {[{ label: "Email address", placeholder: "you@company.com", val: email, set: setEmail, type: "email" }].map(f => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: B.silver, marginBottom: 5, letterSpacing: 0.5, textTransform: "uppercase" }}>{f.label}</label>
            <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.navyD, color: B.white, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "system-ui" }} />
          </div>
        ))}
        {[{ label: "Card number", placeholder: "4242 4242 4242 4242" }, { label: "Expiry", placeholder: "MM / YY" }, { label: "CVC", placeholder: "123" }].map(f => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: B.silver, marginBottom: 5, letterSpacing: 0.5, textTransform: "uppercase" }}>{f.label}</label>
            <input placeholder={f.placeholder} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.navyD, color: B.white, fontSize: 14, boxSizing: "border-box", fontFamily: "system-ui" }} />
          </div>
        ))}
        <button onClick={handlePay} disabled={paying || !email} style={{
          width: "100%", marginTop: 8, padding: "15px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 700, cursor: paying || !email ? "not-allowed" : "pointer",
          background: paying || !email ? B.border : B.gold, color: paying || !email ? B.muted : B.navyD, transition: "all 0.2s"
        }}>
          {paying ? "Processing…" : "Pay $29 & Get My Report"}
        </button>
        <p style={{ textAlign: "center", color: B.muted, fontSize: 11, marginTop: 12 }}>🔒 Secure · 30-day money-back guarantee</p>
        <button onClick={() => setScreen("results")} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", color: B.muted, fontSize: 12, cursor: "pointer" }}>← Back to results</button>
      </div>
    </div>
  );

  // ── PREMIUM REPORT ──────────────────────────────────────────────────────────
  if (screen === "premium" && activeQuiz && primary) {
    const styleData = activeQuiz.styles[primary];
    return (
      <div style={{ minHeight: "100vh", background: B.navyD, fontFamily: "system-ui" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={goHome} style={{ background: "none", border: "none", color: B.muted, cursor: "pointer", fontSize: 13 }}>← All Quizzes</button>
          <Logo size={0.6} />
          <div style={{ width: 80 }} />
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 60px" }}>
          <div style={{ background: B.navyL, border: `1px solid ${B.gold}55`, borderRadius: 20, padding: "24px", textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{styleData.emoji}</div>
            <div style={{ fontSize: 11, color: B.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Premium Report</div>
            <h1 style={{ color: B.white, fontSize: 20, fontWeight: 400, fontFamily: "'Georgia', serif", marginBottom: 4 }}>{activeQuiz.title}</h1>
            <div style={{ color: B.silver, fontSize: 13 }}>{primary} · "{styleData.tagline}"</div>
          </div>

          {loadingReport ? (
            <div style={{ background: B.navyL, borderRadius: 20, padding: 48, textAlign: "center", border: `1px solid ${B.border}` }}>
              <p style={{ color: B.silver, marginBottom: 16, fontSize: 14 }}>Generating your personalised report…</p>
              <LoadingDots />
            </div>
          ) : (
            <div style={{ background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 20, padding: "28px 24px" }}>
              {aiReport.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 17, fontWeight: 400, color: B.gold, fontFamily: "'Georgia', serif", marginTop: 28, marginBottom: 10, borderBottom: `1px solid ${B.border}`, paddingBottom: 8, letterSpacing: 0.5 }}>{line.slice(3)}</h2>;
                if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: 14, fontWeight: 700, color: B.silver, marginTop: 14, marginBottom: 6 }}>{line.slice(4)}</h3>;
                if (line.match(/^\d\./)) return <p key={i} style={{ fontSize: 14, color: B.silver, lineHeight: 1.75, marginBottom: 10, paddingLeft: 16, borderLeft: `3px solid ${B.gold}`, marginLeft: 4 }}>{line}</p>;
                if (line.startsWith("- ") || line.startsWith("• ")) return <p key={i} style={{ fontSize: 14, color: B.silver, lineHeight: 1.65, marginBottom: 6 }}>· {line.slice(2)}</p>;
                if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
                return <p key={i} style={{ fontSize: 14, color: B.silver, lineHeight: 1.75, marginBottom: 8 }}>{line}</p>;
              })}
            </div>
          )}

          <div style={{ background: `${B.gold}18`, border: `1px solid ${B.gold}44`, borderRadius: 14, padding: "16px 20px", marginTop: 16, textAlign: "center" }}>
            <p style={{ color: B.gold, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>📬 Report sent to {email}</p>
            <p style={{ color: B.muted, fontSize: 12 }}>Bookmark this page to revisit anytime.</p>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={{ color: B.muted, fontSize: 13, marginBottom: 12 }}>Explore another assessment:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {QUIZZES.filter(q => q.id !== activeQuiz.id).map(q => (
                <button key={q.id} onClick={() => startQuiz(q)} style={{ background: B.navyL, border: `1px solid ${B.border}`, borderRadius: 99, padding: "8px 14px", color: B.silver, fontSize: 12, cursor: "pointer" }}>
                  {q.emoji} {q.title.split(" ")[0]} {q.title.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
