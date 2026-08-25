import PDFDocument from 'pdfkit';

const COLORS = { navy: '#132030', steel: '#4A7FA5', lightSteel: '#E8EFF5', dark: '#1a1a1a', mid: '#666666', muted: '#8A9BB0', white: '#ffffff', border: '#D0D8E0', lightBg: '#F5F8FB', gold: '#D4A574', green: '#6BA583' };

const STYLE_CONFIG = { Visionary: { color: '#2E5090', tagline: 'The Forward Thinker' }, Executor: { color: '#C85A3A', tagline: 'The Results Driver' }, Architect: { color: '#5B7C99', tagline: 'The Systems Builder' }, Recognition: { color: '#4A7FA5', tagline: 'The People Magnifier' }, Collaborative: { color: '#4A7FA5', tagline: 'The Bridge Builder' }, Directive: { color: '#8B5A2B', tagline: 'The Clear Leader' }, Empathetic: { color: '#A85A89', tagline: 'The Heart-Centered Leader' }, Analytical: { color: '#6B8E99', tagline: 'The Data-Driven Leader' }, Autonomy: { color: '#7A6B4A', tagline: 'The Independent Leader' }, Mastery: { color: '#5A7A9A', tagline: 'The Excellence Seeker' }, Purpose: { color: '#6A8A7A', tagline: 'The Mission-Driven Leader' } };

