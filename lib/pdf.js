// lib/pdf.js - HYBRID: Fixes + Proper Content Rendering
import PDFDocument from 'pdfkit';

const C = {
  navy: '#132030', steel: '#4A7FA5', steelL: '#E8EFF5', dark: '#1a1a1a', mid: '#666666', muted: '#8A9BB0', black: '#000000', white: '#ffffff', border: '#D0D8E0', lightG: '#F5F8FB', gold: '#D4A574', green: '#6BA583',
};

const STYLE_COLORS = { Visionary: '#2E5090', Executor: '#C85A3A', Architect: '#5B7C99', Collaborative: '#4A7FA5', Directive: '#8B5A2B', Empathetic: '#A85A89', Analytical: '#6B8E99', Recognition: '#4A7FA5', Autonomy: '#7A6B4A', Mastery: '#5A7A9A', Purpose: '#6A8A7A' };

const STYLE_META = { Visionary: { tagline: 'The Forward Thinker' }, Executor: { tagline: 'The Results Driver' }, Architect: { tagline: 'The Systems Builder' }, Recognition: { tagline: 'The People Magnifier' }, Collaborative: { tagline: 'The Bridge Builder' }, Directive: { tagline: 'The Clear Leader' }, Empathetic: { tagline: 'The Heart-Centered Leader' }, Analytical: { tagline: 'The Data-Driven Leader' }, Autonomy: { tagline: 'The Independent Leader' }, Mastery: { tagline: 'The Excellence Seeker' }, Purpose: { tagline: 'The Mission-Driven Leader' } };

const STRESS_PROFILES = { Visionary: [['Under Pressure', 'Becomes more visionary', C.gold], ['High Stakes', 'Thrives on big challenges', C.steel], ['Ambiguity', 'Energized and creates direction', C.green]], Recognition: [['Under Pressure', 'Focuses on team morale', C.gold], ['High Stakes', 'Brings team together', C.steel], ['Ambiguity', 'Seeks clarity through dialogue', C.green]], default: [['Under Pressure', 'Adapts based on context', C.gold], ['High Stakes', 'Focuses on priorities', C.steel], ['Ambiguity', 'Builds frameworks', C.green]] };

const HOW_OTHERS = { Visionary: [['Direct Reports', 'See you as inspiring leader', C.gold], ['Peers', 'View you as strategic', C.steel], ['Leadership', 'Value your vision', C.green]], Recognition: [['Direct Reports', 'Feel genuinely seen', C.gold], ['Peers', 'Appreciate your ability', C.steel], ['Leadership', 'Value culture impact', C.green]], default: [['Direct Reports', 'Appreciate your clarity', C.gold], ['Peers', 'Respect your consistency', C.steel], ['Leadership', 'Value your results', C.green]] };

const TEAM_COMPAT = { default: [['Works Best With', 'Leaders who complement your style', C.gold], ['Potential Friction', 'Opposite styles may clash', C.steel], ['Growth Opportunity', 'Appreciate diverse approaches', C.green]] };

const ROADMAP = { default: [['Week 1-4', C.gold, 'Build self-awareness. Notice triggers.'], ['Week 5-8', C.steel, 'Experiment with one new behavior.'], ['Week 9-12', C.green, 'Solidify the change.']] };

const BOOKS = { Visionary: [['The Innovators Dilemma', 'Clayton Christensen', 'Why leaders must build lasting structures.'], ['Multipliers', 'Liz Wiseman', 'Amplify intelligence around you.'], ['The Hard Thing', 'Ben Horowitz', 'Through execution challenges.']], Recognition: [['Dare to Lead', 'Brene Brown', 'Vulnerability as superpower.'], ['Multipliers', 'Liz Wiseman', 'See people genuinely.'], ['Radical Candor', 'Kim Scott', 'Care with challenge.']], default: [['Drive', 'Daniel Pink', 'Science of motivation.'], ['Essentialism', 'Greg McKeown', 'Do less, better.'], ['Deep Work', 'Cal Newport', 'Excellence through focus.']] };

