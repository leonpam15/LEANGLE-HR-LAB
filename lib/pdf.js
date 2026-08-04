// lib/pdf.js
// Generates a full 12-page premium branded PDF report using pdfkit.
// Called from stripe-webhook.js after payment confirmed.

import PDFDocument from 'pdfkit';

// Brand colors
const C = {
  navyD:  '#0F1823',
  navy:   '#1A2535',
  steel:  '#4A7FA5',
  white:  '#FFFFFF',
  light:  '#E8EEF4',
  muted:  '#8A9BB0',
  accent: '#1e3a4a',
  gold:   '#B8965A',
  green:  '#4A9B7F',
  purple: '#7B6FA5',
  orange: '#C0622F',
  red:    '#C05050',
};

const STYLE_COLORS = {
  Collaborative: C.steel,  Directive: C.orange,  Empathetic: C.green,   Analytical: C.purple,
  Mediator:      C.green,  Confronter: C.orange, Avoider: C.steel,      Collaborator: C.purple,
  Coach:         C.green,  Challenger: C.orange, Connector: C.steel,    Analyst: C.purple,
  Instinctive:   C.orange, Consensus: C.steel,   Methodical: C.purple,  Adaptive: C.green,
  Autonomy:      C.steel,  Mastery: C.purple,    Purpose: C.green,      Recognition: C.gold,
  Fighter:       C.orange, Fixer: C.steel,       Freezer: C.purple,     Connector2: C.green,
};

const BOOKS_BY_STYLE = {
  Collaborative:  [
    ['The Culture Code', 'Daniel Coyle', 'The definitive guide to building belonging and safety in teams — perfectly aligned with your instinct to create inclusion.'],
    ['Multipliers', 'Liz Wiseman', 'Shows how the best leaders amplify the intelligence around them. Essential for Bridge Builders.'],
    ['Turn the Ship Around', 'L. David Marquet', 'A masterclass in distributed leadership and shared ownership — your natural territory.'],
  ],
  Directive: [
    ['Extreme Ownership', 'Jocko Willink', 'The philosophy of total accountability that underpins the most effective directive leaders.'],
    ['High Output Management', 'Andy Grove', 'The bible of results-driven leadership. Speaks directly to your strength in driving clarity and pace.'],
    ['The Hard Thing About Hard Things', 'Ben Horowitz', 'Honest, direct leadership under pressure. You will recognise yourself in every chapter.'],
  ],
  Empathetic: [
    ['Dare to Lead', 'Brené Brown', 'Reframes vulnerability and care as leadership superpowers. Validates and deepens your natural approach.'],
    ['The Empathy Edge', 'Maria Ross', 'Makes the business case for leading with care — essential reading for Human-First leaders.'],
    ['Radical Candor', 'Kim Scott', 'Shows how to combine genuine care with direct challenge. Your most important growth edge, in book form.'],
  ],
  Analytical: [
    ['Thinking, Fast and Slow', 'Daniel Kahneman', 'The foundational text on how decisions are really made. Will sharpen your already rigorous analytical mind.'],
    ['The Signal and the Noise', 'Nate Silver', 'A masterclass in what data actually tells us — and what it does not. Essential for Evidence-Led leaders.'],
    ['Superforecasting', 'Philip Tetlock', 'How the best analytical minds make predictions. Directly applicable to your leadership style.'],
  ],
  Recognition: [
    ['The Courage to Be Disliked', 'Ichiro Kishimi', 'Challenges your need for external approval with radical clarity. Essential for Recognition leaders who want to lead from conviction.'],
    ['Multipliers', 'Liz Wiseman', 'Shows how the best leaders amplify intelligence around them. Aligned with your instinct to make people feel seen.'],
    ['Dare to Lead', 'Brené Brown', 'Reframes visibility and vulnerability as leadership strengths. Will deepen your self-awareness around why recognition matters.'],
  ],
  Mastery: [
    ['Deep Work', 'Cal Newport', 'The definitive guide to achieving excellence through focused effort. Speaks directly to your drive for mastery.'],
    ['Mindset', 'Carol Dweck', 'Reframes excellence-seeking from fixed achievement to continuous growth. Transformative for Mastery leaders.'],
    ['So Good They Cannot Ignore You', 'Cal Newport', 'Makes the case for career capital through craft. Validates and deepens your core motivation.'],
  ],
  Purpose: [
    ['Man\'s Search for Meaning', 'Viktor Frankl', 'The most profound exploration of purpose ever written. Will resonate deeply with your core motivation.'],
    ['Start With Why', 'Simon Sinek', 'The business case for purpose-driven leadership. Your natural language, made into strategy.'],
    ['The Second Mountain', 'David Brooks', 'On moving from achievement to contribution. The Mission Carrier\'s essential companion.'],
  ],
  Autonomy: [
    ['Drive', 'Daniel Pink', 'The science of motivation — autonomy, mastery, purpose. The first section is written for you.'],
    ['Essentialism', 'Greg McKeown', 'About doing less but better on your own terms. Speaks directly to the Independent Driver.'],
    ['The E-Myth Revisited', 'Michael Gerber', 'For leaders who want to build something on their own terms without it consuming them.'],
  ],
};

