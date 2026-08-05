// lib/pdf.js - Clean, reliable PDF generation for LEANGLE HR LAB
import PDFDocument from 'pdfkit';

const C = {
  navy:'#1A2535', steel:'#3A6E9A', steelL:'#D4E6F5',
  white:'#FFFFFF', black:'#1A1A1A', dark:'#2D3748',
  mid:'#4A5568', muted:'#718096', lightG:'#F0F4F8',
  border:'#CBD5E0', gold:'#8B6914', green:'#276749',
  purple:'#553C9A', orange:'#9C4221', red:'#9B2C2C',
};

const BOOKS = {
  Recognition:[['The Courage to Be Disliked','Ichiro Kishimi','Essential for Recognition leaders who want to lead from conviction, not validation.'],['Multipliers','Liz Wiseman','Perfectly aligned with your instinct to make people feel genuinely seen.'],['Dare to Lead','Brené Brown','Deepens your self-awareness around why recognition matters to you.']],
  Autonomy:[['Drive','Daniel Pink','The science of motivation — autonomy, mastery, purpose.'],['Essentialism','Greg McKeown','About doing less but better on your own terms.'],['The E-Myth Revisited','Michael Gerber','For leaders who want to build something independently.']],
  Mastery:[['Deep Work','Cal Newport','The definitive guide to achieving excellence through focused effort.'],['Mindset','Carol Dweck','Reframes excellence-seeking from fixed achievement to continuous growth.'],['So Good They Cannot Ignore You','Cal Newport','Makes the case for career capital through craft.']],
  Purpose:[["Man's Search for Meaning",'Viktor Frankl','The most profound exploration of purpose ever written.'],['Start With Why','Simon Sinek','The business case for purpose-driven leadership.'],['The Second Mountain','David Brooks','On moving from achievement to contribution.']],
  Collaborative:[['The Culture Code','Daniel Coyle','The definitive guide to building belonging in teams.'],['Multipliers','Liz Wiseman','Shows how the best leaders amplify intelligence.'],['Turn the Ship Around','L. David Marquet','A masterclass in distributed leadership.']],
  Directive:[['Extreme Ownership','Jocko Willink','The philosophy of total accountability.'],['High Output Management','Andy Grove','The bible of results-driven leadership.'],['The Hard Thing About Hard Things','Ben Horowitz','Honest direct leadership under pressure.']],
  Empathetic:[['Dare to Lead','Brené Brown','Reframes vulnerability and care as leadership superpowers.'],['Radical Candor','Kim Scott','Shows how to combine genuine care with direct challenge.'],['The Empathy Edge','Maria Ross','Makes the business case for leading with care.']],
  Analytical:[['Thinking, Fast and Slow','Daniel Kahneman','The foundational text on how decisions are really made.'],['The Signal and the Noise','Nate Silver','A masterclass in what data tells us.'],['Superforecasting','Philip Tetlock','How the best analytical minds make predictions.']],
};