function clean(text) { return (text || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/^#+\s+/, '').trim(); }

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', bufferPages: false });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 48, CW = W - M * 2, PAGE_TOP = 60, PAGE_BOTTOM = H - 50;
    const styleConfig = STYLE_CONFIG[primaryStyle] || STYLE_CONFIG.Recognition;
    const firstName = leaderName ? leaderName.split(' ')[0] : 'You';

    let pageNum = 0, currentY = PAGE_TOP;

    const setupPage = (addNew = false) => {
      if (addNew && pageNum > 0) doc.addPage();
      pageNum++;
      currentY = PAGE_TOP;
      doc.rect(0, 0, W, 4).fill(COLORS.steel);
      doc.rect(0, 4, W, 44).fill(COLORS.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(COLORS.steel).text('LEANGLE HR LAB', M, 14, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor(COLORS.muted).text('  |  ' + quizTitle.toUpperCase(), { continued: false });
      doc.fontSize(8).font('Helvetica').fillColor(COLORS.muted).text(`${pageNum}`, W - M - 20, 20, { width: 20, align: 'right' });
      doc.moveTo(M, PAGE_BOTTOM + 10).lineTo(W - M, PAGE_BOTTOM + 10).strokeColor(COLORS.border).lineWidth(0.5).stroke();
      const footerText = leaderName ? `Prepared for ${leaderName.substring(0, 30)}  |  LEANGLE HR LAB` : 'LEANGLE HR LAB';
      doc.fontSize(7).font('Helvetica').fillColor(COLORS.muted).text(footerText, M, H - 18, { width: CW, align: 'center' });
    };

    const ensurePage = (neededHeight) => { if (currentY + neededHeight > PAGE_BOTTOM) setupPage(true); };
    const heading = (title, subtitle = null) => { ensurePage(subtitle ? 45 : 30); currentY += 8; doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.navy).text(title.toUpperCase(), M, currentY, { width: CW }); currentY += 18; doc.moveTo(M, currentY).lineTo(W - M, currentY).strokeColor(styleConfig.color).lineWidth(2).stroke(); currentY += 8; if (subtitle) { doc.fontSize(10).font('Helvetica-Oblique').fillColor(COLORS.muted).text(subtitle, M, currentY, { width: CW }); currentY += 12; } currentY += 4; };
    const paragraph = (text, fontSize = 11, lineGap = 2.5) => { const t = clean(text); if (!t) return; const height = doc.heightOfString(t, { width: CW, lineGap }); ensurePage(height + 8); doc.fontSize(fontSize).font('Helvetica').fillColor(COLORS.dark).text(t, M, currentY, { width: CW, lineGap }); currentY += height + 8; };
    const infoBox = (label, body, color = styleConfig.color) => { const labelWidth = CW * 0.22, bodyWidth = CW - labelWidth - 16, bodyHeight = doc.heightOfString(clean(body), { width: bodyWidth, lineGap: 2 }), boxHeight = Math.max(bodyHeight + 20, 50); ensurePage(boxHeight + 10); doc.rect(M, currentY, labelWidth, boxHeight).fill(COLORS.lightBg); doc.rect(M, currentY, 4, boxHeight).fill(color); doc.rect(M, currentY, labelWidth, boxHeight).strokeColor(COLORS.border).lineWidth(0.5).stroke(); doc.rect(M + labelWidth, currentY, bodyWidth + 12, boxHeight).fill(COLORS.white); doc.rect(M + labelWidth, currentY, bodyWidth + 12, boxHeight).strokeColor(COLORS.border).lineWidth(0.5).stroke(); doc.fontSize(9.5).font('Helvetica-Bold').fillColor(color).text(label, M + 8, currentY + 12, { width: labelWidth - 12 }); doc.fontSize(11).font('Helvetica').fillColor(COLORS.black).text(clean(body), M + labelWidth + 10, currentY + 10, { width: bodyWidth, lineGap: 2 }); currentY += boxHeight + 10; };
    const scoreBar = (label, score, color = COLORS.steel) => { ensurePage(18); const barWidth = CW - 140; doc.fontSize(11).font('Helvetica').fillColor(COLORS.mid).text(label, M, currentY, { width: 130, lineBreak: false }); doc.rect(M + 135, currentY + 3, barWidth, 10).fill(COLORS.border); if (score > 0) doc.rect(M + 135, currentY + 3, barWidth * (score / 10), 10).fill(color); doc.fontSize(10).font('Helvetica-Bold').fillColor(color).text(`${score}/10`, M + 135 + barWidth + 8, currentY); currentY += 18; };

    // COVER
    doc.rect(0, 0, W, H).fill(COLORS.white);
    doc.rect(0, H - 110, W, 110).fill(COLORS.navy);
    doc.rect(0, H - 114, W, 4).fill(COLORS.steel);
    doc.rect(0, 0, W, 60).fill(COLORS.navy);
    doc.rect(0, 60, W, 4).fill(COLORS.steel);
    doc.fontSize(32).font('Helvetica').fillColor(COLORS.white).text('L E A N G L E', M, H - 70, { align: 'center', width: CW });
    const dividerY = H - 88;
    doc.moveTo(W / 2 - 60, dividerY).lineTo(W / 2 - 18, dividerY).strokeColor(COLORS.steel).lineWidth(1).stroke();
    doc.moveTo(W / 2 + 18, dividerY).lineTo(W / 2 + 60, dividerY).strokeColor(COLORS.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.steel).text('H R   L A B', W / 2 - 18, dividerY - 8, { width: 36, align: 'center' });
    const contentTop = 70, contentBot = H - 120, spacing = (contentBot - contentTop) / 6;
    doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.steel).text('PREMIUM LEADERSHIP REPORT', M, contentTop + spacing * 0.5, { align: 'center', width: CW });
    doc.fontSize(24).font('Helvetica-Bold').fillColor(COLORS.navy).text(quizTitle, M, contentTop + spacing * 1.8, { align: 'center', width: CW });
    doc.moveTo(M + 40, contentTop + spacing * 2.6).lineTo(W - M - 40, contentTop + spacing * 2.6).strokeColor(COLORS.steel).lineWidth(0.8).stroke();
    const badgeW = 130, badgeH = 28, badgeX = (W - badgeW) / 2, badgeY = contentTop + spacing * 3.2;
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).fill(COLORS.lightSteel);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).strokeColor(COLORS.steel).lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.steel).text(primaryStyle, badgeX, badgeY + 7, { align: 'center', width: badgeW });
    doc.fontSize(10).font('Helvetica').fillColor(COLORS.muted).text('Prepared exclusively for', M, contentTop + spacing * 4.2, { align: 'center', width: CW });
    doc.fontSize(20).font('Helvetica-Bold').fillColor(COLORS.navy).text(leaderName || 'Your Name', M, contentTop + spacing * 5, { align: 'center', width: CW });
    doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.white).text('Your Personalized Leadership Intelligence Report', M, 30, { align: 'center', width: CW });

    // DASHBOARD
    setupPage(true);
    const profileBoxH = 60;
    doc.rect(M, currentY, CW, profileBoxH).fill(COLORS.lightBg);
    doc.rect(M, currentY, 6, profileBoxH).fill(styleConfig.color);
    doc.rect(M, currentY, CW, profileBoxH).strokeColor(COLORS.steel).lineWidth(1.5).stroke();
    doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.steel).text('PRIMARY STYLE', M + 12, currentY + 10);
    doc.fontSize(16).font('Helvetica-Bold').fillColor(COLORS.navy).text(primaryStyle, M + 12, currentY + 22);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor(COLORS.mid).text(`"${styleConfig.tagline}"`, M + 12, currentY + 42);
    if (leaderName) {
      doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.steel).text('PREPARED FOR', W - M - 160, currentY + 10, { width: 160, align: 'right' });
      doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.navy).text(leaderName, W - M - 160, currentY + 22, { width: 160, align: 'right' });
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.mid).text(quizTitle, W - M - 160, currentY + 42, { width: 160, align: 'right' });
    }
    currentY += profileBoxH + 16;
    heading('Your Leadership Profile', 'Dimension scores');
    scoreBar(primaryStyle, 8, styleConfig.color);
    scoreBar('Secondary Strength', 6, COLORS.steel);
    scoreBar('Supporting Style', 4, COLORS.mid);
    currentY += 8;
    heading('Key Dimensions');
    const dims = [['People Focus', 9], ['Visibility & Presence', 8], ['Speed to Action', 7], ['Analytical Depth', 6], ['Collaborative Energy', 8]];
    dims.forEach(([d, s]) => scoreBar(d, s, COLORS.steel));

    // CONTENT
    setupPage(true);
    const lines = reportContent.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('##')) heading(trimmed.replace(/^#+\s+/, ''));
      else if (trimmed.startsWith('- ')) {
        const text = trimmed.replace(/^-\s+/, '');
        ensurePage(20);
        doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.steel).text('▸', M, currentY, { width: 12, lineBreak: false });
        doc.fontSize(11).font('Helvetica').fillColor(COLORS.dark).text(clean(text), M + 16, currentY, { width: CW - 16 });
        currentY += doc.heightOfString(clean(text), { width: CW - 16 }) + 6;
      } else paragraph(trimmed);
    }

    // CERTIFICATE
    setupPage(true);
    doc.rect(12, 12, W - 24, H - 24).strokeColor(COLORS.navy).lineWidth(2).stroke();
    doc.rect(18, 18, W - 36, H - 36).strokeColor(COLORS.steel).lineWidth(1).stroke();
    [[20, H - 20], [W - 20, H - 20], [20, 20], [W - 20, 20]].forEach(([cx, cy]) => { doc.circle(cx, cy, 6).fill(COLORS.steel); doc.circle(cx, cy, 2.5).fill(COLORS.white); });
    doc.rect(12, H - 86, W - 24, 74).fill(COLORS.navy);
    doc.fontSize(22).font('Helvetica').fillColor(COLORS.white).text('L E A N G L E', M, H - 56, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.steel).text('H R   L A B', M, H - 36, { align: 'center', width: CW });
    const cm = H / 2;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.steel).text('CERTIFICATE OF LEADERSHIP', M, cm - 110, { align: 'center', width: CW });
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(COLORS.steel).text('SELF-AWARENESS', M, cm - 90, { align: 'center', width: CW });
    doc.moveTo(M + 40, cm - 70).lineTo(W - M - 40, cm - 70).strokeColor(COLORS.gold).lineWidth(1.5).stroke();
    doc.fontSize(11).font('Helvetica').fillColor(COLORS.muted).text('This is to certify that', M, cm - 50, { align: 'center', width: CW });
    doc.fontSize(28).font('Helvetica-Bold').fillColor(COLORS.navy).text(leaderName || 'Leader Name', M, cm - 15, { align: 'center', width: CW });
    doc.moveTo(W / 2 - 80, cm + 18).lineTo(W / 2 + 80, cm + 18).strokeColor(COLORS.border).lineWidth(0.5).stroke();
    doc.fontSize(11).font('Helvetica').fillColor(COLORS.muted).text('has successfully completed', M, cm + 28, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.steel).text(quizTitle, M, cm + 48, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor(COLORS.muted).text('Leadership Assessment by LEANGLE HR LAB', M, cm + 68, { align: 'center', width: CW });
    const badgeW2 = 160, badgeH2 = 32, badgeX2 = (W - badgeW2) / 2, badgeY2 = cm + 90;
    doc.roundedRect(badgeX2, badgeY2, badgeW2, badgeH2, 16).fill(COLORS.lightSteel);
    doc.roundedRect(badgeX2, badgeY2, badgeW2, badgeH2, 16).strokeColor(COLORS.steel).lineWidth(1.5).stroke();
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.steel).text('PRIMARY STYLE', badgeX2, badgeY2 + 6, { align: 'center', width: badgeW2 });
    doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.navy).text(primaryStyle, badgeX2, badgeY2 + 18, { align: 'center', width: badgeW2 });
    doc.rect(12, 12, W - 24, 40).fill(COLORS.navy);
    doc.fontSize(8.5).font('Helvetica').fillColor(COLORS.white).text('Confidential — prepared exclusively for the named individual.', M, 26, { align: 'center', width: CW });

    // BACK COVER
    setupPage(true);
    doc.rect(0, 0, W, H).fill(COLORS.white);
    doc.rect(0, H - 104, W, 104).fill(COLORS.navy);
    doc.rect(0, H - 108, W, 4).fill(COLORS.steel);
    doc.fontSize(26).font('Helvetica').fillColor(COLORS.white).text('L E A N G L E', M, H - 62, { align: 'center', width: CW });
    const bhY = H - 80;
    doc.moveTo(W / 2 - 66, bhY).lineTo(W / 2 - 20, bhY).strokeColor(COLORS.steel).lineWidth(1).stroke();
    doc.moveTo(W / 2 + 20, bhY).lineTo(W / 2 + 66, bhY).strokeColor(COLORS.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.steel).text('H R   L A B', W / 2 - 20, bhY - 8, { width: 40, align: 'center' });
    const bm = (H - 108) / 2;
    doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.navy).text('Thank you for investing in your leadership.', M, bm - 86, { align: 'center', width: CW });
    doc.moveTo(M + 40, bm - 64).lineTo(W - M - 40, bm - 64).strokeColor(COLORS.border).lineWidth(1).stroke();
    doc.fontSize(11).font('Helvetica-Oblique').fillColor(COLORS.mid).text('"Leadership is not a destination.\nIt is a daily practice of self-awareness, courage, and care."', M, bm - 50, { align: 'center', width: CW, lineGap: 4 });
    doc.moveTo(M + 40, bm + 10).lineTo(W - M - 40, bm + 10).strokeColor(COLORS.border).lineWidth(1).stroke();
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(COLORS.steel).text('EXPLORE ALL 7 ASSESSMENTS', M, bm + 26, { align: 'center', width: CW });
    const assessments = ['Leadership Communication', 'Conflict Resolution', 'Feedback', 'Decision-Making', 'Motivation', 'Stress Response', 'Leadership Personality'];
    doc.fontSize(10).font('Helvetica').fillColor(COLORS.dark);
    assessments.forEach((item, i) => { doc.text(item, M, bm + 44 + i * 18, { align: 'center', width: CW }); });
    doc.moveTo(M + 60, bm + 180).lineTo(W - M - 60, bm + 180).strokeColor(COLORS.border).lineWidth(0.5).stroke();
    doc.fontSize(10).font('Helvetica').fillColor(COLORS.muted).text('support@leanglehrlab.com', M, bm + 194, { align: 'center', width: CW });
    doc.rect(0, 0, W, 40).fill(COLORS.navy);
    doc.fontSize(8).font('Helvetica').fillColor(COLORS.white).text('© 2026 LEANGLE HR LAB  |  All rights reserved  |  Confidential', M, 14, { align: 'center', width: CW });

    doc.end();
  });
}
