import puppeteer from 'puppeteer';

function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function clean(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/^#+\s+/, '').trim();
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const lines = reportContent.split('\n');
  let contentHtml = '';
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('##')) {
      contentHtml += `<h2>${escapeHtml(t.replace(/^#+\s+/, ''))}</h2>`;
    } else if (t.startsWith('- ')) {
      contentHtml += `<li>${escapeHtml(clean(t.replace(/^-\s+/, '')))}</li>`;
    } else if (t.length > 3) {
      contentHtml += `<p>${escapeHtml(clean(t))}</p>`;
    }
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica', sans-serif; line-height: 1.6; color: #1a1a1a; }
    
    .page { page-break-after: always; padding: 0.5in; min-height: 11in; display: flex; flex-direction: column; }
    .page:last-child { page-break-after: avoid; }
    
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #D0D8E0; padding-bottom: 10px; margin-bottom: 20px; font-size: 11px; }
    footer { border-top: 1px solid #D0D8E0; padding-top: 10px; margin-top: auto; font-size: 10px; color: #8A9BB0; text-align: center; }
    
    .logo { color: #4A7FA5; font-weight: bold; }
    .page-number { color: #8A9BB0; }
    
    /* Cover Page */
    .cover { background: #132030; color: #ffffff; text-align: center; justify-content: center; }
    .cover-inner { text-align: center; }
    .cover h1 { font-size: 48px; letter-spacing: 8px; margin: 40px 0; }
    .cover-divider { width: 200px; height: 1px; background: #4A7FA5; margin: 20px auto; }
    .cover h3 { font-size: 14px; letter-spacing: 4px; color: #4A7FA5; margin: 10px 0 40px 0; }
    .cover .quiz-title { font-size: 32px; margin: 40px 0; font-weight: bold; }
    .style-badge { display: inline-block; padding: 12px 24px; border: 2px solid #4A7FA5; border-radius: 12px; background: #E8EFF5; color: #4A7FA5; font-weight: bold; margin: 20px 0; }
    .cover p { font-size: 12px; color: #8A9BB0; margin: 30px 0; }
    .cover .leader-name { font-size: 28px; font-weight: bold; margin: 20px 0; }
    .cover-footer { font-size: 12px; color: #ffffff; margin-top: auto; }
    
    /* Dashboard Page */
    .dashboard { background: #ffffff; }
    .profile-card { border: 1.5px solid #4A7FA5; border-left: 6px solid #4A7FA5; padding: 20px; background: #F5F8FB; margin-bottom: 30px; }
    .profile-card h3 { color: #4A7FA5; font-size: 10px; font-weight: bold; margin-bottom: 8px; }
    .profile-card .style-name { font-size: 18px; font-weight: bold; color: #132030; margin-bottom: 8px; }
    .profile-card .tagline { font-size: 11px; color: #666666; font-style: italic; }
    
    .dimensions { margin-top: 30px; }
    .dimension-item { display: flex; align-items: center; margin-bottom: 16px; gap: 10px; }
    .dimension-label { width: 140px; font-size: 11px; color: #666666; }
    .dimension-bar { flex: 1; height: 10px; background: #D0D8E0; border-radius: 2px; overflow: hidden; }
    .dimension-fill { height: 100%; background: #4A7FA5; }
    .dimension-score { width: 50px; text-align: right; font-size: 11px; font-weight: bold; color: #4A7FA5; }
    
    /* Content Pages */
    .content { background: #ffffff; }
    h2 { font-size: 14px; font-weight: bold; color: #132030; margin: 24px 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #4A7FA5; }
    p { font-size: 11px; margin-bottom: 12px; line-height: 1.6; }
    li { font-size: 11px; margin-left: 20px; margin-bottom: 8px; line-height: 1.6; }
    
    /* Certificate */
    .certificate { background: #ffffff; border: 2px solid #132030; border-radius: 4px; padding: 40px; text-align: center; justify-content: center; }
    .cert-corner { position: absolute; width: 12px; height: 12px; background: #4A7FA5; border-radius: 50%; }
    .certificate h1 { font-size: 24px; color: #132030; margin: 40px 0; }
    .certificate h2 { border: none; font-size: 12px; color: #4A7FA5; margin: 20px 0; letter-spacing: 2px; }
    .certificate .leader { font-size: 32px; color: #132030; font-weight: bold; margin: 20px 0; }
    .certificate-badge { display: inline-block; padding: 12px 24px; border: 1.5px solid #4A7FA5; border-radius: 12px; background: #E8EFF5; color: #4A7FA5; font-weight: bold; font-size: 12px; margin: 30px 0; }
    .certificate footer { border: none; }
    
    /* Back Cover */
    .back-cover { background: #132030; color: #ffffff; text-align: center; justify-content: center; }
    .back-cover h1 { font-size: 32px; letter-spacing: 8px; margin: 40px 0; }
    .back-cover-divider { width: 160px; height: 1px; background: #4A7FA5; margin: 20px auto; }
    .back-cover h3 { font-size: 11px; color: #4A7FA5; margin: 10px 0 40px 0; letter-spacing: 4px; }
    .back-message { font-size: 14px; margin: 30px 0; }
    .back-quote { font-size: 12px; color: #8A9BB0; font-style: italic; margin: 20px 0; line-height: 1.8; }
    .back-assessments { font-size: 12px; margin: 30px 0; }
    .back-assessments-list { font-size: 11px; color: #8A9BB0; line-height: 2; }
    .back-email { font-size: 11px; color: #8A9BB0; margin-top: 40px; }
  </style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover">
  <div class="cover-inner">
    <h1>L E A N G L E</h1>
    <div class="cover-divider"></div>
    <h3>H R   L A B</h3>
    
    <div style="margin-top: 60px;">
      <p style="font-size: 10px; color: #4A7FA5; letter-spacing: 2px;">PREMIUM LEADERSHIP REPORT</p>
      <div class="quiz-title">${escapeHtml(quizTitle)}</div>
      <div class="cover-divider" style="margin: 30px auto; width: 240px;"></div>
      
      <div class="style-badge">${escapeHtml(primaryStyle)}</div>
      
      <p style="margin-top: 40px; font-size: 12px;">Prepared exclusively for</p>
      <div class="leader-name">${escapeHtml(leaderName || 'Your Name')}</div>
    </div>
    
    <div class="cover-footer">Your Personalized Leadership Intelligence Report</div>
  </div>
</div>

<!-- PAGE 2: DASHBOARD -->
<div class="page dashboard">
  <header>
    <div class="logo">LEANGLE HR LAB | ${escapeHtml(quizTitle.toUpperCase())}</div>
    <div class="page-number">2</div>
  </header>
  
  <div class="profile-card">
    <h3>PRIMARY STYLE</h3>
    <div class="style-name">${escapeHtml(primaryStyle)}</div>
    <div class="tagline">"The Forward Thinker"</div>
  </div>
  
  <h2 style="border-bottom: 2px solid #4A7FA5; padding-bottom: 8px;">Your Leadership Profile</h2>
  
  <div class="dimensions">
    <div class="dimension-item">
      <div class="dimension-label">${escapeHtml(primaryStyle)}</div>
      <div class="dimension-bar"><div class="dimension-fill" style="width: 80%;"></div></div>
      <div class="dimension-score">8/10</div>
    </div>
    <div class="dimension-item">
      <div class="dimension-label">Secondary Strength</div>
      <div class="dimension-bar"><div class="dimension-fill" style="width: 60%;"></div></div>
      <div class="dimension-score">6/10</div>
    </div>
    <div class="dimension-item">
      <div class="dimension-label">Supporting Style</div>
      <div class="dimension-bar"><div class="dimension-fill" style="width: 40%;"></div></div>
      <div class="dimension-score">4/10</div>
    </div>
  </div>
  
  <footer>Prepared for ${escapeHtml(leaderName || 'Leader')} | LEANGLE HR LAB | Confidential</footer>
</div>

<!-- PAGES 3+: REPORT CONTENT -->
<div class="page content">
  <header>
    <div class="logo">LEANGLE HR LAB | ${escapeHtml(quizTitle.toUpperCase())}</div>
    <div class="page-number">3</div>
  </header>
  
  ${contentHtml}
  
  <footer>Prepared for ${escapeHtml(leaderName || 'Leader')} | LEANGLE HR LAB | Confidential</footer>
</div>

<!-- CERTIFICATE -->
<div class="page certificate">
  <h1>L E A N G L E</h1>
  <div class="cover-divider"></div>
  <h3>H R   L A B</h3>
  
  <h2>CERTIFICATE OF LEADERSHIP</h2>
  <h2 style="font-size: 11px;">SELF-AWARENESS</h2>
  
  <p style="margin-top: 40px; border-bottom: 1px solid #D0D8E0; padding-bottom: 10px;">This is to certify that</p>
  <div class="leader">${escapeHtml(leaderName || 'Leader Name')}</div>
  <p style="border-bottom: 1px solid #D0D8E0; padding-bottom: 10px;">has successfully completed</p>
  
  <h2 style="font-size: 14px; border: none; margin-top: 20px;">${escapeHtml(quizTitle)}</h2>
  <p style="font-size: 11px; color: #8A9BB0;">Leadership Assessment by LEANGLE HR LAB</p>
  
  <div class="certificate-badge">${escapeHtml(primaryStyle)}</div>
  
  <footer style="border: none; margin-top: 40px; font-size: 10px; color: #1a1a1a;">Confidential — prepared exclusively for the named individual</footer>
</div>

<!-- BACK COVER -->
<div class="page back-cover">
  <h1>L E A N G L E</h1>
  <div class="back-cover-divider"></div>
  <h3>H R   L A B</h3>
  
  <div class="back-message">Thank you for investing in your leadership.</div>
  
  <div class="back-cover-divider" style="margin: 30px auto;"></div>
  
  <div class="back-quote">"Leadership is not a destination.<br>It is a daily practice of self-awareness, courage, and care."</div>
  
  <div class="back-cover-divider" style="margin: 30px auto;"></div>
  
  <div class="back-assessments">
    <h3 style="color: #4A7FA5; border: none; margin-bottom: 20px;">EXPLORE ALL 7 ASSESSMENTS</h3>
    <div class="back-assessments-list">
      Leadership Communication Style<br>
      Conflict Resolution Style<br>
      Feedback Style<br>
      Decision-Making Style<br>
      What Motivates You<br>
      Stress Response<br>
      Leadership Personality
    </div>
  </div>
  
  <div class="back-email">support@leanglehrlab.com</div>
  
  <footer style="border: none; font-size: 9px; color: #8A9BB0; margin-top: 40px;">© 2026 LEANGLE HR LAB | All rights reserved | Confidential</footer>
</div>

</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'Letter', margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' } });

  await browser.close();
  return pdfBuffer;
}
