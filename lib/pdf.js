import PDFDocument from 'pdfkit';
function escapeHtml(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function clean(t){return(t||'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim()}
export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 48, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 48, CW = W - M * 2;
    const lines = reportContent.split('\n');
    let y = 60, pageNum = 0;

    const header = () => {
      pageNum++;
      doc.rect(0, 0, W, 4).fill('#4A7FA5');
      doc.rect(0, 4, W, 44).fill('#132030');
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#4A7FA5').text('LEANGLE HR LAB', M, 14, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('  |  ' + quizTitle.toUpperCase(), { continued: false });
      doc.fontSize(8).font('Helvetica').fillColor('#8A9BB0').text(`${pageNum}`, W - M - 20, 20, { width: 20, align: 'right' });
    };

    const footer = () => {
      doc.moveTo(M, H - 50).lineTo(W - M, H - 50).strokeColor('#D0D8E0').lineWidth(0.5).stroke();
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('LEANGLE HR LAB | Confidential', M, H - 18, { width: CW, align: 'center' });
    };

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(48).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H / 2 - 80, { align: 'center', width: CW });
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text('HR LAB', M, H / 2 - 20, { align: 'center', width: CW });
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#ffffff').text(quizTitle, M, H / 2 + 40, { align: 'center', width: CW });
    const badgeW = 130, badgeH = 28, badgeX = (W - badgeW) / 2, badgeY = H / 2 + 100;
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).fill('#E8EFF5').strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text(primaryStyle, badgeX, badgeY + 7, { align: 'center', width: badgeW });
    doc.fontSize(11).font('Helvetica').fillColor('#8A9BB0').text('Prepared for ' + escapeHtml(leaderName || 'Your Name'), M, H / 2 + 180, { align: 'center', width: CW });

    // PAGES 2+: CONTENT
    doc.addPage();
    header();
    y = 60;
    
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      
      if (t.startsWith('##')) {
        if (y + 30 > H - 60) { doc.addPage(); header(); y = 60; }
        y += 8;
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#132030').text(t.replace(/^#+\s+/, '').toUpperCase(), M, y, { width: CW });
        y += 16;
        doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#4A7FA5').lineWidth(2).stroke();
        y += 10;
      } else if (t.startsWith('- ')) {
        const txt = clean(t.replace(/^-\s+/, ''));
        const h = doc.heightOfString(txt, { width: CW - 20, lineGap: 2 });
        if (y + h + 10 > H - 60) { doc.addPage(); header(); y = 60; }
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('▸', M, y, { width: 12, lineBreak: false });
        doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text(txt, M + 16, y, { width: CW - 20, lineGap: 2 });
        y += h + 8;
      } else {
        const txt = clean(t);
        if (txt.length < 3) continue;
        const h = doc.heightOfString(txt, { width: CW, lineGap: 2 });
        if (y + h + 6 > H - 60) { doc.addPage(); header(); y = 60; }
        doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text(txt, M, y, { width: CW, lineGap: 2 });
        y += h + 8;
      }
    }

    footer();

    // CERTIFICATE PAGE
    doc.addPage();
    doc.rect(12, 12, W - 24, H - 24).strokeColor('#132030').lineWidth(2).stroke();
    doc.rect(18, 18, W - 36, H - 36).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.rect(12, H - 86, W - 24, 74).fill('#132030');
    doc.fontSize(22).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H - 56, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#4A7FA5').text('HR LAB', M, H - 36, { align: 'center', width: CW });
    const cm = H / 2;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('CERTIFICATE OF LEADERSHIP', M, cm - 110, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('This certifies that', M, cm - 50, { align: 'center', width: CW });
    doc.fontSize(26).font('Helvetica-Bold').fillColor('#132030').text(leaderName || 'Leader Name', M, cm - 20, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('has successfully completed', M, cm + 25, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#4A7FA5').text(quizTitle, M, cm + 45, { align: 'center', width: CW });
    const badgeW2 = 160, badgeH2 = 32, badgeX2 = (W - badgeW2) / 2, badgeY2 = cm + 88;
    doc.roundedRect(badgeX2, badgeY2, badgeW2, badgeH2, 16).fill('#E8EFF5').strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#4A7FA5').text('PRIMARY STYLE', badgeX2, badgeY2 + 6, { align: 'center', width: badgeW2 });
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text(primaryStyle, badgeX2, badgeY2 + 18, { align: 'center', width: badgeW2 });
    doc.rect(12, 12, W - 24, 40).fill('#132030');
    doc.fontSize(8.5).font('Helvetica').fillColor('#ffffff').text('Confidential — prepared exclusively for the named individual.', M, 26, { align: 'center', width: CW });

    // BACK COVER
    doc.addPage();
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(26).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H - 62, { align: 'center', width: CW });
    const bhY = H - 80;
    doc.moveTo(W / 2 - 66, bhY).lineTo(W / 2 - 20, bhY).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.moveTo(W / 2 + 20, bhY).lineTo(W / 2 + 66, bhY).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#4A7FA5').text('H R   L A B', W / 2 - 20, bhY - 8, { width: 40, align: 'center' });
    const bm = (H - 108) / 2;
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#ffffff').text('Thank you for investing in your leadership.', M, bm - 86, { align: 'center', width: CW });
    doc.moveTo(M + 40, bm - 64).lineTo(W - M - 40, bm - 64).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.fontSize(11).font('Helvetica-Oblique').fillColor('#8A9BB0').text('"Leadership is a daily practice of\nself-awareness, courage, and care."', M, bm - 50, { align: 'center', width: CW, lineGap: 4 });
    doc.moveTo(M + 40, bm + 10).lineTo(W - M - 40, bm + 10).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#4A7FA5').text('ALL 7 ASSESSMENTS', M, bm + 26, { align: 'center', width: CW });
    const assessments = ['Leadership Communication', 'Conflict Resolution', 'Feedback Style', 'Decision-Making', 'Motivation', 'Stress Response', 'Leadership Personality'];
    doc.fontSize(10).font('Helvetica').fillColor('#8A9BB0');
    assessments.forEach((a, i) => { doc.text(a, M, bm + 44 + i * 18, { align: 'center', width: CW }); });
    doc.moveTo(M + 60, bm + 180).lineTo(W - M - 60, bm + 180).strokeColor('#4A7FA5').lineWidth(0.5).stroke();
    doc.fontSize(10).font('Helvetica').fillColor('#8A9BB0').text('support@leanglehrlab.com', M, bm + 194, { align: 'center', width: CW });
    doc.rect(0, 0, W, 40).fill('#132030');
    doc.fontSize(8).font('Helvetica').fillColor('#ffffff').text('© 2026 LEANGLE HR LAB | All rights reserved | Confidential', M, 14, { align: 'center', width: CW });

    doc.end();
  });
}
