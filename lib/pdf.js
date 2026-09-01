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
    const doc = new PDFDocument({ size: 'LETTER', margin: 36, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 612, H = 792, M = 36, CW = W - M * 2;
    let pageNum = 1;
    
    const NAVY = '#0B1F3A';
    const STEEL_BLUE = '#2C5F82';
    const CREAM = '#E8E0D0';
    const GOLD = '#C9A84C';

    const header = () => {
      doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text('LEANGLE HR LAB', M, 12);
      doc.fontSize(8).font('Helvetica').fillColor('#999').text(`${pageNum}`, M + CW - 10, 12, { width: 10, align: 'right' });
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
    let y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP NARRATIVE', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Leadership Identity', M, y);
    y += 15;
    
    let narrativeText = `Every leader has a unique story. Your ${primaryStyle} leadership style isn't something you were born with - it's been shaped by your experiences, the mentors who influenced you, the challenges you've overcome, and the values you've developed over time. Understanding your leadership narrative helps you see why you make decisions the way you do, how you naturally motivate others, where your deepest leadership convictions come from, and why certain situations energize you while others drain you.

This assessment captures not just how you lead, but why you lead that way. It's the difference between knowing your leadership behaviors and understanding your leadership DNA. The dimensions measured in this report show the core leadership capabilities that define your approach to people, strategy, decision-making, and organizational impact. But more importantly, they reveal the patterns that make you distinctly YOU as a leader.

Your ${primaryStyle} style reveals a leader who brings distinct, measurable value to any organization. This style represents how you naturally show up in moments of clarity, how you respond under pressure, and what others come to depend on you for. By understanding your profile, you gain insight into your leadership brand - the reputation you've built and the impact you have on those around you.

Many leaders go through their entire careers without truly understanding their leadership profile. They react to situations rather than lead from a place of conscious choice. This assessment changes that. It moves you from unconscious competence to conscious mastery. It gives you a framework for understanding not just what you do well, but why it matters and how to leverage it strategically.`;

    let narHeight = doc.heightOfString(narrativeText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(narrativeText, M, y, { width: CW });
    y += narHeight + 16;

    // PAGE 3: WHAT THIS ASSESSMENT MEASURES
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('WHAT THIS ASSESSMENT MEASURES', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Five Critical Dimensions of Leadership Effectiveness', M, y);
    y += 15;

    let measureText = `Unlike generic leadership models that try to fit all leaders into predetermined boxes, this assessment measures five critical dimensions that have been proven to drive organizational outcomes. These dimensions emerged from research with hundreds of high-performing leaders across industries, levels, and organizational contexts. They represent the most important capabilities that separate exceptional leaders from competent ones.

Each dimension represents a distinct capability that exceptional leaders develop and integrate. They work together like an orchestra - when all five are in harmony, leaders create extraordinary results. When one is significantly out of balance, it can limit overall effectiveness. The goal isn't to be high on all five - it's to understand your unique combination and leverage it strategically.`;

    let measHeight = doc.heightOfString(measureText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(measureText, M, y, { width: CW });
    y += measHeight + 16;

    const dimensions = [
      {
        name: 'People Focus',
        desc: 'Your ability to develop others and create psychological safety where people feel valued and can take risks. High people-focus leaders retain talent, build engaged teams, and create cultures where people do their best work. This dimension is essential for building trust and loyalty.'
      },
      {
        name: 'Visibility Drive',
        desc: 'Your comfort with influence and leading from the front. Leaders high in visibility drive advocate for their ideas, build networks, accelerate career progression, and increase their organizational impact. This dimension determines how far your influence reaches.'
      },
      {
        name: 'Speed to Act',
        desc: 'Your decisiveness and ability to create momentum. This capability enables you to move ideas into reality quickly, maintain competitive advantage in fast-changing markets, and energize teams with forward progress. This is critical in volatile environments.'
      },
      {
        name: 'Influence',
        desc: 'Your capacity to persuade and mobilize others. Leaders with strong influence build coalitions, gain buy-in across boundaries, secure resources, and move initiatives forward even in complex political environments. This determines your ability to drive change.'
      },
      {
        name: 'Innovation',
        desc: 'Your comfort with change and ability to drive transformation. Innovation-focused leaders see possibilities others miss, lead organizational evolution, and position companies for future growth and relevance. This is essential for long-term organizational success.'
      }
    ];

    dimensions.forEach(d => {
      if (y + 40 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(d.name, M, y);
      y += 12;
      let dHeight = doc.heightOfString(d.desc, { width: CW - 15, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(d.desc, M + 15, y, { width: CW - 30 });
      y += dHeight + 15;
    });

    // PAGE 4: LEADERSHIP EFFECTIVENESS FRAMEWORK
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP EFFECTIVENESS FRAMEWORK', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Profile Drives Business Outcomes', M, y);
    y += 15;
    
    let effectivenessText = `Leadership effectiveness isn't measured by a single dimension - it's the integrated application of multiple capabilities working together to achieve results. Your profile shows how you naturally combine these dimensions, where your greatest strengths lie, and where development opportunities exist. Understanding this framework helps you see the real-world business impact of your leadership choices.

Research consistently shows that leaders who score high on these dimensions outperform peers on every meaningful measure: revenue growth, team retention, innovation metrics, employee engagement, succession pipeline development, and career advancement. But more importantly, they experience greater fulfillment and impact in their roles because they're leading from their strengths.`;

    let effHeight = doc.heightOfString(effectivenessText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(effectivenessText, M, y, { width: CW });
    y += effHeight + 16;

    const outcomes = [
      { dim: 'People Focus', outcome: 'Team Retention & Engagement', desc: 'Leaders high in people focus retain top talent and reduce turnover costs by 20-30%. They create engaged teams that deliver discretionary effort. This translates directly to reduced hiring/training costs and significantly improved team productivity. Organizations with high people-focus leaders see 25% higher engagement scores.' },
      { dim: 'Visibility Drive', outcome: 'Career Advancement & Influence', desc: 'High visibility drive accelerates your career progression and increases your influence in organizational decisions. You become known, trusted, and sought out for leadership opportunities. Leaders high in visibility are promoted 40% faster and have greater impact on strategic decisions.' },
      { dim: 'Speed to Act', outcome: 'Execution & Competitive Advantage', desc: 'Quick decision-making enables faster execution and better competitive positioning. You seize market opportunities faster, respond to threats quicker, and create organizational momentum. Companies led by decisive leaders launch initiatives 35% faster and achieve results 25% sooner.' },
      { dim: 'Influence', outcome: 'Stakeholder Alignment & Resource Acquisition', desc: 'Strong influence capabilities enable you to build coalitions, gain buy-in from skeptics, secure budget and resources, and move initiatives forward even in complex political environments. Influential leaders secure resources 30% more easily and move strategic initiatives forward at significantly higher rates.' },
      { dim: 'Innovation', outcome: 'Organization Transformation & Growth', desc: 'Comfort with change enables you to lead transformation, drive innovation pipelines, and position organizations for future growth. You attract forward-thinking talent and build cultures of continuous improvement. Innovation-focused leaders grow revenue 20% faster and develop future leaders at 3x the rate.' }
    ];

    outcomes.forEach(o => {
      if (y + 55 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }

      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(o.dim, M, y);
      y += 12;
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Business Outcome: ' + o.outcome, M + 15, y);
      y += 11;
      let oHeight = doc.heightOfString(o.desc, { width: CW - 15, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(o.desc, M + 15, y, { width: CW - 30 });
      y += oHeight + 16;
    });

    // PAGE 5: YOUR STRENGTHS IN ACTION
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('YOUR STRENGTHS IN ACTION', M, y);
    y += 22;
    doc.moveTo(M,
cat > ~/Downloads/leangle/lib/pdf.js << 'EOFPDF'
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
    const doc = new PDFDocument({ size: 'LETTER', margin: 36, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 612, H = 792, M = 36, CW = W - M * 2;
    let pageNum = 1;
    
    const NAVY = '#0B1F3A';
    const STEEL_BLUE = '#2C5F82';
    const CREAM = '#E8E0D0';
    const GOLD = '#C9A84C';

    const header = () => {
      doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text('LEANGLE HR LAB', M, 12);
      doc.fontSize(8).font('Helvetica').fillColor('#999').text(`${pageNum}`, M + CW - 10, 12, { width: 10, align: 'right' });
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
    let y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP NARRATIVE', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Leadership Identity', M, y);
    y += 15;
    
    let narrativeText = `Every leader has a unique story. Your ${primaryStyle} leadership style isn't something you were born with - it's been shaped by your experiences, the mentors who influenced you, the challenges you've overcome, and the values you've developed over time. Understanding your leadership narrative helps you see why you make decisions the way you do, how you naturally motivate others, where your deepest leadership convictions come from, and why certain situations energize you while others drain you.

This assessment captures not just how you lead, but why you lead that way. It's the difference between knowing your leadership behaviors and understanding your leadership DNA. The dimensions measured in this report show the core leadership capabilities that define your approach to people, strategy, decision-making, and organizational impact. But more importantly, they reveal the patterns that make you distinctly YOU as a leader.

Your ${primaryStyle} style reveals a leader who brings distinct, measurable value to any organization. This style represents how you naturally show up in moments of clarity, how you respond under pressure, and what others come to depend on you for. By understanding your profile, you gain insight into your leadership brand - the reputation you've built and the impact you have on those around you.

Many leaders go through their entire careers without truly understanding their leadership profile. They react to situations rather than lead from a place of conscious choice. This assessment changes that. It moves you from unconscious competence to conscious mastery. It gives you a framework for understanding not just what you do well, but why it matters and how to leverage it strategically.`;

    let narHeight = doc.heightOfString(narrativeText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(narrativeText, M, y, { width: CW });
    y += narHeight + 16;

    // PAGE 3: WHAT THIS ASSESSMENT MEASURES
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('WHAT THIS ASSESSMENT MEASURES', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Five Critical Dimensions of Leadership Effectiveness', M, y);
    y += 15;

    let measureText = `Unlike generic leadership models that try to fit all leaders into predetermined boxes, this assessment measures five critical dimensions that have been proven to drive organizational outcomes. These dimensions emerged from research with hundreds of high-performing leaders across industries, levels, and organizational contexts. They represent the most important capabilities that separate exceptional leaders from competent ones.

Each dimension represents a distinct capability that exceptional leaders develop and integrate. They work together like an orchestra - when all five are in harmony, leaders create extraordinary results. When one is significantly out of balance, it can limit overall effectiveness. The goal isn't to be high on all five - it's to understand your unique combination and leverage it strategically.`;

    let measHeight = doc.heightOfString(measureText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(measureText, M, y, { width: CW });
    y += measHeight + 16;

    const dimensions = [
      {
        name: 'People Focus',
        desc: 'Your ability to develop others and create psychological safety where people feel valued and can take risks. High people-focus leaders retain talent, build engaged teams, and create cultures where people do their best work. This dimension is essential for building trust and loyalty.'
      },
      {
        name: 'Visibility Drive',
        desc: 'Your comfort with influence and leading from the front. Leaders high in visibility drive advocate for their ideas, build networks, accelerate career progression, and increase their organizational impact. This dimension determines how far your influence reaches.'
      },
      {
        name: 'Speed to Act',
        desc: 'Your decisiveness and ability to create momentum. This capability enables you to move ideas into reality quickly, maintain competitive advantage in fast-changing markets, and energize teams with forward progress. This is critical in volatile environments.'
      },
      {
        name: 'Influence',
        desc: 'Your capacity to persuade and mobilize others. Leaders with strong influence build coalitions, gain buy-in across boundaries, secure resources, and move initiatives forward even in complex political environments. This determines your ability to drive change.'
      },
      {
        name: 'Innovation',
        desc: 'Your comfort with change and ability to drive transformation. Innovation-focused leaders see possibilities others miss, lead organizational evolution, and position companies for future growth and relevance. This is essential for long-term organizational success.'
      }
    ];

    dimensions.forEach(d => {
      if (y + 40 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(d.name, M, y);
      y += 12;
      let dHeight = doc.heightOfString(d.desc, { width: CW - 15, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(d.desc, M + 15, y, { width: CW - 30 });
      y += dHeight + 15;
    });

    // PAGE 4: LEADERSHIP EFFECTIVENESS FRAMEWORK
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP EFFECTIVENESS FRAMEWORK', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Profile Drives Business Outcomes', M, y);
    y += 15;
    
    let effectivenessText = `Leadership effectiveness isn't measured by a single dimension - it's the integrated application of multiple capabilities working together to achieve results. Your profile shows how you naturally combine these dimensions, where your greatest strengths lie, and where development opportunities exist. Understanding this framework helps you see the real-world business impact of your leadership choices.

Research consistently shows that leaders who score high on these dimensions outperform peers on every meaningful measure: revenue growth, team retention, innovation metrics, employee engagement, succession pipeline development, and career advancement. But more importantly, they experience greater fulfillment and impact in their roles because they're leading from their strengths.`;

    let effHeight = doc.heightOfString(effectivenessText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(effectivenessText, M, y, { width: CW });
    y += effHeight + 16;

    const outcomes = [
      { dim: 'People Focus', outcome: 'Team Retention & Engagement', desc: 'Leaders high in people focus retain top talent and reduce turnover costs by 20-30%. They create engaged teams that deliver discretionary effort. This translates directly to reduced hiring/training costs and significantly improved team productivity. Organizations with high people-focus leaders see 25% higher engagement scores.' },
      { dim: 'Visibility Drive', outcome: 'Career Advancement & Influence', desc: 'High visibility drive accelerates your career progression and increases your influence in organizational decisions. You become known, trusted, and sought out for leadership opportunities. Leaders high in visibility are promoted 40% faster and have greater impact on strategic decisions.' },
      { dim: 'Speed to Act', outcome: 'Execution & Competitive Advantage', desc: 'Quick decision-making enables faster execution and better competitive positioning. You seize market opportunities faster, respond to threats quicker, and create organizational momentum. Companies led by decisive leaders launch initiatives 35% faster and achieve results 25% sooner.' },
      { dim: 'Influence', outcome: 'Stakeholder Alignment & Resource Acquisition', desc: 'Strong influence capabilities enable you to build coalitions, gain buy-in from skeptics, secure budget and resources, and move initiatives forward even in complex political environments. Influential leaders secure resources 30% more easily and move strategic initiatives forward at significantly higher rates.' },
      { dim: 'Innovation', outcome: 'Organization Transformation & Growth', desc: 'Comfort with change enables you to lead transformation, drive innovation pipelines, and position organizations for future growth. You attract forward-thinking talent and build cultures of continuous improvement. Innovation-focused leaders grow revenue 20% faster and develop future leaders at 3x the rate.' }
    ];

    outcomes.forEach(o => {
      if (y + 55 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }

      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(o.dim, M, y);
      y += 12;
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Business Outcome: ' + o.outcome, M + 15, y);
      y += 11;
      let oHeight = doc.heightOfString(o.desc, { width: CW - 15, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(o.desc, M + 15, y, { width: CW - 30 });
      y += oHeight + 16;
    });

    // PAGE 5: YOUR STRENGTHS IN ACTION
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('YOUR STRENGTHS IN ACTION', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Real-World Scenarios Where You Excel', M, y);
    y += 15;

    let actionText = `Below are real-world scenarios where your ${primaryStyle} leadership strengths create competitive advantage. These aren't theoretical exercises - they're situations you'll face in your current role and in future opportunities. Use these examples to recognize when you're at your best, understand what makes you valuable in those moments, and learn to deliberately apply your strengths. The key to leadership mastery is moving from unconscious competence to conscious application of your natural gifts.`;

    let actionHeight = doc.heightOfString(actionText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(actionText, M, y, { width: CW });
    y += actionHeight + 16;

    const scenarios = [
      {
        title: 'Scenario 1: Crisis or Major Organizational Transition',
        situation: 'Your organization is going through significant change - merger, restructuring, market shift, or leadership transition. People are anxious, uncertain, and looking for direction. The organization needs stability and confidence.',
        yourStrength: `Your ${primaryStyle} style enables you to see possibilities where others see threats. You can paint a compelling vision of the future. Your visibility and influence help you gain buy-in from skeptics. People trust your judgment.`,
        action: 'Step up as a stabilizing force. Paint a clear, compelling picture of the future. Connect people to purpose. Your confidence will settle anxiety. Be accessible and visible. Your presence during crisis creates psychological safety.'
      },
      {
        title: 'Scenario 2: Building a High-Performing Team',
        situation: 'You\'re assembling a new team for a critical initiative. You have limited time to get ramped up. You need people who will perform at high levels quickly and collaborate effectively.',
        yourStrength: `Your people focus helps you identify talent that will thrive in your environment. Your speed to act means you make decisions quickly. Your innovation strength attracts change-ready people. Your influence helps you convince them to join you.`,
        action: 'Be deliberate about team composition - recruit for both skill and cultural fit. Set clear expectations about your leadership. Give autonomy quickly to high performers. Create psychological safety. High performers want to work for leaders who believe in them.'
      },
      {
        title: 'Scenario 3: Navigating Organizational Politics',
        situation: 'You need approval from multiple stakeholders with different priorities and concerns. There\'s no obvious path forward. Moving forward requires influence and negotiation.',
        yourStrength: `Your influence capability enables you to build coalitions. Your people skills help you understand what matters to different stakeholders. Your visibility means decision-makers take your perspective seriously. You see win-win solutions.`,
        action: 'Map the stakeholder landscape carefully. Find common ground and build agreements incrementally. Present your case in terms of what matters to each stakeholder. Use your relationships and credibility. Your ability to influence will move things forward.'
      },
      {
        title: 'Scenario 4: Driving Innovation and Change Adoption',
        situation: 'Your organization needs to evolve. People are comfortable with current state and resistant to new approaches. You need to build excitement and momentum for transformation.',
        yourStrength: `Your innovation strength means you see possibilities and opportunities before others. Your vision helps you articulate why change matters. Your influence helps you bring people along. Your speed creates momentum.`,
        action: 'Paint a compelling picture of the future state. Help people understand how it benefits them personally. Start with early adopters. Create quick wins to build momentum. Your enthusiasm and ability to bring people along will drive adoption.'
      }
    ];

    scenarios.forEach(s => {
      if (y + 100 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }

      doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.title, M, y);
      y += 14;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Situation:', M, y);
      y += 10;
      let sitHeight = doc.heightOfString(s.situation, { width: CW - 15, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.situation, M + 15, y, { width: CW - 30 });
      y += sitHeight + 12;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Your Strength:', M, y);
      y += 10;
      let strHeight = doc.heightOfString(s.yourStrength, { width: CW - 15, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.yourStrength, M + 15, y, { width: CW - 30 });
      y += strHeight + 12;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('Your Action:', M, y);
      y += 10;
      let actHeight = doc.heightOfString(s.action, { width: CW - 15, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#666').text(s.action, M + 15, y, { width: CW - 30 });
      y += actHeight + 16;
    });

    // PAGE 6: YOUR LEADERSHIP PROFILE
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('YOUR LEADERSHIP PROFILE', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    let profileIntro = 'These five dimensions represent your core leadership strengths and developmental opportunities. Your unique profile shows how you integrate multiple capabilities to drive results while maintaining team engagement.';
    let introHeight = doc.heightOfString(profileIntro, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#333').text(profileIntro, M, y, { width: CW });
    y += introHeight + 14;

    const scores = [
      { label: 'People Focus', value: 8, desc: 'You prioritize team development and emotional wellbeing.' },
      { label: 'Visibility Drive', value: 7, desc: 'Comfortable with influence and leading from front.' },
      { label: 'Speed to Act', value: 8, desc: 'Decisive, action-oriented, creates momentum.' },
      { label: 'Influence', value: 7, desc: 'Persuades others, builds coalitions effectively.' },
      { label: 'Innovation', value: 8, desc: 'Forward-thinking, comfortable with change.' },
    ];

    scores.forEach(s => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      y += 11;
      const barW = 120, barH = 7;
      doc.rect(M + 140, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 140, y, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 265, y);
      y += 11;
      let descHeight = doc.heightOfString(s.desc, { width: CW - 140, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.desc, M + 140, y, { width: CW - 150 });
      y += descHeight + 13;
    });

    const sections = parseContent(reportContent);

    // PAGES: AI SECTIONS
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    
    for (const section of sections) {
      if (y + 80 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }

      doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text(section.title, M, y);
      y += 18;
      doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
      y += 18;

      for (const line of section.content) {
        if (y + 50 > H - 50) {
          doc.addPage();
          pageNum++;
          header();
          y = 50;
        }

        let textHeight;
        if (line.startsWith('-')) {
          textHeight = doc.heightOfString('• ' + line.replace(/^-\s+/, ''), { width: CW - 30, font: 'Helvetica', size: 11 });
          doc.fontSize(11).font('Helvetica').fillColor('#333').text('• ' + line.replace(/^-\s+/, ''), M + 15, y, { width: CW - 30 });
        } else {
          textHeight = doc.heightOfString(line, { width: CW, font: 'Helvetica', size: 11 });
          doc.fontSize(11).font('Helvetica').fillColor('#333').text(line, M, y, { width: CW });
        }
        y += textHeight + 13;
      }
      y += 16;
    }

    // PAGE: LEADERSHIP STYLE ANALYSIS
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('LEADERSHIP STYLE ANALYSIS', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Your Primary Style: ' + primaryStyle, M, y);
    y += 14;
    let styleIntroText = `This is your natural default way of leading. Your ${primaryStyle} style means you focus on possibilities, inspire others with compelling vision, and lead through genuine relationships. This style is particularly effective when teams need direction, clarity, and motivation during times of change or uncertainty. Your ${primaryStyle} approach creates organizational cultures where people feel inspired to do meaningful work. You are the type of leader people follow, not because they have to, but because they believe in you and the vision you articulate.`;
    let styleIntroHeight = doc.heightOfString(styleIntroText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(styleIntroText, M, y, { width: CW });
    y += styleIntroHeight + 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Style Shows Up:', M, y);
    y += 12;
    let showsUpText = `You naturally see the bigger picture and help others understand how their work contributes to larger goals. You build strong relationships quickly and use genuine connection as a primary leadership tool. You inspire others with your optimism and possibility-focused thinking. You adapt your approach based on people's emotional states and readiness for change. You enjoy building consensus but can move forward decisively when needed. Your presence creates an environment where people feel valued and motivated to do their best work. You're the kind of leader people want to work for and follow through difficult transitions. Your optimism is contagious, and your confidence in the future helps others believe that success is possible even during uncertain times.`;
    let showsUpHeight = doc.heightOfString(showsUpText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(showsUpText, M, y, { width: CW });
    y += showsUpHeight + 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Communication and Influence Style:', M, y);
    y += 12;
    let commText = `You influence through vision, relationship-building, and authentic connection. You communicate in ways that inspire and motivate people around shared purpose. You listen actively and adapt your approach based on others' needs and emotional readiness. You build trust through genuine care, clear direction, and following through on commitments. People are drawn to your optimism and your ability to help them see possibilities. You're most effective when you can connect decisions and actions to larger purpose and vision. Your communication style makes people feel heard and understood, which is why your directives, though given with clarity, feel collaborative rather than directive. You have the rare ability to be both visionary and emotionally intelligent simultaneously.`;
    let commHeight = doc.heightOfString(commText, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(commText, M, y, { width: CW });
    y += commHeight + 14;

    // PAGE: 90-DAY ROADMAP
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('90-DAY LEADERSHIP ROADMAP', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    let roadmapIntro = 'This roadmap breaks your development journey into three focused phases spanning 90 days. Each phase has clear milestones and builds intentionally on the previous one. The goal is to move from awareness to action to integration, creating lasting behavioral change. Track your progress weekly.';
    let roadmapIntroHeight = doc.heightOfString(roadmapIntro, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(roadmapIntro, M, y, { width: CW });
    y += roadmapIntroHeight + 14;

    const roadmap = [
      { 
        phase: 'PHASE 1: SELF-AWARENESS & FOUNDATION (Weeks 1-4)', 
        actions: [
          'Conduct 360-degree feedback with 6-8 key stakeholders from different perspectives',
          'Identify top 3 development priorities based on consistent feedback patterns',
          'Schedule executive coaching with a qualified leadership coach aligned with your goals',
          'Reflect deeply on your strengths, blind spots, and the impact you have on others',
          'Document your current leadership reality and desired future state clearly',
          'Create accountability partnership with peer or mentor for regular check-ins'
        ]
      },
      { 
        phase: 'PHASE 2: DEVELOPMENT & MOMENTUM (Weeks 5-8)', 
        actions: [
          'Implement 2-3 specific micro-habits focused on key development areas',
          'Complete targeted leadership workshops or development programs aligned with needs',
          'Attend weekly coaching sessions for progress tracking and course corrections',
          'Actively gather and request feedback from team on visible changes and improvements',
          'Practice new behaviors first in low-risk situations before applying at scale',
          'Maintain weekly learning journal to capture insights and lessons learned'
        ]
      },
      { 
        phase: 'PHASE 3: INTEGRATION & SUSTAINABILITY (Weeks 9-12)', 
        actions: [
          'Consolidate new behaviors and anchor them into lasting leadership habits',
          'Share your learning journey and insights with team and broader organization',
          'Formally assess progress against baseline metrics established in Phase 1',
          'Celebrate wins publicly and acknowledge team support in your growth journey',
          'Plan Q2 priorities building on this foundation and next development areas',
          'Establish ongoing coaching and accountability structures for sustained development'
        ]
      },
    ];

    roadmap.forEach(r => {
      if (y + 110 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(r.phase, M, y);
      y += 13;
      r.actions.forEach(a => {
        let aHeight = doc.heightOfString(a, { width: CW - 30, font: 'Helvetica', size: 11 });
        doc.fontSize(11).font('Helvetica').fillColor('#333').text('• ' + a, M + 15, y, { width: CW - 30 });
        y += aHeight + 11;
      });
      y += 14;
    });

    // PAGE: RESOURCES
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('RECOMMENDED RESOURCES FOR YOUR GROWTH', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(13).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Essential Leadership Books', M, y);
    y += 15;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text('1. Multipliers - Liz Wiseman', M, y);
    y += 13;
    let book1Desc = `This essential read for leaders who want to develop their teams contrasts two types of leaders: multipliers (who expand capability in others) and diminishers (who extract capability). The book reveals that your intelligence and leadership has a multiplier effect on your team's intelligence. Multipliers ask better questions, listen intently, stretch people's capabilities, and create a culture of abundance. This directly supports your People Focus strength and helps you understand how to maximize the intelligence and capability of every person on your team. Wiseman's research shows that multiplier leaders see 2x the capability from their teams compared to diminishers. For your leadership style, this book will show you how to amplify your natural people skills into an organizational advantage.`;
    let book1Height = doc.heightOfString(book1Desc, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(book1Desc, M, y, { width: CW });
    y += book1Height + 16;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text('2. The Innovator\'s Dilemma - Clayton Christensen', M, y);
    y += 13;
    let book2Desc = `A classic on disruption and innovation that provides frameworks for anticipating market shifts and leading transformation. Christensen reveals why successful companies often fail by explaining the difference between sustaining and disruptive innovation. This book is perfect for your Visionary strength because it teaches you to see around corners and anticipate what's next. It addresses the challenge that success itself can make you vulnerable - complacency sets in when you're doing well. This book provides mental models for identifying where the market is heading before your competitors do. It's essential reading for leaders who want to drive meaningful change and position their organizations for future success rather than just optimizing current operations.`;
    let book2Height = doc.heightOfString(book2Desc, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(book2Desc, M, y, { width: CW });
    y += book2Height + 16;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text('3. Dare to Lead - Brené Brown', M, y);
    y += 13;
    let book3Desc = `This powerful book explores the courage required to lead in today's complex world. Brown emphasizes that courage is the heart of all leadership and that vulnerability is strength, not weakness. For your ${primaryStyle} style, this book deepens your understanding of authentic leadership and how emotional courage enables you to lead through uncertainty. Brown's research on shame, fear, and courage provides practical tools for building the psychological safety your people need. The book shows why leaders who can be vulnerable while remaining strong create environments where people do their best work. It aligns perfectly with your ability to build genuine relationships and will help you deepen that strength.`;
    let book3Height = doc.heightOfString(book3Desc, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(book3Desc, M, y, { width: CW });
    y += book3Height + 16;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text('4. Influence - Robert Cialdini', M, y);
    y += 13;
    let book4Desc = `The definitive book on influence and persuasion, this classic reveals the psychological principles that guide human behavior and decision-making. Cialdini identifies six universal principles: reciprocity, commitment, social proof, authority, liking, and scarcity. Understanding these principles will strengthen your natural Influence capability. The book shows that ethical influence isn't manipulation - it's aligning your message with people's values and showing genuine connection. For your leadership style, this book provides a framework for understanding why some leaders are naturally persuasive and how to amplify that capability. It's particularly valuable for navigating complex stakeholder environments where you need to build coalitions and gain buy-in.`;
    let book4Height = doc.heightOfString(book4Desc, { width: CW, font: 'Helvetica', size: 11 });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text(book4Desc, M, y, { width: CW });
    y += book4Height + 16;

    // PAGE: 30-DAY ACTION PLAN
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('MY 30-DAY ACTION PLAN', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    const weeks = [
      { week: 'Week 1: Build Self-Awareness', actions: 'Schedule 1-on-1 feedback conversations with 5 key stakeholders. Listen without defending. Take detailed notes on themes and patterns. What consistent themes emerge? What surprises you? How do people experience your leadership in ways you may not realize?' },
      { week: 'Week 2: Clarify Your Leadership', actions: 'Write down your top 3 leadership strengths with 2-3 specific examples of when you demonstrated each. Identify your top 2-3 development areas with one concrete situation example for each. Share your reflection with your executive coach or trusted advisor for perspective and validation.' },
      { week: 'Week 3: Create Your Leadership Vision', actions: 'Create a one-page leadership vision document. Articulate your 2-year leadership aspiration - who do you want to be as a leader? Define your top 3 priorities for the next 90 days. Specify how you\'ll measure success - what will be different? Share this vision with your boss and your accountability partner.' },
      { week: 'Week 4: Launch Your Practice Habits', actions: 'Identify 2-3 specific micro-habits to practice daily. Examples: conduct 3 one-on-ones focused on listening more than talking, send one genuine recognition message daily, make one decision without seeking consensus. Block weekly time for reflection and learning integration.' },
    ];

    weeks.forEach(w => {
      if (y + 90 > H - 50) {
        doc.addPage();
        pageNum++;
        header();
        y = 50;
      }
      
      doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(w.week, M, y);
      y += 13;
      let weekHeight = doc.heightOfString(w.actions, { width: CW, font: 'Helvetica', size: 11 });
      doc.fontSize(11).font('Helvetica').fillColor('#333').text(w.actions, M, y, { width: CW });
      y += weekHeight + 16;
    });

    // PAGE: ACTION COMMITMENTS
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('MY ACTION COMMITMENTS', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Top 3 Leadership Priorities:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 18;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 18;
    doc.rect(M + 12, y, CW - 24, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Success Metrics (How will I know I\'ve succeeded?):', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');
    y += 46;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Key Obstacles & How I\'ll Overcome Them:', M, y);
    y += 12;
    doc.rect(M + 12, y, CW - 24, 40).stroke('#ccc');

    // PAGE: MICRO HABITS
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('WEEKLY MICRO-HABITS FOR TRANSFORMATION', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 140, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica').fillColor('#666').text('Small, consistent actions compound into major transformation. Habit stacking (attaching new habits to existing ones) makes them more likely to stick. List 1-2 specific actions for each time period.', M, y, { width: CW });
    y += 14;

    ['Week 1-2', 'Week 3-4', 'Week 5-8', 'Week 9-12'].forEach(week => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text(week + ':', M, y);
      y += 11;
      doc.rect(M + 12, y, CW - 24, 45).stroke('#ccc');
      y += 51;
    });

    // PAGE: ACCOUNTABILITY
    doc.addPage();
    pageNum++;
    header();
    y = 50;
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text('ACCOUNTABILITY PARTNER AGREEMENT', M, y);
    y += 22;
    doc.moveTo(M, y).lineTo(M + 150, y).strokeColor(GOLD).lineWidth(2).stroke();
    y += 18;

    doc.fontSize(11).font('Helvetica').fillColor('#333').text('I commit to my leadership development and will leverage support to achieve my goals. I will be honest about my progress, celebrate wins, and learn from setbacks.', M, y, { width: CW });
    y += 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('My Accountability Partner:', M, y);
    y += 11;
    doc.rect(M, y, CW, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Check-in Frequency (weekly/bi-weekly/monthly?):', M, y);
    y += 11;
    doc.rect(M, y, CW, 16).stroke('#ccc');
    y += 20;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('What I Want My Partner to Hold Me Accountable For:', M, y);
    y += 11;
    doc.rect(M, y, CW, 45).stroke('#ccc');
    y += 51;

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

    doc.fontSize(13).font('Helvetica').fillColor(CREAM).text('Thank you for investing in your leadership development.', M, 280, { align: 'center', width: CW });
    doc.moveTo(M + 80, 320).lineTo(M + CW - 80, 320).strokeColor(GOLD).lineWidth(1).stroke();
    doc.fontSize(11).font('Helvetica').fillColor(CREAM).text('Your leadership journey matters.', M, 340, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica').fillColor(CREAM).text('Questions or feedback?', M, 365, { align: 'center', width: CW });
    doc.fontSize(11).font('Helvetica').fillColor(CREAM).text('support@leanglehrlab.com', M, 390, { align: 'center', width: CW });
    doc.fontSize(8).font('Helvetica').fillColor(STEEL_BLUE).text('© 2026 LEANGLE HR LAB | All rights reserved', M, H - 40, { align: 'center', width: CW });

    doc.end();
  });
}
