// pages/api/stripe-webhook.js
// Listens for Stripe payment events.
// When a payment succeeds, generates the AI report and emails it.

import Stripe from 'stripe';
import { buffer } from 'micro';
import { generateReport } from '../../lib/report';
import { sendReportEmail } from '../../lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Required: disable Next.js body parsing so Stripe signature verification works
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { email, quizTitle, primaryStyle, scores } = session.metadata;

    try {
      console.log(`Generating report for ${email} — ${quizTitle} (${primaryStyle})`);

      const parsedScores = scores ? JSON.parse(scores) : {};
      const report = await generateReport(quizTitle, primaryStyle, parsedScores);
      await sendReportEmail(email, quizTitle, primaryStyle, report);

      console.log(`Report sent to ${email}`);
    } catch (err) {
      console.error('Report/email error:', err.message);
      // Return 200 anyway — Stripe will retry on non-2xx
      // Log to your monitoring tool here if you have one
    }
  }

  return res.status(200).json({ received: true });
}