const BRAND_STATEMENTS = { Visionary: (name, first) => `${name} is a Visionary leader who transforms organisations by seeing possibilities before others can articulate them.`, Executor: (name, first) => `${name} is an Executor leader who creates high-performing teams by turning strategy into results.`, Recognition: (name, first) => `${name} is a Recognition leader who creates cultures by making people feel genuinely seen and valued.`, default: (name, first, style) => `${name} is a ${style} leader who creates high-performing teams through their distinctive approach.` };

function getTagline(style) { return STYLE_META[style]?.tagline || 'The Distinctive Leader'; }
function getStyleColor(style) { return STYLE_COLORS[style] || C.steel; }
function getStressProfile(style) { return STRESS_PROFILES[style] || STRESS_PROFILES['default']; }
function getHowOthers(style) { return HOW_OTHERS[style] || HOW_OTHERS['default']; }
function getTeamCompat(style) { return TEAM_COMPAT[style] || TEAM_COMPAT['default']; }
function getRoadmap(style) { return ROADMAP[style] || ROADMAP['default']; }
function getBooks(style) { return BOOKS[style] || BOOKS['default']; }
function getBrandStatement(name, first, style) { const fn = BRAND_STATEMENTS[style] || BRAND_STATEMENTS['default']; return fn(name, first, style); }
function clean(text) { return (text || '').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim(); }

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 62, bufferPages: false });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 62, CW = W - M * 2;
    const styleColor = getStyleColor(primaryStyle), tagline = getTagline(primaryStyle), books = getBooks(primaryStyle), stressProfile = getStressProfile(primaryStyle), howOthers = getHowOthers(primaryStyle), teamCompat = getTeamCompat(primaryStyle), roadmap = getRoadmap(primaryStyle), firstName = leaderName ? leaderName.split(' ')[0] : 'You', brandStatement = getBrandStatement(leaderName || 'This leader', firstName, primaryStyle);

    let y = 0, pageNum = 0;

    const addPage = (isFirst = false) => {
      if (!isFirst) doc.addPage();
      pageNum++;
      doc.rect(0, 0, W, H).fill(C.white);
      doc.rect(0, 0, W, 4).fill(C.steel);
      doc.rect(0, 4, W, 40).fill(C.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(C.steel).text('LEANGLE HR LAB', M, 16, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor(C.muted).text('  |  ' + quizTitle.toUpperCase(), { continued: false });
      doc.fontSize(8).font('Helvetica').fillColor(C.muted).text(`${pageNum}`, W - M - 20, 22, { width: 20, align: 'right' });
      doc.moveTo(M, 46).lineTo(W - M, 46).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M, H - 28).lineTo(W - M, H - 28).strokeColor(C.border).lineWidth(0.5).stroke();
      const footerText = leaderName ? `Prepared for ${leaderName}  |  LEANGLE HR LAB  |  Confidential` : 'LEANGLE HR LAB  |  Confidential';
      doc.fontSize(7).font('Helvetica').fillColor(C.muted).text(footerText, M, H - 20, { width: CW, align: 'center' });
      return 58;
    };

    const needSpace = (needed) => { if (y + needed > H - 40) y = addPage(); };
    const heading = (title, subtitle) => { needSpace(52); y += 10; doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy).text(title.toUpperCase(), M, y, { width: CW, characterSpacing: 0.5 }); y += 16; doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.steel).lineWidth(2.5).stroke(); y += 6; if (subtitle) { doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(C.muted).text(subtitle, M, y, { width: CW }); y += 14; } y += 4; };
    const para = (text) => { const t = clean(text); if (!t) return; const h = doc.heightOfString(t, { width: CW, lineGap: 2 }); needSpace(h + 10); doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(t, M, y, { width: CW, lineGap: 2 }); y += h + 10; };
    const bullet = (text) => { const t = clean(text); if (!t) return; const h = doc.heightOfString(t, { width: CW - 16, lineGap: 2 }); needSpace(h + 9); doc.fontSize(12).font('Helvetica-Bold').fillColor(C.steel).text('>', M, y, { width: 14, lineBreak: false }); doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(t, M + 16, y, { width: CW - 16, lineGap: 2 }); y += h + 9; };
    const quoteBox = (text) => { const t = `"${clean(text).replace(/^["']/,'').replace(/["']$/,'')}"`;  const h = doc.heightOfString(t, { width: CW - 32 }) + 32; needSpace(h + 10); doc.rect(M, y, CW, h).fill(C.lightG); doc.rect(M, y, 4, h).fill(C.steel); doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.border).lineWidth(0.5).stroke(); doc.moveTo(M, y + h).lineTo(W
cat > ~/Downloads/leangle/lib/pdf.js << 'EOFPDF'
// lib/pdf.js - HYBRID: Fixes + Proper Content Rendering
import PDFDocument from 'pdfkit';

const C = {
  navy: '#132030', steel: '#4A7FA5', steelL: '#E8EFF5', dark: '#1a1a1a', mid: '#666666', muted: '#8A9BB0', black: '#000000', white: '#ffffff', border: '#D0D8E0', lightG: '#F5F8FB', gold: '#D4A574', green: '#6BA583',
};

const STYLE_COLORS = { Visionary: '#2E5090', Executor: '#C85A3A', Architect: '#5B7C99', Collaborative: '#4A7FA5', Directive: '#8B5A2B', Empathetic: '#A85A89', Analytical: '#6B8E99', Recognition: '#4A7FA5', Autonomy: '#7A6B4A', Mastery: '#5A7A9A', Purpose: '#6A8A7A' };

const STYLE_META = { Visionary: { tagline: 'The Forward Thinker' }, Executor: { tagline: 'The Results Driver' }, Architect: { tagline: 'The Systems Builder' }, Recognition: { tagline: 'The People Magnifier' }, Collaborative: { tagline: 'The Bridge Builder' }, Directive: { tagline: 'The Clear Leader' }, Empathetic: { tagline: 'The Heart-Centered Leader' }, Analytical: { tagline: 'The Data-Driven Leader' }, Autonomy: { tagline: 'The Independent Leader' }, Mastery: { tagline: 'The Excellence Seeker' }, Purpose: { tagline: 'The Mission-Driven Leader' } };

const STRESS_PROFILES = { Visionary: [['Under Pressure', 'Becomes more visionary', C.gold], ['High Stakes', 'Thrives on big challenges', C.steel], ['Ambiguity', 'Energized and creates direction', C.green]], Recognition: [['Under Pressure', 'Focuses on team morale', C.gold], ['High Stakes', 'Brings team together', C.steel], ['Ambiguity', 'Seeks clarity through dialogue', C.green]], default: [['Under Pressure', 'Adapts based on context', C.gold], ['High Stakes', 'Focuses on priorities', C.steel], ['Ambiguity', 'Builds frameworks', C.green]] };

const HOW_OTHERS = { Visionary: [['Direct Reports', 'See you as inspiring leader', C.gold], ['Peers', 'View you as strategic', C.steel], ['Leadership', 'Value your vision', C.green]], Recognition: [['Direct Reports', 'Feel genuinely seen', C.gold], ['Peers', 'Appreciate your ability', C.steel], ['Leadership', 'Value culture impact', C.green]], default: [['Direct Reports', 'Appreciate your clarity', C.gold], ['Peers', 'Respect your consistency', C.steel], ['Leadership', 'Value your results', C.green]] };

const TEAM_COMPAT = { default: [['Works Best With', 'Leaders who complement your style', C.gold], ['Potential Friction', 'Opposite styles may clash', C.steel], ['Growth Opportunity', 'Appreciate diverse approaches', C.green]] };

const ROADMAP = { default: [['Week 1-4', C.gold, 'Build self-awareness. Notice triggers.'], ['Week 5-8', C.steel, 'Experiment with one new behavior.'], ['Week 9-12', C.green, 'Solidify the change.']] };

const BOOKS = { Visionary: [['The Innovators Dilemma', 'Clayton Christensen', 'Why leaders must build lasting structures.'], ['Multipliers', 'Liz Wiseman', 'Amplify intelligence around you.'], ['The Hard Thing', 'Ben Horowitz', 'Through execution challenges.']], Recognition: [['Dare to Lead', 'Brene Brown', 'Vulnerability as superpower.'], ['Multipliers', 'Liz Wiseman', 'See people genuinely.'], ['Radical Candor', 'Kim Scott', 'Care with challenge.']], default: [['Drive', 'Daniel Pink', 'Science of motivation.'], ['Essentialism', 'Greg McKeown', 'Do less, better.'], ['Deep Work', 'Cal Newport', 'Excellence through focus.']] };

const BRAND_STATEMENTS = { Visionary: (name, first) => `${name} is a Visionary leader who transforms organisations by seeing possibilities before others can articulate them.`, Executor: (name, first) => `${name} is an Executor leader who creates high-performing teams by turning strategy into results.`, Recognition: (name, first) => `${name} is a Recognition leader who creates cultures by making people feel genuinely seen and valued.`, default: (name, first, style) => `${name} is a ${style} leader who creates high-performing teams through their distinctive approach.` };

function getTagline(style) { return STYLE_META[style]?.tagline || 'The Distinctive Leader'; }
function getStyleColor(style) { return STYLE_COLORS[style] || C.steel; }
function getStressProfile(style) { return STRESS_PROFILES[style] || STRESS_PROFILES['default']; }
function getHowOthers(style) { return HOW_OTHERS[style] || HOW_OTHERS['default']; }
function getTeamCompat(style) { return TEAM_COMPAT[style] || TEAM_COMPAT['default']; }
function getRoadmap(style) { return ROADMAP[style] || ROADMAP['default']; }
function getBooks(style) { return BOOKS[style] || BOOKS['default']; }
function getBrandStatement(name, first, style) { const fn = BRAND_STATEMENTS[style] || BRAND_STATEMENTS['default']; return fn(name, first, style); }
function clean(text) { return (text || '').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim(); }

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 62, bufferPages: false });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 62, CW = W - M * 2;
    const styleColor = getStyleColor(primaryStyle), tagline = getTagline(primaryStyle), books = getBooks(primaryStyle), stressProfile = getStressProfile(primaryStyle), howOthers = getHowOthers(primaryStyle), teamCompat = getTeamCompat(primaryStyle), roadmap = getRoadmap(primaryStyle), firstName = leaderName ? leaderName.split(' ')[0] : 'You', brandStatement = getBrandStatement(leaderName || 'This leader', firstName, primaryStyle);

    let y = 0, pageNum = 0;

    const addPage = (isFirst = false) => {
      if (!isFirst) doc.addPage();
      pageNum++;
      doc.rect(0, 0, W, H).fill(C.white);
      doc.rect(0, 0, W, 4).fill(C.steel);
      doc.rect(0, 4, W, 40).fill(C.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(C.steel).text('LEANGLE HR LAB', M, 16, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor(C.muted).text('  |  ' + quizTitle.toUpperCase(), { continued: false });
      doc.fontSize(8).font('Helvetica').fillColor(C.muted).text(`${pageNum}`, W - M - 20, 22, { width: 20, align: 'right' });
      doc.moveTo(M, 46).lineTo(W - M, 46).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M, H - 28).lineTo(W - M, H - 28).strokeColor(C.border).lineWidth(0.5).stroke();
      const footerText = leaderName ? `Prepared for ${leaderName}  |  LEANGLE HR LAB  |  Confidential` : 'LEANGLE HR LAB  |  Confidential';
      doc.fontSize(7).font('Helvetica').fillColor(C.muted).text(footerText, M, H - 20, { width: CW, align: 'center' });
      return 58;
    };

    const needSpace = (needed) => { if (y + needed > H - 40) y = addPage(); };
    const heading = (title, subtitle) => { needSpace(52); y += 10; doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy).text(title.toUpperCase(), M, y, { width: CW, characterSpacing: 0.5 }); y += 16; doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.steel).lineWidth(2.5).stroke(); y += 6; if (subtitle) { doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(C.muted).text(subtitle, M, y, { width: CW }); y += 14; } y += 4; };
    const para = (text) => { const t = clean(text); if (!t) return; const h = doc.heightOfString(t, { width: CW, lineGap: 2 }); needSpace(h + 10); doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(t, M, y, { width: CW, lineGap: 2 }); y += h + 10; };
    const bullet = (text) => { const t = clean(text); if (!t) return; const h = doc.heightOfString(t, { width: CW - 16, lineGap: 2 }); needSpace(h + 9); doc.fontSize(12).font('Helvetica-Bold').fillColor(C.steel).text('>', M, y, { width: 14, lineBreak: false }); doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(t, M + 16, y, { width: CW - 16, lineGap: 2 }); y += h + 9; };
    const quoteBox = (text) => { const t = `"${clean(text).replace(/^["']/,'').replace(/["']$/,'')}"`;  const h = doc.heightOfString(t, { width: CW - 32 }) + 32; needSpace(h + 10); doc.rect(M, y, CW, h).fill(C.lightG); doc.rect(M, y, 4, h).fill(C.steel); doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.border).lineWidth(0.5).stroke(); doc.moveTo(M, y + h).lineTo(W - M, y + h).strokeColor(C.border).lineWidth(0.5).stroke(); doc.fontSize(12).font('Helvetica-Oblique').fillColor(C.navy).text(t, M + 14, y + 14, { width: CW - 28 }); y += h + 10; };
    const infoBox = (label, body, color) => { const t = clean(body), labelW = CW * 0.24, bodyW = CW * 0.76 - 16, bH = Math.max(doc.heightOfString(t, { width: bodyW, lineGap: 2 }) + 22, 44); needSpace(bH + 8); doc.rect(M, y, labelW, bH).fill(C.lightG); doc.rect(M, y, 4, bH).fill(color || C.steel); doc.rect(M + labelW, y, CW - labelW, bH).fill(C.white); doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.border).lineWidth(0.5).stroke(); doc.moveTo(M, y + bH).lineTo(W - M, y + bH).strokeColor(C.border).lineWidth(0.5).stroke(); doc.fontSize(9.5).font('Helvetica-Bold').fillColor(color || C.steel).text(label, M + 8, y + 11, { width: labelW - 12 }); doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(t, M + labelW + 12, y + 10, { width: bodyW, lineGap: 2 }); y += bH + 8; };
    const barRow = (label, score, color, bold) => { needSpace(20); const maxW = CW - 120; doc.fontSize(bold ? 10.5 : 10).font(bold ? 'Helvetica-Bold' : 'Helvetica').fillColor(bold ? C.navy : C.mid).text((bold ? '● ' : '') + label, M, y, { width: 118, lineBreak: false }); doc.rect(M + 122, y + 2, maxW, 11).fill(C.border); if (score > 0) doc.rect(M + 122, y + 2, maxW * (score / 10), 11).fill(color); doc.fontSize(9.5).font('Helvetica-Bold').fillColor(color).text(`${score}/10`, M + 122 + maxW + 8, y); y += 20; };
    const brandBox = (text) => { const h = doc.heightOfString(text, { width: CW - 40, lineGap: 3 }) + 38; needSpace(h + 10); doc.rect(M, y, CW, h).fill(C.steelL); doc.rect(M, y, CW, h).strokeColor(C.steel).lineWidth(2).stroke(); doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy).text(text, M + 20, y + 17, { width: CW - 40, align: 'center', lineGap: 3 }); y += h + 10; };
    const roadmapBox = (title, color, body) => { const bodyW = CW * 0.72 - 16, bH = Math.max(doc.heightOfString(body, { width: bodyW, lineGap: 2 }) + 22, 46); needSpace(bH + 8); doc.rect(M, y, CW * 0.26, bH).fill(C.lightG); doc.rect(M, y, 4, bH).fill(color); doc.rect(M + CW * 0.26, y, CW * 0.74, bH).fill(C.white); doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.border).lineWidth(0.5).stroke(); doc.moveTo(M, y + bH).lineTo(W - M, y + bH).strokeColor(C.border).lineWidth(0.5).stroke(); doc.fontSize(10.5).font('Helvetica-Bold').fillColor(color).text(title, M + 8, y + 10, { width: CW * 0.26 - 14 }); doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(body, M + CW * 0.26 + 12, y + 10, { width: bodyW, lineGap: 2 }); y += bH + 8; };
    const bookBox = (title, author, reason, color) => { const bodyW = CW * 0.63 - 16, bH = Math.max(doc.heightOfString(reason, { width: bodyW, lineGap: 2 }) + 28, 58); needSpace(bH + 8); doc.rect(M, y, CW * 0.35, bH).fill(C.lightG); doc.rect(M, y, 4, bH).fill(color); doc.rect(M + CW * 0.35, y, CW * 0.65, bH).fill(C.white); doc.moveTo(M, y).lineTo(W - M, y).strokeColor(C.border).lineWidth(0.5).stroke(); doc.moveTo(M, y + bH).lineTo(W - M, y + bH).strokeColor(C.border).lineWidth(0.5).stroke(); doc.fontSize(10.5).font('Helvetica-Bold').fillColor(C.navy).text(title, M + 10, y + 10, { width: CW * 0.35 - 16 }); const tH2 = doc.heightOfString(title, { width: CW * 0.35 - 16 }); doc.fontSize(9).font('Helvetica-Oblique').fillColor(C.mid).text(author, M + 10, y + 10 + tH2 + 3, { width: CW * 0.35 - 16 }); doc.fontSize(10.5).font('Helvetica').fillColor(C.black).text(reason, M + CW * 0.35 + 12, y + 10, { width: bodyW, lineGap: 2 }); y += bH + 8; };

    // COVER
    doc.rect(0, 0, W, H).fill(C.white);
    doc.rect(0, H - 112, W, 112).fill(C.navy);
    doc.rect(0, H - 116, W, 4).fill(C.steel);
    doc.rect(0, 0, W, 66).fill(C.navy);
    doc.rect(0, 66, W, 4).fill(C.steel);
    doc.fontSize(28).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H - 68, { align: 'center', width: CW });
    const hY = H - 90;
    doc.moveTo(W / 2 - 74, hY).lineTo(W / 2 - 22, hY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.moveTo(W / 2 + 22, hY).lineTo(W / 2 + 74, hY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', W / 2 - 22, hY - 8, { width: 44, align: 'center' });
    const ct = H - 118, cb = 68, ch = ct - cb;
    const cp = f => cb + ch * (1 - f);
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('P R E M I U M   L E A D E R S H I P   R E P O R T', M, cp(0.06), { align: 'center', width: CW });
    doc.fontSize(23).font('Helvetica-Bold').fillColor(C.navy).text(quizTitle, M, cp(0.15), { align: 'center', width: CW });
    doc.moveTo(M + 36, cp(0.23)).lineTo(W - M - 36, cp(0.23)).strokeColor(C.steel).lineWidth(0.8).stroke();
    const pW = 136, pH = 30, pX = (W - pW) / 2, pY = cp(0.31) - pH;
    doc.roundedRect(pX, pY, pW, pH, 15).fill(C.steelL);
    doc.roundedRect(pX, pY, pW, pH, 15).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.steel).text(primaryStyle, pX, pY + 8, { align: 'center', width: pW });
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('Prepared exclusively for', M, cp(0.42), { align: 'center', width: CW });
    doc.fontSize(21).font('Helvetica-Bold').fillColor(C.navy).text(leaderName || 'Your Name', M, cp(0.51), { align: 'center', width: CW });
    doc.moveTo(M + 36, cp(0.59)).lineTo(W - M - 36, cp(0.59)).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(C.navy).text("WHAT'S INSIDE", M, cp(0.65), { align: 'center', width: CW });
    const iL = ["Leadership DNA", "3 Superpowers", "Growth Edge", "30-Day Plan", "Stress Profile"];
    const iR = ["Others Experience", "Team Compatibility", "90-Day Roadmap", "Leadership Brand", "Certificate"];
    const cw2 = 140, x1 = W / 2 - cw2 - 10, x2 = W / 2 + 10;
    const yS = cp(0.71), rG = (cp(0.71) - cp(0.94)) / 5;
    doc.fontSize(9.5).font('Helvetica').fillColor(C.dark);
    for (let j = 0; j < 5; j++) { doc.text('+ ' + iL[j], x1, yS - j * rG, { width: cw2 }); doc.text('+ ' + iR[j], x2, yS - j * rG, { width: cw2 }); }
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.white).text('Leadership Report', M, 42, { align: 'center', width: CW });

    // DASHBOARD
    y = addPage();
    const cardH = 64;
    doc.rect(M, y, CW, cardH).fill(C.lightG);
    doc.rect(M, y, 6, cardH).fill(styleColor);
    doc.rect(M, y, CW, cardH).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY STYLE', M + 14, y + 10);
    doc.fontSize(17).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, M + 14, y + 22);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid).text(`"${tagline}"`, M + 14, y + 44);
    if (leaderName) {
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PREPARED FOR', W - M - 170, y + 10, { width: 170, align: 'right' });
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(leaderName, W - M - 170, y + 22, { width: 170, align: 'right' });
      doc.fontSize(10).font('Helvetica').fillColor(C.mid).text(quizTitle, W - M - 170, y + 44, { width: 170, align: 'right' });
    }
    y += cardH + 16;
    heading('Your Style Profile', 'Score breakdown');
    barRow(primaryStyle, 8, styleColor, true);
    barRow('Secondary Strength', 5, C.steel, false);
    barRow('Supporting Style', 3, C.mid, false);
    y += 10;
    heading('Leadership Dimensions');
    const dims = [['People Focus', 9], ['Visibility Drive', 8], ['Speed to Act', 7], ['Data & Analysis', 5], ['Collaborative Pull', 8]];
    dims.forEach(([d, s]) => barRow(d, s, C.steel, false));

    // REPORT CONTENT
    y = addPage();
    const lines = reportContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.match(/^[-=]{3,}$/)) continue;
      if (line.startsWith('##')) { heading(line.replace(/^#+\s+/, '')); continue; }
      if (line.startsWith('- ')) { bullet(line.replace(/^-\s*/, '')); continue; }
      if (line.startsWith('"') && line.endsWith('"')) { quoteBox(line); continue; }
      if (line && !line.startsWith('#')) para(line);
    }

    // Brand Statement
    y = addPage();
    heading('Leadership Brand Statement');
    para('A leadership brand statement captures who you are as a leader:');
    y += 4;
    brandBox(brandStatement);

    // Stress
    needSpace(60);
    heading('Your Stress & Pressure Profile');
    stressProfile.forEach(([label, body, col]) => { infoBox(label, body, col); y += 2; });

    // Others
    needSpace(60);
    heading('How Others Experience You');
    para('This reveals how you are perceived by key groups around you.');
    howOthers.forEach(([label, body, col]) => { infoBox(label, body, col); y += 2; });

    // Team
    needSpace(60);
    heading('Team Compatibility Guide');
    teamCompat.forEach(([label, body, col]) => { infoBox(label, body, col); y += 2; });

    // Roadmap
    needSpace(60);
    heading('90-Day Growth Roadmap');
    roadmap.forEach(([title, col, body]) => { roadmapBox(title, col, body); y += 2; });

    // Books
    needSpace(60);
    heading('Recommended Reading');
    const bColors = [C.gold, C.steel, C.green];
    books.slice(0, 3).forEach(([title, author, reason], idx) => { bookBox(title, author, reason, bColors[idx]); y += 2; });

    // CERTIFICATE
    doc.addPage();
    doc.rect(0, 0, W, H).fill(C.white);
    doc.rect(12, 12, W - 24, H - 24).strokeColor(C.navy).lineWidth(2).stroke();
    doc.rect(18, 18, W - 36, H - 36).strokeColor(C.steel).lineWidth(1).stroke();
    [[20, H - 20], [W - 20, H - 20], [20, 20], [W - 20, 20]].forEach(([cx, cy]) => { doc.circle(cx, cy, 6).fill(C.steel); doc.circle(cx, cy, 2.5).fill(C.white); });
    doc.rect(12, H - 88, W - 24, 76).fill(C.navy);
    doc.fontSize(22).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H - 58, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', M, H - 38, { align: 'center', width: CW });
    const cm = H / 2;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(C.steel).text('C E R T I F I C A T E', M, cm - 112, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('This certifies that', M, cm - 54, { align: 'center', width: CW });
    doc.fontSize(28).font('Helvetica-Bold').fillColor(C.navy).text(leaderName || 'Leader', M, cm - 20, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica').fillColor(C.muted).text('has completed', M, cm + 24, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel).text(quizTitle, M, cm + 44, { align: 'center', width: CW });
    const bpW = 164, bpH = 34, bpX = (W - bpW) / 2, bpY = cm + 88;
    doc.roundedRect(bpX, bpY, bpW, bpH, 17).fill(C.steelL);
    doc.roundedRect(bpX, bpY, bpW, bpH, 17).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY STYLE', bpX, bpY + 6, { align: 'center', width: bpW });
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, bpX, bpY + 18, { align: 'center', width: bpW });
    doc.rect(12, 12, W - 24, 44).fill(C.navy);
    doc.fontSize(8.5).font('Helvetica').fillColor(C.white).text('Confidential — prepared exclusively for the named individual.', M, 28, { align: 'center', width: CW });

    // BACK COVER
    doc.addPage();
    doc.rect(0, 0, W, H).fill(C.white);
    doc.rect(0, H - 106, W, 106).fill(C.navy);
    doc.rect(0, H - 110, W, 4).fill(C.steel);
    doc.fontSize(26).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H - 64, { align: 'center', width: CW });
    const bhY = H - 82;
    doc.moveTo(W / 2 - 66, bhY).lineTo(W / 2 - 22, bhY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.moveTo(W / 2 + 22, bhY).lineTo(W / 2 + 66, bhY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', W / 2 - 22, bhY - 8, { width: 44, align: 'center' });
    const bm = (H - 110) / 2;
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text('Thank you for your leadership.', M, bm - 86, { align: 'center', width: CW });
    doc.moveTo(M + 40, bm - 64).lineTo(W - M - 40, bm - 64).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(11).font('Helvetica-Oblique').fillColor(C.mid).text('"Leadership is daily practice of self-awareness, courage, and care."', M, bm - 50, { align: 'center', width: CW, lineGap: 4 });
    doc.moveTo(M + 40, bm + 10).lineTo(W - M - 40, bm + 10).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(C.steel).text('EXPLORE ASSESSMENTS', M, bm + 26, { align: 'center', width: CW });
    const assessments = ['Communication', 'Conflict', 'Feedback', 'Decision', 'Motivation', 'Stress', 'Personality'];
    doc.fontSize(10).font('Helvetica').fillColor(C.dark);
    assessments.forEach((item, j) => { doc.text(item, M, bm + 44 + j * 18, { align: 'center', width: CW }); });
    doc.moveTo(M + 60, bm + 180).lineTo(W - M - 60, bm + 180).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('support@leanglehrlab.com', M, bm + 194, { align: 'center', width: CW });
    doc.rect(0, 0, W, 40).fill(C.navy);
    doc.fontSize(8).font('Helvetica').fillColor(C.white).text('© 2024 LEANGLE HR LAB | All rights reserved', M, 14, { align: 'center', width: CW });

    doc.end();
  });
}
