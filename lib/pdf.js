// lib/pdf.js - LEANGLE HR LAB Premium Report Generator
import PDFDocument from 'pdfkit';

const C = {
  navy:'#1A2535', steel:'#3A6E9A', steelL:'#D4E6F5',
  white:'#FFFFFF', black:'#1A1A1A', dark:'#2D3748',
  mid:'#4A5568', muted:'#718096', lightG:'#F0F4F8',
  border:'#CBD5E0', gold:'#8B6914', green:'#276749',
  purple:'#553C9A', orange:'#9C4221', red:'#9B2C2C',
};

const STYLE_META = {
  Collaborative:{tagline:'The Bridge Builder'},
  Directive:{tagline:'The Clear Commander'},
  Empathetic:{tagline:'The Human-First Leader'},
  Analytical:{tagline:'The Evidence-Led Leader'},
  Mediator:{tagline:'The Peacemaker'},
  Confronter:{tagline:'The Direct Resolver'},
  Avoider:{tagline:'The Strategic Pauser'},
  Collaborator:{tagline:'The Problem-Solver'},
  Coach:{tagline:'The Growth Guide'},
  Challenger:{tagline:'The Straight Talker'},
  Connector:{tagline:'The Relationship Feeder'},
  Analyst:{tagline:'The Evidence Builder'},
  Instinctive:{tagline:'The Bold Mover'},
  Consensus:{tagline:'The People Unifier'},
  Methodical:{tagline:'The Careful Strategist'},
  Adaptive:{tagline:'The Situational Decider'},
  Autonomy:{tagline:'The Independent Driver'},
  Mastery:{tagline:'The Excellence Seeker'},
  Purpose:{tagline:'The Mission Carrier'},
  Recognition:{tagline:'The Impact Seeker'},
  Fighter:{tagline:'The Pressure Activator'},
  Fixer:{tagline:'The Problem Eliminator'},
  Freezer:{tagline:'The Thoughtful Pauser'},
  Visionary:{tagline:'The Big Picture Thinker'},
  Executor:{tagline:'The Delivery Champion'},
  Architect:{tagline:'The Systems Builder'},
};

const STYLE_COLORS = {
  Collaborative:C.steel, Directive:C.orange, Empathetic:C.green, Analytical:C.purple,
  Mediator:C.green, Confronter:C.orange, Avoider:C.steel, Collaborator:C.purple,
  Coach:C.green, Challenger:C.orange, Connector:C.steel, Analyst:C.purple,
  Instinctive:C.orange, Consensus:C.steel, Methodical:C.purple, Adaptive:C.green,
  Autonomy:C.steel, Mastery:C.purple, Purpose:C.green, Recognition:C.gold,
  Fighter:C.orange, Fixer:C.steel, Freezer:C.purple,
  Visionary:C.steel, Executor:C.orange, Architect:C.purple,
};

const STRESS_PROFILES = {
  Visionary: [
    ['Mild Pressure','You come alive under mild pressure. The stakes activate your future-focus and you inspire others with clarity of vision that cuts through uncertainty.',C.steel],
    ['Sustained Pressure','You may begin pivoting to new ideas to escape the discomfort of grinding execution. Watch for strategy abandonment when things get hard.',C.purple],
    ['Severe Burnout','When your ability to create and imagine feels blocked, energy collapses rapidly. Recovery requires reconnecting to a compelling future picture.',C.orange],
    ['Derailer to Watch','Visionary volatility — abandoning current strategies prematurely and pivoting toward new ideas as a psychological escape from execution pressure.',C.red],
  ],
  Executor: [
    ['Mild Pressure','You thrive under pressure. Deadlines and stakes bring out your natural drive to deliver. This is where you are at your most productive.',C.steel],
    ['Sustained Pressure','You may become rigid and controlling, pushing harder when flexibility is actually needed. Watch for burnout from carrying too much.',C.purple],
    ['Severe Burnout','Exhaustion sets in when results don\'t match effort. Recovery requires stepping back from doing and reconnecting to meaning.',C.orange],
    ['Derailer to Watch','Micromanagement under stress. Taking over tasks instead of trusting others, which depletes your team precisely when they need to step up.',C.red],
  ],
  Architect: [
    ['Mild Pressure','You perform well under mild pressure, using your systems thinking to bring order and clarity when others feel overwhelmed.',C.steel],
    ['Sustained Pressure','You may over-engineer solutions or get stuck perfecting the plan when execution is what\'s needed. Analysis paralysis is your risk.',C.purple],
    ['Severe Burnout','When systems break down and chaos reigns, motivation disappears. Recovery requires accepting imperfect action over perfect inaction.',C.orange],
    ['Derailer to Watch','Perfectionism under stress. Continuing to refine when good enough is already sufficient, blocking progress for the whole team.',C.red],
  ],
  Recognition: [
    ['Mild Pressure','You perform exceptionally well. The stakes activate your best qualities — energy, focus, and the ability to rally others.',C.steel],
    ['Sustained Pressure','You may begin making decisions optimised for how they look rather than what is right. Watch for the gap between public confidence and private uncertainty.',C.purple],
    ['Severe Burnout','Motivation disappears rapidly when recognition is absent. Recovery requires reconnecting to intrinsic purpose beyond the applause.',C.orange],
    ['Derailer to Watch','Approval-seeking under stress. Seeking validation before acting, over-communicating wins, or avoiding difficult conversations.',C.red],
  ],
};

