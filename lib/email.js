// lib/email.js
// Sends branded report emails via Resend.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(toEmail, quizTitle, primaryStyle, reportContent) {
  const html = buildEmailHTML(quizTitle, primaryStyle, reportContent);

  const result = await resend.emails.send({
    from: 'LEANGLE HR LAB <reports@leanglehrlab.com>',
    to: toEmail,
    subject: `Your ${quizTitle} Report — LEANGLE HR LAB`,
    html,
  });

  return result;
}

function buildEmailHTML(quizTitle, primaryStyle, reportContent) {
  const htmlBody = reportContent
    .split('\n')
    .map((line) => {
      if (line.startsWith('## '))
        return `<h2 style="color:#4A7FA5;font-family:Georgia,serif;font-size:17px;font-weight:400;letter-spacing:0.5px;border-bottom:1px solid #2A3A4D;padding-bottom:8px;margin-top:28px;margin-bottom:10px;">${line.slice(3)}</h2>`;
      if (line.match(/^\d\./))
        return `<p style="color:#C8CDD6;font-size:14px;line-height:1.75;padding-left:14px;border-left:2px solid #4A7FA5;margin-bottom:8px;margin-left:4px;">${line}</p>`;
      if (line.startsWith('- ') || line.startsWith('• '))
        return `<p style="color:#C8CDD6;font-size:14px;line-height:1.65;margin-bottom:5px;">· ${line.slice(2)}</p>`;
      if (line.trim() === '')
        return '<div style="height:6px;"></div>';
      return `<p style="color:#C8CDD6;font-size:14px;line-height:1.75;margin-bottom:8px;">${line}</p>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${quizTitle} Report</title>
</head>
<body style="margin:0;padding:0;background-color:#0F1823;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Logo -->
    <div style="text-align:center;padding-bottom:28px;border-bottom:1px solid #2A3A4D;margin-bottom:32px;">
      <div style="font-size:24px;font-weight:300;letter-spacing:10px;color:#FFFFFF;font-family:Georgia,serif;line-height:1.1;">LEANGLE</div>
      <div style="margin-top:6px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:11px;letter-spacing:5px;color:#4A7FA5;font-weight:600;">— HR LAB —</span>
      </div>
    </div>

    <!-- Report header -->
    <div style="background:#1A2535;border:1px solid rgba(74,127,165,0.3);border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
      <div style="font-size:10px;color:#4A7FA5;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">Your Premium Report</div>
      <h1 style="color:#FFFFFF;font-size:22px;font-weight:400;font-family:Georgia,serif;margin:0 0 8px 0;letter-spacing:0.5px;">${quizTitle}</h1>
      <div style="color:#C8CDD6;font-size:14px;">Primary style: <strong style="color:#4A7FA5;">${primaryStyle}</strong></div>
    </div>

    <!-- Report body -->
    <div style="background:#1A2535;border:1px solid #2A3A4D;border-radius:12px;padding:32px;">
      ${htmlBody}
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:36px;padding-top:24px;border-top:1px solid #2A3A4D;">
      <div style="font-size:18px;font-weight:300;letter-spacing:6px;color:#FFFFFF;font-family:Georgia,serif;">LEANGLE</div>
      <div style="margin-top:4px;margin-bottom:16px;">
        <span style="font-size:9px;letter-spacing:4px;color:#4A7FA5;font-weight:600;">— HR LAB —</span>
      </div>
      <p style="color:#6B7A8D;font-size:12px;line-height:1.7;margin:0;">
        You received this report because you completed an assessment at LEANGLE HR LAB.<br>
        Questions? Contact <a href="mailto:support@leanglehrlab.com" style="color:#4A7FA5;text-decoration:none;">support@leanglehrlab.com</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}
