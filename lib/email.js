// lib/email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(toEmail, quizTitle, primaryStyle, reportContent, pdfBuffer = null, printPdfBuffer = null, leaderName = '') {
  const html = buildEmailHTML(quizTitle, primaryStyle, reportContent);
  
  const emailData = {
    from: 'LEANGLE HR LAB <reports@leanglehrlab.com>',
    to: toEmail,
    subject: `Your ${quizTitle} Report — LEANGLE HR LAB`,
    html,
  };

  // Attach PDFs if provided
  const attachments = [];
  if (pdfBuffer) {
    attachments.push({
      filename: `LEANGLE-${primaryStyle.replace(/[\s+]/g, '-')}-Report.pdf`,
      content: pdfBuffer.toString('base64'),
      type: 'application/pdf',
    });
  }
  if (printPdfBuffer) {
    attachments.push({
      filename: `LEANGLE-${primaryStyle.replace(/[\s+]/g, '-')}-Report-Print.pdf`,
      content: printPdfBuffer.toString('base64'),
      type: 'application/pdf',
    });
  }
  if (attachments.length > 0) emailData.attachments = attachments;

  return resend.emails.send(emailData);
}

function cleanText(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^#+\s+/, '')
    .replace(/^---+$/, '')
    .trim();
}

function buildEmailHTML(quizTitle, primaryStyle, reportContent) {
  const lines = reportContent.split('\n');
  let html = '';
  let inWeekBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw || raw.match(/^[-=]{2,}$/)) continue;

    // Section heading
    if (raw.startsWith('## ') || raw.startsWith('### ')) {
      const title = raw.replace(/^#+\s+/, '');
      const isMantra = title.toLowerCase().includes('mantra');
      const isQuestion = title.toLowerCase().includes('question') || title.toLowerCase().includes('pregunta');

      if (isMantra || isQuestion) {
        html += `<tr><td style="padding:24px 0 8px 0;">
          <div style="font-size:11px;font-weight:700;color:#4A7FA5;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;border-bottom:2px solid #4A7FA5;padding-bottom:6px;margin-bottom:12px;">${title}</div>
        </td></tr>`;
      } else {
        html += `<tr><td style="padding:20px 0 8px 0;">
          <div style="font-size:11px;font-weight:700;color:#4A7FA5;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;border-bottom:2px solid #4A7FA5;padding-bottom:6px;margin-bottom:12px;">${title}</div>
        </td></tr>`;
      }
      continue;
    }

    // Week blocks for action plan
    if (raw.match(/^(Week|Semana)\s+\d+:/i)) {
      const weekTitle = cleanText(raw);
      // Look ahead for Action and Why it matters
      let action = '';
      let why = '';
      let j = i + 1;
      while (j < lines.length && j < i + 5) {
        const next = lines[j].trim();
        if (next.match(/^(Action|Acción):/i)) action = cleanText(next.replace(/^(Action|Acción):\s*/i, ''));
        if (next.match(/^(Why it matters|Por qué importa):/i)) why = cleanText(next.replace(/^(Why it matters|Por qué importa):\s*/i, ''));
        if (next.startsWith('## ') || next.match(/^(Week|Semana)\s+\d+:/i)) break;
        j++;
      }
      i = j - 1;

      html += `<tr><td style="padding:8px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1e3a4a;border-left:3px solid #4A7FA5;border-radius:0 6px 6px 0;">
          <tr><td style="padding:14px 16px;">
            <div style="font-size:13px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;margin-bottom:6px;">${weekTitle}</div>
            ${action ? `<div style="font-size:13px;color:#e0e8f0;font-family:Arial,sans-serif;line-height:1.6;margin-bottom:4px;"><span style="color:#4A7FA5;font-weight:700;">Action: </span>${action}</div>` : ''}
            ${why ? `<div style="font-size:12px;color:#a8c0d0;font-family:Arial,sans-serif;line-height:1.6;font-style:italic;">${why}</div>` : ''}
          </td></tr>
        </table>
      </td></tr>`;
      continue;
    }

    // Superpower blocks
    if (raw.match(/^Superpower\s+\d+:|^Superpoder\s+\d+:/i)) {
      const spTitle = cleanText(raw);
      html += `<tr><td style="padding:6px 0 2px 0;">
        <div style="font-size:13px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${spTitle}</div>
      </td></tr>`;
      continue;
    }

    // Action / Why it matters lines (standalone)
    if (raw.match(/^(Action|Acción):/i)) {
      const text = cleanText(raw.replace(/^(Action|Acción):\s*/i, ''));
      html += `<tr><td style="padding:3px 0;font-size:13px;color:#e0e8f0;font-family:Arial,sans-serif;line-height:1.6;">
        <span style="color:#4A7FA5;font-weight:700;">Action: </span>${text}
      </td></tr>`;
      continue;
    }
    if (raw.match(/^(Why it matters|Por qué importa):/i)) {
      const text = cleanText(raw.replace(/^(Why it matters|Por qué importa):\s*/i, ''));
      html += `<tr><td style="padding:3px 0 8px 0;font-size:12px;color:#a8c0d0;font-family:Arial,sans-serif;line-height:1.6;font-style:italic;">${text}</td></tr>`;
      continue;
    }

    // Numbered list items
    if (raw.match(/^\d+\.\s/)) {
      const num = raw.match(/^(\d+)/)[1];
      const text = cleanText(raw.replace(/^\d+\.\s*/, ''));
      html += `<tr><td style="padding:5px 0;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="28" style="vertical-align:top;padding-top:1px;">
            <div style="width:22px;height:22px;background:#4A7FA5;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${num}</div>
          </td>
          <td style="padding-left:10px;font-size:14px;color:#e8eef4;font-family:Arial,sans-serif;line-height:1.7;">${text}</td>
        </tr></table>
      </td></tr>`;
      continue;
    }

    // Bullet points
    if (raw.startsWith('- ') || raw.startsWith('• ') || raw.startsWith('· ')) {
      const text = cleanText(raw.replace(/^[-•·]\s*/, ''));
      html += `<tr><td style="padding:4px 0;font-size:14px;color:#e8eef4;font-family:Arial,sans-serif;line-height:1.7;">
        <span style="color:#4A7FA5;margin-right:8px;font-weight:700;">›</span>${text}
      </td></tr>`;
      continue;
    }

    // Check if this is a mantra/question line (after those headings)
    const prevLines = html.toLowerCase();
    const isAfterMantra = prevLines.lastIndexOf('mantra') > prevLines.lastIndexOf('## your');
    const isAfterQuestion = prevLines.lastIndexOf('question to carry') > -1 || prevLines.lastIndexOf('pregunta') > -1;

    if (isAfterMantra && raw.length > 0 && raw.length < 200) {
      html += `<tr><td style="padding:8px 0;">
        <div style="background:#1e3a4a;border-left:4px solid #4A7FA5;border-radius:0 8px 8px 0;padding:18px 20px;">
          <div style="font-size:16px;font-style:italic;color:#ffffff;font-family:Georgia,serif;line-height:1.6;">"${cleanText(raw)}"</div>
        </div>
      </td></tr>`;
      continue;
    }

    // Regular paragraph
    const cleaned = cleanText(raw);
    if (cleaned) {
      html += `<tr><td style="padding:4px 0;font-size:14px;color:#e8eef4;font-family:Arial,sans-serif;line-height:1.8;">${cleaned}</td></tr>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your ${quizTitle} Report — LEANGLE HR LAB</title></head>
<body style="margin:0;padding:0;background-color:#0a1520;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a1520;">
<tr><td align="center" style="padding:32px 16px;">
<table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;">

  <!-- LOGO -->
  <tr><td style="padding:28px 0 20px 0;text-align:center;border-bottom:1px solid #2A3A4D;">
    <div style="font-size:28px;font-weight:300;letter-spacing:12px;color:#ffffff;font-family:Georgia,serif;">LEANGLE</div>
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:8px;"><tr>
      <td><div style="width:36px;height:1px;background:#4A7FA5;"></div></td>
      <td style="padding:0 10px;font-size:10px;letter-spacing:5px;color:#4A7FA5;font-family:Arial,sans-serif;font-weight:700;">HR LAB</td>
      <td><div style="width:36px;height:1px;background:#4A7FA5;"></div></td>
    </tr></table>
  </td></tr>

  <!-- HEADER CARD -->
  <tr><td style="padding:20px 0 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#132030;border:1px solid #4A7FA5;border-radius:10px;">
    <tr><td style="padding:28px 32px;text-align:center;">
      <div style="font-size:10px;color:#4A7FA5;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;margin-bottom:12px;">PREMIUM LEADERSHIP REPORT</div>
      <div style="font-size:22px;font-weight:400;color:#ffffff;font-family:Georgia,serif;letter-spacing:0.5px;margin-bottom:12px;">${quizTitle}</div>
      <div style="display:inline-block;background:rgba(74,127,165,0.2);border:1px solid #4A7FA5;border-radius:99px;padding:6px 20px;">
        <span style="font-size:14px;color:#4A7FA5;font-family:Arial,sans-serif;font-weight:700;">${primaryStyle}</span>
      </div>
    </td></tr>
    </table>
  </td></tr>

  <!-- REPORT BODY -->
  <tr><td style="padding:16px 0 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#132030;border:1px solid #2A3A4D;border-radius:10px;">
    <tr><td style="padding:32px 32px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${html}
      </table>
    </td></tr>
    </table>
  </td></tr>

  <!-- RESEND LINK -->
  <tr><td style="padding:16px 0 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#132030;border:1px solid #2A3A4D;border-radius:10px;">
    <tr><td style="padding:18px 24px;text-align:center;">
      <p style="color:#8a9bb0;font-size:13px;font-family:Arial,sans-serif;margin:0 0 6px 0;">Didn't receive this correctly or want to share it?</p>
      <a href="https://leangle-hr-lab-assessments.vercel.app/resend-report" style="color:#4A7FA5;font-size:13px;font-family:Arial,sans-serif;font-weight:700;text-decoration:none;">Resend my report →</a>
    </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:28px 0;text-align:center;">
    <div style="font-size:16px;font-weight:300;letter-spacing:8px;color:#ffffff;font-family:Georgia,serif;margin-bottom:6px;">LEANGLE</div>
    <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
      <td><div style="width:24px;height:1px;background:#4A7FA5;"></div></td>
      <td style="padding:0 8px;font-size:9px;letter-spacing:4px;color:#4A7FA5;font-family:Arial,sans-serif;font-weight:700;">HR LAB</td>
      <td><div style="width:24px;height:1px;background:#4A7FA5;"></div></td>
    </tr></table>
    <p style="color:#6B7A8D;font-size:12px;font-family:Arial,sans-serif;line-height:1.7;margin:14px 0 0 0;">
      Questions? <a href="mailto:support@leanglehrlab.com" style="color:#4A7FA5;text-decoration:none;">support@leanglehrlab.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}
