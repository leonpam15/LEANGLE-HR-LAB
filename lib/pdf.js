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

    const NAVY = '#0B1F3A';
    const STEEL_BLUE = '#2C5F82';
    const CREAM = '#E8E0D0';
    const GOLD = '#C9A84C';
    const DARK_GRAY = '#333333';
    const MID_GRAY = '#666666';
    const LIGHT_GRAY = '#999999';

    const header = () => {
      doc.fontSize(8).fillColor(STEEL_BLUE).text('LEANGLE HR LAB', M, 15);
      doc.fontSize(8).fillColor(LIGHT_GRAY).text(`${pageNum}`, M + CW - 30, 15, { width: 30, align: 'right' });
    };

    // PAGE 1: COVER
    doc.rect(0, 0, W, H).fill(NAVY);
    doc.fontSize(48).font('Helvetica-Bold').fillColor('#ffffff').text('LEANGLE', M, 200, { align: 'center', width: CW });
    doc.fontSize(14).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('HR LAB', M, 270, { align: 'center', width: CW });
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#ffffff').text(quizTitle, M, 340, { align: 'center', width: CW });
    doc.rect((W - 120) / 2, 430, 120, 30).fill(CREAM).strokeColor(STEEL_BLUE).lineWidth(1.5).stroke();
    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(primaryStyle, (W - 120) / 2, 440, { align: 'center', width: 120 });
    doc.fontSize(10).font('Helvetica').fillColor(CREAM).text('Prepared for', M, 560, { align: 'center', width: CW });
    doc.fontSize(15).font('Helvetica-Bold').fillColor('#ffffff').text(leaderName || 'Your Name', M, 585, { align: 'center', width: CW });

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

      doc.fontSize(13).font('Helvetica-Bold').fillColor(NAVY).text(section.title, M, y);
      y += 18;
      doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
      y += 14;

      for (const line of section.content) {
        const lineHeight = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 10 });
        if (y + lineHeight + 10 > H - 60) {
          doc.addPage();
          pageNum++;
          header();
          y = 60;
        }

        if (line.startsWith('-')) {
          doc.fontSize(10).font('Helvetica').fillColor(DARK_GRAY).text('• ' + line.replace(/^-\s+/, ''), M + 12, y, { width: CW - 24 });
        } else {
          doc.fontSize(10).font('Helvetica').fillColor(DARK_GRAY).text(line, M, y, { width: CW });
        }
        y += lineHeight + 6;
      }

      y += 10;
    }

    // PAGE: LEADERSHIP PROFILE (EXPANDED)
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 14;

    doc.fontSize(9).font('Helvetica').fillColor(MID_GRAY).text('Core Leadership Dimensions', M, y);
    y += 12;

    const scores = [
      { label: 'People Focus', value: 8, desc: 'How much you prioritize relationships and team wellbeing' },
      { label: 'Visibility Drive', value: 7, desc: 'Your comfort with visibility and influence in the organization' },
      { label: 'Speed to Act', value: 8, desc: 'Your decisiveness and ability to move quickly' },
      { label: 'Influence', value: 7, desc: 'Your natural ability to persuade and inspire others' },
      { label: 'Innovation', value: 8, desc: 'Your openness to new ideas and willingness to disrupt status quo' },
    ];

    scores.forEach(s => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      const barW = 180, barH = 8;
      doc.rect(M + 170, y, barW, barH).stroke('#ddd');
      doc.rect(M + 170, y, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 360, y);
      y += 14;
      doc.fontSize(8).font('Helvetica').fillColor(MID_GRAY).text(s.desc, M + 170, y, { width: CW - 170 });
      y += 14;
    });

    y += 8;
    doc.fontSize(9).font('Helvetica').fillColor(MID_GRAY).text('Interpretation: Your profile reveals a leader who is action-oriented, relationship-focused, and comfortable with change. You drive results while maintaining strong connections with your team.', M, y, { width: CW });

    // PAGE: STYLE BREAKDOWN (EXPANDED)
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP STYLE ANALYSIS', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Primary Style:', M, y);
    y += 12;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(primaryStyle, M, y);
    y += 14;
    doc.fontSize(9).font('Helvetica').fillColor(MID_GRAY).text('This style represents your natural way of leading, influencing others, and making decisions. It\'s your default mode under pressure and when you\'re most effective.', M, y, { width: CW });
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Style Distribution:', M, y);
    y += 14;

    const styles = [
      { name: 'Visionary', pct: 90, desc: 'Big-picture thinking, sets direction' },
      { name: 'Analyzer', pct: 75, desc: 'Data-driven, thorough in approach' },
      { name: 'Coach', pct: 80, desc: 'Develops others, high emotional intelligence' },
      { name: 'Driver', pct: 70, desc: 'Results-focused, competitive' },
      { name: 'Supporter', pct: 65, desc: 'Collaborative, team player' },
    ];

    styles.forEach(s => {
      doc.fontSize(9).font('Helvetica').fillColor(DARK_GRAY).text(s.name, M, y, { width: 90 });
      const barW = 160, barH = 6;
      doc.rect(M + 110, y + 2, barW, barH).stroke('#ddd');
      doc.rect(M + 110, y + 2, (s.pct / 100) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text(s.pct + '%', M + 275, y + 2);
      y += 10;
      doc.fontSize(8).font('Helvetica').fillColor(MID_GRAY).text(s.desc, M + 110, y, { width: CW - 110 });
      y += 12;
    });

    // PAGE: 90-DAY ROADMAP (EXPANDED)
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('90-DAY LEADERSHIP ROADMAP', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 14;

    doc.fontSize(10).font('Helvetica').fillColor(MID_GRAY).text('A structured 90-day plan to integrate your insights and build sustainable leadership habits.', M, y, { width: CW });
    y += 18;

    const roadmap = [
      { 
        phase: 'PHASE 1: SELF-AWARENESS & FOUNDATION', 
        timeframe: 'Weeks 1-4',
        focus: 'Build foundation for change',
        actions: [
          '• Conduct 360-degree feedback conversations',
          '• Identify your top 3 development priorities',
          '• Schedule executive coaching sessions',
          '• Reflect on your strengths and blind spots'
        ]
      },
      { 
        phase: 'PHASE 2: DEVELOPMENT & MOMENTUM', 
        timeframe: 'Weeks 5-8',
        focus: 'Execute targeted development',
        actions: [
          '• Implement 2-3 micro-habits aligned with goals',
          '• Complete leadership skill workshops',
          '• Weekly coaching and progress tracking',
          '• Gather stakeholder feedback on early changes'
        ]
      },
      { 
        phase: 'PHASE 3: INTEGRATION & SUSTAINABILITY', 
        timeframe: 'Weeks 9-12',
        focus: 'Lock in gains and plan ahead',
        actions: [
          '• Consolidate new behaviors into habits',
          '• Share learnings with your team',
          '• Assess progress against success metrics',
          '• Plan next quarter\'s leadership priorities'
        ]
      },
    ];

    roadmap.forEach(r => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text(r.phase, M, y);
      y += 12;
      doc.fontSize(8).font('Helvetica').fillColor(MID_GRAY).text(r.timeframe + ' | ' + r.focus, M + 12, y);
      y += 12;
      r.actions.forEach(action => {
        doc.fontSize(9).font('Helvetica').fillColor(DARK_GRAY).text(action, M + 12, y, { width: CW - 24 });
        y += 10;
      });
      y += 8;
    });

    // PAGE: RECOMMENDED RESOURCES
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('RECOMMENDED RESOURCES', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Books', M, y);
    y += 14;
    ['Multipliers - Liz Wiseman', 'The Innovator\'s Dilemma - Clayton Christensen', 'Radical Candor - Kim Scott', 'The 15 Commitments of Conscious Leadership'].forEach(b => {
      doc.fontSize(10).font('Helvetica').fillColor(DARK_GRAY).text('• ' + b, M + 12, y);
      y += 12;
    });

    y += 8;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Coaching & Development', M, y);
    y += 14;
    ['Executive coaching - 6-month program', '360-degree feedback assessment follow-up', 'Leadership peer coaching groups', 'Skill-specific workshops'].forEach(c => {
      doc.fontSize(10).font('Helvetica').fillColor(DARK_GRAY).text('• ' + c, M + 12, y);
      y += 12;
    });

    // PAGE: MY ACTION COMMITMENTS (Page 1)
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Success Metrics (How will I know I\'ve succeeded?):', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
    y += 48;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Key Obstacles & How I\'ll Overcome Them:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');

    // PAGE: MY ACTION COMMITMENTS (Page 2)
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WEEKLY MICRO-HABITS', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 14;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Week 1-2 Actions:', M, y);
    y += 11;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');
    y += 32;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Week 3-4 Actions:', M, y);
    y += 11;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');
    y += 32;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Week 5-8 Actions:', M, y);
    y += 11;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');
    y += 32;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Week 9-12 Actions:', M, y);
    y += 11;
    doc.rect(M + 12, y, CW - 24, 28).stroke('#ccc');

    // PAGE: ACCOUNTABILITY PARTNER
    doc.addPage();
    pageNum++;
    header();
    y = 60;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('ACCOUNTABILITY PARTNER AGREEMENT', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 14;

    doc.fontSize(10).font('Helvetica').fillColor(DARK_GRAY).text('I commit to my leadership development and will leverage support to achieve my goals.', M, y, { width: CW });
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Accountability Partner:', M, y);
    y += 12;
    doc.rect(M, y, CW, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Check-in Frequency:', M, y);
    y += 12;
    doc.rect(M, y, CW, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('What I Want My Accountability Partner to Know:', M, y);
    y += 12;
    doc.rect(M, y, CW, 48).stroke('#ccc');
    y += 52;

    doc.fontSize(9).font('Helvetica').fillColor(NAVY).text('My Signature: _________________________     Date: ________________', M, y);

    // PAGE: CERTIFICATE (WITH LOGO)
    doc.addPage();
    pageNum++;
    doc.rect(20, 20, W - 40, H - 40).strokeColor(NAVY).lineWidth(2.5).stroke();
    doc.rect(30, 30, W - 60, H - 60).strokeColor(STEEL_BLUE).lineWidth(1).stroke();
    
    // Placeholder for logo (styled box)
    doc.rect((W - 150) / 2, 50, 150, 90).strokeColor(GOLD).lineWidth(1.5).stroke();
    doc.fontSize(10).font('Helvetica-Bold').fillColor(GOLD).text('LEANGLE', (W - 150) / 2, 70, { align: 'center', width: 150 });
    doc.fontSize(8).font('Helvetica').fillColor(GOLD).text('HR LAB', (W - 150) / 2, 90, { align: 'center', width: 150 });

    doc.fontSize(16).font('Helvetica-Bold').fillColor(NAVY).text('CERTIFICATE OF LEADERSHIP', M, 160, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica').fillColor(MID_GRAY).text('This certifies that', M, 240, { align: 'center', width: CW });
    doc.fontSize(16).font('Helvetica-Bold').fillColor(NAVY).text(leaderName || 'Leader Name', M, 280, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica').fillColor(MID_GRAY).text('has successfully completed the', M, 330, { align: 'center', width: CW });
    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(quizTitle, M, 360, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica').fillColor(MID_GRAY).text('Leadership Assessment and Coaching Program', M, 390, { align: 'center', width: CW });
    
    doc.moveTo(M + 60, 430).lineTo(M + CW - 60, 430).strokeColor(GOLD).lineWidth(1.5).stroke();
    
    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('PRIMARY STYLE: ' + primaryStyle, M, 460, { align: 'center', width: CW });
    doc.fontSize(9).font('Helvetica').fillColor(LIGHT_GRAY).text('Date: ' + new Date().toLocaleDateString(), M, 630, { align: 'center', width: CW });

    doc.end();
  });
}
