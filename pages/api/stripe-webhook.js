// pages/api/stripe-webhook.js
// Handles Stripe payment events.
// Includes idempotency check to prevent duplicate emails.

import Stripe from 'stripe';
import { buffer } from 'micro';
import { generateReport } from '../../lib/report';
import { sendReportEmail } from '../../lib/email';
import { generatePDF } from '../../lib/pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const processedSessions = new Set();

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;

    // ── Idempotency check — skip if already processed ──
    if (processedSessions.has(sessionId)) {
      console.log(`Skipping duplicate webhook for session: ${sessionId}`);
      return res.status(200).json({ received: true, skipped: true });
    }

    processedSessions.add(sessionId);
    setTimeout(() => processedSessions.delete(sessionId), 24 * 60 * 60 * 1000);

    const { email, quizTitle, primaryStyle, scores, lang = 'en' } = session.metadata;
    const leaderName = session.customer_details?.name || '';

    try {
      console.log(`Processing payment for ${email} — ${quizTitle} (${primaryStyle})`);
      const parsedScores = scores ? JSON.parse(scores) : {};

      // Generate AI report text
      const reportText = await generateReport(quizTitle, primaryStyle, parsedScores, lang);

      // Generate premium PDF (dark version)
      const pdfBuffer = await generatePDF(quizTitle, primaryStyle, reportText, leaderName);

      // Generate print-friendly PDF
      const printPdfBuffer = await generatePDF(quizTitle, primaryStyle, reportText, leaderName, true);

      // Send email with both PDFs attached
      await sendReportEmail(email, quizTitle, primaryStyle, reportText, pdfBuffer, printPdfBuffer, leaderName);

      console.log(`Report + PDFs sent to ${email}`);
    } catch (err) {
      console.error('Report error:', err.message);
      processedSessions.delete(sessionId);
    }
  }

  return res.status(200).json({ received: true });
}
