// pages/api/stripe-webhook.js
import Stripe from 'stripe';
import { buffer } from 'micro';
import { generateReport } from '../../lib/report';
import { sendReportEmail } from '../../lib/email';
import { generatePDF } from '../../lib/pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const processedSessions = new Set();

export const config = { api: { bodyParser: false }, maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;

    if (processedSessions.has(sessionId)) {
      return res.status(200).json({ received: true, skipped: true });
    }
    processedSessions.add(sessionId);
    setTimeout(() => processedSessions.delete(sessionId), 24 * 60 * 60 * 1000);

    const { email, quizTitle, primaryStyle, scores } = session.metadata;
    const leaderName = session.customer_details?.name || '';

    try {
      const parsedScores = scores ? JSON.parse(scores) : {};
      const reportText = await generateReport(quizTitle, primaryStyle, parsedScores);
      const pdfBuffer = await generatePDF(quizTitle, primaryStyle, reportText, leaderName);
      await sendReportEmail(email, quizTitle, primaryStyle, reportText, pdfBuffer, leaderName);
      console.log(`Report sent to ${email}`);
    } catch (err) {
      console.error('Report error:', err.message);
      processedSessions.delete(sessionId);
    }
  }

  return res.status(200).json({ received: true });
}
