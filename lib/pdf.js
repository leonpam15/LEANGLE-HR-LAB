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
    const CONTENT_BOTTOM = H - 60;

    const drawHeader = (pageNum, title) => {
      doc.rect(0, 0, W, 4).fill('#4A7FA5');
      doc.rect(0, 4, W, 44).fill('#132030');
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#4A7FA5').text('LEANGLE HR LAB', M, 14, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('  |  ' + quizTitle.toUpperCase(), { continued: false });
      doc.fontSize(8).font('Helvetica').fillColor('#8A9BB0').text(`${pageNum}`, W - M - 20, 20, { width: 20, align: 'right' });
    };

    const drawFooter = () => {
      doc.moveTo(M, CONTENT_BOTTOM).lineTo(W - M, CONTENT_BOTTOM).strokeColor('#D0D8E0').lineWidth(0.5).stroke();
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('LEANGLE HR LAB | Confidential', M, H - 18, { width: CW, align: 'center' });
    };

    let pageNum = 1;

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(48).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H / 2 - 80, { align: 'center', width: CW });
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text('HR LAB', M, H / 2 - 20, { align: 'center', width: CW });
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#ffffff').text(quizTitle, M, H / 2 + 40, { align: 'center', width: CW });
    const badgeW = 130, badgeH = 28, badgeX = (W - badgeW) / 2, badgeY = H / 2 + 100;
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).fill('#E8EFF5').strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text(primaryStyle, badgeX, badgeY + 7, { align: 'center', width: badgeW });
    doc.fontSize(11).font('Helvetica').fillColor('#8A9BB0').text('Prepared for ' + escapeHtml(leaderName || 'Your Name'), M, H / 2 + 180, { align: 'center', width: CW });

    // PAGES 2+: AI CONTENT (with page breaks)
    doc.addPage();
    drawHeader(++pageNum);
    drawFooter();
    let y = 60;

    const lines = reportContent.split('\n');
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;

      if (t.startsWith('##')) {
        if (y + 30 > CONTENT_BOTTOM) {
          doc.addPage();
          drawHeader(++pageNum);
          drawFooter();
          y = 60;
        }
        y += 8;
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#132030').text(t.replace(/^#+\s+/, '').toUpperCase(), M, y, { width: CW });
        y += 16;
        doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#4A7FA5').lineWidth(2).stroke();
        y += 10;
      } else if (t.startsWith('- ')) {
        const txt = clean(t.replace(/^-\s+/, ''));
        const h = doc.heightOfString(txt, { width: CW - 20, lineGap: 2 });
        if (y + h + 10 > CONTENT_BOTTOM) {
          doc.addPage();
          drawHeader(++pageNum);
          drawFooter();
          y = 60;
        }
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('▸', M, y, { width: 12, lineBreak: false });
        doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text(txt, M + 16, y, { width: CW - 20, lineGap: 2 });
        y += h + 8;
      } else {
        const txt = clean(t);
        if (txt.length < 3) continue;
        const h = doc.heightOfString(txt, { width: CW, lineGap: 2 });
        if (y + h + 6 > CONTENT_BOTTOM) {
          doc.addPage();
          drawHeader(++pageNum);
          drawFooter();
          y = 60;
        }
        doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text(txt, M, y, { width: CW, lineGap: 2 });
        y += h + 8;
      }
    }

    // FIXED PAGES (each on its own page, no dynamic breaks)

    // PAGE: LEADERSHIP PROFILE
    doc.addPage();
    drawHeader(++pageNum);
    drawFooter();
    y = 60;
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('LEADERSHIP PROFILE', M, y, { width: CW });
    y += 20;
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    y += 16;

    const scores = [
      { label: 'People Focus', value: 8 },
      { label: 'Visibility Drive', value: 7 },
      { label: 'Speed to Act', value: 8 },
      { label: 'Influence', value: 7 },
    ];

    scores.forEach(s => {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text(s.label, M, y);
      const barX = M + 140, barW = 180, barH = 8;
      doc.rect(barX, y, barW, barH).stroke('#D0D8E0').lineWidth(0.5);
      const fillW = (s.value / 10) * barW;
      doc.rect(barX, y, fillW, barH).fill('#4A7FA5');
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#4A7FA5').text(`${s.value}/10`, barX + barW + 12, y - 2);
      y += 16;
    });

    // PAGE: STYLE ANALYSIS
    doc.addPage();
    drawHeader(++pageNum);
    drawFooter();
    y = 60;
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('STYLE DISTRIBUTION', M, y, { width: CW });
    y += 20;
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    y += 16;

    const styles = [
      { name: 'Visionary', pct: 90 },
      { name: 'Analyzer', pct: 75 },
      { name: 'Coach', pct: 80 },
      { name: 'Driver', pct: 70 },
      { name: 'Supporter', pct: 65 },
    ];

    styles.forEach(s => {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text(s.name, M, y, { width: 100 });
      const barX = M + 110, barW = 200, barH = 8;
      doc.rect(barX, y, barW, barH).stroke('#D0D8E0').lineWidth(0.5);
      const fillW = (s.pct / 100) * barW;
      doc.rect(barX, y, fillW, barH).fill('#4A7FA5');
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#4A7FA5').text(`${s.pct}%`, barX + barW + 12, y - 2);
      y += 16;
    });

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    drawHeader(++pageNum);
    drawFooter();
    y = 60;
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('90-DAY ROADMAP', M, y, { width: CW });
    y += 20;
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    y += 16;

    const months = [
      { num: 'Month 1', title: 'Self-Awareness Foundation', desc: 'Gather feedback, reflect on strengths, identify priorities' },
      { num: 'Month 2', title: 'Development & Action', desc: 'Implement 30-day plan, track progress, adjust approach' },
      { num: 'Month 3', title: 'Integration & Momentum', desc: 'Review results, consolidate gains, plan next phase' },
    ];

    months.forEach(m => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text(m.num, M, y);
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text(m.title, M + 80, y);
      y += 14;
      doc.fontSize(9).font('Helvetica').fillColor('#666').text(m.desc, M + 20, y, { width: CW - 40 });
      y += 20;
    });

    // PAGE: RECOMMENDED RESOURCES
    doc.addPage();
    drawHeader(++pageNum);
    drawFooter();
    y = 60;
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('RECOMMENDED RESOURCES', M, y, { width: CW });
    y += 20;
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('Books', M, y);
    y += 12;
    ['Multipliers - Liz Wiseman', 'The Innovator\'s Dilemma - Clayton Christensen', 'Radical Candor - Kim Scott'].forEach(b => {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('• ' + b, M + 12, y);
      y += 12;
    });

    y += 8;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('Coaching', M, y);
    y += 12;
    ['Executive coaching - 6-month engagement', 'Peer coaching groups - Monthly meetings', '90-day follow-up assessment'].forEach(c => {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('• ' + c, M + 12, y);
      y += 12;
    });

    // PAGE: CERTIFICATE
    doc.addPage();
    pageNum++;
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

    // PAGE: BACK COVER
    doc.addPage();
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(26).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H - 62, { align: 'center', width: CW });
    const bhY = H - 80;
    doc.moveTo(W / 2 - 66, bhY).lineTo(W / 2 - 20, bhY).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.moveTo(W / 2 + 20, bhY).lineTo(W / 2 + 66, bhY).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#4A7FA5').text('H R   L A B', W / 2 - 20, bhY - 8, { width: 40, align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#8A9BB0').text('support@leanglehrlab.com', M, H - 50, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica').fillColor('#ffffff').text('© 2026 LEANGLE HR LAB | All rights reserved', M, 14, { align: 'center', width: CW });

    doc.end();
  });
}
