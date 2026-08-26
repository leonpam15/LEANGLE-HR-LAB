import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

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

    const NAVY = '#0B1F3A';
    const STEEL_BLUE = '#2C5F82';
    const CREAM = '#E8E0D0';
    const GOLD = '#C9A84C';

    const header = () => {
      doc.fontSize(8).fillColor(STEEL_BLUE).text('LEANGLE HR LAB', M, 15);
      doc.fontSize(8).fillColor('#888').text(`${pageNum}`, M + CW - 30, 15, { width: 30, align: 'right' });
    };

    // Try to load logo
    let logoPath = null;
    try {
      const publicPath = path.join(process.cwd(), 'public', 'leangle-logo.png');
      if (fs.existsSync(publicPath)) logoPath = publicPath;
    } catch (e) {}

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill(NAVY);
    doc.fontSize(48).fillColor('#ffffff').text('LEANGLE', M, 200, { align: 'center', width: CW });
    doc.fontSize(13).fillColor(STEEL_BLUE).text('HR LAB', M, 270, { align: 'center', width: CW });
    doc.fontSize(22).fillColor('#ffffff').text(quizTitle, M, 340, { align: 'center', width: CW });
    
    // Logo if available
    if (logoPath) {
      try {
        doc.image(logoPath, (W - 200) / 2, 420, { width: 200, height: 120 });
      } catch (e) {}
    }
    
    doc.fontSize(11).fillColor(CREAM).text('Prepared for', M, 560, { align: 'center', width: CW });
    doc.fontSize(16).fillColor('#ffffff').text(leaderName || 'Your Name', M, 585, { align: 'center', width: CW });

    // PARSE AI CONTENT
    const sections = parseContent(reportContent);

    // PAGES: AI SECTIONS
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

      doc.fontSize(13).fillColor(NAVY).text(section.title, M, y);
      y += 20;
      doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
      y += 16;

      for (const line of section.content) {
        const lineHeight = doc.heightOfString(line, { width: CW });
        if (y + lineHeight + 10 > H - 60) {
          doc.addPage();
          pageNum++;
          header();
          y = 60;
        }

        if (line.startsWith('-')) {
          doc.fontSize(10).fillColor('#333').text('• ' + line.replace(/^-\s+/, ''), M + 12, y, { width: CW - 24 });
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
    doc.fontSize(13).fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 25;

    const scoreLabels = ['People Focus', 'Visibility Drive', 'Speed to Act', 'Influence', 'Innovation'];
    const scoreValues = [8, 7, 8, 7, 8];
    
    scoreLabels.forEach((label, i) => {
      const val = scoreValues[i];
      doc.fontSize(10).fillColor('#333').text(label, M, y);
      const barW = 200, barH = 8;
      doc.rect(M + 180, y - 2, barW, barH).stroke('#ccc');
      doc.rect(M + 180, y - 2, (val / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(9).fillColor(STEEL_BLUE).text(val + '/10', M + 385, y - 2);
      y += 18;
    });

    // PAGE: STYLE BREAKDOWN
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor(NAVY).text('STYLE BREAKDOWN', M, y);
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
      doc.rect(M + 150, y + 2, barW, barH).stroke('#ccc');
      doc.rect(M + 150, y + 2, (pct / 100) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(9).fillColor(STEEL_BLUE).text(pct + '%', M + 335, y + 2);
      y += 18;
    });

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor(NAVY).text('90-DAY ROADMAP', M, y);
    y += 25;

    const months = [
      { title: 'Month 1: Self-Awareness Foundation', desc: 'Gather 360 feedback, reflect on key strengths and derailers, identify top 3 priority development areas. Schedule coaching sessions.' },
      { title: 'Month 2: Development & Action', desc: 'Launch targeted development initiatives. Implement 30-day micro-habits. Weekly progress check-ins. Adjust tactics based on early wins.' },
      { title: 'Month 3: Integration & Momentum', desc: 'Consolidate learning into sustainable habits. Share results and learnings with key stakeholders. Plan next quarter leadership priorities.' },
    ];

    months.forEach(m => {
      doc.fontSize(11).fillColor(STEEL_BLUE).text(m.title, M, y);
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
    doc.fontSize(13).fillColor(NAVY).text('RECOMMENDED RESOURCES', M, y);
    y += 25;

    doc.fontSize(11).fillColor(STEEL_BLUE).text('Books', M, y);
    y += 16;
    ['Multipliers - Liz Wiseman', 'The Innovator\'s Dilemma - Clayton Christensen', 'Radical Candor - Kim Scott', 'The 15 Commitments of Conscious Leadership'].forEach(b => {
      doc.fontSize(9).fillColor('#333').text('• ' + b, M + 12, y);
      y += 12;
    });

    y += 10;
    doc.fontSize(11).fillColor(STEEL_BLUE).text('Coaching & Development', M, y);
    y += 16;
    ['Executive coaching - 6-month program', '360-degree feedback assessment follow-up', 'Leadership peer coaching groups', 'Skill-specific workshops'].forEach(c => {
      doc.fontSize(9).fillColor('#333').text('• ' + c, M + 12, y);
      y += 12;
    });

    // PAGE: MY ACTION COMMITMENTS (Page 1)
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 25;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 16;

    doc.fontSize(11).fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 14;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 24;

    doc.fontSize(11).fillColor(NAVY).text('Success Metrics (How will I know I\'ve succeeded?):', M, y);
    y += 14;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
    y += 48;

    doc.fontSize(11).fillColor(NAVY).text('Key Obstacles & How I\'ll Overcome Them:', M, y);
    y += 14;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');

    // PAGE: MY ACTION COMMITMENTS (Page 2)
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor(NAVY).text('WEEKLY MICRO-HABITS', M, y);
    y += 25;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 16;

    doc.fontSize(10).fillColor(NAVY).text('Week 1-2 Actions:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');
    y += 32;

    doc.fontSize(10).fillColor(NAVY).text('Week 3-4 Actions:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');
    y += 32;

    doc.fontSize(10).fillColor(NAVY).text('Week 5-8 Actions:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');
    y += 32;

    doc.fontSize(10).fillColor(NAVY).text('Week 9-12 Actions:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');

    // PAGE: ACCOUNTABILITY PARTNER
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(13).fillColor(NAVY).text('ACCOUNTABILITY PARTNER AGREEMENT', M, y);
    y += 25;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 16;

    doc.fontSize(10).fillColor('#333').text('I commit to my leadership development and will leverage support to achieve my goals.', M, y, { width: CW });
    y += 20;

    doc.fontSize(11).fillColor(NAVY).text('My Accountability Partner:', M, y);
    y += 12;
    doc.rect(M, y, CW, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).fillColor(NAVY).text('Check-in Frequency:', M, y);
    y += 12;
    doc.rect(M, y, CW, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).fillColor(NAVY).text('What I Want My Accountability Partner to Know:', M, y);
    y += 12;
    doc.rect(M, y, CW, 48).stroke('#ccc');
    y += 52;

    doc.fontSize(9).fillColor(NAVY).text('My Signature: ___________________     Date: _______________', M, y);

    // PAGE: CERTIFICATE
    doc.addPage();
    pageNum++;
    doc.rect(20, 20, W - 40, H - 40).strokeColor(NAVY).lineWidth(2.5).stroke();
    doc.rect(30, 30, W - 60, H - 60).strokeColor(STEEL_BLUE).lineWidth(1).stroke();
    
    // Logo on certificate if available
    if (logoPath) {
      try {
        doc.image(logoPath, (W - 140) / 2, 50, { width: 140, height: 85 });
      } catch (e) {}
    }

    doc.fontSize(18).fillColor(NAVY).text('CERTIFICATE OF LEADERSHIP', M, 160, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#666').text('This certifies that', M, 240, { align: 'center', width: CW });
    doc.fontSize(18).fillColor(NAVY).text(leaderName || 'Leader Name', M, 280, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#666').text('has successfully completed the', M, 330, { align: 'center', width: CW });
    doc.fontSize(14).fillColor(STEEL_BLUE).text(quizTitle, M, 360, { align: 'center', width: CW });
    doc.fontSize(11).fillColor('#666').text('Leadership Assessment and Coaching Program', M, 390, { align: 'center', width: CW });
    
    doc.moveTo(M + 60, 430).lineTo(M + CW - 60, 430).strokeColor(GOLD).lineWidth(1.5).stroke();
    
    doc.fontSize(11).fillColor(STEEL_BLUE).text('PRIMARY STYLE: ' + primaryStyle, M, 460, { align: 'center', width: CW });
    doc.fontSize(9).fillColor('#888').text('Date: ' + new Date().toLocaleDateString(), M, 630, { align: 'center', width: CW });

    // PAGE: BACK COVER
    doc.addPage();
    doc.rect(0, 0, W, H).fill(NAVY);
    doc.fontSize(24).fillColor('#ffffff').text('LEANGLE', M, 250, { align: 'center', width: CW });
    doc.fontSize(11).fillColor(STEEL_BLUE).text('HR LAB', M, 290, { align: 'center', width: CW });
    doc.fontSize(12).fillColor(CREAM).text('Thank you for investing in your leadership development.', M, 380, { align: 'center', width: CW });
    doc.moveTo(M + 100, 430).lineTo(M + CW - 100, 430).strokeColor(GOLD).lineWidth(1).stroke();
    doc.fontSize(10).fillColor(CREAM).text('Questions or feedback?', M, 460, { align: 'center', width: CW });
    doc.fontSize(10).fillColor(CREAM).text('support@leanglehrlab.com', M, 485, { align: 'center', width: CW });
    doc.fontSize(8).fillColor(STEEL_BLUE).text('© 2026 LEANGLE HR LAB | All rights reserved', M, H - 40, { align: 'center', width: CW });

    doc.end();
  });
}