const HOW_OTHERS = {
  Visionary: [
    ['Your Direct Reports','They experience you as inspiring but sometimes unpredictable. They believe in your vision but quietly hunger for more follow-through and structure from you.',C.steel],
    ['Your Peers','They experience you as a sharp, ideas-forward collaborator who raises the strategic ceiling. At times they may find it hard to pin you down on commitments.',C.green],
    ['Your Manager / Stakeholders','They see you as someone with rare strategic instinct. However, they may grow concerned when bold ideas are not accompanied by credible execution plans.',C.purple],
  ],
  Executor: [
    ['Your Direct Reports','They experience you as reliable, driven, and clear about expectations. At times your pace can feel relentless and they may need more space to think.',C.steel],
    ['Your Peers','They see you as the person who actually gets things done. They trust your delivery but may feel you move too fast and leave collaboration behind.',C.green],
    ['Your Manager / Stakeholders','They love your results orientation. Their concern: you may sacrifice people and process to hit targets, creating sustainability risks.',C.purple],
  ],
  Architect: [
    ['Your Direct Reports','They experience you as logical, structured, and fair. They appreciate the clarity you bring but sometimes wish you would move faster and tolerate more ambiguity.',C.steel],
    ['Your Peers','They see you as the person who brings rigour to every discussion. They may find you slow to decide or overly cautious when speed is needed.',C.green],
    ['Your Manager / Stakeholders','They trust your process and your thinking. Their watch-out: they may question whether you can adapt when the plan needs to change rapidly.',C.purple],
  ],
  Recognition: [
    ['Your Direct Reports','They experience you as energising, visible, and genuinely interested in their success. When you are stressed, they may wonder what they did wrong.',C.steel],
    ['Your Peers','They experience you as magnetic and competitive. They will respect you more when you actively share credit for shared wins.',C.green],
    ['Your Manager / Stakeholders','They see you as a high-visibility performer. Their watch-out: they may question whether you sustain performance on unglamorous long-term work.',C.purple],
  ],
};

const TEAM_COMPAT = {
  Visionary: [
    ['With Executors','They are your most valuable partner. Give them your vision clearly, then get out of the way. Their delivery instinct completes what your imagination starts.',C.steel],
    ['With Architects','Natural allies — you provide the what and they build the how. Together you create strategies that are both bold and buildable.',C.purple],
    ['With Connectors','They humanise your vision and bring people along emotionally. Let them translate your direction into belonging for the team.',C.green],
    ['With Purpose Leaders','Deep alignment on mission and meaning. Both of you see the bigger picture. Watch that you don\'t both lose sight of execution.',C.gold],
  ],
  Executor: [
    ['With Visionaries','They provide the direction you need to apply your delivery instinct. Resist the urge to dismiss their ideas as impractical — they need a builder like you.',C.steel],
    ['With Architects','A powerful pairing — you provide momentum and they provide structure. Watch for friction when you want to move and they want to plan.',C.purple],
    ['With Connectors','They slow you down in a good way. Their people focus ensures your results-drive doesn\'t leave the team behind.',C.green],
    ['With Purpose Leaders','They remind you why the work matters beyond the numbers. Let their mission-focus temper your output orientation.',C.gold],
  ],
  default: [
    ['With Autonomy Leaders','Give them ownership and celebrate their outcomes. They outperform when trusted without interference.',C.steel],
    ['With Mastery Leaders','Name their craft specifically — not just what they delivered but how exceptionally well they did it.',C.purple],
    ['With Purpose Leaders','Connect their work visibly to the mission. Natural allies who bring energy and meaning together.',C.green],
    ['With Recognition Leaders','Actively share the spotlight. The partnership is exceptional when ego is managed well.',C.gold],
  ],
};

const ROADMAP = {
  Visionary: [
    ['Days 1-30: Finish Before You Start','Install a personal rule: no new initiatives until existing ones reach a defined milestone. Create an honest inventory of everything you have launched in 90 days.',C.steel],
    ['Days 31-60: Build Your Execution Partnership','Identify one Executor or Architect in your team and deliberately build a completion partnership. Give them formal ownership of your current top priority.',C.purple],
    ['Days 61-90: Test Your Follow-Through','Choose one high-stakes project and commit to seeing it through to completion without pivoting. This is where your reputation as a visionary who delivers gets built.',C.green],
  ],
  default: [
    ['Days 1-30: Install the Habits','Identify your core strength and build one structural habit around it. The goal is habit installation, not transformation.',C.steel],
    ['Days 31-60: Deepen and Expand','Expand your practice to include people and situations you have not prioritised before. Notice where your energy drops.',C.purple],
    ['Days 61-90: Test Under Real Pressure','The real test of leadership development is what you do when the stakes are high. Apply your growth edge in one high-stakes moment.',C.green],
  ],
};

