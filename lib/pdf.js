import PDFDocument from 'pdfkit';

function parseContent(text) {
  const sections = [];
  let current = { title: '', content: [] };
  
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('##')) {
      if (current.title) sections.push(current);
      current = { title: t.replace(/^#+\s+/, ''), content: [] };
    } else if (t) {
      current.content.push(t);
    }
  }
  if (current.title) sections.push(current);
  return sections;
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 40, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 612, H = 792, M = 40, CW = W - M * 2;
    let pageNum = 1;

    const header = () => {
      doc.fontSize(8).fillColor('#4A7FA5').text('LEANGLE HR LAB', M, 15, { width: CW, align: 'left' });
      doc.fontSize(8).fillColor('#8A9BB0').text(`${pageNum}`, M + CW - 30, 15, { width: 30, align: 'right' });
    };

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(48).fillColor('#ffffff').text('LEANGLE', M, 200, { align: 'center', width: CW });
    doc.fontSize(13).fillColor('#4A7FA5').text('HR LAB', M, 270, { align: 'center', width: CW });
    doc.fontSize(22).fillColor('#ffffff').text(quizTitle, M, 340, { align: 'center', width: CW });
    doc.rect((W - 120) / 2, 430, 120, 30).fill('#E8EFF5').strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    doc.fontSize(12).fillColor('#4A7FA5').text(primaryStyle, (W - 120) / 2, 440, { align: 'center', width: 120 });
    doc.fontSize(11).fillColor('#8A9BB0').text('Prepared for', M, 520, { align: 'center', width: CW });
    doc.fontSize(16).fillColor('#ffffff').text(leaderName || 'Your Name', M, 545, { align: 'center', width: CW });

    // PARSE AI CONTENT
    const sections = parseContent(reportContent);

    // PAGE 2+: AI SECTIONS
    doc.addPage();
    pageNum = 2;
    header();
    let y = 60;
    
    for (const section of sections) {
      if (y + 40 > H - 60) {
        doc.addPage();
        pageNum++;
        header();
        y = 60;
      }

      // Section header
      doc.fontSize(13).fillColor('#132030').text(section.title, M, y);
      y += 20;
      doc.moveTo(M, y).lineTo(M + 100, y).strokeColor('#4A7FA5').lineWidth(1.5).stroke();
      y += 16;

      // Section content
      for (const line of section.content) {
        const lineHeight = doc.heightOfString(line, { width: CW });
        if (y + lineHeight + 10 > H - 60) {
          doc.addPage();
          pageNum++;
          header();
          y = 60;
        }

        if (line.startsWith('-')) {
          doc.fontSize(10).fillColor('#1a1a1a').text('• ' + line.replace(/^-\s+/, ''), M + 12, y, { width: CW - 24 });
        } else {
          doc.fontSize(10).fillColor('#333').text(line, M, y, { width: CW });
        }
        y += lineHeight + 8;
      }

      y += 12;
    }

    // PAGE: LEADERSHIP PROFILE
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor('#132030').text('YOUR LEADERSHIP PROFILE', M, y);
    y += 25;

    const scoreLabels = ['People Focus', 'Visibility Drive', 'Speed to Act', 'Influence', 'Innovation'];
    const scoreValues = [8, 7, 8, 7, 8];
    
    scoreLabels.forEach((label, i) => {
      const val = scoreValues[i];
      doc.fontSize(10).fillColor('#333').text(label, M, y);
      const barW = 200, barH = 8;
      doc.rect(M + 180, y - 2, barW, barH).stroke('#D0D8E0');
      doc.rect(M + 180, y - 2, (val / 10) * barW, barH).fill('#4A7FA5');
      doc.fontSize(9).fillColor('#4A7FA5').text(val + '/10', M + 385, y - 2);
      y += 18;
    });

    // PAGE: STYLE BREAKDOWN
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor('#132030').text('STYLE BREAKDOWN', M, y);
    y += 25;
    doc.fontSize(10).fillColor('#333').text('Your primary style: ' + primaryStyle, M, y);
    y += 20;

    const styles = [
      ['Visionary', 90],
      ['Analyzer', 75],
      ['Coach', 80],
      ['Driver', 70],
      ['Supporter', 65],
    ];

    styles.forEach(([name, pct]) => {
      doc.fontSize(9).fillColor('#333').text(name, M, y);
      const barW = 180, barH = 6;
      doc.rect(M + 150, y + 2, barW, barH).stroke('#D0D8E0');
      doc.rect(M + 150, y + 2, (pct / 100) * barW, barH).fill('#4A7FA5');
      doc.fontSize(9).fillColor('#4A7FA5').text(pct + '%', M + 335, y + 2);
      y += 18;
    });

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor('#132030').text('90-DAY ROADMAP', M, y);
    y += 25;

    const months = [
      { title: 'Month 1: Self-Awareness Foundation', desc: 'Gather 360 feedback, reflect on key strengths and derailers, identify top 3 priority development areas. Schedule coaching sessions.' },
      { title: 'Month 2: Development & Action', desc: 'Launch targeted development initiatives. Implement 30-day micro-habits. Weekly progress check-ins. Adjust tactics based on early wins.' },
      { title: 'Month 3: Integration & Momentum', desc: 'Consolidate learning into sustainable habits. Share results and learnings with key stakeholders. Plan next quarter leadership priorities.' },
    ];

    months.forEach(m => {
      doc.fontSize(11).fillColor('#4A7FA5').text(m.title, M, y);
      y += 16;
      const descHeight = doc.heightOfString(m.desc, { width: CW });
      doc.fontSize(9).fillColor('#666').text(m.desc, M, y, { width: CW });
      y += descHeight + 14;
    });

    // PAGE: RECOMMENDED RESOURCES
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor('#132030').text('RECOMMENDED RESOURCES', M, y);
    y += 25;

    doc.fontSize(11).fillColor('#4A7FA5').text('Books', M, y);
    y += 16;
    ['Multipliers - Liz Wiseman', 'The Innovator\'s Dilemma - Clayton Christensen', 'Radical Candor - Kim Scott', 'The 15 Commitments of Conscious Leadership'].forEach(b => {
      doc.fontSize(9).fillColor('#333').text('• ' + b, M + 12, y);
      y += 12;
    });

    y += 10;
    doc.fontSize(11).fillColor('#4A7FA5').text('Coaching & Development', M, y);
    y += 16;
    ['Executive coaching - 6-month program', '360-degree feedback assessment follow-up', 'Leadership peer coaching groups', 'Skill-specific workshops'].forEach(c => {
      doc.fontSize(9).fillColor('#333').text('• ' + c, M + 12, y);
      y += 12;
    });

    // PAGE: CERTIFICATE
    doc.addPage();
    pageNum++;
    doc.rect(20, 20, W - 40, H - 40).strokeColor('#132030').lineWidth(2).stroke();
    doc.rect(30, 30, W - 60, H - 60).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.fontSize(20).fillColor('#132030').text('CERTIFICATE OF LEADERSHIP', M, 120, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#666').text('This certifies that', M, 220, { align: 'center', width: CW });
    doc.fontSize(18).fillColor('#132030').text(leaderName || 'Leader Name', M, 260, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#666').text('has successfully completed the', M, 320, { align: 'center', width: CW });
    doc.fontSize(14).fillColor('#4A7FA5').text(quizTitle, M, 355, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#666').text('Leadership Assessment and Coaching Program', M, 385, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#4A7FA5').text('PRIMARY STYLE: ' + primaryStyle, M, 480, { align: 'center', width: CW });
    doc.fontSize(9).fillColor('#8A9BB0').text('Date: ' + new Date().toLocaleDateString(), M, 620, { align: 'center', width: CW });

    // PAGE: BACK COVER
    doc.addPage();
    doc.rect(0, 0, W, H).fill('#132030');
    doc.fontSize(24).fillColor('#ffffff').text('LEANGLE', M, 250, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#4A7FA5').text('HR LAB', M, 290, { align: 'center', width: CW });
    doc.fontSize(12).fillColor('#8A9BB0').text('Thank you for investing in your leadership development.', M, 380, { align: 'center', width: CW });
    doc.moveTo(M + 100, 430).lineTo(M + CW - 100, 430).strokeColor('#4A7FA5').lineWidth(1).stroke();
    doc.fontSize(10).fillColor('#8A9BB0').text('Questions or feedback?', M, 460, { align: 'center', width: CW });
    doc.fontSize(10).fillColor('#8A9BB0').text('support@leanglehrlab.com', M, 485, { align: 'center', width: CW });
    doc.fontSize(8).fillColor('#666').text('© 2026 LEANGLE HR LAB | All rights reserved', M, H - 40, { align: 'center', width: CW });

    doc.end();
  });
}
