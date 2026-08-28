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
      y += 16;

      for (const line of section.content) {
        const h = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 10 });
        if (y + h + 20 > H - 60) {
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
        y += h + 10;
      }
      y += 16;
    }

    // PAGE: LEADERSHIP PROFILE (EXPANDED)
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('These five dimensions represent your core leadership strengths and how you naturally approach your role. Your profile reveals a leader who is highly people-focused, action-oriented, and comfortable driving innovation. You balance ambitious goals with genuine concern for team wellbeing. Understanding where you score high helps you leverage your natural strengths and build credibility quickly.', M, y, { width: CW });
    y += 26;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('What Your Scores Mean:', M, y);
    y += 14;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('High scores (7-10) indicate your natural strengths. These are areas where you lead with energy, confidence, and effectiveness. Your team likely sees these as your most distinctive leadership qualities. Medium scores (4-6) are neutral—you can operate here when needed. Lower scores (0-3) indicate areas where you might need to be more intentional or develop capability.', M, y, { width: CW });
    y += 26;

    const scores = [
      { label: 'People Focus', value: 8, desc: 'You prioritize team development and emotional wellbeing. High score means your team feels valued and supported.' },
      { label: 'Visibility Drive', value: 7, desc: 'You\'re comfortable with visibility and influence. You naturally step up and speak out.' },
      { label: 'Speed to Act', value: 8, desc: 'You\'re decisive and action-oriented. You move quickly even with incomplete information.' },
      { label: 'Influence', value: 7, desc: 'You persuade and mobilize others easily. You build coalitions and create momentum.' },
      { label: 'Innovation', value: 8, desc: 'You\'re forward-thinking and comfort able with change. You challenge the status quo.' },
    ];

    scores.forEach(s => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      y += 11;
      const barW = 140, barH = 7;
      doc.rect(M + 150, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 150, y, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 300, y - 2);
      y += 10;
      doc.fontSize(8).font('Helvetica').fillColor('#666').text(s.desc, M + 150, y, { width: CW - 150 });
      y += 14;
    });

    y += 10;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Overall Interpretation: Your profile shows a leader who is energized by people, comfortable with change, and drives results. You likely have high energy, build trust quickly, and create momentum in your organization. The combination of People Focus and Speed to Act means you\'re effective at both employee engagement and execution.', M, y, { width: CW });

    // PAGE: STYLE BREAKDOWN (EXPANDED)
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP STYLE ANALYSIS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Primary Style: ' + primaryStyle, M, y);
    y += 15;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('This is your natural default way of leading—how you naturally show up when you\'re at your best and when you\'re under pressure. It reflects your strengths, values, and how others experience you. Your ' + primaryStyle + ' style means you focus on possibilities, inspire others with compelling vision, and lead through genuine relationships rather than formal authority.', M, y, { width: CW });
    y += 24;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Style Shows Up in Practice:', M, y);
    y += 12;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('You naturally see the bigger picture before others do. You help people understand how their work contributes to larger organizational goals. You build strong relationships quickly and use genuine connection as a primary leadership tool. You inspire others with your optimism and possibility-focused thinking. You tend to lead through questions and curiosity rather than directives, which develops capability in others. You enjoy building consensus but can move forward decisively when needed. You adapt your approach based on people\'s emotional states and needs.', M, y, { width: CW });
    y += 44;

    const styles = [
      { name: 'Visionary', pct: 90, desc: 'See possibilities, set compelling direction' },
      { name: 'Analyzer', pct: 75, desc: 'Data-driven, thorough, careful' },
      { name: 'Coach', pct: 80, desc: 'Develop others, high EQ, invest in people' },
      { name: 'Driver', pct: 70, desc: 'Results-focused, competitive, ambitious' },
      { name: 'Supporter', pct: 65, desc: 'Collaborative, team player, seek harmony' },
    ];

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Complete Style Profile:', M, y);
    y += 14;

    styles.forEach(s => {
      doc.fontSize(9).font('Helvetica').fillColor('#333').text(s.name, M, y);
      y += 11;
      const barW = 140, barH = 6;
      doc.rect(M + 100, y - 8, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 100, y - 8, (s.pct / 100) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.pct + '%', M + 245, y - 10);
      doc.fontSize(8).font('Helvetica').fillColor('#666').text(s.desc, M + 100, y + 2, { width: CW - 100 });
      y += 14;
    });

    // PAGE: 90-DAY ROADMAP (EXPANDED)
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('90-DAY LEADERSHIP ROADMAP', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('This roadmap breaks your development journey into three focused phases. Each phase builds on the previous and has clear milestones. The goal is to move from awareness to action to integration—building sustainable habits and results over the 90 days.', M, y, { width: CW });
    y += 20;

    const roadmap = [
      { 
        phase: 'PHASE 1: SELF-AWARENESS & FOUNDATION', 
        time: 'Weeks 1-4',
        overview: 'Build foundation for change by gathering data and reflecting',
        actions: [
          'Conduct 360-degree feedback with 5-6 key stakeholders',
          'Identify your top 3 development priorities',
          'Schedule monthly executive coaching',
          'Reflect on strengths, blind spots, patterns'
        ]
      },
      { 
        phase: 'PHASE 2: DEVELOPMENT & MOMENTUM', 
        time: 'Weeks 5-8',
        overview: 'Execute targeted development and gather early feedback',
        actions: [
          'Implement 2-3 micro-habits aligned with goals',
          'Complete leadership workshops or reading',
          'Weekly coaching for tracking and adjusting',
          'Gather stakeholder feedback on changes'
        ]
      },
      { 
        phase: 'PHASE 3: INTEGRATION & SUSTAINABILITY', 
        time: 'Weeks 9-12',
        overview: 'Lock in gains and prepare for ongoing development',
        actions: [
          'Consolidate behaviors into lasting habits',
          'Share learnings with team and leaders',
          'Assess progress against success metrics',
          'Plan next quarter priorities'
        ]
      },
    ];

    roadmap.forEach(r => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text(r.phase, M, y);
      y += 12;
      doc.fontSize(8).font('Helvetica').fillColor('#666').text(r.time + ' | ' + r.overview, M + 12, y);
      y += 10;
      r.actions.forEach(a => {
        doc.fontSize(9).font('Helvetica').fillColor('#333').text('• ' + a, M + 12, y, { width: CW - 24 });
        y += 10;
      });
      y += 12;
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

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Recommended Books', M, y);
    y += 14;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Multipliers - Liz Wiseman', M, y);
    y += 11;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Essential for leaders who want to develop their teams. Contrasts multipliers (who expand capability) with diminishers. Supports your People Focus strength.', M, y, { width: CW });
    y += 18;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('The Innovator\'s Dilemma - Clayton Christensen', M, y);
    y += 11;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('A classic on disruption and innovation. Provides frameworks for anticipating market shifts and leading transformation. Perfect for your Visionary strength.', M, y, { width: CW });
    y += 18;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Radical Candor - Kim Scott', M, y);
    y += 11;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Addresses the balance between caring and challenging. Helps you give feedback effectively while maintaining relationships. Supports moving toward decisiveness.', M, y, { width: CW });
    y += 18;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('The 15 Commitments - Jim Dethmer et al.', M, y);
    y += 11;
    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Supports emotional intelligence and self-awareness. Provides frameworks for conscious decision-making and authentic communication.', M, y, { width: CW });
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Coaching & Development', M, y);
    y += 14;
    doc.fontSize(9).font('Helvetica').fillColor('#333').text('• Executive coaching - 6-month program\n• 360-degree feedback follow-up after 90 days\n• Leadership peer coaching groups\n• Communication and decision-making workshops', M, y, { width: CW });

    // PAGE: ACTION COMMITMENTS
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Success Metrics:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');
    y += 50;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Key Obstacles & Solutions:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');

    // PAGE: MICRO HABITS
    doc.addPage();
    pageNum++;
    header();
    y = 65;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WEEKLY MICRO-HABITS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Small, consistent actions compound into major transformation. List 1-2 specific actions for each period.', M, y, { width: CW });
    y += 16;

    ['Week 1-2', 'Week 3-4', 'Week 5-8', 'Week 9-12'].forEach(week => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(week + ':', M, y);
      y += 12;
      doc.rect(M + 12, y, CW - 24, 50).stroke('#ccc');
      y += 54;
    });

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
    y += 12;
    doc.rect(M, y, CW, 18).stroke('#ccc');
    y += 22;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Check-in Frequency:', M, y);
    y += 12;
    doc.rect(M, y, CW, 18).stroke('#ccc');
    y += 22;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('What I Want My Accountability Partner to Know:', M, y);
    y += 12;
    doc.rect(M, y, CW, 50).stroke('#ccc');
    y += 54;

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
