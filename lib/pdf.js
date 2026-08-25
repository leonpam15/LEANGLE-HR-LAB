import PDFDocument from 'pdfkit';

const C = { navy: '#132030', steel: '#4A7FA5', lightSteel: '#E8EFF5', dark: '#1a1a1a', mid: '#666666', muted: '#8A9BB0', white: '#ffffff', border: '#D0D8E0', lightBg: '#F5F8FB', gold: '#D4A574', green: '#6BA583' };

const STYLE_CONFIG = { Visionary: { color: '#2E5090', tagline: 'The Forward Thinker' }, Executor: { color: '#C85A3A', tagline: 'The Results Driver' }, Architect: { color: '#5B7C99', tagline: 'The Systems Builder' }, Recognition: { color: '#4A7FA5', tagline: 'The People Magnifier' }, Collaborative: { color: '#4A7FA5', tagline: 'The Bridge Builder' }, Directive: { color: '#8B5A2B', tagline: 'The Clear Leader' }, Empathetic: { color: '#A85A89', tagline: 'The Heart-Centered Leader' }, Analytical: { color: '#6B8E99', tagline: 'The Data-Driven Leader' }, Autonomy: { color: '#7A6B4A', tagline: 'The Independent Leader' }, Mastery: { color: '#5A7A9A', tagline: 'The Excellence Seeker' }, Purpose: { color: '#6A8A7A', tagline: 'The Mission-Driven Leader' } };