const BOOKS = {
  Visionary:[['The Innovator\'s Dilemma','Clayton Christensen','The definitive text on why great visionary leaders must also build structures that survive their own disruption.'],['Multipliers','Liz Wiseman','Shows how the best visionary leaders amplify the intelligence around them rather than creating dependency on their own ideas.'],['The Hard Thing About Hard Things','Ben Horowitz','A brutally honest account of what happens when visionary leaders have to grind through execution. Essential reading.']],
  Executor:[['Extreme Ownership','Jocko Willink','The philosophy of total accountability that underpins the most effective delivery leaders.'],['High Output Management','Andy Grove','The bible of results-driven leadership. Speaks directly to your strength in driving clarity and output.'],['The Five Dysfunctions of a Team','Patrick Lencioni','Shows how execution-focused leaders can inadvertently create team dysfunction. Your most important blind spot book.']],
  Architect:[['Thinking, Fast and Slow','Daniel Kahneman','The foundational text on how decisions are really made. Will sharpen and challenge your analytical mind.'],['Good to Great','Jim Collins','The data-driven study of what separates good systems from great ones. Your natural language.'],['Essentialism','Greg McKeown','Challenges the Architect\'s tendency to build more systems. Sometimes the best design is the simplest one.']],
  Collaborative:[['The Culture Code','Daniel Coyle','The definitive guide to building belonging in teams.'],['Multipliers','Liz Wiseman','Shows how the best leaders amplify intelligence.'],['Turn the Ship Around','L. David Marquet','A masterclass in distributed leadership.']],
  Directive:[['Extreme Ownership','Jocko Willink','The philosophy of total accountability.'],['High Output Management','Andy Grove','The bible of results-driven leadership.'],['The Hard Thing About Hard Things','Ben Horowitz','Honest direct leadership under pressure.']],
  Empathetic:[['Dare to Lead','Brené Brown','Reframes vulnerability and care as leadership superpowers.'],['Radical Candor','Kim Scott','Shows how to combine genuine care with direct challenge.'],['The Empathy Edge','Maria Ross','Makes the business case for leading with care.']],
  Analytical:[['Thinking, Fast and Slow','Daniel Kahneman','The foundational text on how decisions are really made.'],['The Signal and the Noise','Nate Silver','A masterclass in what data tells us.'],['Superforecasting','Philip Tetlock','How the best analytical minds make predictions.']],
  Recognition:[['The Courage to Be Disliked','Ichiro Kishimi','Challenges your need for external approval with radical clarity.'],['Multipliers','Liz Wiseman','Aligned with your instinct to make people feel genuinely seen.'],['Dare to Lead','Brené Brown','Deepens your self-awareness around why recognition matters.']],
  Autonomy:[['Drive','Daniel Pink','The science of motivation — autonomy mastery purpose.'],['Essentialism','Greg McKeown','About doing less but better on your own terms.'],['The E-Myth Revisited','Michael Gerber','For leaders who want to build something independently.']],
  Mastery:[['Deep Work','Cal Newport','The definitive guide to excellence through focused effort.'],['Mindset','Carol Dweck','Reframes excellence-seeking from fixed achievement to continuous growth.'],['So Good They Cannot Ignore You','Cal Newport','Makes the case for career capital through craft.']],
  Purpose:[["Man's Search for Meaning",'Viktor Frankl','The most profound exploration of purpose ever written.'],['Start With Why','Simon Sinek','The business case for purpose-driven leadership.'],['The Second Mountain','David Brooks','On moving from achievement to contribution.']],
};

const BRAND_STATEMENTS = {
  Visionary: (name, first) => `${name} is a Visionary leader who transforms organisations by seeing possibilities before others can articulate them. Known for reframing complex problems, inspiring teams with compelling future direction, and building strategic clarity from ambiguity, ${first} leads from the conviction that the most valuable thing a leader can offer is a vision worth following.`,
  Executor: (name, first) => `${name} is an Executor leader who creates high-performing teams by turning strategy into results with relentless precision. Known for driving accountability, delivering under pressure, and building cultures where commitments are kept, ${first} leads from the belief that great leadership is ultimately measured by what gets done.`,
  Architect: (name, first) => `${name} is an Architect leader who creates competitive advantage through the design of elegant systems and scalable processes. Known for bringing order to complexity, building structures that outlast any individual, and thinking several steps ahead, ${first} leads from the conviction that great organisations are built, not born.`,
  Recognition: (name, first) => `${name} is a Recognition leader who creates high-performing cultures by making people feel genuinely seen and valued. Known for transforming disengaged teams, delivering results with energy and precision, and building environments where talent wants to stay, ${first} leads from the belief that recognition is not a reward — it is a strategy.`,
  default: (name, first, style) => `${name} is a ${style} leader who creates high-performing teams through their distinctive approach to leadership. Known for bringing clarity, energy, and genuine care to every team they lead, ${first} leads from a deep belief that great leadership starts with knowing yourself and having the courage to grow.`,
};