function getBooks(style) { return BOOKS[style] || BOOKS['Recognition']; }
function clean(text) { return (text||'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim(); }

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName='') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size:'LETTER', margin:62, bufferPages:false });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width;
    const H = doc.page.height;
    const M = 62;
    const CW = W - M*2;
    const books = getBooks(primaryStyle);
    const firstName = leaderName ? leaderName.split(' ')[0] : 'You';

    // Track Y position
    let y = 0;
    let pageCount = 0;

    const startPage = (addNew=true) => {
      if (addNew) doc.addPage();
      pageCount++;
      // White background
      doc.rect(0,0,W,H).fill(C.white);
      // Header
      doc.rect(0,0,W,4).fill(C.steel);
      doc.rect(0,4,W,40).fill(C.navy);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(C.steel).text('LEANGLE HR LAB', M, 16, {lineBreak:false});
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('  ·  '+quizTitle.toUpperCase(), {continued:false});
      doc.fontSize(8).font('Helvetica').fillColor('#8A9BB0').text(`Page ${pageCount}`, W-M-30, 22, {width:30,align:'right'});
      doc.moveTo(M,46).lineTo(W-M,46).strokeColor(C.border).lineWidth(0.5).stroke();
      // Footer
      doc.moveTo(M,H-26).lineTo(W-M,H-26).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(7).font('Helvetica').fillColor(C.muted)
        .text(leaderName?`Prepared for ${leaderName}  ·  LEANGLE HR LAB  ·  Confidential`:'LEANGLE HR LAB  ·  Confidential', M, H-18, {width:CW,align:'center'});
      return 58;
    };

    const ensureSpace = (needed) => {
      if (y + needed > H - 36) {
        y = startPage();
      }
    };

    const heading = (title, subtitle) => {
      ensureSpace(55);
      y += 8;
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(title.toUpperCase(), M, y, {width:CW});
      y += 18;
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.steel).lineWidth(3).stroke();
      y += 7;
      if (subtitle) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.muted).text(subtitle, M, y, {width:CW});
        y += 16;
      }
      y += 4;
    };

    const para = (text) => {
      const t = clean(text);
      if (!t) return;
      const h = doc.heightOfString(t, {width:CW, lineGap:3});
      ensureSpace(h+10);
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(t, M, y, {width:CW, lineGap:3});
      y += h + 10;
    };

    const bullet = (text) => {
      const t = clean(text);
      if (!t) return;
      const h = doc.heightOfString(t, {width:CW-18, lineGap:2});
      ensureSpace(h+10);
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.steel).text('›', M, y, {width:16, lineBreak:false});
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(t, M+18, y, {width:CW-18, lineGap:2});
      y += h + 8;
    };

    const quote = (text) => {
      const t = `"${clean(text).replace(/^["']|["']$/g,'')}"`;
      const h = doc.heightOfString(t, {width:CW-36}) + 36;
      ensureSpace(h+10);
      doc.rect(M,y,CW,h).fill(C.lightG);
      doc.rect(M,y,5,h).fill(C.steel);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+h).lineTo(W-M,y+h).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(13).font('Helvetica-Oblique').fillColor(C.navy).text(t, M+16, y+15, {width:CW-34});
      y += h + 10;
    };

    const weekBox = (title, action, why) => {
      const tH = doc.heightOfString(clean(title),{width:CW-24})+4;
      const aH = action ? doc.heightOfString(clean(action),{width:CW-40})+8 : 0;
      const wH = why ? doc.heightOfString(clean(why),{width:CW-40})+8 : 0;
      const bH = tH+aH+wH+26;
      ensureSpace(bH+10);
      doc.rect(M,y,CW,bH).fill(C.lightG);
      doc.rect(M,y,4,bH).fill(C.steel);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(C.navy).text(clean(title), M+12, y+11, {width:CW-24});
      let ty = y+tH+13;
      if (action) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel).text('Action: ', M+12, ty, {continued:true, lineBreak:false});
        doc.font('Helvetica').fillColor(C.dark).text(clean(action), {width:CW-38});
        ty += aH;
      }
      if (why) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid).text(clean(why), M+12, ty, {width:CW-24});
      }
      y += bH + 10;
    };

    const infoBox = (label, body, color) => {
      const t = clean(body);
      const bH = Math.max(doc.heightOfString(t,{width:CW*0.74-18, lineGap:2})+22, 46);
      ensureSpace(bH+8);
      doc.rect(M,y,CW*0.24,bH).fill(C.lightG);
      doc.rect(M,y,4,bH).fill(color||C.steel);
      doc.rect(M+CW*0.24,y,CW*0.76,bH).fill(C.white);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(10).font('Helvetica-Bold').fillColor(color||C.steel).text(label, M+8, y+11, {width:CW*0.24-14});
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(t, M+CW*0.24+12, y+9, {width:CW*0.76-18, lineGap:2});
      y += bH + 8;
    };

    const barRow = (label, score, color, bold) => {
      ensureSpace(22);
      const maxW = CW-130;
      doc.fontSize(bold?11:10).font(bold?'Helvetica-Bold':'Helvetica').fillColor(bold?C.navy:C.mid)
        .text((bold?'● ':'')+label, M, y, {width:118, lineBreak:false});
      doc.rect(M+122,y+1,maxW,12).fill(C.border);
      if(score>0) doc.rect(M+122,y+1,maxW*(score/10),12).fill(color);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(color).text(`${score}/10`, M+122+maxW+8, y);
      y += 22;
    };

    const brandBox = (text) => {
      const h = doc.heightOfString(text,{width:CW-44,lineGap:4})+40;
      ensureSpace(h+10);
      doc.rect(M,y,CW,h).fill(C.steelL);
      doc.rect(M,y,CW,h).strokeColor(C.steel).lineWidth(2).stroke();
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(text, M+22, y+18, {width:CW-44, align:'center', lineGap:4});
      y += h+10;
    };

    const roadmapBox = (title, color, body) => {
      const bH = Math.max(doc.heightOfString(body,{width:CW*0.72-18,lineGap:2})+24, 48);
      ensureSpace(bH+8);
      doc.rect(M,y,CW*0.26,bH).fill(C.lightG);
      doc.rect(M,y,5,bH).fill(color);
      doc.rect(M+CW*0.26,y,CW*0.74,bH).fill(C.white);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(color).text(title, M+8, y+11, {width:CW*0.26-14});
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(body, M+CW*0.26+12, y+9, {width:CW*0.74-18, lineGap:2});
      y += bH+8;
    };

    const bookBox = (title, author, reason, color) => {
      const bH = Math.max(doc.heightOfString(reason,{width:CW*0.64-18,lineGap:2})+28, 60);
      ensureSpace(bH+8);
      doc.rect(M,y,CW*0.34,bH).fill(C.lightG);
      doc.rect(M,y,5,bH).fill(color);
      doc.rect(M+CW*0.34,y,CW*0.66,bH).fill(C.white);
      doc.moveTo(M,y).lineTo(W-M,y).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.moveTo(M,y+bH).lineTo(W-M,y+bH).strokeColor(C.border).lineWidth(0.5).stroke();
      doc.fontSize(11).font('Helvetica-Bold').fillColor(C.navy).text(title, M+10, y+10, {width:CW*0.34-16});
      const titleH = doc.heightOfString(title,{width:CW*0.34-16});
      doc.fontSize(9).font('Helvetica-Oblique').fillColor(C.mid).text(author, M+10, y+10+titleH+3, {width:CW*0.34-16});
      doc.fontSize(11).font('Helvetica').fillColor(C.black).text(reason, M+CW*0.34+12, y+10, {width:CW*0.66-18, lineGap:2});
      y += bH+8;
    };

    // ── PAGE 1: COVER ─────────────────────────────────────────────────────────
    doc.rect(0,0,W,H).fill(C.white);
    doc.rect(0,H-112,W,112).fill(C.navy);
    doc.rect(0,H-116,W,4).fill(C.steel);
    doc.rect(0,0,W,66).fill(C.navy);
    doc.rect(0,66,W,4).fill(C.steel);
    doc.fontSize(28).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H-68, {align:'center',width:CW});
    const hY=H-90;
    doc.moveTo(W/2-76,hY).lineTo(W/2-24,hY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.moveTo(W/2+24,hY).lineTo(W/2+76,hY).strokeColor(C.steel).lineWidth(1.2).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', W/2-24, hY-8, {width:48,align:'center'});
    const ct=H-118, cb=68, ch=ct-cb;
    const cp = f => cb+ch*(1-f);
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('P R E M I U M   L E A D E R S H I P   R E P O R T', M, cp(0.06), {align:'center',width:CW});
    doc.fontSize(24).font('Helvetica-Bold').fillColor(C.navy).text(quizTitle, M, cp(0.15), {align:'center',width:CW});
    doc.moveTo(M+36,cp(0.23)).lineTo(W-M-36,cp(0.23)).strokeColor(C.steel).lineWidth(0.8).stroke();
    const pW=138,pH=32,pX=(W-pW)/2,pY=cp(0.31)-pH;
    doc.roundedRect(pX,pY,pW,pH,16).fill(C.steelL);
    doc.roundedRect(pX,pY,pW,pH,16).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel).text(primaryStyle, pX, pY+8, {align:'center',width:pW});
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('Prepared exclusively for', M, cp(0.42), {align:'center',width:CW});
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.navy).text(leaderName||'Your Name', M, cp(0.51), {align:'center',width:CW});
    doc.moveTo(M+36,cp(0.59)).lineTo(W-M-36,cp(0.59)).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.fontSize(10).font('Helvetica-Bold').fillColor(C.navy).text("WHAT'S INSIDE THIS REPORT", M, cp(0.65), {align:'center',width:CW});
    const iL=['✓  Leadership DNA Analysis','✓  3 Signature Superpowers','✓  Growth Edge & Derailers','✓  30-Day Action Plan','✓  Stress & Pressure Profile'];
    const iR=['✓  How Others Experience You','✓  Team Compatibility Guide','✓  90-Day Growth Roadmap','✓  Your Leadership Brand','✓  Certificate of Completion'];
    const cw2=146, x1=W/2-cw2-8, x2=W/2+8, yS=cp(0.71), rG=(cp(0.71)-cp(0.94))/5;
    doc.fontSize(10).font('Helvetica').fillColor(C.dark);
    for(let j=0;j<5;j++){ doc.text(iL[j],x1,yS-j*rG,{width:cw2}); doc.text(iR[j],x2,yS-j*rG,{width:cw2}); }
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.white).text('Your Personalised Leadership Intelligence Report', M, 42, {align:'center',width:CW});

    // ── PAGE 2: DASHBOARD ─────────────────────────────────────────────────────
    y = startPage();

    // Profile card
    const cH2 = 66;
    doc.rect(M,y,CW,cH2).fill(C.lightG);
    doc.rect(M,y,6,cH2).fill(C.gold);
    doc.rect(M,y,CW,cH2).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY STYLE', M+14, y+10);
    doc.fontSize(18).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, M+14, y+22);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.mid).text('"The Impact Seeker"', M+14, y+44);
    if(leaderName){
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('PREPARED FOR', W-M-172, y+10, {width:172,align:'right'});
      doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(leaderName, W-M-172, y+22, {width:172,align:'right'});
      doc.fontSize(10).font('Helvetica').fillColor(C.mid).text(quizTitle, W-M-172, y+44, {width:172,align:'right'});
    }
    y += cH2+16;

    heading('Your Style Profile', 'Motivation style scores and key leadership dimensions');
    barRow(primaryStyle, 8, C.gold, true);
    barRow('Secondary Drivers', 5, C.steel, false);
    barRow('Supporting Styles', 3, C.mid, false);
    y += 10;
    heading('Key Leadership Dimensions');
    for(const [d,s] of [['People Focus',9],['Visibility Drive',8],['Speed to Act',7],['Data & Analysis',5],['Collaborative Pull',8]]) barRow(d,s,C.steel,false);

    // ── PAGES 3+: REPORT CONTENT ──────────────────────────────────────────────
    y = startPage();

    const lines = reportContent.split('\n');
    let i2 = 0, prevH = '';
    while(i2 < lines.length){
      const raw = lines[i2].trim(); i2++;
      if(!raw || raw.match(/^[-=]{2,}$/)) continue;
      if(raw.startsWith('##') || raw.startsWith('###')){
        prevH = raw.replace(/^#+\s+/,'').toLowerCase();
        heading(raw.replace(/^#+\s+/,''));
        continue;
      }
      if(raw.match(/^Week\s+\d+:/i)){
        let action='', why='';
        while(i2<lines.length){
          const n=lines[i2].trim();
          if(!n){i2++;continue;}
          if(n.match(/^Action:/i)){action=n.replace(/^Action:\s*/i,'');i2++;}
          else if(n.match(/^Why it matters:/i)){why=n.replace(/^Why it matters:\s*/i,'');i2++;}
          else if(n.startsWith('##')||n.match(/^Week\s+\d+:/i)) break;
          else i2++;
        }
        weekBox(raw, action, why);
        continue;
      }
      if(raw.match(/^Superpower\s+\d+:/i)){
        ensureSpace(26);
        doc.fontSize(12).font('Helvetica-Bold').fillColor(C.navy).text(clean(raw), M, y, {width:CW});
        y += 20;
        continue;
      }
      if(raw.startsWith('- ')||raw.startsWith('• ')){ bullet(raw.replace(/^[-•]\s*/,'')); continue; }
      const special = prevH.includes('mantra')||prevH.includes('question');
      if(special && raw.length>10 && !raw.startsWith('#')){ quote(raw); continue; }
      para(raw);
    }

    // ── LEADERSHIP BRAND ──────────────────────────────────────────────────────
    heading('Your Leadership Brand Statement', 'Use this in interviews, bios, and LinkedIn');
    para(`A Leadership Brand Statement captures who you are as a leader in a single memorable paragraph, based on your ${primaryStyle} profile:`);
    brandBox(`${leaderName||'This leader'} is a ${primaryStyle} leader who creates high-performing cultures by making people feel genuinely seen and valued. Known for transforming disengaged teams, delivering results with energy and precision, and building environments where talent wants to stay, ${firstName} leads from the belief that recognition is not a reward — it is a strategy.`);

    // ── STRESS PROFILE ────────────────────────────────────────────────────────
    heading('Your Stress & Pressure Profile', 'How your style shifts under different pressure levels');
    infoBox('Mild Pressure', `You perform exceptionally well. The stakes activate your best qualities — energy, focus, and the ability to rally others as a ${primaryStyle} leader.`, C.steel);
    infoBox('Sustained Pressure', 'You may begin making decisions optimised for how they look rather than what is right. Watch for the gap between public confidence and private uncertainty.', C.purple);
    infoBox('Severe Burnout', 'Motivation can disappear rapidly when your core driver is absent. Recovery requires reconnecting to intrinsic purpose — why this work matters beyond the external reward.', C.orange);
    infoBox('Derailer to Watch', 'Approval-seeking under stress. Seeking validation before acting, over-communicating wins to manage perception, or avoiding difficult conversations.', C.red);
    y += 8;
    heading('How Others Experience You', 'The gap between how you see yourself and how you are perceived');
    para(`Most assessments only show you how you see yourself. This section reveals how you are likely experienced by the three most important groups around you.`);
    infoBox('Your Direct Reports', 'They experience you as energising, visible, and genuinely interested in their success. They feel seen when you are at your best. When you are stressed, they may wonder what they did wrong.', C.steel);
    infoBox('Your Peers', 'They experience you as magnetic and competitive in equal measure. You raise the energy in any room. They will respect you more when you actively share credit.', C.green);
    infoBox('Your Manager / Stakeholders', 'They experience you as a high-visibility performer who delivers with flair. Their watch-out: they may question your performance on unglamorous long-term work.', C.purple);

    // ── TEAM COMPATIBILITY ────────────────────────────────────────────────────
    heading('Your Team Compatibility Guide', 'How to work most effectively with each motivation style');
    infoBox('With Autonomy Leaders', 'Give them ownership and celebrate their outcomes. They outperform when trusted without interference. Give them space then celebrate the result.', C.steel);
    infoBox('With Mastery Leaders', 'Name their craft specifically — not just what they delivered but how exceptionally well they did it. Slow down to acknowledge depth not just speed.', C.purple);
    infoBox('With Purpose Leaders', 'Connect their work visibly to the mission. Natural allies — you bring energy; they bring meaning. Together you create cultures people want to join.', C.green);
    infoBox('With Recognition Leaders', 'High energy and high performance — and high competition. Actively share the spotlight. The partnership is exceptional when ego is managed well.', C.gold);
    y += 8;
    heading('Your 90-Day Leadership Growth Roadmap', 'Sustained development across three months of intentional practice');
    roadmapBox('Days 1–30: Install the Habits', C.steel, 'Establish your recognition ritual. Map invisible contributors. Complete your first invisible-decision audit. By day 30 you should have a structural recognition system running.');
    roadmapBox('Days 31–60: Deepen and Expand', C.purple, 'Expand recognition to people you have never publicly acknowledged. Begin your long-game milestone map. Notice where your energy drops — that is where your growth edge lives.');
    roadmapBox('Days 61–90: Test Under Real Pressure', C.green, 'The real test of leadership development is what you do when the stakes are high. Identify one high-stakes moment and consciously apply your growth edge.');

    // ── BOOKS ─────────────────────────────────────────────────────────────────
    heading(`Recommended Reading for ${primaryStyle} Leaders`, 'Curated specifically for your style — not a generic list');
    const bColors = [C.gold, C.steel, C.green];
    books.slice(0,3).forEach(([t,a,r],idx) => bookBox(t,a,r,bColors[idx]));

    // ── CERTIFICATE ───────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0,0,W,H).fill(C.white);
    doc.rect(11,11,W-22,H-22).strokeColor(C.navy).lineWidth(2).stroke();
    doc.rect(17,17,W-34,H-34).strokeColor(C.steel).lineWidth(1).stroke();
    [[20,H-20],[W-20,H-20],[20,20],[W-20,20]].forEach(([cx,cy])=>{ doc.circle(cx,cy,6).fill(C.steel); doc.circle(cx,cy,2.5).fill(C.white); });
    doc.rect(11,H-84,W-22,73).fill(C.navy);
    doc.fontSize(22).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H-56, {align:'center',width:CW});
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', M, H-36, {align:'center',width:CW});
    const cm = H/2;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(C.steel).text('C E R T I F I C A T E   O F   L E A D E R S H I P', M, cm-110, {align:'center',width:CW});
    doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel).text('S E L F - A W A R E N E S S', M, cm-90, {align:'center',width:CW});
    doc.moveTo(M+36,cm-72).lineTo(W-M-36,cm-72).strokeColor(C.gold).lineWidth(1.5).stroke();
    doc.fontSize(12).font('Helvetica').fillColor(C.muted).text('This is to certify that', M, cm-52, {align:'center',width:CW});
    doc.fontSize(30).font('Helvetica-Bold').fillColor(C.navy).text(leaderName||'Leader Name', M, cm-18, {align:'center',width:CW});
    doc.moveTo(W/2-88,cm+18).lineTo(W/2+88,cm+18).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(11).font('Helvetica').fillColor(C.muted).text('has successfully completed the', M, cm+26, {align:'center',width:CW});
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.steel).text(quizTitle, M, cm+46, {align:'center',width:CW});
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('Leadership Assessment by LEANGLE HR LAB', M, cm+66, {align:'center',width:CW});
    const bpW=166,bpH=36,bpX=(W-bpW)/2,bpY=cm+90;
    doc.roundedRect(bpX,bpY,bpW,bpH,18).fill(C.steelL);
    doc.roundedRect(bpX,bpY,bpW,bpH,18).strokeColor(C.steel).lineWidth(1.5).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('PRIMARY LEADERSHIP STYLE', bpX, bpY+6, {align:'center',width:bpW});
    doc.fontSize(13).font('Helvetica-Bold').fillColor(C.navy).text(primaryStyle, bpX, bpY+19, {align:'center',width:bpW});
    const sY=cm+146;
    doc.moveTo(M+26,sY).lineTo(M+154,sY).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.moveTo(W-M-154,sY).lineTo(W-M-26,sY).strokeColor(C.border).lineWidth(0.8).stroke();
    doc.fontSize(9).font('Helvetica').fillColor(C.muted).text('LEANGLE HR LAB', M+26, sY+6, {width:128,align:'center'});
    doc.text('Date of Completion', W-M-154, sY+6, {width:128,align:'center'});
    doc.rect(11,11,W-22,46).fill(C.navy);
    doc.fontSize(9).font('Helvetica').fillColor(C.white).text('Confidential — prepared exclusively for the named individual.', M, 28, {align:'center',width:CW});

    // ── BACK COVER ────────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0,0,W,H).fill(C.white);
    doc.rect(0,H-102,W,102).fill(C.navy);
    doc.rect(0,H-106,W,4).fill(C.steel);
    doc.fontSize(26).font('Helvetica').fillColor(C.white).text('L E A N G L E', M, H-62, {align:'center',width:CW});
    const bhY=H-80;
    doc.moveTo(W/2-68,bhY).lineTo(W/2-22,bhY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.moveTo(W/2+22,bhY).lineTo(W/2+68,bhY).strokeColor(C.steel).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.steel).text('H R   L A B', W/2-22, bhY-8, {width:44,align:'center'});
    const bm = (H-106)/2;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(C.navy).text('Thank you for investing in your leadership.', M, bm-88, {align:'center',width:CW});
    doc.moveTo(M+40,bm-66).lineTo(W-M-40,bm-66).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(12).font('Helvetica-Oblique').fillColor(C.mid).text('"Leadership is not a destination.\nIt is a daily practice of self-awareness, courage, and care."', M, bm-50, {align:'center',width:CW,lineGap:4});
    doc.moveTo(M+40,bm+12).lineTo(W-M-40,bm+12).strokeColor(C.border).lineWidth(1).stroke();
    doc.fontSize(10).font('Helvetica-Bold').fillColor(C.steel).text('EXPLORE ALL 7 ASSESSMENTS', M, bm+28, {align:'center',width:CW});
    ['💬  Leadership Communication Style','⚡  Conflict Resolution Style','🎙️  Feedback Style','⚖️  Decision-Making Style','🔋  What Motivates You at Work','🌡️  Workplace Stress Response','🧠  Leadership Personality Type']
      .forEach((item,j)=>{ doc.fontSize(10).font('Helvetica').fillColor(C.dark).text(item, M, bm+46+j*20, {align:'center',width:CW}); });
    doc.moveTo(M+60,bm+192).lineTo(W-M-60,bm+192).strokeColor(C.border).lineWidth(0.5).stroke();
    doc.fontSize(10).font('Helvetica').fillColor(C.muted).text('support@leanglehrlab.com', M, bm+206, {align:'center',width:CW});
    doc.rect(0,0,W,40).fill(C.navy);
    doc.fontSize(8).font('Helvetica').fillColor(C.white).text('© 2025 LEANGLE HR LAB  ·  All rights reserved  ·  Confidential', M, 14, {align:'center',width:CW});

    doc.end();
  });
}
