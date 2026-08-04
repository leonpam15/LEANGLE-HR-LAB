// lib/pdf.js
// Generates a premium branded PDF report using pdfkit.
// White background, print-friendly, Letter size, all sections included.

import PDFDocument from 'pdfkit';

const C = {
  navy:   '#1A2535',
  steel:  '#3A6E9A',
  steelL: '#D4E6F5',
  white:  '#FFFFFF',
  black:  '#1A1A1A',
  dark:   '#2D3748',
  mid:    '#4A5568',
  muted:  '#718096',
  lightG: '#F0F4F8',
  border: '#CBD5E0',
  gold:   '#8B6914',
  green:  '#276749',
  purple: '#553C9A',
  orange: '#9C4221',
  red:    '#9B2C2C',
};

const STYLE_COLORS = {
  Collaborative: C.steel, Directive: C.orange, Empathetic: C.green, Analytical: C.purple,
  Mediator: C.green, Confronter: C.orange, Avoider: C.steel, Collaborator: C.purple,
  Coach: C.green, Challenger: C.orange, Connector: C.steel, Analyst: C.purple,
  Instinctive: C.orange, Consensus: C.steel, Methodical: C.purple, Adaptive: C.green,
  Autonomy: C.steel, Mastery: C.purple, Purpose: C.green, Recognition: C.gold,
  Fighter: C.orange, Fixer: C.steel, Freezer: C.purple,
  Visionary: C.steel, Executor: C.orange, Connector2: C.green, Architect: C.purple,
};

const BOOKS = {
  Recognition: [['The Courage to Be Disliked','Ichiro Kishimi','Challenges your need for external approval with radical clarity. Essential for Recognition leaders.'],['Multipliers','Liz Wiseman','Shows how the best leaders amplify intelligence around them. Aligned with your instinct to make people feel seen.'],['Dare to Lead','Brené Brown','Reframes visibility and vulnerability as leadership strengths.']],
  Autonomy: [['Drive','Daniel Pink','The science of motivation — autonomy, mastery, purpose. The first section is written for you.'],['Essentialism','Greg McKeown','About doing less but better on your own terms.'],['The E-Myth Revisited','Michael Gerber','For leaders who want to build something on their own terms.']],
  Mastery: [['Deep Work','Cal Newport','The definitive guide to achieving excellence through focused effort.'],['Mindset','Carol Dweck','Reframes excellence-seeking from fixed achievement to continuous growth.'],['So Good They Cannot Ignore You','Cal Newport','Makes the case for career capital through craft.']],
  Purpose: [["Man's Search for Meaning",'Viktor Frankl','The most profound exploration of purpose ever written.'],['Start With Why','Simon Sinek','The business case for purpose-driven leadership.'],['The Second Mountain','David Brooks','On moving from achievement to contribution.']],
  Collaborative: [['The Culture Code','Daniel Coyle','The definitive guide to building belonging in teams.'],['Multipliers','Liz Wiseman','Shows how the best leaders amplify intelligence.'],['Turn the Ship Around','L. David Marquet','A masterclass in distributed leadership.']],
  Directive: [['Extreme Ownership','Jocko Willink','The philosophy of total accountability for directive leaders.'],['High Output Management','Andy Grove','The bible of results-driven leadership.'],['The Hard Thing About Hard Things','Ben Horowitz','Honest direct leadership under pressure.']],
  Empathetic: [['Dare to Lead','Brené Brown','Reframes vulnerability and care as leadership superpowers.'],['Radical Candor','Kim Scott','Shows how to combine genuine care with direct challenge.'],['The Empathy Edge','Maria Ross','Makes the business case for leading with care.']],
  Analytical: [['Thinking, Fast and Slow','Daniel Kahneman','The foundational text on how decisions are really made.'],['The Signal and the Noise','Nate Silver','A masterclass in what data tells us and what it does not.'],['Superforecasting','Philip Tetlock','How the best analytical minds make predictions.']],
};

function getStyleColor(style) { return STYLE_COLORS[style] || C.steel; }
function getBooks(style) { return BOOKS[style] || BOOKS['Recognition']; }

