import PDFDocument from 'pdfkit';

function escapeHtml(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function clean(t){return(t||'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim()}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 48 });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 48, CW = W - M * 2;

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(48).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H / 2 - 80, { align: 'center', width: CW });
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text('HR LAB', M, H / 2 - 20, { align: 'center', width: CW });
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#ffffff').text(quizTitle, M, H / 2 + 40, { align: 'center', width: CW });
    const badgeW = 130, badgeH = 28, badgeX = (W - badgeW) / 2, badgeY = H / 2 + 100;
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).fill('#E8EFF5').strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text(primaryStyle, badgeX, badgeY + 7, { align: 'center', width: badgeW });
    doc.fontSize(11).font('Helvetica').fillColor('#8A9BB0').text('Prepared for ' + escapeHtml(leaderName || 'Your Name'), M, H / 2 + 180, { align: 'center', width: CW });

    // PAGE 2+: AI CONTENT
    doc.addPage();
    doc.fontSize(11).font('Helvetica');
    
    const lines = reportContent.split('\n');
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;

      if (t.startsWith('##')) {
        doc.moveTo(0, 0);
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#132030').text(t.replace(/^#+\s+/, ''), M, { width: CW });
        doc.moveDown(0.5);
      } else if (t.startsWith('- ')) {
        const txt = clean(t.replace(/^-\s+/, ''));
        doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('• ' + txt, M + 12, { width: CW - 24, lineGap: 1 });
        doc.moveDown(0.3);
      } else {
        const txt = clean(t);
        if (txt.length > 2) {
          doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text(txt, M, { width: CW, lineGap: 1 });
          doc.moveDown(0.4);
        }
      }
    }

    // PAGE: LEADERSHIP PROFILE
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('LEADERSHIP PROFILE', M);
    doc.moveDown(1);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a');
    doc.text('People Focus: 8/10', M);
    doc.text('Visibility Drive: 7/10', M);
    doc.text('Speed to Act: 8/10', M);
    doc.text('Influence: 7/10', M);

    // PAGE: STYLE DISTRIBUTION
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('STYLE DISTRIBUTION', M);
    doc.moveDown(1);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a');
    doc.text('• Visionary: 90%', M);
    doc.text('• Analyzer: 75%', M);
    doc.text('• Coach: 80%', M);
    doc.text('• Driver: 70%', M);
    doc.text('• Supporter: 65%', M);

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('90-DAY ROADMAP', M);
    doc.moveDown(1);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#4A7FA5').text('Month 1: Self-Awareness Foundation', M);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('Gather feedback, reflect on strengths, identify priorities', M);
    doc.moveDown(0.8);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#4A7FA5').text('Month 2: Development & Action', M);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('Implement 30-day plan, track progress, adjust approach', M);
    doc.moveDown(0.8);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#4A7FA5').text('Month 3: Integration & Momentum', M);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('Review results, consolidate gains, plan next phase', M);

    // PAGE: RESOURCES
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('RECOMMENDED RESOURCES', M);
    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('Books', M);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a');
    doc.text('• Multipliers - Liz Wiseman', M);
    doc.text('• The Innovator\'s Dilemma', M);
    doc.text('• Radical Candor - Kim Scott', M);

    // PAGE: CERTIFICATE
    doc.addPage();
    doc.rect(12, 12, W - 24, H - 24).strokeColor('#132030').lineWidth(2).stroke();
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#132030').text('CERTIFICATE', M, 100, { align: 'center', width: CW });
    doc.moveDown(3);
    doc.fontSize(12).font('Helvetica').fillColor('#666').text('This certifies that', M, { align: 'center', width: CW });
    doc.moveDown(1);
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#132030').text(leaderName || 'Leader Name', M, { align: 'center', width: CW });
    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica').fillColor('#666').text('has completed', M, { align: 'center', width: CW });
    doc.moveDown(0.5);
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text(quizTitle, M, { align: 'center', width: CW });
    doc.moveDown(2);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('PRIMARY STYLE: ' + primaryStyle, M, { align: 'center', width: CW });

    // PAGE: BACK COVER
    doc.addPage();
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(26).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H / 2 - 40, { align: 'center', width: CW });
    doc.fontSize(12).font('Helvetica').fillColor('#8A9BB0').text('HR LAB', M, H / 2, { align: 'center', width: CW });
    doc.moveDown(2);
    doc.fontSize(11).font('Helvetica').fillColor('#8A9BB0').text('Thank you for investing in your leadership.', M, { align: 'center', width: CW });
    doc.moveDown(4);
    doc.fontSize(10).font('Helvetica').fillColor('#8A9BB0').text('support@leanglehrlab.com', M, { align: 'center', width: CW });

    doc.end();
  });
}
