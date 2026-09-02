import { useState } from 'react';

const B = { navy: '#0B1F3A', navyL: '#1a2f4a', navyD: '#050e1a', steel: '#2C5F82', silver: '#c5cfd6', muted: '#8b95a2', white: '#fff', border: '#2a3f56' };

const QUIZZES = [
  { id: 'visionary', icon: '🎯', title: 'Visionary Leadership', subtitle: 'How you see possibilities and inspire others' },
  { id: 'analyzer', icon: '📊', title: 'Analytical Leadership', subtitle: 'How you think through problems systematically' },
  { id: 'coach', icon: '🤝', title: 'Coach Leadership', subtitle: 'How you develop people and build trust' },
  { id: 'driver', icon: '⚡', title: 'Driver Leadership', subtitle: 'How you move fast and deliver results' },
  { id: 'supporter', icon: '🌟', title: 'Supporter Leadership', subtitle: 'How you collaborate and bring people together' },
];

const QUIZ_DEFS = {
  visionary: { title: 'Visionary Leadership', questions: [...] },
  analyzer: { title: 'Analytical Leadership', questions: [...] },
  coach: { title: 'Coach Leadership', questions: [...] },
  driver: { title: 'Driver Leadership', questions: [...] },
  supporter: { title: 'Supporter Leadership', questions: [...] },
};

export default function Page() {
  const [screen, setScreen] = useState('home');
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [email, setEmail] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [paying, setPaying] = useState(false);

  const activeQuiz = QUIZ_DEFS[activeQuizId];
  const progress = activeQuizId && qIndex > 0 ? Math.round((qIndex / activeQuiz.questions.length) * 100) : 0;

  const startQuiz = (quiz) => {
    setActiveQuizId(quiz.id);
    setQIndex(0);
    setScores({});
    setScreen('quiz');
  };

  const answer = (style) => {
    setScores(s => ({ ...s, [style]: (s[style] || 0) + 1 }));
    if (qIndex + 1 < activeQuiz.questions.length) {
      setQIndex(qIndex + 1);
    } else {
      setScreen('results');
    }
  };

  const handlePay = async () => {
    if (!email || !leaderName.trim()) return;
    setPaying(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          quizId: activeQuizId,
          quizTitle: activeQuiz.title,
          primaryStyle: Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0],
          scores,
          leaderName
        })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setPaying(false);
    }
  };

  const primary = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
  const sd = primary ? { tagline: 'Your core leadership identity', summary: 'Your assessment reveals your natural leadership approach.', strengths: ['Strength 1', 'Strength 2', 'Strength 3'], blindspots: ['Watch out 1', 'Watch out 2'] } : null;

  if (screen === 'home') {
    return (
      <div style={{ minHeight: '100vh', background: B.navyD, fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ borderBottom: `1px solid ${B.border}`, padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: B.steel, letterSpacing: 4, fontWeight: 600 }}>LEANGLE HR LAB</div>
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
          <h1 style={{ color: B.white, fontSize: 28, fontWeight: 400, fontFamily: 'Georgia,serif', marginBottom: 10 }}>Leadership Assessments</h1>
          <p style={{ color: B.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 30 }}>Discover your leadership style and get personalized insights.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {QUIZZES.map(q => (
              <button key={q.id} onClick={() => startQuiz(q)} style={{ background: B.navy, border: `1px solid ${B.border}`, borderRadius: 10, padding: '18px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div><div style={{ color: B.white, fontSize: 16, fontWeight: 500 }}>{q.icon} {q.title}</div><div style={{ color: B.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>{q.subtitle}</div></div>
                <div style={{ color: B.steel, fontSize: 20 }}>→</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'quiz' && activeQuiz) {
    const q = activeQuiz.questions[qIndex];
    return (
      <div style={{ minHeight: '100vh', background: B.navyD, fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ borderBottom: `1px solid ${B.border}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: B.muted, fontSize: 13, cursor: 'pointer' }}>← Back</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: B.steel, letterSpacing: 4, fontWeight: 600 }}>LEANGLE HR LAB</div>
            <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>{activeQuiz.title}</div>
          </div>
          <div style={{ fontSize: 12, color: B.muted }}>{qIndex + 1}/{activeQuiz.questions.length}</div>
        </div>
        <div style={{ height: 3, background: B.border }}>
          <div style={{ height: '100%', width: `${progress}%`, background: B.steel, transition: 'width 0.3s' }} />
        </div>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
          <p style={{ color: B.muted, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Question {qIndex + 1}</p>
          <h2 style={{ color: B.white, fontSize: 20, fontWeight: 400, lineHeight: 1.45, marginBottom: 28, fontFamily: 'Georgia,serif' }}>{q.q}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => answer(opt.style)} style={{ background: B.navy, border: `1px solid ${B.border}`, borderRadius: 10, padding: '16px 18px', textAlign: 'left', color: B.silver, fontSize: 14, cursor: 'pointer', lineHeight: 1.5 }} onMouseEnter={e => { e.currentTarget.style.borderColor = B.steel; e.currentTarget.style.color = B.white; e.currentTarget.style.background = B.navyL; }} onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.color = B.silver; e.currentTarget.style.background = B.navy; }}>{opt.text}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'results' && sd && primary) {
    return (
      <div style={{ minHeight: '100vh', background: B.navyD, fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ borderBottom: `1px solid ${B.border}`, padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: B.steel, letterSpacing: 4, fontWeight: 600 }}>LEANGLE HR LAB</div>
        </div>
        <div style={{ maxWidth: 580, margin: '0 auto', padding: '36px 20px 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ color: B.muted, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your {activeQuiz.title} Result</p>
            <h1 style={{ color: B.white, fontSize: 30, fontWeight: 400, fontFamily: 'Georgia,serif', marginBottom: 6 }}>{primary}</h1>
            <p style={{ color: B.steel, fontSize: 14, fontStyle: 'italic' }}>"{sd.tagline}"</p>
          </div>

          <div style={{ background: '#4A7FA518', border: '1px solid #4A7FA544', borderRadius: 14, padding: '24px 20px', marginBottom: 16 }}>
            <p style={{ color: B.steel, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Unlock Your Full Report — $29</p>
            <p style={{ color: B.silver, fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>Get a personalised premium PDF including your Leadership DNA, 30-Day Action Plan, Team Impact Analysis, and Personalized Book Recommendations.</p>

            <div style={{ marginTop: 18 }}>
              <input type="text" value={leaderName} onChange={e => setLeaderName(e.target.value)} placeholder="Your full name" style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${B.border}`, background: B.navyD, color: B.white, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${B.border}`, background: B.navyD, color: B.white, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
              <button onClick={handlePay} disabled={paying || !email || !leaderName.trim()} style={{ width: '100%', padding: '14px', borderRadius: 9, border: 'none', fontSize: 15, fontWeight: 700, cursor: paying || !email || !leaderName.trim() ? 'not-allowed' : 'pointer', background: paying || !email || !leaderName.trim() ? B.border : B.steel, color: paying || !email || !leaderName.trim() ? B.muted : B.white }}>{paying ? 'Redirecting to secure checkout…' : 'Get Full Report — $29'}</button>
              <p style={{ textAlign: 'center', color: B.muted, fontSize: 11, marginTop: 8 }}>Secure checkout · One-time payment</p>
            </div>
          </div>

          <button onClick={() => setScreen('home')} style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: B.muted, fontSize: 12, cursor: 'pointer' }}>← Back to all assessments</button>
        </div>
      </div>
    );
  }

  return null;
}
