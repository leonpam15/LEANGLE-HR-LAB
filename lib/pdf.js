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
    } else if (t) current.content.push(t);
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
      doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text('LEANGLE HR LAB', M, 15);
      doc.fontSize(8).font('Helvetica').fillColor('#999').text(`${pageNum}`, M + CW - 30, 15, { width: 30, align: 'right' });
    };

    let logoBuffer = null;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'leangle-logo.png');
      if (fs.existsSync(logoPath)) logoBuffer = fs.readFileSync(logoPath);
    } catch (e) {}

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill(NAVY);
    doc.fontSize(48).font('Helvetica-Bold').fillColor('#fff').text('LEANGLE', M, 180, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('HR LAB', M, 250, { align: 'center', width: CW });
    doc.fontSize(15).font('Helvetica-Bold').fillColor('#fff').text(quizTitle, M, 320, { align: 'center', width: CW });
    doc.rect((W - 120) / 2, 410, 120, 32).fill(CREAM).strokeColor(STEEL_BLUE).lineWidth(1.5).stroke();
    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(primaryStyle, (W - 120) / 2, 421, { align: 'center', width: 120 });
    doc.fontSize(10).font('Helvetica').fillColor(CREAM).text('Prepared for', M, 510, { align: 'center', width: CW });
    doc.fontSize(15).font('Helvetica-Bold').fillColor('#fff').text(leaderName || 'Your Name', M, 540, { align: 'center', width: CW });

    const sections = parseContent(reportContent);

    // PAGES: AI SECTIONS
    doc.addPage();
    pageNum = 2;
    header();
    let y = 65;
    
    for (const section of sections) {
      if (y + 50 > H - 60) {
        doc.addPage();
        pageNum++;
        header();
        y = 65;
      }

      doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(section.title, M, y);
      y += 16;
      doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
      y += 18;

      for (const line of section.content) {
        const h = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 10 });
        if (y + h + 14 > H - 60) {
          doc.addPage();
          pageNum++;
          header();
          y = 65;
        }

        if (line.startsWith('-')) {
          doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + line.replace(/^-\s+/, ''), M + 12, y, { width: CW - 24 });
        } else {
          doc.fontSize(10).font('Helvetica').fillColor('#333').text(line, M, y, { width: CW });
        }
        y += h + 8;
      }
      y += 14;
    }

    // PAGE: LEADERSHIP PROFILE
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('These dimensions represent your core leadership strengths. Each score reflects how you naturally approach leadership challenges and opportunities.', M, y, { width: CW });
    y += 20;

    const scores = [
      { label: 'People Focus', value: 8, desc: 'How much you prioritize relationships and team wellbeing' },
      { label: 'Visibility Drive', value: 7, desc: 'Your comfort with visibility and influence in the organization' },
      { label: 'Speed to Act', value: 8, desc: 'Your decisiveness and ability to move quickly' },
      { label: 'Influence', value: 7, desc: 'Your natural ability to persuade and inspire others' },
      { label: 'Innovation', value: 8, desc: 'Your openness to new ideas and willingness to disrupt status quo' },
    ];

    scores.forEach(s => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      y += 12;
      const barW = 160, barH = 8;
      doc.rect(M + 160, y - 12, barW, barH).stroke('#ddd');
      doc.rect(M + 160, y - 12, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 330, y - 12);
      doc.fontSize(8).font('Helvetica').fillColor('#666').text(s.desc, M + 160, y, { width: CW - 160 });
      y += 18;
    });

    y += 10;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Interpretation: Your scores indicate a leader who is both people-focused and results-driven. You balance relationship-building with the drive to move forward decisively.', M, y, { width: CW });

    // PAGE: STYLE BREAKDOWN
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP STYLE ANALYSIS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Primary Style:', M, y);
    y += 13;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(primaryStyle, M, y);
    y += 16;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('This represents your natural leadership mode. It\'s how you lead when you\'re at your best and under pressure. Understanding this helps you recognize when you\'re in flow and when you might need to adapt.', M, y, { width: CW });
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Style Profile:', M, y);
    y += 14;

    const styles = [
      { name: 'Visionary', pct: 90, desc: 'Big-picture thinking, sets direction' },
      { name: 'Analyzer', pct: 75, desc: 'Data-driven, thorough in approach' },
      { name: 'Coach', pct: 80, desc: 'Develops others, high emotional intelligence' },
      { name: 'Driver', pct: 70, desc: 'Results-focused, competitive' },
      { name: 'Supporter', pct: 65, desc: 'Collaborative, team player' },
    ];

    styles.forEach(s => {
      doc.fontSize(10).font('Helvetica').fillColor('#333').text(s.name, M, y, { width: 90 });
      const barW = 150, barH = 6;
      doc.rect(M + 110, y + 2, barW, barH).stroke('#ddd');
      doc.rect(M + 110, y + 2, (s.pct / 100) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.pct + '%', M + 265, y + 2);
      y += 10;
      doc.fontSize(8).font('Helvetica').fillColor('#666').text(s.desc, M + 110, y, { width: CW - 110 });
      y += 14;
    });

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('90-DAY LEADERSHIP ROADMAP', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('This roadmap breaks your development journey into three focused phases, each building on the previous. Commit to weekly actions and track progress consistently.', M, y, { width: CW });
    y += 18;

    const roadmap = [
      { phase: 'PHASE 1: SELF-AWARENESS & FOUNDATION', time: 'Weeks 1-4', actions: ['Conduct 360-degree feedback conversations', 'Identify your top 3 development priorities', 'Schedule executive coaching sessions', 'Reflect on your strengths and blind spots'] },
      { phase: 'PHASE 2: DEVELOPMENT & MOMENTUM', time: 'Weeks 5-8', actions: ['Implement 2-3 micro-habits aligned with goals', 'Complete leadership skill workshops', 'Weekly coaching and progress tracking', 'Gather stakeholder feedback on early changes'] },
      { phase: 'PHASE 3: INTEGRATION & SUSTAINABILITY', time: 'Weeks 9-12', actions: ['Consolidate new behaviors into habits', 'Share learnings with your team', 'Assess progress against success metrics', 'Plan next quarter\'s leadership priorities'] },
    ];

    roadmap.forEach(r => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(r.phase, M, y);
      y += 12;
      doc.fontSize(8).font('Helvetica').fillColor('#666').text(r.time, M + 12, y);
      y += 12;
      r.actions.forEach(a => {
        doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + a, M + 12, y, { width: CW - 24 });
        y += 10;
      });
      y += 10;
    });

    // PAGE: RESOURCES
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('RECOMMENDED RESOURCES', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Books', M, y);
    y += 14;
    ['Multipliers - Liz Wiseman', 'The Innovator\'s Dilemma - Clayton Christensen', 'Radical Candor - Kim Scott', 'The 15 Commitments of Conscious Leadership'].forEach(b => {
      doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + b, M + 12, y);
      y += 12;
    });

    y += 10;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Coaching & Development', M, y);
    y += 14;
    ['Executive coaching - 6-month program', '360-degree feedback assessment follow-up', 'Leadership peer coaching groups', 'Skill-specific workshops'].forEach(c => {
      doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + c, M + 12, y);
      y += 12;
    });

    // PAGE: ACTION COMMITMENTS 1
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 14;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 22;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 22;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 26;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Success Metrics:', M, y);
    y += 14;
    doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');
    y += 50;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Key Obstacles & Solutions:', M, y);
    y += 14;
    doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');

    // PAGE: MICRO HABITS (EXPANDED)
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WEEKLY MICRO-HABITS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Small, consistent actions compound into major transformation. List 1-2 specific actions for each week below.', M, y, { width: CW });
    y += 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Week 1-2:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
    y += 46;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Week 3-4:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
    y += 46;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Week 5-8:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
    y += 46;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Week 9-12:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');

    // PAGE: ACCOUNTABILITY
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('ACCOUNTABILITY PARTNER AGREEMENT', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(10).font('Helvetica').fillColor('#333').text('I commit to my leadership development and will leverage support to achieve my goals.', M, y, { width: CW });
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Accountability Partner:', M, y);
    y += 13;
    doc.rect(M, y, CW, 18).stroke('#ccc');
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Check-in Frequency:', M, y);
    y += 13;
    doc.rect(M, y, CW, 18).stroke('#ccc');
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('What I Want My Accountability Partner to Know:', M, y);
    y += 13;
    doc.rect(M, y, CW, 50).stroke('#ccc');
    y += 56;

    doc.fontSize(9).font('Helvetica').fillColor(NAVY).text('Signature: _________________________     Date: ________________', M, y);

    // PAGE: CERTIFICATE
    doc.addPage();
    pageNum++;
    doc.rect(20, 20, W - 40, H - 40).strokeColor(NAVY).lineWidth(2.5).stroke();
    doc.rect(30, 30, W - 60, H - 60).strokeColor(STEEL_BLUE).lineWidth(1).stroke();
    
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, (W - 160) / 2, 50, { width: 160, height: 85 });
      } catch (e) {}
    }

    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('CERTIFICATE OF LEADERSHIP', M, 160, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('This certifies that', M, 190, { align: 'center', width: CW });
    doc.fontSize(16).font('Helvetica-Bold').fillColor(NAVY).text(leaderName || 'Leader Name', M, 215, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('has successfully completed the', M, 245, { align: 'center', width: CW });
    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(quizTitle, M, 270, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Leadership Assessment and Coaching Program', M, 295, { align: 'center', width: CW });
    doc.moveTo(M + 70, 330).lineTo(M + CW - 70, 330).strokeColor(GOLD).lineWidth(1.5).stroke();
    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('PRIMARY STYLE: ' + primaryStyle, M, 355, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica').fillColor('#999').text('Date: ' + new Date().toLocaleDateString(), M, 630, { align: 'center', width: CW });

    // PAGE: BACK COVER
    doc.addPage();
    pageNum++;
    doc.rect(0, 0, W, H).fill(NAVY);
    
    // Logo on back cover
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, (W - 180) / 2, 120, { width: 180, height: 100 });
      } catch (e) {}
    }

    doc.fontSize(12).font('Helvetica').fillColor(CREAM).text('Thank you for investing in your leadership development.', M, 280, { align: 'center', width: CW });
    doc.moveTo(M + 80, 320).lineTo(M + CW - 80, 320).strokeColor(GOLD).lineWidth(1).stroke();
    doc.fontSize(10).font('Helvetica').fillColor(CREAM).text('Questions or feedback?', M, 350, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor(CREAM).text('support@leanglehrlab.com', M, 375, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text('© 2026 LEANGLE HR LAB | All rights reserved', M, H - 40, { align: 'center', width: CW });

    doc.end();
  });
}
