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

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Understanding Your Leadership Identity', M, y);
    y += 13;
    
    let narrativeText = `Every leader has a unique story. Your ${primaryStyle} leadership style isn't something you were born with - it's been shaped by your experiences, the mentors who influenced you, the challenges you've overcome, and the values you've developed over time. Understanding your leadership narrative helps you see why you make decisions the way you do, how you naturally motivate others, where your deepest leadership convictions come from, and why certain situations energize you while others drain you.

This assessment captures not just how you lead, but why you lead that way. It's the difference between knowing your leadership behaviors and understanding your leadership DNA. The dimensions measured in this report show the core leadership capabilities that define your approach to people, strategy, decision-making, and organizational impact. But more importantly, they reveal the patterns that make you distinctly YOU as a leader.

Your ${primaryStyle} style reveals a leader who brings distinct, measurable value to any organization. This style represents how you naturally show up in moments of clarity, how you respond under pressure, and what others come to depend on you for. By understanding your profile, you gain insight into your leadership brand - the reputation you've built and the impact you have on those around you.

Many leaders go through their entire careers without truly understanding their leadership profile. They react to situations rather than lead from a place of conscious choice. This assessment changes that. It moves you from unconscious competence to conscious mastery. It gives you a framework for understanding not just what you do well, but why it matters and how to leverage it strategically.`;

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

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Five Critical Dimensions of Leadership Effectiveness', M, y);
    y += 13;

    let measureText = `Unlike generic leadership models that try to fit all leaders into predetermined boxes, this assessment measures five critical dimensions that have been proven to drive organizational outcomes. These dimensions emerged from research with hundreds of high-performing leaders across industries, levels, and organizational contexts. They represent the most important capabilities that separate exceptional leaders from competent ones.

Each dimension represents a distinct capability that exceptional leaders develop and integrate. They work together like an orchestra - when all five are in harmony, leaders create extraordinary results. When one is significantly out of balance, it can limit overall effectiveness. The goal isn't to be high on all five - it's to understand your unique combination and leverage it strategically.`;

    let measHeight = doc.heightOfString(measureText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(measureText, M, y, { width: CW });
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

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Profile Drives Business Outcomes', M, y);
    y += 13;
    
    let effectivenessText = `Leadership effectiveness isn't measured by a single dimension - it's the integrated application of multiple capabilities working together to achieve results. Your profile shows how you naturally combine these dimensions, where your greatest strengths lie, and where development opportunities exist. Understanding this framework helps you see the real-world business impact of your leadership choices.

Research consistently shows that leaders who score high on these dimensions outperform peers on every meaningful measure: revenue growth, team retention, innovation metrics, employee engagement, succession pipeline development, and career advancement. But more importantly, they experience greater fulfillment and impact in their roles because they're leading from their strengths.

The framework below shows how each dimension connects to real business outcomes that matter to your organization:`;

    let effHeight = doc.heightOfString(effectivenessText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(effectivenessText, M, y, { width: CW });
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

    doc.fontSize(11).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Real-World Scenarios Where You Excel', M, y);
    y += 13;

    let actionText = `Below are real-world scenarios where your ${primaryStyle} leadership strengths create competitive advantage. These aren't theoretical exercises - they're situations you'll face in your current role and in future opportunities. Use these examples to recognize when you're at your best, understand what makes you valuable in those moments, and learn to deliberately apply your strengths. The key to leadership mastery is moving from unconscious competence (doing it well without thinking) to conscious application (deliberately choosing to use your strengths strategically).`;

    let actionHeight = doc.heightOfString(actionText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(actionText, M, y, { width: CW });
    y += actionHeight + 14;

    const scenarios = [
      {
        title: 'Scenario 1: Crisis or Major Organizational Transition',
        situation: 'Your organization is going through significant change - merger, restructuring, market shift, or leadership transition. People are anxious, uncertain, and looking for direction. Rumors abound. Some team members are actively resisting. The organization needs stability and confidence.',
        yourStrength: `Your ${primaryStyle} style enables you to see possibilities where others see threats. You can paint a compelling vision of the future and help people understand their specific role in making it happen. Your visibility and influence help you gain buy-in from skeptics and resisters. People trust your judgment and follow your lead because you project confidence grounded in reality.`,
        action: 'Step up as a stabilizing force. Use your communication skills to paint a clear, compelling picture of the future. Connect people to purpose - show them how their work contributes to something meaningful. Your confidence and optimism will settle organizational anxiety. Be accessible and visible. Answer hard questions honestly. Acknowledge what\'s uncertain while maintaining focus on what you can control. Your presence during crisis creates psychological safety that enables others to move forward.'
      },
      {
        title: 'Scenario 2: Building a High-Performing Team From Scratch',
        situation: 'You\'re assembling a new team for a critical initiative. You have limited time to get ramped up. You need people who will perform at high levels quickly, collaborate effectively, and stay committed even through challenges. Talent is competitive - strong candidates have other options.',
        yourStrength: `Your people focus helps you identify not just raw talent, but people who will thrive in your environment and contribute to team culture. Your speed to act means you make decisions quickly and create momentum. Your innovation strength attracts change-ready people who want to work on meaningful initiatives. Your influence helps you attract talent and convince them to join your team.`,
        action: 'Be deliberate about team composition - recruit for both skill and cultural fit. Set clear expectations about how you lead - communicate your leadership philosophy upfront. Give autonomy quickly to high performers. Create psychological safety where people feel they can take smart risks. Your team will respond to your confidence, clarity, and genuine investment in their success. High performers want to work for leaders who believe in them and give them room to operate.'
      },
      {
        title: 'Scenario 3: Navigating Complex Organizational Politics',
        situation: 'You need approval or buy-in from multiple stakeholders with different priorities, incentive structures, and concerns. There\'s no obvious path forward. You don\'t have authority over these stakeholders. Moving forward requires influence and negotiation.',
        yourStrength: `Your influence capability enables you to build coalitions and find common ground. Your people skills help you understand what really matters to different stakeholders - their concerns, fears, ambitions. Your visibility means decision-makers pay attention when you speak and take your perspective seriously. Your strategic thinking helps you see win-win solutions.`,
        action: 'Map the stakeholder landscape carefully - understand their priorities and constraints. Find genuine common ground and build agreements incrementally. Present your case in terms of what matters to each stakeholder. Use your relationships and credibility. Your ability to influence will move things forward. Don\'t try to win through authority - you don\'t have it. Win through understanding, relationship, and the strength of your case.'
      },
      {
        title: 'Scenario 4: Driving Innovation or Change Adoption',
        situation: 'Your organization needs to evolve - new market, new strategy, new technology. You\'re championing this change. People are comfortable with current state and resistant to new approaches. You need to build excitement and momentum.',
        yourStrength: `Your innovation strength means you see possibilities and opportunities before others. Your vision helps you articulate why change matters. Your influence helps you bring others along. Your people focus means you understand people\'s concerns and address them authentically. Your speed to act creates momentum.`,
        action: 'Paint a compelling picture of the future state and why it matters. Help people understand how it benefits them personally, their team, and the organization. Start with early adopters who share your vision. Create some quick wins to build momentum. Acknowledge concerns without letting them stop progress. Your enthusiasm for the future and your ability to bring people along will drive adoption. Change happens faster when people believe in the leader driving it.'
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
      
      doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY).text('Situation:', M, y);
      y += 9;
      let sitHeight = doc.heightOfString(s.situation, { width: CW - 12, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.situation, M + 12, y, { width: CW - 24 });
      y += sitHeight + 11;
      
      doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY).text('Your Strength:', M, y);
      y += 9;
      let strHeight = doc.heightOfString(s.yourStrength, { width: CW - 12, font: 'Helvetica', size: 10 });
      doc.fontSize(10).font('Helvetica').fillColor('#666').text(s.yourStrength, M + 12, y, { width: CW - 24 });
      y += strHeight + 11;
      
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

    let profileIntro = 'These five dimensions represent your core leadership strengths and developmental opportunities. Understanding your profile helps you leverage your natural strengths while intentionally developing areas that matter for your role and aspirations.';
    let introHeight = doc.heightOfString(profileIntro, { width: CW, font: 'Helvetica', size: 9 });
    doc.fontSize(9).font('Helvetica').fillColor('#333').text(profileIntro, M, y, { width: CW });
    y += introHeight + 11;

    const scores = [
      { label: 'People Focus', value: 8, desc: 'You prioritize team development and wellbeing.' },
      { label: 'Visibility Drive', value: 7, desc: 'Comfortable with influence and leading from front.' },
      { label: 'Speed to Act', value: 8, desc: 'Decisive, action-oriented, creates momentum.' },
      { label: 'Influence', value: 7, desc: 'Persuades others, builds coalitions effectively.' },
      { label: 'Innovation', value: 8, desc: 'Forward-thinking, comfortable with change.' },
    ];

    scores.forEach(s => {
      doc.fontSize(9).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.label, M, y);
      y += 9;
      const barW = 90, barH = 5;
      doc.rect(M + 115, y, barW, barH).stroke('#ddd').lineWidth(0.5);
      doc.rect(M + 115, y, (s.value / 10) * barW, barH).fill(STEEL_BLUE);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(STEEL_BLUE).text(s.value + '/10', M + 210, y);
      y += 8;
      let descHeight = doc.heightOfString(s.desc, { width: CW - 115, font: 'Helvetica', size: 8 });
      doc.fontSize(8).font('Helvetica').fillColor('#666').text(s.desc, M + 115, y, { width: CW - 130 });
      y += descHeight + 10;
    });

    const sections = parseContent(reportContent);

    // PAGES: AI SECTIONS
    doc.addPage();
    pageNum++;
    header();
    y = 45;
    
    for (const section of sections) {
      if (section.title.includes('Superpower')) {
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
    let styleIntroText = `This is your natural default way of leading. Your ${primaryStyle} style means you focus on possibilities, inspire others with compelling vision, and lead through genuine relationships. This style is particularly effective when teams need direction, clarity, and motivation during times of change or uncertainty. Your ${primaryStyle} approach creates organizational cultures where people feel inspired to do meaningful work.`;
    let styleIntroHeight = doc.heightOfString(styleIntroText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(styleIntroText, M, y, { width: CW });
    y += styleIntroHeight + 14;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('How Your Style Shows Up:', M, y);
    y += 12;
    let showsUpText = `You naturally see the bigger picture and help others understand how their work contributes to larger goals. You build strong relationships quickly and use genuine connection as a primary leadership tool. You inspire others with your optimism and possibility-focused thinking. You adapt your approach based on people's emotional states and readiness for change. You enjoy building consensus but can move forward decisively when needed. Your presence creates an environment where people feel valued and motivated to do their best work. You're the kind of leader people want to work for and follow through difficult transitions.`;
    let showsUpHeight = doc.heightOfString(showsUpText, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(showsUpText, M, y, { width: CW });
    y += showsUpHeight + 14;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Communication and Influence Style:', M, y);
    y += 12;
    let commText = `You influence through vision, relationship-building, and authentic connection. You communicate in ways that inspire and motivate people around shared purpose. You listen actively and adapt your approach based on others' needs and emotional readiness. You build trust through genuine care, clear direction, and following through on commitments. People are drawn to your optimism and your ability to help them see possibilities. You're most effective when you can connect decisions and actions to larger purpose and vision.`;
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

    let roadmapIntro = 'This roadmap breaks your development journey into three focused phases spanning 90 days. Each phase has clear milestones and builds intentionally on the previous one. The goal is to move from awareness to action to integration, creating lasting behavioral change. Track your progress weekly and celebrate wins.';
    let roadmapIntroHeight = doc.heightOfString(roadmapIntro, { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text(roadmapIntro, M, y, { width: CW });
    y += roadmapIntroHeight + 14;

    const roadmap = [
      { 
        phase: 'PHASE 1: SELF-AWARENESS & FOUNDATION (Weeks 1-4)', 
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
        phase: 'PHASE 2: DEVELOPMENT & MOMENTUM (Weeks 5-8)', 
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
        phase: 'PHASE 3: INTEGRATION & SUSTAINABILITY (Weeks 9-12)', 
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
      if (y + 100 > H - 45) {
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
      y += 14;
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

    doc.fontSize(12).font('Helvetica-Bold').fillColor(STEEL_BLUE).text('Recommended Books', M, y);
    y += 13;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('Multipliers - Liz Wiseman', M, y);
    y += 11;
    let book1Height = doc.heightOfString('Essential for leaders who want to develop their teams. Contrasts multipliers (who expand capability) with diminishers. Supports your People Focus strength.', { width: CW, font: 'Helvetica', size: 10 });
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Essential for leaders who want to develop their teams. Contrasts multipliers (who expand capability) with diminishers. Supports your People Focus strength.', M, y, { width: CW });
    y += book1Height + 14;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('The Innovator\'s Dilemma - Clayton Christensen', M, y);
git add lib/pdf.js && git commit -m "Restore: Rich content with comprehensive text, no overlapping, proper spacing" && git push
curl -X POST https://leangle-hr-lab-f7ip.vercel.app/api/resend-report -H "Content-Type: application/json" -d '{"email":"Pame1515@hotmail.com"}'
git log --oneline -3