function cleanText(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').replace(/^---+$/,'').trim();
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margins: { top: 48, bottom: 48, left: 62, right: 62 }, bufferPages: true });
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width;
    const H = doc.page.height;
    const M = 62;
    const CW = W - M * 2;
    const styleColor = getStyleColor(primaryStyle);
    const books = getBooks(primaryStyle);
    const firstName = leaderName ? leaderName.split(' ')[0] : 'You';

    let pageNum = 0;

    // ── HELPERS ──────────────────────────────────────────────────────────────
    const whitePage = () => {
      doc.rect(0, 0, W, H).fill(C.white);
    };

    const drawHeader = () => {
      whitePage();
      doc.rect(0, 0, W, 4).fill(C.steel);
      doc.rect(0, 4, W, 40).fill(C.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(C.steel)
        .text('LEANGLE HR LAB', M, 16);
      doc.fontSize(7).font('Helvetica').fillColor(C.muted)
        .text(quizTitle.toUpperCase(), M, 28);
      doc.fontSize(8).font('Helvetica').fillColor(C.muted)
        .text(`Page ${pageNum}`, W - M - 30, 22, { width: 30, align: 'right' });
      doc.moveTo(M, 46).lineTo(W - M, 46).strokeColor(C.border).lineWidth(0.5).stroke();
    };

    const drawFooter = () => {
      doc.moveTo(M, H - 26).lineTo(W - M, H - 26).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(7).font('Helvetica').fillColor(C.muted)
        .text(leaderName ? `Prepared for ${leaderName}  ·  LEANGLE HR LAB  ·  Confidential` : 'LEANGLE HR LAB  ·  Confidential',
          M, H - 18, { width: CW, align: 'center' });
    };

    const newPage = (isFirst = false) => {
      if (!isFirst) doc.addPage();
      pageNum++;
      drawHeader();
      drawFooter();
      return 56;
    };

    const checkY = (y, needed) => {
      if (y + needed > H - 36) return newPage();
      return y;
    };

    const sectionHeading = (y, title, subtitle) => {
      y = checkY(y, 50);
      y += 10;
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy)
        .text(title.toUpperCase(), M, y, { width: CW, characterSpacing: 0.3 });
      y += 17;
      doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.steel).lineWidth(3).stroke();
      y += 7;
      if (subtitle) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.muted).text(subtitle, M, y, { width: CW });
        y += 15;
      }
      return y + 4;
    };

    const bodyText = (y, text) => {
      const clean = cleanText(text);
      if (!clean) return y;
      const h = doc.heightOfString(clean, { width: CW, lineGap: 3 });
      y = checkY(y, h + 10);
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(clean, M, y, { width: CW, lineGap: 3 });
      return y + h + 10;
    };

    const bulletText = (y, text) => {
      const clean = cleanText(text);
      if (!clean) return y;
      const h = doc.heightOfString(clean, { width: CW - 18, lineGap: 2 });
      y = checkY(y, h + 10);
      doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel).text('›', M, y - 1, { width: 16 });
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(clean, M + 18, y, { width: CW - 18, lineGap: 2 });
      return y + h + 8;
    };

    const weekBlock = (y, title, action, why) => {
      const tH = doc.heightOfString(cleanText(title), { width: CW - 26 }) + 4;
      const aH = action ? doc.heightOfString(cleanText(action), { width: CW - 44 }) + 8 : 0;
      const wH = why ? doc.heightOfString(cleanText(why), { width: CW - 44 }) + 8 : 0;
      const blockH = tH + aH + wH + 28;
      y = checkY(y, blockH + 10);
      doc.rect(M, y, CW, blockH).fill(C.lightG);
      doc.rect(M, y, 4, blockH).fill(C.steel);
      doc.moveTo(M, y).lineTo(W-M, y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M, y+blockH).lineTo(W-M, y+blockH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(C.navy).text(cleanText(title), M+12, y+12, { width: CW-26 });
      let ty = y + tH + 14;
      if (action) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel).text('Action: ', M+12, ty, { continued: true });
        doc.font('Helvetica').fillColor(C.dark).text(cleanText(action), { width: CW - 42 });
        ty += aH;
      }
      if (why) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid).text(cleanText(why), M+12, ty, { width: CW-26 });
      }
      return y + blockH + 10;
    };

    const infoBlock = (y, label, body, color) => {
      const cleanBody = cleanText(body);
      const bH = doc.heightOfString(cleanBody, { width: CW * 0.75 - 20, lineGap: 2 });
      const blockH = Math.max(bH + 24, 48);
      y = checkY(y, blockH + 10);
      doc.rect(M, y, CW * 0.23, blockH).fill(C.lightG);
      doc.rect(M, y, 4, blockH).fill(color || C.steel);
      doc.rect(M + CW * 0.23, y, CW * 0.77, blockH).fill(C.white);
      doc.moveTo(M, y).lineTo(W-M, y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M, y+blockH).lineTo(W-M, y+blockH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(10).font('Helvetica-Bold').fillColor(color || C.steel)
        .text(label, M+8, y+12, { width: CW*0.23-14 });
      doc.fontSize(11).font('Helvetica').fillColor(C.black)
        .text(cleanBody, M+CW*0.23+12, y+10, { width: CW*0.77-20, lineGap: 2 });
      return y + blockH + 8;
    };

    const quoteBlock = (y, text) => {
      const clean = `"${cleanText(text).replace(/^["']|["']$/g,'')}"`;
      const h = doc.heightOfString(clean, { width: CW - 42 }) + 38;
      y = checkY(y, h + 10);
      doc.rect(M, y, CW, h).fill(C.lightG);
      doc.rect(M, y, 5, h).fill(C.steel);
      doc.moveTo(M, y).lineTo(W-M, y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M, y+h).lineTo(W-M, y+h).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(13).font('Helvetica-Oblique').fillColor(C.navy).text(clean, M+18, y+16, { width: CW-38 });
      return y + h + 10;
    };

    const brandBox = (y, text) => {
      const h = doc.heightOfString(text, { width: CW - 46, lineGap: 4 }) + 42;
      y = checkY(y, h + 10);
      doc.rect(M, y, CW, h).fill(C.steelL);
      doc.rect(M, y, CW, h).strokeColor(C.steel).lineWidth(2).stroke();
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy)
        .text(text, M+22, y+18, { width: CW-44, align: 'center', lineGap: 4 });
      return y + h + 10;
    };

    const scoreBar = (y, label, score, color, isPrimary) => {
      const maxW = CW - 130;
      doc.fontSize(isPrimary ? 11 : 10).font(isPrimary ? 'Helvetica-Bold' : 'Helvetica')
        .fillColor(isPrimary ? C.navy : C.mid)
        .text((isPrimary ? '● ' : '  ') + label, M, y+1, { width: 118 });
      doc.rect(M+122, y, maxW, 14).fill(C.border);
      if (score > 0) doc.rect(M+122, y, maxW*(score/10), 14).fill(color);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(color)
        .text(`${score}/10`, M+122+maxW+8, y+1);
      return y + 22;
    };

    // ── COVER PAGE ────────────────────────────────────────────────────────────
    doc.rect(0, 0, W, H).fill(C.white);
    // Top navy bar
    doc.rect(0, H-115, W, 115).fill(C.navy);
    doc.rect(0, H-118, W, 3).fill(C.steel);
    // Bottom navy bar
    doc.rect(0, 0, W, 68).fill(C.navy);
    doc.rect(0, 68, W, 3).fill(C.steel);
    // Logo
    doc.fontSize(30).font('Helvetica').fillColor(C.white)
      .text('L E A N G L E', M, H-70, { align: 'center', width: CW });
    const hrY = H-93;
    doc.moveTo(W/2-78, hrY).lineTo(W/2-26, hrY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.moveTo(W/2+26, hrY).lineTo(W/2+78, hrY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel)
      .text('H R   L A B', W/2-24, hrY-7, { width: 48, align: 'center' });
    // Content area
    const cTop = H-121; const cBot = 71; const cH = cTop-cBot;
    const cp = (f) => cBot + cH*(1-f);
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel)
      .text('P R E M I U M   L E A D E R S H I P   R E P O R T', M, cp(0.06), { align: 'center', width: CW });
    doc.fontSize(24).font('Helvetica-Bold').fillColor(C.navy)
      .text(quizTitle, M, cp(0.15), { align: 'center', width: CW });
    doc.moveTo(M+36, cp(0.23)).lineTo(W-M-36, cp(0.23)).strokeColor(C.steel).lineWidth(0.8).stroke();
    // Style pill
    const pW=140, pH=32, pX=(W-pW)/2, pY=cp(0.32)-pH;
    doc.roundedRect(pX, pY, pW, pH, 16).fill(C.steelL);
    doc.roundedRect(pX, pY, pW, pH, 16).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel)
      .text(primaryStyle, pX, pY+8, { align: 'center', width: pW });
    doc.fontSize(10).font('Helvetica').fillColor(C.muted)
      .text('Prepared exclusively for', M, cp(0.43), { align: 'center', width: CW });
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.navy)
      .text(leaderName || 'Your Name', M, cp(0.52), { align: 'center', width: CW });
    doc.moveTo(M+36, cp(0.60)).lineTo(W-M-36, cp(0.60)).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.fontSize(10).font('Helvetica-Bold').fillColor(C.navy)
      .text("WHAT'S INSIDE THIS REPORT", M, cp(0.66), { align: 'center', width: CW });
    const iL=['✓   Leadership DNA Analysis','✓   3 Signature Superpowers','✓   Growth Edge & Derailers','✓   30-Day Action Plan','✓   Stress & Pressure Profile'];
    const iR=['✓   How Others Experience You','✓   Team Compatibility Guide','✓   90-Day Growth Roadmap','✓   Your Leadership Brand','✓   Certificate of Completion'];
    const cw2=148, x1=W/2-cw2-8, x2=W/2+8;
    const yS=cp(0.72), rG=(cp(0.72)-cp(0.96))/5;
    doc.fontSize(10).font('Helvetica').fillColor(C.dark);
    for(let j=0;j<5;j++){
      doc.text(iL[j],x1,yS-j*rG,{width:cw2});
      doc.text(iR[j],x2,yS-j*rG,{width:cw2});
    }
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.white)
      .text('Your Personalised Leadership Intelligence Report', M, 44, { align: 'center', width: CW });

    // ── PAGE 2: PROFILE DASHBOARD ─────────────────────────────────────────────
    let y = newPage(true);

    // Profile card
    const cardH = 68;
    doc.rect(M, y, CW, cardH).fill(C.lightG);
    doc.rect(M, y, 6, cardH).fill(C.gold);
    doc.rect(M, y, CW, cardH).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY STYLE', M+14, y+10);
    doc.fontSize(18).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, M+14, y+22);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid).text('"The Impact Seeker"', M+14, y+44);
    if (leaderName) {
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PREPARED FOR', W-M-175, y+10, { width: 175, align: 'right' });
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(leaderName, W-M-175, y+22, { width: 175, align: 'right' });
      doc.fontSize(10).font('Helvetica').fillColor(C.mid).text(quizTitle, W-M-175, y+44, { width: 175, align: 'right' });
    }
    y += cardH + 16;

    // Score bars
    y = sectionHeading(y, 'Your Style Profile', 'Score breakdown across all motivation styles');
    y = scoreBar(y, primaryStyle, 8, styleColor, true);
    y = scoreBar(y, 'Secondary Drivers', 5, C.steel, false);
    y = scoreBar(y, 'Supporting Styles', 3, C.mid, false);
    y += 14;

    // Key dimensions
    y = sectionHeading(y, 'Key Leadership Dimensions');
    const dims = [['People Focus',9],['Visibility Drive',8],['Speed to Act',7],['Data & Analysis',5],['Collaborative Pull',8]];
    for (const [dim, score] of dims) {
      y = scoreBar(y, dim, score, C.steel, false);
    }

    // ── REPORT CONTENT ────────────────────────────────────────────────────────
    y = newPage();
    const lines = reportContent.split('\n');
    let i = 0;
    let prevHeading = '';
    const weekData = [];

    while (i < lines.length) {
      const raw = lines[i].trim(); i++;
      if (!raw || raw.match(/^[-=]{2,}$/)) continue;

      if (raw.startsWith('## ') || raw.startsWith('### ')) {
        const title = raw.replace(/^#+\s+/, '').trim();
        prevHeading = title.toLowerCase();
        y = sectionHeading(y, title);
        continue;
      }

      if (raw.match(/^(Week|Semana)\s+\d+:/i)) {
        const wTitle = raw; let action = '', why = '';
        while (i < lines.length) {
          const nxt = lines[i].trim();
          if (!nxt) { i++; continue; }
          if (nxt.match(/^Action:/i)) { action = nxt.replace(/^Action:\s*/i,''); i++; }
          else if (nxt.match(/^Why it matters:/i)) { why = nxt.replace(/^Why it matters:\s*/i,''); i++; }
          else if (nxt.startsWith('##') || nxt.match(/^(Week|Semana)\s+\d+:/i)) break;
          else i++;
        }
        y = weekBlock(y, wTitle, action, why);
        continue;
      }

      if (raw.match(/^Superpower\s+\d+:/i)) {
        y = checkY(y, 26);
        doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy).text(cleanText(raw), M, y, { width: CW });
        y += 20;
        continue;
      }

      if (raw.startsWith('- ') || raw.startsWith('• ')) {
        y = bulletText(y, raw.replace(/^[-•]\s*/,''));
        continue;
      }

      const isSpecial = prevHeading.includes('mantra') || prevHeading.includes('question');
      if (isSpecial && raw.length > 10 && !raw.startsWith('#')) {
        y = quoteBlock(y, raw);
        continue;
      }

      y = bodyText(y, raw);
    }

    // ── LEADERSHIP BRAND ──────────────────────────────────────────────────────
    y = sectionHeading(y, 'Your Leadership Brand Statement', 'Use this in interviews, bios, and LinkedIn');
    y = bodyText(y, `A Leadership Brand Statement captures who you are as a leader in a single memorable paragraph, based on your ${primaryStyle} profile:`);
    y = brandBox(y, `${leaderName || 'This leader'} is a ${primaryStyle} leader who creates high-performing cultures by making people feel genuinely seen and valued. Known for transforming disengaged teams, delivering results with energy and precision, and building environments where talent wants to stay, ${firstName} leads from the belief that recognition is not a reward — it is a strategy.`);
    y = bodyText(y, 'Feel free to personalise this. The most powerful version sounds like you — direct, specific, and grounded in real examples from your leadership experience.');

    // ── STRESS PROFILE ─────────────────────────────────────────────────────────
    y = newPage();
    y = sectionHeading(y, 'Your Stress & Pressure Profile', 'How your motivation style shifts under different pressure levels');
    for (const [label, body, col] of [
      ['Mild Pressure', `You perform exceptionally well under mild pressure. The stakes activate your best qualities — energy, focus, and the ability to rally others. This is where you are at your most magnetic as a ${primaryStyle} leader.`, C.steel],
      ['Sustained Pressure', 'You may begin making decisions optimised for how they look rather than what is right. Watch for the gap between your public confidence and private uncertainty — it widens under sustained stress.', C.purple],
      ['Severe Burnout', 'Motivation can disappear rapidly when your core driver is absent. Recovery requires deliberately reconnecting to intrinsic purpose — why this work matters beyond the external reward.', C.orange],
      ['Derailer to Watch', 'Approval-seeking under stress. Seeking validation before acting, over-communicating wins to manage perception, or avoiding difficult conversations to protect your image.', C.red],
    ]) {
      y = infoBlock(y, label, body, col); y += 8;
    }

    // ── HOW OTHERS EXPERIENCE YOU ─────────────────────────────────────────────
    y += 6;
    y = sectionHeading(y, 'How Others Experience You', 'The gap between how you see yourself and how you are perceived');
    y = bodyText(y, `Most assessments only show you how you see yourself. This section reveals how you are likely experienced by the three most important groups around you — based on your ${primaryStyle} profile.`);
    for (const [label, body, col] of [
      ['Your Direct Reports', `They experience you as energising, visible, and genuinely interested in their success. They feel seen when you are at your best. When you are stressed or distracted, they may wonder what they did wrong.`, C.steel],
      ['Your Peers', 'They experience you as magnetic and competitive in equal measure. You raise the energy in any room. They will respect you more when you actively share credit for shared wins.', C.green],
      ['Your Manager / Stakeholders', 'They experience you as a high-visibility performer who delivers with flair. They trust you with important projects. Their watch-out: they may question whether you sustain performance on unglamorous long-term work.', C.purple],
    ]) {
      y = infoBlock(y, label, body, col); y += 8;
    }

    // ── TEAM COMPATIBILITY ────────────────────────────────────────────────────
    y = newPage();
    y = sectionHeading(y, 'Your Team Compatibility Guide', 'How to work most effectively with each motivation style');
    for (const [label, body, col] of [
      ['With Autonomy Leaders', 'Give them ownership and celebrate their outcomes publicly. They outperform when trusted without interference. Your energy can feel intrusive — give them space then celebrate the result.', C.steel],
      ['With Mastery Leaders', 'Name their craft specifically — not just what they delivered but how exceptionally well they did it. Slow down enough to acknowledge depth not just speed.', C.purple],
      ['With Purpose Leaders', 'Connect their work visibly to the mission. Natural allies — you bring energy; they bring meaning. Together you create cultures people want to join.', C.green],
      ['With Recognition Leaders', 'High energy and high performance — and high competition. Actively share the spotlight. Build rituals that celebrate both of you. The partnership is exceptional when ego is managed well.', C.gold],
    ]) {
      y = infoBlock(y, label, body, col); y += 8;
    }

    // ── 90-DAY ROADMAP ────────────────────────────────────────────────────────
    y += 6;
    y = sectionHeading(y, 'Your 90-Day Leadership Growth Roadmap', 'Sustained development across three months of intentional practice');
    for (const [title, col, body] of [
      ['Days 1–30: Install the Habits', C.steel, 'Establish your recognition ritual. Map invisible contributors. Complete your first invisible-decision audit. The goal is habit installation not transformation. By day 30 you should have a structural recognition system running.'],
      ['Days 31–60: Deepen and Expand', C.purple, 'Expand recognition to people you have never publicly acknowledged. Begin your long-game milestone map. Introduce a peer-feedback ritual. Notice where your energy drops — that is where your growth edge lives.'],
      ['Days 61–90: Test Under Real Pressure', C.green, 'The real test of leadership development is what you do when the stakes are high. Identify one high-stakes moment and consciously apply your growth edge. This is where real change becomes permanent.'],
    ]) {
      const bH = Math.max(doc.heightOfString(body, { width: CW*0.72-20, lineGap: 2 }) + 26, 48);
      y = checkY(y, bH + 10);
      doc.rect(M, y, CW*0.26, bH).fill(C.lightG);
      doc.rect(M, y, 5, bH).fill(col);
      doc.rect(M+CW*0.26, y, CW*0.74, bH).fill(C.white);
      doc.moveTo(M, y).lineTo(W-M, y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M, y+bH).lineTo(W-M, y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(col).text(title, M+8, y+12, { width: CW*0.26-14 });
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(body, M+CW*0.26+12, y+10, { width: CW*0.74-20, lineGap: 2 });
      y += bH + 8;
    }

    // ── BOOK RECOMMENDATIONS ──────────────────────────────────────────────────
    y = newPage();
    y = sectionHeading(y, `Recommended Reading for ${primaryStyle} Leaders`, 'Curated specifically for your style — not a generic list');
    y = bodyText(y, `These three books were selected specifically for your ${primaryStyle} leadership style. Each speaks directly to your greatest strengths and most important growth edges.`);
    const bookColors = [C.gold, C.steel, C.green];
    for (let b = 0; b < Math.min(books.length, 3); b++) {
      const [title, author, reason] = books[b];
      const bH = Math.max(doc.heightOfString(reason, { width: CW*0.64-20, lineGap: 2 }) + 28, 60);
      y = checkY(y, bH + 10);
      doc.rect(M, y, CW*0.34, bH).fill(C.lightG);
      doc.rect(M, y, 5, bH).fill(bookColors[b]);
      doc.rect(M+CW*0.34, y, CW*0.66, bH).fill(C.white);
      doc.moveTo(M, y).lineTo(W-M, y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M, y+bH).lineTo(W-M, y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(C.navy).text(title, M+10, y+10, { width: CW*0.34-16 });
      doc.fontSize(9).font('Helvetica-Oblique').fillColor(C.mid).text(author, M+10, y+10+doc.heightOfString(title,{width:CW*0.34-16})+4, { width: CW*0.34-16 });
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(reason, M+CW*0.34+12, y+10, { width: CW*0.66-20, lineGap: 2 });
      y += bH + 8;
    }

    // ── CERTIFICATE ───────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, W, H).fill(C.white);
    doc.rect(0.16*72, 0.16*72, W-0.32*72, H-0.32*72).strokeColor(C.navy).lineWidth(2).stroke();
    doc.rect(0.24*72, 0.24*72, W-0.48*72, H-0.48*72).strokeColor(C.steel).lineWidth(1).stroke();
    for (const [cx, cy] of [[0.34*72,H-0.34*72],[W-0.34*72,H-0.34*72],[0.34*72,0.34*72],[W-0.34*72,0.34*72]]) {
      doc.circle(cx, cy, 6).fill(C.steel);
      doc.circle(cx, cy, 2.5).fill(C.white);
    }
    doc.rect(0.16*72, H-1.18*72, W-0.32*72, 1.0*72).fill(C.navy);
    doc.fontSize(22).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H-0.64*72, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', M, H-0.86*72, { align: 'center', width: CW });
    const cMid = (H - 1.18*72) / 2 + 10;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(C.steel).text('C E R T I F I C A T E   O F   L E A D E R S H I P', M, cMid-108, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel).text('S E L F - A W A R E N E S S', M, cMid-88, { align: 'center', width: CW });
    doc.moveTo(M+36, cMid-70).lineTo(W-M-36, cMid-70).strokeColor(C.gold).lineWidth(1.5).stroke();
    doc.fontSize(12).font('Helvetica').fillColor(C.muted).text('This is to certify that', M, cMid-48, { align: 'center', width: CW });
    doc.fontSize(30).font('Helvetica-Bold').fillColor(C.navy).text(leaderName || 'Leader Name', M, cMid-14, { align: 'center', width: CW });
    doc.moveTo(W/2-90, cMid+22).lineTo(W/2+90, cMid+22).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(11).font('Helvetica').fillColor(C.muted).text('has successfully completed the', M, cMid+30, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel).text(quizTitle, M, cMid+50, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('Leadership Assessment by LEANGLE HR LAB', M, cMid+70, { align: 'center', width: CW });
    const bpW=168, bpH=36, bpX=(W-bpW)/2, bpY=cMid+96;
    doc.roundedRect(bpX, bpY, bpW, bpH, 18).fill(C.steelL);
    doc.roundedRect(bpX, bpY, bpW, bpH, 18).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY LEADERSHIP STYLE', bpX, bpY+6, { align: 'center', width: bpW });
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, bpX, bpY+18, { align: 'center', width: bpW });
    const sigY = cMid+150;
    doc.moveTo(M+28, sigY).lineTo(M+158, sigY).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.moveTo(W-M-158, sigY).lineTo(W-M-28, sigY).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.fontSize(9).font('Helvetica').fillColor(C.muted).text('LEANGLE HR LAB', M+28, sigY+6, { width: 130, align: 'center' });
    doc.text('Date of Completion', W-M-158, sigY+6, { width: 130, align: 'center' });
    doc.rect(0.16*72, 0.16*72, W-0.32*72, 0.5*72).fill(C.navy);
    doc.fontSize(9).font('Helvetica').fillColor(C.white).text('Confidential — prepared exclusively for the named individual.', M, 0.3*72, { align: 'center', width: CW });

    // ── BACK COVER ────────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, W, H).fill(C.white);
    doc.rect(0, H-1.4*72, W, 1.4*72).fill(C.navy);
    doc.rect(0, H-1.44*72, W, 4).fill(C.steel);
    doc.fontSize(26).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H-0.78*72, { align: 'center', width: CW });
    const bhrY = H-0.98*72;
    doc.moveTo(W/2-68, bhrY).lineTo(W/2-24, bhrY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.moveTo(W/2+24, bhrY).lineTo(W/2+68, bhrY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', W/2-24, bhrY-8, { width: 48, align: 'center' });
    const bMid = (H - 1.44*72) / 2;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.navy).text('Thank you for investing in your leadership.', M, bMid-90, { align: 'center', width: CW });
    doc.moveTo(M+40, bMid-68).lineTo(W-M-40, bMid-68).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(12).font('Helvetica-Oblique').fillColor(C.mid)
      .text('"Leadership is not a destination.\nIt is a daily practice of self-awareness, courage, and care."', M, bMid-52, { align: 'center', width: CW, lineGap: 4 });
    doc.moveTo(M+40, bMid+8).lineTo(W-M-40, bMid+8).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel).text('EXPLORE ALL 7 ASSESSMENTS', M, bMid+24, { align: 'center', width: CW });
    const assessments = ['💬  Leadership Communication Style','⚡  Conflict Resolution Style','🎙️  Feedback Style','⚖️  Decision-Making Style','🔋  What Motivates You at Work','🌡️  Workplace Stress Response','🧠  Leadership Personality Type'];
    doc.fontSize(10).font('Helvetica').fillColor(C.dark);
    assessments.forEach((item, j) => { doc.text(item, M, bMid+44+j*20, { align: 'center', width: CW }); });
    doc.moveTo(M+60, bMid+194).lineTo(W-M-60, bMid+194).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('support@leanglehrlab.com', M, bMid+210, { align: 'center', width: CW });
    doc.rect(0, 0, W, 40).fill(C.navy);
    doc.fontSize(8).font('Helvetica').fillColor(C.white).text('© 2025 LEANGLE HR LAB  ·  All rights reserved  ·  Confidential', M, 14, { align: 'center', width: CW });

    doc.end();
  });
}