function clean(text) { return (text || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/^#+\s+/, '').trim(); }

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', bufferPages: false });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 48, CW = W - M * 2;
    const HEADER_H = 50, FOOTER_H = 40, CONTENT_START = HEADER_H, CONTENT_END = H - FOOTER_H;
    const styleConfig = STYLE_CONFIG[primaryStyle] || STYLE_CONFIG.Recognition;

    let pageNum = 0;

    const drawHeader = () => {
      doc.rect(0, 0, W, 4).fill(C.steel);
      doc.rect(0, 4, W, 44).fill(C.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(C.steel).text('LEANGLE HR LAB', M, 14, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor(C.muted).text('  |  ' + quizTitle.toUpperCase(), { continued: false });
      doc.fontSize(8).font('Helvetica').fillColor(C.muted).text(`${pageNum}`, W - M - 20, 20, { width: 20, align: 'right' });
    };

    const drawFooter = () => {
      doc.moveTo(M, CONTENT_END).lineTo(W - M, CONTENT_END).strokeColor(C.border).lineWidth(0.5).stroke();
      const footerText = leaderName ? `Prepared for ${leaderName.substring(0, 30)}  |  LEANGLE HR LAB` : 'LEANGLE HR LAB';
      doc.fontSize(7).font('Helvetica').fillColor(C.muted).text(footerText, M, H - 18, { width: CW, align: 'center' });
    };

    const newPage = () => {
      if (pageNum > 0) doc.addPage();
      pageNum++;
      drawHeader();
      drawFooter();
      return CONTENT_START;
    };

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill(C.white);
    doc.rect(0, H - 110, W, 110).fill(C.navy);
    doc.rect(0, H - 114, W, 4).fill(C.steel);
    doc.rect(0, 0, W, 60).fill(C.navy);
    doc.rect(0, 60, W, 4).fill(C.steel);
    doc.fontSize(32).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H - 70, { align: 'center', width: CW });
    const divY = H - 88;
    doc.moveTo(W / 2 - 60, divY).lineTo(W / 2 - 18, divY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.moveTo(W / 2 + 18, divY).lineTo(W / 2 + 60, divY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', W / 2 - 18, divY - 8, { width: 36, align: 'center' });
    const top = 70, bot = H - 120, sp = (bot - top) / 6;
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PREMIUM LEADERSHIP REPORT', M, top + sp * 0.5, { align: 'center', width: CW });
    doc.fontSize(24).font('Helvetica-Bold').fillColor(C.navy).text(quizTitle, M, top + sp * 1.8, { align: 'center', width: CW });
    doc.moveTo(M + 40, top + sp * 2.6).lineTo(W - M - 40, top + sp * 2.6).strokeColor(C.steel).lineWidth(0.8).stroke();
    const bw = 130, bh = 28, bx = (W - bw) / 2, by = top + sp * 3.2;
    doc.roundedRect(bx, by, bw, bh, 12).fill(C.lightSteel).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.steel).text(primaryStyle, bx, by + 7, { align: 'center', width: bw });
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('Prepared exclusively for', M, top + sp * 4.2, { align: 'center', width: CW });
    doc.fontSize(20).font('Helvetica-Bold').fillColor(C.navy).text(leaderName || 'Your Name', M, top + sp * 5, { align: 'center', width: CW });
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.white).text('Your Personalized Leadership Intelligence Report', M, 30, { align: 'center', width: CW });

    // PAGE 2: DASHBOARD
    let y = newPage();
    const pbh = 60;
    doc.rect(M, y, CW, pbh).fill(C.lightBg).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.rect(M, y, 6, pbh).fill(styleConfig.color);
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY STYLE', M + 12, y + 10);
    doc.fontSize(16).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, M + 12, y + 22);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid).text(`"${styleConfig.tagline}"`, M + 12, y + 42);
    if (leaderName) {
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('FOR', W - M - 50, y + 10, { width: 50, align: 'right' });
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(leaderName.substring(0, 20), W - M - 50, y + 22, { width: 50, align: 'right' });
    }
    y += pbh + 14;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy).text('YOUR PROFILE', M, y);
    y += 16;
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor(styleConfig.color).lineWidth(2).stroke();
    y += 20;
    const dims = [['People Focus', 9], ['Visibility', 8], ['Speed', 7], ['Analysis', 6], ['Collaboration', 8]];
    dims.forEach(([d, s]) => {
      const bw2 = CW - 130;
      doc.fontSize(11).font('Helvetica').fillColor(C.mid).text(d, M, y, { width: 120, lineBreak: false });
      doc.rect(M + 125, y + 3, bw2, 10).fill(C.border);
      doc.rect(M + 125, y + 3, bw2 * (s / 10), 10).fill(C.steel);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel).text(`${s}/10`, M + 125 + bw2 + 8, y);
      y += 18;
    });

    // PAGES 3+: REPORT CONTENT
    y = newPage();
    const lines = reportContent.split('\n');
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      
      if (t.startsWith('##')) {
        if (y + 35 > CONTENT_END) y = newPage();
        y += 8;
        doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy).text(t.replace(/^#+\s+/, '').toUpperCase(), M, y, { width: CW });
        y += 16;
        doc.moveTo(M, y).lineTo(W - M, y).strokeColor(styleConfig.color).lineWidth(2).stroke();
        y += 10;
      } else if (t.startsWith('- ')) {
        const txt = clean(t.replace(/^-\s+/, ''));
        const h = doc.heightOfString(txt, { width: CW - 16, lineGap: 2 });
        if (y + h + 10 > CONTENT_END) y = newPage();
        doc.fontSize(11).font('Helvetica-Bold').fillColor(C.steel).text('▸', M, y, { width: 12, lineBreak: false });
        doc.fontSize(11).font('Helvetica').fillColor(C.dark).text(txt, M + 16, y, { width: CW - 16, lineGap: 2 });
        y += h + 8;
      } else {
        const txt = clean(t);
        if (txt.length < 3) continue;
        const h = doc.heightOfString(txt, { width: CW, lineGap: 2 });
        if (y + h + 6 > CONTENT_END) y = newPage();
        doc.fontSize(11).font('Helvetica').fillColor(C.dark).text(txt, M, y, { width: CW, lineGap: 2 });
        y += h + 8;
      }
    }

    // CERTIFICATE
    y = newPage();
    doc.rect(12, 12, W - 24, H - 24).strokeColor(C.navy).lineWidth(2).stroke();
    doc.rect(18, 18, W - 36, H - 36).strokeColor(C.steel).lineWidth(1).stroke();
    [[20, H - 20], [W - 20, H - 20], [20, 20], [W - 20, 20]].forEach(([cx, cy]) => { doc.circle(cx, cy, 6).fill(C.steel); doc.circle(cx, cy, 2.5).fill(C.white); });
    doc.rect(12, H - 86, W - 24, 74).fill(C.navy);
    doc.fontSize(22).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H - 56, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', M, H - 36, { align: 'center', width: CW });
    const cm = H / 2;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(C.steel).text('CERTIFICATE OF LEADERSHIP', M, cm - 110, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('This certifies that', M, cm - 50, { align: 'center', width: CW });
    doc.fontSize(26).font('Helvetica-Bold').fillColor(C.navy).text(leaderName || 'Leader', M, cm - 20, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('has completed the', M, cm + 25, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel).text(quizTitle, M, cm + 45, { align: 'center', width: CW });
    const bw3 = 160, bh3 = 32, bx3 = (W - bw3) / 2, by3 = cm + 88;
    doc.roundedRect(bx3, by3, bw3, bh3, 16).fill(C.lightSteel).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY STYLE', bx3, by3 + 6, { align: 'center', width: bw3 });
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, bx3, by3 + 18, { align: 'center', width: bw3 });
    doc.rect(12, 12, W - 24, 40).fill(C.navy);
    doc.fontSize(8.5).font('Helvetica').fillColor(C.white).text('Confidential — prepared exclusively for the named individual.', M, 26, { align: 'center', width: CW });

    // BACK COVER
    y = newPage();
    doc.rect(0, 0, W, H).fill(C.white);
    doc.rect(0, H - 104, W, 104).fill(C.navy);
    doc.rect(0, H - 108, W, 4).fill(C.steel);
    doc.fontSize(26).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H - 62, { align: 'center', width: CW });
    const bhy = H - 80;
    doc.moveTo(W / 2 - 66, bhy).lineTo(W / 2 - 20, bhy).strokeColor(C.steel).lineWidth(1).stroke();
    doc.moveTo(W / 2 + 20, bhy).lineTo(W / 2 + 66, bhy).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', W / 2 - 20, bhy - 8, { width: 40, align: 'center' });
    const bm = (H - 108) / 2;
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text('Thank you for investing in your leadership.', M, bm - 86, { align: 'center', width: CW });
    doc.moveTo(M + 40, bm - 64).lineTo(W - M - 40, bm - 64).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(11).font('Helvetica-Oblique').fillColor(C.mid).text('"Leadership is a daily practice of\nself-awareness, courage, and care."', M, bm - 50, { align: 'center', width: CW, lineGap: 4 });
    doc.moveTo(M + 40, bm + 10).lineTo(W - M - 40, bm + 10).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(C.steel).text('ALL 7 ASSESSMENTS', M, bm + 26, { align: 'center', width: CW });
    const ass = ['Communication', 'Conflict', 'Feedback', 'Decision', 'Motivation', 'Stress', 'Personality'];
    doc.fontSize(10).font('Helvetica').fillColor(C.dark);
    ass.forEach((a, i) => { doc.text(a, M, bm + 44 + i * 18, { align: 'center', width: CW }); });
    doc.moveTo(M + 60, bm + 180).lineTo(W - M - 60, bm + 180).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('support@leanglehrlab.com', M, bm + 194, { align: 'center', width: CW });
    doc.rect(0, 0, W, 40).fill(C.navy);
    doc.fontSize(8).font('Helvetica').fillColor(C.white).text('© 2026 LEANGLE HR LAB  |  All rights reserved', M, 14, { align: 'center', width: CW });

    doc.end();
  });
}
