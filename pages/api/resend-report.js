import { Resend } from 'resend';
import { generatePDF } from '../../lib/pdf';
import { generateReport } from '../../lib/report';

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const paidSessions = sessions.data
      .filter(s => s.customer_email?.toLowerCase() === email.toLowerCase() && s.payment_status === 'paid')
      .sort((a, b) => b.created - a.created);
    
    if (!paidSessions.length) return res.status(404).json({ error: 'No paid report' });

    const session = paidSessions[0];
    const quizTitle = session.metadata?.quizTitle || 'Leadership Assessment';
    const primaryStyle = session.metadata?.primaryStyle || 'Leader';
    let leaderName = session.metadata?.leaderName;
    
    if (!leaderName || leaderName.trim() === '' || leaderName.includes('@')) {
      leaderName = 'Leader';
    }

    console.log(`Report: ${primaryStyle} for ${leaderName} (${email})`);

    const reportContent = await generateReport(quizTitle, primaryStyle);
    const pdfBuffer = await generatePDF(quizTitle, primaryStyle, reportContent, leaderName);
    
    await resend.emails.send({
      from: 'LEANGLE HR LAB <noreply@leanglehrlab.com>',
      to: email,
      subject: `Your ${primaryStyle} Leadership Assessment Report is Ready`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #0B1F3A; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0B1F3A 0%, #2C5F82 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px; }
    .content h2 { color: #2C5F82; margin-top: 0; }
    .content ul { margin: 15px 0; padding-left: 20px; }
    .content li { margin: 8px 0; }
    .cta { background: #C9A84C; color: white; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
    .cta a { color: white; text-decoration: none; font-weight: bold; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
    .badge { display: inline-block; background: #C9A84C; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Your Leadership Assessment is Ready</h1>
    <p>A Personalized ${primaryStyle} Leadership Report</p>
  </div>

  <div class="content">
    <p>Hello ${leaderName},</p>
    <p>Congratulations! Your comprehensive leadership assessment report is now ready for download.</p>
    
    <p><strong>Your Assessment Result:</strong></p>
    <p style="text-align: center;"><span class="badge">${primaryStyle}</span></p>
    
    <p><strong>Your Report Includes:</strong></p>
    <ul>
      <li>Your Unique Leadership DNA</li>
      <li>How Others Experience You</li>
      <li>Your 3 Leadership Superpowers</li>
      <li>Growth Areas and Derailers</li>
      <li>Communication and Influence Style</li>
      <li>Team Dynamics and Impact</li>
      <li>Leadership Blind Spots</li>
      <li>Your Personalized 30-Day Action Plan</li>
      <li>Recommended Books for ${primaryStyle} Leaders</li>
    </ul>

    <p><strong>Next Steps:</strong></p>
    <ol>
      <li>Review your complete report in the attached PDF</li>
      <li>Share key insights with your coach, manager, or mentor</li>
      <li>Start implementing your 30-Day Action Plan</li>
      <li>Track your progress and celebrate your wins</li>
    </ol>

    <p style="background: #E8E0D0; padding: 15px; border-left: 4px solid #C9A84C; border-radius: 4px;">
      <strong>Pro Tip:</strong> Reference your blind spots and growth edges regularly. The most powerful transformations happen when we're aware of what we don't see about ourselves.
    </p>
  </div>

  <div class="content" style="text-align: center;">
    <p><strong>Questions or Need Support?</strong></p>
    <p>Reply to this email or visit us at leanglehrlab.com</p>
  </div>

  <div class="footer">
    <p>© 2026 LEANGLE HR LAB | Transforming Leaders, Building Excellence</p>
  </div>
</body>
</html>`,
      attachments: [{
        filename: `${leaderName}-${primaryStyle}-Leadership-Report.pdf`,
        content: pdfBuffer,
      }],
    });

    res.status(200).json({ success: true, style: primaryStyle, name: leaderName });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
