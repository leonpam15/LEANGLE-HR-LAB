import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, quizId, quizTitle, primaryStyle, scores } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price: process.env.STRIPE_PRICE_ID || 'price_1TlEwTISVitL14V0dJlFqjTt',
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/`,
      metadata: { email, quizId, quizTitle, primaryStyle, scores: JSON.stringify(scores) },
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

