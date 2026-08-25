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
    // Search for paid session
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    console.log(`Found ${sessions.data.length} sessions, looking for ${email}`);

    const session = sessions.data.find(s => {
      const emailMatch = s.customer_email === email || 
                         s.customer_details?.email === email;
      const paid = s.payment_status === 'paid';
      const hasMeta = s.metadata?.quizTitle && s.metadata?.primaryStyle;
      console.log(`Session ${s.id}: email=${s.customer_email}, paid=${paid}, hasMeta=${hasMeta}`);
      return emailMatch && paid && hasMeta;
    });

    if (!session) {
      console.log('No matching session found');
      return res.status(404).json({ error: 'No paid report found for this email. Please check your email address.' });
    }

    console.log(`Found session: ${session.id}`);
    const { quizTitle, primaryStyle, scores } = session.metadata;
    const leaderName = session.customer_details?.name || '';
    const parsedScores = scores ? JSON.parse(scores) : {};

    console.log(`Generating report for ${primaryStyle} - ${quizTitle}`);
    const reportText = await generateReport(quizTitle, primaryStyle, parsedScores);
    
    console.log('Generating PDF...');
    const pdfBuffer = await generatePDF(quizTitle, primaryStyle, reportText, leaderName);
    
    console.log('Sending email...');
    await sendReportEmail(email, quizTitle, primaryStyle, reportText, pdfBuffer, leaderName);

    console.log('Done!');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
}
// v2
