// pages/success.js
// Shown after successful Stripe payment.
// Tells the customer their report is on its way.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const B = {
  navyD: '#0F1823',
  navyL: '#243040',
  gold: '#B8965A',
  silver: '#C8CDD6',
  white: '#FFFFFF',
  muted: '#6B7A8D',
  border: '#2A3A4D',
};

function Logo() {
  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: 8, color: B.white, fontFamily: 'Georgia, serif' }}>
        LEANGLE
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2 }}>
        <div style={{ height: 1, width: 28, background: B.gold }} />
        <div style={{ fontSize: 10, letterSpacing: 5, color: B.silver, fontFamily: 'system-ui' }}>HR LAB</div>
        <div style={{ height: 1, width: 28, background: B.gold }} />
      </div>
    </div>
  );
}

export default function SuccessPage() {
  const router = useRouter();
  const { quiz } = router.query;
  const [dots, setDots] = useState('');

  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: B.navyD, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <Logo />

        <div style={{ marginTop: 48, background: B.navyL, border: `1px solid ${B.gold}55`, borderRadius: 20, padding: '40px 32px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <h1 style={{ color: B.white, fontSize: 24, fontWeight: 400, fontFamily: 'Georgia, serif', marginBottom: 10, letterSpacing: 0.5 }}>
            Payment confirmed
          </h1>
          <p style={{ color: B.silver, fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
            Your personalised report is being generated{dots}
          </p>
          <p style={{ color: B.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
            It will arrive in your inbox within the next few minutes. Check your spam folder if you don't see it.
          </p>

          <div style={{ background: `${B.gold}15`, border: `1px solid ${B.gold}44`, borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
            <p style={{ color: B.gold, fontSize: 13, fontWeight: 600, margin: 0 }}>
              📬 Report sent to your email
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            style={{ background: B.gold, color: B.navyD, border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.3 }}
          >
            Try Another Quiz →
          </button>
        </div>

        <p style={{ color: B.muted, fontSize: 12, marginTop: 20 }}>
          Questions? Email{' '}
          <a href="mailto:support@leangle.com" style={{ color: B.gold, textDecoration: 'none' }}>
            support@leangle.com
          </a>
        </p>
      </div>
    </div>
  );
}
