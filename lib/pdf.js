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
    const doc = new PDFDocument({ size: 'LETTER', margin: 38, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 612, H = 792, M = 38, CW = W - M * 2;
    let pageNum = 1;
    
    const NAVY = '#0B1F3A';
    const STEEL_BLUE = '#2C5F82';
    const CREAM = '#E8E0D0';
    const GOLD = '#C9A84C';

    const header = () => {
      doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text('LEANGLE HR LAB', M, 14);
      doc.fontSize(8).font('Helvetica').fillColor('#999').text(`${pageNum}`, M + CW - 15, 14, { width: 15, align: 'right' });
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

    // PAGE 2: YOUR LEADERSHIP NARRATIVE
    doc.addPage();
    pageNum = 2;
    header();
    let y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP NARRATIVE', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Leadership Identity', M, y);
    y += 13;
    
    let narrativeText = `Every leader has a unique story. Your ${primaryStyle} leadership style has been shaped by your experiences, mentors, challenges, and values. This assessment captures not just how you lead, but why you lead that way.

Your ${primaryStyle} style reveals a leader who brings distinct value to any organization. This represents how you naturally show up, respond under pressure, and what others depend on you for. Understanding your profile gives you insight into your leadership brand and impact.

Many leaders go through their careers without understanding their profile. This assessment moves you from unconscious competence to conscious mastery, giving you a framework for understanding what you do well and how to leverage it strategically.`;

    let narHeight = doc.heightOfString(narrativeText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(narrativeText, M, y, { width: CW });
    y += narHeight + 14;

    // PAGE 3: WHAT THIS ASSESSMENT MEASURES
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WHAT THIS ASSESSMENT MEASURES', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Five Critical Dimensions of Leadership Effectiveness', M, y);
    y += 13;

    let measureText = `This assessment measures five critical dimensions that drive organizational outcomes. Each dimension represents a distinct capability that exceptional leaders develop and integrate. They work together like an orchestra - when all five are in harmony, leaders create extraordinary results.`;

    let measHeight = doc.heightOfString(measureText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(measureText, M, y, { width: CW });
    y += measHeight + 14;

    const dimensions = [
      {
        name: 'People Focus',
        desc: 'Your ability to develop others and create psychological safety. High people-focus leaders retain talent and build engaged teams.'
      },
      {
        name: 'Visibility Drive',
        desc: 'Your comfort with influence and leading from the front. Leaders high in visibility drive advocate for ideas and accelerate career progression.'
      },
      {
        name: 'Speed to Act',
        desc: 'Your decisiveness and ability to create momentum. This enables you to move ideas into reality quickly and energize teams.'
      },
      {
        name: 'Influence',
        desc: 'Your capacity to persuade and mobilize others. Leaders with strong influence build coalitions and move initiatives forward.'
      },
      {
        name: 'Innovation',
        desc: 'Your comfort with change and ability to drive transformation. Innovation-focused leaders see possibilities and position companies for growth.'
      }
    ];

    dimensions.forEach(d => {
      if (y + 25 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(d.name, M, y);
      y += 11;
      let dHeight = doc.heightOfString(d.desc, { width: CW - 12, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(d.desc, M + 12, y, { width: CW - 24 });
      y += dHeight + 13;
    });

    // PAGE 4: LEADERSHIP EFFECTIVENESS FRAMEWORK
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP EFFECTIVENESS FRAMEWORK', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Profile Drives Business Outcomes', M, y);
    y += 13;
    
    let effectivenessText = `Leadership effectiveness is the integrated application of multiple capabilities working together. Your profile shows how you naturally combine these dimensions and where development opportunities exist.`;

    let effHeight = doc.heightOfString(effectivenessText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(effectivenessText, M, y, { width: CW });
    y += effHeight + 14;

    const outcomes = [
      { dim: 'People Focus', outcome: 'Team Retention & Engagement', desc: 'Retain top talent, reduce turnover, improve productivity.' },
      { dim: 'Visibility Drive', outcome: 'Career Advancement & Influence', desc: 'Accelerate progression, increase organizational impact.' },
      { dim: 'Speed to Act', outcome: 'Execution & Competitive Advantage', desc: 'Faster execution, better positioning, organizational momentum.' },
      { dim: 'Influence', outcome: 'Stakeholder Alignment', desc: 'Build coalitions, gain buy-in, secure resources.' },
      { dim: 'Innovation', outcome: 'Organization Transformation', desc: 'Lead transformation, drive innovation, position for growth.' }
    ];

    outcomes.forEach(o => {
      if (y + 30 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }

      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(o.dim, M, y);
      y += 11;
      doc.fontSize(9).font('Helvetica').fillColor(NAVY).text('Business Outcome: ' + o.outcome, M + 12, y);
      y += 10;
      let oHeight = doc.heightOfString(o.desc, { width: CW - 12, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(o.desc, M + 12, y, { width: CW - 24 });
      y += oHeight + 14;
    });

    // PAGE 5: YOUR STRENGTHS IN ACTION
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR STRENGTHS IN ACTION', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Real-World Scenarios Where You Excel', M, y);
    y += 13;

    let actionText = `Below are scenarios where your ${primaryStyle} leadership strengths create advantage. Use these examples to recognize when you're at your best and to deliberately apply your strengths strategically.`;

    let actionHeight = doc.heightOfString(actionText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(actionText, M, y, { width: CW });
    y += actionHeight + 14;

    const scenarios = [
      {
        title: 'Scenario 1: Crisis or Major Organizational Transition',
        situation: 'Organization going through change. People anxious. Need direction.',
        action: 'Step up as stabilizing force. Paint clear future picture. Connect people to purpose. Your confidence will settle anxiety.'
      },
      {
        title: 'Scenario 2: Building a High-Performing Team',
        situation: 'Assembling new team for critical initiative. Need high performance quickly.',
        action: 'Identify talent with cultural fit. Set clear expectations. Give autonomy quickly. Create psychological safety.'
      },
      {
        title: 'Scenario 3: Navigating Organizational Politics',
        situation: 'Need approval from multiple stakeholders with different priorities.',
        action: 'Map stakeholder landscape. Find common ground. Build agreements incrementally. Your influence will move things forward.'
      },
      {
        title: 'Scenario 4: Driving Innovation and Change',
        situation: 'Organization needs to evolve. People resistant to change.',
        action: 'Paint compelling future picture. Help people understand personal benefits. Start with early adopters. Create quick wins.'
      }
    ];

    scenarios.forEach(s => {
      if (y + 60 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }

      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.title, M, y);
      y += 12;
      
      doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY).text('Situation:', M, y);
      y += 9;
      let sitHeight = doc.heightOfString(s.situation, { width: CW - 12, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.situation, M + 12, y, { width: CW - 24 });
      y += sitHeight + 11;
      
      doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY).text('Your Action:', M, y);
      y += 9;
      let actHeight = doc.heightOfString(s.action, { width: CW - 12, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.action, M + 12, y, { width: CW - 24 });
      y += actHeight + 14;
    });

    // PAGE 6: YOUR LEADERSHIP PROFILE - COMPRESSED TO ONE PAGE
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    let profileIntro = 'These five dimensions represent your core leadership strengths and developmental opportunities.';
    let introHeight = doc.heightOfString(profileIntro, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(profileIntro, M, y, { width: CW });
    y += introHeight + 12;

    const scores = [
      { label: 'People Focus', value: 8 },
      { label: 'Visibility Drive', value: 7 },
      { label: 'Speed to Act', value: 8 },
      { label: 'Influence', value: 7 },
      { label: 'Innovation', value: 8 },
    ];

    scores.forEach(s => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      y += 10;
      const barW = 100, barH = 6;
      doc.rect(M + 120, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 120, y, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 225, y);
      y += 12;
    });

    const sections = parseContent(reportContent);

    // PAGES: AI SECTIONS - FIX FOR SUPERPOWERS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    for (const section of sections) {
      // Check if this is the superpowers section
      if (section.title.includes('Superpower')) {
        // For superpowers, use special formatting with better spacing
        if (y + 100 > H - 45) {
          doc.addPage();
          pageNum++;
          header();
          y = 45;
        }

        doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text(section.title, M, y);
        y += 18;
        doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
        y += 16;

        for (const line of section.content) {
          if (y + 80 > H - 45) {
            doc.addPage();
            pageNum++;
            header();
            y = 45;
          }

          let textHeight = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 10 });
          doc.fontSize(10).font('Helvetica').fillColor('#333').text(line, M, y, { width: CW });
          y += textHeight + 16;
        }
        y += 12;
      } else {
        // Regular sections
        if (y + 100 > H - 45) {
          doc.addPage();
          pageNum++;
          header();
          y = 45;
        }

        doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text(section.title, M, y);
        y += 18;
        doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
        y += 16;

        for (const line of section.content) {
          if (y + 60 > H - 45) {
            doc.addPage();
            pageNum++;
            header();
            y = 45;
          }

          let textHeight;
          if (line.startsWith('-')) {
            textHeight = doc.heightOfString('• ' + line.replace(/^-\s+/, ''), { width: CW - 30, font: 'Helvetica', size: 10 });
            doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + line.replace(/^-\s+/, ''), M + 15, y, { width: CW - 30 });
          } else {
            textHeight = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 10 });
            doc.fontSize(10).font('Helvetica').fillColor('#333').text(line, M, y, { width: CW });
          }
          y += textHeight + 12;
        }
        y += 14;
      }
    }

    // PAGE: LEADERSHIP STYLE ANALYSIS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP STYLE ANALYSIS', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Primary Style: ' + primaryStyle, M, y);
    y += 12;
    let styleIntroText = `This is your natural default way of leading. Your ${primaryStyle} style means you focus on possibilities, inspire others with vision, and lead through genuine relationships. This style is effective when teams need direction, clarity, and motivation during change.`;
    let styleIntroHeight = doc.heightOfString(styleIntroText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(styleIntroText, M, y, { width: CW });
    y += styleIntroHeight + 14;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Style Shows Up:', M, y);
    y += 12;
    let showsUpText = `You see the bigger picture and help others understand how their work contributes to larger goals. You build strong relationships quickly and use genuine connection as a leadership tool. You inspire others with optimism and possibility-focused thinking. Your presence creates an environment where people feel valued and motivated.`;
    let showsUpHeight = doc.heightOfString(showsUpText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(showsUpText, M, y, { width: CW });
    y += showsUpHeight + 14;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Communication and Influence Style:', M, y);
    y += 12;
    let commText = `You influence through vision, relationship-building, and authentic connection. You communicate in ways that inspire and motivate. You listen actively and adapt your approach based on others' needs. You build trust through genuine care and clear direction.`;
    let commHeight = doc.heightOfString(commText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(commText, M, y, { width: CW });
    y += commHeight + 14;

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('90-DAY LEADERSHIP ROADMAP', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    let roadmapIntro = 'This roadmap breaks your development journey into three focused phases spanning 90 days.';
    let roadmapIntroHeight = doc.heightOfString(roadmapIntro, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(roadmapIntro, M, y, { width: CW });
    y += roadmapIntroHeight + 14;

    const roadmap = [
      { 
        phase: 'PHASE 1: SELF-AWARENESS & FOUNDATION (Weeks 1-4)', 
        actions: [
          'Conduct 360-degree feedback with stakeholders',
          'Identify top 3 development priorities',
          'Schedule executive coaching',
          'Document your leadership reality and desired future state',
          'Create accountability partnership'
        ]
      },
      { 
        phase: 'PHASE 2: DEVELOPMENT & MOMENTUM (Weeks 5-8)', 
        actions: [
          'Implement 2-3 micro-habits focused on development',
          'Complete leadership workshops',
          'Weekly coaching sessions',
          'Gather feedback from team on visible changes',
          'Journal on learnings weekly'
        ]
      },
      { 
        phase: 'PHASE 3: INTEGRATION & SUSTAINABILITY (Weeks 9-12)', 
        actions: [
          'Consolidate new behaviors into lasting habits',
          'Share learnings with your team',
          'Assess progress against metrics',
          'Plan next quarter priorities',
          'Establish ongoing accountability'
        ]
      },
    ];

    roadmap.forEach(r => {
      if (y + 80 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text(r.phase, M, y);
      y += 12;
      r.actions.forEach(a => {
        let aHeight = doc.heightOfString(a, { width: CW - 30, font: 'Helvetica', size: 10 });
        doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + a, M + 15, y, { width: CW - 30 });
        y += aHeight + 10;
      });
      y += 12;
    });

    // PAGE: RESOURCES
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('RECOMMENDED RESOURCES', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Recommended Books', M, y);
    y += 12;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Multipliers - Liz Wiseman', M, y);
    y += 10;
    let book1Height = doc.heightOfString('Essential for leaders who want to develop their teams. Supports your People Focus strength.', { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Essential for leaders who want to develop their teams. Supports your People Focus strength.', M, y, { width: CW });
    y += book1Height + 14;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('The Innovator\'s Dilemma - Clayton Christensen', M, y);
    y += 10;
    let book2Height = doc.heightOfString('A classic on disruption and innovation. Perfect for your Visionary strength and driving transformation.', { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('A classic on disruption and innovation. Perfect for your Visionary strength and driving transformation.', M, y, { width: CW });
    y += book2Height + 14;

    // PAGE: 30-DAY ACTION PLAN
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY 30-DAY ACTION PLAN', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    const weeks = [
      { week: 'Week 1 - Build Self-Awareness', actions: 'Schedule feedback conversations with 5 key stakeholders. Listen without defending. Take notes on themes. What patterns emerge?' },
      { week: 'Week 2 - Clarify Your Leadership', actions: 'Write your top 3 leadership strengths with examples. Identify 2-3 development areas. Share with your coach.' },
      { week: 'Week 3 - Create Your Vision', actions: 'Create a one-page leadership vision. Articulate 2-year aspiration and 90-day priorities. Share with your boss.' },
      { week: 'Week 4 - Launch Your Practice', actions: 'Identify 2-3 micro-habits to practice daily. Examples: focused one-on-ones, recognition messages, independent decisions.' },
    ];

    weeks.forEach(w => {
      if (y + 70 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(w.week, M, y);
      y += 11;
      let weekHeight = doc.heightOfString(w.actions, { width: CW, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#333').text(w.actions, M, y, { width: CW });
      y += weekHeight + 14;
    });

    // PAGE: ACTION COMMITMENTS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 11;
    doc.rect(M + 12, y, CW - 24, 14).stroke('#ccc');
    y += 16;
    doc.rect(M + 12, y, CW - 24, 14).stroke('#ccc');
    y += 16;
    doc.rect(M + 12, y, CW - 24, 14).stroke('#ccc');
    y += 18;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Success Metrics:', M, y);
    y += 11;
    doc.rect(M + 12, y, CW - 24, 36).stroke('#ccc');
    y += 42;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Key Obstacles & Solutions:', M, y);
    y += 11;
    doc.rect(M + 12, y, CW - 24, 36).stroke('#ccc');

    // PAGE: MICRO HABITS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WEEKLY MICRO-HABITS', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Small, consistent actions compound into major transformation. List 1-2 specific actions for each period.', M, y, { width: CW });
    y += 12;

    ['Week 1-2', 'Week 3-4', 'Week 5-8', 'Week 9-12'].forEach(week => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text(week + ':', M, y);
      y += 11;
      doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
      y += 46;
    });

    // PAGE: ACCOUNTABILITY
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('ACCOUNTABILITY PARTNER AGREEMENT', M, y);
    y += 18;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 16;

    doc.fontSize(10).font('Helvetica').fillColor('#333').text('I commit to my leadership development and will leverage support to achieve my goals.', M, y, { width: CW });
    y += 12;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('My Accountability Partner:', M, y);
    y += 10;
    doc.rect(M, y, CW, 14).stroke('#ccc');
    y += 18;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Check-in Frequency:', M, y);
    y += 10;
    doc.rect(M, y, CW, 14).stroke('#ccc');
    y += 18;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('What I Want My Accountability Partner to Know:', M, y);
    y += 10;
    doc.rect(M, y, CW, 40).stroke('#ccc');
    y += 46;

    doc.fontSize(9).font('Helvetica').fillColor(NAVY).text('Signature: _________________________     Date: ________________', M, y);

    // PAGE: CERTIFICATE
    doc.addPage();
    pageNum++;
    doc.rect(20, 20, W - 40, H - 40).strokeColor(NAVY).lineWidth(2.5).stroke();
    doc.rect(30, 30, W - 60, H - 60).strokeColor(STEEL_BLUE).lineWidth(1).stroke();

    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEANGLE HR LAB', M, 80, { align: 'center', width: CW });
    doc.fontSize(12).font('Helvetica').fillColor('#666').text('is proud to issue this certificate to', M, 110, { align: 'center', width: CW });
    
    doc.fontSize(11).font('Helvetica').fillColor(NAVY).text('_________________________________________________________________', M, 145, { align: 'center', width: CW });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(leaderName || 'Name of Participant', M, 160, { align: 'center', width: CW });
    
    doc.fontSize(12).font('Helvetica').fillColor('#666').text('in recognition of completion of the', M, 200, { align: 'center', width: CW });
    
    doc.fontSize(13).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(quizTitle, M, 230, { align: 'center', width: CW });
    doc.fontSize(12).font('Helvetica').fillColor('#666').text('Leadership Assessment and Coaching Program', M, 265, { align: 'center', width: CW });
    
    doc.moveTo(M + 70, 310).lineTo(M + CW - 70, 310).strokeColor(GOLD).lineWidth(1.5).stroke();
    
    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('PRIMARY STYLE: ' + primaryStyle, M, 340, { align: 'center', width: CW });
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