function getBooks(style) {
  return BOOKS_BY_STYLE[style] || BOOKS_BY_STYLE['Recognition'];
}

function getStyleColor(style) {
  return STYLE_COLORS[style] || C.steel;
}

function cleanText(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^#+\s+/, '')
    .replace(/^---+$/, '')
    .trim();
}

function parseReportSections(reportContent) {
  const sections = [];
  let current = null;
  let items = [];

  for (const rawLine of reportContent.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (current) sections.push({ title: current, items });
      current = line.replace(/^#+\s+/, '').trim();
      items = [];
    } else if (line && !line.match(/^[-=]{2,}$/)) {
      items.push(line);
    }
  }
  if (current) sections.push({ title: current, items });
  return sections;
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 55, bottom: 55, left: 55, right: 55 },
      info: {
        Title: `${quizTitle} — LEANGLE HR LAB`,
        Author: 'LEANGLE HR LAB',
        Subject: `Leadership Report — ${primaryStyle}`,
      },
    });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width;
    const H = doc.page.height;
    const M = 55;
    const CW = W - M * 2;
    const styleColor = getStyleColor(primaryStyle);
    const books = getBooks(primaryStyle);
    const sections = parseReportSections(reportContent);
    let pageNum = 0;

    // ── HELPERS ──────────────────────────────────────────────────────────────
    const drawBg = () => {
      doc.rect(0, 0, W, H).fill(C.navyD);
      doc.rect(0, H - 6, W, 6).fill(C.steel);
    };

    const drawHeader = (title) => {
      doc.rect(0, 0, W, 6).fill(C.steel);
      doc.rect(0, 6, W, 44).fill(C.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(C.steel)
        .text('LEANGLE HR LAB', M, 18, { characterSpacing: 2 });
      doc.fontSize(7).font('Helvetica').fillColor(C.muted)
        .text(title.toUpperCase(), M, 29, { characterSpacing: 1 });
      doc.fontSize(8).font('Helvetica').fillColor(C.muted)
        .text(`Page ${pageNum}`, W - M - 30, 23, { width: 30, align: 'right' });
      doc.moveTo(M, 50).lineTo(W - M, 50).strokeColor(C.steel).lineWidth(0.5).stroke();
    };

    const drawFooter = (name) => {
      doc.fontSize(7).font('Helvetica').fillColor(C.muted)
        .text(
          name ? `Prepared for ${name}  ·  LEANGLE HR LAB  ·  Confidential` : 'LEANGLE HR LAB  ·  Confidential',
          M, H - 25, { width: CW, align: 'center' }
        );
    };

    const newPage = (title) => {
      if (pageNum > 0) doc.addPage();
      pageNum++;
      drawBg();
      drawHeader(title || quizTitle);
      drawFooter(leaderName);
      return 72;
    };

    const checkY = (y, needed, title) => {
      if (y + needed > H - 65) return newPage(title);
      return y;
    };

    const sectionHeading = (y, title, pageTitle) => {
      y = checkY(y, 50, pageTitle);
      y += 8;
      doc.rect(M, y, CW, 28).fill(C.navy);
      doc.rect(M, y, 4, 28).fill(C.steel);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel)
        .text(title.toUpperCase(), M + 12, y + 9, { width: CW - 20, characterSpacing: 1.2 });
      return y + 38;
    };

    const bodyText = (y, text, pageTitle) => {
      const clean = cleanText(text);
      if (!clean) return y;
      const h = doc.heightOfString(clean, { width: CW, lineGap: 3 });
      y = checkY(y, h + 10, pageTitle);
      doc.fontSize(10).font('Helvetica').fillColor(C.light)
        .text(clean, M, y, { width: CW, lineGap: 3 });
      return y + h + 10;
    };

    const bulletText = (y, text, pageTitle) => {
      const clean = cleanText(text);
      if (!clean) return y;
      const h = doc.heightOfString(clean, { width: CW - 18, lineGap: 2 });
      y = checkY(y, h + 10, pageTitle);
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.steel).text('›', M, y - 1, { width: 14 });
      doc.fontSize(10).font('Helvetica').fillColor(C.light)
        .text(clean, M + 16, y, { width: CW - 18, lineGap: 2 });
      return y + h + 8;
    };

    const weekBlock = (y, title, action, why, pageTitle) => {
      const actionH = action ? doc.heightOfString(action, { width: CW - 50 }) + 8 : 0;
      const whyH = why ? doc.heightOfString(why, { width: CW - 50 }) + 8 : 0;
      const blockH = 28 + actionH + whyH + 10;
      y = checkY(y, blockH + 12, pageTitle);
      doc.rect(M, y, CW, blockH).fill(C.accent);
      doc.rect(M, y, 3, blockH).fill(C.steel);
      doc.fontSize(11).font('Helvetica-Bold').fillColor(C.white).text(cleanText(title), M + 12, y + 10, { width: CW - 24 });
      let ty = y + 26;
      if (action) {
        doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('Action: ', M + 12, ty, { continued: true, width: 60 });
        doc.font('Helvetica').fillColor(C.light).text(cleanText(action), { width: CW - 40 });
        ty += actionH;
      }
      if (why) {
        doc.fontSize(9).font('Helvetica-Oblique').fillColor(C.muted).text(cleanText(why), M + 12, ty, { width: CW - 24 });
      }
      return y + blockH + 10;
    };

    const infoBlock = (y, label, body, color, pageTitle) => {
      const bh = doc.heightOfString(cleanText(body), { width: CW * 0.72 - 20 }) + 24;
      const lh = Math.max(bh, 40);
      y = checkY(y, lh + 8, pageTitle);
      doc.rect(M, y, CW * 0.26, lh).fill(C.accent);
      doc.rect(M, y, 3, lh).fill(color || C.steel);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(C.white)
        .text(label, M + 10, y + 12, { width: CW * 0.26 - 16 });
      doc.rect(M + CW * 0.26, y, CW * 0.74, lh).fill(C.navy);
      doc.fontSize(10).font('Helvetica').fillColor(C.light)
        .text(cleanText(body), M + CW * 0.26 + 12, y + 10, { width: CW * 0.74 - 20, lineGap: 2 });
      return y + lh + 6;
    };

    const mantraBlock = (y, text, pageTitle) => {
      const clean = `"${cleanText(text).replace(/^["']|["']$/g, '')}"`;
      const h = doc.heightOfString(clean, { width: CW - 40 }) + 36;
      y = checkY(y, h + 12, pageTitle);
      doc.rect(M, y, CW, h).fill(C.accent);
      doc.rect(M, y, 4, h).fill(C.gold);
      doc.fontSize(13).font('Helvetica-Oblique').fillColor(C.white)
        .text(clean, M + 18, y + 16, { width: CW - 36 });
      return y + h + 12;
    };

    // ── COVER PAGE ────────────────────────────────────────────────────────────
    pageNum++;
    drawBg();
    doc.circle(W - 55, H - 145, 130).fillOpacity(0.05).fill(C.steel).fillOpacity(1);
    doc.circle(55, 145, 90).fillOpacity(0.05).fill(C.steel).fillOpacity(1);

    doc.fontSize(30).font('Helvetica').fillColor(C.white)
      .text('LEANGLE', M, 85, { align: 'center', width: CW, characterSpacing: 12 });
    const hrY = 126;
    doc.moveTo(W/2 - 76, hrY).lineTo(W/2 - 28, hrY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel)
      .text('HR LAB', W/2 - 26, hrY - 5, { characterSpacing: 5, width: 52, align: 'center' });
    doc.moveTo(W/2 + 28, hrY).lineTo(W/2 + 76, hrY).strokeColor(C.steel).lineWidth(1).stroke();

    doc.moveTo(M, 154).lineTo(W - M, 154).strokeColor(C.steel).lineWidth(0.5).stroke();
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel)
      .text('PREMIUM LEADERSHIP REPORT', M, 170, { align: 'center', width: CW, characterSpacing: 3 });
    doc.fontSize(20).font('Helvetica-Bold').fillColor(C.white)
      .text(quizTitle, M, 200, { align: 'center', width: CW });

    const pW = 170, pH = 34, pX = (W - pW) / 2, pY = 248;
    doc.roundedRect(pX, pY, pW, pH, 17).fillOpacity(0.18).fill(C.steel).fillOpacity(1);
    doc.roundedRect(pX, pY, pW, pH, 17).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel)
      .text(primaryStyle, pX, pY + 10, { align: 'center', width: pW });

    doc.moveTo(M + 80, 300).lineTo(W - M - 80, 300).strokeColor(C.steel).lineWidth(0.5).stroke();

    if (leaderName) {
      doc.fontSize(9).font('Helvetica').fillColor(C.muted)
        .text(`Prepared exclusively for  ${leaderName}`, M, 315, { align: 'center', width: CW });
    }
    doc.fontSize(8).font('Helvetica').fillColor(C.muted)
      .text('LEANGLE HR LAB  ·  Confidential', M, leaderName ? 330 : 315, { align: 'center', width: CW });

    doc.fontSize(11).font('Helvetica-Bold').fillColor(C.white)
      .text('Your Personalised Leadership Intelligence Report', M, H - 185, { align: 'center', width: CW });
    doc.fontSize(9).font('Helvetica').fillColor(C.muted)
      .text('For personal development use only', M, H - 165, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica').fillColor(C.muted)
      .text('leangle-hr-lab-assessments.vercel.app', M, H - 30, { align: 'center', width: CW });

    // ── REPORT CONTENT PAGES ──────────────────────────────────────────────────
    let y = newPage();
    const lines = reportContent.split('\n');
    let prevHeading = '';
    let weekData = [];
    let i = 0;

    while (i < lines.length) {
      const raw = lines[i].trim();
      i++;
      if (!raw || raw.match(/^[-=]{2,}$/)) continue;

      if (raw.startsWith('## ') || raw.startsWith('### ')) {
        const title = raw.replace(/^#+\s+/, '').trim();
        prevHeading = title.toLowerCase();
        y = sectionHeading(y, title, quizTitle);
        continue;
      }

      // Week blocks
      if (raw.match(/^(Week|Semana)\s+\d+:/i)) {
        const wTitle = raw;
        let action = '', why = '';
        while (i < lines.length) {
          const nxt = lines[i].trim();
          if (!nxt) { i++; continue; }
          if (nxt.match(/^(Action|Acción):/i)) { action = nxt.replace(/^(Action|Acción):\s*/i, ''); i++; }
          else if (nxt.match(/^(Why it matters|Por qué importa):/i)) { why = nxt.replace(/^(Why it matters|Por qué importa):\s*/i, ''); i++; }
          else if (nxt.startsWith('##') || nxt.match(/^(Week|Semana)\s+\d+:/i)) break;
          else i++;
        }
        const focus = wTitle.replace(/^(Week|Semana)\s+\d+:\s*/i, '');
        weekData.push([focus.substring(0, 28), action.substring(0, 40)]);
        y = weekBlock(y, wTitle, action, why, quizTitle);

        if (weekData.length === 4) {
          y += 4;
          y = sectionHeading(y, 'Your 30-Day Roadmap', quizTitle);
          y = checkY(y, 70, quizTitle);
          // Simple text timeline
          const spacing = CW / 4;
          for (let w = 0; w < 4; w++) {
            const x = M + spacing * w + spacing / 2;
            doc.circle(x, y + 20, 14).fill(C.steel);
            doc.fontSize(9).font('Helvetica-Bold').fillColor(C.navyD).text(`W${w+1}`, x - 8, y + 15, { width: 16, align: 'center' });
            const wLabel = weekData[w][0].split(' ').slice(0, 2).join(' ');
            doc.fontSize(7).font('Helvetica-Bold').fillColor(C.light).text(wLabel, x - 30, y + 38, { width: 60, align: 'center' });
          }
          for (let w = 0; w < 3; w++) {
            const x1 = M + CW / 4 * w + CW / 4 / 2 + 14;
            const x2 = M + CW / 4 * (w + 1) + CW / 4 / 2 - 14;
            doc.moveTo(x1, y + 20).lineTo(x2, y + 20).strokeColor(C.steel).lineWidth(2).stroke();
          }
          y += 60;
        }
        continue;
      }

      // Superpower titles
      if (raw.match(/^Superpower\s+\d+:|^Superpoder\s+\d+:/i)) {
        const clean = cleanText(raw);
        y = checkY(y, 28, quizTitle);
        doc.fontSize(11).font('Helvetica-Bold').fillColor(C.white).text(clean, M, y, { width: CW });
        y += 18;
        continue;
      }

      // Bullets
      if (raw.startsWith('- ') || raw.startsWith('• ') || raw.startsWith('· ')) {
        y = bulletText(y, raw.replace(/^[-•·]\s*/, ''), quizTitle);
        continue;
      }

      // Mantra / Question
      const isSpecial = prevHeading.includes('mantra') || prevHeading.includes('question') || prevHeading.includes('pregunta');
      if (isSpecial && raw.length > 10 && !raw.startsWith('#')) {
        y = mantraBlock(y, raw, quizTitle);
        continue;
      }

      y = bodyText(y, raw, quizTitle);
    }

    // ── STRESS PROFILE ────────────────────────────────────────────────────────
    y = newPage();
    y = sectionHeading(y, 'Your Stress & Pressure Profile', quizTitle);
    y = bodyText(y,
      `Understanding how your motivation style shifts under pressure is one of the most valuable — and most overlooked — leadership insights. Here is what happens to a ${primaryStyle} leader under stress:`,
      quizTitle);
    y += 4;

    const stressLevels = [
      ['Under Mild Pressure', `You perform well. The visibility and stakes activate your best qualities — energy, focus, and the ability to rally others around a shared goal.`, C.steel],
      ['Under Sustained Pressure', `You may begin making decisions optimised for how they look rather than what is right. Watch for the gap between your public confidence and private uncertainty.`, C.purple],
      ['Under Severe Burnout', `You may become withdrawn, seek excessive validation, or lose motivation entirely when recognition disappears. Recovery requires reconnecting to intrinsic purpose.`, C.orange],
      ['Warning Signs to Watch', `Needing constant reassurance, taking credit defensively, avoiding long-term projects, feeling invisible or undervalued despite evidence to the contrary.`, C.red],
    ];
    for (const [label, body, color] of stressLevels) {
      y = infoBlock(y, label, body, color, quizTitle);
    }

    // ── TEAM COMPATIBILITY ────────────────────────────────────────────────────
    y += 8;
    y = sectionHeading(y, 'Your Team Compatibility Guide', quizTitle);
    y = bodyText(y,
      `How does a ${primaryStyle} leader work with each of the other motivation styles? Understanding this is the difference between a good team and an exceptional one.`,
      quizTitle);
    y += 4;

    const compatibilityGuide = {
      Collaborative: ['Bridge Builder', 'Natural allies who share a love of inclusion. Watch for over-consulting when speed is needed.'],
      Directive: ['Clear Commander', 'Complementary but potentially conflicting. You bring warmth; they bring pace. Respect both.'],
      Empathetic: ['Human-First Leader', 'Deep alignment on care. Risk of avoiding hard truths together. Push each other constructively.'],
      Analytical: ['Evidence-Led Leader', 'Creative tension at its best. You bring energy; they bring rigour. Together you are formidable.'],
      Mediator: ['Peacemaker', 'Shared commitment to harmony. Watch for avoiding necessary conflict together.'],
      Confronter: ['Direct Resolver', 'Productive tension. They will push you to address issues you might otherwise avoid.'],
      Avoider: ['Strategic Pauser', 'Complementary — you act; they reflect. Give each other space to operate naturally.'],
      Collaborator: ['Problem-Solver', 'Strong partnership. Both committed to fair, thorough outcomes. Risk of over-engineering.'],
      Coach: ['Growth Guide', 'Natural alignment on development. Together you build exceptional talent pipelines.'],
      Challenger: ['Straight Talker', 'Healthy tension. They will push you toward directness; you push them toward warmth.'],
      Connector: ['Relationship Feeder', 'Deep partnership on people. Risk of prioritising relationships over hard decisions.'],
      Analyst: ['Evidence Builder', 'Complementary strengths. Their data plus your intuition makes powerful decisions.'],
      Instinctive: ['Bold Mover', 'High energy, high risk. Push each other to act — and to reflect.'],
      Consensus: ['People Unifier', 'Natural alignment on inclusion. Risk of slow decisions together.'],
      Methodical: ['Careful Strategist', 'Your pace vs their rigour. Productive friction that leads to better outcomes.'],
      Adaptive: ['Situational Decider', 'Versatile partnership. Together you can operate in almost any environment.'],
      Autonomy: ['Independent Driver', 'Respect their need for space. Give trust, get extraordinary output.'],
      Mastery: ['Excellence Seeker', 'Shared commitment to quality. Risk of perfectionism slowing progress.'],
      Purpose: ['Mission Carrier', 'Deep alignment on meaning. Together you build cultures people want to work in.'],
      Recognition: ['Impact Seeker', 'High energy partnership. Actively share the spotlight to avoid competition.'],
      Fighter: ['Pressure Activator', 'Complementary under stress. Their intensity plus your focus is a powerful combination.'],
      Fixer: ['Problem Eliminator', 'Action-oriented partnership. Risk of fixing symptoms rather than causes.'],
      Freezer: ['Thoughtful Pauser', 'Your action orientation balances their reflection. Give each other time and space.'],
    };

    const allStyles = Object.keys(compatibilityGuide);
    const compatColors = [C.steel, C.purple, C.green, C.gold, C.orange];
    let ci = 0;
    for (const [style, [tagline, desc]] of Object.entries(compatibilityGuide)) {
      if (style === primaryStyle) continue; // skip self
      if (ci >= 4) break; // show top 4 most relevant
      y = infoBlock(y, `${style}\n"${tagline}"`, desc, compatColors[ci % compatColors.length], quizTitle);
      ci++;
    }

    // ── BOOK RECOMMENDATIONS ──────────────────────────────────────────────────
    y = newPage();
    y = sectionHeading(y, 'Recommended Reading for ' + primaryStyle + ' Leaders', quizTitle);
    y = bodyText(y,
      `These three books were selected specifically for your ${primaryStyle} leadership style. Each one speaks directly to your greatest strengths and your most important growth edges.`,
      quizTitle);
    y += 4;

    const bookColors = [C.gold, C.steel, C.green];
    for (let b = 0; b < Math.min(books.length, 3); b++) {
      const [title, author, reason] = books[b];
      const bh = doc.heightOfString(reason, { width: CW * 0.65 - 20 }) + 24;
      const lh = Math.max(bh, 50);
      y = checkY(y, lh + 8, quizTitle);
      doc.rect(M, y, CW * 0.33, lh).fill(C.accent);
      doc.rect(M, y, 4, lh).fill(bookColors[b]);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.white).text(title, M + 10, y + 10, { width: CW * 0.33 - 16 });
      doc.fontSize(8).font('Helvetica-Oblique').fillColor(C.muted).text(author, M + 10, y + 10 + doc.heightOfString(title, { width: CW * 0.33 - 16 }) + 4, { width: CW * 0.33 - 16 });
      doc.rect(M + CW * 0.33, y, CW * 0.67, lh).fill(C.navy);
      doc.fontSize(10).font('Helvetica').fillColor(C.light).text(reason, M + CW * 0.33 + 12, y + 12, { width: CW * 0.67 - 20, lineGap: 2 });
      y += lh + 8;
    }

    // LinkedIn share card
    y += 8;
    y = sectionHeading(y, 'Share Your Leadership Style', quizTitle);
    y = checkY(y, 80, quizTitle);
    doc.rect(M, y, CW, 72).fill(C.accent);
    doc.rect(M, y, 4, 72).fill(C.steel);
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('SHARE ON LINKEDIN:', M + 12, y + 10, { width: CW - 24 });
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(C.light)
      .text(
        `"I just discovered I'm a ${primaryStyle} leader — someone who ${primaryStyle === 'Recognition' ? 'leads by making people feel genuinely seen' : `leads with a ${primaryStyle} motivation style`}. What's your leadership motivation style? Take the free assessment at leangle-hr-lab-assessments.vercel.app"`,
        M + 12, y + 24, { width: CW - 24, lineGap: 2 }
      );
    doc.fontSize(8).font('Helvetica').fillColor(C.steel)
      .text('Copy, personalise, and post. Tag a colleague to find out their style.', M + 12, y + 56, { width: CW - 24 });
    y += 82;

    // ── CERTIFICATE PAGE ──────────────────────────────────────────────────────
    doc.addPage();
    pageNum++;
    // Decorative certificate background
    doc.rect(0, 0, W, H).fill(C.navyD);
    doc.rect(0, 0, W, 6).fill(C.steel);
    doc.roundedRect(14, 14, W - 28, H - 28, 4).strokeColor(C.gold).lineWidth(2).stroke();
    doc.roundedRect(20, 20, W - 40, H - 40, 3).strokeColor(C.steel).lineWidth(0.5).stroke();
    // Corner dots
    for (const [cx2, cy2] of [[30, H-30],[W-30, H-30],[30, 30],[W-30, 30]]) {
      doc.circle(cx2, cy2, 4).fill(C.gold);
    }

    // Certificate content
    let cy = H / 2 - 130;
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.gold)
      .text('C E R T I F I C A T E', M, cy, { align: 'center', width: CW, characterSpacing: 4 });
    cy += 24;
    doc.fontSize(11).font('Helvetica').fillColor(C.muted)
      .text('of Leadership Self-Awareness', M, cy, { align: 'center', width: CW });
    cy += 28;
    doc.fontSize(10).font('Helvetica').fillColor(C.muted)
      .text('This certifies that', M, cy, { align: 'center', width: CW });
    cy += 20;

    if (leaderName) {
      doc.fontSize(28).font('Helvetica-Bold').fillColor(C.white)
        .text(leaderName, M, cy, { align: 'center', width: CW });
      cy += 40;
    }

    doc.fontSize(10).font('Helvetica').fillColor(C.muted)
      .text('has completed the', M, cy, { align: 'center', width: CW });
    cy += 18;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel)
      .text(quizTitle, M, cy, { align: 'center', width: CW });
    cy += 22;
    doc.fontSize(9).font('Helvetica').fillColor(C.muted)
      .text('Leadership Assessment by LEANGLE HR LAB', M, cy, { align: 'center', width: CW });
    cy += 28;

    // Style badge
    const bW = 160, bH = 32, bX = (W - bW) / 2;
    doc.roundedRect(bX, cy, bW, bH, 16).fillOpacity(0.18).fill(C.steel).fillOpacity(1);
    doc.roundedRect(bX, cy, bW, bH, 16).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.steel)
      .text(primaryStyle, bX, cy + 9, { align: 'center', width: bW });
    cy += 48;

    // Signature lines
    doc.moveTo(M + 40, cy).lineTo(M + 180, cy).strokeColor(C.steel).lineWidth(0.5).stroke();
    doc.moveTo(W - M - 180, cy).lineTo(W - M - 40, cy).strokeColor(C.steel).lineWidth(0.5).stroke();
    cy += 8;
    doc.fontSize(8).font('Helvetica').fillColor(C.muted)
      .text('LEANGLE HR LAB', M + 40, cy, { width: 140, align: 'center' });
    doc.fontSize(8).font('Helvetica').fillColor(C.muted)
      .text('Date of Completion', W - M - 180, cy, { width: 140, align: 'center' });

    // ── BACK COVER ────────────────────────────────────────────────────────────
    doc.addPage();
    pageNum++;
    doc.rect(0, 0, W, H).fill(C.navyD);
    doc.rect(0, 0, W, 6).fill(C.steel);
    doc.circle(W/2, H/2, 185).fillOpacity(0.04).fill(C.steel).fillOpacity(1);

    doc.fontSize(24).font('Helvetica').fillColor(C.white)
      .text('LEANGLE', M, H/2 + 52, { align: 'center', width: CW, characterSpacing: 10 });
    const bhrY = H/2 + 24;
    doc.moveTo(W/2 - 70, bhrY).lineTo(W/2 - 26, bhrY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.moveTo(W/2 + 26, bhrY).lineTo(W/2 + 70, bhrY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel)
      .text('HR LAB', W/2 - 26, bhrY - 6, { characterSpacing: 5, width: 52, align: 'center' });

    doc.fontSize(9).font('Helvetica').fillColor(C.muted)
      .text('Leadership Intelligence  ·  Assessment Reports  ·  Executive Development', M, H/2 - 8, { align: 'center', width: CW });
    doc.moveTo(M + 80, H/2 - 28).lineTo(W - M - 80, H/2 - 28).strokeColor(C.steel).lineWidth(0.5).stroke();
    doc.fontSize(9).font('Helvetica').fillColor(C.muted)
      .text('support@leanglehrlab.com', M, H/2 - 46, { align: 'center', width: CW });
    doc.fontSize(9).font('Helvetica').fillColor(C.steel)
      .text('leangle-hr-lab-assessments.vercel.app', M, H/2 - 62, { align: 'center', width: CW });

    doc.end();
  });
}

