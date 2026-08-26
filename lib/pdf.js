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

    // NEW PAGE for AI content
    doc.addPage();
    
    // Process AI content - simple sequential rendering
    const lines = reportContent.split('\n');
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;

      if (t.startsWith('##')) {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#132030').text(t.replace(/^#+\s+/, ''), M, { width: CW });
        doc.fontSize(1).text(' ');
      } else if (t.startsWith('- ')) {
        const txt = clean(t.replace(/^-\s+/, ''));
        doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text('• ' + txt, M + 12, { width: CW - 24, lineGap: 2 });
        doc.fontSize(1).text(' ');
      } else {
        const txt = clean(t);
        if (txt.length > 2) {
          doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text(txt, M, { width: CW, lineGap: 2 });
          doc.fontSize(1).text(' ');
        }
      }
    }

    // PAGE: LEADERSHIP PROFILE
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('LEADERSHIP PROFILE', M);
    doc.fontSize(10).text(' ');

    const scores = [
      { label: 'People Focus', value: 8 },
      { label: 'Visibility Drive', value: 7 },
      { label: 'Speed to Act', value: 8 },
      { label: 'Influence', value: 7 },
    ];

    scores.forEach(s => {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text(s.label + ': ' + s.value + '/10', M);
    });

    // PAGE: STYLE DISTRIBUTION
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('STYLE DISTRIBUTION', M);
    doc.fontSize(10).text(' ');

    const styles = [
      'Visionary: 90%',
      'Analyzer: 75%',
      'Coach: 80%',
      'Driver: 70%',
      'Supporter: 65%',
    ];

    styles.forEach(s => {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('• ' + s, M + 12);
    });

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('90-DAY ROADMAP', M);
    doc.fontSize(10).text(' ');
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('Month 1: Self-Awareness Foundation', M);
    doc.fontSize(10).text('Gather feedback, reflect on strengths, identify priorities', M);
    doc.fontSize(1).text(' ');
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('Month 2: Development & Action', M);
    doc.fontSize(10).text('Implement 30-day plan, track progress, adjust approach', M);
    doc.fontSize(1).text(' ');
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('Month 3: Integration & Momentum', M);
    doc.fontSize(10).text('Review results, consolidate gains, plan next phase', M);

    // PAGE: RESOURCES
    doc.addPage();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#132030').text('RECOMMENDED RESOURCES', M);
    doc.fontSize(10).text(' ');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('Books', M);
    ['Multipliers - Liz Wiseman', 'The Innovator\'s Dilemma', 'Radical Candor - Kim Scott'].forEach(b => {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a1a').text('• ' + b, M + 12);
    });

    // PAGE: CERTIFICATE
    doc.addPage();
    doc.rect(12, 12, W - 24, H - 24).strokeColor('#132030').lineWidth(2).stroke();
    doc.fontSize(22).font('Helvetica').fillColor('#132030').text('CERTIFICATE', M, 100, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica').fillColor('#666').text('This certifies that', M, 200, { align: 'center', width: CW });
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#132030').text(leaderName || 'Leader Name', M, 240, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica').fillColor('#666').text('has completed ' + quizTitle, M, 300, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('PRIMARY STYLE: ' + primaryStyle, M, 360, { align: 'center', width: CW });

    // PAGE: BACK COVER
    doc.addPage();
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(20).font('Helvetica').fillColor('#ffffff').text('LEANGLE', M, H / 2 - 40, { align: 'center', width: CW });
    doc.fontSize(12).font('Helvetica').fillColor('#8A9BB0').text('HR LAB', M, H / 2, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica').fillColor('#8A9BB0').text('Thank you for investing in your leadership.', M, H / 2 + 60, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor('#8A9BB0').text('support@leanglehrlab.com', M, H - 80, { align: 'center', width: CW });

    doc.end();
  });
}