function getTagline(style) { return STYLE_META[style]?.tagline || 'The Distinctive Leader'; }
function getStyleColor(style) { return STYLE_COLORS[style] || C.steel; }
function getStressProfile(style) { return STRESS_PROFILES[style] || STRESS_PROFILES['Recognition']; }
function getHowOthers(style) { return HOW_OTHERS[style] || HOW_OTHERS['Recognition']; }
function getTeamCompat(style) { return TEAM_COMPAT[style] || TEAM_COMPAT['default']; }
function getRoadmap(style) { return ROADMAP[style] || ROADMAP['default']; }
function getBooks(style) { return BOOKS[style] || BOOKS['Recognition']; }
function getBrandStatement(name, first, style) {
  const fn = BRAND_STATEMENTS[style] || BRAND_STATEMENTS['default'];
  return fn(name, first, style);
}

function clean(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim();
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size:'LETTER', margin:62, bufferPages:false });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width;   // 612
    const H = doc.page.height;  // 792
    const M = 62;
    const CW = W - M * 2;       // 488
    const styleColor = getStyleColor(primaryStyle);
    const tagline = getTagline(primaryStyle);
    const books = getBooks(primaryStyle);
    const stressProfile = getStressProfile(primaryStyle);
    const howOthers = getHowOthers(primaryStyle);
    const teamCompat = getTeamCompat(primaryStyle);
    const roadmap = getRoadmap(primaryStyle);
    const firstName = leaderName ? leaderName.split(' ')[0] : 'You';
    const brandStatement = getBrandStatement(leaderName || 'This leader', firstName, primaryStyle);

    let y = 0;
    let pageNum = 0;

    const addPage = (isFirst = false) => {
      if (!isFirst) doc.addPage();
      pageNum++;
      doc.rect(0,0,W,H).fill(C.white);
      // Header
      doc.rect(0,0,W,4).fill(C.steel);
      doc.rect(0,4,W,40).fill(C.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(C.steel).text('LEANGLE HR LAB', M, 16, {lineBreak:false});
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('  |  ' + quizTitle.toUpperCase(), {continued:false});
      doc.fontSize(8).font('Helvetica').fillColor('#8A9BB0').text(`${pageNum}`, W-M-20, 22, {width:20,align:'right'});
      doc.moveTo(M,46).lineTo(W-M,46).strokeColor(C.border).lineWidth(0.5).stroke();
      // Footer
      doc.moveTo(M,H-28).lineTo(W-M,H-28).strokeColor(C.border).lineWidth(0.5).stroke();
      const footerText = leaderName
        ? `Prepared for ${leaderName}  |  LEANGLE HR LAB  |  Confidential`
        : 'LEANGLE HR LAB  |  Confidential';
      doc.fontSize(7).font('Helvetica').fillColor(C.muted).text(footerText, M, H-20, {width:CW, align:'center'});
      return 58;
    };

    const needSpace = (needed) => {
      if (y + needed > H - 40) y = addPage();
    };

    const heading = (title, subtitle) => {
      needSpace(52);
      y += 10;
      doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy)
        .text(title.toUpperCase(), M, y, {width:CW, characterSpacing:0.5});
      y += 16;
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.steel).lineWidth(2.5).stroke();
      y += 6;
      if (subtitle) {
        doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(C.muted).text(subtitle, M, y, {width:CW});
        y += 14;
      }
      y += 4;
    };

    const para = (text) => {
      const t = clean(text);
      if (!t) return;
      const h = doc.heightOfString(t, {width:CW, lineGap:2});
      needSpace(h + 10);
      doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(t, M, y, {width:CW, lineGap:2});
      y += h + 10;
    };

    const bullet = (text) => {
      const t = clean(text);
      if (!t) return;
      const h = doc.heightOfString(t, {width:CW-16, lineGap:2});
      needSpace(h + 9);
      doc.fontSize(12).font('Helvetica-Bold').fillColor(C.steel).text('>', M, y, {width:14, lineBreak:false});
      doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(t, M+16, y, {width:CW-16, lineGap:2});
      y += h + 9;
    };

    const quoteBox = (text) => {
      const t = `"${clean(text).replace(/^["']/,'').replace(/["']$/,'')}"`;
      const h = doc.heightOfString(t, {width:CW-32}) + 32;
      needSpace(h + 10);
      doc.rect(M,y,CW,h).fill(C.lightG);
      doc.rect(M,y,4,h).fill(C.steel);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+h).lineTo(W-M,y+h).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(12).font('Helvetica-Oblique').fillColor(C.navy).text(t, M+14, y+14, {width:CW-28});
      y += h + 10;
    };

    const weekBox = (title, action, why) => {
      const tH = doc.heightOfString(clean(title),{width:CW-22}) + 4;
      const aH = action ? doc.heightOfString('Action: '+clean(action),{width:CW-36}) + 8 : 0;
      const wH = why ? doc.heightOfString(clean(why),{width:CW-36}) + 8 : 0;
      const bH = tH + aH + wH + 24;
      needSpace(bH + 10);
      doc.rect(M,y,CW,bH).fill(C.lightG);
      doc.rect(M,y,4,bH).fill(C.steel);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(C.navy).text(clean(title), M+12, y+11, {width:CW-22});
      let ty = y + tH + 13;
      if (action) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel)
          .text('Action: ', M+12, ty, {continued:true, lineBreak:false});
        doc.font('Helvetica').fillColor(C.dark).text(clean(action), {width:CW-36});
        ty += aH;
      }
      if (why) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid)
          .text(clean(why), M+12, ty, {width:CW-22});
      }
      y += bH + 10;
    };

    const infoBox = (label, body, color) => {
      const t = clean(body);
      const labelW = CW * 0.24;
      const bodyW = CW * 0.76 - 16;
      const bH = Math.max(doc.heightOfString(t,{width:bodyW, lineGap:2}) + 22, 44);
      needSpace(bH + 8);
      doc.rect(M,y,labelW,bH).fill(C.lightG);
      doc.rect(M,y,4,bH).fill(color || C.steel);
      doc.rect(M+labelW,y,CW-labelW,bH).fill(C.white);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(color || C.steel)
        .text(label, M+8, y+11, {width:labelW-12});
      doc.fontSize(10.5).font('Helvetica').fillColor(C.black)
        .text(t, M+labelW+12, y+10, {width:bodyW, lineGap:2});
      y += bH + 8;
    };

    const barRow = (label, score, color, bold) => {
      needSpace(20);
      const maxW = CW - 120;
      doc.fontSize(bold?10.5:10).font(bold?'Helvetica-Bold':'Helvetica')
        .fillColor(bold?C.navy:C.mid)
        .text((bold ? '\u25CF ' : '') + label, M, y, {width:118, lineBreak:false});
      doc.rect(M+122,y+2,maxW,11).fill(C.border);
      if (score > 0) doc.rect(M+122,y+2,maxW*(score/10),11).fill(color);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(color)
        .text(`${score}/10`, M+122+maxW+8, y);
      y += 20;
    };

    const brandBox = (text) => {
      const h = doc.heightOfString(text,{width:CW-40,lineGap:3}) + 38;
      needSpace(h + 10);
      doc.rect(M,y,CW,h).fill(C.steelL);
      doc.rect(M,y,CW,h).strokeColor(C.steel).lineWidth(2).stroke();
      doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy)
        .text(text, M+20, y+17, {width:CW-40, align:'center', lineGap:3});
      y += h + 10;
    };

    const roadmapBox = (title, color, body) => {
      const bodyW = CW * 0.72 - 16;
      const bH = Math.max(doc.heightOfString(body,{width:bodyW,lineGap:2}) + 22, 46);
      needSpace(bH + 8);
      doc.rect(M,y,CW*0.26,bH).fill(C.lightG);
      doc.rect(M,y,4,bH).fill(color);
      doc.rect(M+CW*0.26,y,CW*0.74,bH).fill(C.white);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(10.5).font('Helvetica-Bold').fillColor(color)
        .text(title, M+8, y+10, {width:CW*0.26-14});
      doc.fontSize(10.5).font('Helvetica').fillColor(C.black)
        .text(body, M+CW*0.26+12, y+10, {width:bodyW, lineGap:2});
      y += bH + 8;
    };

    const bookBox = (title, author, reason, color) => {
      const bodyW = CW * 0.63 - 16;
      const bH = Math.max(doc.heightOfString(reason,{width:bodyW,lineGap:2}) + 28, 58);
      needSpace(bH + 8);
      doc.rect(M,y,CW*0.35,bH).fill(C.lightG);
      doc.rect(M,y,4,bH).fill(color);
      doc.rect(M+CW*0.35,y,CW*0.65,bH).fill(C.white);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(10.5).font('Helvetica-Bold').fillColor(C.navy)
        .text(title, M+10, y+10, {width:CW*0.35-16});
      const tH2 = doc.heightOfString(title,{width:CW*0.35-16});
      doc.fontSize(9).font('Helvetica-Oblique').fillColor(C.mid)
        .text(author, M+10, y+10+tH2+3, {width:CW*0.35-16});
      doc.fontSize(10.5).font('Helvetica').fillColor(C.black)
        .text(reason, M+CW*0.35+12, y+10, {width:bodyW, lineGap:2});
      y += bH + 8;
    };

    // ── PAGE 1: COVER ──────────────────────────────────────────────────────────
    doc.rect(0,0,W,H).fill(C.white);
    // Top bar
    doc.rect(0,H-112,W,112).fill(C.navy);
    doc.rect(0,H-116,W,4).fill(C.steel);
    // Bottom bar
    doc.rect(0,0,W,66).fill(C.navy);
    doc.rect(0,66,W,4).fill(C.steel);
    // Logo
    doc.fontSize(28).font('Helvetica').fillColor(C.white)
      .text('L E A N G L E', M, H-68, {align:'center',width:CW});
    const hY = H-90;
    doc.moveTo(W/2-74,hY).lineTo(W/2-22,hY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.moveTo(W/2+22,hY).lineTo(W/2+74,hY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel)
      .text('H R   L A B', W/2-22, hY-8, {width:44, align:'center'});
    // Content area
    const ct=H-118, cb=68, ch=ct-cb;
    const cp = f => cb + ch*(1-f);
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel)
      .text('P R E M I U M   L E A D E R S H I P   R E P O R T', M, cp(0.06), {align:'center',width:CW});
    doc.fontSize(23).font('Helvetica-Bold').fillColor(C.navy)
      .text(quizTitle, M, cp(0.15), {align:'center',width:CW});
    doc.moveTo(M+36,cp(0.23)).lineTo(W-M-36,cp(0.23)).strokeColor(C.steel).lineWidth(0.8).stroke();
    // Style pill
    const pW=136,pH=30,pX=(W-pW)/2,pY=cp(0.31)-pH;
    doc.roundedRect(pX,pY,pW,pH,15).fill(C.steelL);
    doc.roundedRect(pX,pY,pW,pH,15).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.steel)
      .text(primaryStyle, pX, pY+8, {align:'center',width:pW});
    doc.fontSize(10).font('Helvetica').fillColor(C.muted)
      .text('Prepared exclusively for', M, cp(0.42), {align:'center',width:CW});
    doc.fontSize(21).font('Helvetica-Bold').fillColor(C.navy)
      .text(leaderName || 'Your Name', M, cp(0.51), {align:'center',width:CW});
    doc.moveTo(M+36,cp(0.59)).lineTo(W-M-36,cp(0.59)).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(C.navy)
      .text("WHAT'S INSIDE THIS REPORT", M, cp(0.65), {align:'center',width:CW});
    const iL=["Leadership DNA Analysis","3 Signature Superpowers","Growth Edge & Derailers","30-Day Action Plan","Stress & Pressure Profile"];
    const iR=["How Others Experience You","Team Compatibility Guide","90-Day Growth Roadmap","Your Leadership Brand","Certificate of Completion"];
    const cw2=140, x1=W/2-cw2-10, x2=W/2+10;
    const yS=cp(0.71), rG=(cp(0.71)-cp(0.94))/5;
    doc.fontSize(9.5).font('Helvetica').fillColor(C.dark);
    for(let j=0;j<5;j++){
      doc.text('+ '+iL[j], x1, yS-j*rG, {width:cw2});
      doc.text('+ '+iR[j], x2, yS-j*rG, {width:cw2});
    }
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.white)
      .text('Your Personalised Leadership Intelligence Report', M, 42, {align:'center',width:CW});

    // ── PAGE 2: DASHBOARD ──────────────────────────────────────────────────────
    y = addPage();

    // Profile card
    const cardH = 64;
    doc.rect(M,y,CW,cardH).fill(C.lightG);
    doc.rect(M,y,6,cardH).fill(styleColor);
    doc.rect(M,y,CW,cardH).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY STYLE', M+14, y+10);
    doc.fontSize(17).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, M+14, y+22);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid).text(`"${tagline}"`, M+14, y+44);
    if (leaderName) {
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel)
        .text('PREPARED FOR', W-M-170, y+10, {width:170, align:'right'});
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy)
        .text(leaderName, W-M-170, y+22, {width:170, align:'right'});
      doc.fontSize(10).font('Helvetica').fillColor(C.mid)
        .text(quizTitle, W-M-170, y+44, {width:170, align:'right'});
    }
    y += cardH + 16;

    heading('Your Style Profile', 'Score breakdown across all dimensions');
    barRow(primaryStyle, 8, styleColor, true);
    barRow('Secondary Strength', 5, C.steel, false);
    barRow('Supporting Style', 3, C.mid, false);
    y += 10;

    heading('Key Leadership Dimensions');
    const dims=[['People Focus',9],['Visibility Drive',8],['Speed to Act',7],['Data & Analysis',5],['Collaborative Pull',8]];
    dims.forEach(([d,s]) => barRow(d, s, C.steel, false));

    // ── PAGE 3+: AI REPORT CONTENT ────────────────────────────────────────────
    y = addPage();

    const lines = reportContent.split('\n');
    let i = 0, prevH = '';
    while (i < lines.length) {
      const raw = lines[i].trim(); i++;
      if (!raw || raw.match(/^[-=]{2,}$/)) continue;
      if (raw.startsWith('##') || raw.startsWith('###')) {
        prevH = raw.replace(/^#+\s+/,'').toLowerCase();
        heading(raw.replace(/^#+\s+/,''));
        continue;
      }
      if (raw.match(/^Week\s+\d+:/i)) {
        let action='', why='';
        while (i < lines.length) {
          const n = lines[i].trim();
          if (!n) { i++; continue; }
          if (n.match(/^Action:/i)) { action=n.replace(/^Action:\s*/i,''); i++; }
          else if (n.match(/^Why it matters:/i)) { why=n.replace(/^Why it matters:\s*/i,''); i++; }
          else if (n.startsWith('##') || n.match(/^Week\s+\d+:/i)) break;
          else i++;
        }
        weekBox(raw, action, why);
        continue;
      }
      if (raw.match(/^Superpower\s+\d+:/i)) {
        needSpace(24);
        doc.fontSize(11).font('Helvetica-Bold').fillColor(C.navy).text(clean(raw), M, y, {width:CW});
        y += 20;
        continue;
      }
      if (raw.startsWith('- ') || raw.startsWith('* ')) {
        bullet(raw.replace(/^[-*]\s+/,''));
        continue;
      }
      const special = prevH.includes('mantra') || prevH.includes('question');
      if (special && raw.length > 10) { quoteBox(raw); continue; }
      para(raw);
    }

    // ── LEADERSHIP BRAND STATEMENT ─────────────────────────────────────────────
    heading('Your Leadership Brand Statement', 'Use this in interviews, bios, and LinkedIn');
    para(`A Leadership Brand Statement captures who you are as a leader in a single memorable paragraph, based on your ${primaryStyle} profile:`);
    y += 4;
    brandBox(brandStatement);
    para('Feel free to personalise this. The most powerful version sounds like you — direct, specific, and grounded in real examples from your leadership experience.');

    // ── STRESS PROFILE ─────────────────────────────────────────────────────────
    needSpace(60);
    heading('Your Stress & Pressure Profile', `How the ${primaryStyle} style shifts under different pressure levels`);
    stressProfile.forEach(([label, body, col]) => {
      infoBox(label, body, col); y += 2;
    });

    // ── HOW OTHERS EXPERIENCE YOU ──────────────────────────────────────────────
    needSpace(60);
    heading('How Others Experience You', 'The gap between how you see yourself and how you are perceived');
    para(`Most assessments only show you how you see yourself. This section reveals how you are likely experienced by the three most important groups around you as a ${primaryStyle} leader.`);
    howOthers.forEach(([label, body, col]) => {
      infoBox(label, body, col); y += 2;
    });

    // ── TEAM COMPATIBILITY ─────────────────────────────────────────────────────
    needSpace(60);
    heading('Your Team Compatibility Guide', `How the ${primaryStyle} style works with different leadership styles`);
    teamCompat.forEach(([label, body, col]) => {
      infoBox(label, body, col); y += 2;
    });

    // ── 90-DAY ROADMAP ─────────────────────────────────────────────────────────
    needSpace(60);
    heading('Your 90-Day Leadership Growth Roadmap', 'Sustained development across three months of intentional practice');
    roadmap.forEach(([title, col, body]) => {
      roadmapBox(title, col, body); y += 2;
    });

    // ── BOOKS ──────────────────────────────────────────────────────────────────
    needSpace(60);
    heading(`Recommended Reading for ${primaryStyle} Leaders`, 'Curated specifically for your style — not a generic list');
    const bColors = [C.gold, C.steel, C.green];
    books.slice(0,3).forEach(([title, author, reason], idx) => {
      bookBox(title, author, reason, bColors[idx]); y += 2;
    });

    // ── CERTIFICATE ────────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0,0,W,H).fill(C.white);
    doc.rect(12,12,W-24,H-24).strokeColor(C.navy).lineWidth(2).stroke();
    doc.rect(18,18,W-36,H-36).strokeColor(C.steel).lineWidth(1).stroke();
    [[20,H-20],[W-20,H-20],[20,20],[W-20,20]].forEach(([cx,cy]) => {
      doc.circle(cx,cy,6).fill(C.steel);
      doc.circle(cx,cy,2.5).fill(C.white);
    });
    doc.rect(12,H-88,W-24,76).fill(C.navy);
    doc.fontSize(22).font('Helvetica').fillColor(C.white)
      .text('L E A N G L E', M, H-58, {align:'center',width:CW});
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel)
      .text('H R   L A B', M, H-38, {align:'center',width:CW});
    const cm = H/2;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(C.steel)
      .text('C E R T I F I C A T E   O F   L E A D E R S H I P', M, cm-112, {align:'center',width:CW});
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(C.steel)
      .text('S E L F - A W A R E N E S S', M, cm-92, {align:'center',width:CW});
    doc.moveTo(M+40,cm-74).lineTo(W-M-40,cm-74).strokeColor(C.gold).lineWidth(1.5).stroke();
    doc.fontSize(11).font('Helvetica').fillColor(C.muted)
      .text('This is to certify that', M, cm-54, {align:'center',width:CW});
    doc.fontSize(28).font('Helvetica-Bold').fillColor(C.navy)
      .text(leaderName || 'Leader Name', M, cm-20, {align:'center',width:CW});
    doc.moveTo(W/2-90,cm+16).lineTo(W/2+90,cm+16).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(11).font('Helvetica').fillColor(C.muted)
      .text('has successfully completed the', M, cm+24, {align:'center',width:CW});
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel)
      .text(quizTitle, M, cm+44, {align:'center',width:CW});
    doc.fontSize(10).font('Helvetica').fillColor(C.muted)
      .text('Leadership Assessment by LEANGLE HR LAB', M, cm+64, {align:'center',width:CW});
    const bpW=164,bpH=34,bpX=(W-bpW)/2,bpY=cm+88;
    doc.roundedRect(bpX,bpY,bpW,bpH,17).fill(C.steelL);
    doc.roundedRect(bpX,bpY,bpW,bpH,17).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(C.steel)
      .text('PRIMARY LEADERSHIP STYLE', bpX, bpY+6, {align:'center',width:bpW});
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy)
      .text(primaryStyle, bpX, bpY+18, {align:'center',width:bpW});
    const sY=cm+142;
    doc.moveTo(M+28,sY).lineTo(M+152,sY).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.moveTo(W-M-152,sY).lineTo(W-M-28,sY).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.fontSize(9).font('Helvetica').fillColor(C.muted)
      .text('LEANGLE HR LAB', M+28, sY+6, {width:124,align:'center'});
    doc.text('Date of Completion', W-M-152, sY+6, {width:124,align:'center'});
    doc.rect(12,12,W-24,44).fill(C.navy);
    doc.fontSize(8.5).font('Helvetica').fillColor(C.white)
      .text('Confidential — prepared exclusively for the named individual.', M, 28, {align:'center',width:CW});

    // ── BACK COVER ─────────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0,0,W,H).fill(C.white);
    doc.rect(0,H-106,W,106).fill(C.navy);
    doc.rect(0,H-110,W,4).fill(C.steel);
    doc.fontSize(26).font('Helvetica').fillColor(C.white)
      .text('L E A N G L E', M, H-64, {align:'center',width:CW});
    const bhY=H-82;
    doc.moveTo(W/2-66,bhY).lineTo(W/2-22,bhY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.moveTo(W/2+22,bhY).lineTo(W/2+66,bhY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel)
      .text('H R   L A B', W/2-22, bhY-8, {width:44,align:'center'});
    const bm = (H-110)/2;
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy)
      .text('Thank you for investing in your leadership.', M, bm-86, {align:'center',width:CW});
    doc.moveTo(M+40,bm-64).lineTo(W-M-40,bm-64).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(11).font('Helvetica-Oblique').fillColor(C.mid)
      .text('"Leadership is not a destination.\nIt is a daily practice of self-awareness, courage, and care."',
        M, bm-50, {align:'center',width:CW,lineGap:4});
    doc.moveTo(M+40,bm+10).lineTo(W-M-40,bm+10).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(C.steel)
      .text('EXPLORE ALL 7 ASSESSMENTS', M, bm+26, {align:'center',width:CW});
    const assessments=[
      'Leadership Communication Style',
      'Conflict Resolution Style',
      'Feedback Style',
      'Decision-Making Style',
      'What Motivates You at Work',
      'Workplace Stress Response',
      'Leadership Personality Type',
    ];
    doc.fontSize(10).font('Helvetica').fillColor(C.dark);
    assessments.forEach((item,j) => {
      doc.text(item, M, bm+44+j*20, {align:'center',width:CW});
    });
    doc.moveTo(M+60,bm+190).lineTo(W-M-60,bm+190).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(10).font('Helvetica').fillColor(C.muted)
      .text('support@leanglehrlab.com', M, bm+204, {align:'center',width:CW});
    doc.rect(0,0,W,40).fill(C.navy);
    doc.fontSize(8).font('Helvetica').fillColor(C.white)
      .text('© 2025 LEANGLE HR LAB  |  All rights reserved  |  Confidential',
        M, 14, {align:'center',width:CW});

    doc.end();
  });
}
