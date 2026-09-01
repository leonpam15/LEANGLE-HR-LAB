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
    const doc = new PDFDocument({ size: 'LETTER', margin: 45, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 612, H = 792, M = 45, CW = W - M * 2;
    let pageNum = 1;
    
    const NAVY = '#0B1F3A';
    const STEEL_BLUE = '#2C5F82';
    const CREAM = '#E8E0D0';
    const GOLD = '#C9A84C';

    const header = () => {
      doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text('LEANGLE HR LAB', M, 18);
      doc.fontSize(8).font('Helvetica').fillColor('#999').text(`${pageNum}`, M + CW - 30, 18, { width: 30, align: 'right' });
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
    let y = 55;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP NARRATIVE', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Leadership Identity', M, y);
    y += 16;
    
    let narrativeText = `Every leader has a unique story. Your ${primaryStyle} leadership style is not something you were born with - it's been shaped by experiences, successes, challenges, and the leaders you've learned from. Understanding your leadership narrative helps you see why you make decisions the way you do, how you naturally motivate others, and where your deepest leadership convictions come from.

Your ${primaryStyle} style reveals a leader who brings distinct value to any organization. This assessment captures not just how you lead, but why you lead that way. The dimensions measured in this report show the core leadership capabilities that define your approach to people, strategy, decision-making, and organizational impact.

What makes your profile unique is the combination of your strengths. It's not just that you excel in specific areas - it's how these areas work together to create your distinctive leadership presence. Understanding these interactions is key to leveraging your full potential.`;

    let narHeight = doc.heightOfString(narrativeText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(narrativeText, M, y, { width: CW });
    y += narHeight + 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('What This Assessment Measures', M, y);
    y += 16;
    
    let measureText = `This comprehensive assessment evaluates five critical dimensions of leadership effectiveness that drive organizational outcomes. Unlike generic leadership models, these dimensions are specifically calibrated to measure how you create value for your team, organization, and stakeholders. Each dimension represents a distinct capability that exceptional leaders develop and integrate:`;

    let measHeight = doc.heightOfString(measureText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(measureText, M, y, { width: CW });
    y += measHeight + 16;

    const dimensions = [
      'People Focus - Your ability to develop others and create psychological safety',
      'Visibility Drive - Your comfort with influence and leading from the front',
      'Speed to Act - Your decisiveness and ability to create momentum',
      'Influence - Your capacity to persuade and mobilize others',
      'Innovation - Your comfort with change and ability to drive transformation'
    ];

    dimensions.forEach(d => {
      doc.fontSize(11).font('Helvetica').fillColor('#333').text('• ' + d, M + 15, y, { width: CW - 30 });
      y += 16;
    });

    // PAGE 3: LEADERSHIP EFFECTIVENESS FRAMEWORK
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP EFFECTIVENESS FRAMEWORK', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Profile Drives Business Outcomes', M, y);
    y += 16;
    
    let effectivenessText = `Leadership effectiveness isn't measured by a single dimension - it's the integrated application of multiple capabilities working together to achieve results. Your profile shows how you naturally combine these dimensions, and where development opportunities exist. The framework below shows how each dimension connects to real business outcomes that matter:`;

    let effHeight = doc.heightOfString(effectivenessText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(effectivenessText, M, y, { width: CW });
    y += effHeight + 20;

    const outcomes = [
      { dim: 'People Focus', outcome: 'Team Retention & Engagement', desc: 'Leaders high in people focus retain top talent and create engaged teams that discretionary effort.' },
      { dim: 'Visibility Drive', outcome: 'Career Advancement & Influence', desc: 'High visibility drive accelerates career progression and increases your influence in organizational decisions.' },
      { dim: 'Speed to Act', outcome: 'Execution & Market Response', desc: 'Quick decision-making enables faster execution and better competitive positioning in fast-changing markets.' },
      { dim: 'Influence', outcome: 'Stakeholder Alignment & Support', desc: 'Strong influence capabilities enable you to build coalitions, gain buy-in, and mobilize resources across boundaries.' },
      { dim: 'Innovation', outcome: 'Organization Adaptability & Growth', desc: 'Comfort with change enables you to lead transformation, drive innovation, and position organizations for future growth.' }
    ];

    outcomes.forEach(o => {
      if (y + 50 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 55;
      }

      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(o.dim + ' → ' + o.outcome, M, y);
      y += 16;
      let oHeight = doc.heightOfString(o.desc, { width: CW, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(o.desc, M, y, { width: CW });
      y += oHeight + 18;
    });

    // PAGE 4: YOUR STRENGTHS IN ACTION
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR STRENGTHS IN ACTION', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Practical Application Scenarios', M, y);
    y += 16;

    let actionText = `Below are real-world scenarios where your leadership strengths create competitive advantage. These aren't theoretical - they're situations you'll face in your current role and future opportunities. Use these examples to recognize when you're at your best and how to deliberately apply your strengths:`;

    let actionHeight = doc.heightOfString(actionText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(actionText, M, y, { width: CW });
    y += actionHeight + 20;

    const scenarios = [
      {
        title: 'Scenario 1: Crisis or Major Transition',
        situation: 'Your organization is going through significant change - merger, restructuring, market shift. People are anxious and uncertain.',
        yourStrength: 'Your ' + primaryStyle + ' style enables you to see possibilities where others see threats. You can articulate a compelling vision and help people understand their role in the future. Your visibility and influence help you gain buy-in from skeptics.',
        action: 'Step up as a stabilizing force. Use your communication skills to paint a clear picture of the future. Connect people to purpose. Your confidence in navigating change will settle others.'
      },
      {
        title: 'Scenario 2: Building a High-Performing Team',
        situation: 'You\'re assembling a new team for a critical initiative. You need people who will perform at high levels quickly.',
        yourStrength: 'Your people focus helps you identify not just talent, but cultural fit. Your speed to act means you make decisions quickly and create momentum. Your innovation strength attracts change-ready people.',
        action: 'Focus on diverse perspectives and complementary strengths. Set clear expectations and give autonomy. Your team will respond to your confidence and direction.'
      },
      {
        title: 'Scenario 3: Navigating Organizational Politics',
        situation: 'You need approval from multiple stakeholders with different priorities. There\'s no obvious path forward.',
        yourStrength: 'Your influence capability enables you to build coalitions. Your people skills help you understand what matters to different stakeholders. Your visibility means decision-makers pay attention when you speak.',
        action: 'Map the stakeholder landscape. Find common ground and build agreements incrementally. Your ability to persuade will move things forward.'
      }
    ];

    scenarios.forEach(s => {
      if (y + 100 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 55;
      }

      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.title, M, y);
      y += 14;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Situation:', M, y);
      y += 10;
      let sitHeight = doc.heightOfString(s.situation, { width: CW - 15, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.situation, M + 15, y, { width: CW - 30 });
      y += sitHeight + 12;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Your Strength:', M, y);
      y += 10;
      let strHeight = doc.heightOfString(s.yourStrength, { width: CW - 15, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.yourStrength, M + 15, y, { width: CW - 30 });
      y += strHeight + 12;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Your Action:', M, y);
      y += 10;
      let actHeight = doc.heightOfString(s.action, { width: CW - 15, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.action, M + 15, y, { width: CW - 30 });
      y += actHeight + 24;
    });

    const sections = parseContent(reportContent);

    // PAGES: AI SECTIONS
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    
    for (const section of sections) {
      if (y + 100 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 55;
      }

      doc.fontSize(13).font('Helvetica-Bold').fillColor(NAVY).text(section.title, M, y);
      y += 20;
      doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
      y += 24;

      for (const line of section.content) {
        if (y + 60 > H - 50) {
          doc.addPage();
          pageNum++;
          header();
          y = 55;
        }

        let textHeight;
        if (line.startsWith('-')) {
          textHeight = doc.heightOfString('• ' + line.replace(/^-\s+/, ''), { width: CW - 30, font: 'Helvetica', size: 11 });
          doc.fontSize(11).font('Helvetica').fillColor('#333').text('• ' + line.replace(/^-\s+/, ''), M + 15, y, { width: CW - 30 });
        } else {
          textHeight = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 11 });
          doc.fontSize(11).font('Helvetica').fillColor('#333').text(line, M, y, { width: CW });
        }
        y += textHeight + 10;
      }
      y += 20;
    }

    // PAGE: EXPANDED LEADERSHIP PROFILE
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    let introHeight = doc.heightOfString('These five dimensions represent your core leadership strengths and developmental opportunities. Your profile reveals a leader who integrates multiple leadership capabilities to drive results while maintaining team engagement. Understanding how these dimensions interact is key to your continued development.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('These five dimensions represent your core leadership strengths and developmental opportunities. Your profile reveals a leader who integrates multiple leadership capabilities to drive results while maintaining team engagement. Understanding how these dimensions interact is key to your continued development.', M, y, { width: CW });
    y += introHeight + 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Scores:', M, y);
    y += 16;
    let explHeight = doc.heightOfString('High scores (7-10) indicate your natural strengths where you lead with energy and effectiveness. Medium scores (4-6) are neutral areas where development is possible. Lower scores (0-3) indicate areas to develop intentionally. No score is "good" or "bad" - they simply reveal your leadership pattern.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('High scores (7-10) indicate your natural strengths where you lead with energy and effectiveness. Medium scores (4-6) are neutral areas where development is possible. Lower scores (0-3) indicate areas to develop intentionally. No score is "good" or "bad" - they simply reveal your leadership pattern.', M, y, { width: CW });
    y += explHeight + 20;

    const scores = [
      { label: 'People Focus', value: 8, desc: 'You prioritize team development and emotional wellbeing as central to your leadership. This strength enables you to build loyal, engaged teams.' },
      { label: 'Visibility Drive', value: 7, desc: 'You are comfortable with visibility and influence. You can advocate for your ideas and lead from the front.' },
      { label: 'Speed to Act', value: 8, desc: 'You are decisive and action-oriented. You move ideas into reality quickly and energize teams with momentum.' },
      { label: 'Influence', value: 7, desc: 'You persuade and mobilize others with ease. Your ideas gain traction because people believe in your direction.' },
      { label: 'Innovation', value: 8, desc: 'You are forward-thinking and comfortable with change. You see possibilities others miss and drive transformation.' },
    ];

    scores.forEach(s => {
      if (y + 60 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 55;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      y += 16;
      const barW = 140, barH = 8;
      doc.rect(M + 160, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 160, y, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 305, y);
      y += 14;
      let descHeight = doc.heightOfString(s.desc, { width: CW - 160, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.desc, M + 160, y, { width: CW - 160 });
      y += descHeight + 16;
    });

    // PAGE: EXPANDED STYLE ANALYSIS
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP STYLE ANALYSIS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Primary Style: ' + primaryStyle, M, y);
    y += 16;
    let styleIntroHeight = doc.heightOfString('This is your natural default way of leading. It reflects how you show up when you are at your best and when under pressure. Your ' + primaryStyle + ' style means you focus on possibilities, inspire others with compelling vision, and lead through genuine relationships. This style is particularly effective when teams need direction, clarity, and motivation during times of change or uncertainty.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('This is your natural default way of leading. It reflects how you show up when you are at your best and when under pressure. Your ' + primaryStyle + ' style means you focus on possibilities, inspire others with compelling vision, and lead through genuine relationships. This style is particularly effective when teams need direction, clarity, and motivation during times of change or uncertainty.', M, y, { width: CW });
    y += styleIntroHeight + 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Style Shows Up:', M, y);
    y += 16;
    let showsUpHeight = doc.heightOfString('You naturally see the bigger picture and help others understand how their work contributes to larger goals. You build strong relationships quickly and use genuine connection as a primary leadership tool. You inspire others with your optimism and possibility-focused thinking. You adapt your approach based on people\'s emotional states and readiness. You enjoy building consensus but can move forward decisively when needed. Your presence creates an environment where people feel valued and motivated to do their best work.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('You naturally see the bigger picture and help others understand how their work contributes to larger goals. You build strong relationships quickly and use genuine connection as a primary leadership tool. You inspire others with your optimism and possibility-focused thinking. You adapt your approach based on people\'s emotional states and readiness. You enjoy building consensus but can move forward decisively when needed. Your presence creates an environment where people feel valued and motivated to do their best work.', M, y, { width: CW });
    y += showsUpHeight + 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Complete Style Profile:', M, y);
    y += 16;

    const styles = [
      { name: 'Visionary', pct: 90, desc: 'Big-picture thinking, set compelling direction for teams' },
      { name: 'Analyzer', pct: 75, desc: 'Data-driven decision making, thorough and careful approach' },
      { name: 'Coach', pct: 80, desc: 'Develop others, high emotional intelligence, relationship focused' },
      { name: 'Driver', pct: 70, desc: 'Results-focused, competitive, maintains high standards' },
      { name: 'Supporter', pct: 65, desc: 'Collaborative, team player, values harmony and inclusion' },
    ];

    styles.forEach(s => {
      if (y + 50 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 55;
      }
      
      doc.fontSize(11).font('Helvetica').fillColor('#333').text(s.name, M, y);
      y += 14;
      const barW = 140, barH = 7;
      doc.rect(M + 120, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 120, y, (s.pct / 100) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.pct + '%', M + 265, y);
      y += 12;
      let styleDescHeight = doc.heightOfString(s.desc, { width: CW - 120, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.desc, M + 120, y, { width: CW - 120 });
      y += styleDescHeight + 14;
    });

    // PAGE: EXPANDED 90-DAY ROADMAP
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('90-DAY LEADERSHIP ROADMAP', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    let roadmapIntroHeight = doc.heightOfString('This roadmap breaks your development journey into three focused phases spanning 90 days. Each phase has clear milestones and builds intentionally on the previous one. The goal is to move from awareness to action to integration, creating lasting behavioral change. Track your progress weekly.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('This roadmap breaks your development journey into three focused phases spanning 90 days. Each phase has clear milestones and builds intentionally on the previous one. The goal is to move from awareness to action to integration, creating lasting behavioral change. Track your progress weekly.', M, y, { width: CW });
    y += roadmapIntroHeight + 26;

    const roadmap = [
      { 
        phase: 'PHASE 1: SELF-AWARENESS & FOUNDATION', 
        time: 'Weeks 1-4',
        overview: 'Build foundation for change',
        actions: [
          'Conduct 360-degree feedback with 6-8 stakeholders',
          'Identify top 3 development priorities from feedback patterns',
          'Schedule executive coaching with a qualified coach',
          'Reflect deeply on your strengths and blind spots',
          'Document your current leadership reality and desired future state',
          'Create accountability partnership with peer or mentor'
        ]
      },
      { 
        phase: 'PHASE 2: DEVELOPMENT & MOMENTUM', 
        time: 'Weeks 5-8',
        overview: 'Execute targeted development',
        actions: [
          'Implement 2-3 micro-habits focused on key development areas',
          'Complete leadership workshops or development programs',
          'Weekly coaching sessions for progress tracking and adjustments',
          'Gather feedback from team on visible changes',
          'Practice new behaviors in low-risk situations first',
          'Journal on learnings and insights weekly'
        ]
      },
      { 
        phase: 'PHASE 3: INTEGRATION & SUSTAINABILITY', 
        time: 'Weeks 9-12',
        overview: 'Lock in gains and plan ahead',
        actions: [
          'Consolidate new behaviors into lasting habits',
          'Share learnings with your team and broader organization',
          'Assess progress against metrics established in Phase 1',
          'Celebrate wins and acknowledge growth with your team',
          'Plan next quarter priorities building on this foundation',
          'Establish ongoing accountability and continued development'
        ]
      },
    ];

    roadmap.forEach(r => {
      if (y + 140 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 55;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(r.phase, M, y);
      y += 16;
      doc.fontSize(10).font('Helvetica').fillColor('#999').text(r.time + ' | ' + r.overview, M + 15, y);
      y += 12;
      r.actions.forEach(a => {
        let aHeight = doc.heightOfString(a, { width: CW - 30, font: 'Helvetica', size: 10 });
        doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + a, M + 15, y, { width: CW - 30 });
        y += aHeight + 10;
      });
      y += 18;
    });

    // PAGE: RESOURCES
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('RECOMMENDED RESOURCES', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Recommended Books', M, y);
    y += 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Multipliers - Liz Wiseman', M, y);
    y += 14;
    let book1Height = doc.heightOfString('Essential for leaders who want to develop their teams. Contrasts multipliers (who expand capability) with diminishers. Supports your People Focus strength.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('Essential for leaders who want to develop their teams. Contrasts multipliers (who expand capability) with diminishers. Supports your People Focus strength.', M, y, { width: CW });
    y += book1Height + 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('The Innovator\'s Dilemma - Clayton Christensen', M, y);
    y += 14;
    let book2Height = doc.heightOfString('A classic on disruption and innovation. Provides frameworks for anticipating market shifts and leading transformation. Perfect for your Visionary strength.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('A classic on disruption and innovation. Provides frameworks for anticipating market shifts and leading transformation. Perfect for your Visionary strength.', M, y, { width: CW });
    y += book2Height + 18;

    // PAGE: 30-DAY ACTION PLAN
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY 30-DAY ACTION PLAN', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    const weeks = [
      { week: 'Week 1 - Build Self-Awareness', actions: 'Schedule 1-on-1 feedback conversations with 5 key stakeholders. Listen without defending. Take detailed notes on themes. What patterns emerge? What surprises you?' },
      { week: 'Week 2 - Clarify Your Leadership', actions: 'Write down your top 3 leadership strengths with 2-3 examples. Identify your top 2-3 development areas with one situation example. Share with your coach for perspective.' },
      { week: 'Week 3 - Create Your Vision', actions: 'Create a one-page leadership vision. Articulate your aspiration for 2 years, top 3 priorities for 90 days, and how you\'ll measure success. Share with your boss.' },
      { week: 'Week 4 - Launch Your Practice', actions: 'Identify 2-3 micro-habits to practice daily. Examples: Have 3 one-on-ones focused on listening, send one recognition message, make one decision without consensus. Schedule weekly reflection blocks.' },
    ];

    weeks.forEach(w => {
      if (y + 80 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 55;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(w.week, M, y);
      y += 16;
      let weekHeight = doc.heightOfString(w.actions, { width: CW, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#333').text(w.actions, M, y, { width: CW });
      y += weekHeight + 22;
    });

    // PAGE: ACTION COMMITMENTS
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 16;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 20;
    doc.rect(M + 12, y, CW - 24, 18).stroke('#ccc');
    y += 22;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Success Metrics:', M, y);
    y += 16;
    doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');
    y += 50;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Key Obstacles & Solutions:', M, y);
    y += 16;
    doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');

    // PAGE: MICRO HABITS
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WEEKLY MICRO-HABITS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(11).font('Helvetica').fillColor('#666').text('Small, consistent actions compound into major transformation. List 1-2 specific actions for each period.', M, y, { width: CW });
    y += 16;

    ['Week 1-2', 'Week 3-4', 'Week 5-8', 'Week 9-12'].forEach(week => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(week + ':', M, y);
      y += 14;
      doc.rect(M + 12, y, CW - 24, 50).stroke('#ccc');
      y += 54;
    });

    // PAGE: ACCOUNTABILITY
    doc.addPage();
    pageNum++;
    header();
    y = 55;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('ACCOUNTABILITY PARTNER AGREEMENT', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 24;

    doc.fontSize(11).font('Helvetica').fillColor('#333').text('I commit to my leadership development and will leverage support to achieve my goals.', M, y, { width: CW });
    y += 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Accountability Partner:', M, y);
    y += 14;
    doc.rect(M, y, CW, 18).stroke('#ccc');
    y += 22;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Check-in Frequency:', M, y);
    y += 14;
    doc.rect(M, y, CW, 18).stroke('#ccc');
    y += 22;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('What I Want My Accountability Partner to Know:', M, y);
    y += 14;
    doc.rect(M, y, CW, 50).stroke('#ccc');
    y += 54;

    doc.fontSize(10).font('Helvetica').fillColor(NAVY).text('Signature: _________________________     Date: ________________', M, y);

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
