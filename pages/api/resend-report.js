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
    
    if (!leaderName || leaderName.trim() === '') {
      leaderName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    }

    console.log(`Report: ${primaryStyle} for ${leaderName}`);

    const reportContent = await generateReport(quizTitle, primaryStyle);
    const pdfBuffer = await generatePDF(quizTitle, primaryStyle, reportContent, leaderName);
    
    const emailBody = `Hi ${leaderName},

Your personalized ${primaryStyle} Leadership Assessment Report is ready!

This comprehensive report includes:
- Your Leadership DNA
- How Others Experience You
- Your 3 Leadership Superpowers
- Growth Areas and Derailers
- Communication and Influence Style
- Team Dynamics and Impact
- Leadership Blind Spots
- Your 30-Day Action Plan

Next Steps:
1. Review your report carefully
2. Share with your coach or manager
3. Start implementing your 30-Day Action Plan
4. Track your progress and celebrate wins

Questions? Reply to this email.

Best regards,
LEANGLE HR LAB Team
www.leanglehrlab.com`;

    await resend.emails.send({
      from: 'LEANGLE HR LAB <noreply@leanglehrlab.com>',
      to: email,
      subject: `Your ${primaryStyle} Leadership Assessment Report`,
      text: emailBody,
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
