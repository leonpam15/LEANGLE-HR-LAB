// pages/api/create-checkout.js
// Creates a Stripe Checkout session and returns the redirect URL.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, quizId, quizTitle, primaryStyle, scores } = req.body;

  if (!email || !quizId || !primaryStyle) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}&quiz=${quizId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#${quizId}`,
      metadata: {
        quizId,
        quizTitle,
        primaryStyle,
        email,
        scores: JSON.stringify(scores || {}),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
