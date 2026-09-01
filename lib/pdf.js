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

    // PAGE 2: YOUR LEADERSHIP NARRATIVE - EXPANDED
    doc.addPage();
    pageNum = 2;
    header();
    let y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP NARRATIVE', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Leadership Identity', M, y);
    y += 15;
    
    let narrativeText = `Every leader has a unique story. Your ${primaryStyle} leadership style isn't something you were born with - it's been shaped by your experiences, the mentors who influenced you, the challenges you've overcome, and the values you've developed over time. Understanding your leadership narrative helps you see why you make decisions the way you do, how you naturally motivate others, where your deepest leadership convictions come from, and why certain situations energize you while others drain you.

This assessment captures not just how you lead, but why you lead that way. It's the difference between knowing your leadership behaviors and understanding your leadership DNA. The dimensions measured in this report show the core leadership capabilities that define your approach to people, strategy, decision-making, and organizational impact. But more importantly, they reveal the patterns that make you distinctly YOU as a leader.

Your ${primaryStyle} style reveals a leader who brings distinct, measurable value to any organization. This style represents how you naturally show up in moments of clarity, how you respond under pressure, and what others come to depend on you for. By understanding your profile, you gain insight into your leadership brand - the reputation you've built and the impact you have on those around you.

Many leaders go through their entire careers without truly understanding their leadership profile. They react to situations rather than lead from a place of conscious choice. This assessment changes that. It moves you from unconscious competence to conscious mastery. It gives you a framework for understanding not just what you do well, but why it matters and how to leverage it strategically.`;

    let narHeight = doc.heightOfString(narrativeText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(narrativeText, M, y, { width: CW });
    y += narHeight + 14;

    // PAGE 3: WHAT THIS ASSESSMENT MEASURES - EXPANDED
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WHAT THIS ASSESSMENT MEASURES', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Five Critical Dimensions of Leadership Effectiveness', M, y);
    y += 15;

    let measureText = `Unlike generic leadership models that try to fit all leaders into predetermined boxes, this assessment measures five critical dimensions that have been proven to drive organizational outcomes. These dimensions emerged from research with hundreds of high-performing leaders across industries, levels, and organizational contexts. They represent the most important capabilities that separate exceptional leaders from competent ones.

Each dimension represents a distinct capability that exceptional leaders develop and integrate. They work together like an orchestra - when all five are in harmony, leaders create extraordinary results. When one is significantly out of balance, it can limit overall effectiveness. The goal isn't to be high on all five - it's to understand your unique combination and leverage it strategically.`;

    let measHeight = doc.heightOfString(measureText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(measureText, M, y, { width: CW });
    y += measHeight + 14;

    const dimensions = [
      {
        name: 'People Focus',
        desc: 'Your ability to develop others and create psychological safety where people feel valued and can take risks. High people-focus leaders retain talent, build engaged teams, and create cultures where people do their best work.'
      },
      {
        name: 'Visibility Drive',
        desc: 'Your comfort with influence and leading from the front. Leaders high in visibility drive advocate for their ideas, build networks, accelerate career progression, and increase their organizational impact.'
      },
      {
        name: 'Speed to Act',
        desc: 'Your decisiveness and ability to create momentum. This capability enables you to move ideas into reality quickly, maintain competitive advantage in fast-changing markets, and energize teams with forward progress.'
      },
      {
        name: 'Influence',
        desc: 'Your capacity to persuade and mobilize others. Leaders with strong influence build coalitions, gain buy-in across boundaries, secure resources, and move initiatives forward even in complex political environments.'
      },
      {
        name: 'Innovation',
        desc: 'Your comfort with change and ability to drive transformation. Innovation-focused leaders see possibilities others miss, lead organizational evolution, and position companies for future growth and relevance.'
      }
    ];

    dimensions.forEach(d => {
      if (y + 35 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(d.name, M, y);
      y += 12;
      let dHeight = doc.heightOfString(d.desc, { width: CW - 12, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(d.desc, M + 12, y, { width: CW - 24 });
      y += dHeight + 14;
    });

    // PAGE 4: LEADERSHIP EFFECTIVENESS FRAMEWORK - EXPANDED
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP EFFECTIVENESS FRAMEWORK', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Profile Drives Business Outcomes', M, y);
    y += 15;
    
    let effectivenessText = `Leadership effectiveness isn't measured by a single dimension - it's the integrated application of multiple capabilities working together to achieve results. Your profile shows how you naturally combine these dimensions, where your greatest strengths lie, and where development opportunities exist. Understanding this framework helps you see the real-world business impact of your leadership choices.

Research consistently shows that leaders who score high on these dimensions outperform peers on every meaningful measure: revenue growth, team retention, innovation metrics, employee engagement, succession pipeline development, and career advancement. But more importantly, they experience greater fulfillment and impact in their roles because they're leading from their strengths.`;

    let effHeight = doc.heightOfString(effectivenessText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(effectivenessText, M, y, { width: CW });
    y += effHeight + 14;

    const outcomes = [
      { 
        dim: 'People Focus', 
        outcome: 'Team Retention & Engagement', 
        desc: 'Leaders high in people focus retain top talent, reduce turnover costs, and create engaged teams that deliver discretionary effort. This translates directly to reduced hiring/training costs and improved team productivity.' 
      },
      { 
        dim: 'Visibility Drive', 
        outcome: 'Career Advancement & Influence', 
        desc: 'High visibility drive accelerates your career progression and increases your influence in organizational decisions. You become known, trusted, and sought out for leadership opportunities.' 
      },
      { 
        dim: 'Speed to Act', 
        outcome: 'Execution & Competitive Advantage', 
        desc: 'Quick decision-making enables faster execution and better competitive positioning. You seize market opportunities, respond to threats faster, and create momentum that energizes organizations.' 
      },
      { 
        dim: 'Influence', 
        outcome: 'Stakeholder Alignment & Resource Acquisition', 
        desc: 'Strong influence capabilities enable you to build coalitions, gain buy-in from skeptics, secure budget and resources, and move initiatives forward even in complex political environments.' 
      },
      { 
        dim: 'Innovation', 
        outcome: 'Organization Transformation & Growth', 
        desc: 'Comfort with change enables you to lead transformation, drive innovation pipelines, and position organizations for future growth. You attract forward-thinking talent and build cultures of continuous improvement.' 
      }
    ];

    outcomes.forEach(o => {
      if (y + 45 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }

      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(o.dim, M, y);
      y += 12;
      doc.fontSize(10).font('Helvetica').fillColor(NAVY).text('Business Outcome: ' + o.outcome, M + 12, y);
      y += 11;
      let oHeight = doc.heightOfString(o.desc, { width: CW - 12, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(o.desc, M + 12, y, { width: CW - 24 });
      y += oHeight + 14;
    });

    // PAGE 5: YOUR STRENGTHS IN ACTION - EXPANDED
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR STRENGTHS IN ACTION', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Real-World Scenarios Where You Excel', M, y);
    y += 15;

    let actionText = `Below are real-world scenarios where your ${primaryStyle} leadership strengths create competitive advantage. These aren't theoretical exercises - they're situations you'll face in your current role and in future opportunities. Use these examples to recognize when you're at your best, understand what makes you valuable in those moments, and learn to deliberately apply your strengths. The key to leadership mastery is moving from unconscious competence to conscious application.`;

    let actionHeight = doc.heightOfString(actionText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(actionText, M, y, { width: CW });
    y += actionHeight + 14;

    const scenarios = [
      {
        title: 'Scenario 1: Crisis or Major Organizational Transition',
        situation: 'Your organization is going through significant change - merger, restructuring, market shift, or leadership transition. People are anxious, uncertain, and looking for direction.',
        yourStrength: `Your ${primaryStyle} style enables you to see possibilities where others see threats. You can paint a compelling vision of the future and help people understand their role. Your visibility and influence help you gain buy-in from skeptics.`,
        action: 'Step up as a stabilizing force. Paint a clear picture of the future. Connect people to purpose. Your confidence will settle organizational anxiety.'
      },
      {
        title: 'Scenario 2: Building a High-Performing Team',
        situation: 'You are assembling a new team for a critical initiative. You need people who will perform at high levels quickly and stay committed through challenges.',
        yourStrength: `Your people focus helps you identify not just raw talent, but people who will thrive in your environment. Your speed to act means you make decisions quickly and create momentum. Your innovation strength attracts change-ready people.`,
        action: 'Be deliberate about team composition. Set clear expectations upfront. Give autonomy quickly to high performers. Create psychological safety where people feel they can take smart risks.'
      },
      {
        title: 'Scenario 3: Navigating Complex Organizational Politics',
        situation: 'You need approval or buy-in from multiple stakeholders with different priorities. There is no obvious path forward. You need to move things without direct authority.',
        yourStrength: `Your influence capability enables you to build coalitions and find common ground. Your people skills help you understand what matters to different stakeholders. Your visibility means decision-makers take your perspective seriously.`,
        action: 'Map the stakeholder landscape carefully. Find genuine common ground and build agreements incrementally. Present your case in terms of what matters to each stakeholder. Your ability to influence will move things forward.'
      },
      {
        title: 'Scenario 4: Driving Innovation and Change Adoption',
        situation: 'Your organization needs to evolve. People are comfortable with current state and resistant to new approaches. You need to build excitement and momentum.',
        yourStrength: `Your innovation strength means you see possibilities and opportunities before others. Your vision helps you articulate why change matters. Your influence helps you bring people along. Your people focus helps you address concerns authentically.`,
        action: 'Paint a compelling picture of the future. Help people understand how it benefits them personally. Start with early adopters. Create quick wins to build momentum. Your enthusiasm and ability to bring people along will drive adoption.'
      }
    ];

    scenarios.forEach(s => {
      if (y + 90 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }

      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.title, M, y);
      y += 13;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Situation:', M, y);
      y += 10;
      let sitHeight = doc.heightOfString(s.situation, { width: CW - 12, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.situation, M + 12, y, { width: CW - 24 });
      y += sitHeight + 14;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Your Strength:', M, y);
      y += 10;
      let strHeight = doc.heightOfString(s.yourStrength, { width: CW - 12, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.yourStrength, M + 12, y, { width: CW - 24 });
      y += strHeight + 14;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Your Action:', M, y);
      y += 10;
      let actHeight = doc.heightOfString(s.action, { width: CW - 12, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.action, M + 12, y, { width: CW - 24 });
      y += actHeight + 14;
    });

    // PAGE 6: YOUR LEADERSHIP PROFILE - EXPANDED
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    let introHeight = doc.heightOfString(`These five dimensions represent your core leadership strengths and developmental opportunities. Your profile reveals how you integrate multiple leadership capabilities to drive results while maintaining team engagement.

Your profile isn't fixed - it's a starting point for growth. Leaders can develop in any dimension through deliberate practice and experience. The goal is to understand your unique profile and leverage it strategically while developing areas that matter for your role and aspirations.`, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(`These five dimensions represent your core leadership strengths and developmental opportunities. Your profile reveals how you integrate multiple leadership capabilities to drive results while maintaining team engagement.

Your profile isn't fixed - it's a starting point for growth. Leaders can develop in any dimension through deliberate practice and experience. The goal is to understand your unique profile and leverage it strategically while developing areas that matter for your role and aspirations.`, M, y, { width: CW });
    y += introHeight + 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Scores:', M, y);
    y += 13;
    let explHeight = doc.heightOfString(`High scores (7-10): Your natural strengths where you lead with energy and effectiveness.

Medium scores (4-6): Neutral areas where you have capability. These often represent your biggest growth opportunities.

Lower scores (0-3): Areas to develop intentionally. They're learnable through deliberate practice and coaching.

There are no "good" or "bad" scores - they reveal your natural leadership pattern.`, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(`High scores (7-10): Your natural strengths where you lead with energy and effectiveness.

Medium scores (4-6): Neutral areas where you have capability. These often represent your biggest growth opportunities.

Lower scores (0-3): Areas to develop intentionally. They're learnable through deliberate practice and coaching.

There are no "good" or "bad" scores - they reveal your natural leadership pattern.`, M, y, { width: CW });
    y += explHeight + 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Five Dimension Scores:', M, y);
    y += 13;

    const scores = [
      { label: 'People Focus', value: 8, desc: 'You prioritize team development and emotional wellbeing as central to your leadership. This strength enables you to build loyal, engaged teams and create cultures where people do their best work.' },
      { label: 'Visibility Drive', value: 7, desc: 'You are comfortable with visibility and influence in your organization. You can advocate for your ideas and lead from the front. You build networks and connect with decision-makers.' },
      { label: 'Speed to Act', value: 8, desc: 'You are decisive and action-oriented. You move ideas into reality quickly and energize teams with momentum and forward progress. You create a culture of execution.' },
      { label: 'Influence', value: 7, desc: 'You persuade and mobilize others with relative ease. Your ideas gain traction because people believe in your judgment and direction. You build coalitions effectively.' },
      { label: 'Innovation', value: 8, desc: 'You are forward-thinking and comfortable with change. You see possibilities others miss and drive transformation. You attract change-ready talent and build cultures of continuous improvement.' },
    ];

    scores.forEach(s => {
      if (y + 50 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      y += 10;
      const barW = 120, barH = 7;
      doc.rect(M + 130, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 130, y, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 255, y);
      y += 10;
      let descHeight = doc.heightOfString(s.desc, { width: CW - 130, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.desc, M + 130, y, { width: CW - 140 });
      y += descHeight + 8;
    });

    const sections = parseContent(reportContent);

    // PAGES: AI SECTIONS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    for (const section of sections) {
      if (y + 100 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }

      doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text(section.title, M, y);
      y += 18;
      doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(2).stroke();
      y += 18;

      for (const line of section.content) {
        if (y + 60 > H - 45) {
          doc.addPage();
          pageNum++;
          header();
          y = 45;
        }

        let textHeight;
        if (line.startsWith('-')) {
          textHeight = doc.heightOfString('• ' + line.replace(/^-\s+/, ''), { width: CW - 30, font: 'Helvetica', size: 11 });
          doc.fontSize(11).font('Helvetica').fillColor('#333').text('• ' + line.replace(/^-\s+/, ''), M + 15, y, { width: CW - 30 });
        } else {
          textHeight = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 11 });
          doc.fontSize(11).font('Helvetica').fillColor('#333').text(line, M, y, { width: CW });
        }
        y += textHeight + 14;
      }
      y += 16;
    }

    // PAGE: EXPANDED STYLE ANALYSIS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP STYLE ANALYSIS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Primary Style: ' + primaryStyle, M, y);
    y += 14;
    let styleIntroHeight = doc.heightOfString(`This is your natural default way of leading. It reflects how you show up when you are at your best and when under pressure. Your ${primaryStyle} style means you focus on possibilities, inspire others with compelling vision, and lead through genuine relationships. This style is particularly effective when teams need direction, clarity, and motivation during times of change or uncertainty.`, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(`This is your natural default way of leading. It reflects how you show up when you are at your best and when under pressure. Your ${primaryStyle} style means you focus on possibilities, inspire others with compelling vision, and lead through genuine relationships. This style is particularly effective when teams need direction, clarity, and motivation during times of change or uncertainty.`, M, y, { width: CW });
    y += styleIntroHeight + 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Style Shows Up:', M, y);
    y += 13;
    let showsUpHeight = doc.heightOfString(`You naturally see the bigger picture and help others understand how their work contributes to larger goals. You build strong relationships quickly and use genuine connection as a primary leadership tool. You inspire others with your optimism and possibility-focused thinking. You adapt your approach based on people's emotional states and readiness. Your presence creates an environment where people feel valued and motivated to do their best work.`, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(`You naturally see the bigger picture and help others understand how their work contributes to larger goals. You build strong relationships quickly and use genuine connection as a primary leadership tool. You inspire others with your optimism and possibility-focused thinking. You adapt your approach based on people's emotional states and readiness. Your presence creates an environment where people feel valued and motivated to do their best work.`, M, y, { width: CW });
    y += showsUpHeight + 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Complete Style Profile:', M, y);
    y += 13;

    const styles = [
      { name: 'Visionary', pct: 90, desc: 'You see possibilities and opportunities before others. You naturally paint compelling pictures of the future that inspire people to move forward. You connect people to larger purpose and meaning. You thrive on creating transformational change and positioning organizations for future success. Your strength lies in helping others understand not just what to do, but why it matters.' },
      { name: 'Analyzer', pct: 75, desc: 'You think systematically and dig deep into data before making decisions. You value accuracy, precision, and thorough analysis. You ask tough questions and challenge assumptions to ensure decisions are sound and well-informed. You excel at identifying potential problems before they happen. Your strength is bringing rigor and discipline to complex decisions.' },
      { name: 'Coach', pct: 80, desc: 'You develop people and help them reach their potential. You listen deeply and understand what motivates individuals. You create safe environments where people feel comfortable taking risks and learning. You give honest, constructive feedback that helps people grow. Your strength is building loyal, engaged teams where people want to give their best work.' },
      { name: 'Driver', pct: 70, desc: 'You focus relentlessly on results and moving things forward. You set high standards and hold yourself and others accountable. You create urgency and momentum toward goals. You push through obstacles to achieve desired outcomes. You make tough calls when needed and don\'t get distracted by politics. Your strength is delivering results consistently and energizing teams with forward progress.' },
      { name: 'Supporter', pct: 65, desc: 'You prioritize harmony and collaboration in team dynamics. You bring people together and help diverse groups work as cohesive teams. You listen carefully to concerns and find ways to address them constructively. You value consensus and work to build agreement before moving forward. Your strength is building cohesive teams where everyone feels valued and heard.' },
    ];

    styles.forEach(s => {
      if (y + 40 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(11).font('Helvetica').fillColor('#333').text(s.name, M, y);
      y += 11;
      const barW = 140, barH = 6;
      doc.rect(M + 110, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 110, y, (s.pct / 100) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.pct + '%', M + 255, y);
      y += 10;
      let styleDescHeight = doc.heightOfString(s.desc, { width: CW - 110, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.desc, M + 110, y, { width: CW - 120 });
      y += styleDescHeight + 14;
    });

    // PAGE: EXPANDED 90-DAY ROADMAP
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('90-DAY LEADERSHIP ROADMAP', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    let roadmapIntroHeight = doc.heightOfString('This roadmap breaks your development journey into three focused phases spanning 90 days. Each phase has clear milestones and builds intentionally on the previous one. The goal is to move from awareness to action to integration, creating lasting behavioral change.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('This roadmap breaks your development journey into three focused phases spanning 90 days. Each phase has clear milestones and builds intentionally on the previous one. The goal is to move from awareness to action to integration, creating lasting behavioral change.', M, y, { width: CW });
    y += roadmapIntroHeight + 16;

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
      if (y + 140 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(r.phase, M, y);
      y += 14;
      doc.fontSize(10).font('Helvetica').fillColor('#999').text(r.time + ' | ' + r.overview, M + 12, y);
      y += 11;
      r.actions.forEach(a => {
        let aHeight = doc.heightOfString(a, { width: CW - 30, font: 'Helvetica', size: 11 });
        doc.fontSize(11).font('Helvetica').fillColor('#333').text('• ' + a, M + 12, y, { width: CW - 30 });
        y += aHeight + 9;
      });
      y += 14;
    });

    // PAGE: RESOURCES
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('RECOMMENDED RESOURCES', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Recommended Books', M, y);
    y += 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Multipliers - Liz Wiseman', M, y);
    y += 12;
    let book1Height = doc.heightOfString('Essential for leaders who want to develop their teams. Contrasts multipliers (who expand capability) with diminishers. Supports your People Focus strength.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('Essential for leaders who want to develop their teams. Contrasts multipliers (who expand capability) with diminishers. Supports your People Focus strength.', M, y, { width: CW });
    y += book1Height + 16;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('The Innovator\'s Dilemma - Clayton Christensen', M, y);
    y += 12;
    let book2Height = doc.heightOfString('A classic on disruption and innovation. Provides frameworks for anticipating market shifts and leading transformation. Perfect for your Visionary strength.', { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('A classic on disruption and innovation. Provides frameworks for anticipating market shifts and leading transformation. Perfect for your Visionary strength.', M, y, { width: CW });
    y += book2Height + 16;

    // PAGE: 30-DAY ACTION PLAN
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY 30-DAY ACTION PLAN', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    const weeks = [
      { week: 'Week 1 - Build Self-Awareness', actions: 'Schedule 1-on-1 feedback conversations with 5 key stakeholders. Listen without defending. Take detailed notes on themes. What patterns emerge? What surprises you?' },
      { week: 'Week 2 - Clarify Your Leadership', actions: 'Write down your top 3 leadership strengths with 2-3 examples. Identify your top 2-3 development areas with one situation example. Share with your coach for perspective.' },
      { week: 'Week 3 - Create Your Vision', actions: 'Create a one-page leadership vision. Articulate your aspiration for 2 years, top 3 priorities for 90 days, and how you\'ll measure success. Share with your boss.' },
      { week: 'Week 4 - Launch Your Practice', actions: 'Identify 2-3 micro-habits to practice daily. Examples: Have 3 one-on-ones focused on listening, send one recognition message, make one decision without consensus.' },
    ];

    weeks.forEach(w => {
      if (y + 80 > H - 45) {
        doc.addPage();
        pageNum++;
        header();
        y = 45;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(w.week, M, y);
      y += 13;
      let weekHeight = doc.heightOfString(w.actions, { width: CW, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#333').text(w.actions, M, y, { width: CW });
      y += weekHeight + 16;
    });

    // PAGE: ACTION COMMITMENTS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 13;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 18;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 18;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Success Metrics:', M, y);
    y += 13;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
    y += 45;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Key Obstacles & Solutions:', M, y);
    y += 13;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');

    // PAGE: MICRO HABITS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('WEEKLY MICRO-HABITS', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 120, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica').fillColor('#666').text('Small, consistent actions compound into major transformation. List 1-2 specific actions for each period.', M, y, { width: CW });
    y += 14;

    ['Week 1-2', 'Week 3-4', 'Week 5-8', 'Week 9-12'].forEach(week => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(week + ':', M, y);
      y += 12;
      doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');
      y += 50;
    });

    // PAGE: ACCOUNTABILITY
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('ACCOUNTABILITY PARTNER AGREEMENT', M, y);
    y += 20;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(1.5).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica').fillColor('#333').text('I commit to my leadership development and will leverage support to achieve my goals.', M, y, { width: CW });
    y += 14;

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
    doc.rect(M, y, CW, 45).stroke('#ccc');
    y += 50;

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
