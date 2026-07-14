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

function parseReport(reportContent) {
  const sections = [];
  let currentSection = null;
  let currentItems = [];

  const lines = reportContent.split('\n');

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push({ title: currentSection, items: currentItems });
        currentItems = [];
      }
      currentSection = line.slice(3).trim();
    } else if (line.trim() !== '') {
      currentItems.push(line.trim());
    }
  }

  if (currentSection) {
    sections.push({ title: currentSection, items: currentItems });
  }

  return sections;
}

function buildEmailHTML(quizTitle, primaryStyle, reportContent) {
  const sections = parseReport(reportContent);

  const sectionsHTML = sections.map(section => {
    const itemsHTML = section.items.map(item => {
      if (item.match(/^\d\./)) {
        return `
          <tr>
            <td style="padding:8px 0;vertical-align:top;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="28" style="vertical-align:top;padding-top:2px;">
                    <div style="width:22px;height:22px;background:#4A7FA5;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#ffffff;font-family:system-ui;">${item[0]}</div>
                  </td>
                  <td style="padding-left:10px;color:#C8CDD6;font-size:14px;line-height:1.7;font-family:system-ui;">${item.slice(2).trim()}</td>
                </tr>
              </table>
            </td>
          </tr>`;
      } else if (item.startsWith('- ') || item.startsWith('• ') || item.startsWith('·')) {
        const text = item.replace(/^[-•·]\s*/, '');
        return `
          <tr>
            <td style="padding:5px 0;color:#C8CDD6;font-size:14px;line-height:1.6;font-family:system-ui;">
              <span style="color:#4A7FA5;margin-right:8px;">›</span>${text}
            </td>
          </tr>`;
      } else {
        return `
          <tr>
            <td style="padding:4px 0;color:#C8CDD6;font-size:14px;line-height:1.75;font-family:system-ui;">${item}</td>
          </tr>`;
      }
    }).join('');

    // Special styling for mantra section
    const isMantra = section.title.toLowerCase().includes('mantra') || section.title.toLowerCase().includes('mantra');
    if (isMantra) {
      return `
        <tr><td style="padding:8px 0 0 0;">
          <div style="background:#1A2535;border-left:4px solid #4A7FA5;border-radius:0 8px 8px 0;padding:20px 24px;margin-top:8px;">
            <div style="font-size:10px;color:#4A7FA5;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;font-family:system-ui;font-weight:600;">${section.title}</div>
            <div style="color:#ffffff;font-size:17px;font-style:italic;line-height:1.6;font-family:Georgia,serif;">"${section.items.join(' ')}"</div>
          </div>
        </td></tr>
        <tr><td style="padding:8px 0;"><div style="height:1px;background:#2A3A4D;"></div></td></tr>`;
    }

    return `
      <tr><td style="padding:8px 0 0 0;">
        <div style="margin-bottom:6px;">
          <span style="display:inline-block;font-size:10px;color:#4A7FA5;letter-spacing:2px;text-transform:uppercase;font-family:system-ui;font-weight:700;border-bottom:2px solid #4A7FA5;padding-bottom:4px;">${section.title}</span>
        </div>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px;">
          ${itemsHTML}
        </table>
      </td></tr>
      <tr><td style="padding:12px 0;"><div style="height:1px;background:#2A3A4D;"></div></td></tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${quizTitle} Report — LEANGLE HR LAB</title>
</head>
<body style="margin:0;padding:0;background-color:#0F1823;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0F1823;">
  <tr><td align="center" style="padding:32px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;">

      <!-- LOGO HEADER -->
      <tr><td style="background:#0F1823;padding:32px 0 24px 0;text-align:center;border-bottom:1px solid #2A3A4D;">
        <div style="font-size:26px;font-weight:300;letter-spacing:12px;color:#ffffff;font-family:Georgia,serif;line-height:1;">LEANGLE</div>
        <div style="margin-top:8px;display:flex;align-items:center;justify-content:center;">
          <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
            <td><div style="width:32px;height:1px;background:#4A7FA5;"></div></td>
            <td style="padding:0 10px;font-size:10px;letter-spacing:5px;color:#4A7FA5;font-family:system-ui;font-weight:600;">HR LAB</td>
            <td><div style="width:32px;height:1px;background:#4A7FA5;"></div></td>
          </tr></table>
        </div>
      </td></tr>

      <!-- REPORT HEADER CARD -->
      <tr><td style="padding:24px 0 0 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1A2535;border:1px solid rgba(74,127,165,0.3);border-radius:12px;">
          <tr><td style="padding:32px;text-align:center;">
            <div style="font-size:10px;color:#4A7FA5;letter-spacing:4px;text-transform:uppercase;font-family:system-ui;font-weight:600;margin-bottom:12px;">Premium Leadership Report</div>
            <div style="font-size:24px;font-weight:400;color:#ffffff;font-family:Georgia,serif;letter-spacing:0.5px;margin-bottom:8px;">${quizTitle}</div>
            <div style="display:inline-block;background:rgba(74,127,165,0.15);border:1px solid rgba(74,127,165,0.4);border-radius:99px;padding:6px 20px;margin-top:4px;">
              <span style="font-size:13px;color:#4A7FA5;font-family:system-ui;font-weight:600;">${primaryStyle}</span>
            </div>
          </td></tr>
        </table>
      </td></tr>

      <!-- REPORT BODY -->
      <tr><td style="padding:20px 0 0 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1A2535;border:1px solid #2A3A4D;border-radius:12px;">
          <tr><td style="padding:32px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              ${sectionsHTML}
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- RESEND LINK -->
      <tr><td style="padding:20px 0 0 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1A2535;border:1px solid #2A3A4D;border-radius:12px;">
          <tr><td style="padding:20px 24px;text-align:center;">
            <p style="color:#6B7A8D;font-size:13px;font-family:system-ui;margin:0 0 8px 0;">Didn't receive this correctly or want to share it?</p>
            <a href="https://leangle-hr-lab-assessments.vercel.app/resend-report" style="color:#4A7FA5;font-size:13px;font-family:system-ui;text-decoration:none;font-weight:600;">Resend my report →</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="padding:28px 0;text-align:center;border-top:1px solid #2A3A4D;margin-top:24px;">
        <div style="font-size:16px;font-weight:300;letter-spacing:8px;color:#ffffff;font-family:Georgia,serif;margin-bottom:6px;">LEANGLE</div>
        <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
          <td><div style="width:24px;height:1px;background:#4A7FA5;"></div></td>
          <td style="padding:0 8px;font-size:9px;letter-spacing:4px;color:#4A7FA5;font-family:system-ui;font-weight:600;">HR LAB</td>
          <td><div style="width:24px;height:1px;background:#4A7FA5;"></div></td>
        </tr></table>
        <p style="color:#6B7A8D;font-size:12px;font-family:system-ui;line-height:1.7;margin:16px 0 0 0;">
          You received this because you purchased a report at LEANGLE HR LAB.<br>
          Questions? <a href="mailto:support@leanglehrlab.com" style="color:#4A7FA5;text-decoration:none;">support@leanglehrlab.com</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
