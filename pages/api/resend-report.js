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
    
    if (!paidSessions.length) return res.status(404).json({ error: 'No paid report found' });

    const session = paidSessions[0];
    const quizTitle = session.metadata?.quizTitle || 'Leadership Assessment';
    const primaryStyle = session.metadata?.primaryStyle || 'Leader';
    const leaderName = session.metadata?.leaderName || '';

    console.log(`Generating ${primaryStyle} report for ${email}`);

    const reportContent = await generateReport(quizTitle, primaryStyle);
    const pdfBuffer = await generatePDF(quizTitle, primaryStyle, reportContent, leaderName);
    
    await resend.emails.send({
      from: 'LEANGLE HR LAB <noreply@leanglehrlab.com>',
      to: email,
      subject: `Your ${primaryStyle} Leadership Assessment`,
      html: `<p>Your ${primaryStyle} assessment is attached.</p>`,
      attachments: [{
        filename: `${primaryStyle}-Report.pdf`,
        content: pdfBuffer,
      }],
    });

    res.status(200).json({ success: true, style: primaryStyle });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
