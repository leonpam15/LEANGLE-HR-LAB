// pages/api/resend-report.js
import Stripe from 'stripe';
import { generateReport } from '../lib/report';
import { sendReportEmail } from '../lib/email';
import { generatePDF } from '../lib/pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: { responseLimit: false },
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 20 });

    const session = sessions.data.find(s =>
      (s.customer_email === email || s.customer_details?.email === email) &&
      s.payment_status === 'paid' &&
      s.metadata?.quizTitle &&
      s.metadata?.primaryStyle
    );

    if (!session) {
      return res.status(404).json({ error: 'No paid report found for this email' });
    }

    const { quizTitle, primaryStyle, scores } = session.metadata;
    const leaderName = session.customer_details?.name || '';
    const parsedScores = scores ? JSON.parse(scores) : {};

    const reportText = await generateReport(quizTitle, primaryStyle, parsedScores);
    const pdfBuffer = await generatePDF(quizTitle, primaryStyle, reportText, leaderName);
    await sendReportEmail(email, quizTitle, primaryStyle, reportText, pdfBuffer, leaderName);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
