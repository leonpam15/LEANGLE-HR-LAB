function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function clean(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/^#+\s+/, '').trim();
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
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

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#1a1a1a}.page{page-break-after:always;min-height:11in;padding:0.5in;position:relative}header{display:flex;justify-content:space-between;border-bottom:1px solid #D0D8E0;padding-bottom:12px;margin-bottom:20px;font-size:10px}footer{border-top:1px solid #D0D8E0;padding-top:12px;margin-top:auto;font-size:9px;color:#8A9BB0;text-align:center}.logo{color:#4A7FA5;font-weight:bold}.page-num{color:#8A9BB0}.cover{background:#132030;color:white;text-align:center;padding:1in;display:flex;flex-direction:column;justify-content:center}.cover h1{font-size:56px;letter-spacing:12px;margin:40px 0;font-weight:300}.cover-line{width:180px;height:1px;background:#4A7FA5;margin:20px auto}.cover h2{font-size:13px;letter-spacing:6px;color:#4A7FA5;margin:15px 0 60px 0}.cover .subtitle{font-size:10px;color:#4A7FA5;letter-spacing:2px;margin:40px 0 20px 0}.cover .quiz-name{font-size:36px;font-weight:bold;margin:30px 0}.style-badge{display:inline-block;padding:14px 32px;border:2px solid #4A7FA5;border-radius:8px;background:#E8EFF5;color:#4A7FA5;font-weight:bold;font-size:14px;margin:30px 0}.cover .for-text{font-size:11px;color:#8A9BB0;margin:40px 0 10px 0}.cover .leader-name{font-size:32px;font-weight:bold;margin:20px 0}.cover .footer-text{font-size:11px;color:#8A9BB0;margin-top:60px}.dashboard{background:white}.profile-box{border:2px solid #4A7FA5;border-left:6px solid #4A7FA5;padding:20px;background:#F5F8FB;margin-bottom:30px}.profile-box .label{font-size:9px;font-weight:bold;color:#4A7FA5;letter-spacing:1px;margin-bottom:8px}.profile-box .style{font-size:20px;font-weight:bold;color:#132030;margin-bottom:8px}.profile-box .tagline{font-size:11px;color:#666;font-style:italic}h2{font-size:14px;font-weight:bold;color:#132030;margin:28px 0 14px 0;padding-bottom:10px;border-bottom:2px solid #4A7FA5}.score-item{display:flex;align-items:center;margin-bottom:14px;gap:12px}.score-label{width:140px;font-size:11px;color:#666}.score-bar{flex:1;height:10px;background:#D0D8E0;border-radius:2px;overflow:hidden}.score-fill{height:100%;background:#4A7FA5}.score-val{width:45px;text-align:right;font-size:10px;font-weight:bold;color:#4A7FA5}.content{background:white}p{font-size:11px;margin-bottom:12px;line-height:1.7}li{font-size:11px;margin-left:24px;margin-bottom:10px;line-height:1.7}.certificate{background:white;text-align:center;border:2px solid #132030;padding:60px 40px}.certificate h1{font-size:28px;color:#132030;margin:40px 0;letter-spacing:8px}.certificate h3{font-size:11px;color:#4A7FA5;letter-spacing:2px;margin:15px 0 60px 0}.certificate .cert-text{font-size:12px;color:#666;margin:30px 0 10px 0;border-bottom:1px solid #D0D8E0;padding-bottom:10px}.certificate .leader{font-size:28px;font-weight:bold;color:#132030;margin:20px 0}.certificate .badge{display:inline-block;padding:12px 28px;border:2px solid #4A7FA5;border-radius:8px;background:#E8EFF5;color:#4A7FA5;font-weight:bold;font-size:13px;margin:40px 0}.back{background:#132030;color:white;text-align:center;padding:1in;display:flex;flex-direction:column;justify-content:center}.back h1{font-size:48px;letter-spacing:10px;margin:50px 0 20px 0}.back-line{width:150px;height:1px;background:#4A7FA5;margin:20px auto}.back h2{font-size:12px;color:#4A7FA5;letter-spacing:4px;margin:15px 0 60px 0}.back .message{font-size:16px;margin:40px 0;font-weight:300}.back .quote{font-size:12px;color:#8A9BB0;font-style:italic;margin:30px 0;line-height:1.8}.back .assessments-title{font-size:11px;color:#4A7FA5;letter-spacing:2px;margin:40px 0 20px 0}.back .assessments{font-size:11px;color:#8A9BB0;line-height:2}.back .contact{font-size:11px;color:#8A9BB0;margin-top:50px}.back-footer{font-size:9px;color:#8A9BB0;margin-top:80px;border-top:1px solid #4A7FA5;padding-top:20px}</style></head><body><div class="page cover"><h1>LEANGLE</h1><div class="cover-line"></div><h2>HR LAB</h2><div class="subtitle">PREMIUM LEADERSHIP REPORT</div><div class="quiz-name">${escapeHtml(quizTitle)}</div><div class="cover-line" style="margin:40px auto;width:240px;"></div><div class="style-badge">${escapeHtml(primaryStyle)}</div><div class="for-text">Prepared exclusively for</div><div class="leader-name">${escapeHtml(leaderName || 'Your Name')}</div><div class="footer-text">Your Personalized Leadership Intelligence Report</div></div><div class="page dashboard"><header><div class="logo">LEANGLE HR LAB | ${escapeHtml(quizTitle.toUpperCase())}</div><div class="page-num">2</div></header><div class="profile-box"><div class="label">PRIMARY STYLE</div><div class="style">${escapeHtml(primaryStyle)}</div><div class="tagline">"The Forward Thinker"</div></div><h2>Your Leadership Profile</h2><div class="score-item"><div class="score-label">${escapeHtml(primaryStyle)}</div><div class="score-bar"><div class="score-fill" style="width:80%;"></div></div><div class="score-val">8/10</div></div><div class="score-item"><div class="score-label">Secondary Strength</div><div class="score-bar"><div class="score-fill" style="width:60%;"></div></div><div class="score-val">6/10</div></div><div class="score-item"><div class="score-label">Supporting Style</div><div class="score-bar"><div class="score-fill" style="width:40%;"></div></div><div class="score-val">4/10</div></div><h2 style="margin-top:40px;">Key Dimensions</h2><div class="score-item"><div class="score-label">People Focus</div><div class="score-bar"><div class="score-fill" style="width:90%;"></div></div><div class="score-val">9/10</div></div><div class="score-item"><div class="score-label">Visibility Drive</div><div class="score-bar"><div class="score-fill" style="width:80%;"></div></div><div class="score-val">8/10</div></div><div class="score-item"><div class="score-label">Speed to Act</div><div class="score-bar"><div class="score-fill" style="width:70%;"></div></div><div class="score-val">7/10</div></div><footer>Prepared for ${escapeHtml(leaderName || 'Leader')} | LEANGLE HR LAB | Confidential</footer></div><div class="page content"><header><div class="logo">LEANGLE HR LAB | ${escapeHtml(quizTitle.toUpperCase())}</div><div class="page-num">3</div></header>${contentHtml}<footer>Prepared for ${escapeHtml(leaderName || 'Leader')} | LEANGLE HR LAB | Confidential<
cat > ~/Downloads/leangle/lib/pdf.js << 'EOFPDFSHIFT'
function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function clean(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/^#+\s+/, '').trim();
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  const lines = reportContent.split('\n');
  let contentHtml = '';
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('##')) {
      contentHtml += \`<h2>\${escapeHtml(t.replace(/^#+\\s+/, ''))}</h2>\`;
    } else if (t.startsWith('- ')) {
      contentHtml += \`<li>\${escapeHtml(clean(t.replace(/^-\\s+/, '')))}</li>\`;
    } else if (t.length > 3) {
      contentHtml += \`<p>\${escapeHtml(clean(t))}</p>\`;
    }
  }

  const html = \
cat > ~/Downloads/leangle/lib/pdf.js << 'EOFPDFSHIFT'
function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function clean(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/^#+\s+/, '').trim();
}

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  const lines = reportContent.split('\n');
  let contentHtml = '';
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('##')) {
      contentHtml += \`<h2>\${escapeHtml(t.replace(/^#+\\s+/, ''))}</h2>\`;
    } else if (t.startsWith('- ')) {
      contentHtml += \`<li>\${escapeHtml(clean(t.replace(/^-\\s+/, '')))}</li>\`;
    } else if (t.length > 3) {
      contentHtml += \`<p>\${escapeHtml(clean(t))}</p>\`;
    }
  }

  const html = \`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#1a1a1a}.page{page-break-after:always;min-height:11in;padding:0.5in;position:relative}header{display:flex;justify-content:space-between;border-bottom:1px solid #D0D8E0;padding-bottom:12px;margin-bottom:20px;font-size:10px}footer{border-top:1px solid #D0D8E0;padding-top:12px;margin-top:auto;font-size:9px;color:#8A9BB0;text-align:center}.logo{color:#4A7FA5;font-weight:bold}.page-num{color:#8A9BB0}.cover{background:#132030;color:white;text-align:center;padding:1in;display:flex;flex-direction:column;justify-content:center}.cover h1{font-size:56px;letter-spacing:12px;margin:40px 0;font-weight:300}.cover-line{width:180px;height:1px;background:#4A7FA5;margin:20px auto}.cover h2{font-size:13px;letter-spacing:6px;color:#4A7FA5;margin:15px 0 60px 0}.cover .subtitle{font-size:10px;color:#4A7FA5;letter-spacing:2px;margin:40px 0 20px 0}.cover .quiz-name{font-size:36px;font-weight:bold;margin:30px 0}.style-badge{display:inline-block;padding:14px 32px;border:2px solid #4A7FA5;border-radius:8px;background:#E8EFF5;color:#4A7FA5;font-weight:bold;font-size:14px;margin:30px 0}.cover .for-text{font-size:11px;color:#8A9BB0;margin:40px 0 10px 0}.cover .leader-name{font-size:32px;font-weight:bold;margin:20px 0}.cover .footer-text{font-size:11px;color:#8A9BB0;margin-top:60px}.dashboard{background:white}.profile-box{border:2px solid #4A7FA5;border-left:6px solid #4A7FA5;padding:20px;background:#F5F8FB;margin-bottom:30px}.profile-box .label{font-size:9px;font-weight:bold;color:#4A7FA5;letter-spacing:1px;margin-bottom:8px}.profile-box .style{font-size:20px;font-weight:bold;color:#132030;margin-bottom:8px}.profile-box .tagline{font-size:11px;color:#666;font-style:italic}h2{font-size:14px;font-weight:bold;color:#132030;margin:28px 0 14px 0;padding-bottom:10px;border-bottom:2px solid #4A7FA5}.score-item{display:flex;align-items:center;margin-bottom:14px;gap:12px}.score-label{width:140px;font-size:11px;color:#666}.score-bar{flex:1;height:10px;background:#D0D8E0;border-radius:2px;overflow:hidden}.score-fill{height:100%;background:#4A7FA5}.score-val{width:45px;text-align:right;font-size:10px;font-weight:bold;color:#4A7FA5}.content{background:white}p{font-size:11px;margin-bottom:12px;line-height:1.7}li{font-size:11px;margin-left:24px;margin-bottom:10px;line-height:1.7}.certificate{background:white;text-align:center;border:2px solid #132030;padding:60px 40px}.certificate h1{font-size:28px;color:#132030;margin:40px 0;letter-spacing:8px}.certificate h3{font-size:11px;color:#4A7FA5;letter-spacing:2px;margin:15px 0 60px 0}.certificate .cert-text{font-size:12px;color:#666;margin:30px 0 10px 0;border-bottom:1px solid #D0D8E0;padding-bottom:10px}.certificate .leader{font-size:28px;font-weight:bold;color:#132030;margin:20px 0}.certificate .badge{display:inline-block;padding:12px 28px;border:2px solid #4A7FA5;border-radius:8px;background:#E8EFF5;color:#4A7FA5;font-weight:bold;font-size:13px;margin:40px 0}.back{background:#132030;color:white;text-align:center;padding:1in;display:flex;flex-direction:column;justify-content:center}.back h1{font-size:48px;letter-spacing:10px;margin:50px 0 20px 0}.back-line{width:150px;height:1px;background:#4A7FA5;margin:20px auto}.back h2{font-size:12px;color:#4A7FA5;letter-spacing:4px;margin:15px 0 60px 0}.back .message{font-size:16px;margin:40px 0;font-weight:300}.back .quote{font-size:12px;color:#8A9BB0;font-style:italic;margin:30px 0;line-height:1.8}.back .assessments-title{font-size:11px;color:#4A7FA5;letter-spacing:2px;margin:40px 0 20px 0}.back .assessments{font-size:11px;color:#8A9BB0;line-height:2}.back .contact{font-size:11px;color:#8A9BB0;margin-top:50px}.back-footer{font-size:9px;color:#8A9BB0;margin-top:80px;border-top:1px solid #4A7FA5;padding-top:20px}</style></head><body><div class="page cover"><h1>LEANGLE</h1><div class="cover-line"></div><h2>HR LAB</h2><div class="subtitle">PREMIUM LEADERSHIP REPORT</div><div class="quiz-name">\${escapeHtml(quizTitle)}</div><div class="cover-line" style="margin:40px auto;width:240px;"></div><div class="style-badge">\${escapeHtml(primaryStyle)}</div><div class="for-text">Prepared exclusively for</div><div class="leader-name">\${escapeHtml(leaderName || 'Your Name')}</div><div class="footer-text">Your Personalized Leadership Intelligence Report</div></div><div class="page dashboard"><header><div class="logo">LEANGLE HR LAB | \${escapeHtml(quizTitle.toUpperCase())}</div><div class="page-num">2</div></header><div class="profile-box"><div class="label">PRIMARY STYLE</div><div class="style">\${escapeHtml(primaryStyle)}</div><div class="tagline">"The Forward Thinker"</div></div><h2>Your Leadership Profile</h2><div class="score-item"><div class="score-label">\${escapeHtml(primaryStyle)}</div><div class="score-bar"><div class="score-fill" style="width:80%;"></div></div><div class="score-val">8/10</div></div><div class="score-item"><div class="score-label">Secondary Strength</div><div class="score-bar"><div class="score-fill" style="width:60%;"></div></div><div class="score-val">6/10</div></div><div class="score-item"><div class="score-label">Supporting Style</div><div class="score-bar"><div class="score-fill" style="width:40%;"></div></div><div class="score-val">4/10</div></div><h2 style="margin-top:40px;">Key Dimensions</h2><div class="score-item"><div class="score-label">People Focus</div><div class="score-bar"><div class="score-fill" style="width:90%;"></div></div><div class="score-val">9/10</div></div><div class="score-item"><div class="score-label">Visibility Drive</div><div class="score-bar"><div class="score-fill" style="width:80%;"></div></div><div class="score-val">8/10</div></div><div class="score-item"><div class="score-label">Speed to Act</div><div class="score-bar"><div class="score-fill" style="width:70%;"></div></div><div class="score-val">7/10</div></div><footer>Prepared for \${escapeHtml(leaderName || 'Leader')} | LEANGLE HR LAB | Confidential</footer></div><div class="page content"><header><div class="logo">LEANGLE HR LAB | \${escapeHtml(quizTitle.toUpperCase())}</div><div class="page-num">3</div></header>\${contentHtml}<footer>Prepared for \${escapeHtml(leaderName || 'Leader')} | LEANGLE HR LAB | Confidential</footer></div><div class="page certificate"><header style="border:none;margin:0;padding:0;"><div></div><div class="page-num">5</div></header><h1>LEANGLE</h1><div class="cover-line"></div><h2>HR LAB</h2><h2 style="border:none;font-size:14px;margin:30px 0;">CERTIFICATE OF LEADERSHIP</h2><h3 style="color:#4A7FA5;border:none;font-size:12px;">SELF-AWARENESS</h3><div class="cert-text">This is to certify that</div><div class="leader">\${escapeHtml(leaderName || 'Leader Name')}</div><div class="cert-text">has successfully completed</div><h2 style="border:none;font-size:15px;margin:20px 0;">\${escapeHtml(quizTitle)}</h2><p style="color:#8A9BB0;font-size:11px;">Leadership Assessment by LEANGLE HR LAB</p><div class="badge">\${escapeHtml(primaryStyle)}</div></div><div class="page back"><h1>LEANGLE</h1><div class="back-line"></div><h2>HR LAB</h2><div class="message">Thank you for investing in your leadership.</div><div class="back-line" style="margin:40px auto;"></div><div class="quote">"Leadership is not a destination.<br>It is a daily practice of self-awareness, courage, and care."</div><div class="back-line" style="margin:40px auto;"></div><div class="assessments-title">EXPLORE ALL 7 ASSESSMENTS</div><div class="assessments">Leadership Communication Style<br>Conflict Resolution Style<br>Feedback Style<br>Decision-Making Style<br>What Motivates You<br>Stress Response<br>Leadership Personality</div><div class="contact">support@leanglehrlab.com</div><div class="back-footer">© 2026 LEANGLE HR LAB | All rights reserved | Confidential</div></div></body></html>\`;

  const response = await fetch('https://api.pdfshift.io/v3/convert/html', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.PDFSHIFT_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: html,
      landscape: false,
      use_print_media: true,
      margin: '0.5in',
    }),
  });

  if (!response.ok) {
    throw new Error(\`PDFShift error: \${response.status} \${response.statusText}\`);
  }

  return Buffer.from(await response.arrayBuffer());
}
